# BIZ.MKT.OS — CRM + Content Manager trên Supabase + MCP server

> Trạng thái: **PLAN (chưa build)** — chờ duyệt. Ngày 2026-06-17.
> Quyết định đã chốt: (1) Leads **migrate hẳn** sang Supabase; (2) Video **chỉ lưu path local** (không Storage); (3) **Mỗi brand 1 Supabase project** (1 schema deploy N lần); (4) Bước kế = plan chi tiết + SQL đầy đủ (tài liệu này).

---

## 0. Bối cảnh — 4 Hermes profiles

| Profile | Vai trò | Sinh dữ liệu | Ghi MCP nào |
|---|---|---|---|
| `content_researcher` | Research / ý tưởng / tuyến chủ đề | idea, research sources, topic pool | `content_line.create`, `content.create_item`(idea), `product.upsert` |
| `video-editor` | Sản xuất video (HeyGen/ElevenLabs/HyperFrames/Remotion) | `workspace/content/<date>/<slug>/` + final mp4 | `content.get_item`, `content.update_status`, `content.attach_asset` |
| `community-manager` | Đăng bài (Blotato FB+YT) + comment | publish record, comment, traffic | `publication.*`, `engagement.upsert_metrics`, `comment.*`, `lead.upsert` |
| `windy-city-media` | Brand thứ 2 (skill y hệt) | giống video-editor/community | định tuyến sang project brand windy-city |

**Khoảng trống:** mọi profile đẩy ra file rời / Telegram; không có nguồn sự thật nối lead ↔ offer ↔ content ↔ publish ↔ engagement ↔ doanh thu. Supabase + MCP lấp khoảng trống này.

---

## 1. Kiến trúc

```
 Người  ── App Next.js (CRM + Content + Inbox + Analytics) ─┐
 Agents ── MCP "biz-mkt-os" (intent-level tools, validate) ─┤── routing theo brand
                                                            ▼
        Supabase project [brand]:  Postgres + Realtime + RLS
        (mỗi brand 1 project, CÙNG schema)
```

- **2 cổng ghi, 1 DB/brand.** Người dùng → App; agents → MCP. Không cho agent đụng SQL thô.
- **Realtime**: App nghe `content_items`/`publications` → video-editor render xong, thẻ tự nhảy cột.
- **Định tuyến brand**: MCP đọc tham số `brand` (hoặc mặc định theo profile) → chọn cặp `SUPABASE_URL` + `SERVICE_ROLE_KEY` tương ứng.

---

## 2. SQL schema đầy đủ (1 migration, áp cho MỖI project brand)

> Postgres / Supabase. Không có cột `brand` vì mỗi project = 1 brand. Chạy trong SQL editor hoặc `supabase migration`.

