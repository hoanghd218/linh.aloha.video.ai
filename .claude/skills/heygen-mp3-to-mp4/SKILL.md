---
name: heygen-mp3-to-mp4
description: Biến MỘT file MP3 lời thoại thành MỘT video avatar HeyGen nhép môi (MC ảo Linh Aloha, `source.mp4`, 9:16 720p); chỉ làm việc này — không SRT, không cắt đoạn, không dựng. Engine Avatar V (lùi Avatar IV khi look không hỗ trợ); upload REST v3 `scripts/upload_asset.py`, tạo + poll qua HeyGen MCP; TỐN CREDIT nên luôn dừng hỏi xác nhận trước khi gọi API; khoá ở `.env`. Dùng khi Hoàng nói "tạo video heygen từ mp3", "mp3 to heygen", "heygen mp4 từ audio", "convert mp3 sang heygen video", "tạo avatar video từ file mp3", "lip sync mp3 heygen", "biến mp3 thành video heygen", hoặc pipeline video BĐS cần Phase 2 (voiceover.mp3 → source.mp4). Không dùng khi chưa có MP3 (→ mkt-elevenlabs-tts-to-mp3, mkt-video-script-to-mp3), cần SRT (→ mkt-ai-video-extract-srt-segment), ảnh b-roll (→ mkt-kie-broll-image-generator), dựng cả video (→ mkt-full-video-with-11-hyperframe-heygen).
argument-hint: "[--audio voiceover.mp3] [--output source.mp4] [--aspect 9:16|16:9] [--avatar <look_id>] [--engine v|iv]"
---

# HeyGen MP3 → MP4 (avatar lip-sync)

Phiên bản: v1.1 — 2026-11-11

Một MP3 vào, một MP4 avatar nhép môi ra. Đây là **skill chủ về HeyGen** của repo: cài đặt look/engine, upload asset v3 và cách tính tiền chỉ ghi ở đây — skill khác chỉ trỏ tên skill này.

| Đầu vào | Đầu ra |
|---|---|
| `voiceover.mp3` (≤ 300 giây) | `source.mp4` — avatar nhép môi khớp 100% MP3, 9:16 · 720p (đo `ffprobe` thật rồi báo) |
| look ID trong `HEYGEN_AVATAR_LOOKS` (`.env`) | không truyền → chọn ngẫu nhiên trong danh sách |
| `--output` (tuỳ chọn) | mặc định `workspace/heygen-clips/<mp3-stem>/<mp3-stem>_<YYYYMMDD-HHMMSS>.mp4`; orchestrator truyền `workspace/content/YYYY-MM-DD/<slug>/source.mp4` (tên `source.mp4` bất biến — editor đọc đúng tên này) |

Nhận `$ARGUMENTS`; thiếu `--audio` thì hỏi đường dẫn MP3.

## Luật — không được phá

1. **Cổng xác nhận trước khi tốn credit** — tạo video HeyGen tốn tiền: chưa có "ok" của Hoàng thì không upload, không gọi `create_video_from_avatar` / `create_video.py` (bước 3). Hỏi kèm phương án a / b / c.
2. **v3 only** — v1/v2 là legacy (lịch ngừng 2026-10-31 / 11-01, đã qua): không gọi `/v2/video/generate`, `/v1/video/generate`, `/v1/video_status.get`, `/v2/avatars`, `upload.heygen.com/v1/asset`. Bảng đối chiếu: [references/api-versions.md](references/api-versions.md).
3. **Khoá chỉ đọc từ `.env`** (`HEYGEN_API_KEY`, `HEYGEN_AVATAR_LOOKS`, `HEYGEN_VOICE_ID`) — không in giá trị, không chép sang tệp khác, không ghi vào SKILL.md hay script.
4. **Lip-sync từ audio, không TTS** — gửi `audioAssetId` (hoặc `audioUrl`); gửi `script` + `voiceId` là HeyGen bỏ MP3 và tự đọc.
5. **MP3 dài hơn 300 giây → dừng**, báo thời lượng thật; không tự cắt. Repo này chưa có skill cắt MP3 — hỏi Hoàng a / b / c (tự cắt trước rồi chạy từng đoạn · rút gọn lời thoại · dừng).
6. **Look chỉ lấy từ `HEYGEN_AVATAR_LOOKS`**; báo Hoàng look nào được chọn trước khi chạy.
7. **Không tạo video thứ hai khi đã có `video_id`** (tốn tiền gấp đôi): chờ quá 10 phút thì báo Hoàng và hỏi, không tạo lại. Output đã tồn tại → không ghi đè, hỏi (đổi tên bản cũ `-v1` · đặt tên mới có giờ · dừng).
8. **Xong thì báo đường dẫn MP4 + số đo thật** (thời lượng, dung lượng, look, engine) — chưa tải về và chưa đo thì không nói "xong".

