"use client";

import ScrollReveal from "../ScrollReveal";

const forWho = [
  "Chủ doanh nghiệp nhỏ hoặc vừa đang bị cuốn vào quá nhiều việc vận hành",
  "Người kinh doanh online, chủ shop, người bán dịch vụ, coach, consultant, agency",
  "Affiliate, nhà đào tạo, marketer muốn ứng dụng AI vào công việc thật",
  "Người đã dùng AI nhưng cảm thấy mọi thứ vẫn rời rạc, chưa thành quy trình",
  "Người đã xem nhiều video AI nhưng chưa biết bắt đầu từ đâu",
  "Người muốn biết khâu nào trong business nên AI hóa trước",
  "Người muốn xây hệ thống giảm tải content, sale, CSKH, research, báo cáo, follow-up",
  "Người nghiêm túc với việc ứng dụng AI vào kinh doanh trong năm 2026",
];

const notForWho = [
  "Người chỉ muốn nghe cho vui, sưu tầm tool nhưng không chịu triển khai",
  "Người muốn “bí kíp làm giàu nhanh bằng AI”",
  "Người nghĩ chỉ cần một prompt là doanh nghiệp tự vận hành",
  "Người muốn AI thay mình làm tất cả mà bản thân không cần hiểu quy trình",
  "Người không chịu nhìn lại hệ thống kinh doanh của mình",
  "Người muốn mọi thứ miễn phí nhưng vẫn đòi kết quả sâu, có template, có framework",
];

export default function WhoForZoom() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Chương Trình Này{" "}
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

        <ScrollReveal>
          <div className="mt-8 sm:mt-12 text-center max-w-3xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-5 sm:p-6">
            <p className="text-sm sm:text-base text-on-surface-variant">
              Nói thẳng:{" "}
              <span className="text-on-surface font-bold">
                Nếu bạn chỉ muốn biết AI Agent là gì, vé miễn phí đã đủ.
              </span>{" "}
              Nhưng nếu bạn muốn mang về bộ Skill Agent để bắt đầu ứng dụng thật —{" "}
              <span className="text-primary font-bold">vé trả phí dành cho bạn.</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
