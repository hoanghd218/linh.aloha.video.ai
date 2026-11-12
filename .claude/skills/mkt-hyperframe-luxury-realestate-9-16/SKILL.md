---
name: mkt-hyperframe-luxury-realestate-9-16
description: Kiểu dựng Broker-Creator Punchy cho video BĐS / coach / bán hàng 9:16 bằng HyperFrames — avatar (HeyGen hoặc MP4 talking-head) FULL-FRAME suốt video, chữ punch (trắng viền đen, giá đỏ, gấp rút vàng) nảy lên đúng từ nhấn, zoom hook, b-roll full-screen thưa, caption TikTok, SFX BĐS. Có 7 biến thể chữ, mẫu overlay chống tràn, luật b-roll khớp ngữ cảnh. Là skill thẩm mỹ của Phase 3 trong mkt-full-video-with-11-hyperframe-heygen (tên "luxury" là tên cũ). Dùng khi có source.mp4 và Hoàng nói "chữ punch trên avatar", "text overlay nảy lên", "video môi giới kiểu TikTok", "broker creator", "làm lại overlay / zoom / SFX cho video BĐS". Không dùng cho footage quay sẵn muốn infographic kính mờ chia đôi màn hình (→ mkt-hyperframe-talking-head-video), video kiến thức avatar 30–40% (→ mkt-hyperframe-knowledge-video-heygen-9-16-lite), kịch bản ra MP4 trọn gói (→ mkt-full-video-with-11-hyperframe-heygen).
argument-hint: "[slug] [--auto-overlays]"
---

# mkt-hyperframe-luxury-realestate-9-16 — Broker-Creator Punchy 9:16

Phiên bản: v1.1 — 2026-11-11

Kiểu của môi giới TikTok Việt 2025-2026: người nói luôn ở trên hình, thông điệp được nhấn bằng chữ siêu to, không bao giờ giấu người nói sau slide. Skill này là bộ **thẩm mỹ + mẫu code** cho Phase 3 của `mkt-full-video-with-11-hyperframe-heygen` (agent `mkt-full-video-phase3-packager` chạy nó); dùng riêng khi đã có `source.mp4`. Phần dùng chung (phiên âm, caption) dùng script của `mkt-hyperframe-talking-head-video`, không chép lại ở đây.

Không dùng cho: footage quay sẵn muốn infographic kính mờ + chia đôi màn hình (→ `mkt-hyperframe-talking-head-video`) · video kiến thức / review dự án có avatar chỉ 30–40% (→ `mkt-hyperframe-knowledge-video-heygen-9-16-lite`) · từ kịch bản ra MP4 trọn gói (→ `mkt-full-video-with-11-hyperframe-heygen`) · 16:9 (→ `mkt-hyperframe-talking-head-video-16-9`).

## Đầu vào → Đầu ra

| Vào | Ra |
|---|---|
| `source.mp4` 9:16 (HeyGen lip-sync hoặc quay thật) + `voiceover.mp3` | `index.html` — avatar full-frame + zoom hook + SFX + overlay + b-roll + captions |
| `script.txt` (lời nói thật, để sửa lỗi Whisper) | `transcript.json` → `transcript-cleaned.json` → `caption-groups.json` |
| Danh sách từ nhấn (AI đề xuất, Hoàng duyệt) | `overlays-outline.json` → `overlays/overlay-NN.json` → `overlays.json` |
| `broll/` ảnh hoặc video của người dùng (tên ASCII) | `compositions/overlay-NN.html` (10–20), `broll-NN.html` (0–3), `captions.html`, `sfx/` |

Mọi đường dẫn nằm trong `P=workspace/content/YYYY-MM-DD/<slug>/`.

## Luật — không được phá

