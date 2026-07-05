// lib/admin-mailer.ts
//
// Bulk email transport cho admin campaigns tab. Reuse SMTP_* env của lib/mailer.ts.
// Tách file riêng để không phá P3/P5 transactional flow trong lib/mailer.ts.
//
// Helper render nội dung (text/HTML, wrap khung, personalize) nằm ở
// lib/email-render.ts — module thuần, dùng chung với client preview trong /admin.
// Re-export lại ở đây để code cũ import từ '@/lib/admin-mailer' vẫn chạy.

import nodemailer, { type Transporter } from "nodemailer";

export {
  textToHtml,
  personalize,
  wrapEmailHtml,
  renderCampaignEmail,
} from "./email-render";
export type { BodyFormat } from "./email-render";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error(
      "SMTP chưa cấu hình — set SMTP_HOST/SMTP_USER/SMTP_PASS trong .env.local",
    );
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

const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || "";

export type SendResult = { ok: true; messageId: string } | { ok: false; error: string };

export async function sendOne(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendResult> {
  try {
    const info = await getTransporter().sendMail({
      from: MAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
