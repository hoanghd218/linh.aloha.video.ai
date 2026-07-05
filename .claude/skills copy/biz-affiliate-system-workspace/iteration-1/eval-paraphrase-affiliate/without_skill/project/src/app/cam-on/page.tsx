import Link from "next/link";
import { ORDER_ID_REGEX, type Order } from "@/lib/orders";
import { getOrderById } from "@/lib/leads-supabase";
import PaidVerifyGate from "./paid-verify-gate";

const FREE_ZALO_LINK = "https://zalo.me/g/kxvavk323";

export const metadata = {
  title: "Cảm ơn bạn đã đăng ký | Agent Camp & Freedom Builder",
  description:
    "Đăng ký thành công. Bước tiếp theo: thanh toán giữ chỗ + vào nhóm Zalo nhận tài liệu trước Camp.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ order?: string }>;
};

async function fetchOrder(orderId: string | undefined): Promise<Order | null> {
  if (!orderId || !ORDER_ID_REGEX.test(orderId)) return null;
  return await getOrderById(orderId);
}

function isAgentCampTicket(ticket: string | undefined): boolean {
  return !!ticket && /agent\s*camp/i.test(ticket);
}

function isSummitTicket(ticket: string | undefined): boolean {
  return !!ticket && ticket.trim().toUpperCase().startsWith("AI AGENT SUMMIT");
}

export default async function ThankYouPage({ searchParams }: PageProps) {
  const { order } = await searchParams;
  const orderData = await fetchOrder(order);
  const paid = orderData?.status === "paid";
  const isCamp = isAgentCampTicket(orderData?.ticket);
  const isSummit = isSummitTicket(orderData?.ticket);

  let zaloLabel: string;
  let subtitle: string;
  let cardCopy: string;

  if (isSummit && paid) {
    zaloLabel = "Vào nhóm Zalo riêng — AI AGENT SUMMIT";
    subtitle =
      "Cảm ơn anh/chị đã thanh toán vé AI AGENT SUMMIT. Xác minh SĐT + email để mở link nhóm Zalo riêng theo đúng hạng vé — nơi em gửi địa điểm chi tiết, agenda và tài liệu chuẩn bị trước sự kiện 03/06/2026.";
    cardCopy =
      "Mọi thông tin sự kiện — địa điểm, agenda, nhắc lịch và tài liệu — đều gửi trong nhóm Zalo riêng theo hạng vé. Bỏ lỡ là không nắm được lịch.";
  } else if (isSummit) {
    zaloLabel = "Bước tiếp theo: thanh toán vé";
    subtitle =
      "Cảm ơn anh/chị đã đăng ký AI AGENT SUMMIT. Trang thanh toán đang hiển thị mã VietQR — chuyển khoản trong 24h để giữ vé. Sau khi thanh toán, anh/chị quay lại đây để mở link nhóm Zalo riêng.";
    cardCopy =
      "Sau khi thanh toán thành công, anh/chị quay lại trang này để nhận link nhóm Zalo riêng của AI AGENT SUMMIT theo đúng hạng vé.";
  } else if (isCamp && paid) {
    zaloLabel = "Vào nhóm Zalo riêng — Agent Camp Đà Lạt";
    subtitle =
      "Cảm ơn anh/chị đã thanh toán Agent Camp. Xác minh SĐT + email để mở link nhóm Zalo riêng — nơi em gửi pre-work, lộ trình chuẩn bị 3 ngày và tài liệu trước Camp 29–31/05/2026.";
    cardCopy =
      "Tất cả pre-work, lộ trình 3 ngày Đà Lạt, tài liệu Camp và thông báo sẽ được gửi trong nhóm Zalo riêng. Bỏ lỡ là không có lộ trình chuẩn bị.";
  } else if (isCamp) {
    zaloLabel = "Bước tiếp theo: thanh toán giữ chỗ";
    subtitle =
      "Cảm ơn anh/chị đã đăng ký Agent Camp. Trang thanh toán đang hiển thị mã VietQR — chuyển khoản trong 24h để giữ ghế. Sau khi thanh toán, em sẽ mở link nhóm Zalo riêng cho anh/chị.";
    cardCopy =
      "Sau khi thanh toán thành công, anh/chị quay lại đây để nhận link nhóm Zalo Camp + lộ trình chuẩn bị 3 ngày Đà Lạt.";
  } else if (paid) {
    zaloLabel = "Vào nhóm Zalo riêng — Gói 499K";
    subtitle =
      "Cảm ơn bạn đã thanh toán. Xác minh SĐT + email để mở link nhóm Zalo riêng dành cho học viên gói 499K — nơi gửi link Zoom, tài liệu và 9 bộ AI Agent quà tặng.";
    cardCopy =
      "Tất cả tài liệu, link Zoom buổi học và thông báo sẽ được gửi trong nhóm Zalo. Bỏ lỡ là không có link Zoom.";
  } else {
    zaloLabel = "Bước cuối: vào nhóm Zalo";
    subtitle =
      "Cảm ơn bạn đã đăng ký. Vào nhóm Zalo ngay để nhận link Zoom và tài liệu trước buổi học.";
    cardCopy =
      "Tất cả tài liệu, link Zoom buổi học và thông báo sẽ được gửi trong nhóm Zalo. Bỏ lỡ là không có link Zoom.";
  }

  return (
    <main className="min-h-screen bg-surface text-on-surface px-4 sm:px-6 py-12 sm:py-20 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="relative bg-surface-container-high rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 border border-primary/30 overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.08)]">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary-container/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 space-y-6 sm:space-y-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 border border-green-500/40 mx-auto">
              <span className="material-symbols-outlined text-green-400 text-4xl sm:text-5xl">
                check_circle
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
                {paid ? "Thanh toán thành công!" : "Đăng ký thành công!"}
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto">
                {subtitle}
              </p>
            </div>

            <div className="bg-surface rounded-xl sm:rounded-2xl p-5 sm:p-7 border border-primary/20 space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">forum</span>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                  {zaloLabel}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                {cardCopy}
              </p>
              {paid && order ? (
                <PaidVerifyGate orderId={order} />
              ) : (
                <a
                  className="inline-flex items-center gap-2 sm:gap-3 bg-linear-to-br from-primary to-primary-container text-on-primary-container px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-black text-sm sm:text-base hover:scale-[1.03] active:scale-95 transition-all duration-300 animate-pulse-glow"
                  href={FREE_ZALO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VÀO NHÓM ZALO NGAY
                  <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
