import nodemailer, { type Transporter } from "nodemailer";
import { getSummitZaloGroup } from "./plans";

// SMTP transport — provider-agnostic. Đổi env SMTP_* để swap (Gmail / Brevo / Resend / Elastic Email / ...).
// Cache transporter across warm Lambda invocations.
let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
  }
  return transporter;
}

function formatVND(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0đ";
  return n.toLocaleString("vi-VN") + "đ";
}

function formatPhoneVN(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  return phone;
}

const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || "";
const LANDING_PAGE_URL = process.env.LANDING_PAGE_URL || "";
const ZALO_GROUP_LINK = process.env.ZALO_GROUP_LINK || "";

export type LeadForEmail = {
  name: string;
  email: string;
  phone: string;
  ticket: string;
  amount: number;
  orderId: string;
};

// Chương trình được suy ra từ tên vé (xem lib/plans.ts). Vé Summit có prefix
// "AI AGENT SUMMIT —" → email dùng template + link thanh toán riêng của Summit.
function isSummitTicket(ticket: string): boolean {
  return ticket.trim().toUpperCase().startsWith("AI AGENT SUMMIT");
}

// ===== P3 — Pre-payment reminder =====
// Trigger: sau khi /api/register tạo order (paid tier, chưa pay).
// Nội dung: confirm giữ chỗ + payment link + guarantee + urgency 24h.
export async function sendP3PrePayment(lead: LeadForEmail): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.warn("[mailer] SMTP env missing, skip P3 cho", lead.orderId);
    return;
  }

  const summit = isSummitTicket(lead.ticket);
  const paymentUrl = `${LANDING_PAGE_URL}${
    summit ? "/ai-agent-summit/thanh-toan" : "/thanh-toan"
  }?order=${lead.orderId}`;
  const subject = summit
    ? `${lead.name}, em đã giữ vé AI AGENT SUMMIT — link thanh toán bên trong`
    : `${lead.name}, em đã giữ chỗ Agent Camp — link thanh toán bên trong`;
  const html = summit
    ? renderP3SummitHtml(lead, paymentUrl)
    : renderP3Html(lead, paymentUrl);

  try {
    await t.sendMail({
      from: MAIL_FROM,
      to: lead.email,
      replyTo: MAIL_FROM,
      subject,
      html,
    });
    console.log("[mailer] P3 sent", lead.orderId, "→", lead.email);
  } catch (err) {
    console.error("[mailer] P3 fail", lead.orderId, err);
  }
}

// ===== P5 — Post-payment onboarding =====
// Trigger: Sepay webhook confirm status=paid.
// Nội dung: welcome + Zalo group + lộ trình + 1 câu hỏi personalize.
export async function sendP5PostPayment(lead: LeadForEmail): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.warn("[mailer] SMTP env missing, skip P5 cho", lead.orderId);
    return;
  }

  const summit = isSummitTicket(lead.ticket);
  const subject = summit
    ? `Chào mừng anh/chị ${lead.name} đến AI AGENT SUMMIT — thông tin tham dự & chuẩn bị`
    : `Chào mừng anh/chị ${lead.name} vào AGENT CAMP — mở khoá nhóm Zalo & lộ trình chuẩn bị`;
  const html = summit ? renderP5SummitHtml(lead) : renderP5Html(lead);

  try {
    await t.sendMail({
      from: MAIL_FROM,
      to: lead.email,
      replyTo: MAIL_FROM,
      subject,
      html,
    });
    console.log("[mailer] P5 sent", lead.orderId, "→", lead.email);
  } catch (err) {
    console.error("[mailer] P5 fail", lead.orderId, err);
  }
}

// =============== Templates (inline để giữ skill 2-file) ===============

