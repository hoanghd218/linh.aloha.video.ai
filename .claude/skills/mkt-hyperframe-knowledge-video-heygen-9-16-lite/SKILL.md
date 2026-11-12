---
name: mkt-hyperframe-knowledge-video-heygen-9-16-lite
description: Video kiến thức / tin tức / review dự án BĐS 9:16 (1080×1920) với HeyGen avatar CHỈ XUẤT HIỆN 30-40% thời lượng (hook + re-hook + CTA), tiết kiệm ~60-65% credit HeyGen — phần còn lại là scene motion-graphic HyperFrames full-canvas + PIP avatar tĩnh 0 credit + caption từng từ. Hỗ trợ ảnh/video trám bỏ vào media/ (tự phân tích, tự gán beat). Profile `bds-broker` — tự lấy ảnh dự án từ workspace/data/<dự án>/, thẩm mỹ broker-creator, 9 scene pattern BĐS. Dùng khi Hoàng nói "video kiến thức 9:16 tiết kiệm credit", "heygen lite", "avatar xuất hiện một phần", "giảm chi phí heygen", "video review dự án <tên>", "lấy ảnh dự án <tên> làm video". Không dùng khi cần avatar dẫn suốt video (→ mkt-full-video-with-11-hyperframe-heygen), đã có MP4 quay sẵn (→ mkt-hyperframe-talking-head-video), muốn chữ punch trên avatar full-frame (→ mkt-hyperframe-luxury-realestate-9-16), hay video 16:9.
argument-hint: "[slug] [--profile bds-broker] [--min-ratio 0.30 --max-ratio 0.42]"
---

# HyperFrame Knowledge Video LITE — HeyGen 30-40% (9:16 Avatar Windows)

Phiên bản: v1.2 — 2026-11-11

Video kiến thức 9:16 dọc (1080×1920): HeyGen avatar full-screen **chỉ trong các window** — hook mở đầu, 1-2 re-hook giữa video, CTA cuối (tổng 30-40% thời lượng) — phần còn lại là scene motion-graphic full-canvas + PIP tĩnh + captions. Credit HeyGen chỉ tốn cho ~35% audio. Render bằng `npx hyperframes render`.

**AUTOPILOT sau hai cổng credit:** khi Hoàng đã duyệt [Cổng credit](#cổng-credit--hỏi-trước-khi-tốn-tiền) A và B, chạy 1 mạch tới MP4, KHÔNG dừng hỏi thêm, KHÔNG mở preview Studio. Thiếu info → tự chọn default. Render `-q standard` xong báo absolute path MP4 + ratio avatar cho user. Hai cổng credit là ngoại lệ duy nhất của autopilot.

## Khi nào dùng / không dùng

- Video knowledge/news **9:16 dọc** có AI avatar nhưng **cần tiết kiệm credit HeyGen** (default cho hầu hết case).
- **Video review dự án BĐS 9:16** → thêm `--profile bds-broker` (xem Profiles).
- User có **ảnh/video trám** muốn chèn vào video (bỏ vào `media/`).
- User nói "avatar 50%" hay ratio khác → vẫn skill này, chỉnh `--min-ratio/--max-ratio`.

KHÔNG dùng khi:
- User muốn avatar dẫn **suốt video** (HeyGen tính credit trọn thời lượng, avatar full-frame + chữ punch) → `mkt-full-video-with-11-hyperframe-heygen`.
- Đã có MP4 quay sẵn → `mkt-hyperframe-talking-head-video`.
- Muốn chữ punch nảy lên trên avatar full-frame từ `source.mp4` → `mkt-hyperframe-luxury-realestate-9-16`.
- 16:9 ngang → `mkt-full-video-with-11-hyperframe-heygen-16-9` hoặc `mkt-hyperframe-talking-head-video-16-9`.
- Không cần avatar → chưa có skill riêng trong repo.

## Đầu vào → Đầu ra

| Vào | Ra (trong `OUT=workspace/content/YYYY-MM-DD/<slug>/`) |
|---|---|
| `script.md` (hook → 3-7 beat → CTA, ~60-120s); BĐS: tên dự án | `audio/full.mp3` + `audio/alignment.json` (TTS) |
| `beats-spec.json` (avatar: true cho hook / re-hook / CTA) | `beats.json` → `audio/avatar.mp3` + `avatar-windows.json` |
| `media/` ảnh / video trám (tuỳ chọn); BĐS: ảnh từ `workspace/data/<dự án>/` | `media/asset-map.json`, `media-manifest.json`, `broll-clips/` |
| `avatar.mp3` → HeyGen | `avatar_heygen_raw.mp4` → `avatar-clips/clip-NN.mp4` + `pip-still.png` |
| Transcript của `full.mp3` | `caption-groups.json`, `scenes/scene-NN-slug.html` (1080×1920), `index.html`, `<slug>.mp4` |

## Cổng credit — hỏi trước khi tốn tiền

Hỏi kèm phương án a / b / c, chờ Hoàng trả lời. Không bịa số tiền / credit — thiếu thì ghi "chưa có" (xem dashboard nhà cung cấp).

| Cổng | Trước bước | Báo cho Hoàng | Phương án |
|---|---|---|---|
| **A — TTS** | Step 1-4 (gọi ElevenLabs / MiniMax) | số ký tự của `script.md`, provider, voice, độ dài ước tính | a) chạy · b) sửa script rồi hỏi lại · c) đổi provider |
| **B — HeyGen** | Step 5 (gọi HeyGen) | `audio/avatar.mp3` dài N s, tỉ lệ avatar r (đã qua guard 0.30–0.42), avatar look sẽ dùng; xác nhận KHÔNG gửi `full.mp3` | a) chạy · b) chẻ lại window / đổi ratio · c) dừng |

