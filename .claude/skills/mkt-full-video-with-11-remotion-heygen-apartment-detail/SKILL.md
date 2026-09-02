---
name: mkt-full-video-with-11-remotion-heygen-apartment-detail
description: End-to-end short-video pipeline (TikTok/Reels 9:16) chuyên cho video **REVIEW CHI TIẾT 1 CĂN HỘ** — diện tích / hướng / view / thông số kỹ thuật, mặt bằng từng layout (studio / 1PN / 2PN / 3PN), close-up nội thất + finishing brand (bếp Caesarstone, sàn gỗ sồi Mỹ, thiết bị Bosch, Hafele, Toto), grid tiện ích (gym, bể bơi, sky bar), bảng giá theo tier có highlight. Sister skill của `mkt-full-video-with-11-remotion-heygen` — share toàn bộ Phase 1 (TTS) + Phase 2 (HeyGen) + Phase 2.5 (Whisper transcribe), CHỈ KHÁC Phase 3 planning (component pool + b-roll mapping + content structure). Output preview vào composition `BdsApartmentDetail` đọc `public/overlays-apartment.json` (KHÔNG đụng tới `overlays-general.json` của sibling). Component pool 9 variant — 5 scene full-screen apartment (`scene-apartment-price` / `scene-spec-row` / `scene-amenity-grid` / `scene-finishing-detail` / `scene-price-package`) + 4 shared text/CTA (`punch` / `callout-stack` / `comment-bubble` / `contact-card`). USE WHEN user nói 'tạo video review chi tiết căn hộ', 'video chi tiết 1 căn', 'walkthrough căn hộ', 'review nội thất căn hộ', 'video bảng giá căn hộ theo tier', 'video tiện ích chung cư', 'video bóc tách căn hộ', 'remotion apartment detail', 'video chi tiết layout căn hộ', 'review finishing nội thất', hoặc đưa script BĐS tập trung vào 1 căn hộ cụ thể (không phải so sánh dự án) và muốn ra MP4 9:16. KHÔNG dùng nếu video so sánh nhiều dự án / chính sách bán hàng chung — dùng sibling `mkt-full-video-with-11-remotion-heygen` thay vì.
---

# mkt-full-video-with-11-remotion-heygen-apartment-detail

End-to-end orchestrator: **script.txt (chi tiết 1 căn hộ) → preview-ready TikTok/Reels MP4 9:16 via Remotion composition `BdsApartmentDetail`**.

Sister skill của [`mkt-full-video-with-11-remotion-heygen`](../mkt-full-video-with-11-remotion-heygen/SKILL.md). Share **Phase 1 + Phase 2 + transcribe** từ skill cha. Chỉ khác **Phase 3 planning**.

## Khi nào dùng skill này (vs sibling general review)

| Trường hợp | Skill |
|---|---|
| Video so sánh 2+ dự án, giới thiệu chính sách chung, hook urgency tổng thể | `mkt-full-video-with-11-remotion-heygen` |
| Video walkthrough chi tiết **1 căn hộ cụ thể** — diện tích/hướng/view, layout từng kiểu, brand nội thất, bảng giá theo tier, gallery tiện ích | **skill này** |
| Video review tiện ích sâu của 1 toà / 1 phân khu (gym, bể bơi, sky bar...) chi tiết từng cái | **skill này** |
| Video listicle "Top 5 điểm cộng dự án X" | sibling — vì format point-by-point gần với general review hơn |

Nếu script vừa có review chung vừa có chi tiết căn — chia 2 video.

## Pipeline overview (deltas vs parent)

