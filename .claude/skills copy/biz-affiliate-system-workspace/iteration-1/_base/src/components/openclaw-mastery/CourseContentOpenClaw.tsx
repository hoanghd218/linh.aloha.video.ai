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
    title: "Tư Duy Agentic & Setup Nền Tảng OpenClaw",
    subtitle: "Hiểu vì sao phải chuyển sang agentic và có một OpenClaw \"sống\" trên máy",
    goal: "Học viên cài đặt xong OpenClaw end-to-end và chạy được lệnh \"hi\" đầu tiên với agent của mình.",
    topics: [
      "Vì sao AI Agents quan trọng ngay lúc này — Old way vs Agentic way of working",
      "Model vs Harness — phân biệt bộ não vs cơ thể của agent",
      "OpenClaw vs Claude Code — ai làm orchestrator, ai làm contractor",
      "Rick Rubin analogy: bạn là người thiết kế hệ thống, không phải người làm",
      "Good / Bad / Ugly — giới hạn và rủi ro khi triển khai agent",
      "Chọn hạ tầng: VPS vs Mac Mini — so sánh chi phí và khả năng chạy 24/7",
      "Cài đặt từ zero: Homebrew → Node → OpenClaw",
      "Partner system: dùng Claude Desktop làm \"đồng đội debug\" khi OpenClaw lỗi",
      "Chọn model: Subscription (ChatGPT/Codex) vs API key vs Local (Ollama)",
      "Test \"OpenClaw is alive\" — cuộc hội thoại đầu tiên với agent của bạn",
    ],
    deliverable: "1 OpenClaw cài đặt hoàn chỉnh, chạy được lệnh đầu tiên trên máy của bạn",
    icon: "rocket_launch",
  },
  {
    number: "02",
    day: "BUỔI 2",
    title: "Kênh Giao Tiếp, Memory & Mission Control",
    subtitle: "Biến OpenClaw thành \"nhân viên số\" có thể nhắn tin, ghi nhớ và báo cáo",
    goal: "Học viên setup xong 4 Discord channel sub-agent và có memory graph Obsidian đầu tiên cho business.",
    topics: [
      "Telegram — kênh cá nhân, nhận voice memo trực tiếp vào agent",
      "Discord multi-agent channels — mỗi channel = một sub-agent chuyên biệt",
      "Vì sao Discord > Telegram cho workflow song song nhiều agent",
      "Memory Graph: Obsidian Vault làm second brain cho agent",
      "RAG + vector search — long-term memory cho agent",
      "Build memory graph cho business: khách hàng, ideas, brand voice",
      "Mission Control: Builder Lab dashboard theo dõi sessions, logs, tokens, task board",
      "Whisper voice memo — dictation trực tiếp cho agent",
      "Agent Mail — kênh an toàn để agent tương tác thế giới bên ngoài",
    ],
    deliverable: "4 Discord channel sub-agent + Obsidian memory graph vận hành được",
    icon: "hub",
  },
  {
    number: "03",
    day: "BUỔI 3",
    title: "Identity, Security & Core Concepts",
    subtitle: "Dạy agent \"biết mình là ai\", an toàn và đủ công cụ vận hành",
    goal: "Học viên có bộ 6 identity files + trust ladder security + 1 MCP đầu tiên (Zapier hoặc NotebookLM).",
    topics: [
      "user.md — mọi thông tin về bạn, business, brand agent cần biết",
      "identity.md — agent là ai trong hệ sinh thái của bạn",
      "memory.md — ký ức cốt lõi, không được quên",
      "soul.md — tính cách & boundaries của agent",
      "agents.md & tools.md — operational rules khi agent phối hợp",
      "Heartbeat — cơ chế giúp OpenClaw chủ động thay vì thụ động",
      "Security Module: 10 lỗ hổng nghiêm trọng cần vá ngay",
      "Trust ladder: cách cấp quyền dần dần theo mức độ tin tưởng",
      "Verify trước khi agent gửi email / publish / chi tiền",
      "Skills — đóng gói workflow tái sử dụng",
      "Image Generation cho content workflow",
      "MCP (Zapier, NotebookLM) — kết nối công cụ ngoài",
      "Cron Jobs — agent tự chạy theo lịch",
      "Agentic Workflows — multi-step tự động hoá",
    ],
    deliverable: "Bộ 6 identity files + 1 MCP integration + 1 agent an toàn theo trust ladder",
    icon: "verified_user",
  },
  {
    number: "04",
    day: "BUỔI 4",
    title: "Builds Thực Chiến: Research → Idea → Content → Sách → Website",
    subtitle: "Build 5 hệ thống agent đúng với 5 use case chính, theo SWIFT Framework",
    goal: "Mỗi học viên chọn 1 trong 5 build và chạy end-to-end cho business thật của mình.",
    topics: [
      "Build 1 — Research Agent: scrape đối thủ, thị trường, insight khách hàng, lưu vào Obsidian",
      "Build 2 — Idea Generation Agent: cron job mỗi sáng tổng hợp trend + gợi ý content/sản phẩm",
      "Build 3 — Content Production Agent: script → carousel → caption → lịch đăng Instagram",
      "Build 4 — Book Production Agent: outline → chapter draft → edit → format → export",
      "Memory graph giữ nhất quán nhân vật/luận điểm xuyên chương sách",
      "Build 5 — Website Creation & QA Agent: tạo landing page, tự QA, tự fix lỗi, deploy",
      "Kết hợp nhiều build thành 1 pipeline hoàn chỉnh cho business thật",
      "SWIFT Framework — phương pháp build agent nhanh & đúng từ đầu",
    ],
    deliverable: "1 trong 5 agent build chạy end-to-end cho business thật của bạn",
    icon: "auto_awesome",
  },
  {
    number: "05",
    day: "BUỔI 5",
    title: "Vận Hành & Hướng Dẫn Kiếm Tiền Bằng OpenClaw",
    subtitle: "Biến kỹ năng OpenClaw thành dòng thu nhập bền vững cho business của bạn",
    goal: "Học viên hoàn thiện 1 hệ thống multi AI agents OpenClaw vận hành được và biết rõ lộ trình kiếm tiền từ hệ thống đó.",
    topics: [
      "Vận hành bền vững: debug pattern nâng cao với partner system",
      "Project Manager agent — điều phối các sub-agent như một team thật",
      "Backup, checkpoint — khi nào reset context cho an toàn",
      "5 con đường kiếm tiền bằng OpenClaw: In-house (tiết kiệm chi phí team), Freelance service, Productized service, Digital product, Affiliate / Referral",
      "Scale business của chính bạn: dùng OpenClaw thay 1 team marketing để ra content, sách, website 24/7",
      "Build-in-public: chia sẻ quá trình build trên social để thu hút khách hàng inbound",
      "Định vị \"done-for-you digital employee\" cho client — chọn ngách domain bạn đã hiểu",
      "Vì sao chuyên gia domain > developer generic (real estate cho real estate, F&B cho F&B)",
      "Hệ thống tự document → client onboarding dễ, maintenance nhẹ",
      "Demo Day: học viên present hệ thống multi-agent của mình và nhận feedback mentor",
    ],
    deliverable: "1 hệ thống multi AI agents OpenClaw hoàn chỉnh + lộ trình kiếm tiền cá nhân hoá",
    icon: "payments",
  },
];

