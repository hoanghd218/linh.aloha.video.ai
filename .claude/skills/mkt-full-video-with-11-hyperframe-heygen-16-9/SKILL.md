---
name: mkt-full-video-with-11-hyperframe-heygen-16-9
description: Dựng trọn gói video ngang 16:9 (1920×1080) kiểu "podcast keynote" từ script tiếng Việt — ElevenLabs → voiceover.mp3 → HeyGen avatar → source.mp4 → HyperFrames (slide trái, khung avatar nổi phải, SPLIT↔PIP, ảnh giấy kem, phụ đề, SFX) → preview Studio → render sau khi duyệt. Phase 3 chạy N sub-agent song song, mỗi cảnh một composition từ visual-plan.json (mkt-plan-short-video-edit-16-9); có resume khi đã có MP3 + source.mp4. Dùng khi nói "tạo video 16:9", "video ngang", "video landscape", "podcast keynote video", "talking head + slide video", "video kiến thức 16:9", "video YouTube ngang từ script", "make a landscape AI video", "plan lại video 16:9", "redo phase 3 video keynote", kể cả khi không nhắc HyperFrames/HeyGen. Tốn credit ElevenLabs/HeyGen nên phải được duyệt trước. Không dùng cho video dọc 9:16 (→ mkt-full-video-with-11-hyperframe-heygen), khi đã có source.mp4 chỉ cần dựng (→ mkt-hyperframe-talking-head-video-16-9), hay chỉ lập plan visual (→ mkt-plan-short-video-edit-16-9).
argument-hint: "[slug] [start_at=phase_1|phase_2|phase_3] [infographic=scaffold|now|none] [auto_scenes=true]"
---

# mkt-full-video-with-11-hyperframe-heygen-16-9

Phiên bản: v1.1 — 2026-11-11

Orchestrator **script tiếng Việt → MP4 ngang 16:9 (1920×1080) "podcast keynote"**: avatar HeyGen trong khung bo tròn nổi bên phải (viền claude-orange), slide kiến thức bên trái (nền tối, phong cách Claude AI editorial), có cửa sổ PIP (slide nở full màn hình, avatar thu nhỏ xuống góc), zoom theo nhịp trên avatar, ảnh giấy kem vẽ tay ở lớp gốc, phụ đề, SFX. Ghép ba phase: TTS (`mkt-elevenlabs-tts-to-mp3`) → avatar (`heygen-mp3-to-mp4`) → dựng HyperFrames (planner + N sub-agent + script của `mkt-hyperframe-talking-head-video-16-9`). Tham số nhận từ `$ARGUMENTS`, thiếu thì hỏi.

| Vào | Ra | Bước |
|---|---|---|
| `script.txt` (≤ 5000 ký tự; từ `mkt-linh-aloha-bds-video-script` hoặc `mkt-vn-short-video-script`) | `script-tagged.txt` → `voiceover.mp3` | 1 (Phase 1) |
| `voiceover.mp3` | `source.mp4` (720×1280 dọc, lip-sync) | 3 (Phase 2) |
| `source.mp4` + `voiceover.mp3` + `script.txt` | `transcript.json` · `scenes-outline.json` · `visual-plan.json` · `prompts.md` · `scenes.json` · `compositions/scene-N.html` · `captions.json` + `compositions/captions.html` · `index.html` | 4 (Phase 3) |
| `prompts.md` | `1.png … N.png` (người dùng tạo; tuỳ chọn) | 4 · 3h |
| `index.html` đã duyệt ở Studio | `out.mp4` 1920×1080 30 fps | 5 |