- Hoàng đã nói rõ trong yêu cầu hiện tại "chạy luôn / autopilot / không cần hỏi" → coi cả hai cổng đã duyệt, vẫn in thông số trước khi gọi.
- Đã có `audio/full.mp3`, `avatar-clips/` hoặc MP4 từ lần chạy trước → không ghi đè khi chưa xác nhận: hỏi a) dùng lại (Resume mode) · b) làm bản mới · c) ghi đè.
- Không đăng bài. Khoá API chỉ đọc từ `.env` (không in giá trị, không chép sang tệp khác).

## Profiles

| Profile | Khi nào | File override |
|---|---|---|
| `knowledge` (mặc định) | Video kiến thức / tin tức | `references/design-system.md`, `references/scene-patterns.md`, `references/sfx-layer.md` |
| `bds-broker` | **Video BĐS**: review dự án, mở bán, chính sách, so sánh | `profiles/bds-broker/design-system.md`, `profiles/bds-broker/scene-patterns.md`, `profiles/bds-broker/sfx-map.md`, `profiles/bds-broker/beats-template.json` |

Profile CHỈ đổi ngôn ngữ thị giác + nguồn asset. Cơ chế avatar windows, cut/split, captions, PIP, validate, render giữ NGUYÊN.

Kích hoạt `bds-broker` khi: user nhắc tên một dự án BĐS, hoặc nói "video bđs / review dự án / mở bán / bảng giá / mặt bằng". Khi active, chạy thêm **Step 0.3 → 0.7** bên dưới và đọc `references/bds-asset-library.md`.

## So với avatar 100% thời lượng

| Aspect | Avatar 100% (HeyGen nhận cả full.mp3) | LITE (skill này) |
|---|---|---|
| HeyGen input | full.mp3 (60-120s) | **avatar.mp3 (~30-40%)** — tiết kiệm ~60-65% credit |
| Layout | FULL↔SPLIT height tween + divider | **Avatar window ↔ scene full-canvas**, không split |
| Scene canvas | 1080×960 top half | **1080×1920 full-canvas** |
| Audio spine | `<audio>` từ source.mp4 | **audio/full.mp3** (TTS gốc) |
| Video HeyGen | 1 file source.mp4 | **N clips** avatar-clips/clip-NN.mp4 |
| Presence khi vắng avatar | — | **PIP tĩnh** 180px top-right (0 credit) |
| Media trám user cung cấp | — | **Có** — tự phân tích + tự gán beat |
| TOTAL | ffprobe source.mp4 | **ffprobe audio/full.mp3** |

## HARD RULES (NON-NEGOTIABLE)

