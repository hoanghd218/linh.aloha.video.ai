---
phase: 1
title: "Setup KV & env config"
status: pending
priority: P1
effort: "1h"
dependencies: []
---

# Phase 1: Setup Vercel KV & env config

## Overview
Cài đặt Vercel KV trên dashboard, thêm env vars cần thiết, tạo các module dùng chung (`plans`, `kv`, `orders` types) để các phase sau import.

## Requirements
- Vercel KV được provision và link với project
- Env vars: `KV_REST_API_URL`, `KV_REST_API_TOKEN` (auto inject bởi Vercel KV integration), `SEPAY_API_KEY`, `SEPAY_ACCOUNT`, `SEPAY_BANK`, `N8N_REGISTER_WEBHOOK_URL`
- Helper module `kv.ts` wrap client để các route dùng
- `plans.ts` map tên gói → giá

## Architecture
```
src/lib/
├── kv.ts          # Vercel KV client wrapper
├── plans.ts       # Plan name → price map + helpers
└── orders.ts      # Order types + KV key helpers (key generator, TTL constants)
```

## Related Code Files
- Create: `src/lib/kv.ts`
- Create: `src/lib/plans.ts`
- Create: `src/lib/orders.ts`
- Modify: `package.json` (add `@vercel/kv`)
- Create: `.env.local.example` (document env vars)

## Implementation Steps

### 1. Cài package
```bash
pnpm add @vercel/kv
```

### 2. `src/lib/kv.ts`
```ts
import { kv } from "@vercel/kv";
export { kv };
```
KISS — không wrap thêm gì. Vercel KV client tự đọc env `KV_REST_API_URL`/`KV_REST_API_TOKEN`.

### 3. `src/lib/plans.ts`
```ts
export const PLAN_PRICES: Record<string, number> = {
  "Gói 0 đồng": 0,
  "Gói 499K + tặng quà": 499000,
};

export function getPlanPrice(name: string): number {
  return PLAN_PRICES[name] ?? 0;
}

export function isPaidPlan(name: string): boolean {
  return getPlanPrice(name) > 0;
}
```

### 4. `src/lib/orders.ts`
```ts
export type OrderStatus = "pending" | "paid" | "expired";

export type Order = {
  orderId: string;        // DH + 6 digits
  phone: string;
  name: string;
  email: string;
  ticket: string;         // tên gói
  amount: number;
  status: OrderStatus;
  createdAt: number;      // Date.now()
  paidAt?: number;
};

// KV key + TTL
export const orderKey = (orderId: string) => `order:${orderId}`;
export const ORDER_TTL_SECONDS = 60 * 60 * 24; // 24h auto-expire

export function generateOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000); // 100000-999999
  return `DH${n}`;
}
```

### 5. Set up Vercel KV
- Trên Vercel dashboard → project → Storage → Create KV (Upstash Redis)
- Vercel auto inject `KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.
- Local dev: `vercel env pull .env.local` (hoặc paste tay)

### 6. `.env.local.example`
```
# Vercel KV (auto từ Vercel dashboard, không commit token thật)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# SePay
SEPAY_API_KEY=
SEPAY_ACCOUNT=VQRQAIUBZ4834
SEPAY_BANK=MBBank

# n8n (server-side forwarding)
N8N_REGISTER_WEBHOOK_URL=https://n8n.bimspeed.net/webhook/e593c1ea-a898-476b-8284-6cde0191400c
```

### 7. Compile check
```bash
pnpm build
```

## Success Criteria
- [ ] `@vercel/kv` cài thành công
- [ ] 3 module `kv.ts`/`plans.ts`/`orders.ts` build pass TypeScript
- [ ] Vercel KV provisioned trên dashboard
- [ ] `.env.local.example` document đủ env vars

## Risk Assessment
- **Vercel KV deprecation note:** Vercel KV giờ là Marketplace integration với Upstash. Đảm bảo chọn "Upstash Redis" trong Storage tab.
- **Env var naming:** Vercel KV integration tự generate prefix khác nhau tuỳ provider. Confirm tên exact rồi update code/example.
