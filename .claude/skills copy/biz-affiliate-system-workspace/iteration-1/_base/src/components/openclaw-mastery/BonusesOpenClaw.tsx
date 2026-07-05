"use client";

import ScrollReveal from "../ScrollReveal";

const bonuses = [
  {
    icon: "folder_special",
    title: "Bộ Identity Files Template (6 files)",
    description: "user.md, identity.md, memory.md, soul.md, agents.md, tools.md — sẵn sàng fill thông tin business của bạn.",
    value: "2,000,000đ",
  },
  {
    icon: "travel_explore",
    title: "Research Agent Blueprint",
    description: "Sub-agent tự scrape đối thủ, thị trường, insight khách hàng và lưu vào Obsidian memory graph.",
    value: "1,500,000đ",
  },
  {
    icon: "auto_awesome",
    title: "Idea & Content Production Agents",
    description: "Cron job mỗi sáng tổng hợp trend + pipeline script → carousel → caption → lịch đăng đa nền tảng.",
    value: "1,500,000đ",
  },
  {
    icon: "menu_book",
    title: "Book Production Agent Blueprint",
    description: "Outline → chapter draft → edit → export, memory graph giữ nhất quán nhân vật & luận điểm xuyên sách.",
    value: "1,500,000đ",
  },
  {
    icon: "language",
    title: "Website & QA Agent Blueprint",
    description: "Tạo landing page, tự QA, tự fix lỗi, deploy — cho marketer không biết code.",
    value: "1,500,000đ",
  },
  {
    icon: "sell",
    title: "Money Roadmap — 5 Cách Kiếm Tiền Bằng OpenClaw",
    description: "Playbook 5 con đường: In-house, Freelance, Productized service, Digital product, Affiliate — kèm template định vị và chọn ngách phù hợp.",
    value: "2,000,000đ",
  },
];

export default function BonusesOpenClaw() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-surface-container-lowest">
      {/* Background decorations — hidden on mobile */}
      <div className="hidden sm:block absolute top-10 left-10 w-48 h-48 border border-primary/5 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-10 right-10 w-32 h-32 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-6 animate-bounce-subtle">
              <span className="material-symbols-outlined text-base sm:text-xl">redeem</span>
              TỔNG GIÁ TRỊ HƠN 10,000,000đ
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-on-surface tracking-tighter mb-3 sm:mb-4">
              Quà Tặng{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                ĐẶC BIỆT
              </span>
            </h2>
            <p className="text-base sm:text-xl text-on-surface-variant max-w-2xl mx-auto">
              Tham gia đủ khoá học để nhận trọn bộ blueprint — copy & chạy ngay cho business của bạn
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {bonuses.map((bonus, index) => (
            <ScrollReveal key={bonus.title} delay={index * 100} direction={index % 2 === 0 ? "left" : "right"}>
              <div className="relative group bg-surface-container-high p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-shimmer overflow-hidden h-full">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-primary-container flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-on-primary-container text-xl sm:text-2xl">
                      {bonus.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                    <div className="inline-block mb-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black">
                      Trị giá {bonus.value}
                    </div>
                    <h3 className="text-base sm:text-lg font-black mb-1 leading-snug">{bonus.title}</h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant">{bonus.description}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Special bonus */}
        <ScrollReveal delay={400} direction="scale">
          <div className="relative bg-linear-to-br from-primary/10 via-surface-container-high to-secondary-container/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-primary/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center overflow-hidden group hover:shadow-[0_0_60px_rgba(245,158,11,0.3)] transition-all duration-500">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-primary to-primary-container mb-3 sm:mb-4 animate-float shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <span className="material-symbols-outlined text-on-primary-container text-3xl sm:text-4xl">
                  workspace_premium
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-[10px] sm:text-xs font-black inline-block mb-2 sm:mb-3 animate-pulse">
                QUYỀN LỢI EXCLUSIVE — CHỈ DÀNH CHO FREEDOM BUILDERS PRO
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-2">
                Truy Cập Trọn Đời Builder Lab Mission Control
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto">
                Dashboard theo dõi sessions, logs, tokens, task board của tất cả OpenClaw agents — chỉ mở cho thành viên Freedom Builders Pro tham gia khoá học này.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
