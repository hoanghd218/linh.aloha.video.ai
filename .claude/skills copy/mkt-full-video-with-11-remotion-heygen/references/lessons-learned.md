# Lessons learned — BDSGeneralTemplate (9 anti-patterns)

8 root causes of "render came out wrong" we hit and fixed. Bake these into every future packager run.

---

## 1. Variant name mismatch between packager and template registry

**Symptom:** Render came out blank — most overlays missing, only b-roll text + captions visible. Same overlays.json that worked in HyperFrames produced near-empty Remotion video.

**Root cause:** Old packager emitted variant names like `punch-white`, `punch-yellow`, `punch-red`, `glitch-text`, `count-up-money`, `count-up-number`. These existed in the OLD HyperFrames skill template (14 components, "1 variant = 1 component"). The NEW Remotion BDSGeneralTemplate consolidates to 10 components (`punch` + `color` prop), so unknown variants fall through `renderOverlay()`'s switch statement and return `null` → silent no-render.

**Fix baked in:**
- `validate.py` now hard-fails on deprecated variant names + suggests the modern equivalent in the error message.
- Phase 3 packager agent ONLY emits the 10 variant names listed in [`variant-catalog.md`](variant-catalog.md).
- Packager NEVER emits `punch-white/red/yellow` etc. Use `punch` + `color`.

**How to recognize next time:** If video renders with avatar visible but missing most text overlays, run validator immediately. `unknown variant 'X'` errors point straight at the bad names.

---

## 2. Root.tsx fetching wrong static path (`assets/` prefix)

**Symptom:** CLI render produced 5-second video with fallback "overlays.json not found" placeholder — even though `public/overlays.json` clearly existed.

**Root cause:** Old `Root.tsx` did `staticFile('assets/overlays.json')` expecting the symlink farm to land files under `public/assets/`. The new template (and most workspaces) puts files at root of `public/` instead. `calculateMetadata`'s fetch silently 404'd → fallback used → 5s × 30fps = 150 frames rendered.

**Fix baked in:**
- `Root.tsx` fetches `staticFile('overlays.json')` and `staticFile('caption-groups.json')` at root of public/.
- `init_project.sh` writes workspace data at `public/<filename>` (NOT `public/assets/<filename>`).
- No `public/assets/` directory exists in the template.

**How to recognize next time:** If `final.mp4` is suspiciously small (< 1MB for 1080×1920) AND duration is exactly 5s, you hit the fallback path. Check that `public/overlays.json` exists at root, NOT in a subdir.

---

## 3. `Audio` is deprecated in Remotion 4.0.380+

**Symptom:** TypeScript hint `'Audio' is deprecated` when importing `import { Audio } from 'remotion'`. Render still works but emits warnings; future Remotion versions will remove it.

**Root cause:** Remotion 4.0.380 deprecated `<Audio>` in favor of `<Html5Audio>` (already in the `remotion` package) or `<Audio>` from the newer `@remotion/media` package (not installed by default).

**Fix baked in:**
- `Video.tsx` imports `Html5Audio` from `remotion` and uses it for BGM.
- API is identical: `<Html5Audio src={...} loop volume={0.12} />`.
- If you ever install `@remotion/media`, prefer `import { Audio } from '@remotion/media'` for advanced features (gain envelopes, web audio routing).

**How to recognize next time:** TypeScript hint #6385 'is deprecated' or runtime warning in Studio console.

---

## 4. B-roll caption text overlapping captions + cutting mid-word

**Symptom:** Caption text on b-roll images either (a) overlapped with the bottom-center caption pill, or (b) wrapped by cutting words mid-character ("MASTERISE" → "MASTERI" + "SE").

**Root cause:** Original `BrollImage.tsx` placed caption at `bottom: 480` (collided with caption pill safe zone at y≈1240–1344) and used `wordBreak: 'break-word'` which allows mid-word splits when text is wider than container.

