"use client";

import ScrollReveal from "./ScrollReveal";

const personas = [
  {
    icon: "business_center",
    title: "Chủ doanh nghiệp muốn tái cấu trúc bằng AI Agent",
    description:
      "Có công ty, đội nhóm, sản phẩm — nhưng marketing chưa đều, sales phụ thuộc cá nhân, chi phí vận hành tăng và chưa biết AI hoá từ đâu.",
  },
  {
    icon: "person",
    title: "Người kinh doanh cá nhân xây mô hình tinh gọn",
    description:
      "Đang bán sản phẩm, dịch vụ, khoá học, tư vấn, affiliate hay đang xây cộng đồng. Cần xây phễu + content + chăm sóc bằng Agent thay vì làm tay mỗi ngày.",
  },
  {
    icon: "school",
    title: "Chuyên gia, coach, nhà đào tạo nhân bản chuyên môn",
    description:
      "Có tri thức và kinh nghiệm nhưng chưa biến được thành hệ sinh thái: thương hiệu cá nhân + nội dung + sản phẩm tri thức + cộng đồng + phễu bán hàng.",
  },
  {
    icon: "public",
    title: "Affiliate, TikTok US, Amazon KDP, POD, thị trường quốc tế",
    description:
      "Quan tâm các mô hình kiếm tiền toàn cầu. Cần hệ thống Agent để nghiên cứu, sản xuất nội dung, xây kênh và mở rộng thay vì làm thủ công từng bước.",
  },
  {
    icon: "diversity_3",
    title: "Người xây hệ sinh thái đối tác và cộng đồng",
    description:
      "Có cộng đồng, đội sale, affiliate hoặc network đối tác. Cần Agent hỗ trợ tìm đối tác, đào tạo CTV, chuẩn hoá tài liệu, onboarding và xây Freedom Partnership.",
  },
  {
    icon: "rocket_launch",
    title: "Thành viên Elite / Freedom Builders muốn đi sâu vào AIOS",
    description:
      "Đang trong hệ sinh thái Elite hoặc Freedom Builders, muốn tăng tốc xây doanh nghiệp bằng AI Agent và tham gia làn sóng AIOS sâu hơn.",
  },
];

const notFor = [
  "Chỉ muốn học vài mẹo dùng AI cho vui",
  "Chỉ muốn sưu tầm prompt, không muốn đổi cách làm việc",
  "Chưa sẵn sàng đầu tư thời gian thực hành",
  "Kỳ vọng AI tạo kết quả mà không cần tư duy + hệ thống + hành động",
  "Chỉ muốn xem demo công nghệ, không định áp dụng vào mô hình thật",
];

export default function WhoIsThisFor() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface" id="for-who">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">groups</span>
              AGENT CAMP DÀNH CHO AI?
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              6 Nhóm Người{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Sẽ Tận Dụng Tối Đa
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
              Nếu bạn nằm trong nhóm dưới đây và nghiêm túc muốn đi sâu — đây là chương trình dành cho bạn.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {personas.map((persona, index) => (
            <ScrollReveal key={persona.icon} delay={index * 100} direction="up">
              <div className="relative bg-surface-container-high p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)] transition-all duration-300 h-full group">
                <div className="absolute -top-3 -left-3 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-primary to-primary-container flex items-center justify-center font-black text-on-primary-container text-sm sm:text-base shadow-lg">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="mb-3 sm:mb-4 pl-6 sm:pl-8">
                  <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl group-hover:scale-110 transition-transform inline-block">
                    {persona.icon}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black mb-2 sm:mb-3 leading-snug">{persona.title}</h3>
                <p className="text-sm text-on-surface-variant">{persona.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* NOT for */}
        <ScrollReveal direction="scale">
          <div className="bg-surface-container-lowest border border-red-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-400 text-xl sm:text-2xl">block</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-xl font-black mb-3 sm:mb-4 text-red-300 uppercase tracking-tight">
                  Agent Camp KHÔNG phù hợp nếu bạn...
                </h3>
                <ul className="space-y-2 sm:space-y-2.5">
                  {notFor.map((item) => (
                    <li key={item} className="flex gap-2 sm:gap-3 text-sm sm:text-base text-on-surface-variant">
                      <span className="material-symbols-outlined text-red-400/60 text-base sm:text-lg shrink-0 mt-0.5">close</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-on-surface-variant italic">
                  Agent Camp dành cho người <span className="text-primary font-bold">muốn đi thật</span> — hiểu thật, làm thật, xây hệ thống thật, ứng dụng AI Agent để tạo lợi thế thật.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
