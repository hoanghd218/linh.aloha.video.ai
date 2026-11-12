---
name: mkt-elevenlabs-tts-to-mp3
description: Chuyển script.txt (tiếng Việt / Anh) thành voiceover.mp3 bằng ElevenLabs TTS API — giọng thương hiệu mặc định từ .env, có bản đồ phát âm tiếng Việt, cảnh báo số đọc sai, trần 5000 ký tự mỗi lần. Đây là TTS MẶC ĐỊNH của pipeline video Linh Aloha (MiniMax chỉ khi user chọn). Dùng khi user nói 'tạo mp3 elevenlabs', 'elevenlabs tts', 'eleven labs voice', 'text to speech elevenlabs', 'tạo voiceover elevenlabs', 'đọc text bằng elevenlabs', 'tts elevenlabs to mp3', 'eleven labs script to mp3', 'voiceover bằng elevenlabs', 'giọng elevenlabs', hoặc chỉ nói 'tạo voiceover', 'script to mp3', 'tạo mp3 từ kịch bản' mà không nêu nhà cung cấp, hoặc khi orchestrator Phase 1 cần voiceover.mp3. Không dùng khi user chọn MiniMax (→ mkt-video-script-to-mp3), viết kịch bản (→ mkt-linh-aloha-bds-video-script), lip-sync (→ heygen-mp3-to-mp4), bóc SRT (→ mkt-ai-video-extract-srt-segment).
argument-hint: "--file <script.txt> -o <voiceover.mp3> [--model_id eleven_v3] [--voice_id <id>]"
---

# ElevenLabs TTS → MP3

Phiên bản: v1.1 — 2026-11-11

Chuyển script thành MP3 voiceover qua ElevenLabs Text-to-Speech. Giọng mặc định là giọng thương hiệu của Hoàng, đọc từ `.env`.

| Đầu vào | Đầu ra |
|---|---|
| `script.txt` (hoặc chuỗi inline), ≤ 5000 ký tự | `voiceover.mp3` — MP3 44.1 kHz / 128 kbps, server trả MP3 nên không cần ffmpeg |
| `ELEVENLABS_API_KEY` trong `.env` ở gốc repo | stdout: `output_path`, `size_mb`, `char_count`, `voice_id`, `model_id`, `output_format`; stderr: các phép thay phát âm + cảnh báo số |

`K=.claude/skills/mkt-elevenlabs-tts-to-mp3` · `S=workspace/content/YYYY-MM-DD/<slug>` (thư mục video do orchestrator tạo; thử nhanh → `workspace/assets/elevenlabs/<tên>.mp3`)

## ElevenLabs hay MiniMax?

