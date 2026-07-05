"use client";

import ScrollReveal from "../ScrollReveal";

const benefits = [
  {
    icon: "visibility",
    title: "Hiểu bức tranh lớn về AI Agent",
    desc: "Vì sao AI không còn chỉ là công cụ, mà đang trở thành một lớp vận hành mới của doanh nghiệp.",
  },
  {
    icon: "search",
    title: "Nhìn lại mô hình kinh doanh của mình",
    desc: "Thấy rõ điểm nghẽn trong marketing, bán hàng, xây kênh, nội dung và vận hành.",
  },
  {
    icon: "target",
    title: "Biết nên ứng dụng AI Agent vào đâu trước",
    desc: "Xác định đúng bài toán để bắt đầu — thay vì dùng AI rời rạc, manh mún, mỗi nơi một ít.",
  },
  {
    icon: "smart_toy",
    title: "Xem showcase hệ thống AI Agent thật",
    desc: "Tận mắt thấy các hệ thống AI Agent đang vận hành thực tế, tạo ra kết quả thật.",
  },
  {
    icon: "diversity_3",
    title: "Kết nối với cộng đồng tiên phong",
    desc: "Gặp gỡ chủ doanh nghiệp, chuyên gia và những người dẫn đầu trong thời đại AI.",
  },
];

export default function PositioningSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface relative overflow-hidden"
      id="positioning"
    >
      <div className="hidden sm:block absolute top-1/4 right-10 w-40 h-40 border border-primary/10 rotate-45 animate-spin-slow pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-base sm:text-lg">
                info
              </span>
              AI AGENT SUMMIT LÀ GÌ
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Một Ngày Để Nhìn Lại{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Toàn Bộ Doanh Nghiệp
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              AI AGENT SUMMIT là sự kiện offline quy mô khoảng{" "}
              <span className="text-on-surface font-bold">200 người</span> dành cho
              chủ doanh nghiệp, người kinh doanh, chuyên gia, nhà đào tạo và những
              người muốn bước vào kỷ nguyên vận hành doanh nghiệp bằng AI Agent.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 90}>
              <div className="h-full bg-surface-container-high rounded-2xl p-5 sm:p-6 border border-primary/15 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-on-surface mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}

          {/* Core message card */}
          <ScrollReveal delay={450}>
            <div className="h-full bg-linear-to-br from-primary/15 to-primary-container/5 rounded-2xl p-5 sm:p-6 border-2 border-primary/40 flex flex-col justify-center">
              <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-3">
                format_quote
              </span>
              <p className="text-sm sm:text-base font-bold text-on-surface leading-relaxed">
                Doanh nghiệp thời đại mới không thắng vì dùng nhiều tool AI hơn.
                Doanh nghiệp thắng vì biết xây{" "}
                <span className="text-primary">hệ thống AI Agent</span> vận hành
                hiệu quả hơn.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
