"use client";

import ScrollReveal from "../ScrollReveal";

const ZALO_LINK = "https://zalo.me/g/kxvavk323";

export default function FinalCTAMastery() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-linear-to-t from-secondary-container/30 to-surface relative overflow-hidden">
      <div className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 right-10 w-56 h-56 border border-primary/5 -rotate-12 animate-spin-slow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <ScrollReveal>
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
            <span className="material-symbols-outlined text-red-400 animate-pulse text-sm sm:text-base">
              lock
            </span>
            KHÔNG BÁN LẺ — CHỈ CÓ TRONG FREEDOM BUILDER PRO
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter px-2">
            Sau 5 Buổi Học,
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
              Cuộc Sống Của Bạn Sẽ Khác.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-on-surface-variant max-w-2xl mx-auto">
            Trong khi đối thủ của bạn vẫn đang viết content bằng tay, bạn đã có 1 hệ
            AI Agent chạy 24/7 — research, viết, xuất bản, bán hàng. Tất cả trong{" "}
            <span className="text-primary font-bold">1 tuần.</span>
          </p>

          {/* 3 reasons to act now */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: "payments",
                title: "Học phí 8.000.000đ",
                desc: "Thanh toán một lần, sở hữu trọn bộ khoá học + bonus",
              },
              {
                icon: "card_giftcard",
                title: "6 Bonus tặng kèm",
                desc: "Trị giá 14 triệu — tặng kèm miễn phí",
              },
              {
                icon: "shield",
                title: "Cam kết hoàn tiền",
                desc: "100% sau buổi 2 nếu không hài lòng",
              },
            ].map((r) => (
              <div
                key={r.title}
                className="bg-surface-container-high/80 backdrop-blur rounded-xl p-4 border border-primary/20"
              >
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-1 inline-block">
                  {r.icon}
                </span>
                <div className="font-black text-sm sm:text-base text-on-surface">
                  {r.title}
                </div>
                <div className="text-[11px] sm:text-xs text-on-surface-variant">
                  {r.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-lg sm:text-2xl text-primary font-black">
                8.000.000đ
              </span>
              <span className="text-xs sm:text-sm text-on-surface-variant font-bold uppercase tracking-wider">
                Học phí
              </span>
            </div>

            <a
              className="flex items-center justify-center gap-2 sm:gap-4 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-14 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-2xl hover:scale-110 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.4)] animate-pulse-glow w-full sm:w-auto max-w-md sm:max-w-none mx-auto"
              href={ZALO_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined shrink-0">rocket_launch</span>
              ĐĂNG KÝ NGAY
            </a>

            <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm">
              <span className="material-symbols-outlined text-green-400 text-base">
                verified
              </span>
              <span>
                Đã có <span className="font-bold text-on-surface">2,400+</span> thành
                viên Pro · Slot có hạn
              </span>
            </div>
          </div>

          {/* Reassurance */}
          <div className="pt-6 sm:pt-8 border-t border-outline-variant/20 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-on-surface-variant italic">
              &ldquo;Khoá Claude AI Mastery này không bán lẻ ở bất kỳ đâu. Nó là 1 đặc
              quyền chỉ dành cho thành viên Freedom Builder Pro — cùng với toàn bộ
              bonus 14 triệu và cam kết hoàn tiền 100% sau buổi 2. Nếu bạn muốn sở
              hữu hệ AI Agent riêng, đây là con đường duy nhất.&rdquo;
            </p>
            <div className="mt-3 text-xs sm:text-sm text-primary font-bold">
              — Tony Hoang
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
