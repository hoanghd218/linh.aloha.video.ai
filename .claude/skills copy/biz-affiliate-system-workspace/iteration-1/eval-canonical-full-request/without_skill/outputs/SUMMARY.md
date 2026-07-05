# Affiliate system — implementation summary

Hệ thống affiliate 1 tầng gắn vào landing page Next.js 16 App Router đã có sẵn
Sepay payment + Supabase lead store. Đối tác có mã + link riêng → khách click →
mua → hệ thống tự gán đơn → tính hoa hồng (Pro 30%, Elite 40%) → admin duyệt +
chi trả → đối tác xem qua portal.

## npm run build: PASS (exit code 0)

Next.js 16.2.2 build thành công, TypeScript pass, 13 trang static + tất cả route
affiliate xuất hiện (/admin/affiliates, /affiliate, /api/admin/affiliates,
/api/affiliate, /api/affiliate/click).

## Files CREATED (8)

- supabase/migrations/20260522120000_affiliate_system.sql — migration tạo 3
  bảng affiliates / affiliate_clicks / affiliate_commissions + ALTER TABLE
  leads ADD COLUMN aff_code + RLS deny-all + index + cleanup clicks > 180 ngày.
  CHƯA áp lên database thật — chỉ ghi file.
- src/lib/affiliate.ts — store Supabase: CRUD đối tác, recordCommissionForOrder
  (idempotent, snapshot rate/tên/số tiền), đếm click, login portal, hằng số
  TIER_RATES (pro 30 / elite 40), sinh aff_code.
- src/components/AffiliateTracker.tsx — client component bắt ?aff=/?ref= →
  ghi cookie aff_ref 30 ngày (last-touch) → bắn beacon đếm click. Render null.
- src/app/api/affiliate/click/route.ts — public endpoint nhận beacon đếm click.
- src/app/api/affiliate/route.ts — portal data: POST {code,email} → verify →
  trả link, click, đơn, hoa hồng của đối tác đó.
- src/app/api/admin/affiliates/route.ts — quản trị: GET (list đối tác + hoa
  hồng + stats), POST (tạo đối tác), PATCH (sửa đối tác / đổi trạng thái hoa
  hồng). Auth header x-admin-pass.
- src/app/affiliate/page.tsx — portal UI: form đăng nhập mã aff + email →
  dashboard đối tác (link giới thiệu, KPI, bảng hoa hồng).
- src/app/admin/affiliates/page.tsx — UI quản trị: popup mật khẩu → bảng đối
  tác (thêm/sửa) + bảng hoa hồng (duyệt → đánh dấu đã trả → từ chối → mở lại).

src/lib/admin-auth.ts KHÔNG tạo — đã tồn tại sẵn (checkAdminPass y hệt).

## Files MODIFIED (5)

- src/lib/leads-supabase.ts — thêm affCode?: string vào CreateLeadInput,
  thêm aff_code: input.affCode ?? null vào row insert của createLead(),
  thêm aff_code: string | null vào type LeadRow.
- src/app/api/register/route.ts — thêm helper readAffCookie() đọc cookie
  aff_ref server-side, đọc 1 lần đầu handler, truyền affCode vào createLead().
- src/app/api/sepay-webhook/route.ts — import recordCommissionForOrder, gọi
  sau khi markOrderPaid() thành công, bọc try/catch (hoa hồng không làm fail
  webhook).
- src/app/layout.tsx — import + mount <AffiliateTracker /> cạnh {children}.
- src/app/admin/page.tsx — thêm 1 link <a href="/admin/affiliates"> (icon
  Affiliate) vào sidebar quản trị, ngay dưới nav tabs.

## Lưu ý vận hành

- Migration cần áp thủ công: Supabase Dashboard → SQL Editor, dán nội dung file
  supabase/migrations/20260522120000_affiliate_system.sql, Run. Idempotent.
- Thêm đối tác ở /admin/affiliates (mật khẩu = ADMIN_PASSWORD, mặc định 123456).
- Gửi đối tác: link giới thiệu https://<domain>/?aff=<MÃ> + link portal
  https://<domain>/affiliate (đăng nhập bằng mã + email).
- Hoa hồng sinh tự động khi đơn giới thiệu được Sepay xác nhận thanh toán.
