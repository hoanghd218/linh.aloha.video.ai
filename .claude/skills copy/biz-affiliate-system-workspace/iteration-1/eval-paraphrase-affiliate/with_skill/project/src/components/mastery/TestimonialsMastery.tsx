"use client";

import ScrollReveal from "../ScrollReveal";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Mình là dân marketing thuần, không biết code. Sau buổi 2 đã có CLAUDE.md cho brand và tự gen được sales page. Tiết kiệm ít nhất 15 triệu/tháng tiền thuê freelancer.",
    name: "Chị Hằng T.",
    role: "Founder thương hiệu mỹ phẩm natural",
    initials: "HT",
    color: "from-rose-500 to-pink-600",
    result: "Tiết kiệm 15tr/tháng",
  },
  {
    quote:
      "Trước đây mình viết 1 ebook mất 4-5 tháng. Sau khoá học, pipeline research → outline → draft chạy trong 2 tuần. Đã xuất bản 3 cuốn lên Amazon KDP.",
    name: "Anh Minh D.",
    role: "Tác giả & KDP Publisher",
    initials: "MD",
    color: "from-amber-500 to-orange-600",
    result: "3 ebook xuất bản",
  },
  {
    quote:
      "Phần MCP + Sub-Agents thực sự đã thay đổi cách mình vận hành agency. Giờ 1 người mình làm được việc của 4 nhân viên, team gọn lại, lợi nhuận tăng gấp đôi.",
    name: "Anh Phong L.",
    role: "Owner Digital Marketing Agency",
    initials: "PL",
    color: "from-emerald-500 to-green-600",
    result: "Lợi nhuận x2",
  },
  {
    quote:
      "Điểm mình thích nhất: Tony Hoang dạy rất chậm, xây khái niệm từng bậc. Người không kỹ thuật như mình vẫn theo được 100%. Deliverable cuối mỗi buổi đều dùng được ngay.",
    name: "Chị Linh N.",
    role: "Content Creator · 120K followers",
    initials: "LN",
    color: "from-violet-500 to-purple-600",
    result: "Theo 100% dù không code",
  },
  {
    quote:
      "Mình đã học 3 khoá AI khác trước đó, đều toàn lý thuyết. Khoá này khác hẳn — build sản phẩm thật từ buổi 1. Capstone project của mình giờ đang chạy production, tạo lead tự động mỗi ngày.",
    name: "Anh Tuấn M.",
    role: "Chủ doanh nghiệp B2B SaaS",
    initials: "TM",
    color: "from-sky-500 to-blue-600",
    result: "Lead tự động mỗi ngày",
  },
  {
    quote:
      "Team marketing 5 người của mình giờ chỉ cần 2 người + 1 agent team. Hiệu suất content tăng gấp 6 lần. Cost trên mỗi bài viết giảm từ 500K xuống còn 20K.",
    name: "Chị Trang V.",
    role: "Marketing Director chuỗi F&B",
    initials: "TV",
    color: "from-fuchsia-500 to-pink-600",
    result: "Content x6, cost /25",
  },
];

export default function TestimonialsMastery() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">
                favorite
              </span>
              KẾT QUẢ HỌC VIÊN THỰC TẾ
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              2,400+ Học Viên Đã{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Thay Đổi Cách Làm Việc
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mt-3 sm:mt-4">
              Đây là những gì họ đạt được sau khi áp dụng hệ thống Claude AI vào business
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((t, index) => (
            <ScrollReveal key={t.name} delay={index * 100}>
              <div className="bg-surface-container-high rounded-2xl p-5 sm:p-6 border border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 text-primary mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-base sm:text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-on-surface-variant italic leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Result badge */}
                <div className="mt-4 inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/15 border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-sm">
                    trending_up
                  </span>
                  <span className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-wider">
                    {t.result}
                  </span>
                </div>

                {/* Author */}
                <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center gap-3">
                  <div
                    className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-linear-to-br ${t.color} flex items-center justify-center font-black text-white text-sm`}
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-on-surface truncate">
                      {t.name}
                    </div>
                    <div className="text-[10px] sm:text-xs text-on-surface-variant truncate">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Stats */}
        <ScrollReveal>
          <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "2,400+", label: "Học viên" },
              { value: "4.9/5", label: "Đánh giá TB" },
              { value: "96%", label: "Hoàn thành khoá" },
              { value: "18+", label: "AI Agents build" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-surface-container-high rounded-xl p-4 text-center border border-primary/10"
              >
                <div className="text-2xl sm:text-3xl font-black text-primary animate-number-glow">
                  {s.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
