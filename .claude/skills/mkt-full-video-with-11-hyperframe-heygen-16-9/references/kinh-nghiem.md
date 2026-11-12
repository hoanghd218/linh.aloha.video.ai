# Kinh nghiệm — orchestrator video ngang 16:9

Đọc khi: gặp lỗi ở Phase 3 hoặc trước khi chạy lại một video cũ. Mỗi lỗi mới → thêm một dòng vào bảng đúng nhóm + một dòng vào *Nhật ký* cuối tệp (sửa đúng một chỗ). Chỉ ghi điều đã gặp thật.

Lỗi HeyGen (OAuth, tool not found, `HEYGEN_AVATAR_LOOKS` còn là stub, 402 hết ví, Avatar V/IV) → xem bảng lỗi của skill `heygen-mp3-to-mp4`, không chép lại ở đây.

## Lỗi dựng composition và gốc `index.html`

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| Ảnh giấy kem bị bóp vào ô nhỏ trong slide | Sub-agent nhúng `<div class="image-slot">` → KHÔNG. Ảnh chỉ ở lớp gốc `<img id="broll-N">`; prompt sub-agent phải ghi rõ "không nhúng image-slot". |
| Mọi cảnh na ná nhau, nội dung không liên quan script | Spawn sub-agent thẳng từ `visual-plan.json` thô của planner (chứa nội dung giữ chỗ: "Soạn email", "8h vs 0h", ẩn dụ `robot-orb-with-tasks`) → bắt buộc sửa tay 5 trường mỗi cảnh (Bước 3c trong SKILL.md) trước khi fan-out. |
| Cảnh bị ghi đè nhau ở listicle 6+ cảnh | Dùng `generate_compositions.py` (deprecated) → luôn dùng fan-out sub-agent; `generate_root_index.py` mount `scene-{num}.html` cho mọi cảnh. |
| PIP không nở rộng được | `!important` trên `width` của `slide-mount > [data-composition-id]` → bỏ `!important`, để `width: 100%`; GSAP cần animate `.slide-mount`. |
| Mặt avatar bị cắt trán | `object-position: center 25%` (mặc định); chỉnh 20%–30% nếu avatar HeyGen khác chiều cao. Không có lint bắt — xem preview. |
| Viền khung avatar màu trắng | Mặc định phải claude-orange `#d97757` (3px + halo 6px + glow 80px), không phải `rgba(255,255,255,0.08)`. |
| Glow PIP (violet) đánh nhau với glow SPLIT | Thêm `overwrite: 'auto'` vào mọi tween đổi `boxShadow` của `#avatar-frame`. |
| Dùng Tailwind / Lucide trong composition | KHÔNG — composition dùng CSS tay, scoped theo `[data-composition-id]`. Tailwind/Lucide chỉ dành cho skill landing. Emoji làm icon trong tier-row thì được (Chromium của HyperFrames render đúng). |
| Lint fail vì thiếu `data-duration` | Mọi `<video>`, `<audio>`, `<div class="clip slide-mount">`, `<div class="clip brand-mark">` đều cần `data-duration`. |
| Timeline không chạy | `window.__timelines[<key>]` phải trùng `data-composition-id` của div gốc: `window.__timelines["scene-N"]` cho `data-composition-id="scene-N"`. |
| PIP_EVENTS chồng nhau | Tách ≥ 0,3 s giữa một `out` và `in` kế tiếp (ưu tiên ≥ 0,5 s). |
| Ảnh `N.png` báo `temporary_model_error` khi sinh | Skill sinh ảnh `image-post-creator` (AI33 / `-p nano` dùng `GEMINI_API_KEY`) **không có trong repo này** — chế độ `infographic=now` chưa chạy được; xem Bước 3h trong SKILL.md. Cắt prompt ≤ ~2000 ký tự nếu dùng AI33. |

## Lỗi quy trình, dữ liệu trung gian

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| `plan_visuals.py` báo `Neither transcript-cleaned.json nor transcript.json found` | Chưa chạy bước chép lời. Dùng `scripts/transcribe_audio.py` của skill editor — ra `transcript.json` dạng phẳng `[{text,start,end}]`. Các script hạ nguồn (`plan_visuals.py`, `detect_scenes.py`, `clean_transcript.py`) đọc khoá **`text`**, không phải `word` — bản cũ của SKILL.md hướng dẫn làm phẳng `voiceover_segments.json` thành `{word,start,end}` là sai khoá. |
| Không tìm thấy `voiceover_segments.json` / `transcribe_mp3.py` | Skill `heygen-short-video` (nơi có `scripts/transcribe_mp3.py`) và `extract.py` đều không có trong repo; `mkt-ai-video-extract-srt-segment` chỉ trỏ sang skill thiếu đó. Phụ đề: dùng `captions.json` biên tay từ `script.txt`. |
| `scaffold_project.py` ghi đè `scenes.json` bằng nội dung mặc định, mất `pip_events` của kế hoạch | Script tìm `apply_plan_to_scenes.py` ở đường dẫn cứng trong thư mục home của máy khác (`claudeclaw-os`, `hoang-ai-marketing`, `~/.claude/skills`) — không có thì quay về scaffold thủ công từ `scenes-outline.json`. Cách né: chạy `scaffold_project.py` TRƯỚC rồi `apply_plan_to_scenes.py` SAU (script này chỉ đọc `visual-plan.json` và ghi `scenes.json`, chạy lại an toàn). |
| `plan_visuals.py --brand chatgpt` lỗi argparse | `--brand` chỉ nhận `claude` · `deepseek` · `openai` · `gemini` · `generic`. (`chatgpt` / `claude-code` chỉ là tên logo, không phải giá trị `--brand`.) |
| Sau `cd workspace/...` lệnh kế tiếp báo không có tệp | `cd` trong Bash tool giữ cwd qua các lệnh sau. Dùng đường dẫn tương đối từ gốc repo, hoặc `cd … && lệnh` trong cùng một lần gọi. |
| Vòng poll trong zsh sập `read-only variable: status` | `status` là biến chỉ-đọc của zsh. Đặt tên khác: `vstate`, `phase`, `ready`. |
| Chạy song song Whisper `medium` + HeyGen làm CPU nghẽn | Xem `troubleshooting.md` (cùng thư mục): đo thử, nếu không nhanh hơn thì chạy tuần tự. |

## Mẫu tham khảo (không có trong repo này)

Hai project production của bản gốc dùng để đối chiếu kiến trúc 16:9: `5-meo-tiet-kiem-claude-token` (2026-05-09; listicle 7 cảnh, fan-out sub-agent, tên `scene-{num}.html`, viền claude-orange) và `loi-ich-claude-ai` (2026-05-08; project 5 cảnh đầu tiên). Cả hai nằm ở máy tác giả cũ — không thể mở để so khớp. `composition-patterns.md` ghi các mẫu này "đã chạy thật"; khi cần đối chiếu, dựa vào chính `references/` này.

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): SKILL.md 745 → gọn, dồn Auto-baked / Fan-out / Pitfalls sang `references/`; tạo `references/elevenlabs-audio-tags.md` (từ phần tóm tắt inline có sẵn, trước đó thiếu tệp); bỏ các đường dẫn tuyệt đối theo máy của tác giả cũ (thư mục home, repo khác); Phase 2 gọi skill `heygen-mp3-to-mp4` thay vì chép lại; thêm cổng xác nhận trước khi tốn credit; chép lời dùng `transcribe_audio.py` (khoá `text`); đổi thứ tự scaffold → apply_plan; thống nhất phụ đề mặc định BẬT khi đã chạy `generate_captions.py`.
