---
name: mkt-hyperframe-heygen-bds-proof-first-9-16
description: Làm video BĐS Việt Nam 9:16 theo format Proof-First: HeyGen chỉ dẫn ngắn ở hook / bridge / CTA (15–30% thời lượng), còn lại là video + ảnh thật của dự án (55–80%), Pexels chỉ trám (≤ 15%), dựng final bằng HyperFrames; mỗi tư liệu có nguồn gốc và nhãn minh hoạ đúng loại. Quy trình: brief → claim map → script → `media-plan.json` (validator) → storyboard Hoàng duyệt TRƯỚC khi tốn tiền HeyGen → A-roll → dựng → caption, SFX, QA. Dùng khi cần video BĐS có avatar AI nhưng không talking-head xuyên suốt, ưu tiên bằng chứng hình ảnh thật, kiểm kê kho video / ảnh, gắn nhãn tư liệu minh hoạ, lập storyboard, QA final; Hoàng nói "video proof-first", "avatar chỉ hook và CTA". Không dùng để biên tập raw footage có audio gốc làm narration (→ mkt-edit-video-bds-linh-hoat), pipeline talking-head xuyên suốt (→ mkt-full-video-with-11-hyperframe-heygen), hay chỉ đổi MP3 thành avatar (→ heygen-mp3-to-mp4).
argument-hint: "[--du-an <tên dự án>] [--brief brief.md] [--slug <slug>] [--thoi-luong 45-75]"
---

# HeyGen BĐS Proof-First 9:16

Phiên bản: v1.1 — 2026-11-11

Video dọc trong đó HeyGen dẫn chuyện ngắn, còn media BĐS thật làm bằng chứng chính; HyperFrames kiểm soát chính xác asset, caption, nhãn minh hoạ và nhịp cắt ở bản final. **Format 1.0 — HeyGen ngắn, bằng chứng thật dài, Pexels chỉ trám.**

| Đầu vào (nhận càng nhiều càng tốt; chỉ hỏi phần thiếu làm đổi nội dung) | Đầu ra — project `workspace/content/YYYY-MM-DD/<slug>/` |
|---|---|
| Brief, listing, brochure, URL chính thức hoặc script | `BRIEF.md` · `CLAIMS.md` · `SCRIPT.md` |
| Kho video BĐS thật (dùng để trám) · kho ảnh thật · ảnh dự án / căn cụ thể · ảnh khu vực | `media-inventory.json` · `media-plan.json` · `media-validation.json` · `media-manifest.json` |
| Kho Pexels local (hoặc cấu hình Pexels để tải phần thiếu) | `STORYBOARD.md` · `storyboard-preview.html` · `storyboard-contact-sheet.png` |
| `AVATAR-<NAME>.md`, avatar / voice HeyGen, CTA, hồ sơ thương hiệu | `heygen-prompts/` · `heygen-segments.json` · `heygen/` · `transcript.json` · `caption-groups.json` |
| Video tham khảo về nhịp dựng (chỉ học hệ thống, không sao chép timeline) | `design.md` · `index.html` · `renders/<slug>-draft.mp4` · `renders/<slug>.mp4` · `RENDER-NOTES.md` |

## Luật — không được phá