**Fix baked in (`src/overlays/BrollImage.tsx`):**
- `bottom: 80` — anchor caption in the bottom-safe zone (y≈1840), well below caption pill.
- `wordBreak: 'keep-all'` + `overflowWrap: 'normal'` + `hyphens: 'none'` — wrap only at whitespace, never cut mid-word.
- `maxWidth: 980` + `textAlign: 'center'` — multi-line captions fit within 1080 frame and center.
- `lineHeight: 1.05` (not `1`) so 2-line captions don't squish.
- `fontSize: 110` — leaves room for the longest single word ("MASTERISE" ~650px wide at this size).

**How to recognize next time:** Watch for captions broken mid-word like `MASTERI/SE` or text overlapping captions in preview. If a single word IS longer than 980px (very rare — e.g. concatenated brand name), the right fix is shrink fontSize or insert space, NOT re-enable break-word.

---

## 5. B-roll and contact-card MIA from generated overlays.json

**Symptom:** Render played fine, but the b-roll project images never appeared, and there was no contact card at the end — even though `broll/` had 16 images and `logos/avatar.jpg + qr.jpg` were available.

**Root cause:** Packager produced 3 separate JSON files (`overlays.json`, `broll-inserts.json`, `contact info as comment in script.md`) and only merged the first into `public/overlays.json`. The b-roll + contact card entries existed but were never folded into the canonical overlays.json that Root.tsx reads.

**Fix baked in (Phase 3 packager agent):**
- Packager writes **ONE FILE ONLY**: `overlays.json` with all 29-ish entries merged.
- B-roll entries are `broll-image` variants inside the same `overlays` array — NO separate `broll-inserts.json`.
- Contact card is ALWAYS emitted at the end if `logos/avatar.jpg` + `logos/qr.jpg` exist in workspace. `t_start = video_duration - 6`, `duration = 6`. Set `video_duration = voiceover_duration + 3` for tail playout.
- Validator warns if total overlays ≥ 5 and no `contact-card` present.

**How to recognize next time:** Open `public/overlays.json` and run:
```bash
python3 -c "import json; d=json.load(open('overlays.json')); from collections import Counter; print(Counter(o['variant'] for o in d['overlays']))"
```
If you see `broll-image: 0` or no `contact-card`, the packager didn't merge — fix before render.

---

## 6. Studio shows the PREVIOUS project's overlays — Root reads `overlays-general.json`, not `overlays.json`

**Symptom:** After running `init_project.sh` for a new project, Studio opens and the first overlay shows the OLD project's hook text (e.g. video about "10 tòa" shows "3 ĐIỀU MÊ / 2 ĐIỀU LO" from the prior `3-me-2-lo-the-bloom` project). The new `public/overlays.json` is there with correct data — it's simply not the file Root.tsx fetches.

**Root cause:** `Root.tsx` defines two compositions (`BdsGeneralReview` reads `overlays-general.json`; `BdsApartmentDetail` reads `overlays-apartment.json`) — neither reads `overlays.json`. `init_project.sh` was writing `public/overlays.json` (per the original SKILL.md convention) which Root never fetched, so the stale `overlays-general.json` from the previous project kept rendering. SKILL.md "Lesson 2" wording also reinforced this wrong convention.

**Fix baked in (`scripts/init_project.sh`):**
- Template-aware target name:
  - `BDSGeneralTemplate*` → also write `public/overlays-general.json` (in addition to `public/overlays.json`)
  - `*Apartment*` template → also write `public/overlays-apartment.json`
- Keep writing `public/overlays.json` too (workspace contract + future direct-fetch compositions).
- Workspace contract unchanged — packager still emits `<workspace>/overlays.json`.

**How to recognize next time:** Studio opens, video plays, first overlay text doesn't match the script's hook. Run:
```bash
diff <(python3 -c "import json; print(json.load(open('workspace/remotion-project/public/overlays.json'))['overlays'][0]['content'])") \
     <(python3 -c "import json; print(json.load(open('workspace/remotion-project/public/overlays-general.json'))['overlays'][0]['content'])")
```
If they differ, `init_project.sh` didn't sync. Re-run init or copy manually.

---

## 7. Packager strips Vietnamese diacritics + crams long text into `price-red-3d`

