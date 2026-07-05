import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AICompany from "@/components/AICompany";
import PromoBar from "@/components/mastery/PromoBar";
import SpeakerMastery from "@/components/mastery/SpeakerMastery";
import TestimonialsMastery from "@/components/mastery/TestimonialsMastery";
import HeroVibeCoding from "@/components/vibe-coding-mastery/HeroVibeCoding";
import PainPointsVibeCoding from "@/components/vibe-coding-mastery/PainPointsVibeCoding";
import TransformationVibeCoding from "@/components/vibe-coding-mastery/TransformationVibeCoding";
import CourseContentVibeCoding from "@/components/vibe-coding-mastery/CourseContentVibeCoding";
import WhoForVibeCoding from "@/components/vibe-coding-mastery/WhoForVibeCoding";
import BonusesVibeCoding from "@/components/vibe-coding-mastery/BonusesVibeCoding";
import GuaranteeVibeCoding from "@/components/vibe-coding-mastery/GuaranteeVibeCoding";
import PricingVibeCoding from "@/components/vibe-coding-mastery/PricingVibeCoding";
import FAQVibeCoding from "@/components/vibe-coding-mastery/FAQVibeCoding";
import FinalCTAVibeCoding from "@/components/vibe-coding-mastery/FinalCTAVibeCoding";

export const metadata: Metadata = {
  title: "Vibe Coding Mastery — Build App & Website Bán Hàng Bằng AI | 5 Buổi Live Cùng Tony Hoang",
  description:
    "Khoá học 5 buổi Zoom live cùng Tony Hoang — dùng Claude Code, ChatGPT Codex & Antigravity để xây app, website cá nhân, website bán hàng chuyển đổi cao, tích hợp thanh toán, quản lý khoá học. Không cần biết code. Cam kết hoàn tiền 100%.",
};

export default function VibeCodingMasteryPage() {
  return (
    <>
      <PromoBar />
      <Header />
      <main className="tech-grid min-h-screen pt-28 sm:pt-32">
        {/* 1. HOOK */}
        <HeroVibeCoding />

        {/* 2. PROBLEM */}
        <PainPointsVibeCoding />

        {/* 3. SOLUTION */}
        <TransformationVibeCoding />

        {/* 4. VISION */}
        <AICompany
          builtOn="VIBE CODING"
          builtOnSubtitle="Đây là những sản phẩm số bạn sẽ build sau khi hoàn thành khoá học — websites, apps, platform bán khoá học — tất cả dùng Claude Code, ChatGPT Codex & Antigravity, không cần biết code."
        />

        {/* 5. MECHANISM */}
        <CourseContentVibeCoding />

        {/* 6. QUALIFY */}
        <WhoForVibeCoding />

        {/* 7. CREDIBILITY */}
        <SpeakerMastery />

        {/* 8. SOCIAL PROOF */}
        <TestimonialsMastery />

        {/* 9. VALUE STACK */}
        <BonusesVibeCoding />

        {/* 10. RISK REVERSAL */}
        <GuaranteeVibeCoding />

        {/* 11. OFFER */}
        <PricingVibeCoding />

        {/* 13. OBJECTIONS */}
        <FAQVibeCoding />

        {/* 14. FINAL PUSH */}
        <FinalCTAVibeCoding />
      </main>
      <Footer />
    </>
  );
}
