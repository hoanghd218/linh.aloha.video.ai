# Kinh nghiệm — ElevenLabs TTS cho video Linh Aloha

Đọc khi chỉnh giọng, khi một câu đọc sai, hoặc khi mô hình mặc định gây nhầm. Gặp lỗi mới → thêm một dòng vào đúng mục + một dòng *Nhật ký*. Chỉ ghi điều có thật.

## Chỉnh cài đặt giọng

Mặc định của script: `stability=0.5`, `similarity_boost=0.75`, `style=0`, speaker boost bật, `speed=1.0` (mặc định của ElevenLabs).

| Cài đặt | Khoảng | Tác dụng |
|---|---|---|
| `stability` | 0.0–1.0 | Cao = đều, ít biểu cảm; thấp = nhiều cảm xúc, dao động hơn. **0.5 là điểm ngọt** cho lời dẫn. Hạ 0.3–0.4 cho hook đời thường; nâng 0.7+ cho giải thích trang trọng |
| `similarity_boost` | 0.0–1.0 | Bám giọng gốc đến đâu. **0.75 mặc định**; nâng về 0.9 nếu giọng nghe "lệch" so với bản gốc |
| `style` | 0.0–1.0 | Nhấn phong cách. **0 mặc định**; > 0 làm tăng độ trễ. Dùng 0.1–0.3 cho nội dung biểu cảm |
| `use_speaker_boost` | bật / tắt | Giữ độ giống người nói; giữ **bật** để giọng thương hiệu nhất quán |

Ví dụ: `--stability 0.4 --similarity_boost 0.8 --style 0.2`.

## Số khi đọc tiếng Việt

Model đa ngữ rơi về quy ước tiếng Anh (dấu chấm = thập phân, dấu phẩy = ngăn nghìn) nên đọc sai nhóm chữ số kiểu Việt:

| Gõ trong script | Bị đọc thành | Nên đọc |
|---|---|---|
| `82.820` | "eighty-two point eight two zero" | "tám mươi hai nghìn tám trăm hai mươi" |
| `28,8` | "twenty-eight comma eight" | "hai mươi tám phẩy tám" |
| `4.000` | "four point zero zero zero" | "bốn nghìn" |

Script **không** tự đổi (số tiếng Việt khó: "lăm" / "năm", "mốt" / "một", chỗ đặt "nghìn / triệu / tỷ") mà in cảnh báo ra stderr mỗi lần gặp. Thấy cảnh báo → sửa script rồi chạy lại.

## Vì sao không tự chia nhỏ

ElevenLabs giới hạn 5000 ký tự mỗi yêu cầu. Script dừng thay vì tự chia vì: một voiceover nên là một khối liền mạch (chia giữa chừng làm nhịp đọc nhảy ở chỗ nối); nội dung video ngắn thường nằm xa dưới 5000 ký tự; cần dài hơn thì tách theo ngữ nghĩa (ngắt đoạn), gọi từng đoạn, rồi ghép bằng ffmpeg trong pipeline riêng.

## Nghi vấn kỹ thuật chưa giải quyết (2026-11-11)

- **Model mặc định lệch nhau.** `SKILL.md` bản cũ ghi mặc định `eleven_v3`, nhưng `scripts/text_to_mp3.py` đặt `DEFAULT_MODEL = "eleven_turbo_v2_5"`; orchestrator `mkt-full-video-with-11-hyperframe-heygen-16-9` thì viết "sub-skill đã default `model_id=eleven_v3` nên nhận tag inline" (Phase 1b, `script-tagged.txt`) và gọi không kèm `--model_id`. Nếu script thật sự chạy `eleven_turbo_v2_5` thì audio tag trong `script-tagged.txt` không có tác dụng. `SKILL.md` hiện ghi đúng theo script và bảo thêm `--model_id eleven_v3`; cần người điều phối quyết: (a) đổi mặc định trong script về `eleven_v3`, (b) giữ turbo và sửa orchestrator truyền `--model_id eleven_v3`.
- **`speed` luôn được gửi** trong `voice_settings` (giá trị 1.0 khi không đổi), trong khi `--help` ghi chỉ hỗ trợ `eleven_turbo_v2_5` / `eleven_flash_v2_5`. Chưa kiểm chứng `eleven_v3` có chấp nhận trường này không (không chạy API trả phí để thử).
- **Giọng mặc định.** `K7ewtjKRNtwwt3lKQ6M0` được `.env.example` gọi là "Hoàng's brand voice" và orchestrator 16:9 mô tả là giọng nam Việt tầm trung. Thương hiệu Linh Aloha xưng "em Linh" — cần xác nhận đây có đúng giọng muốn dùng cho kênh Linh không.

## Tham khảo API

- Endpoint: `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` · xác thực: header `xi-api-key`
- Model: https://elevenlabs.io/docs/models · Thư viện giọng: https://elevenlabs.io/app/voice-library
- Tài liệu: https://elevenlabs.io/docs/api-reference/text-to-speech/convert · Hạn mức: https://elevenlabs.io/pricing (tuỳ gói)
- Phụ thuộc Python (PEP 723, `uv run` tự cài): `requests`, `python-dotenv`

## Nhật ký

- **2026-11-11 — tối ưu theo chuẩn skill video (v1.1):** viết lại `SKILL.md` theo bố cục Đầu vào → Đầu ra / Luật / Quy trình / Lỗi / Liên quan; dời bảng chỉnh giọng, bảng số, lý do không chia nhỏ, tham khảo API sang tệp này; sửa mặc định model cho khớp `scripts/text_to_mp3.py` (`eleven_turbo_v2_5`) và ghi mâu thuẫn ở mục Nghi vấn; thêm bảng chọn ElevenLabs / MiniMax, luật cổng duyệt + không ghi đè; ghi các cờ chưa có tài liệu (`--speed`, `--no_speaker_boost`); thống nhất thư mục ra `workspace/content/YYYY-MM-DD/<slug>/voiceover.mp3` như các orchestrator; sửa số bước bị trùng ("4." hai lần) trong phần Workflow cũ; không chép lại nội dung `assets/vn-pronunciation-map.json`.
