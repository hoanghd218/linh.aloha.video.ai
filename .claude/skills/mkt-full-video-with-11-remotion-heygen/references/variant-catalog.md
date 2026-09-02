# Variant Catalog — BDSGeneralTemplate (10 overlay variants)

Decision guide for the Phase 3 packager: given an emphasis moment from the transcript, pick exactly one of these 10 variants. The variant name must match `ALLOWED_VARIANTS` in `scripts/validate.py` and `src/overlays/index.tsx` exactly.

**This is authoritative.** If you write a variant name not in this list, `validate.py` will fail.

---

## Quick decision tree

```
Is this a brand / project / location reveal?
├── 1 word        → punch (color='#ffffff')
├── 2-3 words     → punch-2line (text="LINE 1\nLINE 2")
└── price + brand → price-with-brand

Is this a price / number reveal?
├── Hero number with brand label  → price-with-brand
├── Just a big number             → price-red-3d
└── Number in flowing copy        → punch (color='#e63946')

Is this an urgency / FOMO / scarcity word?
└── punch (color='#ffd60a')

Is this a setup + emphasis line (e.g. "Đây mới là GIÁ ĐÁY")?
└── callout-stack

Is this a 2-line benefit / icon explainer?
└── icon-stack (with icon_path)

Is this a full-screen project visual (b-roll image)?
└── broll-image (caption optional, max 8 words)

Is this social proof / comment / CTA bubble?
└── comment-bubble

Is this the END card (avatar + QR + hotline)?
└── contact-card (always once, at t = total_duration - 6)
```

---

## Variant reference

### 1. `punch` — single-line text overlay

The workhorse. One word or short phrase, scale-pop entry.

| Field | Type | Required | Notes |
|---|---|---|---|
| `text` | string | yes | UPPERCASE recommended |
| `color` | hex string | no | Default `#ffffff`. `#e63946` red for urgency/price, `#ffd60a` yellow for warning/scarcity |
| `italic` | boolean | no | Default false |
| `placement` | `"top"\|"bottom"` | no | Default `top` |

```json
{ "id": "o03", "variant": "punch", "t_start": 39.28, "duration": 1.8, "text": "THỨ NHẤT", "color": "#ffd60a" }
```

**When:** Punchy single-word emphasis. Brand reveals, urgency tags, list markers ("THỨ NHẤT", "THỨ HAI").

---

### 2. `punch-2line` — two-line stacked uppercase

Stacked text for compound brand names or two-beat reveals.

| Field | Type | Required | Notes |
|---|---|---|---|
| `text` | string | yes | Use `\n` to split lines |
| `color` | hex string | no | Headline (line 1) color. Default white |
| `subtitle_color` | hex string | no | Line 2 color. Defaults to `color` — set it to make a **two-color lockup** (e.g. gold brand name + white tagline) |
| `headline_font` | `"display"\|"script"` | no | Default `display` (Mulish 900 italic). `script` = **Dancing Script gold calligraphy** for brand/project name moments. Write the text in **Title Case** when using script (e.g. `"Cao Xà Lá"`, not `"CAO XÀ LÁ"`) — script faces look wrong in all-caps |
| `placement` | `"top"\|"bottom"` | no | Default top |

```json
{ "id": "o05", "variant": "punch-2line", "t_start": 17.41, "duration": 2.8, "text": "LUMIÈRE HÀ NỘI\nSEASONS GARDEN" }
```

Two-color lockup + script headline (broker-creator palette):
```json
{ "id": "o01", "variant": "punch-2line", "t_start": 0.5, "duration": 2.5, "text": "Cao Xà Lá\nSAU 20 NĂM", "color": "#f4b324", "subtitle_color": "#ffffff", "headline_font": "script" }
{ "id": "o09", "variant": "punch-2line", "t_start": 29.2, "duration": 2.5, "text": "HAI TÒA L1 VÀ L2\nHANOI SEASONS GARDEN", "color": "#ffffff", "subtitle_color": "#2bb24c" }
```

**When:** Project full name, dual-concept reveals ("MUA TỪ MÓNG\nGIÁ ĐÁY"), brand+tagline. Use `headline_font:"script"` + gold `#f4b324` for the signature project/brand name hook; use `subtitle_color` to color the second line green `#2bb24c` (project name) or red `#e63946` (scarcity).

---

### 3. `price-red-3d` — hero price/number with red 3D shadow

Tall bold text with white fill + black stroke + RED 3D shadow stack. Maximum visual punch.

| Field | Type | Required |
|---|---|---|
| `text` | string | yes |
| `placement` | `"top"\|"bottom"` | no |

```json
{ "id": "o11", "variant": "price-red-3d", "t_start": 41.5, "duration": 2.5, "text": "190-210 TR/M²" }
```

**When:** Standalone hero price/number with no brand label. Big climactic numbers.

---

### 4. `price-with-brand` — price hero + brand label

Like `price-red-3d` but with a small brand label underneath.