1. **Fan out parallel LLM sub-agents** — 1 sub-agent / scene. KHÔNG dùng Python template generator.
2. **Scene HTML = standalone full HTML doc 1080×1920 FULL-CANVAS**, load qua `data-composition-src`. Root `<div data-composition-id="scene-NN-slug" data-width="1080" data-height="1920">`, CSS scoped.
3. **GSAP only**, seeded mulberry32 PRNG (seed 0x5cNN), `window.__timelines[...] = gsap.timeline({paused:true})`, entrances `gsap.fromTo()`, no exit anims, scene KHÔNG load gsap riêng.
4. **HeyGen CHỈ nhận `audio/avatar.mp3`** (output `cut_avatar_audio.py`) — gửi nhầm `full.mp3` là mất toàn bộ khoản tiết kiệm. 1 lần gọi duy nhất (1 avatar look nhất quán).
5. **Budget guard 0.30–0.42**: `cut_avatar_audio.py` fail sớm nếu ratio avatar ngoài khoảng — sửa window TRƯỚC khi tốn credit. User yêu cầu ratio khác → truyền `--min-ratio/--max-ratio`.
6. **TOTAL + mọi data-duration overlay = ffprobe `audio/full.mp3`** — KHÔNG phải video HeyGen. Avatar mount `data-duration` = ffprobe từng clip.
6b. **Vị trí cắt clip phải ĐO, không được đoán.** `split_avatar_video.sh` luôn chạy `verify_avatar_sync.py` trước: nó dò từng chunk `avatar.mp3` trong audio HeyGen trả về (tương quan envelope) để biết HeyGen dịch/padding bao nhiêu, và đo cả **drift nội bộ** (miệng khớp đầu clip nhưng lệch dần về cuối — một điểm cắt không sửa được). Cắt theo offset đã gửi (hoặc rescale theo tỉ lệ duration) là sai khi HeyGen padding — test cho thấy lệch tới 360ms, quá ngưỡng cảm nhận ~80ms. Xử lý theo status: `stretched` (exit 4) → split tự dừng, chạy lại Phase 2 hoặc chẻ window dài thành 2 beat ngắn; `low-confidence` (exit 3) → dừng kiểm tra file, đừng render.
7. **3 giây đầu LUÔN full face** — window hook start=0, scene mount đầu tiên không start < 4.0s.
8. **Ranh giới avatar↔scene**: mount đầu segment start = `window.end − 0.25` (overlap che seam), mount cuối segment end = ĐÚNG `nextWindow.start`; flash + SFX tại MỌI ranh giới. Chi tiết: `references/avatar-windows-layout.md`.
9. **Scene full-canvas vùng cấm**: không content dưới `y≈1600` (captions), không content hộp `x>780 && y<320` (PIP). Hero 84-120px. Scene phủ cả beat (dài) → 2-3 nhịp nội dung.
10. **Root `#root` PHẢI có `data-duration`** + mọi loop (breathing avatar/PIP, bokeh) repeat hữu hạn tính từ TOTAL — loop dư kéo dài MP4.
11. **Captions mount CUỐI, track 60, z-index 100**, `.caption-stage` bottom:160 CỐ ĐỊNH, timing từ word-level transcript của **full.mp3**, KHÔNG hand-edit.
12. **Media trám**: chỉ định của user LUÔN thắng auto-match; auto-match dưới ngưỡng 0.5 → bỏ qua có log; mỗi asset 1 lần, mỗi beat ≤2 asset, video thắng ảnh; b-roll LUÔN muted + re-encode qua `prep_broll.sh`. Chi tiết: `references/media-broll.md`.
13. **Sub-agents KHÔNG chạy `npx hyperframes`** — orchestrator validate tập trung.
14. **PIP tĩnh**: QA frame bằng Read ảnh (mắt mở, miệng đóng) trước khi wire; GSAP toggle theo segment + hard-kill `tl.set(opacity:0)`.
15. **Whisper LUÔN `--language vi`** cho audio Việt.

### Bổ sung khi `--profile bds-broker`

