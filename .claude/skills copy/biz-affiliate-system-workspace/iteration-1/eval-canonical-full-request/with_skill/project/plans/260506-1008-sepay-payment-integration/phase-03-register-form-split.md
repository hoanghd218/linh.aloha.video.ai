---
phase: 3
title: "Register form split free vs paid"
status: pending
priority: P1
effort: "1h"
dependencies: [2]
---

# Phase 3: Update RegisterFormSection — split free vs paid

## Overview
Sửa `RegisterFormSection.tsx` để:
- Gói free: giữ nguyên hiện tại (POST trực tiếp n8n từ browser, redirect `/cam-on`)
- Gói paid: POST `/api/register` → nhận `orderId` → redirect `/thanh-toan?order={orderId}`

YAGNI: không refactor lớn, chỉ branch theo `isPaidPlan(ticket)` trước khi gọi fetch.

## Requirements
- Không break flow free hiện tại
- Paid: redirect kèm orderId trên query string
- Validate ticket dropdown vẫn là 2 option như cũ; logic giá lookup ở client lẫn server đều dùng `getPlanPrice`

## Architecture
Client import `isPaidPlan` từ `src/lib/plans.ts`.
- Submit handler:
  - Free → fetch n8n trực tiếp (như cũ)
  - Paid → fetch `/api/register` (relative URL), nhận `{ orderId }`, redirect `/thanh-toan?order={orderId}`

Không thêm prop mới — branching đọc từ giá trị `ticket` trong form.

## Related Code Files
- Modify: `src/components/RegisterFormSection.tsx`

## Implementation Steps

### 1. Import lib
```ts
import { isPaidPlan } from "@/lib/plans";
```

### 2. Refactor `handleSubmit`
Pseudo:
```ts
async function handleSubmit(e) {
  // ...validate...
  setFormState("submitting");
  try {
    if (isPaidPlan(ticket)) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, ticket }),
      });
      if (!res.ok) throw new Error(`Register failed: ${res.status}`);
      const data = await res.json();
      if (!data.orderId) throw new Error("Missing orderId");
      window.fbq?.("track", "InitiateCheckout", { value: data.amount, currency: "VND" });
      formEl.reset();
      router.push(`/thanh-toan?order=${data.orderId}`);
    } else {
      // Free flow — giữ nguyên hiện tại
      const res = await fetch(REGISTER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, ticket, createdAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Webhook trả về ${res.status}`);
      window.fbq?.("track", "Lead");
      formEl.reset();
      router.push(redirectTo);
    }
  } catch (err) {
    setFormState("error");
    setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
  }
}
```

### 3. Update success copy nếu cần
Subtitle hiện tại: "Sau khi đăng ký bạn sẽ nhận link nhóm Zalo để vào Zoom & nhận tài liệu." — vẫn hợp lệ. Có thể thêm dòng nhỏ: "Gói trả phí sẽ tới trang QR thanh toán." (optional).

### 4. Compile + manual test
- `pnpm dev`
- Mở `/`, chọn gói free → submit → /cam-on (như cũ)
- Mở `/`, chọn gói 499K → submit → /thanh-toan?order=DH... (page chưa có ở phase này, sẽ 404 — đó là bình thường, làm tiếp ở Phase 4)

## Success Criteria
- [ ] Form free flow không đổi
- [ ] Form paid flow gọi `/api/register`, redirect đúng URL có orderId
- [ ] Pixel events: `Lead` cho free, `InitiateCheckout` cho paid (giữ data analytics rõ)
- [ ] TypeScript build pass

## Risk Assessment
- **Hardcoded webhook URL trên client:** Vẫn để như hiện tại cho gói free để giữ commit gần đây của user (chủ ý refactor về client-side direct). Không di chuyển free về server.
- **CORS/CSRF:** `/api/register` cùng origin nên không có vấn đề CORS. Form là user-initiated nên không cần CSRF token cho landing page (low value attack target).
