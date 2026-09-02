---
name: mkt-kie-broll-image-generator
description: Sinh ảnh b-roll qua KIE AI cho pipeline video ngắn (TikTok/Reels/YouTube Shorts) — dual-provider **Nano Banana 2** (`nano-banana-2`, default — ảnh photoreal warm editorial) + **GPT Image 2** (`gpt-image-2-text-to-image`, alternative — render text trong ảnh tốt hơn). Đọc optional `--profile <name>` để apply visual style (hiện có `thu-gein` — cream-paper warm editorial family; thêm style mới qua `profiles/<name>/style.md`). 2 input mode: (A) parse tự động `brief.md` (từ `mkt-vn-short-video-script`) qua `parse_brief_broll.py` để rút b-roll suggestions ra prompt list, HOẶC (B) accept list prompt thủ công user paste. Output ảnh PNG/JPG với filename ASCII vào folder chỉ định + manifest JSON (prompt + filename + provider + taskId) để truy vết. Async task model — `POST /createTask` lấy `taskId` rồi poll `GET /recordInfo` mỗi 5s (max 5 phút) cho tới khi `state=success`, parse `resultJson` JSON string lấy `resultUrls[0]` rồi download. Cần `KIE_API_KEY` trong `.env` root. Compatible với pipeline downstream `mkt-full-video-thu-life-coach-9-16` (Phase 3 có thể invoke optional). USE WHEN user nói "tạo b-roll", "gen ảnh b-roll", "tạo ảnh chèn video", "kie ai image", "nano banana", "gpt image 2", "b-roll cho video", "auto-generate b-roll", hoặc cần ảnh minh hoạ chèn vào talking-head video mà user chưa có asset.
---

# mkt-kie-broll-image-generator

Sinh ảnh b-roll qua **KIE AI** cho pipeline video ngắn. Dual-provider: **Nano Banana 2** (default — photoreal warm editorial) + **GPT Image 2** (text-in-image tốt hơn).

Bridge từ "script đã viết xong" sang "có asset b-roll thật để chèn vào video". Hai input mode — parse tự động từ `brief.md` của `/mkt-vn-short-video-script`, hoặc nhận list prompt thủ công.

## Khi nào dùng

- Pipeline video Thu / GEIN (`/mkt-full-video-thu-life-coach-9-16`) — Phase 3 cần 1-3 ảnh full-screen b-roll mà user chưa quay/chụp được
- Bất kỳ pipeline talking-head 9:16 / 16:9 nào cần ảnh metaphor chèn giữa các beat
- User có brief.md đã viết kèm gợi ý b-roll → auto-extract → batch gen
- User muốn iterate nhanh nhiều variant cho 1 concept (chạy lại nhiều lần với prompt biến tấu)

**Không dùng nếu:**
- User đã có b-roll thật (ảnh chụp / kho stock) → dùng thẳng asset đó, ảnh AI gen không thay được khoảnh khắc thật
- Cần video b-roll (KIE chỉ gen ảnh tĩnh — dùng skill khác cho video gen)
- Cần render text precise trên slide knowledge → dùng `mkt-plan-short-video-edit-16-9` (chuyên cho cream-paper editorial slide / visual thinking)
- Chưa có `KIE_API_KEY` trong `.env` — skill fail fast

## Inputs

| Param | Required | Default | Mô tả |
|---|---|---|---|
| `output_dir` | Yes | — | Folder lưu ảnh + manifest (vd: `workspace/<slug>/broll/`) |
| `brief_path` HOẶC `prompts` | Yes | — | Path tới `brief.md` ĐỂ auto-parse, HOẶC list prompt thủ công (JSON array hoặc 1 prompt / dòng) |
| `--provider` | No | `nano-banana` | `nano-banana` (default) hoặc `gpt-image` |
| `--profile` | No | (none) | Apply `profiles/<name>/style.md` làm STYLE suffix. Hiện có `thu-gein` |
| `--aspect_ratio` | No | `9:16` | NB enum: `auto, 1:1, 1:4, 1:8, 2:3, 3:2, 3:4, 4:1, 4:3, 4:5, 5:4, 8:1, 9:16, 16:9, 21:9`. GPT enum nhỏ hơn: `auto, 1:1, 9:16, 16:9, 4:3, 3:4` |
| `--resolution` | No | `1K` | `1K / 2K / 4K`. Lưu ý GPT `1:1` KHÔNG dùng được `4K` |
| `--output_format` | No | `png` | `png` hoặc `jpg`. CHỈ áp cho Nano Banana — GPT bỏ qua param này |

## Provider routing — chọn provider nào?

**Default = Nano Banana 2** (`nano-banana-2`):
- Ảnh photoreal warm editorial, soft daylight, intimate family scene
- Đa số b-roll Thu / GEIN, BĐS, lifestyle → dùng cái này
- Hỗ trợ đầy đủ aspect ratio (15 enum) + 3 resolution + chọn PNG/JPG