16. **Ảnh dự án PHẢI đi qua `fetch_project_assets.py`** — không bao giờ trỏ `<img src>` thẳng vào `workspace/data/`. Tên gốc có dấu tiếng Việt, khoảng trắng, và có case thừa space cuối tên (`Ảnh phối cảnh tổng thể dự án .jpg`) → 404 lúc render. Chỉ dùng tên `ascii` trong `media/asset-map.json`.
17. **`mediaPolicy: "none"` là tuyệt đối** — beat giá / chính sách / CTA / khái niệm trừu tượng / chuyện quá khứ KHÔNG được chèn ảnh dự án. Thiếu ảnh hợp ngữ cảnh thì để motion-graphic gánh; **giảm chỉ tiêu b-roll, không nhét ảnh lạc đề**. Bảng đầy đủ: `references/bds-asset-library.md` §5.
18. **Ảnh `illustrative: true` phải có chip "Ảnh minh họa"** trong scene (spec ở `profiles/bds-broker/design-system.md`).
19. **Mặt bằng KHÔNG show nguyên bản** — bản vẽ co về 1080px là chữ không đọc nổi. Luôn zoom vào cụm căn đang nói (pattern `floorplan-zoom`), prompt sub-agent phải ghi rõ vùng zoom.
20. **Số liệu lấy từ `_kien-thuc-du-an/` của dự án**, không lấy từ trí nhớ. Giá chưa chốt phải nói rõ "dự kiến / tin đồn". Không bịa giá / diện tích / tiến độ / pháp lý — thiếu thì ghi "chưa có".

Luật chung: đường dẫn tương đối từ gốc repo (không đường dẫn tuyệt đối theo máy); lệnh chạy được trên Windows lẫn macOS (`python3` ↔ `python`; `.sh` chạy qua Git Bash / WSL trên Windows); báo xong = đường dẫn tệp + số đo thật (ffprobe), không nói "xong" khi chưa kiểm. Brand Linh Aloha (xưng "em", gọi "anh chị", câu "Aloha anh chị, em Linh đây", CTA): lấy từ `mkt-linh-aloha-bds-video-script`, không chép lại. Anti-patterns chung: `references/anti-patterns.md`.

## Pipeline overview

```
Phase 0   ── (bds-broker) resolve_project → build_asset_catalog → fetch_project_assets
                                                         ► media/*.jpg (ASCII) + media/asset-map.json
Phase 1a ── [Cổng A] TTS (tts.py | tts_minimax.py) ──────► audio/full.mp3 + alignment.json
         ── beats-spec.json (avatar:true cho hook/re-hook/CTA) → map_beats.py → beats.json
         ── cut_avatar_audio.py ─────────────────────────► audio/avatar.mp3 + avatar-windows.json
Phase 1b ── (nếu có media/) phân tích + gán beat ────────► media-manifest.json + broll-clips/
Phase 2  ── [Cổng B] heygen-mp3-to-mp4 (avatar.mp3, background) ──► avatar_heygen_raw.mp4
         ── split_avatar_video.sh ───────────────────────► avatar-clips/clip-NN.mp4 + pip-still.png
Phase 3  ── design.md + master scaffold (song song Phase 2)
         ── transcribe audio/full.mp3 + clean + captions
         ── fan out N sub-agents ────────────────────────► scenes/scene-N.html (1080×1920)
         ── wire master: avatar clips + scene mounts + b-roll + PIP + SFX + captions
         ── lint + inspect + draft render + frame QA
         ── npx hyperframes render -q standard ──────────► <slug>.mp4 (1080×1920)
```

**Resume mode:** `audio/full.mp3` + `avatar-clips/` đủ clip khớp `avatar-windows.json` → skip Phase 1a+2 (không qua cổng A, B), vào thẳng Phase 3.

## Step 0 — Scaffold project

```bash
SKILL=.claude/skills/mkt-hyperframe-knowledge-video-heygen-9-16-lite
OUT=workspace/content/$(date +%Y-%m-%d)/<slug>
mkdir -p $OUT/audio $OUT/scenes $OUT/assets/sfx $OUT/compositions $OUT/avatar-clips $OUT/broll-clips
cp $SKILL/assets/templates/hyperframes.json $OUT/
cp $SKILL/assets/templates/package.json $OUT/          # sửa "name" → slug
cp $SKILL/assets/templates/master-index.reference.html $OUT/index.html   # replace markers [1]..[9]
cp $SKILL/assets/templates/captions.html.template $OUT/compositions/captions.html
# SFX: copy từ mkt-hyperframe-talking-head-video/assets/sfx/ (6 file chuẩn)
#      profile bds-broker → rename ASCII lowercase theo profiles/bds-broker/sfx-map.md
# Media user đưa (nếu có): để nguyên/copy vào $OUT/media/
```

