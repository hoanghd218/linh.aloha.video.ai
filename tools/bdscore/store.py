"""Đọc/ghi JSON: atomic, thứ tự key ổn định, UTF-8 giữ nguyên dấu.

Ba thứ này đều load-bearing:

- **Atomic** (ghi tmp rồi `os.replace`) — agent bị Ctrl-C giữa chừng không
  để lại `units-L1.json` cụt đầu.
- **Thứ tự key ổn định** — file 1.000 căn mà key nhảy lung tung thì mỗi
  lần ghi git diff đỏ toàn bộ, review vô nghĩa.
- **`ensure_ascii=False`** — giữ "Tòa L1 — Phân khu The Bloom" đọc được
  trong diff thay vì `\\u1ed2a`.
"""
from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from typing import Any

from .errors import BdsError


def read_json(path: Path, default: Any = None) -> Any:
    p = Path(path)
    if not p.is_file():
        if default is not None:
            return default
        raise BdsError("file_missing", f"Không tìm thấy file: {p}", path=str(p))
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise BdsError("bad_json", f"{p} không phải JSON hợp lệ: {e}", path=str(p)) from e


def write_json(path: Path, payload: Any, dry_run: bool = False) -> dict:
    """Ghi atomic. Trả về mô tả thao tác (dùng cho `--dry-run` in diff)."""
    p = Path(path)
    before = p.read_text(encoding="utf-8") if p.is_file() else None
    text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    info = {
        "path": str(p),
        "action": "create" if before is None else ("unchanged" if before == text else "update"),
        "bytes": len(text.encode("utf-8")),
    }
    if dry_run or info["action"] == "unchanged":
        return info
    p.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(p.parent), prefix=f".{p.name}.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(text)
        # mkstemp cho 0600; các script/skill khác cũng đọc file này nên trả về
        # quyền thường của file dữ liệu.
        os.chmod(tmp, 0o644)
        os.replace(tmp, p)
    except BaseException:
        Path(tmp).unlink(missing_ok=True)
        raise
    return info


def order_keys(obj: dict, order: list[str]) -> dict:
    """Sắp key theo `order` trước, phần còn lại giữ nguyên thứ tự cũ.

    Giữ diff ổn định mà không ép sort alphabet (sort alphabet làm file khó
    đọc: `code` lẽ ra đứng đầu lại rơi xuống giữa).
    """
    out = {k: obj[k] for k in order if k in obj}
    out.update({k: v for k, v in obj.items() if k not in out})
    return out
