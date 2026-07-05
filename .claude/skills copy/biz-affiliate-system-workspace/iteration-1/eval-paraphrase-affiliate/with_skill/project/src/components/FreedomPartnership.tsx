"use client";

import ScrollReveal from "./ScrollReveal";

const partnerTypes = [
  { icon: "engineering", label: "Đối tác triển khai" },
  { icon: "school", label: "Đối tác đào tạo" },
  { icon: "storefront", label: "Đối tác phân phối" },
  { icon: "memory", label: "Đối tác công nghệ" },
  { icon: "public", label: "Đối tác thị trường" },
  { icon: "diversity_2", label: "Đối tác cộng đồng" },
  { icon: "hub", label: "Đối tác phát triển AIOS" },
];

export default function FreedomPartnership() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden" id="partnership">
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">diversity_3</span>
              CƠ HỘI ĐẶC BIỆT
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
              Kết Nối{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                Freedom Partnership
              </span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto">
              Agent Camp không chỉ tìm học viên — chúng tôi tìm những người có thể trở thành đối tác cùng phát triển hệ sinh thái Freedom Builders.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200} direction="scale">
          <div className="bg-linear-to-br from-surface-container-high to-surface p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-primary/25 shadow-[0_0_40px_rgba(245,158,11,0.08)]">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {partnerTypes.map((partner, index) => (
                <div
                  key={partner.label}
                  className="group flex flex-col items-center text-center bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-primary/15 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-linear-to-br from-primary to-primary-container flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-on-primary-container text-base sm:text-lg">
                      {partner.icon}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-on-surface leading-tight">
                    {partner.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/15 pt-5 sm:pt-7 text-center max-w-3xl mx-auto">
              <p className="text-sm sm:text-base text-on-surface-variant mb-4 sm:mb-5">
                Nếu bạn có <span className="text-primary font-bold">năng lực</span>, có <span className="text-primary font-bold">thị trường</span>, có <span className="text-primary font-bold">cộng đồng</span>, có sản phẩm, có đội nhóm — hoặc có khát vọng đi sâu vào AI Agent — Agent Camp là nơi để chúng ta gặp nhau, hiểu nhau và tìm cơ hội hợp tác.
              </p>
              <a
                href="#register"
                className="inline-flex items-center gap-2 sm:gap-3 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-base hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-glow"
              >
                THAM GIA AGENT CAMP
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
