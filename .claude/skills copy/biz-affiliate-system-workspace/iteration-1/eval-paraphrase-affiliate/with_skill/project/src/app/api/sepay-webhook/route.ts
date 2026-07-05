import { timingSafeEqual } from "node:crypto";
import {
  getOrderById,
  markOrderPaid,
  tryMarkWebhookProcessed,
} from "@/lib/leads-supabase";
import { extractOrderId } from "@/lib/orders";
import { sendP5PostPayment } from "@/lib/mailer";
import { recordCommissionForOrder } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

const SEPAY_KEY = process.env.SEPAY_API_KEY;

type SepayPayload = {
  id?: number;
  gateway?: string;
  transferType?: string;
  transferAmount?: number;
  content?: string;
  description?: string;
  code?: string | null;
  referenceCode?: string;
  accountNumber?: string;
  transactionDate?: string;
};

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function ok(message: string) {
  return Response.json({ ok: true, message });
}

export async function POST(request: Request) {
  if (!SEPAY_KEY) {
    console.error("[sepay-webhook] SEPAY_API_KEY missing");
    return ok("server_misconfigured");
  }

  const auth = request.headers.get("authorization") ?? "";
  const provided = auth
    .replace(/^Apikey\s+/i, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
  if (!provided || !safeEqual(provided, SEPAY_KEY)) {
    console.warn("[sepay-webhook] unauthorized request");
    return ok("unauthorized");
  }

  let body: SepayPayload;
  try {
    body = (await request.json()) as SepayPayload;
  } catch {
    console.error("[sepay-webhook] invalid json");
    return ok("invalid_json");
  }

  // Dedup webhook calls trên sepay id
  if (body.id != null) {
    const fresh = await tryMarkWebhookProcessed(String(body.id));
    if (!fresh) {
      return ok("duplicate_webhook");
    }
  }

  if (body.transferType && body.transferType !== "in") {
    return ok("ignored_non_in");
  }

  const sources = [body.code, body.content, body.description].filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  let orderId: string | null = null;
  for (const src of sources) {
    orderId = extractOrderId(src);
    if (orderId) break;
  }
  if (!orderId) {
    console.warn("[sepay-webhook] no order id in payload", {
      content: body.content,
      code: body.code,
    });
    return ok("no_order_id");
  }

  const order = await getOrderById(orderId);
  if (!order) {
    console.warn("[sepay-webhook] order not found", orderId);
    return ok("order_not_found");
  }

  const transferred = Number(body.transferAmount ?? 0);
  if (transferred < order.amount) {
    console.warn("[sepay-webhook] amount short", {
      orderId,
      expected: order.amount,
      got: transferred,
    });
    return ok("amount_short");
  }

  if (order.status === "paid") {
    return ok("already_paid");
  }

  const paid = await markOrderPaid(orderId, {
    sepayId: body.id,
    referenceCode: body.referenceCode,
    gateway: body.gateway,
    transferAmount: transferred,
    transactionDate: body.transactionDate,
  });

  if (!paid) {
    // Race: webhook khác đã mark trước. Idempotent — coi như OK.
    return ok("already_paid_race");
  }

  // Tạo hoa hồng affiliate — best-effort, KHÔNG để lỗi làm fail webhook.
  try {
    await recordCommissionForOrder(order.orderId);
  } catch (err) {
    console.error("[sepay-webhook] recordCommission failed", err);
  }

  await sendP5PostPayment({
    name: order.name,
    email: order.email,
    phone: order.phone,
    ticket: order.ticket,
    amount: order.amount,
    orderId: order.orderId,
  });

  return ok("paid_confirmed");
}
