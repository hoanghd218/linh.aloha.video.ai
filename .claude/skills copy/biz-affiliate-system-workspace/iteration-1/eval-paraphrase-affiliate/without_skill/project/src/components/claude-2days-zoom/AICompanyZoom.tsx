"use client";

import ScrollReveal from "../ScrollReveal";

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
  name: "Steve Jobs CEO",
  role: "Giám Đốc Điều Hành",
  icon: "apartment",
  status: "online",
  persona: "SJ",
  avatarColor: "from-amber-500 to-orange-600",
};

const departments: Department[] = [
  {
    head: {
      name: "Gary Vee CMO",
      role: "Giám Đốc Marketing",
      icon: "campaign",
      status: "online",
      persona: "GV",
      avatarColor: "from-rose-500 to-pink-600",
    },
    task: "Giao việc: Tạo chiến dịch mới",
    members: [
      { name: "Naval Content", role: "Content Researcher", icon: "edit_note", status: "online", persona: "NR", avatarColor: "from-sky-500 to-blue-600" },
      { name: "MrBeast Video", role: "Video Editor", icon: "videocam", status: "busy", persona: "MB", avatarColor: "from-violet-500 to-purple-600" },
      { name: "David Ogilvy", role: "Copy Writer", icon: "travel_explore", status: "online", persona: "DO", avatarColor: "from-emerald-500 to-green-600" },
      { name: "Dan Community", role: "Community Manager", icon: "share", status: "online", persona: "DC", avatarColor: "from-cyan-500 to-teal-600" },
    ],
  },
  {
    head: {
      name: "Sheryl HR",
      role: "HR Manager",
      icon: "groups",
      status: "online",
      persona: "SS",
      avatarColor: "from-blue-500 to-indigo-600",
    },
    task: "Giao việc: Tuyển dụng mới",
    members: [
      { name: "Lisa Recruiter", role: "Tuyển dụng tự động", icon: "person_search", status: "online", persona: "LR", avatarColor: "from-pink-500 to-rose-600" },
      { name: "Tony Trainer", role: "Đào tạo nhân viên", icon: "school", status: "idle", persona: "TT", avatarColor: "from-amber-500 to-yellow-600" },
    ],
  },
  {
    head: {
      name: "Jeff Book Dir",
      role: "Giám Đốc Xuất Bản",
      icon: "menu_book",
      status: "online",
      persona: "JB",
      avatarColor: "from-orange-500 to-amber-600",
    },
    task: "Giao việc: Xuất bản 5 sách",
    members: [
      { name: "Alex Research", role: "Nghiên cứu ngách sách", icon: "search", status: "online", persona: "AR", avatarColor: "from-teal-500 to-cyan-600" },
      { name: "Maya Writer", role: "Viết nội dung sách", icon: "auto_stories", status: "busy", persona: "MW", avatarColor: "from-fuchsia-500 to-pink-600" },
      { name: "Dieter Designer", role: "Thiết kế bìa & layout", icon: "palette", status: "online", persona: "DR", avatarColor: "from-lime-500 to-green-600" },
      { name: "Sam Publisher", role: "Đăng sách Amazon", icon: "publish", status: "online", persona: "SP", avatarColor: "from-indigo-500 to-violet-600" },
    ],
  },
  {
    head: {
      name: "Elon POD Dir",
      role: "Giám Đốc Print-on-Demand",
      icon: "storefront",
      status: "online",
      persona: "EM",
      avatarColor: "from-sky-500 to-blue-600",
    },
    task: "Giao việc: Launch 10 designs",
    members: [
      { name: "Mark Research", role: "Nghiên cứu sản phẩm", icon: "query_stats", status: "online", persona: "MZ", avatarColor: "from-blue-500 to-cyan-600" },
      { name: "Andy Designer", role: "Tạo design tự động", icon: "brush", status: "busy", persona: "AW", avatarColor: "from-red-500 to-orange-600" },
      { name: "Tim Listing", role: "Tối ưu listing Amazon", icon: "inventory", status: "online", persona: "TC", avatarColor: "from-emerald-500 to-teal-600" },
      { name: "Sophie Ads", role: "Quản lý quảng cáo PPC", icon: "ads_click", status: "online", persona: "SA", avatarColor: "from-yellow-500 to-amber-600" },
    ],
  },
  {
    head: {
      name: "Elon Musk CTO",
      role: "Giám Đốc Công Nghệ",
      icon: "engineering",
      status: "online",
      persona: "EM",
      avatarColor: "from-purple-500 to-indigo-600",
    },
    task: "Giao việc: Phát triển hệ thống",
    members: [
      { name: "Linus Senior Dev", role: "Senior Developer", icon: "code", status: "online", persona: "LS", avatarColor: "from-sky-500 to-blue-600" },
      { name: "Docker DevOps", role: "DevOps Engineer", icon: "cloud_sync", status: "busy", persona: "DD", avatarColor: "from-orange-500 to-red-600" },
      { name: "Ada Tester", role: "QA Tester", icon: "bug_report", status: "online", persona: "AT", avatarColor: "from-green-500 to-emerald-600" },
      { name: "Grace BA", role: "Business Analyst", icon: "analytics", status: "online", persona: "GB", avatarColor: "from-pink-500 to-fuchsia-600" },
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

export default function AICompanyZoom() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">smart_toy</span>
              HỆ AI AGENT CHO DOANH NGHIỆP CỦA BẠN
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              Công Ty AI Agent{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Của Bạn
              </span>
            </h2>
            <p className="text-base sm:text-xl text-on-surface-variant max-w-2xl mx-auto">
              Một đội ngũ AI Agents vận hành 24/7 — thay thế cả phòng ban với chi phí gần bằng 0
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-0">
          <ScrollReveal direction="scale">
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <div className="relative bg-linear-to-br from-primary/10 to-surface border-2 border-primary/30 rounded-xl p-4 sm:p-5 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar initials={ceo.persona} colorClass={ceo.avatarColor} size="lg" />
                    <div>
                      <div className="font-black text-on-surface text-base sm:text-lg">{ceo.name}</div>
                      <div className="text-xs sm:text-sm text-on-surface-variant">{ceo.role}</div>
                      <div className="text-[9px] sm:text-[10px] text-primary/60 mt-0.5">Claude</div>
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

          <FlowArrowVertical label="Phân phối nhiệm vụ" />

          <FlowArrowHorizontal />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mt-1">
            {departments.map((dept, deptIndex) => (
              <ScrollReveal key={dept.head.name} delay={deptIndex * 100} direction="up">
                <div className="space-y-0">
                  <div className="hidden md:flex justify-center">
                    <div className="flow-connector-v flow-arrow-down w-px h-5 bg-primary/20 relative">
                      <div className={`flow-dot flow-dot-delay-${deptIndex % 4}`} />
                    </div>
                  </div>

                  <div className="relative bg-surface-container-high border border-primary/20 rounded-xl p-3 sm:p-4 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar initials={dept.head.persona} colorClass={dept.head.avatarColor} size="md" />
                      <div className="min-w-0">
                        <div className="font-bold text-on-surface text-xs sm:text-sm truncate">{dept.head.name}</div>
                        <div className="text-[10px] sm:text-xs text-on-surface-variant truncate">{dept.head.role}</div>
                        <div className="text-[8px] sm:text-[9px] text-primary/50">Claude</div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`w-2 h-2 rounded-full ${statusColors[dept.head.status]} inline-block ${dept.head.status === "online" ? "animate-pulse" : ""}`} />
                    </div>
                  </div>

                  <FlowArrowVertical delayClass={`flow-dot-delay-${deptIndex % 4}`} label={dept.task} />

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

        <ScrollReveal delay={500}>
          <div className="mt-8 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "18", label: "AI Agents", icon: "smart_toy" },
              { value: "24/7", label: "Hoạt động", icon: "schedule" },
              { value: "5", label: "Phòng ban", icon: "domain" },
              { value: "Thấp", label: "Chi phí nhân sự", icon: "savings" },
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
