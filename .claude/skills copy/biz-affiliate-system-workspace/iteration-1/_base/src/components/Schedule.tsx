"use client";

import ScrollReveal from "./ScrollReveal";

const schedule = [
  {
    title: "NGÀY 1 — THỨ 5, 29/05",
    subtitle: "Tư duy AIOS & tái cấu trúc",
    time: "08:30 — 17:30",
    items: [
      "Bức tranh lớn AI Agent + AIOS",
      "Phân tích doanh nghiệp 12 lớp",
      "Vẽ bản đồ mô hình hiện tại",
      "Chọn khu vực AI hoá trước",
    ],
  },
  {
    title: "NGÀY 2 — THỨ 6, 30/05",
    subtitle: "Marketing · Sales · Channel Growth",
    time: "08:30 — 17:30",
    items: [
      "Xây Marketing Agent đa kênh",
      "Sales Agent + content engine",
      "Workflow nội dung → chuyển đổi",
      "VibeCoding Business thực hành",
    ],
  },
  {
    title: "NGÀY 3 — THỨ 7, 31/05",
    subtitle: "Affiliate · KDP · POD · Quốc tế",
    time: "08:30 — 17:30",
    items: [
      "Showcase hệ thống KDP / POD",
      "AI Affiliate Content Engine",
      "Roadmap 30 ngày sau camp",
      "Q&A + Freedom Partnership",
    ],
  },
];

export default function Schedule() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6" id="schedule">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">event</span>
              ĐÀ LẠT · 29 – 30 – 31/05
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight">
              Lịch Trình 3 Ngày
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-3 sm:mt-4 max-w-xl mx-auto">
              Mastermind / huấn luyện thực chiến / demo hệ thống / thực hành / hỏi đáp chuyên sâu — cá nhân hoá theo từng mô hình.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {schedule.map((day, index) => (
            <ScrollReveal key={day.title} delay={index * 150} direction="up">
              <div className="bg-surface p-5 sm:p-7 rounded-xl sm:rounded-2xl border border-primary/30 glow-border hover:bg-surface-container-high transition-colors h-full">
                <div className="text-primary font-black text-base sm:text-lg mb-1 leading-tight">
                  {day.title}
                </div>
                <div className="text-xs sm:text-sm text-on-surface font-bold mb-1">{day.subtitle}</div>
                <div className="text-[10px] sm:text-xs text-on-surface-variant/70 font-medium mb-4 sm:mb-5">
                  {day.time}
                </div>
                <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-on-surface-variant">
                  {day.items.map((item) => (
                    <p key={item} className="flex gap-2">
                      <span className="material-symbols-outlined text-primary text-base shrink-0">check</span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA under schedule */}
        <ScrollReveal delay={300}>
          <div className="text-center mt-8 sm:mt-12">
            <a
              href="#register"
              className="inline-flex items-center gap-3 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-black text-base sm:text-xl hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-glow"
            >
              ĐĂNG KÝ GIỮ CHỖ
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-3">
              Chỉ <span className="text-primary font-bold">60 ghế</span> cho cả 3 ngày mastermind
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
