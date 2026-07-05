"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isPaidPlan } from "@/lib/plans";
import { collectFbTracking } from "@/lib/fb-tracking";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const REGISTER_WEBHOOK_URL =
  "https://n8n.bimspeed.net/webhook/e593c1ea-a898-476b-8284-6cde0191400c";

type Session = {
  /** Unix ms */
  time: number;
  /** Display label, e.g. "Agent Camp — Ba Vì — 29-31/05" */
  label: string;
};

type TicketOption = {
  /** Submitted value — must match a key in PLAN_PRICES for paid plans */
  value: string;
  /** Text shown in the <option> */
  label: string;
};

/** Default ticket list — Agent Camp (used by the homepage). */
const DEFAULT_TICKET_OPTIONS: TicketOption[] = [
  {
    value: "Agent Camp — Early Bird (16-20/05)",
    label: "Early Bird — 12.868.000đ (tiết kiệm 14 triệu, hết hạn 20/05)",
  },
  {
    value: "Agent Camp — Giai đoạn 2 (20-25/05)",
    label: "Giai đoạn 2 — 19.868.000đ (20-25/05)",
  },
  {
    value: "Agent Camp — Giá public (sau 25/05)",
    label: "Giá public — 26.868.000đ (sau 25/05)",
  },
  {
    value: "Agent Camp — Elite ưu tiên",
    label: "Elite ưu tiên — 3.868.000đ (chỉ dành cho thành viên Elite)",
  },
];

type Props = {
  sessions: Session[];
  totalSlots: number;
  registered: number;
  /** e.g. "ghế camp" */
  slotLabel: string;
  formTitle?: string;
  formSubtitle?: string;
  /** Defaults to "/cam-on" */
  redirectTo?: string;
  /** Show the countdown badge + clock. Off for events with no fixed date yet. */
  showCountdown?: boolean;
  /** Red countdown badge text. */
  countdownLabel?: string;
  /** Ticket choices for the <select>. Defaults to the Agent Camp tiers. */
  ticketOptions?: TicketOption[];
  /** Label above the ticket <select>. */
  ticketFieldLabel?: string;
  /** Small note under the slot progress bar. */
  slotNote?: string;
  /** Submit button text. */
  submitLabel?: string;
  /** Fine-print note under the submit button. */
  footerNote?: string;
  /** Path for the paid-ticket checkout redirect. Defaults to "/thanh-toan". */
  paidCheckoutPath?: string;
};

type FormState = "idle" | "submitting" | "error";

