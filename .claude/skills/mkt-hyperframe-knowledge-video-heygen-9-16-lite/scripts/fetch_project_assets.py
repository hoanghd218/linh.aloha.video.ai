#!/usr/bin/env python3
"""Copy selected project images into a video project's media/ folder.

Profile `bds-broker` — Phase 0.7 of the LITE pipeline.

Three things happen here, all of which are load-bearing:

1. **Selection** — user's explicit `--files` wins; else `--include`
   categories; else rank-based auto-pick (hookRank → starred → described →
   resolution).
2. **ASCII rename** — source names carry Vietnamese diacritics, spaces, and
   in one real case a TRAILING SPACE ("Ảnh phối cảnh tổng thể dự án .jpg").
   Those 404 at HyperFrames render time. Every copy lands under the
   catalog's collision-free `ascii` name.
3. **Downscale + 9:16 padding** — 6000px source JPEGs are re-encoded to
   `--max-dim` (default 2160). Floor plans / masterplans / doc scans also get
   a `-9x16` padded variant, because centre-cropping a floor plan throws away
   exactly the annotations the scene needs to show.

Usage
-----
  # everything the catalog knows, ranked, capped at 12
  python3 fetch_project_assets.py --project "Cao xà lá" --out media --max 12

  # user chỉ định (thắng mọi auto-pick)
  python3 fetch_project_assets.py --project cao-xa-la --out media \
      --files "exterior-night-01.jpg,facade,masterplan-05"

  # theo nhóm
  python3 fetch_project_assets.py --project cao-xa-la --out media \
      --include exterior-night,aerial-location,amenity,handover-spec

Writes `<out>/asset-map.json` — the input to Phase 1b beat assignment.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path

CANVAS_W, CANVAS_H = 1080, 1920
PAD_BG = (10, 12, 18)

# Vietnamese synonyms folded into the searchable blob, so `--files "tiêu chuẩn
# bàn giao bếp"` finds handover-spec-04 even though its caption only says "Bếp".
CATEGORY_SYNONYMS = {
    "exterior-hero": "phoi canh ngoai that tong the toan canh",
    "exterior-night": "phoi canh ban dem ve dem canh dem",
    "facade": "mat dung kien truc toa thap",
    "aerial-location": "vi tri ban do drone flycam ket noi tong the",
    "masterplan": "tong mat bang tmb quy hoach phan khu",
    "amenity": "tien ich canh quan clubhouse be boi cong vien",
    "interior": "noi that can ho phong khach phong ngu",
    "handover-spec": "tieu chuan ban giao hoan thien vat lieu",
    "floorplan": "mat bang tang mat bang can ho layout typology",
    "doc-scan": "tai lieu scan brochure",
}


def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", str(s))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("đ", "d").replace("Đ", "d").lower()
    return " ".join("".join(c if c.isalnum() else " " for c in s).split())


def load_catalog(project: str, data_root: str | None, rebuild: bool) -> dict:
    here = Path(__file__).parent
    r = subprocess.run(
        [sys.executable, str(here / "resolve_project.py"), "--project", project]
        + (["--data-root", data_root] if data_root else []),
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        sys.stderr.write(r.stdout + r.stderr)
        sys.exit(r.returncode)
    proj = json.loads(r.stdout)

    cat_path = Path(proj["path"]) / "_assets" / "asset-catalog.json"
    if rebuild or not cat_path.is_file():
        b = subprocess.run(
            [sys.executable, str(here / "build_asset_catalog.py"), "--project", project]
            + (["--data-root", data_root] if data_root else []),
            capture_output=True, text=True,
        )
        if b.returncode != 0:
            sys.stderr.write(b.stdout + b.stderr)
            sys.exit(b.returncode)
    return json.loads(cat_path.read_text(encoding="utf-8"))


def matches_token(asset: dict, token: str) -> bool:
    """Filename-ish match first, then all-words match against the caption.

    The caption match is word-wise on purpose: users type "thác nước về đêm"
    while the note says "Thác nước biểu tượng về đêm — phát sáng vàng rực".
    A plain substring test misses that; every-word-present does not.
    """
    t = norm(token)
    if not t:
        return False
    for field in (asset["ascii"], Path(asset["file"]).name, asset["file"]):
        nf = norm(field)
        if nf == t or t in nf:
            return True
    blob = norm(
        " ".join(
            [
                asset.get("description") or "",
                " ".join(asset.get("useFor") or []),
                asset["ascii"],
                asset["category"],
                CATEGORY_SYNONYMS.get(asset["category"], ""),
                CATEGORY_SYNONYMS.get(asset.get("subcategory") or "", ""),
            ]
        )
    )
    words = t.split()
    return bool(words) and all(w in blob for w in words)


def rank_key(a: dict) -> tuple:
    return (
        a["hookRank"] or 99,
        0 if a["starred"] else 1,
        0 if not a["needsDescription"] else 1,
        -((a["w"] or 0) * (a["h"] or 0)),
    )


def process_image(src: Path, dst: Path, max_dim: int) -> tuple[int, int]:
    from PIL import Image, ImageOps

    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        if max_dim and max(im.size) > max_dim:
            im.thumbnail((max_dim, max_dim), Image.LANCZOS)
        im.save(dst, "JPEG", quality=88, optimize=True)
        return im.size


def make_portrait_pad(src: Path, dst: Path) -> None:
    """Contain-fit onto a 1080×1920 dark canvas — keeps every annotation."""
    from PIL import Image, ImageOps

    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((CANVAS_W, CANVAS_H), Image.LANCZOS)
        canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), PAD_BG)
        canvas.paste(im, ((CANVAS_W - im.width) // 2, (CANVAS_H - im.height) // 2))
        canvas.save(dst, "JPEG", quality=90, optimize=True)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--project", required=True)
    ap.add_argument("--out", default="media", help="Thư mục media/ của project video (mặc định ./media)")
    ap.add_argument("--data-root")
    ap.add_argument("--files", help="Chỉ định file (ascii / tên gốc / substring mô tả), phân tách bằng dấu phẩy")
    ap.add_argument("--include", help="Lọc theo category, phân tách bằng dấu phẩy")
    ap.add_argument("--exclude", default="doc-scan", help="Category loại trừ (mặc định doc-scan)")
    ap.add_argument("--max", type=int, default=12, help="Số ảnh tối đa khi auto-pick (mặc định 12)")
    ap.add_argument("--max-dim", type=int, default=2160, help="Cạnh dài tối đa sau re-encode (0 = giữ nguyên)")
    ap.add_argument("--no-pad", action="store_true", help="Không sinh biến thể -9x16 cho floorplan/masterplan")
    ap.add_argument("--rebuild-catalog", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    catalog = load_catalog(args.project, args.data_root, args.rebuild_catalog)
    assets = catalog["assets"]
    excluded = {c.strip() for c in (args.exclude or "").split(",") if c.strip()}

    picked: list[dict] = []
    seen: set[str] = set()

    def add(a: dict, by: str, reason: str) -> None:
        if a["ascii"] in seen:
            return
        seen.add(a["ascii"])
        picked.append({**a, "selectedBy": by, "selectReason": reason})

    misses: list[str] = []
    if args.files:
        for token in [t.strip() for t in args.files.split(",") if t.strip()]:
            hits = [a for a in assets if matches_token(a, token)]
            if not hits:
                misses.append(token)
                continue
            hits.sort(key=rank_key)
            add(hits[0], "user", f'chỉ định "{token}"')
            if len(hits) > 1:
                sys.stderr.write(
                    f'  ℹ "{token}" khớp {len(hits)} ảnh → lấy {hits[0]["ascii"]}'
                    f' (bỏ qua: {", ".join(h["ascii"] for h in hits[1:4])})\n'
                )

    if args.include:
        wanted = [c.strip() for c in args.include.split(",") if c.strip()]
        # Round-robin across the requested categories: asking for 5 categories
        # and getting 4 amenity shots (they happen to be the highest-res) is
        # never what the user meant.
        buckets = {
            c: sorted(
                (a for a in assets if a["category"] == c or a.get("subcategory") == c),
                key=rank_key,
            )
            for c in wanted
        }
        while len(picked) < args.max:
            progressed = False
            for c in wanted:
                if not buckets[c]:
                    continue
                if len(picked) >= args.max:
                    break
                add(buckets[c].pop(0), "category", f"category {c}")
                progressed = True
            if not progressed:
                break

    if not args.files and not args.include:
        pool = [a for a in assets if a["category"] not in excluded]
        pool.sort(key=rank_key)
        # Spread across categories so an auto-pick doesn't return 12 floor plans.
        per_cat: dict[str, int] = {}
        for a in pool:
            if len(picked) >= args.max:
                break
            cap = 2 if a["category"] in {"floorplan", "masterplan", "handover-spec"} else 4
            if per_cat.get(a["category"], 0) >= cap:
                continue
            per_cat[a["category"]] = per_cat.get(a["category"], 0) + 1
            add(a, "auto-rank", f'rank {a["hookRank"] or "-"} · {a["category"]}')

    if misses:
        sys.stderr.write(f'  ⚠ Không tìm thấy: {", ".join(misses)}\n')

    out_dir = Path(args.out).expanduser().resolve()
    entries = []
    for a in picked:
        src = Path(a["abs"])
        dst = out_dir / a["ascii"]
        pad_name = None
        if not args.dry_run:
            out_dir.mkdir(parents=True, exist_ok=True)
            if src.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
                try:
                    w, h = process_image(src, dst, args.max_dim)
                except Exception as e:  # PIL missing / corrupt file → raw copy
                    sys.stderr.write(f"  ⚠ {a['ascii']}: re-encode fail ({e}); copy nguyên bản\n")
                    shutil.copy2(src, dst)
                    w, h = a["w"], a["h"]
            else:
                shutil.copy2(src, dst)
                w, h = a["w"], a["h"]
            if a["fitMode"] == "pad" and not args.no_pad:
                pad_name = f"{dst.stem}-9x16.jpg"
                try:
                    make_portrait_pad(src, out_dir / pad_name)
                except Exception as e:
                    sys.stderr.write(f"  ⚠ {a['ascii']}: pad 9:16 fail ({e})\n")
                    pad_name = None
        else:
            w, h = a["w"], a["h"]

        entries.append(
            {
                "ascii": a["ascii"],
                "file": f"media/{a['ascii']}",
                "portrait9x16": f"media/{pad_name}" if pad_name else None,
                "source": a["file"],
                "category": a["category"],
                "subcategory": a.get("subcategory"),
                "description": a["description"],
                "useFor": a["useFor"],
                "hookRank": a["hookRank"],
                "orientation": a["orientation"],
                "w": w,
                "h": h,
                "fitMode": a["fitMode"],
                "illustrative": a["illustrative"],
                "disclaimer": catalog["disclaimer"] if a["illustrative"] else None,
                "selectedBy": a["selectedBy"],
                "selectReason": a["selectReason"],
            }
        )

    manifest = {
        "version": 1,
        "project": catalog["project"],
        "catalog": str(Path(catalog["projectPath"]) / "_assets" / "asset-catalog.json"),
        "disclaimer": catalog["disclaimer"],
        "count": len(entries),
        "assets": entries,
        "notFound": misses,
    }
    if not args.dry_run:
        (out_dir / "asset-map.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        manifest["assetMapPath"] = str(out_dir / "asset-map.json")

    for e in entries:
        sys.stderr.write(f'  {e["selectedBy"]:<10} {e["ascii"]:<44} {e["category"]:<16} {(e["description"] or "")[:40]}\n')
    sys.stderr.write(f'  → {len(entries)} ảnh {"(dry-run)" if args.dry_run else "vào " + str(out_dir)}\n')

    summary = {k: manifest[k] for k in ("count", "notFound", "assetMapPath") if k in manifest}
    summary["byCategory"] = {}
    for e in entries:
        summary["byCategory"][e["category"]] = summary["byCategory"].get(e["category"], 0) + 1
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
