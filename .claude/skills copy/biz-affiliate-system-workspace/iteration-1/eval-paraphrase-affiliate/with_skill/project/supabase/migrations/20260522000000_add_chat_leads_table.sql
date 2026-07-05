-- add_chat_leads_table
--
-- chat_leads — leads tự động extract từ chatbot widget.
-- Thay namespace KV `chat-lead:{phone}` (Upstash Redis đã gỡ bỏ khỏi project).
-- Dedup theo phone, TTL 90 ngày qua pg_cron.
--
-- Idempotent: chạy lại an toàn.

CREATE TABLE IF NOT EXISTS chat_leads (
  phone       TEXT PRIMARY KEY,                        -- VN format 0xxxxxxxxx
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  interest    TEXT,
  source      TEXT NOT NULL DEFAULT 'chatbot',
  transcript  JSONB NOT NULL DEFAULT '[]'::jsonb,       -- 20 message gần nhất
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expire_at   TIMESTAMPTZ NOT NULL                      -- pg_cron job xoá rows < NOW()
);

CREATE INDEX IF NOT EXISTS chat_leads_expire_at_idx  ON chat_leads(expire_at);
CREATE INDEX IF NOT EXISTS chat_leads_created_at_idx ON chat_leads(created_at DESC);

-- RLS bật, không policy → deny-all từ anon/auth; service_role bypass.
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;

-- Cập nhật pg_cron cleanup job để xoá luôn chat_leads hết hạn.
-- cron.schedule upsert theo jobname → an toàn chạy lại.
SELECT cron.schedule(
  'cleanup-expired-leads',
  '0 3 * * *',
  $$
    DELETE FROM leads         WHERE expire_at < NOW();
    DELETE FROM webhook_dedup WHERE expire_at < NOW();
    DELETE FROM chat_leads    WHERE expire_at < NOW();
  $$
);
