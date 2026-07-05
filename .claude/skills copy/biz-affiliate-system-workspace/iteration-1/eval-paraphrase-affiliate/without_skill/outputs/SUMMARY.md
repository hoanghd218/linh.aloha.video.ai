# Affiliate System — Implementation Summary

Added a 1-tier affiliate / CTV (cộng tác viên) referral system to the Next.js 16
App Router landing page (Sepay payment + Supabase lead store). Cộng tác viên get
a personal referral code + link, orders they close are auto-attributed to them,
percentage commission is computed per paid order, and they self-serve their
revenue via a portal. Default settings used (Pro 30% / Elite 40%, `?aff=` param,
30-day last-touch cookie, portal login = aff code + email, `/admin/affiliates`
shares `ADMIN_PASSWORD`).

## Files CREATED (8)

- `supabase/migrations/20260522010000_affiliate_system.sql` — migration creating
  3 tables (`affiliates`, `affiliate_clicks`, `affiliate_commissions`) +
  `ALTER TABLE leads ADD COLUMN aff_code` + indexes + RLS deny-all + pg_cron
  cleanup for old clicks. Idempotent. NOT applied to any DB (file only).
- `src/lib/affiliate.ts` — Supabase store + commission logic: affiliate CRUD,
  `recordCommissionForOrder()` (idempotent via UNIQUE `order_id`), click
  recording, portal login verification, aggregation, `TIER_RATES` constants,
  `genAffCode()` URL-safe code generator.
- `src/components/AffiliateTracker.tsx` — client component: captures `?aff=` /
  `?ref=`, writes 30-day last-touch `aff_ref` cookie, fires click beacon.
  Renders `null`.
- `src/app/api/affiliate/click/route.ts` — public endpoint receiving click
  beacons, always returns 200.
- `src/app/api/affiliate/route.ts` — portal data endpoint: POST `{code,email}`
  → verify → return that affiliate's link, clicks, orders, commissions.
- `src/app/api/admin/affiliates/route.ts` — admin API (auth via `x-admin-pass`):
  GET list + stats, POST create affiliate, PATCH edit affiliate / change
  commission status.
- `src/app/affiliate/page.tsx` — affiliate portal UI: login (aff code + email)
  → dashboard with referral link, KPIs, commission history. Vietnamese.
- `src/app/admin/affiliates/page.tsx` — admin UI: password gate → affiliate
  table (add/edit) + commission table (approve / mark paid / reject / reopen).
  Vietnamese.

NOTE: `src/lib/admin-auth.ts` was NOT created — it already existed in the
project (identical to the skill template) and provides `checkAdminPass()`.

## Files MODIFIED (4)

- `src/lib/leads-supabase.ts` — added optional `affCode` to `CreateLeadInput`
  type; `createLead()` now writes `aff_code` into the inserted `leads` row.
- `src/app/api/register/route.ts` — added `readAffCookie()` helper (parses the
  `aff_ref` cookie server-side); reads it once per request and passes `affCode`
  into `createLead()`. No form components touched — attribution is server-side.
- `src/app/api/sepay-webhook/route.ts` — imports `recordCommissionForOrder`;
  after a successful `markOrderPaid()`, calls it inside a try/catch so a
  commission failure can never fail the payment webhook.
- `src/app/layout.tsx` — imports and mounts `<AffiliateTracker />` in `<body>`
  so `?aff=` is captured site-wide on every page.

## Build result

`npm run build` — **PASS** (exit code 0).

Next.js 16.2.2 compiled successfully with no TypeScript errors. All affiliate
routes appear in the route manifest: `/admin/affiliates`, `/affiliate`,
`/api/admin/affiliates`, `/api/affiliate`, `/api/affiliate/click`.

## To go live (operator notes)

1. Apply the migration: paste
   `supabase/migrations/20260522010000_affiliate_system.sql` into Supabase
   Dashboard → SQL Editor → Run (or `npm run db:push`).
2. Add affiliates at `/admin/affiliates` (default password `123456` — change in
   `.env.local` `ADMIN_PASSWORD` for production).
3. Give each affiliate their referral link `https://<domain>/?aff=<CODE>` and
   the portal link `https://<domain>/affiliate` (login = code + email).
4. Each pay period: in `/admin/affiliates` → Hoa hồng → filter "Chờ duyệt" →
   approve → mark as paid after transferring.
