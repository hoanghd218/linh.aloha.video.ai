---
name: mkt-hyperframe-talking-head-video
description: Dựng video TikTok/Reels 9:16 từ MP4 talking-head QUAY SẴN bằng HyperFrames kiểu infographic — phiên âm tiếng Việt (Whisper) → sửa lỗi → caption đồng bộ từng từ → b-roll mockup kính mờ neon (7 biến thể) xen kẽ mặt chia đôi màn hình, 6 SFX, zoom hook, recap, CTA → mở Studio preview (KHÔNG tự render). Dùng khi Hoàng đưa MP4 mặt quay sẵn và nói "tạo video tiktok từ footage", "build hyperframe talking head", "tạo 9:16 từ mp4 quay sẵn", "video chia sẻ kiến thức từ footage", "đóng gói video ngắn", "thêm caption + b-roll + SFX cho video quay sẵn". Không dùng khi mới có kịch bản, chưa có MP4 (→ mkt-full-video-with-11-hyperframe-heygen hoặc mkt-hyperframe-knowledge-video-heygen-9-16-lite), khi muốn chữ punch kiểu môi giới trên avatar full-frame (→ mkt-hyperframe-luxury-realestate-9-16), video 16:9 (→ mkt-hyperframe-talking-head-video-16-9), hay chỉ chỉnh nhỏ project HyperFrames có sẵn.
argument-hint: "[mp4-path] [slug]"
---

# mkt-hyperframe-talking-head-video — MP4 quay sẵn → project HyperFrames infographic

Phiên bản: v1.1 — 2026-11-11

Từ một MP4 talking-head 9:16 đã quay, dựng project HyperFrames hoàn chỉnh: caption đồng bộ, SFX, zoom hook trên mặt, cảnh b-roll mockup có hiệu ứng, recap và CTA. Kết thúc ở Studio preview — render MP4 chỉ khi Hoàng xác nhận. Skill này cũng là **kho script dùng chung**: `mkt-hyperframe-luxury-realestate-9-16` và `mkt-hyperframe-knowledge-video-heygen-9-16-lite` gọi script phiên âm / caption ở đây, không chép lại.

Chọn đúng skill: muốn **chữ punch nảy lên trên avatar full-frame** (kiểu môi giới BĐS) → `mkt-hyperframe-luxury-realestate-9-16`; muốn **infographic + chia đôi màn hình mặt / b-roll** từ footage có sẵn → skill này; chưa có video, mới có kịch bản → `mkt-full-video-with-11-hyperframe-heygen` (avatar suốt video) hoặc `mkt-hyperframe-knowledge-video-heygen-9-16-lite` (avatar 30–40%, tiết kiệm credit).

## Đầu vào → Đầu ra

| Vào | Ra (trong `P=workspace/content/YYYY-MM-DD/<slug>/`) |
|---|---|
| MP4 9:16 quay sẵn (bắt buộc) → copy thành `source.mp4` | `transcript.json` → `transcript-cleaned.json` + `caption-groups.json` |
| `script.txt` — lời nói thật (tuỳ chọn, để sửa lỗi Whisper) | `scenes.json` (kind · start · end · kicker · heading · variant · content) |
| Danh sách b-roll `[{path, purpose}]` (tuỳ chọn, tên ASCII) | `compositions/` — `captions.html`, `fs-lesson-N.html`, `recap-card.html`, `fs-cta.html` |
| Cấu trúc ("3 bài học + intro + CTA", "5 tips"; tự dò nếu thiếu) | `sfx/` (6 tệp), `index.html` gốc, URL Studio |

## Luật — không được phá

