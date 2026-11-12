# Render checklist

Checklist orchestrator chạy trước khi user gọi `render`. Phần lớn item được editor's `lint_and_preview.py` bắt tự động — phần liệt kê dưới chỉ là 3 thứ ngoài lint scope.

## Lint-driven (auto-checked by `npx hyperframes lint`)

Editor đã guard:
- `data-duration` thiếu trên `<video>` / `<audio>` / `<div class="clip slide-mount">` / `<div class="clip brand-mark">`
- `slide-mount > [data-composition-id]` width có `!important`
- `<audio>` SFX thiếu absolute `data-start`
- `gsap_animates_clip_element` (chỉ animate opacity trên clip elements)
- `root_composition_missing_data_start` (sub-comp phải có `data-start="0"` trên inner `[data-composition-id]`)

→ Nếu `lint_and_preview.py` trả 0 errors, các item trên đã pass. **Warnings `composition_self_attribute_selector` chấp nhận được** (templates dùng scoped selectors có chủ đích).

## Manual (orchestrator phải tự verify)

3 thứ lint không bắt được:

1. **Avatar `object-position: center 25%`** — face không bị crop trán. Editor template đã set default 25%. Nếu HeyGen avatar khác height → tweak 20%–30% trong `index.html` `#v-source` style.

2. **Brand mark vị trí** — top-left, KHÔNG che slide content. Editor template đặt `(40, 36)` theo default; nếu hook có tier-letter ở top-left → cần dịch brand mark hoặc dịch tier-letter.

3. **PIP_EVENTS spacing** — mỗi block `goPIP(t_in)` → `goSplit(t_out)` cách block tiếp theo ≥ 0.3s. Editor's `generate_root_index.py` derive PIP_EVENTS từ `pip_events` của `scenes.json` — nếu visual plan có ≥ 2 emphasis beat trong 1 scene cách nhau < 0.3s → manually merge hoặc widen spacing trong `visual-plan.json` rồi rerun `apply_plan_to_scenes.py`.

## Orchestrator-level pre-flight (chạy trước Phase 1)

- [ ] `len(script_text) ≤ 5000` chars
- [ ] Brand emphasis đã chọn (`claude` / `deepseek` / `openai` / `gemini` / `generic`)
- [ ] Avatar look picked từ `HEYGEN_AVATAR_LOOKS` env (hoặc explicit)
- [ ] Workspace folder created tại `workspace/content/YYYY-MM-DD/<slug>/`

## Pre-render (sau Phase 3, trước user gọi render)

- [ ] `voiceover.mp3` duration ≥ tổng `data-duration` của scenes
- [ ] `source.mp4` exists và là portrait 720×1280 (KHÔNG 1280×720)
- [ ] `prompts.md` tồn tại (planner luôn viết khi có infographic slot)
- [ ] Nếu `infographic_mode=now` → mọi `N.png` đã gen TRƯỚC khi `lint_and_preview.py` chạy
- [ ] Studio mở được tại `http://localhost:3002`

## Bổ sung — checklist trước khi render (chuyển từ SKILL.md bản cũ)

- [ ] `npx hyperframes lint` — 0 lỗi (cảnh báo được)
- [ ] Mỗi `slide-mount` có `data-start` + `data-duration`
- [ ] 6 tệp SFX tồn tại trong `sfx/`
- [ ] `index.html`: `slide-mount` không có `!important` trên `width`
- [ ] `compositions/scene-1.html … scene-N.html` đều có `[data-composition-id="scene-{N}"]` và `window.__timelines["scene-{N}"]`
- [ ] Composition KHÔNG nhúng `image-slot` — ảnh giấy kem chỉ ở lớp gốc `#broll-N`
- [ ] Viền khung avatar claude-orange (không trắng); brand mark ở góc trên-trái, không che slide
- [ ] `compositions/yt-lower-third.html`: tên kênh + số subscriber đúng thương hiệu đang làm video, hoặc đã chạy `generate_root_index.py --no-yt-lower-third`
- [ ] Phụ đề: bản cuối dùng `captions.json` biên từ `script.txt` (không dùng Whisper thô cho tiếng Việt)
