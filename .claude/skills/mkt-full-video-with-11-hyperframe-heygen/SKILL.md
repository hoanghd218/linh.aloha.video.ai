---
name: mkt-full-video-with-11-hyperframe-heygen
description: Pipeline trọn gói từ KỊCH BẢN (Việt/Anh, ≤ 5000 ký tự) ra MP4 9:16 TikTok/Reels, avatar HeyGen xuất hiện suốt video — (1) TTS ElevenLabs (mặc định, giọng Hoàng) hoặc MiniMax → voiceover.mp3, (2) Hoàng duyệt MP3, (3) song song HeyGen lip-sync nền + agent mkt-full-video-phase3-packager dựng HyperFrames kiểu Broker-Creator Punchy (chữ punch, zoom, b-roll, SFX BĐS) rồi mở Studio preview, không tự render. Chế độ BĐS khi có project_folder. Dùng khi Hoàng nói "tạo full video từ script", "script to tiktok video", "pipeline full video heygen + hyperframe", "video bđs dự án X", "kịch bản ra video tiktok", "chạy video bất động sản". Không dùng khi đã có MP3 (→ heygen-mp3-to-mp4), đã có MP4 quay sẵn (→ mkt-hyperframe-talking-head-video hoặc mkt-hyperframe-luxury-realestate-9-16), muốn avatar chỉ 30–40% tiết kiệm credit (→ mkt-hyperframe-knowledge-video-heygen-9-16-lite), hay 16:9 / Remotion.
argument-hint: "[script.txt | inline] [--slug <slug>] [--project_folder <dir>] [--tts_provider elevenlabs|minimax]"
---

# mkt-full-video-with-11-hyperframe-heygen — kịch bản → MP4 9:16 trọn gói

Phiên bản: v1.1 — 2026-11-11

Orchestrator 3 phase ghép skill có sẵn: **script → voiceover.mp3 → (duyệt) → source.mp4 HeyGen ∥ dựng HyperFrames → Studio preview**. Có 3 cổng người duyệt: (0) xác nhận trước khi tốn credit TTS, (1) duyệt MP3 trước khi tốn credit HeyGen, (2) duyệt danh sách chữ nhấn (do agent Phase 3 quản; bỏ qua nếu `auto_overlays=true`); render là cổng thứ tư, do Hoàng bấm ở Studio.

## Chọn đúng skill (nhóm HyperFrames 9:16)

| Hoàng có gì / muốn gì | Skill |
|---|---|
| Kịch bản, muốn avatar HeyGen suốt video + chữ punch | **skill này** |
| Kịch bản / chủ đề kiến thức, review dự án, avatar chỉ 30–40% (tiết kiệm credit HeyGen) | `mkt-hyperframe-knowledge-video-heygen-9-16-lite` |
| `source.mp4` (HeyGen hoặc quay thật), muốn chữ punch trên avatar full-frame | `mkt-hyperframe-luxury-realestate-9-16` |
| MP4 quay sẵn, muốn infographic kính mờ + chia đôi màn hình | `mkt-hyperframe-talking-head-video` |
| Đã có MP3, chỉ cần avatar MP4 | `heygen-mp3-to-mp4` |
| 16:9 · Remotion · chi tiết căn hộ | `mkt-full-video-with-11-hyperframe-heygen-16-9` · `mkt-full-video-with-11-remotion-heygen` · `mkt-full-video-with-11-remotion-heygen-apartment-detail` |

Script > 5000 ký tự: tách theo ý rồi chạy từng đoạn. HeyGen tự đọc chữ (không qua TTS): ngoài phạm vi skill này.

## Đầu vào → Đầu ra

