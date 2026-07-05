"use client";

import ScrollReveal from "../ScrollReveal";

interface Part {
  number: string;
  tag: string;
  title: string;
  subtitle: string;
  topics: string[];
  message: string;
  icon: string;
}

const parts: Part[] = [
  {
    number: "01",
    tag: "PHẦN 1",
    title: "THE AI AGENT SHIFT",
    subtitle: "Kỷ nguyên AI Agent và sự thay đổi của doanh nghiệp",
    topics: [
      "AI đi từ công cụ đơn lẻ → workflow → Agent → hệ điều hành AIOS",
      "Vì sao AI không còn là công cụ, mà là một lớp vận hành mới",
      "Cách doanh nghiệp được thiết kế lại trong thời đại AI Agent",
    ],
    message:
      "AI không chỉ thay đổi cách chúng ta làm việc — AI thay đổi cách doanh nghiệp được thiết kế.",
    icon: "auto_awesome",
  },
  {
    number: "02",
    tag: "PHẦN 2",
    title: "THE GROWTH ENGINE",
    subtitle: "AI Agent cho Marketing – Bán hàng – Xây kênh",
    topics: [
      "Nghiên cứu thị trường, phân tích khách hàng, chiến lược marketing",
      "Content bán hàng, phễu chuyển đổi, kênh social, kịch bản video",
      "Chăm sóc khách hàng và bán hàng tự động bằng Agent",
    ],
    message:
      "Marketing trở thành hệ thống. Bán hàng được hỗ trợ bởi Agent, dữ liệu và workflow.",
    icon: "rocket_launch",
  },
  {
    number: "03",
    tag: "PHẦN 3",
    title: "THE LIVE AI AGENT SHOWCASE",
    subtitle: "Demo hệ thống AI Agent thực tế — phần tạo WOW mạnh nhất",
    topics: [
      "AI Agent cho thương hiệu cá nhân, marketing, sales, xây kênh",
      "AI Affiliate, KDP / POD, sản xuất content hàng loạt",
      "Thiết kế workflow vận hành cho doanh nghiệp",
    ],
    message:
      "AI Agent là hệ thống có thể xây thật, dùng thật và tạo ra kết quả thật.",
    icon: "smart_display",
  },
  {
    number: "04",
    tag: "PHẦN 4",
    title: "BUILD YOUR AIOS MAP",
    subtitle: "Workshop thực hành xây bản đồ AIOS sơ bộ cho doanh nghiệp của anh chị",
    topics: [
      "Mô hình kinh doanh hiện tại là gì? Doanh thu đến từ đâu?",
      "Điểm nghẽn lớn nhất? Marketing và bán hàng đang phụ thuộc gì?",
      "Quy trình nào lặp lại nhiều nhất? Agent đầu tiên nên xây là gì?",
    ],
    message:
      "Mỗi người ra về với một bản đồ ứng dụng AI Agent bước đầu cho doanh nghiệp của mình.",
    icon: "map",
  },
  {
    number: "05",
    tag: "PHẦN 5",
    title: "THE NEXT LEVEL",
    subtitle: "Lộ trình bước vào Global Elite Club",
    topics: [
      "Chương trình đồng hành dài hạn: cộng đồng, roadmap, workshop chuyên sâu",
      "Chuyển giao hệ thống, hỗ trợ xây AIOS thực tế",
      "Networking & partnership, môi trường cập nhật liên tục",
    ],
    message:
      "Nếu Summit giúp anh chị nhìn thấy cánh cửa, Global Elite Club là nơi giúp anh chị bước qua cánh cửa đó.",
    icon: "trending_up",
  },
];

export default function CurriculumSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest"
      id="curriculum"
    >
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">
                view_timeline
              </span>
              KHUNG NỘI DUNG 5 PHẦN
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
              Một Ngày —{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                5 Phần Dẫn Anh Chị Đi Trọn Hành Trình
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Từ mở nhận thức → thấy khoảng cách → tạo WOW → tự nhìn ra nhu cầu → có
              lộ trình triển khai.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-6 sm:space-y-10">
          {parts.map((part, index) => (
            <ScrollReveal key={part.number} delay={index * 100}>
              <div className="relative bg-surface-container-high p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-4xl overflow-hidden group hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-500 border border-primary/10">
                {/* Giant number watermark */}
                <div className="absolute -right-4 -bottom-16 text-[7rem] sm:text-[11rem] md:text-[14rem] font-black text-primary/10 select-none leading-none">
                  {part.number}
                </div>

                <div className="relative z-10 grid md:grid-cols-[1fr_1.6fr] gap-6 sm:gap-8 md:gap-10">
                  {/* Left column */}
                  <div className="space-y-4 sm:space-y-5">
                    <div className="inline-block px-3 sm:px-4 py-1.5 bg-primary/20 text-primary rounded-lg font-black text-sm sm:text-base">
                      {part.tag}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                          {part.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">
                          {part.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-on-surface-variant italic border-l-2 border-primary/40 pl-3">
                      {part.subtitle}
                    </p>
                  </div>

                  {/* Right column */}
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <div className="text-[10px] sm:text-xs text-on-surface-variant font-black uppercase tracking-wider mb-3">
                        Nội dung chính
                      </div>
                      <ul className="space-y-2 sm:space-y-2.5">
                        {part.topics.map((topic) => (
                          <li
                            key={topic}
                            className="flex gap-2 sm:gap-3 text-sm sm:text-base text-on-surface-variant"
                          >
                            <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0">
                              check_circle
                            </span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-linear-to-br from-primary/15 to-primary-container/5 rounded-xl p-3 sm:p-4 border border-primary/30">
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-primary font-black uppercase tracking-wider mb-1">
                        <span className="material-symbols-outlined text-sm sm:text-base">
                          campaign
                        </span>
                        Thông điệp
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface font-bold">
                        {part.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