function renderP3Html(lead: LeadForEmail, paymentUrl: string): string {
  return `<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f5f7;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="padding:32px 24px;">

<p style="margin:0 0 12px;font-size:16px;line-height:1.5;">Chào anh/chị <strong>${lead.name}</strong>,</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5;">
Em là Hoàng Trần — em vừa nhận đăng ký <strong>AGENT CAMP</strong> của anh/chị.
</p>

<div style="background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:18px 18px 14px;margin:0 0 20px;">
  <p style="margin:0 0 10px;font-size:13px;color:#9a3412;font-weight:700;letter-spacing:0.5px;">GHẾ ĐÃ ĐƯỢC GIỮ — CHỜ THANH TOÁN</p>
  <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:#1a1a1a;">
    <tr><td style="padding:3px 0;color:#6b7280;width:90px;">Mã đơn:</td><td style="padding:3px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;"><strong>${lead.orderId}</strong></td></tr>
    <tr><td style="padding:3px 0;color:#6b7280;">Gói vé:</td><td style="padding:3px 0;">${lead.ticket}</td></tr>
    <tr><td style="padding:3px 0;color:#6b7280;">Số tiền:</td><td style="padding:3px 0;"><strong>${formatVND(lead.amount)}</strong></td></tr>
    <tr><td style="padding:3px 0;color:#6b7280;">Camp:</td><td style="padding:3px 0;">29 – 31/05/2026 tại Đà Lạt</td></tr>
  </table>
</div>

<div style="text-align:center;margin:0 0 20px;">
  <a href="${paymentUrl}" style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:8px;">▶ THANH TOÁN GIỮ CHỖ</a>
</div>
<p style="margin:0 0 20px;font-size:13px;color:#6b7280;line-height:1.5;text-align:center;">
Mở link → quét VietQR → chuyển đúng số tiền + đúng nội dung em đã ghi sẵn → 2 phút sau hệ thống xác nhận tự động.
</p>

<p style="margin:0 0 12px;font-size:14px;line-height:1.5;">
⏰ <strong>Quan trọng:</strong> cap 60 ghế, ghế giữ tối đa 24h. Sau 24h ghế tự động mở cho người tiếp theo.
</p>
<p style="margin:0 0 20px;font-size:14px;line-height:1.5;">
🛡️ <strong>Đảm bảo:</strong> Hoàn 100% nếu anh/chị đổi ý trước 22/05/2026.
</p>

<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#6b7280;">Có gì cần em hỗ trợ:</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#6b7280;">
• Reply email này, em đọc trong ngày<br/>
• Hoặc nhắn nhóm chat sau khi anh/chị thanh toán xong
</p>

<p style="margin:0 0 4px;font-size:14px;">Em chờ gặp anh/chị ở Đà Lạt 🌲</p>
<p style="margin:0;font-size:14px;color:#6b7280;">— Hoàng Trần<br/>The AI First — Cộng đồng Freedom Builder</p>

</td></tr></table>
<p style="margin:16px 0 0;font-size:11px;color:#999;text-align:center;max-width:560px;">
Anh/chị nhận email này vì đăng ký Agent Camp tại ${LANDING_PAGE_URL}. Đơn ${lead.orderId}.
</p>
</td></tr></table>
</body></html>`;
}

function renderP5Html(lead: LeadForEmail): string {
  const orderUrl = `${LANDING_PAGE_URL}/thanh-toan?order=${lead.orderId}`;
  const zalo = ZALO_GROUP_LINK || "(em sẽ gửi link qua SMS / Zalo cá nhân)";
  return `<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f5f7;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="padding:32px 24px;">

<p style="margin:0 0 12px;font-size:16px;line-height:1.5;">Chào anh/chị <strong>${lead.name}</strong>,</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5;">
🎉 Em đã nhận thanh toán <strong>${formatVND(lead.amount)}</strong> — anh/chị chính thức là thành viên
<strong>AGENT CAMP</strong> 29–31/05/2026.
</p>

<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:18px;margin:0 0 24px;">
  <p style="margin:0 0 10px;font-size:13px;color:#15803d;font-weight:700;letter-spacing:0.5px;">VIỆC CẦN LÀM NGAY (5 PHÚT)</p>

  <p style="margin:14px 0 4px;font-size:14px;"><strong>1️⃣ Vào nhóm Zalo Camp riêng:</strong></p>
  <p style="margin:0 0 4px;font-size:14px;">→ <a href="${zalo}" style="color:#0369a1;word-break:break-all;">${zalo}</a></p>
  <p style="margin:0 0 14px;font-size:13px;color:#6b7280;line-height:1.5;">
  Em approve trong 30 phút. Đây là kênh chính trong 2 tuần trước Camp — em sẽ chia sẻ pre-work + tài liệu ở đây.
  </p>

  <p style="margin:14px 0 4px;font-size:14px;"><strong>2️⃣ Bookmark hoá đơn:</strong></p>
  <p style="margin:0 0 14px;font-size:14px;">→ <a href="${orderUrl}" style="color:#0369a1;word-break:break-all;">${orderUrl}</a></p>

  <p style="margin:14px 0 4px;font-size:14px;"><strong>3️⃣ Reply email này 1 câu trả lời cho em:</strong></p>
  <p style="margin:0 0 8px;font-size:14px;line-height:1.6;font-style:italic;color:#1a1a1a;">
  "Mô hình kinh doanh hiện tại của anh/chị là gì, và Agent đầu tiên anh/chị muốn xây trong Camp là Marketing / Sales / Content / Channel Growth / Business Strategy?"
  </p>
  <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
  Em đọc từng câu trả lời và cá nhân hoá nội dung Camp cho từng người. 1 câu này quyết định 70% giá trị anh/chị nhận được.
  </p>
</div>

<p style="margin:0 0 8px;font-size:14px;font-weight:700;">LỘ TRÌNH 2 TUẦN TRƯỚC CAMP</p>
<table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;color:#374151;line-height:1.6;margin:0 0 24px;">
  <tr><td style="padding:2px 0;color:#9ca3af;width:120px;">16 – 22/05:</td><td style="padding:2px 0;">Pre-work — assessment AIOS hiện trạng</td></tr>
  <tr><td style="padding:2px 0;color:#9ca3af;">23 – 28/05:</td><td style="padding:2px 0;">Setup tools + tài khoản API</td></tr>
  <tr><td style="padding:2px 0;color:#9ca3af;">29 – 31/05:</td><td style="padding:2px 0;"><strong>3 ngày offline Đà Lạt — Camp chính</strong></td></tr>
</table>
<p style="margin:0 0 24px;font-size:13px;color:#6b7280;">Em sẽ gửi từng phần qua Zalo group.</p>

<p style="margin:0 0 4px;font-size:14px;">— Hoàng Trần</p>
<p style="margin:0;font-size:13px;color:#6b7280;">The AI First — Cộng đồng Freedom Builder<br/>${LANDING_PAGE_URL}</p>

</td></tr></table>
<p style="margin:16px 0 0;font-size:11px;color:#999;text-align:center;max-width:560px;">
Đơn: ${lead.orderId} | Thanh toán: ${formatVND(lead.amount)} | SĐT: ${formatPhoneVN(lead.phone)}
</p>
</td></tr></table>
</body></html>`;
}

