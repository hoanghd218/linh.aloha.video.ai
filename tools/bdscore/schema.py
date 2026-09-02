"""Schema các resource + validator tự viết (zero-dependency).

**Vì sao không dùng `jsonschema`:** thông báo lỗi của nó viết cho người
debug, không phải cho agent tự sửa. Validator ở đây trả về đúng thứ agent
cần — `field` / `value` / `allowed` / `did_you_mean` — và chạy được với
python3 stock, không cần venv trên máy nào chạy skill.

Schema chỉ hỗ trợ tập keyword đang thực sự dùng: type, required,
properties, additionalProperties, enum, pattern, minimum, maximum,
minLength, items. Thêm keyword khi nào cần, đừng thêm trước.
"""
from __future__ import annotations

import re
from typing import Any

from .text import did_you_mean

# ── Bảng giá trị hợp lệ ────────────────────────────────────────────────

UNIT_GROUPS = ["studio", "1br", "1br+1mr", "2br", "2br+1mr", "3br", "3br+1mr", "duplex", "penthouse"]
UNIT_STATUSES = ["available", "reserved", "sold", "hold", "unknown"]
PROJECT_STATUSES = ["dang-ban", "sap-mo-ban", "da-ban-het", "tam-dung", "unknown"]
DIRECTIONS = ["B", "N", "D", "T", "DB", "DN", "TB", "TN"]
DIRECTION_LABELS = {"B": "Bắc", "N": "Nam", "D": "Đông", "T": "Tây",
                    "DB": "Đông Bắc", "DN": "Đông Nam", "TB": "Tây Bắc", "TN": "Tây Nam"}

_NUM = ["number", "null"]
_STR = ["string", "null"]

# ── Schema ─────────────────────────────────────────────────────────────

PROJECT = {
    "type": "object",
    "required": ["slug", "name", "dir"],
    "additionalProperties": False,
    "properties": {
        "slug": {"type": "string", "pattern": r"^[a-z0-9]+(-[a-z0-9]+)*$",
                 "description": 'Khoá dự án, kebab-case không dấu, vd "cao-xa-la"'},
        "name": {"type": "string", "minLength": 2, "description": "Tên thương mại đầy đủ"},
        "shortName": {"type": _STR, "description": 'Tên gọi ngắn đời thường, vd "Cao Xà Lá"'},
        "aliases": {"type": "array", "items": {"type": "string"},
                    "description": "Mọi cách người ta gọi dự án — resolver dùng để match"},
        "dir": {"type": "string", "minLength": 1,
                "description": "Tên thư mục con trong workspace/data/ (được phép có dấu)"},
        "developer": {"type": _STR},
        "status": {"type": "string", "enum": PROJECT_STATUSES},
        "phase": {"type": _STR, "description": 'Giai đoạn đang bán, vd "The Bloom — Tòa L1 + L2"'},
        "location": {"type": _STR},
        "scale": {"type": _STR},
        "knowledgeDir": {"type": _STR, "description": "Thư mục note kiến thức, mặc định _kien-thuc-du-an"},
        "libraryMd": {"type": _STR, "description": "Note thư viện ảnh, nguồn mô tả cho asset-catalog"},
        "assetRoots": {"type": "object", "description": "map thư mục ảnh → category"},
        "illustrativeDisclaimer": {"type": _STR},
        "hotline": {"type": _STR},
        "brandAssets": {"type": "object"},
    },
}

TOWER = {
    "type": "object",
    "required": ["code", "floorFrom", "floorTo"],
    "additionalProperties": False,
    "properties": {
        "code": {"type": "string", "pattern": r"^[A-Za-z0-9._-]{1,12}$",
                 "description": 'Mã tòa ngắn, vd "L1". Dùng làm khoá — đổi là vỡ tham chiếu.'},
        "name": {"type": _STR, "description": 'Tên hiển thị, vd "Tòa L1"'},
        "aliases": {"type": "array", "items": {"type": "string"},
                    "description": 'Tên gọi khác, vd "HHB" là mã kỹ thuật của L2'},
        "subdivision": {"type": _STR, "description": 'Phân khu, vd "The Bloom"'},
        "shape": {"type": _STR, "description": 'Hình khối, vd "Chữ L (2 cánh)"'},
        "floorFrom": {"type": "integer", "minimum": -5, "maximum": 200},
        "floorTo": {"type": "integer", "minimum": -5, "maximum": 200},
        "unitsPerFloor": {"type": ["integer", "null"], "minimum": 1, "maximum": 200},
        "unitCodes": {"type": "array", "items": {"type": "string"},
                      "description": "Mã căn điển hình 1 tầng, vd CH-01..CH-23"},
        "unitCodesVerified": {"type": "boolean",
                              "description": "false = danh sách mã căn là suy đoán, chưa đối chiếu HĐMB"},
        "floorGroups": {"type": "array", "items": {
            "type": "object",
            "required": ["label", "spec"],
            "additionalProperties": False,
            "properties": {
                "label": {"type": "string"},
                "spec": {"type": "string", "pattern": r"^\d+(-\d+)?(,\d+(-\d+)?)*$",
                         "description": 'Dải tầng, vd "12-19,21-31,33"'},
                "unitCodes": {"type": "array", "items": {"type": "string"},
                              "description": "Ghi đè mã căn của tòa cho riêng cụm tầng này"},
                "notes": {"type": _STR},
            },
        }},
        "notes": {"type": _STR},
        "sourceRef": {"type": _STR, "description": "File nguồn đã rút dữ liệu ra"},
    },
}

