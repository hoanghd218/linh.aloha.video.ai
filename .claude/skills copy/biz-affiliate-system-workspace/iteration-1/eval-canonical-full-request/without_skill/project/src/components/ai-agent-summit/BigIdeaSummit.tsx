"use client";

import ScrollReveal from "../ScrollReveal";

const evolution = [
  { stage: "AI Tool", desc: "Công cụ đơn lẻ", icon: "build" },
  { stage: "Workflow", desc: "Quy trình tự động", icon: "account_tree" },
  { stage: "AI Agent", desc: "Đội ngũ làm việc", icon: "smart_toy" },
  { stage: "AIOS", desc: "Hệ điều hành doanh nghiệp", icon: "hub" },
];

export default function BigIdeaSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-linear-to-b from-surface to-secondary-container/20 relative overflow-hidden"
      id="big-idea"
    >
      <div className="hidden sm:block absolute bottom-1/4 left-10 w-40 h-40 border border-primary/10 -rotate-12 animate-spin-slow pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-base sm:text-lg">
              lightbulb
            </span>
            BIG IDEA
          </div>
        </ScrollReveal>

        <ScrollReveal direction="scale">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-on-surface leading-[1.2] tracking-tighter max-w-4xl mx-auto">
            Doanh nghiệp thời đại mới không thắng vì{" "}
            <span className="text-on-surface-variant line-through decoration-red-500/60 decoration-2">
              nhiều nhân sự hơn
            </span>
            . Doanh nghiệp thắng vì có{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
              hệ thống AI Agent mạnh hơn
            </span>
            .
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mt-6 italic border-l-2 border-primary/40 pl-4 text-left">
            AI Agent không chỉ giúp doanh nghiệp làm việc nhanh hơn — AI Agent giúp
            doanh nghiệp được thiết kế lại thông minh hơn.
          </p>
        </ScrollReveal>

        {/* Evolution flow */}
        <ScrollReveal delay={250}>
          <div className="mt-12 sm:mt-16">
            <div className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-widest mb-5">
              AI đi từ công cụ → hệ điều hành
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {evolution.map((step, index) => (
                <div key={step.stage} className="relative">
                  <div className="h-full bg-surface-container-high rounded-2xl p-4 sm:p-5 border border-primary/20 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                        {step.icon}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-on-surface">
                      {step.stage}
                    </div>
                    <div className="text-[10px] sm:text-xs text-on-surface-variant">
                      {step.desc}
                    </div>
                  </div>
                  {index < evolution.length - 1 && (
                    <span className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 material-symbols-outlined text-primary text-xl">
                      arrow_forward
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
