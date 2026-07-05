"use client";

import Image from "next/image";
import ScrollReveal from "../ScrollReveal";

export default function SpeakerMastery() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest"
      id="speakers"
    >
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">
                verified_user
              </span>
              GIẢNG VIÊN TRỰC TIẾP
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
              Mentor Của Bạn
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="scale">
          <div className="bg-surface-container-high rounded-2xl sm:rounded-4xl p-6 sm:p-10 border border-primary/20 shadow-[0_0_40px_rgba(245,158,11,0.08)]">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center md:items-start">
              <div className="shrink-0 w-52 h-64 sm:w-72 sm:h-88 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary shadow-xl relative">
                <Image
                  className="w-full h-full object-cover"
                  src="/images/hoang-real.jpg"
                  alt="Tony Hoang"
                  width={288}
                  height={352}
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-white font-bold uppercase">
                    Live Mentor
                  </span>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 text-center md:text-left flex-1">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black">Tony Hoang</h3>
                  <p className="text-sm sm:text-base text-primary font-bold mt-1">
                    CEO BimSpeed Solution · Chuyên gia Claude AI Agent
                  </p>
                </div>

                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  Tony Hoang là người trực tiếp xây dựng và vận hành các hệ thống
                  AI Agent cho marketing, xuất bản và e-commerce. Anh đã train
                  hàng nghìn học viên biến Claude thành &quot;đội ngũ nhân viên AI&quot; 24/7 —
                  không cần background kỹ thuật.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { icon: "groups", value: "2,400+", label: "AI Builders" },
                    { icon: "menu_book", value: "5+", label: "Năm thực chiến" },
                    { icon: "smart_toy", value: "18+", label: "AI Agents đã build" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-surface p-3 rounded-xl border border-primary/10 text-center"
                    >
                      <span className="material-symbols-outlined text-primary text-xl sm:text-2xl mb-1 inline-block">
                        {stat.icon}
                      </span>
                      <div className="text-primary font-black text-lg sm:text-xl">
                        {stat.value}
                      </div>
                      <div className="text-[9px] sm:text-[10px] uppercase font-bold text-on-surface-variant">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-2">
                  {[
                    "Dạy 1-1 với học viên trong từng buổi thực hành live",
                    "Review CLAUDE.md và capstone project của từng học viên",
                    "Hỗ trợ debug Skills, MCP, Sub-Agents trong quá trình build",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-2 text-xs sm:text-sm text-on-surface-variant text-left"
                    >
                      <span className="material-symbols-outlined text-primary text-base sm:text-lg shrink-0">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
