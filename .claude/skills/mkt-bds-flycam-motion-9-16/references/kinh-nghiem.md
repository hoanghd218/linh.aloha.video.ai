# Kinh nghiệm

## Từ #01 "Bay 60 giây" (12/11/2026)
- Whisper dồn mốc từ về đầu khối → phụ đề lệch. Dùng mốc khối từ SRT LucyLab + chia theo âm tiết (build.mjs) ổn hơn.
- Giãn giọng (gian_giong.py) để cắt cảnh rơi đúng lưới nhạc 2,4 s; nghỉ dài 3,5 s trước CTA cho recap thở.
- HyperFrames StaticGuard: không đặt `transform: scaleX(0)` trong CSS cho phần tử GSAP tween — dùng `fromTo`.
- Riser cần `data-media-start 1.75` (đầu tệp im lặng). Mỗi SFX một track 20–25 xoay vòng, tránh trùng.
- `ffmpeg -nostdin` trong vòng lặp, nếu không nó nuốt stdin.
- ffmpeg máy này không có `drawtext` → tờ soát chỉ vẽ khung (drawbox), không chữ.
- Nhãn khu (.zk) cần nền navy để đủ tương phản trên trời sáng.
- Bản hoàn thiện: crf 21 / maxrate 6M cho ~29 MB/60 s; −16 LUFS.

## Nhật ký
- 2026-11-12: tạo skill từ #01. Thử thật: bản 14,6 s (3 clip OP102/OP067/OP099) chạy trọn tao_du_an → am_thanh → cat_clip → build → check (0 lỗi) → render → hoan_thien; dựng lại cấu hình #01 qua build.mjs, check 0 lỗi. Sửa trong lúc thử: gộp mẩu phụ đề ngắn, `data-layout-allow-occlusion` cho chữ bị gạch, cảnh báo thẻ trùng nhãn khu, tổng đồng hồ làm tròn 5 s. gian_giong.py chế độ `--srt` chạy lại trên giọng #01 cho moc.json và wav giống hệt bản gốc. Chế độ `--loi-thoai` (dò khoảng lặng): 13/16 khối lệch ≤ 0,33 s nhưng khối 13–15 lệch ~2 s (bắt nhầm khoảng nghỉ trong khối) → chỉ dùng khi không có SRT và phải nghe/sửa moc.json. Chưa thử: số khu ≠ 2 và ≠ 5 trên hình, cảnh phối cảnh (nhãn tự động chưa có — phải thêm tay qua tags/credits).
- 2026-11-12 · OCP2 #03 Cuối tuần (39,5 s): cần bản sửa cục bộ build/ — đồng hồ giờ trong ngày (`hud.clock`, nhớ `immediateRender:false` cho fromTo lật số, không thì số biến mất trước mốc), kicker khu `z.k`, icon thẻ (`tags[i][3]` run/swim/boat/bag), `hud.extra_cps` + `cp_labels` (nhãn ≥ 24 px, nền tối mới qua contrast), `minimap:false`, `recap.dim`, `lines[].top`, `cta.zalo_at`; cat_clip thêm `h` (crop dọc giữ phần trên) để bỏ phụ đề/logo kênh in ở đáy (h 0.84 phụ đề, 0.8 logo "Hải Phòng trong tôi"). hoan_thien.sh bỏ qua tệp tên có "final" → render ra raw.mp4. Nên gộp các tính năng này vào skill.
- 2026-11-14: chép từ tony-brain (`tony-bds-flycam-motion-9-16`) sang repo Linh Aloha thành `mkt-bds-flycam-motion-9-16`, đổi thương hiệu sang chị Linh (môi giới): màu tím Tony → navy `#0A0E1F` / đồng `#A67C3D` / vàng `#C9A86A` theo `_lux.ts` của repo; nhãn + end card lấy từ khoá `brand` (mặc định LINH ALOHA / BĐS HÀNG HIỆU, avatar `workspace/assets/brand/linh avatar.jpg`); CTA mặc định "Inbox em Linh chữ …" + dòng `cta.hotline` (cảnh báo khi trống); bỏ đường dẫn tuyệt đối (cat_clip nhận `~` và `*` trong `kho`); thêm `srt_khoi.py` (SRT theo khối từ Whisper hoặc từ file từng khối, thay SRT LucyLab); `am_thanh.sh` thêm `NHAC_FILE` dùng bài trong `workspace/assets/background music/`. Tính năng bản #03 (`hud.clock`, `z.k`, icon thẻ, `cat_clip h`…) vẫn chưa gộp.