| Field | Type | Required |
|---|---|---|
| `price_text` | string | yes |
| `brand_text` | string | yes |
| `placement` | `"top"\|"bottom"` | no |

```json
{ "id": "o01", "variant": "price-with-brand", "t_start": 1.89, "duration": 2.8, "price_text": "170 TR/M²", "brand_text": "Royal City" }
```

**When:** Price comparison reveals where the brand is part of the punch. Hook openers.

---

### 5. `callout-stack` — setup line + emphasis line

Small lead-in line on top + big colored emphasis word/phrase on bottom of the stack.

| Field | Type | Required |
|---|---|---|
| `setup_text` | string | yes | Small lead-in line on top (Title Case, e.g. "Lợi thế số 1") |
| `emphasis_text` | string | yes | Big emphasis line below (UPPERCASE) |
| `emphasis_color` | hex string | no (default `#ffd60a`) | Emphasis line color |
| `setup_color` | hex string | no (default white) | Setup line color — set **blue `#1f7ae0`** for category/label feel like the reference style |
| `placement` | `"top"\|"bottom"` | no |

```json
{ "id": "o04", "variant": "callout-stack", "t_start": 14.82, "duration": 2.5, "setup_text": "Đây mới là", "emphasis_text": "GIÁ ĐÁY", "emphasis_color": "#e63946" }
```

Blue label + colored emphasis (reference broker-creator style):
```json
{ "id": "o13", "variant": "callout-stack", "t_start": 49.9, "duration": 2.8, "setup_text": "Lợi thế số 1", "emphasis_text": "CHÍNH SÁCH TỐT NHẤT", "setup_color": "#1f7ae0", "emphasis_color": "#2bb24c" }
```

**When:** Twist reveals ("Không phải X, mà là Y"), conclusion frames ("Đây là cách CHỐT"), numbered advantages ("Lợi thế số N → ..."). Default pattern: `setup_color` blue + `emphasis_color` green (positive) / red (number/scarcity) / gold (aspirational).

---

### 6. `icon-stack` — optional icon + 2-line stack

Optional icon SVG at top + 2 lines of text. Use for benefit explainers.

| Field | Type | Required |
|---|---|---|
| `line1` | string | yes |
| `line2` | string | yes |
| `icon_path` | string | no (e.g. `'logos/check.svg'`) |
| `color` | hex string | no |
| `placement` | `"top"\|"bottom"` | no |

```json
{ "id": "o07", "variant": "icon-stack", "t_start": 22, "duration": 2.5, "line1": "MIỄN GỐC", "line2": "5 NĂM", "icon_path": "logos/check.svg", "color": "#ffd60a" }
```

**When:** Benefit explainers, feature highlights. Skip `icon_path` if no asset matches.

---

### 7. `broll-image` — full-screen project visual with caption

Renders a full-frame image (1080×1920 object-fit cover) with ken-burns zoom + fade in/out, optional caption overlaid at bottom (italic + rotated -2deg, red 3D shadow).

| Field | Type | Required | Notes |
|---|---|---|---|
| `image_path` | string | yes | Either `'facade.jpg'` or `'broll/facade.jpg'` |
| `caption` | string | no | UPPERCASE recommended, auto-wraps on word boundaries |

```json
{ "id": "br-02", "variant": "broll-image", "t_start": 22.0, "duration": 4.0, "image_path": "broll/main-entrance.jpg", "caption": "MASTERISE CAO XÀ LÁ" }
```

**When:** Show what you're talking about. Project facade, interior, amenity, price table, location aerial. Caption is optional but recommended to anchor what the viewer is seeing.

**Caption rules** (baked into `BrollImage.tsx`):
- Anchored `bottom: 80px` (below caption-pill safe zone)
- `wordBreak: 'keep-all'` — never cuts mid-word (no "MASTERI/SE" splits)
- `maxWidth: 980` — wraps at whitespace, fits within 1080 frame
- 110px italic uppercase bold, white fill + black stroke + red 3D shadow

**Z-index:** broll-image renders at z=60 (BELOW text overlays at z=80). Overlapping text floats ON TOP — by design. Pair b-roll with a `punch`/`callout-stack` at the same `t_start` for max punch.

---

### 8. `comment-bubble` — social CTA / quote bubble

White rounded bubble with optional @username + comment text.

| Field | Type | Required |
|---|---|---|
| `comment_text` | string | yes |
| `username` | string | no (e.g. `@linhaloha`) |

```json
{ "id": "o03", "variant": "comment-bubble", "t_start": 11.01, "duration": 2.5, "username": "@linhaloha", "comment_text": "Inbox Linh Aloha ngay nhé!" }
```

**When:** Social proof, comment-format CTAs, mock testimonials.

---

### 9. `contact-card` — closing avatar + QR + hotline

Full-frame end card. **ALWAYS exactly ONCE per video, at the end.**

