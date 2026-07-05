import { redirect } from "next/navigation";
import { ORDER_ID_REGEX } from "@/lib/orders";
import { getOrderById } from "@/lib/leads-supabase";
import PaymentClient from "@/app/thanh-toan/payment-client";

export const metadata = {
  title: "Thanh toán vé | AI AGENT SUMMIT",
  description: "Quét mã QR để hoàn tất thanh toán vé AI AGENT SUMMIT.",
};

export const dynamic = "force-dynamic";

const SEPAY_ACCOUNT = process.env.SEPAY_ACCOUNT ?? "1057926688";
const SEPAY_BANK = process.env.SEPAY_BANK ?? "Vietcombank";

type PageProps = {
  searchParams: Promise<{ order?: string }>;
};

function buildQrUrl(orderId: string, amount: number): string {
  const params = new URLSearchParams({
    acc: SEPAY_ACCOUNT,
    bank: SEPAY_BANK,
    amount: String(amount),
    des: orderId,
  });
  return `https://qr.sepay.vn/img?${params.toString()}`;
}

export default async function ThanhToanSummitPage({ searchParams }: PageProps) {
  const { order: orderId } = await searchParams;

  if (!orderId || !ORDER_ID_REGEX.test(orderId)) {
    redirect("/ai-agent-summit");
  }

  const order = await getOrderById(orderId);
  if (!order) {
    redirect("/ai-agent-summit");
  }
  // Đơn không phải vé Summit → trả về trang thanh toán gốc của chương trình đó.
  if (!order.ticket.startsWith("AI AGENT SUMMIT")) {
    redirect(`/thanh-toan?order=${encodeURIComponent(order.orderId)}`);
  }
  if (order.status === "paid") {
    redirect(`/cam-on?order=${encodeURIComponent(order.orderId)}`);
  }

  // Số tiền lấy trực tiếp từ đơn (đã set theo đúng hạng vé user chọn ở
  // /api/register qua getPlanPrice) — QR + số tiền hiển thị luôn khớp lựa chọn.
  const qrUrl = buildQrUrl(order.orderId, order.amount);

  return (
    <PaymentClient
      orderId={order.orderId}
      amount={order.amount}
      ticket={order.ticket}
      qrUrl={qrUrl}
      account={SEPAY_ACCOUNT}
      bank={SEPAY_BANK}
      eventNote="AI AGENT SUMMIT · Thứ Tư 03/06/2026 · Quận 2, TP. Hồ Chí Minh"
    />
  );
}
