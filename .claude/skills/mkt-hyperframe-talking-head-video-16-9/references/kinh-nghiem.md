# Kinh nghiệm — dựng project 16:9 từ MP4 talking-head

Đọc khi: gặp lỗi lint / lỗi hình trong preview, hoặc trước khi chạy lại một project cũ. Lỗi mới → thêm một dòng vào bảng đúng nhóm + một dòng *Nhật ký* cuối tệp. Chỉ ghi điều đã gặp thật.

## Lỗi hình, PIP, avatar

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| PIP không nở được, slide kẹt ở 1200 | `!important` trên `width` của slide-mount → dùng `width: 1200px` thường để GSAP animate lên `1920px` trong `goPIP()`. |
| Composition không phủ đầy mount khi mount nở | Gốc `[data-composition-id="<id>"]` dùng `width: 100%; height: 100%` (không pixel cố định). |
| Zoom thở đánh nhau với tween PIP (giật) | Đừng scale `#avatar-frame` trực tiếp. Dùng 2 lớp bọc lồng nhau trong khung: `.avatar-breathing` + `.avatar-punch`. |
| Hai PIP chồng nhau / PIP đụng chuyển cảnh | `goSplit(t_out)` phải đứng **trước** `goPIP` của cảnh sau. Chồng nhau thì lệnh cuối thắng (`overwrite: 'auto'` đã đặt). Chi tiết: `pip-event-scheduling.md`. |
| Nghe tiếng avatar bị nhân đôi, như robot | Mount cả `voiceover.mp3` lẫn `source.mp4`. Chỉ mount `<audio data-start="0" src="source.mp4">`; `voiceover.mp3` giữ làm tư liệu. |
| SFX át giọng | Vol trên 0,4. Giữ 0,18–0,32. |
| Mặt avatar bị cắt trong PIP / SPLIT | Chỉnh `object-position` (15% · 25% mặc định · 35%) — xem `source-mp4-cropping.md`; nếu vẫn xấu thì render lại HeyGen khung chặt hơn. |
| Glow PIP lệch màu với avatar | Chỉnh `boxShadow` trong khối `goPIP()` sang màu trung tính. |

## Lỗi lint, dữ liệu, tệp

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| Lint `composition_self_attribute_selector` | Chỉ là cảnh báo thông tin về selector scoped `[data-composition-id="..."]` — template cố ý dùng, KHÔNG refactor. |
| Lint `gsap_animates_clip_element` | Chỉ animate `opacity` trên phần tử `clip`. |
| Lint `root_composition_missing_data_start` | Sub-composition cần `data-start="0"` trên div `[data-composition-id]` bên trong. |
| Lint `media_missing_data_start` | `<audio>` SFX cần `data-start` tuyệt đối. |
| Có `compositions/captions.html` ngoài ý muốn → video có phụ đề | `generate_root_index.py` tự mount khi tệp tồn tại (mặc định `--captions`). Xoá/di chuyển tệp hoặc chạy với `--no-captions`. (SKILL.md bản cũ ghi "KHÔNG phụ đề, đừng thêm captions.html" — sai so với script; xem Nhật ký.) |
| Còn `image-slot` / `infographic-slot` trong `compositions/` (dự án chạy bằng `scaffold_infographic_slots.py` cũ) | Bóp ảnh 16:9 vào ô nhỏ. Cho mỗi composition một sub-agent dọn `image-slot` và dàn lại phần trống; ảnh chuyển sang lớp gốc `#broll-N`. |
| Chạy `whisper` ra bản dịch tiếng Anh thay vì chép | Dùng nhầm model `.en` (vd `medium.en`). Luôn `--language vi`, model không đuôi `.en`. |
| `scaffold_project.py` ghi đè `scenes.json` bằng nội dung mặc định | Có `visual-plan.json` nhưng script không tìm thấy `apply_plan_to_scenes.py` (nó tìm ở thư mục home của máy khác) → quay về tự điền từ `scenes-outline.json`. Cách né: chạy `apply_plan_to_scenes.py` của planner SAU `scaffold_project.py`. |
| `detect_scenes.py` hỏi checkpoint lần hai | Đã có outline/plan từ planner → chạy `detect_scenes.py --auto` (hoặc bỏ qua bước này khi đã có `visual-plan.json`). |

## Mẫu tham khảo

Dự án 16:9 gốc dùng để đối chiếu là `loi-ich-claude-ai` (2026-05-08, 5 cảnh) — nằm ở máy tác giả cũ, **không có trong repo này**; không thể dùng để tái tạo hay so khớp từng dòng. Khi cần đối chiếu thì dựa vào `references/` của skill orchestrator.

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): SKILL.md 420 → gọn, dời cấu trúc thư mục/schema/SFX/logo sang `references/scenes-schema.md`, dồn pitfalls sang tệp này; sửa đường dẫn tới tài liệu của skill khác (`composition-patterns.md`, `slide-design-tokens.md`, `visual-thinking-library.md` nằm ở skill orchestrator / planner); thay lệnh `~/.claude/skills/...` và đường dẫn tuyệt đối theo máy bằng biến; thống nhất phụ đề: mặc định tắt khi chạy riêng (chỉ bật khi đã chạy `generate_captions.py`), khác bản cũ ghi "không bao giờ có phụ đề"; thêm cổng hỏi trước khi ghi đè project đã có.
