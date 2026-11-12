# Thư mục video, canvas, tệp trung gian, tài nguyên chép sẵn

Đọc khi: cần biết skill ghi ra những tệp nào, schema `scenes-outline.json` / `scenes.json`, số đo canvas, SFX nối ở đâu, hay logo nào có sẵn cho sub-agent.

## Thư mục video sau khi chạy xong

```
<P>/
├── voiceover.mp3        # vào (giữ nguyên; chỉ để lưu trữ, không mount vào composition)
├── source.mp4           # vào (HeyGen avatar lip-sync; tiếng của video lấy từ đây)
├── script.txt           # vào (lời thoại gốc — sửa lỗi chép + lấy heading cảnh)
├── visual-plan.json     # vào, nếu đã chạy planner mkt-plan-short-video-edit-16-9
├── transcript.json      # ra — Whisper theo từ [{text,start,end}]
├── transcript-cleaned.json   # ra — đã sửa lỗi tiếng Việt
├── scenes-outline.json  # ra — dàn cảnh trước checkpoint (chỉ khi không có visual-plan.json)
├── scenes.json          # ra — metadata từng cảnh (schema dưới)
├── index.html           # ra — root composition 1920×1080
├── compositions/
│   ├── scene-1.html … scene-N.html   # do sub-agent LLM viết (1 tệp/cảnh, bất kể N)
│   ├── yt-lower-third.html           # chép từ assets/compositions/
│   └── captions.html                 # chỉ khi chạy generate_captions.py (mặc định KHÔNG có)
├── sfx/                 # 6 tệp chép từ assets/sfx/
├── assets/logos/ · assets/avatar.jpg # chép từ assets/ của skill
└── 1.png … N.png        # tuỳ chọn — ảnh giấy kem ở lớp gốc (người dùng tạo từ prompts.md của planner)
```

## Canvas

- Gốc: `data-width="1920" data-height="1080"`.
- Khung avatar SPLIT: `top:100, left:1290, width:540, height:880, borderRadius:32`. PIP: `top:600, left:1540, width:320, height:420, borderRadius:20`.
- Slide-mount: `1200×1080` ở SPLIT, GSAP nở thành `1920×1080` khi PIP. Mỗi composition có `data-width="1200" data-height="1080"` (đầy 100% mount, tự nở theo).

## scenes-outline.json (do `detect_scenes.py` ghi, hoặc tự viết)

Suy từ `transcript-cleaned.json` + `script.txt` theo khung kiến thức 5 cảnh: hook (câu đầu) · problem (chỗ script chuyển sang "AI cũ / khó / đứt mạch / vấn đề") · solution (chỗ giới thiệu công cụ/phương pháp) · recap (chỗ nêu kết quả bằng số) · cta (câu cuối có comment/lưu/follow). Script không đủ 5 phần → ra ít hơn (tối thiểu 3) và cảnh báo; thuật toán dự phòng: chia theo ranh giới câu thành ~5 khúc, cảnh 3 (solution, thường dài nhất) nặng gấp 1,5.

```json
[
  { "num": 1, "kind": "hook",     "start": 0.07,  "end": 13.73, "kicker": "...", "heading": "...", "variant": "tier-row" },
  { "num": 2, "kind": "problem",  "start": 13.73, "end": 27.37, "kicker": "...", "heading": "...", "variant": "chats-stack" },
  { "num": 3, "kind": "solution", "start": 27.37, "end": 47.75, "kicker": "...", "heading": "...", "variant": "hero-orb" },
  { "num": 4, "kind": "recap",    "start": 47.75, "end": 53.80, "kicker": "...", "heading": "...", "variant": "counter-row" },
  { "num": 5, "kind": "cta",      "start": 53.80, "end": 60.68, "kicker": "...", "heading": "...", "variant": "terminal-row" }
]
```

## scenes.json (do `scaffold_project.py` hoặc `apply_plan_to_scenes.py` ghi)

`{ "total_duration": <giây>, "scenes": [...] }`; mỗi cảnh = cảnh của outline + `accent_words` (số + 2–3 danh từ cuối heading) · `mockup_variant` · `content` (theo mẫu) · `badges` (1–3 huy hiệu nổi) · `brollEnd`, `hasBreath` (cho lịch SPLIT↔PIP) · `pip_events` `[{in,out}]` (quy tắc: `pip-event-scheduling.md`). Có `visual-plan.json` thì `scenes.json` suy từ kế hoạch (`apply_plan_to_scenes.py`) và bỏ bước tự điền nội dung.

## Tài nguyên chép sẵn (`scaffold_project.py`)

| Tài nguyên | Nguồn → đích | Dùng cho |
|---|---|---|
| 6 SFX | `assets/sfx/` → `<P>/sfx/` | camera-flash, Whoosh sound effect (1), búng tay, Laser, ting, Discord Notification - Sound Effect |
| Logo thương hiệu | `assets/logos/` (`chatgpt logo.png`, `gemini logo.jpg`, `claude logo.png`, `claude code logo big.png`) → `<P>/assets/logos/` đổi tên gọn: `chatgpt.png`, `gemini.jpg`, `claude.png`, `claude-code.png` | avatar chữ → logo ở hàng thất bại, orb, tool-badge |
| Avatar kênh | `assets/avatar.jpg` → `<P>/assets/avatar.jpg` | banner subscribe của yt-lower-third |
| YT lower-third | `assets/compositions/yt-lower-third.html` → `<P>/compositions/` | banner subscribe 3 s cuối |

Thiếu tài nguyên trong skill thì script thử đường dẫn cũ ở máy khác, không thấy thì bỏ qua (composition tự lùi về avatar chữ, không có lower-third). Có thể `--no-sfx` để bỏ qua SFX.

Logo dùng trong composition: hook tier-row "sau" → tool-badge (góc phải trên) logo Claude + tên · problem chats-stack → logo ChatGPT/Gemini tự gắn khi `name` khớp từ khoá (`chatgpt`/`gpt` → chatgpt.png; `gemini`/`google` → gemini.jpg) · solution hero-orb → logo thương hiệu trong orb (mặc định Claude) · CTA → không logo.

## SFX nối ở đâu (`generate_root_index.py`)

camera-flash tại 0 s (hook, vol 0,32) · Whoosh tại đầu cảnh 2 · búng tay tại đầu cảnh 3 · Laser tại đầu cảnh 4 · ting tại đầu cảnh 4 (recap, vol 0,20) · Discord tại đầu cảnh 5 (CTA, vol 0,28); các SFX giữa vol 0,18. Cảnh số không tồn tại (video < 5 cảnh) thì SFX tương ứng bị bỏ; cảnh > 5 không có SFX riêng. Giữ vol trong 0,18–0,32 — trên 0,4 át giọng avatar.
