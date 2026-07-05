-- 20260520000000_init_schema.sql
--
-- Schema khởi tạo Agent Camp: payment lead store + email campaigns + TTL cleanup qua pg_cron.
-- Áp dụng tự động qua Supabase CLI:  npm run db:push
--
-- Idempotent: chạy lại an toàn (IF NOT EXISTS guards).

-- =============================================================================
-- 1. EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- =============================================================================
-- 2. LEADS / ORDERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS leads (
  order_id        TEXT PRIMARY KEY,                  -- "DH123456"
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,                     -- VN format, digits 8-15
  email           TEXT NOT NULL,
  ticket          TEXT NOT NULL,                     -- "Agent Camp — Early Bird (16-20/05)" / ...
  amount          BIGINT NOT NULL,                   -- VND integer (vd 12868000)
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at         TIMESTAMPTZ,
  payment_record  JSONB,                             -- Sepay payload subset
  expire_at       TIMESTAMPTZ NOT NULL               -- pg_cron job xoá rows < NOW()
);

CREATE INDEX IF NOT EXISTS leads_phone_idx     ON leads(phone);
CREATE INDEX IF NOT EXISTS leads_status_idx    ON leads(status);
CREATE INDEX IF NOT EXISTS leads_expire_at_idx ON leads(expire_at);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_paid_at_idx   ON leads(paid_at DESC);

-- Webhook dedup — tránh Sepay retry duplicate processing
CREATE TABLE IF NOT EXISTS webhook_dedup (
  sepay_id        TEXT PRIMARY KEY,
  processed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expire_at       TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX IF NOT EXISTS webhook_dedup_expire_at_idx ON webhook_dedup(expire_at);

-- =============================================================================
-- 3. CAMPAIGNS — email marketing
-- =============================================================================

CREATE TABLE IF NOT EXISTS campaigns (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,                        -- "Khuyến mãi Tết 2026"
  subject          TEXT NOT NULL,
  body_html        TEXT NOT NULL,
  body_text        TEXT NOT NULL DEFAULT '',
  audience_kind    TEXT NOT NULL CHECK (audience_kind IN ('all', 'paid', 'pending', 'last_days')),
  audience_days    INTEGER,                              -- chỉ dùng khi audience_kind='last_days' (7/30/90)
  recipient_count  INTEGER NOT NULL DEFAULT 0,
  success_count    INTEGER NOT NULL DEFAULT 0,
  fail_count       INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'sending', 'sent', 'failed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS campaigns_created_at_idx ON campaigns(created_at DESC);

CREATE TABLE IF NOT EXISTS campaign_sends (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id   UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_order_id TEXT,
  email         TEXT NOT NULL,
  name          TEXT,
  status        TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
  error         TEXT,
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS campaign_sends_campaign_idx ON campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_sends_email_idx    ON campaign_sends(email);

-- =============================================================================
-- 4. ROW-LEVEL SECURITY — deny anon/auth; service_role bypass
-- =============================================================================

ALTER TABLE leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_dedup  ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns      ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_sends ENABLE ROW LEVEL SECURITY;

-- Không tạo policy nào → default DENY ALL từ anon/auth.

-- =============================================================================
-- 5. pg_cron — daily cleanup TTL (03:00 UTC = 10:00 VN)
-- =============================================================================

DO $$
DECLARE job_id BIGINT;
BEGIN
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'cleanup-expired-leads';
  IF job_id IS NOT NULL THEN
    PERFORM cron.unschedule(job_id);
  END IF;
END $$;

SELECT cron.schedule(
  'cleanup-expired-leads',
  '0 3 * * *',
  $$
    DELETE FROM leads          WHERE expire_at < NOW();
    DELETE FROM webhook_dedup  WHERE expire_at < NOW();
  $$
);

-- =============================================================================
-- 6. VERIFY
-- =============================================================================

SELECT 'leads'          AS table_name, COUNT(*) FROM leads
UNION ALL SELECT 'webhook_dedup',  COUNT(*) FROM webhook_dedup
UNION ALL SELECT 'campaigns',      COUNT(*) FROM campaigns
UNION ALL SELECT 'campaign_sends', COUNT(*) FROM campaign_sends;

SELECT jobname, schedule FROM cron.job WHERE jobname = 'cleanup-expired-leads';
