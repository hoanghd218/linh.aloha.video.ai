---
name: mkt-autoedit-video-9-16
description: Edit video dọc 9:16 tiếng Việt từ VIDEO THÔ chị Linh quay sẵn (hoặc từ script.txt để lên storyboard trước khi quay) — Whisper phiên âm → cắt khoảng lặng → chia cảnh → chị chọn phong cách (preset A/B/C) và hiệu ứng từng cảnh bằng trang HTML có hình → trang storyboard chốt phương án → dựng đồ hoạ HyperFrames (bản đồ tuyến, lưới tiện ích, số đếm, biểu đồ giá, thẻ ảnh, chữ tên dự án) → kiểm vùng an toàn TikTok/Reels → xem thử → render MP4. Chạy hoàn toàn trên máy, không tốn credit API. Dùng khi nói "edit video này", "dựng video thô", "cắt khoảng lặng", "chọn hiệu ứng cho từng cảnh", "storyboard video", "preset A/B/C", "autoedit". Không dùng cho video avatar HeyGen trọn gói (mkt-full-video-with-11-*), MP4 HeyGen kiểu kính mờ (mkt-hyperframe-talking-head-video), chữ punch (mkt-hyperframe-luxury-realestate-9-16), clip bản đồ vị trí (mkt-map-location-video).
argument-hint: "[input/<video>.mp4 | script.txt] [--preset A|B|C]"
---

# AutoEdit — edit video thô dọc 9:16, chọn hiệu ứng bằng hình, chốt storyboard rồi mới dựng

Phiên bản: v1.0 — 2026-11-11 · Chuyển thể từ gói `AutoEdit.zip` (xem [kinh-nghiem.md](references/kinh-nghiem.md) mục A)

Chị Linh đưa video thô (quay điện thoại, người nói nhìn thẳng) → skill cắt, chia cảnh, **đề xuất hiệu ứng từng cảnh có hình xem trước**, chị chọn, **chốt storyboard**, rồi mới dựng. Khác các skill `mkt-full-video-*` (kịch bản → giọng AI → avatar HeyGen), skill này **giữ người thật** của chị Linh và dựng đồ hoạ lên trên.

## Chọn đúng skill

| Chị Linh có gì / muốn gì | Skill |
|---|---|
| **Video thô quay sẵn**, muốn chọn hiệu ứng từng cảnh, chốt storyboard | **skill này** |
| Chỉ có script, muốn lên storyboard trước khi quay | **skill này** (nhánh "chưa có video", Bước 1) |
| Chủ đề → kịch bản | `mkt-linh-aloha-bds-video-script` |
| Script → MP4 trọn gói, avatar HeyGen suốt video | `mkt-full-video-with-11-hyperframe-heygen` |
| `source.mp4` HeyGen, muốn infographic kính mờ | `mkt-hyperframe-talking-head-video` |
| `source.mp4`, muốn chữ punch trên avatar full-frame | `mkt-hyperframe-luxury-realestate-9-16` |
| Clip bản đồ giới thiệu vị trí & kết nối | `mkt-map-location-video` |

## Đầu vào → Đầu ra

| Có | Ra |
|---|---|
| `input/<ten>.mp4` (video thô) hoặc `script.txt` | trong `P` (bên dưới): `work/<ten>/` (audio, `transcript.json` + `.srt`, `scenes.json`, `timeline.json`, `cut.mp4`, `hf/`) · `output/chon-hieu-ung.html` · `output/storyboard.html` · `output/preview/` (khung thử) · `output/<ten>_preview.mp4` · `output/<ten>_v1.mp4` (bản chuẩn, sửa thì `_v2`, `_v3`) |

## Luật — không được phá

