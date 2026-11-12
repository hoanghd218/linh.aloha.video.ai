---
name: mkt-edit-video-bds-linh-hoat
description: Phân tích lời thoại và lập KẾ HOẠCH dựng video BĐS Việt Nam 9:16 từ video người dẫn thật hoặc HeyGen + script/transcript + video mẫu + kho tư liệu: đồng bộ chữ, zoom, B-roll, ảnh, bản đồ, chuyển cảnh, nhạc, SFX đúng từng từ (word timestamps) → `ke-hoach-dung.json` cho Remotion/HyperFrames, không timeline / số overlay cố định. Hỗ trợ dự án đang xây chỉ có ảnh phối cảnh (ảnh tĩnh → B-roll động, nhãn "PHỐI CẢNH MINH HỌA" suốt thời gian hiện). Dùng khi Hoàng nói "học phong cách edit từ video mẫu", "lập storyboard dựng linh hoạt", "đồng bộ hiệu ứng theo lời nói", "dự án chưa xây chỉ có phối cảnh", "thu thập ảnh phối cảnh", "biến ảnh tĩnh thành B-roll". Không dùng để tạo avatar (→ heygen-mp3-to-mp4), sinh ảnh AI (→ mkt-kie-broll-image-generator), format Proof-First (→ mkt-hyperframe-heygen-bds-proof-first-9-16), pipeline talking-head trọn gói (→ mkt-full-video-with-11-hyperframe-heygen).
argument-hint: "[--video source.mp4] [--transcript transcript.json] [--du-an <tên dự án>] [--mau <video mẫu>]"
---

# Dựng video BĐS linh hoạt

Phiên bản: v1.1 — 2026-11-11

Tạo quyết định dựng từ ý nghĩa và nhịp lời nói. Không áp một timeline, công thức nội dung, số lượng B-roll, zoom, SFX, contact card hay nhạc nền cố định cho mọi video. Skill ra **kế hoạch dựng**; render do renderer của dự án (HyperFrames / Remotion) làm.

| Đầu vào (một hay nhiều) | Đầu ra |
|---|---|
| Video người dẫn / HeyGen `.mp4` `.mov` · script `.txt` `.md` · transcript Whisper `.json` có `segments[].words[]` | `su-kien-dong-bo.json` (cue đã neo vào từ) |
| Video mẫu cần học phong cách | `ho-so-phong-cach.json` (+ `nhip-cat.json` đo được) |
| Thư mục tư liệu dự án · kho dùng chung + `thư-viện-media.sqlite` | kho tư liệu + `chỉ-mục-media.json` + `thư-viện-media.sqlite` |
| Tên dự án · website · brochure PDF · URL nguồn chính thức | `danh-sach-phoi-canh.json` + ảnh phối cảnh + sidecar nguồn `.json` |
| Thông tin thương hiệu, CTA, renderer mong muốn | `ke-hoach-dung.json` (mỗi event có lý do, độ tin cậy, speech anchor) |

Thiếu transcript word-level → tạo bằng Whisper cục bộ với `--word_timestamps True`. Script là nguồn chữ chính xác, Whisper là nguồn timing; sửa lỗi nhận dạng trước khi lập kế hoạch.

## Luật — không được phá

