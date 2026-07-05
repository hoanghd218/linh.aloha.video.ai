"use client";

import ScrollReveal from "../ScrollReveal";

const pains = [
  {
    icon: "schedule",
    title: "Việc gì cũng dồn về bạn",
    desc: "Content phụ thuộc cảm hứng. Sale phụ thuộc trí nhớ. CSKH phụ thuộc thời gian rảnh. Báo cáo phụ thuộc lúc bạn còn năng lượng.",
  },
  {
    icon: "auto_delete",
    title: "Đã xem rất nhiều video AI miễn phí",
    desc: "Nhưng vẫn chưa có hệ thống AI nào thật sự hỗ trợ công việc kinh doanh. Mọi thứ vẫn dừng ở mức “Hay quá, để hôm nào làm.”",
  },
  {
    icon: "trending_down",
    title: "Đối thủ đang vận hành nhanh hơn bạn",
    desc: "Họ ra content đều hơn, test thông điệp nhanh hơn, phản hồi khách đều hơn — chỉ vì họ tự động hóa sớm hơn bạn.",
  },
  {
    icon: "psychology_alt",
    title: "Dùng AI rời rạc — chưa thành quy trình",
    desc: "Mỗi lần lại mở ChatGPT/Claude rồi prompt lại từ đầu. Chưa có quy trình nào lặp lại được, chưa thành lớp trợ lý vận hành.",
  },
  {
    icon: "code_off",
    title: "Bạn không phải dân kỹ thuật",
    desc: "Đọc tài liệu Agent toàn API, JSON, automation… Mở 5 phút là tắt. Nhưng bạn vẫn cần đặt bài toán AI đúng để giao việc đúng.",
  },
  {
    icon: "payments",
    title: "Quy trình nằm trong đầu — chưa chuẩn hóa",
    desc: "Doanh nghiệp lớn lên bằng sự mệt mỏi của người chủ. Không thể cạnh tranh nổi từ 2026 trước những đối thủ dùng AI Agent vận hành cả hệ thống.",
  },
];

export default function PainPointsZoom() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">
                warning
              </span>
              NẾU BẠN ĐANG GẶP NHỮNG VẤN ĐỀ SAU
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Bạn Không Thiếu Video AI Miễn Phí —{" "}
              <span className="text-red-400">Bạn Thiếu Một Quy Trình</span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mt-4 max-w-3xl mx-auto">
              Đây là khoảng cách giữa{" "}
              <span className="text-on-surface font-bold">biết AI</span> và{" "}
              <span className="text-on-surface font-bold">ứng dụng AI thật sự</span>.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {pains.map((pain, index) => (
            <ScrollReveal key={pain.title} delay={index * 80}>
              <div className="group bg-surface-container-high rounded-2xl p-5 sm:p-6 border border-red-500/10 hover:border-red-500/30 transition-all duration-300 h-full">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-400 text-xl sm:text-2xl">
                      {pain.icon}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-black text-sm sm:text-base text-on-surface leading-tight">
                      {pain.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant">
                      {pain.desc}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-10 sm:mt-14 text-center">
            <p className="text-base sm:text-xl text-on-surface-variant max-w-3xl mx-auto">
              Điều nguy hiểm nhất không phải là AI thay thế bạn.{" "}
              <span className="text-on-surface font-bold">
                Mà là một đối thủ nhỏ hơn — nhưng biết dùng AI Agent tốt hơn — sẽ vận
                hành nhanh hơn bạn.
              </span>
            </p>
            <div className="mt-3 text-primary font-black text-lg sm:text-2xl">
              ↓ Đây là cách bắt đầu ↓
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
