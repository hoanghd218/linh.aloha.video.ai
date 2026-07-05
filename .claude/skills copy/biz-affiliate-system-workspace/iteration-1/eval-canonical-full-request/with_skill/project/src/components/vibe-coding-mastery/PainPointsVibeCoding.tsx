"use client";

import ScrollReveal from "../ScrollReveal";

const pains = [
  {
    icon: "code_off",
    title: "Bạn có ý tưởng app nhưng không biết code",
    desc: "Muốn build website bán hàng, app quản lý khoá học nhưng cứ bế tắc ngay bước đầu tiên vì không biết bắt đầu từ đâu.",
  },
  {
    icon: "payments",
    title: "Thuê dev thì quá đắt và chậm",
    desc: "30-100 triệu cho 1 website bán hàng cơ bản. Chờ 1-3 tháng. Muốn sửa thêm tính năng lại tốn thêm tiền, thêm thời gian.",
  },
  {
    icon: "shopping_cart",
    title: "Website bán hàng không chuyển đổi được",
    desc: "Dùng các nền tảng template sẵn nhưng conversion rate thấp, không tùy chỉnh được UX theo ý muốn.",
  },
  {
    icon: "psychology_alt",
    title: "Không tích hợp được thanh toán tự động",
    desc: "Thu tiền thủ công qua chuyển khoản, phải check bank 24/7, không có hệ thống tự động mở quyền truy cập sau khi thanh toán.",
  },
  {
    icon: "school",
    title: "Bán khoá học nhưng quản lý lộn xộn",
    desc: "Học viên đăng ký qua form, file Excel, Zalo thủ công. Không có hệ thống quản lý học viên, nội dung, tiến độ bài học.",
  },
  {
    icon: "trending_down",
    title: "Đối thủ ra sản phẩm số nhanh gấp 10 lần",
    desc: "Họ launch website mới mỗi tuần bằng AI. Bạn vẫn đang chờ dev hoặc học code truyền thống tốn hàng năm.",
  },
];

export default function PainPointsVibeCoding() {
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
              Xây Sản Phẩm Số Thời AI —{" "}
              <span className="text-red-400">Không Biết Vibe Coding Là Thua</span>
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
              Không phải bạn thiếu kỹ năng.{" "}
              <span className="text-on-surface font-bold">
                Chỉ là bạn chưa biết cách dùng AI để build thay bạn.
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
