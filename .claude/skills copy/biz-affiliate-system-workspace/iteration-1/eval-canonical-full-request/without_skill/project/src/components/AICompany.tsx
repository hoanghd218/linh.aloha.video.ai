"use client";

import ScrollReveal from "./ScrollReveal";

interface Agent {
  name: string;
  role: string;
  icon: string;
  status: "online" | "busy" | "idle";
  persona: string;
  avatarColor: string;
}

interface Department {
  head: Agent;
  members: Agent[];
  task: string;
}

const ceo: Agent = {
  name: "AIOS Orchestrator",
  role: "Hệ Điều Hành Doanh Nghiệp",
  icon: "hub",
  status: "online",
  persona: "AI",
  avatarColor: "from-amber-500 to-orange-600",
};

const departments: Department[] = [
  {
    head: {
      name: "Marketing Agent",
      role: "Giám Đốc Marketing",
      icon: "campaign",
      status: "online",
      persona: "MK",
      avatarColor: "from-rose-500 to-pink-600",
    },
    task: "Giao việc: Nghiên cứu thị trường",
    members: [
      { name: "Market Research", role: "Phân tích insight", icon: "travel_explore", status: "online", persona: "MR", avatarColor: "from-sky-500 to-blue-600" },
      { name: "Customer Insight", role: "Hiểu khách hàng", icon: "psychology", status: "busy", persona: "CI", avatarColor: "from-violet-500 to-purple-600" },
      { name: "Content Strategy", role: "Chiến lược nội dung", icon: "edit_note", status: "online", persona: "CS", avatarColor: "from-emerald-500 to-green-600" },
      { name: "Campaign Builder", role: "Thiết kế chiến dịch", icon: "rocket_launch", status: "online", persona: "CB", avatarColor: "from-cyan-500 to-teal-600" },
    ],
  },
  {
    head: {
      name: "Sales Agent",
      role: "Giám Đốc Bán Hàng",
      icon: "handshake",
      status: "online",
      persona: "SL",
      avatarColor: "from-blue-500 to-indigo-600",
    },
    task: "Giao việc: Tối ưu chuyển đổi",
    members: [
      { name: "Script Builder", role: "Kịch bản bán hàng", icon: "menu_book", status: "online", persona: "SB", avatarColor: "from-pink-500 to-rose-600" },
      { name: "Lead Scorer", role: "Phân loại lead", icon: "leaderboard", status: "idle", persona: "LS", avatarColor: "from-amber-500 to-yellow-600" },
      { name: "Objection Handler", role: "Xử lý phản đối", icon: "support_agent", status: "online", persona: "OH", avatarColor: "from-emerald-500 to-teal-600" },
    ],
  },
  {
    head: {
      name: "Channel Growth",
      role: "Giám Đốc Tăng Trưởng",
      icon: "trending_up",
      status: "online",
      persona: "CG",
      avatarColor: "from-orange-500 to-amber-600",
    },
    task: "Giao việc: Xây kênh đa nền tảng",
    members: [
      { name: "Hook Researcher", role: "Tìm chủ đề viral", icon: "search", status: "online", persona: "HR", avatarColor: "from-teal-500 to-cyan-600" },
      { name: "Video Scriptor", role: "Viết kịch bản video", icon: "movie", status: "busy", persona: "VS", avatarColor: "from-fuchsia-500 to-pink-600" },
      { name: "Multi-Channel", role: "Nhân bản đa nền tảng", icon: "share", status: "online", persona: "MC", avatarColor: "from-lime-500 to-green-600" },
      { name: "Retention Opt", role: "Tối ưu hook & retention", icon: "visibility", status: "online", persona: "RO", avatarColor: "from-indigo-500 to-violet-600" },
    ],
  },
  {
    head: {
      name: "Strategy Agent",
      role: "Giám Đốc Chiến Lược",
      icon: "psychology_alt",
      status: "online",
      persona: "ST",
      avatarColor: "from-sky-500 to-blue-600",
    },
    task: "Giao việc: Mở rộng mô hình",
    members: [
      { name: "Business Map", role: "Phân tích mô hình", icon: "schema", status: "online", persona: "BM", avatarColor: "from-blue-500 to-cyan-600" },
      { name: "Offer Builder", role: "Thiết kế offer", icon: "redeem", status: "busy", persona: "OB", avatarColor: "from-red-500 to-orange-600" },
      { name: "Partnership", role: "Tìm đối tác", icon: "diversity_3", status: "online", persona: "PT", avatarColor: "from-emerald-500 to-teal-600" },
      { name: "Decision Coach", role: "Hỗ trợ ra quyết định", icon: "lightbulb", status: "online", persona: "DC", avatarColor: "from-yellow-500 to-amber-600" },
    ],
  },
  {
    head: {
      name: "Operation Agent",
      role: "Giám Đốc Vận Hành",
      icon: "settings_suggest",
      status: "online",
      persona: "OP",
      avatarColor: "from-purple-500 to-indigo-600",
    },
    task: "Giao việc: Chuẩn hóa quy trình",
    members: [
      { name: "Workflow Designer", role: "Thiết kế quy trình", icon: "account_tree", status: "online", persona: "WD", avatarColor: "from-sky-500 to-blue-600" },
      { name: "Knowledge Base", role: "Chuẩn hóa tri thức", icon: "library_books", status: "busy", persona: "KB", avatarColor: "from-orange-500 to-red-600" },
      { name: "Automation Plan", role: "Tự động hóa từng phần", icon: "smart_button", status: "online", persona: "AP", avatarColor: "from-green-500 to-emerald-600" },
      { name: "Customer Care", role: "Chăm sóc khách hàng", icon: "favorite", status: "online", persona: "CC", avatarColor: "from-pink-500 to-fuchsia-600" },
    ],
  },
];