1. **Cổng duyệt tiền** — viết script, claim map, media plan, storyboard rồi **đợi Hoàng duyệt trước khi gọi HeyGen** (và ElevenLabs nếu đi đường B ở bước 5) hoặc render; đây là bước có chi phí, khó hoàn tác. Hoàng bảo chạy thẳng thì vẫn tự chạy validator trước khi phát sinh chi phí. Hỏi kèm a / b / c.
2. **HeyGen chỉ v3** — không gọi endpoint v1/v2; cài đặt, upload asset, engine, cách tính tiền theo skill `heygen-mp3-to-mp4`. **HyperFrames:** nạp skill `hyperframes` (cài ở máy, ngoài repo) trước khi author hay render; skill này quyết định *format biên tập*, `hyperframes` quyết định *hợp đồng kỹ thuật* của composition.
3. **HeyGen chỉ làm A-roll ngắn** — hook, một hoặc hai bridge, CTA. Không giao toàn bộ bản dựng cho Video Agent trừ khi Hoàng yêu cầu bản nhanh, ít kiểm soát.
4. **Tỷ trọng theo thời lượng hình chính** — mục tiêu: HeyGen 15–30%, video / ảnh thật 55–80%, Pexels 0–15%. Giới hạn cứng: HeyGen ≤ 35%, Pexels ≤ 20%.
5. **Thứ tự ưu tiên nguồn:** đúng dự án / căn thật → đúng khu vực thật → kho video BĐS thật cùng loại → kho ảnh thật cùng loại → Pexels đúng hành động. Không dùng Pexels để chứng minh claim riêng của dự án.
6. **Nhãn minh hoạ** — `TƯ LIỆU MINH HỌA` khi video / ảnh có thể bị hiểu nhầm là dự án thật; `PHỐI CẢNH MINH HỌA` liên tục trên render / CGI. Không dùng render để chứng minh tiến độ hay hiện trạng.
7. **Không sửa, ghi đè hay xoá kho nguồn** — chỉ copy / link asset đã chọn vào project và lưu provenance trong manifest.
8. **Mọi claim về giá, pháp lý, tiến độ, vị trí, diện tích, tiện ích, bàn giao phải có nguồn** — thiếu bằng chứng thì hạ claim thành ngôn ngữ minh hoạ hoặc dừng xin dữ liệu; không bịa số.
9. **Xuất 1080×1920, 30 fps, H.264 / AAC**; caption tiếng Việt tối đa hai dòng, không che mặt, chi tiết căn nhà hay UI TikTok/Reels.
10. **Khoá chỉ đọc từ `.env`** (`HEYGEN_API_KEY`, `ELEVENLABS_API_KEY`… theo skill tương ứng) — không in giá trị. Chưa thấy biến Pexels trong `.env` / `.env.example` thì hỏi Hoàng, không đoán tên biến.
11. **Giọng, xưng hô, chữ ký, CTA theo skill kịch bản** `mkt-linh-aloha-bds-video-script` (xem `mkt-linh-aloha-bds-video-script/references/brand-voice.md`). Chỗ quy tắc hook / CTA của format này ([references/heygen-segment-prompts.md](references/heygen-segment-prompts.md): hook không chào / xưng tên, CTA một hành động) lệch với brand thì hỏi Hoàng a / b / c, không tự chọn.
12. **Xong thì báo đường dẫn tệp ra + số đo thật** — tỉ trọng HeyGen / thật / Pexels lấy từ `media-validation.json`, thời lượng / độ phân giải / fps / codec đo bằng `ffprobe`; chưa chạy validator `--strict` và draft thì không nói "xong".

## Quy trình

Đặt `K=.claude/skills/mkt-hyperframe-heygen-bds-proof-first-9-16` · `OUT=workspace/content/YYYY-MM-DD/<slug>`. Kho nguồn là đường dẫn của Hoàng — `REAL_VIDEO_LIBRARY` · `REAL_IMAGE_LIBRARY` · `PEXELS_LIBRARY` · `PROJECT_MEDIA` (hỏi nếu chưa biết; kho `workspace/kho-tư-liệu-bất-động-sản/` của repo hiện chỉ có thư mục con `03_âm-thanh`, chưa có kho video / ảnh). Windows: dùng `python` thay `python3`.

### 1. Khảo sát brief và kiểm kê kho
Xác định mục tiêu, khán giả, loại tài sản, trạng thái dự án, thời lượng, CTA, các claim bắt buộc. Quét đệ quy các kho:
```bash
python3 $K/scripts/inventory_media.py --real-video-dir "$REAL_VIDEO_LIBRARY" --real-image-dir "$REAL_IMAGE_LIBRARY" \
  --pexels-dir "$PEXELS_LIBRARY" --project-dir "$PROJECT_MEDIA" --output $OUT/media-inventory.json
```
Bỏ cờ của kho không tồn tại. Xem contact sheet hoặc khung đầu / giữa / cuối của mọi asset lọt shortlist — không chọn theo tên tệp.
**Xong khi** `media-inventory.json` có asset thuộc từng kho đã khai báo và shortlist đã xem hình thật.

### 2. Claim map và script
`CLAIMS.md`: claim · mức độ `project-specific | location-specific | generic` · nguồn · asset có thể chứng minh · rủi ro diễn giải. Script tiếng Việt theo [references/proof-first-format.md](references/proof-first-format.md): câu ngắn, nói tự nhiên, một video một luận điểm chính; không để avatar đọc lại điều hình đã nói rõ. Chia script HeyGen thành 2–4 đoạn độc lập để thay một đoạn mà không tạo lại cả video.
**Xong khi** mọi claim trong script có dòng trong `CLAIMS.md` kèm nguồn (hoặc đã hạ thành lời minh hoạ).

