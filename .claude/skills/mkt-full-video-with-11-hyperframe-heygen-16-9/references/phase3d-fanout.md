# Phase 3 — scenes-outline, bảng `variant`, prompt sub-agent

Đọc khi: dựng `scenes-outline.json` (Bước 3b) hoặc chuẩn bị spawn N sub-agent viết composition (Bước 3f) trong [SKILL.md](../SKILL.md).

Vì sao sub-agent LLM chứ không phải Python: HyperFrames có vô số mẫu tư duy hình ảnh (before-after, hub-and-spokes, two-clock-comparison, three-tier-comparison, scroll-tape, hero-orb-spec-trio, terminal-mock, gift-box…). `scripts/generate_compositions.py` của skill editor chỉ biết 5 archetype cố định → cảnh nào cũng na ná nhau, không thích nghi được với ẩn dụ riêng của cảnh, và listicle 6+ cảnh bị trùng tên tệp (nhiều `tip-N` cùng về `recap-card.html` → ghi đè nhau). Vì vậy script đó **deprecated**; mỗi cảnh một sub-agent, tên tệp `scene-{num}.html`.

## scenes-outline.json (mẫu)

Orchestrator (LLM) đọc `transcript-cleaned.json` (hoặc `transcript.json`) + `script.txt`, chia cảnh theo cấu trúc script (hook → các mục/mẹo → CTA). Listicle 5 mẹo → 7 cảnh (1 hook + 5 tip + 1 CTA); video một luận điểm → 5 cảnh (hook / problem / solution / recap / cta).

```json
[
  {"num": 1, "kind": "hook",  "start": 0.0,   "end": 22.62, "kicker": "...", "heading": "...", "variant": "tier-row-before-after"},
  {"num": 2, "kind": "tip-1", "start": 22.62, "end": 41.04, "kicker": "MẸO 1 · ...", "heading": "...", "variant": "chats-stack"},
  {"num": 3, "kind": "tip-2", "start": 41.04, "end": 58.86, "kicker": "MẸO 2 · ...", "heading": "...", "variant": "counter-row"},
  {"num": 7, "kind": "cta",   "start": 136.6, "end": 148.78, "kicker": "...", "heading": "...", "variant": "comment-terminal"}
]
```

`kind` đặt tên tuỳ ý (`hook`, `problem`, `solution`, `tip-1`..`tip-N`, `recap`, `cta`, `intro`…); tên tệp luôn là `scene-{num}.html` nên N = 10 cũng không đụng nhau. Số cảnh theo độ dài: 3 cảnh ≈ 30–40 s · 5 cảnh ≈ 60 s · 7 cảnh ≈ 90–150 s (giảm mật độ chuyển động) · 10 cảnh ≈ 150–250 s (nhịp chặt).

## Bảng `variant` (gợi ý điểm khởi đầu — sub-agent được phép biến tấu)

| `variant` | Mẫu khởi điểm | Khi dùng |
|---|---|---|
| `tier-row-before-after` | 2 tier-row (trước đỏ/hồng + sau lime/xanh) | Hook so sánh trước/sau |
| `chats-stack` | chat-row stack + dấu xích đứt | Vấn đề / thất bại / phản biện / demo Edit-Regen |
| `hero-orb-spec-trio` | hero-row có orb + 3 tier-row thông số | Giải pháp / cơ chế / kho trung tâm + nan hoa |
| `counter-row` | tier-letter + đường gạch + client-rows | Kết quả / chứng minh bằng số / "X tin = Y token" |
| `comment-terminal` | tier-letter + terminal macOS + gift-rows | CTA |
| `stats-3card` | 3 cột số liệu kiểu landing | Giới thiệu kiến thức / lợi thế múi giờ / 3 sự thật |
| `comparison-2col` | 2 cột Yes/Yes chip | "Khi nào dùng cái nào" / Haiku vs Sonnet vs Opus |
| `two-clock-comparison` | 2 đồng hồ + cung conic-gradient | Múi giờ, so sánh thời gian |
| `three-tier-comparison` | 3 thẻ so sánh | Đúng công cụ cho đúng việc / 3 hạng phương tiện |

