import { timingSafeEqual } from "node:crypto";

export function checkAdminPass(headerPass: string | null): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !headerPass) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(headerPass, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
