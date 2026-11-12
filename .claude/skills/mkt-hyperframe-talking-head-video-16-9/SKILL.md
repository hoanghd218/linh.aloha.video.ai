---
name: mkt-hyperframe-talking-head-video-16-9
description: Dựng project HyperFrames ngang 16:9 (1920×1080) từ MP4 talking-head HeyGen có sẵn — Whisper chép lời tiếng Việt → chia cảnh → scaffold slide pane 1200px bên trái + khung avatar nổi bên phải, GSAP SPLIT↔PIP (slide nở full, avatar thu nhỏ góc), zoom thở / punch-in theo nhịp, 6 SFX ở mốc cảnh, ảnh giấy kem ở lớp gốc, phụ đề tuỳ chọn → lint + preview Studio (không tự render). Vào là thư mục có source.mp4 + voiceover.mp3 + script.txt (và visual-plan.json nếu có). Dùng khi nói "edit video 16:9 từ HeyGen MP4", "scaffold project landscape", "podcast keynote editor", "talking head + slide editor", "build hyperframes 1920×1080", "tạo project 16:9 từ avatar mp4", "edit 16:9 từ source.mp4 + voiceover.mp3"; cũng là Phase 3 mà mkt-full-video-with-11-hyperframe-heygen-16-9 gọi. Không dùng khi mới có script (→ mkt-full-video-with-11-hyperframe-heygen-16-9), cho video dọc 9:16 (→ mkt-hyperframe-talking-head-video) hay chỉ lập plan visual (→ mkt-plan-short-video-edit-16-9).
argument-hint: "[thư-mục-video] [--auto] [--no-captions] [--no-yt-lower-third]"
---

# mkt-hyperframe-talking-head-video-16-9

Phiên bản: v1.1 — 2026-11-11

Editor **16:9 (1920×1080)** cho video talking-head có sẵn: thư mục có `voiceover.mp3` + `source.mp4` + `script.txt` → project HyperFrames dựng sẵn, mở được bằng `npx hyperframes preview` — slide pane 1200 px bên trái + khung avatar nổi bên phải, chuyển SPLIT↔PIP, zoom thở / punch-in trên avatar, SFX, ảnh giấy kem ở lớp gốc. **Kết thúc ở preview, không tự render.** Không tốn credit (Whisper chạy trên máy, không gọi API trả phí). Tham số: `$ARGUMENTS` = thư mục video (`P`), cờ `--auto` (bỏ checkpoint outline), `--no-captions`, `--no-yt-lower-third`; thiếu thư mục thì hỏi.

Đây là lớp dựng nằm dưới orchestrator `mkt-full-video-with-11-hyperframe-heygen-16-9` (orchestrator lo TTS + HeyGen rồi giao thư mục cho skill này). Tài liệu mẫu dùng chung (mẫu composition, token thiết kế, prompt sub-agent) do skill orchestrator giữ — skill này chỉ trỏ tới, không chép.

| Vào | Ra |
|---|---|
| `voiceover.mp3` · `source.mp4` (HeyGen avatar, hiện dọc 9:16) · `script.txt` | `transcript.json` · `transcript-cleaned.json` |
| (tuỳ chọn) `visual-plan.json` từ planner | `scenes-outline.json` (khi không có plan) · `scenes.json` |
| — | `compositions/scene-N.html` (sub-agent viết) · `index.html` 1920×1080 · `sfx/` · `assets/logos/` · `compositions/yt-lower-third.html` |

Cấu trúc thư mục đầy đủ, canvas, schema, tài nguyên chép sẵn, SFX: [scenes-schema.md](references/scenes-schema.md).

## Chọn đúng skill

| Việc | Skill |
|---|---|
| Đã có MP4 avatar + MP3 + script, cần project 16:9 | **skill này** |
| Mới có script, cần cả TTS + HeyGen + dựng | `mkt-full-video-with-11-hyperframe-heygen-16-9` (trọn gói; gọi skill này ở Phase 3) |
| Chỉ lập `visual-plan.json` + `prompts.md` | `mkt-plan-short-video-edit-16-9` |
| Video dọc 9:16, phụ đề là xương sống, mặt full màn hình | `mkt-hyperframe-talking-head-video` (và `mkt-full-video-with-11-hyperframe-heygen` trọn gói) |