| Ràng buộc | Giá trị cho phép |
|---|---|
| Upload asset | REST `POST https://api.heygen.com/v3/assets` qua `scripts/upload_asset.py` (`HEYGEN_API_KEY`) |
| Tạo / poll video | HeyGen MCP `mcp__heygen__create_video_from_avatar`, `mcp__heygen__get_video`; dự phòng REST `scripts/create_video.py` (v3) |
| Engine | **Avatar V mặc định** (`engine={"type":"avatar_v"}`); lùi về Avatar IV (bỏ `engine`) chỉ khi `get_avatar_look.supported_api_engines` không có `avatar_v` |
| Avatar V | HeyGen từ chối `expressiveness` + `motionPrompt` (chỉ của Avatar IV); render lâu hơn IV (ghi chú cũ của skill: ≈ 1,5–2×) |
| Tỉ lệ / độ phân giải | `9:16` · `720p` mặc định (720×1280); `16:9` khi orchestrator yêu cầu; `1080p` / `4k` chỉ khi Hoàng bảo |
| Voice ID | MP3 lip-sync không gửi `voiceId`; `HEYGEN_VOICE_ID` chỉ dùng nếu MCP bắt buộc TTS |

## Quy trình

Đặt `K=.claude/skills/heygen-mp3-to-mp4` (từ gốc repo). Script chạy bằng `uv run $K/scripts/<tên>.py …`; Windows chưa có `uv` thì `python $K/scripts/<tên>.py …` (cần `pip install requests`). Mỗi bước có tiêu chí "xong khi" — chưa đạt thì dừng.

### 0. Xác thực MCP (lần đầu của phiên)
HeyGen MCP dùng OAuth: phiên mới chỉ thấy `mcp__heygen__authenticate` + `complete_authentication`; các tool thật (`create_video_from_avatar`, `get_video`, `get_avatar_look`…) hiện sau khi xác thực. Chưa thấy → gọi `authenticate`, đưa Hoàng link; Hoàng bấm, dán lại URL callback (trình duyệt báo "connection error" ở localhost là bình thường) → `complete_authentication`. Không xác thực được (chạy không tương tác) → dùng đường REST ở bước 5b, chỉ cần `HEYGEN_API_KEY` + ví API còn tiền.
**Xong khi** các tool thật xuất hiện, hoặc đã chọn đường REST.

### 1. Kiểm MP3
```bash
uv run $K/scripts/check_duration.py "<mp3>"      # in OK <giây> | TOO_LONG <giây> | MISSING
```
**Xong khi** in `OK` (mã thoát 0). `TOO_LONG` → luật 5. `MISSING` → báo đường dẫn sai.

