# CLAUDE.md

Repo **Linh Aloha Video AI** — dây chuyền AI làm video BĐS hàng hiệu cho thương hiệu **Linh Aloha** (môi giới BĐS; xưng "em", gọi khách "anh chị"). Việc chính: kịch bản → giọng đọc → avatar HeyGen / ảnh b-roll → dựng (HyperFrames hoặc Remotion) → MP4. Mỗi bước là một skill ở `.claude/skills/`; người điều phối là các skill `mkt-full-video-with-11-*`.

## Luật chung (mọi skill, mọi phiên)

1. **Không tốn tiền / không đăng khi chưa được duyệt.** HeyGen, ElevenLabs, MiniMax, KIE tính phí theo lần gọi — xác nhận với Hoàng (kèm phương án a / b / c) trước khi gọi; không ghi đè `voiceover.mp3`, `source.mp4` đã có (đổi tên thành `.prev`, không xoá).
2. **Không đọc, không in, không chép `.env`.** Skill chỉ dùng TÊN biến (`ELEVENLABS_API_KEY`…); script tự đọc khoá khi chạy. `.claude/settings.json` chặn công cụ Read với `.env`.
3. **Không bịa số / pháp lý BĐS.** Giá, diện tích, tiến độ, chính sách chỉ lấy từ `workspace/data/` (hoặc `tools/bds`); thiếu thì ghi "chưa có". Ảnh AI chỉ là minh hoạ, phải nói rõ.
4. **Brand voice chỉ có một nguồn:** skill `mkt-linh-aloha-bds-video-script` (xưng "em Linh", câu mở "Aloha anh chị, em Linh đây", CTA inbox/hotline). Không chép lại quy tắc brand sang skill khác — trỏ về skill đó.
5. **Báo số đo thật** (thời lượng, dung lượng, số lỗi kiểm) và đường dẫn tệp ra; chưa chạy bước kiểm thì không nói "xong".

## Chọn skill

| Hoàng có gì / muốn gì | Skill |
|---|---|
| Chủ đề → kịch bản 40–90 giây giọng Linh Aloha | `mkt-linh-aloha-bds-video-script` (engine đa profile: `mkt-vn-short-video-script`) |
| `script.txt` → `voiceover.mp3` | `mkt-elevenlabs-tts-to-mp3` (mặc định) · `mkt-video-script-to-mp3` (MiniMax, chỉ khi Hoàng chọn) |
| `voiceover.mp3` → SRT + mốc từng từ | `mkt-ai-video-extract-srt-segment` |
| `voiceover.mp3` → video avatar `source.mp4` | `heygen-mp3-to-mp4` |
| Ảnh b-roll BĐS từ `brief.md` | `mkt-kie-broll-image-generator` |
| **Kịch bản → MP4 trọn gói 9:16, avatar suốt video** | `mkt-full-video-with-11-hyperframe-heygen` |
| Kịch bản → MP4 9:16, avatar chỉ 30–40% (rẻ credit) | `mkt-hyperframe-knowledge-video-heygen-9-16-lite` |
| Đã có `source.mp4`, muốn chữ punch trên avatar | `mkt-hyperframe-luxury-realestate-9-16` |
| Đã có MP4 quay sẵn, muốn infographic kính mờ | `mkt-hyperframe-talking-head-video` |
| Video review dự án / bảng giá / mặt bằng (đồ hoạ Remotion) | `mkt-full-video-with-11-remotion-heygen` · chi tiết 1 căn: `…-apartment-detail` |
| Video ngang 16:9 (YouTube) | `mkt-full-video-with-11-hyperframe-heygen-16-9` (cần `mkt-plan-short-video-edit-16-9`, `mkt-hyperframe-talking-head-video-16-9`) |
| Dự án mới chỉ có ảnh phối cảnh 3D / video có kho tư liệu thật | `mkt-edit-video-bds-linh-hoat` · `mkt-hyperframe-heygen-bds-proof-first-9-16` |
| **Video thô chị Linh quay sẵn** → cắt khoảng lặng, chọn hiệu ứng từng cảnh bằng hình, chốt storyboard, dựng (chạy trên máy, không tốn credit) | `mkt-autoedit-video-9-16` |
| Clip bản đồ vị trí & kết nối (ảnh vệ tinh Esri, tuyến đường, thẻ km/phút) — cần toạ độ dự án do chị Linh đưa | `mkt-map-location-video` (cần tiện ích Claude in Chrome) |
| Tên dự án → **kho cảnh trám** (cào video YouTube, cắt clip 4–20 s có nhãn, chỉ mục, ghi nguồn; không tốn credit) | `mkt-kho-canh-tram` |
| Kho cảnh + lời em Linh → video **"bay một vòng"** 9:16 (flycam + motion HyperFrames, end card Linh + hotline, nhạc tự tổng hợp, 8 SFX) | `mkt-bds-flycam-motion-9-16` (chỉ giọng ElevenLabs tốn credit) |

Skill nào chồng lấn thì phần "Không dùng cho…" trong description chỉ rõ skill đúng.

## Thư mục

- `workspace/content/YYYY-MM-DD/<slug>/` — thư mục một video (`script.txt`, `voiceover.mp3`, `source.mp4`, `broll/`, project dựng). Bị `.gitignore`, không đẩy lên git.
- `output/linh-aloha/scripts/<slug>/` — đầu ra của skill kịch bản (`script.txt`, `brief.md`). Bị `.gitignore`.
- `workspace/data/` — kho dữ liệu dự án (`projects.json`, `<dự án>/_data/*.json`, `_kien-thuc-du-an/*.md`). Đọc bằng `tools/bds` (CLI Python, stdout luôn JSON; xem `tools/README.md`), không đọc tay từng tệp khi có thể.
- `workspace/remotion-project/` (code React) · `workspace/sfx-realestate/` + `workspace/assets/` (âm thanh, logo, brand).

## Môi trường

- Khoá API trong `.env` ở **gốc repo** (mẫu: `.env.example`). Script TTS và KIE chỉ đọc `.env` gốc; HeyGen đọc thêm `.env.local`.
- Cần: `node` (HyperFrames/Remotion), `ffmpeg`, `whisper` (CLI `openai-whisper`, chạy cục bộ), Python ≥ 3.10 (`python3` trên macOS, `python` hoặc `uv run` trên Windows).
- Tên tệp đưa vào composition dùng ASCII (không dấu tiếng Việt).
- `mkt-autoedit-video-9-16` thêm: Python `faster-whisper` (+ `playwright` cho kiểm vùng an toàn, `rembg` chỉ preset A) và CLI HyperFrames; chưa chạy trọn pipeline trên máy dev (xem `references/kinh-nghiem.md` của skill). `mkt-map-location-video` cần Chrome + tiện ích Claude in Chrome; ảnh Esri/OpenStreetMap phải ghi nguồn.

## Sửa / thêm skill

Theo chuẩn: `description` ≤ 1000 ký tự (câu "Dùng khi…" + "Không dùng cho…"), `SKILL.md` ≤ 350 dòng, chi tiết ở `references/`, mỗi skill có `references/kinh-nghiem.md` (mục *Nhật ký*: sửa gì, ngày nào). Skill phải nằm ở `.claude/skills/<tên>/` — Claude Code **không** nạp `.codex/skills/`. Kiểm: `node tools/kiem-skill.mjs --all .claude/skills` (0 lỗi mới được giữ). Đổi một skill thì kiểm lại skill kề nó trong bảng trên.