(Các lệnh bên dưới viết `$SKILL` / `$OUT` như trên.)

## Step 0.3-0.7 — Lấy ảnh dự án (CHỈ profile `bds-broker`)

Chạy TRƯỚC TTS. Đọc `references/bds-asset-library.md` để biết luật chọn ảnh.

```bash
# 0.3 — tên dự án (có dấu / không dấu / alias / slug) → folder trong workspace/data/
python3 $SKILL/scripts/resolve_project.py --project "Cao xà lá"
#      exit 2 = không thấy (in candidates) · exit 3 = mơ hồ → gọi bằng slug
#      python3 $SKILL/scripts/resolve_project.py --list   # xem dự án đang bán

# 0.5 — catalog (cache trong <dự án>/_assets/, dùng chung mọi skill; chạy 1 lần/dự án)
python3 $SKILL/scripts/build_asset_catalog.py --project "Cao xà lá" --summary

# 0.7 — copy vào media/ theo CHỈ ĐỊNH của user
python3 $SKILL/scripts/fetch_project_assets.py --project "Cao xà lá" --out $OUT/media \
    --files "thác nước về đêm,facade,mặt bằng tiện ích"      # user chỉ định — THẮNG mọi auto
#   hoặc --include exterior-night,aerial-location,amenity     # theo nhóm
#   hoặc không truyền gì → auto rank (hookRank → starred → có mô tả → độ phân giải), --max 12
```

Sau 0.7: đọc `media/asset-map.json`, kiểm 3 điều — (a) `notFound` rỗng (user chỉ định gì đó không có → hỏi lại, đừng im lặng thay ảnh khác); (b) ảnh quan trọng còn `needsDescription` trong catalog → Read ảnh rồi patch mô tả ngược vào catalog với `"source": "orchestrator"`; (c) đủ category cho các beat `mediaPolicy: allow` đã lên.

Beat template có sẵn: `profiles/bds-broker/beats-template.json` (copy → `$OUT/beats-spec.json`, thay `anchor` bằng từ thật trong script). Script BĐS: dùng skill `mkt-linh-aloha-bds-video-script` (brand voice Linh Aloha, số liệu lấy từ `_kien-thuc-du-an/` cùng dự án); video kiến thức thường: `mkt-vn-short-video-script`.

## Step 1-4 — Script, beats, TTS  ·  [Cổng A]

- Script: hook mạnh → 3-7 beats → CTA. Câu ngắn, KHÔNG em dash. ~60-120s.
  **Đoạn AVATAR (hook / re-hook / CTA) viết kiểu nói thẳng camera; đoạn SCENE viết dẫn chuyện có số liệu/ví dụ** (chất liệu visual cho scene).
- `beats-spec.json`: mỗi beat `{id, slug, pattern, anchor[]}` + **`"avatar": true`** cho hook, re-hook, CTA (thêm `"role": "hook"|"rehook"|"cta"` cho rõ). Video ≤60s: 1 re-hook; >75s: 2 re-hook, đặt tại câu chuyển mạnh nhất vùng 40-60%.
- **Qua Cổng A rồi mới gọi TTS.** TTS provider: ElevenLabs mặc định | MiniMax (`TTS_PROVIDER=minimax` hoặc user nói):
  `python3 $SKILL/scripts/tts.py --script script.md --out-audio audio/full.mp3 --out-alignment audio/alignment.json`
  (MiniMax: `tts_minimax.py ... --lang vi`, tự Whisper lại để dựng alignment — anchor phải là từ thường).
- `tts.py` / `tts_minimax.py` chỉ đọc biến môi trường (không tự mở `.env`): nạp biến từ `.env` vào shell trước khi chạy (không in giá trị). Giọng ElevenLabs lấy từ `ELEVENLABS_VOICE_ID` (`.env.example`: giọng thương hiệu của Hoàng) — nếu không đặt, script rơi về giọng Adam mặc định, KHÁC giọng thương hiệu. MiniMax cần `MINIMAX_API_KEY`, `MINIMAX_GROUP_ID`, `MINIMAX_VOICE_ID` (`.env.example` chưa có các dòng này; tham chiếu giọng/model: `references/elevenlabs-v3.md`).
- `python3 $SKILL/scripts/map_beats.py --project $OUT` → beats.json (carry cờ avatar/role).

