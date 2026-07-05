"use client";

import ScrollReveal from "./ScrollReveal";

const stack = [
  {
    icon: "school",
    title: "3 ngày huấn luyện chuyên sâu về AIOS",
    description: "Học trực tiếp tư duy, chiến lược, mô hình và lộ trình ứng dụng AI Agent vào doanh nghiệp.",
    value: 15_000_000,
  },
  {
    icon: "psychology",
    title: "Hệ thống tư duy tái cấu trúc doanh nghiệp",
    description: "Nhìn lại doanh nghiệp, xác định điểm nghẽn và chọn khu vực nên AI hoá trước.",
    value: 10_000_000,
  },
  {
    icon: "dashboard",
    title: "Showcase 8 hệ thống Agent thực tế",
    description: "Hệ thống Agent cho marketing, sales, channel growth, branding, affiliate, KDP/POD, business strategy, partnership.",
    value: 20_000_000,
  },
  {
    icon: "code_blocks",
    title: "Framework VibeCoding Business",
    description: "Mô tả ý tưởng kinh doanh, quy trình và hệ thống để AI hỗ trợ triển khai nhanh hơn — không cần biết code.",
    value: 8_000_000,
  },
  {
    icon: "forum",
    title: "Hỏi đáp cá nhân hoá theo mô hình của bạn",
    description: "Mang bài toán thật vào để được phân tích, gợi ý và định hướng triển khai cho chính mô hình kinh doanh của bạn.",
    value: 15_000_000,
  },
  {
    icon: "diversity_3",
    title: "Kết nối cộng đồng tinh hoa",
    description: "Nhóm người đang nghiêm túc đi vào AI Agent, mô hình tinh gọn, thị trường quốc tế, Affiliate, KDP/POD, Freedom Builders.",
    value: 0,
    valueLabel: "Không thể đo bằng tiền",
  },
];

const TOTAL = stack.reduce((sum, item) => sum + item.value, 0);

function formatVND(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export default function ValueStack() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden" id="value">
      <div className="hidden sm:block absolute top-10 right-10 w-40 h-40 border border-primary/5 -rotate-12 animate-spin-slow pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">inventory_2</span>
              GIÁ TRỊ TỔNG CỘNG TRÊN 68 TRIỆU
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              Tổng Giá Trị Bạn Nhận{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Trong Agent Camp
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Nhưng bạn không cần đầu tư mức đó để tham gia — xem giá Early Bird bên dưới.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {stack.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 80} direction={index % 2 === 0 ? "left" : "right"}>
              <div className="group relative bg-surface-container-high p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-primary/15 hover:border-primary/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
                <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary-container text-xl sm:text-2xl">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] sm:text-xs font-black text-primary/70 tabular-nums">GIÁ TRỊ {String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black mb-1 leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant">{item.description}</p>
                </div>
                <div className="shrink-0 sm:text-right w-full sm:w-auto">
                  <div className="inline-block sm:block px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary font-black text-sm sm:text-base">
                    {item.value > 0 ? formatVND(item.value) : item.valueLabel}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Total bar */}
        <ScrollReveal delay={300} direction="scale">
          <div className="relative bg-linear-to-br from-primary/15 via-surface-container-high to-secondary-container/15 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border-2 border-primary/40 shadow-[0_0_40px_rgba(245,158,11,0.15)] overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-5 text-center sm:text-left">
              <div>
                <div className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wider mb-1">Tổng giá trị quy đổi</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-on-surface tabular-nums">
                  Trên {formatVND(TOTAL)}
                </div>
              </div>
              <div className="hidden sm:block w-px h-16 bg-primary/20" />
              <div>
                <div className="text-[10px] sm:text-xs font-black text-green-400 uppercase tracking-wider mb-1">Giá Early Bird</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500 tabular-nums">
                  12.868.000đ
                </div>
                <div className="text-[10px] sm:text-xs text-on-surface-variant mt-1">Hết hạn 20/05 · giới hạn 60 ghế</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
