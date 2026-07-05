import { systemPrompt } from "@/lib/chatbot-knowledge";
import { extractLeadFromMessages, saveChatLead } from "@/lib/chat-lead";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Default model. Đổi sang "anthropic/claude-sonnet-4.6" nếu muốn chất lượng cao hơn (đắt ~10x).
const MODEL = "google/gemini-3-flash-preview";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessage[];
};

const MAX_MESSAGES = 30;
const MAX_CONTENT_CHARS = 2000;

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (typeof content !== "string") continue;
    if (role !== "user" && role !== "assistant") continue;
    const trimmed = content.trim().slice(0, MAX_CONTENT_CHARS);
    if (!trimmed) continue;
    out.push({ role, content: trimmed });
  }
  return out.slice(-MAX_MESSAGES);
}

function bad(error: string, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return bad("OPENROUTER_API_KEY chưa được cấu hình trong .env.local", 500);
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return bad("invalid_json");
  }

  const history = sanitizeMessages(body.messages);
  if (history.length === 0) {
    return bad("empty_messages");
  }

  const referer =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.LANDING_PAGE_URL ??
    "http://localhost:3000";

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
      "X-Title": "AI Agent Camp Chatbot",
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    console.error("[chat] OpenRouter error", upstream.status, errText);
    return bad(`upstream_${upstream.status}`, 502);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();

  let assistantText = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
            persistLeadIfReady(history, assistantText);
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;
            if (line.startsWith(":")) continue;
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") {
              controller.close();
              persistLeadIfReady(history, assistantText);
              return;
            }
            try {
              const json = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const delta = json.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                assistantText += delta;
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // ignore malformed chunks
            }
          }
        }
      } catch (err) {
        console.error("[chat] stream error", err);
        controller.error(err);
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

// Fire-and-forget: scan toàn bộ conversation, nếu đủ name+phone+email thì lưu Supabase.
// Không block stream response.
function persistLeadIfReady(
  history: ChatMessage[],
  assistantText: string,
): void {
  void (async () => {
    try {
      const extracted = extractLeadFromMessages(history);
      if (!extracted) return;
      const fullTranscript: ChatMessage[] = [
        ...history,
        { role: "assistant", content: assistantText },
      ];
      const result = await saveChatLead({
        extracted,
        transcript: fullTranscript,
      });
      console.log(
        `[chat] lead ${result.isNew ? "saved" : "updated"}:`,
        extracted.phone,
        extracted.email,
      );
    } catch (err) {
      console.error("[chat] persist lead failed", err);
    }
  })();
}