const statusColors = {
  online: "bg-green-500",
  busy: "bg-yellow-500",
  idle: "bg-gray-400",
};

function Avatar({ initials, colorClass, size = "sm" }: { initials: string; colorClass: string; size?: "lg" | "md" | "sm" }) {
  const sizeClasses = {
    lg: "w-11 h-11 sm:w-14 sm:h-14 text-sm sm:text-base",
    md: "w-8 h-8 sm:w-10 sm:h-10 text-[10px] sm:text-xs",
    sm: "w-7 h-7 sm:w-8 sm:h-8 text-[9px] sm:text-[10px]",
  };
  return (
    <div className={`shrink-0 rounded-full bg-linear-to-br ${colorClass} ${sizeClasses[size]} flex items-center justify-center font-black text-white shadow-md`}>
      {initials}
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="relative bg-surface border border-outline-variant/20 rounded-xl p-2.5 sm:p-3.5 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 group">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <Avatar initials={agent.persona} colorClass={agent.avatarColor} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-on-surface text-[11px] sm:text-xs truncate">
            {agent.name}
          </div>
          <div className="text-on-surface-variant text-[9px] sm:text-[10px] truncate">
            {agent.role}
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusColors[agent.status]} ${agent.status === "online" ? "animate-pulse" : ""}`} />
      </div>
    </div>
  );
}

function FlowArrowVertical({ delayClass = "", label }: { delayClass?: string; label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flow-connector-v flow-arrow-down w-px h-5 sm:h-12 bg-linear-to-b from-primary/40 to-primary/15 relative">
        <div className={`flow-dot ${delayClass}`} />
      </div>
      {label && (
        <div className="text-[8px] sm:text-[9px] text-primary/70 font-medium animate-task-flash whitespace-nowrap mt-0.5">
          {label}
        </div>
      )}
    </div>
  );
}

function FlowArrowHorizontal() {
  return (
    <div className="hidden md:flex justify-center">
      <div className="flow-connector-h w-3/4 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent relative">
        <div className="flow-dot" />
        <div className="flow-dot" />
        <div className="flow-dot" />
      </div>
    </div>
  );
}

function MemberFlowArrow({ index }: { index: number }) {
  const delays = ["", "flow-dot-delay-1", "flow-dot-delay-2", "flow-dot-delay-3"];
  return (
    <div className="flex justify-center">
      <div className={`flow-connector-v w-px h-3 sm:h-6 bg-linear-to-b from-primary/25 to-primary/5 relative`}>
        <div className={`flow-dot ${delays[index % delays.length]}`} />
      </div>
    </div>
  );
}

interface AICompanyProps {
  /** Optional: badge label override (defaults to "AIOS — AI OPERATING SYSTEM"). Kept for backwards-compat with sibling mastery pages. */
  builtOn?: string;
  /** Optional: subtitle override. Kept for backwards-compat. */
  builtOnSubtitle?: string;
}

export default function AICompany({ builtOn, builtOnSubtitle }: AICompanyProps = {}) {
  const badgeText = builtOn ? `ĐƯỢC XÂY DỰNG TRÊN ${builtOn}` : "AIOS — AI OPERATING SYSTEM";
  const subtitle = builtOnSubtitle ?? "Trước đây muốn tăng trưởng phải tuyển thêm người. Trong kỷ nguyên AI Agent, lợi thế thuộc về đội nhóm nhỏ biết thiết kế AIOS — hệ điều hành kết nối Agent, dữ liệu, quy trình và chiến lược thành một bộ máy tăng trưởng.";
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden" id="aios">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">hub</span>
              {badgeText}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              Doanh Nghiệp Của Bạn{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Vận Hành Bằng AI Agent
              </span>
            </h2>
            <p className="text-base sm:text-xl text-on-surface-variant max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Org Chart */}
        <div className="space-y-0">
          {/* CEO Level */}
          <ScrollReveal direction="scale">
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <div className="relative bg-linear-to-br from-primary/10 to-surface border-2 border-primary/30 rounded-xl p-4 sm:p-5 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar initials={ceo.persona} colorClass={ceo.avatarColor} size="lg" />
                    <div>
                      <div className="font-black text-on-surface text-base sm:text-lg">{ceo.name}</div>
                      <div className="text-xs sm:text-sm text-on-surface-variant">{ceo.role}</div>
                      <div className="text-[9px] sm:text-[10px] text-primary/60 mt-0.5">Chủ doanh nghiệp ra chiến lược · AIOS triển khai</div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] text-green-400 font-medium hidden sm:inline">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Flow arrow from CEO down */}
          <FlowArrowVertical label="Phân phối nhiệm vụ" />

          {/* Horizontal flow line to all departments */}
          <FlowArrowHorizontal />

          {/* Department Heads + Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mt-1">
            {departments.map((dept, deptIndex) => (
              <ScrollReveal key={dept.head.name} delay={deptIndex * 100} direction="up">
                <div className="space-y-0">
                  {/* Vertical connector from horizontal line */}
                  <div className="hidden md:flex justify-center">
                    <div className="flow-connector-v flow-arrow-down w-px h-5 bg-primary/20 relative">
                      <div className={`flow-dot flow-dot-delay-${deptIndex % 4}`} />
                    </div>
                  </div>

                  {/* Head card */}
                  <div className="relative bg-surface-container-high border border-primary/20 rounded-xl p-3 sm:p-4 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar initials={dept.head.persona} colorClass={dept.head.avatarColor} size="md" />
                      <div className="min-w-0">
                        <div className="font-bold text-on-surface text-xs sm:text-sm truncate">{dept.head.name}</div>
                        <div className="text-[10px] sm:text-xs text-on-surface-variant truncate">{dept.head.role}</div>
                        <div className="text-[8px] sm:text-[9px] text-primary/50">AIOS</div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`w-2 h-2 rounded-full ${statusColors[dept.head.status]} inline-block ${dept.head.status === "online" ? "animate-pulse" : ""}`} />
                    </div>
                  </div>

                  {/* Flow arrow from head to members with task label */}
                  <FlowArrowVertical delayClass={`flow-dot-delay-${deptIndex % 4}`} label={dept.task} />

                  {/* Members with individual flow arrows between them */}
                  <div className="space-y-0">
                    {dept.members.map((member, memberIndex) => (
                      <div key={member.name}>
                        {memberIndex > 0 && <MemberFlowArrow index={memberIndex} />}
                        <AgentCard agent={member} />
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <ScrollReveal delay={500}>
          <div className="mt-8 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "20+", label: "Agent chuyên trách", icon: "smart_toy" },
              { value: "24/7", label: "Vận hành liên tục", icon: "schedule" },
              { value: "5", label: "Khối chức năng", icon: "domain" },
              { value: "Tinh gọn", label: "Đội nhóm nhỏ", icon: "savings" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-container-high rounded-xl p-4 sm:p-5 text-center border border-primary/10 hover:border-primary/30 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-2 inline-block">{stat.icon}</span>
                <div className="text-xl sm:text-2xl font-black text-primary animate-number-glow">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-on-surface-variant font-bold uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
