---
title: "SePay payment integration cho gói trả phí"
created: 2026-05-06
status: in-progress
priority: P1
blockedBy: []
blocks: []
---

## Status (cập nhật 2026-05-06)
- Phase 01-04: **DONE** (code + build pass)
- Phase 05: **PENDING** (cần user thao tác trên Vercel + SePay dashboard)
- Đổi với plan ban đầu: dùng `@upstash/redis` thay `@vercel/kv` (deprecated). Env vars dùng prefix `UPSTASH_REDIS_REST_*`.

# SePay Payment Integration

## Goal
Tích hợp thanh toán SePay (QR MBBank) cho user chọn gói trả phí. Gói free giữ nguyên flow hiện tại. Sau khi user submit form với gói paid → redirect `/thanh-toan` hiện QR + polling status → khi SePay webhook báo "đã nhận tiền" → tự chuyển `/cam-on`.

## Decisions (chốt với user)
- **Storage:** Vercel KV (Upstash Redis) free tier — đủ ~100 đơn paid/ngày với polling 3-5s
- **Payment UI:** Trang `/thanh-toan` riêng (redirect sau submit)
- **Order ID format:** `DH` + 6 random digits (vd `DH102969`) — KV lưu mapping `order:DH102969 → { phone, status, ... }`
- **Plan price map:** Object map theo tên gói, dễ thêm gói mới sau
- **n8n flow:** Giữ nguyên — `/api/register` write KV xong forward sang n8n (cho paid plan)

## Plan Map (tên gói → giá)
```ts
const PLAN_PRICES = {
  "Gói 0 đồng": 0,
  "Gói 499K + tặng quà": 499000,
};
```

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 01 | [Setup KV & env config](./phase-01-setup-kv-env.md) | ✅ done | 1h |
| 02 | [API routes (register/status/webhook)](./phase-02-api-routes.md) | ✅ done | 3h |
| 03 | [Register form split free vs paid](./phase-03-register-form-split.md) | ✅ done | 1h |
| 04 | [Payment page /thanh-toan](./phase-04-payment-page.md) | ✅ done | 2h |
| 05 | [SePay webhook config & E2E test](./phase-05-sepay-config-e2e.md) | ⏳ user actions | 1h |

## Architecture (data flow)

```
User submits form (paid plan)
  └─> POST /api/register
        ├─> Generate orderId DHxxxxxx
        ├─> KV SET order:{orderId} → { phone, name, email, ticket, amount, status: "pending", createdAt }
        ├─> Forward payload tới n8n webhook (giữ flow hiện tại)
        └─> Return { orderId, amount, qrUrl }
              └─> Browser redirect /thanh-toan?order=DHxxxxxx

/thanh-toan page
  ├─> Render QR https://qr.sepay.vn/img?acc=...&amount={amount}&des={orderId}
  ├─> Poll GET /api/payment-status?order=DHxxxxxx mỗi 5s
  └─> Khi status === "paid" → redirect /cam-on

User chuyển khoản với nội dung "DHxxxxxx"
  └─> SePay nhận tiền
        └─> SePay POST /api/sepay-webhook (Authorization: Bearer SEPAY_API_KEY)
              ├─> Verify API key
              ├─> Extract orderId từ payload.content (regex /DH\d{6}/)
              ├─> KV UPDATE order:{orderId}.status = "paid"
              └─> (Optional) forward sang n8n channel "paid"
```

## Risks
- **Vercel KV quota:** 10K commands/day. Polling 5s × 5min = 60 commands/đơn → ~160 đơn/ngày max.
  - Mitigation: stop poll khi status=paid; hard timeout 10 phút; show "liên hệ admin" sau timeout.
- **SePay webhook không tới (network/SePay down):** user đã chuyển tiền nhưng status không update.
  - Mitigation: hiện nút "Tôi đã chuyển — liên hệ admin" với link Zalo trên trang `/thanh-toan` sau 5 phút.
- **Order ID collision:** 6 digit random có ~1/1M trùng. KV SET với NX flag để retry nếu trùng.
- **Free plan regression:** đảm bảo gói 0đ vẫn submit thẳng tới n8n từ browser, không qua /api/register.

## Acceptance criteria
- [ ] User chọn gói free → flow cũ không đổi (n8n direct, redirect /cam-on)
- [ ] User chọn gói paid → redirect /thanh-toan có QR đúng số tiền + đúng des=DHxxxxxx
- [ ] Khi SePay webhook gọi với orderId hợp lệ → page /thanh-toan tự redirect /cam-on trong 5-10s
- [ ] Webhook sai API key → trả 401, không update KV
- [ ] Vercel deploy được, env vars config đầy đủ trên dashboard

## Related files
- Modify: `src/components/RegisterFormSection.tsx`
- Create: `src/app/api/register/route.ts`, `src/app/api/payment-status/route.ts`, `src/app/api/sepay-webhook/route.ts`
- Create: `src/app/thanh-toan/page.tsx`, `src/app/thanh-toan/PaymentClient.tsx`
- Create: `src/lib/plans.ts`, `src/lib/orders.ts`, `src/lib/kv.ts`
- Possibly modify: `src/app/cam-on/page.tsx` (verify paid status nếu muốn lock)
