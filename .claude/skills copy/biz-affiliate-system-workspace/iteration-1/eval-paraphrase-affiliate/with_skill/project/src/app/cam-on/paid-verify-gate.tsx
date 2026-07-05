"use client";

import { useState } from "react";

type State = "idle" | "submitting" | "success" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  mismatch:
    "Số điện thoại hoặc email không khớp với đơn hàng. Vui lòng kiểm tra lại đúng thông tin lúc đăng ký.",
  order_not_paid: "Đơn hàng chưa được xác nhận thanh toán.",
  order_not_found: "Không tìm thấy đơn hàng.",
  invalid_order: "Mã đơn không hợp lệ.",
  missing_fields: "Vui lòng nhập đủ số điện thoại và email.",
};

export default function PaidVerifyGate({ orderId }: { orderId: string }) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [zaloLink, setZaloLink] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!phone || !email) {
      setState("error");
      setErrorMsg("Vui lòng nhập đủ số điện thoại và email.");
      return;
    }

    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/verify-paid-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, phone, email }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        zaloLink?: string;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.zaloLink) {
        setState("error");
        setErrorMsg(
          ERROR_MESSAGES[data.error ?? ""] ??
            "Không xác minh được, vui lòng thử lại.",
        );
        return;
      }

      setState("success");
      setZaloLink(data.zaloLink);
    } catch {
      setState("error");
      setErrorMsg("Lỗi kết nối, vui lòng thử lại.");
    }
  }

  if (state === "success" && zaloLink) {
    return (
      <div className="space-y-3">
        <div className="text-xs sm:text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 text-center">
          Xác minh thành công! Bấm nút bên dưới để vào nhóm Zalo riêng.
        </div>
        <a
          className="w-full inline-flex items-center justify-center gap-2 sm:gap-3 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-black text-sm sm:text-base hover:scale-[1.03] active:scale-95 transition-all duration-300 animate-pulse-glow"
          href={zaloLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          VÀO NHÓM ZALO NGAY
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-left">
      <p className="text-xs sm:text-sm text-on-surface-variant text-center">
        Nhập lại SĐT và email anh/chị đã dùng lúc đăng ký để mở link nhóm Zalo riêng.
      </p>
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
          disabled={state === "submitting"}
          className="mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface border border-primary/20 text-on-surface text-sm sm:text-base placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-colors"
        />
      </label>
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
          disabled={state === "submitting"}
          className="mt-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface border border-primary/20 text-on-surface text-sm sm:text-base placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-colors"
        />
      </label>

      {state === "error" && errorMsg && (
        <div className="text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {state === "submitting" ? (
          <>
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            ĐANG XÁC MINH...
          </>
        ) : (
          <>
            MỞ LINK NHÓM ZALO
            <span className="material-symbols-outlined">lock_open</span>
          </>
        )}
      </button>
    </form>
  );
}
