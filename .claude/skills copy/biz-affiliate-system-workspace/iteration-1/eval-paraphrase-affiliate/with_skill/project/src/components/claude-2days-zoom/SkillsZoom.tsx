"use client";

import ScrollReveal from "../ScrollReveal";

interface Skill {
  tag: string;
  title: string;
  desc: string;
  icon: string;
}

const skills: Skill[] = [
  {
    tag: "AGENT 01",
    title: "Agent Đẻ Content Đúng Tệp, Đúng Insight Mỗi Ngày",
    desc: "Nhận brief ngắn từ bạn → ra content đều mỗi ngày, đúng tệp khách, đúng insight thay vì sáo rỗng AI-generated.",
    icon: "edit_note",
  },
  {
    tag: "AGENT 02",
    title: "Agent Đọc Vị Nỗi Đau Khách Hàng",
    desc: "Bóc tách phỏng vấn, comment, review → ra bản đồ nỗi đau khách hàng theo cấp độ — phục vụ content và sale.",
    icon: "psychology",
  },
  {
    tag: "AGENT 03",
    title: "Agent Viết Kịch Bản, Xây Hệ Thống Tư Vấn & Chốt Khách",
    desc: "Kịch bản tư vấn theo từng tệp khách. Xử lý từ chối thường gặp. Câu chốt phù hợp ngữ cảnh sản phẩm/dịch vụ của bạn.",
    icon: "support_agent",
  },
  {
    tag: "AGENT 04",
    title: "Agent Chăm Sóc Khách Hàng Mỗi Ngày Không Bỏ Sót",
    desc: "Tự lên kế hoạch chăm lead 7 ngày, gợi ý nội dung follow-up, không để rớt lead vì quên hay quá tải.",
    icon: "schedule_send",
  },
  {
    tag: "AGENT 05",
    title: "Agent Biến 1 Ý Tưởng Thành 10 Nội Dung",
    desc: "Một bài viết gốc → tái chế thành reels script, post Facebook, email, blog, Threads… tiết kiệm thời gian sản xuất nội dung.",
    icon: "auto_awesome",
  },
  {
    tag: "AGENT 06",
    title: "Agent Báo Cáo Kinh Doanh Cuối Ngày",
    desc: "Tổng hợp số liệu sale, lead, content → ra báo cáo cuối ngày kèm điểm nghẽn đáng chú ý, bạn chỉ cần review.",
    icon: "monitoring",
  },
  {
    tag: "AGENT 07",
    title: "Agent Biến Kinh Nghiệm Thành SOP",
    desc: "Phỏng vấn bạn về cách bạn làm 1 đầu việc → tự dựng SOP chuẩn để giao cho nhân sự / agent khác chạy lại.",
    icon: "rule",
  },
  {
    tag: "AGENT 08",
    title: "Bộ Skill AI Agent Soi Đối Thủ & Tìm Góc Bán Hàng",
    desc: "Quét fanpage/website đối thủ, phân tích thông điệp, định vị, ưu đãi → gợi ý góc bán hàng khác biệt cho bạn.",
    icon: "travel_explore",
  },
  {
    tag: "AGENT 09",
    title: "Agent Dựng Chiến Dịch Bán Hàng 7 Ngày",
    desc: "Brief sản phẩm + tệp khách → ra timeline chiến dịch 7 ngày: warm-up, demo, ưu đãi, chốt, follow-up.",
    icon: "campaign",
  },
];

export default function SkillsZoom() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute top-20 right-10 w-56 h-56 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">
                card_giftcard
              </span>
              QUÀ TẶNG ĐỘC QUYỀN VÉ TRẢ PHÍ
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              9 Bộ Skill AI Agent —{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Lắp Vào Dùng Ngay
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mt-3 sm:mt-4">
              Đây là phần dành cho người{" "}
              <span className="text-primary font-bold">không muốn chỉ nghe cho biết</span>{" "}
              — muốn có quy trình, prompt, template và khung Agent để áp dụng vào
              công việc thật.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {skills.map((skill, index) => (
            <ScrollReveal key={skill.tag} delay={index * 60}>
              <div className="group relative bg-surface-container-high rounded-2xl p-5 sm:p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 h-full overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary-container/10 border border-primary/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        {skill.icon}
                      </span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                      {skill.tag}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-on-surface leading-tight">
                    {skill.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    {skill.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-8 sm:mt-12 max-w-2xl mx-auto bg-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-primary/30 shadow-[0_0_40px_rgba(245,158,11,0.1)] text-center">
            <p className="text-sm sm:text-base text-on-surface-variant">
              <span className="text-on-surface font-bold">499K không phải để mua một buổi Zoom.</span>{" "}
              499K là để mua bộ công cụ giúp bạn bắt đầu dùng AI vào công việc thật —
              rút ngắn nhiều tháng tự mò.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
