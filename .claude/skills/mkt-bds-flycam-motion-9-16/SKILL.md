---
name: mkt-bds-flycam-motion-9-16
description: 'Dựng video dọc 9:16 (1080×1920) kiểu "bay một vòng" cho dự án BĐS của chị Linh Aloha (môi giới): clip flycam từ kho cảnh trám + lời em Linh (giọng ElevenLabs hoặc chị tự thu) + motion HyperFrames dày (hook gạch chữ, đồng hồ/thanh tiến độ, mini-map, nhãn "ĐIỂM 0n", thẻ chi tiết, phụ đề karaoke, sơ đồ recap, end card avatar Linh + chữ khoá "Inbox em Linh" + hotline), màu navy–vàng champagne, nhạc tự tổng hợp có ducking (hoặc bài trong thư viện), 8 SFX theo cấu trúc. Chỉ đổi tham số trong video.json. Dựng chạy trên máy; chỉ bước giọng ElevenLabs tốn credit. Dùng khi Hoàng nói "video bay một vòng", "flycam + motion", "làm video số N kiểu #01", "video 60 giây dự án X từ kho cảnh". Không dùng khi chưa có kho cảnh (→ mkt-kho-canh-tram), chưa có lời (→ mkt-linh-aloha-bds-video-script), cần avatar nói suốt video (→ mkt-full-video-with-11-hyperframe-heygen), video thô chị quay (→ mkt-autoedit-video-9-16) hoặc 16:9.'
metadata:
  argument-hint: '<thư mục dự án> <slug> [thư mục kho cảnh]'
---

# Flycam + motion 9:16 — Linh Aloha

Khung mẫu đóng gói từ **OCP2-3 #01 "Bay 60 giây"** (12/11/2026, bản xuất ở `My Drive/Chị Linh/Thành phẩm/OCP2-3 #01 Bay 60 giây (2026-11-12)/`), đổi sang thương hiệu Linh Aloha ngày 14/11/2026. `template/video.mau.json` là cấu hình #01 (lời/phụ đề mẫu của bản #01 — luôn thay bằng lời mới).

`S=.claude/skills/mkt-bds-flycam-motion-9-16/scripts` (chạy từ gốc repo). Thư mục dự án: `P=workspace/content/YYYY-MM-DD/<slug>` (bị `.gitignore`).

## Đầu vào
- **Kho cảnh** có `chi-muc.csv` (do `mkt-kho-canh-tram` tạo; cột `id, file, phan_khu, thuc_te_hay_phoi_canh, chu_logo, kenh_nguon, ngay_dang, link_nguon…`).
- **Lời thoại** viết theo `mkt-linh-aloha-bds-video-script` (format hợp: *Tham quan tiện ích*, *Review dòng sản phẩm*), chia **khối** — mỗi khối một cảnh/khu, dòng trống giữa khối → `$P/nguon/loi-thoai.txt`. Khối đầu mở bằng câu chào của brand; khối cuối là CTA của brand (inbox / hotline).
- **Giọng** (hỏi Hoàng a / b / c): a) ElevenLabs giọng thương hiệu — `mkt-elevenlabs-tts-to-mp3`, **tốn credit, phải được duyệt**; b) chị Linh tự thu (điện thoại, phòng yên tĩnh); c) đã có file giọng. Không ghi đè giọng đã có (đổi tên `.prev`).
- **Tham số**: mã clip từng cảnh, tên khu, thẻ chi tiết, chữ khoá CTA, **hotline** (số chị Linh cung cấp — không tự điền; trống thì không hiện và build cảnh báo), dòng ghi nguồn.

## Đầu ra (trong `$P`)
- `renders/final.mp4`: 1080×1920, 30 fps, H.264 crf 21 (tối đa 6 Mb/s), AAC 192k, −16 LUFS.
- `kiem/bien-hieu-*.jpg` + `kiem/bien-hieu.md` (soát biển hiệu/logo), `kiem/khung-cuoi.jpg` (12 khung).
- `nguon/moc.json`, `nguon/phu-de.json`, `index.html` (dựng lại được), `video.json`.

## 8 bước

