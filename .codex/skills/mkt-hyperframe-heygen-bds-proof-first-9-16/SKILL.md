---
name: mkt-hyperframe-heygen-bds-proof-first-9-16
description: Tạo end-to-end video bất động sản Việt Nam 9:16 theo format Proof-First, dùng HeyGen làm người dẫn ở các nhịp hook, bridge và CTA rồi dựng final bằng HyperFrames từ kho video BĐS thật, kho ảnh thật và Pexels B-roll local-first. Dùng khi cần video BĐS có avatar AI nhưng không muốn talking-head xuyên suốt; cần ưu tiên bằng chứng hình ảnh thật, quản lý provenance, gắn nhãn tư liệu minh họa, lập storyboard trước khi phát sinh chi phí HeyGen, render caption/SFX và QA bản final. Không dùng để biên tập raw footage có audio gốc làm narration chính.
---

# HeyGen BĐS Proof-First 9:16

Tạo video dọc trong đó HeyGen dẫn chuyện ngắn, còn media BĐS thật làm bằng chứng chính. Dùng HyperFrames để kiểm soát chính xác asset, caption, nhãn minh họa và nhịp cắt ở bản final.

## Luật cứng

1. Trước mọi lần tạo video HeyGen, nạp skill `heygen-video` và tuân thủ pipeline v3, avatar resolution, Frame Check, voice selection, polling và delivery của skill đó. Không gọi endpoint HeyGen v1/v2.
2. Trước khi author hoặc render HyperFrames, nạp skill `hyperframes` bắt buộc. Skill này quyết định format biên tập; skill HyperFrames quyết định contract kỹ thuật của composition.
3. Mặc định chỉ dùng HeyGen để tạo các A-roll ngắn: hook, một hoặc hai bridge và CTA. Không giao toàn bộ bản dựng cho Video Agent trừ khi user yêu cầu bản nhanh, ít kiểm soát.
4. Tỷ trọng mục tiêu theo thời lượng hình chính: HeyGen 15–30%, video/ảnh thật 55–80%, Pexels 0–15%. Giới hạn cứng: HeyGen không quá 35%, Pexels không quá 20%.
5. Ưu tiên nguồn theo thứ tự: đúng dự án/căn thật → đúng khu vực thật → kho video BĐS thật cùng loại → kho ảnh thật cùng loại → Pexels đúng hành động. Không dùng Pexels để chứng minh claim riêng của dự án.
6. Gắn nhãn `TƯ LIỆU MINH HỌA` khi video/ảnh có thể bị hiểu nhầm là dự án thật. Gắn `PHỐI CẢNH MINH HỌA` liên tục trên render/CGI. Không dùng render để chứng minh tiến độ hoặc hiện trạng.
7. Không sửa, ghi đè hoặc xóa kho nguồn. Chỉ copy/link asset đã chọn vào project và lưu provenance trong manifest.
8. Tạo script, claim map, media plan và storyboard; cho user duyệt trước khi gọi HeyGen hoặc render. Nếu user yêu cầu chạy thẳng, vẫn phải tự chạy validator trước khi phát sinh chi phí.
9. Tất cả claim về giá, pháp lý, tiến độ, vị trí, diện tích, tiện ích và bàn giao phải có nguồn. Khi thiếu bằng chứng, hạ claim thành ngôn ngữ minh họa hoặc dừng xin dữ liệu.
10. Xuất 1080×1920, 30 fps, H.264/AAC. Caption tiếng Việt tối đa hai dòng, không che mặt, chi tiết căn nhà hoặc UI TikTok/Reels.

## Đầu vào

Nhận càng nhiều mục sau càng tốt; tự phát hiện những mục đã có và chỉ hỏi phần còn thiếu làm thay đổi nội dung:

- Brief, listing, brochure, URL chính thức hoặc script.
- Kho video BĐS thật dùng để trám.
- Kho ảnh BĐS thật, ảnh dự án/căn cụ thể và ảnh khu vực.
- Kho Pexels local hoặc cấu hình Pexels để tải phần còn thiếu.
- `AVATAR-<NAME>.md`, avatar/voice HeyGen, CTA và hồ sơ thương hiệu.
- Video tham khảo về nhịp dựng; chỉ học hệ thống, không sao chép timeline.

