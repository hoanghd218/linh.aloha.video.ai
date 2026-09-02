#!/usr/bin/env python3
"""Quét kho tư liệu, lấy metadata kỹ thuật và cập nhật JSON + SQLite."""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import shutil
import sqlite3
import subprocess
import sys
from pathlib import Path
from typing import Any

from tao_kho_tu_lieu import create_library


VIDEO_EXTENSIONS = {".mp4", ".mov", ".mkv", ".webm", ".m4v"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic"}
AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg"}


def media_type(path: Path) -> str | None:
    suffix = path.suffix.lower()
    if suffix in VIDEO_EXTENSIONS:
        return "video"
    if suffix in IMAGE_EXTENSIONS:
        return "hinh-anh"
    if suffix in AUDIO_EXTENSIONS:
        return "am-thanh"
    return None


def quick_hash(path: Path) -> str:
    digest = hashlib.sha256()
    size = path.stat().st_size
    digest.update(str(size).encode())
    with path.open("rb") as handle:
        digest.update(handle.read(1024 * 1024))
        if size > 2 * 1024 * 1024:
            handle.seek(max(0, size - 1024 * 1024))
            digest.update(handle.read(1024 * 1024))
    return digest.hexdigest()


def parse_rate(value: str | None) -> float | None:
    if not value:
        return None
    try:
        numerator, denominator = value.split("/", 1)
        return float(numerator) / float(denominator) if float(denominator) else None
    except (ValueError, ZeroDivisionError):
        try:
            return float(value)
        except ValueError:
            return None


def probe(path: Path) -> dict[str, Any]:
    if not shutil.which("ffprobe"):
        return {}
    command = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration,bit_rate:stream=index,codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels",
        "-of",
        "json",
        str(path),
    ]
    try:
        completed = subprocess.run(command, check=True, capture_output=True, text=True)
        data = json.loads(completed.stdout)
    except (subprocess.CalledProcessError, json.JSONDecodeError):
        return {}
    streams = data.get("streams", [])
    video = next((item for item in streams if item.get("codec_type") == "video"), {})
    audio = next((item for item in streams if item.get("codec_type") == "audio"), {})
    duration = data.get("format", {}).get("duration")
    return {
        "thoi_luong": float(duration) if duration is not None else None,
        "chieu_rong": video.get("width"),
        "chieu_cao": video.get("height"),
        "fps": parse_rate(video.get("r_frame_rate")),
        "codec": video.get("codec_name") or audio.get("codec_name"),
        "co_am_thanh": 1 if audio else 0,
    }


def sidecar(path: Path) -> dict[str, Any]:
    candidates = [Path(str(path) + ".json"), path.with_suffix(".json")]
    for candidate in candidates:
        if candidate.exists() and candidate != path:
            try:
                value = json.loads(candidate.read_text(encoding="utf-8"))
                return value if isinstance(value, dict) else {}
            except (OSError, json.JSONDecodeError):
                return {}
    return {}


