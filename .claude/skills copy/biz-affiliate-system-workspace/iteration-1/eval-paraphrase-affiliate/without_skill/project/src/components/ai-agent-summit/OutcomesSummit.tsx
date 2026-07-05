"use client";

import ScrollReveal from "../ScrollReveal";

const outcomes = [
  { icon: "psychology", text: "Hiểu rõ AI Agent là gì và AIOS là gì" },
  { icon: "insights", text: "Hiểu vì sao AI Agent là xu hướng lớn của thời đại" },
  {
    icon: "troubleshoot",
    text: "Nhìn thấy điểm nghẽn trong mô hình kinh doanh hiện tại",
  },
  {
    icon: "flag",
    text: "Biết nên ứng dụng AI Agent vào đâu trước trong doanh nghiệp",
  },
  {
    icon: "map",
    text: "Có bản đồ AIOS sơ bộ cho mô hình kinh doanh của mình",
  },
  {
    icon: "smart_display",
    text: "Được xem showcase hệ thống AI Agent thực tế",
  },
  {
    icon: "verified",
    text: "Có niềm tin AIOS là tương lai của doanh nghiệp",
  },
  {
    icon: "rocket_launch",
    text: "Có mong muốn và lộ trình bước vào Global Elite Club",
  },
];

export default function OutcomesSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden"
      id="outcomes"
    >
      <div className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">
                task_alt
              </span>
              KẾT QUẢ SAU SỰ KIỆN
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Anh Chị Ra Về Với{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                8 Điều Cụ Thể
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Sau một ngày tham dự AI AGENT SUMMIT, đây là những gì anh chị mang về
              cho doanh nghiệp của mình.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {outcomes.map((item, index) => (
            <ScrollReveal key={item.text} delay={index * 70}>
              <div className="flex items-center gap-3 sm:gap-4 h-full bg-surface-container-high rounded-xl p-4 sm:p-5 border border-primary/15 hover:border-primary/35 transition-all duration-300">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">
                    {item.icon}
                  </span>
                </div>
                <span className="text-sm sm:text-base font-bold text-on-surface leading-snug">
                  {item.text}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