### 3. Media plan theo bằng chứng
Đọc [references/media-contracts.md](references/media-contracts.md); tạo `media-plan.json` theo [references/media-plan.schema.json](references/media-plan.schema.json) (mẫu: [references/example-media-plan.json](references/example-media-plan.json)). Mỗi beat có: `claim_scope`, `claim_source`, spoken anchor · một `primary_visual` kèm provenance, crop, disclosure · vai trò `hook | proof | bridge | objection | cta` · lý do asset chứng minh được câu đang nói (không chèn B-roll chỉ để đổi hình). Chạy validator chế độ khám phá và sửa lỗi nguồn / tỉ lệ:
```bash
python3 $K/scripts/validate_media_plan.py $OUT/media-plan.json --report $OUT/media-validation.json
```
**Xong khi** `status: PASS` (không còn `errors`; xem từng `warnings`).

### 4. Cổng duyệt storyboard (luật 1)
Tạo `STORYBOARD.md`, preview HTML, contact sheet: từng beat có lời, thời lượng, asset, crop / motion, nhãn, caption, SFX. Trình Hoàng duyệt script + storyboard **trước khi tạo HeyGen**. **Không duyệt nếu:** Pexels / kho trám đang giả làm căn hay dự án thật · claim riêng dự án không có nguồn · HeyGen chiếm quá nhiều thời lượng hoặc media thật chưa đủ · ảnh / render thiếu disclosure đúng loại.
**Xong khi** Hoàng nói "duyệt" (hoặc a trong câu hỏi a / b / c).

### 5. Tạo A-roll HeyGen
Đọc [references/heygen-segment-prompts.md](references/heygen-segment-prompts.md). Dùng **cùng một** avatar, voice, tone, nền, khung hình cho mọi đoạn; clip chỉ có người dẫn — không stock, không motion graphics, không chữ, không subtitle, không nhạc (phần minh hoạ dựng sau). Chọn đường:
- **Đường B (mặc định trong repo này):** lời từng đoạn đã duyệt → `mkt-elevenlabs-tts-to-mp3` → `heygen-mp3-to-mp4` (lời cố định từng chữ nên kiểm được claim; mỗi lần gọi vẫn qua cổng xác nhận tiền của skill đó). Lưu MP3 / MP4 vào `heygen/`.
- **Đường A (Video Agent):** cần skill `heygen-video` của HeyGen chính hãng — **không nằm trong repo**; máy có cài và Hoàng chọn thì dùng: resolve `group_id` thành look chân dung, chạy Frame Check trong phiên chính, gắn prompt gốc + negative directions, nộp bằng app / CLI theo skill đó.

Mỗi đoạn: lưu `video_id` (cộng `session_id` + prompt nếu đường A, MP3 nguồn nếu đường B), đường dẫn ra, transcript vào `heygen-segments.json`; tải MP4 rồi **phiên âm lại để lấy timing thật** — không ép timeline theo thời lượng dự kiến. Avatar nói sai claim / tên riêng → sửa rồi tạo lại **đúng đoạn đó**, không tạo lại đoạn đã đạt.
**Xong khi** mỗi đoạn có MP4 + transcript + dòng trong `heygen-segments.json`.

### 6. Resolve media thật, rồi mới dùng Pexels
Khớp mỗi proof beat theo thứ tự ưu tiên của luật 5. Video thật 2–6 giây; ảnh thật dùng pan / zoom / reveal có mục đích (không rung, không zoom vô nghĩa). Chỉ tìm Pexels khi hai kho thật không đủ, truy vấn dạng `noun + verb + context`. Mọi asset chọn ghi vào `media-manifest.json`: `source_kind`, path / URL, license / provenance, project match, claim scope, disclosure, khoảng dùng. Một clip Pexels dùng một lần, tắt tiếng. `inventory://…` chỉ dùng khi dry-run; trước strict QA phải thành `asset_path` local tồn tại hoặc URL HTTP(S) có provenance.
**Xong khi** không còn `inventory://…` và mọi asset có provenance.