## Step 4.5 — Cắt avatar windows

```bash
python3 $SKILL/scripts/cut_avatar_audio.py --project $OUT
# → audio/avatar.mp3 + avatar-windows.json; fail nếu ratio ngoài 0.30-0.42 (kèm gợi ý sửa)
# User yêu cầu ratio khác: --min-ratio 0.45 --max-ratio 0.55
```

## Step 4.7 — Phase 1b: Media trám (nếu có)

Có `media/` hoặc user đưa asset → theo `references/media-broll.md`: `prep_broll.sh probe/frames` → Read ảnh/frame mô tả nội dung → gán beat (chỉ định user thắng; auto-match có ngưỡng) → `media-manifest.json`; video: `prep_broll.sh trim` → `broll-clips/`. Không có media → skip.

**Profile `bds-broker`:** ảnh đã có mô tả sẵn trong `media/asset-map.json` (từ Step 0.7) → BỎ bước Read từng ảnh, gán beat thẳng từ `description` + `useFor` + `category`, tôn trọng `mediaPolicy` của beat (`none` → beat đó không nhận ảnh, kể cả khi điểm match cao). Carry `illustrative` + `disclaimer` + `portrait9x16` sang `media-manifest.json` để sub-agent biết phải gắn chip "Ảnh minh họa" và dùng biến thể nào.

## Step 5 — Phase 2: HeyGen (background) + split  ·  [Cổng B]

**Qua Cổng B rồi mới gọi HeyGen.** Delegate skill `heygen-mp3-to-mp4` (skill chủ: upload qua `heygen-mp3-to-mp4/scripts/upload_asset.py`, tạo video, poll, tải) qua sub-agent `run_in_background: true`, **INPUT = `audio/avatar.mp3`**, portrait 720×1280. Orchestrator poll `mcp__heygen__get_video` TRỰC TIẾP (audio ngắn → ~4-6 phút). Download xong:

```bash
bash $SKILL/scripts/split_avatar_video.sh $OUT/avatar_heygen_raw.mp4 $OUT
# tự chạy verify_avatar_sync.py trước → cut-plan.json (offset ĐO ĐƯỢC + confidence)
# → avatar-clips/clip-NN.mp4 (cắt theo offset đo, re-encoded) + assets/pip-still.png (QA bằng Read)
```

Đọc bảng lag script in ra: `corr` gần 1.0 = định vị chắc chắn; `lag` là lượng HeyGen đã dịch nội dung (đã được tự bù). Nếu có dòng `low-confidence` → file raw không phải lip-sync của `avatar.mp3` này, hoặc audio bị lỗi — dừng, đừng render.

Trong lúc chờ: placeholder clips per window (xem `references/heygen-integration.md`) để lint/draft sớm.

## Step 6 — Captions

```bash
cd $OUT && npx hyperframes transcribe audio/full.mp3 --model medium --language vi
python3 $SKILL/scripts/clean_transcript.py transcript.json          # → caption-groups.json
python3 $SKILL/scripts/fix_caption_typos.py caption-groups.json script.txt
python3 $SKILL/scripts/inject_captions.py compositions/captions.html caption-groups.json
```

(Ba script + `captions.html.template` này giống hệt bản ở `mkt-hyperframe-talking-head-video` — skill chủ là bên đó; thêm lỗi Whisper mới thì sửa ở skill chủ rồi chép sang đây.)

## Step 7 — Master wiring

Từ template `master-index.reference.html`, replace markers [1]..[9]:
- [2]+[8]: TOTAL = **ffprobe audio/full.mp3**
- [4]: avatar clips từ `avatar-windows.json` — `data-start = window.start`, `data-duration = ffprobe clip`, track 10+
- [5]: scene mounts full-canvas track 40+ (đầu segment overlap −0.25s, cuối segment end đúng nextWindow.start); [5b]: b-roll mounts track 45+ từ media-manifest
- [6]: `WINDOWS[]`; [7]: `MOUNTS[]` + `BROLLS[]`; [3]: SFX tại mọi ranh giới + beat moments (`references/sfx-layer.md`); [9]: PIP img

