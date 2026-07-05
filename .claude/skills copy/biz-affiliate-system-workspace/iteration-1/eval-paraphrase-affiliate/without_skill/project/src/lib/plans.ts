export const PLAN_PRICES: Record<string, number> = {
  "Agent Camp — Early Bird (16-20/05)": 12_868_000,
  "Agent Camp — Giai đoạn 2 (20-25/05)": 19_868_000,
  "Agent Camp — Giá public (sau 25/05)": 26_868_000,
  "Agent Camp — Elite ưu tiên": 3_868_000,

  // AI AGENT SUMMIT — vé 3 hạng
  "AI AGENT SUMMIT — Vé Thường": 499_000,
  "AI AGENT SUMMIT — Vé VIP": 999_000,
  "AI AGENT SUMMIT — Vé Super VIP": 1_999_000,
};

export function getPlanPrice(name: string): number {
  return PLAN_PRICES[name] ?? 0;
}

export function isPaidPlan(name: string): boolean {
  return getPlanPrice(name) > 0;
}

// Nhóm Zalo riêng cho từng hạng vé AI AGENT SUMMIT. Sau khi thanh toán thành
// công, khách được mời vào đúng nhóm tương ứng — qua email P5 và trang /cam-on.
export const SUMMIT_ZALO_GROUPS: Record<string, string> = {
  "AI AGENT SUMMIT — Vé Thường": "https://zalo.me/g/wri0ttzfzdl66pghbdau",
  "AI AGENT SUMMIT — Vé VIP": "https://zalo.me/g/nfg1remuhvzjbgnjtff5",
  "AI AGENT SUMMIT — Vé Super VIP": "https://zalo.me/g/7zprsng5ev56pmuetvk9",
};

// Trả link nhóm Zalo theo hạng vé. Khớp chính xác tên vé trước; nếu lệch
// (khoảng trắng / dấu) thì fallback theo keyword — phải kiểm tra "SUPER VIP"
// trước "VIP" vì "VIP" là chuỗi con của "SUPER VIP".
export function getSummitZaloGroup(ticket: string): string {
  const exact = SUMMIT_ZALO_GROUPS[ticket.trim()];
  if (exact) return exact;
  const u = ticket.toUpperCase();
  if (u.includes("SUPER VIP")) {
    return SUMMIT_ZALO_GROUPS["AI AGENT SUMMIT — Vé Super VIP"];
  }
  if (u.includes("VIP")) {
    return SUMMIT_ZALO_GROUPS["AI AGENT SUMMIT — Vé VIP"];
  }
  return SUMMIT_ZALO_GROUPS["AI AGENT SUMMIT — Vé Thường"];
}
