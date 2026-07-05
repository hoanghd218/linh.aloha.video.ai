"use client";

import Image from "next/image";

const ZALO_LINK = "https://zalo.me/g/kxvavk323";
const TOTAL_SLOTS = 50;
const REGISTERED = 41;
const REMAINING = TOTAL_SLOTS - REGISTERED;

export default function HeroCodex() {
  return (
    <section className="relative min-h-svh flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 overflow-hidden">
      {/* Decorative Tech Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-linear-to-b from-transparent via-primary-container to-transparent" />
      </div>

      <div className="hidden sm:block absolute top-20 right-10 w-32 h-32 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-40 left-10 w-24 h-24 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="z-10 text-center max-w-5xl mx-auto space-y-5 sm:space-y-7">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-surface-container-highest/80 border border-primary-container/30 text-primary-container font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          KHOÁ HỌC CHUYÊN SÂU · 3 BUỔI ZOOM LIVE · KHAI GIẢNG THÁNG 5
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-on-surface leading-[1.1] tracking-tighter">
          Biến ChatGPT Codex Thành{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
            Máy Marketing & Năng Suất 24/7
          </span>{" "}
          — Không Cần Biết Code
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto px-2">
          Chỉ sau <span className="text-primary font-bold">3 buổi Zoom live</span>{" "}
          cùng Tony Hoang, bạn có hệ thống tự động: content → SEO → email → báo cáo.
          Dành cho marketer, chủ doanh nghiệp, người muốn làm việc ít hơn nhưng ra nhiều hơn —{" "}
          <span className="text-on-surface font-bold">không cần background kỹ thuật</span>.
        </p>

        {/* Key outcomes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto">
          {[
            { icon: "campaign", label: "Marketing tự động" },
            { icon: "bolt", label: "Năng suất x10" },
            { icon: "article", label: "Content at Scale" },
            { icon: "hub", label: "Kết nối mọi tool" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container-high/60 border border-primary/20"
            >
              <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0">
                {item.icon}
              </span>
              <span className="text-[11px] sm:text-sm font-bold text-on-surface text-left">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Price block */}
        <div className="flex justify-center">
          <div className="inline-flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="material-symbols-outlined text-primary text-xl sm:text-2xl animate-pulse shrink-0">
                payments
              </span>
              <div className="text-left">
                <div className="text-[10px] sm:text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">
                  Học phí
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-3xl text-primary font-black">
                    8.000.000đ
                  </span>
                </div>
              </div>
            </div>
            <div className="text-[10px] sm:text-xs text-on-surface-variant font-medium">
              3 buổi · 2.5h/buổi · Zoom live trực tiếp
            </div>
          </div>
        </div>

        {/* Urgency: Slot counter */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 rounded-2xl bg-red-600/10 border border-red-500/30">
            <span className="material-symbols-outlined text-red-400 text-xl sm:text-2xl animate-pulse shrink-0">
              group
            </span>
            <div className="text-left">
              <div className="text-xs sm:text-sm text-red-300 font-bold">
                <span className="text-xl sm:text-2xl text-red-400 font-black animate-number-glow">
                  {REGISTERED}
                </span>
                /{TOTAL_SLOTS} slot đã đăng ký
              </div>
              <div className="text-[10px] sm:text-xs text-red-400/80">
                Chỉ còn{" "}
                <span className="font-black text-red-400">{REMAINING} slot</span> — lớp giới hạn!
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-6 w-full sm:w-auto">
          <a
            className="group relative bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-10 py-4 sm:py-5 rounded-xl font-black text-sm sm:text-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
            href={ZALO_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            ĐĂNG KÝ NGAY — 8.000.000đ
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform shrink-0">
              arrow_forward
            </span>
          </a>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 text-[10px] sm:text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-400 text-base">verified</span>
              <span className="font-bold">Cam kết hoàn tiền 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">groups</span>
              <span className="font-bold">2,400+ học viên</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">star</span>
              <span className="font-bold">4.9/5 đánh giá</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-6 animate-float">
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-primary-container p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Image
                className="w-full h-full object-cover rounded-full"
                src="/images/hoang-real.jpg"
                alt="Mr. Tony Hoang"
                width={80}
                height={80}
              />
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs text-primary font-medium uppercase tracking-wider">
                Giảng viên trực tiếp
              </div>
              <div className="font-bold text-on-surface text-base sm:text-lg">
                Mr. Tony Hoang
              </div>
              <div className="text-[10px] sm:text-xs text-on-surface-variant">
                CEO BimSpeed · Chuyên gia ChatGPT Codex & AI Productivity
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
