---
name: mkt-full-video-with-11-remotion-heygen
description: End-to-end short-video pipeline (Vietnamese BĐS broker-creator, TikTok/Reels 9:16) — user chỉ đưa script.txt, skill tự lo phần còn lại — TTS qua ElevenLabs/MiniMax → MP3, HeyGen lip-sync → source.mp4, Phase 3 packager tự transcribe + lên plan b-roll + SFX + zoom hooks + text overlay (10 variant từ BDSGeneralTemplate) + contact card cuối + merge vào 1 overlays.json + init Remotion project + open Studio preview. 2 user checkpoint — duyệt MP3 sau Phase 1, duyệt overlays-outline trước khi finalize. JSON-driven, components pre-built (Punch / Punch2Line / PriceRed3D / PriceWithBrand / CalloutStack / IconStack / BrollImage / CommentBubble / ContactCard). Template-based — multiple templates supported (`BDSGeneralTemplate` default cho video review chung về dự án BĐS). USE WHEN user says 'tạo video bđs remotion', 'remotion video pipeline', 'video bds 9:16', 'video review dự án bđs', 'script to remotion mp4', 'video broker creator remotion', 'remotion heygen pipeline', 'react component video bđs', hoặc đưa script BĐS và muốn ra MP4 9:16 preview-ready.
---

# mkt-full-video-with-11-remotion-heygen

End-to-end orchestrator: **script.txt → preview-ready TikTok/Reels MP4 9:16 via Remotion + BDSGeneralTemplate**.

User chỉ đưa script. Skill tự lo: TTS (ElevenLabs default), HeyGen avatar lip-sync, Whisper transcribe, plan b-roll + SFX + zoom hooks + text overlays + contact card, merge thành 1 `overlays.json`, init Remotion project, open Studio cho user preview. KHÔNG auto-render MP4.

3 phase, 2 user checkpoints:
1. **MP3 checkpoint** (orchestrator) — user duyệt voiceover sau Phase 1
2. **Overlays-outline checkpoint** (Phase 3 sub-agent) — user duyệt danh sách overlay + b-roll + timestamps + variants trước khi finalize

## Templates available

| Template | Use case | Components |
|---|---|---|
| **`BDSGeneralTemplate`** (default) | Video review chung về 1 dự án BĐS (so sánh dự án, giới thiệu phân khúc, chính sách bán hàng, virtual tour) | 10 overlay variants — see [variant-catalog.md](references/variant-catalog.md) |

Tương lai có thể thêm templates khác (e.g. `BDSLuxuryTemplate`, `EcommerceTemplate`) bằng cách tạo `templates/<NewName>/` cùng cấu trúc và update `init_project.sh --template <NewName>`.

## Khi nào dùng

- User có 1 script Việt/Anh ≤ 5000 ký tự muốn ra video TikTok/Reels 9:16
- Niche BĐS — broker-creator aesthetic (avatar full-frame + punchy text overlays + b-roll project images + contact card cuối)
- Sẵn sàng cung cấp `broll/` (project images) + `logos/` (avatar.jpg + qr-contact.jpg) trong workspace
- Muốn preview trong Remotion Studio trước khi render MP4

**Không dùng nếu:**
- User muốn HyperFrames thay vì Remotion → dùng `mkt-full-video-with-11-hyperframe-heygen`
- Đã có MP3 sẵn → `heygen-mp3-to-mp4`
- Đã có MP4 + cần edit → spawn Phase 3 packager riêng với mp4 sẵn
- Script > 5000 ký tự → user split semantic
- Video 16:9 ngang → `mkt-full-video-with-11-hyperframe-heygen-16-9`

## Pipeline overview

