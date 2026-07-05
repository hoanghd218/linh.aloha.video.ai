"use client";

import ScrollReveal from "../ScrollReveal";

const EVENT_DATE = "Thứ Tư, 03/06/2026";
const EVENT_VENUE = "Quận 2, TP. Hồ Chí Minh";

export default function FinalCTASummit() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-linear-to-t from-secondary-container/30 to-surface relative overflow-hidden">
      <div className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 right-10 w-56 h-56 border border-primary/5 -rotate-12 animate-spin-slow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <ScrollReveal>
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
            <span className="material-symbols-outlined text-red-400 animate-pulse text-sm sm:text-base">
              event_seat
            </span>
            SỰ KIỆN GIỚI HẠN ~200 NGƯỜI
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter px-2">
            Đứng Ngoài Quan Sát,
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
              Hay Bước Vào Xây Hệ Thống?
            </span>
          </h2>

          <p className="text-base sm:text-xl text-on-surface-variant max-w-2xl mx-auto">
            Trong thời đại AI Agent, có hai nhóm doanh nghiệp. Nhóm vận hành theo
            cách cũ — và nhóm xây hệ thống AI Agent. AI AGENT SUMMIT là nơi anh chị{" "}
            <span className="text-primary font-bold">
              chọn mình thuộc nhóm nào.
            </span>
          </p>

          {/* 3 reasons to act now */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: "smart_display",
                title: "Showcase AI Agent thật",
                desc: "Tận mắt thấy hệ thống AI Agent vận hành trên sân khấu",
              },
              {
                icon: "map",
                title: "Bản đồ AIOS mang về",
                desc: "Workshop xây bản đồ AIOS cho chính doanh nghiệp của anh chị",
              },
              {
                icon: "redeem",
                title: "Vé VIP tặng 8 triệu",
                desc: "Tặng khoá \"Agent / Claude Code\" trị giá 8tr + thêm vé cho người đi cùng",
              },
            ].map((r) => (
              <div
                key={r.title}
                className="bg-surface-container-high/80 backdrop-blur rounded-xl p-4 border border-primary/20"
              >
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-1 inline-block">
                  {r.icon}
                </span>
                <div className="font-black text-sm sm:text-base text-on-surface">
                  {r.title}
                </div>
                <div className="text-[11px] sm:text-xs text-on-surface-variant">
                  {r.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">
                  calendar_month
                </span>
                <span className="font-bold text-on-surface">{EVENT_DATE}</span>
              </span>
              <span className="hidden sm:inline text-primary/40">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">
                  location_on
                </span>
                <span className="font-bold text-on-surface">{EVENT_VENUE}</span>
              </span>
              <span className="hidden sm:inline text-primary/40">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">
                  schedule
                </span>
                <span className="font-bold text-on-surface">08:00 – 18:00</span>
              </span>
            </div>

            <a
              className="flex items-center justify-center gap-2 sm:gap-4 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-14 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-2xl hover:scale-110 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.4)] animate-pulse-glow w-full sm:w-auto max-w-md sm:max-w-none mx-auto"
              href="#register"
            >
              <span className="material-symbols-outlined shrink-0">
                rocket_launch
              </span>
              ĐĂNG KÝ VÉ NGAY
            </a>

            <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm">
              <span className="material-symbols-outlined text-green-400 text-base">
                verified
              </span>
              <span>
                Vé chỉ từ{" "}
                <span className="font-bold text-on-surface">499.000đ</span> · Vé
                VIP &amp; Super VIP số lượng có hạn
              </span>
            </div>
          </div>

          {/* Reassurance */}
          <div className="pt-6 sm:pt-8 border-t border-outline-variant/20 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-on-surface-variant italic">
              &ldquo;AI AGENT SUMMIT không bán kiến thức. Summit bán một tầm nhìn
              mới về cách doanh nghiệp cần được vận hành trong thời đại AI Agent. Một
              ngày này có thể thay đổi cách anh chị nhìn toàn bộ doanh nghiệp của
              mình.&rdquo;
            </p>
            <div className="mt-3 text-xs sm:text-sm text-primary font-bold">
              — Tony Hoang
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
