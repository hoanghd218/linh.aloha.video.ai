import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import RegisterFormSection from "@/components/RegisterFormSection";
import Footer from "@/components/Footer";
import PromoBarZoom from "@/components/claude-2days-zoom/PromoBarZoom";
import HeroZoom from "@/components/claude-2days-zoom/HeroZoom";
import PainPointsZoom from "@/components/claude-2days-zoom/PainPointsZoom";
import TransformationZoom from "@/components/claude-2days-zoom/TransformationZoom";
import CourseContentZoom from "@/components/claude-2days-zoom/CourseContentZoom";
import WhoForZoom from "@/components/claude-2days-zoom/WhoForZoom";
import SpeakersZoom from "@/components/claude-2days-zoom/SpeakersZoom";
import AICompanyZoom from "@/components/claude-2days-zoom/AICompanyZoom";
import SkillsZoom from "@/components/claude-2days-zoom/SkillsZoom";
import PricingZoom from "@/components/claude-2days-zoom/PricingZoom";
import FAQZoom from "@/components/claude-2days-zoom/FAQZoom";
import FinalCTAZoom from "@/components/claude-2days-zoom/FinalCTAZoom";

export const metadata: Metadata = {
  title:
    "2 Buổi Zoom: Xây AI Agent Đầu Tiên Cho Doanh Nghiệp Của Bạn | 2026",
  description:
    "2 buổi Zoom chuyển giao quy trình xây AI Agent cho người kinh doanh. Vé miễn phí 0đ · Vé trả phí 499K kèm 9 bộ Skill AI Agent lắp vào dùng ngay. Không cần biết code.",
};

const ZOOM_SESSIONS = [
  {
    time: new Date("2026-05-08T20:00:00+07:00").getTime(),
    label: "Buổi 1 — Thứ 6, 08/05 lúc 20h",
  },
  {
    time: new Date("2026-05-09T20:00:00+07:00").getTime(),
    label: "Buổi 2 — Thứ 7, 09/05 lúc 20h",
  },
];

export default function Claude2DaysZoomPage() {
  return (
    <>
      <Script id="ms-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wm8p9y7gkt");
        `}
      </Script>
      <PromoBarZoom />
      <Header />
      <main className="tech-grid min-h-screen pt-10 sm:pt-24">
        {/* 1. HOOK */}
        <HeroZoom />

        {/* 2. PROBLEM */}
        <PainPointsZoom />

        {/* 3. SOLUTION — Before/after */}
        <TransformationZoom />

        {/* 4. VISION — AI Company org chart */}
        <AICompanyZoom />

        {/* 5. MECHANISM — 2 Zoom sessions */}
        <CourseContentZoom />

        {/* 6. QUALIFY — Who for / not for */}
        <WhoForZoom />

        {/* 6. CREDIBILITY — 3 mentors */}
        <SpeakersZoom />

        {/* 7. VALUE STACK — 9 paid Skills */}
        <SkillsZoom />

        {/* 8. OFFER — Two-tier pricing */}
        <PricingZoom />

        <RegisterFormSection
          sessions={ZOOM_SESSIONS}
          totalSlots={200}
          registered={147}
          slotLabel="slot vé trả phí"
          formTitle="Đăng ký 2 buổi Zoom"
          formSubtitle="Điền thông tin để nhận link Zoom + nhóm Zalo trước buổi học"
        />

        {/* 9. OBJECTIONS — FAQ */}
        <FAQZoom />

        {/* 10. FINAL PUSH */}
        <FinalCTAZoom />
      </main>
      <Footer />
    </>
  );
}
