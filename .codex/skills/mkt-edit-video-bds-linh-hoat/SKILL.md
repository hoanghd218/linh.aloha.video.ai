---
name: mkt-edit-video-bds-linh-hoat
description: Phân tích và dựng video bất động sản Việt Nam 9:16 từ video người thật hoặc HeyGen, script/transcript, video mẫu và kho tư liệu; hỗ trợ dự án đang xây chỉ có ảnh phối cảnh/render. Dùng khi cần học phong cách edit từ video tham khảo; thu thập ảnh từ nguồn chính thức; biến ảnh tĩnh thành B-roll động có nhãn minh họa; lập storyboard linh hoạt; chọn và đặt chữ, B-roll, ảnh, bản đồ, zoom, chuyển cảnh, nhạc và SFX theo ý nghĩa; đồng bộ hiệu ứng chính xác với word timestamps; hoặc chuẩn bị kế hoạch dựng cho Remotion/HyperFrames mà không dùng timeline hay số lượng overlay cố định.
---

# Dựng video BĐS linh hoạt

Tạo quyết định dựng từ ý nghĩa và nhịp lời nói. Không áp một timeline, công thức nội dung, số lượng B-roll, zoom, SFX, contact card hay nhạc nền cố định cho mọi video.

## Nguyên tắc bất biến

1. Neo chữ, zoom, SFX và thay đổi hình quan trọng vào đúng từ/cụm từ trong word timestamps.
2. Cho hiệu ứng bắt đầu hơi trước âm tiết được nhấn 40–120 ms khi cần cảm giác phản hồi tức thời; không cho hiệu ứng xuất hiện sau lời nói một cách vô cớ.
3. Chỉ dùng B-roll/ảnh dự án để chứng minh sự thật về dự án đó. Đánh dấu `minh_hoa: true` cho tư liệu trám chung.
4. Ưu tiên hard cut và match cut. Chỉ dùng transition nổi bật khi đổi luận điểm, không gian hoặc tạo reveal.
5. Không chèn hiệu ứng chỉ vì đã qua một khoảng thời gian. Chèn khi có speech anchor, semantic beat, chuyển cảnh thật hoặc mục tiêu giữ nhịp rõ ràng.
6. Không che mặt, tay đang chỉ, vật thể đang được mô tả hoặc UI an toàn của TikTok/Reels.
7. Tạo bản kế hoạch có lý do và độ tin cậy; dừng xin bổ sung tư liệu khi thiếu bằng chứng quan trọng.
8. Với dự án đang xây, không dùng phối cảnh/render để chứng minh tiến độ, hiện trạng, view thực tế hoặc mức độ hoàn thiện. Hiển thị nhãn `PHỐI CẢNH MINH HỌA` suốt thời gian render xuất hiện.

## Đầu vào

Nhận một hay nhiều đầu vào sau:

- Video người dẫn hoặc HeyGen `.mp4`/`.mov`.
- Script gốc `.txt`/`.md`.
- Transcript Whisper `.json` có `segments[].words[]`; ưu tiên word timestamps.
- Video mẫu cần học phong cách.
- Thư mục tư liệu riêng của dự án.
- Tên dự án, website, brochure PDF hoặc URL nguồn chính thức để thu thập phối cảnh.
- Kho tư liệu dùng chung và database `thư-viện-media.sqlite`.
- Thông tin thương hiệu, CTA và renderer mong muốn.

Nếu thiếu transcript word-level, tạo bằng Whisper cục bộ với `--word_timestamps True`. Dùng script làm nguồn chữ chính xác và Whisper làm nguồn timing; sửa lỗi nhận dạng trước khi lập kế hoạch.

## Quy trình

### 1. Khảo sát nguồn

- Đọc thời lượng, fps, tỷ lệ và audio bằng `ffprobe`.
- Nếu có video mẫu, dùng skill `watch` để xem toàn bộ frame và transcript; chạy `scripts/phan_tich_nhip_cat.py` để lấy nhịp cắt đo được.
- Ghi rõ trạng thái dự án và tài liệu nào là dự án thật, tiến độ thực tế, stock minh họa, render, bản đồ, tài liệu pháp lý hoặc thương hiệu.

### 2. Học phong cách, không sao chép timeline

Tạo `ho-so-phong-cach.json` theo `references/ho-so-phong-cach.schema.json`. Lưu các khoảng và khuynh hướng:

- Cấp bậc chữ, màu, stroke/shadow và vùng đặt thường gặp.
- Cách gom caption theo cụm nghĩa.
- Tỷ lệ tương đối giữa người dẫn, full-screen B-roll, ảnh và PIP.
- Kiểu cut, zoom và transition được quan sát.
- Nhịp âm thanh và mức năng lượng.

Không lưu quy tắc kiểu “giây 10 chèn B-roll” hoặc “mỗi 4 giây zoom”.

### 3. Chia lời thoại thành semantic beats

Chia khi ý nghĩa đổi: hook, thông tin tài sản, vị trí, tiện ích, số liệu, nhược điểm, lợi ích, bằng chứng, so sánh, cảm xúc hoặc CTA. Giữ ranh giới word timestamps của từng beat.