```sql
-- ============================================================
-- BIZ.MKT.OS schema v1 — áp cho mỗi Supabase project (1 brand)
-- ============================================================

create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- ---------- ENUMS ----------
create type content_status        as enum ('idea','scripted','voiced','rendered','ready','published','archived');
create type content_format        as enum ('portrait_9_16','landscape_16_9','listicle','other');
create type asset_kind            as enum ('script','mp3','source_mp4','final_mp4','thumbnail','broll','other');
create type publication_platform  as enum ('facebook','youtube','tiktok','instagram');
create type publication_status    as enum ('draft','scheduled','published','failed');
create type comment_reply_status  as enum ('none','draft','replied','skipped');
create type lead_stage            as enum ('new','contacted','nurturing','paid','lost');
create type order_status          as enum ('pending','paid','refunded','cancelled');
create type interaction_channel   as enum ('comment','dm','email','zalo','phone','web_form','other');
create type interaction_direction as enum ('inbound','outbound');

-- ---------- updated_at trigger ----------
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ============================================================
-- A. CRM
-- ============================================================
create table products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  niche        text,
  niche_score  int check (niche_score between 0 and 100),
  price_tiers  jsonb not null default '[]',         -- [{tier,name,price_vnd,...}] decoy 3-tier
  landing_url  text,
  status       text not null default 'active',      -- active|paused|retired
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

create table leads (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  phone                 text check (phone ~ '^(0|\+84)[0-9]{9}$'),
  email                 text,
  stage                 lead_stage not null default 'new',
  score                 int default 0,
  product_id            uuid references products(id) on delete set null,
  source_channel        text,                        -- facebook|youtube|web_form|zalo...
  source_content_id     uuid,                        -- FK gắn sau khi content_items tạo
  source_publication_id uuid,
  owner                 text,                         -- profile/người phụ trách
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create trigger trg_leads_updated before update on leads
  for each row execute function set_updated_at();
create index idx_leads_stage on leads(stage);
create index idx_leads_phone on leads(phone);
create unique index uq_leads_phone_email on leads(coalesce(phone,''), coalesce(email,''));

create table orders (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  tier        text,
  amount_vnd  bigint not null default 0,
  status      order_status not null default 'pending',
  sepay_ref   text,
  paid_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();
create index idx_orders_lead on orders(lead_id);
create index idx_orders_status on orders(status);

create table interactions (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references leads(id) on delete cascade,
  channel       interaction_channel not null,
  direction     interaction_direction not null,
  body          text,
  agent_profile text,
  occurred_at   timestamptz not null default now()
);
create index idx_interactions_lead on interactions(lead_id, occurred_at desc);

-- ============================================================
-- B. CONTENT
-- ============================================================
create table content_lines (              -- "tuyến content"
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  pillar          text,                    -- chủ đề/trụ cột
  target_persona  text,
  cadence         text,                    -- vd "3 video/tuần"
  product_id      uuid references products(id) on delete set null,  -- tuyến này bán offer nào
  status          text not null default 'active',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger trg_lines_updated before update on content_lines
  for each row execute function set_updated_at();

create table content_items (
  id             uuid primary key default gen_random_uuid(),
  line_id        uuid references content_lines(id) on delete set null,
  product_id     uuid references products(id) on delete set null,
  slug           text not null,
  title          text,
  hook           text,
  format         content_format not null default 'portrait_9_16',
  status         content_status not null default 'idea',
  workspace_path text,                     -- workspace/content/<date>/<slug>/
  script         text,
  created_by     text,                     -- hermes profile
  meta           jsonb not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger trg_items_updated before update on content_items
  for each row execute function set_updated_at();
create unique index uq_content_slug on content_items(slug);
create index idx_content_status on content_items(status);
create index idx_content_line on content_items(line_id);

-- FK trễ cho lead attribution
alter table leads add constraint fk_leads_content
  foreign key (source_content_id) references content_items(id) on delete set null;

create table assets (
  id               uuid primary key default gen_random_uuid(),
  content_item_id  uuid not null references content_items(id) on delete cascade,
  kind             asset_kind not null,
  local_path       text not null,          -- ĐƯỜNG DẪN MÁY (không upload Storage)
  meta             jsonb not null default '{}',  -- duration, resolution, size...
  created_at       timestamptz not null default now()
);
create index idx_assets_item on assets(content_item_id, kind);

create table publications (
  id               uuid primary key default gen_random_uuid(),
  content_item_id  uuid not null references content_items(id) on delete cascade,
  platform         publication_platform not null,
  channel_id       text,                   -- page/channel id (vd 704841222706761)
  external_post_id text,
  url              text,
  caption          text,
  status           publication_status not null default 'draft',
  published_by     text,
  scheduled_at     timestamptz,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_pub_updated before update on publications
  for each row execute function set_updated_at();
create index idx_pub_item on publications(content_item_id);
create unique index uq_pub_external on publications(platform, external_post_id)
  where external_post_id is not null;

-- FK trễ cho lead attribution theo publication
alter table leads add constraint fk_leads_pub
  foreign key (source_publication_id) references publications(id) on delete set null;

create table engagement_metrics (
  id              uuid primary key default gen_random_uuid(),
  publication_id  uuid not null references publications(id) on delete cascade,
  captured_at     timestamptz not null default now(),
  views           bigint default 0,
  likes           bigint default 0,
  comments_count  bigint default 0,
  shares          bigint default 0,
  watch_time_sec  bigint default 0,
  raw             jsonb not null default '{}'
);
create index idx_metrics_pub on engagement_metrics(publication_id, captured_at desc);

create table comments (
  id                  uuid primary key default gen_random_uuid(),
  publication_id      uuid not null references publications(id) on delete cascade,
  external_comment_id text,
  author              text,
  text                text,
  sentiment           text,                -- positive|neutral|negative|spam
  reply_text          text,
  reply_status        comment_reply_status not null default 'none',
  replied_by          text,
  occurred_at         timestamptz not null default now(),
  created_at          timestamptz not null default now()
);
create unique index uq_comment_external on comments(external_comment_id)
  where external_comment_id is not null;
create index idx_comments_reply on comments(reply_status);

-- ============================================================
-- D. AGENT OPS (audit log — mọi MCP write ghi 1 dòng)
-- ============================================================
create table agent_events (
  id          uuid primary key default gen_random_uuid(),
  profile     text,
  action      text not null,               -- vd content.update_status
  entity_type text,
  entity_id   uuid,
  payload     jsonb not null default '{}',
  ts          timestamptz not null default now()
);
create index idx_events_ts on agent_events(ts desc);
create index idx_events_entity on agent_events(entity_type, entity_id);

-- ============================================================
-- RLS — bật cho mọi bảng; service-role (MCP) bypass tự động.
-- App authenticated chỉ đọc; ghi qua MCP hoặc RPC riêng.
-- ============================================================
do $$ declare t text;
begin
  foreach t in array array['products','leads','orders','interactions','content_lines',
    'content_items','assets','publications','engagement_metrics','comments','agent_events']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy %I_read on %I for select to authenticated using (true);', t, t);
  end loop;
end $$;
```

