---
name: mkt-ai-video-extract-srt-segment
description: Bóc lời từ một voiceover MP3 thành `<stem>.srt` (phụ đề theo đoạn) + `<stem>_segments.json` (mốc thời gian từng từ) bằng Whisper chạy trên máy (lệnh `whisper`, không API trả phí), ghi cạnh MP3, rồi sửa chữ theo script gốc nhưng giữ nguyên mốc giờ. Dùng khi user nói 'extract srt from mp3', 'trích srt từ mp3', 'transcribe voiceover', 'tạo file srt và segments', 'whisper transcribe', 'bóc transcript có timestamp', 'extract voiceover segments', 'tách SRT từ audio', hoặc khi một skill phía sau (mkt-hyperframe-talking-head-video-16-9, mkt-plan-short-video-edit-16-9, caption) cần SRT + segments mà chưa có. Không dùng để tạo giọng đọc (→ mkt-elevenlabs-tts-to-mp3, mkt-video-script-to-mp3), lập kế hoạch hình (→ mkt-plan-short-video-edit-16-9) hay dựng caption / hiệu ứng (→ mkt-hyperframe-talking-head-video*); chỉ nhận MP3.
argument-hint: "<mp3_path> [--language vi] [--model base] [--output-dir <dir>]"
---

# Bóc SRT + segments từ MP3 (Whisper)

Phiên bản: v1.1 — 2026-11-11

Bóc một MP3 voiceover thành hai tệp mà cả pipeline video dùng, **ghi cạnh MP3** (hoặc vào `--output-dir`), tên theo MP3 (`voiceover.mp3` → `voiceover.srt` + `voiceover_segments.json`):

| Đầu vào | Đầu ra |
|---|---|
| `mp3_path` (bắt buộc) — đường dẫn MP3, luôn đặt trong dấu nháy | `<stem>.srt` — SRT mức đoạn, dùng làm caption |
| `language` — mặc định `vi` (`en` cho tiếng Anh) | `<stem>_segments.json` — mốc từng từ, dùng cho SFX đúng chữ, caption từng từ, phân loại đoạn |
| `model` — `tiny` / `base` / `small` / `medium` / `large`, mặc định `base` | |
| `output_dir` — mặc định thư mục của MP3 | |

`K=.claude/skills/mkt-ai-video-extract-srt-segment` · `M=<đường dẫn MP3>` (trong pipeline: `workspace/content/YYYY-MM-DD/<slug>/voiceover.mp3`)

## Luật — không được phá

1. **Chạy trên máy, không gọi API trả phí.** Dùng lệnh `whisper` cục bộ (`pip install openai-whisper`, cần `ffmpeg`). Whisper API trên đám mây (`OPENAI_API_KEY`) chỉ khi user đồng ý — hỏi kèm a / b / c.
2. **Không ghi đè tệp đã có.** `<stem>.srt` và `_segments.json` đã có (và mới hơn MP3) → dùng lại. Chạy lại chỉ khi user xác nhận — SRT thường đã được sửa chữ theo script (bước 4) và chạy lại sẽ mất phần đó. Hỏi: a. dùng lại · b. ghi đè (`--force`) · c. ghi vào `--output-dir` khác. Script cũng tự dừng nếu tệp đã có.
3. **Mốc giờ tin được, chữ thì không.** Khi có script gốc (gần như luôn có trong pipeline video) **bắt buộc** sửa chữ theo script (bước 4), giữ nguyên mọi `start` / `end`. Chỉ bỏ qua khi user không có script.
4. **Không bỏ mảng `words`** của `_segments.json` khi hậu xử lý — giá trị chính của tệp nằm ở mốc từng từ.
5. **Luôn truyền `--language vi` rõ ràng** cho voiceover tiếng Việt — tự nhận diện đôi khi rơi sang ngôn ngữ khác ở clip ngắn.
6. **Không viết thêm script phiên âm khác.** Cần đổi hành vi thì sửa `scripts/transcribe_mp3.py` để mọi nơi dùng chung cùng hưởng.
7. **Báo đường dẫn + số đo thật** (số đoạn, tổng thời lượng) — không tuyên bố xong khi chưa mở thử hai tệp.

## Quy trình

1. **Kiểm tái dùng** (luật 2): có `<stem>.srt` + `<stem>_segments.json` mới hơn `M` chưa. Có → dừng ở đây, báo đường dẫn.
2. **Chạy** (`uv run` chạy giống nhau trên Windows và macOS):
   ```bash
   uv run $K/scripts/transcribe_mp3.py "$M" --language vi --model base
   uv run $K/scripts/transcribe_mp3.py "$M" --language vi --model small --output-dir <thư mục khác>
   ```
   Xong khi in `SRT:`, `Segments:`, `Segments count`, `Total duration`. Script gọi lệnh `whisper` (không thấy trong PATH thì in cách cài).