**Symptom:** User opens Studio preview and reports "nhiều chữ đang là tiếng việt ko dấu, và chữ bị tràn ra ngoài". Inspection of `overlays.json`:
- ~22/26 overlay strings rendered as ASCII (`KHONG GIAN MO`, `MAT DO XAY DUNG`, `TIEN ICH`, `TOA L1 VA L2`, `QUET MA LIEN HE`) while the source `script.txt` clearly has full Vietnamese with diacritics
- Overlay 9 used `price-red-3d` with `"text": "71% KHONG GIAN MO"` — 4 tokens / 17 chars in a variant designed for 1-2 short tokens — visually overflowed the 1080-wide frame

**Root cause:** Two packager habits:
1. Stripping diacritics during text authoring — possibly LLM defaulting to ASCII-safe forms, possibly model temperature drift mid-run (first 3 overlays were correctly accented, the rest weren't). The font (`Mulish 900 italic + Be Vietnam Pro fallback`) renders all VN dấu natively — there was no technical reason to strip.
2. Treating `price-red-3d` as a generic "important text" banner instead of a short-price stamp.

**Fix baked in (packager agent):**
- New § in `mkt-full-video-phase3-remotion-packager.md` Step 3: **"diacritics are MANDATORY in every overlay text field"** with explicit field-by-field enumeration + a do/don't list (`TÒA` not `TOA`, `M²` not `M2`, etc.)
- Text-length budget table per variant (chars-per-field cap) added to packager guidance:
  - `price-red-3d` ≤ 12 chars / 1-2 tokens — short numbers/units only. Long phrases must split into `punch-2line` ("71%\nKHÔNG GIAN MỞ")
  - `punch` ≤ 18 chars · `punch-2line` ≤ 20/line · `callout-stack` setup ≤ 28 / emphasis ≤ 20 · `icon-stack` line1 ≤ 18 / line2 ≤ 14 · `price-with-brand` price ≤ 14 / brand ≤ 22 · `comment-bubble` ≤ 60 · `contact-card` name ≤ 20 / cta ≤ 20

**How to recognize next time:** Grep the JSON for telltale unaccented VN words:
```bash
python3 -c "
import json, re
d = json.load(open('public/overlays-general.json'))
bad = ['KHONG','TOA','BIET','TIEN ICH','MAT DO','KHU DAT','NGOT NGAT','QUET','LIEN HE']
for o in d['overlays']:
    blob = ' '.join(str(v) for v in o.values() if isinstance(v, str))
    hits = [w for w in bad if w in blob.upper()]
    if hits: print(o['id'], hits, blob[:80])
"
```
Also `price-red-3d` entries with `len(text) > 12` are suspect.

**Open follow-up:** extend `validate.py` to fail on (a) common unaccented VN tokens (`KHONG`, `TOA`, `BIET`, `TIEN ICH`, `MAT DO`, `M2`/`m2` instead of `M²`/`m²`) and (b) variant-text-length budget violations. Until then, eyeball the JSON before init.

---

## 8. CommentBubble (and any bottom-zone overlay) overlapping the caption pill

**Symptom:** Near the end, the white CommentBubble (`@linhaloha` + CTA text) sat ON TOP of the bottom-center caption pill ("số hotline trên màn hình..."), so two boxes of text overlapped in the lower-middle of the frame.

**Root cause:** The caption pill (`Captions.tsx`) lives at `bottom: 30%` of 1920 ≈ y576. `CommentBubble.tsx` was at `bottom: 360` with `transformOrigin: 'center bottom'` — it grows UPWARD, and with username + up to 3 lines it's ~300–360px tall, so its top edge reached ~y660 and collided with the caption pill. Any bottom-anchored overlay that grows upward must budget its own height so the top edge stays below y576.

**Fix baked in (`src/overlays/CommentBubble.tsx`):**
- `bottom: 360` → `bottom: 150`. Top edge now reaches ~y450–510, clearing the caption pill at y576.
- Rule of thumb: a bottom-zone overlay that can be >250px tall must keep `bottom ≤ 160`.

**How to recognize next time:** In preview, watch the CTA section (last ~6s before contact-card) — if the comment bubble and the caption pill share screen space, lower the bubble's `bottom`. Don't raise it.

---

## 9. Text tràn 2 cạnh — `useFitTextSize` đo bằng font SAI

**Symptom:** Emphasis line trong `callout-stack` (vd "CHỌN CĂN ĐẸP NHẤT") và `icon-stack` (vd "METRO THƯỢNG ĐÌNH") bị tràn ra ngoài khung 1080px — viewer chỉ thấy giữa chữ, 2 đầu bị cắt. Nhìn giống hệt bug fit-text được sinh ra để chống.

**Root cause:** `fit-text.ts` đo width bằng `DEFAULT_FONT_FAMILY = 'Be Vietnam Pro'`, nhưng các overlay display render bằng **Mulish 900 italic** (rộng hơn ~10-15%). Component nào gọi `useFitTextSize` mà **không truyền `fontFamily`** (và không truyền `letterSpacing` dù render có letter-spacing) → đo hụt → chọn fontSize quá to → tràn. Thêm nữa `minFontSize` floor quá cao (CalloutStack 120, IconStack 72, PriceWithBrand 110) khiến chuỗi 15-17 ký tự không co đủ nhỏ để fit, mà `whiteSpace: nowrap` ép 1 dòng → tràn cứng.

`Punch.tsx` + `PriceRed3D.tsx` đã đúng từ đầu (truyền `fontFamily` + `letterSpacing`). Bug chỉ ở `CalloutStack`, `IconStack`, `Punch2Line`, `PriceWithBrand`.

**Fix baked in (4 component):** mọi `useFitTextSize` giờ truyền `fontFamily: "'Mulish', 'Be Vietnam Pro', system-ui, sans-serif"` + `letterSpacing` khớp với CSS render, và hạ `minFontSize` floor (CalloutStack emphasis 120→80, IconStack 72→56, PriceWithBrand price 110→84). Đã port sang cả working copy lẫn canonical template.

**Rule chống tái phát:** BẤT KỲ component nào render Mulish mà dùng `useFitTextSize` PHẢI truyền `fontFamily` Mulish + `letterSpacing` đúng bằng giá trị CSS. `minFontSize` floor phải đủ thấp để chuỗi dài nhất (15-18 ký tự) co vừa `maxWidth` (≤960). Nếu thêm overlay variant mới có text, copy pattern của `Punch.tsx`.

---

## TL;DR for the Phase 3 packager

Before writing `overlays.json`, verify all 8:

- [ ] All `variant` strings are from the 10-name registry (no `punch-white`, `glitch-text`, `count-up-*`)
- [ ] File written to `<workspace>/overlays.json` — `init_project.sh` copies it to BOTH `public/overlays.json` AND `public/overlays-general.json` (or `-apartment.json` for that template) so Root.tsx's composition fetch finds it
- [ ] If touching `Video.tsx`, use `Html5Audio` not `Audio`
- [ ] If touching `BrollImage.tsx`, keep `wordBreak: 'keep-all'` + `bottom: 80` + `maxWidth: 980`
- [ ] B-roll entries are in `overlays[]` (variant=broll-image), NOT in a separate file
- [ ] Exactly one `contact-card` at end if avatar+QR assets exist
- [ ] `video_duration = voiceover_duration + 3` (so contact-card has tail to play out)
- [ ] After `init_project.sh`, sanity-check that `public/overlays-general.json` first overlay matches the script's hook (not the prior project's)
- [ ] **Vietnamese diacritics preserved in EVERY overlay text field** — no `KHONG`/`TOA`/`BIET`/`MAT DO`/`TIEN ICH`/`NGOT NGAT`/`QUET MA`. Use `M²` not `M2`. Take dấu from `script.txt` source-of-truth.
- [ ] Text-length budget per variant respected — no long phrases in `price-red-3d` (≤ 12 chars). Split into `punch-2line` if too long.
- [ ] CommentBubble / bottom-zone overlays keep `bottom ≤ 160` so they don't overlap the caption pill at y576 (§8)
