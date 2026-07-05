// app/api/admin/leads/route.ts — Supabase variant
//
// GET /api/admin/leads?status=&search=&fromDate=&toDate=
// Headers: x-admin-pass: <password>

import { checkAdminPass } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads-supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkAdminPass(request.headers.get("x-admin-pass"))) {
    return Response.json({ error: "invalid_password" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  try {
    const result = await listLeads({
      status:
        (searchParams.get("status") ?? "all") as
          | "all"
          | "pending"
          | "paid"
          | "expired",
      search: searchParams.get("search") ?? "",
      fromDate: searchParams.get("fromDate") ?? undefined,
      toDate: searchParams.get("toDate") ?? undefined,
    });
    return Response.json(result);
  } catch (err) {
    console.error("[/api/admin/leads]", err);
    return Response.json(
      { error: "internal_error", message: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}