def build_asset(root: Path, path: Path) -> dict[str, Any]:
    relative = path.relative_to(root)
    parts = relative.parts
    semantic = sidecar(path)
    technical = probe(path)
    content_hash = quick_hash(path)
    identifier = hashlib.sha256(relative.as_posix().encode("utf-8")).hexdigest()[:20]
    tags = semantic.get("tu_khoa", semantic.get("tags", []))
    if isinstance(tags, list):
        tags = ", ".join(str(item) for item in tags)
    normalized_path = relative.as_posix().lower()
    is_render = "phối-cảnh" in normalized_path or "phoi-canh" in normalized_path or "render" in normalized_path
    default_illustration = bool(parts and parts[0].startswith("01_video-trám")) or is_render
    return {
        "id": identifier,
        "duong_dan": relative.as_posix(),
        "loai_media": media_type(path),
        "nhom": parts[0] if parts else "",
        "chu_de": parts[1] if len(parts) > 1 else "",
        "du_an": semantic.get("du_an"),
        "khu_vuc": semantic.get("khu_vuc"),
        "tu_khoa": str(tags or ""),
        "minh_hoa": bool(semantic.get("minh_hoa", default_illustration)),
        "nguon": semantic.get("nguon"),
        "quyen_su_dung": semantic.get("quyen_su_dung"),
        "loai_bang_chung": semantic.get("loai_bang_chung", "phoi-canh" if is_render else None),
        "trang_thai_du_an": semantic.get("trang_thai_du_an"),
        "url_nguon": semantic.get("url_nguon"),
        "ngay_nguon": semantic.get("ngay_nguon"),
        "phien_ban_tu_lieu": semantic.get("phien_ban_tu_lieu"),
        "nhan_bat_buoc": semantic.get("nhan_bat_buoc", "PHỐI CẢNH MINH HỌA" if is_render else None),
        "huong_chuyen_dong": semantic.get("huong_chuyen_dong"),
        "vi_tri_chu_the": semantic.get("vi_tri_chu_the"),
        "muc_nang_luong": semantic.get("muc_nang_luong"),
        "do_tin_cay": semantic.get("do_tin_cay"),
        "kich_thuoc_byte": path.stat().st_size,
        "hash_nhanh": content_hash,
        "cap_nhat_luc": dt.datetime.now(dt.timezone.utc).isoformat(),
        **technical,
    }


def upsert(connection: sqlite3.Connection, asset: dict[str, Any]) -> None:
    columns = [
        "id", "duong_dan", "loai_media", "nhom", "chu_de", "du_an", "khu_vuc", "tu_khoa",
        "minh_hoa", "nguon", "quyen_su_dung", "loai_bang_chung", "trang_thai_du_an",
        "url_nguon", "ngay_nguon", "phien_ban_tu_lieu", "nhan_bat_buoc",
        "thoi_luong", "chieu_rong", "chieu_cao", "fps",
        "codec", "co_am_thanh", "huong_chuyen_dong", "vi_tri_chu_the", "muc_nang_luong", "do_tin_cay",
        "kich_thuoc_byte", "hash_nhanh", "cap_nhat_luc",
    ]
    values = [int(asset[name]) if name == "minh_hoa" else asset.get(name) for name in columns]
    placeholders = ", ".join("?" for _ in columns)
    updates = ", ".join(f"{name}=excluded.{name}" for name in columns if name not in {"id"})
    connection.execute(
        f"INSERT INTO assets ({', '.join(columns)}) VALUES ({placeholders}) "
        f"ON CONFLICT(id) DO UPDATE SET {updates}",
        values,
    )
    connection.execute("DELETE FROM assets_fts WHERE id = ?", (asset["id"],))
    connection.execute(
        "INSERT INTO assets_fts(id, duong_dan, nhom, chu_de, du_an, khu_vuc, tu_khoa) VALUES (?, ?, ?, ?, ?, ?, ?)",
        tuple(asset.get(name) for name in ["id", "duong_dan", "nhom", "chu_de", "du_an", "khu_vuc", "tu_khoa"]),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("thu_muc", type=Path)
    args = parser.parse_args()
    root = args.thu_muc.expanduser().resolve()
    create_library(root)
    files = sorted(path for path in root.rglob("*") if path.is_file() and media_type(path))
    assets: list[dict[str, Any]] = []
    try:
        for path in files:
            assets.append(build_asset(root, path))
        with sqlite3.connect(root / "thư-viện-media.sqlite") as connection:
            current_ids = {asset["id"] for asset in assets}
            stale_ids = {
                row[0] for row in connection.execute("SELECT id FROM assets").fetchall()
            } - current_ids
            for stale_id in stale_ids:
                connection.execute("DELETE FROM assets WHERE id = ?", (stale_id,))
                connection.execute("DELETE FROM assets_fts WHERE id = ?", (stale_id,))
            for asset in assets:
                upsert(connection, asset)
            connection.commit()
        payload = {"version": "1.0", "root": str(root), "assets": assets}
        (root / "chỉ-mục-media.json").write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    except (OSError, sqlite3.Error) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    print(f"Đã lập chỉ mục {len(assets)} asset trong {root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