1. **Không render khi chị chưa nói "chốt phương án"** (sau trang storyboard). Bản xem thử nhanh chỉ làm sau khi chốt; bản chuẩn chỉ render sau khi chị nói bản xem thử đạt.
2. **Không bịa ảnh, số liệu BĐS.** Dữ liệu thiếu ghi `"ĐIỀN"` và hỏi; số lấy từ `workspace/data/` hoặc `py tools/bds …` (xem mục dưới). Thiếu thì dựng khung giữ chỗ có nhãn ("SỐ MẪU", "ẢNH CẦN CHÈN") **để duyệt bố cục**; **bản cuối không được còn nhãn đó**. Ảnh AI chỉ là minh hoạ, nói rõ.
3. **Không sửa, không xoá file gốc trong `input/`.** Mọi thứ khác ghi vào `work/`, `output/`.
4. **Không đăng, không gửi video đi đâu.** Chưa chắc (đoạn cắt, từ nghe không rõ, nhạc chưa có, dữ liệu thiếu) → **giữ lại và hỏi**, đừng đoán. Hỏi chị luôn kèm phương án a / b / c.
5. **Chữ trong hình lấy từ lời người nói hoặc dữ liệu thật**; mọi chữ, thẻ, icon nằm trong vùng an toàn (trên 15% · dưới 25% · hai bên 10%), chữ nhỏ nhất ≥ 28 px trên khung 1080. Không dòng phụ (subtext) trong hiệu ứng. Chi tiết: [hieu-ung.md](references/hieu-ung.md).
6. **Phông chỉ dùng file cục bộ** (không tải từ mạng) và **kiểm dấu tiếng Việt trước khi dựng** — [kinh-nghiem.md](references/kinh-nghiem.md) mục E. Không trộn hai preset trong một video.
7. **Brand Linh:** cách xưng hô, câu mở, CTA là việc của `mkt-linh-aloha-bds-video-script` — skill này **không viết lại lời**; chữ hiện trên hình bám lời chị nói, không thêm câu hối thúc ("sắp hết", "chốt ngay").
8. Mỗi bước lớn xong báo ngắn: đã làm gì · tệp ở đâu · bước kế. Báo **số đo thật** (thời lượng, dung lượng, số lỗi kiểm); chỗ chưa nghe bằng tai nói rõ.
9. Công cụ lỗi → nói rõ lỗi là gì rồi đề xuất cách sửa, không lặp lại cùng một lệnh.

## Dùng cho BĐS (chị Linh)

**Preset gợi ý:** **B `cam_kem`** — tệp preset ghi "hợp bán hàng, bất động sản; ấm, mạnh", không cần tách nền (dựng nhanh, hợp máy yếu); hợp chữ "ấm trong giọng nói". A `xanh_gradient` cần tách nền người nói (`rembg`, ≈ 2 phút cho clip 17 giây trên máy không GPU). C `neon_toi` hợp tin sốc. Chưa có preset champagne / gold / kem "sang" như skill `mkt-hyperframe-luxury-realestate-9-16` — chị muốn thì đề xuất **preset D** (chép `assets/presets/cam_kem.md`, đổi màu, bố cục, motion, thêm một dòng vào bảng Bước 0), **chị duyệt mới làm**.

**Khi chị Linh nói… → mã hiệu ứng** (danh mục đủ: `assets/effects/CATALOG.md`; ★ = "đã duyệt mẫu", còn lại chụp khung thử cho chị duyệt trước):

| Câu nói | Mã |
|---|---|
| Mở đầu, tên dự án, "ra mắt" | `typo_gold` ★ (tên, sự kiện) · `typo_bronze` ★ (vị trí, khu vực) |
| Vị trí, giao thông, "x phút tới …" | `map_route` ★ (cần ảnh bản đồ có đánh dấu khu dự án — chưa có thì dùng clip của `mkt-map-location-video`, hoặc hỏi chị) |
| Liệt kê tiện ích | `amenity_grid` ★ (ảnh thật từng tiện ích, tối đa 8) |
| Diện tích, cảnh quan, số căn | `photo_cards` ★ · `count_up` ★ |
| Giá, tăng giá theo năm | `chart_bars` ★ · `growth_card` (**số thật**, hỏi chị) |
| Pháp lý, điều kiện, chính sách thanh toán | `note_board` |
| So sánh hai căn / trước–sau | `compare_cards` |
| 3 lý do nên chọn | `glass_list` |
| Giải thích mặt bằng có chú thích | `popup_notes` ★ |
| Kêu gọi cuối (inbox / hotline) | `outro_cta` ★ — câu CTA lấy từ `mkt-linh-aloha-bds-video-script` |
| "Cờ đỏ", cảnh báo | `warning_stamp` — chỉ ở format Cờ đỏ / Tin sốc, **không để hối thúc** |

**Dữ liệu thật:** `py tools/bds project list` · `py tools/bds schema unit-type` (macOS: `python3 tools/bds …`); căn cụ thể: `workspace/data/<dự án>/_data/unit-types.json`; kiến thức: `workspace/data/<dự án>/_kien-thuc-du-an/*.md`. Con số nào không có trong đó → `"ĐIỀN"`.