Khác bản 9:16: canvas ngang 1920×1080 · slide trái + khung avatar nổi phải (không phải mặt full màn) · có PIP SPLIT↔PIP và zoom thở/punch-in · composition = tier-row/pattern kiểu tier (không phải 7 mockup post-stack/ai-window…) · ảnh giấy kem `#F0EEE6` thay vì infographic kính tối · SFX giống hệt (cùng 6 tệp) · phụ đề mặc định **tắt** khi chạy riêng (voice avatar là xương sống; bật bằng `generate_captions.py`, orchestrator luôn bật).

## Luật — không được phá

1. **Preview trước, render sau** — dừng ở URL Studio; render do orchestrator / người dùng quyết sau khi xem. Không đăng gì.
2. **Hỏi trước khi ghi đè** — thư mục đã có `index.html` / `scenes.json` / `compositions/scene-*.html` thì hỏi a. ghi đè · b. làm vào thư mục mới `<slug>-v2` · c. dừng, rồi mới chạy script ghi tệp. Không ghi đè / xoá `voiceover.mp3`, `source.mp4`, `script.txt`.
3. **Composition do sub-agent LLM viết** — 1 cảnh = 1 sub-agent, spawn N lời gọi Agent trong **một message**. KHÔNG chạy `generate_compositions.py` và `scaffold_infographic_slots.py` (deprecated: ép về 5 archetype, trùng tên tệp ở listicle, bóp ảnh 16:9 vào ô nhỏ).
4. **Ảnh giấy kem chỉ ở lớp gốc** (`<img id="broll-N">` trong `index.html`, do `generate_root_index.py` tự dựng); composition không nhúng `image-slot`.
5. **Không `!important` trên `width` của slide-mount** (GSAP phải nở 1200 → 1920); gốc composition `width:100%; height:100%`.
6. **Zoom avatar qua hai lớp bọc** `.avatar-breathing` + `.avatar-punch` trong khung — không scale `#avatar-frame` trực tiếp.
7. **Tiếng lấy từ `source.mp4`** (`<audio data-start="0" src="source.mp4">`); không mount `voiceover.mp3` riêng (nhân đôi tiếng). SFX vol 0,18–0,32.
8. **Whisper luôn `--language vi`**, không dùng model `.en` (nó dịch sang tiếng Anh thay vì chép).
9. **Không bịa số / pháp lý BĐS** — chữ trên slide (`tier_letter`, `items`, `badges`, `captions`) chỉ lấy từ `script.txt`; thiếu thì "chưa có"; số minh hoạ ghi rõ là minh hoạ.
10. **Thương hiệu hiện trên video đúng kênh đang làm** — truyền `--brand-handle` / `--brand-label` (không kèm `@`, template tự thêm; mặc định của script là kênh khác). `yt-lower-third.html` ghi sẵn tên kênh + số subscriber của kênh khác → kiểm hoặc `--no-yt-lower-third`; không bịa số subscriber.
11. **Lint 0 lỗi**; `composition_self_attribute_selector` chỉ là cảnh báo thông tin, không refactor.
12. **Đường dẫn tương đối từ gốc repo**, lệnh chạy được trên Windows và macOS (`python3` ↔ `python`). Xong việc → báo đường dẫn + số đo thật (số cảnh, số PIP, lint, tổng thời lượng), không nói "xong" khi chưa chạy lint.

## Quy trình

Đặt: `K=.claude/skills/mkt-hyperframe-talking-head-video-16-9` · `PL=.claude/skills/mkt-plan-short-video-edit-16-9` · `OR=.claude/skills/mkt-full-video-with-11-hyperframe-heygen-16-9` (chỉ để đọc tài liệu) · `P=<thư mục video>` (vd `workspace/content/YYYY-MM-DD/<slug>`; slug = tên thư mục) · `PY=python3` (macOS) hoặc `python` (Windows). Script nhận `--workspace $P` (mặc định thư mục hiện tại). Cần `whisper` CLI trong PATH (`pip install openai-whisper`) và `jinja2` (`pip install jinja2`).

