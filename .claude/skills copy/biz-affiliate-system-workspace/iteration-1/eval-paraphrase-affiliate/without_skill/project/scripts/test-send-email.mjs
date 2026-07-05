// Ad-hoc test — gửi 1 email mẫu (P5 onboarding) qua SMTP đã cấu hình trong .env.local
// Chạy: node --env-file=.env.local scripts/test-send-email.mjs

import nodemailer from "nodemailer";

const TO = process.argv[2] ?? "hoanghd218@gmail.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const zaloLink = process.env.ZALO_GROUP_LINK;
const orderId = "DH123456";
const name = "Anh Hoàng";
const ticket = "Agent Camp — Early Bird (16-20/05)";
const amount = "12.868.000đ";

const html = `<!doctype html>
<html lang="vi">
<body style="margin:0;padding:0;background:#0a0a0a;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="background:#1a1a1a;border:1px solid #f59e0b33;border-radius:16px;padding:32px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:64px;height:64px;background:#22c55e22;border:1px solid #22c55e66;border-radius:50%;line-height:64px;font-size:32px;">✅</div>
      </div>

      <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;color:#f59e0b;text-align:center;">
        Thanh toán thành công!
      </h1>
      <p style="margin:0 0 24px 0;font-size:14px;color:#a8a8a8;text-align:center;">
        Cảm ơn ${name} đã đăng ký AI Agent Camp 3N2Đ
      </p>

      <div style="background:#0a0a0a;border:1px solid #f59e0b22;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px 0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Thông tin đơn hàng</p>
        <p style="margin:4px 0;font-size:14px;"><strong style="color:#f59e0b;">Mã đơn:</strong> ${orderId}</p>
        <p style="margin:4px 0;font-size:14px;"><strong style="color:#f59e0b;">Gói:</strong> ${ticket}</p>
        <p style="margin:4px 0;font-size:14px;"><strong style="color:#f59e0b;">Số tiền:</strong> ${amount}</p>
      </div>

      <div style="background:#0a0a0a;border:1px solid #f59e0b22;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
        <p style="margin:0 0 12px 0;font-size:13px;color:#a8a8a8;">
          🎯 <strong style="color:#fff;">BƯỚC CUỐI</strong> — vào nhóm Zalo riêng để nhận:
        </p>
        <ul style="text-align:left;font-size:13px;color:#d4d4d4;padding-left:20px;margin:0 0 16px 0;">
          <li style="margin-bottom:4px;">Link Zoom buổi onboarding trước camp</li>
          <li style="margin-bottom:4px;">Tài liệu chuẩn bị + checklist hành lý</li>
          <li style="margin-bottom:4px;">Thông tin chi tiết địa điểm + cách di chuyển</li>
          <li>9 bộ AI Agent quà tặng kèm sau camp</li>
        </ul>
        <a href="${zaloLink}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:#0a0a0a;font-weight:900;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;">
          VÀO NHÓM ZALO NGAY →
        </a>
      </div>

      <p style="margin:24px 0 0 0;font-size:12px;color:#666;text-align:center;line-height:1.6;">
        Cần hỗ trợ? Reply email này hoặc nhắn trực tiếp trong nhóm Zalo.<br>
        — Ban tổ chức AgentCamp
      </p>
    </div>
  </div>
</body>
</html>`;

const text = `THANH TOÁN THÀNH CÔNG ✅

Cảm ơn ${name} đã đăng ký AI Agent Camp 3N2Đ!

Thông tin đơn hàng:
- Mã đơn: ${orderId}
- Gói: ${ticket}
- Số tiền: ${amount}

BƯỚC CUỐI — vào nhóm Zalo riêng:
${zaloLink}

Trong nhóm Zalo sẽ gửi:
- Link Zoom buổi onboarding trước camp
- Tài liệu chuẩn bị + checklist hành lý
- Thông tin chi tiết địa điểm + cách di chuyển
- 9 bộ AI Agent quà tặng kèm sau camp

Cần hỗ trợ? Reply email này hoặc nhắn trực tiếp trong nhóm Zalo.
— Ban tổ chức AgentCamp`;

console.log("→ SMTP:", process.env.SMTP_HOST + ":" + process.env.SMTP_PORT);
console.log("→ From:", process.env.MAIL_FROM);
console.log("→ To:  ", TO);
console.log("→ Verifying SMTP connection...");

try {
  await transporter.verify();
  console.log("✅ SMTP auth OK");
} catch (err) {
  console.error("❌ SMTP verify failed:", err.message);
  process.exit(1);
}

console.log("→ Sending...");
try {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: TO,
    subject: `[Test] Thanh toán thành công ${orderId} — vào nhóm Zalo nhận link Zoom`,
    text,
    html,
  });
  console.log("✅ Sent! messageId:", info.messageId);
  console.log("   accepted:", info.accepted);
  console.log("   rejected:", info.rejected);
  console.log("   response:", info.response);
} catch (err) {
  console.error("❌ Send failed:", err.message);
  process.exit(1);
}
