"use client";

import ScrollReveal from "../ScrollReveal";

const groups = [
  {
    icon: "corporate_fare",
    title: "Chủ doanh nghiệp",
    desc: "Muốn tái cấu trúc doanh nghiệp, giảm phụ thuộc nhân sự, tối ưu marketing — bán hàng — vận hành bằng AI Agent.",
  },
  {
    icon: "storefront",
    title: "Người kinh doanh cá nhân",
    desc: "Muốn xây mô hình kinh doanh tinh gọn, tạo nội dung, kéo traffic, bán hàng và chăm sóc khách hàng bằng AI.",
  },
  {
    icon: "school",
    title: "Chuyên gia / Coach / Nhà đào tạo",
    desc: "Muốn xây thương hiệu cá nhân, hệ sinh thái nội dung, cộng đồng, phễu bán hàng và sản phẩm số bằng AI Agent.",
  },
  {
    icon: "trending_up",
    title: "Người làm Affiliate / TikTok / KDP / POD",
    desc: "Muốn xây content engine, hệ thống nghiên cứu sản phẩm, sản xuất nội dung và tăng trưởng đa kênh bằng AI.",
  },
  {
    icon: "diversity_3",
    title: "Người muốn xây cộng đồng / hệ sinh thái",
    desc: "Muốn mở rộng network, tìm đối tác, xây cộng đồng và hệ sinh thái partnership chất lượng cao.",
  },
];

export default function WhoForSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface relative overflow-hidden"
      id="who-for"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">
                groups
              </span>
              5 NHÓM PHÙ HỢP
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              AI AGENT SUMMIT{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Dành Cho Ai?
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Nếu anh chị nằm trong một trong 5 nhóm dưới đây, đây là sự kiện được
              thiết kế đúng cho anh chị.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {groups.map((group, index) => (
            <ScrollReveal key={group.title} delay={index * 90}>
              <div className="h-full bg-surface-container-high rounded-2xl p-5 sm:p-7 border border-primary/15 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                      {group.icon}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-primary/25 leading-none group-hover:text-primary/40 transition-colors">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-on-surface mb-2 leading-snug">
                  {group.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {group.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}

          {/* Closing card */}
          <ScrollReveal delay={450}>
            <div className="h-full bg-linear-to-br from-primary/15 to-primary-container/5 rounded-2xl p-5 sm:p-7 border-2 border-primary/40 flex flex-col justify-center text-center">
              <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl mb-3 mx-auto">
                rocket_launch
              </span>
              <p className="text-sm sm:text-base font-bold text-on-surface leading-relaxed">
                Điểm chung của cả 5 nhóm: muốn bước vào kỷ nguyên AI Agent một cách{" "}
                <span className="text-primary">có hệ thống</span> — không đứng ngoài
                quan sát làn sóng.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
