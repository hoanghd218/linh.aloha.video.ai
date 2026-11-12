# Kinh nghiệm — mkt-hyperframe-talking-head-video

Chỉ ghi điều đã có trong skill / repo này. Gặp lỗi mới → thêm một hàng vào bảng và một dòng vào *Nhật ký*. Bản đầy đủ từng lỗi (mã, cách sửa) nằm ở `pitfalls.md` (12 mục).

## Lỗi hay gặp

| Triệu chứng | Nguyên nhân | Cách sửa (mục trong `pitfalls.md`) |
|---|---|---|
| Studio chạy video nhưng caption không hiện | Caption container căn giữa bằng `transform: translate(-50%, 0)`; GSAP animate `y` ghi đè transform → caption lệch ra ngoài bên phải | Container `left: 0; right: 0; text-align: center` + `.text` inline-block (#1) |
| Caption có nhưng bị cảnh nền tối che | Captions không mount ở track cao nhất | Mount captions cuối cùng: `data-track-index="60"` + `style="z-index: 100;"` (cảnh lesson/recap/cta ở track 40–47) |
| Caption lệch dần, giữa video lệch 5s+ | Sửa tay chữ rồi lỡ sửa luôn `start`/`end` | Không sửa timing; sửa chữ bằng `clean_transcript.py` / `fix_caption_typos.py` hoặc chỉ trường `text` trong `caption-groups.json` rồi `inject_captions.py` lại (#2) |
| Lint `gsap_animates_clip_element` | `tl.set(..., { visibility })` trên phần tử `class="clip"` | Chỉ animate `opacity` và transform (#3) |
| Cảnh con không chạy animation | Chưa đăng ký `window.__timelines`, hoặc div trong thiếu `data-start="0"` | Đăng ký timeline; thêm `data-start="0"` (#4) |
| Cảnh con mount đúng giờ nhưng trống | Cảnh con nạp bằng `data-composition-src` thiếu `<template>` (hoặc `index.html` gốc lại bọc `<template>`) | Gốc: `<div data-composition-id="root">` không template; cảnh con: `<template id="…"><div data-composition-id="…">…</div></template>` (#5) |
| 3 giây đầu cảnh che mất mặt | Hook làm toàn màn hình (`inset: 0`) | Hook là overlay nhỏ phía trên (cách đỉnh ~170–180px, rộng 880px) (#6) |
| Zoom punch lúc b-roll rời đi nhảy mạnh | `tl.fromTo()` đặt giá trị đầu NGAY — cố ý: b-roll đang che mặt lúc nhảy | Giữ nguyên; nếu không muốn: `tl.set("#v-source", {scale:1.10}, t-0.001)` rồi `tl.to(..., {scale:1.0, duration:0.55, ease:"power3.out"}, t)` (#7) |
| SFX không phát trong Studio | Đường dẫn sai, thiếu tệp trong `sfx/`, hoặc `data-volume` = 0 | `ls <project>/sfx/`; `<audio src="sfx/…">` tương đối từ gốc project; `data-volume` 0.15–0.35 (#8) |
| Whisper ra tiếng Anh | Dùng model `.en` (dịch thay vì phiên âm) | `--model medium --language vi` (#10) |
| Render cảnh báo "Asset load failure: 404" cho `caption-overrides.json` | Cảnh báo không chặn: HyperFrames tuỳ chọn kiểm tệp này | Bỏ qua; MP4 vẫn đúng; muốn hết cảnh báo thì tạo tệp `caption-overrides.json` rỗng (#11) |

## Điều cần biết khi đọc skill này

- `clean_transcript.py` KHÔNG sửa tại chỗ: nó ghi `transcript-cleaned.json` và `caption-groups.json` cạnh `transcript.json` (bản cũ của SKILL.md ghi nhầm "in-place").
- Thư mục output mặc định là `workspace/content/YYYY-MM-DD/<slug>/` (cùng `mkt-full-video-with-11-hyperframe-heygen` và `mkt-hyperframe-knowledge-video-heygen-9-16-lite`); chỗ cũ ghi `workspace/video-projects/<slug>/` đã đổi.
- Project mẫu `workspace/video-projects/3-bai-hoc/` (nhắc trong `pitfalls.md`) KHÔNG còn trong repo; cấu trúc đầu ra mong muốn xem `assets/templates/` và mục *Đầu vào → Đầu ra* của SKILL.md.
- Thư viện SFX `workspace/assets/reels/sfx/` (nhắc trong `sfx-library.md`) không có trong repo; chỉ dùng 6 tệp ở `assets/sfx/` của skill này. Các SFX "thay thế" liệt kê trong `sfx-library.md` (Wow, tada, boom…) không có sẵn.
- Script `generate_rich_brolls.py` và `generate_infographic_brolls.py` sinh b-roll cố định cho video "6 AI business" cũ — chưa dùng trong quy trình hiện tại; `scaffold_project.py` là bộ sinh cũ (không khuyến khích).
- `align_to_script.py` có sẵn nhưng SKILL.md trước đây không nhắc: dùng `script.txt` làm nguồn sự thật cho chữ, giữ timing Whisper; chạy sau `clean_transcript.py`.

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): SKILL.md 413 → 122 dòng; description 1182 → 888 ký tự kèm ranh giới với `mkt-hyperframe-luxury-realestate-9-16` / `mkt-hyperframe-knowledge-video-heygen-9-16-lite`; thêm `scenes-schema.md`, `kinh-nghiem.md`; sửa thư mục output cho thống nhất, sửa mô tả đầu ra của `clean_transcript.py`, bỏ trỏ tới skill `mkt-create-script-short-video` không tồn tại.