1. **Tạo dự án + chọn cảnh.** `bash $S/tao_du_an.sh $P <slug> "<thư mục kho>"` (chép khung mẫu + avatar `workspace/assets/brand/linh avatar.jpg`). Sửa `video.json` theo `references/cau-hinh.md`: `kho`, `scenes` (mã clip, `ss`, tâm crop `c0→c1`, chuyển cảnh `zoom|whip|whipU|fade`), `zones`, `tags`, `credits`, `cta`. Chỉ đặt tên phân khu khi `phan_khu` trong chỉ mục chắc chắn; không chắc thì dùng tên mô tả ("Đại lộ shophouse") + mã dự án.
2. **Giọng.** a) ElevenLabs: đọc **từng khối một file** (`k01.mp3`, `k02.mp3`… — cùng số ký tự nên cùng giá, mốc chính xác) rồi `python3 $S/srt_khoi.py --tep k*.mp3 --loi-thoai nguon/loi-thoai.txt --out nguon/voice.srt --ghep voice-goc.wav`. b/c) Một file giọng: chạy `mkt-ai-video-extract-srt-segment` lấy `<stem>_segments.json`, rồi `python3 $S/srt_khoi.py --segments <stem>_segments.json --loi-thoai nguon/loi-thoai.txt --out nguon/voice.srt` — **đọc bảng in ra**, dòng ⚠ phải nghe lại.
3. **Giãn nhịp.** `python3 $S/gian_giong.py voice-goc.wav assets/audio/voice.wav nguon/moc.json --srt nguon/voice.srt --extra "1:0.5,2:1.0,…"`: chèn nghỉ để cắt cảnh rơi vào lưới nhạc 2,4 s. Không có SRT: `--loi-thoai` (dò khoảng lặng; đã thấy lệch ~2 s ở vài khối, bắt buộc nghe và sửa moc.json).
4. **Nhạc + ducking.** `bash $S/am_thanh.sh $P` → `bgm.wav` (100 BPM, tự tổng hợp, không bản quyền) + `bgm-duck.wav` nén theo giọng. Tinh chỉnh: `NHAC_ARGS="--strong 39.5 --swell 49"`. Muốn bài có sẵn: `NHAC_FILE="workspace/assets/background music/<bài>"` (chỉ thư viện của chị Linh).
5. **Cắt clip + soát biển hiệu/logo.** `python3 $S/cat_clip.py $P` → `$P/assets/video/cNN.mp4` + tờ soát. **Xem từng tờ `kiem/bien-hieu-*.jpg`**: khung vàng là vùng giữ lại; mọi biển hiệu/logo bên thứ ba đọc được trong 3 khung 9:16 phải có quyết định trong `kiem/bien-hieu.md` (đổi tâm / đổi đoạn / che bằng nhãn / chấp nhận + báo). Sửa xong chạy lại bước này. Chi tiết: `references/soat-bien-hieu.md`.
6. **Phụ đề chia cụm + dựng.** Viết `captions` theo khối: tự chia bằng `|`, đánh dấu từ khoá `[...]`; không có `|` thì script tự tách theo dấu câu và tách đôi cụm > 30 ký tự. Mỗi cụm ≤ 30 ký tự, không cắt giữa cụm danh từ/tên riêng. `node $S/build.mjs $P` → đọc hết CẢNH BÁO (cụm dài, thẻ trùng nhãn khu, CTA quá sát cuối, thiếu hotline/avatar) và sửa.
7. **Kiểm + render.** Trong `$P`: `npx --yes hyperframes@0.9.37 check` phải 0 lỗi; xem cảnh báo `line_unread`. `npx --yes hyperframes@0.9.37 snapshot --at …` vài mốc (hook, mỗi khu, recap, CTA). `npx --yes hyperframes@0.9.37 render`.
8. **Hoàn thiện + kiểm bản xuất.** `bash $S/hoan_thien.sh $P $P/renders/final.mp4` (vignette, hạt nhẹ, loudnorm) → in số đo + tờ 12 khung. **Mở xem `kiem/khung-cuoi.jpg`**, nghe vài đoạn; báo Hoàng số đo thật (thời lượng, dung lượng, LUFS, số cảnh báo) và phần chưa kiểm.

## Luật
- **Xuất 1080×1920, bitrate vừa (crf 21, maxrate 6M); không render 2K/4K.**
- **Thương hiệu Linh Aloha**: nhãn `LINH ALOHA / BĐS HÀNG HIỆU` (khoá `brand` trong video.json), navy `#0A0E1F`, đồng `#A67C3D` (nền ô nhấn, chữ trắng), vàng champagne `#C9A86A` (đường, chữ phụ), Be Vietnam Pro, avatar `workspace/assets/brand/linh avatar.jpg`. Lời và chữ trên hình theo `mkt-linh-aloha-bds-video-script` (xưng "em"/"em Linh", gọi "anh chị", CTA inbox/hotline) — không soạn lại quy tắc brand ở đây.
- Chị Linh là môi giới: CTA mời inbox hoặc gọi hotline, hứa gửi tài liệu chỉ khi có thật (bản đồ phân khu, bảng giá chi tiết). Không hối thúc ("sắp hết", "chốt ngay").
- Không nêu giá, chính sách, tiến độ, pháp lý trong video này; nếu buộc phải có thì lấy từ `workspace/data/` (qua `tools/bds`) và ghi nguồn. Thiếu thì ghi "chưa có".
- Cảnh flycam là tư liệu YouTube của kênh khác: không nói/viết là em Linh tự quay. Mỗi clip có dòng ghi nguồn (kênh + tháng đăng) trong `credits`, lấy từ chỉ mục.
- Phân khu chỉ ghi khi chỉ mục chắc chắn. Cảnh `thuc_te_hay_phoi_canh` ≠ `thuc-te` phải có nhãn "PHỐI CẢNH MINH HỌA" suốt lúc hiện. Sơ đồ luôn ghi "SƠ ĐỒ MINH HỌA · không theo tỉ lệ".
- Biển hiệu/logo bên thứ ba: không để nổi bật; soát ở bước 5 trước khi render.
- Chữ quan trọng trong x 90–990, y ≤ 1500 (vùng an toàn Reels/TikTok). Thẻ chi tiết không hiện cùng lúc với nhãn khu.
- Không đăng, không tốn tiền ngoài phạm vi được duyệt. Không ghi đè giọng/thành phẩm đã có (đổi tên `.prev`).
- Chưa xem khung, chưa nghe, chưa đo thì không báo "xong".

## Tham khảo
- `references/cau-hinh.md`: từng khoá của video.json, mốc thời gian, giá trị mặc định.
- `references/soat-bien-hieu.md`: cách đọc tờ soát và quyết định.
- `references/kinh-nghiem.md`: bài học từ #01, #03 + nhật ký sửa.
- `template/assets/sfx/`: 8 SFX (whoosh, whoosh-short, pop, click-soft, impact-bass-1, riser, sparkle, chime) — build.mjs tự đặt theo cấu trúc.