**Switch sang GPT Image 2** (`gpt-image-2-text-to-image`) khi:
- User explicitly đặt `--provider gpt-image`
- Prompt chứa các keyword: `"text in image"`, `"typography overlay"`, `"render text:"`, `"book cover"`, `"sign that reads"`, `"banner with text"` → auto-switch (skill báo user trước khi switch)
- Cần render chữ Việt / tựa sách / signage chính xác trong ảnh

Skill **phải announce** provider dùng cho mỗi ảnh ở stderr log, vd: `[kie] provider=nano-banana model=nano-banana-2 ar=9:16 res=1K`.

## Profile system

`profiles/<name>/style.md` là block markdown thuần (không frontmatter, không heading) chứa mô tả palette / lighting / composition / aesthetic. Khi `--profile <name>` set, skill load file và append vào cuối prompt dưới label `STYLE: ...`.

**Profile có sẵn:**
- `thu-gein` — Cream-paper warm editorial family. Palette warm cream + deep forest + soft gold + terracotta. Subject: gia đình Việt, cha mẹ - con cái, household ritual. Phù hợp pipeline `/mkt-full-video-thu-life-coach-9-16`.

**Thêm profile mới:**
```bash
mkdir -p .claude/skills/mkt-kie-broll-image-generator/profiles/<new-name>
# tạo style.md với mô tả palette / lighting / subject focus / avoid list
```

Không cần thay đổi script — `parse_brief_broll.py` và `generate_image.py` chỉ đọc file `style.md` qua path.

## Workflow

### Step 0 — Check `KIE_API_KEY`

```bash
# Skill PHẢI verify trước khi gen
grep -E '^KIE_API_KEY=' /Users/tonyhoang/Documents/GitHub/BIZ.MKT.OS/.env || echo "MISSING KIE_API_KEY"
```

Nếu thiếu / vẫn còn placeholder `your_kie_api_key`:

> ❌ Chưa có `KIE_API_KEY` trong `.env` root. Lấy key tại https://kie.ai/dashboard → API Keys → thêm dòng `KIE_API_KEY=sk_...` vào `/Users/tonyhoang/Documents/GitHub/BIZ.MKT.OS/.env` rồi rerun.

**Fail fast.** Không gọi API mà không có key.

### Step 1 — Build prompts list

**Mode A — auto-extract từ brief.md:**

```bash
uv run .claude/skills/mkt-kie-broll-image-generator/scripts/parse_brief_broll.py \
  --brief workspace/<slug>/brief.md \
  --profile thu-gein \
  --output_json workspace/<slug>/broll-prompts.json
```

Script đọc các pattern:
- Bảng markdown có cột header `B-roll / cảnh quay / hình ảnh`
- Section `### Gợi ý b-roll` / `### Gợi ý hình ảnh` — bullet `- ...`
- Inline marker `(b-roll: ...)` trong beat

Output JSON: `[{idx, raw_text, prompt, suggested_filename}, ...]`. Filename ASCII slug — dấu Việt strip, lowercase, dash-separated, max 40 ký tự.

**Mode B — manual prompts:**

User paste list (1 prompt / dòng hoặc JSON array). Skill skip parser, áp profile style suffix nếu `--profile` set, build prompts trực tiếp.

### Step 2 — Cost warning

Trước khi gen, hiển thị cho user:

> ⚠️ Sắp gen **N ảnh** qua KIE AI (provider `<X>`, resolution `<Y>`). KIE tính credit theo ảnh + resolution — vui lòng check balance tại https://kie.ai/dashboard trước khi confirm.

**Wait user OK.** Nếu user reply "ok" / "tiếp" → tiếp Step 3.

### Step 3 — Generate ảnh

Loop qua prompts list:

```bash
uv run .claude/skills/mkt-kie-broll-image-generator/scripts/generate_image.py \
  --prompt "<full prompt with STYLE suffix>" \
  --provider nano-banana \
  --aspect_ratio 9:16 \
  --resolution 1K \
  --output_format png \
  --output workspace/<slug>/broll/broll-01-mom-cooking.png \
  --poll_interval 5 \
  --poll_timeout 300
```

Script làm:
1. Resolve `KIE_API_KEY` (env var → repo `.env` → cwd `.env`)
2. `POST https://api.kie.ai/api/v1/jobs/createTask` body theo provider (NB có `image_input` + `output_format`, GPT không)
3. Poll `GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=...` mỗi 5s, max 5 phút
4. Khi `state=success` → parse `resultJson` (JSON STRING) → `resultUrls[0]` → `requests.get` stream download
5. Verify file size > 1KB
6. Print `OK <output_path>` stdout (status logs ở stderr)

Trên success exit code 0. Fail (network / 4xx / poll timeout / file too small) exit code != 0.

### Step 4 — Write manifest

Sau khi gen xong tất cả ảnh, viết `<output_dir>/broll-manifest.json`:

