"use client";

import ScrollReveal from "./ScrollReveal";

const days = [
  {
    day: "NGÀY 1 — THỨ 5, 29/05",
    number: "01",
    title: "Tư duy AIOS & tái cấu trúc mô hình kinh doanh bằng AI Agent",
    description:
      "Bức tranh lớn. Bạn hiểu vì sao AI Agent không chỉ là công cụ — mà là cách mới để thiết kế doanh nghiệp trong kỷ nguyên này.",
    learn: [
      "Sự khác nhau giữa AI Tool, AI Workflow, AI Agent và AIOS",
      "Vì sao doanh nghiệp cần hệ điều hành AIOS",
      "Phân tích doanh nghiệp theo thị trường, sản phẩm, kênh, đội nhóm, quy trình",
      "Tìm điểm nghẽn trong marketing, bán hàng, xây kênh, vận hành",
      "Xác định bộ phận nên AI hoá đầu tiên",
      "Mô hình 'công ty Agent' cho SME",
    ],
    practice: [
      "Vẽ bản đồ mô hình kinh doanh hiện tại",
      "Xác định điểm nghẽn lớn nhất",
      "Chọn 1–3 khu vực ứng dụng Agent trước",
      "Thiết kế phiên bản AIOS sơ bộ cho doanh nghiệp của bạn",
    ],
    outcome: "Có bản đồ rõ doanh nghiệp nên bắt đầu ứng dụng AI Agent từ đâu",
  },
  {
    day: "NGÀY 2 — THỨ 6, 30/05",
    number: "02",
    title: "Xây hệ thống Agent cho Marketing, Bán hàng, Xây kênh & Tăng trưởng",
    description:
      "AI chỉ thật sự có giá trị khi đi vào điểm tạo tiền của doanh nghiệp. Ngày 2 tập trung vào marketing, sales và content engine.",
    learn: [
      "Xây hệ thống Agent cho marketing đa kênh",
      "Dùng Agent nghiên cứu thị trường, insight, pain point, hành vi mua",
      "Xây chiến lược nội dung đa kênh có khả năng nhân bản",
      "Xây Sales Agent tư vấn, chăm sóc, xử lý phản đối",
      "Kết nối marketing → sales → chăm sóc thành một hệ thống",
      "VibeCoding Business — biến ý tưởng thành workflow nhanh hơn",
    ],
    practice: [
      "Xác định kênh tăng trưởng quan trọng nhất cho mô hình",
      "Xây cấu trúc hệ thống marketing + sales bằng Agent",
      "Xác định các Agent cần có trong hệ thống tăng trưởng",
      "Thiết kế workflow: nội dung → niềm tin → nhu cầu → chuyển đổi → chăm sóc",
    ],
    outcome: "Hiểu cách AI Agent hỗ trợ trực tiếp vào marketing, bán hàng và xây kênh",
  },
  {
    day: "NGÀY 3 — THỨ 7, 31/05",
    number: "03",
    title: "AIOS cho Affiliate, Amazon KDP, POD, TikTok US & thị trường quốc tế",
    description:
      "Các mô hình có khả năng nhân bản, mở rộng và đi ra thị trường lớn hơn — nhìn Affiliate / KDP / POD như hệ thống kinh doanh, không phải đăng link.",
    learn: [
      "Showcase hệ thống Amazon KDP vận hành với Agent",
      "Showcase hệ thống POD vận hành với Agent",
      "Dùng Agent nghiên cứu ngách, sản phẩm, từ khoá, thị trường",
      "Thiết kế AI Affiliate Content Engine",
      "Phân tích content win và nhân bản nhiều phiên bản",
      "Xây đội Agent sản xuất nội dung hàng loạt",
    ],
    practice: [
      "Chọn 1 mô hình có thể triển khai bằng AIOS",
      "Thiết kế bộ Agent cần có cho mô hình đó",
      "Xây roadmap 30 ngày sau Agent Camp",
      "Xác định cơ hội Freedom Partnership phù hợp",
    ],
    outcome: "Có hướng triển khai thực tế sau chương trình, không dừng ở cảm hứng",
  },
];

export default function CourseContent() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface" id="curriculum">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-12">
        <ScrollReveal>
          <div className="text-center mb-4 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">calendar_month</span>
              LỘ TRÌNH 3 NGÀY
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
              CHƯƠNG TRÌNH{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                AGENT CAMP
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mt-3 sm:mt-4">
              3 ngày mastermind chuyên sâu tại Ba Vì — kết hợp huấn luyện, demo, thực hành và hỏi đáp cá nhân hoá.
            </p>
          </div>
        </ScrollReveal>

        {days.map((day, index) => (
          <ScrollReveal key={day.number} delay={index * 150}>
            <div className="relative bg-surface-container-high p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl overflow-hidden group hover:shadow-[0_0_40px_rgba(245,158,11,0.12)] transition-all duration-500 border border-primary/15 hover:border-primary/30">
              <div className="absolute -right-4 -bottom-10 text-[6rem] sm:text-[9rem] md:text-[12rem] font-black text-primary/10 select-none leading-none">
                {day.number}
              </div>

              <div className="relative z-10 space-y-5 sm:space-y-7">
                {/* Header */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="inline-block px-3 sm:px-4 py-1 bg-primary/20 text-primary rounded-lg font-bold text-xs sm:text-sm">
                    {day.day}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">{day.title}</h3>
                  <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl">{day.description}</p>
                </div>

                {/* Learn + Practice 2-col */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-surface/60 rounded-xl p-4 sm:p-5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="material-symbols-outlined text-primary text-base sm:text-lg">school</span>
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-primary">Nội dung chính</span>
                    </div>
                    <ul className="space-y-2 sm:space-y-2.5">
                      {day.learn.map((item) => (
                        <li key={item} className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary/80 text-sm sm:text-base shrink-0 mt-0.5">check_circle</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-surface/60 rounded-xl p-4 sm:p-5 border border-secondary-container/20">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="material-symbols-outlined text-secondary-container text-base sm:text-lg">build</span>
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-secondary-container">Thực hành</span>
                    </div>
                    <ul className="space-y-2 sm:space-y-2.5">
                      {day.practice.map((item) => (
                        <li key={item} className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-secondary-container/80 text-sm sm:text-base shrink-0 mt-0.5">arrow_right_alt</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Outcome */}
                <div className="bg-linear-to-r from-primary/10 to-secondary-container/10 rounded-xl p-4 sm:p-5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl sm:text-2xl shrink-0">flag</span>
                    <div>
                      <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-primary mb-1">Kết quả ngày {day.number}</div>
                      <p className="text-sm sm:text-base text-on-surface font-bold">{day.outcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
