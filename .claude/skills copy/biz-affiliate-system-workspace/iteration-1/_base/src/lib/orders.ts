export type OrderStatus = "pending" | "paid" | "expired";

export type Order = {
  orderId: string;
  phone: string;
  name: string;
  email: string;
  ticket: string;
  amount: number;
  status: OrderStatus;
  createdAt: number;
  paidAt?: number;
};

export const ORDER_ID_REGEX = /^DH\d{6}$/;

export function generateOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `DH${n}`;
}

export function extractOrderId(text: string): string | null {
  const match = text.match(/DH\d{6}/);
  return match ? match[0] : null;
}