function getNextSession(now: number, sessions: Session[]) {
  return (
    sessions.find((s) => now < s.time) ?? sessions[sessions.length - 1] ?? null
  );
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export default function RegisterFormSection({
  sessions,
  totalSlots,
  registered,
  slotLabel,
  formTitle = "Đăng ký giữ chỗ Agent Camp",
  formSubtitle = "Điền thông tin để giữ chỗ + nhận hướng dẫn đặt cọc và tài liệu chuẩn bị trước camp",
  redirectTo = "/cam-on",
  showCountdown = true,
  countdownLabel = "ĐẾM NGƯỢC ĐẾN AGENT CAMP",
  ticketOptions = DEFAULT_TICKET_OPTIONS,
  ticketFieldLabel = "Chọn gói vé *",
  slotNote,
  submitLabel = "GIỮ CHỖ + ĐẶT CỌC",
  footerNote = "Sau khi đăng ký bạn sẽ nhận hướng dẫn đặt cọc VietQR + link nhóm Zalo Agent Camp.",
  paidCheckoutPath = "/thanh-toan",
}: Props) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // SSR-safe: read the client clock only after mount to avoid hydration
    // mismatch — `now` stays null on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const session = now !== null ? getNextSession(now, sessions) : sessions[0];
  if (!session) return null;

  const remainingMs = now !== null ? session.time - now : 0;
  const { days, hours, minutes, seconds } = formatTime(remainingMs);

  const remaining = Math.max(0, totalSlots - registered);
  const percentage = Math.min(100, (registered / totalSlots) * 100);

  const resolvedSlotNote =
    slotNote ??
    `Mastermind giới hạn ${totalSlots} ghế — đảm bảo chất lượng tương tác và cá nhân hoá`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formState === "submitting") return;

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const ticket = String(formData.get("ticket") ?? "").trim();

    if (!name || !phone || !email) {
      setFormState("error");
      setErrorMsg("Vui lòng nhập đủ họ tên, số điện thoại và email.");
      return;
    }

    setFormState("submitting");
    setErrorMsg("");

    const fb = collectFbTracking();

    try {
      if (isPaidPlan(ticket)) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email, ticket, fb }),
        });
        if (!res.ok) {
          throw new Error(`Đăng ký thất bại (${res.status})`);
        }
        const data = (await res.json()) as {
          ok?: boolean;
          orderId?: string;
          amount?: number;
        };
        if (!data.ok || !data.orderId) {
          throw new Error("Không nhận được mã đơn, vui lòng thử lại.");
        }
        if (typeof window !== "undefined" && typeof window.fbq === "function") {
          window.fbq(
            "track",
            "InitiateCheckout",
            { value: data.amount ?? 0, currency: "VND" },
            fb?.eventId ? { eventID: fb.eventId } : undefined,
          );
        }
        formEl.reset();
        router.push(`${paidCheckoutPath}?order=${data.orderId}`);
        return;
      }

      const res = await fetch(REGISTER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          ticket,
          createdAt: new Date().toISOString(),
          fb,
        }),
      });
      if (!res.ok) {
        throw new Error(`Webhook trả về ${res.status}`);
      }
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq(
          "track",
          "Lead",
          {},
          fb?.eventId ? { eventID: fb.eventId } : undefined,
        );
      }
      formEl.reset();
      router.push(redirectTo);
    } catch (err) {
      setFormState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.",
      );
    }
  }

  return (
    <section id="register" className="py-6 sm:py-12 px-4 sm:px-6 scroll-mt-28">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-surface-container-high rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 border border-primary-container/30 overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-40 sm:w-60 h-40 sm:h-60 bg-primary-container/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-32 sm:w-40 h-32 sm:h-40 bg-secondary-container/20 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 space-y-4 sm:space-y-8">
            {/* Session label */}
            <div className="text-center">
              {showCountdown && (
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 animate-pulse">
                  <span className="flex h-2 w-2 rounded-full bg-red-500" />
                  {countdownLabel}
                </div>
              )}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-on-surface">
                {session.label}
              </h3>
            </div>

            {/* Countdown boxes */}
            {showCountdown && (
              <div className="flex justify-center gap-2 sm:gap-3 md:gap-6">
                {[
                  { value: days, label: "Ngày" },
                  { value: hours, label: "Giờ" },
                  { value: minutes, label: "Phút" },
                  { value: seconds, label: "Giây" },
                ].map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-surface rounded-lg sm:rounded-2xl border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.1)] countdown-flip">
                      <span className="text-2xl sm:text-3xl md:text-5xl font-black text-primary tabular-nums">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs md:text-sm text-on-surface-variant font-bold uppercase mt-1.5 sm:mt-2">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Slot progress */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs sm:text-sm">
                <span className="text-on-surface-variant">
                  <span className="text-primary font-black text-base sm:text-lg">
                    {registered}
                  </span>{" "}
                  / {totalSlots} {slotLabel} đã giữ chỗ
                </span>
                <span className="text-red-400 font-bold animate-pulse">
                  Chỉ còn {remaining} {slotLabel}!
                </span>
              </div>
              <div className="relative w-full h-3 sm:h-4 bg-surface rounded-full overflow-hidden border border-primary/10">
                <div
                  className="h-full bg-linear-to-r from-primary to-secondary-container rounded-full transition-all duration-1000 slot-bar-glow"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-center text-on-surface-variant text-[10px] sm:text-xs">
                {resolvedSlotNote}
              </p>
            </div>

            {/* Registration form */}
            <div className="bg-surface/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="text-base sm:text-xl font-black text-on-surface uppercase tracking-tight">
                    {formTitle}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-on-surface-variant">
                    {formSubtitle}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <label className="block">
                    <span className="text-[11px] sm:text-xs font-bold uppercase text-on-surface-variant tracking-wider">
                      Họ và tên *
                    </span>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Nguyễn Văn A"
                      disabled={formState === "submitting"}
                      className="mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface border border-primary/20 text-on-surface text-sm sm:text-base placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-colors"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] sm:text-xs font-bold uppercase text-on-surface-variant tracking-wider">
                      Số điện thoại *
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="0901234567"
                      disabled={formState === "submitting"}
                      className="mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface border border-primary/20 text-on-surface text-sm sm:text-base placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-colors"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[11px] sm:text-xs font-bold uppercase text-on-surface-variant tracking-wider">
                    Email *
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="ban@email.com"
                    disabled={formState === "submitting"}
                    className="mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface border border-primary/20 text-on-surface text-sm sm:text-base placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-colors"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] sm:text-xs font-bold uppercase text-on-surface-variant tracking-wider">
                    {ticketFieldLabel}
                  </span>
                  <select
                    name="ticket"
                    required
                    defaultValue={ticketOptions[0]?.value}
                    disabled={formState === "submitting"}
                    className="mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface border border-primary/20 text-on-surface text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-colors appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e\")",
                      backgroundPosition: "right 1rem center",
                    }}
                  >
                    {ticketOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                {formState === "error" && errorMsg && (
                  <div className="text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full inline-flex items-center justify-center gap-2 sm:gap-3 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base hover:scale-[1.02] active:scale-95 transition-all duration-300 animate-pulse-glow disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {formState === "submitting" ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      ĐANG GỬI...
                    </>
                  ) : (
                    <>
                      {submitLabel}
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>

                <p className="text-[10px] sm:text-xs text-on-surface-variant/70 text-center">
                  {footerNote}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