Mẫu code chép-dán nằm ở `composition-patterns.md` (cùng thư mục, 8 mẫu — sub-agent đọc theo prompt bên dưới); sub-agent nên **biến tấu** khi ẩn dụ đòi hỏi (vd `hero-orb` → "kho + 5 nan hoa", `stats-3card` → "hai đồng hồ").

## Prompt cho mỗi sub-agent

Spawn N sub-agent `general-purpose` — **một lời gọi Agent mỗi cảnh, tất cả trong cùng 1 message** để chạy song song. Điền `{K}` = thư mục skill orchestrator, `{P}` = thư mục video (đường dẫn tính từ gốc repo), `{N}` = số cảnh.

```
Viết composition HyperFrames cho cảnh {N} ({kind} — {tiêu đề ngắn}).

Tệp ra: {P}/compositions/scene-{N}.html

SCENE BRIEF — đọc đủ dữ liệu từ {P}/visual-plan.json (khối của bạn = scenes[{N-1}]):
- num: {N}, kind: {kind}, variant hint: {variant}
- thời lượng: {start}–{end}s ({duration}s)
- kicker: "{kicker}" · heading: "{heading}" · accent_words: {accent_words}
- tier_letter: "{tier_letter}" · items: {số lượng + tóm tắt} · badges: {số lượng + tóm tắt}
- broll metaphor: {mô tả} (ảnh nằm ở lớp gốc #broll-{N}, KHÔNG nằm trong composition này)
- PIP-IN windows: {mốc tuyệt đối + tương đối}

ĐỌC TRƯỚC (bắt buộc — mã trong composition-patterns.md đã chạy thật, chép được):
- {K}/references/composition-patterns.md (8 mẫu — chọn mẫu hợp nhất, biến tấu thoải mái)
- {K}/references/slide-design-tokens.md (palette + typography + glass card + tier-letter)

YÊU CẦU CỨNG:
- Viewport 1200×1080 ngang · nền đen #000
- Bọc trong <template id="scene-{N}-template"> (HF bắt buộc)
- Gốc: <div data-composition-id="scene-{N}" data-start="0" data-width="1200" data-height="1080">
- Mọi CSS scoped: [data-composition-id="scene-{N}"] .selector {} — không selector class trần ở gốc tệp
- GSAP qua window.gsap (không import). Đăng ký: window.__timelines["scene-{N}"] = tl;
- Trong JS: const R = '[data-composition-id="scene-{N}"]' rồi dùng R + ' .word'
- Không dùng !important
- Font Inter + JetBrains Mono (Google Fonts, preconnect + link)
- Accent palette: chọn theo kind/ẩn dụ của cảnh ({gợi ý})
- Tiêu đề: bọc accent_words trong <span class="word grad-{accent}">...</span> để tô gradient
- CHỈ lớp DỮ LIỆU — KHÔNG nhúng <div class="image-slot"> hay <img src="../{N}.png"> trong composition. Ảnh giấy kem nằm ở lớp GỐC (#broll-{N} trong index.html), hiện full-stage 1920×1080 trong cửa sổ PIP.
- Logo thương hiệu (nếu mẫu cần): assets/logos/<brand>.png|jpg (tương đối từ thư mục video; có sau scaffold_project.py). Thiếu thì dùng avatar chữ.
- Timeline GSAP ≈ thời lượng cảnh (+0,5 s đệm); mọi chuyển động đăng ký vào `tl`

Phong cách: Claude AI editorial · nền tối hiện đại · glass card (rgba(15,20,30,0.55) + viền accent 1.5px + backdrop-filter blur) · tiêu đề Inter 800 68–110px / line-height 0.96 / letter-spacing -0.035em · eyebrow JetBrains Mono 16px / 0.22em / uppercase + chấm 8px phát sáng · tier-letter weight 900 + text-shadow accent.

Chọn mẫu hợp ẩn dụ của cảnh — đừng làm chung chung.

Báo lại: mẫu đã chọn, palette, 1 dòng xác nhận đã ghi tệp. Dưới 100 từ.
```

Sau khi mọi sub-agent trả về: kiểm `{P}/compositions/scene-1.html … scene-N.html` đủ tệp, mỗi tệp có `[data-composition-id="scene-{N}"]` và `window.__timelines["scene-{N}"]`, không có `image-slot`, không có `!important`.
