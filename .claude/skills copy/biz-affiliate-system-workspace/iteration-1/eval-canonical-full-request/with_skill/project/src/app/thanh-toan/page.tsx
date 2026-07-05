import { redirect } from "next/navigation";
import { ORDER_ID_REGEX } from "@/lib/orders";
import { getOrderById } from "@/lib/leads-supabase";
import PaymentClient from "./payment-client";

export const metadata = {
  title: "Thanh toán | Freedom Builder AI Agents",
  description: "Quét mã QR để hoàn tất thanh toán đơn đăng ký.",
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

export default async function ThanhToanPage({ searchParams }: PageProps) {
  const { order: orderId } = await searchParams;

  if (!orderId || !ORDER_ID_REGEX.test(orderId)) {
    redirect("/");
  }

  const order = await getOrderById(orderId);
  if (!order) {
    redirect("/");
  }
  // Đơn vé AI AGENT SUMMIT → trang thanh toán riêng của Summit.
  if (order.ticket.startsWith("AI AGENT SUMMIT")) {
    redirect(
      `/ai-agent-summit/thanh-toan?order=${encodeURIComponent(order.orderId)}`,
    );
  }
  if (order.status === "paid") {
    redirect(`/cam-on?order=${encodeURIComponent(order.orderId)}`);
  }

  const qrUrl = buildQrUrl(order.orderId, order.amount);

  return (
    <PaymentClient
      orderId={order.orderId}
      amount={order.amount}
      ticket={order.ticket}
      qrUrl={qrUrl}
      account={SEPAY_ACCOUNT}
      bank={SEPAY_BANK}
    />
  );
}
