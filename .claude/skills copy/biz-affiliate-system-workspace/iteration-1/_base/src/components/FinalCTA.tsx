"use client";

import ScrollReveal from "./ScrollReveal";

const TOTAL = 60;
const REGISTERED = 38;
const REMAINING = TOTAL - REGISTERED;

export default function FinalCTA() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-linear-to-t from-secondary-container/30 to-surface relative overflow-hidden">
      {/* Decorative elements — hidden on mobile */}
      <div className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 right-10 w-56 h-56 border border-primary/5 -rotate-12 animate-spin-slow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <ScrollReveal>
        <div className="max-w-7xl mx-auto text-center space-y-6 sm:space-y-10 relative z-10">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-surface-container-highest/80 border border-primary-container/30 text-primary-container font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">trending_up</span>
              3 NĂM TỚI · 2 LOẠI DOANH NGHIỆP
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter px-2">
              Bạn Chọn Đứng Bên{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Doanh Nghiệp AIOS
              </span>
              <br />
              Hay Bên Còn Lại?
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto px-2">
              Trong 3 năm tới, doanh nghiệp chia làm 2 nhóm. Một nhóm vẫn vận hành thủ công, nhiều người, nhiều chi phí. Một nhóm bắt đầu xây <span className="text-primary font-bold">hệ điều hành AIOS</span> — tinh gọn, nhanh, có hệ thống, ứng dụng AI Agent vào marketing, bán hàng, xây kênh và vận hành.
            </p>
          </div>

          {/* Summary card */}
          <div className="max-w-3xl mx-auto bg-surface-container-high/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-primary/25 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 text-left">
              <div>
                <div className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wider mb-1">Thời gian</div>
                <div className="text-sm sm:text-base font-black text-on-surface">29 – 30 – 31/05</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wider mb-1">Địa điểm</div>
                <div className="text-sm sm:text-base font-black text-on-surface">Ba Vì</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wider mb-1">Số lượng</div>
                <div className="text-sm sm:text-base font-black text-on-surface">~60 ghế</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-black text-green-400 uppercase tracking-wider mb-1">Early Bird</div>
                <div className="text-sm sm:text-base font-black text-on-surface tabular-nums">12.868.000đ</div>
              </div>
            </div>
          </div>

          {/* Urgency bar */}
          <div className="inline-flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-red-600/15 border border-red-500/30 animate-bounce-subtle max-w-full">
            <span className="material-symbols-outlined text-red-400 animate-pulse text-lg sm:text-2xl shrink-0">warning</span>
            <span className="text-red-300 font-bold text-sm sm:text-base text-center">
              Chỉ còn <span className="text-red-400 font-black text-lg sm:text-xl">{REMAINING}</span> / {TOTAL} ghế · Early Bird hết hạn <span className="text-red-400 font-black">20/05</span>
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
            <a
              href="#register"
              className="flex items-center justify-center gap-2 sm:gap-4 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-2xl hover:scale-110 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.4)] animate-pulse-glow w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
            >
              <span className="hidden sm:inline">ĐĂNG KÝ AGENT CAMP — </span>GIỮ CHỖ NGAY
              <span className="material-symbols-outlined shrink-0">rocket_launch</span>
            </a>
            <p className="text-on-surface-variant font-medium text-sm sm:text-base">
              Tôi muốn xây AIOS cho doanh nghiệp của mình
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
