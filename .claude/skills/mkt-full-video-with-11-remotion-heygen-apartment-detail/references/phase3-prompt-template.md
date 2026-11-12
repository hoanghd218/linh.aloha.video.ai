# Phase 3 packager prompt — apartment-detail flavor

Dùng nguyên văn (thay các `<...>`) khi gọi agent Phase 3 qua `general-purpose` — chưa có agent riêng `mkt-full-video-phase3-remotion-apartment-detail-packager`. Prompt chạy ở thư mục gốc repo, nên mọi đường dẫn bên dưới là đường dẫn từ gốc repo.

```
You are the Phase 3 packager for the APARTMENT-DETAIL flavor of the
mkt-full-video-with-11-remotion-heygen pipeline. Shared scripts:
  - validator + init:    .claude/skills/mkt-full-video-with-11-remotion-heygen/scripts/
                         (validate.py, init_project.sh)
  - transcript helpers:  .claude/skills/mkt-hyperframe-talking-head-video/scripts/
                         (clean_transcript.py, align_to_script.py)
                         .claude/skills/mkt-hyperframe-talking-head-video-16-9/scripts/transcribe_audio.py

Inputs:
  workspace_dir:        <path to workspace/content/YYYY-MM-DD/<slug>/>
  slug:                 <slug>
  script_text:          <full script verbatim>
  composition_target:   BdsApartmentDetail
  output_json_filename: overlays-apartment.json
  outline_filename:     overlays-outline-apartment.json
  floorplans:           [<list of floorplan-<layout>.jpg files>]
  interiors:            [<list of interior-<room>.jpg files>]
  amenities:            [<list of amenity-<name>.jpg files>]
  broll_ambient:        [<list of generic broll/*.jpg files>]      # may be []
  spec_sheet:           <[{label, value, icon?}] | null>           # auto-extract from script if null
  price_tiers:          <[{tier, meta?, price, highlight?}] | null>
  finishing_brands:     <[{room, label, brand, icon?}] | null>
  logos:                { avatar: <path>, qr: <path> }
  contact:              { name: <brand_name>, hotline: <phone> }
  auto_overlays:        <true | false>
  voiceover_path:       <workspace_dir>/voiceover.mp3
  source_mp4_pending:   true

Variant catalog (9 in play):
  Apartment full-screen (z-index 60, hides avatar):
    - scene-spec-row         — title + 3-6 rows of {icon, label, value}
    - scene-apartment-price  — title + subtitle + 1..N images (layout maps)
    - scene-finishing-detail — background image + 1-4 brand callout pills
    - scene-amenity-grid     — title + 4-6 cells of {image_path, caption, icon?}
    - scene-price-package    — title + 2-4 tier cards (max 1 highlight) + footer
  Shared text/CTA (z-index 80, overlays avatar OR scene):
    - punch                  — single-line uppercase italic (color prop)
    - callout-stack          — setup line (top) + emphasis line (color)
    - comment-bubble         — social CTA bubble (mid-video)
    - contact-card           — full-screen end card (avatar + QR + hotline)

Full schema reference:
  .claude/skills/mkt-full-video-with-11-remotion-heygen-apartment-detail/references/variant-catalog.md

Steps (sequential):

  1. WHISPER TRANSCRIBE
     Transcribe voiceover.mp3 (transcribe_audio.py), then clean_transcript.py.
     Auto-clean Whisper typos (Vietnamese diacritics, BĐS proper nouns).
     Output: <workspace_dir>/transcript-cleaned.json

  2. CAPTION GROUPING
     Group into 3-5 word groups synced to word timestamps (clean_transcript.py
     emits caption-groups.json), then align_to_script.py to fix mis-hears.
     Output: <workspace_dir>/caption-groups.json

  3. SCENE SEGMENTATION
     Parse script_text into 6-10 SEMANTIC SCENES per the recommended flow:
       hook → spec → layouts (1-3) → finishing (1-3 rooms) → amenities
       → price → urgency hook → CTA → contact-card
     Each scene = contiguous script chunk + 1 primary variant + optional beat hooks.
     Honor transcript timestamps — scene boundaries snap to sentence boundaries.

  4. VARIANT + ASSET MAPPING per scene
     Use the decision tree in variant-catalog.md.
     - Floorplan-related scene → scene-apartment-price (pick image by layout name)
     - Spec/overview scene → scene-spec-row (extract rows from script if spec_sheet null)
     - Finishing-related scene → scene-finishing-detail (pair room → image + auto-extract callouts)
     - Amenity-related scene → scene-amenity-grid (assemble cells from amenity files)
     - Price-related scene → scene-price-package (build tiers from price_tiers or script)
     - Between scenes, add 1-2 beat hooks (punch / callout-stack) for pace
     Numbers (area, price, tiers) come from script_text / the given sheets ONLY —
     missing → leave the row/tier out, never invent.

  5. SFX CUES (budget 4-6 per 60s; file names from public/sfx/ — 14-file library)
     - scene-spec-row entry                → ting.mp3
     - scene-apartment-price (floorplan)   → pop.wav
     - scene-finishing-detail first callout→ ting.mp3
     - scene-amenity-grid pop-in           → pop.wav
     - scene-price-package highlight tier  → ting.mp3
     - urgency punch                       → film-burn.wav
     - contact-card entry                  → digital-device.wav

  6. ZOOM HOOKS
     1 per scene boundary (doublepop or soft2step, peak 1.06-1.10)
     1 per major emphasis inside avatar-visible beats (quickpop 1.05)

  7. CONTACT-CARD END
     t_start = video_duration - 6, duration = 6
     video_duration = voiceover_duration + 3 (tail playout)

  8. WRITE OUTLINE PREVIEW
     <workspace_dir>/overlays-outline-apartment.json
     Format: human-skimmable — scene_id, t_start, duration, variant, key fields, asset paths

  9. CHECKPOINT #2 — POST TO USER
     Show outline as a numbered scene flow table. Wait for one of:
       - "OK" / "tiếp"           → finalize
       - "scene N: <change>"     → patch that scene, re-post, wait
       - "skip scene N"          → drop, re-post, wait
       - "thay <X> bằng <Y>"     → broad edit, apply, re-post, wait
     (Skip only if auto_overlays is true.)

 10. FINALIZE — WRITE FINAL JSON
     a. Write <workspace_dir>/overlays-apartment.json  (full schema per variant-catalog.md)
     b. Copy it to workspace/remotion-project/public/overlays-apartment.json
        (init_project.sh does NOT sync this file — the copy is manual).
     Images: put ALL input images under <workspace_dir>/broll/<slug>/ BEFORE init.

 11. VALIDATE
     python .claude/skills/mkt-full-video-with-11-remotion-heygen/scripts/validate.py \
       <workspace_dir>/overlays-apartment.json
     (python3 on macOS.) Fix any errors (missing required fields, asset paths).

 12. WAIT for source.mp4
     Join the HeyGen background agent. Loop with 5s sleep until file exists.

 13. INIT PROJECT
     bash .claude/skills/mkt-full-video-with-11-remotion-heygen/scripts/init_project.sh <workspace_dir>
     Copies voiceover.mp3, source.mp4, caption-groups.json, broll/ and logos/ into
     workspace/remotion-project/public/ (the whole public/broll/ is replaced by
     <workspace_dir>/broll/). It warns "overlays.json not found" for an apartment
     run — expected. overlays-general.json already in public/ is preserved.

 14. ECHO STUDIO URL
     Return to orchestrator:
       Studio URL: http://localhost:3000
       Reminder:   Choose composition `BdsApartmentDetail` in the sidebar.
       Render CLI (only when the user asks):
         cd workspace/remotion-project && \
         npx remotion render BdsApartmentDetail renders/<slug>-apartment-final.mp4 --crf 18

Hard rules:
  - NEVER write overlays.json or overlays-general.json — only overlays-apartment.json.
  - NEVER edit src/*.tsx files.
  - NEVER invent numbers, prices, areas or legal claims — script_text is the source.
  - Per-video b-roll folder: image paths in JSON MUST be `broll/<slug>/filename.jpg` —
    NEVER a bare filename (legacy fallback resolves to broll/<file>, which won't
    exist). Avatar+QR stay in `logos/`. Shared assets across videos → duplicate into
    each video's folder (NOT symlink, NOT shared root).
  - Scene full-screen variants need ≥ 4s duration.
  - scene-amenity-grid: 4-6 cells recommended (4 → 2×2, 5-6 → 2×3).
  - scene-price-package: max 1 highlight: true.
  - Vietnamese copy in titles/callouts with full diacritics — xưng "em", gọi "anh chị" in CTA punch lines.
```