---

## 3. Backfill — seed lịch sử từ filesystem

Script `scripts/backfill_content.py` quét `workspace/content/<date>/<slug>/` → upsert:

| File sidecar | → bảng | Trường |
|---|---|---|
| folder name + path | `content_items` | slug, workspace_path, format (đoán từ tên/aspect) |
| `script.txt` / `script.md` | `content_items.script` | |
| `<slug>.mp4` (final) | `assets` kind=`final_mp4` | local_path |
| `source.mp4` | `assets` kind=`source_mp4` | |
| `audio/*.mp3` | `assets` kind=`mp3` | |
| `heygen-status.json` | `content_items.meta` | trạng thái render |
| sự tồn tại final mp4 | `content_items.status` | `ready` nếu có final, else `rendered`/`scripted` |

Idempotent qua `uq_content_slug`.

---

## 4. MCP server "biz-mkt-os" — spec

- **Stack:** TypeScript MCP SDK (theo skill `mcp-builder`). Validate input bằng Zod.
- **Bảo mật:** service-role key phía server (không lộ cho agent). Mỗi tool ghi 1 dòng `agent_events`.
- **Multi-brand routing:** env `BMO_BRANDS` map brand → `{url, service_key}`. Tool nhận `brand?` (mặc định theo profile gọi). Ví dụ:
  ```
  BMO_DEFAULT_BRAND=tony-hoang
  SUPABASE_URL__tony_hoang=...      SUPABASE_SERVICE_KEY__tony_hoang=...
  SUPABASE_URL__windy_city=...      SUPABASE_SERVICE_KEY__windy_city=...
  ```

### Tools

| Tool | Input (rút gọn) | Hành vi |
|---|---|---|
| `product.upsert` | slug, name, price_tiers?, landing_url?, niche_score? | upsert theo slug |
| `product.list` | status? | list |
| `content_line.create` | name, pillar?, product_slug?, cadence? | tạo tuyến |
| `content_line.list` | status? | list |
| `content.create_item` | slug, title?, line?, format?, hook?, script?, status? | tạo (mặc định idea) |
| `content.update_status` | slug, status | đổi trạng thái pipeline |
| `content.attach_asset` | slug, kind, local_path, meta? | gắn asset (final mp4...) |
| `content.get_item` | slug | trả item + assets + publications |
| `content.list_pipeline` | status? | board theo trạng thái |
| `content.calendar` | from, to | lịch xuất bản |
| `publication.create` | content_slug, platform, caption?, channel_id?, scheduled_at? | tạo draft |
| `publication.mark_published` | id\|(content_slug+platform), external_post_id, url | published + published_at |
| `engagement.upsert_metrics` | publication_id, views/likes/... | snapshot metric |
| `comment.ingest` | publication_id, external_comment_id, author, text, sentiment? | upsert comment |
| `comment.set_reply` | comment_id, reply_text, reply_status | lưu reply (draft/replied) |
| `lead.upsert` | name, phone?, email?, source_channel?, source_content_slug?, product_slug? | upsert (dedup phone/email) |
| `lead.set_stage` | lead_id, stage | đổi stage |
| `lead.log_interaction` | lead_id, channel, direction, body | ghi tương tác |
| `order.create` | lead_id, product_slug, tier, amount_vnd | tạo order pending |
| `order.mark_paid` | order_id, sepay_ref | paid + paid_at + lead.stage=paid |
| `crm.pipeline_summary` | — | đếm theo stage + doanh thu |