UNIT_TYPE = {
    "type": "object",
    "required": ["code", "tower", "group"],
    "additionalProperties": False,
    "properties": {
        "code": {"type": "string", "pattern": r"^[A-Za-z0-9+._-]{1,32}$",
                 "description": 'Khoá typology, vd "L1-2BR1MR-1"'},
        "tower": {"type": "string", "description": "Mã tòa — phải tồn tại trong towers.json"},
        "label": {"type": _STR, "description": 'Tên người đọc, vd "2BR+1MR – Loại 1"'},
        "group": {"type": "string", "enum": UNIT_GROUPS},
        "bedrooms": {"type": ["integer", "null"], "minimum": 0, "maximum": 10},
        "mrRooms": {"type": ["integer", "null"], "minimum": 0, "maximum": 5,
                    "description": "Số phòng đa năng (MR)"},
        "dtTim": {"type": _NUM, "minimum": 10, "maximum": 1000,
                  "description": "Diện tích tim tường (m²) — theo HĐMB. Nếu là dải thì đây là cận dưới."},
        "dtTimMax": {"type": _NUM, "minimum": 10, "maximum": 1000},
        "dtTtMin": {"type": _NUM, "minimum": 10, "maximum": 1000,
                    "description": "Diện tích thông thủy cận dưới (m²) — dao động theo tầng"},
        "dtTtMax": {"type": _NUM, "minimum": 10, "maximum": 1000},
        "unitCodes": {"type": "array", "items": {"type": "string"},
                      "description": "Các mã căn mang typology này"},
        "features": {"type": "array", "items": {"type": "string"},
                     "description": 'vd ["logia","bếp mở","ban công bo cong"]'},
        "corner": {"type": "boolean", "description": "Căn góc"},
        "signature": {"type": "boolean", "description": "Căn signature — dùng làm hook video"},
        "priceFrom": {"type": _NUM, "minimum": 0},
        "priceTo": {"type": _NUM, "minimum": 0},
        "floorplanAsset": {"type": _STR,
                           "description": "Tên file trong _assets/asset-catalog.json (field `ascii` hoặc `file`)"},
        "notes": {"type": _STR},
        "sourceRef": {"type": _STR},
    },
}

UNIT = {
    "type": "object",
    "required": ["id", "code", "tower", "floor"],
    "additionalProperties": False,
    "properties": {
        "id": {"type": "string", "description": "Khoá tự nhiên <tower>-<floor>-<code>, sinh tự động"},
        "code": {"type": "string", "pattern": r"^[A-Za-z0-9._-]{1,16}$", "description": 'vd "CH-01"'},
        "tower": {"type": "string"},
        "floor": {"type": "integer", "minimum": -5, "maximum": 200},
        "typeCode": {"type": _STR, "description": "Trỏ tới unit-types.json. null = chưa xác định."},
        "typeCandidates": {"type": "array", "items": {"type": "string"},
                           "description": "Nhiều typology cùng nhận mã căn này — cần người/agent chốt"},
        "needsResolution": {"type": "boolean",
                            "description": "true = typeCode chưa chốt được từ dữ liệu hiện có"},
        "dtTim": {"type": _NUM, "minimum": 10, "maximum": 1000},
        "dtTt": {"type": _NUM, "minimum": 10, "maximum": 1000,
                 "description": "DT thông thủy CỦA ĐÚNG TẦNG NÀY. null = chỉ biết dải ở typology."},
        "direction": {"type": _STR, "enum": DIRECTIONS + [None], "enumLabels": DIRECTION_LABELS,
                      "description": "Mã hướng viết tắt không dấu — xem enumLabels"},
        "view": {"type": _STR},
        "price": {"type": _NUM, "minimum": 0, "description": "VND, tổng giá căn"},
        "pricePerM2": {"type": _NUM, "minimum": 0},
        "status": {"type": "string", "enum": UNIT_STATUSES},
        "corner": {"type": "boolean"},
        "notes": {"type": _STR},
        "source": {"type": "string", "enum": ["generated", "manual", "import"]},
    },
}

