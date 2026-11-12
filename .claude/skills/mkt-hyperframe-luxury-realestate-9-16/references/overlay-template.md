# Chữ overlay punch — 7 biến thể, chống tràn chữ, mẫu composition

Đọc khi: dựng/sửa `compositions/overlay-NN.html` hoặc `broll-NN.html`. Luật chống tràn chữ bên dưới áp cho MỌI biến thể, kể cả mẫu cũ ở `variants.md` (chưa có fitText).

Mỗi overlay = MỘT `<div class="clip overlay-mount" data-composition-src="compositions/overlay-XX.html" data-start="T" data-duration="2.5" data-composition-id="overlay-XX" data-track-index="N" style="z-index: 80;">` trong `index.html`.

## 7 biến thể

| Variant | Kiểu | Dùng cho | Vị trí |
|---|---|---|---|
| `punch-white` | Chữ trắng + viền đen dày 5–8px, 130–160px, Be Vietnam Pro 900 | Headline, tên thương hiệu, địa danh | top-center |
| `punch-red` | Đỏ `#e63946` + viền trắng 5–8px + bóng đen, 150–200px | Giá, số lớn, "MIỄN PHÍ" | top-left hoặc top-center |
| `punch-yellow` | Vàng `#f5c518` + viền đen 5–8px, 140–180px | Gấp rút: "1 TUẦN", "HÔM NAY" | top hoặc middle |
| `punch-2line` | 2 dòng xếp chồng, trắng + viền đen, 110–130px mỗi dòng | Câu hỏi / đối lập: "Món hời / Bẫy truyền thông?" | bottom-center |
| `punch-subtle` | Xám trong suốt, không viền, 60–90px, weight 600 | Phụ đề / giải thích dưới số lớn | dưới punch chính |
| `punch-bubble-number` | Hàng bong bóng tròn đỏ `#e63946`, chữ số trắng ở giữa; quầng sáng vàng ấm `box-shadow: 0 0 80px rgba(255,210,80,0.5)`; đường kính 180–220px, số 100–130px weight 900; pop-in lần lượt cách nhau 0.10s | Đếm danh sách: "1 / 2 / 3 lý do mua bây giờ", "3 bước chốt căn". Ghép `count.wav` hoặc `ting.mp3` × N | middle-center, hàng ngang |
| `punch-neon-outline` | Chữ RỖNG (fill trong suốt, `-webkit-text-stroke: 4–6px #ff2d3a`) + glow đỏ `text-shadow: 0 0 20px rgba(255,45,58,0.9), 0 0 40px rgba(255,45,58,0.6)`, weight 900, 200–280px; thường kèm nhãn nhỏ đỏ đặc phía trên ("XU HƯỚNG VIDEO BĐS") | Mốc năm ("2026"), từ khoá xu hướng, dấu thương hiệu lớn. Ghép Whoosh hoặc Laser | giữa khung |

Phân bổ màu mỗi video: chọn 2–3 màu chủ đạo, đừng dùng đủ 5 màu đều nhau (loạn). Trắng 6–10 lần, đỏ 1–3 (giá), vàng 1–3 (gấp), 2line 1–2, subtle 2–4, b-roll 0–3. Mật độ cao ≈ 1 overlay / 3–5s (12–20 overlay trong 60s); trung bình 1 / 5–8s; thấp 1 / 8–12s khi avatar diễn tốt.

## Chống tràn chữ (BẮT BUỘC)

Be Vietnam Pro 900 cỡ 150–200px tràn canvas 1080px ở khoảng 9–10 ký tự ("HỢP LÝ HƠN!", "GIÁ TỐT NHẤT", "VINHOMES CAO XÀ LÁ" bị cụt hai cạnh). Mọi `.punch` và `.broll-text` phải:

- `max-width: 960px` (chừa 60px mỗi bên).
- Gọi `fitText(el, 960, maxFs, minFs, 4)` trong `document.fonts.ready.then(run)` TRƯỚC khi dựng GSAP timeline — đo `scrollWidth` với `whiteSpace:nowrap` + `maxWidth:none`, giảm 4px mỗi bước tới khi vừa, rồi trả lại wrap.
- `word-break: keep-all` + `overflow-wrap: break-word` thay cho `white-space: nowrap` (cho phép xuống dòng nếu cỡ nhỏ nhất vẫn không vừa).

| Variant | maxFs | minFs | Lý do |
|---|---|---|---|
| punch-white | 170 | 70 | nặng vừa |
| punch-red | 200 | 80 | giá cần lực |
| punch-yellow | 180 | 70 | gấp rút |
| punch-2line | 130 | 60 | 2 dòng × ~10 ký tự |
| punch-subtle | 90 | 50 | phụ đề, không to |
| broll-text | 180 | 70 | toàn màn hình |

Chuỗi dài hơn ~14 ký tự sẽ co về 100–130px (vẫn đọc được trên điện thoại). Nếu phải co dưới 90px mới vừa → tách thành `punch-2line` để giữ lực.

## Pattern hoạt ảnh (chung)

```
t=0:    scale 0.7, opacity 0, rotate -3deg
t=0.35: scale 1.05, opacity 1, rotate 0 (vọt quá)
t=0.5:  scale 1.0 (ổn định)
t=duration-0.3: fade-out + scale 0.95
```

