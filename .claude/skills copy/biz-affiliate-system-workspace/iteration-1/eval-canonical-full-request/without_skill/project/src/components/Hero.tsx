"use client";

import Image from "next/image";

const TOTAL_SLOTS = 60;
const REGISTERED = 38;
const REMAINING = TOTAL_SLOTS - REGISTERED;

const deliverables = [
  "Bản đồ AIOS 12 lớp cho mô hình kinh doanh của bạn",
  "Lộ trình 8 bước triển khai AI Agent (mang về làm ngay)",
  "Showcase 8 hệ thống Agent thực chiến + roadmap 30 ngày",
];

export default function Hero() {
  return (
    <section className="relative pt-0 pb-6 sm:py-0 sm:min-h-[960px] flex flex-col items-center sm:justify-center px-4 sm:px-6 overflow-hidden">
      {/* Decorative Tech Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-linear-to-b from-transparent via-primary-container to-transparent" />
      </div>

      {/* Rotating decorative squares — hidden on small screens */}
      <div className="hidden sm:block absolute top-20 right-10 w-32 h-32 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-40 left-10 w-24 h-24 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="z-10 text-center max-w-5xl mx-auto space-y-3 sm:space-y-7">
        {/* Anti-course + FOR badges stacked */}
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-primary/20 to-secondary-container/20 border border-primary/40 text-primary font-black text-[10px] sm:text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm sm:text-base">forklift</span>
            CHUYỂN GIAO · KHÔNG PHẢI KHOÁ HỌC
          </div>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-surface-container-highest/80 border border-primary-container/30 text-primary-container font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm sm:text-base">groups</span>
            DÀNH CHO CHỦ DN · CHUYÊN GIA · NGƯỜI KINH DOANH
          </div>
        </div>

        {/* Hormozi-style headline: How [target] can [dream] in [time] without [pain] */}
        <h1 className="text-2xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-on-surface leading-[1.05] tracking-tighter">
          Cách Chủ Doanh Nghiệp Nhỏ{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
            Vận Hành Như Tổ Chức Lớn
          </span>
          <br className="hidden sm:block" />
          <span className="text-on-surface-variant text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            — Trong 3 Ngày, Không Cần Tuyển Thêm Một Nhân Viên Nào
          </span>
        </h1>

        {/* Mechanism teaser sub */}
        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto px-2">
          Bằng <span className="text-primary font-black">AIOS</span> — hệ điều hành AI Agent vận hành marketing, bán hàng, xây kênh và mở rộng mô hình kinh doanh thay cho 5-10 nhân sự truyền thống.
        </p>

        {/* Stack of deliverables — what you get, specific */}
        <div className="bg-surface-container-high/60 backdrop-blur-md border border-primary/25 rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto">
          <div className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-widest mb-3">
            Chuyển giao tận tay — về đến nhà là làm được
          </div>
          <ul className="space-y-2 sm:space-y-2.5 text-left">
            {deliverables.map((item) => (
              <li key={item} className="flex gap-2 sm:gap-3 text-sm sm:text-base text-on-surface">
                <span className="material-symbols-outlined text-primary text-base sm:text-lg shrink-0 mt-0.5">check_circle</span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Timing + location */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          AGENT CAMP · 3 NGÀY · ĐÀ LẠT · 29-31/05
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <a
            href="#register"
            className="group relative bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-10 py-4 sm:py-5 rounded-xl font-black text-sm sm:text-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow w-full sm:w-auto max-w-md sm:max-w-none mx-auto"
          >
            GIỮ CHỖ EARLY BIRD — 12.868.000Đ
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform shrink-0">
              arrow_forward
            </span>
          </a>

          {/* Urgency line — slot + early bird in one row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-sm">
            <div className="inline-flex items-center gap-1.5 text-red-300">
              <span className="material-symbols-outlined text-red-400 text-base sm:text-lg animate-pulse">group</span>
              <span className="font-bold">
                <span className="text-red-400 font-black animate-number-glow tabular-nums">{REGISTERED}</span>/{TOTAL_SLOTS} ghế · còn{" "}
                <span className="text-red-400 font-black tabular-nums">{REMAINING}</span>
              </span>
            </div>
            <span className="hidden sm:inline text-on-surface-variant/40">·</span>
            <div className="inline-flex items-center gap-1.5 text-green-400">
              <span className="material-symbols-outlined text-base sm:text-lg">schedule</span>
              <span className="font-bold">Early Bird hết hạn 20/05</span>
            </div>
            <span className="hidden sm:inline text-on-surface-variant/40">·</span>
            <div className="inline-flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-base sm:text-lg">savings</span>
              <span className="font-medium">Tiết kiệm 14 triệu so với giá public</span>
            </div>
          </div>

          {/* Speakers — 4 mentors */}
          <div className="mt-3 sm:mt-5 w-full">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center mb-2 sm:mb-3">
              Được dẫn dắt bởi 4 mentor
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto">
              {[
                { name: "Mr. Tony Hoang", role: "CEO BimSpeed", image: "/images/hoang-real.jpg", delay: "0s" },
                { name: "Mr. Tony Trieu", role: "Founder Kaching Capital", image: "/images/tony-real.jpg", delay: "0.3s" },
                { name: "Ms. Thuy AI", role: "Mentor AIOS", image: "/images/thuy-ai.jpg", delay: "0.6s" },
                { name: "Thầy Trương Cảnh Thắng", role: "AI Affiliate · AI Content", image: "/images/speakers/Thang Tim Cach.jpg", delay: "0.9s" },
              ].map((s) => (
                <div key={s.name} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 animate-float bg-surface-container-high/40 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl border border-primary/15" style={{ animationDelay: s.delay }}>
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-primary-container p-0.5 shadow-[0_0_12px_rgba(245,158,11,0.25)] shrink-0">
                    <Image
                      className="w-full h-full object-cover rounded-full"
                      src={s.image}
                      alt={s.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="text-center sm:text-left min-w-0">
                    <div className="font-bold text-on-surface text-[11px] sm:text-xs leading-tight truncate">{s.name}</div>
                    <div className="text-[9px] sm:text-[10px] text-primary font-medium truncate">{s.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
