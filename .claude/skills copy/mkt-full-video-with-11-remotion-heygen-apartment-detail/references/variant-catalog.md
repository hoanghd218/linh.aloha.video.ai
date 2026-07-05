# Apartment-detail variant catalog

9 variants in play for `BdsApartmentDetail` composition. 5 apartment-specific full-screen scenes + 4 shared text/CTA.

## Decision tree per script segment

```
Script chunk says...                                                 → use variant
──────────────────────────────────────────────────────────────────────────────────
"Diện tích / hướng / view / tầng / số phòng ..."                     → scene-spec-row
"Đây là mặt bằng căn studio / 1PN / 2PN / 3PN ..."                   → scene-apartment-price
"Bếp dùng đá Caesarstone, tủ Hafele..."                              → scene-finishing-detail
"Phòng tắm thiết bị Toto Nhật, đá Carrara..."                        → scene-finishing-detail
"Tiện ích full 5 sao — gym, bể bơi, sky bar, kids zone..."           → scene-amenity-grid
"Giá studio 3.8 tỷ, 1PN 6.6 tỷ, 2PN 9.9-11.5 tỷ..."                 → scene-price-package
"Quà tặng / Chương trình / Hạn chỗ / Mở bán..." (1 beat)             → callout-stack or punch
"Inbox / Comment / Liên hệ..." (mid video)                           → comment-bubble
End video                                                            → contact-card
```

## Full-screen scenes (z-index 60 — hide avatar)

### 1. `scene-spec-row`

**Khi dùng:** Tổng quan thông số kỹ thuật của căn hộ HOẶC toà nhà. Thường xuất hiện đầu video sau hook.

**JSON schema:**
```json
{
  "id": "sp-spec",
  "variant": "scene-spec-row",
  "t_start": 5.0,
  "duration": 6.0,
  "title": "TỔNG QUAN CĂN HỘ",
  "subtitle": "Lumière Cao Xà Lá",      // optional
  "rows": [
    { "icon": "📐", "label": "Diện tích",   "value": "83.2 M²" },
    { "icon": "🏗️", "label": "Số phòng",    "value": "2PN + 2WC" },
    { "icon": "🧭", "label": "Hướng",       "value": "Đông Nam" },
    { "icon": "🌅", "label": "View",        "value": "Hồ Tây" }
  ]
}
```

**Constraints:** 3-6 rows. >6 sẽ overflow. Mỗi `value` ngắn (≤ 16 ký tự) để không wrap.

### 2. `scene-apartment-price` (named "price" historically, dùng cho FLOORPLAN/LAYOUT)

**Khi dùng:** Show mặt bằng từng layout của căn hộ.

**JSON schema:**
```json
{
  "id": "sp-layout-studio",
  "variant": "scene-apartment-price",
  "t_start": 12.0,
  "duration": 5.0,
  "title": "CĂN STUDIO",
  "subtitle": "(31.9 M²)",            // optional, dạng (X M²)
  "icon": "🏠",                       // default 🏠, pass '' để tắt
  "images": ["floorplan-studio.jpg"], // 1 = full, 2 = stack dọc, 3+ = cycle
  "image_fit": "contain"              // default 'contain' cho floorplan; 'cover' cho photo
}
```

**Constraints:**
- 1 image → full image area, ken-burns zoom
- 2 images → stack dọc, stagger fade-in 0.18s
- 3+ images → cycle one at a time

### 3. `scene-finishing-detail`

**Khi dùng:** Close-up nội thất 1 phòng + 1-4 brand callout pills.

**JSON schema:**
```json
{
  "id": "sp-finishing-kitchen",
  "variant": "scene-finishing-detail",
  "t_start": 28.0,
  "duration": 7.0,
  "image_path": "interior-kitchen.jpg",
  "title": "NỘI THẤT BẾP",                // optional
  "callouts": [
    { "icon": "⭐",  "label": "Mặt đá bếp", "brand": "CAESARSTONE" },
    { "icon": "🇩🇪", "label": "Tủ bếp",     "brand": "HAFELE ĐỨC" },
    { "icon": "🔥", "label": "Bếp từ",     "brand": "BOSCH" }
  ]
}
```

