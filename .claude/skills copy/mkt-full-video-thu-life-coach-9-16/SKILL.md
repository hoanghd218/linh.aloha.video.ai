---
name: mkt-full-video-thu-life-coach-9-16
description: End-to-end short-video pipeline (9:16 TikTok/Reels) chuyên cho **Thu — Chuyên gia Lifecoach GEIN Academy**, tác giả cuốn **"Hành trình khắc tên mình lên đá"**. Pipeline downstream sau khi `script.txt` + `brief.md` đã sinh ra từ `mkt-vn-short-video-script` với `--profile thu-gein`. Orchestrator đọc YAML metadata footer của `brief.md` để biết `tts_provider` (Phase 1 gọi `mkt-video-script-to-mp3` nếu `minimax` — default cho profile thu-gein; `mkt-elevenlabs-tts-to-mp3` nếu `elevenlabs`) và `profile` (apply aesthetic `thu_life_coach`). 3 phase ghép skill có sẵn — (1) TTS qua `mkt-video-script-to-mp3` (MiniMax `speech-2.8-hd`, key MiniMax riêng của Thu trong `.env`, speed 0.95-1.00 chậm + trầm), (2) checkpoint user duyệt MP3, (3) **PARALLEL** — HeyGen lip-sync background agent + Phase 3 packager foreground agent (transcribe voiceover.mp3 + identify emphasis moments theo taxonomy brand-voice Thu — anaphora / brand-maxim / book-callout / báo-hiếu / inner-child / forward-consequence / action-count + checkpoint overlays-outline + fan-out N text-overlay writers + scaffold + wait for source.mp4 + preview Studio). Aesthetic là **`thu_life_coach`** — avatar full-frame + 10-14 text overlay nhẹ nhàng (warm cream + deep forest + soft gold + terracotta), font Be Vietnam Pro 800 (body) + Playfair Display 700 italic (brand-maxim / book-callout / carved-name), easing `power2.out` 0.6s, zoom peaks 1.03-1.05 subtle, SFX subset lifestyle (build-up / pop / ui-tap / camera-shutter / film-burn / count / digital-device — KHÔNG dùng collapse / giant-foot / cyber / glitch), captions bottom-280 TikTok pill. **Brand voice tự xưng "Thu" ngôi thứ ba**, audience "cha mẹ / bậc phụ huynh / chúng ta / bạn" — KHÔNG "anh chị". CTA luôn MỀM. USE WHEN user nói "tạo video Thu", "video lifecoach Thu", "video GEIN Academy", "video Hành trình khắc tên mình lên đá", "kịch bản Thu thành video", "thu gein video tiktok", "dựng video cha mẹ con cái Thu", hoặc đưa `script.txt` đã sinh từ `mkt-vn-short-video-script --profile thu-gein`.
---

# mkt-full-video-thu-life-coach-9-16

End-to-end orchestrator chuyên cho **Thu — Chuyên gia Lifecoach GEIN Academy**, tác giả cuốn *"Hành trình khắc tên mình lên đá"*.

Input: `script.txt` + `brief.md` (thường sinh từ `/mkt-vn-short-video-script` với `--profile thu-gein` — orchestrator đọc YAML metadata footer của `brief.md` để tự biết `tts_provider` + `profile` mà không cần hỏi lại user). Output: HyperFrames preview project 9:16 (1080×1920) sẵn sàng render MP4 TikTok/Reels/Shorts/Facebook Reels.

3 phase, 2 user checkpoints:
1. **MP3 checkpoint** (orchestrator) — user duyệt voiceover sau Phase 1
2. **Overlays-outline checkpoint** (Phase 3 sub-agent) — user duyệt danh sách text overlay + SFX cues + brand-maxim quote-card moment trước khi fan-out writers. Skip nếu `auto_overlays=true`.

## Brand voice — Thu (BẮT BUỘC nhớ khi planning visuals)

| Tiêu chí | Spec |
|---|---|
| Người dẫn | **Thu**, Chuyên gia Lifecoach tại **GEIN Academy** |
| Tác phẩm | Sách *"Hành trình khắc tên mình lên đá"* |
| Tự xưng | **"Thu" — ngôi thứ ba.** TUYỆT ĐỐI KHÔNG "tôi / em / mình / cô / chị" để tự xưng. Đây là dấu vân tay thương hiệu |
| Gọi khán giả | "cha mẹ" / "bậc phụ huynh" / "chúng ta" / "bạn" — KHÔNG "anh chị" (đó là brand Linh Aloha), KHÔNG "các bạn ơi", KHÔNG "mọi người" |
| Tông giọng | Từ tâm, ấm áp, không phán xét, có khoảng lặng cảm xúc. Chậm + trầm (≈ 3.3 tiếng/giây) |
| Chủ đề lõi | Gia đình / Nuôi dạy con / Báo hiếu / Chữa lành đứa trẻ bên trong / Tâm lý phụ nữ / Mối quan hệ vợ chồng |
| Pacing TTS | MiniMax `speed 0.95-1.00`. Default `0.98` (chậm hơn broker default 1.08) |
| CTA | **MỀM.** Mời comment + lan toả + follow GEIN Academy. KHÔNG bán khoá học, KHÔNG "inbox để nhận tài liệu", KHÔNG "đăng ký ngay" |
| Visual signature | Có 1 câu **brand maxim** trước CTA — câu châm ngôn trích lên hình thành **quote-card** key visual (vd: "Muốn biết tương lai một đứa trẻ thế nào, hãy nhìn cách bố đối xử với mẹ") |

## Khi nào dùng

- `script.txt` đã sinh từ `/mkt-vn-short-video-script --profile thu-gein` (60-120s, ≤ 5000 ký tự)
- HOẶC user có script Thu tự viết, bám brand voice trên
- Có sẵn (optional) ảnh b-roll: bìa sách, trang sách, lớp học GEIN, học viên ôm sách, gia đình/cha mẹ con cái thật, thiên nhiên gợi hành trình
- Muốn đi 1 mạch từ script tới preview Studio

**Không dùng nếu:**
- Đã có MP3 → dùng thẳng `heygen-mp3-to-mp4`
- Đã có MP4 talking-head → dùng thẳng `mkt-hyperframe-talking-head-video`
- Video BĐS broker-creator → dùng `mkt-full-video-with-11-hyperframe-heygen` (aesthetic đỏ-vàng aggressive KHÔNG hợp brand Thu)
- Script bám brand voice khác (Linh Aloha, Hoàng, etc.) — sai brand voice = hỏng thương hiệu Thu
- Script > 5000 ký tự → split semantic rồi gọi từng segment

## Pipeline overview

