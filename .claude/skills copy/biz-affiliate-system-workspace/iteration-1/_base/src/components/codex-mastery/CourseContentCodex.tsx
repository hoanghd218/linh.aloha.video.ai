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
    title: "ChatGPT Codex Foundation & Content Marketing Tự Động",
    subtitle: "Setup môi trường, hiểu tư duy Agentic AI và build hệ content production đầu tiên",
    goal: "Học viên setup xong Codex, hiểu cách prompt cho agent thực thi nhiều bước, và có pipeline tạo 10 bài content/ngày.",
    topics: [
      "ChatGPT Codex là gì? Vì sao khác ChatGPT chat thường",
      "Tư duy Agentic: ra lệnh mục tiêu, không ra lệnh từng bước",
      "Setup môi trường: cài Codex CLI, cấu hình workspace & API key",
      "System prompt cho marketing: tone of voice, brand guidelines, target audience",
      "Build content-brief-parser: từ 1 chủ đề → 10 bài outline đầy đủ",
      "Thực hành: tạo content calendar 30 ngày chỉ trong 20 phút",
      "Verification pattern: Codex tự kiểm tra output trước khi trả về",
    ],
    deliverable: "Content pipeline tự động + Content calendar 30 ngày sẵn dùng",
    icon: "rocket_launch",
  },
  {
    number: "02",
    day: "BUỔI 2",
    title: "Marketing Pipeline at Scale — SEO, Email & Social Media",
    subtitle: "Xây hệ thống research → content → phân phối tự động trên mọi kênh",
    goal: "Học viên có full marketing pipeline: research từ khoá tự động, viết bài chuẩn SEO, tạo email sequence, lên lịch social media.",
    topics: [
      "Competitor research agent: scrape và phân tích đối thủ trong 5 phút",
      "Keyword research tự động: tìm từ khoá có traffic cao, cạnh tranh thấp",
      "SEO content pipeline: keyword → outline → long-form article → on-page optimize",
      "Email marketing automation: welcome sequence, nurture drip, re-engagement",
      "Social media multi-platform: 1 ý tưởng → caption Facebook, LinkedIn, TikTok, X",
      "Ad copy generator: A/B test 5 headline, 5 body copy cùng lúc",
      "Thực hành: build end-to-end campaign từ research đến draft bài đăng",
    ],
    deliverable: "Full marketing pipeline hoạt động + 1 chiến dịch hoàn chỉnh",
    icon: "campaign",
  },
  {
    number: "03",
    day: "BUỔI 3",
    title: "Productivity System & Business Automation — Deploy & Duy Trì",
    subtitle: "Kết nối mọi tool, tự động hoá workflow nội bộ và đưa hệ thống lên production",
    goal: "Học viên có business automation system chạy 24/7: báo cáo tự động, email classifier, kết nối Notion/Sheets/Gmail và deploy lên production.",
    topics: [
      "Kết nối Gmail: phân loại email, draft reply theo context, tag tự động",
      "Kết nối Google Sheets: pull data, tổng hợp, tạo báo cáo KPI hàng tuần",
      "Kết nối Notion: sync task, update project status, tạo meeting notes",
      "Personal productivity hub: daily briefing, task prioritization, time blocking",
      "Tự động hoá báo cáo: dữ liệu từ mọi nguồn → dashboard sẵn lúc 8 giờ sáng",
      "GitHub Actions: lịch chạy tự động (daily content, weekly report, monthly audit)",
      "Capstone: từ brief kinh doanh → research → content → báo cáo qua 1 pipeline duy nhất",
    ],
    deliverable: "Business automation system chạy 24/7 — capstone project hoàn chỉnh",
    icon: "hub",
  },
];

export default function CourseContentCodex() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface" id="course">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">school</span>
              LỘ TRÌNH 3 BUỔI ZOOM LIVE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
              Nội Dung{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Khoá Học
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Mỗi buổi ~2.5 giờ lý thuyết + thực hành live. Kết thúc mỗi buổi bạn có 1 deliverable dùng được ngay trong business.
            </p>
          </div>
        </ScrollReveal>

        {/* Value journey */}
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { range: "Buổi 1", text: "Content Pipeline tự động" },
              { range: "Buổi 2", text: "Full Marketing at Scale" },
              { range: "Buổi 3", text: "Business Automation 24/7" },
            ].map((step) => (
              <div
                key={step.range}
                className="bg-surface-container-high rounded-xl p-3 sm:p-4 border border-primary/10 text-center"
              >
                <div className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-wider mb-1">
                  {step.range}
                </div>
                <div className="text-xs sm:text-sm font-bold text-on-surface">{step.text}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Sessions */}
        <div className="space-y-6 sm:space-y-10">
          {sessions.map((session, index) => (
            <ScrollReveal key={session.number} delay={index * 120}>
              <div className="relative bg-surface-container-high p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-4xl overflow-hidden group hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-500 border border-primary/10">
                {/* Giant number watermark */}
                <div className="absolute -right-4 -bottom-16 text-[7rem] sm:text-[11rem] md:text-[14rem] font-black text-primary/10 select-none leading-none">
                  {session.number}
                </div>

                <div className="relative z-10 grid md:grid-cols-[1fr_1.6fr] gap-6 sm:gap-8 md:gap-10">
                  {/* Left column */}
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
                        <span className="material-symbols-outlined text-sm sm:text-base">flag</span>
                        Mục tiêu
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface">{session.goal}</p>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <div className="text-[10px] sm:text-xs text-on-surface-variant font-black uppercase tracking-wider mb-3">
                        Nội dung chi tiết
                      </div>
                      <ul className="space-y-2 sm:space-y-2.5">
                        {session.topics.map((topic) => (
                          <li key={topic} className="flex gap-2 sm:gap-3 text-sm sm:text-base text-on-surface-variant">
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
                        <span className="material-symbols-outlined text-sm sm:text-base">redeem</span>
                        Kết quả bạn mang về
                      </div>
                      <p className="text-xs sm:text-sm text-on-surface font-bold">{session.deliverable}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Guiding principles */}
        <ScrollReveal>
          <div className="bg-surface-container-lowest border border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-10">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Nguyên Tắc Xuyên Suốt Khoá Học
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  icon: "construction",
                  title: "Practical Building",
                  desc: "Không lý thuyết suông — mỗi buổi đều build 1 hệ thống chạy được.",
                },
                {
                  icon: "bolt",
                  title: "Speed First",
                  desc: "3 buổi, 3 deliverable — mỗi buổi bạn đã có thứ dùng được ngay.",
                },
                {
                  icon: "stairs",
                  title: "Từ Đơn Đến Phức",
                  desc: "Buổi 1 nền tảng, buổi 2 scale, buổi 3 kết nối toàn hệ thống.",
                },
                {
                  icon: "inventory_2",
                  title: "Business-Ready",
                  desc: "Mọi deliverable đều áp dụng được ngay vào business của bạn.",
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="bg-surface-container-high rounded-xl p-4 sm:p-5 border border-primary/10"
                >
                  <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-2 inline-block">
                    {p.icon}
                  </span>
                  <div className="font-black text-sm sm:text-base text-on-surface mb-1">{p.title}</div>
                  <p className="text-xs sm:text-sm text-on-surface-variant">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
