"use client";

import ScrollReveal from "./ScrollReveal";

interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

interface FreedomBuildersProProps {
  productName?: string;
  productShort?: string;
  benefits?: Benefit[];
  footerText?: string;
}

function defaultBenefits(productName: string, productShort: string): Benefit[] {
  return [
    {
      icon: "lock",
      title: "Không Bán Lẻ — Không Mua Được Ngoài",
      desc: `Khoá ${productName} không có trên marketplace hay khoá học public. Chỉ mở cho thành viên Freedom Builders Pro.`,
    },
    {
      icon: "hub",
      title: "Private Inner Circle",
      desc: "Tham gia Discord & Zalo nội bộ cùng các founder, marketer và creator đang build agent thật — không phải lớp học đại trà.",
    },
    {
      icon: "update",
      title: `Cập Nhật Trọn Đời Theo Phiên Bản ${productShort}`,
      desc: `Mỗi khi ${productShort} có bản mới, bạn nhận được buổi update miễn phí + blueprint patch — không bao giờ bị bỏ lại phía sau.`,
    },
    {
      icon: "support_agent",
      title: "1-1 Office Hours Với Tony Hoang",
      desc: "Review identity files, setup, capstone agent build — mentor trực tiếp cho business của bạn sau khoá học.",
    },
    {
      icon: "sell",
      title: `Money Roadmap Kiếm Tiền Bằng ${productShort}`,
      desc: `5 con đường kiếm tiền bằng ${productShort} — in-house, freelance, productized service, digital product, affiliate — kèm playbook cá nhân hoá cho ngách của bạn.`,
    },
    {
      icon: "library_books",
      title: "Vault Tài Liệu Nội Bộ",
      desc: "Truy cập kho Obsidian Vault playbook, identity files mẫu, prompt patterns và skill blueprints của toàn bộ Freedom Builders.",
    },
  ];
}

export default function FreedomBuildersPro({
  productName = "OpenClaw AI Mastery",
  productShort = "OpenClaw",
  benefits,
  footerText,
}: FreedomBuildersProProps = {}) {
  const items = benefits ?? defaultBenefits(productName, productShort);
  const footer =
    footerText ??
    `Trở thành thành viên Freedom Builders Pro để unlock ${productName}, toàn bộ blueprint agent, inner circle và Money Roadmap kiếm tiền bằng ${productShort}.`;

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-linear-to-b from-surface to-secondary-container/20 relative overflow-hidden"
      id="freedom-builders-pro"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/10 rounded-full blur-[140px]" />
      <div className="hidden sm:block absolute top-20 right-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-20 left-10 w-32 h-32 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/15 border border-primary/40 text-primary font-black text-[10px] sm:text-xs uppercase tracking-widest mb-4 animate-pulse">
              <span className="material-symbols-outlined text-base sm:text-lg">
                workspace_premium
              </span>
              EXCLUSIVE ACCESS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              Chỉ Có Trong{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Freedom Builders Pro
              </span>
            </h2>
            <p className="text-base sm:text-xl text-on-surface-variant max-w-3xl mx-auto">
              {productName}{" "}
              <span className="text-primary font-bold">không bán lẻ</span>. Đây là quyền lợi dành riêng cho inner circle — nơi các builder đang xây business thật với agent.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((benefit, index) => (
            <ScrollReveal key={benefit.title} delay={index * 90}>
              <div className="group relative bg-surface-container-high rounded-2xl p-5 sm:p-6 border border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] h-full overflow-hidden">
                {/* Diagonal ribbon */}
                <div className="absolute -top-1 -right-1 w-14 h-14 overflow-hidden">
                  <div className="absolute top-2 -right-6 rotate-45 bg-linear-to-r from-primary to-primary-container text-on-primary-container text-[8px] font-black uppercase px-6 py-0.5 shadow-md">
                    Pro
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                      {benefit.icon}
                    </span>
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h3 className="font-black text-sm sm:text-base text-on-surface leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Call-out footer */}
        <ScrollReveal delay={300}>
          <div className="mt-10 sm:mt-14 bg-linear-to-br from-primary/10 via-surface-container-high to-secondary-container/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-primary/30 text-center">
            <p className="text-sm sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              {footer}
            </p>
            <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/40 text-primary font-black text-xs sm:text-sm">
              <span className="material-symbols-outlined text-base sm:text-lg">
                verified
              </span>
              Không bán lẻ · Không tái phân phối · Membership only
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