1. **Preview trước, không tự render** — dừng ở Studio; render 5–10 phút tốn CPU/GPU và preview bắt lỗi sớm.
2. **3 giây đầu LUÔN hiện mặt** — hook là overlay nhỏ phía trên (cách đỉnh ~180px, rộng 880px, thẻ kem), không b-roll toàn màn hình.
3. **Timing caption lấy từ transcript từng từ, KHÔNG sửa tay** — sửa chữ thì chỉ sửa `text` rồi `inject_captions.py`; sửa tay timing làm caption lệch 5s+ giữa video.
4. **Captions mount cuối cùng với track cao nhất** (`data-track-index="60"`, `style="z-index: 100;"`; cảnh lesson/recap/cta ở track 40–47) — nếu không, caption chìm sau cảnh nền tối.
5. **Căn giữa caption bằng `left: 0; right: 0; text-align: center`** + `.text` inline-block — `transform: translate(-50%, 0)` xung đột với GSAP `y`, caption văng ra ngoài.
6. **Timeline cảnh con tính TƯƠNG ĐỐI 0 → `data-duration`**, mount trong gốc bằng `data-composition-src` + `data-start = scene.start`; cảnh con bọc `<template>`, gốc thì không.
7. **Không animation thoát (trừ cảnh cuối), không tween `visibility`/`display` trên phần tử `clip`** — chỉ animate `opacity`; framework tự ẩn khi hết `data-duration`.
8. **Be Vietnam Pro mặc định** — không Poppins/Inter/Roboto/Helvetica (template đã gắn sẵn).
9. **SFX tối đa 5–6, cách nhau ≥ 1.5s, volume 0.15–0.32**; mỗi SFX là `<audio data-start=…>` (HyperFrames tự lập lịch), không kích bằng JS.
10. **Zoom punch trên video gốc đồng bộ SFX** — t=0s khớp `camera-flash`; các punch sau khi b-roll rút ra khớp lúc lộ cảnh; mẫu `scale 1.10 → 1.0`, `power3.out`, 0.55s.
11. **Whisper luôn `--language vi`, không bao giờ model `.en`** (`.en` dịch sang tiếng Anh thay vì phiên âm).

Cổng và luật chung: skill này không gọi API trả phí (phiên âm chạy local) — không có cổng credit; nhưng `P` đã tồn tại với `source.mp4` / `index.html` / `renders/` cũ thì hỏi a (dùng lại) / b (làm bản mới `<slug>-v2`) / c (ghi đè) trước khi ghi. Không đăng bài. Đường dẫn tương đối từ gốc repo; Windows thay `python3` bằng `python` hoặc `py -3`. Chữ trên màn hình không bịa số / pháp lý BĐS — lấy từ transcript hoặc script; thiếu thì ghi "chưa có". Brand Linh Aloha (xưng "em", gọi "anh chị", CTA) bám `mkt-linh-aloha-bds-video-script`. Báo xong = đường dẫn + số đo thật (`ffprobe`, số caption group, kết quả lint).

## Pipeline

```
MP4 9:16 (+ b-roll tuỳ chọn)
  1 Kiểm MP4 (ffprobe) ─ 2 Phiên âm + sửa chữ ─ 3 Dò cấu trúc cảnh ─ 4 Gán b-roll
  5 Scaffold cảnh (infographic v2) ─ 6 Caption + SFX ─ 7 index.html chia đôi màn hình
  8 Lint ─ 9 Preview Studio ─ DỪNG (chờ "render")
```

## Quy trình

```bash
K=.claude/skills/mkt-hyperframe-talking-head-video
P=workspace/content/YYYY-MM-DD/<slug>        # slug: bỏ dấu, chữ thường, dấu cách → "-" ("3 bài học .mp4" → 3-bai-hoc)
```

1. **Kiểm MP4.** `ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of json "<mp4>"`. 9:16 (1080×1920, 1440×2560…); ngang thì cảnh báo nhưng vẫn chạy (`object-fit: cover` sẽ cắt); dài > 180s cảnh báo (TikTok ưu ≤ 90s); FPS 24/25/30/60 đều được, đầu ra 30fps. Xong khi: biết thời lượng thật và đã báo cảnh báo (nếu có).
2. **Phiên âm + làm sạch.**
   ```bash
   mkdir -p $P/compositions $P/sfx && cp "<mp4>" $P/source.mp4
   (cd $P && npx hyperframes transcribe source.mp4 --model medium --language vi)   # → transcript.json
   python3 $K/scripts/clean_transcript.py $P/transcript.json    # → transcript-cleaned.json + caption-groups.json
   python3 $K/scripts/fix_caption_typos.py $P/caption-groups.json $P/script.txt   # ~25 lỗi Whisper biết trước; báo token đáng ngờ không có trong script
   ```
   `clean_transcript.py` áp bảng sửa lỗi tiếng Việt (`alphabit→Alphabet`, `dụng/dùng` theo ngữ cảnh…) và gom caption 3–5 từ, ngắt khi im lặng > 0.45s; chỉ sửa chữ, giữ nguyên timing. Có `script.txt` là lời nói thật: có thể chạy thêm `align_to_script.py` để lấy chữ từ script theo timing Whisper (xem `--help`). Xong khi: `caption-groups.json` phủ hết thời lượng.
