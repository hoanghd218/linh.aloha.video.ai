"use client";

import ScrollReveal from "./ScrollReveal";

const painPoints = [
  {
    icon: "shuffle",
    title: "Dùng AI rời rạc, chưa thành hệ thống",
    description:
      "Hôm nay viết bài bằng ChatGPT, mai tạo ảnh bằng Midjourney, thấy tool mới lại thử — nhưng marketing và bán hàng vẫn rời rạc như cũ.",
  },
  {
    icon: "help",
    title: "Không biết AI hoá bộ phận nào trước",
    description:
      "Bạn biết AI rất tiềm năng. Nhưng marketing, sales, nội dung, vận hành — đâu là điểm nên bắt đầu? Không có bản đồ rõ ràng.",
  },
  {
    icon: "trending_down",
    title: "Đội nhóm phình to, lợi nhuận teo nhỏ",
    description:
      "Muốn làm nhiều việc hơn thì tuyển thêm người. Nhưng chi phí nhân sự tăng nhanh hơn tốc độ tăng trưởng doanh thu.",
  },
  {
    icon: "person_off",
    title: "Bán hàng phụ thuộc vào từng cá nhân",
    description:
      "Sale giỏi nghỉ việc là doanh thu tụt. Không có quy trình, không có hệ thống — tăng trưởng phụ thuộc vào con người chứ không phải bộ máy.",
  },
  {
    icon: "shopping_cart_off",
    title: "Nội dung làm theo cảm hứng, kênh không đều",
    description:
      "Tuần này đăng 5 bài, tháng sau im lặng. Không có content engine, không có chiến lược nhân bản — kênh tăng trưởng chậm và bấp bênh.",
  },
  {
    icon: "schedule",
    title: "Quy trình thủ công nuốt hết thời gian chiến lược",
    description:
      "Chủ doanh nghiệp dành 80% thời gian xử lý việc lặt vặt. Không còn năng lượng để nghĩ chiến lược, mở thị trường mới hay xây kênh tăng trưởng.",
  },
];

export default function PainPoints() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest" id="about">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">warning</span>
              VẤN ĐỀ THỰC TẾ
            </div>
            <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-on-surface tracking-tight mb-3 sm:mb-4 uppercase">
              Vì Sao Nhiều Người Dùng AI Nhưng Chưa Tạo Kết Quả Lớn?
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Bạn không thiếu công cụ AI. Bạn đang thiếu một <span className="text-primary font-bold">hệ điều hành AIOS</span>.
            </p>
            <div className="w-24 h-1 bg-primary-container mx-auto mt-4 sm:mt-6" />
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {painPoints.map((point, index) => (
            <ScrollReveal key={point.icon} delay={index * 100} direction={index % 2 === 0 ? "left" : "right"}>
              <div className="bg-surface p-5 sm:p-8 rounded-xl sm:rounded-2xl border border-primary-container/20 hover:border-primary-container/50 transition-all duration-300 group hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] hover:-translate-y-1 h-full">
                <div className="mb-4 sm:mb-6">
                  <span className="material-symbols-outlined text-secondary-container text-3xl sm:text-4xl group-hover:scale-110 transition-transform inline-block">
                    {point.icon}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold mb-3 sm:mb-4">{point.title}</h3>
                <p className="text-sm sm:text-base text-on-surface-variant">{point.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
