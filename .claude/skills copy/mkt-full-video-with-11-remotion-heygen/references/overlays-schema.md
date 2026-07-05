# overlays.json schema — BDSGeneralTemplate

The Phase 3 packager writes **one** `overlays.json` per workspace. Remotion's `calculateMetadata` in [`src/Root.tsx`](../templates/BDSGeneralTemplate/src/Root.tsx) reads it directly via `staticFile('overlays.json')` (NOT `assets/overlays.json` — see [`lessons-learned.md`](lessons-learned.md)).

Validate with: `python3 scripts/validate.py path/to/overlays.json`

---

## Top-level shape

```json
{
  "$schema": "overlays-v1",
  "aesthetic": "broker_creator",
  "slug": "<project-slug>",
  "video_duration": 112.41,
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "assets": {
    "source_video": "source.mp4",
    "voiceover": "voiceover.mp3",
    "captions": "caption-groups.json"
  },
  "overlays": [ /* 8-25 entries */ ],
  "zoom_hooks": [ /* 15-22 entries */ ],
  "sfx_cues":   [ /* ≤6 entries */ ]
}
```

### Field rules

| Field | Type | Notes |
|---|---|---|
| `$schema` | string | Always `"overlays-v1"` |
| `aesthetic` | string | Currently only `"broker_creator"` |
| `slug` | string | Project slug — matches workspace folder name |
| `video_duration` | number (sec) | = ffprobe duration of `voiceover.mp3` + 3s tail (for contact-card playout). Total `t_start + duration` of all overlays must fit inside this. |
| `fps` | int | 30 (standard for BDSGeneralTemplate). Validator warns for non-standard values. |
| `width` × `height` | int × int | 1080 × 1920 locked (9:16 portrait). Validator warns otherwise. |
| `assets.source_video` | string | Always `"source.mp4"` (filename inviolable — Root.tsx fetches by exact name) |
| `assets.voiceover` | string | Always `"voiceover.mp3"` |
| `assets.captions` | string | `"caption-groups.json"` if captions exist, else omit |
| `overlays` | array | Each entry conforms to one of 9 variant shapes (see [variant-catalog.md](variant-catalog.md)) |
| `zoom_hooks` | array | Avatar zoom timings — see below |
| `sfx_cues` | array | Optional — see below |

---

## `overlays[]` common fields

Every overlay entry shares:

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Unique within file. Pattern `^[a-z0-9][a-z0-9-_]*\d*$` or `o\d{2,3}` |
| `variant` | string | yes | One of the 9 allowed names |
| `t_start` | number (sec) | yes | Must be `>= 0` and `< video_duration` |
| `duration` | number (sec) | yes | Must be `> 0`. Typical 1.5-3.0s |

Plus variant-specific props — see [variant-catalog.md](variant-catalog.md).

---

## `zoom_hooks[]` shape

Avatar zoom timings. The `Avatar.tsx` component aggregates all active hooks via `computeAvatarScale()` and applies the product as `transform: scale(...)`.

```json
{ "t": 1.89, "type": "doublepop", "peak": 1.10 }              // soft2step | quickpop | doublepop
{ "t": 14.82, "type": "zoomout", "low": 0.94, "duration": 0.8 }
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `t` | number (sec) | yes | When the hook starts |
| `type` | string | yes | One of `soft2step`, `quickpop`, `doublepop`, `zoomout` |
| `peak` | number | yes for non-zoomout | Scale peak. 1.04–1.10 typical. Validator errors if `< 1.0`, warns if `> 1.15`. |
| `low` | number | yes for `zoomout` | Scale low, must be `< 1.0` (e.g. 0.94 = 6% zoom-out) |
| `duration` | number (sec) | yes for `zoomout` | How long the zoom-out lasts |

**Rhythm rule:** max gap between consecutive `t` values = **4s** (validator warns above).

**Distribution rule:** for 60s of video, target 15-20 hooks total. Mix:
- ~60% `quickpop` (peak 1.04-1.07)
- ~20% `soft2step` (peak 1.08-1.10) — major beats only, 4-5x max
- ~10% `doublepop` (peak 1.05-1.07) — 1-2x urgency moments
- ~10% `zoomout` (low 0.94-0.97, duration 0.5-1.0)

---

## `sfx_cues[]` shape

Optional. Each cue triggers a sample at a specific time. `SfxTrack.tsx` plays them via `<Html5Audio>` Sequences.

```json
{ "t": 1.89, "file": "pop.wav", "volume": 0.35 }
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `t` | number (sec) | yes | When to fire |
| `file` | string | yes | **Basename only** — e.g. `"pop.wav"`. Validator warns on paths with `/`. Resolved against `public/sfx/`. |
| `volume` | number | no (default 0.3) | Range [0.0, 1.0]. Typical 0.25-0.40 |

**Budget:** ≤ 6 cues per 60s video. Validator warns above 6 (cluttered audio).

