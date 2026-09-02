"""Đọc `_assets/asset-catalog.json` — KHÔNG build lại nó.

Catalog do `build_asset_catalog.py` của skill LITE sinh ra và đã chạy tốt
trên 66 ảnh của Cao Xà Lá. Module này chỉ là đường đọc thống nhất, để
`bds asset list` và `bds unit-type upsert --floorplan-asset` cùng nhìn
một nguồn.
"""
from __future__ import annotations

from pathlib import Path

from .errors import NotFound
from .paths import project_dir
from .store import read_json
from .text import did_you_mean, norm

CATALOG_REL = Path("_assets") / "asset-catalog.json"


def catalog_path(data_root: Path, entry: dict) -> Path:
    return project_dir(data_root, entry) / CATALOG_REL


def load(data_root: Path, entry: dict) -> dict:
    p = catalog_path(data_root, entry)
    if not p.is_file():
        raise NotFound(
            "catalog_missing",
            f"Dự án chưa có asset-catalog.json ({p})",
            value=entry.get("slug"),
            hint="Chạy: bds project ingest --project <slug> --rebuild-catalog",
        )
    return read_json(p)


def list_assets(data_root: Path, entry: dict, category: str | None = None,
                starred: bool = False, needs_description: bool = False,
                limit: int | None = None) -> list[dict]:
    rows = load(data_root, entry).get("assets", [])
    if category:
        c = norm(category)
        rows = [r for r in rows if norm(r.get("category", "")) == c]
    if starred:
        rows = [r for r in rows if r.get("starred")]
    if needs_description:
        rows = [r for r in rows if r.get("needsDescription")]
    return rows[:limit] if limit else rows


def counts(data_root: Path, entry: dict) -> dict:
    try:
        return load(data_root, entry).get("counts", {})
    except NotFound:
        return {}


def find(data_root: Path, entry: dict, name: str) -> dict:
    """Tra 1 ảnh theo `ascii` hoặc `file`. Dùng khi gán floorplanAsset cho typology."""
    rows = load(data_root, entry).get("assets", [])
    want = str(name).strip().lower()
    for r in rows:
        if str(r.get("ascii", "")).lower() == want or str(r.get("file", "")).lower() == want:
            return r
    names = [r.get("ascii") or r.get("file") for r in rows]
    raise NotFound("asset_not_found", f"Catalog không có ảnh '{name}'",
                   value=name, did_you_mean=did_you_mean(name, [n for n in names if n]),
                   hint="Liệt kê: bds asset list --project <slug> --category floorplan")
