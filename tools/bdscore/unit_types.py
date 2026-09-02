"""`_data/unit-types.json` — typology căn hộ. **Đây là resource load-bearing.**

Pipeline video kể chuyện bằng typology ("căn 2PN+1ĐN 110,7 m² tim tường,
ban công bo cong, view 2–3 hướng"), không phải bằng 966 căn cụ thể. Nên
unit-type là thứ skill video đọc; `units.py` chỉ phục vụ khi cần tra đúng
1 căn ở đúng 1 tầng.

Quy ước mã: `<TOWER>-<GROUP>-<N>` — vd `L1-2BR1MR-1`. Bỏ dấu `+` khỏi
group trong mã để mã dùng được cả trong tên file lẫn URL.
"""
from __future__ import annotations

from pathlib import Path

from .errors import Invalid, NotFound
from .paths import data_dir
from .schema import UNIT_TYPE, validate
from .store import order_keys, read_json, write_json
from .text import norm

FILENAME = "unit-types.json"
KEY_ORDER = ["code", "tower", "label", "group", "bedrooms", "mrRooms",
             "dtTim", "dtTimMax", "dtTtMin", "dtTtMax", "unitCodes", "features",
             "corner", "signature", "priceFrom", "priceTo", "floorplanAsset",
             "notes", "sourceRef"]


def path(data_root: Path, entry: dict) -> Path:
    return data_dir(data_root, entry) / FILENAME


def load(data_root: Path, entry: dict) -> dict:
    return read_json(path(data_root, entry),
                     default={"version": 1, "project": entry.get("slug"), "unitTypes": []})


def list_types(data_root: Path, entry: dict, tower: str | None = None,
               group: str | None = None) -> list[dict]:
    rows = load(data_root, entry).get("unitTypes", [])
    if tower:
        rows = [r for r in rows if str(r.get("tower", "")).lower() == str(tower).lower()]
    if group:
        g = norm(group)
        rows = [r for r in rows if norm(r.get("group", "")) == g]
    return rows


def get(data_root: Path, entry: dict, code: str) -> dict:
    rows = load(data_root, entry).get("unitTypes", [])
    want = str(code).strip().lower()
    for r in rows:
        if str(r.get("code", "")).lower() == want:
            return r
    raise NotFound("unit_type_not_found", f"Không có typology '{code}'",
                   value=code, allowed=[r.get("code") for r in rows])


def find_by_unit_code(data_root: Path, entry: dict, tower: str, unit_code: str) -> list[dict]:
    """Các typology nhận mã căn này. Trả về list — thường >1 vì typology đổi theo tầng."""
    want = str(unit_code).strip().lower()
    return [
        r for r in list_types(data_root, entry, tower=tower)
        if any(str(c).strip().lower() == want for c in r.get("unitCodes") or [])
    ]


def upsert(data_root: Path, entry: dict, items: list[dict], dry_run: bool = False,
           known_towers: list[str] | None = None) -> dict:
    """Thêm/cập nhật typology theo khoá `code`. Idempotent."""
    if isinstance(items, dict):
        items = [items]

    issues: list[dict] = []
    for i, item in enumerate(items):
        issues.extend(validate(item, UNIT_TYPE, f"unitTypes[{i}]"))

    # Toàn vẹn tham chiếu: tower phải tồn tại. Bắt ở đây rẻ hơn nhiều so với
    # phát hiện lúc sinh 1.000 căn trỏ vào một tòa không có thật.
    if known_towers is not None:
        allowed = {t.lower() for t in known_towers}
        for i, item in enumerate(items):
            tw = str(item.get("tower", ""))
            if tw and tw.lower() not in allowed:
                from .text import did_you_mean
                issues.append({"field": f"unitTypes[{i}].tower", "reason": "unknown_tower",
                               "value": tw, "allowed": known_towers,
                               "did_you_mean": did_you_mean(tw, known_towers),
                               "hint": None if known_towers else
                               "Dự án chưa khai tòa nào — chạy `bds tower upsert` trước."})

    for i, item in enumerate(items):
        lo, hi = item.get("dtTtMin"), item.get("dtTtMax")
        if lo is not None and hi is not None and lo > hi:
            issues.append({"field": f"unitTypes[{i}].dtTtMin", "reason": "range",
                           "value": lo, "expected": f"<= dtTtMax ({hi})"})

    if issues:
        raise Invalid(f"{len(issues)} lỗi ở unit-types", issues=issues)

    doc = load(data_root, entry)
    by_code = {r["code"]: r for r in doc.get("unitTypes", [])}
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
    doc["unitTypes"] = sorted(by_code.values(), key=lambda r: (r.get("tower", ""), r.get("code", "")))
    info = write_json(path(data_root, entry), doc, dry_run=dry_run)
    return {"created": created, "updated": updated, "total": len(doc["unitTypes"]),
            "dryRun": dry_run, "file": info}