## Output contract

Tạo project tại `workspace/content/YYYY-MM-DD/<slug>/`:

```text
BRIEF.md
CLAIMS.md
SCRIPT.md
media-inventory.json
media-plan.json
media-validation.json
media-manifest.json
STORYBOARD.md
storyboard-preview.html
storyboard-contact-sheet.png
heygen-prompts/
heygen-segments.json
heygen/
transcript.json
caption-groups.json
design.md
index.html
renders/<slug>-draft.mp4
renders/<slug>.mp4
RENDER-NOTES.md
```

## Quy trình

### 1. Khảo sát brief và kiểm kê kho

Xác định mục tiêu, khán giả, loại tài sản, trạng thái dự án, duration, CTA và các claim bắt buộc. Quét đệ quy ba kho nguồn:

```bash
python3 "$SKILL/scripts/inventory_media.py" \
  --real-video-dir "$REAL_VIDEO_LIBRARY" \
  --real-image-dir "$REAL_IMAGE_LIBRARY" \
  --pexels-dir "$PEXELS_LIBRARY" \
  --project-dir "$PROJECT_MEDIA" \
  --output "$OUT/media-inventory.json"
```

Có thể bỏ cờ của kho không tồn tại. Xem contact sheet hoặc frame đầu/giữa/cuối của mọi asset lọt shortlist; không chọn chỉ theo filename.

### 2. Viết claim map và script nói

Tạo `CLAIMS.md` gồm claim, mức độ `project-specific|location-specific|generic`, nguồn, asset có thể chứng minh và rủi ro diễn giải. Viết script tiếng Việt theo cấu trúc trong `references/proof-first-format.md`.

Giữ câu ngắn, nói tự nhiên, một video chỉ có một luận điểm chính. Không để avatar đọc lại mọi thông tin đã thể hiện rõ bằng hình. Chia script HeyGen thành 2–4 đoạn độc lập để có thể thay một đoạn mà không tạo lại toàn bộ video.

### 3. Lập media plan theo bằng chứng

Đọc `references/media-contracts.md` và tạo `media-plan.json` theo `references/media-plan.schema.json`. Mỗi beat phải có:

- `claim_scope`, `claim_source` và spoken anchor.
- Một `primary_visual` cùng provenance, crop và disclosure.
- Vai trò `hook|proof|bridge|objection|cta`.
- Lý do asset chứng minh được câu đang nói; không chèn B-roll chỉ để đổi hình.

Chạy validator ở chế độ khám phá, sửa lỗi nguồn và tỷ lệ:

```bash
python3 "$SKILL/scripts/validate_media_plan.py" \
  "$OUT/media-plan.json" \
  --report "$OUT/media-validation.json"
```

### 4. Storyboard approval gate

Tạo `STORYBOARD.md`, preview HTML và contact sheet. Hiển thị từng beat với lời, thời lượng, asset, crop/motion, nhãn, caption và SFX. Trình user duyệt script + storyboard trước khi tạo HeyGen vì đây là bước có chi phí và khó hoàn tác.

Không duyệt nếu:

- Pexels hoặc kho trám đang giả làm căn/dự án thật.
- Claim riêng dự án không có nguồn.
- HeyGen chiếm quá nhiều thời lượng hoặc media thật chưa đủ.
- Ảnh/render không có disclosure đúng loại.

### 5. Tạo A-roll HeyGen

Đọc `references/heygen-segment-prompts.md`. Dùng cùng một avatar, voice, tone, background và framing cho mọi segment. Yêu cầu clip presenter-only, không stock, không motion graphics, không text, không subtitle và không nhạc; phần minh họa sẽ được dựng sau.

Với mỗi segment:

