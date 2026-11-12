# Những gì Phase 3 tự dựng sẵn (auto-baked)

Đọc khi: cần biết `index.html` gốc đã có gì, chỉnh nhịp PIP / zoom, hoặc giải thích với người dùng vì sao video có các lớp này. Mã đầy đủ của gốc: `architecture.md` (cùng thư mục); palette + typography: `slide-design-tokens.md`.

## 1. Composition từng cảnh — do sub-agent LLM viết
- Tệp ra `compositions/scene-1.html … scene-N.html` (1 tệp / cảnh, tên không đụng nhau với mọi N).
- Mỗi sub-agent đọc khối cảnh của mình trong `visual-plan.json` + tài liệu mẫu rồi tự viết HTML/CSS/GSAP — chọn mẫu hợp ẩn dụ của cảnh, không khoá vào 5 archetype cố định.
- Logo thương hiệu (`claude` / `chatgpt` / `gemini` / `claude-code`) do `scaffold_project.py` chép vào `assets/logos/`; sub-agent nhúng khi mẫu cần (orb glow, tool-badge pill, hàng thất bại).

## 2. Zoom "Hybrid Hook" trên `.avatar-breathing` (do `generate_root_index.py`)
- Cảnh HOOK: ramp chậm **1.0 → 1.10** suốt cảnh (dựng kịch tính).
- HOOK → BODY: reset nhanh **1.10 → 1.0** (nhả căng).
- Cảnh BODY: nhịp **1.06** tại mỗi sự kiện PIP-IN.
- Cảnh CTA: đẩy nhẹ **1.0 → 1.04** (khép).
- Thay cho "breathing yoyo" phẳng: mỗi loại cảnh một chuyển động zoom riêng.

## 3. Lớp b-roll giấy kem, hoán đổi theo PIP (kiến trúc chia việc)
- Composition (slide-mount) mang **DỮ LIỆU / chữ tier / mục / huy hiệu / tiêu đề / logo** — luôn hiện. `<img class="broll-image">` giấy kem vẽ tay mang **ẩn dụ / cảm xúc** — full stage 1920×1080, hiện trong cửa sổ PIP của cảnh đó, ẩn ngoài PIP. Hai lớp nói hai nửa thông điệp khác nhau (HTML = "cái gì", ảnh = "vì sao / cảm thấy").
- **Ảnh chỉ nằm ở lớp gốc** (`<img id="broll-N">` trong `index.html`), composition KHÔNG nhúng `image-slot` (làm vậy bóp ảnh 16:9 vào ô nhỏ, xấu).
- Nguồn ảnh: planner ghi `prompts.md` → người dùng tạo `1.png … N.png`. Chưa có ảnh thì lớp ở opacity 0, video vẫn đẹp với HTML thuần (không nhấp nháy, không icon ảnh hỏng).
- Mã gốc (z-index 25, giữa slide-mount z-20 và avatar-frame z-30):

```html
<img class="broll-image" id="broll-1" src="1.png" alt="scene-1 b-roll"
     data-scene-num="1" data-scene-start="0.00" data-scene-end="22.62">
<style>
.broll-image { position: absolute; top: 0; left: 0; width: 1920px; height: 1080px;
  object-fit: contain; object-position: center; opacity: 0; z-index: 25;
  pointer-events: none; background: #F0EEE6; }   /* viền kem hoà vào nền ảnh */
</style>
<script>
PIP_EVENTS.forEach(e => {
  const n = sceneOf(e.in);
  tl.to(`#broll-${n}`, { opacity: 1, duration: 0.35 }, e.in);
  tl.to(`#broll-${n}`, { opacity: 0, duration: 0.35 }, e.out);
});
</script>
```
- Khổ ảnh mặc định 16:9 (nhà cung cấp ảnh trong skill gốc không hỗ trợ 16:10). Định dạng `prompts.md`: xem `infographic-prompt-template.md`.

## 4. Viền khung avatar theo màu thương hiệu (cố định trong `assets/templates/index.html.j2`)
- SPLIT: claude-orange `#d97757` 3px + halo 6px + glow 80px (KHÔNG viền trắng).
- PIP: violet `#a78bfa` 3px + halo 6px + glow 60px (gợi ý nhấn khi avatar thu nhỏ).
- Màu viền là hằng số trong template; `generate_root_index.py` không có cờ đổi màu theo brand.

