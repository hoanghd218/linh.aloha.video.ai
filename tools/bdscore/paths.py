"""Định vị repo root / workspace-data / thư mục _data của từng dự án.

`bds` được gọi từ nhiều chỗ (repo root, thư mục skill, thư mục workspace
video), nên đường dẫn phải tự dò lên chứ không giả định cwd.
"""
from __future__ import annotations

import os
from pathlib import Path

from .errors import BdsError

DATA_DIRNAME = "_data"


def find_data_root(explicit: str | None = None) -> Path:
    """Trả về `<repo>/workspace/data`.

    Thứ tự ưu tiên: --data-root > $BDS_DATA_ROOT > dò từ cwd đi lên.
    """
    cand = explicit or os.environ.get("BDS_DATA_ROOT")
    if cand:
        p = Path(cand).expanduser().resolve()
        if not p.is_dir():
            raise BdsError("bad_data_root", f"Không tồn tại: {p}")
        return p

    here = Path.cwd().resolve()
    for base in [here, *here.parents]:
        if (base / "workspace" / "data").is_dir():
            return (base / "workspace" / "data").resolve()
        # Đang đứng sẵn trong workspace/data hoặc trong 1 thư mục dự án
        if base.name == "data" and base.parent.name == "workspace":
            return base
    raise BdsError(
        "no_data_root",
        "Không tìm thấy workspace/data/ từ cwd đi lên.",
        hint="Truyền --data-root /abs/path/workspace/data hoặc đặt BDS_DATA_ROOT.",
    )


def repo_root(data_root: Path) -> Path:
    """`<repo>` — cha của `workspace/`."""
    return data_root.parent.parent


def project_dir(data_root: Path, project_entry: dict) -> Path:
    return data_root / project_entry["dir"]


def data_dir(data_root: Path, project_entry: dict, create: bool = False) -> Path:
    """`<project>/_data/` — nơi chứa towers/unit-types/units."""
    d = project_dir(data_root, project_entry) / DATA_DIRNAME
    if create:
        d.mkdir(parents=True, exist_ok=True)
    return d


def rel_to_repo(path: Path, data_root: Path) -> str:
    """Đường dẫn tương đối repo, để JSON không dính path tuyệt đối của máy."""
    try:
        return str(Path(path).resolve().relative_to(repo_root(data_root)))
    except ValueError:
        return str(path)