```
script.txt (script chi tiết căn hộ)
   │
   ▼
Phase 1  ── ElevenLabs/MiniMax TTS ──► voiceover.mp3       [SHARED parent]
   │
   ▼  CHECKPOINT #1 — user duyệt MP3                       [SHARED parent]
   │
   ▼
─── Phase 2 + Phase 3 PARALLEL ─────────────────────────────────
   │
   ├─ Phase 2 (BACKGROUND) ── heygen-mp3-to-mp4 ──► source.mp4   [SHARED parent]
   │
   └─ Phase 3 (FOREGROUND) ── packager APARTMENT-DETAIL flavor   [DIFFERS]
              │
              ├─ Whisper transcribe (voiceover.mp3) → transcript-cleaned.json   [SHARED]
              ├─ Group captions → caption-groups.json                            [SHARED]
              ├─ **Align caption text to script.txt** (source of truth)          [SHARED]
              │  fix Whisper mis-hears (brand, dấu thanh, số)
              │
              ├─ Identify SCENE BOUNDARIES (not just emphasis moments)
              │  Per-scene script chunk → maps to 1 of 9 scene types below
              │
              ├─ Map content → 5 scene full-screen variants + 4 shared CTA:
              │  ┌──────────────────────────────────────────────────────────────┐
              │  │ scene-spec-row         ┃ Tổng quan thông số (4-6 rows)       │
              │  │ scene-apartment-price  ┃ Mặt bằng layout (1-3 images)        │
              │  │ scene-finishing-detail ┃ Close-up nội thất + brand callouts  │
              │  │ scene-amenity-grid     ┃ Grid 4-6 tiện ích 1 frame          │
              │  │ scene-price-package    ┃ Bảng giá theo tier + footer note    │
              │  │ ─── shared ────────────────────────────────────────────────  │
              │  │ punch / callout-stack  ┃ Beat hooks giữa scene               │
              │  │ comment-bubble         ┃ CTA inbox                           │
              │  │ contact-card           ┃ End card (avatar + QR + hotline)    │
              │  └──────────────────────────────────────────────────────────────┘
              │
              ├─ B-roll mapping DIFFERS:
              │   - Parent: 1 broll-image/10-15s ambient
              │   - Apartment-detail: b-roll = INPUT for scene variants (floorplan,
              │     interior, amenity photos). Standalone `broll-image` rare.
              │
              ├─ SFX cues: vẫn 4-6/60s (no change vs parent)
              ├─ Zoom hooks: 1 per scene boundary + 1 per emphasis (~12-18/60s)
              ├─ Contact-card END (same as parent)
              │
              ├─ CHECKPOINT #2 — user duyệt overlays-outline-apartment.json
              │   (xem scene flow + asset assignment trước khi finalize)
              │
              ├─ Merge → public/overlays-apartment.json (KHÔNG ghi overlays-general.json)
              ├─ Run validate.py (cùng validator parent)
              ├─ Wait for source.mp4
              └─ Echo Studio URL → user CHỌN COMPOSITION `BdsApartmentDetail` trong Studio sidebar
   │
   ▼
User mở Studio → chọn `BdsApartmentDetail` → preview → render
```

**Lưu ý composition switching:** Studio sidebar liệt kê 2 compositions:
- `BdsGeneralReview` (sibling skill output)
- `BdsApartmentDetail` (skill này output)

Mỗi composition đọc file JSON riêng — KHÔNG xung đột nhau. User có thể preview 2 video song song bằng cách switch composition.

## Inputs (khác parent)

| Param | Required | Format / Default | Khác parent |
|---|---|---|---|
| Script text | Yes | `.txt`/`.md` hoặc inline. ≤ 5000 ký tự | Same |
| Slug | No | Auto-derive | Same |
| `floorplan_images` | **Recommended** | Folder hoặc list path tới ảnh mặt bằng (studio.jpg / 1pn.jpg / 2pn-a.jpg ...) | **NEW** — input cho `scene-apartment-price`. Nếu thiếu → packager dùng `interior-living.jpg` placeholder + WARN user. |
| `interior_images` | **Recommended** | Folder ảnh close-up nội thất (kitchen.jpg / bathroom.jpg / livingroom.jpg) | **NEW** — input cho `scene-finishing-detail`. Background image full-frame. |
| `amenity_images` | **Recommended** | Folder ảnh tiện ích (gym.jpg / pool.jpg / yoga.jpg / sky-bar.jpg ...) | **NEW** — input cho `scene-amenity-grid` cells. Cần ≥4 ảnh để fill 2×2 grid. |
| `spec_sheet` | Optional | JSON `[{label, value}]` hoặc inline list. Skill auto-extract từ script nếu thiếu. | **NEW** — input cho `scene-spec-row` rows. |
| `price_tiers` | Optional | JSON `[{tier, meta, price, highlight?}]` hoặc inline. | **NEW** — input cho `scene-price-package` tiers. |
| `finishing_brands` | Optional | List `{room, label, brand, icon?}` (e.g. `{room: "kitchen", label: "Mặt đá bếp", brand: "Caesarstone"}`). Skill auto-extract từ script nếu thiếu. | **NEW** — input cho callouts của `scene-finishing-detail`. |
| `broll_folder` | Optional | Same parent — chỉ dùng cho `broll-image` ambient inserts (hiếm). | Reduced role |
| `logos_folder` | Yes | `avatar.jpg` + `qr-contact.jpg` cho contact-card | Same |
| `hotline` + `brand_name` | Yes | Cho contact-card | Same |
| `tts_provider` / `voice_id` | No | Same parent | Same |
| `auto_overlays` | No | Skip checkpoint #2. Default `false` | Same |

