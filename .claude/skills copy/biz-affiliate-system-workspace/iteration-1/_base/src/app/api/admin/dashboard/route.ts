// app/api/admin/dashboard/route.ts
//
// GET /api/admin/dashboard?days=7|30|90
// Headers: x-admin-pass: <password>

import { checkAdminPass } from "@/lib/admin-auth";
import { getDashboardData, type PeriodDays } from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkAdminPass(request.headers.get("x-admin-pass"))) {
    return Response.json({ error: "invalid_password" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const daysParam = Number(searchParams.get("days") ?? "30");
  const days: PeriodDays = daysParam === 7 || daysParam === 90 ? daysParam : 30;

  try {
    const data = await getDashboardData(days);
    return Response.json(data);
  } catch (err) {
    console.error("[/api/admin/dashboard]", err);
    return Response.json(
      { error: "internal_error", message: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}
