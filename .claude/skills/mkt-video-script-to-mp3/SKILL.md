---
name: mkt-video-script-to-mp3
description: Chuyển script.txt (tiếng Việt / Anh) thành voiceover.mp3 bằng MiniMax TTS API (model speech-2.8-hd, endpoint t2a_v2, tốc độ 1.08, MP3 32 kHz mono) — TTS THAY THẾ, chỉ dùng khi user chọn MiniMax; mặc định của pipeline video Linh Aloha là ElevenLabs. Dùng khi user nói 'dùng minimax', 'tts minimax', 'tạo voiceover bằng minimax', hoặc footer brief.md / tham số tts_provider = minimax, kèm các cụm 'tạo audio từ script', 'script to mp3', 'text to speech', 'tạo voiceover', 'convert script to audio', 'tạo mp3 từ kịch bản', 'generate voiceover', 'TTS from script', 'đọc script thành audio'. Không dùng khi user không nêu MiniMax (→ mkt-elevenlabs-tts-to-mp3 là mặc định), cần bản đồ phát âm tiếng Việt / audio tag (ElevenLabs), viết kịch bản (→ mkt-linh-aloha-bds-video-script), lip-sync (→ heygen-mp3-to-mp4) hoặc bóc SRT (→ mkt-ai-video-extract-srt-segment).
argument-hint: "--file <script.txt> -o <voiceover.mp3> [--speed 1.08] [--voice_id <id>]"
---

# Script → MP3 bằng MiniMax (TTS thay thế)

Phiên bản: v1.1 — 2026-11-11

Chuyển script thành MP3 voiceover qua MiniMax TTS (`t2a_v2`). **Đây là nhà cung cấp thay thế** — mặc định của pipeline là `mkt-elevenlabs-tts-to-mp3` (bảng so sánh ElevenLabs / MiniMax nằm ở skill đó). Chỉ dùng skill này khi user nói rõ dùng MiniMax, hoặc `tts_provider` = `minimax`.

| Đầu vào | Đầu ra |
|---|---|
| `script.txt` (hoặc chuỗi inline) | `voiceover.mp3` — MP3 32 kHz / 128 kbps, mono |
| `MINIMAX_API_KEY` trong `.env` ở gốc repo | stdout: `Saved:` + `Duration` + JSON (`output_path`, `duration_ms`, `size_bytes`, `chars_used`, `trace_id`) |

`K=.claude/skills/mkt-video-script-to-mp3` · `S=workspace/content/YYYY-MM-DD/<slug>` (thư mục video do orchestrator tạo)

Mặc định: model `speech-2.8-hd` · tốc độ `1.08` · `language_boost` Vietnamese · giọng đọc từ `MINIMAX_VOICE_ID` trong `.env`, dự phòng trong script là `moss_audio_c56d6120-ef9c-11f0-9649-8ee40147f116`.

## Luật — không được phá

1. **Cổng duyệt — mỗi lần gọi tốn credit MiniMax.** Chỉ chạy khi user (hoặc orchestrator đã được user duyệt script) yêu cầu; báo trước số ký tự + giọng + model. Không chạy lặp để thử; thử giọng → dùng chuỗi ngắn.
2. **Không ghi đè `voiceover.mp3` có sẵn** — script ghi đè không hỏi. Đã có tệp thì hỏi: a. giữ bản cũ, ra `<tên>-v2.mp3` · b. ghi đè · c. dừng.
3. **Khoá chỉ đọc từ `.env`** (`MINIMAX_API_KEY`, tuỳ chọn `MINIMAX_VOICE_ID`) — không in giá trị, không chép sang tệp khác, không để khoá trong SKILL.md hay script.
4. **Tên tệp ra là `voiceover.mp3`** khi đi trong pipeline `mkt-full-video-with-11-*`.
5. **Script không kiểm độ dài và không có bản đồ phát âm / cảnh báo số** (khác ElevenLabs). Giới hạn ký tự của API chưa ghi trong repo → script dài hơn một kịch bản video ngắn thì hỏi user trước (a. chạy thử · b. tách đoạn · c. dừng). Số có dấu phân cách hoặc thập phân ("82.820", "28,8") vẫn nên viết thành chữ trong script.
6. **Báo thời lượng thật** — script in `Duration`; orchestrator giới hạn 300 giây. Chưa nghe bằng tai thì nói rõ "mới đo bằng máy".