| Tham số | Bắt buộc | Định dạng |
|---|---|---|
| Script text | Có | Đường dẫn `.txt` / `.md` hoặc inline, ≤ 5000 ký tự |
| `slug` | Không | Tự lấy 5 từ đầu của script, chữ thường ASCII nối `-` |
| `broll_list` | Không | `[{path, purpose}]`, tên tệp ASCII (không dấu tiếng Việt) |
| `tts_provider` | Không | `elevenlabs` (mặc định) hoặc `minimax` (khi Hoàng nói "dùng minimax") |
| `voice_id` | Không | `--voice_id <id>`; mặc định từ `.env` (`ELEVENLABS_VOICE_ID`) |
| `header_label` | Không | Chữ pill trên cùng, vd `"VINHOMES CAO XÀ LÁ"`; không truyền = bỏ pill |
| `footer_handle` | Không | Chữ brand dưới, vd `"@linh.aloha"`; không truyền = bỏ brand mark |
| `auto_overlays` | Không | Bỏ cổng duyệt chữ nhấn; mặc định `false` |
| `project_folder` | Không | **Kích hoạt chế độ BĐS** — thư mục tài sản dự án (vd `workspace/data/cao-xa-la/`) |
| `brand_palette` | Không | JSON ghi đè màu, vd `{ "accent": "#d97757" }` |

Ra, trong `P=workspace/content/YYYY-MM-DD/<slug>/`:

```
script.txt · voiceover.mp3 (Phase 1) · source.mp4 (Phase 2) · broll/ (ASCII)
transcript.json · transcript-cleaned.json · caption-groups.json
overlays-outline.json · overlays/overlay-NN.json · overlays.json   (Phase 3, trước/sau cổng duyệt)
compositions/ (overlay-01..N.html · broll-01..M.html · captions.html) · sfx/ · renders/ · index.html
```

## Luật — không được phá

1. **Cổng duyệt trước khi tốn tiền** — không gọi ElevenLabs / MiniMax khi Hoàng chưa xác nhận (Step 0), không gọi HeyGen khi chưa duyệt MP3 (Step 2), không render khi chưa nghe "render". Hỏi kèm phương án a / b / c. Hoàng đã nói rõ "chạy luôn / không cần hỏi" trong yêu cầu hiện tại thì coi cổng 0 và 1 đã duyệt (vẫn in thông số trước khi gọi).
2. **Không ghi đè / xoá bản cũ** — `voiceover.mp3` hoặc `source.mp4` đã có thì hỏi: a) dùng lại · b) làm bản mới (đổi tên bản cũ thành `voiceover.prev.mp3` / `source.prev.mp4`, không xoá) · c) dừng.
3. **Tên tệp cố định `voiceover.mp3`, `source.mp4`** — composition tham chiếu đúng tên này.
4. **HeyGen chỉ qua skill `heygen-mp3-to-mp4`** (upload + tạo video + poll + tải) — không gọi endpoint HeyGen v1/v2 (đã sunset); script upload thật nằm ở `.claude/skills/heygen-mp3-to-mp4/scripts/upload_asset.py`.
5. **Khoá API và voice ID chỉ đọc từ `.env`** — không in giá trị, không chép sang tệp khác, không hard-code; ghi đè từng lần bằng `--voice_id`.
6. **Script ≤ 5000 ký tự, MP3 ≤ 300s** — vượt thì dừng ngay, yêu cầu tách (fail fast ở Step 0, trước khi tốn credit).
7. **Preview trước, không tự render** — Phase 3 kết thúc ở Studio.
8. **Phase 2 + Phase 3 chạy song song** sau cổng duyệt MP3: HeyGen nền + agent Phase 3 tiền cảnh trong CÙNG MỘT message; Phase 3 phiên âm `voiceover.mp3` (audio ≡ `source.mp4`, HeyGen chỉ lip-sync) và chờ `source.mp4` trước preview.
9. **Avatar luôn full-frame** (1080×1920, `object-fit: cover`) — không split-screen, không PIP; chữ punch nằm trên avatar.
10. **Chế độ BĐS** — có `project_folder` thì b-roll resolve tới thư mục đó, không cho ghi đè trừ khi Hoàng nói rõ.
11. **Không bịa số / pháp lý BĐS** — giá, diện tích, tiến độ, chính sách chỉ lấy từ script hoặc `_kien-thuc-du-an/` của dự án; thiếu thì ghi "chưa có".
12. **Brand** (xưng "em", gọi "anh chị", "Aloha anh chị, em Linh đây", CTA) thuộc skill kịch bản `mkt-linh-aloha-bds-video-script` — skill này không viết / sửa kịch bản.

