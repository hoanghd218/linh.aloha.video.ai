"use client";

import Image from "next/image";
import ScrollReveal from "../ScrollReveal";

interface Mentor {
  name: string;
  role: string;
  image?: string;
  bio: string;
  focus: string;
  highlights: string[];
  initials: string;
  color: string;
}

const mentors: Mentor[] = [
  {
    name: "Hoang Tran",
    role: "CEO BimSpeed Solution · Chuyên gia hệ thống AI Agent & Tự động hóa doanh nghiệp",
    image: "/images/hoang-real.jpg",
    bio: "Hơn 5 năm thực chiến trong lĩnh vực AI. Tập trung giúp cá nhân kinh doanh, đội nhóm và doanh nghiệp hiểu cách ứng dụng AI để xây hệ thống làm việc thông minh hơn — không chỉ làm nhanh hơn.",
    focus:
      "Bóc tách quy trình kinh doanh phức tạp thành các bước rõ ràng, sau đó ứng dụng AI Agent và automation để tối ưu các đầu việc.",
    highlights: [
      "Hiểu AI Agent ở góc nhìn doanh nghiệp — không màu mè, không demo công cụ",
      "Tập trung vào cách biến công việc thật thành quy trình AI có thể lặp lại",
    ],
    initials: "HT",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Tony Trieu",
    role: "Founder & CEO Kaching Capital · Nhà sáng lập AI Builders · Chuyên gia KDP & Marketing Automation",
    image: "/images/tony-real.jpg",
    bio: "Xây dựng các dự án AI quy mô lớn trong các mảng: KDP, hệ thống nội dung, digital product, Marketing Automation, workflow tạo tài sản số.",
    focus:
      "Biến AI từ một công cụ đơn lẻ thành hệ thống tạo tài sản số và hệ thống marketing có thể nhân rộng.",
    highlights: [
      "Tư duy hệ thống khi ứng dụng AI vào kinh doanh",
      "Cách kết hợp AI với marketing automation và workflow tiết kiệm thời gian",
    ],
    initials: "TT",
    color: "from-primary to-primary-container",
  },
  {
    name: "Trương Cảnh Thắng",
    role: "Chuyên gia AI Affiliate Marketing & AI Content",
    image: "/images/speakers/Thang%20Tim%20Cach.jpg",
    bio: "Trực tiếp tạo ra thu nhập thực tế trong lĩnh vực Affiliate Marketing, AI Content và hệ thống nội dung bán hàng bằng AI. Đã đào tạo hàng trăm học viên từ con số 0 đến có kết quả thực tế.",
    focus:
      "Kết hợp AI + Content + Affiliate + hệ thống triển khai thực tế — biến nội dung thành click, link, đơn hàng và dòng thu nhập bền vững.",
    highlights: [
      "Quy trình từ ý tưởng → kênh → content → tracking → đơn hàng",
      "Đào tạo người không có nền tảng marketing/edit video vẫn ra kết quả",
    ],
    initials: "TC",
    color: "from-emerald-500 to-green-600",
  },
];

export default function SpeakersZoom() {
  return (
    <section
      className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest"
      id="speakers"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base sm:text-lg">
                verified_user
              </span>
              MENTOR ĐỒNG HÀNH CÙNG BẠN
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
              3 Mentor — 3 Góc Nhìn Thực Chiến
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mt-3 sm:mt-4 max-w-2xl mx-auto">
              Từ hệ thống AI Agent doanh nghiệp → marketing automation → affiliate &
              content. Đủ góc nhìn để bạn không bị một chiều.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {mentors.map((m, index) => (
            <ScrollReveal key={m.name} delay={index * 120}>
              <div className="bg-surface-container-high rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-primary/20 shadow-[0_0_40px_rgba(245,158,11,0.06)] h-full flex flex-col">
                <div className="relative w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-primary mb-5">
                  {m.image ? (
                    <Image
                      className="w-full h-full object-cover"
                      src={m.image}
                      alt={m.name}
                      width={400}
                      height={500}
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${m.color} flex items-center justify-center`}
                    >
                      <span className="text-7xl font-black text-white/90">
                        {m.initials}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white font-bold uppercase">
                      Mentor live
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-on-surface">
                      {m.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-primary font-bold mt-1 leading-snug">
                      {m.role}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {m.bio}
                  </p>

                  <div className="bg-surface rounded-xl p-3 border border-primary/15">
                    <div className="text-[10px] text-primary font-black uppercase tracking-wider mb-1">
                      Thế mạnh
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface">{m.focus}</p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {m.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex gap-2 text-xs sm:text-sm text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