Tham số:
- **topic** (bắt buộc) · **script** (trừ resume) · `slug` (tự sinh: chữ thường, ASCII, gạch ngang).
- **brand emphasis** (bắt buộc): `claude` · `deepseek` · `openai` · `gemini` · `generic` — truyền cho planner `--brand`; nội dung không xoay quanh một công cụ AI (vd phân tích dự án BĐS) thì gợi ý `generic`.
- **brand handle + nhãn** — hiện ở góc trên-trái video; hỏi nếu chưa có.
- Số cảnh: mặc định 5 (hook/problem/solution/recap/cta), 3–10 tuỳ độ dài; listicle 5 mẹo = 1 hook + 5 tip + 1 CTA.
- Avatar look: 1 ID trong `HEYGEN_AVATAR_LOOKS`, không chọn thì random.
- `infographic`: `scaffold` (mặc định, chỉ ghi `prompts.md`) · `now` · `none`. `auto_scenes`: mặc định `false`, `true` bỏ checkpoint #2. `start_at`: `phase_1` (mặc định) · `phase_2` · `phase_3`.

## Chọn đúng skill

| Việc | Skill |
|---|---|
| Từ script → MP4 16:9 trọn gói (TTS + avatar + dựng) | **skill này** |
| Đã có `source.mp4` + `voiceover.mp3` + `script.txt`, chỉ dựng project 16:9 | `mkt-hyperframe-talking-head-video-16-9` (skill này gọi script của nó ở Phase 3) |
| Chỉ lập `visual-plan.json` + `prompts.md` | `mkt-plan-short-video-edit-16-9` |
| Video dọc 9:16 (TikTok/Reels/Shorts) | `mkt-full-video-with-11-hyperframe-heygen` (trọn gói) · `mkt-hyperframe-talking-head-video` (từ MP4 có sẵn, phụ đề là xương sống) · `mkt-hyperframe-knowledge-video-heygen-9-16-lite` · `mkt-hyperframe-luxury-realestate-9-16` (design tokens BĐS) |
| Video 9:16 bằng Remotion | `mkt-full-video-with-11-remotion-heygen` (+ `-apartment-detail`) |

Khác bản 9:16: bố cục slide trái 1200 + avatar nổi phải 540×880 (không phải avatar full màn) · có PIP SPLIT↔PIP (slide nở 1920, avatar xuống 320×420) · composition do N sub-agent LLM viết (không phải Python) · HeyGen vẫn render **720×1280 dọc** (khung avatar crop `object-position: center 25%`) · không dùng cho TikTok/Reels, dùng cho YouTube ngang / LinkedIn / podcast clip / nhúng website. Không hợp với montage thuần hình, và script > 5000 ký tự thì tách ý trước.

## Luật — không được phá

1. **Cổng chi phí** — chưa được người dùng xác nhận thì không gọi ElevenLabs (Phase 1), HeyGen (Phase 2), sinh ảnh (`infographic=now`); không ghi đè `voiceover.mp3` / `source.mp4` / `out.mp4` đã có (hỏi a / b / c: ghi đè · làm bản mới `-v2` · dừng). Không đăng bài.
2. **Giữ ba checkpoint** — #1 nghe MP3 · #2 duyệt visual plan (bỏ được khi `auto_scenes=true`) · cổng render sau preview Studio. Không dừng giữa Phase 2 → Phase 3.
3. **Khoá API chỉ từ `.env`** (`ELEVENLABS_API_KEY`, `HEYGEN_API_KEY`, `HEYGEN_AVATAR_LOOKS`…) — không in giá trị, không chép sang tệp khác. Giọng và avatar lấy theo skill con (voice khoá của `mkt-elevenlabs-tts-to-mp3`, avatar trong `HEYGEN_AVATAR_LOOKS`); không đổi.
4. **Không bịa số / pháp lý BĐS** — `tier_letter`, `items`, `badges`, `captions` chỉ lấy từ số có trong `script.txt`; số minh hoạ ghi rõ là minh hoạ. Lời thoại do skill kịch bản viết, skill này không viết lại (chỉ chèn audio tag, không thêm/bớt câu).
5. **HeyGen luôn render 720×1280 dọc** (`aspectRatio: "9:16"`, `resolution: "720p"`) dù video ngang — khung avatar 540×880 / 320×420 gần dọc hơn ngang; render 1280×720 ra hai dải đen hoặc mặt quá nhỏ.
6. **Composition do sub-agent LLM viết** (1 cảnh = 1 sub-agent, spawn cùng 1 message); không dùng `generate_compositions.py` (deprecated, ép về 5 archetype, trùng tên tệp ở listicle).
7. **Sửa `visual-plan.json` thô trước khi fan-out** — planner xuất nội dung giữ chỗ ("Soạn email", "8h vs 0h", ẩn dụ `robot-orb-with-tasks`); không sửa thì mọi cảnh chung chung, lệch script.
8. **Ảnh giấy kem chỉ ở lớp gốc** (`<img id="broll-N">` trong `index.html`); composition không nhúng `image-slot`. Viền khung avatar là claude-orange (không trắng).
9. **Preview trước, render sau** — chỉ `npx hyperframes render` khi người dùng trả lời "render" sau khi xem Studio.
10. **Truyền `--brand-handle` / `--brand-label` đúng thương hiệu đang làm video** (không kèm `@`, template tự thêm); mặc định của script là kênh khác. `yt-lower-third` mặc định ghi sẵn tên kênh + số subscriber của kênh khác → kiểm trước khi để bật, không biết số thật thì `--no-yt-lower-third` (không bịa số).
11. **Đường dẫn tương đối từ gốc repo**, không dùng đường dẫn tuyệt đối theo máy; lệnh chạy được trên Windows và macOS (`python3` ↔ `python`).
12. **Xong việc → báo đường dẫn tệp ra + số đo thật** (thời lượng MP3, kích thước `source.mp4`, số cảnh, kết quả lint, độ phân giải/thời lượng `out.mp4`), không nói "xong" khi chưa chạy bước kiểm.

