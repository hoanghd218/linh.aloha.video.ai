"use client";

import ScrollReveal from "../ScrollReveal";

const forWho = [
  "Chủ doanh nghiệp muốn tái cấu trúc mô hình vận hành bằng AI",
  "Người kinh doanh muốn xây hệ thống bán hàng và marketing tinh gọn hơn",
  "Chuyên gia, coach, nhà đào tạo muốn xây thương hiệu cá nhân và hệ sinh thái nội dung bằng AI",
  "Người làm Affiliate, TikTok, KDP, POD muốn xây content engine và hệ thống tăng trưởng bằng AI Agent",
  "Người muốn bước vào một cộng đồng tinh hoa — có định hướng, có hệ thống, có người đồng hành",
];

const deliverables = [
  { icon: "hub", text: "Xây hệ điều hành AIOS cho doanh nghiệp" },
  { icon: "campaign", text: "Xây hệ thống marketing / bán hàng bằng AI Agent" },
  { icon: "trending_up", text: "Xây kênh tăng trưởng đa kênh" },
  { icon: "content_copy", text: "Xây content engine nhân bản nội dung" },
  { icon: "account_tree", text: "Xây workflow vận hành tinh gọn" },
  { icon: "groups", text: "Xây đội ngũ Agent hỗ trợ các phòng ban" },
  { icon: "diversity_3", text: "Kết nối cộng đồng doanh nhân tinh hoa" },
  { icon: "swap_horiz", text: "Nhận chuyển giao các hệ thống Agent thực tế" },
];

export default function GlobalEliteClubSummit() {
  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-linear-to-b from-surface to-secondary-container/25 relative overflow-hidden"
      id="global-elite-club"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-[28rem] h-72 sm:h-[28rem] bg-primary-container/15 rounded-full blur-[140px]" />
      <div className="hidden sm:block absolute bottom-24 right-12 w-40 h-40 border border-primary/10 -rotate-12 animate-spin-slow pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/15 border border-primary/40 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest animate-bounce-subtle">
              <span className="material-symbols-outlined text-base sm:text-lg">
                workspace_premium
              </span>
              BƯỚC TIẾP THEO SAU SUMMIT
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
              GLOBAL ELITE CLUB —{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Đồng Hành Xây AIOS Trong 1 Năm
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Chương trình đồng hành cao cấp giúp anh chị xây hệ điều hành AIOS và hệ
              thống AI Agent cho doanh nghiệp trong{" "}
              <span className="text-on-surface font-bold">1 năm</span>. Không phải
              khoá học AI thông thường — đây là nơi để anh chị thật sự triển khai.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Who it's for */}
          <ScrollReveal direction="left">
            <div className="h-full bg-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-primary/20">
              <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                  group
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-on-surface">
                  Global Elite Club dành cho
                </h3>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                {forWho.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm sm:text-base text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0 mt-0.5">
                      arrow_forward
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* What you build */}
          <ScrollReveal direction="right">
            <div className="h-full bg-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-primary/20">
              <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">
                  construction
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-on-surface">
                  Anh chị sẽ từng bước xây
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {deliverables.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2.5 bg-surface rounded-xl p-3 border border-primary/15"
                  >
                    <span className="material-symbols-outlined text-primary text-lg sm:text-xl shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-on-surface leading-snug">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Two-group contrast */}
        <ScrollReveal delay={150}>
          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-surface-container-high rounded-2xl p-5 sm:p-7 border border-red-500/25">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-red-400 text-xl sm:text-2xl">
                  history_toggle_off
                </span>
                <h4 className="text-base sm:text-lg font-black text-on-surface">
                  Nhóm vận hành theo cách cũ
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Nhiều việc thủ công, phụ thuộc con người, nhiều chi phí, nhiều điểm
                nghẽn và giới hạn tăng trưởng.
              </p>
            </div>
            <div className="bg-linear-to-br from-primary/15 to-primary-container/5 rounded-2xl p-5 sm:p-7 border-2 border-primary/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">
                  bolt
                </span>
                <h4 className="text-base sm:text-lg font-black text-on-surface">
                  Nhóm xây hệ thống AI Agent
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                Tinh gọn hơn, nhanh hơn, thông minh hơn, có hệ thống hơn, mở rộng
                được — vận hành bằng đội ngũ Agent 24/7.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <p className="text-center text-base sm:text-lg font-bold text-on-surface mt-8 sm:mt-10 max-w-2xl mx-auto italic border-l-2 border-primary/40 pl-4 text-left">
            AI AGENT SUMMIT là nơi anh chị nhìn thấy tương lai. Global Elite Club là
            nơi anh chị bắt đầu xây tương lai đó.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
