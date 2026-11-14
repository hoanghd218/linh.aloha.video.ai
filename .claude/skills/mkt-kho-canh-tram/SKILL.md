---
name: mkt-kho-canh-tram
description: 'Cào video YouTube của một dự án BĐS (và cảnh xung quanh) cho chị Linh Aloha: tìm, tải về, tách cảnh, xem hình, cắt thành clip cảnh trám (B-roll) 4–20 giây có tên, mô tả, tags, xếp theo nhóm (flycam, tiện ích, shophouse, ban đêm…), kèm chỉ mục CSV/MD, ảnh xem nhanh, README, ghi nguồn từng clip. Không cần API key (yt-dlp), không tốn credit. Kho này là đầu vào của mkt-bds-flycam-motion-9-16 và các video cần tư liệu thật. Dùng khi Hoàng nói "cào cảnh", "kho cảnh", "cảnh trám", "b-roll dự án", "tải video dự án X về cắt", "sưu tập cảnh flycam", hoặc đưa tên dự án và muốn có kho cảnh. Không dùng để sinh ảnh AI (→ mkt-kie-broll-image-generator), dựng video hoàn chỉnh (→ mkt-bds-flycam-motion-9-16, mkt-edit-video-bds-linh-hoat), hay khi đã có kho tư liệu chính chủ đầu tư.'
metadata:
  argument-hint: '<tên dự án> [thư mục lưu] [mã dự án/phân khu]'
---

# Kho cảnh trám dự án BĐS

Quy trình đã chạy thật với Vinhomes Ocean Park 2-3 (146 cảnh, 12/11/2026) và Tràng Cát. Mẫu kết quả: `My Drive/Chị Linh/Kho cảnh Ocean Park 2-3 (2026-11-12)` trên Google Drive của Hoàng.

## Mặc định
- **Thư mục lưu** (nếu Hoàng không chỉ định): thư mục Drive của chị Linh — `"$DRIVE/Kho cảnh <Tên dự án> (<YYYY-MM-DD>)"` với `DRIVE=$(ls -d ~/Library/CloudStorage/GoogleDrive-*/"My Drive/Chị Linh" | head -1)`. Không thấy Drive thì hỏi Hoàng, không tự đặt chỗ khác.
- **Thư mục làm việc**: `W=~/kho-canh-work/<slug-du-an>` (video gốc, sheets, labels — không đặt trên Drive, không đặt trong repo).
- **Tiền tố ID**: 2–3 chữ viết tắt dự án (OP, TC, MGC…), không trùng kho đã có.
- **Script** (chạy từ gốc repo): `S=.claude/skills/mkt-kho-canh-tram/scripts`. Python cần Pillow; chạy `python3` thường (không `-I`). Cần `yt-dlp`, `ffmpeg`.
- Dữ liệu dự án (tên, chủ đầu tư, phân khu) ưu tiên lấy từ `workspace/data/` qua `tools/bds`; thiếu mới tra web.

## Các bước
1. **Tìm hiểu dự án**: tên thương mại, tên cũ, chủ đầu tư, vị trí, phân khu, tiện ích nổi bật, các dự án lân cận dễ nhầm. Chốt mã `du_an` (ví dụ OCP2, OCP3, OCP2-3) và danh sách phân khu.
2. **Tìm video**: 6–10 từ khoá, gồm tên + flycam / 4K / toàn cảnh / tiện ích / review / tiến độ / đời sống / ban đêm / cảnh xung quanh (đường, cầu, khu lân cận).
   `python3 $S/tim_video.py --work $W --q "..." --q "..." --n 15`
3. **Chọn 12–20 video** từ `cand.tsv`: ưu tiên flycam, video chính thức, review đi bộ/quay cảnh; ưu tiên mới đăng; bỏ video chủ yếu người nói về giá, video dọc chất lượng thấp, video sai dự án. Ghi lý do ngắn vào `$W/pick.txt`.
4. **Tải**: `bash $S/tai_video.sh $W id1 id2 ...` (≤1080p; mất vài phút; đặt timeout dài, chạy từng nhóm 5–6 video nếu nhiều).
5. **Chuẩn bị**: `python3 $S/chuan_bi.py --work $W` → `titles.tsv`, `cuts/`, `sheets/`.
6. **Gắn nhãn bằng hình**: chia video thành 2–3 nhóm, giao song song cho agent con với `references/brief-gan-nhan.md` đã điền đủ biến (kiểm lại không còn `{...}` trước khi gửi). Mỗi nhóm ghi `labels_<TAG>.tsv`. Ít video thì tự làm.
7. **Đóng gói**: `python3 $S/dong_goi.py --work $W --out "$OUT" --prefix XX --ten "<Tên dự án đầy đủ>" --src-copy`. Script tự kiểm thời lượng từng clip và in lỗi.
8. **Kiểm tra**: Read `to-kho-canh.jpg` xem cảnh có đúng nhóm; sửa nhãn sai trong labels rồi chạy lại bước 7 (xoá `01-theo-loai` cũ trước khi chạy lại). Sửa README phần lưu ý nếu có điều đặc thù.
9. **Báo cáo** ngắn cho Hoàng: số cảnh, số video, bảng nhóm, đường dẫn, lưu ý (logo/chữ, phối cảnh 3D, cảnh tiến độ cũ, dự án/phân khu không chắc, quyền chưa xác minh). Gửi kèm `to-kho-canh.jpg`. Bước tiếp gợi ý: dựng video "bay một vòng" bằng `mkt-bds-flycam-motion-9-16`.

## Quy tắc
- Mỗi clip phải có: tên, mô tả 1 câu, tags, dự án, nhóm, mốc nguồn, link nguồn — để tái sử dụng và tìm lại.
- Không đoán phân khu/dự án; không chắc thì ghi `khong-ro` hoặc mã gộp.
- Ngày đăng ≠ ngày quay. Đánh dấu phối cảnh 3D.
- Luôn ghi nguồn; cột `quyen_su_dung` mặc định "quyền chưa xác minh". Không đăng clip lên đâu. Tư liệu là của kênh khác — khi dựng video cho chị Linh phải ghi nguồn trên hình, không nói là cảnh chị tự quay.
- Không ghi đè kho đã có: thư mục mới theo ngày.
- Lỗi 403 khi tải: script tự thử lại; vẫn lỗi thì bỏ video đó và ghi lại.

## Tham khảo
- `references/brief-gan-nhan.md`: brief gửi agent con gắn nhãn (17 nhóm cảnh, cột labels).
- `references/kinh-nghiem.md`: bài học + *Nhật ký* sửa skill.
