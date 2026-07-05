"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string };

const STORAGE_KEY = "agentcamp_chat_history_v1";
const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Em chào anh/chị 👋 Em là trợ lý tư vấn AI Agent Camp 3N2Đ tại Đà Lạt. Anh/chị muốn em tư vấn về nội dung 3 ngày, giá tier hiện tại, hay cách đăng ký giữ chỗ?",
};

const QUICK_QUESTIONS = [
  "Giá hiện tại bao nhiêu?",
  "Lịch trình 3 ngày học gì?",
  "Tôi kinh doanh cá nhân có phù hợp không?",
  "Cách đăng ký giữ chỗ?",
];

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [unread, setUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist history
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Auto scroll on new message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isOpen]);

  // Lock body scroll when fullscreen on mobile
  useEffect(() => {
    if (!isOpen) return;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    if (!isMobile) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setUnread(false);
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const apiMessages = useMemo(
    () =>
      messages
        .filter((m) => m.id !== "welcome")
        .map(({ role, content }) => ({ role, content })),
    [messages],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMsg: Message = { id: uid(), role: "user", content: trimmed };
      const assistantId = uid();
      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setInput("");
      setIsSending(true);

      const payload = [...apiMessages, { role: "user", content: trimmed }];

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
        });

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      "Em xin lỗi, hệ thống đang gặp sự cố. Anh/chị thử lại sau ít phút hoặc để lại form đăng ký để team gọi tư vấn trực tiếp nhé." +
                      (errText ? `\n\n(Error: ${errText.slice(0, 120)})` : ""),
                  }
                : m,
            ),
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: buffer } : m)),
          );
        }
      } catch (err) {
        console.error("[chatbot] send failed", err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "Mạng đang chập chờn. Anh/chị thử lại giúp em, hoặc kéo lên form đăng ký để team liên hệ trực tiếp nhé.",
                }
              : m,
          ),
        );
      } finally {
        setIsSending(false);
        if (!isOpen) setUnread(true);
      }
    },
    [apiMessages, isSending, isOpen],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* Floating bubble */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Mở chat tư vấn"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-2xl shadow-amber-900/40 ring-2 ring-amber-300/30 transition hover:scale-105 active:scale-95"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
        >
          <span className="material-symbols-outlined text-2xl">chat</span>
          {unread && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          className="fixed z-[9999] flex flex-col overflow-hidden bg-neutral-950 text-neutral-100 shadow-2xl ring-1 ring-amber-500/20
            inset-0 sm:inset-auto
            sm:bottom-6 sm:right-6
            sm:w-[380px] sm:h-[70vh]
            sm:max-h-[600px]
            sm:rounded-2xl
            lg:w-[400px] lg:h-[600px]"
          role="dialog"
          aria-label="AI Agent Camp Chatbot"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-900/40 to-neutral-900 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight truncate">
                  Trợ lý AI Agent Camp
                </div>
                <div className="text-[11px] text-amber-300/80 leading-tight truncate">
                  Tư vấn 24/7 · The AI First
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Bắt đầu lại"
                className="rounded-md p-2 text-neutral-400 hover:bg-white/5 hover:text-white"
                aria-label="Bắt đầu lại"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng"
                className="rounded-md p-2 text-neutral-400 hover:bg-white/5 hover:text-white"
                aria-label="Đóng chat"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            style={{ scrollbarWidth: "thin" }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-amber-600 text-white rounded-br-sm whitespace-pre-wrap"
                      : "bg-neutral-800 text-neutral-100 rounded-bl-sm ring-1 ring-white/5 chatbot-md"
                  }`}
                >
                  {m.content ? (
                    m.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: (props) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-300 underline underline-offset-2 hover:text-amber-200"
                            />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    ) : (
                      m.content
                    )
                  ) : (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Quick questions chỉ hiện khi mới mở */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void sendMessage(q)}
                    disabled={isSending}
                    className="rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-200 transition hover:bg-amber-500/15 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/5 bg-neutral-900/80 px-3 py-3"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0))" }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi của anh/chị..."
                rows={1}
                disabled={isSending}
                className="max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-amber-500/50 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Gửi"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-lg">
                  {isSending ? "hourglass_top" : "send"}
                </span>
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-neutral-500">
              Câu trả lời do AI tạo. Để chốt giữ chỗ, anh/chị vui lòng điền form đăng ký trên trang.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
