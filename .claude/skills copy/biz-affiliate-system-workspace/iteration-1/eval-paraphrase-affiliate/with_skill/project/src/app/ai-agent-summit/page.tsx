import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterFormSection from "@/components/RegisterFormSection";
import Speakers from "@/components/Speakers";
import HeroSummit from "@/components/ai-agent-summit/HeroSummit";
import PositioningSummit from "@/components/ai-agent-summit/PositioningSummit";
import InsightsSummit from "@/components/ai-agent-summit/InsightsSummit";
import BigIdeaSummit from "@/components/ai-agent-summit/BigIdeaSummit";
import WhoForSummit from "@/components/ai-agent-summit/WhoForSummit";
import CurriculumSummit from "@/components/ai-agent-summit/CurriculumSummit";
import ShowcaseSummit from "@/components/ai-agent-summit/ShowcaseSummit";
import OutcomesSummit from "@/components/ai-agent-summit/OutcomesSummit";
import GlobalEliteClubSummit from "@/components/ai-agent-summit/GlobalEliteClubSummit";
import AgendaSummit from "@/components/ai-agent-summit/AgendaSummit";
import PricingSummit from "@/components/ai-agent-summit/PricingSummit";
import FAQSummit from "@/components/ai-agent-summit/FAQSummit";
import FinalCTASummit from "@/components/ai-agent-summit/FinalCTASummit";

export const metadata: Metadata = {
  title:
    "AI AGENT SUMMIT — Một Ngày Tái Cấu Trúc Doanh Nghiệp Bằng AI Agent | Tony Hoang",
  description:
    "Sự kiện offline ~200 người cùng Tony Hoang — hiểu bức tranh AI Agent, xem showcase hệ thống thật, và xây bản đồ AIOS sơ bộ cho doanh nghiệp của bạn trong một ngày. 08:00–18:00.",
};

// AI AGENT SUMMIT — Thứ Tư 03/06/2026, 08:00–18:00, Quận 2, TP. Hồ Chí Minh.
// `time` drives the countdown clock in <RegisterFormSection>.
const SUMMIT_SESSIONS = [
  {
    time: new Date("2026-06-03T08:00:00+07:00").getTime(),
    label: "AI AGENT SUMMIT — Thứ Tư, 03/06/2026 · Quận 2, TP.HCM",
  },
];

// AI AGENT SUMMIT — 3-tier ticket. `value` must match a key in lib/plans.ts so
// the checkout flow (api/register → /thanh-toan) picks up the right amount.
const SUMMIT_TICKETS = [
  {
    value: "AI AGENT SUMMIT — Vé Thường",
    label: "Vé Thường — 499.000đ (full tài liệu + vé tham dự trực tiếp)",
  },
  {
    value: "AI AGENT SUMMIT — Vé VIP",
    label:
      "Vé VIP — 999.000đ (tặng khoá Agent/Claude Code trị giá 8 triệu + 2 vé tặng kèm)",
  },
  {
    value: "AI AGENT SUMMIT — Vé Super VIP",
    label:
      "Vé Super VIP — 1.999.000đ (ăn tối + tư vấn 1:1 với diễn giả + 3 vé tặng kèm)",
  },
];

export default function AIAgentSummitPage() {
  return (
    <>
      <Header />
      <main className="tech-grid min-h-screen pt-20 sm:pt-24">
        {/* 1. HOOK — Hero with event info */}
        <HeroSummit />

        {/* 2. AWARENESS — What AI AGENT SUMMIT is */}
        <PositioningSummit />

        {/* 3. GAP — 5 insights agitating the pain */}
        <InsightsSummit />

        {/* 4. BIG IDEA — The core thesis */}
        <BigIdeaSummit />

        {/* 5. QUALIFY — 5 audience groups */}
        <WhoForSummit />

        {/* 6. MECHANISM — 5-part curriculum */}
        <CurriculumSummit />

        {/* 7. WOW — Live showcase demos */}
        <ShowcaseSummit />

        {/* 8. CREDIBILITY — Speakers (shared with the homepage) */}
        <Speakers />

        {/* 9. OUTCOME — What attendees leave with */}
        <OutcomesSummit />

        {/* 10. NEED + OFFER — Global Elite Club upsell */}
        <GlobalEliteClubSummit />

        {/* 11. LOGISTICS — Agenda timeline */}
        <AgendaSummit />

        {/* 12. OFFER — Ticket pricing (3-tier) */}
        <PricingSummit />

        {/* 13. CONVERSION — Lead capture form */}
        <RegisterFormSection
          sessions={SUMMIT_SESSIONS}
          totalSlots={200}
          registered={156}
          slotLabel="vé"
          countdownLabel="ĐẾM NGƯỢC ĐẾN AI AGENT SUMMIT"
          ticketOptions={SUMMIT_TICKETS}
          ticketFieldLabel="Chọn hạng vé *"
          paidCheckoutPath="/ai-agent-summit/thanh-toan"
          slotNote="Sự kiện giới hạn 200 vé — ưu tiên anh chị đăng ký sớm để chọn được hạng vé mong muốn."
          submitLabel="ĐĂNG KÝ VÉ NGAY"
          footerNote="Sau khi đăng ký, anh chị sẽ nhận hướng dẫn thanh toán vé qua VietQR + thông tin chi tiết ngày tổ chức & địa điểm."
          formTitle="Đăng ký vé AI AGENT SUMMIT"
          formSubtitle="Điền thông tin để giữ chỗ — anh chị sẽ nhận hướng dẫn thanh toán vé và thông tin chi tiết về ngày tổ chức, địa điểm"
        />

        {/* 14. OBJECTIONS — FAQ */}
        <FAQSummit />

        {/* 15. FINAL PUSH — Closing CTA */}
        <FinalCTASummit />
      </main>
      <Footer />
    </>
  );
}
