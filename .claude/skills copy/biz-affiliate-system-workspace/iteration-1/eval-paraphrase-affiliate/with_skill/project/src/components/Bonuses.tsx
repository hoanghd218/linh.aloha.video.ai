"use client";

import ScrollReveal from "./ScrollReveal";

const bonuses = [
  {
    icon: "schema",
    title: "AIOS Business Mapping Canvas",
    description:
      "Bộ khung vẽ doanh nghiệp theo 12 lớp: sản phẩm, khách hàng, thị trường, marketing, sales, kênh tăng trưởng, vận hành, đội nhóm, dữ liệu, đối tác, điểm nghẽn, cơ hội Agent.",
    value: "2,500,000đ",
  },
  {
    icon: "view_list",
    title: "Bộ Mẫu Tư Duy 20 Agent Cho Doanh Nghiệp",
    description:
      "Gợi ý 20 Agent triển khai được ngay: Market Research, Customer Insight, Content Strategy, Sales Script, Offer Builder, Affiliate Research, KDP Niche Hunter, Partnership, Business Strategy...",
    value: "3,000,000đ",
  },
  {
    icon: "book",
    title: "Agent Camp Workbook",
    description:
      "Tài liệu thực hành — ghi lại bài toán hiện tại, điểm nghẽn, kênh ưu tiên, quy trình cần AI hoá, Agent cần xây, workflow cần thiết kế, kế hoạch sau chương trình.",
    value: "1,500,000đ",
  },
  {
    icon: "smart_toy",
    title: "Bộ 5 Agents — Từ Ý Tưởng Đến Khách Hàng",
    description:
      "5 Agent chạy full funnel: (1) Research Agent nghiên cứu ý tưởng + ngách · (2) Competitor Agent phân tích đối thủ · (3) Offer Agent tạo offer Hormozi-style · (4) Landing Page Agent tự động build trang + tích hợp thanh toán + CRM · (5) Content Ads Agent lên chiến lược content + quảng cáo.",
    value: "5,000,000đ",
  },
];

export default function Bonuses() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 relative overflow-hidden" id="bonuses">
      {/* Background decorations — hidden on mobile */}
      <div className="hidden sm:block absolute top-10 left-10 w-48 h-48 border border-primary/5 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-10 right-10 w-32 h-32 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-6 animate-bounce-subtle">
              <span className="material-symbols-outlined text-base sm:text-xl">redeem</span>
              QUÀ TẶNG KÈM TRỊ GIÁ TRÊN 12 TRIỆU
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase text-on-surface tracking-tighter mb-3 sm:mb-4">
              5 Bonus{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                ĐẶC BIỆT
              </span>
            </h2>
            <p className="text-base sm:text-xl text-on-surface-variant">
              Bonus dành riêng cho học viên đăng ký Agent Camp
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

        {/* Special bonus — Roadmap 30 days */}
        <ScrollReveal delay={400} direction="scale">
          <div className="relative bg-linear-to-br from-primary/10 via-surface-container-high to-secondary-container/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-primary/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center overflow-hidden group hover:shadow-[0_0_60px_rgba(245,158,11,0.3)] transition-all duration-500">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-primary to-primary-container mb-3 sm:mb-4 animate-float shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <span className="material-symbols-outlined text-on-primary-container text-3xl sm:text-4xl">
                  flag
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-[10px] sm:text-xs font-black inline-block mb-2 sm:mb-3 animate-pulse">
                BONUS 5 ĐẶC BIỆT
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-2">
                Roadmap 30 Ngày Sau Agent Camp
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto">
                Khung định hướng triển khai sau chương trình — tránh tình trạng học xong nhiều ý tưởng nhưng không biết bắt đầu từ đâu. Mỗi tuần một mốc, mỗi mốc một Agent.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
