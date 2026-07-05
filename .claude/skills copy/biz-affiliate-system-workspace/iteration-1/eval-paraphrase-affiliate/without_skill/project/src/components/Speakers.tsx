"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const speakers = [
  {
    name: "Mr. Tony Hoang",
    title: "CEO BimSpeed · AIOS Architect",
    bio: "Chuyên gia hệ thống AI Agent & tự động hoá doanh nghiệp. Người dẫn dắt tư duy xây hệ điều hành AIOS cho SME — biến đội nhóm nhỏ vận hành như tổ chức lớn.",
    image: "/images/hoang-real.jpg",
    stats: [
      { value: "5+", label: "Năm AI thực chiến" },
    ],
  },
  {
    name: "Mr. Tony Trieu",
    title: "Founder & CEO Kaching Capital",
    bio: "Nhà sáng lập các dự án AI quy mô lớn. Chuyên gia chiến lược AI cho Amazon KDP, POD, AI Affiliate và mô hình kinh doanh quốc tế bằng AI Agent.",
    image: "/images/tony-real.jpg",
    stats: [
      { value: "100M+", label: "Doanh thu AI" },
    ],
  },
  {
    name: "Ms. Thuy AI",
    title: "Chuyên gia AI Agent · Mentor AIOS",
    bio: "Người đồng hành cùng học viên trong hành trình ứng dụng AI Agent vào doanh nghiệp — từ tư duy đến triển khai, từ chiến lược đến kết quả.",
    image: "/images/thuy-ai.jpg",
    stats: [
      { value: "AIOS", label: "Mentor" },
    ],
  },
  {
    name: "Thầy Trương Cảnh Thắng",
    title: "Chuyên gia AI Affiliate Marketing & AI Content",
    bio: "Trực tiếp tạo ra thu nhập thực tế trong lĩnh vực Affiliate Marketing, AI Content và hệ thống nội dung bán hàng bằng AI. Đã đào tạo hàng trăm học viên từ con số 0 đến có kết quả thực tế.",
    image: "/images/speakers/Thang Tim Cach.jpg",
    stats: [
      { value: "100+", label: "Học viên có KQ" },
    ],
  },
];

export default function Speakers() {
  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest" id="speakers">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">school</span>
              MENTOR TRỰC TIẾP DẪN DẮT
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight">
              Đội Ngũ Huấn Luyện
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-3 sm:mt-4 max-w-2xl mx-auto">
              4 mentor có hệ thống AIOS thực chiến — không phải lý thuyết, không phải case study sao chép.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {speakers.map((speaker, index) => (
            <ScrollReveal key={speaker.name} delay={index * 200} direction={index === 0 ? "left" : "right"}>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                <div className="shrink-0 w-48 h-60 sm:w-64 sm:h-80 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary shadow-xl">
                  <Image
                    className="w-full h-full object-cover"
                    src={speaker.image}
                    alt={speaker.name}
                    width={256}
                    height={320}
                  />
                </div>
                <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-black">{speaker.name}</h3>
                  {speaker.title && (
                    <p className="text-sm sm:text-base text-primary font-semibold -mt-1">{speaker.title}</p>
                  )}
                  <p className="text-sm sm:text-base text-on-surface-variant italic">{speaker.bio}</p>
                  {/* <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                    {speaker.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center bg-surface p-2.5 sm:p-3 rounded-xl border border-primary/10"
                      >
                        <div className="text-primary font-black text-lg sm:text-xl">
                          {stat.value}
                        </div>
                        <div className="text-[9px] sm:text-[10px] uppercase font-bold">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
