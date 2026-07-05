"use client";

import ScrollReveal from "../ScrollReveal";

const ZALO_LINK = "https://zalo.me/g/kxvavk323";

const includedFeatures = [
  "5 buổi Zoom live trực tiếp với Tony Hoang (~2.5h/buổi)",
  "Recording trọn bộ khoá học — xem lại không giới hạn",
  "Bộ 6 identity files template: user.md, identity.md, memory.md, soul.md, agents.md, tools.md",
  "5 Agent blueprints: Research, Idea Generation, Content Production, Book Production, Website & QA",
  "Hướng dẫn setup OpenClaw + Discord multi-agent + Obsidian memory graph",
  "Setup MCP: Zapier, NotebookLM, Gmail, Agent Mail — kết nối tool thực",
  "Security module: 10 lỗ hổng + trust ladder cho agent vận hành an toàn",
  "Money Roadmap: 5 con đường kiếm tiền bằng OpenClaw (in-house · freelance · productized · digital product · affiliate)",
  "Review capstone project cá nhân với mentor",
  "Cộng đồng học viên Zalo hỗ trợ sau khoá học",
];

export default function PricingOpenClaw() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-linear-to-t from-secondary-container/30 to-surface relative overflow-hidden"
      id="pricing"
    >
      {/* Decorative elements */}
      <div className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 right-10 w-56 h-56 border border-primary/5 -rotate-12 animate-spin-slow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter px-2">
              Đầu Tư Một Lần.
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Sở Hữu Hệ OpenClaw Suốt Đời.
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="scale">
          <div className="relative bg-surface-container-high rounded-3xl sm:rounded-4xl p-6 sm:p-10 md:p-12 border-2 border-primary/30 shadow-[0_0_60px_rgba(245,158,11,0.15)]">
            {/* Ribbon */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-linear-to-r from-primary to-primary-container rounded-full text-on-primary-container text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg whitespace-nowrap">
              Không bán lẻ · Chỉ có trong Freedom Builder Pro
            </div>

            <div className="text-center space-y-6 sm:space-y-8">
              <div>
                <div className="text-[10px] sm:text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2">
                  Học phí niêm yết — OpenClaw AI Mastery
                </div>
                <div className="flex items-baseline justify-center gap-2 relative">
                  <span className="text-5xl sm:text-7xl md:text-8xl font-black text-on-surface-variant/70 line-through decoration-red-500 decoration-[6px] sm:decoration-[8px]">
                    5.000.000
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-on-surface-variant/70 line-through decoration-red-500 decoration-[6px] sm:decoration-[8px]">
                    đ
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-on-surface-variant mt-2">
                  5 buổi · 2.5h/buổi · Zoom live trực tiếp
                </div>

                {/* Pro badge */}
                <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-linear-to-r from-primary to-primary-container text-on-primary-container font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg">
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    workspace_premium
                  </span>
                  Bao gồm miễn phí trong Freedom Builder Pro
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left max-w-3xl mx-auto">
                {includedFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex gap-2 sm:gap-3 items-start"
                  >
                    <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface-variant">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <a
                className="flex items-center justify-center gap-2 sm:gap-4 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-2xl hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.4)] animate-pulse-glow w-full sm:w-auto max-w-md mx-auto"
                href={ZALO_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                THAM GIA FREEDOM BUILDER PRO
                <span className="material-symbols-outlined shrink-0">
                  rocket_launch
                </span>
              </a>

              <p className="text-xs sm:text-sm text-on-surface-variant">
                Khoá OpenClaw AI Mastery không bán lẻ · Chỉ dành cho thành viên Freedom Builder Pro
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