```
script.txt (user duy nhất phải đưa)
   │
   ▼
Phase 1  ── ElevenLabs TTS ──► voiceover.mp3
   │
   ▼  CHECKPOINT #1 — user duyệt MP3
   │  OK
   ▼
─── Fire 2 agents PARALLEL (1 message) ─────────────────────────────────
   │
   ├─ Phase 2 (BACKGROUND) ── heygen-mp3-to-mp4 ──► source.mp4 (3-10 min)
   │
   └─ Phase 3 (FOREGROUND) ── mkt-full-video-phase3-remotion-packager
              │
              ├─ Whisper transcribe (voiceover.mp3) → transcript-cleaned.json
              ├─ Group captions → caption-groups.json
              ├─ **Align caption text to script.txt** (source of truth) — fix Whisper mis-hears (brand, dấu thanh, số) while keeping Whisper's timing
              ├─ Identify emphasis moments (12-20 per 60s)
              ├─ Pick variants từ 10-name registry per variant-catalog.md
              ├─ Map b-roll images → broll-image overlays (1 per 10-15s)
              ├─ Pick 4-6 SFX cues per BĐS library
              ├─ Plan 15-22 zoom hooks (≤4s gap)
              ├─ Plan contact-card END (avatar + QR + hotline, t = duration - 6)
              ├─ CHECKPOINT #2 — user duyệt overlays-outline.json
              ├─ Merge tất cả vào 1 overlays.json (KHÔNG file riêng broll-inserts.json)
              ├─ Run scripts/validate.py — fix errors
              ├─ Wait for source.mp4 (joins HeyGen background)
              ├─ Run scripts/init_project.sh <workspace> [--template BDSGeneralTemplate]
              │     ├─ first run: copy template → workspace/remotion-project/ + npm install
              │     └─ subsequent: only swap data into shared public/ (fast, no npm install)
              └─ Echo Studio URL — DON'T auto-open browser
   │
   ▼
User mở Studio preview → `render` → `cd workspace/remotion-project && npm run render-final`
```

Wall-clock savings: HeyGen render (~3-10 min) overlaps Phase 3 transcribe + outline + checkpoint review (~1-3 min). Tổng pipeline ~5 min thay vì ~8.

## Inputs

| Param | Required | Format / Default |
|---|---|---|
| Script text | Yes | File path `.txt`/`.md` hoặc inline. ≤ 5000 ký tự |
| Slug | No | Auto-derive 5 từ đầu script. Lowercase ASCII dash |
| Broll folder | No | User trỏ folder chứa project images (ASCII filenames). Skill copy sang `workspace/broll/`. Nếu không có → bỏ qua b-roll overlays. |
| Logos folder | No | Cần `avatar.jpg` + `qr-contact.jpg` cho contact-card. Skill copy sang `workspace/logos/`. Nếu thiếu → skip contact-card, dùng comment-bubble CTA. |
| `template` | No | Default `BDSGeneralTemplate`. Future: `BDSLuxuryTemplate`, ... |
| `tts_provider` | No | `elevenlabs` (default, voice Hoàng) hoặc `minimax` |
| `voice_id` | No | CLI `--voice_id <id>`. Default từ `.env` |
| `auto_overlays` | No | Skip checkpoint #2. Default `false` |
| `hotline` | No | Phone number cho contact-card. Hỏi user nếu thiếu. |
| `brand_name` | No | Tên người gọi điện (e.g. "EM LINH ALOHA") cho contact-card |

## Workspace layout (post-init)

**SHARED Remotion project model** — ONE `workspace/remotion-project/` is shared across ALL per-project workspaces. Per-project folder keeps its data; init swaps that data into the shared `public/` when user wants to preview/render.

```
workspace/
├── remotion-project/                # ← SHARED, one for all projects
│   ├── src/                         # 10 components + Root + Video + Avatar + ...
│   ├── public/                      # Active project's data (swapped per init)
│   │   ├── voiceover.mp3            # ← current project
│   │   ├── source.mp4               # ← current project
│   │   ├── overlays.json            # ← current project
│   │   ├── caption-groups.json      # ← current project
│   │   ├── broll/                   # ← current project
│   │   ├── logos/                   # ← current project
│   │   ├── bgm/coconut-groove.wav   # ← template default (preserved)
│   │   └── sfx/<14 files>           # ← template default (preserved unless workspace overrides)
│   ├── node_modules/                # npm install ONCE (~150MB, shared forever)
│   ├── package.json + tsconfig + remotion.config
│   └── renders/                     # MP4 output — name as <slug>-draft.mp4 / <slug>-final.mp4
│
└── content/YYYY-MM-DD/<slug>/       # ← per-project workspace, keeps its own data
    ├── script.txt                   # input
    ├── voiceover.mp3                # Phase 1
    ├── source.mp4                   # Phase 2
    ├── transcript.json              # Phase 3 (Whisper raw)
    ├── transcript-cleaned.json      # Phase 3 (typo fix)
    ├── caption-groups.json          # Phase 3 (3-5 words/group)
    ├── overlays-outline.json        # Pre-checkpoint preview
    ├── overlays.json                # FINAL — merged single source of truth
    ├── broll/                       # User project images (ASCII filenames)
    └── logos/                       # avatar.jpg + qr-contact.jpg
```