### 7. Dựng HyperFrames
Lấy thời lượng thật của các đoạn HeyGen làm đồng hồ. Master 1080×1920, track gợi ý: A-roll HeyGen **10** · video / ảnh thật **40+** · Pexels / render **45+** · disclosure **55+** · caption **60+** · SFX **70+**. Giữ mặt người dẫn ở hook / bridge / CTA; cắt sang media bằng chứng đúng spoken anchor; không che điểm bán hàng quan trọng bằng caption hay avatar PIP. Mặc định hard cut / match cut; transition nổi bật chỉ ở reveal hoặc đổi luận điểm.

### 8. Caption, âm thanh, draft
Phiên âm master để lấy word timestamps. Caption trắng, đậm, viền tối, tối đa hai dòng; Be Vietnam Pro nếu có. SFX tối đa 6 hit / phút, volume 0,12–0,30, luôn duck dưới giọng; không tự thêm nhạc khi Hoàng chưa yêu cầu. Render `renders/<slug>-draft.mp4` và contact sheet ở hook, mọi bridge, mọi claim proof, disclosure, CTA.

### 9. QA và final
```bash
python3 $K/scripts/validate_media_plan.py $OUT/media-plan.json --report $OUT/media-validation.json --strict
```
Kiểm: avatar / voice nhất quán, môi không lệch rõ, tên riêng phát âm đúng · media đúng dự án hoặc có nhãn minh hoạ, không claim sai bằng Pexels / render · caption khớp lời, disclosure đủ thời gian, CTA đọc được · không khung đen, crop hỏng, ảnh mờ, watermark, click âm thanh, nhạc lấn giọng · H.264, 1080×1920, 30 fps, AAC 48 kHz, thời lượng khớp timeline ±0,10 giây. Chỉ render final sau khi draft đạt, hoặc ghi rõ concern chưa xử lý được vào `RENDER-NOTES.md`.
**Xong khi** validator `--strict` PASS, `ffprobe` khớp thông số, `RENDER-NOTES.md` đã ghi.

## Lỗi hay gặp (thông báo của validator)

| Triệu chứng | Cách sửa |
|---|---|
| `specific claim requires claim_source` | Thêm nguồn cho beat có `claim_scope` riêng dự án / khu vực |
| `<source_kind> cannot be primary proof for a project-specific claim` | Đổi `primary_visual` sang `project-video` / `project-image` / `map` / `document`, hoặc hạ claim |
| `render-image requires persistent 'PHỐI CẢNH MINH HỌA'` · `ambiguous Pexels / library media requires 'TƯ LIỆU MINH HỌA'` | Thêm `disclosure_label` đúng loại (luật 6) |
| `Pexels must set illustrative=true` · `Pexels asset … is reused` | Đặt `illustrative: true`; mỗi clip Pexels một lần |
| `HeyGen ratio … exceeds 35%` · `Pexels ratio … exceeds 20%` | Rút đoạn HeyGen / thay Pexels bằng media thật (luật 4) |
| `strict mode requires asset_id` · `missing asset_path` · `unresolved or invalid source_url` | Resolve `inventory://…` thành đường dẫn / URL thật (bước 6) |
| `format must be 'proof-first-9-16'` | Đặt đúng `format` ở đầu `media-plan.json` |

## Cải tiến skill
Gặp lỗi mới hoặc Hoàng đổi cách làm → ghi vào [references/kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*, sửa đúng một chỗ (script · reference · tệp này).

## Liên quan
- Lời thoại + brand: `mkt-linh-aloha-bds-video-script` (xưng "em", gọi "anh chị", "Aloha anh chị, em Linh đây", CTA).
- A-roll: `mkt-elevenlabs-tts-to-mp3` → `heygen-mp3-to-mp4` (đường B); skill `heygen-video` (đường A, ngoài repo).
- Kế hoạch dựng theo lời nói, ảnh phối cảnh, nhãn `PHỐI CẢNH MINH HỌA`: `mkt-edit-video-bds-linh-hoat` (dùng chung quy tắc nhãn).
- Design tokens BĐS hạng sang 9:16: `mkt-hyperframe-luxury-realestate-9-16`.
- Ảnh minh hoạ do AI sinh (nếu cần): `mkt-kie-broll-image-generator` — phải gắn nhãn minh hoạ.
- Chọn format: chỉ cần talking-head xuyên suốt → `mkt-full-video-with-11-hyperframe-heygen`; dựng từ raw footage có audio gốc → `mkt-edit-video-bds-linh-hoat`.
