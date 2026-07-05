"use client";

import ScrollReveal from "./ScrollReveal";

type Tier = {
  badge: string;
  period: string;
  price: number;
  description: string;
  highlight?: boolean;
  badgeColor: string;
  isCurrent?: boolean;
};

const tiers: Tier[] = [
  {
    badge: "EARLY BIRD",
    period: "16 – 20/05",
    price: 12_868_000,
    description: "Dành cho anh chị đăng ký sớm, quyết định nhanh và muốn giữ chỗ trong nhóm đầu tiên.",
    highlight: true,
    badgeColor: "from-green-500 to-emerald-600",
    isCurrent: true,
  },
  {
    badge: "GIAI ĐOẠN 2",
    period: "20 – 25/05",
    price: 19_868_000,
    description: "Cho anh chị đăng ký trong giai đoạn tiếp theo trước khi chương trình quay về giá public.",
    badgeColor: "from-amber-500 to-orange-600",
  },
  {
    badge: "GIÁ PUBLIC",
    period: "Sau 25/05",
    price: 26_868_000,
    description: "Mức giá chính thức của Agent Camp khi giai đoạn Early Bird kết thúc.",
    badgeColor: "from-gray-500 to-gray-600",
  },
];

function formatVND(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export default function Pricing() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface relative overflow-hidden" id="pricing">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">payments</span>
              MỨC ĐẦU TƯ THAM GIA
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              3 Tier{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Theo Giai Đoạn
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Người quyết định sớm có mức đầu tư tốt hơn. Hôm nay là Early Bird — tiết kiệm 14 triệu so với giá public.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {tiers.map((tier, index) => (
            <ScrollReveal key={tier.badge} delay={index * 120} direction="up">
              <div
                className={`relative h-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 border transition-all duration-300 ${
                  tier.highlight
                    ? "bg-linear-to-br from-primary/15 via-surface-container-high to-secondary-container/10 border-primary/50 shadow-[0_0_40px_rgba(245,158,11,0.18)] sm:-translate-y-2"
                    : "bg-surface-container-high border-primary/15 hover:border-primary/30"
                }`}
              >
                {tier.isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full bg-linear-to-r from-green-500 to-emerald-500 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-lg animate-pulse">
                    ⚡ Đang áp dụng hôm nay
                  </div>
                )}

                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r ${tier.badgeColor} text-white font-black text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4`}>
                  {tier.badge}
                </div>

                <div className="text-xs sm:text-sm text-on-surface-variant font-medium mb-2">
                  {tier.period}
                </div>

                <div className="mb-3 sm:mb-4">
                  <div className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter tabular-nums ${tier.highlight ? "text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-container" : "text-on-surface"}`}>
                    {formatVND(tier.price)}
                  </div>
                  {tier.highlight && (
                    <div className="text-xs sm:text-sm text-green-400 font-bold mt-1">
                      Tiết kiệm <span className="tabular-nums">{formatVND(26_868_000 - tier.price)}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-on-surface-variant mb-5 sm:mb-6 min-h-[3rem]">{tier.description}</p>

                <a
                  href="#register"
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-xl font-black text-sm sm:text-base transition-all duration-300 ${
                    tier.highlight
                      ? "bg-linear-to-br from-primary to-primary-container text-on-primary-container hover:scale-[1.02] animate-pulse-glow"
                      : "bg-surface border border-primary/30 text-on-surface hover:bg-surface-container-highest hover:border-primary/50"
                  }`}
                >
                  {tier.highlight ? "GIỮ CHỖ NGAY" : "Đăng ký"}
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Urgency points */}
        <ScrollReveal delay={400}>
          <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {[
              { icon: "groups", title: "Số lượng giới hạn", desc: "Khoảng 60 ghế để giữ chất lượng mastermind" },
              { icon: "trending_up", title: "Giá tăng theo giai đoạn", desc: "Càng đăng ký sớm càng đầu tư ít" },
              { icon: "psychology", title: "Có thời gian chuẩn bị bài toán", desc: "Đăng ký sớm → chuẩn bị mô hình kinh doanh kỹ hơn" },
              { icon: "rocket_launch", title: "AI Agent đang thay đổi nhanh", desc: "Người hiểu sớm sẽ có lợi thế thật" },
            ].map((point) => (
              <div key={point.title} className="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-2 inline-block">{point.icon}</span>
                <div className="text-sm sm:text-base font-black text-on-surface mb-1">{point.title}</div>
                <div className="text-[11px] sm:text-xs text-on-surface-variant">{point.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
