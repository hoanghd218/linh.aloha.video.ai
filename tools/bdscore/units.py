"""`_data/units-<TOWER>.json` — căn hộ cụ thể (tòa + tầng + mã căn).

Tách file theo tòa vì mỗi tòa ~1.000 căn; gộp 1 file là mỗi lần ghi git
diff đỏ cả 2.000 dòng.

**Giới hạn phải nói thẳng:** một mã căn có thể thuộc nhiều typology khác
nhau tuỳ cụm tầng (CH-12 ở Cao Xà Lá vừa là Studio, vừa là 1BR–Loại 2,
vừa là 1BR+1MR–Loại 3). Tài liệu mặt bằng hiện có KHÔNG ghi ánh xạ
tầng→typology, chỉ ghi typology→các mã căn. Nên `generate` sẽ:

- gán `typeCode` khi đúng 1 typology nhận mã đó,
- để `typeCode: null` + `typeCandidates: [...]` + `needsResolution: true`
  khi có nhiều ứng viên.

Không đoán bừa. `bds validate` đếm số căn chưa chốt để biết còn nợ bao nhiêu.
"""
from __future__ import annotations

from pathlib import Path

from . import towers as towers_mod
from . import unit_types as ut_mod
from .errors import Invalid, NotFound
from .paths import data_dir
from .schema import UNIT, validate
from .store import order_keys, read_json, write_json

KEY_ORDER = ["id", "code", "tower", "floor", "typeCode", "typeCandidates", "needsResolution",
             "dtTim", "dtTt", "direction", "view", "price", "pricePerM2", "status",
             "corner", "notes", "source"]


def filename(tower_code: str) -> str:
    return f"units-{tower_code}.json"


def path(data_root: Path, entry: dict, tower_code: str) -> Path:
    return data_dir(data_root, entry) / filename(tower_code)


def make_id(tower: str, floor: int, code: str) -> str:
    """Khoá tự nhiên. Tầng pad 2 chữ số để sort chuỗi ra đúng thứ tự tầng."""
    return f"{tower}-{int(floor):02d}-{code}"


def load(data_root: Path, entry: dict, tower_code: str) -> dict:
    return read_json(path(data_root, entry, tower_code),
                     default={"version": 1, "project": entry.get("slug"),
                              "tower": tower_code, "units": []})


def list_towers_with_units(data_root: Path, entry: dict) -> list[str]:
    dd = data_dir(data_root, entry)
    if not dd.is_dir():
        return []
    return sorted(p.name[len("units-"):-len(".json")] for p in dd.glob("units-*.json"))


def list_units(data_root: Path, entry: dict, tower: str | None = None, floors: str | None = None,
               type_code: str | None = None, status: str | None = None,
               code: str | None = None, limit: int | None = None) -> list[dict]:
    codes = [tower] if tower else list_towers_with_units(data_root, entry)
    floor_set = set(towers_mod.parse_floor_spec(floors)) if floors else None
    out: list[dict] = []
    for tc in codes:
        for u in load(data_root, entry, tc).get("units", []):
            if floor_set is not None and u.get("floor") not in floor_set:
                continue
            if type_code and str(u.get("typeCode") or "").lower() != type_code.lower():
                continue
            if status and str(u.get("status") or "unknown").lower() != status.lower():
                continue
            if code and str(u.get("code", "")).lower() != code.lower():
                continue
            out.append(u)
            if limit and len(out) >= limit:
                return out
    return out


