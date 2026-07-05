"use client";

import ScrollReveal from "./ScrollReveal";

const courses = [
  {
    href: "https://agents.theaifirst.com/claude-ai-mastery",
    icon: "psychology",
    tag: "CLAUDE AI",
    title: "Claude AI Mastery",
    subtitle: "Marketing & Kinh Doanh",
    desc: "Biến Claude AI thành đội ngũ marketing 24/7 — research, content, sách, website. Không cần code.",
    price: "8.000.000đ",
    sessions: "5 buổi Zoom live",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30 hover:border-amber-500/60",
    tagColor: "bg-amber-500/20 text-amber-400",
  },
  {
    href: "https://agents.theaifirst.com/chatgpt-codex-mastery",
    icon: "terminal",
    tag: "CHATGPT CODEX",
    title: "ChatGPT Codex Mastery",
    subtitle: "Automation & Productivity",
    desc: "Tự động hoá công việc, build scripts, tích hợp API và tăng năng suất gấp 10 lần với Codex.",
    price: "8.000.000đ",
    sessions: "5 buổi Zoom live",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30 hover:border-emerald-500/60",
    tagColor: "bg-emerald-500/20 text-emerald-400",
  },
  {
    href: "https://agents.theaifirst.com/vibe-coding-mastery",
    icon: "web",
    tag: "VIBE CODING",
    title: "Vibe Coding Mastery",
    subtitle: "App & Website Bán Hàng",
    desc: "Build app, website chuyển đổi cao, tích hợp thanh toán, quản lý khoá học — không cần biết code.",
    price: "8.000.000đ",
    sessions: "5 buổi Zoom live",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30 hover:border-violet-500/60",
    tagColor: "bg-violet-500/20 text-violet-400",
  },
];

export default function CoursesHighlight() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest" id="courses">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">school</span>
              KHOÁ HỌC CHUYÊN SÂU
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Nâng Cấp Kỹ Năng AI{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Sau Sự Kiện
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mt-3 sm:mt-4 max-w-2xl mx-auto">
              3 khoá học chuyên sâu 5 buổi Zoom live — từ marketing đến vibe coding, mỗi khoá đều kết thúc bằng 1 sản phẩm thật.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {courses.map((course, index) => (
            <ScrollReveal key={course.title} delay={index * 100}>
              <a
                href={course.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col h-full bg-linear-to-br ${course.color} rounded-2xl sm:rounded-3xl p-6 sm:p-7 border ${course.border} transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.12)] hover:-translate-y-1`}
              >
                {/* Icon + Tag */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high/80 border border-outline-variant/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {course.icon}
                    </span>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${course.tagColor}`}>
                    {course.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-black text-on-surface leading-tight mb-1">
                  {course.title}
                </h3>
                <div className="text-xs sm:text-sm text-primary font-bold mb-3">
                  {course.subtitle}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed flex-1 mb-5">
                  {course.desc}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                  <div>
                    <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      {course.sessions}
                    </div>
                    <div className="text-lg sm:text-xl font-black text-primary">
                      {course.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary font-black text-xs group-hover:bg-primary group-hover:text-on-primary-container transition-all">
                    Xem khoá học
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
