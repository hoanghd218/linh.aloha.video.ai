# Kinh nghiệm — mkt-full-video-with-11-hyperframe-heygen

Chỉ ghi điều đã có trong skill / repo này. Gặp lỗi mới → thêm vào *Điều cần biết* hoặc *Nhật ký*; bảng lỗi vận hành ở SKILL.md mục *Lỗi đã gặp / Kiểm*.

## Điều cần biết khi đọc skill này

- **Agent Phase 3 từng lệch hợp đồng với skill này.** Bản agent cũ chạy luồng "scene infographic" của `mkt-hyperframe-talking-head-video` (`scenes.json`, `auto_scenes`, chia đôi màn hình, 6 SFX, phiên âm `source.mp4`), trong khi skill này gọi nó với luồng broker-creator (`overlays.json`, `auto_overlays`, avatar full-frame, `audio_source` + `source_mp4_pending`). Từ 2026-11-11 hai bên dùng chung một bảng tham số + tên tệp (xem *Hợp đồng Phase 3*). Muốn luồng infographic chia đôi màn hình thì dùng trực tiếp `mkt-hyperframe-talking-head-video` trên `source.mp4` đã có.
- **Kho SFX BĐS:** bản cũ ghi nguồn `workspace/assets/01_Sound Bat dong san/` (không dấu) với 13/14 tệp và bảng trong chính SKILL.md. Thư mục thật là `workspace/assets/01_Sound Bất động sản/` và hiện chỉ có 9 tệp (7 trong bảng 13 tệp + `ting.mp3`, `Whoosh sound effect (1).mp3`). Bảng đầy đủ, cột tệp có / thiếu, luật ghép và lệnh copy nay nằm ở `mkt-hyperframe-luxury-realestate-9-16/references/sfx-bds.md` (nguồn duy nhất). Việc copy SFX giao cho agent Phase 3, không còn copy ở Step 0.
- **Mật độ SFX:** skill này ghi tối đa 6 lần phát / video 60s; bản cũ của skill luxury ghi "mỗi chữ punch ghép một SFX" (12–20 SFX), và `mkt-hyperframe-knowledge-video-heygen-9-16-lite` ghi 10–16 hit / video 60–90s (cấu trúc khác). Chưa có số đo nào quyết định số nào đúng — đã thống nhất theo ≤ 6 cho pipeline này, Hoàng có thể chỉnh.
- **`header_label` / `footer_handle` mặc định:** agent cũ mặc định `"VIDEO"` / `"@tranvanhoang.com"` (thương hiệu khác). Nay không truyền thì bỏ header pill / brand mark (luxury ghi hai thứ này là tuỳ chọn).
- **`TodoWrite`:** agent cũ liệt kê công cụ này, nhưng Claude Code hiện mặc định dùng bộ `TaskCreate/TaskUpdate` trên các model mới; agent nay không phụ thuộc vào nó.
- **HeyGen upload:** bản cũ trỏ `scripts/upload_asset.py` (không tồn tại ở skill này). Script thật: `.claude/skills/heygen-mp3-to-mp4/scripts/upload_asset.py` — do skill `heygen-mp3-to-mp4` quản, skill này chỉ gọi skill đó.
- **Dự án mẫu** `workspace/content/2026-05-16/cao-xa-la-bloom/` và thư mục `workspace/content/` không có trong repo (không commit).
- `workspace/sfx-realestate/README.md` (ngoài skill) nói pipeline dùng 4 SFX và thư mục đó đã bỏ — lỗi thời so với skill này.

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): SKILL.md 334 → 227 dòng; description 1160 → 892 ký tự kèm "Không dùng cho…"; thêm bảng *Chọn đúng skill* và *Đầu vào → Đầu ra*; thêm cổng 0 (xác nhận trước khi tốn credit TTS) bên cạnh cổng MP3 / chữ nhấn / render; đồng bộ hợp đồng Phase 3 với agent `mkt-full-video-phase3-packager` (cùng tên tham số, tên tệp, luồng overlay); chuyển bảng SFX BĐS và mô tả thẩm mỹ sang `mkt-hyperframe-luxury-realestate-9-16`; sửa trỏ `upload_asset.py` và đường dẫn kho SFX; cập nhật `evals/evals.json` theo tên tệp mới; sửa SKILL.md tự mâu thuẫn "13 / 14 tệp SFX".
