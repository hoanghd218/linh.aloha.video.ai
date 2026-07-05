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
    title: "Setup & Build Website Đầu Tiên Bằng Vibe Coding",
    subtitle: "Từ 0 đến website live trong 1 buổi — không cần gõ 1 dòng code",
    goal: "Học viên setup hoàn chỉnh Antigravity + Claude Code, hiểu Vibe Coding Design Loop và deploy được portfolio / landing page đầu tiên lên Netlify.",
    topics: [
      "Vibe Coding là gì? Claude Code, ChatGPT Codex & Antigravity — so sánh và khi nào dùng cái gì",
      "Setup Antigravity: giao diện, Agent Chat Panel, AI Interaction",
      "Customizing AI Behavior: system prompt, workflows, conversation modes",
      "Chọn AI model phù hợp cho từng loại task (code, design, debug)",
      "Vibe Coding Design Loop: screenshot → describe → generate → adjust → deploy",
      "Thực hành: Build portfolio cá nhân, so sánh design từ nhiều AI, chọn đẹp nhất",
      "Deploy lên Netlify: từ local đến live URL trong 5 phút",
    ],
    deliverable: "1 portfolio / landing page live trên Netlify",
    icon: "web",
  },
  {
    number: "02",
    day: "BUỔI 2",
    title: "Full-Stack App — Client Dashboard & Database Cơ Bản",
    subtitle: "Build app full-stack thực sự: frontend + backend + database",
    goal: "Học viên hiểu kiến trúc full-stack, build được client dashboard hoàn chỉnh với auth, CRUD operations và kết nối database.",
    topics: [
      "Modern Software Stack Overview: frontend, backend, database, hosting",
      "SQL vs NoSQL — chọn đúng database cho từng loại app",
      "Frameworks in action: Next.js, Supabase, Prisma cho người không code",
      "Version Control với GitHub: tại sao cần và cách dùng với Vibe Coding",
      "Smart ways to use AI Agents: khi nào plan, khi nào execute",
      "Thực hành: Build Client Dashboard Platform — login, dashboard, CRUD data",
      "Security basics: authentication, authorization, input validation",
    ],
    deliverable: "Full-stack Client Dashboard với auth & database",
    icon: "dashboard",
  },
  {
    number: "03",
    day: "BUỔI 3",
    title: "Lead Generation App — APIs & Branding",
    subtitle: "Build app thực chiến: thu lead, tích hợp API bên ngoài, thêm logo & branding",
    goal: "Học viên build được Lead Generation App hoàn chỉnh với form thu thập data, tích hợp email API, branding chuyên nghiệp và deploy production.",
    topics: [
      "App structure & planning: thiết kế UX trước khi code",
      "Vibe Coding a Lead Generation App từ đầu đến cuối",
      "Testing & functionality: cách test app vibe coded hiệu quả",
      "Troubleshooting & debugging với AI — không cần hiểu error message",
      "Integrating APIs: email service, notification, webhook",
      "Logo, branding & visual identity bằng AI trong 10 phút",
      "Deploy vibe coded projects lên Netlify / Vercel",
      "Security audit: OWASP top 10 cho người không code",
    ],
    deliverable: "Lead Gen App live + branding hoàn chỉnh",
    icon: "contact_mail",
  },
  {
    number: "04",
    day: "BUỔI 4",
    title: "Website Bán Hàng Chuyển Đổi Cao & Tích Hợp Thanh Toán",
    subtitle: "E-commerce thực chiến: landing page + SePay/Stripe + UX tối ưu chuyển đổi",
    goal: "Học viên có website bán hàng production-ready với thanh toán tự động, trang cảm ơn, email xác nhận và UX được tối ưu cho conversion.",
    topics: [
      "High-converting landing page: cấu trúc, copy, CTA — vibe coded trong 30 phút",
      "Payment Integration Overview: SePay (nội địa) & Stripe (quốc tế)",
      "Cài đặt SePay webhook: nhận tiền → trigger event → mở quyền tự động",
      "Vibe Coding UX Enhancements: animation, loading state, mobile responsive",
      "Thumbnail Generator: tạo ảnh marketing bằng AI tích hợp vào app",
      "Debugging payment issues: test flow từ đầu đến cuối",
      "App launch checklist & security review trước khi go live",
      "API wrapping: bọc API bên ngoài thành endpoint riêng cho app",
    ],
    deliverable: "Website bán hàng với thanh toán tự động SePay/Stripe",
    icon: "payments",
  },
  {
    number: "05",
    day: "BUỔI 5",
    title: "Quản Lý Khoá Học, Launch Production & Chiến Lược Kinh Doanh",
    subtitle: "Platform khoá học, marketing strategy và capstone project hoàn chỉnh",
    goal: "Học viên có platform quản lý khoá học tích hợp thanh toán, chiến lược pricing & marketing, và trình bày capstone: 1 sản phẩm số kinh doanh được ngay.",
    topics: [
      "Course management platform: upload nội dung, quản lý học viên, tiến độ",
      "Feature integration: video embed, quiz, certificate tự động",
      "Pricing strategies cho sản phẩm số: one-time, subscription, bundle",
      "Marketing funnel cho vibe coded product: SEO, social, email sequence",
      "Vibe Coding Full Course Wrap-Up: workflow tối ưu cho builder cá nhân",
      "Scaling app: khi nào nên dùng serverless, khi nào cần VPS",
      "Capstone: demo sản phẩm số kinh doanh thực tế — nhận feedback từ Tony",
    ],
    deliverable: "Platform khoá học + capstone sản phẩm số kinh doanh được ngay",
    icon: "school",
  },
];

