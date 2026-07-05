"use client";

import ScrollReveal from "../ScrollReveal";

interface Session {
  number: string;
  day: string;
  title: string;
  subtitle: string;
  goal: string;
  topics: string[];
  deliverable: string;
  icon: string;
}

const sessions: Session[] = [
  {
    number: "01",
    day: "BUỔI 1",
    title: "Tư Duy Hệ Thống AI Agent Cho Người Kinh Doanh",
    subtitle:
      "Bạn sẽ không bị ném vào một đống công cụ. Vì học tool trước khi hiểu quy trình chỉ làm bạn rối hơn.",
    goal: "Bạn nhìn lại business của mình theo bản đồ vận hành — chọn được khâu nên AI hóa trước, tránh tự động hóa sai chỗ.",
    topics: [
      "AI Agent khác gì với việc dùng AI thông thường",
      "Vì sao biết prompt là chưa đủ, vì sao AI không cứu được quy trình đang rối",
      "Bản đồ vận hành: Content, Marketing, Sale, CSKH, Follow-up, Báo cáo, Research, SOP",
      "Cách xác định công việc nào nên AI hóa trước",
      "Cách tìm điểm nghẽn đang làm bạn mất thời gian, mất tiền, mất khách",
      "Cách chuyển một công việc thủ công thành quy trình có cấu trúc",
      "Tìm thấy cơ hội kinh doanh mới với AI Agent",
    ],
    deliverable:
      "Bản đồ vận hành business + 1 use case AI Agent đầu tiên phù hợp với bạn",
    icon: "psychology",
  },
  {
    number: "02",
    day: "BUỔI 2",
    title: "Bóc Tách Quy Trình & Xây Khung AI Agent Đầu Tiên",
    subtitle:
      "Biến một đầu việc thật thành cấu trúc AI Agent theo mô hình Input → Process → Output",
    goal:
      "Bạn có khung Agent đầu tiên cho một bài toán cụ thể trong business của mình — biết cách viết nhiệm vụ, định nghĩa input/output, biến prompt thành SOP.",
    topics: [
      "Input — AI cần nhận thông tin gì để xử lý đúng?",
      "Process — AI xử lý theo tiêu chuẩn nào?",
      "Output — Kết quả đầu ra phải đạt format gì?",
      "Review — Con người kiểm tra phần nào trong workflow?",
      "Loop — Làm sao cải tiến output sau mỗi lần chạy?",
      "Cách viết nhiệm vụ rõ ràng cho Agent",
      "Cách đặt tiêu chuẩn chất lượng để Agent tự kiểm tra",
      "Cách biến prompt thành SOP có thể giao cho người khác chạy",
    ],
    deliverable:
      "1 khung AI Agent hoàn chỉnh (Input → Process → Output) cho 1 đầu việc thật trong business",
    icon: "hub",
  },
];

export default function CourseContentZoom() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface" id="course">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        <ScrollReveal>
          <div className="text-center mb-4 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">
                school
              </span>
              LỘ TRÌNH 2 BUỔI ZOOM LIVE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
              Bạn Sẽ Học Gì Trong{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                2 Buổi Zoom?
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Mục tiêu không phải xây hệ AI Agent hoành tráng từ ngày đầu — mà là
              chọn đúng 1 quy trình đầu tiên, bóc tách nó đúng cách, và bắt đầu xây
              AI Agent đầu tiên dùng được trong công việc thật.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-6 sm:space-y-10">
          {sessions.map((session, index) => (
            <ScrollReveal key={session.number} delay={index * 120}>
              <div className="relative bg-surface-container-high p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-4xl overflow-hidden group hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-500 border border-primary/10">
                <div className="absolute -right-4 -bottom-16 text-[7rem] sm:text-[11rem] md:text-[14rem] font-black text-primary/10 select-none leading-none">
                  {session.number}
                </div>

                <div className="relative z-10 grid md:grid-cols-[1fr_1.6fr] gap-6 sm:gap-8 md:gap-10">
                  <div className="space-y-4 sm:space-y-5">
                    <div className="inline-block px-3 sm:px-4 py-1.5 bg-primary/20 text-primary rounded-lg font-black text-sm sm:text-base">
                      {session.day}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                          {session.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">
                          {session.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-on-surface-variant italic border-l-2 border-primary/40 pl-3">
                      {session.subtitle}
                    </p>

                    <div className="bg-surface rounded-xl p-3 sm:p-4 border border-primary/20">
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-primary font-black uppercase tracking-wider mb-1">
                        <span className="material-symbols-outlined text-sm sm:text-base">
                          flag
                        </span>
                        Mục tiêu
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface">
                        {session.goal}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <div className="text-[10px] sm:text-xs text-on-surface-variant font-black uppercase tracking-wider mb-3">
                        Nội dung chi tiết
                      </div>
                      <ul className="space-y-2 sm:space-y-2.5">
                        {session.topics.map((topic) => (
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
                          redeem
                        </span>
                        Kết quả bạn mang về
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface font-bold">
                        {session.deliverable}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="bg-surface-container-lowest border border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-10">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Vì Sao 2 Buổi Zoom Này Khác?
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  icon: "construction",
                  title: "Không lý thuyết suông",
                  desc: "Mỗi buổi đều có quy trình thật để bạn áp ngay vào business.",
                },
                {
                  icon: "verified",
                  title: "Đặt bài toán đúng",
                  desc: "Chủ doanh nghiệp không cần code — cần biết giao việc đúng cho AI.",
                },
                {
                  icon: "stairs",
                  title: "Bắt đầu từ 1 use case",
                  desc: "Không xây hệ thống hoành tráng — chỉ chọn đúng quy trình đầu tiên.",
                },
                {
                  icon: "inventory_2",
                  title: "Có khung Agent thật",
                  desc: "Kết thúc buổi 2 bạn có khung Agent dùng được luôn cho business.",
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="bg-surface-container-high rounded-xl p-4 sm:p-5 border border-primary/10"
                >
                  <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-2 inline-block">
                    {p.icon}
                  </span>
                  <div className="font-black text-sm sm:text-base text-on-surface mb-1">
                    {p.title}
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
