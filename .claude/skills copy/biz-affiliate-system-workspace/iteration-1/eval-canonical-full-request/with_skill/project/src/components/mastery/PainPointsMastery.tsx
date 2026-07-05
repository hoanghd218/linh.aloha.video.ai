"use client";

import ScrollReveal from "../ScrollReveal";

const pains = [
  {
    icon: "schedule",
    title: "Bạn tốn 8-12 tiếng/ngày cho content",
    desc: "Research → viết caption → edit → đăng bài. Làm xong thì đã hết ngày, không còn sức để bán hàng.",
  },
  {
    icon: "payments",
    title: "Thuê agency thì quá đắt",
    desc: "15-50 triệu/tháng cho 1 team marketing. Không đủ ngân sách mà tự làm thì không kịp.",
  },
  {
    icon: "psychology_alt",
    title: "Dùng ChatGPT mà output vẫn \"AI-generated\"",
    desc: "Viết sáo rỗng, không đúng tone thương hiệu, copy-paste được luôn trong vòng 3 giây là phát hiện.",
  },
  {
    icon: "code_off",
    title: "Bạn không biết code",
    desc: "Đọc hướng dẫn AI Agent toàn terminal, API, JSON. Mở lên 5 phút là tắt máy.",
  },
  {
    icon: "auto_delete",
    title: "Đã thử nhiều khoá AI nhưng không áp dụng được",
    desc: "Khoá toàn lý thuyết. Học xong không biết bắt đầu từ đâu. Tiền mất, tật mang.",
  },
  {
    icon: "trending_down",
    title: "Đối thủ đang vượt mặt bạn bằng AI",
    desc: "Họ ra 10 bài/ngày, bạn ra 1. Họ có website mới mỗi tuần, bạn vẫn đang sửa trang cũ.",
  },
];

export default function PainPointsMastery() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">
                warning
              </span>
              NẾU BẠN ĐANG GẶP NHỮNG VẤN ĐỀ SAU
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              Marketing & Kinh Doanh Thời AI —{" "}
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
              Không phải bạn kém.{" "}
              <span className="text-on-surface font-bold">
                Chỉ là bạn chưa có đúng hệ thống.
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