### Ánh xạ vào skill có sẵn (wire-in)
- `social-publish` đăng xong → gọi `publication.mark_published`.
- `youtube-comment-responder` / `fb-comment-responder` đọc → `comment.ingest`; reply → `comment.set_reply`.
- video pipeline (Phase cuối) → `content.attach_asset` + `content.update_status('ready')`.

---

## 5. App Next.js (CRM + Content Manager)

Next.js 15 + React 19 + Tailwind 4, deploy Vercel, đọc Supabase (anon key + RLS authenticated), Realtime.

- **CRM** — leads Kanban theo `stage`, lead detail + timeline `interactions`, `orders`, doanh thu (`crm.pipeline_summary`).
- **Content** — pipeline board (`content_items.status`), content calendar (`publications.scheduled_at`), quản lý `content_lines`, trạng thái đăng đa kênh.
- **Inbox** — `comments` reply_status=`none|draft` → duyệt → community-manager đăng.
- **Analytics** — `engagement_metrics`/bài + attribution `leads.source_content_id → product → orders`.

> ⚠️ **Giới hạn do chọn "path local":** video mp4 không lên Storage → App trên Vercel **không phát được video**. App hiển thị metadata + `local_path` (+ nút copy path / mở Finder khi chạy máy local). Nếu sau này muốn xem video trong App → bật Supabase Storage cho `final_mp4` + `thumbnail`.

---

## 6. Migrate leads (Vercel KV → Supabase)

Sửa 3 skill (ghi Supabase thay vì KV):
- `biz-email-setup` — API route `/api/lead` `INSERT leads` (stage=new, source_channel=web_form) + giữ email 2 st_age.
- `biz-setup-sepay-payment` — webhook paid → `order.mark_paid` (hoặc INSERT order paid) + cập nhật lead.stage=paid.
- `biz-admin-leads-dashboard` — đọc `leads`/`orders` từ Supabase thay vì KV (hoặc thay hẳn bằng App CRM).

Landing page mới: thêm `@supabase/supabase-js`, env `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (server-side route). Mỗi landing page trỏ tới project Supabase của brand tương ứng.

---

## 7. Lộ trình build

| Phase | Việc | Phụ thuộc |
|---|---|---|
| **P0** | Tạo Supabase project / brand + áp migration §2 + bật RLS | quyết định #brand projects |
| **P1** | MCP server (read + content/product/line tools) → gắn video-editor + content_researcher; backfill §3 | P0 |
| **P2** | Tool publication/engagement/comment → gắn community-manager; wire social-publish + responders | P1 |
| **P3** | CRM tools + migrate leads §6 (sửa 3 skill biz-*) | P1 |
| **P4** | App Next.js 4 khu + Realtime, deploy Vercel | P0..P3 |
| **P5** | Cron report đọc DB (thay report Telegram rời rạc) | P2 |

---

## 8. Câu hỏi mở còn lại trước P0
- Đã có tổ chức Supabase chưa, hay tôi hướng dẫn anh tạo? (project cần tạo thủ công qua dashboard hoặc Supabase MCP nếu đã link).
- Số brand cần project ngay: chỉ `tony-hoang` trước, hay tạo luôn cả `windy-city`?
- Tên/region project (gợi ý `ap-southeast-1` Singapore cho VN traffic).