3. **Dò cấu trúc cảnh.** `python3 $K/scripts/detect_scenes.py $P/transcript.json --output $P/scenes.json` — dò mốc "Bài học N / Tip N / Tổng kết / Comment…". Không ra cấu trúc rõ (vlog tự do) → đưa kết quả cho Hoàng xác nhận / ghi đè mốc. Schema: [scenes-schema.md](references/scenes-schema.md).
4. **Gán b-roll** (nếu có): mỗi b-roll khớp 1 cảnh theo "Bài học N" trong `purpose`; ảnh = nền toàn màn hình cảnh đó, video = nền hoặc PIP; hiệu ứng mặc định xếp LÊN TRÊN. Không có b-roll → cảnh chỉ chữ do script sinh. Chi tiết: [scenes-schema.md](references/scenes-schema.md).
5. **Scaffold cảnh — infographic v2 (MẶC ĐỊNH).** Bổ sung `mockup_variant` + `content` (+ `badges`) cho từng cảnh trong `scenes.json`, rồi:
   ```bash
   python3 $K/scripts/scaffold_infographic_v2.py --output $P/compositions/ --scenes $P/scenes.json
   ```
   7 variant chọn theo nội dung cảnh: `post-stack` (thương hiệu cá nhân / đăng bài) · `ai-window` (AI search / GEO) · `phone-call` (giọng / cuộc gọi) · `dashboard` (phân tích) · `app-card` (sản phẩm / SaaS) · `team-grid` (recap trước-sau, mặc định cho `recap`) · `comment-box` (CTA "comment X", mặc định cho `cta`). Schema nội dung, token thiết kế, huy hiệu nổi: [infographic-design-system.md](references/infographic-design-system.md). Vỏ chung tự áp: nền radial + lưới cyan + 10 hạt SVG + vignette + pill chủ đề + tiêu đề 110px slam từng từ. Mỗi cảnh: punch-zoom vào (xen 1.12 / 0.92), eyebrow → số → tiêu đề → dòng phụ, hiệu ứng nền, KHÔNG animation thoát. Bộ sinh cũ `scaffold_project.py` (vòng xung, góc, quét sáng) còn đó cho tương thích, không khuyến khích.
6. **Caption + SFX.**
   ```bash
   cp $K/assets/templates/captions.html.template $P/compositions/captions.html
   python3 $K/scripts/inject_captions.py $P/compositions/captions.html $P/caption-groups.json   # KHÔNG sửa tay mảng CAPTION_GROUPS
   SFX="$K/assets/sfx"
   cp "$SFX"/{camera-flash.mp3,"búng tay.mp3","Whoosh sound effect (1).mp3",Laser.mp3,ting.mp3,"Discord Notification - Sound Effect.mp3"} $P/sfx/
   ```
   6 SFX: `camera-flash` @0s (0.32) · `búng tay` lesson 1 − 0.05s (0.30) · `Whoosh` lesson 2 − 0.05s (0.22) · `Laser` lesson 3 − 0.05s (0.28) · `ting` recap − 0.05s (0.20) · `Discord Notification` CTA (0.28). Quy tắc âm lượng, khoảng cách, SFX thay thế: [sfx-library.md](references/sfx-library.md).
7. **`index.html` gốc chia đôi màn hình** (khuyến nghị khi có mặt + b-roll cùng lúc): mặt toàn khung lúc intro → khi b-roll lên, mặt co về nửa dưới (1080×960), b-roll nửa trên (scale 0.5) → cuối mỗi b-roll (~1.5s trước cảnh sau) mặt nở lại toàn khung ("nhịp thở" cho câu chốt) → caption tự chuyển giữa-giữa (split) và dưới (full).
   ```bash
   python3 $K/scripts/generate_root_index.py --output $P/index.html --scenes $P/scenes.json \
     --total-duration <thời lượng ffprobe> --header-label "<nhãn đầu>" --footer-handle "<handle>"
   ```
   `scenes.json` cần `brollEnd` + `hasBreath` mỗi cảnh. Lịch full/split: hook 0–12s **full mặt** · mỗi ý nhiều dữ liệu **split** · cuối mỗi ý **full mặt (câu chốt)** · recap **split trước, full sau** · CTA **split 2s đầu rồi full**. Chi tiết CSS, JS, giá trị `object-position`, cách đặt `brollEnd`: [split-screen-pacing.md](references/split-screen-pacing.md).
