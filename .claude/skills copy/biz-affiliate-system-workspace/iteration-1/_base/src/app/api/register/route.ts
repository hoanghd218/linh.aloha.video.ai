import { getPlanPrice, isPaidPlan } from "@/lib/plans";
import { createLead } from "@/lib/leads-supabase";
import { generateOrderId } from "@/lib/orders";
import { sendP3PrePayment } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const N8N_URL = process.env.N8N_REGISTER_WEBHOOK_URL;

type FbTrackingBody = {
  eventId?: string;
  eventSourceUrl?: string;
  userAgent?: string;
  referrer?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
};

type RegisterBody = {
  name?: string;
  phone?: string;
  email?: string;
  ticket?: string;
  fb?: FbTrackingBody;
};

function bad(error: string, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function extractClientIp(request: Request): string | undefined {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || undefined;
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    undefined
  );
}

async function forwardToN8n(payload: Record<string, unknown>) {
  if (!N8N_URL) {
    console.warn("[register] N8N_REGISTER_WEBHOOK_URL not set, skip forward");
    return;
  }
  try {
    await fetch(N8N_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    console.error("[register] n8n forward failed", err);
  }
}

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return bad("invalid_json");
  }

  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const ticket = body.ticket?.trim() ?? "";

  if (!name || !phone || !email || !ticket) {
    return bad("missing_required_fields");
  }
  if (!/^\d{8,15}$/.test(phone.replace(/\D/g, ""))) {
    return bad("invalid_phone");
  }

  const amount = getPlanPrice(ticket);
  const createdAt = Date.now();
  const fb = {
    ...(body.fb ?? {}),
    clientIp: extractClientIp(request),
    userAgent: body.fb?.userAgent ?? request.headers.get("user-agent") ?? undefined,
  };
  const basePayload = {
    name,
    phone,
    email,
    ticket,
    createdAt: new Date(createdAt).toISOString(),
    fb,
  };

  if (!isPaidPlan(ticket)) {
    await forwardToN8n(basePayload);
    return Response.json({ ok: true, paid: false });
  }

  // Tạo lead trong Supabase. Collision trên order_id → retry tối đa 3 lần.
  let orderId: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = generateOrderId();
    try {
      const lead = await createLead({
        orderId: candidate,
        name,
        phone,
        email,
        ticket,
        amount,
      });
      if (lead) {
        orderId = candidate;
        break;
      }
      // null = unique_violation → retry với orderId mới
    } catch (err) {
      console.error("[register] createLead failed", err);
      return bad("internal_error", 500);
    }
  }
  if (!orderId) {
    console.error("[register] orderId collision retries exhausted");
    return bad("internal_error", 500);
  }

  await forwardToN8n({ ...basePayload, orderId, amount, status: "pending" });

  await sendP3PrePayment({
    name,
    email,
    phone,
    ticket,
    amount,
    orderId,
  });

  return Response.json({ ok: true, paid: true, orderId, amount });
}
