"use client";

import Image from "next/image";

const ZALO_LINK = "https://zalo.me/g/kxvavk323";

export default function HeroOpenClaw() {
  return (
    <section className="relative min-h-svh sm:min-h-[921px] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Decorative Tech Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-linear-to-b from-transparent via-primary-container to-transparent" />
      </div>

      {/* Rotating decorative squares — hidden on small screens */}
      <div className="hidden sm:block absolute top-20 right-10 w-32 h-32 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-40 left-10 w-24 h-24 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="z-10 text-center max-w-5xl mx-auto space-y-5 sm:space-y-8">
        {/* Exclusive Freedom Builders Pro badge */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/15 border border-primary/40 text-primary font-black text-[10px] sm:text-xs uppercase tracking-widest animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <span className="material-symbols-outlined text-base sm:text-lg">
              workspace_premium
            </span>
            CHỈ CÓ TRONG FREEDOM BUILDERS PRO
          </div>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-surface-container-highest/80 border border-primary-container/30 text-primary-container font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            5 BUỔI ZOOM LIVE
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-on-surface leading-[1.1] tracking-tighter">
          OpenClaw AI Mastery Cho{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
            Marketing & Kinh Doanh
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto px-2">
          Dành cho Marketer, chủ doanh nghiệp, content creator —{" "}
          <span className="text-primary font-bold">xây agent chạy 24/7 trên máy của bạn</span>.
          <br />
          Trọng tâm: <span className="text-primary font-bold">Research → Idea → Content → Sách → Website</span> — kết thúc bằng 1 hệ thống multi AI agents OpenClaw và lộ trình kiếm tiền từ chính hệ thống đó.
        </p>

        {/* Key outcomes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 max-w-5xl mx-auto">
          {[
            { icon: "travel_explore", label: "Research Agent" },
            { icon: "lightbulb", label: "Idea Generation" },
            { icon: "edit_note", label: "Content Production" },
            { icon: "menu_book", label: "Book Production" },
            { icon: "language", label: "Website & QA" },
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

        {/* Price block — struck through, available in Freedom Builder Pro */}
        <div className="flex justify-center">
          <div className="inline-flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="material-symbols-outlined text-primary text-xl sm:text-2xl animate-pulse shrink-0">
                workspace_premium
              </span>
              <div className="text-left">
                <div className="text-[10px] sm:text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">
                  Học phí niêm yết
                </div>
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-xl sm:text-3xl text-on-surface-variant font-black line-through decoration-red-500 decoration-[3px]">
                    5.000.000đ
                  </span>
                  <span className="text-[10px] sm:text-xs text-on-surface-variant font-bold">
                    · 5 buổi · 2.5h/buổi
                  </span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-primary text-on-primary-container font-black text-[10px] sm:text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs sm:text-sm">
                lock
              </span>
              Chỉ có trong Freedom Builder Pro
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-6 w-full sm:w-auto">
          <a
            className="group relative bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-10 py-4 sm:py-5 rounded-xl font-black text-sm sm:text-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
            href={ZALO_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            THAM GIA FREEDOM BUILDER PRO
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform shrink-0">
              arrow_forward
            </span>
          </a>

          {/* Instructor: Tony Hoang only */}
          <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-8 animate-float">
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
                CEO BimSpeed · Chuyên gia OpenClaw AI Agent
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
