import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AICompany from "@/components/AICompany";
import PromoBar from "@/components/mastery/PromoBar";
import HeroMastery from "@/components/mastery/HeroMastery";
import PainPointsMastery from "@/components/mastery/PainPointsMastery";
import TransformationMastery from "@/components/mastery/TransformationMastery";
import CourseContentMastery from "@/components/mastery/CourseContentMastery";
import WhoForMastery from "@/components/mastery/WhoForMastery";
import SpeakerMastery from "@/components/mastery/SpeakerMastery";
import TestimonialsMastery from "@/components/mastery/TestimonialsMastery";
import BonusesMastery from "@/components/mastery/BonusesMastery";
import GuaranteeMastery from "@/components/mastery/GuaranteeMastery";
import PricingMastery from "@/components/mastery/PricingMastery";
import FAQMastery from "@/components/mastery/FAQMastery";
import FinalCTAMastery from "@/components/mastery/FinalCTAMastery";

export const metadata: Metadata = {
  title: "Claude AI Mastery Cho Marketing & Kinh Doanh | 5 Buổi Live Cùng Tony Hoang",
  description:
    "Khoá học 5 buổi Zoom live cùng Tony Hoang — biến Claude AI thành đội ngũ marketing 24/7. Research, content, sách, website tự động. Không cần biết code. Cam kết hoàn tiền 100%.",
};

export default function ClaudeAIMasteryPage() {
  return (
    <>
      <PromoBar />
      <Header />
      <main className="tech-grid min-h-screen pt-28 sm:pt-32">
        {/* 1. HOOK — Strong hero with offer */}
        <HeroMastery />

        {/* 2. PROBLEM — Agitate pain points */}
        <PainPointsMastery />

        {/* 3. SOLUTION — Before/after transformation */}
        <TransformationMastery />

        {/* 4. VISION — What you'll build (AI Company section, kept on Claude AI) */}
        <AICompany
          builtOn="CLAUDE AI"
          builtOnSubtitle="Đây là hệ AI Agent cá nhân bạn sẽ xây dựng sau khi hoàn thành khoá học — tất cả chạy trên Claude AI, không cần biết code."
        />

        {/* 5. MECHANISM — Detailed course content (main focus) */}
        <CourseContentMastery />

        {/* 6. QUALIFY — Who this is for / not for */}
        <WhoForMastery />

        {/* 7. CREDIBILITY — Instructor */}
        <SpeakerMastery />

        {/* 8. SOCIAL PROOF — Testimonials */}
        <TestimonialsMastery />

        {/* 9. VALUE STACK — Bonuses */}
        <BonusesMastery />

        {/* 10. RISK REVERSAL — Guarantee */}
        <GuaranteeMastery />

        {/* 11. OFFER — Pricing */}
        <PricingMastery />

        {/* 12. OBJECTIONS — FAQ */}
        <FAQMastery />

        {/* 13. FINAL PUSH — CTA with urgency */}
        <FinalCTAMastery />
      </main>
      <Footer />
    </>
  );
}
