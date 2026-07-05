import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AICompany from "@/components/AICompany";
import TransferNotCourse from "@/components/TransferNotCourse";
import RegisterFormSection from "@/components/RegisterFormSection";
import PainPoints from "@/components/PainPoints";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import ValueProps from "@/components/ValueProps";
import CourseContent from "@/components/CourseContent";
import SystemsShowcase from "@/components/SystemsShowcase";
import BeforeAfter from "@/components/BeforeAfter";
import Bonuses from "@/components/Bonuses";
import Speakers from "@/components/Speakers";
import Schedule from "@/components/Schedule";
import ValueStack from "@/components/ValueStack";
import Pricing from "@/components/Pricing";
// import FreedomPartnership from "@/components/FreedomPartnership";
import FAQ from "@/components/FAQ";
import Gallery from "@/components/Gallery";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import SocialProof from "@/components/SocialProof";

const CAMP_SESSIONS = [
  {
    time: new Date("2026-05-29T08:30:00+07:00").getTime(),
    label: "Agent Camp — Ba Vì — 29/05/2026",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <SocialProof />
      <main className="tech-grid min-h-screen pt-14 sm:pt-20">
        <Hero />
        <AICompany />
        <TransferNotCourse />
        <PainPoints />
        <WhoIsThisFor />
        <ValueProps />
        <CourseContent />
        <SystemsShowcase />
        <BeforeAfter />
        <Speakers />
        <Gallery />
        <Schedule />
        <ValueStack />
        <Bonuses />
        <Pricing />
        <RegisterFormSection
          sessions={CAMP_SESSIONS}
          totalSlots={60}
          registered={38}
          slotLabel="ghế"
          formTitle="Đăng ký giữ chỗ Agent Camp"
          formSubtitle="Điền thông tin để giữ chỗ + nhận hướng dẫn đặt cọc và tài liệu chuẩn bị trước camp"
        />
        {/* <FreedomPartnership /> */}
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