## 5. Phụ đề (captions overlay)
- Có khi tồn tại `compositions/captions.html` (do `generate_captions.py` tạo) → `generate_root_index.py` tự gắn ở z-index 28 (trên slide z-20, dưới khung avatar z-30); tắt bằng `--no-captions`.
- Kiểu cố định: Inter 600 38px trắng, viên thuốc tối viền violet, giữa đáy ở `bottom: 100px`; hiện/ẩn từng cụm 0,18 s, `tl.set` ép tắt cuối mỗi cụm. Đổi kiểu → sửa `assets/templates/captions.html.j2` của skill editor, không viết tay `compositions/captions.html`.
- Thứ tự nguồn (trúng cái đầu thì dừng): (1) `captions.json` — `[{"text","start","end"}, …]`, chữ sạch lấy từ `script.txt`, mỗi cụm 3–8 từ, mốc căn theo mốc Whisper (chia tỷ lệ theo số ký tự; có thể nhờ 1 sub-agent làm một lượt hoặc sửa tay) — nên dùng cho tiếng Việt vì Whisper hay đọc sai số và tên thương hiệu (`94%` → "chỉ mít tư vấn trăm", `AI OS` → `AIOS`); (2) `voiceover_segments.json` — dạng danh sách `[{id,start,end,text,words}]`, mỗi segment một cụm; chỉ duyệt tạm, thay bằng `captions.json` trước khi render cuối.

## 6. YT subscribe lower-third (mặc định bật)
- `compositions/yt-lower-third.html` gắn ở `data-start = tổng thời lượng − 3,0 s`, z-index 60, `pointer-events: none`: trượt vào → nút Subscribe được bấm → đổi sang Subscribed.
- Tên kênh + số subscriber cố định trong tệp (`assets/compositions/yt-lower-third.html` của skill editor) — phải kiểm đúng kênh trước khi để bật. Tắt: `--no-yt-lower-third`; đổi độ dài: `--yt-lower-third-duration 4.5`.

## 7. Gốc `index.html` có sẵn
`[data-composition-id="root"]` 1920×1080 · `#slide-bg` đen z5 · `#heygen-bg` (nền ấm bên phải) z9 · `#avatar-frame` SPLIT 540×880 tại (1290, 100) z30 · `<video #v-source>` + `<audio #a-source>` (source.mp4) · 6 `<audio>` SFX · `#brand-mark` góc trên trái · `<img id="broll-N">` · N `<div class="clip slide-mount" data-composition-src="compositions/scene-{N}.html">` · timeline GSAP với `goPIP(t)` / `goSplit(t)`, mảng `PIP_EVENTS`, zoom Hybrid Hook.

## 8. Cơ chế PIP — tóm tắt
- SPLIT (mặc định): avatar 540×880 nổi bên phải, slide-mount rộng 1200.
- PIP: avatar 320×420 góc phải dưới tại (1540, 600), slide-mount nở ra 1920, ảnh giấy kem hiện full stage.
- Helper `goPIP(t)` / `goSplit(t)` đều `overwrite: 'auto'`.
- Chỉ kích hoạt PIP ở **nhịp nhấn** (mặc định = mỗi lần chữ tier-letter hiện). 1–2 PIP mỗi cảnh là vừa; 7 cảnh × 1,5 ≈ 10 sự kiện là mức tối đa trước khi video rối. Giữ PIP 2,5–4 s.

## 9. Nhịp theo loại cảnh

| Loại cảnh | `variant` gợi ý | Kích PIP khi | Ẩn dụ giấy kem (lớp gốc) |
|---|---|---|---|
| Hook (0–14 s) | `tier-row-before-after` | tier-letter scale-up | cuộn băng lãng phí, đồng hồ cát trước/sau, tương phản |
| Problem / Fail (14–28 s) | `chats-stack` | dấu xích đứt rung | 4 bong bóng thất bại vs 1 bong bóng sửa được |
| Tip / Cơ chế (mỗi tip ≈ 18–28 s) | `chats-stack` / `counter-row` / `hero-orb-spec-trio` / `tier-row` / `stats-3card` (chọn theo ẩn dụ) | tier-letter hiện | riêng từng cảnh (kho + nan hoa, hạng phương tiện, hai đồng hồ, hộp quà…) |
| Result / Recap (48–54 s) | `counter-row` | giá trị `to` của bộ đếm scale-in | bộ đếm gạch ngang, trước/sau tiết kiệm |
| CTA (54–60 s) | `comment-terminal` | terminal gõ chữ "claude" xong | hộp quà mở + 2 thẻ FREE |
