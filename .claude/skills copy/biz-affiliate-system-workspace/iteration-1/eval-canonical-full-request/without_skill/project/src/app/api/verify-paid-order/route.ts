import { getOrderById } from "@/lib/leads-supabase";
import { ORDER_ID_REGEX } from "@/lib/orders";
import { getSummitZaloGroup } from "@/lib/plans";

export const dynamic = "force-dynamic";

// Link mặc định cho đơn không phải vé Summit (vd gói 499K).
const PAID_ZALO_LINK = "https://zalo.me/g/5oxhaaj8eykcwhm3fykn";

type Body = {
  orderId?: string;
  phone?: string;
  email?: string;
};

function normalizePhone(s: string) {
  return s.replace(/\D/g, "");
}

function normalizeEmail(s: string) {
  return s.trim().toLowerCase();
}

function bad(error: string, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return bad("invalid_json");
  }

  const orderId = body.orderId?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() ?? "";

  if (!orderId || !phone || !email) return bad("missing_fields");
  if (!ORDER_ID_REGEX.test(orderId)) return bad("invalid_order");

  const order = await getOrderById(orderId);
  if (!order) return bad("order_not_found", 404);
  if (order.status !== "paid") return bad("order_not_paid", 403);

  const phoneOk = normalizePhone(order.phone) === normalizePhone(phone);
  const emailOk = normalizeEmail(order.email) === normalizeEmail(email);
  if (!phoneOk || !emailOk) return bad("mismatch", 403);

  // Vé Summit → nhóm Zalo riêng theo đúng hạng vé khách đã mua.
  const zaloLink = order.ticket.startsWith("AI AGENT SUMMIT")
    ? getSummitZaloGroup(order.ticket)
    : PAID_ZALO_LINK;

  return Response.json({ ok: true, zaloLink });
}
