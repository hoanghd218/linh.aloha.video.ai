# Kinh nghiệm — mkt-hyperframe-knowledge-video-heygen-9-16-lite

Chỉ ghi điều đã có trong skill / repo này. Gặp lỗi mới → thêm vào *Điều cần biết* hoặc *Nhật ký*. Bảng lỗi Phase 2 (gửi nhầm `full.mp3`, HeyGen render ngang, clip lệch window, MCP chưa OAuth, sub-agent báo "stuck", PIP still xấu) nằm ở `heygen-integration.md` mục *Common pitfalls*; lỗi thiết kế scene ở `anti-patterns.md`.

## Điều cần biết khi đọc skill này

- **Hai cổng credit (A: TTS, B: HeyGen)** do bản v1.2 thêm vào: bản cũ chạy autopilot không hỏi, nên có thể tốn credit ElevenLabs / HeyGen ngay khi Hoàng chỉ nhờ "làm video". Từ v1.2: hỏi trước, trừ khi Hoàng nói rõ "chạy luôn".
- **Giọng ElevenLabs:** `scripts/tts.py` đọc `ELEVENLABS_VOICE_ID` từ môi trường; không có thì dùng Adam (`pNInz6obpgDQGcFmaJgB`), khác giọng thương hiệu trong `.env.example`. Script không tự mở `.env` — phải nạp biến vào shell. `references/elevenlabs-v3.md` ghi Adam là "default" theo thiết kế ban đầu cho tiếng Anh.
- **MiniMax:** `scripts/tts_minimax.py` đòi `MINIMAX_API_KEY` + `MINIMAX_GROUP_ID` + `MINIMAX_VOICE_ID`; skill `mkt-video-script-to-mp3` chỉ dùng `MINIMAX_API_KEY` (+ `MINIMAX_VOICE_ID` tuỳ chọn). `.env.example` chưa có dòng MiniMax nào.
- **Skill anh em cũ không còn trong repo:** bản gốc `mkt-hyperframe-knowledge-video-heygen-9-16` (avatar 100%, FULL↔SPLIT), `mkt-hyperframe-knowledge-video-heygen-16-9`, `mkt-hyperframe-knowledge-video`. Khi cần avatar suốt video dùng `mkt-full-video-with-11-hyperframe-heygen`; 16:9 dùng `mkt-full-video-with-11-hyperframe-heygen-16-9` hoặc `mkt-hyperframe-talking-head-video-16-9`.
- **Tài liệu thiết kế `de-xuat-skill-heygen-9-16-lite.md`** (từng ghi "ở gốc repo") không có trong repo.
- **Trùng lặp:** `scripts/clean_transcript.py`, `scripts/fix_caption_typos.py`, `scripts/inject_captions.py` và `assets/templates/captions.html.template` giống hệt bản ở `mkt-hyperframe-talking-head-video` (skill chủ). Palette punch + `fitText()` trong `profiles/bds-broker/design-system.md` cùng kiểu với `mkt-hyperframe-luxury-realestate-9-16` (bản đầy đủ ở đó, ở đây giữ để sub-agent đọc độc lập).
- **SFX:** thư viện `workspace/assets/reels/sfx/` (nhắc trong `sfx-layer.md`) không có trong repo; dùng 6 tệp ở `mkt-hyperframe-talking-head-video/assets/sfx/` và, cho profile `bds-broker`, vài tệp trong `workspace/assets/01_Sound Bất động sản/` (xem `profiles/bds-broker/sfx-map.md`).
- `references/elevenlabs-v3.md` có số ước tính chi phí ElevenLabs theo ký tự — số tham khảo cũ, chưa kiểm lại; không báo cho Hoàng như số thật.
- Lệnh `.sh` (`split_avatar_video.sh`, `prep_broll.sh`, `prep_source_video.sh`) cần Git Bash / WSL trên Windows.

## Lịch sử phiên bản

- v1.0 — tách từ skill avatar 100% thời lượng: bỏ FULL↔SPLIT, thêm avatar windows (30-40% HeyGen), PIP tĩnh 0 credit, media trám tự phân tích.
- v1.1 — thêm profile `bds-broker`: Phase 0 lấy ảnh dự án BĐS từ `workspace/data/` theo chỉ định (resolve → catalog → fetch ASCII), thẩm mỹ broker-creator, 9 scene pattern BĐS, 5 hard rule bổ sung (16-20).

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.2): SKILL.md 273 → 320 dòng (thêm cổng credit); description 1809 → 883 ký tự kèm ranh giới với `mkt-full-video-with-11-hyperframe-heygen`, `mkt-hyperframe-talking-head-video`, `mkt-hyperframe-luxury-realestate-9-16`; thêm bảng Đầu vào → Đầu ra, Cổng credit A / B (AUTOPILOT giữ nguyên sau khi qua cổng), `argument-hint`, mục Lỗi đã gặp / Liên quan; bỏ chỉ dẫn tới skill / tài liệu không tồn tại và dòng "Log hive_mind"; `$SKILL` đổi sang đường dẫn tương đối; sửa đường dẫn SFX và ghi chú giọng ElevenLabs.