**Init behavior — 2 modes:**
- **First run** (no `workspace/remotion-project/`): copy template src + public defaults + npm install (~30-90s one-time)
- **Subsequent runs**: skip template copy + skip npm install. Only swap data files (voiceover.mp3, source.mp4, overlays.json, caption-groups.json, broll/, logos/) into shared `public/`. `bgm/` + `sfx/` preserved.

**Why shared?** Saves ~150MB × N node_modules disk + skips npm install for every project after the first. Trade-off: only ONE project preview at a time. To switch projects, re-run `init_project.sh <other-project-workspace>` (fast).

**Files at ROOT of `public/`, NOT in `public/assets/`** — Root.tsx defines TWO compositions: `BdsGeneralReview` fetches `staticFile('overlays-general.json')`, `BdsApartmentDetail` fetches `staticFile('overlays-apartment.json')`. `init_project.sh` writes BOTH `overlays.json` (workspace contract) AND the template-matched name (`-general.json` or `-apartment.json`) so the right composition picks it up. See [lessons-learned.md § 2](references/lessons-learned.md) and [§ 6](references/lessons-learned.md).

## Workflow

### Step 0 — Setup

1. Validate `len(script) ≤ 5000`. Vượt → stop, yêu cầu split.
2. Derive slug (5 từ đầu → lowercase ASCII dash) nếu thiếu.
3. Detect optional inputs: `broll/`, `logos/avatar.jpg`, `logos/qr-contact.jpg`, hotline, brand_name. Hỏi user nếu thiếu CRITICAL (hotline + brand_name cho contact-card).
4. Validate TTS provider key trong `.env`.
5. Tạo `workspace/content/YYYY-MM-DD/<slug>/`. Save `script.txt`.
6. Copy b-roll + logos vào workspace (ASCII rename nếu cần).
7. Báo user: workspace path, provider, b-roll count, logos available, template name.

### Step 1 — Phase 1: Script → MP3

```bash
# ElevenLabs (default, voice Hoàng)
uv run .claude/skills/mkt-elevenlabs-tts-to-mp3/scripts/text_to_mp3.py \
  --file <workspace>/script.txt \
  -o <workspace>/voiceover.mp3
```

Filename inviolable: `voiceover.mp3`. Check duration ≤ 300s.

### Step 2 — CHECKPOINT #1: user nghe MP3

```markdown
## Voiceover ready
**File:** <workspace>/voiceover.mp3
**Duration:** <X>s · **Size:** <Y>MB · **Provider:** elevenlabs

Reply:
- `OK` / `tiếp` → chạy Phase 2 + 3 parallel
- `regen` + lý do → tweak voice và regen
- `sửa script` + nội dung → save lại rerun Phase 1
```

**Stop. Đợi user.**

### Step 3 — Phase 2 + Phase 3 PARALLEL (1 message, 2 agents)

**Agent A — HeyGen background:**
```
subagent_type: general-purpose
run_in_background: true
prompt: |
  Invoke /heygen-mp3-to-mp4 với:
  - mp3: <workspace>/voiceover.mp3
  - output: <workspace>/source.mp4
  Filename `source.mp4` inviolable.
```

**Agent B — Phase 3 packager foreground:**
```
subagent_type: mkt-full-video-phase3-remotion-packager
prompt: |
  workspace_dir: <workspace>
  slug: <slug>
  script_text: <full text>
  template: BDSGeneralTemplate
  broll_list: <list of files in workspace/broll/>
  logos: { avatar: logos/avatar.jpg, qr: logos/qr-contact.jpg }
  contact: { name: "<brand_name>", hotline: "<hotline>" }
  auto_overlays: false
  audio_source: voiceover.mp3
  source_mp4_pending: true

  Run Phase 3 per your agent definition.
  Skill folder: .claude/skills/mkt-full-video-with-11-remotion-heygen/
  Return Studio URL (don't auto-open browser).
```

### Step 4 — Hand off

```markdown
## Pipeline DONE — preview ready
**Workspace:** <workspace>
**Phase 1 (<provider>):** voiceover.mp3 — <D>s, <S>MB
**Phase 2 (HeyGen):** source.mp4 — <D>s, <S>MB
**Phase 3:** <N> overlays (incl. <K> broll-image, 1 contact-card), <Z> zoom hooks, <S>/6 SFX cues
**Studio:** http://localhost:3000  (mở browser xem)
**Render:** `cd <workspace>/remotion-project && npm run render-final`
```

**Stop.** Không auto-render. Không auto-open browser.

## Critical orchestration rules

