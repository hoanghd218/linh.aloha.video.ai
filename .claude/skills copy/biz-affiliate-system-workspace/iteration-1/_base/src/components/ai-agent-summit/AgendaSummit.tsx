"use client";

import ScrollReveal from "../ScrollReveal";

interface Slot {
  time: string;
  title: string;
  desc?: string;
  icon: string;
  highlight?: boolean;
  isBreak?: boolean;
}

const schedule: Slot[] = [
  {
    time: "08:00 – 08:30",
    title: "Check-in & Networking",
    desc: "Đón khách, kết nối, chụp hình",
    icon: "how_to_reg",
  },
  {
    time: "08:30 – 09:00",
    title: "Opening",
    desc: "Vì sao AI Agent là bước ngoặt mới của doanh nghiệp",
    icon: "flag",
  },
  {
    time: "09:00 – 10:15",
    title: "The AI Agent Shift",
    desc: "Từ AI Tool → Workflow → Agent → AIOS",
    icon: "auto_awesome",
    highlight: true,
  },
  {
    time: "10:15 – 10:30",
    title: "Break",
    icon: "coffee",
    isBreak: true,
  },
  {
    time: "10:30 – 11:45",
    title: "The Growth Engine",
    desc: "AI Agent cho marketing, bán hàng, xây kênh",
    icon: "rocket_launch",
    highlight: true,
  },
  {
    time: "11:45 – 13:30",
    title: "Lunch & Networking",
    desc: "Ăn trưa và kết nối cộng đồng",
    icon: "restaurant",
    isBreak: true,
  },
  {
    time: "13:30 – 14:45",
    title: "The Live AI Agent Showcase",
    desc: "Demo hệ thống AI Agent thực tế",
    icon: "smart_display",
    highlight: true,
  },
  {
    time: "14:45 – 15:00",
    title: "Break",
    icon: "coffee",
    isBreak: true,
  },
  {
    time: "15:00 – 16:00",
    title: "Build Your AIOS Map Workshop",
    desc: "Thực hành xây bản đồ AIOS cho doanh nghiệp của anh chị",
    icon: "map",
    highlight: true,
  },
  {
    time: "16:00 – 17:00",
    title: "The Next Level",
    desc: "Lộ trình bước vào Global Elite Club",
    icon: "trending_up",
    highlight: true,
  },
  {
    time: "17:00 – 18:00",
    title: "Q&A – Networking – Closing",
    desc: "Giải đáp, kết nối và bế mạc",
    icon: "forum",
  },
];

const EVENT_DATE = "Thứ Tư, 03/06/2026";
const EVENT_VENUE = "Quận 2, TP. Hồ Chí Minh";

export default function AgendaSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface relative overflow-hidden"
      id="agenda"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">
                schedule
              </span>
              LỊCH TRÌNH MỘT NGÀY · 08:00 – 18:00
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Agenda{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                AI AGENT SUMMIT
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-5 text-xs sm:text-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">
                  calendar_month
                </span>
                <span className="font-bold">{EVENT_DATE}</span>
              </span>
              <span className="hidden sm:inline text-primary/40">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">
                  location_on
                </span>
                <span className="font-bold">{EVENT_VENUE}</span>
              </span>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-2.5 sm:space-y-3">
          {schedule.map((slot, index) => (
            <ScrollReveal key={slot.time} delay={index * 50}>
              <div
                className={`flex items-center gap-3 sm:gap-5 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border transition-all duration-300 ${
                  slot.isBreak
                    ? "bg-surface-container-low border-outline-variant/20"
                    : slot.highlight
                      ? "bg-linear-to-br from-primary/12 to-primary-container/5 border-primary/35 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)]"
                      : "bg-surface-container-high border-primary/15"
                }`}
              >
                {/* Time */}
                <div className="shrink-0 w-20 sm:w-32 text-center">
                  <span
                    className={`text-[11px] sm:text-sm font-black tabular-nums ${
                      slot.isBreak ? "text-on-surface-variant" : "text-primary"
                    }`}
                  >
                    {slot.time}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border ${
                    slot.isBreak
                      ? "bg-surface border-outline-variant/20"
                      : "bg-linear-to-br from-primary/20 to-primary-container/10 border-primary/30"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg sm:text-xl ${
                      slot.isBreak ? "text-on-surface-variant" : "text-primary"
                    }`}
                  >
                    {slot.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-sm sm:text-base font-black leading-snug ${
                      slot.isBreak ? "text-on-surface-variant" : "text-on-surface"
                    }`}
                  >
                    {slot.title}
                  </h3>
                  {slot.desc && (
                    <p className="text-[11px] sm:text-xs text-on-surface-variant leading-snug">
                      {slot.desc}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
