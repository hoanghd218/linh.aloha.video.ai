# Logo library

> **Ghi chú 2026-11-11:** README này mô tả cơ chế cũ (component `LogoPill` + symlink vào `public/assets/logos/`). Template hiện tại không còn `LogoPill` và `init_project.sh` KHÔNG chép thư mục này. Logo của video lấy từ `<workspace>/logos/` (cần `avatar.jpg` + `qr-contact.jpg` cho contact-card); logo khác dùng qua `icon_path` của `icon-stack`. Thư mục này hiện chưa có tệp logo nào.

Drop SVG (or PNG) logo files into this folder. Filenames must be ASCII (no spaces, no diacritics, lowercase preferred).

The Phase 3 packager references logos by basename in `overlays.json`, e.g.:

```jsonc
{ "variant": "logo-pill", "logos": [
  { "path": "vinhomes.svg", "label": "VINHOMES" }
] }
```

The `init_project.sh` script symlinks this folder into `<workspace>/remotion-project/public/assets/logos/`, so `staticFile('logos/vinhomes.svg')` works in any workspace.

## Expected files for BĐS pipeline

These are the basenames referenced by the variant catalog. Add the actual SVGs as you acquire them — missing logos render a broken `<img>` tag (visible in DevTools) but don't crash the layout.

### Real-estate brands (chủ đầu tư)
- `vinhomes.svg` — Vinhomes
- `masterise.svg` — Masterise Homes
- `vingroup.svg` — Vingroup
- `sun-group.svg` — Sun Group
- `novaland.svg` — Novaland
- `ecopark.svg` — Ecopark
- `gamuda.svg` — Gamuda Land

### Project pillars (sub-brand)
- `lumiere.svg` — Lumière (Masterise)
- `the-zen-residences.svg` — The Zen Residences

### AI / tools (for non-BĐS videos)
- `claude.svg` — Anthropic Claude
- `gmail.svg` — Gmail
- `slack.svg` — Slack
- `drive.svg` — Google Drive
- `excel.svg` — Microsoft Excel
- `ppt.svg` — PowerPoint

## Sizing guidelines

- **Prefer SVG** (vector — sharp at any zoom).
- If using PNG, render at ≥ 256×256 px (the `LogoPill` component renders at 120 px, but Retina previews and re-encoding for h264 benefit from larger source).
- Logos should have transparent background (the pill container has a black 85% bg behind them).
- Trim whitespace tightly — the component centers the logo in a square box, extra padding makes logos appear smaller than they should.
