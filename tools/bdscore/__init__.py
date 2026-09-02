"""bdscore — lõi dữ liệu BĐS (dự án + căn hộ) cho pipeline video.

Mọi vỏ bọc (CLI `bds`, MCP server sau này) đều gọi đúng các hàm ở đây và
KHÔNG chứa logic riêng. Thêm chức năng = sửa lõi + vài dòng ở mỗi vỏ.

Nguồn sự thật là filesystem trong `workspace/data/`:

    projects.json                 registry: danh tính + wiring dự án
    <dự án>/_data/towers.json     tòa + cụm tầng
    <dự án>/_data/unit-types.json typology  ← resource load-bearing cho video
    <dự án>/_data/units-<T>.json  căn cụ thể
    <dự án>/_assets/asset-catalog.json  (do skill LITE sinh, chỉ đọc)
"""
from __future__ import annotations

from . import assets, projects, registry, schema, towers, unit_types, units, validate
from .errors import Ambiguous, BdsError, Conflict, Invalid, NotFound
from .paths import find_data_root

__all__ = [
    "assets", "projects", "registry", "schema", "towers", "unit_types", "units", "validate",
    "BdsError", "NotFound", "Ambiguous", "Invalid", "Conflict", "find_data_root",
]