## Quy trình

Đặt: `K=.claude/skills/mkt-full-video-with-11-hyperframe-heygen-16-9` · `E=.claude/skills/mkt-hyperframe-talking-head-video-16-9` · `PL=.claude/skills/mkt-plan-short-video-edit-16-9` · `P=workspace/content/YYYY-MM-DD/<slug>` (ngày hôm nay, UTC+7; thư mục này bị `.gitignore` bỏ qua) · `PY=python3` (macOS) hoặc `python` (Windows).

### Bước 0 — Chuẩn bị, resume, cổng chi phí
1. Kiểm `len(script) ≤ 5000` (bỏ qua khi resume không có script). Vượt → dừng, đề xuất tách ý / rút gọn; không tự cắt.
2. Tạo `$P`, lưu `script.txt` (đã có thì hỏi trước khi ghi đè). Chọn palette theo brand (`$K/references/slide-design-tokens.md`).
3. Resume: có `voiceover.mp3` + `source.mp4` → `start_at=phase_3` · chỉ có `voiceover.mp3` → `phase_2` · chưa có gì → `phase_1`. Báo 1 dòng; người dùng ép được `start_at`.
4. **Cổng chi phí** (chỉ khi còn phase tốn tiền): đưa tóm tắt — số ký tự script, brand, số cảnh dự kiến, avatar look, bước nào tốn credit (ElevenLabs / HeyGen / ảnh) — hỏi a. chạy tiếp · b. sửa tham số · c. dừng. Chưa có "a" thì chưa gọi API. Xong khi: người dùng đã chọn.

### Bước 1 — Phase 1: script → MP3 (bỏ qua nếu `start_at` ≥ `phase_2`)
- **1a. `script-tagged.txt`**: LLM chèn audio tag ElevenLabs v3 vào `script.txt` — đọc [elevenlabs-audio-tags.md](references/elevenlabs-audio-tags.md) (mật độ, tag nên/tránh, ánh xạ theo loại cảnh). Xong khi: `script-tagged.txt` ≤ 5000 ký tự (tag cũng tính), không thêm/bớt câu.
- **1b. TTS**:
  ```bash
  uv run .claude/skills/mkt-elevenlabs-tts-to-mp3/scripts/text_to_mp3.py --file $P/script-tagged.txt -o $P/voiceover.mp3
  uv run .claude/skills/heygen-mp3-to-mp4/scripts/check_duration.py $P/voiceover.mp3
  ```
  Xong khi: `check_duration.py` ra `OK <giây>`; `TOO_LONG` (> 300 s) → dừng.

