# Kinh nghiệm — heygen-mp3-to-mp4

Chỉ ghi điều đã có trong skill hoặc đã gặp thật; không bịa lỗi, không bịa số đo.

## Vì sao REST + MCP (không chỉ MCP)

Bản cũ của skill ghi "chỉ MCP, không gọi REST". Luật đó không còn làm được từ khi HeyGen MCP đổi bộ tool (2026): MCP có `create_video_from_avatar`, `get_video`, `create_lipsync`, `list_avatar_looks`… nhưng **không có tool upload asset**. Lip-sync từ MP3 máy cục bộ cần `audioAssetId` (asset đã upload) hoặc `audioUrl` (HTTPS công khai). Dựng URL công khai dễ rò rỉ và dễ hỏng link, nên upload qua `POST /v3/assets` bằng script mỏng, phần tạo video / poll vẫn đi MCP.

## Vì sao gửi audio, không gửi chữ

Lip-sync từ MP3 có sẵn bắt HeyGen dùng thẳng audio. Gửi `script` + `voiceId` chuyển HeyGen sang chế độ TTS và bỏ qua MP3 đã upload — mất giọng ElevenLabs/MiniMax của thương hiệu.

## Avatar V và Avatar IV

- Avatar V: animation theo tham chiếu chéo, nhép môi và chuyển động cơ thể tinh tế hơn; render lâu hơn IV (ghi chú cũ của skill: khoảng 1,5–2 lần).
- Chọn engine theo từng lệnh gọi: `engine={"type":"avatar_v"}`. HeyGen từ chối `expressiveness` và `motionPrompt` khi dùng Avatar V — hai tham số đó chỉ của Avatar IV.
- Look không có `avatar_v` trong `supported_api_engines` → bỏ `engine` (IV) và nói với Hoàng: "Avatar V không khả dụng cho look này, dùng Avatar IV".
- Hoàng yêu cầu `--engine iv`: bỏ qua bước kiểm engine, bỏ `engine` — IV nhanh hơn và nhận `expressiveness` / `motionPrompt`.

## Lỗi đã gặp

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| Báo "tool not found" cho `upload_asset` / `generate_avatar_video` / `get_avatar_video_status` | Tên tool MCP cũ, đã thay bằng upload REST + `create_video_from_avatar` + `get_video` → sửa nơi gọi |
| Có đoạn gọi `/v2/video/generate` hoặc `upload.heygen.com/v1/asset` | Endpoint legacy → đổi sang `POST /v3/videos` / `POST /v3/assets` (xem [api-versions.md](api-versions.md)) |
| `HEYGEN_AVATAR_LOOKS=avatar_look_id_1,…` | Stub trong `.env.local` → lấy giá trị thật trong `.env` repo này; còn thiếu thì nhờ Hoàng điền (script upload có dự phòng đọc `~/Documents/GitHub/hoang-ai-marketing/.env` nếu máy có) |
| HeyGen từ chối `expressiveness` / `motionPrompt` | Đang dùng Avatar V → bỏ hai tham số này |
| Vòng poll bằng zsh chết với `read-only variable: status` | `status` là biến chỉ-đọc của zsh → đặt tên khác (`vstate`, `phase`, `ready`) |

## Hai ví tiền

MCP/OAuth trừ credit gói HeyGen; khoá API (`HEYGEN_API_KEY`, các script) trừ ví API. Ví API về 0 → `POST /v3/videos` trả `402 insufficient_credit` dù MCP vẫn render. Chi tiết và lệnh kiểm: [api-versions.md](api-versions.md).

## Ví dụ đã chạy (minh hoạ — số mẫu, không phải số đo)

Yêu cầu: `tạo video heygen từ mp3 workspace/audio/episode-3.mp3`

1. Có tool HeyGen → bỏ qua xác thực; chưa có → `authenticate` + `complete_authentication`.
2. `check_duration.py` → `OK 87.4`.
3. Chọn ngẫu nhiên một look, báo Hoàng; `get_avatar_look` → `["avatar_v","avatar_iv"]` → Avatar V.
4. Cổng xác nhận → Hoàng chọn a.
5. `upload_asset.py` → `OK <asset_id>`.
6. `create_video_from_avatar(…, aspectRatio="9:16", resolution="720p", engine={"type":"avatar_v"})` → `video_id`.
7. Poll `get_video` 15 giây/lần tới `completed` → `video_url`.
8. `download_video.py` → `workspace/heygen-clips/episode-3/episode-3_<giờ>.mp4`; `ffprobe` đo; báo đường dẫn, look, engine, thời lượng.

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): thêm cổng xác nhận tiền (bước 3, trước upload) + luật không tạo video thứ hai / không ghi đè; thêm bảng Đầu vào → Đầu ra, `argument-hint`, "xong khi" từng bước; dời phần giải thích, lỗi phụ, ví dụ sang tệp này; ghi rõ đường dẫn script thật `.claude/skills/heygen-mp3-to-mp4/scripts/`; bỏ trỏ tới `heygen-short-video` (không có trong repo).