1. **Avatar full-frame 1080×1920 suốt video** (`object-fit: cover`, z-index 1) — không split-screen, không PIP, không `top-strip`, không `goSplit()`/`goFull()`; avatar là phông nền không đổi.
2. **Chữ overlay luôn có `max-width: 960px` + `fitText()` chạy trong `document.fonts.ready.then(run)` TRƯỚC khi dựng GSAP** — Be Vietnam Pro 900 tràn canvas ở ~10 ký tự; lỗi hiển thị số 1.
3. **Selector CSS dùng `[data-composition-id="…"]`, không `#id`** — HyperFrames gỡ `id` của root lúc mount, `#id` làm overlay vô hình / render đen.
4. **Tên tệp asset ASCII** (không dấu, không dấu cách) — tên tiếng Việt trả 404 lúc render.
5. **Zoom hook: cách nhau tối đa 4s, đỉnh 1.04–1.10, KHÔNG bao giờ ≥ 1.15** — mỗi từ nhấn có zoom + chữ + SFX cùng thời điểm.
6. **B-roll chỉ chèn khi khớp đúng lời đang nói** — thà để avatar còn hơn chèn ảnh lạc đề; full-screen takeover là mặc định, 1–3 insert / 60s.
7. **Timeline GSAP `paused: true`, đăng ký `window.__timelines['id']`, root bọc trong `<template>`** — thiếu một trong ba, render không chạy animation hoặc mount trống.
8. **Captions mount cuối cùng** (track 60, z-index 100), dưới giữa kiểu TikTok; thời gian lấy từ transcript từng từ, KHÔNG sửa tay timing.
9. **Preview trước, không tự render** — kết thúc ở Studio; `render` chỉ khi Hoàng nói.
10. **Không bịa số / pháp lý BĐS trong chữ overlay** — giá, diện tích, tiến độ, chính sách lấy từ `script.txt` hoặc `_kien-thuc-du-an/` của dự án; thiếu thì không dựng overlay số đó. Giá chưa chốt ghi rõ "dự kiến".
11. **Whisper luôn `--language vi`**, không bao giờ model `.en` (model `.en` dịch sang tiếng Anh thay vì phiên âm).

Cổng và luật chung: skill này không gọi API trả phí (Whisper chạy local qua `npx hyperframes transcribe`); không đăng bài; có `index.html` hoặc `renders/` cũ trong `P` thì hỏi a (làm bản mới `-v2`) / b (ghi đè) / c (dừng) rồi mới ghi. Khoá API: không dùng khoá nào; nếu cần thì chỉ đọc từ `.env`. Brand Linh Aloha (xưng "em", gọi "anh chị", câu "Aloha anh chị, em Linh đây", CTA): chữ trên màn hình bám kịch bản của `mkt-linh-aloha-bds-video-script`, không soạn lại ở đây. Báo xong = đường dẫn tệp + số đo thật (`ffprobe`, số overlay, số cảnh báo lint), không nói "xong" khi chưa lint.

## Pipeline

```
source.mp4 (+ voiceover.mp3 + script.txt)
  ├─ phiên âm + gom caption (script của talking-head)
  ├─ tìm TỪ NHẤN (thương hiệu, giá, gấp rút, CTA)  ─►  overlays-outline.json
  ├─ CHECKPOINT — Hoàng duyệt danh sách từ nhấn + mốc thời gian (bỏ qua nếu auto_overlays)
  ├─ viết N overlay (mỗi từ nhấn = 1 clip)          ─►  overlays/*.json → overlays.json
  ├─ dựng compositions/overlay-*.html, broll-*.html, captions.html
  ├─ copy SFX · nối index.html (avatar → zoom hook → SFX → overlay → b-roll → captions)
  └─ lint + snapshot ─► mở Studio preview ─► DỪNG
```

Layer: avatar `#v-source` z-index 1 → header/brand 30 → b-roll 70 → overlay 80–90 → captions 100 (mẫu đầy đủ ở [index-scaffold.md](references/index-scaffold.md)).

## 7 biến thể chữ (tóm tắt)

