"use client";

import ScrollReveal from "../ScrollReveal";

const before = [
  "Ý tưởng app mãi nằm trên giấy vì không biết code",
  "Thuê dev tốn 30-100 triệu, chờ 1-3 tháng",
  "Thu tiền thủ công, check bank 24/7",
  "Website template sẵn, conversion rate thấp",
  "Quản lý học viên qua Excel, Zalo thủ công",
  "Mỗi lần sửa UI phải nhờ dev, tốn thêm tiền",
];

const after = [
  "Build app đầu tiên trong buổi học đầu tiên",
  "Launch website bán hàng trong 1 buổi, tự chỉnh không cần dev",
  "Hệ thanh toán tự động: nhận tiền → mở quyền ngay lập tức",
  "Landing page chuyển đổi cao, tùy chỉnh 100% theo ý muốn",
  "Platform quản lý khoá học: đăng ký, học liệu, tiến độ tự động",
  "Vibe coding loop: screenshot → Claude → deploy trong 10 phút",
];

export default function TransformationVibeCoding() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Sự Khác Biệt Sau{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                5 Buổi Học
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mt-3 sm:mt-4">
              Cùng 1 con người. Cùng 0 kiến thức code. Nhưng kết quả khác hẳn.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <ScrollReveal direction="left">
            <div className="bg-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-red-500/20 h-full">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-400 text-xl sm:text-2xl">
                    sentiment_stressed
                  </span>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-red-400 font-black uppercase tracking-wider">
                    Trước khoá học
                  </div>
                  <div className="text-lg sm:text-xl font-black text-on-surface">
                    Kẹt — không tự build được
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {before.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm sm:text-base text-on-surface-variant">
                    <span className="material-symbols-outlined text-red-400/80 text-lg sm:text-xl shrink-0">close</span>
                    <span className="line-through decoration-red-500/40">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="bg-linear-to-br from-primary/10 to-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-primary/40 h-full shadow-[0_0_40px_rgba(245,158,11,0.1)]">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">
                    rocket_launch
                  </span>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-wider">
                    Sau khoá học
                  </div>
                  <div className="text-lg sm:text-xl font-black text-on-surface">
                    Tự build, tự deploy, tự bán hàng
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {after.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm sm:text-base text-on-surface font-medium">
                    <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0">check_circle</span>
                    <span>{item}</span>
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