def show(data_root: Path, entry: dict, tower: str, code: str, floor: int | None = None) -> dict:
    """1 căn + typology của nó + ảnh mặt bằng — payload đủ để feed skill video."""
    matches = list_units(data_root, entry, tower=tower, code=code,
                         floors=str(floor) if floor is not None else None)
    if not matches:
        known = sorted({u["code"] for u in list_units(data_root, entry, tower=tower)})
        raise NotFound("unit_not_found",
                       f"Tòa {tower} không có căn '{code}'"
                       + (f" ở tầng {floor}" if floor is not None else ""),
                       value=code, allowed=known)

    unit = matches[0] if floor is not None else matches[len(matches) // 2]
    out = {"unit": unit, "floorsWithThisCode": sorted(u["floor"] for u in matches)}

    if unit.get("typeCode"):
        out["unitType"] = ut_mod.get(data_root, entry, unit["typeCode"])
    elif unit.get("typeCandidates"):
        out["unitTypeCandidates"] = [
            ut_mod.get(data_root, entry, c) for c in unit["typeCandidates"]
        ]
        out["warning"] = (
            "Mã căn này thuộc nhiều typology tuỳ cụm tầng — dữ liệu mặt bằng chưa đủ "
            "để chốt. Xác nhận theo HĐMB rồi `bds unit upsert` để ghi typeCode."
        )
    return out


def generate(data_root: Path, entry: dict, tower_code: str, floors: str | None = None,
             dry_run: bool = False, overwrite: bool = False) -> dict:
    """Sinh căn cho 1 tòa từ towers.json × unit-types.json.

    Idempotent: căn đã có (theo `id`) chỉ được bù field còn trống, KHÔNG
    ghi đè giá / status / hướng do người nhập. `--overwrite` mới ghi đè.
    """
    tower = towers_mod.get(data_root, entry, tower_code)
    tcode = tower["code"]
    all_floors = towers_mod.floors_of(tower)
    if floors:
        want = set(towers_mod.parse_floor_spec(floors))
        target = [f for f in all_floors if f in want]
        if not target:
            raise Invalid(f"Dải tầng '{floors}' không giao với tầng căn hộ của tòa {tcode}",
                          issues=[{"field": "floors", "reason": "empty_intersection",
                                   "value": floors,
                                   "expected": f"{all_floors[0]}..{all_floors[-1]}"}])
    else:
        target = all_floors

    types = ut_mod.list_types(data_root, entry, tower=tcode)
    if not types:
        raise NotFound("no_unit_types",
                       f"Tòa {tcode} chưa có typology — chạy `bds unit-type upsert` trước",
                       value=tcode)

    # mã căn (chữ thường) -> các typology nhận mã đó
    claim: dict[str, list[str]] = {}
    for t in types:
        for c in t.get("unitCodes") or []:
            claim.setdefault(str(c).strip().lower(), []).append(t["code"])
    by_type = {t["code"]: t for t in types}

    doc = load(data_root, entry, tcode)
    existing = {u["id"]: u for u in doc.get("units", [])}
    created, refreshed, ambiguous, unmapped = [], [], 0, set()

    for floor in target:
        for code in towers_mod.unit_codes_for_floor(tower, floor):
            uid = make_id(tcode, floor, code)
            cands = claim.get(str(code).strip().lower(), [])
            if not cands:
                unmapped.add(code)
            resolved = cands[0] if len(cands) == 1 else None
            if len(cands) > 1:
                ambiguous += 1

            fresh = {
                "id": uid, "code": code, "tower": tcode, "floor": floor,
                "typeCode": resolved,
                "typeCandidates": cands if len(cands) > 1 else [],
                "needsResolution": resolved is None,
                "dtTim": by_type[resolved].get("dtTim") if resolved else None,
                "dtTt": None,  # dao động theo tầng — chỉ điền khi có số thật của tầng đó
                "direction": None, "view": None, "price": None, "pricePerM2": None,
                "status": "unknown",
                "corner": bool(by_type[resolved].get("corner")) if resolved else False,
                "notes": None, "source": "generated",
            }

            if uid not in existing:
                existing[uid] = order_keys(fresh, KEY_ORDER)
                created.append(uid)
            elif overwrite:
                existing[uid] = order_keys({**existing[uid], **fresh}, KEY_ORDER)
                refreshed.append(uid)
            else:
                # chỉ bù field còn trống — giữ nguyên dữ liệu người đã nhập
                cur = existing[uid]
                filled = {k: v for k, v in fresh.items()
                          if cur.get(k) in (None, [], "", False) and v not in (None, [], "", False)}
                if filled:
                    cur.update(filled)
                    refreshed.append(uid)

    doc["version"] = 1
    doc["project"] = entry.get("slug")
    doc["tower"] = tcode
    doc["units"] = sorted(existing.values(), key=lambda u: (u["floor"], u["code"]))
    info = write_json(path(data_root, entry, tcode), doc, dry_run=dry_run)

    return {
        "tower": tcode, "floors": f"{target[0]}-{target[-1]}", "floorCount": len(target),
        "created": len(created), "refreshed": len(refreshed), "total": len(doc["units"]),
        "unresolvedTypeCode": sum(1 for u in doc["units"] if u.get("needsResolution")),
        "ambiguousAssignments": ambiguous,
        "unitCodesWithNoTypology": sorted(unmapped),
        "dryRun": dry_run, "file": info,
        "note": ("typeCode để null ở những căn có nhiều typology cùng nhận mã — "
                 "xem `typeCandidates`, chốt theo HĐMB rồi `bds unit upsert`."),
    }


def upsert(data_root: Path, entry: dict, items: list[dict], dry_run: bool = False) -> dict:
    """Ghi/sửa căn. Khoá `id`; thiếu `id` thì tự dựng từ tower+floor+code."""
    if isinstance(items, dict):
        items = [items]

    prepared, issues = [], []
    for i, raw in enumerate(items):
        item = dict(raw)
        if not item.get("id") and all(item.get(k) is not None for k in ("tower", "floor", "code")):
            item["id"] = make_id(item["tower"], item["floor"], item["code"])
        issues.extend(validate(item, UNIT, f"units[{i}]"))
        prepared.append(item)
    if issues:
        raise Invalid(f"{len(issues)} lỗi ở units", issues=issues)

    known_types = {t["code"] for t in ut_mod.load(data_root, entry).get("unitTypes", [])}
    for i, item in enumerate(prepared):
        tc = item.get("typeCode")
        if tc and tc not in known_types:
            from .text import did_you_mean
            issues.append({"field": f"units[{i}].typeCode", "reason": "unknown_unit_type",
                           "value": tc, "allowed": sorted(known_types),
                           "did_you_mean": did_you_mean(tc, sorted(known_types))})
    if issues:
        raise Invalid(f"{len(issues)} lỗi tham chiếu ở units", issues=issues)

    by_tower: dict[str, list[dict]] = {}
    for item in prepared:
        by_tower.setdefault(item["tower"], []).append(item)

    report = {"dryRun": dry_run, "towers": {}}
    for tcode, group in by_tower.items():
        doc = load(data_root, entry, tcode)
        existing = {u["id"]: u for u in doc.get("units", [])}
        created, updated = [], []
        for item in group:
            if item["id"] in existing:
                existing[item["id"]].update(item)
                existing[item["id"]]["source"] = item.get("source", "manual")
                if item.get("typeCode"):
                    existing[item["id"]]["needsResolution"] = False
                updated.append(item["id"])
            else:
                item.setdefault("status", "unknown")
                item.setdefault("source", "manual")
                item.setdefault("needsResolution", item.get("typeCode") is None)
                existing[item["id"]] = order_keys(item, KEY_ORDER)
                created.append(item["id"])
        doc["version"] = 1
        doc["project"] = entry.get("slug")
        doc["tower"] = tcode
        doc["units"] = sorted(existing.values(), key=lambda u: (u["floor"], u["code"]))
        info = write_json(path(data_root, entry, tcode), doc, dry_run=dry_run)
        report["towers"][tcode] = {"created": len(created), "updated": len(updated),
                                   "total": len(doc["units"]), "file": info}
    return report
