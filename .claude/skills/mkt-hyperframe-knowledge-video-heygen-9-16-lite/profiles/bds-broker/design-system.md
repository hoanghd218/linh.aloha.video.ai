# Profile `bds-broker` — Design System (thay `references/design-system.md`)

Khi chạy `--profile bds-broker`, file này **thay thế** design system dark-keynote mặc định. Mọi thứ khác trong SKILL.md (avatar windows, captions, PIP, seed PRNG, vùng cấm) giữ nguyên.

## Mood

**Broker-creator punchy, ảnh dự án dẫn dắt.** Không phải slide keynote: mỗi scene là **ảnh dự án full-canvas + scrim tối + chữ đè cực đậm**. Chữ trắng viền đen dày, số tiền màu đỏ, urgency màu vàng. Chất "môi giới đang đứng nói chuyện với anh chị", không phải "công ty đang thuyết trình".

Scene không có ảnh → nền tối `--bg-deep` + motion-graphic (bảng giá, timeline, grid tiện ích) với một đường accent champagne mảnh để giữ chất dự án cao cấp. Không bokeh particle, không glassmorphic — hai thứ đó là DNA của profile knowledge, dùng ở đây sẽ lệch tông.

## Tokens

```css
/* Nền + scrim ảnh */
--bg-deep:      #0b0d12;
--bg-panel:     rgba(255,255,255,0.06);
--scrim:        linear-gradient(180deg,
                  rgba(8,10,14,0.12) 0%,
                  rgba(8,10,14,0.62) 58%,
                  rgba(8,10,14,0.94) 100%);

/* Punch palette */
--punch-white:  #ffffff;
--punch-red:    #e63946;   /* giá, con số tiền */
--punch-yellow: #f5c518;   /* urgency, deadline, số lượng còn lại */
--punch-stroke: #000000;
--ink-mute:     rgba(255,255,255,0.68);

/* Accent dự án cao cấp — dùng RẤT tiết chế: đường kẻ, khung, chip */
--gold:         #c9a227;
--champagne:    #d9c7a3;

/* Captions (giống sibling, không đổi) */
--caption-bg:   rgba(0,0,0,0.78);
--caption-ink:  #ffffff;
```

## Typography — Be Vietnam Pro (900 / 800 / 600)

| Vai trò | Size (canvas 1080×1920) | Weight |
|---|---|---|
| Hero punch | 110-150px | 900, uppercase, stroke 6px |
| Số tiền / stat lớn | 170-230px | 900, `--punch-red`, stroke 5px trắng |
| Sub-line dưới hero | 52-64px | 600, `--ink-mute` |
| Label / kicker | 34-42px | 600, uppercase, letter-spacing 0.16em, `--champagne` |
| Body trong card | 44-54px | 500-600 |
| Chip disclaimer | 22-26px | 500, opacity 0.55 |

**`fitText()` là BẮT BUỘC** cho mọi chữ ≥ 90px — Be Vietnam Pro 900 tràn canvas ở ~9-10 ký tự. Pattern: `max-width: 960px` + `word-break: keep-all` + `overflow-wrap: break-word`, gọi `fitText(el, 960, maxFs, minFs, 4)` trong `document.fonts.ready.then(run)` **trước** khi dựng GSAP timeline. Chuỗi phải co xuống dưới 90px mới vừa → tách 2 dòng thay vì để nhỏ tí.

```js
function fitText(el, maxWidth = 960, maxFontSize = 200, minFontSize = 70, step = 4) {
  let fs = maxFontSize; el.style.fontSize = fs + 'px';
  const saved = el.style.maxWidth;
  el.style.maxWidth = 'none'; el.style.whiteSpace = 'nowrap';
  while (el.scrollWidth > maxWidth && fs > minFontSize) { fs -= step; el.style.fontSize = fs + 'px'; }
  el.style.maxWidth = saved || (maxWidth + 'px'); el.style.whiteSpace = '';
}
```

| Loại chữ | maxFs | minFs |
|---|---|---|
| Hero punch | 150 | 80 |
| Số tiền | 230 | 90 |
| Hero 2 dòng | 120 | 60 |
| Sub-line | 64 | 42 |

## Ảnh trong scene

```css
.photo-bg { position:absolute; inset:0; width:100%; height:100%;
            object-fit:cover; object-position:center 45%; }
.photo-scrim { position:absolute; inset:0; background:var(--scrim); }
```

- Ảnh LUÔN có `onerror` ẩn container — thiếu file thì scene vẫn chạy, không ra khung vỡ.
- Ken Burns: `gsap.fromTo(img, {scale:1.04}, {scale:1.12, duration: DUR, ease:'none'})` — chậm, một chiều, không yoyo.
- `fitMode: "pad"` (mặt bằng, TMB) → **không** dùng làm `.photo-bg` nguyên bản: xem pattern `floorplan-zoom` trong `scene-patterns.md`.

## Chip "Ảnh minh họa" (bắt buộc khi `illustrative: true`)

```css
.disclaimer-chip { position:absolute; left:48px; bottom:1640px;  /* trên vùng captions */
  font-size:24px; font-weight:500; letter-spacing:0.04em;
  color:rgba(255,255,255,0.55); text-shadow:0 2px 6px rgba(0,0,0,0.6); }
```

## Vùng cấm (giữ nguyên của LITE)

- Không content dưới `y ≈ 1600` — captions.
- Không content trong hộp `x > 780 && y < 320` — PIP avatar tĩnh.
- Hero bắt đầu từ `y ≈ 360-520`; số tiền lớn đặt vùng `y 700-1150`.

## Không dùng trong profile này

Particle bokeh · glassmorphic card blur · gradient trên chữ · Cormorant/serif editorial · chữ mảnh weight ≤ 400 cho hero · màu pastel · icon line-art nhiều nét mảnh (không đọc nổi trên nền ảnh).
