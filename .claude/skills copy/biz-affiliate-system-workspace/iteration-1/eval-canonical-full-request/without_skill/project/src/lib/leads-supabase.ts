// lib/leads-supabase.ts
//
// Supabase Postgres lead store cho Agent Camp payment flow.
// Payment order CRUD + webhook dedup + admin queries.
//
// TTL: pending 1 ngày, paid 90 ngày. pg_cron daily cleanup.

import { getSupabaseAdmin } from "./supabase-admin";
import type { Order, OrderStatus } from "./orders";

export type { Order, OrderStatus };

const TTL_PENDING_DAYS = 1;   // giữ flow cũ — 24h cho pending
const TTL_PAID_DAYS = 90;
const TTL_DEDUP_DAYS = 7;

type LeadRow = {
  order_id: string;
  name: string;
  phone: string;
  email: string;
  ticket: string;
  amount: number;
  status: OrderStatus;
  created_at: string;
  paid_at: string | null;
  payment_record: PaymentRecord | null;
  expire_at: string;
  aff_code: string | null;
};

export type PaymentRecord = {
  sepayId?: number;
  referenceCode?: string;
  gateway?: string;
  transferAmount?: number;
  transactionDate?: string;
};

function rowToOrder(r: LeadRow): Order {
  return {
    orderId: r.order_id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    ticket: r.ticket,
    amount: Number(r.amount),
    status: r.status,
    createdAt: new Date(r.created_at).getTime(),
    paidAt: r.paid_at ? new Date(r.paid_at).getTime() : undefined,
  };
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86400 * 1000).toISOString();
}

// =============================================================================
// CRUD
// =============================================================================

export type CreateLeadInput = {
  orderId: string;
  name: string;
  phone: string;
  email: string;
  ticket: string;
  amount: number;
  affCode?: string;        // mã affiliate (nếu khách qua link aff)
};

/**
 * Insert lead với status='pending'. Trả null nếu order_id đã tồn tại (collision).
 * Caller phải retry với orderId mới.
 */
export async function createLead(input: CreateLeadInput): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  const now = new Date();
  const row = {
    order_id: input.orderId,
    name: input.name,
    phone: input.phone,
    email: input.email,
    ticket: input.ticket,
    amount: input.amount,
    status: "pending" as const,
    created_at: now.toISOString(),
    paid_at: null,
    payment_record: null,
    expire_at: daysFromNow(TTL_PENDING_DAYS),
    aff_code: input.affCode ?? null,
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(row)
    .select()
    .maybeSingle();

  if (error) {
    // 23505 = unique_violation. Collision trên order_id → caller retry.
    if (error.code === "23505") return null;
    throw new Error(`createLead failed: ${error.message}`);
  }
  return data ? rowToOrder(data as LeadRow) : null;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    console.error(`getOrderById(${orderId}) failed:`, error.message);
    return null;
  }
  return data ? rowToOrder(data as LeadRow) : null;
}

/**
 * Mark order = paid + persist Sepay payload. Extend expire_at lên 90 ngày.
 * Idempotent: gọi lại trên order đã paid không thay đổi gì.
 */
export async function markOrderPaid(
  orderId: string,
  payment: PaymentRecord,
): Promise<Order | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      payment_record: payment,
      expire_at: daysFromNow(TTL_PAID_DAYS),
    })
    .eq("order_id", orderId)
    .eq("status", "pending") // chỉ update nếu chưa paid → idempotent
    .select()
    .maybeSingle();

  if (error) {
    console.error(`markOrderPaid(${orderId}) failed:`, error.message);
    return null;
  }
  return data ? rowToOrder(data as LeadRow) : null;
}

// =============================================================================
// Webhook dedup
// =============================================================================

/**
 * Try-insert sepay_id. Returns true if newly inserted (first time seeing),
 * false if already exists (duplicate webhook — skip).
 */
export async function tryMarkWebhookProcessed(sepayId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("webhook_dedup")
    .insert({ sepay_id: sepayId, expire_at: daysFromNow(TTL_DEDUP_DAYS) });

  if (!error) return true;
  // 23505 = duplicate. Đã processed.
  if (error.code === "23505") return false;
  console.error(`tryMarkWebhookProcessed(${sepayId}) failed:`, error.message);
  return false;
}

// =============================================================================
// Admin queries
// =============================================================================

export type LeadFilter = {
  status?: OrderStatus | "all";
  search?: string;
  fromDate?: string;
  toDate?: string;
};

export type LeadView = {
  orderId: string;
  name: string;
  phone: string;
  email: string;
  productName: string;        // = ticket — keep view name cho UI
  amount: number;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
};

export async function listLeads(filter: LeadFilter = {}): Promise<{
  leads: LeadView[];
  stats: { totalAll: number; totalPaid: number; totalPending: number; revenue: number };
}> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`listLeads failed: ${error.message}`);
  const all = ((data ?? []) as LeadRow[]).map(rowToOrder);

  const stats = { totalAll: all.length, totalPaid: 0, totalPending: 0, revenue: 0 };
  for (const o of all) {
    if (o.status === "paid") {
      stats.totalPaid++;
      stats.revenue += o.amount ?? 0;
    } else if (o.status === "pending") {
      stats.totalPending++;
    }
  }

  let filtered = all;
  if (filter.status && filter.status !== "all") {
    filtered = filtered.filter((o) => o.status === filter.status);
  }
  if (filter.search) {
    const s = filter.search.toLowerCase().trim();
    filtered = filtered.filter(
      (o) =>
        o.name.toLowerCase().includes(s) ||
        o.phone.includes(s) ||
        o.email.toLowerCase().includes(s) ||
        o.orderId.toLowerCase().includes(s),
    );
  }
  if (filter.fromDate) {
    const from = new Date(filter.fromDate).getTime();
    if (Number.isFinite(from)) filtered = filtered.filter((o) => o.createdAt >= from);
  }
  if (filter.toDate) {
    const to = new Date(filter.toDate).getTime();
    if (Number.isFinite(to)) filtered = filtered.filter((o) => o.createdAt <= to);
  }

  const leads: LeadView[] = filtered.map((o) => ({
    orderId: o.orderId,
    name: o.name,
    phone: o.phone,
    email: o.email,
    productName: o.ticket,
    amount: o.amount,
    status: o.status,
    createdAt: new Date(o.createdAt).toISOString(),
    paidAt: o.paidAt ? new Date(o.paidAt).toISOString() : undefined,
  }));

  return { leads, stats };
}