**Constraints:**
- 1-4 callouts. Stagger pop-in 0.22s apart.
- Pill colors auto-cycle through 4-color palette (red / teal / amber / purple).
- Override with `"color": "#xxxxxx"` per callout.

### 4. `scene-amenity-grid`

**Khi dùng:** Show 4-6 tiện ích trong 1 frame.

**JSON schema:**
```json
{
  "id": "sp-amenities",
  "variant": "scene-amenity-grid",
  "t_start": 46.0,
  "duration": 7.0,
  "title": "FULL TIỆN ÍCH",
  "subtitle": "5★ chuẩn Masterise",   // optional
  "cells": [
    { "icon": "💪", "image_path": "amenity-gym.jpg",     "caption": "GYM" },
    { "icon": "🧘", "image_path": "amenity-yoga.jpg",    "caption": "YOGA" },
    { "icon": "🏊", "image_path": "amenity-pool.jpg",    "caption": "BỂ BƠI" },
    { "icon": "👨‍👩‍👧", "image_path": "amenity-kids.jpg",  "caption": "KIDS ZONE" }
  ]
}
```

**Constraints:**
- 3-4 cells → 2×2 grid
- 5-6 cells → 2×3 grid
- Caption ≤ 14 ký tự (else wraps inside pill)

### 5. `scene-price-package`

**Khi dùng:** Bảng giá theo tier (Studio / 1PN / 2PN / 3PN) hoặc gói thanh toán.

**JSON schema:**
```json
{
  "id": "sp-price",
  "variant": "scene-price-package",
  "t_start": 55.0,
  "duration": 8.0,
  "title": "BẢNG GIÁ",
  "subtitle": "Mở bán 22/05/2026",                // optional
  "footer": "Đã VAT - đã đầy đủ nội thất",        // optional, prefixed with *
  "tiers": [
    { "meta": "31.9M²",        "tier": "STUDIO", "price": "3.8 TỶ" },
    { "meta": "55.4M²",        "tier": "1PN",    "price": "6.6 TỶ" },
    { "meta": "83.2-95.8M²",   "tier": "2PN",    "price": "9.9 - 11.5 TỶ", "highlight": true },
    { "meta": "118M²",         "tier": "3PN",    "price": "14.2 TỶ" }
  ]
}
```

**Constraints:**
- 2-4 tiers. >4 sẽ tràn.
- `highlight: true` trên ĐÚNG 1 tier (bigger card + yellow border + gold gradient bg).
- Price string ngắn — "9.9 - 11.5 TỶ" OK, "9.900.000.000 - 11.500.000.000 VND" sẽ overflow.

## Shared text/CTA (z-index 80 — overlay on top of avatar OR scene)

### 6-7. `punch` / `callout-stack`

Đặt giữa các scene để giữ pace + add urgency. Same schema as parent skill.

### 8. `comment-bubble`

CTA inbox mid-video. Same schema as parent.

### 9. `contact-card`

End card. Always at `t_start = video_duration - 6`, `duration = 6`. Same schema as parent.

## SFX mapping (deltas vs parent)

Parent skill uses 4-6 SFX cues per 60s. Apartment-detail uses **same budget** but cue placement differs:

| Cue trigger | Recommended SFX |
|---|---|
| `scene-spec-row` entry | `swoosh.mp3` (smooth section open) |
| `scene-apartment-price` (floorplan reveal) | `pop.mp3` |
| `scene-finishing-detail` first callout | `ting.mp3` (premium) |
| `scene-amenity-grid` cells popping | `pop.mp3` once at scene entry |
| `scene-price-package` highlight tier | `ka-ching.mp3` or `ting.mp3` |
| `punch` urgency mid-scene | `whoosh.mp3` |
| `contact-card` entry | `notification.mp3` |

Budget cap: 6/60s. Reuse files where possible.
