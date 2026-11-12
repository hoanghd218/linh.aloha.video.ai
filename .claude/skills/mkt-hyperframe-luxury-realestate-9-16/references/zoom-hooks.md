# Zoom hook trên avatar — luật nhịp + 3 kiểu

Đọc khi: viết khối `ZOOM_HOOKS` trong `<script>` của `index.html`. Zoom chạy trên `#v-source` ở timeline gốc, không nằm trong composition con.

## Luật nhịp

**Khoảng cách tối đa giữa hai zoom: 4 giây.** Mọi từ nhấn trong transcript đều có zoom hook; mỗi zoom ghép với chữ overlay và SFX cùng thời điểm `t`. Video 60s thường có 15–20 hook (trung bình 1 cái / 3s).

3 kiểu, đều nhẹ — đỉnh 1.04–1.10, KHÔNG bao giờ ≥ 1.15:

| Kiểu | Hình | Thời lượng | Dùng cho |
|---|---|---|---|
| `soft2step` | 1.0 → mid (~1.05) → đỉnh → 1.0 | ~1.10s | Khoảnh khắc LỚN — thương hiệu, giá, CTA (4–5 lần/video) |
| `quickpop` | 1.0 → đỉnh → 1.0 nhanh | ~0.78s | Nhấn vừa — địa điểm, con số, ý tốt |
| `doublepop` | 1.0 → đỉnh → 1.0 → đỉnh → 1.0 | ~1.08s | Gấp rút / mở danh sách — gõ 2 nhịp (1–2 lần/video) |

Đỉnh gợi ý:
- `1.04–1.05` — zoom đệm giữ nhịp dưới 4s
- `1.06–1.07` — nhấn vừa
- `1.08–1.10` — LỚN (lộ thương hiệu, giá rơi, CTA), tối đa 4–5 lần/video

## Mã

```js
gsap.set("#v-source", { transformOrigin: "center 22%" });

function zoomSoft2Step(t, peak) {
  const mid = 1.0 + (peak - 1.0) * 0.55;
  tl.to("#v-source", { scale: mid,  duration: 0.30, ease: "power2.out" }, t);
  tl.to("#v-source", { scale: peak, duration: 0.25, ease: "power2.inOut" }, t + 0.30);
  tl.to("#v-source", { scale: 1.0,  duration: 0.55, ease: "power2.inOut" }, t + 0.65);
}
function zoomQuickPop(t, peak) {
  tl.to("#v-source", { scale: peak, duration: 0.28, ease: "back.out(1.6)" }, t);
  tl.to("#v-source", { scale: 1.0,  duration: 0.50, ease: "power2.inOut" }, t + 0.28);
}
function zoomDoublePop(t, peak) {
  tl.to("#v-source", { scale: peak, duration: 0.18, ease: "back.out(1.8)" }, t);
  tl.to("#v-source", { scale: 1.0,  duration: 0.22, ease: "power2.inOut" }, t + 0.18);
  tl.to("#v-source", { scale: peak, duration: 0.18, ease: "back.out(1.8)" }, t + 0.55);
  tl.to("#v-source", { scale: 1.0,  duration: 0.35, ease: "power2.inOut" }, t + 0.73);
}

// Mẫu video 60s — 19 hook, KHÔNG có khoảng trống > 4s (số liệu minh hoạ)
const ZOOM_HOOKS = [
  { t: 0.11,  type: "soft2step", peak: 1.08 }, // LỚN: thương hiệu
  { t: 3.79,  type: "quickpop",  peak: 1.05 }, // nhấn đệm
  { t: 7.00,  type: "quickpop",  peak: 1.05 },
  { t: 10.44, type: "doublepop", peak: 1.05 }, // mở danh sách
  // ... trung bình 3s/hook, không bao giờ trống > 4s ...
  { t: 55.89, type: "soft2step", peak: 1.10 }, // LỚN: CTA
];

ZOOM_HOOKS.forEach(({ t, type, peak }) => {
  if (type === "soft2step")       zoomSoft2Step(t, peak);
  else if (type === "quickpop")   zoomQuickPop(t, peak);
  else if (type === "doublepop")  zoomDoublePop(t, peak);
});
```