8. **Lint.** `cd $P && npx hyperframes lint`. Chấp nhận cảnh báo `composition_file_too_large` (chỉ thông tin) và `composition_self_attribute_selector` (mockup dùng `[data-composition-id="…"]` có chủ ý). Từ chối lỗi: `gsap_animates_clip_element`, `root_composition_missing_data_start` (cảnh con cần `data-start="0"` trên div trong), `media_missing_data_start` (`<audio>` SFX cần `data-start`), caption lệch (chạy lại `clean_transcript.py`). Xong khi: 0 lỗi.
9. **Preview rồi DỪNG.** `(cd $P && npx hyperframes preview)` chạy nền → URL Studio (thường `http://localhost:3002`). Báo Hoàng:
   - Studio URL · cấu trúc (`index.html`, `compositions/` gồm captions + N cảnh + recap + cta, `sfx/` 6 tệp).
   - Đã áp: số caption group, 6 SFX, số zoom punch + ambient drift, hook overlay 0–4s, b-roll từng cảnh, recap + CTA.
   - "Nói `render` khi OK → `npx hyperframes render` ra MP4 1080×1920 30fps. Cần chỉnh chỗ nào thì nói cụ thể (vd 'lesson 2 thiếu hiệu ứng', 'caption lớn quá', 'thay SFX laser bằng ting')."

   **Dừng ở đây** cho tới khi Hoàng xác nhận.

## Lỗi đã gặp / Kiểm

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Caption không hiện | Căn giữa bằng transform xung đột GSAP `y`; hoặc mount thấp track | Luật 4 + 5 |
| Caption lệch dần | Sửa tay timing | Luật 3 |
| Whisper ra tiếng Anh | Model `.en` | `--model medium --language vi` |
| Lint `gsap_animates_clip_element` | Tween `visibility` trên `clip` | Chỉ `opacity` |
| SFX im lặng | Đường dẫn / `data-start` / `data-volume` | `ls $P/sfx/`, kiểm `<audio>` |

Bảng đầy đủ + điều cần biết: [kinh-nghiem.md](references/kinh-nghiem.md); cách sửa từng mã lỗi: [pitfalls.md](references/pitfalls.md).

## Cải tiến skill

Gặp lỗi mới: thêm một hàng vào bảng và một dòng vào mục *Nhật ký* của [kinh-nghiem.md](references/kinh-nghiem.md), rồi sửa đúng một chỗ trong skill (đừng chép ra nhiều nơi).

## Liên quan

- Trước (tạo MP4): `heygen-mp3-to-mp4` (avatar lip-sync) hoặc quay thật; kịch bản: `mkt-linh-aloha-bds-video-script`.
- Cùng họ: `mkt-hyperframe-luxury-realestate-9-16` (chữ punch, avatar full-frame — dùng script caption của skill này) · `mkt-hyperframe-knowledge-video-heygen-9-16-lite` · `mkt-hyperframe-talking-head-video-16-9`.
- Pipeline trọn gói gọi Phase 3 qua agent `mkt-full-video-phase3-packager`: dùng kiểu chữ punch của `mkt-hyperframe-luxury-realestate-9-16`, chỉ mượn script caption ở đây.

## References + scripts

- [scenes-schema.md](references/scenes-schema.md) — cấu trúc `scenes.json`, gán b-roll. Đọc khi chạy `detect_scenes.py` hoặc sửa `scenes.json`.
- [infographic-design-system.md](references/infographic-design-system.md) — token, schema `content` 7 variant, huy hiệu. Đọc khi điền nội dung cảnh.
- [split-screen-pacing.md](references/split-screen-pacing.md) — bố cục chia đôi / nhịp thở. Đọc khi đổi lịch full / split.
- [effects-catalog.md](references/effects-catalog.md) — hiệu ứng GSAP từng loại cảnh. Đọc khi thêm / đổi hiệu ứng.
- [sfx-library.md](references/sfx-library.md) — mapping SFX, âm lượng, khoảng cách. Đọc khi đổi SFX.
- [design-tokens.md](references/design-tokens.md) — bảng màu, chữ. Đọc khi Hoàng muốn brand khác.
- [pitfalls.md](references/pitfalls.md) — 12 lỗi + cách sửa. Đọc khi lint / preview báo lỗi lạ.
- [kinh-nghiem.md](references/kinh-nghiem.md) — lỗi hay gặp, điều cần biết, nhật ký.
- Script ở `scripts/`: `clean_transcript.py`, `fix_caption_typos.py`, `align_to_script.py`, `inject_captions.py`, `detect_scenes.py`, `scaffold_infographic_v2.py`, `generate_root_index.py` (đang dùng) · `scaffold_project.py` (cũ) · `generate_rich_brolls.py`, `generate_infographic_brolls.py` (b-roll cố định của video cũ, chưa dùng). Template ở `assets/templates/`, SFX ở `assets/sfx/`.
