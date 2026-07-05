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
    title: "Nền Tảng Claude Code & Mindset AI Agent",
    subtitle: "Setup xong môi trường và hiểu tư duy \"AI làm việc cùng, không chỉ trả lời\"",
    goal: "Học viên setup xong môi trường Claude Code và build được landing page đầu tiên bằng screenshot loop.",
    topics: [
      "Claude Code là gì? Vì sao khác ChatGPT / Claude.ai",
      "So sánh Pro / Max plan — chọn plan phù hợp cho marketer",
      "Cài đặt: Terminal vs GUI — chọn Antigravity cho người không code",
      "Tour giao diện: status line, context %, modes (plan / edit / bypass)",
      "Thực hành: Tạo landing page giới thiệu sản phẩm bằng screenshot loop từ trang đối thủ",
      "Bài tập về nhà: Cài đặt hoàn chỉnh + build 1 trang web đơn giản",
    ],
    deliverable: "1 landing page hoàn chỉnh clone từ thiết kế đối thủ",
    icon: "rocket_launch",
  },
  {
    number: "02",
    day: "BUỔI 2",
    title: "CLAUDE.md — Bộ Não Thương Hiệu & Context Management",
    subtitle: "Biến Claude thành \"nhân viên hiểu thương hiệu\" của bạn",
    goal: "Học viên có Brand Brain CLAUDE.md riêng và generate được sales page hoàn chỉnh theo đúng tone thương hiệu.",
    topics: [
      "Cơ chế CLAUDE.md = prompt inject đầu mọi cuộc hội thoại",
      "Phép ẩn dụ \"con tàu\" — vì sao steering đầu vào quyết định output",
      "Xây Brand Brain: tone of voice, target audience, USP, competitor",
      "3 cách design website cho marketing: Screenshot loop · Voice transcript dump · Components từ 21st.dev",
      "Context management: tránh context rot, khi nào /clear, /compact",
      "Token strategies: tiết kiệm chi phí khi làm khối lượng lớn",
      "Thực hành: Tạo CLAUDE.md cho thương hiệu cá nhân + generate sales page hoàn chỉnh",
    ],
    deliverable: "CLAUDE.md thương hiệu + 1 sales page production-ready",
    icon: "psychology",
  },
  {
    number: "03",
    day: "BUỔI 3",
    title: "Skills — Chuyên Biệt Hoá Claude Cho Research, Ideation & Content",
    subtitle: "Tạo bộ \"kỹ năng marketing\" tự động kích hoạt khi cần",
    goal: "Học viên có bộ 5 Skills thực chiến cho marketing và hoàn thành chương đầu tiên của cuốn sách của mình.",
    topics: [
      "Cấu trúc 1 Skill: YAML frontmatter + instructions + progressive disclosure",
      "Khi nào Claude tự gọi Skill (trigger by description)",
      "Build market-researcher — research ngành, đối thủ, xu hướng",
      "Build idea-generator — brainstorm content theo framework AIDA / PAS",
      "Build content-writer — viết bài theo tone brand đã định nghĩa",
      "Build book-outliner — dựng outline sách / ebook từ chủ đề",
      "Build seo-optimizer — tối ưu bài viết theo từ khoá",
      "Verification pattern: bắt Claude tự kiểm tra output trước khi trả về",
    ],
    deliverable: "5 Skills marketing + chương đầu 1 cuốn sách hoàn chỉnh",
    icon: "auto_awesome",
  },
  {
    number: "04",
    day: "BUỔI 4",
    title: "MCP & Sub-Agents — Kết Nối Hệ Thống Kinh Doanh Thực",
    subtitle: "Claude không chỉ viết mà còn vận hành tool bên ngoài",
    goal: "Học viên có hệ email bookkeeper / lead classifier tự động, kết nối được Gmail, Notion, GitHub và Chrome.",
    topics: [
      "Model Context Protocol là gì? Vì sao biến Claude thành \"operator\"",
      "Đánh giá token cost của MCP servers — quan trọng cho chi phí",
      "Setup Gmail / Email MCP: classify, reply, label tự động",
      "Setup Google Drive / Notion MCP: kết nối knowledge base",
      "Setup GitHub MCP: quản lý dự án content, sách",
      "Setup Chrome DevTools MCP: scrape data từ nguồn không có API",
      "Sub-agents với scoped tool access: email-classifier, competitor-scraper, content-reviewer",
      "Plugins & marketplaces — mở rộng năng lực không cần code",
    ],
    deliverable: "Email bookkeeper / lead classifier chạy tự động 24/7",
    icon: "hub",
  },
  {
    number: "05",
    day: "BUỔI 5",
    title: "Agent Teams, Worktrees & Production Deployment",
    subtitle: "Nhiều agent phối hợp đồng thời + đưa hệ thống lên production",
    goal: "Học viên trình bày capstone: 1 hệ thống hoàn chỉnh từ research → sách → website bán hàng qua 1 agent team duy nhất.",
    topics: [
      "Agent Teams: nhiều agent phối hợp như 1 team marketing thật",
      "Pipeline: Researcher → Strategist → Writer → Editor → Publisher",
      "Git Worktrees: chạy song song nhiều session Claude không xung đột",
      "Hooks: tự động trigger script trước / sau mỗi tool call (auto-backup, auto-log)",
      "Deploy Modal — content automation API cho marketer không code",
      "GitHub Actions — lịch chạy tự động (daily content, weekly report)",
      "Claude Code on the web — truy cập mobile",
      "Capstone: Research thị trường → Ý tưởng sản phẩm → Viết sách → Website bán hàng",
    ],
    deliverable: "1 production system chạy 24/7 — capstone project hoàn chỉnh",
    icon: "workspaces",
  },
];

export default function CourseContentMastery() {
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
              Mỗi buổi ~2.5 giờ lý thuyết + thực hành live. Kết thúc mỗi buổi bạn có 1 deliverable dùng được ngay trong business.
            </p>
          </div>
        </ScrollReveal>

        {/* Value journey */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {[
              { range: "Buổi 1-2", text: "Web + Brand Brain" },
              { range: "Buổi 3", text: "Bộ Skill viết content & sách" },
              { range: "Buổi 4", text: "Hệ tự động hoá email & research" },
              { range: "Buổi 5", text: "Production system 24/7" },
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
                {/* Giant number watermark */}
                <div className="absolute -right-4 -bottom-16 text-[7rem] sm:text-[11rem] md:text-[14rem] font-black text-primary/10 select-none leading-none">
                  {session.number}
                </div>

                <div className="relative z-10 grid md:grid-cols-[1fr_1.6fr] gap-6 sm:gap-8 md:gap-10">
                  {/* Left column: day + icon + goal */}
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

                  {/* Right column: topics + deliverable */}
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
                  desc: "Không lý thuyết suông — mỗi buổi đều build 1 sản phẩm thật.",
                },
                {
                  icon: "verified",
                  title: "Verification is Everything",
                  desc: "Luôn có bước Claude tự kiểm tra trước khi trả output.",
                },
                {
                  icon: "stairs",
                  title: "Build Từng Bậc",
                  desc: "Bắt đầu chậm, xây khái niệm chồng lên nhau vững chắc.",
                },
                {
                  icon: "inventory_2",
                  title: "Deliverable Thực Chiến",
                  desc: "Mỗi buổi kết bằng 1 sản phẩm dùng được ngay trong business.",
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
