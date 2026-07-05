---
phase: 2
title: "API routes (register/status/webhook)"
status: pending
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 2: API routes

## Overview
Tạo 3 API route Next.js (App Router):
- `POST /api/register` — tạo order trong KV cho gói paid + forward sang n8n
- `GET /api/payment-status?order=...` — frontend poll kiểm tra status
- `POST /api/sepay-webhook` — SePay gọi khi nhận tiền, update KV

## Requirements
- Gói free vẫn submit thẳng từ browser → n8n (không qua route này) để giảm load và giữ flow cũ
- Gói paid bắt buộc qua `/api/register` để có orderId từ server
- Webhook auth bằng `Authorization: Apikey {SEPAY_API_KEY}` (đúng spec SePay)
- Idempotent: webhook gọi 2 lần với cùng orderId không double-update

## Architecture

### Route handlers (Next.js 16 App Router)
```
src/app/api/
├── register/route.ts          # POST
├── payment-status/route.ts    # GET
└── sepay-webhook/route.ts     # POST
```

Tất cả route dùng `runtime = "nodejs"` (default) — `@vercel/kv` chạy được trên edge nhưng giữ Node default cho đơn giản và full fetch.

## Related Code Files
- Create: `src/app/api/register/route.ts`
- Create: `src/app/api/payment-status/route.ts`
- Create: `src/app/api/sepay-webhook/route.ts`

## Implementation Steps

### 1. `POST /api/register`
- Parse body: `{ name, phone, email, ticket }`
- Validate: required fields, phone numeric (basic)
- `getPlanPrice(ticket)`:
  - Nếu `0` (free): forward thẳng n8n từ server, return `{ ok: true, paid: false }`
  - Nếu `> 0` (paid):
    1. `generateOrderId()`, retry tối đa 3 lần nếu KV `set` với `nx` thất bại (collision)
    2. KV `set order:{orderId}`, value là Order object, ex `ORDER_TTL_SECONDS`
    3. Forward payload (đính kèm orderId, amount) sang `N8N_REGISTER_WEBHOOK_URL` — không await blocking, dùng `fetch` với `keepalive: true`. Nếu n8n fail vẫn return 200 (KV đã có order, n8n chỉ là notification)
    4. Return `{ ok: true, paid: true, orderId, amount }`
- Errors: 400 (validation), 500 (KV down)

### 2. `GET /api/payment-status?order=DHxxxxxx`
- Validate query `order` matches `/^DH\d{6}$/`
- KV `get order:{orderId}`
- Return:
  - `{ ok: true, status: "pending"|"paid"|"expired", amount }` nếu thấy
  - `404 { ok: false, error: "not_found" }` nếu KV trả null
- Cache: `Cache-Control: no-store`

### 3. `POST /api/sepay-webhook`
SePay payload (theo docs SePay):
```json
{
  "id": 123,
  "gateway": "MBBank",
  "transactionDate": "2026-05-06 10:00:00",
  "accountNumber": "VQRQAIUBZ4834",
  "code": null,
  "content": "DH102969 chuyen tien",
  "transferType": "in",
  "transferAmount": 499000,
  "referenceCode": "...",
  "description": "..."
}
```

Logic:
1. Verify header `Authorization`. SePay gửi `Authorization: Apikey {key}`. So sánh constant-time với `SEPAY_API_KEY`. Sai → 401.
2. Parse JSON body
3. Bỏ qua nếu `transferType !== "in"`
4. Extract orderId từ `content` (hoặc `description`) bằng regex `/DH\d{6}/`. Không match → 200 ok (để SePay không retry mãi) nhưng log
5. KV `get order:{orderId}`. Không tồn tại → 200 ok + log
6. Validate `transferAmount >= order.amount` (cho phép user chuyển dư). Không đủ → log + 200 ok
7. Idempotency: nếu `order.status === "paid"` → 200 ok, không update lại
8. KV `set order:{orderId}` với `{ ...order, status: "paid", paidAt: Date.now() }`, giữ TTL còn lại
9. (Optional) fire-and-forget POST sang n8n channel "paid" nếu có biến `N8N_PAID_WEBHOOK_URL` (chưa cần Phase này)
10. Return 200 ok

### 4. Constant-time API key check
```ts
import { timingSafeEqual } from "node:crypto";
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
```

### 5. Compile check
```bash
pnpm build
```

## Success Criteria
- [ ] 3 route build pass TypeScript
- [ ] `POST /api/register` với gói free → forward n8n, return `{ paid: false }`
- [ ] `POST /api/register` với gói paid → tạo order trong KV, return `{ orderId, amount }`
- [ ] `GET /api/payment-status?order=...` trả status đúng
- [ ] `POST /api/sepay-webhook` sai api key → 401
- [ ] Webhook đúng api key + match orderId → KV chuyển sang `paid`
- [ ] Webhook gọi 2 lần liên tiếp → không double-process

## Risk Assessment
- **n8n forward fail:** Free plan đang gọi trực tiếp browser → n8n. Nếu route mới forward server-side thất bại, user mất registration. Mitigation: thử/catch, ghi log; với gói paid order đã trong KV nên admin vẫn thấy.
- **SePay payload format khác doc:** Confirm thực tế qua test webhook. Phase 5 sẽ test thực.
- **KV race condition:** 2 webhook đồng thời vào cùng orderId. KV `set` đơn giản OK vì status `paid` cuối cùng vẫn `paid`.
- **Order ID collision:** SET với `nx`. 6 digits cho ~1M không gian, có lẽ không lo nhưng có guard.

## Open questions
- SePay có gửi field `code` riêng cho mã đơn không, hay phải parse từ `content`? Docs nói "Memo / Reference / nội dung". Phase 5 confirm.