Đường dẫn tương đối từ gốc repo; Windows thay `python3` bằng `python` / `py -3`. Báo xong = đường dẫn tệp + số đo thật (thời lượng `ffprobe`, kích thước, kết quả lint), không nói "xong" khi chưa chạy bước kiểm.

## Pipeline

```
Script
  ▼
Phase 1 ── [Cổng 0: xác nhận] TTS (elevenlabs | minimax) ──► voiceover.mp3
  ▼  CỔNG 1 — Hoàng duyệt MP3  (OK → tốn credit HeyGen)
  ├─ Phase 2 (NỀN)      heygen-mp3-to-mp4 ─────────────────► source.mp4 (3-10 phút)
  └─ Phase 3 (TIỀN CẢNH) mkt-full-video-phase3-packager
        phiên âm voiceover.mp3 → caption → chọn từ nhấn → CỔNG 2 (duyệt chữ nhấn)
        → viết N overlay → dựng compositions + SFX + index.html
        → chờ source.mp4 → lint → Studio preview
  ▼
Hoàng duyệt preview → "render" → MP4 1080×1920 30fps
```

HeyGen render (3-10 phút) chạy chồng với phiên âm + chọn từ nhấn + thời gian Hoàng duyệt — tác giả skill ghi tổng ~5 phút thay vì ~8 (số ước tính, chưa đo lại).

## Hợp đồng Phase 3 — orchestrator ⇄ agent `mkt-full-video-phase3-packager`

Hai bên dùng CÙNG tên tham số và tên tệp dưới đây (agent có bảng giống hệt; sửa một bên thì sửa cả hai).

| Tham số truyền cho agent | Bắt buộc | Ý nghĩa |
|---|---|---|
| `workspace_dir` | Có | `workspace/content/YYYY-MM-DD/<slug>/`; có sẵn `script.txt`, `voiceover.mp3`, `broll/` |
| `slug` | Có | Slug dự án |
| `script_text` | Có | Toàn văn lời đọc (bản đã lưu ở `script.txt`) |
| `broll_list` | Không | `[{path, purpose}]`, đã copy vào `broll/` |
| `auto_overlays` | Không | `false`; `true` = bỏ cổng duyệt chữ nhấn |
| `header_label` / `footer_handle` | Không | Chữ pill / brand mark; không truyền = bỏ |
| `brand_palette` | Không | JSON ghi đè màu, hoặc `null` |
| `audio_source` | Không | Mặc định `voiceover.mp3` — tệp để phiên âm |
| `source_mp4_pending` | Không | `true` = HeyGen đang render nền; agent chờ `source.mp4` trước preview |

Agent trả về: `workspace_dir` · số overlay · số b-roll · số caption group · số SFX · số zoom hook · URL Studio (thường `http://localhost:3002`). Không render.

Thẩm mỹ, mẫu code, SFX, luật b-roll: nguồn duy nhất là `mkt-hyperframe-luxury-realestate-9-16` (bảng SFX BĐS ở tệp `sfx-bds.md` trong `references/` của skill đó) — skill này không chép lại.

## Quy trình

```bash
P=workspace/content/YYYY-MM-DD/<slug>
```

### Step 0 — Setup + Cổng 0

1. Đếm ký tự script. > 5000 → dừng, yêu cầu tách (chưa tốn gì).
2. Slug: 5 từ đầu → chữ thường ASCII nối `-` nếu thiếu.
3. **Chế độ BĐS:** có `project_folder`, hoặc Hoàng nhắc "video bđs", "dự án X", tên chủ đầu tư phổ biến (Vinhomes / Masterise / Sun / Lumière) → b-roll resolve tới `project_folder`. Kiểm thư mục và b-roll tồn tại, tên ASCII.
4. **TTS provider:** mặc định `elevenlabs`; chỉ kiểm khoá có trong `.env` (có / không, không in).
5. Tạo `$P/`, lưu `script.txt`; copy b-roll → `$P/broll/` (đổi tên ASCII). SFX do agent Phase 3 copy (theo `sfx-bds.md`).
6. **Cổng 0.** Báo Hoàng: workspace, provider + voice, số ký tự, số b-roll → hỏi: a) chạy TTS · b) sửa script / đổi provider · c) dừng. Xong khi Hoàng chọn a (hoặc đã nói "chạy luôn").