**Quy ước đặt tên ảnh** (giúp packager auto-map):
- Floorplan: `floorplan-<layout>.jpg` (e.g. `floorplan-studio.jpg`, `floorplan-2pn.jpg`)
- Interior: `interior-<room>.jpg` (e.g. `interior-kitchen.jpg`, `interior-bathroom.jpg`, `interior-living.jpg`)
- Amenity: `amenity-<name>.jpg` (e.g. `amenity-gym.jpg`, `amenity-pool.jpg`)

Nếu không follow convention, user phải pass explicit JSON mapping.

**Quy ước asset folder per-video (BẮT BUỘC):**

Mỗi video có folder b-roll RIÊNG đặt theo slug. Packager phải:
1. Tạo folder `public/broll/<slug>/` (init_project.sh handles this).
2. Copy/move tất cả input images (floorplan / interior / amenity / ambient broll) vào folder đó.
3. Trong JSON, mỗi `image_path` / `images[]` / `cells[].image_path` phải dùng path đầy đủ `broll/<slug>/filename.jpg` — KHÔNG dùng bare filename (legacy fallback sẽ 404).
4. Asset CHUNG giữa nhiều video → duplicate vào folder mỗi video. KHÔNG share qua broll/ root.
5. Avatar + QR vẫn ở `logos/` (không thuộc broll). `avatar_path: "logos/avatar.jpg"`, `qr_path: "logos/qr-contact.jpg"`.

Ví dụ layout chuẩn cho 2 video song song:
```
public/broll/
├── linh-lumiere-comparison/      ← general video slug
│   ├── facade.jpg
│   ├── clubhouse-pool.jpg        ← shared, duplicated here
│   └── ...
└── apartment-detail-demo/         ← apartment video slug
    ├── interior-living.jpg
    ├── clubhouse-pool.jpg        ← shared, duplicated here
    └── ...
public/logos/
├── linh-avatar.jpg
└── qr-contact.jpg
```

## Component pool — apartment-detail flavor

| Variant | Khi dùng | Required fields |
|---|---|---|
| `scene-spec-row` | Tổng quan đầu video — diện tích / hướng / tầng / view / phòng | `title`, `rows[]` (3-6 rows of `{icon, label, value}`) |
| `scene-apartment-price` | Mặt bằng từng layout — 1 image full-screen, 2 stacked, 3+ cycle | `title` ("CĂN STUDIO"), `subtitle` ("(31.9M²)"), `images[]` |
| `scene-finishing-detail` | Close-up nội thất bếp/tắm/phòng khách + 1-4 brand callout pills | `image_path` (background), `callouts[]` (`{label, brand, icon?}`) |
| `scene-amenity-grid` | Gallery tiện ích 4-6 cái xuất hiện cùng frame | `title`, `cells[]` (4-6 cells of `{image_path, caption, icon?}`) |
| `scene-price-package` | Bảng giá theo tier với highlight 1 tier nổi bật | `title`, `tiers[]` (`{tier, meta?, price, highlight?}`), `footer?` |
| `punch` / `callout-stack` | Beat hooks giữa scenes (urgency, brand drops, tagline) | Same parent |
| `comment-bubble` | CTA inbox giữa video | Same parent |
| `contact-card` | End card cuối video (t = duration - 6) | Same parent |

**Component pool RỘNG HƠN parent** vì có thêm 5 scene full-screen apartment-specific. Tổng = 9 variant trong play.

**Anti-pattern:** Đừng dùng `price-red-3d` / `price-with-brand` cho bảng giá trong skill này — dùng `scene-price-package` thay vì (display tier cards thay vì 1 con số).

## Recommended scene flow (60-120s video)

