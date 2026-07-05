"use client";

import ScrollReveal from "../ScrollReveal";

const freeFeatures = [
  "Tham gia 2 buổi Zoom live cùng 3 mentor",
  "Hiểu AI Agent là gì và vì sao quan trọng từ 2026",
  "Bản đồ các khâu trong business có thể ứng dụng AI",
  "Tư duy cơ bản về Input → Process → Output",
  "Cách nhìn AI như lớp trợ lý vận hành — không chỉ là công cụ hỏi đáp",
];

const paidFeatures = [
  "Toàn bộ nội dung 2 buổi Zoom live",
  "9 bộ Skill AI Agent lắp vào dùng ngay cho người kinh doanh",
  "Agent đẻ content, đọc vị nỗi đau, kịch bản tư vấn, chăm lead 7 ngày",
  "Agent tái chế nội dung 1 → 10, báo cáo cuối ngày, biến kinh nghiệm thành SOP",
  "Agent soi đối thủ & tìm góc bán, dựng chiến dịch bán hàng 7 ngày",
  "Quy trình + prompt + template để bắt đầu áp dụng vào công việc thật",
];

export default function PricingZoom() {
  return (
    <section
      className="py-10 sm:py-24 px-4 sm:px-6 bg-linear-to-t from-secondary-container/30 to-surface relative overflow-hidden"
      id="pricing"
    >
      <div className="hidden sm:block absolute top-1/4 left-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 right-10 w-56 h-56 border border-primary/5 -rotate-12 animate-spin-slow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter px-2">
              Chọn Vé Phù Hợp Với{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Mức Độ Nghiêm Túc Của Bạn
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mt-4 max-w-2xl mx-auto">
              Cả hai vé đều tham gia đủ 2 buổi Zoom. Vé trả phí có thêm 9 bộ AI
              Agent triển khai ngay vào business.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {/* FREE tier */}
          <ScrollReveal direction="left">
            <div className="bg-surface-container-high rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-primary/20 h-full flex flex-col">
              <div className="text-center mb-5 sm:mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest/80 border border-outline-variant/30 text-on-surface-variant font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">
                    confirmation_number
                  </span>
                  Vé miễn phí
                </div>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl sm:text-6xl font-black text-on-surface">
                    0đ
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
                  Cho người muốn hiểu bức tranh tổng quan về AI Agent
                </p>
              </div>

              <ul className="space-y-2.5 sm:space-y-3 flex-1 mb-6">
                {freeFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 text-sm text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-primary text-base sm:text-lg shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#register"
                className="flex items-center justify-center gap-2 bg-surface-container-highest border-2 border-primary/30 hover:border-primary text-on-surface px-5 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base transition-all hover:scale-[1.02]"
              >
                Đăng ký vé miễn phí
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </ScrollReveal>

          {/* PAID tier */}
          <ScrollReveal direction="right">
            <div className="relative bg-linear-to-br from-primary/15 to-surface-container-high rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-primary/40 shadow-[0_0_60px_rgba(245,158,11,0.15)] h-full flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-linear-to-r from-primary to-primary-container rounded-full text-on-primary-container text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg whitespace-nowrap">
                Khuyến nghị · Có 9 bộ Agent
              </div>

              <div className="text-center mb-5 sm:mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">
                    workspace_premium
                  </span>
                  Vé trả phí
                </div>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-black text-on-surface">
                    499.000
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-on-surface">
                    đ
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
                  Cho người muốn học xong có tài sản cầm về triển khai ngay
                </p>
              </div>

              <ul className="space-y-2.5 sm:space-y-3 flex-1 mb-6">
                {paidFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 text-sm text-on-surface"
                  >
                    <span className="material-symbols-outlined text-primary text-base sm:text-lg shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#register"
                className="flex items-center justify-center gap-2 sm:gap-3 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-5 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(245,158,11,0.35)] animate-pulse-glow"
              >
                Lấy vé trả phí + 9 bộ Agent
                <span className="material-symbols-outlined">rocket_launch</span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="mt-8 sm:mt-12 max-w-3xl mx-auto text-center">
            <p className="text-sm sm:text-base text-on-surface-variant italic">
              499K có thể bằng một bữa ăn, một phần nhỏ chi phí quảng cáo, hay vài
              giờ lương nhân sự. Nhưng nếu sau chương trình bạn nhìn ra một khâu đang
              ngốn hàng chục giờ mỗi tháng — và biết cách AI hóa nó — số tiền này
              quá nhỏ so với giá trị bạn nhận lại.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
