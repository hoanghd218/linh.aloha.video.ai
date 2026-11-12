# Kinh nghiệm — mkt-hyperframe-heygen-bds-proof-first-9-16

Chỉ ghi điều đã có trong skill hoặc đọc được từ script; không bịa lỗi, không bịa số đo.

## Nguồn gốc và vị trí

- Skill này trước nằm ở `.codex/skills/` (viết cho Codex) — Claude Code **không nạp** thư mục đó. Ngày 2026-11-11 đã `git mv` nguyên thư mục sang `.claude/skills/mkt-hyperframe-heygen-bds-proof-first-9-16/`.
- `agents/openai.yaml` là cấu hình giao diện của Codex (`default_prompt` có cú pháp `$skill`). Claude Code bỏ qua tệp này; giữ nguyên.
- Trong `references/media-plan.schema.json` trường `$id` trước là địa chỉ giả `https://local.codex/…`; đã đổi thành `https://linh.aloha.local/schemas/media-plan.schema.json` cho cùng kiểu với schema của `mkt-edit-video-bds-linh-hoat` (script không đọc `$id`, không ảnh hưởng kiểm).

## Điểm lệch cần nhớ

- **Hai đường tạo A-roll HeyGen.** Bản gốc chỉ có đường A: nạp skill `heygen-video` (bộ HeyGen chính hãng, Video Agent: `group_id`, Frame Check, prompt "ý tưởng, không phải lời nguyên văn"). Skill đó **không có trong repo** nên SKILL.md thêm đường B bằng skill có sẵn (`mkt-elevenlabs-tts-to-mp3` → `heygen-mp3-to-mp4`). Đường nào làm mặc định là việc Hoàng / người điều phối chốt.
- **Quy tắc format và brand có chỗ lệch** (chưa giải quyết, cần Hoàng chốt):
  1. `heygen-segment-prompts.md` dặn hook không chào, không xưng tên; `mkt-linh-aloha-bds-video-script` đặt chữ ký "Aloha anh chị, em Linh đây" ngay sau cú đấm của hook.
  2. Cùng tệp dặn CTA đúng một hành động, không xếp chồng điện thoại / inbox / bình luận / theo dõi; CTA chuẩn của brand là "inbox hoặc gọi em Linh Aloha theo hotline".
  3. `proof-first-format.md` cho hiện giá (có nguồn) đúng câu nói; skill kịch bản brand dặn không quote con số giá trong video, đẩy về inbox / hotline.
- **Pexels:** `.env` / `.env.example` không có biến Pexels; kho Pexels local và kho video / ảnh thật là đường dẫn ngoài repo (`inventory_media.py` nhận qua `--real-video-dir`, `--real-image-dir`, `--pexels-dir`, `--project-dir`).
- **Validator** (`validate_media_plan.py`) trả mã thoát 1 khi có `errors`; ghi `status: PASS|FAIL`, `ratios`, `role_counts`, `errors`, `warnings` ra `--report`. Không `--strict` thì chấp nhận `inventory://…`; `--strict` đòi `asset_id` và `asset_path` tồn tại hoặc `source_url` hợp lệ.
- `media-plan.json` phải có `format: "proof-first-9-16"` và `duration_s > 0`.

## Nhật ký

- 2026-11-11 — chuyển từ `.codex/skills/` sang `.claude/skills/` và tối ưu theo chuẩn skill video (v1.1): thêm bảng Đầu vào → Đầu ra, đưa 10 luật cứng + 2 luật mới (khoá `.env`, brand, báo số đo thật) lên đầu, thay `$SKILL` bằng biến `K`, quy trình 9 bước có "xong khi", bảng lỗi lấy từ thông báo thật của validator; thêm đường B cho A-roll (skill `heygen-video` không có trong repo); sửa `$id` schema; thêm ghi chú đầu `references/heygen-segment-prompts.md`.
