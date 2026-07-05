"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ZALO_LINK = "https://zalo.me/g/kxvavk323";
const TIMEOUT_SECONDS = 600; // 10 phút

// Backoff: nhanh ở đầu (user vừa quét xong), chậm dần để giảm số request poll.
const POLL_INTERVALS_MS = [
  5000, 5000, 5000, 5000, 5000, 5000, // 0-30s
  10000, 10000, 10000, 10000, 10000, 10000, // 30-90s
  15000, // 15s sau đó cho tới timeout
];

type Props = {
  orderId: string;
  amount: number;
  ticket: string;
  qrUrl: string;
  account: string;
  bank: string;
  /** Optional line under the heading, e.g. event name + date. */
  eventNote?: string;
};

type Status = "pending" | "paid" | "timeout";

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function formatMmSs(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PaymentClient({
  orderId,
  amount,
  ticket,
  qrUrl,
  account,
  bank,
  eventNote,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("pending");
  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_SECONDS);
  const [copied, setCopied] = useState<"order" | "account" | null>(null);
  const cancelledRef = useRef(false);

  // Countdown
  useEffect(() => {
    if (status !== "pending") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setStatus((curr) => (curr === "pending" ? "timeout" : curr));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  // Polling with backoff
  useEffect(() => {
    cancelledRef.current = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function poll() {
      if (cancelledRef.current) return;
      try {
        const res = await fetch(
          `/api/payment-status?order=${encodeURIComponent(orderId)}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = (await res.json()) as { status?: Status };
          if (data.status === "paid" && !cancelledRef.current) {
            setStatus("paid");
            setTimeout(
              () => router.push(`/cam-on?order=${encodeURIComponent(orderId)}`),
              1500,
            );
            return;
          }
        }
      } catch {
        // Ignore network errors, retry next tick
      }
      if (cancelledRef.current) return;
      const interval =
        POLL_INTERVALS_MS[Math.min(attempt, POLL_INTERVALS_MS.length - 1)];
      attempt += 1;
      timer = setTimeout(poll, interval);
    }

    timer = setTimeout(poll, POLL_INTERVALS_MS[0]);
    return () => {
      cancelledRef.current = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, router]);

  // Stop polling when paid/timeout
  useEffect(() => {
    if (status !== "pending") {
      cancelledRef.current = true;
    }
  }, [status]);

  async function copy(text: string, key: "order" | "account") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <main className="min-h-screen bg-surface text-on-surface px-4 sm:px-6 py-8 sm:py-14">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-base">qr_code_2</span>
            Thanh toán {ticket}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Quét QR để hoàn tất đăng ký
          </h1>
          {eventNote && (
            <p className="text-xs sm:text-sm font-bold text-primary">
              {eventNote}
            </p>
          )}
          {status === "pending" && (
            <p className="text-sm text-on-surface-variant">
              Thời gian giữ slot:{" "}
              <span className="font-bold text-primary tabular-nums">
                {formatMmSs(secondsLeft)}
              </span>
            </p>
          )}
        </div>

        {/* Status banner */}
        {status === "paid" && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 px-5 py-4 text-center">
            <div className="inline-flex items-center gap-2 text-green-400 font-black uppercase">
              <span className="material-symbols-outlined">check_circle</span>
              Đã nhận thanh toán! Đang chuyển trang...
            </div>
          </div>
        )}
        {status === "timeout" && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 text-red-400 font-black uppercase">
              <span className="material-symbols-outlined">schedule</span>
              Quá 10 phút chưa nhận được thanh toán
            </div>
            <p className="text-sm text-on-surface-variant">
              Nếu bạn đã chuyển khoản, vui lòng vào nhóm Zalo để admin xác nhận
              thủ công.
            </p>
            <a
              className="inline-flex items-center gap-2 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-6 py-3 rounded-xl font-black text-sm hover:scale-[1.03] active:scale-95 transition-all"
              href={ZALO_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              VÀO NHÓM ZALO
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        )}

        {/* QR + Info */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* QR card */}
          <div className="relative bg-surface-container-high rounded-2xl p-5 sm:p-6 border border-primary/20 flex flex-col items-center gap-3">
            <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Quét bằng app ngân hàng
            </div>
            <div className="w-full max-w-xs bg-white rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt={`Mã QR thanh toán ${formatVnd(amount)}`}
                className="w-full h-auto block"
              />
            </div>
            <p className="text-[11px] text-on-surface-variant text-center">
              Đợi 5-30 giây sau khi chuyển — trang sẽ tự động chuyển khi nhận
              được thanh toán.
            </p>
          </div>

          {/* Info card */}
          <div className="bg-surface-container-high rounded-2xl p-5 sm:p-6 border border-primary/20 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Hoặc chuyển khoản thủ công
            </div>

            <Row
              label="Ngân hàng"
              value={bank}
            />

            <Row
              label="Số tài khoản"
              value={account}
              onCopy={() => copy(account, "account")}
              copied={copied === "account"}
            />

            <Row
              label="Số tiền"
              value={formatVnd(amount)}
              valueClass="text-primary text-xl font-black"
            />

            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                Nội dung chuyển khoản
              </div>
              <div className="rounded-xl border-2 border-red-500/60 bg-red-500/10 px-4 py-3 flex items-center justify-between gap-3">
                <span className="font-black text-lg sm:text-xl text-red-300 tabular-nums tracking-wider">
                  {orderId}
                </span>
                <button
                  type="button"
                  onClick={() => copy(orderId, "order")}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase text-red-200 hover:text-red-100"
                >
                  <span className="material-symbols-outlined text-base">
                    {copied === "order" ? "check" : "content_copy"}
                  </span>
                  {copied === "order" ? "Đã copy" : "Copy"}
                </button>
              </div>
              <p className="text-[11px] text-red-300 font-bold">
                ⚠️ BẮT BUỘC điền đúng nội dung này. Sai → hệ thống không tự xác
                nhận được.
              </p>
            </div>
          </div>
        </div>

        {/* Help link */}
        <div className="text-center pt-2">
          <a
            href={ZALO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">help</span>
            Cần hỗ trợ? Vào nhóm Zalo
          </a>
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  onCopy,
  copied,
  valueClass,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-primary/10 pb-3 last:border-0 last:pb-0">
      <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={
            valueClass ?? "font-bold text-on-surface text-sm sm:text-base"
          }
        >
          {value}
        </span>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center text-on-surface-variant hover:text-primary"
            aria-label={`Copy ${label}`}
          >
            <span className="material-symbols-outlined text-base">
              {copied ? "check" : "content_copy"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
