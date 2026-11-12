# Kinh nghiệm — mkt-hyperframe-luxury-realestate-9-16

Chỉ ghi điều đã có trong skill / repo này. Gặp lỗi mới → thêm một hàng vào bảng và một dòng vào *Nhật ký*.

## Lỗi hay gặp (bỏ qua các mục đầu là render ra ĐEN)

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Overlay không hiện / render ra khung đen | CSS dùng selector `#overlay-01` — runtime HyperFrames gỡ attribute `id` của root composition lúc mount nên selector không khớp | Luôn dùng `[data-composition-id="overlay-01"] { ... }`. Lint gợi ý `#id` là gợi ý sai; làm theo mẫu chạy được |
| Ảnh 404 lúc render | Tên tệp có dấu tiếng Việt / dấu cách (`broll/Ảnh facade dự án.jpg`) | Đổi sang ASCII (`broll/facade.jpg`) trước khi tham chiếu |
| Hình SVG inline bị tô đặc | `fill: none` chỉ khai trong CSS; đường render của Chrome không luôn cascade xuống phần tử con SVG | Đặt thuộc tính `fill="none"` trực tiếp lên từng `<rect>`, `<path>`, `<circle>`, `<line>` |
| Overlay sai cỡ / bị cắt | Root div thiếu `data-width="1080" data-height="1920"`, hoặc mount không khoá kích thước | Root có cả hai attribute + CSS `width:100%; height:100%; position:relative; overflow:hidden`; thêm CSS khoá `.overlay-mount, .broll-mount` (xem `index-scaffold.md`) |
| Mount trống | Quên bọc root trong `<template id="overlay-XX-template">` | HyperFrames nhân bản nội dung template khi mount — bắt buộc có |
| Animation không chạy lúc render | Thiếu `paused: true`, hoặc chưa đăng ký `window.__timelines['id'] = tl`, hoặc dựng ngoài `document.fonts.ready.then(run)` | `gsap.timeline({ paused: true })` + đăng ký + dựng trong `run()` |
| Chữ cụt hai cạnh ("HỢP LÝ HƠN!" chỉ thấy phần giữa) | Be Vietnam Pro 900 cỡ 150–200px tràn canvas ở ~10 ký tự | `max-width: 960px` + `fitText()` + `word-break: keep-all` (xem `overlay-template.md`) |
| Zoom nhảy mạnh / lộ viền | Đỉnh zoom ≥ 1.15 | Đỉnh 1.04–1.10 (xem `zoom-hooks.md`) |
| Hai chữ punch đè nhau | Cùng z-index, vị trí trùng | Đổi `top` / `bottom` giữa các overlay liên tiếp hoặc so le thời gian |
| Chữ vào chậm, nhìn "editorial" | Easing mềm (`power3.inOut`), scale đầu 0.9 | `back.out(2)` trở lên (`back.out(2.4)` cho giá), scale đầu 0.6–0.7 (xem `text-effects.md`) |

## Điều cần biết khi đọc skill này

- Tên "luxury-realestate" là tên cũ: bản editorial sang trọng (split-screen, Cormorant Garamond, champagne) đã bị thay ngày 2026-05-16 bằng Broker-Creator Punchy. Không đổi tên thư mục vì orchestrator và README đang gọi theo tên.
- `text-effects.md` (phần zoom) và `design-tokens.css` (phần `--zoom-peak-*`) từng ghi đỉnh zoom tới 1.20–1.22; đã chỉnh về luật hiện tại (≤ 1.10). Nếu thấy số cũ ở nơi khác, coi là lỗi thời.
- Mẫu cũ trong `variants.md` chưa có `fitText()` — luôn áp luật chống tràn chữ trong `overlay-template.md`.
- Kho SFX `workspace/assets/01_Sound Bất động sản/` hiện thiếu 6 trong 13 tệp theo thiết kế (danh sách ở `sfx-bds.md`).

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): SKILL.md 605 → 116 dòng; tách `overlay-template.md`, `index-scaffold.md`, `zoom-hooks.md`, `broll-inserts.md`, `sfx-bds.md`, `kinh-nghiem.md`; làm rõ ranh giới với `mkt-hyperframe-talking-head-video` và `mkt-hyperframe-knowledge-video-heygen-9-16-lite`; chuyển bảng SFX BĐS từ orchestrator về đây (kèm cột tệp có/không); sửa đỉnh zoom lỗi thời trong `design-tokens.css` / `text-effects.md`.