```
00:00-00:05  ┃ HOOK (avatar talking, không overlay full-screen, chỉ punch text)
00:05-00:12  ┃ scene-spec-row              ┃ Tổng quan thông số căn hộ
00:12-00:20  ┃ scene-apartment-price       ┃ Mặt bằng layout 1 (studio)
00:20-00:28  ┃ scene-apartment-price       ┃ Mặt bằng layout 2 (1PN/2PN)
00:28-00:38  ┃ scene-finishing-detail      ┃ Bếp + brand callouts
00:38-00:46  ┃ scene-finishing-detail      ┃ Phòng tắm + brand callouts
00:46-00:55  ┃ scene-amenity-grid          ┃ Tiện ích 4-6 cái
00:55-01:05  ┃ scene-price-package         ┃ Bảng giá tier
01:05-01:15  ┃ callout-stack + punch       ┃ Urgency hook (mở bán, hạn chỗ)
01:15-01:22  ┃ comment-bubble              ┃ CTA inbox
01:22-01:28  ┃ contact-card                ┃ End card
```

Adjust theo độ dài script. Mỗi scene full-screen nên ≥ 4s để viewer kịp đọc.

## Workspace layout (giống parent — chỉ khác filename JSON)

```
workspace/
├── remotion-project/
│   ├── src/                        # SHARED — 2 compositions, 14 variants
│   ├── public/
│   │   ├── voiceover.mp3
│   │   ├── source.mp4
│   │   ├── overlays-general.json   # ← sibling output (preserved)
│   │   ├── overlays-apartment.json # ← THIS SKILL output
│   │   ├── caption-groups.json
│   │   ├── broll/                  # Per-project images
│   │   ├── logos/
│   │   ├── bgm/ + sfx/             # Defaults
│   └── ...
└── content/YYYY-MM-DD/<slug>/
    ├── script.txt
    ├── voiceover.mp3
    ├── source.mp4
    ├── transcript-cleaned.json
    ├── caption-groups.json
    ├── overlays-outline-apartment.json   # Pre-checkpoint preview (THIS skill)
    ├── overlays-apartment.json           # FINAL (THIS skill)
    ├── floorplans/                       # NEW input folder
    ├── interiors/                        # NEW input folder
    ├── amenities/                        # NEW input folder
    ├── broll/                            # Optional ambient
    └── logos/
```

## Workflow

### Step 0 — Setup (giống parent + check apartment-specific inputs)

1. Validate `len(script) ≤ 5000`.
2. Derive slug.
3. Detect inputs:
   - **Critical:** `logos/avatar.jpg`, `logos/qr-contact.jpg`, hotline, brand_name (như parent)
   - **Apartment-specific:** `floorplans/`, `interiors/`, `amenities/` folders. Count files mỗi folder. Nếu CẢ 3 thiếu → confirm user có muốn skip scene full-screen apartment không (nếu skip → dùng parent skill thay vì).
   - **Optional:** `spec_sheet`, `price_tiers`, `finishing_brands` (skill tự extract nếu thiếu).
4. Validate TTS provider key.
5. Tạo workspace dir + save script.
6. Copy floorplans/interiors/amenities/broll/logos vào workspace (ASCII rename nếu cần).
7. Báo user counts.

### Step 1 — Phase 1 (giống parent)

Reuse `.claude/skills/mkt-elevenlabs-tts-to-mp3/scripts/text_to_mp3.py`.

### Step 2 — Checkpoint #1 (giống parent)

User duyệt MP3.

### Step 3 — Phase 2 + Phase 3 parallel (Phase 2 giống parent, Phase 3 DIFFERS)

**Agent A — HeyGen background:** Identical to parent skill (call `/heygen-mp3-to-mp4`).

**Agent B — Phase 3 packager apartment-detail flavor:**

Until a dedicated agent definition exists (`mkt-full-video-phase3-remotion-apartment-detail-packager`), spawn via `general-purpose` agent with the full prompt template in [references/phase3-prompt-template.md](references/phase3-prompt-template.md). Key differences from parent packager:

