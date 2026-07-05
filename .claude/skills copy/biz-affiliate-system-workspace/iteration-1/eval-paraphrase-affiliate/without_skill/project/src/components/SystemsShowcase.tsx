"use client";

import ScrollReveal from "./ScrollReveal";

const systems = [
  {
    icon: "campaign",
    title: "Marketing Agent System",
    color: "from-rose-500 to-pink-600",
    items: [
      "Nghiên cứu thị trường, phân tích khách hàng",
      "Tìm insight, lên chiến lược nội dung",
      "Xây thông điệp truyền thông",
      "Đề xuất góc bán hàng",
      "Tối ưu thu hút khách hàng",
    ],
  },
  {
    icon: "handshake",
    title: "Sales Agent System",
    color: "from-blue-500 to-indigo-600",
    items: [
      "Xây kịch bản bán hàng, tư vấn",
      "Phân tích nhu cầu khách hàng",
      "Xử lý phản đối, phân loại lead",
      "Tạo nội dung follow-up",
      "Tối ưu tỷ lệ chuyển đổi",
    ],
  },
  {
    icon: "trending_up",
    title: "Channel Growth Agent System",
    color: "from-orange-500 to-amber-600",
    items: [
      "Tìm chủ đề nội dung, phân tích content win",
      "Tạo lịch nội dung, kịch bản video",
      "Tối ưu hook và retention",
      "Nhân bản nội dung đa nền tảng",
      "Xây hệ thống TikTok/YouTube/Facebook/cộng đồng",
    ],
  },
  {
    icon: "stars",
    title: "Personal Branding Agent System",
    color: "from-violet-500 to-purple-600",
    items: [
      "Xây định vị cá nhân",
      "Tạo câu chuyện thương hiệu, trụ cột nội dung",
      "Viết bài chuyên gia + hành trình",
      "Tạo chiến dịch ra mắt sản phẩm",
      "Biến chuyên môn thành hệ sinh thái nội dung",
    ],
  },
  {
    icon: "videocam",
    title: "AI Affiliate Content Engine",
    color: "from-fuchsia-500 to-pink-600",
    items: [
      "Nghiên cứu sản phẩm, phân tích content win",
      "Tạo nhiều biến thể kịch bản",
      "Tối ưu hook, CTA, visual",
      "Quy trình sản xuất nội dung hàng loạt",
      "Triển khai TikTok / Shopee / Facebook",
    ],
  },
  {
    icon: "menu_book",
    title: "Amazon KDP / POD Agent System",
    color: "from-emerald-500 to-teal-600",
    items: [
      "Nghiên cứu ngách, tìm ý tưởng sản phẩm",
      "Phân tích từ khoá, tạo outline sách",
      "Viết mô tả listing, tạo prompt thiết kế",
      "Kiểm tra chất lượng, tối ưu SEO",
      "Lên kế hoạch xuất bản",
    ],
  },
  {
    icon: "psychology_alt",
    title: "Business Strategy Agent System",
    color: "from-sky-500 to-cyan-600",
    items: [
      "Phân tích mô hình kinh doanh",
      "Tìm điểm nghẽn tăng trưởng",
      "Đề xuất cơ hội + thiết kế offer",
      "Phân tích thị trường, đối thủ",
      "Hỗ trợ ra quyết định chiến lược",
    ],
  },
  {
    icon: "diversity_3",
    title: "Freedom Partnership System",
    color: "from-yellow-500 to-amber-600",
    items: [
      "Tìm kiếm đối tác phù hợp",
      "Xây thông điệp + quyền lợi đối tác",
      "Tạo tài liệu mời hợp tác, kịch bản tư vấn",
      "Xây quy trình onboarding",
      "Phát triển cộng đồng và hệ sinh thái",
    ],
  },
];

export default function SystemsShowcase() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden" id="systems">
      <div className="hidden sm:block absolute top-20 right-10 w-48 h-48 border border-primary/5 rotate-45 animate-spin-slow pointer-events-none" />
      <div className="hidden sm:block absolute bottom-20 left-10 w-32 h-32 border border-primary/5 rotate-12 animate-spin-slow pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">dashboard</span>
              8 HỆ THỐNG AGENT THỰC TẾ
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              Showcase + Định Hướng{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Chuyển Giao
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Tuỳ thời lượng và mức độ phù hợp của nhóm học viên, chương trình sẽ demo và định hướng triển khai các hệ thống Agent sau — bạn không chỉ xem từng tool, mà thấy cách <span className="text-primary font-bold">các mảnh ghép kết nối</span> thành hệ thống tăng trưởng.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {systems.map((system, index) => (
            <ScrollReveal key={system.title} delay={index * 80} direction="up">
              <div className="group relative bg-surface-container-high rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-primary/15 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)] transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden">
                {/* Number watermark */}
                <div className="absolute top-2 right-3 text-3xl sm:text-4xl font-black text-primary/10 select-none leading-none">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br ${system.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-white text-xl sm:text-2xl">
                    {system.icon}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black mb-3 leading-snug">{system.title}</h3>

                <ul className="space-y-1.5">
                  {system.items.map((item) => (
                    <li key={item} className="flex gap-1.5 text-[11px] sm:text-xs text-on-surface-variant leading-snug">
                      <span className="material-symbols-outlined text-primary/70 text-xs sm:text-sm shrink-0 mt-0.5">arrow_right_alt</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-on-surface-variant italic max-w-2xl mx-auto">
              Người thắng không phải người thử nhiều tool nhất. Người thắng là người biết kết nối các công cụ, Agent và workflow thành một <span className="text-primary font-bold">hệ thống kinh doanh thật</span>.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
