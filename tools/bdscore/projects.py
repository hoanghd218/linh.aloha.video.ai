"""Dự án: create / ingest / show.

`create` chỉ dựng khung + ghi registry. `ingest` chép tài liệu thô vào
đúng chỗ rồi gọi `build_asset_catalog.py` có sẵn. Việc ĐỌC tài liệu để
viết note kiến thức và rút typology là của LLM — API không đọc PDF.
"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

from . import assets as assets_mod
from . import registry
from . import towers as towers_mod
from . import unit_types as ut_mod
from . import units as units_mod
from .errors import BdsError, Invalid
from .paths import data_dir, project_dir, repo_root
from .schema import PROJECT, validate
from .store import order_keys
from .text import norm

SCAFFOLD_DIRS = ["_data", "_assets", "_kien-thuc-du-an", "_phan-tich"]
CATALOG_BUILDER = Path(".claude/skills/mkt-hyperframe-knowledge-video-heygen-9-16-lite"
                       "/scripts/build_asset_catalog.py")
DOC_EXT = {".jpg", ".jpeg", ".png", ".webp", ".pdf", ".docx", ".xlsx", ".md"}

KEY_ORDER = ["slug", "name", "shortName", "aliases", "dir", "developer", "status", "phase",
             "location", "scale", "knowledgeDir", "libraryMd", "assetRoots",
             "illustrativeDisclaimer", "hotline", "brandAssets"]


def create(data_root: Path, spec: dict, dry_run: bool = False) -> dict:
    """Tạo dự án mới: validate → dựng thư mục → ghi registry."""
    spec = dict(spec)
    spec.setdefault("dir", spec.get("shortName") or spec.get("name", ""))
    spec.setdefault("slug", norm(spec.get("shortName") or spec.get("name", "")).replace(" ", "-"))
    spec.setdefault("status", "sap-mo-ban")
    spec.setdefault("knowledgeDir", "_kien-thuc-du-an")
    spec.setdefault("aliases", [])

    issues = validate(spec, PROJECT, "project")
    if issues:
        raise Invalid(f"{len(issues)} lỗi ở project", issues=issues)

    pdir = data_root / spec["dir"]
    made = []
    if not dry_run:
        for sub in SCAFFOLD_DIRS:
            d = pdir / sub
            if not d.is_dir():
                d.mkdir(parents=True, exist_ok=True)
                made.append(str(d.relative_to(data_root)))
    else:
        made = [f"{spec['dir']}/{s}" for s in SCAFFOLD_DIRS if not (pdir / s).is_dir()]

    file_info = registry.add(data_root, order_keys(spec, KEY_ORDER), dry_run=dry_run)
    return {"slug": spec["slug"], "dir": spec["dir"], "path": str(pdir),
            "dirsCreated": made, "registry": file_info, "dryRun": dry_run,
            "next": [
                f"bds project ingest --project {spec['slug']} --src <thư mục tài liệu>",
                "Đọc tài liệu → viết _kien-thuc-du-an/*.md (việc của LLM)",
                f"bds tower upsert --project {spec['slug']} --json -",
                f"bds unit-type upsert --project {spec['slug']} --json -",
            ]}


def ingest(data_root: Path, entry: dict, src: str | None = None, dry_run: bool = False,
           rebuild_catalog: bool = True, force_catalog: bool = False) -> dict:
    """Chép tài liệu thô vào thư mục dự án rồi build lại asset-catalog.

    Giữ nguyên cấu trúc thư mục con của `src` — tên thư mục ("MẶT BẰNG",
    "PHỐI CẢNH") chính là thứ `build_asset_catalog.py` dùng để đoán
    category, nên flatten là mất thông tin.
    """
    pdir = project_dir(data_root, entry)
    copied, skipped = [], 0

    if src:
        s = Path(src).expanduser().resolve()
        if not s.is_dir():
            raise BdsError("bad_src", f"--src không phải thư mục: {s}")
        for f in sorted(s.rglob("*")):
            if not f.is_file() or f.name.startswith("."):
                continue
            if f.suffix.lower() not in DOC_EXT:
                skipped += 1
                continue
            dest = pdir / f.relative_to(s)
            if dest.exists():
                skipped += 1
                continue
            if not dry_run:
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(f, dest)
            copied.append(str(dest.relative_to(pdir)))

    out = {"project": entry.get("slug"), "path": str(pdir), "copied": len(copied),
           "skipped": skipped, "sample": copied[:10], "dryRun": dry_run}

    if rebuild_catalog and not dry_run:
        out["catalog"] = _build_catalog(data_root, entry, force=force_catalog)
    return out


def _build_catalog(data_root: Path, entry: dict, force: bool = False) -> dict:
    """Gọi lại script build_asset_catalog.py của skill LITE (không viết lại logic).

    KHÔNG truyền `--force` mặc định: cờ đó vứt bỏ description mà orchestrator
    đã patch vào catalog (Cao Xà Lá đang có 24 ảnh được mô tả tay). Chỉ
    force khi người dùng nói rõ.
    """
    script = repo_root(data_root) / CATALOG_BUILDER
    if not script.is_file():
        return {"ok": False, "reason": "builder_missing", "expected": str(script)}
    cmd = [sys.executable, str(script), "--project", entry["slug"], "--data-root", str(data_root)]
    if force:
        cmd.append("--force")
    proc = subprocess.run(cmd, capture_output=True, text=True)
    ok = proc.returncode == 0
    return {"ok": ok, "returncode": proc.returncode,
            "stderr": (proc.stderr or "").strip()[-800:] or None,
            "counts": assets_mod.counts(data_root, entry) if ok else None}


def show(data_root: Path, entry: dict) -> dict:
    """Ảnh chụp toàn cảnh 1 dự án — registry + tòa + typology + căn + ảnh."""
    out = {"project": registry.hydrate(entry, data_root)}

    tws = towers_mod.list_towers(data_root, entry)
    out["towers"] = [{
        "code": t["code"], "name": t.get("name"), "subdivision": t.get("subdivision"),
        "floorFrom": t.get("floorFrom"), "floorTo": t.get("floorTo"),
        "unitsPerFloor": t.get("unitsPerFloor"),
        "floorGroups": len(t.get("floorGroups") or []),
        "unitCodesVerified": t.get("unitCodesVerified", False),
    } for t in tws]

    types = ut_mod.list_types(data_root, entry)
    by_group: dict[str, int] = {}
    for t in types:
        by_group[t.get("group", "?")] = by_group.get(t.get("group", "?"), 0) + 1
    out["unitTypes"] = {"total": len(types), "byGroup": by_group,
                        "byTower": {t["code"]: sum(1 for x in types if x.get("tower") == t["code"])
                                    for t in tws}}

    unit_towers = units_mod.list_towers_with_units(data_root, entry)
    unit_stats = {}
    for tc in unit_towers:
        rows = units_mod.load(data_root, entry, tc).get("units", [])
        unit_stats[tc] = {"total": len(rows),
                          "needsResolution": sum(1 for u in rows if u.get("needsResolution"))}
    out["units"] = unit_stats

    out["assets"] = assets_mod.counts(data_root, entry)
    return out


def data_paths(data_root: Path, entry: dict) -> dict:
    dd = data_dir(data_root, entry)
    return {
        "dataDir": str(dd),
        "towers": str(dd / towers_mod.FILENAME),
        "unitTypes": str(dd / ut_mod.FILENAME),
        "units": [str(dd / units_mod.filename(t)) for t in units_mod.list_towers_with_units(data_root, entry)],
        "assetCatalog": str(assets_mod.catalog_path(data_root, entry)),
    }