| | **ElevenLabs** (skill này) | **MiniMax** (`mkt-video-script-to-mp3`) |
|---|---|---|
| Vai trò | **Mặc định** của mọi pipeline | Thay thế, chỉ khi user nói rõ "dùng minimax" / `tts_provider: minimax` |
| Khoá `.env` | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` | `MINIMAX_API_KEY`, `MINIMAX_VOICE_ID` |
| Model mặc định (theo script) | `eleven_turbo_v2_5`; `eleven_v3` khi cần audio tag | `speech-2.8-hd` |
| Giới hạn | 5000 ký tự mỗi lần — script dừng nếu vượt | script không kiểm độ dài |
| Phát âm / số | bản đồ phát âm + cảnh báo số | không có trong script |
| Tốc độ | `--speed` 1.0 | `--speed` 1.08 |
| Ra | MP3 44.1 kHz / 128 kbps | MP3 32 kHz / 128 kbps mono |

User không nói nhà cung cấp → dùng ElevenLabs. Khoá ElevenLabs hết hạn mức hoặc lỗi mà user muốn đổi sang MiniMax → hỏi (a. chuyển MiniMax · b. đợi / đổi gói · c. dừng) rồi mới chạy; trong repo không có số liệu giá để so sánh chi phí hai bên.

## Luật — không được phá

1. **Cổng duyệt — mỗi lần gọi tốn ký tự của gói ElevenLabs.** Chỉ chạy khi user (hoặc orchestrator đã được user duyệt script) yêu cầu tạo MP3; báo trước số ký tự + voice + model. Không chạy lặp để "thử"; muốn thử giọng hay phát âm → dùng một đoạn ngắn (chuỗi inline).
2. **Không ghi đè `voiceover.mp3` có sẵn** — script ghi đè không hỏi. Đã có tệp thì hỏi user: a. giữ bản cũ, ra tệp mới `<tên>-v2.mp3` · b. ghi đè · c. dừng.
3. **Khoá chỉ đọc từ `.env`** (`ELEVENLABS_API_KEY`, tuỳ chọn `ELEVENLABS_VOICE_ID`) — không in giá trị, không chép sang tệp khác, không để khoá trong SKILL.md hay script.
4. **Tên tệp ra là `voiceover.mp3`** khi đi trong pipeline `mkt-full-video-with-11-*` (các skill sau tìm đúng tên đó).
5. **Không tự cắt ghép.** Quá 5000 ký tự → script dừng; tách script theo đoạn (ngắt ngữ nghĩa), gọi từng đoạn, ghép bằng ffmpeg. Không tự chia nhỏ trong script vì ngắt giữa chừng làm nhịp đọc nhảy ở chỗ nối.
6. **Số viết thành chữ trong script** khi có dấu phân cách hoặc thập phân ("82.820", "28,8") — TTS dùng quy ước tiếng Anh nên đọc sai. Script chỉ **cảnh báo**, không tự đổi (đổi số sang chữ tiếng Việt dễ sai "lăm / năm", "mốt / một"). Số nhỏ đứng riêng ("10 tòa", "71 phần trăm", "70-80") thường đọc đúng, để nguyên.
7. **Audio tag** (`[excited]`, `[whisper]`, `[laugh]`…) chỉ có tác dụng với `eleven_v3` → script có tag phải chạy với `--model_id eleven_v3`.
8. **Báo thời lượng thật đo bằng máy** (bước 4), không đoán từ số ký tự; chưa nghe bằng tai thì nói rõ "mới đo bằng máy".

## Quy trình

1. **Kiểm đầu vào.** `S/script.txt` có tồn tại; đếm ký tự (≤ 5000); soi số có dấu phân cách (luật 6); `S/voiceover.mp3` đã có chưa (luật 2). Xong khi biết số ký tự và không còn tệp nào bị đè ngoài ý muốn.
2. **Chạy** (`uv` chạy giống nhau trên Windows và macOS):
   ```bash
   uv run $K/scripts/text_to_mp3.py --file $S/script.txt -o $S/voiceover.mp3
   uv run $K/scripts/text_to_mp3.py --file $S/script-tagged.txt -o $S/voiceover.mp3 --model_id eleven_v3   # có audio tag
   uv run $K/scripts/text_to_mp3.py "Xin chào các bạn" -o workspace/assets/elevenlabs/thu.mp3             # thử nhanh
   ```
   Xong khi in `OK` và có `output_path`.
3. **Đọc stderr:** dòng `Applied pronunciation map` cho biết từ nào đã bị thay; `Warning: VN TTS may mis-read…` nghĩa là còn số cần viết chữ → sửa script, chạy lại (hỏi user vì tốn thêm ký tự).
4. **Đo thời lượng:** `uv run .claude/skills/heygen-mp3-to-mp4/scripts/check_duration.py $S/voiceover.mp3` → `OK <giây>` (hoặc `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 $S/voiceover.mp3`). Orchestrator giới hạn 300 giây.
5. **Báo user:** đường dẫn MP3, thời lượng thật, `char_count`, `voice_id`, `model_id`; mời nghe duyệt (checkpoint #1 của orchestrator) trước khi sang bước lip-sync.

## Tham số

| Cờ | Mặc định | Ghi chú |
|---|---|---|
| `--voice_id` | `ELEVENLABS_VOICE_ID` trong `.env`; dự phòng `K7ewtjKRNtwwt3lKQ6M0` (giọng thương hiệu của Hoàng) | đổi giọng cho một lần chạy |
| `--model_id` | `eleven_turbo_v2_5` | `eleven_v3` (biểu cảm, audio tag), `eleven_multilingual_v2` (chất lượng cao, chậm), `eleven_flash_v2_5` (nhanh nhất) |
| `--output_format` | `mp3_44100_128` | `mp3_44100_192` (chỉ gói trả phí), `pcm_44100`, `ulaw_8000` |
| `--stability` · `--similarity_boost` · `--style` | 0.5 · 0.75 · 0 | bảng chỉnh ở [references/kinh-nghiem.md](references/kinh-nghiem.md) |
| `--no_speaker_boost` | speaker boost bật | thêm cờ này mới tắt; giữ bật để giọng thương hiệu ổn định |
| `--speed` | 1.0 | 0.7–1.2, theo `--help` của script là hỗ trợ trên `eleven_turbo_v2_5` và `eleven_flash_v2_5` |
| `--pronounce-map <json>` · `--no-pronounce-map` | `assets/vn-pronunciation-map.json` | thay bản đồ cho một project / tắt hẳn |

## Bản đồ phát âm

Script tự nạp `assets/vn-pronunciation-map.json` và thay **nguyên từ, không phân biệt hoa thường** trong bộ nhớ trước khi gọi API (script gốc không bị sửa). Hai việc hợp lệ: (1) từ tiếng Anh trong script Việt bị đọc theo âm Việt → ghi âm bồi tiếng Việt ("doc" → "đóc"); (2) địa danh Việt viết không dấu ("Hanoi" → "Hà Nội"). Bản mặc định gồm vài từ kỹ thuật và các thành phố lớn — xem tệp JSON, không chép lại ở đây.

Thêm từ mới: **nghe trước, thêm sau** — chạy thử một đoạn ngắn chứa từ đó; model đã đọc đúng thì đừng thêm (thêm thừa sẽ làm hỏng). Cẩn thận va chạm: thêm "code" sẽ viết lại cả "Code" trong "Claude Code"; tên thương hiệu cần giữ thì không đưa vào; địa danh chỉ thêm khi dạng không dấu không mơ hồ (bỏ qua "Hue" vì trùng từ tiếng Anh).

## Lỗi đã gặp

| Triệu chứng | Nguyên nhân | Sửa |
|---|---|---|
| `ELEVENLABS_API_KEY not found in .env` | thiếu khoá; script đọc `.env` ở **gốc repo** | thêm khoá vào `.env` ở gốc repo (mẫu `.env.example`) |
| `text is N chars, exceeds … 5000` | script quá dài | tách đoạn theo luật 5 |
| `ElevenLabs returned 4xx: {…}` | sai voice / model, hết hạn mức, tên model không có ở gói | đọc thông điệp JSON trong lỗi; không đoán |
| Từ tiếng Anh đọc theo âm Việt | model đọc cả câu theo ngôn ngữ chính | thêm vào bản đồ phát âm sau khi nghe thử |
| "82.820" đọc như số thập phân | quy ước dấu chấm / phẩy tiếng Anh | viết chữ (luật 6) |
| `[excited]` không có tác dụng | model không phải `eleven_v3` | thêm `--model_id eleven_v3` |
| MP3 ra bị ghi đè tệp cũ | script không hỏi | luật 2 — kiểm trước khi chạy |

## Cải tiến skill

Gặp lỗi mới → thêm một dòng vào bảng trên và vào `references/kinh-nghiem.md` mục *Nhật ký*; sửa đúng một chỗ (script: `scripts/text_to_mp3.py`; từ điển: `assets/vn-pronunciation-map.json`).

## Liên quan

- Trước: `mkt-linh-aloha-bds-video-script` / `mkt-vn-short-video-script` (ra `script.txt`; footer `tts_provider` ghi nhà cung cấp user đã chọn).
- Thay thế: `mkt-video-script-to-mp3` (MiniMax).
- Sau: `heygen-mp3-to-mp4` (avatar lip-sync) và `mkt-ai-video-extract-srt-segment` (SRT + mốc từ).
- Gọi bởi: `mkt-full-video-with-11-remotion-heygen`, `mkt-full-video-with-11-hyperframe-heygen`, `mkt-full-video-with-11-hyperframe-heygen-16-9`, `mkt-full-video-with-11-remotion-heygen-apartment-detail`.