3. **Kiểm đầu ra:** mở 20 dòng đầu của SRT và đầu `_segments.json`. SRT bắt đầu `1`, `00:00:00,000 --> 00:00:0X,XXX`, rồi chữ; JSON là mảng, mỗi phần tử có `id`, `start`, `end`, `text`, `words`. Thiếu tệp hoặc rỗng = lần chạy hỏng — đọc lại stderr và báo user, không đi tiếp.
4. **Sửa chữ theo script** (luật 3):
   1. Đọc SRT + JSON, giữ nguyên mọi `start` / `end`.
   2. Ghép từng khối SRT với đoạn script tương ứng theo vị trí.
   3. Thay chữ Whisper bằng chữ của script cho đoạn đó.
   4. Chép cùng sửa chữ vào `text` cấp đoạn của `_segments.json`. `words[].word` có thể để nguyên nếu không có phép căn từng từ đáng tin — pipeline chủ yếu dùng mốc từ, không dùng chữ từ.
   5. Ghi lại cả hai tệp tại chỗ.

   Lý do: chữ trong SRT được dựng thành caption; chữ sai thì caption sai. Whisper hay làm hỏng tiếng Việt xen thuật ngữ tiếng Anh (ví dụ "Claude Code" → "Clocot", "MCP Servers" → "MCP Service").
5. **Báo user:**
   ```
   SRT:      <đường dẫn>.srt
   Segments: <đường dẫn>_segments.json
   Segments count: N
   Total duration: X.Xs
   ```
   Bước sau do user hoặc skill gọi quyết định — thường là `mkt-plan-short-video-edit-16-9` (lập kế hoạch hình) hoặc `mkt-hyperframe-talking-head-video-16-9` (caption).

## Định dạng đầu ra

`voiceover.srt`:

```
1
00:00:00,000 --> 00:00:05,139
Đây là tài liệu học Claude Code tốt nhất mình từng thấy…

2
00:00:05,139 --> 00:00:07,299
Nếu bạn mới bắt đầu tìm hiểu Claude Code,
```

`voiceover_segments.json`:

```json
[
  {
    "id": 0,
    "start": 0.0,
    "end": 5.14,
    "text": "Đây là tài liệu học Claude Code tốt nhất…",
    "words": [
      { "word": "Đây", "start": 0.0, "end": 0.34 },
      { "word": "là",  "start": 0.94, "end": 1.12 }
    ]
  }
]
```

Một số skill phía sau cần **mảng phẳng** `transcript.json` (`[{word, start, end}, …]`), không phải JSON lồng này — orchestrator `mkt-full-video-with-11-hyperframe-heygen-16-9` tự làm bước làm phẳng ở Phase 3a.

## Lỗi đã gặp

| Triệu chứng | Nguyên nhân | Sửa |
|---|---|---|
| Không thấy lệnh `whisper` | chưa cài Whisper cục bộ | `pip install openai-whisper`, cần `ffmpeg` trong PATH |
| Chữ tiếng Việt xen từ Anh bị sai | Whisper nhận sai thuật ngữ | bước 4 — sửa theo script |
| Đã có SRT rồi, chạy lại thì chữ đã sửa mất | chạy lại ghi đè | luật 2 — hỏi trước, hoặc ghi sang `--output-dir` khác |
| Tự nhận diện ra ngôn ngữ sai | clip ngắn | luôn `--language vi` |
| Cần chữ chính xác hơn | model `base` còn thô | thử `--model small` (chậm hơn, rõ hơn ở tiếng Việt); cao hơn rất tốn thời gian, hiếm khi đáng với video ngắn |
| Chạy lại hy vọng ra kết quả khác | Whisper ổn định với cùng model + audio | chỉ chạy lại khi đổi model hoặc sửa âm thanh |

Chi tiết và các điểm chưa chắc: [references/kinh-nghiem.md](references/kinh-nghiem.md).

## Cải tiến skill

Gặp lỗi mới → thêm một dòng vào bảng trên và vào `references/kinh-nghiem.md` mục *Nhật ký*; sửa đúng một chỗ (`scripts/transcribe_mp3.py` cho hành vi, `SKILL.md` cho quy trình).

## Liên quan

- Trước: `mkt-elevenlabs-tts-to-mp3` / `mkt-video-script-to-mp3` (ra `voiceover.mp3`) và script gốc để sửa chữ.
- Sau: `mkt-plan-short-video-edit-16-9`, `mkt-hyperframe-talking-head-video-16-9` (đọc `voiceover_segments.json` làm caption), orchestrator `mkt-full-video-with-11-hyperframe-heygen-16-9` (Phase 3a).
- Gần giống nhưng khác việc: `mkt-hyperframe-talking-head-video-16-9/scripts/transcribe_audio.py` ra mảng phẳng `transcript.json`, không ra SRT.
