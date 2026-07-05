"use client";

import ScrollReveal from "../ScrollReveal";

const demos = [
  {
    icon: "campaign",
    from: "Từ một sản phẩm",
    to: "Chiến lược marketing bằng AI Agent",
    desc: "Phân tích khách hàng, insight, big idea, lựa chọn kênh và kế hoạch nội dung — tạo ra trong thời gian thực.",
  },
  {
    icon: "support_agent",
    from: "Từ chân dung khách hàng",
    to: "Sales system hoàn chỉnh",
    desc: "Pain point, objection, hành trình khách hàng và kịch bản bán hàng được Agent dựng tự động.",
  },
  {
    icon: "content_copy",
    from: "Từ một content win",
    to: "Content engine nhân bản",
    desc: "Bóc tách cấu trúc, hook, insight, format — rồi nhân bản thành nhiều biến thể nội dung khác nhau.",
  },
  {
    icon: "account_tree",
    from: "Từ một ý tưởng kinh doanh",
    to: "Workflow AIOS hoàn chỉnh",
    desc: "Chia mô hình thành các phòng ban, quy trình và danh sách Agent cần xây cho doanh nghiệp.",
  },
  {
    icon: "inventory",
    from: "Từ một niche KDP / POD / Affiliate",
    to: "Hệ thống triển khai đầu-cuối",
    desc: "Nghiên cứu niche, sản phẩm, content, listing, kênh bán và vận hành — gói trong một hệ thống.",
  },
];

export default function ShowcaseSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface relative overflow-hidden"
      id="showcase"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />
      <div className="hidden sm:block absolute bottom-20 right-12 w-32 h-32 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-tertiary-container/15 border border-tertiary/30 text-tertiary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-tertiary animate-pulse" />
              LIVE SHOWCASE — DEMO TRỰC TIẾP
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              5 Demo Hệ Thống AI Agent{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Vận Hành Thật
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Không phải slide lý thuyết. Anh chị sẽ thấy AI Agent biến đầu vào thô
              thành cả một hệ thống — ngay trên sân khấu.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {demos.map((demo, index) => (
            <ScrollReveal
              key={demo.to}
              delay={index * 90}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <div
                className={`h-full bg-surface-container-high rounded-2xl p-5 sm:p-7 border border-primary/15 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-300 ${
                  index === demos.length - 1 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                      {demo.icon}
                    </span>
                  </div>
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-black">
                      <span className="text-on-surface-variant">{demo.from}</span>
                      <span className="material-symbols-outlined text-primary text-base sm:text-lg">
                        arrow_forward
                      </span>
                      <span className="text-primary">{demo.to}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {demo.desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <p className="text-center text-sm sm:text-base text-on-surface-variant mt-8 sm:mt-10 max-w-2xl mx-auto italic border-t border-primary/15 pt-6">
            AI Agent là hệ thống có thể xây thật, dùng thật và tạo ra{" "}
            <span className="text-primary font-bold">kết quả thật</span>.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