### Bước 2 — Checkpoint #1: nghe MP3 (bỏ qua nếu resume)
Báo: đường dẫn `voiceover.mp3`, thời lượng thật, giọng/model (`eleven_v3`), danh sách tag đã chèn. Trả lời:
- **`OK`** → Phase 2 (HeyGen).
- **`regen`** → chỉnh voice settings, giữ tag.
- **`đổi tags`** + yêu cầu → sửa `script-tagged.txt` rồi TTS lại.
- **`sửa script`** + nội dung → chạy lại Phase 1.

**Dừng, đợi người dùng.**

### Bước 3 — Phase 2: MP3 → `source.mp4` (bỏ qua nếu `start_at=phase_3`)
Gọi skill `heygen-mp3-to-mp4` (nó lo OAuth, chọn avatar look + engine, upload qua `.claude/skills/heygen-mp3-to-mp4/scripts/upload_asset.py`, tạo video, poll, tải về) với: MP3 = `$P/voiceover.mp3` · `aspectRatio: "9:16"` · `resolution: "720p"` (luật 5) · output = `$P/source.mp4`. Lỗi HeyGen → bảng lỗi của skill đó.
```bash
ffprobe -v error -show_entries stream=width,height:format=duration -of compact "$P/source.mp4"
```
Xong khi: `source.mp4` có, 720×1280, thời lượng khớp MP3. Báo 1 dòng (avatar, độ dài, kích thước) rồi **đi tiếp Phase 3, không dừng**.

### Bước 4 — Phase 3: lập kế hoạch + dựng HyperFrames
**3a. Chép lời**
```bash
$PY $E/scripts/transcribe_audio.py --workspace $P     # Whisper CLI (medium, vi, theo từ) → transcript.json [{text,start,end}]
$PY $E/scripts/clean_transcript.py --workspace $P     # tuỳ chọn → transcript-cleaned.json (planner ưu tiên bản sạch)
```
Cần `whisper` trong PATH (`pip install openai-whisper`, không cần khoá); không dùng model `.en` cho tiếng Việt. Xong khi: `transcript.json` có từ và `end` cuối ≈ thời lượng MP3.

**3b. `scenes-outline.json`**: LLM đọc `transcript-cleaned.json` + `script.txt`, chia cảnh theo cấu trúc script; mỗi cảnh `{num, kind, start, end, kicker, heading, variant}` (mẫu + bảng `variant` ở [phase3d-fanout.md](references/phase3d-fanout.md)).

**3c. Kế hoạch visual** (planner `mkt-plan-short-video-edit-16-9`)
```bash
$PY $PL/scripts/plan_visuals.py --workspace $P --brand <brand>
$PY $PL/scripts/render_infographic_prompts.py --workspace $P
```
**Bắt buộc sửa tay (luật 7)** — mỗi cảnh ghi đè 5 trường bằng nội dung từ `script.txt` (một script Python nhỏ nạp rồi ghi lại `visual-plan.json`), rồi **chạy lại `render_infographic_prompts.py`** (không thì `prompts.md` còn bản cũ):
- `tier_letter` — chữ/số biểu tượng (`94%`, `OS`, `+45%`, `$5.2B`, `3`…) lấy từ câu/số then chốt của cảnh.
- `accent_words` — từ khoá tô gradient trong heading.
- `items[]` — 2–4 hàng `{icon,label}` đúng ý của cảnh.
- `badges[]` — 1–2 chip góc `{color,icon,label,num,pos}`.
- `broll[0]` — `metaphor` (slug), `title_vi`, `subtitle_vi`, `layout_description` (hướng dẫn vẽ cụ thể), `decorative_elements`, `palette_accents`.

Xong khi: `grep -n "Soạn email\|robot-orb-with-tasks" $P/visual-plan.json` không ra dòng nào (hoặc có thì cố ý).