### Step 1 — Phase 1: Script → MP3

```bash
# ElevenLabs (mặc định)
uv run .claude/skills/mkt-elevenlabs-tts-to-mp3/scripts/text_to_mp3.py --file $P/script.txt -o $P/voiceover.mp3
# MiniMax
uv run .claude/skills/mkt-video-script-to-mp3/scripts/text_to_mp3.py --file $P/script.txt -o $P/voiceover.mp3
# Kiểm thời lượng (HeyGen giới hạn 300s)
uv run .claude/skills/heygen-mp3-to-mp4/scripts/check_duration.py "$P/voiceover.mp3"
```

Xong khi: `voiceover.mp3` tồn tại và `check_duration.py` in `OK <giây>`.

### Step 2 — Cổng 1: Hoàng nghe MP3

```markdown
## Voiceover ready
**File:** workspace/content/YYYY-MM-DD/<slug>/voiceover.mp3
**Duration:** <X>s · **Size:** <Y>MB · **Provider:** <elevenlabs|minimax>

Trả lời:
- `OK` / `tiếp` → chạy Phase 2 (tốn credit HeyGen theo thời lượng MP3)
- `regen` + lý do → chỉnh voice settings, tạo lại (hỏi lại cổng 0 nếu đổi provider)
- `sửa script` + nội dung → lưu script mới, chạy lại Phase 1
- `dừng` → kết thúc, giữ nguyên tệp
```

**Dừng. Đợi Hoàng.**

### Step 3 — Phase 2 + Phase 3 SONG SONG (1 message, 2 agent)

**Agent A — HeyGen (`run_in_background: true`, `subagent_type: general-purpose`):**

```
Invoke skill `heygen-mp3-to-mp4` với:
- mp3: workspace/content/YYYY-MM-DD/<slug>/voiceover.mp3
- output: workspace/content/YYYY-MM-DD/<slug>/source.mp4
Skill đó lo chọn avatar, upload, tạo video 9:16 720p, poll, tải. Tên `source.mp4` cố định.
Trả về khi tệp tồn tại trên đĩa.
```

**Agent B — Phase 3 (tiền cảnh, `subagent_type: mkt-full-video-phase3-packager`):**

```
workspace_dir: workspace/content/YYYY-MM-DD/<slug>/
slug: <slug>
script_text: <toàn văn script>
broll_list: [{path: "...", purpose: "..."}, ...]
auto_overlays: false
header_label: "<vd VINHOMES CAO XÀ LÁ>"
footer_handle: "<vd @linh.aloha>"
brand_palette: null
audio_source: voiceover.mp3
source_mp4_pending: true

Chạy Phase 3 theo định nghĩa agent. Skill `mkt-hyperframe-luxury-realestate-9-16` là nguồn
chuẩn về hình ảnh / animation / SFX / chống tràn chữ. Trả về URL Studio.
```

Orchestrator chỉ chuyển câu trả lời của Hoàng cho agent B (cổng 2). Agent A chạy tự động, báo khi xong. HeyGen lỗi (hết credit / MCP mất kết nối) thì Phase 3 sẽ kẹt ở bước chờ `source.mp4` → xem bảng lỗi.

### Step 4 — Bàn giao

```markdown
## Pipeline DONE — preview ready
**Workspace:** workspace/content/YYYY-MM-DD/<slug>/
**Phase 1 (<provider>):** voiceover.mp3 — <D>s, <S>MB
**Phase 2 (HeyGen):** source.mp4 — avatar <id>, <D>s, <S>MB
**Phase 3:** <N> chữ punch, <M> b-roll, <K> caption group, <S> SFX, <Z> zoom hook
**Studio:** http://localhost:3002

Mở trình duyệt scrub timeline. Nói `render` khi OK → MP4 1080×1920 30fps.
```

**Dừng.** Không tự render.

## Lỗi đã gặp / Kiểm