export default function CourseContentVibeCoding() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface" id="course">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">school</span>
              LỘ TRÌNH 5 BUỔI ZOOM LIVE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
              Nội Dung{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Khoá Học
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Mỗi buổi ~2.5 giờ lý thuyết + thực hành live. Kết thúc mỗi buổi bạn có 1 sản phẩm thật dùng được ngay.
            </p>
          </div>
        </ScrollReveal>

        {/* Value journey */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {[
              { range: "Buổi 1", text: "Portfolio live" },
              { range: "Buổi 2", text: "Full-stack app" },
              { range: "Buổi 3", text: "Lead gen + APIs" },
              { range: "Buổi 4", text: "E-commerce + thanh toán" },
              { range: "Buổi 5", text: "Platform khoá học" },
            ].map((step) => (
              <div
                key={step.range}
                className="bg-surface-container-high rounded-xl p-3 sm:p-4 border border-primary/10 text-center"
              >
                <div className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-wider mb-1">
                  {step.range}
                </div>
                <div className="text-xs sm:text-sm font-bold text-on-surface">
                  {step.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Sessions */}
        <div className="space-y-6 sm:space-y-10">
          {sessions.map((session, index) => (
            <ScrollReveal key={session.number} delay={index * 120}>
              <div className="relative bg-surface-container-high p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-4xl overflow-hidden group hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-500 border border-primary/10">
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

        {/* Guiding principles */}
        <ScrollReveal>
          <div className="bg-surface-container-lowest border border-primary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-10">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Triết Lý Xuyên Suốt Khoá Học
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  icon: "construction",
                  title: "Ship Nhanh",
                  desc: "Mỗi buổi deploy 1 sản phẩm thật — không build trong tưởng tượng.",
                },
                {
                  icon: "payments",
                  title: "Kinh Doanh Được Ngay",
                  desc: "Tất cả sản phẩm build ra đều tích hợp thanh toán và sẵn sàng bán.",
                },
                {
                  icon: "security",
                  title: "Security First",
                  desc: "Mỗi app đều có security audit trước khi go live.",
                },
                {
                  icon: "trending_up",
                  title: "Scale Không Giới Hạn",
                  desc: "Từ landing page đến full platform — cùng 1 phương pháp vibe coding.",
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