**3d. Checkpoint #2: duyệt plan** (bỏ qua nếu `auto_scenes=true`). Trình bày bản tóm tắt theo cảnh (không dán JSON thô) — mẫu ở `.claude/skills/mkt-plan-short-video-edit-16-9/references/plan-checkpoint-protocol.md`. Trả lời:
- `OK` → tiếp.
- `đổi scene N metaphor sang <X>` / `đổi tier-letter scene N thành <Y>` → sửa `visual-plan.json` + chạy lại `render_infographic_prompts.py`.
- `đổi scene N variant X` · `merge scene N+M` / `split scene N` → chia lại cảnh.
- `xem prompt N` → dán prompt cảnh N.

**Dừng, đợi.**

**3e. Scaffold + `scenes.json`** (thứ tự này — xem [kinh-nghiem.md](references/kinh-nghiem.md))
```bash
$PY $E/scripts/scaffold_project.py --workspace $P          # chép sfx/ (6 tệp) + assets/logos/ + assets/avatar.jpg + compositions/yt-lower-third.html
$PY $PL/scripts/apply_plan_to_scenes.py --workspace $P     # scenes.json từ visual-plan.json
```
Xong khi: `scenes.json` có đúng N cảnh; `$P/sfx/` đủ 6 tệp.

**3f. Fan-out sub-agent viết composition** — spawn N sub-agent `general-purpose` (1 cảnh = 1 lời gọi Agent) trong **một message**; dùng prompt mẫu trong [phase3d-fanout.md](references/phase3d-fanout.md) (điền `{K}`, `{P}`, `{N}`, khối cảnh trong `visual-plan.json`; nhắc rõ "không nhúng image-slot"). Xong khi: `compositions/scene-1.html … scene-N.html` đủ, mỗi tệp có `[data-composition-id="scene-N"]` + `window.__timelines["scene-N"]`, không `image-slot`, không `!important`.

**3g. Phụ đề + `index.html` gốc**
1. `captions.json` (nên dùng cho tiếng Việt): `[{"text","start","end"}]`, chữ sạch từ `script.txt`, cụm 3–8 từ, mốc căn theo Whisper (chi tiết + nguồn dự phòng ở [auto-baked-patterns.md](references/auto-baked-patterns.md)).
2. Tạo phụ đề + gốc:
   ```bash
   uv run $E/scripts/generate_captions.py --workspace $P                 # → compositions/captions.html
   $PY $E/scripts/generate_root_index.py --workspace $P --brand-handle "<handle, không kèm @>" --brand-label "<nhãn hiện góc trên-trái>"
   ```
   Thêm `--no-captions` / `--no-yt-lower-third` / `--yt-lower-third-duration 4.5` khi cần (luật 10). Phụ đề tự bật khi có `compositions/captions.html`. `generate_root_index.py` cần `jinja2` (`pip install jinja2`) và luôn mount `compositions/scene-{num}.html`.
Xong khi: `$P/index.html` có, log in số mount = N, số PIP event, số SFX.

**3h. Ảnh giấy kem** (`infographic`): `scaffold` (mặc định) — chỉ có `prompts.md`, người dùng tự tạo `1.png … N.png` rồi refresh Studio; lớp ảnh ở opacity 0 tới khi có tệp. `now` — skill sinh ảnh gốc `image-post-creator` **không có trong repo** nên chưa chạy được; muốn tự sinh (vd `mkt-kie-broll-image-generator` chế độ prompt thủ công, `--aspect_ratio 16:9`) thì hỏi a / b / c vì tốn credit. Ảnh phải có **trước** khi lint/preview.

**3i. Lint + preview**
```bash
$PY $E/scripts/lint_and_preview.py --workspace $P     # npx hyperframes lint (phải 0 lỗi) rồi mở Studio http://localhost:3002
```
Cảnh báo `composition_self_attribute_selector` chấp nhận được (selector scoped có chủ đích). Xong khi: lint 0 lỗi; Studio mở được; đã đọc [render-checklist.md](references/render-checklist.md).

