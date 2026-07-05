import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AICompany from "@/components/AICompany";
import PromoBar from "@/components/mastery/PromoBar";
import SpeakerCodex from "@/components/codex-mastery/SpeakerCodex";
import TestimonialsCodex from "@/components/codex-mastery/TestimonialsCodex";
import HeroCodex from "@/components/codex-mastery/HeroCodex";
import PainPointsCodex from "@/components/codex-mastery/PainPointsCodex";
import TransformationCodex from "@/components/codex-mastery/TransformationCodex";
import CourseContentCodex from "@/components/codex-mastery/CourseContentCodex";
import WhoForCodex from "@/components/codex-mastery/WhoForCodex";
import BonusesCodex from "@/components/codex-mastery/BonusesCodex";
import GuaranteeCodex from "@/components/codex-mastery/GuaranteeCodex";
import PricingCodex from "@/components/codex-mastery/PricingCodex";
import FAQCodex from "@/components/codex-mastery/FAQCodex";
import FinalCTACodex from "@/components/codex-mastery/FinalCTACodex";

export const metadata: Metadata = {
  title: "ChatGPT Codex Mastery Cho Marketing & Năng Suất | 3 Buổi Live Cùng Tony Hoang",
  description:
    "Khoá học 3 buổi Zoom live cùng Tony Hoang — biến ChatGPT Codex thành hệ marketing & productivity 24/7. Content, SEO, email, báo cáo tự động. Không cần biết code. Cam kết hoàn tiền 100%.",
};

export default function ChatGPTCodexMasteryPage() {
  return (
    <>
      <PromoBar />
      <Header />
      <main className="tech-grid min-h-screen pt-28 sm:pt-32">
        {/* 1. HOOK — Strong hero with offer */}
        <HeroCodex />

        {/* 2. PROBLEM — Agitate pain points */}
        <PainPointsCodex />

        {/* 3. SOLUTION — Before/after transformation */}
        <TransformationCodex />

        {/* 4. VISION — What you'll build */}
        <AICompany
          builtOn="CHATGPT CODEX"
          builtOnSubtitle="Đây là hệ AI Agent cá nhân bạn sẽ xây dựng sau khi hoàn thành khoá học — tất cả chạy trên ChatGPT Codex, không cần biết code."
        />

        {/* 5. MECHANISM — Detailed course content */}
        <CourseContentCodex />

        {/* 6. QUALIFY — Who this is for / not for */}
        <WhoForCodex />

        {/* 7. CREDIBILITY — Instructor */}
        <SpeakerCodex />

        {/* 8. SOCIAL PROOF — Testimonials */}
        <TestimonialsCodex />

        {/* 9. VALUE STACK — Bonuses */}
        <BonusesCodex />

        {/* 10. RISK REVERSAL — Guarantee */}
        <GuaranteeCodex />

        {/* 11. OFFER — Pricing */}
        <PricingCodex />

        {/* 13. OBJECTIONS — FAQ */}
        <FAQCodex />

        {/* 14. FINAL PUSH — CTA with urgency */}
        <FinalCTACodex />
      </main>
      <Footer />
    </>
  );
}
