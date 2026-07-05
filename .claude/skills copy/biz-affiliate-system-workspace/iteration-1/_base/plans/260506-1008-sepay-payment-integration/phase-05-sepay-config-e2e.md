---
phase: 5
title: "SePay webhook config & E2E test"
status: pending
priority: P1
effort: "1h"
dependencies: [2, 3, 4]
---

# Phase 5: SePay dashboard config & end-to-end test

## Overview
Cấu hình webhook SePay trỏ về production URL, test E2E với chuyển khoản thật giá nhỏ (vd 1,000đ test plan), confirm format payload và update plan price map nếu cần.

## Requirements
- SePay account đã link với MBBank `VQRQAIUBZ4834`
- Vercel project deploy production có URL `/api/sepay-webhook`
- Test 1 đơn thật end-to-end

## Implementation Steps

### 1. Sinh `SEPAY_API_KEY`
- Random string đủ mạnh (32+ chars). Dùng `openssl rand -hex 32` hoặc 1Password.
- Set trong Vercel dashboard → Settings → Environment Variables (Production + Preview)

### 2. SePay dashboard setup
- Login `https://my.sepay.vn`
- Companies → company → Webhooks → Add new
- URL: `https://{your-vercel-domain}/api/sepay-webhook`
- Method: `POST`
- Authentication: `Apikey`, paste API key (cùng giá trị `SEPAY_API_KEY` trên Vercel)
- Trigger: chỉ "Money in" (transferType = in)
- Save → SePay sẽ gửi test event ngay

### 3. Verify test event
- Vercel logs: thấy `POST /api/sepay-webhook 200`
- Nếu 401: kiểm tra header format. SePay có thể gửi `Authorization: Apikey xxx` hoặc `Apikey xxx` — cần parse linh hoạt:
  ```ts
  const auth = req.headers.get("authorization") ?? "";
  const key = auth.replace(/^Apikey\s+/i, "").replace(/^Bearer\s+/i, "").trim();
  ```

### 4. E2E test thật
- Tạo plan price map test: thêm tạm `"Gói TEST 1K": 1000` vào `PLAN_PRICES`
- Add option `<option value="Gói TEST 1K">TEST — 1K</option>` vào form (tạm thời)
- Production deploy, vào trang chủ, đăng ký gói TEST → /thanh-toan
- Mở app MB Bank, quét QR, chuyển 1,000đ với nội dung đúng `DHxxxxxx`
- Verify trong vòng 30s: page tự chuyển `/cam-on`
- Check Vercel KV dashboard: `order:DH...` có `status: "paid"`

### 5. Confirm payload format
- Đọc Vercel logs payload thật của SePay
- Đối chiếu với regex extract orderId trong `/api/sepay-webhook`. Update nếu khác giả định ban đầu (vd có field `code` riêng thì dùng `body.code` thay vì parse `content`)

### 6. Cleanup test plan
- Xoá option "Gói TEST 1K" khỏi form
- Xoá entry test khỏi `PLAN_PRICES`
- Hoàn tiền test (nếu cần)

### 7. Final smoke test
- Đăng ký gói free → verify /cam-on (không đổi)
- Đăng ký gói 499K → verify QR đúng 499000 + DHxxxxxx
- (Skip thanh toán thật, hoặc tự đặt lệnh chuyển 499K rồi hoàn lại)

## Success Criteria
- [ ] SePay webhook config trỏ về production endpoint
- [ ] Test event từ SePay → 200 OK trong logs
- [ ] E2E 1,000đ thật → KV update `paid` → page redirect `/cam-on` < 30s
- [ ] Free plan flow không đổi
- [ ] Test artifacts cleanup (xoá gói TEST)

## Risk Assessment
- **Phí test thật:** chuyển 1,000đ vào tài khoản chính. Có thể tự rút lại sau test.
- **SePay có thể chậm webhook 10-60s:** UI polling 5-15s + timeout 10 phút đủ buffer
- **Webhook có thể bị firewall block ngẫu nhiên:** Vercel không có firewall mặc định, nhưng nếu dùng Vercel Pro với Edge Config / Firewall rules thì cần whitelist SePay IPs

## Open questions
- SePay có docs IP whitelist outbound không? Nếu có, document trong env example.
- Có cần forward "paid" event sang n8n để gửi mail/zalo confirm cho user không? (Phase này không làm, đợi user yêu cầu).

## Done definition
- Production deploy ổn
- 1 đơn paid thật chạy E2E thành công
- Tài liệu env vars đầy đủ trong `.env.local.example`