### Bước 5 — Bàn giao + cổng render
Báo: workspace `$P` · Phase 1 `voiceover.mp3` (<D1> s) · Phase 2 `source.mp4` (avatar, <D2> s, dọc) · Phase 3 (N cảnh, 6 SFX, K ảnh giấy kem) · Studio URL · "Scrub timeline; trả lời **`render`** để xuất MP4 1920×1080 30 fps". **Dừng.**

Khi người dùng nói "render":
```bash
npx hyperframes render $P/index.html -o $P/out.mp4 --width 1920 --height 1080 --fps 30
ffprobe -v error -show_entries stream=width,height:format=duration -of compact "$P/out.mp4"
```
Báo độ phân giải + thời lượng thật. `out.mp4` đã có → hỏi trước khi ghi đè (luật 1).

## Lỗi đã gặp

| Triệu chứng | Cách sửa |
|---|---|
| Mọi cảnh chung chung, lệch script | Chưa sửa 5 trường trong `visual-plan.json` (3c) trước khi fan-out. |
| Ảnh giấy kem bị bóp nhỏ trong slide | Sub-agent nhúng `image-slot` — ảnh chỉ ở lớp gốc; nhắc lại trong prompt sub-agent. |
| `plan_visuals.py` không thấy transcript | Chạy `transcribe_audio.py` (khoá `text`, không phải `word`). |
| `scenes.json` mất `pip_events` của plan | Chạy lại `apply_plan_to_scenes.py` SAU `scaffold_project.py` (3e). |
| Mặt avatar cắt trán | `object-position: center 25%` → thử 20–30% trong `index.html` (`#v-source`). |
| Lint báo thiếu `data-duration` / sai khoá `window.__timelines` | Xem bảng đầy đủ trong [kinh-nghiem.md](references/kinh-nghiem.md); sự cố môi trường (đường dẫn skill, CPU Whisper + HeyGen) trong [troubleshooting.md](references/troubleshooting.md). |

## Tài liệu trong `references/` (đọc khi cần)

- [auto-baked-patterns.md](references/auto-baked-patterns.md) — những lớp Phase 3 tự dựng (zoom Hybrid Hook, b-roll PIP-swap, viền avatar, phụ đề, lower-third), cơ chế PIP, nhịp theo loại cảnh.
- [architecture.md](references/architecture.md) — mã gốc: root composition, slide-mount, avatar-frame, timeline GSAP (SPLIT↔PIP, thở, punch-in).
- [slide-design-tokens.md](references/slide-design-tokens.md) — palette, typography, glass card, tier-letter, eyebrow chip.
- [composition-patterns.md](references/composition-patterns.md) — 8 mẫu composition 1200×1080 chép-dán (sub-agent đọc).
- [infographic-prompt-template.md](references/infographic-prompt-template.md) — prompt ảnh giấy kem theo 7 loại nhịp + định dạng `prompts.md`.
- [render-checklist.md](references/render-checklist.md) · [troubleshooting.md](references/troubleshooting.md) · [kinh-nghiem.md](references/kinh-nghiem.md).

## Cải tiến skill

Gặp lỗi mới → ghi một dòng vào `references/kinh-nghiem.md` (đúng bảng) và một dòng vào mục *Nhật ký* cuối tệp đó; sửa đúng một chỗ, không rải ra nhiều tệp.

## Liên quan

Trước: `mkt-linh-aloha-bds-video-script` / `mkt-vn-short-video-script` (viết `script.txt`). Trong pipeline: `mkt-elevenlabs-tts-to-mp3` (Phase 1) → `heygen-mp3-to-mp4` (Phase 2) → `mkt-plan-short-video-edit-16-9` (3c–3e) → `mkt-hyperframe-talking-head-video-16-9` (script 3a, 3e, 3g, 3i). Sau: đăng bài (ngoài phạm vi). Không dùng `generate_compositions.py` và `scaffold_infographic_slots.py` (deprecated).
