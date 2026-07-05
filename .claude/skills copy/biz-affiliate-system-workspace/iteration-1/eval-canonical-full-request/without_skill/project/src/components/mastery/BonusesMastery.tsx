"use client";

import ScrollReveal from "../ScrollReveal";

interface Bonus {
  tag: string;
  title: string;
  desc: string;
  value: string;
  icon: string;
}

const bonuses: Bonus[] = [
  {
    tag: "BONUS #1",
    title: "Thư viện 50+ CLAUDE.md Template",
    desc: "Template cho 10 ngành: F&B, coaching, e-commerce, bất động sản, giáo dục... Chỉ việc fill-in thương hiệu của bạn là dùng được ngay.",
    value: "2.000.000đ",
    icon: "library_books",
  },
  {
    tag: "BONUS #2",
    title: "Bộ 5 Skills Marketing Pro Đã Build Sẵn",
    desc: "market-researcher, idea-generator, content-writer, book-outliner, seo-optimizer — plug & play, không cần tự code từ đầu.",
    value: "3.000.000đ",
    icon: "auto_awesome",
  },
  {
    tag: "BONUS #3",
    title: "Prompt Library 200+ Prompts Thực Chiến",
    desc: "Prompt cho content, email, sales page, landing page, ads, nghiên cứu thị trường — đã được test và tối ưu.",
    value: "1.500.000đ",
    icon: "list_alt",
  },
  {
    tag: "BONUS #4",
    title: "Workshop Live Q&A Hàng Tuần (3 tháng)",
    desc: "3 buổi/tháng — review CLAUDE.md, debug Skills, tư vấn case thực tế của bạn với Tony Hoang.",
    value: "5.000.000đ",
    icon: "forum",
  },
  {
    tag: "BONUS #5",
    title: "Cộng Đồng Private Zalo Học Viên",
    desc: "Nơi 200+ AI builder cùng chia sẻ case, trao đổi prompt, review CLAUDE.md lẫn nhau. Truy cập trọn đời.",
    value: "Không định giá được",
    icon: "groups",
  },
  {
    tag: "BONUS #6",
    title: "Recording Trọn Bộ Khoá Học",
    desc: "Toàn bộ 5 buổi + 3 tháng Q&A. Xem lại không giới hạn, update khi có phiên bản Claude mới.",
    value: "2.500.000đ",
    icon: "video_library",
  },
];

const totalValue = "14.000.000đ+";

export default function BonusesMastery() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute top-20 right-10 w-56 h-56 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">
                card_giftcard
              </span>
              TẶNG KÈM KHI VÀO FREEDOM BUILDER PRO
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              6 Bonus Trị Giá{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                {totalValue}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mt-3 sm:mt-4">
              Chỉ có trong gói{" "}
              <span className="text-primary font-bold">Freedom Builder Pro</span> —
              không bán lẻ từng bonus
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {bonuses.map((bonus, index) => (
            <ScrollReveal key={bonus.tag} delay={index * 80}>
              <div className="group relative bg-surface-container-high rounded-2xl p-5 sm:p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />

                <div className="relative z-10 flex gap-4">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                      {bonus.icon}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                        {bonus.tag}
                      </span>
                      <span className="text-[10px] sm:text-xs text-on-surface-variant font-bold">
                        Trị giá{" "}
                        <span className="line-through decoration-red-500 decoration-2">
                          {bonus.value}
                        </span>
                      </span>
                    </div>
                    <h3 className="font-black text-sm sm:text-base text-on-surface leading-tight">
                      {bonus.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant">
                      {bonus.desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Value stack summary */}
        <ScrollReveal>
          <div className="mt-8 sm:mt-12 max-w-2xl mx-auto bg-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-primary/30 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
            <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
              <div className="flex items-center justify-between text-sm sm:text-base text-on-surface-variant pb-2 border-b border-outline-variant/20">
                <span>Khoá học Claude AI Mastery (5 buổi)</span>
                <span className="font-bold line-through decoration-red-500 decoration-2">
                  10.000.000đ
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base text-on-surface-variant pb-2 border-b border-outline-variant/20">
                <span>6 Bonus đi kèm</span>
                <span className="font-bold line-through decoration-red-500 decoration-2">
                  {totalValue}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base text-on-surface pb-2 border-b border-outline-variant/20">
                <span className="font-bold">Tổng giá trị niêm yết</span>
                <span className="font-black text-lg sm:text-xl text-on-surface line-through decoration-red-500 decoration-[3px]">
                  24.000.000đ+
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 gap-3">
                <span className="text-sm sm:text-base font-bold text-on-surface">
                  Bạn sở hữu qua
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary-container font-black text-xs sm:text-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm sm:text-base">
                    lock
                  </span>
                  Freedom Builder Pro
                </span>
              </div>
            </div>
            <div className="text-center py-3 px-4 rounded-xl bg-primary/10 border border-primary/30">
              <span className="text-sm sm:text-base text-primary font-black">
                CHỈ CÓ TRONG GÓI FREEDOM BUILDER PRO — KHÔNG BÁN LẺ
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
