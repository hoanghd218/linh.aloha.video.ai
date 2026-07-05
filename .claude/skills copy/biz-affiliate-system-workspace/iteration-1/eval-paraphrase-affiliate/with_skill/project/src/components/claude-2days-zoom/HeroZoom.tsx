"use client";

const TOTAL_SLOTS = 200;
const REGISTERED = 147;
const REMAINING = TOTAL_SLOTS - REGISTERED;

export default function HeroZoom() {
  return (
    <section className="relative pt-2 pb-6 sm:py-24 sm:min-h-svh flex flex-col items-center sm:justify-center px-4 sm:px-6 overflow-hidden">
      {/* Decorative Tech Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-container to-transparent" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-linear-to-b from-transparent via-primary-container to-transparent" />
      </div>

      <div className="hidden sm:block absolute top-20 right-10 w-32 h-32 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-40 left-10 w-24 h-24 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="z-10 text-center max-w-5xl mx-auto space-y-4 sm:space-y-7">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-surface-container-highest/80 border border-primary-container/30 text-primary-container font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          2 BUỔI ZOOM CHUYỂN GIAO QUY TRÌNH AI AGENT · 2026
        </div>

        <h1 className="text-[26px] sm:text-5xl md:text-5xl lg:text-6xl font-black text-on-surface leading-[1.15] sm:leading-[1.1] tracking-tighter">
          2026: Đừng Để Doanh Nghiệp Của Bạn{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
            Vận Hành Chậm Hơn Đối Thủ
          </span>{" "}
          Chỉ Vì Vẫn Làm Mọi Thứ Bằng Tay
        </h1>

        <p className="text-[15px] leading-relaxed sm:text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto px-1 sm:px-2">
          2 buổi Zoom chuyển giao quy trình xây{" "}
          <span className="text-primary font-bold">AI Agent</span> cho người kinh
          doanh. Từ việc dùng AI rời rạc → xây lớp trợ lý AI đầu tiên cho business.{" "}
          <span className="text-on-surface font-bold">
            Không cần biết code. Không cần tự mò hàng chục công cụ.
          </span>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto">
          {[
            { icon: "lightbulb", label: "Tư duy hệ thống AI" },
            { icon: "extension", label: "Input → Process → Output" },
            { icon: "smart_toy", label: "9 bộ AI Agent" },
            { icon: "rocket_launch", label: "Triển khai ngay" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-surface-container-high/60 border border-primary/20"
            >
              <span className="material-symbols-outlined text-primary text-base sm:text-xl shrink-0">
                {item.icon}
              </span>
              <span className="text-xs leading-tight sm:text-sm font-bold text-on-surface text-left">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Two-tier pricing block */}
        <div className="flex flex-row justify-center gap-2.5 sm:gap-4 max-w-3xl mx-auto">
          <div className="flex-1 px-3 sm:px-6 py-2.5 sm:py-4 rounded-2xl bg-surface-container-high/60 border border-primary/20">
            <div className="text-[10px] sm:text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">
              Vé miễn phí
            </div>
            <div className="text-xl sm:text-3xl font-black text-on-surface mt-0.5 sm:mt-1">
              0đ
            </div>
            <div className="text-[10px] leading-tight sm:text-xs text-on-surface-variant mt-1">
              Tham gia 2 buổi Zoom
            </div>
          </div>
          <div className="flex-1 px-3 sm:px-6 py-2.5 sm:py-4 rounded-2xl bg-primary/15 border-2 border-primary/40 relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-0.5 bg-primary text-on-primary-container text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-full whitespace-nowrap">
              Khuyến nghị
            </div>
            <div className="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-wider">
              Vé trả phí
            </div>
            <div className="text-xl sm:text-3xl font-black text-on-surface mt-0.5 sm:mt-1">
              499.000đ
            </div>
            <div className="text-[10px] leading-tight sm:text-xs text-on-surface-variant mt-1">
              + 9 bộ AI Agent dùng ngay
            </div>
          </div>
        </div>

        {/* Slot counter */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-red-600/10 border border-red-500/30">
            <span className="material-symbols-outlined text-red-400 text-lg sm:text-2xl animate-pulse shrink-0">
              group
            </span>
            <div className="text-left">
              <div className="text-[11px] leading-tight sm:text-sm text-red-300 font-bold">
                <span className="text-lg sm:text-2xl text-red-400 font-black animate-number-glow">
                  {REGISTERED}
                </span>
                /{TOTAL_SLOTS} slot vé trả phí đã đăng ký
              </div>
              <div className="text-[10px] leading-tight sm:text-xs text-red-400/80 mt-0.5">
                Chỉ còn{" "}
                <span className="font-black text-red-400">{REMAINING} slot</span>{" "}
                cho vé trả phí
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-6 w-full sm:w-auto">
          <a
            href="#register"
            className="group relative bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-10 py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
          >
            ĐĂNG KÝ 2 BUỔI ZOOM NGAY
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform shrink-0">
              arrow_forward
            </span>
          </a>

          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 sm:gap-5 text-[11px] sm:text-xs text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-green-400 text-sm sm:text-base">
                verified
              </span>
              <span className="font-bold">Không cần biết code</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-sm sm:text-base">
                groups
              </span>
              <span className="font-bold">3 mentor đồng hành</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-sm sm:text-base">
                inventory_2
              </span>
              <span className="font-bold">9 bộ Skill triển khai ngay</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
