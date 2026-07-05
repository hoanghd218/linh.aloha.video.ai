"use client";

import ScrollReveal from "../ScrollReveal";

interface Tier {
  name: string;
  tagline: string;
  price: string;
  note: string;
  icon: string;
  highlight?: boolean;
  badge?: string;
  perks: string[];
  /** Optional strong value-anchor callout shown above the perks */
  valueAnchor?: { label: string; value: string };
}

const tiers: Tier[] = [
  {
    name: "Vé Thường",
    tagline: "Cho người muốn tham dự trọn vẹn một ngày",
    price: "499.000",
    note: "Vé tham dự trực tiếp sự kiện — số lượng giới hạn trong ~200 vé",
    icon: "confirmation_number",
    perks: [
      "Nhận full tài liệu chương trình",
      "Vé tham dự trực tiếp tại sự kiện AI AGENT SUMMIT (08:00 – 18:00)",
    ],
  },
  {
    name: "Vé VIP",
    tagline: "Lựa chọn được nhiều người chọn nhất",
    price: "999.000",
    note: "Đáng giá nhất — chỉ thêm 500.000đ nhưng nhận quà tặng trị giá 8 triệu",
    icon: "workspace_premium",
    highlight: true,
    badge: "PHỔ BIẾN NHẤT",
    valueAnchor: {
      label: "Quà tặng kèm — khoá học \"Agent / Claude Code\" (kèm Skill / Template)",
      value: "Trị giá 8.000.000đ",
    },
    perks: [
      "Toàn bộ quyền lợi Vé Thường",
      "TẶNG khoá học \"Agent / Claude Code\" trị giá 8.000.000đ — kèm bộ Skill / Template",
      "Được tặng thêm 2 vé cho 2 người đi cùng",
    ],
  },
  {
    name: "Vé Super VIP",
    tagline: "Cho người muốn đi xa nhất sau Summit",
    price: "1.999.000",
    note: "Số lượng Super VIP rất giới hạn để đảm bảo chất lượng giao lưu 1:1",
    icon: "diamond",
    badge: "GIỚI HẠN SUẤT",
    perks: [
      "Toàn bộ quyền lợi Vé VIP (gồm quà tặng khoá học trị giá 8.000.000đ)",
      "Được ăn tối cùng diễn giả",
      "30 phút tư vấn riêng 1:1 cùng diễn giả",
      "Được tặng 3 vé cho 3 người đi cùng",
    ],
  },
];

export default function PricingSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-linear-to-t from-secondary-container/30 to-surface relative overflow-hidden"
      id="pricing"
    >
      <div className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 right-10 w-56 h-56 border border-primary/5 -rotate-12 animate-spin-slow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">
                confirmation_number
              </span>
              CHỌN GÓI VÉ CỦA ANH CHỊ
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Đầu Tư Một Ngày —{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Thay Đổi Cách Doanh Nghiệp Vận Hành
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Sự kiện giới hạn ~200 vé. Gói Vé VIP tặng kèm khoá học{" "}
              <span className="text-primary font-bold">trị giá 8.000.000đ</span> —
              giá trị nhận về vượt xa giá vé.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {tiers.map((tier, index) => (
            <ScrollReveal
              key={tier.name}
              delay={index * 110}
              direction="scale"
              className={tier.highlight ? "lg:-mt-4 lg:mb-4" : ""}
            >
              <div
                className={`relative h-full flex flex-col rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all duration-300 ${
                  tier.highlight
                    ? "bg-surface-container-high border-2 border-primary/50 shadow-[0_0_50px_rgba(245,158,11,0.18)]"
                    : "bg-surface-container-high border border-primary/15"
                }`}
              >
                {tier.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      tier.highlight
                        ? "bg-linear-to-r from-primary to-primary-container text-on-primary-container animate-pulse-glow"
                        : "bg-surface-container-highest border border-primary/30 text-primary"
                    }`}
                  >
                    {tier.badge}
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 mt-1">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                      {tier.icon}
                    </span>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-black text-on-surface">
                      {tier.name}
                    </div>
                    <div className="text-[10px] sm:text-xs text-on-surface-variant">
                      {tier.tagline}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-primary/15">
                  <div className="text-[10px] sm:text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider mb-1">
                    Giá vé
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-primary">
                      {tier.price}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-primary">
                      đ
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant mt-1.5 leading-snug">
                    {tier.note}
                  </p>
                </div>

                {/* Value anchor callout */}
                {tier.valueAnchor && (
                  <div className="mb-4 rounded-xl bg-linear-to-br from-primary/15 to-primary-container/5 border border-primary/35 p-3 sm:p-3.5">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0">
                        redeem
                      </span>
                      <div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-on-surface leading-snug">
                          {tier.valueAnchor.label}
                        </div>
                        <div className="text-sm sm:text-base font-black text-primary mt-0.5">
                          {tier.valueAnchor.value}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Perks */}
                <ul className="space-y-2.5 sm:space-y-3 mb-6 flex-1">
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0">
                        check_circle
                      </span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#register"
                  className={`mt-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black text-sm sm:text-base transition-all duration-300 ${
                    tier.highlight
                      ? "bg-linear-to-br from-primary to-primary-container text-on-primary-container hover:scale-[1.03] animate-pulse-glow"
                      : "bg-surface-container-highest border border-primary/30 text-primary hover:border-primary/60"
                  }`}
                >
                  Chọn gói {tier.name}
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    arrow_forward
                  </span>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <p className="text-center text-xs sm:text-sm text-on-surface-variant mt-8 sm:mt-10 max-w-2xl mx-auto">
            Mỗi gói vé chỉ giữ chỗ khi anh chị hoàn tất thanh toán. Sự kiện giới hạn{" "}
            <span className="text-primary font-bold">~200 người</span> — số lượng vé
            VIP và Super VIP rất hạn chế.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