## Quy trình

1. **Kiểm đầu vào.** `S/script.txt` có tồn tại, `S/voiceover.mp3` đã có chưa (luật 2), `MINIMAX_API_KEY` có trong `.env` (chỉ kiểm có / không, không in). Xong khi biết số ký tự.
2. **Chạy** (`uv` chạy giống nhau trên Windows và macOS):
   ```bash
   uv run $K/scripts/text_to_mp3.py --file $S/script.txt -o $S/voiceover.mp3
   uv run $K/scripts/text_to_mp3.py "Xin chào các bạn" -o workspace/assets/minimax/thu.mp3 --speed 1.1 --language_boost Vietnamese
   ```
   Xong khi in `Saved:` và JSON kết quả.
3. **Báo user:** đường dẫn MP3, `duration_ms` đổi ra giây, `chars_used`; mời nghe duyệt trước khi sang lip-sync (checkpoint #1 của orchestrator).

Đường thay thế — công cụ MCP `mcp__minimax__text_to_audio` (tham số `text`, `voice_id`, `model`, `speed`, `language_boost`, `output_directory`): chỉ cho đoạn **ngắn / thử giọng**, vì nó dùng phiên bản API khác (cũng tốn credit). Voiceover chính thức dùng script.

## Tham số

| Cờ | Mặc định | Ghi chú |
|---|---|---|
| `--voice_id` | `MINIMAX_VOICE_ID` trong `.env` → dự phòng như trên | |
| `--model` | `speech-2.8-hd` | |
| `--speed` | `1.08` | 0.5–2.0 |
| `--vol` · `--pitch` | `1.0` · `0` | vol 0–10, pitch −12…12 |
| `--language_boost` | `Vietnamese` | `English`, `Chinese`, `auto`… |

Tham số API đầy đủ (`pronunciation_dict`, `voice_modify` kiểu echo, định dạng phản hồi): [references/minimax-tts-api.md](references/minimax-tts-api.md). Script hiện **không** truyền `pronunciation_dict` / `voice_modify` — muốn dùng phải sửa script.

## Lỗi đã gặp

| Triệu chứng | Nguyên nhân | Sửa |
|---|---|---|
| `MINIMAX_API_KEY not found in .env` | thiếu khoá; script đọc `.env` ở **gốc repo** | thêm khoá vào `.env` (`.env.example` hiện chưa có dòng MiniMax) |
| `API Error: <status_msg>` | `base_resp.status_code` ≠ 0 (sai voice, hết credit, tham số) | đọc `status_msg`; không đoán |
| `HTTPError` từ `raise_for_status` | lỗi mạng / quyền | kiểm khoá và mạng, chạy lại sau khi hỏi user |
| Giọng khác giọng trong ví dụ cũ | `.env` đặt `MINIMAX_VOICE_ID` ghi đè giá trị dự phòng | bình thường — script ưu tiên `.env` |

## Cải tiến skill

Gặp lỗi mới → thêm một dòng vào bảng trên và vào [references/kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*; sửa đúng một chỗ (script: `scripts/text_to_mp3.py`; API: `references/minimax-tts-api.md`).

## Liên quan

- Mặc định: `mkt-elevenlabs-tts-to-mp3` (cùng đầu vào / đầu ra, có bản đồ phát âm).
- Trước: `mkt-linh-aloha-bds-video-script` / `mkt-vn-short-video-script` (ra `script.txt`; footer `tts_provider`).
- Sau: `heygen-mp3-to-mp4`, `mkt-ai-video-extract-srt-segment`; gọi bởi các orchestrator `mkt-full-video-with-11-*` khi `tts_provider` = `minimax`.