1. Resolve `group_id` thành look phù hợp portrait; chạy Frame Check trong main session.
2. Tạo prompt đã gắn script concept, duration và negative directions.
3. Submit bằng HeyGen app hoặc CLI theo skill `heygen-video`; lưu `video_id`, `session_id`, prompt và output vào `heygen-segments.json`.
4. Download MP4; transcribe lại để lấy timing thật. Không ép timeline theo duration dự kiến.

Nếu avatar nói sai claim hoặc tên riêng, sửa prompt rồi tạo lại đúng segment; không tái tạo các đoạn đã đạt.

### 6. Resolve media thật rồi mới dùng Pexels

Khớp mỗi proof beat với asset theo thứ tự ưu tiên. Dùng video thật 2–6 giây; với ảnh thật, tạo pan/zoom/reveal có mục tiêu, không rung hoặc zoom vô nghĩa. Chỉ tìm Pexels sau khi hai kho thật không đủ và truy vấn phải mô tả `noun + verb + context`.

Lưu mọi asset chọn vào `media-manifest.json` với `source_kind`, path/URL, license/provenance, project match, claim scope, disclosure và khoảng dùng. Một clip Pexels chỉ dùng một lần; mute audio.

Chỉ dùng URI `inventory://...` trong dry-run. Trước strict QA, resolve mọi placeholder thành `asset_path` local tồn tại hoặc URL HTTP(S) có provenance.

### 7. Dựng HyperFrames

Dùng duration thật của các segment HeyGen làm đồng hồ. Xây master 1080×1920 với track gợi ý:

- A-roll HeyGen: 10
- Video/ảnh thật: 40+
- Pexels/render: 45+
- Disclosure: 55+
- Caption: 60+
- SFX: 70+

Giữ mặt presenter ở hook/bridge/CTA; cắt sang proof media đúng spoken anchor. Không che điểm bán hàng quan trọng bằng caption hoặc avatar PIP. Dùng hard cut/match cut mặc định; chỉ dùng transition nổi bật ở reveal hoặc đổi luận điểm.

### 8. Caption, sound và draft

Transcribe master narration để lấy word timestamps. Caption trắng, đậm, viền tối, tối đa hai dòng; ưu tiên Be Vietnam Pro nếu có. SFX tối đa 6 hit/phút, volume 0.12–0.30 và luôn duck dưới voice. Không tự thêm nhạc nếu user chưa yêu cầu.

Render draft và tạo contact sheet ở hook, mọi bridge, mọi claim proof, disclosure và CTA.

### 9. QA và final

Chạy validator strict trước final:

```bash
python3 "$SKILL/scripts/validate_media_plan.py" \
  "$OUT/media-plan.json" \
  --report "$OUT/media-validation.json" \
  --strict
```

Kiểm tra:

- Avatar/voice nhất quán; môi không lệch rõ; tên riêng phát âm đúng.
- Media đúng dự án hoặc được gắn nhãn minh họa; không claim sai bằng Pexels/render.
- Caption khớp lời, disclosure tồn tại đủ thời gian và CTA đọc được.
- Không frame đen, crop hỏng, ảnh mờ, watermark, audio click hoặc music lấn voice.
- H.264, 1080×1920, 30 fps, AAC 48 kHz; duration khớp timeline ±0,10 giây.

Chỉ render final sau khi draft đạt các mục trên hoặc ghi rõ concern chưa thể xử lý vào `RENDER-NOTES.md`.

## Tài nguyên cần đọc theo giai đoạn

- Cấu trúc format và nhịp nội dung: `references/proof-first-format.md`.
- Quy tắc chọn nguồn, provenance và disclosure: `references/media-contracts.md`.
- Prompt từng segment presenter: `references/heygen-segment-prompts.md`.
- Schema kế hoạch: `references/media-plan.schema.json`.
- Ví dụ kế hoạch hợp lệ: `references/example-media-plan.json`.
- Scripts: `scripts/inventory_media.py`, `scripts/validate_media_plan.py`.

**Format 1.0 — HeyGen ngắn, bằng chứng thật dài, Pexels chỉ trám.**
