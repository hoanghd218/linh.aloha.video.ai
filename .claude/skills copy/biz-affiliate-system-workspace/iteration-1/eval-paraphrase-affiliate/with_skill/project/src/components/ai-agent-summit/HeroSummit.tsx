"use client";

const EVENT_DATE = "Thứ Tư, 03/06/2026";
const EVENT_VENUE = "Quận 2, TP. Hồ Chí Minh";
const TOTAL_SEATS = 200;
const REGISTERED = 156;
const REMAINING = TOTAL_SEATS - REGISTERED;

const highlights = [
  { icon: "hub", label: "Hiểu bức tranh AI Agent" },
  { icon: "trending_up", label: "Showcase hệ thống thật" },
  { icon: "map", label: "Bản đồ AIOS của bạn" },
  { icon: "groups", label: "Networking ~200 người" },
];

export default function HeroSummit() {
  return (
    <section className="relative min-h-svh flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 overflow-hidden">
      {/* Decorative tech lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute top-0 left-2/3 w-px h-full bg-linear-to-b from-transparent via-primary-container to-transparent" />
      </div>

      {/* Rotating decorative squares */}
      <div className="hidden sm:block absolute top-24 right-12 w-32 h-32 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-40 left-10 w-24 h-24 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="z-10 text-center max-w-5xl mx-auto space-y-5 sm:space-y-7">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-surface-container-highest/80 border border-primary-container/30 text-primary-container font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          SỰ KIỆN OFFLINE · QUY MÔ ~200 NGƯỜI · MỘT NGÀY DUY NHẤT
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-on-surface leading-[1.1] tracking-tighter">
          AI AGENT SUMMIT —{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
            Một Ngày Tái Cấu Trúc Doanh Nghiệp
          </span>{" "}
          Bằng AI Agent
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto px-2">
          Không phải một buổi học công cụ AI thông thường. Đây là một ngày anh chị
          nhìn lại toàn bộ mô hình kinh doanh, thấy rõ điểm nghẽn, và bắt đầu xây{" "}
          <span className="text-on-surface font-bold">hệ điều hành AIOS</span> cho
          doanh nghiệp của mình trong thời đại mới.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto">
          {highlights.map((item) => (
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

        {/* Event info bar */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-2 sm:gap-3 max-w-3xl mx-auto">
          <div className="flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/30">
            <span className="material-symbols-outlined text-primary text-xl sm:text-2xl shrink-0">
              calendar_month
            </span>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">
                Thời gian
              </div>
              <div className="text-sm sm:text-base text-on-surface font-black">
                {EVENT_DATE} · 08:00 – 18:00
              </div>
            </div>
          </div>
          <div className="flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/30">
            <span className="material-symbols-outlined text-primary text-xl sm:text-2xl shrink-0">
              location_on
            </span>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">
                Địa điểm
              </div>
              <div className="text-sm sm:text-base text-on-surface font-black">
                {EVENT_VENUE}
              </div>
            </div>
          </div>
        </div>

        {/* Urgency: seat counter */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 rounded-2xl bg-red-600/10 border border-red-500/30">
            <span className="material-symbols-outlined text-red-400 text-xl sm:text-2xl animate-pulse shrink-0">
              event_seat
            </span>
            <div className="text-left">
              <div className="text-xs sm:text-sm text-red-300 font-bold">
                <span className="text-xl sm:text-2xl text-red-400 font-black animate-number-glow">
                  {REGISTERED}
                </span>
                /{TOTAL_SEATS} vé đã đăng ký
              </div>
              <div className="text-[10px] sm:text-xs text-red-400/80">
                Chỉ còn{" "}
                <span className="font-black text-red-400">{REMAINING} vé</span> cho
                sự kiện giới hạn ~200 người!
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-5 sm:gap-6 w-full sm:w-auto">
          <a
            className="group relative bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-10 py-4 sm:py-5 rounded-xl font-black text-sm sm:text-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
            href="#register"
          >
            ĐĂNG KÝ VÉ AI AGENT SUMMIT
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform shrink-0">
              arrow_forward
            </span>
          </a>

          {/* Price anchor */}
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Vé chỉ từ{" "}
            <span className="text-primary font-black">499.000đ</span> · Vé VIP
            tặng kèm khoá học{" "}
            <span className="text-primary font-black">trị giá 8.000.000đ</span>
          </p>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 text-[10px] sm:text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-400 text-base">
                verified
              </span>
              <span className="font-bold">Demo hệ thống AI Agent thật</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">
                workspace_premium
              </span>
              <span className="font-bold">Workshop xây bản đồ AIOS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">
                diversity_3
              </span>
              <span className="font-bold">Cộng đồng tinh hoa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