See [variant-catalog.md § SFX cues](variant-catalog.md#sfx-cues--14-file-bđs-library-budget--6-per-video) for the cue → SFX mapping cheat sheet.

---

## Complete worked example

A 109s BĐS comparison video (Royal City vs Metropolis vs Masterise Cao Xà Lá):

```json
{
  "$schema": "overlays-v1",
  "aesthetic": "broker_creator",
  "slug": "linh-lumiere-comparison",
  "video_duration": 112.41,
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "assets": {
    "source_video": "source.mp4",
    "voiceover": "voiceover.mp3",
    "captions": "caption-groups.json"
  },
  "overlays": [
    { "id": "o01", "variant": "price-with-brand", "t_start": 1.89, "duration": 2.8,
      "price_text": "170 TR/M²", "brand_text": "Royal City" },
    { "id": "o02", "variant": "price-with-brand", "t_start": 5.62, "duration": 2.8,
      "price_text": "260 TR/M²", "brand_text": "Metropolis" },
    { "id": "o03", "variant": "comment-bubble", "t_start": 11.01, "duration": 2.5,
      "username": "@linhaloha", "comment_text": "Inbox Linh Aloha ngay nhé!" },
    { "id": "o04", "variant": "callout-stack", "t_start": 14.82, "duration": 2.5,
      "setup_text": "Lợi thế số 1", "emphasis_text": "CHÍNH SÁCH TỐT NHẤT",
      "setup_color": "#1f7ae0", "emphasis_color": "#2bb24c" },
    { "id": "br01", "variant": "broll-image", "t_start": 17.5, "duration": 3.5,
      "image_path": "broll/facade.jpg", "caption": "LUMIÈRE HÀ NỘI" },
    { "id": "o05", "variant": "punch-2line", "t_start": 17.41, "duration": 2.8,
      "text": "Cao Xà Lá\nSEASONS GARDEN",
      "color": "#f4b324", "subtitle_color": "#2bb24c", "headline_font": "script" },
    { "id": "o06", "variant": "price-red-3d", "t_start": 21.84, "duration": 2.5,
      "text": "MASTERISE CAO XÀ LÁ" },
    { "id": "o07", "variant": "price-with-brand", "t_start": 28.69, "duration": 2.8,
      "price_text": "120 TR/M²", "brand_text": "Lumière Cao Xà Lá" },
    { "id": "o08", "variant": "punch", "t_start": 39.28, "duration": 1.8,
      "text": "THỨ NHẤT", "color": "#ffd60a" },
    { "id": "o09", "variant": "price-red-3d", "t_start": 41.5, "duration": 2.5,
      "text": "190-210 TR/M²" },
    { "id": "contact-card", "variant": "contact-card", "t_start": 106.41, "duration": 6.0,
      "avatar_path": "logos/linh-avatar.jpg", "qr_path": "logos/qr-contact.jpg",
      "name": "EM LINH ALOHA", "cta_text": "QUÉT MÃ LIÊN HỆ", "hotline": "0977.856.086" }
  ],
  "zoom_hooks": [
    { "t": 1.89,   "type": "doublepop", "peak": 1.10 },
    { "t": 5.62,   "type": "doublepop", "peak": 1.10 },
    { "t": 14.82,  "type": "zoomout",   "low":  0.94, "duration": 0.8 },
    { "t": 17.41,  "type": "soft2step", "peak": 1.12 },
    { "t": 106.41, "type": "zoomout",   "low":  0.92, "duration": 0.8 }
  ],
  "sfx_cues": [
    { "t": 1.89,   "file": "ting.mp3",  "volume": 0.35 },
    { "t": 14.82,  "file": "pop.wav",   "volume": 0.35 },
    { "t": 21.84,  "file": "pop.wav",   "volume": 0.35 },
    { "t": 106.41, "file": "digital-device.wav", "volume": 0.30 }
  ]
}
```

A golden sample lives at [`examples/linh-lumiere-comparison.overlays.json`](examples/) (29 overlays, 21 zoom hooks, 6 SFX cues, 112.41s) — written by the Phase 3 packager for the linh-lumiere-comparison project.

---

## Common errors

| Error | Fix |
|---|---|
| `unknown variant 'punch-white'` | Replace with `punch` + `color: '#ffffff'` (see [lessons-learned.md § 1](lessons-learned.md)) |
| `unknown variant 'count-up-money'` | Replace with `price-red-3d` + final value as text |
| `assets.voiceover: must be non-empty string, got None` | Add `"voiceover": "voiceover.mp3"` to assets |
| `t_start >= video_duration` | Either reduce t_start or increase video_duration (typically +3s for contact-card tail) |
| `variant 'broll-image' missing required fields: ['image_path']` | Use `image_path` (not `imagePath` or `src`) |
| `overlays[N] overlaps overlays[M]` (warning) | Intentional if one is broll-image (z=60) and the other text (z=80) — validator skips broll pairs |
| zoom_hooks gap >4s (warning) | Add an extra `quickpop` at the midpoint to keep avatar alive |
