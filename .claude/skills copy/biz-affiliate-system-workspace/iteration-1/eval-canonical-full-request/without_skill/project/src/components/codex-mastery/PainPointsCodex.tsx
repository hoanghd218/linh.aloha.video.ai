"use client";

import ScrollReveal from "../ScrollReveal";

const pains = [
  {
    icon: "schedule",
    title: "Bạn tốn 6-8 tiếng/ngày cho việc lặp đi lặp lại",
    desc: "Viết report, trả email, tổng hợp data, lên lịch đăng bài — công việc không có giá trị cao nhưng chiếm hết ngày.",
  },
  {
    icon: "campaign",
    title: "Content marketing ra nhỏ giọt, không đủ scale",
    desc: "1-2 bài/tuần không đủ để cạnh tranh. Thị trường cần 10-20 touch point nhưng bạn không có người để làm.",
  },
  {
    icon: "psychology_alt",
    title: "Dùng ChatGPT nhưng output vẫn generic",
    desc: "Prompt đơn lẻ cho ra kết quả sáo rỗng, không đúng tone thương hiệu. ChatGPT thực sự mạnh hơn rất nhiều nếu dùng đúng cách.",
  },
  {
    icon: "trending_down",
    title: "Chiến dịch marketing không có dữ liệu để tối ưu",
    desc: "Làm content mà không biết từ khoá nào đang trending, đối thủ đang làm gì. Bắn mù không có mục tiêu.",
  },
  {
    icon: "payments",
    title: "Thuê thêm người thì chi phí tăng, lợi nhuận giảm",
    desc: "1 nhân sự marketing = 15-25 triệu/tháng. Scale business bằng headcount không còn là mô hình bền vững.",
  },
  {
    icon: "auto_delete",
    title: "Đã học AI nhưng không biết áp dụng vào công việc thực",
    desc: "Khoá học toàn lý thuyết, demo toy project không dùng được. Tiền mất nhưng workflow vẫn như cũ.",
  },
];

export default function PainPointsCodex() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">warning</span>
              NẾU BẠN ĐANG GẶP NHỮNG VẤN ĐỀ SAU
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Marketing & Công Việc Thời AI —{" "}
              <span className="text-red-400">Làm Cách Cũ Là Thua</span>
            </h2>
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
                    <p className="text-xs sm:text-sm text-on-surface-variant">{pain.desc}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-10 sm:mt-14 text-center">
            <p className="text-base sm:text-xl text-on-surface-variant max-w-3xl mx-auto">
              Không phải bạn kém.{" "}
              <span className="text-on-surface font-bold">
                Chỉ là bạn chưa có đúng hệ thống tự động hoá.
              </span>
            </p>
            <div className="mt-3 text-primary font-black text-lg sm:text-2xl">
              ↓ Đây là cách giải quyết ↓
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