Đọc `references/dong-bo-theo-loi-noi.md` trước khi tạo cue. Đọc `references/ngon-ngu-dung-thich-ung.md` để chọn text/B-roll/ảnh/PIP/map.

### 4. Tìm tư liệu

- Nếu chưa có kho, chạy `scripts/tao_kho_tu_lieu.py <thu-muc>`.
- Chạy `scripts/lap_chi_muc_media.py <thu-muc>` để cập nhật JSON + SQLite.
- Tìm asset theo ý nghĩa, độ tin cậy, bố cục, hướng chuyển động, chất lượng và quyền sử dụng.
- Ưu tiên: dự án thật > khu vực thật > render/masterplan được xác nhận > stock minh họa.
- Nếu dự án đang xây và chỉ có phối cảnh, đọc `references/du-an-dang-xay-chi-co-phoi-canh.md`. Tìm từ nguồn chính thức, lưu file gốc cùng sidecar nguồn/quyền sử dụng, rồi lập phương án chuyển động ảnh dọc 9:16.
- Nếu chỉ có tên dự án, dùng tìm kiếm web khi công cụ cho phép; ưu tiên website chủ đầu tư, website dự án, brochure/press kit chính thức. Không lấy lại ảnh có watermark của đơn vị khác hoặc ảnh không truy được nguồn.

Sau khi xác minh URL ảnh trực tiếp, tạo manifest theo mẫu trong tài liệu phối cảnh và chạy:

```bash
python3 scripts/thu_thap_phoi_canh.py danh-sach-phoi-canh.json KHO-TU-LIEU --dry-run
python3 scripts/thu_thap_phoi_canh.py danh-sach-phoi-canh.json KHO-TU-LIEU
```

Đọc `references/cau-truc-kho-tu-lieu.md` khi tạo hoặc mở rộng database.

### 5. Lập kế hoạch dựng

Tạo `ke-hoach-dung.json` theo `references/ke-hoach-dung.schema.json`. Mỗi event chữ/zoom/SFX phải có:

- `speech_anchor.trigger_text` hoặc word index.
- `speech_start`, `speech_end`.
- Thời điểm hiệu ứng đã tính lead/tail.
- Loại animation và cường độ.
- Lý do dựng.
- Độ tin cậy khi khớp lời.

Mỗi event dùng phối cảnh/render phải có thêm `asset_kind: "phoi-canh"`, `minh_hoa: true`, `disclosure_label: "PHỐI CẢNH MINH HỌA"` và `label_persistent: true`.

Tạo file cue nháp rồi chạy:

```bash
python3 scripts/dong_bo_hieu_ung_theo_loi.py \
  --transcript transcript.json \
  --cues yeu-cau-dong-bo.json \
  --output su-kien-dong-bo.json \
  --fps 30 --strict
```

Không dùng `--strict` khi đang khám phá; bắt buộc dùng trước preview/final.

### 6. Chọn motion và sound

- Đọc `references/zoom-chuyen-canh-tiktok.md` khi chọn zoom/transition.
- Đọc `references/am-thanh-sfx.md` khi chọn SFX, nhạc và ducking.
- Cho text-pop và SFX dùng chung speech anchor nhưng lệch nhau tối đa 1–2 frame nếu cần cảm giác tự nhiên.
- Không để SFX che phụ âm đầu của từ quan trọng.

### 7. Duyệt storyboard rồi render

Trình bày bảng: thời gian, câu nói, cách thể hiện, asset, chữ, motion/SFX, speech anchor, độ tin cậy và cảnh báo. Chỉ dừng xin duyệt khi người dùng yêu cầu checkpoint hoặc khi có lựa chọn sáng tạo quan trọng/thiếu bằng chứng.

Khi render:

- Dùng renderer sẵn có của dự án nếu đã được chỉ định.
- Với HyperFrames, nạp skill HyperFrames bắt buộc trước khi tạo composition.
- Với Remotion, chuyển `ke-hoach-dung.json` thành các primitive mở: text, media, PIP, map, zoom, transition và audio; không ép registry variant đóng.
- Khi chỉ được yêu cầu lập kế hoạch, không tự render.

### 8. Kiểm tra

Chạy:

```bash
python3 scripts/kiem_tra_ke_hoach_dung.py \
  ke-hoach-dung.json --transcript transcript.json --strict
```

Sửa tất cả lỗi anchor, overlap, thời gian ngoài video, asset mất file, stock không gắn nhãn minh họa và render thiếu nhãn liên tục. Kiểm tra trực quan preview ở đầu, giữa, cuối và mọi transition nổi bật.

## Tệp tham chiếu

- Đồng bộ word-level: `references/dong-bo-theo-loi-noi.md`
- Quyết định chữ/B-roll/ảnh/PIP/map: `references/ngon-ngu-dung-thich-ung.md`
- Zoom và transition: `references/zoom-chuyen-canh-tiktok.md`
- Sound design: `references/am-thanh-sfx.md`
- Kho tư liệu tiếng Việt: `references/cau-truc-kho-tu-lieu.md`
- Dự án đang xây chỉ có phối cảnh: `references/du-an-dang-xay-chi-co-phoi-canh.md`
- Schema output: `references/ke-hoach-dung.schema.json`, `references/ho-so-phong-cach.schema.json`