| Triệu chứng | Hành động |
|---|---|
| Script > 5000 ký tự | Dừng, yêu cầu tách theo ý |
| TTS lỗi | Kiểm biến khoá trong `.env` (`ELEVENLABS_API_KEY` / `MINIMAX_API_KEY`), hoặc đổi provider (qua cổng 0 lại) |
| MP3 > 300s | Dừng, gợi ý tách đoạn |
| HeyGen MCP chưa kết nối | `claude mcp list`; OAuth theo skill `heygen-mp3-to-mp4` |
| HeyGen render lỗi | Kiểm credit qua `mcp__heygen__get_current_user` |
| Phase 3 kẹt ở bước chờ `source.mp4` > 15 phút | Dừng agent HeyGen; kiểm credit / MCP; chạy lại agent HeyGen thủ công với cùng `voiceover.mp3` (qua cổng 1 lại) — `source.mp4` xuất hiện thì Phase 3 tiếp tục |
| Agent Phase 3 lỗi | Chạy lại Phase 3 riêng bằng skill `mkt-hyperframe-luxury-realestate-9-16` |
| `project_folder` không tồn tại | Dừng, in đường dẫn + `ls workspace/data/` |
| B-roll tên tiếng Việt | Dừng, đổi ASCII trước khi tiếp |
| Kho SFX BĐS thiếu tệp (`workspace/assets/01_Sound Bất động sản/`) | Không dừng: dùng bộ chuẩn 6 tệp (xem `sfx-bds.md`), báo Hoàng tệp nào thiếu |
| Chữ overlay tràn hai cạnh | Thiếu `max-width: 960px` + `fitText()` — sửa theo `overlay-template.md` của skill luxury |
| Render ra khung đen / nửa đen | Selector CSS phải là `[data-composition-id="…"]`, không `#id` |

## Ví dụ — chế độ BĐS

Hoàng: *"Chạy video BĐS Vinhomes Cao Xà Lá. Project: `workspace/data/cao-xa-la/`. Script: 'Cao Xà Lá — tên ai cũng biết… Bình luận BLOOM em gửi inbox.' B-roll: facade.jpg, architecture.jpg, main-entrance.jpg, overview.jpg."*

1. Step 0 — nhận ra chế độ BĐS, kiểm thư mục + 4 b-roll ASCII, slug `cao-xa-la-bloom`; báo thông số → Hoàng `OK`.
2. Step 1 — ElevenLabs → `voiceover.mp3` ~60s. Step 2 — Hoàng `OK`.
3. Step 3 — cùng một message: HeyGen nền + agent Phase 3 (phiên âm, ~15 từ nhấn: Cao Xà Lá, 3 nhà máy, đất vàng, Masterise, 10 tòa, 120 TR/M², hợp lý hơn, 1 tuần, BLOOM…; cổng 2 → Hoàng `OK` → 15 overlay + 3 b-roll insert → dựng → chờ `source.mp4` → lint).
4. Step 4 — URL Studio. Hoàng `render` → MP4. Tổng ~5 phút (số minh hoạ từ lần chạy mẫu, không cam kết).

## Cải tiến skill

Gặp lỗi mới: thêm một hàng vào bảng trên hoặc `references/kinh-nghiem.md` mục *Nhật ký*, rồi sửa đúng một chỗ. Hợp đồng Phase 3 đổi thì sửa CẢ HAI nơi: bảng ở đây và bảng trong `.claude/agents/mkt-full-video-phase3-packager.md`.

## Liên quan

- Trước: `mkt-linh-aloha-bds-video-script` (kịch bản) · TTS: `mkt-elevenlabs-tts-to-mp3` (mặc định), `mkt-video-script-to-mp3` (MiniMax) · Phase 2: `heygen-mp3-to-mp4`.
- Phase 3: agent `.claude/agents/mkt-full-video-phase3-packager.md` + skill `mkt-hyperframe-luxury-realestate-9-16` (thẩm mỹ, SFX); dùng script caption của `mkt-hyperframe-talking-head-video`.
- Chi tiết: [kinh-nghiem.md](references/kinh-nghiem.md) — điều cần biết (kho SFX thiếu tệp, project mẫu) + nhật ký.
- Dự án mẫu `workspace/content/2026-05-16/cao-xa-la-bloom/` không có trong repo (thư mục `content/` không được commit).
