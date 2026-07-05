import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AICompany from "@/components/AICompany";
import HeroOpenClaw from "@/components/openclaw-mastery/HeroOpenClaw";
import PainPointsOpenClaw from "@/components/openclaw-mastery/PainPointsOpenClaw";
import TransformationOpenClaw from "@/components/openclaw-mastery/TransformationOpenClaw";
import CourseContentOpenClaw from "@/components/openclaw-mastery/CourseContentOpenClaw";
import BonusesOpenClaw from "@/components/openclaw-mastery/BonusesOpenClaw";
import WhoForOpenClaw from "@/components/openclaw-mastery/WhoForOpenClaw";
import FreedomBuildersPro from "@/components/FreedomBuildersPro";
import SpeakerOpenClaw from "@/components/openclaw-mastery/SpeakerOpenClaw";
import PricingOpenClaw from "@/components/openclaw-mastery/PricingOpenClaw";
import FAQOpenClaw from "@/components/openclaw-mastery/FAQOpenClaw";

export const metadata: Metadata = {
  title:
    "OpenClaw AI Mastery — Exclusive trong Freedom Builders Pro | AI Agent Company",
  description:
    "Khoá học 5 buổi Zoom live cùng Tony Hoang — xây hệ OpenClaw cá nhân cho Research, Ideation, Content, Sách và Website. Chỉ mở cho thành viên Freedom Builders Pro.",
};

export default function OpenClawAIMasteryPage() {
  return (
    <>
      <Header />
      <main className="tech-grid min-h-screen pt-20">
        <HeroOpenClaw />
        <PainPointsOpenClaw />
        <TransformationOpenClaw />
        <CourseContentOpenClaw />
        <AICompany
          builtOn="OPENCLAW"
          builtOnSubtitle="Đây là hệ OpenClaw cá nhân bạn sẽ xây dựng sau khi hoàn thành khoá học — chạy 24/7 trên máy của bạn hoặc VPS, điều phối sub-agents như một team marketing thật."
        />
        <BonusesOpenClaw />
        <WhoForOpenClaw />
        <FreedomBuildersPro />
        <SpeakerOpenClaw />
        <PricingOpenClaw />
        <FAQOpenClaw />
      </main>
      <Footer />
    </>
  );
}
