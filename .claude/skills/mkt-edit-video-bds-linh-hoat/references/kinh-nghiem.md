# Kinh nghiệm — mkt-edit-video-bds-linh-hoat

Chỉ ghi điều đã có trong skill hoặc đọc được từ script; không bịa lỗi, không bịa số đo.

## Nguồn gốc và vị trí

- Skill này trước nằm ở `.codex/skills/` (viết cho Codex) — Claude Code **không nạp** thư mục đó. Ngày 2026-11-11 đã `git mv` nguyên thư mục sang `.claude/skills/mkt-edit-video-bds-linh-hoat/`.
- `agents/openai.yaml` là cấu hình giao diện của Codex (`display_name`, `short_description`, `default_prompt` có cú pháp `$skill`). Claude Code bỏ qua tệp này; giữ nguyên, không ảnh hưởng.
- Thân SKILL.md cũ không có chỉ dẫn riêng cho Codex ngoài việc nhắc "skill `watch`" (không có trong repo này) — đã thay bằng ffmpeg + Whisper cục bộ.

## Điều cần nhớ

- Kho tư liệu mẫu của repo: `workspace/kho-tư-liệu-bất-động-sản/` (có `03_âm-thanh/danh-mục-hiệu-ứng.json`, `chỉ-mục-media.json`, `thư-viện-media.sqlite`); thư viện SFX: `workspace/sfx-realestate/`. Tên thư mục có dấu Unicode — script xử lý được, nhưng bọc đường dẫn trong dấu nháy kép khi gõ lệnh.
- `thu_thap_phoi_canh.py` chỉ tải URL ảnh trực tiếp đã được người chạy xác minh; script không tự đoán website nào là chính thức. Mặc định không ghi đè file đã có (`--ghi-de` mới đè).
- Script kiểm (`kiem_tra_ke_hoach_dung.py`) ở chế độ không `--strict` chỉ cảnh báo các lỗi nhãn / `minh_hoa`; `--strict` biến chúng thành lỗi.
- Mọi khoảng thời gian trong reference (lead 40–120 ms, zoom 1.03–1.10…) là dải điều chỉnh, **không phải quota**.

## Nhật ký

- 2026-11-11 — chuyển từ `.codex/skills/` sang `.claude/skills/` và tối ưu theo chuẩn skill video (v1.1): thêm bảng Đầu vào → Đầu ra, luật cổng duyệt / không bịa số / tải ảnh web / báo số đo thật, quy trình 8 bước có biến đường dẫn (`K`, `W`, `KHO`) và "xong khi", bảng lỗi lấy từ thông báo thật của script kiểm, bỏ nhắc skill `watch`, thêm `description` loại trừ + `argument-hint`.
