#!/usr/bin/env python3
"""Resolve a real-estate project name → its data folder in workspace/data/.

Profile `bds-broker` — Phase 0.3 of the LITE pipeline.

Usage
-----
  python3 resolve_project.py --project "Cao xà lá"
  python3 resolve_project.py --project cao-xa-la --data-root /abs/workspace/data
  python3 resolve_project.py --list
  python3 resolve_project.py --list --all-status      # kể cả dự án không còn bán

Matching is diacritic-insensitive and tolerant of typos: it checks slug,
name, shortName, aliases and the folder name itself, in that priority
order, then falls back to fuzzy ratio (cutoff 0.72).

Exit codes: 0 ok · 2 not found · 3 ambiguous (2+ equally good hits).
stdout is always JSON (a single object on success, a list for --list) so
the orchestrator can parse it without scraping prose.
"""
from __future__ import annotations

import argparse
import difflib
import json
import sys
import unicodedata
from pathlib import Path

REGISTRY_NAME = "projects.json"
SELLING = "dang-ban"


def norm(s: str) -> str:
    """Lowercase, strip Vietnamese diacritics, collapse separators."""
    s = unicodedata.normalize("NFD", str(s))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("đ", "d").replace("Đ", "d").lower()
    out = []
    for c in s:
        out.append(c if c.isalnum() else " ")
    return " ".join("".join(out).split())


def find_data_root(explicit: str | None) -> Path:
    if explicit:
        p = Path(explicit).expanduser().resolve()
        if not p.is_dir():
            sys.exit(f"ERROR: --data-root không tồn tại: {p}")
        return p
    here = Path.cwd().resolve()
    for base in [here, *here.parents]:
        cand = base / "workspace" / "data"
        if cand.is_dir():
            return cand
        if base.name == "data" and (base.parent.name == "workspace"):
            return base
    sys.exit("ERROR: không tìm thấy workspace/data/ — truyền --data-root.")


def load_registry(data_root: Path) -> dict:
    reg_path = data_root / REGISTRY_NAME
    if reg_path.is_file():
        try:
            return json.loads(reg_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            sys.exit(f"ERROR: {reg_path} không phải JSON hợp lệ: {e}")
    return {"version": 1, "projects": []}


def discover(data_root: Path, registry: dict) -> list[dict]:
    """Registry entries + any folder on disk that the registry doesn't know."""
    known = {p.get("dir") for p in registry.get("projects", [])}
    known |= set(registry.get("ignoreDirs", []))
    entries = []
    for p in registry.get("projects", []):
        e = dict(p)
        e["registered"] = True
        entries.append(e)
    for d in sorted(data_root.iterdir()):
        if not d.is_dir() or d.name.startswith(".") or d.name.startswith("_"):
            continue
        if d.name in known:
            continue
        entries.append(
            {
                "slug": norm(d.name).replace(" ", "-"),
                "name": d.name,
                "shortName": d.name,
                "aliases": [],
                "dir": d.name,
                "status": "unknown",
                "registered": False,
            }
        )
    return entries


def hydrate(entry: dict, data_root: Path) -> dict:
    """Attach absolute paths + a quick asset census."""
    pdir = data_root / entry["dir"]
    out = dict(entry)
    out["path"] = str(pdir)
    out["exists"] = pdir.is_dir()
    if out["exists"]:
        imgs = [
            p
            for p in pdir.rglob("*")
            if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        ]
        out["imageCount"] = len(imgs)
        lib = entry.get("libraryMd")
        out["libraryMdPath"] = str(pdir / lib) if lib and (pdir / lib).is_file() else None
        cat = pdir / "_assets" / "asset-catalog.json"
        out["catalogPath"] = str(cat) if cat.is_file() else None
    return out


def score(entry: dict, q: str) -> float:
    """0..1 — 1.0 means an exact hit on an identifying field."""
    fields = [entry.get("slug", ""), entry.get("name", ""), entry.get("shortName", ""), entry.get("dir", "")]
    fields += list(entry.get("aliases", []))
    best = 0.0
    for f in fields:
        nf = norm(f)
        if not nf:
            continue
        if nf == q:
            return 1.0
        if q and (q in nf or nf in q):
            best = max(best, 0.90)
        best = max(best, difflib.SequenceMatcher(None, nf, q).ratio())
    return best


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--project", help='Tên / slug / alias dự án, vd "Cao xà lá"')
    ap.add_argument("--data-root", help="Mặc định: tự dò workspace/data/ từ cwd đi lên")
    ap.add_argument("--list", action="store_true", help="Liệt kê dự án thay vì resolve")
    ap.add_argument("--all-status", action="store_true", help="--list: kể cả dự án không đang bán")
    args = ap.parse_args()

    data_root = find_data_root(args.data_root)
    registry = load_registry(data_root)
    entries = discover(data_root, registry)

    if args.list or not args.project:
        rows = [hydrate(e, data_root) for e in entries]
        if not args.all_status:
            rows = [r for r in rows if r.get("status") in (SELLING, "unknown")]
        json.dump(rows, sys.stdout, ensure_ascii=False, indent=2)
        print()
        if not args.project and not args.list:
            sys.exit(2)
        return

    q = norm(args.project)
    scored = sorted(((score(e, q), e) for e in entries), key=lambda t: -t[0])
    if not scored or scored[0][0] < 0.72:
        print(
            json.dumps(
                {
                    "error": "not-found",
                    "query": args.project,
                    "candidates": [e.get("shortName") or e.get("dir") for _, e in scored[:5]],
                    "hint": f"Xem danh sách: resolve_project.py --list (data root: {data_root})",
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        sys.exit(2)

    top = scored[0][0]
    tied = [e for s, e in scored if abs(s - top) < 1e-9]
    if len(tied) > 1:
        print(
            json.dumps(
                {
                    "error": "ambiguous",
                    "query": args.project,
                    "matches": [e.get("shortName") or e.get("dir") for e in tied],
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        sys.exit(3)

    result = hydrate(tied[0], data_root)
    result["matchScore"] = round(top, 3)
    result["dataRoot"] = str(data_root)
    if not result["exists"]:
        result["error"] = "folder-missing"
    json.dump(result, sys.stdout, ensure_ascii=False, indent=2)
    print()
    if not result["exists"]:
        sys.exit(2)


if __name__ == "__main__":
    main()
