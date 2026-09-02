"""`workspace/data/projects.json` — registry dự án.

Registry là **nguồn sự thật cho danh tính + wiring dự án** (slug, tên,
alias, thư mục, assetRoots, brandAssets). Tầng căn hộ nằm ở `_data/`, KHÔNG
lặp lại thông tin ở đây — lặp là sớm muộn lệch nhau.

Logic matching port nguyên từ `resolve_project.py` của skill LITE (bỏ dấu,
fuzzy cutoff 0.72, phát hiện ambiguous) để hai đường không cho ra kết quả
khác nhau trên cùng một câu truy vấn.
"""
from __future__ import annotations

from pathlib import Path

from .errors import Ambiguous, Conflict, NotFound
from .paths import data_dir, project_dir
from .store import read_json, write_json
from .text import norm, ratio

REGISTRY_NAME = "projects.json"
SELLING = "dang-ban"
MATCH_CUTOFF = 0.72
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}


def registry_path(data_root: Path) -> Path:
    return data_root / REGISTRY_NAME


def load(data_root: Path) -> dict:
    return read_json(registry_path(data_root), default={"version": 1, "projects": []})


def save(data_root: Path, registry: dict, dry_run: bool = False) -> dict:
    return write_json(registry_path(data_root), registry, dry_run=dry_run)


def discover(data_root: Path, registry: dict) -> list[dict]:
    """Entry trong registry + thư mục có trên đĩa mà registry chưa biết.

    Thư mục lạ vẫn được trả về với `registered: false` để agent thấy mà
    đăng ký, thay vì im lặng bỏ qua.
    """
    known = {p.get("dir") for p in registry.get("projects", [])}
    known |= set(registry.get("ignoreDirs", []))
    out = [{**p, "registered": True} for p in registry.get("projects", [])]
    for d in sorted(data_root.iterdir()):
        if not d.is_dir() or d.name.startswith((".", "_")) or d.name in known:
            continue
        out.append({
            "slug": norm(d.name).replace(" ", "-"), "name": d.name, "shortName": d.name,
            "aliases": [], "dir": d.name, "status": "unknown", "registered": False,
        })
    return out


def _score(entry: dict, q: str) -> float:
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
        best = max(best, ratio(nf, q))
    return best


def resolve(data_root: Path, query: str) -> dict:
    """Tên tự do → 1 entry dự án. Raise NotFound / Ambiguous."""
    entries = discover(data_root, load(data_root))
    q = norm(query)
    scored = sorted(((_score(e, q), e) for e in entries), key=lambda t: -t[0])

    if not scored or scored[0][0] < MATCH_CUTOFF:
        raise NotFound(
            "project_not_found", f"Không tìm thấy dự án khớp '{query}'",
            value=query, allowed=[e.get("slug") or e.get("dir") for e in entries],
            hint="Xem tất cả: bds project list --all-status",
        )

    top = scored[0][0]
    tied = [e for s, e in scored if abs(s - top) < 1e-9]
    if len(tied) > 1:
        raise Ambiguous(
            f"'{query}' khớp {len(tied)} dự án ngang nhau — chỉ định slug cụ thể",
            matches=[e.get("slug") or e.get("dir") for e in tied],
        )

    entry = dict(tied[0])
    entry["matchScore"] = round(top, 3)
    return entry


def hydrate(entry: dict, data_root: Path) -> dict:
    """Gắn đường dẫn tuyệt đối + kiểm kê nhanh asset/_data."""
    pdir = project_dir(data_root, entry)
    out = dict(entry)
    out["path"] = str(pdir)
    out["exists"] = pdir.is_dir()
    if not out["exists"]:
        return out

    out["imageCount"] = sum(
        1 for p in pdir.rglob("*") if p.is_file() and p.suffix.lower() in IMG_EXT
    )
    lib = entry.get("libraryMd")
    out["libraryMdPath"] = str(pdir / lib) if lib and (pdir / lib).is_file() else None
    cat = pdir / "_assets" / "asset-catalog.json"
    out["catalogPath"] = str(cat) if cat.is_file() else None
    dd = data_dir(data_root, entry)
    out["dataDir"] = str(dd) if dd.is_dir() else None
    out["hasUnitData"] = (dd / "unit-types.json").is_file()
    return out


def add(data_root: Path, entry: dict, dry_run: bool = False) -> dict:
    """Thêm dự án mới vào registry. Raise Conflict nếu slug/dir đã dùng."""
    registry = load(data_root)
    projects = registry.setdefault("projects", [])
    for p in projects:
        if p.get("slug") == entry["slug"]:
            raise Conflict(f"Slug '{entry['slug']}' đã tồn tại", existing=p.get("name"))
        if p.get("dir") == entry["dir"]:
            raise Conflict(f"Thư mục '{entry['dir']}' đã gắn với dự án khác",
                           existing=p.get("slug"))
    projects.append(entry)
    projects.sort(key=lambda p: p.get("slug", ""))
    return save(data_root, registry, dry_run=dry_run)


def update(data_root: Path, slug: str, patch: dict, dry_run: bool = False) -> dict:
    """JSON merge patch — `null` trong patch nghĩa là xoá field."""
    registry = load(data_root)
    for p in registry.get("projects", []):
        if p.get("slug") == slug:
            for k, v in patch.items():
                if v is None:
                    p.pop(k, None)
                else:
                    p[k] = v
            return save(data_root, registry, dry_run=dry_run)
    raise NotFound("project_not_found", f"Registry không có slug '{slug}'", value=slug,
                   allowed=[x.get("slug") for x in registry.get("projects", [])])