1. **Neo vào lời nói** — chữ, zoom, SFX và thay đổi hình quan trọng neo vào đúng từ / cụm từ trong word timestamps.
2. **Hiệu ứng đi trước 40–120 ms** khi cần cảm giác phản hồi tức thì; không để hiệu ứng xuất hiện sau lời nói một cách vô cớ.
3. **B-roll / ảnh dự án chỉ chứng minh sự thật về chính dự án đó** — tư liệu trám chung đánh `minh_hoa: true`.
4. **Ưu tiên hard cut và match cut**; transition nổi bật chỉ khi đổi luận điểm, không gian hoặc reveal.
5. **Không chèn hiệu ứng chỉ vì đã qua một khoảng thời gian** — chèn khi có speech anchor, semantic beat, chuyển cảnh thật hoặc mục tiêu giữ nhịp rõ ràng.
6. **Không che** mặt, tay đang chỉ, vật thể đang được mô tả, hay UI an toàn của TikTok/Reels.
7. **Kế hoạch có lý do và độ tin cậy**; thiếu bằng chứng quan trọng thì dừng, xin bổ sung tư liệu — không bịa số, pháp lý, tiến độ (thiếu thì ghi "chưa có").
8. **Dự án đang xây:** không dùng phối cảnh / render để chứng minh tiến độ, hiện trạng, view thực tế hay mức độ hoàn thiện; hiện nhãn `PHỐI CẢNH MINH HỌA` suốt thời gian render xuất hiện.
9. **Cổng duyệt** — chỉ dừng xin duyệt storyboard khi người dùng yêu cầu checkpoint hoặc khi có lựa chọn sáng tạo quan trọng / thiếu bằng chứng; khi chỉ được yêu cầu lập kế hoạch thì **không tự render**. Render có tốn tiền (HeyGen, KIE…) hoặc ghi đè bản cũ → hỏi trước, kèm a / b / c.
10. **Tải ảnh từ web:** chỉ từ nguồn chính thức; không vượt đăng nhập, paywall; không lấy ảnh có watermark của sàn / môi giới khác; quyền dùng thương mại chưa rõ → đánh `can_xac_minh_quyen: true`, không đưa vào bản quảng cáo final. Không đổi tên / ghi đè asset gốc khi chỉ lập chỉ mục; `thu_thap_phoi_canh.py` luôn `--dry-run` trước, `--ghi-de` chỉ khi Hoàng bảo.
11. **Xong thì báo đường dẫn tệp ra + số đo thật** (số event, độ tin cậy thấp nhất, lỗi còn lại của bước kiểm) — chưa chạy kiểm `--strict` thì không nói "xong".

## Quy trình

Đặt `K=.claude/skills/mkt-edit-video-bds-linh-hoat` · `W=workspace/content/YYYY-MM-DD/<slug>` · `KHO=workspace/kho-tư-liệu-bất-động-sản`. Windows: dùng `python` thay `python3`. Script cần `ffmpeg` / `ffprobe` (đo nhịp cắt, metadata).

### 1. Khảo sát nguồn
- Đọc thời lượng, fps, tỉ lệ, audio bằng `ffprobe`.
- Có video mẫu: trích khung hình bằng `ffmpeg` (vd `fps=1/2`) + lấy transcript bằng Whisper cục bộ rồi xem **toàn bộ** khung và lời; chạy `python3 $K/scripts/phan_tich_nhip_cat.py <mau.mp4> --output $W/nhip-cat.json` để có nhịp cắt đo được.
- Ghi rõ trạng thái dự án và từng tài liệu là gì: dự án thật, tiến độ thực tế, stock minh hoạ, render, bản đồ, tài liệu pháp lý hay thương hiệu.

**Xong khi** biết thời lượng / fps / tỉ lệ và có bảng "tài liệu nào là loại gì".

### 2. Học phong cách, không sao chép timeline
Tạo `ho-so-phong-cach.json` theo [references/ho-so-phong-cach.schema.json](references/ho-so-phong-cach.schema.json). Lưu khoảng và khuynh hướng: cấp bậc chữ, màu, stroke / shadow, vùng đặt chữ · cách gom caption theo cụm nghĩa · tỉ lệ tương đối người dẫn : B-roll toàn màn hình : ảnh : PIP · kiểu cut, zoom, transition · nhịp âm thanh và mức năng lượng. **Không** lưu kiểu "giây 10 chèn B-roll" hay "mỗi 4 giây zoom".
**Xong khi** hồ sơ chỉ chứa khoảng / khuynh hướng, không có mốc giây cố định.

### 3. Chia lời thoại thành semantic beats
Chia khi ý đổi: hook, thông tin tài sản, vị trí, tiện ích, số liệu, nhược điểm, lợi ích, bằng chứng, so sánh, cảm xúc, CTA; giữ ranh giới word timestamps của từng beat. Đọc [references/dong-bo-theo-loi-noi.md](references/dong-bo-theo-loi-noi.md) trước khi tạo cue, [references/ngon-ngu-dung-thich-ung.md](references/ngon-ngu-dung-thich-ung.md) để chọn text / B-roll / ảnh / PIP / map.
**Xong khi** mỗi beat có ranh giới từ đầu–từ cuối.