| Field | Type | Required |
|---|---|---|
| `avatar_path` | string | yes (e.g. `'logos/avatar.jpg'`) |
| `qr_path` | string | yes (e.g. `'logos/qr.jpg'`) |
| `name` | string | no |
| `cta_text` | string | no (default "QUÉT MÃ LIÊN HỆ") |
| `hotline` | string | no |
| `bg_color` | hex string | no |
| `accent` | hex string | no |

```json
{ "id": "contact-card", "variant": "contact-card", "t_start": 106.41, "duration": 6.0, "avatar_path": "logos/linh-avatar.jpg", "qr_path": "logos/qr-contact.jpg", "name": "EM LINH ALOHA", "cta_text": "QUÉT MÃ LIÊN HỆ", "hotline": "0977.856.086" }
```

**Convention:** `t_start = video_duration - 6`, `duration = 6`. Set top-level `video_duration` in overlays.json to `voiceover_duration + 3` (gives 3s of silence + 6s contact card = ~9s tail past voiceover end with BGM still playing).

**Without avatar + QR assets:** Skip this overlay; substitute with `comment-bubble` + `punch` CTA. Validator warns if total ≥5 overlays and no contact-card.

---

## Color palette (broker-creator)

Semantic palette — assign color by the ROLE of the words, not at random. This is the reference TikТok broker style (gold brand + green project + blue label + red number).

| Use | Hex | Apply to |
|---|---|---|
| White | `#ffffff` | Neutral text, default `punch`, taglines |
| Gold | `#f4b324` | **Brand/developer names** ("MASTERISE HOMES", "Cao Xà Lá"), aspirational words. Pair with `headline_font:"script"` for the signature name hook |
| Green | `#2bb24c` | **Project/subdivision names** ("THE BLOOM", "HANOI SEASONS GARDEN"), positive/benefit words ("CHÍNH SÁCH TỐT NHẤT", "KHÔNG GIAN MỞ") |
| Blue | `#1f7ae0` | **Setup/category labels** — the small `setup_text` line in `callout-stack` ("Lợi thế số 1", "Mật độ xây dựng chỉ") |
| Red | `#e63946` | **Numbers, %, prices, scarcity/urgency** ("28,8%", "71%", "KHI HẾT LÀ HẾT", "NHƯNG KHÔNG!") |
| Yellow | `#ffd60a` | Legacy warning/scarcity accent (still valid; gold `#f4b324` now preferred for brand) |
| Black stroke | `#000000` | 8-direction shadow on all text |

**Quick mapping rule for the packager:** brand name → gold (script) · project name → green · number/% → red · category label → blue · everything else → white.

---

## Zoom hooks (4 types)

Every emphasis word ideally has a corresponding zoom hook within 0.2s. Max 4s gap between hooks.

| Type | Peak/low | When |
|---|---|---|
| `quickpop` | peak 1.04-1.07 | Most common — light punch on text overlay |
| `doublepop` | peak 1.05-1.07 | Urgency double-tap (1-2x per video max) |
| `soft2step` | peak 1.08-1.10 | MAJOR moments (4-5x max — hook, climax, CTA) |
| `zoomout` | low 0.92-0.97, duration 0.5-1.0 | Cinematic breath before reveal (0-2x) |

---

## SFX cues — 14 file BĐS library (budget ≤ 6 per video)

Default library lives at `public/sfx/` in the template (auto-copied per workspace by `init_project.sh`).

| File | Trigger | Cap/video |
|---|---|---|
| `camera-shutter.wav` | hook opener, reveal | 2 |
| `collapse.wav` | pain agitation climax / phá vỡ định kiến / twist | 1-2 |
| `giant-foot.m4a` | authority brand reveal | 1 |
| `build-up.wav` | 2-4s pre-reveal | 2 |
| `count.wav` | "1, 2, 3" listicle | 2 |
| `pop.wav` | text overlay punch (most common) | 6 |
| `ui-tap.wav` | tap highlight | 4 |
| `film-burn.wav` | cinematic cut | 2 |
| `glitch.wav` | before/after transition | 2 |
| `cyber-1.wav` / `cyber-2.wav` | data reveal | 2 |
| `digital-device.wav` | FOMO notify | 2 |
| `scifi-monitor.wav` | dashboard reveal | 1 |
| `ting.mp3` | light accent on small punch | 6 |

Validator warns when total cues > 6.

---

## Background music (BGM)

`public/bgm/coconut-groove.wav` (34MB, loops automatically) is wired into [`src/Video.tsx`](../templates/BDSGeneralTemplate/src/Video.tsx):

```tsx
<Html5Audio src={staticFile('bgm/coconut-groove.wav')} loop volume={0.12} />
```

Volume locked at **0.12** so voiceover stays dominant. To swap BGM:
1. Drop replacement WAV/MP3 into `public/bgm/` of the workspace
2. Update filename in `Video.tsx`
3. Re-render

Don't stack a second BGM at higher volume — voiceover must always win the mix.