```
script.txt + brief.md (từ mkt-vn-short-video-script --profile thu-gein; brief.md có YAML footer tts_provider+profile)
   │
   ▼
Phase 1  ── MiniMax TTS (speed 0.98) ──► voiceover.mp3
   │
   ▼  CHECKPOINT #1 — user duyệt MP3 (tông trầm? chậm? đúng nhịp Thu?)
   │  OK
   ▼
─── Fire 2 agents PARALLEL (1 message) ────────────────────────────────
   │
   ├─ Phase 2 (BACKGROUND) ── heygen-mp3-to-mp4 ──► source.mp4 (3-10 min)
   │
   └─ Phase 3 (FOREGROUND) ── mkt-full-video-phase3-packager
              │  audio_source = voiceover.mp3
              │  source_mp4_pending = true
              │  aesthetic_override = thu_life_coach (full block trong prompt)
              │
              ├─ transcribe voiceover.mp3 + clean + group captions
              ├─ identify emphasis theo brand-voice Thu taxonomy:
              │     anaphora chain / brand-maxim / book-callout /
              │     báo-hiếu / inner-child / forward-consequence /
              │     action-count / pain-quote / imagery
              ├─ CHECKPOINT #2 — user duyệt overlays outline + SFX +
              │     brand-maxim quote-card moment
              ├─ FAN-OUT N text-overlay writers parallel
              ├─ scaffold overlay-*.html + optional broll-*.html + captions
              ├─ wire root index.html (avatar full-frame + zoom hooks + SFX)
              ├─ WAIT for source.mp4 (joins HeyGen background)
              └─ lint + preview Studio
   │
   ▼
User duyệt preview → `render` → final MP4 1080×1920 30fps
```

Wall-clock ~5 phút (HeyGen render overlap với transcribe + outline + checkpoint review).

## Inputs

