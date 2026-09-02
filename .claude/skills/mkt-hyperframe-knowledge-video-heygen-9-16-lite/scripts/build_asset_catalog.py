#!/usr/bin/env python3
"""Build an image catalog for one real-estate project.

Profile `bds-broker` — Phase 0.5 of the LITE pipeline.

Reads `<project>/<libraryMd>` (the hand-written "Thư viện hình ảnh" note
that already describes each shot) and merges it with a filesystem scan, so
every image ends up with: category, ASCII filename, dimensions, and a
description when one exists. Writes ONE cache file per project:

    <project>/_assets/asset-catalog.json

Because the catalog lives inside the project folder (not inside the video
workspace), every skill that needs project b-roll reads the same file and
nobody re-describes 66 images per video.

Usage
-----
  python3 build_asset_catalog.py --project "Cao xà lá"
  python3 build_asset_catalog.py --project cao-xa-la --force --summary
  python3 build_asset_catalog.py --project cao-xa-la --out /tmp/catalog.json

Images the markdown note does NOT describe are still catalogued, flagged
`needsDescription: true`. The orchestrator can Read those files and patch
descriptions back in with --patch-descriptions (see README in the docstring
of `patch_descriptions`).
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}

# Folder-name heuristics used when the registry has no assetRoots mapping.
FOLDER_HINTS = [
    ("phoi canh", "exterior-hero"),
    ("ngoai that", "exterior-hero"),
    ("noi that", "interior"),
    ("tien ich", "amenity"),
    ("mat bang", "masterplan"),
    ("floorplan", "floorplan"),
    ("tieu chuan ban giao", "handover-spec"),
    ("ban giao", "handover-spec"),
    ("tai lieu", "doc-scan"),
]

# Keyword → category refinement, applied to the markdown description.
# Order matters: first hit wins.
DESC_HINTS = [
    (("về đêm", "ban đêm", "đêm ", "night"), "exterior-night"),
    (("mặt đứng", "facade", "mặt tiền"), "facade"),
    (("drone", "định vị dự án", "tổng thể dự án", "nhìn từ trên"), "aerial-location"),
    (("tổng mặt bằng", "tmb", "mặt bằng tiện ích", "legend", "phân khu"), "masterplan"),
    (("nội thất", "phòng khách", "phòng ngủ", "bàn ăn", "bếp", "căn hộ góc", "tủ quần áo"), "interior"),
    (("tiện ích", "clubhouse", "thác nước", "cảnh quan", "pavilion", "hồ bơi", "suối", "công viên", "mái vòm"), "amenity"),
    (("cổng chào", "lối vào", "cổng chính"), "exterior-hero"),
    (("cửa", "kính low-e", "trần thạch cao", "sàn gỗ", "điều hòa"), "handover-spec"),
]

ILLUSTRATIVE = {
    "exterior-hero",
    "exterior-night",
    "facade",
    "aerial-location",
    "amenity",
    "interior",
    "handover-spec",
}

# 9:16-friendliness. Floorplans / doc scans lose their text when cropped to
# portrait, so fetch_project_assets.py pads them instead of cropping.
PAD_CATEGORIES = {"floorplan", "doc-scan", "masterplan"}


def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", str(s))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("đ", "d").replace("Đ", "d").lower()
    return " ".join("".join(c if c.isalnum() else " " for c in s).split())


def slugify(s: str, maxlen: int = 22) -> str:
    n = norm(s).replace(" ", "-")
    n = re.sub(r"-+", "-", n).strip("-")
    if maxlen and len(n) > maxlen:
        n = n[:maxlen].rstrip("-")
    return n


def resolve_project(project: str, data_root: str | None) -> dict:
    """Delegate to resolve_project.py so both scripts share one matcher."""
    script = Path(__file__).with_name("resolve_project.py")
    cmd = [sys.executable, str(script), "--project", project]
    if data_root:
        cmd += ["--data-root", data_root]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stdout + r.stderr)
        sys.exit(r.returncode)
    return json.loads(r.stdout)


def dims(path: Path) -> tuple[int | None, int | None]:
    try:
        from PIL import Image  # type: ignore

        with Image.open(path) as im:
            return im.width, im.height
    except Exception:
        pass
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height", "-of", "json", str(path)],
            capture_output=True, text=True, check=True,
        ).stdout
        st = json.loads(out)["streams"][0]
        return st["width"], st["height"]
    except Exception:
        return None, None


# ---------------------------------------------------------------- markdown --

SECTION_RE = re.compile(r"^#{2,3}\s+(?P<title>.+)$")
BACKTICK_PATH_RE = re.compile(r"`([^`]*/[^`]*)`")
ROW_RE = re.compile(r"^\|(?P<cells>.+)\|\s*$")


def _cells(line: str) -> list[str]:
    m = ROW_RE.match(line.rstrip())
    if not m:
        return []
    return [c.strip() for c in m.group("cells").split("|")]


def _match_dir(fragment: str, dirs: list[str]) -> str | None:
    """Resolve a markdown folder reference to a real relative dir.

    The note abbreviates long folders with '...' (e.g.
    `TIÊU CHUẨN BÀN GIAO.../TIÊU CHUẨN BÀN GIAO/`), so exact match first,
    then a wildcard regex, then a normalized-substring fallback.
    """
    frag = fragment.strip().strip("/")
    for d in dirs:
        if d == frag:
            return d
    if "..." in frag:
        pat = ".*".join(re.escape(p) for p in frag.split("..."))
        rx = re.compile(f"^{pat}$")
        for d in dirs:
            if rx.match(d):
                return d
    nf = norm(frag)
    hits = [d for d in dirs if norm(d) == nf] or [d for d in dirs if nf and nf in norm(d)]
    return hits[0] if len(hits) >= 1 else None


def _match_file(token: str, names: list[str]) -> str | None:
    """Resolve a markdown filename cell to a real basename in that folder."""
    t = token.strip()
    t = re.sub(r"\*\(.*?\)\*", "", t).strip()  # drop italic notes
    t = t.strip("`").strip()
    for n in names:
        if n == t:
            return n
    if "..." in t:
        head, tail = t.split("...", 1)
        for n in names:
            if n.startswith(head) and n.endswith(tail):
                return n
    nt = norm(t)
    for n in names:
        if norm(n) == nt:
            return n
    return None


def parse_library_md(md_path: Path, project_dir: Path) -> tuple[dict[str, dict], list[str]]:
    """Return {relative image path: {description, useFor, hookRank}} + warnings."""
    warnings: list[str] = []
    described: dict[str, dict] = {}
    if not md_path or not md_path.is_file():
        return described, ["Không có file 'Thư viện hình ảnh' — toàn bộ ảnh sẽ needsDescription."]

    all_dirs = sorted(
        str(p.relative_to(project_dir)) for p in project_dir.rglob("*") if p.is_dir()
    )
    files_by_dir: dict[str, list[str]] = {}
    for d in all_dirs:
        files_by_dir[d] = sorted(
            p.name for p in (project_dir / d).iterdir()
            if p.is_file() and p.suffix.lower() in IMG_EXT
        )

    cur_dir: str | None = None
    header_cols: list[str] = []
    hook_names: list[str] = []
    in_hook_tip = False

    for raw in md_path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()

        # "> [!tip] 3 ảnh đắt giá nhất làm hook" → the backticked filenames on
        # the following quoted lines are the ranked hook shots.
        if line.lstrip().startswith(">"):
            if "hook" in norm(line):
                in_hook_tip = True
            elif in_hook_tip:
                hook_names += re.findall(r"`([^`]+)`", line)
        else:
            in_hook_tip = False

        sec = SECTION_RE.match(line)
        if sec:
            header_cols = []
            cur_dir = None
            m = BACKTICK_PATH_RE.search(sec.group("title"))
            if m:
                cur_dir = _match_dir(m.group(1), all_dirs)
                if cur_dir is None:
                    warnings.append(f"Section '{sec.group('title')[:60]}' trỏ tới thư mục không tồn tại.")
            continue

        # "3 ảnh đắt giá nhất làm hook" tip block → hookRank
        if "hook" in line.lower() and "`" in line and line.lstrip().startswith(">"):
            hook_names += re.findall(r"`([^`]+)`", line)

        cells = _cells(line)
        if not cells:
            continue
        if set("".join(cells)) <= set("-: "):
            continue  # separator row
        if not header_cols and norm(cells[0]) in {"file", "ten file", "anh"}:
            header_cols = [norm(c) for c in cells]
            continue
        if not cur_dir or not header_cols:
            continue

        fname = _match_file(cells[0], files_by_dir.get(cur_dir, []))
        if not fname:
            if "`" in cells[0]:
                warnings.append(f"Row '{cells[0][:40]}' trong '{cur_dir}' không khớp file nào.")
            continue

        desc_idx = next((i for i, h in enumerate(header_cols) if h in {"noi dung", "hang muc", "mo ta"}), 1)
        use_idx = next((i for i, h in enumerate(header_cols) if "dung tot" in h or "dung cho" in h), None)
        desc = cells[desc_idx] if desc_idx < len(cells) else ""
        use_for = cells[use_idx] if use_idx is not None and use_idx < len(cells) else ""

        rel = f"{cur_dir}/{fname}"
        described[rel] = {
            "description": re.sub(r"[⭐*_]", "", desc).strip(),
            "useFor": [u.strip() for u in re.split(r"[,;·]", re.sub(r"[⭐*_]", "", use_for)) if u.strip()],
            "starred": "⭐" in desc or "⭐" in use_for,
        }

    for rank, hn in enumerate(dict.fromkeys(hook_names), start=1):
        for rel in described:
            if Path(rel).name == hn.strip():
                described[rel]["hookRank"] = rank
                break

    return described, warnings


# ---------------------------------------------------------------- catalog ---

def categorize(rel: str, entry: dict, asset_roots: dict[str, str]) -> tuple[str, str | None]:
    """→ (category, subcategory). Subcategory is set when the description
    suggests a narrower kind but the registry mapping is authoritative."""
    parent = str(Path(rel).parent)
    cat, from_registry = None, False
    # 1. registry mapping — longest (most specific) matching prefix wins
    for root in sorted(asset_roots, key=len, reverse=True):
        if parent == root.strip("/") or parent.startswith(root.strip("/") + "/"):
            cat, from_registry = asset_roots[root], True
            break
    # 2. folder-name heuristic
    if cat is None:
        np = norm(parent)
        for frag, c in FOLDER_HINTS:
            if frag in np:
                cat = c
                break
    cat = cat or "doc-scan"

    # 3. description refinement
    refined = None
    blob = norm(entry.get("description", "") + " " + " ".join(entry.get("useFor", [])))
    for keys, c in DESC_HINTS:
        if any(norm(k) in blob for k in keys):
            refined = c
            break
    if refined is None or refined == cat:
        return cat, None
    # BROAD buckets are just "wherever the developer dumped renders" — the
    # description knows better. Everything else the registry explicitly mapped
    # stays put (a handover photo of a kitchen is still a handover photo), and
    # the refinement is kept as a searchable subcategory.
    BROAD = {"exterior-hero", "doc-scan"}
    if not from_registry or cat in BROAD:
        return refined, None
    return cat, refined


def build(project: dict, force: bool, out_path: Path | None) -> dict:
    pdir = Path(project["path"])
    md_path = Path(project["libraryMdPath"]) if project.get("libraryMdPath") else None
    described, warnings = parse_library_md(md_path, pdir) if md_path else ({}, ["Registry không khai báo libraryMd."])

    asset_roots = project.get("assetRoots", {}) or {}
    images = sorted(
        (p for p in pdir.rglob("*") if p.is_file() and p.suffix.lower() in IMG_EXT),
        key=lambda p: str(p).lower(),
    )

    rows = []
    for p in images:
        rel = str(p.relative_to(pdir))
        meta = described.get(rel, {})
        cat, subcat = categorize(rel, meta, asset_roots)
        w, h = dims(p)
        rows.append(
            {
                "file": rel,
                "abs": str(p),
                "category": cat,
                "subcategory": subcat,
                "description": meta.get("description") or None,
                "useFor": meta.get("useFor") or [],
                "hookRank": meta.get("hookRank"),
                "starred": bool(meta.get("starred")),
                "w": w,
                "h": h,
                "orientation": None if not (w and h) else ("portrait" if h >= w else "landscape"),
                "illustrative": cat in ILLUSTRATIVE,
                "fitMode": "pad" if cat in PAD_CATEGORIES else "cover",
                "needsDescription": rel not in described,
                "source": "library-md" if rel in described else "fs-scan",
            }
        )

    # Stable ASCII filenames: category-indexed, so `1.jpg` in PHỐI CẢNH and
    # `1.jpg` in TIÊU CHUẨN BÀN GIAO never collide in the video's media/ folder.
    counters: dict[str, int] = {}
    for r in rows:
        counters[r["category"]] = counters.get(r["category"], 0) + 1
        stem = Path(r["file"]).stem
        tail = "" if norm(stem).replace(" ", "").isdigit() else "-" + slugify(stem)
        floor = ""
        parts = [norm(x) for x in Path(r["file"]).parts]
        if r["category"] == "floorplan":
            floor = "-l1" if "l1" in parts else ("-l2" if "l2" in parts else "")
            tail = ""
            m = re.search(r"(\d{3,4})\s*$", stem)
            if m:
                tail = "-p" + m.group(1).lstrip("0").rjust(2, "0")
        r["ascii"] = f"{r['category']}{floor}-{counters[r['category']]:02d}{tail}{Path(r['file']).suffix.lower()}"

    catalog = {
        "version": 1,
        "project": {k: project.get(k) for k in ("slug", "name", "shortName", "dir", "developer", "status", "phase", "location")},
        "projectPath": str(pdir),
        "libraryMd": str(md_path) if md_path else None,
        "disclaimer": project.get("illustrativeDisclaimer", "Ảnh minh họa"),
        "counts": {},
        "warnings": warnings,
        "assets": rows,
    }
    for r in rows:
        catalog["counts"][r["category"]] = catalog["counts"].get(r["category"], 0) + 1
    catalog["counts"]["_total"] = len(rows)
    catalog["counts"]["_described"] = sum(1 for r in rows if not r["needsDescription"])

    dest = out_path or (pdir / "_assets" / "asset-catalog.json")
    if dest.exists() and not force and out_path is None:
        prev = json.loads(dest.read_text(encoding="utf-8"))
        # Preserve descriptions the orchestrator patched in for fs-scan images.
        patched = {a["file"]: a for a in prev.get("assets", []) if a.get("description") and a.get("source") == "orchestrator"}
        for r in catalog["assets"]:
            if r["file"] in patched:
                r["description"] = patched[r["file"]]["description"]
                r["useFor"] = patched[r["file"]].get("useFor", [])
                r["needsDescription"] = False
                r["source"] = "orchestrator"
        catalog["counts"]["_described"] = sum(1 for r in catalog["assets"] if not r["needsDescription"])

    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    catalog["catalogPath"] = str(dest)
    return catalog


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--project", required=True)
    ap.add_argument("--data-root")
    ap.add_argument("--out", help="Ghi ra path khác thay vì <project>/_assets/asset-catalog.json")
    ap.add_argument("--force", action="store_true", help="Bỏ qua description do orchestrator patch trước đó")
    ap.add_argument("--summary", action="store_true", help="In bảng tóm tắt ra stderr")
    args = ap.parse_args()

    proj = resolve_project(args.project, args.data_root)
    cat = build(proj, args.force, Path(args.out) if args.out else None)

    if args.summary:
        c = cat["counts"]
        sys.stderr.write(f"\n{cat['project']['shortName']} — {c['_total']} ảnh ({c['_described']} đã có mô tả)\n")
        for k, v in sorted(c.items()):
            if not k.startswith("_"):
                sys.stderr.write(f"  {k:<16} {v}\n")
        for w in cat["warnings"]:
            sys.stderr.write(f"  ⚠ {w}\n")
        sys.stderr.write("\n")

    print(json.dumps({"catalogPath": cat["catalogPath"], "counts": cat["counts"], "warnings": cat["warnings"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