**Âm thanh (copy vào `P/assets/music`, `P/assets/sfx`, không sửa gốc):** nhạc nền `workspace/assets/background music/`; SFX `workspace/sfx-realestate/` và `workspace/assets/01_Sound Bất động sản/`.

## Quy trình

Đặt `K=.claude/skills/mkt-autoedit-video-9-16` · `P=workspace/content/YYYY-MM-DD/<slug>` (thư mục video, bị `.gitignore`) · `N=<ten-video-khong-dau>` · `W=$P/work/$N`. Phông: chép vào `$P/assets/fonts/` (không có trong repo — kinh-nghiem mục A). Bước 0–8 tương ứng Bước 0–8 của gói gốc.

0. **Kiểm môi trường (một lần; thiếu thì hỏi trước khi cài):** `ffmpeg -version` · `node -v` · `py -3 -c "import faster_whisper"` (phiên âm) · `py -3 -c "import playwright"` (`scripts/safe_check.py`) · `npx hyperframes --version`. Preset A thêm `rembg onnxruntime opencv-python-headless numpy`. **Không chạy `chay-cai-dat.bat`** của gói gốc (xin quyền Administrator, tải nhiều bộ cài) — cài từng thứ cần, sau khi chị đồng ý.
1. **Preset + nguồn.** Chị nêu preset thì mở `assets/presets/<tên>.md` đọc kỹ; chưa nêu thì hỏi **một câu** (bảng A/B/C kèm ý chính; đề xuất B) và chờ; không trả lời được → dùng A. Ghi `"preset"` đầu `timeline.json`. Có **video thô**: `ffprobe` đọc độ dài, độ phân giải, fps, cờ xoay, có tiếng không; không phải dọc 9:16 → hỏi crop hay thêm nền mờ; mục tiêu 1080×1920, 30 fps, H.264, AAC. Có **script chưa có video**: bỏ Bước 2–3, tách cảnh theo ý (1–2 câu, ≈ 2,5 từ/giây, ghi rõ "ước lượng"), đi thẳng Bước 4; khi có video thì khớp lời thật vào từng câu, giữ lựa chọn đã chốt, báo cảnh lệch kịch bản. Có cả hai: script là chuẩn chính tả.
2. **Phiên âm** ([kinh-nghiem.md](references/kinh-nghiem.md) mục F: ffmpeg tách PCM → `faster-whisper` CPU `small` int8, `language='vi'`, `word_timestamps=True`, ghi UTF-8) → `$W/transcript.json` + `.srt`. In **toàn bộ lời** và hỏi chị từ nào sai (tên dự án, tên riêng, thuật ngữ) — sửa trước khi đi tiếp.
3. **Cắt thô:** khoảng lặng > 0,5 s giữa các câu (giữ 0,15–0,2 s), nói vấp, nói lặp, ậm ừ. Nghi ngờ → giữ và đánh dấu hỏi. Lưu `$W/cut.mp4` + bản đồ thời gian gốc → mới; **mọi mốc sau tính theo video đã cắt**.
4. **Chia cảnh + trang CHỌN bằng hình** (bắt buộc, không hỏi bằng chữ, không render xem trước ở bước này): chia theo ý (thường 2–8 s; video 30 s ≈ 10–15 cảnh), mỗi cảnh một hiệu ứng chính + 1–3 phương án, **nói vì sao** (bảng ở [hieu-ung.md](references/hieu-ung.md) mục 5). Lưu `$W/scenes.json`, gom **một danh sách "CẦN GÌ CHO CẢNH NÀO"** (ảnh, số liệu, logo, bản đồ…) để chị gửi một lượt. Tạo trang (dữ liệu mẫu: `scripts/tao-trang.mjs` đầu tệp):
   ```bash
   node $K/scripts/tao-trang.mjs chon $W/scenes-chon.json --ra $P/output/chon-hieu-ung.html
   start "" "$P/output/chon-hieu-ung.html"    # macOS: open
   ```
   Chị bấm chọn → "Sao chép kết quả" → dán vào chat (dạng `Preset … Chọn hiệu ứng: Cảnh 1–3: chart_bars; Cảnh 4: map_route`). Không mở được trang mới dùng bảng chữ `Cảnh | mốc giây | lời | hiệu ứng`.