1. **2 checkpoints, 1 orchestrator gate** — Orchestrator stop ở MP3. Outline checkpoint do Phase 3 quản. Render gate ở Studio.
2. **Path conventions inviolable** — `voiceover.mp3`, `source.mp4`, `overlays.json`, `caption-groups.json`. Template fetches by exact name via `staticFile()`.
3. **Files at root of `public/`** — NOT in `public/assets/`. Root.tsx fetches `overlays-general.json` (BdsGeneralReview composition) or `overlays-apartment.json` (BdsApartmentDetail). `init_project.sh` is template-aware — writes the workspace's `overlays.json` to BOTH `public/overlays.json` and the matched template name. See [lessons-learned.md § 6](references/lessons-learned.md).
4. **HeyGen: MCP cho create/poll, REST v3 cho upload** — `mcp__heygen__create_video_from_avatar` + `mcp__heygen__get_video`; upload MP3 qua `scripts/upload_asset.py` (`POST /v3/assets`). KHÔNG gọi endpoint v1/v2 (`/v2/video/generate`, `upload.heygen.com/v1/asset`) — sunset 2026-10-31.
5. **Voice ID trong `.env`** — override per-call qua `--voice_id`.
6. **Script length hard cap 5000** — fail fast Step 0.
7. **MP3 duration ≤ 300s** — HeyGen cap.
8. **Phase 3 isolation** — sub-agent context riêng, variant-catalog + lessons-learned loaded vào sub-agent.
9. **Phase 2 + 3 parallel kickoff** — sau CHECKPOINT #1, fire HeyGen background + Phase 3 foreground trong 1 message.
10. **Avatar full-frame always** — `<Avatar>` is full 1080×1920 object-fit cover. No split-screen, no PIP.
11. **Template src/ READ-ONLY for sub-agent** — packager writes JSON only, never edits `.tsx` files.
12. **Use 10-name variant registry** — `punch | punch-2line | price-red-3d | price-with-brand | callout-stack | icon-stack | broll-image | comment-bubble | contact-card`. NO `punch-white/red/yellow`, `glitch-text`, `count-up-*`. See [lessons-learned.md § 1](references/lessons-learned.md).
13. **One overlays.json, all merged** — b-roll, contact-card, text overlays all inside `overlays[]` array. NO separate `broll-inserts.json`. See [lessons-learned.md § 5](references/lessons-learned.md).
14. **Contact-card always at end** if avatar+QR assets present. `t_start = video_duration - 6`, `duration = 6`. `video_duration = voiceover_duration + 3` for tail playout.
15. **BGM auto-wired** — `public/bgm/coconut-groove.wav` loop volume 0.12 in `Video.tsx`. Don't add second BGM.

## Visual style — broker_creator (LOCKED for BDSGeneralTemplate)

| Tiêu chí | Spec |
|---|---|
| Avatar layout | FULL FRAME 1080×1920 (object-fit cover, z-index 1) |
| Visual driver | 10 React overlay components (JSON-configured) |
| Variants (10) | Punch (with color prop), Punch2Line, PriceRed3D, PriceWithBrand, CalloutStack, IconStack, BrollImage, CommentBubble, ContactCard, _placement helper |
| Text style | Mulish 900 italic + Be Vietnam Pro fallback. Brand/project name moments can use Dancing Script gold calligraphy via `headline_font:"script"` on `punch-2line`. 8-direction text-shadow stroke (Vietnamese diacritics safe — NOT `-webkit-text-stroke`) |
| Color palette | Semantic: Gold `#f4b324` (brand/developer) · Green `#2bb24c` (project name + positive) · Blue `#1f7ae0` (setup/category labels) · Red `#e63946` (numbers/%/scarcity) · White `#ffffff` (neutral) · Yellow `#ffd60a` (legacy accent) · Black stroke `#000`. Per-line color via `subtitle_color` (punch-2line) + `setup_color` (callout-stack). Full mapping in [variant-catalog.md § Color palette](references/variant-catalog.md) |
| Animation | `Easing.back(2)` 0.35s scale-pop entry + exit fade |
| Zoom palette | 4 types (soft2step / quickpop / doublepop / zoomout), peaks 1.04-1.10 |
| Captions | Bottom-center pill (y≈1240-1344). B-roll captions live at y≈1840 (bottom safe zone) |
| BGM | coconut-groove.wav loop, volume 0.12 |
| fps / canvas | 30 / 1080×1920 |

Full variant decision tree: [`references/variant-catalog.md`](references/variant-catalog.md).
JSON schema worked example: [`references/overlays-schema.md`](references/overlays-schema.md).
Bake-in fixes: [`references/lessons-learned.md`](references/lessons-learned.md).

