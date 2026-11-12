# Kinh nghiệm — bóc SRT + segments từ MP3

Đọc khi lần chạy hỏng, hoặc khi hai skill nói khác nhau về cách bóc lời. Gặp lỗi mới → thêm vào đúng mục + một dòng *Nhật ký*. Chỉ ghi điều có thật, không bịa số đo.

## Script bị thiếu trong repo (đã xử lý 2026-11-11)

- Bản cũ của `SKILL.md` bảo "dùng lại script của skill `heygen-short-video`" (`.claude/skills/heygen-short-video/scripts/transcribe_mp3.py`). **Skill `heygen-short-video` không có trong repo này** (chỉ có `heygen-mp3-to-mp4`) → mọi lệnh ở Step 1 cũ đều gãy. Orchestrator `mkt-full-video-with-11-hyperframe-heygen-16-9` (Phase 3a và các mục troubleshooting / liên quan) vẫn gọi đúng đường dẫn cũ đó — cần sửa sang `.claude/skills/mkt-ai-video-extract-srt-segment/scripts/transcribe_mp3.py` (ngoài phạm vi skill này).
- Đã thêm `scripts/transcribe_mp3.py`, viết lại theo đúng giao diện + định dạng đầu ra trong `SKILL.md`: gọi lệnh `whisper --word_timestamps True --output_format json` vào thư mục tạm, rồi tự dựng `<stem>.srt` và `<stem>_segments.json`. Chỉ dùng thư viện chuẩn; không ghi đè khi tệp đã có (trừ `--force`).
- **Chưa chạy được với Whisper thật** (máy viết không cài `whisper`): đã kiểm hàm dựng SRT / segments bằng một JSON Whisper giả; chưa kiểm lần chạy đầu-cuối. Cần chạy thử một MP3 ngắn trên máy có Whisper trước khi tin hoàn toàn.
- `.env.example` ghi sẵn: skill này mặc định dùng lệnh `whisper` cục bộ (`pip install openai-whisper`), không cần khoá; `OPENAI_API_KEY` chỉ cần nếu dùng Whisper API trên đám mây.

## Nghi vấn chưa giải quyết

- `mkt-hyperframe-talking-head-video-16-9/scripts/transcribe_audio.py` nói "nếu skill `mkt-ai-video-extract-srt-segment` có sẵn thì ưu tiên nó" nhưng thực tế chỉ chạy `whisper --model medium` rồi làm phẳng thành `transcript.json`; không gọi skill này. Hai nơi dùng hai model mặc định khác nhau (`base` ở đây, `medium` ở đó).
- Chữ trong `words[].word` do Whisper sinh; sau bước sửa chữ theo script, `text` cấp đoạn khớp script nhưng `words[].word` có thể vẫn là chữ sai. Skill chấp nhận điều này (pipeline chủ yếu dùng mốc từ). Chưa có phép căn từng từ theo script.

## Mẹo chọn model

- `base` đủ cho voiceover tổng hợp (TTS) sạch. Ghi âm ồn hoặc giọng nặng → `small` (≈ gấp đôi thời gian, rõ hơn ở tiếng Việt) hoặc `medium`. Trên mức `small` thời gian tăng nhanh và hiếm khi đáng với video ngắn.

## Nhật ký

- **2026-11-11 — tối ưu theo chuẩn skill video (v1.1):** viết lại `SKILL.md` theo bố cục Đầu vào → Đầu ra / Luật / Quy trình / Lỗi / Liên quan (139 → 113 dòng); sửa tên skill phía sau cho khớp repo (`plan-short-video-edit` → `mkt-plan-short-video-edit-16-9`, bỏ `heygen-remotion-short-video-editor` và `mkt-full-ai-video` không tồn tại); thêm `scripts/transcribe_mp3.py` thay cho script của skill `heygen-short-video` bị thiếu; thêm luật không ghi đè SRT đã sửa chữ, không gọi API trả phí; thêm `argument-hint`.
