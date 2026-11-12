# Kinh nghiệm — Remotion apartment-detail

Đọc khi gặp lỗi hoặc trước lần chạy mới. Gặp lỗi mới → thêm một dòng vào bảng *Lỗi hay gặp* ở SKILL.md (hoặc mục bên dưới nếu dài) + một dòng *Nhật ký*. Lỗi chung với skill cha: `../mkt-full-video-with-11-remotion-heygen/references/kinh-nghiem.md`.

## Chưa khớp — ghi 2026-11-11 (chưa sửa vì ngoài phạm vi hoặc cần quyết)

1. **`validate.py` trước đây không biết `scene-*`.** Chạy trên chính `workspace/remotion-project/public/overlays-apartment.json` báo 7 lỗi `unknown variant`. Đã mở rộng trong skill cha (5 scene + kiểm số phần tử + cảnh báo scene < 4 giây). Sau sửa: tệp đó 0 lỗi, 12 cảnh báo (khoảng cách zoom hook > 4 giây; 10 cue SFX).
2. **`init_project.sh` không đồng bộ `overlays-apartment.json`.** Script chỉ chép `overlays.json` (+ bản `overlays-general.json`). Tuỳ chọn `--template` có nhánh `*Apartment*` nhưng không có thư mục template nào tên đó → không dùng được. Hiện chép tay bằng `cp` (bước 3 SKILL.md). Đề xuất: thêm một khối chép `overlays-apartment.json` vào script.
3. **`init_project.sh` thay cả `public/broll/` bằng `$W/broll/`** (xoá bản cũ), không tạo `public/broll/<slug>/`. Bản cũ của skill viết "init tạo thư mục theo slug" — sai. Mẫu `overlays-apartment.json` thực tế dùng `broll/<tên>.jpg` phẳng (không `<slug>/`), chưa theo luật 8; component có đường lùi: tên trần → `broll/<tên>`.
4. **Template chuẩn ở skill cha chưa có** composition `BdsApartmentDetail` và 5 component `Scene*` (chỉ có ở `workspace/remotion-project/`). Máy mới chạy `init_project.sh` lần đầu sẽ chép template cũ.
5. **Chưa có agent Phase 3 riêng cho căn hộ**; agent Phase 3 của skill cha (`mkt-full-video-phase3-remotion-packager`) cũng chưa có trong `.claude/agents/` lúc kiểm. Hiện gọi `general-purpose` + [phase3-prompt-template.md](phase3-prompt-template.md).
6. **Tên SFX cũ không tồn tại** (`swoosh.mp3`, `whoosh.mp3`, `ka-ching.mp3`, `notification.mp3`, `pop.mp3`) — đã đổi sang tệp có trong `public/sfx/`. `film-burn.wav` (urgency) và `digital-device.wav` (contact card) là chọn tạm theo mô tả thư viện, chưa nghe thử.
7. **Số ô lưới tiện ích:** catalog ghi "3–4 ô → 2×2", skill cũ ghi "cần ≥ 4 ảnh". Component nhận 3–6 ô (3–4 → 2×2, 5–6 → 2×3); SKILL.md khuyên ≥ 4, `validate.py` chỉ cảnh báo khi < 3 hoặc > 6.
8. **Đầu ra render không thống nhất:** skill cũ `npx remotion render BdsApartmentDetail` (không đường dẫn), prompt cũ `out/<slug>-apartment.mp4`, skill cha dùng `renders/`. Đã chuẩn hoá `renders/<slug>-apartment-final.mp4`. `npm run render-*` trong `package.json` vẫn gọi composition `Root` nên không dùng được cho `BdsApartmentDetail`.
9. **README gốc** mô tả skill này có "bài toán tài chính"; skill thực tế chỉ có bảng giá theo tier, không có phần tài chính — chưa rõ nên chỉnh README hay thêm tính năng.
10. **Helper transcribe / căn phụ đề** nằm ở `mkt-hyperframe-talking-head-video/scripts/`, không phải ở skill cha như bản cũ viết — prompt đã trỏ đúng.

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): viết lại SKILL.md ngắn gọn, trỏ về skill cha cho phần chung (TTS, HeyGen, checkpoint, `init_project.sh`, luật `.env` / không bịa số); description nêu rõ khi nào dùng skill này, khi nào dùng skill cha; thêm bước kiểm + `cp overlays-apartment.json`; sửa đường dẫn helper, bảng SFX (tên có thật), `phase3-prompt-template.md` (đường dẫn schema từ gốc repo, mô tả đúng hành vi `init_project.sh`, thêm luật không bịa số).
