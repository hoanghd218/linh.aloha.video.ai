import { getOrderById } from "@/lib/leads-supabase";
import { ORDER_ID_REGEX } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order")?.trim() ?? "";

  if (!ORDER_ID_REGEX.test(orderId)) {
    return Response.json(
      { ok: false, error: "invalid_order_id" },
      { status: 400 },
    );
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return Response.json(
      { ok: false, error: "not_found" },
      { status: 404 },
    );
  }

  return Response.json(
    { ok: true, status: order.status, amount: order.amount },
    { headers: { "Cache-Control": "no-store" } },
  );
}
