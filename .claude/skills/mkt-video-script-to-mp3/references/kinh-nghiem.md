# Kinh nghiệm — MiniMax TTS cho video Linh Aloha

Đọc khi tích hợp lại MiniMax hoặc khi giọng / biến môi trường lệch giữa các skill. Gặp lỗi mới → thêm vào đúng mục + một dòng *Nhật ký*. Chỉ ghi điều có thật.

## Nghi vấn kỹ thuật chưa giải quyết (2026-11-11)

- **`.env.example` ở gốc repo chưa có `MINIMAX_API_KEY` / `MINIMAX_VOICE_ID`** (chỉ ElevenLabs, HeyGen, Gemini, OpenAI) — người mới clone repo không biết cần khai báo. Cần thêm hai dòng vào `.env.example` (tệp ngoài phạm vi skill).
- **Hai cách gọi MiniMax lệch nhau trong repo.** Skill này dùng `https://api.minimax.io/v1/t2a_v2`, model `speech-2.8-hd`, chỉ cần `MINIMAX_API_KEY` (+ `MINIMAX_VOICE_ID` tuỳ chọn). Script `mkt-hyperframe-knowledge-video-heygen-9-16-lite/scripts/tts_minimax.py` đòi thêm `MINIMAX_GROUP_ID`, bắt buộc `MINIMAX_VOICE_ID`, model mặc định `speech-02-hd` và cho đổi `MINIMAX_API_BASE`. Chưa rõ cách nào đúng với tài khoản hiện tại.
- **Giọng mặc định.** Script đặt giọng dự phòng `moss_audio_c56d6120-…` nhưng `.env` thật có thể đặt `MINIMAX_VOICE_ID` khác (script ưu tiên `.env`) — nên SKILL chỉ gọi đó là "dự phòng", không phải giá trị đang chạy.
- **Giới hạn ký tự của API** chưa có số trong repo; script không kiểm.

## Chọn nhà cung cấp

Bảng so sánh ElevenLabs / MiniMax nằm ở `mkt-elevenlabs-tts-to-mp3/SKILL.md` (một chỗ duy nhất). Orchestrator `mkt-full-video-with-11-*` nhận `tts_provider` làm tham số đầu vào: `elevenlabs` mặc định, user nói "dùng minimax" thì đặt `minimax`.

## Nhật ký

- **2026-11-11 — tối ưu theo chuẩn skill video (v1.1):** viết lại `SKILL.md` theo bố cục Đầu vào → Đầu ra / Luật / Quy trình / Lỗi / Liên quan; làm rõ ở `description` rằng đây là TTS thay thế (trigger chung như "tạo voiceover" chuyển về `mkt-elevenlabs-tts-to-mp3`, ở đây chỉ còn khi kèm MiniMax); sửa mặc định giọng cho khớp script (đọc `MINIMAX_VOICE_ID` trước, giá trị cũ chỉ là dự phòng); thêm luật cổng duyệt + không ghi đè + khoá `.env`; thống nhất thư mục ra `workspace/content/YYYY-MM-DD/<slug>/voiceover.mp3`; ghi rõ script không truyền `pronunciation_dict` / `voice_modify`.
