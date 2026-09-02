"""`_data/towers.json` — tòa / phân khu + cụm tầng.

Cụm tầng ("floor group") không phải chi tiết trang trí: mặt bằng KHÔNG
đồng nhất toàn tòa. Ở Cao Xà Lá, tầng 23 của L1 tái cấu trúc lõi và đánh
số lại mã căn; tầng 20 & 32 của L2 mở rộng hành lang. Sinh căn mà bỏ qua
cụm tầng là ra một tòa nhà không tồn tại.

Dải tầng lưu dạng chuỗi `spec` ("12-19,21-31,33") chứ không phải mảng 20
phần tử — mảng vừa phình file vừa dễ lệch với label.
"""
from __future__ import annotations

from pathlib import Path

from .errors import Invalid, NotFound
from .paths import data_dir
from .schema import TOWER, validate
from .store import order_keys, read_json, write_json

FILENAME = "towers.json"
KEY_ORDER = ["code", "name", "aliases", "subdivision", "shape", "floorFrom", "floorTo",
             "unitsPerFloor", "unitCodes", "unitCodesVerified", "floorGroups", "notes", "sourceRef"]


def path(data_root: Path, entry: dict) -> Path:
    return data_dir(data_root, entry) / FILENAME


def load(data_root: Path, entry: dict) -> dict:
    return read_json(path(data_root, entry),
                     default={"version": 1, "project": entry.get("slug"), "towers": []})


def list_towers(data_root: Path, entry: dict) -> list[dict]:
    return load(data_root, entry).get("towers", [])


def get(data_root: Path, entry: dict, code: str) -> dict:
    towers = list_towers(data_root, entry)
    want = str(code).strip().lower()
    for t in towers:
        names = [t.get("code", "")] + list(t.get("aliases", []))
        if any(str(n).strip().lower() == want for n in names):
            return t
    raise NotFound("tower_not_found", f"Dự án không có tòa '{code}'",
                   value=code, allowed=[t.get("code") for t in towers])


def parse_floor_spec(spec: str) -> list[int]:
    """"12-19,21-31,33" -> [12..19, 21..31, 33]. Giữ thứ tự, khử trùng lặp."""
    out: list[int] = []
    for chunk in str(spec).split(","):
        chunk = chunk.strip()
        if not chunk:
            continue
        if "-" in chunk:
            a, b = chunk.split("-", 1)
            lo, hi = int(a), int(b)
            if lo > hi:
                lo, hi = hi, lo
            out.extend(range(lo, hi + 1))
        else:
            out.append(int(chunk))
    seen: set[int] = set()
    return [f for f in out if not (f in seen or seen.add(f))]


def floors_of(tower: dict) -> list[int]:
    """Mọi tầng căn hộ của tòa — hợp của các floorGroups, fallback về floorFrom..To."""
    groups = tower.get("floorGroups") or []
    if not groups:
        return list(range(int(tower["floorFrom"]), int(tower["floorTo"]) + 1))
    seen: set[int] = set()
    out: list[int] = []
    for g in groups:
        for f in parse_floor_spec(g["spec"]):
            if f not in seen:
                seen.add(f)
                out.append(f)
    return sorted(out)


def group_for_floor(tower: dict, floor: int) -> dict | None:
    for g in tower.get("floorGroups") or []:
        if floor in parse_floor_spec(g["spec"]):
            return g
    return None


def unit_codes_for_floor(tower: dict, floor: int) -> list[str]:
    """Mã căn của tầng — cụm tầng ghi đè mặc định của tòa nếu có."""
    g = group_for_floor(tower, floor)
    if g and g.get("unitCodes"):
        return list(g["unitCodes"])
    return list(tower.get("unitCodes") or [])


def upsert(data_root: Path, entry: dict, items: list[dict], dry_run: bool = False) -> dict:
    """Thêm/cập nhật tòa theo khoá `code`. Idempotent."""
    if isinstance(items, dict):
        items = [items]

    issues: list[dict] = []
    for i, item in enumerate(items):
        issues.extend(validate(item, TOWER, f"towers[{i}]"))
    for i, item in enumerate(items):
        if item.get("floorFrom") is not None and item.get("floorTo") is not None:
            if item["floorFrom"] > item["floorTo"]:
                issues.append({"field": f"towers[{i}].floorFrom", "reason": "range",
                               "value": item["floorFrom"],
                               "expected": f"<= floorTo ({item['floorTo']})"})
    if issues:
        raise Invalid(f"{len(issues)} lỗi schema ở towers", issues=issues)

    doc = load(data_root, entry)
    by_code = {t["code"]: t for t in doc.get("towers", [])}
    created, updated = [], []
    for item in items:
        item = order_keys(dict(item), KEY_ORDER)
        if item["code"] in by_code:
            by_code[item["code"]].update(item)
            updated.append(item["code"])
        else:
            by_code[item["code"]] = item
            created.append(item["code"])

    doc["version"] = 1
    doc["project"] = entry.get("slug")
    doc["towers"] = [by_code[c] for c in sorted(by_code)]
    info = write_json(path(data_root, entry), doc, dry_run=dry_run)
    return {"created": created, "updated": updated, "total": len(doc["towers"]),
            "dryRun": dry_run, "file": info}
