# Kinh nghiệm — engine kịch bản đa profile

Đọc khi thêm profile mới, hoặc khi hai skill kịch bản cho kết quả lệch nhau. Gặp lỗi mới → thêm một dòng vào đúng mục + một dòng *Nhật ký*. Chỉ ghi điều có thật.

## Hai skill kịch bản cùng nói về Linh Aloha

- Trước 2026-11-11, `mkt-linh-aloha-bds-video-script/references/brand-voice.md` và `profiles/linh-aloha/brand-voice.md` là **hai bản y hệt từng byte** (cặp `script-formats.md` ↔ `script-formulas.md` cũng vậy; mẫu `brief` lệch nhau ở checklist và footer). Sửa một bản mà quên bản kia thì hai skill viết ra hai giọng khác nhau.
- Quy ước hiện tại: bản chuẩn ở skill chủ `mkt-linh-aloha-bds-video-script`; ba tệp của profile `linh-aloha` là tệp **trỏ về**, riêng `topic-pool.md` là tệp thật (skill chủ không có kho chủ đề). Bản cũ còn trong lịch sử git.
- Hai skill lệch nhau ở các giá trị sau — khi chạy profile `linh-aloha` thì theo skill chủ:

  | Giá trị | `mkt-linh-aloha-bds-video-script` | `mkt-vn-short-video-script` (mặc định chung) |
  |---|---|---|
  | Thời lượng | 40–90 giây, mặc định ~60 | 60–120 giây, mặc định ~90 |
  | Nhịp đọc | ≈ 3.5 tiếng / giây | 3.3 (chậm) hoặc 3.6 tiếng / giây |
  | Hook | A + 2–3 hook thay thế | A + 2 hook thay thế |

## Footer `tts_provider`

- Skill này ghi footer vào `brief.md`; skill chủ cũng ghi (mẫu `brief` đã được gộp ngày 2026-11-11).
- Các orchestrator `mkt-full-video-with-11-*` mô tả `tts_provider` là tham số đầu vào (mặc định `elevenlabs`, "dùng minimax" thì đặt `minimax`); chưa thấy đoạn nào parse footer. Chưa kiểm chứng việc orchestrator đọc footer — đừng giả định.

## Đầu ra

- `output/<profile>/scripts/<slug>/` nằm trong `.gitignore` (thư mục `output/`). Orchestrator tạo workspace riêng `workspace/content/YYYY-MM-DD/<slug>/` rồi chép `script.txt` vào đó — kịch bản không tự sang workspace.

## Nhật ký

- **2026-11-11 — tối ưu theo chuẩn skill video (v1.1):** viết lại `SKILL.md` theo bố cục Đầu vào → Đầu ra / Luật / Quy trình / Lỗi / Liên quan (180 → 114 dòng); thêm bảng *Chọn skill kịch bản nào* và làm rõ ranh giới trong `description` (trigger riêng của Linh Aloha chuyển sang skill chủ); gộp ba tệp trùng của profile `linh-aloha` thành tệp trỏ về skill chủ; thêm luật cổng duyệt, không bịa số, báo số thật; sửa lại mục *Thêm profile mới* (không còn `cp -r` từ profile trỏ-về); ghi rõ footer `tts_provider` chưa được orchestrator parse.
