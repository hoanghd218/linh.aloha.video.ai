"use client";

import ScrollReveal from "../ScrollReveal";

const before = [
  "Mở 30 tab Chrome research đối thủ thủ công",
  "Copy-paste từng prompt vào ChatGPT, mất context liên tục",
  "Viết 1 bài content mất 2–3 tiếng, nhớ tone bằng cảm tính",
  "Ebook 50 trang — lên outline 6 tháng vẫn chưa xong",
  "Landing page phải đợi dev 2 tuần & 10 triệu tiền thuê",
  "Không có cách nào bán lại kỹ năng AI của mình",
];

const after = [
  "Research Agent tự scrape đối thủ khi bạn đang ngủ, lưu vào Obsidian memory",
  "OpenClaw điều phối 4+ sub-agents qua Discord — mỗi kênh 1 vai trò",
  "Content Production Agent ra script → carousel → caption → lịch đăng đúng tone",
  "Book Production Agent giữ nhất quán nhân vật/luận điểm xuyên 50 chương",
  "Website & QA Agent tạo landing page + tự kiểm tra + tự fix lỗi, deploy ngay",
  "Sở hữu hệ thống multi AI agents OpenClaw + biết rõ 5 con đường kiếm tiền từ nó",
];

export default function TransformationOpenClaw() {
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
              Cùng 1 con người. Cùng 24 giờ/ngày. Nhưng kết quả khác hẳn khi có OpenClaw.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Before */}
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
                    Làm tất cả bằng tay
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {before.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm sm:text-base text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-red-400/80 text-lg sm:text-xl shrink-0">
                      close
                    </span>
                    <span className="line-through decoration-red-500/40">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* After */}
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
                    Hệ OpenClaw chạy 24/7
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {after.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm sm:text-base text-on-surface font-medium"
                  >
                    <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0">
                      check_circle
                    </span>
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
