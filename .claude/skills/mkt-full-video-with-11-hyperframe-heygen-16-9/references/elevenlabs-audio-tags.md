# Chèn audio tag ElevenLabs v3 (Phase 1a)

Đọc khi: làm `script-tagged.txt` từ `script.txt` ở Bước 1a của [SKILL.md](../SKILL.md). Tệp này là phần tóm tắt từng nằm inline trong SKILL.md — không có bản dài hơn.

`mkt-elevenlabs-tts-to-mp3` mặc định `model_id=eleven_v3`, nên nhận tag trong ngoặc vuông ngay trong văn bản. LLM tự chèn (không chạy script) vì cần gắn cảm xúc theo từng câu.

## Quy tắc

- **Giọng**: giọng mặc định của `mkt-elevenlabs-tts-to-mp3` (voice ID khoá sẵn ở skill đó, đổi qua `ELEVENLABS_VOICE_ID` trong `.env`) — nam Việt tầm trung, đối thoại. Hợp `[excited]`, `[curious]`, `[sigh]`, `[chuckles]`, `[sarcastic]`, `[whispers]` (vừa phải). **Tránh** `[shouts]`, `[crying]`, `[sings]` và tag hiệu ứng âm thanh (`[applause]`, `[gunshot]`…) — SFX dùng tệp rời ở lớp composition.
- **Mật độ**: 1 tag mỗi 8–15 giây. Script 60 s ≈ 4–8 tag tổng. Nhiều quá thì giọng giật.
- **Gợi ý theo loại cảnh**:
  - Hook → `[curious]` mở câu hỏi → `[excited]` khi nói số liệu.
  - Problem / Fail → `[sigh]` thừa nhận thất bại + `[sarcastic]` chỉ điểm.
  - Solution / Cơ chế → `[curious]` dựng bối cảnh + `[excited]` khi lộ giải pháp.
  - Recap → `[chuckles]` khép ấm + IN HOA từ khoá để nhấn.
  - CTA → `[excited]` (một tag, không chồng).
- **Dấu câu**: `…` (dấu ba chấm) tạo nhịp nghỉ trước đoạn lộ; IN HOA 1–2 từ khoá mỗi câu để nhấn.
- **Không diễn giải lại**: không thêm/bớt câu — chỉ chèn tag, đổi hoa/thường từ khoá, thêm `…`.
- Tag cũng tính vào giới hạn 5000 ký tự của ElevenLabs — kiểm `script-tagged.txt` sau khi chèn.
