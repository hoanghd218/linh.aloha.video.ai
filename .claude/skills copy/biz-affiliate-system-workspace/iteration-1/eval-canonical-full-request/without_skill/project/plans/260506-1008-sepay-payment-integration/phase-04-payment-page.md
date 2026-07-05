---
phase: 4
title: "Payment page /thanh-toan"
status: pending
priority: P1
effort: "2h"
dependencies: [2]
---

# Phase 4: Trang `/thanh-toan` — QR + polling

## Overview
Tạo route `/thanh-toan` hiển thị QR SePay theo orderId, poll status mỗi 5s, redirect `/cam-on` khi paid. Có timeout 10 phút + fallback liên hệ admin.

## Requirements
- Đọc `?order=DHxxxxxx` từ query string (server fetch trước render để hydrate amount)
- Render QR SePay full-size, dễ quét trên mobile
- Hiển thị đầy đủ: số tài khoản, ngân hàng, số tiền, nội dung chuyển khoản (orderId)
- Status indicator: "Đang chờ thanh toán" → "Đã nhận thanh toán" → redirect
- Timeout: 10 phút không nhận được paid → hiển thị "Liên hệ admin" + Zalo link
- Mobile-friendly (như các page khác trong codebase)

## Architecture
```
src/app/thanh-toan/
├── page.tsx           # Server component — fetch order, render shell
└── payment-client.tsx # Client component — QR, polling, redirect logic
```

Server component fetch order ban đầu (avoid blank flash). Client component handle polling + countdown.

## Related Code Files
- Create: `src/app/thanh-toan/page.tsx`
- Create: `src/app/thanh-toan/payment-client.tsx`

## Implementation Steps

### 1. `src/app/thanh-toan/page.tsx` (server)
- Đọc `searchParams.order`
- Validate format `/^DH\d{6}$/`. Sai → redirect `/`
- Fetch trực tiếp KV (server) để có `amount`, `status` lần đầu
  - Nếu order không tồn tại → redirect `/`
  - Nếu `status === "paid"` rồi → redirect `/cam-on`
- Compose `qrUrl = https://qr.sepay.vn/img?acc={SEPAY_ACCOUNT}&bank={SEPAY_BANK}&amount={amount}&des={orderId}`
- Render `<PaymentClient orderId amount qrUrl />`

Metadata:
```ts
export const metadata = {
  title: "Thanh toán | Freedom Builder AI Agents",
  description: "Quét mã QR để hoàn tất thanh toán",
};
export const dynamic = "force-dynamic"; // không cache
```

### 2. `src/app/thanh-toan/payment-client.tsx`
Client component:
- Props: `{ orderId, amount, qrUrl }`
- State: `status: "pending" | "paid" | "timeout"`, `secondsLeft`
- Effect 1 (polling):
  - Mỗi 5s fetch `/api/payment-status?order={orderId}`
  - Khi status === "paid" → set state, sleep 1.5s, `router.push("/cam-on")`
  - Cleanup interval khi unmount hoặc paid/timeout
- Effect 2 (countdown 10 phút):
  - `setInterval` mỗi 1s decrement `secondsLeft`
  - Khi 0 → set `status: "timeout"`, dừng polling
- UI sections:
  - Header: "Thanh toán gói {ticket}" + countdown box
  - QR card: image full-width mobile, max-w-sm desktop
  - Info card:
    - Số tài khoản: `VQRQAIUBZ4834` (button copy)
    - Ngân hàng: `MBBank`
    - Số tiền: format VND
    - Nội dung CK: `{orderId}` (button copy) ⚠️ **highlight đỏ + dấu chấm than: "BẮT BUỘC điền đúng nội dung này"**
  - Status banner:
    - pending: "Đang chờ thanh toán..." (animated dot)
    - paid: "✓ Đã nhận thanh toán! Đang chuyển trang..." (green)
    - timeout: "Quá 10 phút chưa nhận được. Vui lòng liên hệ admin qua Zalo." + button Zalo group link

### 3. UI styling
Tận dụng tokens hiện có (`bg-surface`, `bg-surface-container-high`, `border-primary/30`...). Reference `cam-on/page.tsx` cho màu, layout, animation pattern.

### 4. Compile + manual test
```bash
pnpm dev
```
- Tạo order test bằng cách POST `/api/register` qua curl
- Mở `/thanh-toan?order=DH...`
- Verify QR render, thấy số tiền + nội dung CK đúng
- Manual update KV `set order:DH... { status: "paid" }` → verify auto redirect /cam-on

## Success Criteria
- [ ] Page render QR đúng format SePay (mở image trực tiếp xem được)
- [ ] Polling đếm và stop khi paid hoặc unmount (không leak interval)
- [ ] Timeout 10 phút hiện CTA Zalo
- [ ] Mobile: QR đủ to quét được, info card không tràn
- [ ] Direct hit `/thanh-toan` không có `?order=` → redirect `/`
- [ ] Order đã paid mà user reload → redirect `/cam-on`

## Risk Assessment
- **Polling 5s × 600s = 120 GET requests/đơn** vượt mức 60 trong plan tổng — cập nhật math: 120 commands × 100 đơn/ngày ≈ 12K commands → vẫn vượt free 10K. **Mitigation:** poll interval thoái lui (5s đầu, 10s sau 1 phút, 15s sau 3 phút) — exponential-like backoff, hoặc set timeout 5 phút (60 GETs/đơn = ~166 đơn/ngày OK).
- **Decision:** dùng poll interval `[5, 5, 5, 10, 10, 10, 15, 15, 15...]` capped 15s; timeout 10 phút. Trung bình ~50 GET/đơn → ~200 đơn/ngày trên free tier.
- **QR caching:** SePay image có thể cache. Thêm `&t={timestamp}` query không cần thiết vì amount + des là duy nhất. Skip.
- **User reload page nhiều lần:** mỗi lần reload tạo session mới poll lại. Acceptable cho landing page volume.

## UX details (chú ý)
- Nội dung CK phải dán đúng `DHxxxxxx` — hiển thị **lớn, copy button, cảnh báo đỏ** vì user hay sửa thành "Nguyen Van A chuyen tien" làm webhook không match
- Mobile: QR width >= 240px để quét chuẩn từ Banking app
- Add `target="_blank" rel="noopener noreferrer"` cho Zalo link timeout