## SFX library — BĐS broker-creator (14 file, default in template)

`templates/BDSGeneralTemplate/public/sfx/` — auto-copied per workspace. Workspace can override by placing own `sfx/` folder. Mapping cheat sheet in [`variant-catalog.md § SFX cues`](references/variant-catalog.md#sfx-cues--14-file-bđs-library-budget--6-per-video).

**Budget: ≤ 6 cues per 60s video.** Validator warns if higher.

## Failure modes

| Symptom | Hành động |
|---|---|
| Script > 5000 | Stop, yêu cầu split semantic |
| TTS API fail | Check `<PROVIDER>_API_KEY` trong `.env` |
| MP3 > 300s | Stop, chunking |
| HeyGen render fail | `mcp__heygen__get_current_user` credits check |
| HeyGen timeout Phase 3 stall > 15 min | Kill HeyGen agent, re-spawn |
| Caption text mis-spelled brand names (Master rise / Lumiêre / Cửa số) | `align_to_script.py` chưa chạy hoặc skip do alignment ratio < 0.5. Verify `transcript-aligned.json` tồn tại + caption-groups.json text khớp `script.txt`. Nếu skip vì ratio thấp → script không match audio, kiểm tra TTS output |
| `validate.py` error `unknown variant 'punch-white'` | Packager dùng tên cũ — fix to `punch` + color. See [lessons-learned.md § 1](references/lessons-learned.md) |
| `validate.py` error `assets.voiceover: must be non-empty` | Add `"voiceover": "voiceover.mp3"` to `assets` |
| Render output 245 KB / 5s exact | Root.tsx hit FALLBACK — `public/overlays-general.json` (or `-apartment.json`) not found. Run `init_project.sh` |
| Studio shows previous project's first overlay (e.g. video về dự án A nhưng caption "3 ĐIỀU MÊ" của dự án B) | `init_project.sh` chưa sync template-aware filename. Re-run `init_project.sh <workspace>` (now writes both `overlays.json` + `overlays-general.json`). See [lessons-learned.md § 6](references/lessons-learned.md) |
| `'Audio' is deprecated` warning | Use `Html5Audio` (already done in template). See [lessons-learned.md § 3](references/lessons-learned.md) |
| B-roll caption cuts mid-word ("MASTERI/SE") | `BrollImage.tsx` already fixed with `wordBreak: 'keep-all'`. If still happens, single word too long → shrink fontSize |
| B-roll missing from render | Packager didn't merge `broll-inserts.json` into `overlays.json`. See [lessons-learned.md § 5](references/lessons-learned.md) |
| Contact card missing at end | Packager didn't emit `contact-card` overlay. Add manually with `t_start = duration - 6` |
| `npm install` fail | Check Node ≥ 18, `npm doctor` |
| Studio shows "overlays.json not found" page | `init_project.sh` chưa chạy hoặc workspace data missing |
| Render slow / OOM | Lower `--concurrency` flag, drop CRF to 23, ensure no other Chromium running |
| Render file too large for TikTok upload (>287MB web limit) | Run `npm run render-draft` (crf 28) instead of `render-final` (crf 18) |

## References

- **TTS A** — `.claude/skills/mkt-elevenlabs-tts-to-mp3/SKILL.md` (default Hoàng voice)
- **TTS B** — `.claude/skills/mkt-video-script-to-mp3/SKILL.md` (MiniMax)
- **HeyGen** — `.claude/skills/heygen-mp3-to-mp4/SKILL.md`
- **Phase 3 sub-agent** — `.claude/agents/mkt-full-video-phase3-remotion-packager.md`
- **Remotion best practices** — `.claude/skills/remotion-best-practices/SKILL.md` (load via Skill tool when editing template TSX)
- **Variant catalog (decision guide)** — [`references/variant-catalog.md`](references/variant-catalog.md)
- **JSON schema (worked examples)** — [`references/overlays-schema.md`](references/overlays-schema.md)
- **Lessons learned (5 anti-patterns)** — [`references/lessons-learned.md`](references/lessons-learned.md)
- **Default template** — [`templates/BDSGeneralTemplate/`](templates/BDSGeneralTemplate/)
- **init_project.sh** — [`scripts/init_project.sh`](scripts/init_project.sh)
- **validate.py** — [`scripts/validate.py`](scripts/validate.py)
- **HyperFrames equivalent (for comparison)** — `.claude/skills/mkt-full-video-with-11-hyperframe-heygen/SKILL.md`