RESOURCES = {"project": PROJECT, "tower": TOWER, "unit-type": UNIT_TYPE, "unit": UNIT}


# ── Validator ──────────────────────────────────────────────────────────

def _type_ok(value: Any, spec: Any) -> bool:
    types = spec if isinstance(spec, list) else [spec]
    for t in types:
        if t == "null" and value is None:
            return True
        if t == "string" and isinstance(value, str):
            return True
        if t == "boolean" and isinstance(value, bool):
            return True
        if t == "integer" and isinstance(value, int) and not isinstance(value, bool):
            return True
        if t == "number" and isinstance(value, (int, float)) and not isinstance(value, bool):
            return True
        if t == "array" and isinstance(value, list):
            return True
        if t == "object" and isinstance(value, dict):
            return True
    return False


def validate(instance: Any, schema: dict, field: str = "") -> list[dict]:
    """Trả về list issue (rỗng = hợp lệ). Không raise — caller quyết định."""
    issues: list[dict] = []
    here = field or "$"

    if "type" in schema and not _type_ok(instance, schema["type"]):
        want = schema["type"] if isinstance(schema["type"], str) else "|".join(schema["type"])
        issues.append({"field": here, "reason": "type", "expected": want,
                       "value": instance, "got": type(instance).__name__})
        return issues  # sai kiểu thì mọi check sau vô nghĩa

    if instance is None:
        return issues

    if "enum" in schema:
        allowed = [a for a in schema["enum"] if a is not None]
        if instance not in schema["enum"]:
            labels = schema.get("enumLabels")
            # Cho phép đoán qua nhãn tiếng Việt: "Đông Nam" -> "DN".
            hint = did_you_mean(str(instance), [str(a) for a in allowed])
            if hint is None and labels:
                by_label = did_you_mean(str(instance), list(labels.values()))
                hint = next((k for k, v in labels.items() if v == by_label), None)
            issues.append({"field": here, "reason": "enum", "value": instance,
                           "allowed": allowed, "enumLabels": labels,
                           "did_you_mean": hint})

    if isinstance(instance, str):
        if "pattern" in schema and not re.match(schema["pattern"], instance):
            issues.append({"field": here, "reason": "pattern", "value": instance,
                           "expected": schema["pattern"]})
        if "minLength" in schema and len(instance) < schema["minLength"]:
            issues.append({"field": here, "reason": "minLength", "value": instance,
                           "expected": schema["minLength"]})

    if isinstance(instance, (int, float)) and not isinstance(instance, bool):
        if "minimum" in schema and instance < schema["minimum"]:
            issues.append({"field": here, "reason": "minimum", "value": instance,
                           "expected": schema["minimum"]})
        if "maximum" in schema and instance > schema["maximum"]:
            issues.append({"field": here, "reason": "maximum", "value": instance,
                           "expected": schema["maximum"]})

    if isinstance(instance, dict):
        props = schema.get("properties", {})
        for req in schema.get("required", []):
            if instance.get(req) is None:
                issues.append({"field": f"{here}.{req}", "reason": "required", "value": None})
        if schema.get("additionalProperties") is False:
            for key in instance:
                if key not in props:
                    issues.append({"field": f"{here}.{key}", "reason": "unknown_field", "value": key,
                                   "allowed": sorted(props),
                                   "did_you_mean": did_you_mean(key, sorted(props))})
        for key, sub in props.items():
            if key in instance:
                issues.extend(validate(instance[key], sub, f"{here}.{key}"))

    if isinstance(instance, list) and "items" in schema:
        for i, item in enumerate(instance):
            issues.extend(validate(item, schema["items"], f"{here}[{i}]"))

    return issues


def describe(resource: str) -> dict:
    """Schema dạng JSON cho `bds schema <resource>` — agent tự học contract."""
    from .errors import NotFound

    if resource not in RESOURCES:
        raise NotFound("unknown_resource", f"Không có resource '{resource}'",
                       value=resource, allowed=sorted(RESOURCES))
    return {"resource": resource, "schema": RESOURCES[resource]}
