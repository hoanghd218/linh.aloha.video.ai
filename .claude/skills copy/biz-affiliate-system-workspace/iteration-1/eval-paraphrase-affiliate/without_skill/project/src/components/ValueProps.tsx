"use client";

import ScrollReveal from "./ScrollReveal";

const outcomes = [
  {
    icon: "map",
    title: "Bản Đồ AIOS Cho Doanh Nghiệp Của Bạn",
    description:
      "Nhìn mô hình theo 12 lớp: sản phẩm, thị trường, marketing, sales, kênh, nội dung, đội nhóm, vận hành, dữ liệu, đối tác — xác định khu vực AI hoá trước.",
  },
  {
    icon: "alt_route",
    title: "Lộ Trình 8 Bước Triển Khai Agent",
    description:
      "Từ phân tích mô hình → tìm điểm nghẽn → thiết kế workflow → xây Agent → kết nối marketing/sales → đo lường → nhân bản sang bộ phận khác.",
  },
  {
    icon: "psychology",
    title: "Tư Duy Tái Cấu Trúc Doanh Nghiệp Bằng AI",
    description:
      "Biết cách đặt câu hỏi mới: việc nào lặp lại quá nhiều, quy trình nào chuẩn hoá được, bộ phận nào nên giao Agent, con người giữ vai trò gì.",
  },
  {
    icon: "code_blocks",
    title: "Năng Lực VibeCoding Business",
    description:
      "Không cần biết code. Cần biết mô tả ý tưởng, mô hình tăng trưởng, quy trình đủ rõ để AI biến thành workflow, MVP, tài liệu bán hàng trong giờ — không phải tháng.",
  },
  {
    icon: "view_carousel",
    title: "Showcase Hệ Thống Agent Thực Tế",
    description:
      "Xem hệ thống AIOS thật cho marketing, bán hàng, content engine, AI Affiliate, Amazon KDP, POD, thương hiệu cá nhân — cách các mảnh ghép kết nối thành bộ máy tăng trưởng.",
  },
  {
    icon: "forum",
    title: "Hỏi Đáp Cá Nhân Hoá Theo Bài Toán Thật",
    description:
      "Mang doanh nghiệp thật của bạn vào — được phân tích, gợi ý và định hướng triển khai cho chính mô hình kinh doanh của bạn, không phải case study chung chung.",
  },
];

export default function ValueProps() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6" id="outcomes">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">target</span>
              KẾT QUẢ SAU 3 NGÀY
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              Bạn Sẽ{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Mang Về Gì
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Không chỉ là kiến thức. Bạn rời camp với bản đồ + lộ trình + tư duy + showcase + roadmap 30 ngày cho doanh nghiệp của mình.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {outcomes.map((prop, index) => (
            <ScrollReveal key={prop.icon} delay={index * 100} direction="up">
              <div className="bg-surface-container-high p-6 sm:p-8 rounded-xl sm:rounded-2xl border-t-4 border-primary-container flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 h-full hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                <span className="material-symbols-outlined text-primary text-4xl sm:text-5xl mb-3 sm:mb-5">
                  {prop.icon}
                </span>
                <h3 className="text-base sm:text-lg font-black mb-2 sm:mb-3 uppercase tracking-tight">{prop.title}</h3>
                <p className="text-sm sm:text-base text-on-surface-variant">{prop.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