`punch-white` (headline, thương hiệu) · `punch-red` (giá, số lớn) · `punch-yellow` (gấp rút) · `punch-2line` (câu hỏi đối lập) · `punch-subtle` (phụ đề) · `punch-bubble-number` (đếm 1/2/3) · `punch-neon-outline` (năm, từ xu hướng). Bảng đầy đủ (kiểu, cỡ, vị trí, cỡ chữ tối đa/tối thiểu cho fitText), mẫu composition và hoạt ảnh scale-pop: [overlay-template.md](references/overlay-template.md). Chọn 2–3 màu chủ đạo mỗi video, đừng dùng đủ 5 màu đều nhau.

## Quy trình

Khai báo một lần:

```bash
K=.claude/skills/mkt-hyperframe-luxury-realestate-9-16
T=.claude/skills/mkt-hyperframe-talking-head-video      # script phiên âm + caption dùng chung
P=workspace/content/YYYY-MM-DD/<slug>
```

(Windows: thay `python3` bằng `python` hoặc `py -3`.)

1. **Kiểm đầu vào.** `ffprobe -v error -show_entries format=duration:stream=width,height -of json $P/source.mp4` → 9:16, ghi thời lượng. Ảnh trong `$P/broll/` phải tên ASCII. `mkdir -p $P/compositions $P/overlays $P/sfx`. Xong khi: có `source.mp4`, `script.txt`, thời lượng thật.
2. **Phiên âm + caption** (audio là `voiceover.mp3` — trùng audio của `source.mp4`; nếu chưa có thì dùng `source.mp4`):
   ```bash
   (cd $P && npx hyperframes transcribe voiceover.mp3 --model medium --language vi)   # → $P/transcript.json
   python3 $T/scripts/clean_transcript.py $P/transcript.json    # → transcript-cleaned.json + caption-groups.json (cùng thư mục)
   python3 $T/scripts/fix_caption_typos.py $P/caption-groups.json $P/script.txt   # sửa lỗi Whisper tiếng Việt, ghi đè tại chỗ
   cp $T/assets/templates/captions.html.template $P/compositions/captions.html
   python3 $T/scripts/inject_captions.py $P/compositions/captions.html $P/caption-groups.json
   ```
   Xong khi: `caption-groups.json` phủ hết thời lượng, `captions.html` có mảng `CAPTION_GROUPS` mới.
3. **Tìm từ nhấn → `overlays-outline.json`.** Mỗi mục: `text`, `variant`, `start`, `duration`, vị trí, kiểu zoom + đỉnh, SFX. Đủ từ khoá: thương hiệu, giá / con số, gấp rút, CTA; mỗi từ nhấn có zoom (khoảng trống ≤ 4s). **CHECKPOINT:** đưa bảng cho Hoàng duyệt, chờ trả lời; không viết overlay trước khi Hoàng đồng ý (bỏ qua khi `--auto-overlays`).
4. **Viết overlay.** Mỗi mục đã duyệt → `$P/overlays/overlay-NN.json`; nếu có công cụ `Agent` thì giao song song 1 người viết / overlay trong cùng một lượt, không thì viết tuần tự — đầu ra như nhau. Gộp thành `overlays.json`. Xong khi: số JSON = số mục trong outline, JSON nào hỏng thì viết lại riêng cái đó.
5. **Dựng composition.** `overlay-NN.html` từ [overlay-template.md](references/overlay-template.md) (chữ đã qua `fitText`); `broll-NN.html` theo [broll-inserts.md](references/broll-inserts.md) (chỉ ảnh khớp ngữ cảnh). Xong khi: mỗi `.punch` có `max-width: 960px` và gọi `fitText`.
6. **SFX.** Copy + đổi tên theo [sfx-bds.md](references/sfx-bds.md) (ngân sách ≤ 6 lần phát / video 60s). Xong khi: mọi `src="sfx/…"` trỏ tới tệp có thật.
7. **Nối `index.html`** theo [index-scaffold.md](references/index-scaffold.md) + khối `ZOOM_HOOKS` theo [zoom-hooks.md](references/zoom-hooks.md). `data-duration` lấy từ `ffprobe`. Xong khi: avatar full-frame, overlay z-index 80–90, captions cuối z-index 100.
8. **Kiểm.** `cd $P && npx hyperframes lint` → 0 lỗi (bỏ qua cảnh báo `composition_file_too_large` và `composition_self_attribute_selector`); `npx hyperframes snapshot` ở các mốc b-roll và vài overlay dài nhất — xem chữ không cụt, b-roll thay avatar sạch.
9. **Preview rồi DỪNG.** `npx hyperframes preview` (chạy nền; cổng bận thì `--port 3003`) → báo URL Studio (thường `http://localhost:3002`). Hoàng nói "render" mới chạy `npx hyperframes render -q draft -o renders/<slug>-draft.mp4`, rồi `-q standard` hoặc `-q high` cho bản cuối.