5. **Storyboard — chốt phương án, DỪNG LẠI.** Ghi lựa chọn vào `$W/timeline.json` ([timeline-json.md](references/timeline-json.md); mẫu `assets/mau/timeline_mau.json`; cảnh không nhắc giữ đề xuất, "bỏ" → `speaker_only`, cảnh liền cùng mã = một cụm), rồi `node $K/scripts/tao-trang.mjs storyboard $W/scenes-chot.json --ra $P/output/storyboard.html` (mỗi cảnh có `effect` + `need: [{"k":…,"ok":true|false}]`). Chị dán phản hồi: **"Chốt phương án"** → Bước 6; "Sửa trước khi chốt…" → áp dụng, **tạo lại** trang, hỏi lại; lặp tới khi chốt. Đổi hiệu ứng thì hỏi lại dữ liệu cần của mã mới.
6. **Dựng HyperFrames + xem thử nhanh.** Đọc skill `hyperframes` trước khi viết composition; mỗi hiệu ứng là một component theo trang mẫu `assets/effects/reference/*.html`; thư mục dự án chỉ có **một** `index.html` (nguồn đặt ngoài `hf/`; mẫu preset A: `assets/preset_A_example/`, sửa đường dẫn `D:/AutoEdit/…` trong `build.py`). Lint bằng CLI HyperFrames. **Kiểm vùng an toàn bắt buộc** trước khi chụp và trước khi render: đánh dấu video người nói + lớp nền `data-safe="ignore"`, rồi `py -3 -I $K/scripts/safe_check.py --html $W/hf/index.html --times <giữa và cuối mỗi hiệu ứng> --seek "<lệnh seek HyperFrames>"` — còn dòng "tràn" thì sửa và chạy lại tới khi sạch. **Khung thử** (`$P/output/preview/`) chỉ cho hiệu ứng chưa "đã duyệt mẫu" hoặc cảnh mới có dữ liệu thật; soi: đủ đỉnh tóc và cằm, viền sạch, không tràn chữ. **Bản xem thử:** `npx hyperframes render -q draft` → `$P/output/<ten>_preview.mp4` **có vẽ lớp vùng an toàn**; chị xem nhịp, nội dung → sửa chữ, nhịp, vị trí, âm lượng → xuất lại bản xem thử; chỉ render chuẩn khi chị nói đạt.
7. **Âm thanh:** SFX rất nhẹ khi thẻ / nhãn bật, nhạc nền thấp hơn giọng ≥ 18 dB; mức đã cân bằng ở [kinh-nghiem.md](references/kinh-nghiem.md) mục G. Chỉ dùng file trong thư viện trên (hoặc chị gửi), không tự tải nhạc không rõ bản quyền. Chưa có → chỉ giữ tiếng gốc và nhắc chị bỏ file vào.
8. **Render + kiểm:** `npx hyperframes render -q delivery` → `$P/output/<ten>_v1.mp4` (bản sạch, **không** lớp vùng an toàn). Tự kiểm: độ dài, tiếng không vỡ / lệch, chữ không tràn, không đè mặt, phông và dấu tiếng Việt đúng trên khung thật; trích vài khung ở mốc quan trọng. Báo kết quả + chỗ còn nghi. Sửa → `_v2`, `_v3`.
9. **Báo chị Linh:** đường dẫn `$P/output/`, thời lượng, dung lượng, số lần kiểm vùng an toàn, cảnh còn "ĐIỀN" (nếu có), chỗ chưa nghe bằng tai, a / b / c bước tiếp. Đăng bài không thuộc skill này.

## Cải tiến skill

Lỗi mới hoặc chị đổi cách làm → ghi một dòng vào [kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký* và sửa **đúng một chỗ**. Lần chạy thật đầu tiên: ghi số đo (thời gian phiên âm, dựng, render) — hiện **chưa có** (kinh-nghiem mục B). Đổi skill thì kiểm lại: `node tools/kiem-skill.mjs --all .claude/skills`.

## Liên quan

- Kịch bản trước khi quay: `mkt-linh-aloha-bds-video-script` · TTS / avatar: `mkt-elevenlabs-tts-to-mp3`, `heygen-mp3-to-mp4` (khi chị muốn thay người thật bằng MC ảo).
- Clip bản đồ vị trí & kết nối: `mkt-map-location-video` (nguồn cho `map_route`).
- Đồ hoạ khác: `mkt-hyperframe-talking-head-video`, `mkt-hyperframe-luxury-realestate-9-16`.
- Chi tiết: [hieu-ung.md](references/hieu-ung.md) (motion · vùng an toàn · 26 hiệu ứng) · [timeline-json.md](references/timeline-json.md) · [kinh-nghiem.md](references/kinh-nghiem.md).