export default function CourseContentOpenClaw() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface" id="course">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">school</span>
              LỘ TRÌNH 5 BUỔI ZOOM LIVE — MARKETING & BUSINESS EDITION
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter">
              Nội Dung{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Khoá Học
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Trọng tâm:{" "}
              <span className="text-primary font-bold">
                Research → Idea → Content → Sách → Website
              </span>
              . Mỗi buổi ~2.5 giờ lý thuyết + thực hành live. Kết thúc mỗi buổi bạn có 1 deliverable dùng được ngay trong business.
            </p>
          </div>
        </ScrollReveal>

        {/* Value journey */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {[
              { range: "Buổi 1", text: "Setup OpenClaw từ zero" },
              { range: "Buổi 2", text: "Discord + Memory Graph" },
              { range: "Buổi 3", text: "Identity + Security + MCP" },
              { range: "Buổi 4", text: "5 Agent Builds thực chiến" },
              { range: "Buổi 5", text: "Multi-agents & kiếm tiền" },
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
                Nguyên Tắc Xuyên Suốt 5 Buổi
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-2xl mx-auto">
                Rút từ kinh nghiệm thực chiến khi xây OpenClaw cho business thật
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              {[
                {
                  icon: "construction",
                  title: "Build Alongside",
                  desc: "Không chỉ xem — mỗi buổi đều code/cấu hình trực tiếp cùng mentor.",
                },
                {
                  icon: "merge",
                  title: "1 Message = All Ops",
                  desc: "Dạy tư duy batch/parallel ngay từ Buổi 1 để tiết kiệm thời gian.",
                },
                {
                  icon: "account_tree",
                  title: "Hierarchical Orchestration",
                  desc: "1 orchestrator điều phối sub-agents như CEO điều hành team.",
                },
                {
                  icon: "stairs",
                  title: "Trust Ladder",
                  desc: "Không bao giờ cấp full quyền ngay từ đầu — build tin tưởng từng bước.",
                },
                {
                  icon: "psychology",
                  title: "System Thinking",
                  desc: "Execution đã rẻ — tư duy thiết kế hệ thống mới là giá trị thực.",
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
