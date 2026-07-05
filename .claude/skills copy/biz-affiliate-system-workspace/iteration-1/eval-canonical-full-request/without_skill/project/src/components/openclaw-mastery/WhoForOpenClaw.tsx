"use client";

import ScrollReveal from "../ScrollReveal";

const forWho = [
  "Marketer muốn scale content gấp 10 lần mà không tăng nhân sự",
  "Chủ doanh nghiệp muốn thay cả phòng marketing bằng hệ AI 24/7",
  "Content creator muốn tập trung sáng tạo, OpenClaw lo phần còn lại",
  "Tác giả / người viết sách muốn rút ngắn thời gian xuất bản xuống 1/10",
  "Agency owner muốn dựng \"done-for-you digital employee\" bán lại cho khách",
  "Chuyên gia domain (real estate, F&B, e-com) muốn kiếm tiền từ kỹ năng agent",
];

const notForWho = [
  "Người tìm \"bí kíp giàu nhanh\" không cần làm gì",
  "Người không sẵn sàng dành 2.5h/buổi học thực hành live",
  "Người chỉ muốn lý thuyết, không muốn build agent thật",
  "Người kỳ vọng AI thay thế 100% tư duy thiết kế hệ thống của con người",
];

export default function WhoForOpenClaw() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Khoá Học Này{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Dành Cho Ai?
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <ScrollReveal direction="left">
            <div className="bg-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-primary/30 h-full">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl">
                  check_circle
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-on-surface">
                  Phù hợp nếu bạn là...
                </h3>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {forWho.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm sm:text-base text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0 mt-0.5">
                      arrow_forward
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="bg-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-red-500/20 h-full">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <span className="material-symbols-outlined text-red-400 text-3xl sm:text-4xl">
                  do_not_disturb_on
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-on-surface">
                  KHÔNG phù hợp nếu...
                </h3>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {notForWho.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm sm:text-base text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-red-400/70 text-lg sm:text-xl shrink-0 mt-0.5">
                      close
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