0. **Kiểm đầu vào**: `$P` có `voiceover.mp3`, `source.mp4`, `script.txt`; `ffprobe` `source.mp4` dọc 720×1280. Thiếu → dừng, báo thiếu gì. Có tệp đầu ra cũ → luật 2. Xong khi: đủ 3 tệp vào.
1. **Chép lời**: `$PY $K/scripts/transcribe_audio.py --workspace $P` → `transcript.json` `[{text,start,end}]` theo từ. Xong khi: có từ, `end` cuối ≈ thời lượng MP3.
2. **Làm sạch**: `$PY $K/scripts/clean_transcript.py --workspace $P` → `transcript-cleaned.json` (bỏ U+FFFD, từ điển sửa lỗi tiếng Việt như `alphabit→Alphabet`, `Cod→Code`; không có `caption-groups.json` vì không mặc định phụ đề).
3. **Chia cảnh + kế hoạch**:
   - **Khuyến nghị**: chạy planner `mkt-plan-short-video-edit-16-9` trước (có `visual-plan.json`: variant, tier_letter, items, badges, ẩn dụ, `pip_events`). Có plan thì bỏ `detect_scenes.py`.
   - Không có plan: `$PY $K/scripts/detect_scenes.py --workspace $P` → `scenes-outline.json` (5 cảnh hook/problem/solution/recap/cta; ít hơn thì cảnh báo, tối thiểu 3). **Checkpoint**: in outline cho người dùng duyệt / sửa kicker, heading, variant (bỏ bằng `--auto`; luôn `--auto` khi đã có plan để khỏi hỏi hai lần). Quy tắc chọn variant: [pattern-selection.md](references/pattern-selection.md).
4. **Scaffold**: `$PY $K/scripts/scaffold_project.py --workspace $P` → `scenes.json` + chép `sfx/`, `assets/logos/`, `assets/avatar.jpg`, `compositions/yt-lower-third.html`.
   - Có `visual-plan.json` thì **chạy tiếp** `$PY $PL/scripts/apply_plan_to_scenes.py --workspace $P` (ghi lại `scenes.json` từ plan) — script scaffold tìm planner ở đường dẫn cứng của máy khác nên có thể không tự gọi.
   - Xong khi: `scenes.json` đúng số cảnh; `$P/sfx/` đủ 6 tệp.
5. **Fan-out sub-agent** viết `compositions/scene-{num}.html` (luật 3).
   - Mỗi sub-agent đọc khối cảnh của mình (`visual-plan.json`, hoặc `scenes.json` nếu chưa có plan), chọn mẫu hợp ẩn dụ rồi tự viết composition 1200×1080: CSS scoped `[data-composition-id="scene-{num}"]`, GSAP đăng ký `window.__timelines["scene-{num}"]`, không `!important`, không `image-slot`.
   - Đọc khi viết: [phase3d-fanout.md](../mkt-full-video-with-11-hyperframe-heygen-16-9/references/phase3d-fanout.md) (prompt mẫu + yêu cầu cứng) · [composition-patterns.md](../mkt-full-video-with-11-hyperframe-heygen-16-9/references/composition-patterns.md) (mẫu code) · [slide-design-tokens.md](../mkt-full-video-with-11-hyperframe-heygen-16-9/references/slide-design-tokens.md) (token thiết kế) · [visual-thinking-library.md](../mkt-plan-short-video-edit-16-9/references/visual-thinking-library.md) (25 ẩn dụ).
   - Logo ở `assets/logos/`; thiếu thì dùng avatar chữ (không vỡ).
   - Xong khi: `scene-1.html … scene-N.html` đủ, mỗi tệp có `data-composition-id` và `__timelines` khớp.
