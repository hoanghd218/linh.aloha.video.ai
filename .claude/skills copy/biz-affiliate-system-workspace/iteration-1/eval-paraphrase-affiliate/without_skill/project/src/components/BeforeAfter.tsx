"use client";

import ScrollReveal from "./ScrollReveal";

const before = [
  "Biết AI rất tiềm năng nhưng chưa biết ứng dụng vào đâu",
  "Dùng nhiều tool nhưng chưa tạo thành hệ thống",
  "Muốn tăng trưởng nhưng đội nhóm còn chậm",
  "Muốn xây kênh nhưng nội dung chưa đều",
  "Muốn marketing tốt hơn nhưng thiếu chiến lược",
  "Muốn bán hàng tốt hơn nhưng thiếu quy trình",
  "Muốn làm affiliate / KDP / POD nhưng còn thủ công",
  "Muốn ứng dụng Agent nhưng chưa có bản đồ",
  "Muốn tái cấu trúc doanh nghiệp nhưng thiếu phương pháp",
];

const after = [
  "Hiểu AIOS là gì và vì sao quan trọng",
  "Có bản đồ ứng dụng AI Agent cho mô hình của mình",
  "Biết bộ phận nào nên AI hoá trước",
  "Biết cách thiết kế workflow và Agent",
  "Biết dùng AI cho marketing, bán hàng, xây kênh",
  "Nhìn rõ mô hình Affiliate / KDP / POD bằng Agent",
  "Có roadmap 30 ngày triển khai sau chương trình",
  "Kết nối với nhóm người cùng tư duy tiên phong",
  "Tự tin bước vào kỷ nguyên AI Agent",
];

export default function BeforeAfter() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface" id="before-after">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">swap_horiz</span>
              TRƯỚC & SAU AGENT CAMP
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              3 Ngày Tạo Khoảng Cách{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Khác Biệt Rõ Rệt
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* Before */}
          <ScrollReveal direction="left">
            <div className="relative bg-surface-container-lowest p-5 sm:p-7 rounded-xl sm:rounded-2xl border border-red-500/20 h-full">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 sm:pb-5 border-b border-red-500/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-400 text-xl sm:text-2xl">close</span>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-red-300">Trước Agent Camp</div>
                  <h3 className="text-base sm:text-xl font-black text-on-surface">Hiện tại của bạn</h3>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {before.map((item) => (
                  <li key={item} className="flex gap-2 sm:gap-3 text-sm sm:text-base text-on-surface-variant">
                    <span className="material-symbols-outlined text-red-400/60 text-base sm:text-lg shrink-0 mt-0.5">remove</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* After */}
          <ScrollReveal direction="right">
            <div className="relative bg-linear-to-br from-primary/10 to-surface-container-high p-5 sm:p-7 rounded-xl sm:rounded-2xl border-2 border-primary/30 h-full shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 sm:pb-5 border-b border-primary/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <span className="material-symbols-outlined text-on-primary-container text-xl sm:text-2xl">check</span>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-primary">Sau Agent Camp</div>
                  <h3 className="text-base sm:text-xl font-black text-on-surface">Phiên bản tiên phong</h3>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {after.map((item) => (
                  <li key={item} className="flex gap-2 sm:gap-3 text-sm sm:text-base text-on-surface">
                    <span className="material-symbols-outlined text-primary text-base sm:text-lg shrink-0 mt-0.5">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
