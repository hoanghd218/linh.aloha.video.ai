"use client";

import ScrollReveal from "../ScrollReveal";

const insights = [
  {
    icon: "extension_off",
    title: "Rất nhiều người đang dùng AI, nhưng dùng rời rạc",
    desc: "Biết ChatGPT, biết tạo ảnh, tạo video, vài công cụ AI — nhưng tất cả vẫn là từng mảnh rời, chưa thành một hệ thống vận hành.",
  },
  {
    icon: "construction",
    title: "Doanh nghiệp không thiếu việc, mà thiếu hệ thống để vận hành",
    desc: "Điểm nghẽn lớn nằm ở marketing, bán hàng, xây kênh, sản xuất nội dung, chăm sóc khách hàng, quản lý đội nhóm, tự động hoá quy trình và đào tạo nhân sự.",
  },
  {
    icon: "schedule",
    title: "AI Agent sẽ thay đổi cách doanh nghiệp vận hành trong 3–5 năm tới",
    desc: "Trước đây: tuyển thêm người để làm thêm việc. Thời đại AI Agent: xây thêm Agent để hỗ trợ thêm năng lực.",
  },
  {
    icon: "emoji_events",
    title: "Người thắng không phải người biết nhiều tool nhất",
    desc: "Người mới học tool. Người khá xây workflow. Người đi trước xây AIOS. Người dẫn đầu xây doanh nghiệp vận hành bằng AI Agent.",
  },
  {
    icon: "route",
    title: "Người kinh doanh không chỉ cần học AI",
    desc: "Họ cần roadmap, hệ thống, cộng đồng, người hướng dẫn và môi trường để liên tục cập nhật, triển khai và cải tiến. Đó là lý do Global Elite Club là bước tiếp theo sau Summit.",
  },
];

export default function InsightsSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden"
      id="insights"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-container/10 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">
                warning
              </span>
              5 SỰ THẬT ÍT AI NÓI RA
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Vì Sao Anh Chị Vẫn Chưa{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Bứt Phá Với AI
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Không phải vì anh chị thiếu công cụ. Mà vì khoảng cách giữa &ldquo;dùng
              AI&rdquo; và &ldquo;có hệ thống AI Agent thật&rdquo; vẫn còn rất xa.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4 sm:space-y-5">
          {insights.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 90} direction="up">
              <div className="flex gap-4 sm:gap-6 bg-surface-container-high rounded-2xl p-5 sm:p-7 border border-primary/15 hover:border-primary/35 transition-all duration-300">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-primary/30 leading-none">
                    0{index + 1}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-xl font-black text-on-surface leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