```
subagent_type: general-purpose
prompt: |
  Phase 3 apartment-detail packager. Reuse Whisper transcribe + caption-groups
  helpers from .claude/skills/mkt-full-video-with-11-remotion-heygen/scripts/.

  workspace_dir: <workspace>
  slug: <slug>
  script_text: <full text>
  composition_target: BdsApartmentDetail       # ← KEY DIFFERENCE
  output_json_filename: overlays-apartment.json # ← KEY DIFFERENCE
  component_pool: 9_apartment_variants          # ← KEY DIFFERENCE
  inputs:
    floorplans: [list]
    interiors: [list]
    amenities: [list]
    spec_sheet: <inline JSON or null>
    price_tiers: <inline JSON or null>
    finishing_brands: <inline JSON or null>
    logos: { avatar, qr }
    contact: { name, hotline }

  Steps:
  1. Run Whisper on voiceover.mp3 → transcript-cleaned.json
  2. Group captions (3-5 words/group) → caption-groups.json
  2b. **Align captions to script.txt** via `align_to_script.py` (source of truth fix — Whisper mis-hears brand names, accents, numbers). Overwrites caption-groups.json + emits transcript-aligned.json.
  3. Segment script into 6-10 scenes per recommended scene flow
  4. For each scene, pick 1 variant from the apartment pool + assign assets
  5. Add beat hooks (punch / callout-stack) between scenes
  6. Add comment-bubble + contact-card end
  7. Write overlays-outline-apartment.json
  8. CHECKPOINT #2 — user duyệt
  9. After OK, write public/overlays-apartment.json
  10. Wait for source.mp4 (HeyGen)
  11. Run init_project.sh + validate.py
  12. Echo Studio URL — REMIND user to switch to BdsApartmentDetail composition
```

### Step 4 — Hand off (similar to parent, with composition reminder)

```markdown
## Pipeline DONE — preview ready
**Workspace:** <workspace>
**Phase 1:** voiceover.mp3 — <D>s
**Phase 2:** source.mp4 — <D>s
**Phase 3:** <N> overlays (incl. <S> scene full-screen, <C> CTA), <Z> zoom hooks
**Studio:** http://localhost:3000
  → **Choose composition `BdsApartmentDetail`** in sidebar (NOT BdsGeneralReview)
**Render:** `cd workspace/remotion-project && npx remotion render BdsApartmentDetail`
```

## Critical orchestration rules (deltas vs parent)

Same 15 rules as parent, plus:

16. **Output filename:** `overlays-apartment.json` (NOT `overlays.json` / `overlays-general.json`).
17. **Composition target:** `BdsApartmentDetail` (Studio + render CLI).
18. **Component pool 9 variant** — see table above. NO `price-red-3d` / `price-with-brand` for tier tables (use `scene-price-package`).
19. **B-roll role reversed** — most images are INPUTS to scene variants (floorplans, interiors, amenities), not standalone `broll-image` overlays.
20. **Scene duration min 4s** — full-screen takeover scenes need viewer reading time.
21. **Max 1 finishing-detail per room** — don't stack 2 kitchen close-ups in a row.
22. **Highlight max 1 tier** in `scene-price-package` — if user wants 2 highlighted, pick the bigger seller (usually 2PN/3PN family unit).
23. **Per-video b-roll folder mandatory** — all `image_path` / `images[]` use `broll/<slug>/filename.jpg`. Shared assets duplicated, not symlinked. Avatar+QR stay in `logos/`. See "Quy ước asset folder per-video" above.

## Failure modes (deltas)

| Symptom | Hành động |
|---|---|
| Studio empty / fallback "overlays-apartment.json not found" | Packager chưa write file. Re-run Phase 3. |
| Studio shows General Review video instead | User chọn sai composition. Switch to `BdsApartmentDetail` in sidebar. |
| `scene-amenity-grid` cells empty | < 4 ảnh trong `amenities/`. Cần ≥ 4 cho 2×2, ≥ 5 cho 2×3. |
| `scene-finishing-detail` callouts không xuất hiện | Mỗi callout cần `label` + `brand`. Optional `icon`. Check JSON. |
| `scene-price-package` highlight bị mất | Set `highlight: true` trên ĐÚNG 1 tier. Multiple `highlight: true` vẫn render nhưng visual hierarchy giảm. |

## References

- **Parent skill (shared Phase 1+2)** — [`../mkt-full-video-with-11-remotion-heygen/SKILL.md`](../mkt-full-video-with-11-remotion-heygen/SKILL.md)
- **Phase 3 prompt template** — [`references/phase3-prompt-template.md`](references/phase3-prompt-template.md)
- **Apartment variant catalog** — [`references/variant-catalog.md`](references/variant-catalog.md)
- **Demo JSON** — `workspace/remotion-project/public/overlays-apartment.json`
- **Component source** — `workspace/remotion-project/src/overlays/SceneApartmentPrice.tsx`, `SceneSpecRow.tsx`, `SceneAmenityGrid.tsx`, `SceneFinishingDetail.tsx`, `ScenePricePackage.tsx`
- **Validator** — same as parent: `.claude/skills/mkt-full-video-with-11-remotion-heygen/scripts/validate.py`
- **init_project.sh** — same as parent.
