"use client";

import ScrollReveal from "../ScrollReveal";

export default function FinalCTAZoom() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-linear-to-t from-secondary-container/30 to-surface relative overflow-hidden">
      <div className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 right-10 w-56 h-56 border border-primary/5 -rotate-12 animate-spin-slow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <ScrollReveal>
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-600/15 border border-red-500/30 text-red-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
            <span className="material-symbols-outlined text-red-400 animate-pulse text-sm sm:text-base">
              schedule
            </span>
            ĐĂNG KÝ 2 BUỔI ZOOM — SLOT VÉ TRẢ PHÍ CÓ HẠN
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter px-2">
            Đừng Chờ Đến Khi Ai Cũng Có AI Agent
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
              Rồi Bạn Mới Bắt Đầu Học
            </span>
          </h2>

          <p className="text-base sm:text-xl text-on-surface-variant max-w-3xl mx-auto">
            Khi đó bạn không còn đi trước — bạn chỉ đang chạy theo. Bây giờ là thời
            điểm tốt nhất để bắt đầu từ một quy trình nhỏ, một Agent nhỏ, một use
            case thật — và{" "}
            <span className="text-primary font-bold">
              tích lũy lợi thế vận hành cho chính doanh nghiệp của mình
            </span>
            .
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: "groups",
                title: "3 Mentor đồng hành",
                desc: "Hoang Tran · Tony Trieu · Trương Cảnh Thắng",
              },
              {
                icon: "inventory_2",
                title: "9 bộ AI Agent dùng ngay",
                desc: "Khi chọn vé trả phí 499K — lắp vào business chạy luôn",
              },
              {
                icon: "psychology",
                title: "Tư duy hệ thống AI",
                desc: "Input → Process → Output cho người kinh doanh",
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
            <div className="flex flex-wrap items-baseline justify-center gap-3">
              <span className="text-xs sm:text-sm text-on-surface-variant font-bold uppercase tracking-wider">
                Vé miễn phí 0đ · Vé trả phí
              </span>
              <span className="text-2xl sm:text-3xl font-black text-primary">
                499.000đ
              </span>
            </div>

            <a
              href="#register"
              className="flex items-center justify-center gap-2 sm:gap-4 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 sm:px-14 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-2xl hover:scale-110 transition-transform shadow-[0_20px_50px_rgba(245,158,11,0.4)] animate-pulse-glow w-full sm:w-auto max-w-md sm:max-w-none mx-auto"
            >
              <span className="material-symbols-outlined shrink-0">
                rocket_launch
              </span>
              ĐĂNG KÝ 2 BUỔI ZOOM
            </a>

            <div className="flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm">
              <span className="material-symbols-outlined text-green-400 text-base">
                verified
              </span>
              <span>
                Slot vé trả phí có hạn · 9 bộ Agent chỉ tặng cho người đăng ký sớm
              </span>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-outline-variant/20 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-on-surface-variant italic">
              &ldquo;Bạn không cần học AI Agent vì nó đang hot — bạn cần học vì
              doanh nghiệp của bạn không thể mãi vận hành bằng sức người, trí nhớ và
              sự xoay xở thủ công. Chi phí đang tăng, khách hàng đòi hỏi nhanh hơn,
              đối thủ test nhanh hơn — và thị trường không còn nhiều chỗ cho những
              hệ thống chậm chạp.&rdquo;
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