```json
{
  "generated_at": "2026-05-27T...",
  "provider": "nano-banana",
  "model": "nano-banana-2",
  "profile": "thu-gein",
  "aspect_ratio": "9:16",
  "resolution": "1K",
  "items": [
    {
      "idx": 1,
      "filename": "broll-01-mom-cooking.png",
      "prompt": "SCENE: ...\n\nSTYLE: ...\n\nAVOID: ...",
      "task_id": "task_xxx",
      "size_bytes": 482301
    },
    ...
  ]
}
```

Manifest dùng để re-run, debug, audit. Phase 3 packager (Thu pipeline) đọc manifest để map ảnh vào timeline.

### Step 5 — Report user

```markdown
## B-roll generated — KIE AI
**Folder:** workspace/<slug>/broll/
**Provider:** nano-banana (`nano-banana-2`) · **Profile:** thu-gein · **Aspect:** 9:16 · **Res:** 1K
**Generated:** N/N (T phút wall-clock)
**Manifest:** workspace/<slug>/broll/broll-manifest.json

Files:
- broll-01-mom-cooking.png (482 KB)
- broll-02-family-dinner.png (510 KB)
- ...

Review từng file, nếu cần re-gen 1 ảnh → re-run `generate_image.py` với prompt mới (HOẶC nói "gen lại ảnh N với prompt: ...").
```

## Failure modes

| Symptom | Hành động |
|---|---|
| `KIE_API_KEY` missing / placeholder | Fail fast Step 0. Hướng dẫn user add vào `.env` root |
| 401 unauthorized | Key sai / hết hạn. Verify key tại kie.ai dashboard |
| 402 insufficient credits | Hết credit KIE. Nạp tại dashboard rồi retry |
| 404 task not found | TaskId không tồn tại — likely race condition giữa create và poll. Re-run |
| 422 validation error | Body sai schema (aspect_ratio / resolution out of enum, prompt > 20000 chars). Check log `data.msg` |
| 429 rate limit | Throttle — sleep 30s rồi retry, hoặc giảm parallel |
| 500 / 501 server / generation failed | KIE side issue. Retry sau 1-2 phút. Nếu lặp lại → check status page kie.ai |
| 505 disabled | Model bị tạm tắt. Switch provider hoặc đợi |
| Poll timeout (>5 phút) | Gen chậm bất thường. Verify taskId tại dashboard. Nếu OK ở dashboard → tăng `--poll_timeout 600` |
| `resultJson` malformed | KIE trả invalid JSON string — likely bug bên KIE. Log raw, retry |
| Downloaded file < 1KB | URL trả empty / partial. Network issue hoặc CDN edge fail. Retry |
| Prompt > 20000 chars | Script fail fast trước khi POST. Cắt SCENE ngắn lại — STYLE block là cái dài nhất, nếu vẫn vượt thì simplify style |
| Filename Vietnamese (do user override) | `parse_brief_broll.py` đã ASCII slug rồi. Nếu user force tên có dấu → rename trước khi gọi |

## Reference

- **Nano Banana 2 docs** — https://docs.kie.ai/market/google/nanobanana2
- **GPT Image 2 docs** — https://docs.kie.ai/market/gpt/gpt-image-2-text-to-image
- **Unified poll endpoint** — `GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId={taskId}` (dùng chung cho cả 2 provider)
- **KIE dashboard / credits / API keys** — https://kie.ai/dashboard

## Integration — Thu / GEIN pipeline

Skill `mkt-full-video-thu-life-coach-9-16` có thể invoke skill này **optional** ở Phase 3 khi:
1. User chưa có file b-roll thật, VÀ
2. User opt-in (`auto_broll: true` ở input HOẶC reply "gen b-roll" ở checkpoint #2)

Pass tham số:
- `--brief workspace/<slug>/brief.md` (nếu brief đã sinh từ script skill)
- `--profile thu-gein`
- `output_dir = workspace/<slug>/broll/`

Phase 3 packager sau đó pick các ảnh đã gen vào timeline làm full-screen takeover scene (ken-burns 1.0→1.04 + warm vignette + cream paper overlay 8%) match aesthetic `thu_life_coach`.

Xem block "Optional: Auto-generate b-roll via KIE AI" trong `/mkt-full-video-thu-life-coach-9-16` Phase 3 section để thấy hook point cụ thể.

## What this skill does NOT do

- KHÔNG quyết định ảnh nào dùng ở scene nào — đó là việc của Phase 3 packager (skill chỉ produce assets)
- KHÔNG composite ảnh vào video — chỉ produce file PNG/JPG raw
- KHÔNG cache / dedupe ảnh giữa các run — mỗi run gen lại từ đầu (nếu cần re-use, copy file thủ công)
- KHÔNG cache hoặc batch parallel — gen tuần tự để tránh rate-limit + dễ debug
- KHÔNG render text precise trên slide knowledge — đó là việc của `mkt-plan-short-video-edit-16-9`
- KHÔNG retry tự động khi fail — user review log + re-run thủ công per failed image