Geometry + timing rules: `references/avatar-windows-layout.md` (ĐỌC khi wire).

## Step 8 — Fan out sub-agents (scene HTML 1080×1920)

Spawn N sub-agents trong **1 message**. Prompt template (per scene):

```
Author HyperFrames sub-composition for scene-NN (FULL-CANVAS 1080×1920, LITE pipeline).
# Files
- OUTPUT: <abs>/scenes/scene-NN-slug.html
- REFERENCE (READ FIRST): $SKILL/assets/templates/scene-reference-full.html
- DESIGN: <abs>/design.md
# Context
- Composition id: scene-NN-slug · Duration: <beat duration> s (phủ CẢ beat)
- Avatar KHÔNG trên màn hình — chỉ PIP tĩnh nhỏ của master (master lo).
# Hard rules: (copy 15 rules từ SKILL.md, nhấn: hero 84-120px, vùng cấm y>1600
  và hộp x>780&&y<320, seed 0x5cNN, bokeh 50-70 dots, 2-3 nhịp nội dung,
  KHÔNG chạy npx hyperframes)
# Media (nếu beat có): <abs path ảnh + mô tả + usage pattern>; b-roll che <t1>-<t2>s
  — không đặt moment quan trọng vào khoảng đó. <img> LUÔN có onerror ẩn container.
# Content brief: <beat summary + voiceover đoạn đó + accent colors>
# (bds-broker) DESIGN + PATTERNS đọc từ profiles/bds-broker/design-system.md
  + profiles/bds-broker/scene-patterns.md (KHÔNG dùng references/design-system.md).
  Pattern chỉ định: <pattern>. Ảnh: <ascii path + mô tả>; illustrative → BẮT BUỘC chip
  "Ảnh minh họa". Nếu pattern là floorplan-zoom: vùng cần zoom = <mô tả cụm căn / góc ảnh>,
  KHÔNG show nguyên bản vẽ. fitText() bắt buộc cho mọi chữ ≥ 90px.
# Process: Read reference → design.md → write → self-review → report <150 words,
  Status: DONE/DONE_WITH_CONCERNS/BLOCKED
```

## Step 9 — Validate (orchestrator, central)

```bash
cd $OUT && npx hyperframes lint                  # 0 errors; google_fonts warning OK
cd $OUT && npx hyperframes inspect --samples 14
npx hyperframes render -q draft -o _draft.mp4
for t in <sample times>; do ffmpeg -y -ss $t -i _draft.mp4 -frames:v 1 qa_$t.png; done
```

Frame QA bắt buộc soi:
- `window.start + 1s` mỗi window: avatar hiện, miệng khớp caption
- Giữa mỗi segment: PIP đúng góc không đè content, captions hiển thị
- ±0.3s quanh mỗi ranh giới: không hở frame đen/đứng hình
- 3s đầu full face; scene không có content vào vùng cấm

## Step 10-11 — Render (AUTOPILOT)

```bash
cd $OUT && rm -f _draft.mp4 qa_*.png && npx hyperframes render -q standard -o <slug>.mp4
ffprobe ...  # verify duration == TOTAL(full.mp3) ±0.1s và 1080×1920
```

Báo user: absolute path MP4 + size + **ratio avatar** (từ avatar-windows.json) + số media trám đã dùng/bỏ.

## Quality Criteria

- 3s đầu full face; avatar quay lại mỗi ≤20s (re-hook đặt đúng)
- Ranh giới avatar↔scene có flash + SFX, không hở seam
- PIP hiện đúng segment, ẩn đúng window, frame mặt đẹp
- Captions sync word-level, không bị che
- Media trám đúng chỗ, ảnh lạc đề không bị nhét bừa
- Render duration == TOTAL; ratio avatar trong khoảng cam kết