```js
tl.fromTo(el,
  { scale: 0.7, opacity: 0, rotate: -3 },
  { scale: 1.05, opacity: 1, rotate: 0, duration: 0.35, ease: 'back.out(2)' }, 0)
  .to(el, { scale: 1.0, duration: 0.15, ease: 'power2.inOut' }, 0.35)
  .to(el, { opacity: 0, scale: 0.95, duration: 0.30, ease: 'power2.in' }, duration - 0.30);
```

Tuỳ chọn: lắc ±0.5° mỗi 0.8s lúc giữ để có năng lượng.

## Mẫu overlay (đầy đủ, đã có fitText)

```html
<template id="overlay-XX-template">
  <div data-composition-id="overlay-XX" data-start="0" data-width="1080" data-height="1920">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;800;900&display=swap" rel="stylesheet" />

    <style>
      [data-composition-id="overlay-XX"] {
        width: 100%; height: 100%;
        position: relative; overflow: hidden;
        background: transparent;            /* BẮT BUỘC — để avatar lộ ra */
        font-family: 'Be Vietnam Pro', system-ui, sans-serif;
        pointer-events: none;
      }
      [data-composition-id="overlay-XX"] .punch {
        position: absolute;
        top: 120px;                          /* hoặc bottom: 380px cho biến thể dưới */
        left: 50%;
        transform: translateX(-50%);
        max-width: 960px;                    /* TRẦN CỨNG — chừa 60px mỗi bên */
        font-size: 150px;                    /* mặc định — fitText() co lại lúc mount */
        font-weight: 900;
        line-height: 0.95;
        text-transform: uppercase;
        text-align: center;
        word-break: keep-all;                /* không bẻ giữa từ tiếng Việt */
        overflow-wrap: break-word;           /* cho xuống dòng nếu cỡ nhỏ nhất vẫn không vừa */
        color: #ffffff;                      /* hoặc #e63946 đỏ, #f5c518 vàng */
        -webkit-text-stroke: 6px #000000;
        paint-order: stroke fill;            /* viền vẽ SAU fill */
        text-shadow: 0 6px 0 rgba(0,0,0,0.40), 0 10px 24px rgba(0,0,0,0.30);
        will-change: transform, opacity;
      }
    </style>

    <div class="punch">120 TR/M²</div>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      (function() {
        function fitText(el, maxWidth = 960, maxFontSize = 200, minFontSize = 70, step = 4) {
          let fs = maxFontSize;
          el.style.fontSize = fs + 'px';
          const saved = el.style.maxWidth;
          el.style.maxWidth = 'none';        // bỏ max-width để đo độ rộng tự nhiên
          el.style.whiteSpace = 'nowrap';
          while (el.scrollWidth > maxWidth && fs > minFontSize) {
            fs -= step;
            el.style.fontSize = fs + 'px';
          }
          el.style.maxWidth = saved || (maxWidth + 'px');
          el.style.whiteSpace = '';          // cho phép wrap nếu min vẫn tràn
        }

        function run() {
          const root = document.querySelector('[data-composition-id="overlay-XX"]');
          if (!root || !window.gsap) return;
          const el = root.querySelector('.punch');

          // 1. Fit chữ TRƯỚC khi animate — scale-pop chạy trên cỡ chữ đã chốt.
          fitText(el, 960, 200, 70, 4);       // maxFs/minFs theo bảng biến thể

          // 2. Animate
          const tl = gsap.timeline({ paused: true });
          window.__timelines = window.__timelines || {};
          window.__timelines['overlay-XX'] = tl;
          const DUR = parseFloat(root.getAttribute('data-duration')) || 2.5;
          tl.fromTo(el,
              { scale: 0.7, opacity: 0, rotate: -3 },
              { scale: 1.05, opacity: 1, rotate: 0, duration: 0.35, ease: 'back.out(2)' }, 0)
            .to(el, { scale: 1.0, duration: 0.15, ease: 'power2.inOut' }, 0.35)
            .to(el, { opacity: 0, scale: 0.95, duration: 0.30, ease: 'power2.in' }, Math.max(0.5, DUR - 0.30));
        }
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(run);    // fitText phải chạy SAU khi Be Vietnam Pro tải xong,
        } else { run(); }                    // nếu không sẽ đo bằng font dự phòng
      })();
    </script>
  </div>
</template>
```

## Captions (TikTok, dưới giữa)

Pill nền đen 78%, chữ trắng Be Vietnam Pro 600, 56–64px, không dùng Inter Tight 300 kem-trên-than (quá "editorial" cho kiểu này). Template có sẵn: `.claude/skills/mkt-hyperframe-talking-head-video/assets/templates/captions.html.template` (đã `bottom: 280px`); đổ dữ liệu bằng `inject_captions.py`, không sửa tay mảng `CAPTION_GROUPS`.

```css
.caption-stage { position: absolute; left: 0; right: 0; bottom: 280px; text-align: center; }
.caption-group {
  display: inline-block;
  padding: 18px 32px;
  background: rgba(0, 0, 0, 0.78);
  border-radius: 20px;
  color: #fff;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-weight: 600;
  font-size: 60px;
  line-height: 1.15;
  text-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
```