## Lỗi đã gặp / Kiểm

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Overlay vô hình / render đen | Dùng selector `#id` | `[data-composition-id="…"]` (lint gợi ý `#id` là sai) |
| Ảnh 404 lúc render | Tên tệp có dấu / dấu cách | Đổi sang ASCII |
| Chữ cụt hai cạnh | Thiếu `max-width` + `fitText` | Áp mẫu trong overlay-template.md |
| Animation không chạy | Thiếu `paused: true` / `window.__timelines` / `<template>` | Sửa theo luật 7 |

Bảng đầy đủ (SVG `fill="none"`, khoá kích thước mount, chồng chữ, easing…) và mọi điều cần biết khi đọc skill: [kinh-nghiem.md](references/kinh-nghiem.md).

## Cải tiến skill

Gặp lỗi mới: thêm một hàng vào bảng và một dòng vào mục *Nhật ký* của [kinh-nghiem.md](references/kinh-nghiem.md), rồi sửa đúng một chỗ trong skill (đừng chép thêm vào nơi khác).

## Liên quan

- Trước: `mkt-linh-aloha-bds-video-script` (kịch bản) → `mkt-elevenlabs-tts-to-mp3` / `mkt-video-script-to-mp3` (giọng) → `heygen-mp3-to-mp4` (`source.mp4`).
- Gọi bởi: `mkt-full-video-with-11-hyperframe-heygen` qua agent `mkt-full-video-phase3-packager`.
- Dùng chung script / template caption của `mkt-hyperframe-talking-head-video`; cùng thẩm mỹ punch nhưng avatar chỉ 30–40% là `mkt-hyperframe-knowledge-video-heygen-9-16-lite` (profile `bds-broker`).

## References (đọc khi cần)

- [overlay-template.md](references/overlay-template.md) — bảng 7 biến thể, luật chống tràn chữ, mẫu overlay đầy đủ, CSS caption. Đọc khi dựng / sửa overlay hoặc b-roll text.
- [index-scaffold.md](references/index-scaffold.md) — layer stack, mẫu `index.html`, CSS khoá kích thước, cấu trúc thư mục project. Đọc khi nối `index.html`.
- [zoom-hooks.md](references/zoom-hooks.md) — luật nhịp, 3 kiểu zoom, mã. Đọc khi viết `ZOOM_HOOKS`.
- [broll-inserts.md](references/broll-inserts.md) — mẫu b-roll, bảng khớp ngữ cảnh, layout cấm / cho phép. Đọc khi có ảnh b-roll.
- [sfx-bds.md](references/sfx-bds.md) — bộ SFX chuẩn, kho BĐS (tệp có / thiếu), luật ghép, lệnh copy. Đọc khi chọn SFX.
- [kinh-nghiem.md](references/kinh-nghiem.md) — lỗi đã gặp, điều cần biết, nhật ký.
- [variants.md](references/variants.md) (mẫu cũ 5 biến thể, chưa có fitText) · [text-effects.md](references/text-effects.md) (hiệu ứng GSAP phụ; phần zoom đã lỗi thời) · [design-tokens.css](references/design-tokens.css) (token màu / cỡ chữ).