// =============== AI AGENT SUMMIT templates ===============

function renderP3SummitHtml(lead: LeadForEmail, paymentUrl: string): string {
  return `<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f5f7;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="padding:32px 24px;">

<p style="margin:0 0 12px;font-size:16px;line-height:1.5;">Chào anh/chị <strong>${lead.name}</strong>,</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5;">
Em là Hoàng Trần — em vừa nhận đăng ký <strong>AI AGENT SUMMIT</strong> của anh/chị.
</p>

<div style="background:#fff7ed;border:1px solid #fdba74;border-radius:10px;padding:18px 18px 14px;margin:0 0 20px;">
  <p style="margin:0 0 10px;font-size:13px;color:#9a3412;font-weight:700;letter-spacing:0.5px;">VÉ ĐÃ ĐƯỢC GIỮ — CHỜ THANH TOÁN</p>
  <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:#1a1a1a;">
    <tr><td style="padding:3px 0;color:#6b7280;width:90px;">Mã đơn:</td><td style="padding:3px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;"><strong>${lead.orderId}</strong></td></tr>
    <tr><td style="padding:3px 0;color:#6b7280;">Hạng vé:</td><td style="padding:3px 0;">${lead.ticket}</td></tr>
    <tr><td style="padding:3px 0;color:#6b7280;">Số tiền:</td><td style="padding:3px 0;"><strong>${formatVND(lead.amount)}</strong></td></tr>
    <tr><td style="padding:3px 0;color:#6b7280;">Sự kiện:</td><td style="padding:3px 0;">Thứ Tư 03/06/2026 · 08:00–18:00 · Quận 2, TP.HCM</td></tr>
  </table>
</div>

<div style="text-align:center;margin:0 0 20px;">
  <a href="${paymentUrl}" style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:8px;">▶ THANH TOÁN VÉ</a>
</div>
<p style="margin:0 0 20px;font-size:13px;color:#6b7280;line-height:1.5;text-align:center;">
Mở link → quét VietQR → chuyển đúng số tiền + đúng nội dung em đã ghi sẵn → 2 phút sau hệ thống xác nhận tự động.
</p>

<p style="margin:0 0 20px;font-size:14px;line-height:1.5;">
⏰ <strong>Quan trọng:</strong> sự kiện giới hạn 200 vé, vé giữ tối đa 24h. Sau 24h vé tự động mở cho người tiếp theo.
</p>

<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#6b7280;">Có gì cần em hỗ trợ:</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#6b7280;">
• Reply email này, em đọc trong ngày<br/>
• Hoặc nhắn nhóm chat sau khi anh/chị thanh toán xong
</p>

<p style="margin:0 0 4px;font-size:14px;">Em chờ gặp anh/chị tại AI AGENT SUMMIT 🚀</p>
<p style="margin:0;font-size:14px;color:#6b7280;">— Hoàng Trần<br/>The AI First — Cộng đồng Freedom Builder</p>

</td></tr></table>
<p style="margin:16px 0 0;font-size:11px;color:#999;text-align:center;max-width:560px;">
Anh/chị nhận email này vì đăng ký AI AGENT SUMMIT tại ${LANDING_PAGE_URL}. Đơn ${lead.orderId}.
</p>
</td></tr></table>
</body></html>`;
}