### 4. Tìm tư liệu
- Chưa có kho: `python3 $K/scripts/tao_kho_tu_lieu.py $KHO`; rồi `python3 $K/scripts/lap_chi_muc_media.py $KHO` để cập nhật JSON + SQLite (cấu trúc kho: [references/cau-truc-kho-tu-lieu.md](references/cau-truc-kho-tu-lieu.md)).
- Tìm asset theo ý nghĩa, độ tin cậy, bố cục, hướng chuyển động, chất lượng, quyền sử dụng. Ưu tiên: **dự án thật > khu vực thật > render / masterplan được xác nhận > stock minh hoạ**.
- Dự án đang xây chỉ có phối cảnh → đọc [references/du-an-dang-xay-chi-co-phoi-canh.md](references/du-an-dang-xay-chi-co-phoi-canh.md): tìm từ nguồn chính thức, lưu file gốc cùng sidecar nguồn / quyền, rồi lập phương án chuyển động ảnh dọc 9:16. Chỉ có tên dự án thì tìm web (khi được phép): ưu tiên website chủ đầu tư, website dự án, brochure / press kit chính thức; không lấy ảnh có watermark đơn vị khác hoặc không truy được nguồn.
- Sau khi xác minh URL ảnh trực tiếp, lập `danh-sach-phoi-canh.json` theo mẫu trong tài liệu phối cảnh:
```bash
python3 $K/scripts/thu_thap_phoi_canh.py danh-sach-phoi-canh.json $KHO --dry-run    # xem kế hoạch tải
python3 $K/scripts/thu_thap_phoi_canh.py danh-sach-phoi-canh.json $KHO              # tải thật (không đè file có sẵn; --ghi-de để đè — cần Hoàng bảo)
```
**Xong khi** mỗi asset được chọn có nguồn + quyền + cờ `minh_hoa`.

### 5. Lập kế hoạch dựng
Tạo `ke-hoach-dung.json` theo [references/ke-hoach-dung.schema.json](references/ke-hoach-dung.schema.json). Mỗi event chữ / zoom / SFX có: `speech_anchor.trigger_text` hoặc word index · `speech_start`, `speech_end` · thời điểm hiệu ứng đã tính lead / tail · loại animation + cường độ · lý do dựng · độ tin cậy khi khớp lời. Event dùng phối cảnh / render có thêm `asset_kind: "phoi-canh"`, `minh_hoa: true`, `disclosure_label: "PHỐI CẢNH MINH HỌA"`, `label_persistent: true`.

Soạn cue nháp (mẫu: [references/vi-du-yeu-cau-dong-bo.json](references/vi-du-yeu-cau-dong-bo.json)) rồi neo vào lời:
```bash
python3 $K/scripts/dong_bo_hieu_ung_theo_loi.py --transcript transcript.json --cues yeu-cau-dong-bo.json \
  --output su-kien-dong-bo.json --fps 30 --strict
```
Không dùng `--strict` khi đang khám phá; **bắt buộc** dùng trước preview / final (`--min-confidence` mặc định 0,78).
**Xong khi** `su-kien-dong-bo.json` không còn cue không khớp.

### 6. Chọn motion và sound
Đọc [references/zoom-chuyen-canh-tiktok.md](references/zoom-chuyen-canh-tiktok.md) khi chọn zoom / transition và [references/am-thanh-sfx.md](references/am-thanh-sfx.md) khi chọn SFX, nhạc, ducking. Text-pop và SFX dùng chung speech anchor, lệch nhau tối đa 1–2 frame nếu cần tự nhiên; SFX không che phụ âm đầu của từ quan trọng.

### 7. Duyệt storyboard rồi render
Trình bảng: thời gian · câu nói · cách thể hiện · asset · chữ · motion / SFX · speech anchor · độ tin cậy · cảnh báo (luật 9 quyết định có dừng xin duyệt không). Khi render:
- dùng renderer sẵn có của dự án nếu đã chỉ định;
- HyperFrames → nạp skill `hyperframes` (cài ở máy, ngoài repo) trước khi tạo composition;
- Remotion → chuyển `ke-hoach-dung.json` thành primitive mở (text, media, PIP, map, zoom, transition, audio), không ép registry variant đóng;
- chỉ được yêu cầu lập kế hoạch → không render.

