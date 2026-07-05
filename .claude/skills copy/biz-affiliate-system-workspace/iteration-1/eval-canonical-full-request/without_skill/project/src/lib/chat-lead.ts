import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type ChatLead = {
  phone: string;
  email: string;
  name: string;
  interest?: string;
  source: "chatbot";
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
  createdAt: number;
  updatedAt: number;
};

const CHAT_LEAD_TTL_DAYS = 90; // pg_cron xoá row sau 90 ngày

const PHONE_RE = /(?:\+?84|0)(?:\d[\s.-]?){8,10}\d/g;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s.-]/g, "");
  // Convert +84xxxxxxxxx or 84xxxxxxxxx → 0xxxxxxxxx
  if (digits.startsWith("+84")) return "0" + digits.slice(3);
  if (digits.startsWith("84") && digits.length === 11) return "0" + digits.slice(2);
  if (digits.startsWith("0") && digits.length === 10) return digits;
  return null;
}

function extractPhone(text: string): string | null {
  const matches = text.match(PHONE_RE);
  if (!matches) return null;
  for (const m of matches) {
    const normalized = normalizePhone(m);
    if (normalized) return normalized;
  }
  return null;
}

function extractEmail(text: string): string | null {
  const matches = text.match(EMAIL_RE);
  return matches?.[0]?.toLowerCase() ?? null;
}

// Heuristic name extraction. Looks for VN intro patterns first, fallback to capitalized sequence.
function extractName(text: string): string | null {
  // VN intro patterns. "là/:" optional để bắt được "tên X" / "tôi là X" / "tên là X".
  const introPatterns = [
    /(?:tên|t[eê]n)\s*(?:tôi|em|anh|chị|mình|của\s+(?:tôi|em|anh|chị|mình))?\s*(?:là\s+|:\s*)?([A-ZÀ-Ỹ][\p{L}.]+(?:\s+[A-ZÀ-Ỹ][\p{L}.]+){0,4})/iu,
    /(?:tôi|em|anh|chị|mình)\s+(?:tên\s+)?là\s+([A-ZÀ-Ỹ][\p{L}.]+(?:\s+[A-ZÀ-Ỹ][\p{L}.]+){0,4})/iu,
    /(?:^|\n)\s*([A-ZÀ-Ỹ][\p{L}.]+(?:\s+[A-ZÀ-Ỹ][\p{L}.]+){1,4})\s*(?:[,-]|$|\n)/u,
  ];
  for (const re of introPatterns) {
    const m = text.match(re);
    if (m && m[1]) {
      const name = m[1].trim().replace(/\s+/g, " ");
      if (name.length >= 2 && name.length <= 50) return name;
    }
  }
  return null;
}

export type ExtractedLead = {
  phone: string;
  email: string;
  name: string;
};

// Scan toàn bộ user messages → trả về lead nếu đủ 3 trường, ngược lại null.
export function extractLeadFromMessages(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
): ExtractedLead | null {
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");

  const phone = extractPhone(userText);
  const email = extractEmail(userText);
  const name = extractName(userText);

  if (phone && email && name) {
    return { phone, email, name };
  }
  return null;
}

// Save/update chat lead vào Supabase bảng `chat_leads`.
// Dedupe by phone — same person quay lại chat sẽ update (upsert onConflict=phone).
export async function saveChatLead(params: {
  extracted: ExtractedLead;
  interest?: string;
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<{ saved: boolean; isNew: boolean }> {
  const supabase = getSupabaseAdmin();
  const phone = params.extracted.phone;
  const nowIso = new Date().toISOString();
  const expireAt = new Date(
    Date.now() + CHAT_LEAD_TTL_DAYS * 86400 * 1000,
  ).toISOString();

  // Lấy row cũ (nếu có) để giữ created_at + interest khi user quay lại chat.
  const { data: existing } = await supabase
    .from("chat_leads")
    .select("created_at, interest")
    .eq("phone", phone)
    .maybeSingle();

  const row = {
    phone,
    name: params.extracted.name,
    email: params.extracted.email,
    interest: params.interest ?? existing?.interest ?? null,
    source: "chatbot" as const,
    transcript: params.transcript.slice(-20),
    created_at: existing?.created_at ?? nowIso,
    updated_at: nowIso,
    expire_at: expireAt,
  };

  const { error } = await supabase
    .from("chat_leads")
    .upsert(row, { onConflict: "phone" });

  if (error) {
    throw new Error(`saveChatLead failed: ${error.message}`);
  }

  return { saved: true, isNew: !existing };
}