function renderP5SummitHtml(lead: LeadForEmail): string {
  const orderUrl = `${LANDING_PAGE_URL}/ai-agent-summit/thanh-toan?order=${lead.orderId}`;
  // Mỗi hạng vé Summit có nhóm Zalo riêng — chọn link theo hạng vé đã mua.
  const zalo = getSummitZaloGroup(lead.ticket);
  return `<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f5f7;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="padding:32px 24px;">

<p style="margin:0 0 12px;font-size:16px;line-height:1.5;">Chào anh/chị <strong>${lead.name}</strong>,</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5;">
🎉 Em đã nhận thanh toán <strong>${formatVND(lead.amount)}</strong> — anh/chị chính thức có vé
<strong>AI AGENT SUMMIT</strong>, Thứ Tư 03/06/2026.
</p>

<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:18px;margin:0 0 24px;">
  <p style="margin:0 0 10px;font-size:13px;color:#15803d;font-weight:700;letter-spacing:0.5px;">VIỆC CẦN LÀM NGAY (5 PHÚT)</p>

  <p style="margin:14px 0 4px;font-size:14px;"><strong>1️⃣ Vào nhóm Zalo riêng của AI AGENT SUMMIT:</strong></p>
  <p style="margin:0 0 4px;font-size:14px;">→ <a href="${zalo}" style="color:#0369a1;word-break:break-all;">${zalo}</a></p>
  <p style="margin:0 0 14px;font-size:13px;color:#6b7280;line-height:1.5;">
  Em approve trong 30 phút. Đây là kênh em gửi địa chỉ chi tiết, nhắc lịch và tài liệu chuẩn bị trước sự kiện.
  </p>

  <p style="margin:14px 0 4px;font-size:14px;"><strong>2️⃣ Bookmark hoá đơn:</strong></p>
  <p style="margin:0 0 14px;font-size:14px;">→ <a href="${orderUrl}" style="color:#0369a1;word-break:break-all;">${orderUrl}</a></p>

  <p style="margin:14px 0 4px;font-size:14px;"><strong>3️⃣ Reply email này 1 câu trả lời cho em:</strong></p>
  <p style="margin:0 0 8px;font-size:14px;line-height:1.6;font-style:italic;color:#1a1a1a;">
  "Mô hình kinh doanh hiện tại của anh/chị là gì, và điểm nghẽn lớn nhất đang nằm ở đâu — Marketing, Bán hàng, Xây kênh, Sản xuất nội dung hay Vận hành?"
  </p>
  <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">
  Em dùng câu trả lời này để anh/chị có sẵn dữ liệu cho workshop "Build Your AIOS Map" buổi chiều — đây là phần anh/chị mang về một bản đồ AIOS cho doanh nghiệp của mình.
  </p>
</div>

<p style="margin:0 0 8px;font-size:14px;font-weight:700;">THÔNG TIN THAM DỰ</p>
<table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;color:#374151;line-height:1.6;margin:0 0 16px;">
  <tr><td style="padding:2px 0;color:#9ca3af;width:110px;">Ngày:</td><td style="padding:2px 0;"><strong>Thứ Tư, 03/06/2026</strong></td></tr>
  <tr><td style="padding:2px 0;color:#9ca3af;">Thời gian:</td><td style="padding:2px 0;">08:00 – 18:00 (check-in &amp; networking từ 08:00)</td></tr>
  <tr><td style="padding:2px 0;color:#9ca3af;">Địa điểm:</td><td style="padding:2px 0;">Quận 2, TP. Hồ Chí Minh</td></tr>
  <tr><td style="padding:2px 0;color:#9ca3af;">Hạng vé:</td><td style="padding:2px 0;">${lead.ticket}</td></tr>
</table>
<p style="margin:0 0 24px;font-size:13px;color:#6b7280;">Địa chỉ chi tiết (tên địa điểm + đường) em gửi qua nhóm Zalo trước ngày diễn ra.</p>

<p style="margin:0 0 4px;font-size:14px;">— Hoàng Trần</p>
<p style="margin:0;font-size:13px;color:#6b7280;">The AI First — Cộng đồng Freedom Builder<br/>${LANDING_PAGE_URL}</p>

</td></tr></table>
<p style="margin:16px 0 0;font-size:11px;color:#999;text-align:center;max-width:560px;">
Đơn: ${lead.orderId} | Thanh toán: ${formatVND(lead.amount)} | SĐT: ${formatPhoneVN(lead.phone)}
</p>
</td></tr></table>
</body></html>`;
}