### 8. Kiểm tra
```bash
python3 $K/scripts/kiem_tra_ke_hoach_dung.py ke-hoach-dung.json --transcript transcript.json --strict
```
Sửa hết lỗi anchor, overlap, thời gian ngoài video, asset mất file, stock không gắn nhãn minh hoạ, render thiếu nhãn liên tục; rồi xem preview ở đầu, giữa, cuối và mọi transition nổi bật.
**Xong khi** lệnh trên không còn lỗi.

## Lỗi hay gặp

| Triệu chứng (từ script kiểm) | Cách sửa |
|---|---|
| `khong-tim-thay-anchor` (script đồng bộ) / confidence thấp | Sửa transcript, đổi `trigger_text`, hoặc chỉ định word index / `occurrence`; không đoán timing trong final |
| `khoảng thời gian không hợp lệ` · `kết thúc … ngoài video` | `start < 0`, `end ≤ start` hoặc quá thời lượng video → sửa mốc |
| `thiếu speech_anchor` · `speech_start lệch transcript >150ms` | Thêm / sửa anchor cho event chữ, zoom, SFX theo transcript |
| `asset từ kho video trám phải gắn minh_hoa=true` | Thêm `minh_hoa: true` (và nhãn nếu dễ hiểu nhầm là dự án thật) |
| `phối cảnh/render … thiếu disclosure_label` · `label_persistent` | Thêm `asset_kind: "phoi-canh"`, `minh_hoa: true`, `disclosure_label: "PHỐI CẢNH MINH HỌA"`, `label_persistent: true` |
| `không dùng phối cảnh để chứng minh …` | Event đang dùng render cho tiến độ / hiện trạng / view thực → đổi asset hoặc bỏ tuyên bố (luật 8) |
| `asset không tồn tại` | Đường dẫn sai / file mất → sửa đường dẫn (tương đối so với thư mục chứa `ke-hoach-dung.json`) |
| Cụm từ xuất hiện nhiều lần trong lời | Dùng `occurrence` hoặc word index, không mặc định lần đầu |

## Tệp tham chiếu (đọc khi làm đúng bước đó)
[dong-bo-theo-loi-noi.md](references/dong-bo-theo-loi-noi.md) (đồng bộ word-level) · [ngon-ngu-dung-thich-ung.md](references/ngon-ngu-dung-thich-ung.md) (quyết định chữ / B-roll / ảnh / PIP / map) · [zoom-chuyen-canh-tiktok.md](references/zoom-chuyen-canh-tiktok.md) · [am-thanh-sfx.md](references/am-thanh-sfx.md) · [cau-truc-kho-tu-lieu.md](references/cau-truc-kho-tu-lieu.md) · [du-an-dang-xay-chi-co-phoi-canh.md](references/du-an-dang-xay-chi-co-phoi-canh.md) · schema [ke-hoach-dung](references/ke-hoach-dung.schema.json), [ho-so-phong-cach](references/ho-so-phong-cach.schema.json) · ghi chú: [kinh-nghiem.md](references/kinh-nghiem.md).

## Cải tiến skill
Gặp lỗi mới hoặc Hoàng đổi cách dựng → ghi vào [references/kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*, sửa đúng một chỗ (script · reference · tệp này).

## Liên quan
- Lời thoại + brand (xưng "em", gọi "anh chị", "Aloha anh chị, em Linh đây", CTA): `mkt-linh-aloha-bds-video-script` — skill này không viết lại lời; chữ phủ tiếng Việt đủ dấu.
- Giọng / avatar: `mkt-elevenlabs-tts-to-mp3` → `heygen-mp3-to-mp4` (ra `source.mp4`).
- Ảnh minh hoạ do AI sinh: `mkt-kie-broll-image-generator` (phải gắn nhãn minh hoạ khi dùng).
- Dựng thật: `mkt-hyperframe-talking-head-video`, `mkt-hyperframe-luxury-realestate-9-16` (design tokens), pipeline `mkt-full-video-with-11-hyperframe-heygen` / `mkt-full-video-with-11-remotion-heygen`.
- Format khác dùng chung quy tắc nhãn minh hoạ: `mkt-hyperframe-heygen-bds-proof-first-9-16` (HeyGen ngắn, bằng chứng thật dài).
- SFX có sẵn trong repo: `workspace/sfx-realestate/` · `workspace/kho-tư-liệu-bất-động-sản/03_âm-thanh/danh-mục-hiệu-ứng.json`.