6. **Phụ đề (tuỳ chọn, mặc định bỏ qua khi chạy riêng)**: biên `captions.json` `[{"text","start","end"}]` từ `script.txt` → `uv run $K/scripts/generate_captions.py --workspace $P` → `compositions/captions.html`. Kiểu cố định (Inter 600 38px, viên thuốc tối viền violet, giữa đáy, z-index 28); đổi kiểu thì sửa `assets/templates/captions.html.j2`, không viết tay tệp ra.
7. **Gốc `index.html`**: `$PY $K/scripts/generate_root_index.py --workspace $P --brand-handle "<handle>" --brand-label "<nhãn>"` (thêm `--no-captions` / `--no-yt-lower-third` / `--yt-lower-third-duration 4.5` khi cần).
   - Ghi gốc 1920×1080: `#slide-bg`, `#heygen-bg`, `#avatar-frame` (viền claude-orange, `object-position: center 25%`), `source.mp4` + `a-source`, 6 SFX, brand mark, lớp b-roll `<img id="broll-N">` (opacity 0 cho đến khi có `N.png`), N slide-mount, timeline `goPIP`/`goSplit` + `PIP_EVENTS`, zoom Hybrid Hook (HOOK 1.0→1.10 → reset → BODY punch 1.06 → CTA 1.0→1.04), lower-third 3 s cuối nếu bật.
   - Chi tiết các lớp: [auto-baked-patterns.md](../mkt-full-video-with-11-hyperframe-heygen-16-9/references/auto-baked-patterns.md).
   - Xong khi: log in số mount = số cảnh, số PIP, số SFX.
8. **Lint + preview**: `$PY $K/scripts/lint_and_preview.py --workspace $P` (`npx hyperframes lint` phải 0 lỗi, rồi mở Studio, thường `http://localhost:3002`; `--no-preview` chỉ lint).
   - Lỗi phải sửa: `gsap_animates_clip_element` (chỉ animate `opacity` trên phần tử `clip`) · `root_composition_missing_data_start` (sub-comp cần `data-start="0"` trên div `[data-composition-id]` trong) · `media_missing_data_start` (`<audio>` SFX cần `data-start` tuyệt đối).
   - Xong khi: lint 0 lỗi + có URL Studio.

**Bàn giao** (dừng ở đây): báo `Studio URL` · cấu trúc (`index.html` 1920×1080, N composition 1200×1080, 6 SFX, số ảnh giấy kem đã có) · đã áp dụng (slide pane trái + khung avatar nổi phải, các cửa sổ PIP ở mốc tier-letter, zoom thở + punch-in, phụ đề bật/tắt) · "Refresh Studio để xem. Nói **render** khi OK, hoặc nói rõ chỗ cần chỉnh." Render là việc của orchestrator / người dùng.

## Lỗi đã gặp

| Triệu chứng | Cách sửa |
|---|---|
| PIP không nở / zoom giật / nghe tiếng nhân đôi | Luật 5, 6, 7. |
| Video bỗng có phụ đề | Có `compositions/captions.html` → xoá hoặc `--no-captions` (mặc định tự mount khi tệp tồn tại). |
| `scenes.json` mất `pip_events` của plan | Chạy `apply_plan_to_scenes.py` SAU `scaffold_project.py` (bước 4). |
| Lỗi lint / mặt cắt trán / ảnh `image-slot` còn sót ở dự án cũ | [kinh-nghiem.md](references/kinh-nghiem.md) (bảng đầy đủ); khung hình: [source-mp4-cropping.md](references/source-mp4-cropping.md); lịch PIP: [pip-event-scheduling.md](references/pip-event-scheduling.md). |

## Cải tiến skill

Gặp lỗi mới → ghi một dòng vào `references/kinh-nghiem.md` (đúng bảng) + một dòng *Nhật ký* cuối tệp đó; sửa đúng một chỗ, không rải ra nhiều tệp.

## Liên quan

Trước: `mkt-full-video-with-11-hyperframe-heygen-16-9` (TTS `mkt-elevenlabs-tts-to-mp3` + HeyGen `heygen-mp3-to-mp4` → giao thư mục) và `mkt-plan-short-video-edit-16-9` (`visual-plan.json`, `prompts.md`). Skill này không phụ thuộc quy trình của orchestrator, chỉ mượn tài liệu mẫu của nó. Sau: render + đăng (ngoài phạm vi).