| Param | Required | Default |
|---|---|---|
| Script text | Yes | File path `.txt`/`.md` hoặc inline. ≤ 5000 ký tự, tiếng Việt, đã bám brand voice Thu |
| Slug | No | Auto-derive 5 từ đầu script. Lowercase ASCII dash. Prefix `thu-` |
| B-roll list | No | `[{path, purpose}]` (filenames ASCII — no dấu Việt) |
| `tts_provider` | No | Default `minimax` (key MiniMax riêng của Thu trong `.env`). **KHÔNG fallback sang ElevenLabs** (giọng ElevenLabs trong `.env` là brand Hoàng) |
| `voice_id` | No | Default `moss_audio_c56d6120-ef9c-11f0-9649-8ee40147f116` (MiniMax mặc định). Override qua `MINIMAX_VOICE_ID` env hoặc CLI `--voice_id` |
| `tts_speed` | No | Default `0.98` (chậm + trầm). User có thể yêu cầu `0.93-1.00` |
| `header_label` | No | Default `"GEIN ACADEMY"` (uppercase pill top) |
| `footer_handle` | No | Default `"GEIN ACADEMY"` (user xác nhận handle thực nếu khác) |
| `book_callout` | No | Có insert mention sách không. Default `true` — Phase 3 sẽ tìm 1 moment để overlay tên sách (max 1x) |
| `auto_overlays` | No | Skip checkpoint #2. Default `false` |
| `brand_palette` | No | JSON override. Default xem [Visual style](#visual-style--thu_life_coach) |

## Workspace layout

```
workspace/content/YYYY-MM-DD/<slug>/
├── script.txt
├── voiceover.mp3                  # Phase 1 — MiniMax
├── source.mp4                     # Phase 2 — HeyGen
├── broll/                         # ASCII filenames!
├── transcript-cleaned.json        # Phase 3
├── caption-groups.json
├── overlays-outline.json          # pre-checkpoint #2
├── overlays/                      # fan-out per-overlay JSON
├── overlays.json                  # merged
├── compositions/
│   ├── overlay-01..N.html         # text overlay (soft fade-up)
│   ├── quote-card.html            # brand-maxim full-screen (1x)
│   ├── book-callout.html          # optional 1x
│   ├── broll-01..M.html           # optional full-screen b-roll
│   └── captions.html
├── sfx/                           # 7 file ASCII subset
├── renders/
└── index.html                     # avatar full-frame + zoom hooks + SFX + N mounts
```

## Workflow

### Step 0 — Setup

1. Validate `len(script) ≤ 5000`. Vượt → stop, yêu cầu split semantic.
2. Derive slug nếu thiếu. Prefix `thu-` nếu chưa có. VD `"Một đứa trẻ không..."` → `thu-mot-dua-tre-khong`.
3. **TTS provider**: default `minimax`. Validate `MINIMAX_API_KEY` trong `.env` (key Thu — đã set sẵn).
4. Tạo `workspace/content/YYYY-MM-DD/<slug>/`. Save `script.txt`.
5. **Fire 2 copy ops song song** (1 message, 2 Bash calls `run_in_background:true`):
   - Copy b-roll → `broll/` (ASCII rename — strip dấu Việt + space → dash + lowercase).
   - Copy 7 SFX file subset → `<workspace>/sfx/` từ `workspace/assets/01_Sound Bất động sản/` (subset xem [SFX library — thu subset](#sfx-library--thu-subset)).
6. Báo user: workspace path, provider (`minimax`), b-roll count, SFX subset đã copy.

### Step 1 — Phase 1: Script → MP3 (MiniMax)

#### Step 1a — Pre-clean filler (BẮT BUỘC trước TTS)

Script đầu vào có thể là **raw transcript** từ video Thu nói tự nhiên — chứa filler "Ờ / À / Thì / Uhm / Ưmm" mà nếu đưa thẳng vào MiniMax sẽ đọc thành tiếng → unnatural.

Trước khi gọi TTS, MUST grep + strip các filler sau khỏi `script.txt`:

```python
# Pre-clean rules (regex, case-insensitive, Unicode VN)
# Strip filler words KHI đứng đầu câu hoặc sau dấu câu:
filler_patterns = [
    r'(?<![a-zà-ỹ])[Ờờ][\s,.]+',     # "Ờ Thu đã..." → "Thu đã..."
    r'(?<![a-zà-ỹ])[ÀàẢả][\s,.]+',   # "À thì..." → "thì..."
    r'(?<![a-zà-ỹ])[Uu][mh]+[\s,.]+', # "Uhm / Ưmm"
    r'(?<![a-zà-ỹ])Thì\s+(?=[A-ZĐĂÂ])', # "Thì Thu nhận thấy" → "Thu nhận thấy" (khi đứng đầu)
]
# CẢNH BÁO: KHÔNG strip "thì" khi nó là từ nối ngữ pháp đúng ("nếu... thì..." giữ nguyên)
```

Nếu tìm thấy filler → backup `script.txt` thành `script.raw.txt`, ghi đè `script.txt` đã clean. Báo user: "Đã clean N filler ('Ờ', 'À'…) khỏi script trước TTS."

Nếu user cung cấp `script.txt` đã sinh từ `/mkt-vn-short-video-script --profile thu-gein` → skip step này (skill viết script đã clean filler theo checklist của nó).

#### Step 1b — TTS

```bash
uv run .claude/skills/mkt-video-script-to-mp3/scripts/text_to_mp3.py \
  --file workspace/content/YYYY-MM-DD/<slug>/script.txt \
  -o workspace/content/YYYY-MM-DD/<slug>/voiceover.mp3 \
  --speed 0.98
```

- Speed mặc định `0.98` (chậm + trầm — Thu nói ≈ 3.3 tiếng/giây có khoảng lặng cảm xúc).
- Filename **inviolable**: `voiceover.mp3`.
- Check duration ≤ 300s (HeyGen single-video cap). Nếu > 300s → stop, suggest chunking.
- Nếu MiniMax fail (401 → key sai / hết credit) → check `.env` `MINIMAX_API_KEY` + báo user. **KHÔNG auto-swap sang ElevenLabs** (voice ElevenLabs default là brand Hoàng — sai brand Thu).

### Step 2 — CHECKPOINT #1: user nghe MP3

```markdown
## Voiceover ready — Thu / GEIN Academy
**File:** workspace/content/YYYY-MM-DD/<slug>/voiceover.mp3
**Duration:** <X>s · **Size:** <Y>MB · **Provider:** minimax (speech-2.8-hd) · **Speed:** 0.98

Reply:
- `OK` / `tiếp` → chạy Phase 2 (HeyGen) + Phase 3 (HyperFrames) parallel
- `chậm hơn` → 0.93-0.95 (cho moments cảm xúc nặng)
- `nhanh hơn` → 1.00-1.05 (nếu Thu nghe quá thiền)
- `sửa script` + nội dung → save script mới rerun Phase 1
```

**Stop. Đợi user.**

### Step 2.5 — Optional: Auto-generate b-roll via KIE AI

Nếu user **không có file b-roll thật** (folder `broll/` rỗng hoặc user nói "chưa có b-roll"), orchestrator có thể chạy skill **`mkt-kie-broll-image-generator`** để gen ảnh photoreal warm-editorial theo profile `thu-gein` trước khi vào Phase 3.

**Trigger** — chỉ chạy khi:
1. `auto_broll: true` trong input args, HOẶC
2. User reply `gen b-roll` / `tạo ảnh b-roll` ở checkpoint #1 cùng với `OK`

**Pre-check** — verify `KIE_API_KEY` trong `.env` root. Thiếu → báo user setup rồi mới chạy (xem `mkt-kie-broll-image-generator/SKILL.md` Step 0).

**Cost warning** — luôn show số ảnh sẽ gen + nhắc check credit kie.ai trước khi confirm. Ví dụ: "Sẽ gen 3 ảnh b-roll qua Nano Banana 2 (9:16, 1K, profile `thu-gein`). Check credit tại https://kie.ai/dashboard rồi reply `ok`".

**Invoke** — sau khi user OK:

```bash
# Mode A — auto-parse brief.md
uv run .claude/skills/mkt-kie-broll-image-generator/scripts/parse_brief_broll.py \
  --brief workspace/content/YYYY-MM-DD/<slug>/brief.md \
  --profile thu-gein \
  --output_json workspace/content/YYYY-MM-DD/<slug>/broll-prompts.json

# Loop qua từng prompt -> gen ảnh
uv run .claude/skills/mkt-kie-broll-image-generator/scripts/generate_image.py \
  --prompt "<prompt từ broll-prompts.json>" \
  --provider nano-banana \
  --aspect_ratio 9:16 --resolution 1K --output_format png \
  --output workspace/content/YYYY-MM-DD/<slug>/broll/<suggested_filename>
```

Skill viết `broll/broll-manifest.json` với prompts + filenames + taskIds.

**Sau khi gen xong**, b-roll list tự động fill vào input của Phase 3 packager ở Step 3 dưới dạng `[{path: "broll/broll-01-mom-cooking.png", purpose: "imagery cha mẹ mệt"}, ...]`. Phase 3 packager xử lý các ảnh này như b-roll thật (full-screen takeover + ken-burns 1.0→1.04 + warm vignette + cream paper overlay 8%) — KHÔNG cần thay đổi gì ở agent prompt.

Chi tiết / failure modes / provider switch → `.claude/skills/mkt-kie-broll-image-generator/SKILL.md`.

### Step 3 — Phase 2 + Phase 3 PARALLEL (1 message, 2 concurrent agents)

Sau CHECKPOINT #1 OK, fire **2 agents trong 1 message**.

**Agent A — HeyGen runner (`run_in_background: true`)**

```
subagent_type: general-purpose
run_in_background: true
prompt: |
  Invoke skill `heygen-mp3-to-mp4` với:
  - mp3: workspace/content/YYYY-MM-DD/<slug>/voiceover.mp3
  - output: workspace/content/YYYY-MM-DD/<slug>/source.mp4

  Theo skill: pick avatar từ HEYGEN_AVATAR_LOOKS, upload MP3 via HeyGen MCP,
  generate lip-sync 9:16 720×1280, poll ≤ 10 min, download to source.mp4.
  Filename `source.mp4` inviolable. Return khi file tồn tại trên disk.

  Lưu ý: avatar pool trong `.env HEYGEN_AVATAR_LOOKS` hiện đang là brand Hoàng.
  Nếu Thu/GEIN đã setup avatar riêng → override `--avatar_id <id>`. Nếu chưa,
  dùng avatar pool — user sẽ verify ở Studio preview và override sau.
```

**Agent B — Phase 3 packager (foreground)**

```
subagent_type: mkt-full-video-phase3-packager
prompt: |
  Workspace: workspace/content/YYYY-MM-DD/<slug>/
  Slug: <slug>
  Script: <full text>
  B-roll: [{path: "...", purpose: "..."}, ...]
  auto_overlays: false
  header_label: "GEIN ACADEMY"
  footer_handle: "GEIN ACADEMY"
  audio_source: voiceover.mp3
  source_mp4_pending: true

  ##### AESTHETIC OVERRIDE — thu_life_coach #####
  KHÔNG dùng broker-creator defaults. Đây là brand Thu — Chuyên gia Lifecoach
  GEIN Academy, tác giả "Hành trình khắc tên mình lên đá". Brand voice tự xưng
  "Thu" ngôi thứ ba, audience "cha mẹ / bậc phụ huynh / chúng ta / bạn".
  Tông giọng: từ tâm, ấm áp, không phán xét. Apply overrides sau:

  brand_palette:
    base_bg: "#f5ede1"        # warm cream paper (tone sách "khắc tên lên đá")
    text_primary: "#1a3d2f"   # deep forest green (text body)
    accent_gold: "#c89b3c"    # soft gold (brand-maxim + carved-name)
    accent_emo: "#c75c3c"     # terracotta (pain-quote + emotional emphasis)
    text_white: "#fdfaf3"     # off-white for dark-bg overlay text
    stroke_dark: "rgba(26,61,47,0.85)"   # forest stroke (thinner than broker 8px)
    shadow_soft: "0 4px 24px rgba(26,61,47,0.25)"

  overlay_variants (use these instead of broker punch-*):
    - "pain-quote" (Be Vietnam Pro 800 italic, terracotta #c75c3c, slow fade 0.7s, hold 2.5s. Dùng cho câu nói đau "Tôi không còn được con tôn trọng nữa..." / "Đứa con bất hiếu...")
    - "quoted-question" (Playfair Display 700 italic, gold #c89b3c, dấu " " hiển thị to + gold accent, 100-130px, neutral tông fade-up 0.6s. Dùng cho câu hỏi quen thuộc của cha mẹ trong dấu ngoặc kép: "Làm thế nào để con mình giỏi giang và hạnh phúc?" / "Sao nuôi con bao nhiêu năm mà giờ nó không nhớ đến mình?")
    - "soft-headline" (Be Vietnam Pro 800, forest #1a3d2f, fade-up + scale 0.98→1.0, 0.6s. Dùng cho diagnosis "Thu nhận thấy" / "Thu đã làm việc với rất nhiều" / key insight)
    - "anaphora-row" (Be Vietnam Pro 700, forest 80-100px, stacked 3-4 row, stagger 0.4s entry. Dùng cho chuỗi LẶP cùng cấu trúc: "Một đứa trẻ lớn lên... / Một đứa trẻ nhìn thấy... / Một đứa trẻ được chứng kiến..." HOẶC "Cha mẹ có thể... / Cha mẹ cũng có lúc... / Cha mẹ dù vụng về...")
    - "contrast-pair" (2-line stacked layout. Vế trên: BVP 700 forest dim opacity 0.55, 80-100px. Chữ "NHƯNG" / "BUT" giữa: BVP 900 terracotta #c75c3c, 110px, all-caps, fade-up 0.4s sau vế trên. Vế dưới: BVP 800 forest đậm + gold underline 4px, 90-110px. Tổng entry stagger 1.2s. Dùng cho câu kép đối lập: "Một đứa trẻ không có tình yêu thì lớn lên sẽ dễ bị tổn thương / NHƯNG / một đứa trẻ không có sự dạy dỗ, chúng lớn lên sẽ làm tổn thương người khác" / "Cha mẹ không hoàn hảo / NHƯNG / tình thương của cha mẹ luôn dành cho con một cách hoàn hảo nhất")
    - "concession-list" (BVP 700 forest dim opacity 0.55, 70-90px, stacked 3 cụm. Stagger 0.4s per cụm, KHÔNG count number, KHÔNG gold — đây là cái SAI / negative dim, dẫn vào cái ĐÚNG sau đó. Dùng cho list-of-sai: "sai trong lựa chọn / sai trong tính toán / sai trong cách dạy dỗ con cái")
    - "action-count" (Be Vietnam Pro 900, gold #c89b3c 140px number + forest text label 70-90px, count-up 0.6s. Dùng cho action list ĐÚNG: "Một là... Hai là... Ba là... Và cuối cùng...")
    - "imagery-word" (Playfair Display 700 italic, gold #c89b3c, 90-120px, 1-2 line layout. Fade-up + 12px drift, 0.7s. Hỗ trợ phrase 3-7 từ: "cong lưng dưới nắng", "miếng ngon nhất trong bữa cơm", "dao cứa vào tim", "tấm quà cái bánh mang về biếu", "cặp sách tới trường")
    - "imagery-card" (2-3 dòng metaphor pair "X như Y", Playfair italic gold #c89b3c 80-100px trên cream base #f5ede1 — KHÔNG dark vignette vì đây là warmth not gravity. Stagger 0.5s per dòng. Dùng cho chuỗi metaphor "sâu như mạch ngầm / ấm như đốm lửa / nuôi con đi suốt cả cuộc đời")
    - "forward-consequence" (Be Vietnam Pro 800 italic, terracotta #c75c3c, slow zoom 1.0→1.03 trong 2.5s. Dùng cho "Để rồi sau 20 năm..." / "Một ngày nào đó, nếu cha mẹ không còn..." / "Khi cha mẹ không còn...")
    - "quote-card" (Playfair Display 700 italic, off-white #fdfaf3 trên dark vignette 50%, full-screen takeover 3-4s, slow zoom 1.0→1.04. **MANDATORY 1x/video** — dùng cho brand maxim chốt trước CTA: "Muốn biết tương lai một đứa trẻ thế nào, hãy nhìn cách bố đối xử với mẹ" / "Tình thương của cha mẹ luôn dành cho con một cách hoàn hảo nhất")
    - "book-callout" (Playfair Display 700 italic, off-white #fdfaf3 trên dark vignette 40%, slow zoom 1.0→1.02 trong 2.5s. Dùng MAX 1x khi mention "Hành trình khắc tên mình lên đá")
    - "cta-soft" (BVP 700 forest 100px top + Playfair italic gold 60px "GEIN ACADEMY" bottom + optional câu hỏi mở italic 70px "Bạn nghĩ sao?" trên cùng. Fade-up + drift 0.7s. Cuối video — MỀM, mời comment / lan toả / follow, KHÔNG bán khoá)

  emphasis categories (replace broker brand/price/urgency taxonomy):
    - "pain-quote" — câu nói đau của cha mẹ / con / xã hội ("Tôi không còn được con tôn trọng nữa") → pain-quote variant
    - "quoted-question" — câu hỏi quen thuộc của cha mẹ trong dấu ngoặc kép ("Làm thế nào để con mình giỏi giang và hạnh phúc?") → quoted-question variant
    - "diagnosis" — "Thu nhận thấy", "Thu đã làm việc với rất nhiều bậc phụ huynh" → soft-headline
    - "anaphora-chain" — chuỗi 3-4 vế LẶP cùng cấu trúc ("Một đứa trẻ lớn lên... / Một đứa trẻ nhìn thấy... / Một đứa trẻ được chứng kiến...") → anaphora-row (1 anaphora = 1 overlay nhóm 3-4 row)
    - "contrast-pair" — câu kép ĐỐI LẬP "[A tiêu cực] NHƯNG [B tích cực]" ("không có tình yêu thì dễ bị tổn thương / NHƯNG / không có sự dạy dỗ sẽ làm tổn thương người khác") → contrast-pair variant
    - "concession-list" — list-of-sai 3 cụm NHANH cùng từ khoá ("sai trong lựa chọn / sai trong tính toán / sai trong cách dạy dỗ") → concession-list variant (KHÁC action-count vì đây là negative dim)
    - "action-count" — list ĐÚNG "Một là / Hai là / Ba là / Và cuối cùng" → action-count (1 list = 1 overlay đa beat)
    - "imagery" — hình ảnh cụ thể chạm tim ("cong lưng dưới nắng", "đốm lửa", "tấm quà cái bánh", "dao cứa vào tim") → imagery-word (phrase 3-7 từ)
    - "imagery-chain" — 2-3 metaphor pair "X như Y" liên tiếp ("sâu như mạch ngầm / ấm như đốm lửa / nuôi con đi suốt cả cuộc đời") → imagery-card (cream base, KHÔNG dark vignette)
    - "forward-consequence" — "Để rồi sau 20 năm" / "Một ngày nào đó, nếu cha mẹ không còn" → forward-consequence
    - "brand-maxim" — câu châm ngôn chốt trước CTA ("Muốn biết tương lai một đứa trẻ thế nào, hãy nhìn cách bố đối xử với mẹ") → **quote-card MANDATORY 1x**
    - "book-mention" — "Hành trình khắc tên mình lên đá" / "cuốn sách của Thu" → book-callout MAX 1x
    - "cta-soft-end" — "Bạn nghĩ sao?" + "GEIN Academy" / "theo dõi Thu" / "lan toả" → cta-soft

  emphasis count target: 10-14 punches / 90s (ÍT hơn broker 12-20 — Thu cần breathing
  room cho cảm xúc thấm. KHÔNG đánh quá dày làm vỡ tông thiền).

  animation defaults:
    - easing: "power2.out" (KHÔNG `back.out(2.0)` — quá pop cho life-coach)
    - duration: 0.6-0.7s entry (chậm hơn broker 0.35s)
    - scale start: 0.96-1.0 (subtle, không pop từ 0.6)
    - y-drift: 8-12px fade-up (không zoom-pop mạnh)
    - hold: 2.0-2.5s for pain-quote / forward-consequence / quote-card (3-4s)

  zoom palette (replace broker 3-type):
    - soft-breath: peak 1.03, 4s in / 3s out — ambient continuous
    - subtle-emphasis: peak 1.05, 0.6s in / 0.4s out — major reveal (brand-maxim, book-callout)
    - hold-still: scale 1.0 → KHÔNG zoom — pain-quote moments cần tĩnh

  zoom hooks count: 6-10 / 90s (ÍT hơn broker 15-20 để giữ tông tĩnh).

  SFX subset (replace 14-file BĐS pool — use ONLY these 7 files):
    - "pop.wav" vol≤0.30 — soft-headline / imagery-word reveal (max 4/90s)
    - "ui-tap.wav" vol≤0.25 — anaphora-row stagger / action-count step (max 3/90s)
    - "camera-shutter.wav" vol≤0.30 — quote-card / book-callout reveal (max 2/90s)
    - "build-up.wav" vol≤0.30 — 2-3s lead vào quote-card hoặc forward-consequence (max 1/90s)
    - "film-burn.wav" vol≤0.25 — transition vào b-roll insert (max 2/90s)
    - "count.wav" vol≤0.25 — action-count list reveal "Một / Hai / Ba" (max 1/90s)
    - "digital-device.wav" vol≤0.25 — CTA chime cuối, MAX 1x last 3s

  SFX BANNED (KHÔNG copy, KHÔNG reference — sai tông brand Thu):
    - collapse.wav (BĐS pain agitation, quá aggressive)
    - giant-foot.m4a (authority entrance BĐS)
    - glitch.wav (break tông thiền)
    - cyber-1.wav, cyber-2.wav (tech vibe BĐS investor)
    - scifi-monitor.wav (dashboard reveal BĐS)

  SFX budget: max 5 cues / 90s (ít hơn broker 6 để giữ khoảng lặng cảm xúc).

  combo rules thu_life_coach:
    - "build-up" (2-3s tail) BẮT BUỘC kết thúc bằng "camera-shutter" / "ui-tap" / "pop"
      (KHÔNG cho phép kết hợp impact mạnh vì SFX banned).
    - "pain-quote" overlays đi với SILENCE (no SFX) — voiceover Thu carry cảm xúc.
    - "quoted-question" overlays đi với SILENCE hoặc `ui-tap.wav` vol 0.15 rất nhẹ (1 tap khi dấu " " hiện).
    - "forward-consequence" overlays đi với SILENCE hoặc film-burn vol ≤ 0.15.
    - "quote-card" (brand maxim) PAIR `camera-shutter.wav` vol 0.30 — như "khắc" câu châm ngôn.
    - "book-callout" PAIR `camera-shutter.wav` vol 0.30 + `build-up.wav` 2s tail trước đó.
    - "anaphora-row" stagger với `ui-tap.wav` vol 0.20 mỗi row (tap nhẹ, không to).
    - "contrast-pair" — vế trên SILENCE, chữ "NHƯNG" PAIR `pop.wav` vol 0.30 (punch giữa), vế dưới optional `ui-tap.wav` vol 0.20.
    - "concession-list" (list-of-sai) đi với SILENCE hoặc `ui-tap.wav` vol 0.15 cực nhẹ — KHÔNG count.wav (đây là negative dim, không phải action ĐÚNG).
    - "action-count" PAIR `count.wav` vol 0.25 background + `pop.wav` vol 0.25 mỗi step "Một / Hai / Ba".
    - "imagery-word" optional `pop.wav` vol 0.25 mỗi phrase (nếu sparse 1-2 imagery), HOẶC SILENCE nếu chuỗi dày 3+ imagery liên tiếp.
    - "imagery-card" (chuỗi metaphor "X như Y") đi với SILENCE — voiceover Thu + warmth tự carry, KHÔNG cần SFX. Optional `film-burn.wav` vol 0.15 transition vào.
    - CTA cuối có thể dùng `digital-device.wav` vol 0.25 chime ở 3s cuối.

  b-roll strategy (lighter than BĐS):
    - 1-3 full-screen insert / 90s, mỗi insert 2-4s.
    - Themes phù hợp brand Thu:
      * bìa sách "Hành trình khắc tên mình lên đá", trang sách open, tay viết
      * lớp học GEIN Academy, học viên ôm sách / khóc / ôm nhau
      * gia đình thật: cha mẹ - con cái, bữa cơm, mẹ cong lưng làm
      * thiên nhiên gợi hành trình: con đường, bãi đá, núi, ánh nắng xuyên
      * khoảnh khắc thiền / yoga / chữa lành
    - Apply ken-burns subtle 1.0→1.04 trong 3s + warm vignette + cream paper overlay 8% (match palette base).

  captions:
    - Bottom 280, TikTok pill black background 70% opacity.
    - Font Be Vietnam Pro 700, weight white #fdfaf3.
    - KHÔNG dùng accent màu trong caption (caption trung tính để overlay chính carry visual).

  ##### END AESTHETIC OVERRIDE #####

  Run Phase 3 packaging per your agent definition. Phần lớn workflow giống broker-creator
  (transcribe → outline → checkpoint → fan-out → scaffold → lint → preview), CHỈ KHÁC:
  emphasis taxonomy + variant names + SFX subset + palette + easing + breath ở trên.

  Sub-skill `mkt-hyperframe-luxury-realestate-9-16/SKILL.md` vẫn là technical reference
  cho overflow guard / fitText / GSAP timeline pattern / lint rules — nhưng visual tokens
  + emphasis taxonomy phải theo override này.

  Return Studio URL.
```

Phase 3 sub-agent: transcribe + outline + checkpoint #2 + fan-out N writers + scaffold concurrent với HeyGen render. Trước `npx hyperframes preview` (Step 9), sub-agent waits `source.mp4`.

Orchestrator chỉ relay user replies tới Phase 3 sub-agent (foreground) khi đang active.

### Step 4 — Hand off

```markdown
## Pipeline DONE — Thu / GEIN Academy preview ready
**Workspace:** workspace/content/YYYY-MM-DD/<slug>/
**Phase 1 (MiniMax speech-2.8-hd, speed 0.98):** voiceover.mp3 — <D>s, <S>MB
**Phase 2 (HeyGen):** source.mp4 — avatar <id>, <D>s, <S>MB
**Phase 3 (thu_life_coach):** <N> overlays (pain-quote + soft-headline + anaphora-row + action-count + imagery-word + forward-consequence + quote-card 1x + book-callout 1x + cta-soft), <M> b-roll inserts, <K> caption groups, <S>/5 SFX cues, <Z> zoom hooks
**Studio:** http://localhost:3002

Mở browser scrub timeline. Verify:
- Brand-maxim hiển thị quote-card full-screen 1x trước CTA ✓
- Book "Hành trình khắc tên mình lên đá" callout đúng moment (nếu có mention) ✓
- KHÔNG có SFX banned (collapse / giant-foot / cyber / glitch) ✓
- Caption KHÔNG dùng accent màu ✓
- Tông tổng thể từ tâm + thiền, không pop aggressive ✓

Nói `render` khi OK → MP4 1080×1920 30fps.
```

**Stop.** Không auto-render.

## Critical orchestration rules

1. **2 checkpoints, 1 orchestrator gate** — Orchestrator stop ở MP3. Overlays-outline + SFX + brand-maxim checkpoint do Phase 3. Render gate ở Studio.
2. **Path conventions inviolable** — `voiceover.mp3`, `source.mp4`.
3. **MiniMax key trong `.env`** (đã set ở key Thu — `MINIMAX_API_KEY`). KHÔNG hard-code trong call.
4. **HeyGen MCP only** — không curl `https://api.heygen.com/`.
5. **Speed default 0.98** — slow + trầm vì Thu nói ≈ 3.3 tiếng/giây. User có thể request 0.93-1.05.
6. **Script length hard cap 5000** — fail fast Step 0.
7. **MP3 duration ≤ 300s** — HeyGen cap.
8. **Aesthetic override mandatory** — Phase 3 spawn prompt PHẢI bao gồm block `##### AESTHETIC OVERRIDE — thu_life_coach #####`. Nếu sub-agent fallback về broker-creator (đỏ rực + scale-pop), STOP + re-spawn.
9. **SFX banned list inviolable** — `collapse.wav`, `giant-foot.m4a`, `glitch.wav`, `cyber-*.wav`, `scifi-monitor.wav` KHÔNG được dùng. User checkpoint #2 sẽ bắt nếu sub-agent vi phạm.
10. **Avatar full-frame always** — z-index 1, full 1080×1920, NO split-screen, NO PIP.
11. **Brand-maxim quote-card MANDATORY 1x** — mỗi video phải có 1 moment quote-card full-screen cho câu châm ngôn chốt trước CTA. Nếu script không có brand maxim rõ ràng → Phase 3 phải nhận diện 1 câu trong script làm quote-card, hoặc cảnh báo user "Script thiếu brand maxim — quay lại `/mkt-vn-short-video-script --profile thu-gein` viết lại beat 'Brand maxim'".
12. **Book mention max 1x** — `book-callout` chỉ trigger 1 lần / video.
13. **No fallback to ElevenLabs** — voice ElevenLabs default trong `.env` là brand Hoàng. KHÔNG match brand Thu → MiniMax fail → stop + ask user fix key, KHÔNG swap.
14. **Tự xưng "Thu" ngôi thứ ba** — Phase 3 KHÔNG được sinh overlay text dùng "tôi / em / mình / cô / chị" nhân danh người dẫn. Nếu transcript có (do user viết sai script) → cảnh báo user ở checkpoint #2.
15. **CTA luôn MỀM** — Phase 3 cta-soft variant KHÔNG được sinh text "đăng ký ngay" / "inbox để nhận" / "comment X để lấy tài liệu". Chỉ mời comment / lan toả / follow.

## Visual style — `thu_life_coach`

| Tiêu chí | Spec |
|---|---|
| Avatar layout | FULL FRAME 1080×1920 (object-fit cover, z-index 1, NO split-screen, NO PIP) |
| Visual driver | 10-14 text overlay / 90s (ít hơn broker 12-20) — chọn từ pool 13 variant: pain-quote / quoted-question / soft-headline / anaphora-row / contrast-pair / concession-list / action-count / imagery-word / imagery-card / forward-consequence / quote-card (MANDATORY 1x) / book-callout (≤1x) / cta-soft |
| Headline font | Be Vietnam Pro 800 (body punches) + Playfair Display 700 italic (imagery-word + quote-card + book-callout) |
| Color palette | Warm cream #f5ede1 / Deep forest #1a3d2f / Soft gold #c89b3c / Terracotta #c75c3c / Off-white #fdfaf3 |
| Stroke / shadow | Forest 4-5px (thinner than broker 8px) hoặc soft shadow `0 4px 24px rgba(26,61,47,0.25)` |
| Animation | `power2.out` 0.6-0.7s fade-up + scale 0.96→1.0 (subtle, KHÔNG `back.out` pop) |
| B-roll | Full-screen 1-3x / 90s, ken-burns 1.0→1.04 + warm vignette + cream paper overlay 8% |
| SFX kit | **7 file subset** — pop / ui-tap / camera-shutter / build-up / film-burn / count / digital-device. SFX `collapse` / `giant-foot` / `glitch` / `cyber-*` / `scifi-monitor` **BANNED** |
| SFX budget | Max 5 cues / 90s (ít hơn broker 6) |
| Zoom palette | soft-breath 1.03 ambient + subtle-emphasis 1.05 reveal + hold-still 1.0 emo-pause |
| Zoom hooks count | 6-10 / 90s (ít hơn broker 15-20) |
| Captions | bottom 280 TikTok pill black, font Be Vietnam Pro 700 white (no color accent) |
| Header label | `"GEIN ACADEMY"` |
| Footer handle | `"GEIN ACADEMY"` (user xác nhận handle thực nếu có) |
| Quote-card | MANDATORY 1x — Playfair italic off-white trên dark vignette 50%, full-screen 3-4s, slow zoom 1.0→1.04 |
| Sub-skill reference | `mkt-hyperframe-luxury-realestate-9-16` (technical only — overflow guard / fitText / GSAP / lint). Visual tokens override theo bảng này |

## Overlay variants — chi tiết

| Variant | Font | Color | Animation | Trigger |
|---|---|---|---|---|
| `pain-quote` | BVP 800 italic, 100-130px | Terracotta #c75c3c, soft shadow | Slow fade-in 0.7s, hold 2.5s | Câu nói đau ("Tôi không còn được con tôn trọng nữa", "Sao mình nuôi con bao nhiêu năm mà giờ nó không nhớ đến mình") |
| `quoted-question` | Playfair 700 italic, 100-130px, dấu " " visible to | Gold #c89b3c, neutral | Fade-up + 8px drift, 0.6s | Câu hỏi quen trong ngoặc kép ("Làm thế nào để con mình giỏi giang và hạnh phúc?") |
| `soft-headline` | BVP 800, 120-150px | Forest #1a3d2f, off-white #fdfaf3 stroke 4px | Fade-up + scale 0.98→1.0, 0.6s | Diagnosis: "Thu nhận thấy", "Thu đã làm việc với rất nhiều bậc phụ huynh" |
| `anaphora-row` | BVP 700, 80-100px stacked 3-4 row | Forest #1a3d2f, stagger 0.4s | Row-by-row fade-up | Chuỗi LẶP cùng cấu trúc ("Một đứa trẻ lớn lên... / Một đứa trẻ nhìn thấy... / Một đứa trẻ được chứng kiến...") |
| `contrast-pair` | Vế trên BVP 700 80-100px dim 0.55 + "NHƯNG" BVP 900 110px + Vế dưới BVP 800 90-110px gold underline | Forest dim + Terracotta + Forest đậm | Stagger 1.2s tổng: vế trên 0.5s → "NHƯNG" 0.4s sau → vế dưới 0.3s sau | Câu kép đối lập "[A tiêu cực] NHƯNG [B tích cực]" ("không có tình yêu thì dễ bị tổn thương / NHƯNG / không có sự dạy dỗ sẽ làm tổn thương người khác") |
| `concession-list` | BVP 700 dim 0.55, 70-90px stacked 3 cụm | Forest dim, KHÔNG gold | Stagger 0.4s per cụm | List-of-sai 3 cụm NHANH ("sai trong lựa chọn / sai trong tính toán / sai trong cách dạy dỗ con cái") |
| `action-count` | BVP 900 gold #c89b3c 140px number + BVP 600 forest 70-90px label | Gold + Forest | Count-up + label fade 0.6s | List ĐÚNG: "Một là... Hai là... Ba là... Và cuối cùng..." |
| `imagery-word` | Playfair Display 700 italic, 90-120px, 1-2 line | Gold #c89b3c, soft shadow | Fade-up + 12px drift, 0.7s | Phrase 3-7 từ: "cong lưng dưới nắng", "miếng ngon nhất trong bữa cơm", "dao cứa vào tim", "tấm quà cái bánh mang về biếu" |
| `imagery-card` | Playfair 700 italic 80-100px, 2-3 dòng metaphor pair | Gold #c89b3c trên cream base #f5ede1 (KHÔNG dark vignette) | Stagger 0.5s per dòng | Chuỗi metaphor "X như Y" ("sâu như mạch ngầm / ấm như đốm lửa / nuôi con đi suốt cả cuộc đời") |
| `forward-consequence` | BVP 800 italic, 110-140px | Terracotta #c75c3c | Slow zoom 1.0→1.03 trong 2.5s | "Để rồi sau 20 năm...", "Một ngày nào đó, nếu cha mẹ không còn..." |
| `quote-card` ★ | Playfair 700 italic, 80-110px multi-line | Off-white #fdfaf3 trên dark vignette 50% | Full-screen 3-4s, slow zoom 1.0→1.04 | **MANDATORY 1x** — brand maxim chốt trước CTA |
| `book-callout` | Playfair 700 italic, 90-110px multi-line | Off-white #fdfaf3 trên dark vignette 40% | Slow zoom 1.0→1.02 trong 2.5s | MAX 1x — mention "Hành trình khắc tên mình lên đá" |
| `cta-soft` | Optional "Bạn nghĩ sao?" Playfair italic 70px + BVP 700 forest 100px main + Playfair italic gold 60px "GEIN ACADEMY" | Forest + Gold + optional question italic | Fade-up + 8px drift stagger 0.7s | Cuối video — "Bạn nghĩ sao? / Hãy comment xuống video này / GEIN ACADEMY" |

## SFX library — thu subset

Source: `workspace/assets/01_Sound Bất động sản/` (folder chia sẻ với BĐS pipeline). Step 0 copy 7 file SUBSET vào `<workspace>/sfx/` với ASCII rename. **KHÔNG copy** files banned.

### Files allowed

| Source filename | Renamed (ASCII) | Vol cap | When-to-use |
|---|---|---|---|
| `Pop.WAV` | `pop.wav` | 0.30 | soft-headline / imagery-word reveal (max 4/90s) |
| `UI sound.WAV` | `ui-tap.wav` | 0.25 | anaphora-row stagger / action-count step (max 3/90s) |
| `Camera Shutter.WAV` | `camera-shutter.wav` | 0.30 | quote-card / book-callout reveal — "khắc" khoảnh khắc (max 2/90s) |
| `Build Up.WAV` | `build-up.wav` | 0.30 | 2-3s lead trước quote-card / forward-consequence (max 1/90s) |
| `Film Burn.WAV` | `film-burn.wav` | 0.25 | transition vào b-roll insert (max 2/90s) |
| `Unobtrusive count.WAV` | `count.wav` | 0.25 | action-count background count (max 1/90s) |
| `Digital device.WAV` | `digital-device.wav` | 0.25 | CTA chime cuối — soft notification (max 1/90s, last 3s only) |

### Files BANNED (không copy, không reference)

- `12120 collapsing building.wav` — pain agitation BĐS, sai tông Thu
- `Sound foot giant.m4a` — authority entrance BĐS
- `Glitch Sound.WAV` — break tông thiền
- `Cyber 11-1.WAV`, `Cyber 13-3.WAV`, `Sci-fi Monitor.WAV` — tech vibe BĐS

### Combo rules

- **Pain-quote = SILENCE.** Overlays variant `pain-quote` đi không SFX. Voiceover Thu carry cảm xúc.
- **Forward-consequence = SILENCE hoặc film-burn vol ≤ 0.15.**
- **Quote-card (brand maxim)** — PAIR `camera-shutter.wav` vol 0.30 — như "khắc" câu châm ngôn lên đá. Có thể thêm `build-up.wav` 2s tail trước đó.
- **Book-callout** — PAIR `camera-shutter.wav` vol 0.30 + optional `build-up.wav` 2s tail.
- **Anaphora-row** — stagger với `ui-tap.wav` vol 0.20 mỗi row (tap nhẹ, không to).
- **Action-count** — `count.wav` vol 0.25 background suốt list + `pop.wav` vol 0.25 mỗi step "Một / Hai / Ba".
- **CTA cuối** — `digital-device.wav` vol 0.25 chime ở 3s cuối (optional).
- **Total budget**: max 5 cues / 90s (ít hơn broker 6).

## Failure modes

| Symptom | Hành động |
|---|---|
| Script > 5000 | Stop, yêu cầu split semantic |
| Script dùng "tôi / em / mình / cô" tự xưng | Cảnh báo user — sai brand voice Thu. Yêu cầu chạy lại `/mkt-vn-short-video-script --profile thu-gein` hoặc sửa thủ công |
| Script thiếu brand-maxim chốt | Cảnh báo ở checkpoint #2 — Thu signature là 1 câu châm ngôn trước CTA. Yêu cầu user thêm hoặc Phase 3 đề xuất 1 câu từ transcript |
| MiniMax 401 | `MINIMAX_API_KEY` sai/hết credit. Check `.env`. **KHÔNG swap sang ElevenLabs** (voice mismatch brand) |
| MP3 > 300s | Stop, suggest chunking |
| TTS quá nhanh/cứng | User nói "chậm hơn" → re-run Phase 1 với `--speed 0.93` |
| TTS quá thiền/trễ | User nói "nhanh hơn" → re-run với `--speed 1.02` |
| HeyGen MCP not connected | `claude mcp list` verify |
| HeyGen render fail | Check credits qua `mcp__heygen__get_current_user` |
| HeyGen background agent timeout (> 15 min) | Kill HeyGen agent. Check credits / MCP. Re-spawn thủ công |
| Phase 3 sub-agent dùng SFX banned (vd `collapse.wav`) | User reject ở checkpoint #2. Orchestrator re-spawn Phase 3 với override emphasized hơn |
| Phase 3 sub-agent dùng broker-creator palette (đỏ rực + thick black stroke) | Sub-agent thiếu aesthetic override block. Re-spawn với block đầy đủ |
| Phase 3 KHÔNG có quote-card moment | Vi phạm rule #11 — re-spawn với note "MANDATORY quote-card 1x cho brand maxim" |
| B-roll filename Vietnamese | Stop, rename ASCII trước khi tiếp |
| SFX folder `workspace/assets/01_Sound Bất động sản/` thiếu | Stop, yêu cầu restore folder (chia sẻ với BĐS pipeline) |
| Avatar HeyGen output không match Thu | User verify ở Studio preview. Setup avatar Thu trong HeyGen + override `HEYGEN_AVATAR_LOOKS` qua `.env` hoặc per-call |
| Overlay tràn 2 cạnh canvas | Sub-skill template đã có `max-width: 960px` + `fitText()`. Nếu sub-agent skip, mở overlay-XX.html bổ sung |
| CTA Phase 3 sinh "đăng ký ngay" / "inbox để nhận" | Vi phạm rule #15 — reject, yêu cầu user sửa thành CTA mềm |

## Example — pipeline thu life-coach

User:
> Chạy video Thu từ `output/thu-gein/scripts/mot-dua-tre-khong-duoc-day-long-biet-on/script.txt`. B-roll: book-cover.jpg, mom-cooking.jpg, family-dinner.jpg

Script (đã sinh từ `/mkt-vn-short-video-script --profile thu-gein`):
```
Có một câu nói khiến Thu thấy rất đau lòng — đó là khi cha mẹ thở dài "Sao mình nuôi con bao nhiêu năm, mà giờ nó không nhớ đến mình".

Thu đã làm việc với rất nhiều bậc phụ huynh, và Thu nhận thấy điều này — một đứa trẻ không được dạy lòng biết ơn, lớn lên sẽ không biết trân trọng. Một đứa trẻ không thấy cha mẹ vất vả, lớn lên sẽ thấy mọi thứ là đương nhiên. Một đứa trẻ chỉ biết nhận, lớn lên sẽ quên cách cho đi.

Vậy cha mẹ phải làm gì? Một là, để con thấy cha mẹ mệt — đừng giấu. Hai là, để con tham gia bữa cơm, không chỉ ăn. Ba là, dạy con nói lời cảm ơn từng ngày. Và cuối cùng — đọc cho con nghe những câu chuyện về sự biết ơn.

Vì muốn biết tương lai một đứa trẻ thế nào, hãy nhìn cách mà đứa trẻ đó được dạy cho đi.

Hãy gửi video này đến những bậc cha mẹ mà bạn yêu thương. Theo dõi GEIN Academy để cùng Thu đi tiếp hành trình.
```

Pipeline:
1. **Step 0** — detect brand Thu. Slug `thu-mot-dua-tre-khong-duoc-day-long-biet-on`. Validate 3 b-roll ASCII. Copy 7 SFX subset. Báo user OK.
2. **Step 1** — MiniMax (`speech-2.8-hd`, speed 0.98) → `voiceover.mp3` ~75s.
3. **Step 2 — CHECKPOINT #1** — user `OK`.
4. **Step 3 PARALLEL**:
   - HeyGen runner (background) lip-sync (~3-10 min)
   - Phase 3 packager (foreground) với aesthetic override block:
     - Transcribe → identify ~12 emphasis:
       * "Sao mình nuôi con bao nhiêu năm" — pain-quote
       * "Thu nhận thấy" — soft-headline
       * "Một đứa trẻ không... / Một đứa trẻ không... / Một đứa trẻ chỉ..." — anaphora-row 3 vế
       * "Một là / Hai là / Ba là / Và cuối cùng" — action-count
       * "cha mẹ mệt", "bữa cơm" — imagery-word
       * "tương lai một đứa trẻ" — soft-headline
       * "Muốn biết tương lai một đứa trẻ thế nào, hãy nhìn cách mà đứa trẻ đó được dạy cho đi" — **quote-card MANDATORY**
       * "GEIN Academy" + "theo dõi Thu" — cta-soft
     - Checkpoint #2 outline + 5 SFX cues (film-burn intro, ui-tap @ anaphora x3 vol 0.20, count.wav @ action-count, pop @ action-count steps, build-up + camera-shutter @ quote-card, digital-device @ CTA)
     - User `OK` → fan-out 12 overlay writers + 3 b-roll inserts (mom-cooking @ "cha mẹ mệt", family-dinner @ "bữa cơm", book-cover @ CTA outro)
     - Scaffold → lint
   - Phase 3 wait `source.mp4` → preview
5. **Step 4** — Studio URL. User verify quote-card hiển thị câu châm ngôn full-screen. Nói `render` → final MP4.

Total ~5-6 phút wall-clock.

## What this skill does NOT do

- KHÔNG viết script (dùng `/mkt-vn-short-video-script --profile thu-gein` trước)
- KHÔNG handle script > 5000 ký tự (split semantic)
- KHÔNG chunk MP3 (single-clip; > 300s → split)
- KHÔNG auto-render MP4 (user gate ở Studio)
- KHÔNG override hard constraints của sub-skill (avatar allowlist, MCP-only, font available)
- KHÔNG fallback sang ElevenLabs nếu MiniMax fail (brand voice mismatch — ElevenLabs default là Hoàng)
- KHÔNG dùng SFX aggressive (`collapse` / `giant-foot` / `glitch` / `cyber-*` / `scifi-monitor` BANNED)
- KHÔNG cho phép tự xưng "tôi / em / mình / cô" trong overlay text (sai brand)
- KHÔNG sinh CTA cứng ("đăng ký ngay" / "inbox để nhận tài liệu" — vi phạm rule #15)

## References

- **Script writer** — `.claude/skills/mkt-vn-short-video-script/SKILL.md` (gọi qua `/mkt-vn-short-video-script --profile thu-gein`, sinh `script.txt` + `brief.md` theo brand voice Thu, 7 công thức)
- **TTS** — `.claude/skills/mkt-video-script-to-mp3/SKILL.md` (MiniMax `speech-2.8-hd`, key Thu trong `.env`)
- **HeyGen** — `.claude/skills/heygen-mp3-to-mp4/SKILL.md`
- **HF technical base** — `.claude/skills/mkt-hyperframe-luxury-realestate-9-16/SKILL.md` (overflow guard / fitText / GSAP / lint — visual tokens override theo skill này)
- **Phase 3 sub-agent** — `.claude/agents/mkt-full-video-phase3-packager.md` (orchestrator PHẢI pass aesthetic override block trong prompt)
- **Sibling orchestrator BĐS** — `.claude/skills/mkt-full-video-with-11-hyperframe-heygen/SKILL.md` (broker-creator — for comparison, NOT for Thu)
- **B-roll image gen (optional Step 2.5)** — `.claude/skills/mkt-kie-broll-image-generator/SKILL.md` (KIE AI Nano Banana 2 / GPT Image 2, profile `thu-gein` cream-paper warm editorial — invoke khi user chưa có asset b-roll)
- **Brand voice Thu** — `.claude/skills/mkt-vn-short-video-script/profiles/thu-gein/brand-voice.md` (chi tiết xưng hô, từ cấm, signature, anaphora, brand maxim)
- **SFX assets** — `workspace/assets/01_Sound Bất động sản/` (chia sẻ với BĐS, Thu dùng subset 7 file)