**Thêm cho `bds-broker`:** không có ảnh nào rơi vào beat `mediaPolicy: none` · mọi ảnh phối cảnh có chip "Ảnh minh họa" · mặt bằng được zoom vào cụm căn (không show nguyên bản) · mọi chữ ≥ 90px đã qua `fitText()`, không tràn cạnh · số liệu trên màn hình khớp `_kien-thuc-du-an/` · `notFound` trong `asset-map.json` rỗng.

## Lỗi đã gặp / Kiểm

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| `cut_avatar_audio.py` fail ratio | Ratio avatar ngoài 0.30–0.42 | Sửa window / `beats-spec.json` TRƯỚC khi qua Cổng B, hoặc `--min-ratio/--max-ratio` |
| `verify_avatar_sync.py` exit 4 (`stretched`) / 3 (`low-confidence`) | HeyGen kéo giãn audio / raw MP4 không phải lip-sync của `avatar.mp3` hiện tại | Rule 6b — chạy lại Phase 2 (qua Cổng B lần nữa), hoặc chẻ window dài thành 2 beat |
| Render dài hơn `full.mp3` | Loop breathing / bokeh không hữu hạn, hoặc `#root` thiếu `data-duration` | Rule 10 |
| Ảnh dự án 404 lúc render | Trỏ thẳng vào `workspace/data/` (tên có dấu / dấu cách) | Rule 16 |
| Giọng ElevenLabs lạ (Adam) | `ELEVENLABS_VOICE_ID` chưa nạp vào shell | Nạp từ `.env`, hoặc truyền `--voice-id` |

Danh sách đầy đủ lỗi thiết kế: `references/anti-patterns.md`; điều cần biết + nhật ký: `references/kinh-nghiem.md`.

## Cải tiến skill

Gặp lỗi mới: thêm một hàng vào bảng trên (nếu ngắn) hoặc `references/kinh-nghiem.md` mục *Nhật ký*, rồi sửa đúng một chỗ — đừng chép ra nhiều nơi.

## Liên quan

- Trước: `mkt-linh-aloha-bds-video-script` / `mkt-vn-short-video-script` (script), `heygen-mp3-to-mp4` (Phase 2).
- Cùng họ 9:16: `mkt-full-video-with-11-hyperframe-heygen` (avatar suốt video) · `mkt-hyperframe-luxury-realestate-9-16` (chữ punch trên avatar full-frame; profile `bds-broker` ở đây mượn palette punch + `fitText()` cùng kiểu) · `mkt-hyperframe-talking-head-video` (footage quay sẵn; nguồn script caption + 6 SFX chuẩn).

## References & Scripts

- `references/avatar-windows-layout.md` — geometry + timing + master JS (ĐỌC khi wire master)
- `references/media-broll.md` — thuật toán media trám + manifest schema (ĐỌC khi có media/)
- `references/bds-asset-library.md` — kho ảnh dự án BĐS: registry, catalog, 3 mức chỉ định, bảng chống ảnh lạc đề (ĐỌC khi profile `bds-broker`)
- `profiles/bds-broker/` — `design-system.md` (punch palette + fitText) · `scene-patterns.md` (9 pattern BĐS) · `sfx-map.md` · `beats-template.json`
- `scripts/resolve_project.py`, `scripts/build_asset_catalog.py`, `scripts/fetch_project_assets.py` — Phase 0 của `bds-broker`
- `references/heygen-integration.md` — Phase 2 lite (avatar.mp3 → clips)
- `references/scene-patterns.md` (canvas note lite), `references/sfx-layer.md`, `references/anti-patterns.md`, `references/design-system.md`, `references/elevenlabs-v3.md`, `references/image-thumbnail-overlay.md`, `references/kinh-nghiem.md`
- `scripts/cut_avatar_audio.py`, `scripts/split_avatar_video.sh`, `scripts/verify_avatar_sync.py` (đo lip-sync offset thật), `scripts/prep_broll.sh` — MỚI của lite
- `scripts/tts.py`, `scripts/tts_minimax.py`, `scripts/map_beats.py` (carry avatar/role), `scripts/prep_source_video.sh`, captions scripts (`clean_transcript.py`, `fix_caption_typos.py`, `inject_captions.py`)
- `assets/templates/master-index.reference.html` — master lite (markers [1]..[9])
- `assets/templates/scene-reference-full.html` — DNA scene 1080×1920
- `assets/templates/captions.html.template` — captions sub-comp proven