### 2. Chọn look + engine
```bash
grep -h '^HEYGEN_AVATAR_LOOKS=' .env.local .env 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d "\"'" | tr ',' '\n'
```
Chọn ngẫu nhiên một dòng (PowerShell: `Get-Random -InputObject $ids`), trừ khi Hoàng chỉ định look. Giá trị bắt đầu `your_` / `avatar_look_id_` / `placeholder` là stub = coi như thiếu: script upload có dự phòng đọc `.env` của repo marketing cũ (`~/Documents/GitHub/hoang-ai-marketing/.env`) nếu máy có; cả hai đều stub → dừng, nhờ Hoàng điền look ID thật.

Gọi `mcp__heygen__get_avatar_look(lookId)`, đọc `supported_api_engines`: có `avatar_v` → Avatar V; không → bỏ `engine` (Avatar IV). Hoàng yêu cầu `--engine iv` → bỏ qua kiểm, dùng IV (nhanh hơn, nhận `expressiveness`/`motionPrompt`).
**Xong khi** đã có: look ID + engine + lý do (Avatar V hay lùi IV).

### 3. Cổng xác nhận — dừng ở đây (luật 1)
Đưa Hoàng bản tóm tắt rồi **đợi trả lời**: MP3 (đường dẫn, thời lượng thật) · look + engine · tỉ lệ + độ phân giải · MP4 ra ở đâu · nguồn tiền (MCP trừ credit gói HeyGen; REST trừ ví API — hai ví khác nhau, xem api-versions) · giá: "chưa có số, xem app.heygen.com/billing" (không tự ước). Phương án: **a.** tạo ngay như trên · **b.** đổi look / engine / tỉ lệ / độ phân giải rồi hỏi lại · **c.** dừng.
Ngoại lệ: orchestrator gọi skill này **sau khi Hoàng đã duyệt MP3** (checkpoint #1) và truyền đủ avatar + engine + output → coi như đã duyệt; vẫn in một dòng "look · engine · nguồn tiền" trước khi gọi, và dừng hỏi lại nếu thông số lệch bản đã duyệt.
**Xong khi** Hoàng nói a (hoặc ngoại lệ trên thoả).

### 4. Upload MP3 thành asset (REST v3)
```bash
uv run $K/scripts/upload_asset.py "<mp3>"        # → OK <asset_id>
```
Script POST multipart tới `/v3/assets`, đoán MIME theo đuôi. Khoá: `--key-file` → biến môi trường `HEYGEN_API_KEY` → `.env.local` → `.env` → `.env` repo marketing cũ; bỏ qua stub `your_*`. Cờ `--legacy` (endpoint v1) không dùng.
**Xong khi** in `OK <asset_id>` (HeyGen MCP không có tool upload nên bước này là REST).

### 5. Tạo video (MCP)
`mcp__heygen__create_video_from_avatar`:
```yaml
avatarId:     <look từ bước 2>
audioAssetId: <asset_id bước 4>            # hoặc audioUrl khi upload khác workspace
aspectRatio:  "9:16"                       # hoặc "16:9"
resolution:   "720p"                       # 720p · 1080p · 4k
engine:       {"type": "avatar_v"}         # bỏ khi lùi Avatar IV
title:        "<mp3-stem>-<YYYYMMDD-HHMMSS>"
```
**Xong khi** nhận `video_id` (trạng thái đầu `waiting`) — ghi lại ngay.

**5b. Dự phòng REST** (chỉ khi MCP không dùng được; vẫn phải qua cổng bước 3):
```bash
uv run $K/scripts/create_video.py --avatar-id "<look>" --audio-asset-id "<asset_id>" \
  --aspect-ratio 9:16 --resolution 720p --engine avatar_v --title "<slug>-<giờ>" --wait    # → OK <video_id> <video_url>
```
Gọi `POST /v3/videos` + `GET /v3/videos/{id}`; trừ **ví API** (khác credit gói của MCP): `402 insufficient_credit` = ví API hết tiền dù MCP vẫn render được. Kiểm số dư: `curl -s https://api.heygen.com/v3/users/me -H "X-Api-Key: $HEYGEN_API_KEY"`.

### 6. Poll tới khi xong
`mcp__heygen__get_video(video_id)` mỗi 10–15 giây (REST: `create_video.py --status <video_id>`): `waiting|processing|pending` → chờ tiếp · `completed` → lấy `video_url` · `failed` → dừng, báo `failure_message`. Quá ~10 phút còn đang xử lý → luật 7.
**Xong khi** `completed` kèm `video_url`.

### 7. Tải MP4 + đo
```bash
uv run $K/scripts/download_video.py "<video_url>" "<output.mp4>"
ffprobe -v error -show_entries format=duration,size:stream=width,height -of default=nw=1 "<output.mp4>"
```
Tải HTTPS thường, không phải gọi API. **Xong khi** tệp tồn tại, độ phân giải đúng ý (720×1280 cho 9:16), thời lượng ≈ thời lượng MP3.

### 8. Báo Hoàng
Một đoạn ngắn: đường dẫn MP4 · look + engine · thời lượng + dung lượng đo thật · nguồn tiền đã dùng.

## Lỗi hay gặp

| Triệu chứng | Nguyên nhân → cách xử lý |
|---|---|
| MP3 không tìm thấy | Sai đường dẫn → báo đường dẫn đã thử |
| MCP chưa xác thực | Làm bước 0; không được thì REST |
| `HEYGEN_API_KEY` / look là stub | Chỉ có `your_*` / `avatar_look_id_*` → nhờ Hoàng điền giá trị thật vào `.env` |
| HeyGen trả `failed` | Báo `failure_message`; thường look bị xoá hoặc asset hỏng → quay lại bước 2 / 4, **hỏi Hoàng trước khi tạo lại** |
| `402 insufficient_credit` (REST) | Ví API hết → nạp tại app.heygen.com/billing hoặc dùng MCP (luật 1: hỏi lại) |

Các lỗi còn lại (tên tool MCP cũ, look không hỗ trợ Avatar V, tham số IV-only, biến `status` của zsh, ví dụ chạy thật): [references/kinh-nghiem.md](references/kinh-nghiem.md).

## Skill này không làm
SRT/phụ đề (→ `mkt-ai-video-extract-srt-segment`) · lập kế hoạch visual / b-roll (→ `mkt-plan-short-video-edit-16-9`, `mkt-kie-broll-image-generator`) · cắt MP3 · ghép Remotion/HyperFrames (→ orchestrator). Việc ngoài danh sách → trỏ đúng skill, đừng mở rộng skill này.

## Cải tiến skill
Gặp lỗi mới hoặc HeyGen đổi API → ghi một dòng vào [references/kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*, rồi sửa **đúng một chỗ** (script · SKILL.md · api-versions).

## Liên quan
- Đứng trước: `mkt-elevenlabs-tts-to-mp3` (mặc định) hoặc `mkt-video-script-to-mp3` (MiniMax) → `voiceover.mp3`.
- Đứng sau (gọi skill này ở Phase 2): `mkt-full-video-with-11-hyperframe-heygen`, `mkt-full-video-with-11-hyperframe-heygen-16-9`, `mkt-full-video-with-11-remotion-heygen`, `mkt-full-video-with-11-remotion-heygen-apartment-detail`, `mkt-hyperframe-knowledge-video-heygen-9-16-lite`.
- Cùng giai đoạn: `mkt-kie-broll-image-generator` (ảnh b-roll), `mkt-ai-video-extract-srt-segment` (SRT).
- `mkt-hyperframe-heygen-bds-proof-first-9-16` cần vài đoạn A-roll HeyGen ngắn — từng đoạn có thể đi qua skill này.
- Script thật nằm ở `.claude/skills/heygen-mp3-to-mp4/scripts/`: `check_duration.py` · `upload_asset.py` · `create_video.py` · `download_video.py` (skill khác ghi `scripts/upload_asset.py` trơn là sai — phải kèm tiền tố này).
