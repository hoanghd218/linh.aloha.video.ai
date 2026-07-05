"use client";

import ScrollReveal from "./ScrollReveal";

const comparison = [
  {
    aspect: "Cách dạy",
    course: "Bài giảng + slide + ghi chép",
    camp: "Demo hệ thống thật + làm cùng mentor",
    icon: "school",
  },
  {
    aspect: "Bạn ra về với",
    course: "Kiến thức trong đầu — về nhà tự apply",
    camp: "Bộ Agent đang chạy + bản đồ AIOS + roadmap 30 ngày",
    icon: "inventory_2",
  },
  {
    aspect: "Thời điểm có kết quả",
    course: "Vài tháng sau — nếu kiên trì",
    camp: "Trong camp — chạy được luôn khi về",
    icon: "rocket_launch",
  },
  {
    aspect: "Vai trò của bạn",
    course: "Học viên ngồi nghe",
    camp: "Người được chuyển giao + xây cùng mentor",
    icon: "engineering",
  },
  {
    aspect: "Cá nhân hoá",
    course: "Nội dung chung cho cả lớp",
    camp: "Mang bài toán thật vào — phân tích cho mô hình của bạn",
    icon: "person_pin",
  },
];

export default function TransferNotCourse() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface relative overflow-hidden" id="transfer">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">forklift</span>
              CHUYỂN GIAO · KHÔNG PHẢI KHOÁ HỌC
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              Bạn Đến Agent Camp Để{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Được Chuyển Giao — Không Phải Để Ngồi Học
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              3 ngày này không phải lớp lý thuyết. Bạn xây hệ thống <span className="text-primary font-bold">cùng mentor</span>, mang về <span className="text-primary font-bold">Agent đang chạy</span>, và <span className="text-primary font-bold">làm được luôn</span> khi về nhà — không phải "học xong rồi tự tìm cách".
            </p>
          </div>
        </ScrollReveal>

        {/* Header row */}
        <ScrollReveal delay={100}>
          <div className="hidden md:grid grid-cols-[1.2fr_2fr_2fr] gap-4 mb-3 px-2">
            <div></div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 font-black text-xs uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">close</span>
                Khoá học thông thường
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-primary/20 to-primary-container/20 border border-primary/40 text-primary font-black text-xs uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Agent Camp
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Comparison rows */}
        <div className="space-y-2 sm:space-y-3">
          {comparison.map((row, index) => (
            <ScrollReveal key={row.aspect} delay={index * 80} direction="up">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr_2fr] gap-2 sm:gap-4 bg-surface-container-high rounded-xl sm:rounded-2xl border border-primary/15 overflow-hidden">
                {/* Aspect label */}
                <div className="flex items-center gap-3 p-4 sm:p-5 bg-surface-container-lowest/50 md:bg-transparent md:border-r border-primary/10">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl shrink-0">{row.icon}</span>
                  <div>
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-primary/80 md:hidden">Khía cạnh</div>
                    <div className="font-black text-sm sm:text-base text-on-surface">{row.aspect}</div>
                  </div>
                </div>

                {/* Course */}
                <div className="flex items-start gap-2 sm:gap-3 p-4 sm:p-5 md:border-r border-primary/10 bg-red-500/[0.03]">
                  <span className="material-symbols-outlined text-red-400/60 text-base sm:text-lg shrink-0 mt-0.5 md:hidden">close</span>
                  <div className="flex-1">
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-red-300/70 mb-1 md:hidden">Khoá học</div>
                    <p className="text-sm sm:text-base text-on-surface-variant line-through decoration-red-500/40 decoration-2">{row.course}</p>
                  </div>
                </div>

                {/* Camp */}
                <div className="flex items-start gap-2 sm:gap-3 p-4 sm:p-5 bg-primary/[0.04]">
                  <span className="material-symbols-outlined text-primary text-base sm:text-lg shrink-0 mt-0.5 md:hidden">check_circle</span>
                  <div className="flex-1">
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-primary mb-1 md:hidden">Agent Camp</div>
                    <p className="text-sm sm:text-base text-on-surface font-medium">{row.camp}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Punchline */}
        <ScrollReveal delay={400}>
          <div className="mt-8 sm:mt-12 text-center max-w-3xl mx-auto bg-linear-to-r from-primary/10 to-secondary-container/10 rounded-2xl p-5 sm:p-7 border border-primary/30">
            <p className="text-base sm:text-xl text-on-surface font-black mb-2">
              Bạn không "đi học" — bạn đi xây.
            </p>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Mỗi ngày trong camp, bạn ra về với một mảnh ghép AIOS đã ráp xong cho doanh nghiệp mình.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
