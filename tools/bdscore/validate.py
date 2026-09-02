"""`bds validate` — lint toàn bộ dữ liệu 1 dự án.

Phân biệt rõ **error** (dữ liệu sai, exit 4) và **warning** (dữ liệu còn
nợ, exit 0). Sinh 966 căn mà 400 căn chưa chốt typology là chuyện bình
thường của giai đoạn đầu — chặn commit vì nó thì không ai dùng lệnh này
nữa. Nhưng một căn trỏ vào typology không tồn tại thì là lỗi thật.
"""
from __future__ import annotations

from pathlib import Path

from . import assets as assets_mod
from . import towers as towers_mod
from . import unit_types as ut_mod
from . import units as units_mod
from .errors import NotFound, compact_issues
from .paths import project_dir
from .schema import PROJECT, TOWER, UNIT, UNIT_TYPE, validate as vschema


def run(data_root: Path, entry: dict, full: bool = False) -> dict:
    errors: list[dict] = []
    warnings: list[dict] = []

    # ── dự án ─────────────────────────────────────────────────────────
    reg_fields = {k: v for k, v in entry.items()
                  if k in PROJECT["properties"]}
    errors += [{**i, "scope": "project"} for i in vschema(reg_fields, PROJECT, "project")]

    pdir = project_dir(data_root, entry)
    if not pdir.is_dir():
        errors.append({"scope": "project", "field": "dir", "reason": "missing_folder",
                       "value": entry.get("dir"), "expected": str(pdir)})
        return _result(errors, warnings, {}, full)

    # ── tòa ───────────────────────────────────────────────────────────
    tws = towers_mod.list_towers(data_root, entry)
    tower_codes = [t.get("code") for t in tws]
    for i, t in enumerate(tws):
        errors += [{**x, "scope": "tower"} for x in vschema(t, TOWER, f"towers[{i}]")]
        if not t.get("unitCodes"):
            warnings.append({"scope": "tower", "field": f"towers[{i}].unitCodes",
                             "reason": "empty", "value": t.get("code"),
                             "hint": "Không có mã căn thì `bds unit generate` không sinh được gì."})
        elif not t.get("unitCodesVerified"):
            warnings.append({"scope": "tower", "field": f"towers[{i}].unitCodesVerified",
                             "reason": "unverified", "value": t.get("code"),
                             "hint": "Danh sách mã căn chưa đối chiếu HĐMB — số liệu video nên nói 'khoảng'."})
        covered = set(towers_mod.floors_of(t))
        declared = set(range(int(t.get("floorFrom", 0)), int(t.get("floorTo", 0)) + 1))
        missing = sorted(declared - covered)
        if t.get("floorGroups") and missing:
            warnings.append({"scope": "tower", "field": f"towers[{i}].floorGroups",
                             "reason": "floors_not_covered", "value": t.get("code"),
                             "missingFloors": missing[:20], "missingCount": len(missing)})

    # ── typology ──────────────────────────────────────────────────────
    types = ut_mod.list_types(data_root, entry)
    type_codes = {r.get("code") for r in types}
    for i, r in enumerate(types):
        errors += [{**x, "scope": "unit-type"} for x in vschema(r, UNIT_TYPE, f"unitTypes[{i}]")]
        if r.get("tower") not in tower_codes:
            errors.append({"scope": "unit-type", "field": f"unitTypes[{i}].tower",
                           "reason": "unknown_tower", "value": r.get("tower"),
                           "allowed": tower_codes})
        if not r.get("unitCodes"):
            warnings.append({"scope": "unit-type", "field": f"unitTypes[{i}].unitCodes",
                             "reason": "empty", "value": r.get("code")})
        if not r.get("floorplanAsset"):
            warnings.append({"scope": "unit-type", "field": f"unitTypes[{i}].floorplanAsset",
                             "reason": "empty", "value": r.get("code"),
                             "hint": "Scene mặt bằng trong video sẽ không có ảnh."})

    # mã căn nào bị nhiều typology cùng nhận -> sinh căn sẽ không chốt được
    claims: dict[tuple, list[str]] = {}
    for r in types:
        for c in r.get("unitCodes") or []:
            claims.setdefault((r.get("tower"), str(c).strip().upper()), []).append(r["code"])
    contested = {k: v for k, v in claims.items() if len(v) > 1}
    for (tw, code), owners in sorted(contested.items()):
        warnings.append({"scope": "unit-type", "reason": "contested_unit_code",
                         "field": f"{tw}.{code}", "value": code, "owners": owners,
                         "hint": "Typology đổi theo cụm tầng — cần floorGroups.unitCodes hoặc chốt theo HĐMB."})

    # mã căn của typology có nằm trong danh sách mã căn của tòa không
    for r in types:
        tw = next((t for t in tws if t.get("code") == r.get("tower")), None)
        if not tw or not tw.get("unitCodes"):
            continue
        known = {str(c).strip().upper() for c in tw["unitCodes"]}
        for g in tw.get("floorGroups") or []:
            known |= {str(c).strip().upper() for c in (g.get("unitCodes") or [])}
        stray = [c for c in (r.get("unitCodes") or []) if str(c).strip().upper() not in known]
        if stray:
            warnings.append({"scope": "unit-type", "reason": "unit_code_not_in_tower",
                             "field": f"unitTypes[{r['code']}].unitCodes", "value": stray,
                             "hint": f"Tòa {tw['code']} chưa khai các mã này."})

    # ── ảnh mặt bằng có thật không ────────────────────────────────────
    try:
        cat = assets_mod.load(data_root, entry)
        names = {str(a.get("ascii", "")).lower() for a in cat.get("assets", [])}
        names |= {str(a.get("file", "")).lower() for a in cat.get("assets", [])}
        for r in types:
            fa = r.get("floorplanAsset")
            if fa and str(fa).lower() not in names:
                errors.append({"scope": "unit-type", "field": f"unitTypes[{r['code']}].floorplanAsset",
                               "reason": "asset_not_in_catalog", "value": fa})
    except NotFound:
        warnings.append({"scope": "assets", "reason": "catalog_missing",
                         "hint": "bds project ingest --project <slug>"})

    # ── căn ───────────────────────────────────────────────────────────
    stats_units = {}
    for tc in units_mod.list_towers_with_units(data_root, entry):
        rows = units_mod.load(data_root, entry, tc).get("units", [])
        unresolved = 0
        seen: set[str] = set()
        for i, u in enumerate(rows):
            errors += [{**x, "scope": "unit"} for x in vschema(u, UNIT, f"units-{tc}[{i}]")]
            if u.get("id") in seen:
                errors.append({"scope": "unit", "field": f"units-{tc}[{i}].id",
                               "reason": "duplicate_id", "value": u.get("id")})
            seen.add(u.get("id"))
            want_id = units_mod.make_id(u.get("tower", ""), u.get("floor", 0), u.get("code", ""))
            if u.get("id") != want_id:
                errors.append({"scope": "unit", "field": f"units-{tc}[{i}].id",
                               "reason": "id_mismatch", "value": u.get("id"), "expected": want_id})
            if u.get("tower") not in tower_codes:
                errors.append({"scope": "unit", "field": f"units-{tc}[{i}].tower",
                               "reason": "unknown_tower", "value": u.get("tower"),
                               "allowed": tower_codes})
            if u.get("typeCode") and u["typeCode"] not in type_codes:
                errors.append({"scope": "unit", "field": f"units-{tc}[{i}].typeCode",
                               "reason": "unknown_unit_type", "value": u["typeCode"]})
            if u.get("needsResolution") or not u.get("typeCode"):
                unresolved += 1
        stats_units[tc] = {"total": len(rows), "unresolvedTypeCode": unresolved}
        if unresolved:
            warnings.append({"scope": "unit", "reason": "unresolved_type_code", "field": tc,
                             "value": unresolved,
                             "hint": f"{unresolved}/{len(rows)} căn chưa chốt typology."})

    stats = {
        "towers": len(tws),
        "unitTypes": len(types),
        "contestedUnitCodes": len(contested),
        "units": stats_units,
        "assets": assets_mod.counts(data_root, entry),
    }
    return _result(errors, warnings, stats, full)


def _result(errors: list[dict], warnings: list[dict], stats: dict, full: bool = False) -> dict:
    """Gộp warning trùng lặp trước khi trả về — 44 typology thiếu ảnh mặt bằng
    là MỘT việc cần làm, không phải 44 việc."""
    return {
        "ok": not errors,
        "errorCount": len(errors),
        "warningCount": len(warnings),
        "errors": errors if full else compact_issues(errors),
        "warnings": warnings if full else compact_issues(warnings),
        "stats": stats,
    }
