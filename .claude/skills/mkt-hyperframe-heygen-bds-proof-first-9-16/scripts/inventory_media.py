#!/usr/bin/env python3
"""Recursively inventory property video/image libraries without changing sources."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


VIDEO_EXTENSIONS = {".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif", ".tif", ".tiff"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--real-video-dir", action="append", default=[], type=Path)
    parser.add_argument("--real-image-dir", action="append", default=[], type=Path)
    parser.add_argument("--pexels-dir", action="append", default=[], type=Path)
    parser.add_argument("--project-dir", action="append", default=[], type=Path)
    parser.add_argument("--output", required=True, type=Path)
    return parser.parse_args()


def media_type(path: Path) -> str | None:
    suffix = path.suffix.lower()
    if suffix in VIDEO_EXTENSIONS:
        return "video"
    if suffix in IMAGE_EXTENSIONS:
        return "image"
    return None


def parse_rate(value: str | None) -> float | None:
    if not value or value in {"0/0", "N/A"}:
        return None
    try:
        numerator, denominator = value.split("/", 1)
        return round(float(numerator) / float(denominator), 4)
    except (ValueError, ZeroDivisionError):
        return None


def ffprobe(path: Path) -> tuple[dict[str, Any], str | None]:
    command = [
        "ffprobe",
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height,r_frame_rate,duration:format=duration",
        "-of",
        "json",
        str(path),
    ]
    try:
        completed = subprocess.run(command, check=True, capture_output=True, text=True)
        payload = json.loads(completed.stdout)
    except FileNotFoundError:
        return {}, "ffprobe is not installed"
    except (subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        return {}, f"ffprobe failed: {exc}"

    stream = (payload.get("streams") or [{}])[0]
    width = stream.get("width")
    height = stream.get("height")
    raw_duration = stream.get("duration") or payload.get("format", {}).get("duration")
    try:
        duration = round(float(raw_duration), 3) if raw_duration not in {None, "N/A"} else None
    except (TypeError, ValueError):
        duration = None

    if width and height:
        orientation = "portrait" if height > width else "landscape" if width > height else "square"
    else:
        orientation = None

    return {
        "width": width,
        "height": height,
        "orientation": orientation,
        "duration_s": duration,
        "fps": parse_rate(stream.get("r_frame_rate")),
    }, None


def normalize_text(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)
    return "".join(char for char in decomposed if not unicodedata.combining(char)).lower()


def looks_like_render(path: Path) -> bool:
    normalized = normalize_text(str(path))
    markers = ("phoi canh", "render", "cgi", "3d visual", "visualization")
    return any(marker in normalized for marker in markers)


def source_kind(bucket: str, kind: str, path: Path) -> str:
    if kind == "image" and looks_like_render(path):
        return "render-image"
    if bucket == "project":
        return f"project-{kind}"
    if bucket == "pexels":
        return "pexels-video" if kind == "video" else "pexels-image"
    return f"library-{kind}"


def collect(root: Path, bucket: str, expected: str | None, warnings: list[str]) -> list[dict[str, Any]]:
    resolved_root = root.expanduser().resolve()
    if not resolved_root.is_dir():
        warnings.append(f"Missing directory: {resolved_root}")
        return []

    assets: list[dict[str, Any]] = []
    for path in sorted(resolved_root.rglob("*")):
        if not path.is_file():
            continue
        kind = media_type(path)
        if kind is None or (expected and kind != expected):
            continue
        probe, warning = ffprobe(path)
        if warning:
            warnings.append(f"{path}: {warning}")
        stat = path.stat()
        suspected_render = kind == "image" and looks_like_render(path)
        if kind == "image":
            probe["duration_s"] = None
            probe["fps"] = None
        identity = hashlib.sha1(f"{bucket}:{path.resolve()}".encode("utf-8")).hexdigest()[:12]
        assets.append(
            {
                "asset_id": f"{bucket}-{identity}",
                "source_kind": source_kind(bucket, kind, path),
                "media_type": kind,
                "suspected_render": suspected_render,
                "path": str(path.resolve()),
                "relative_path": str(path.relative_to(resolved_root)),
                "library_root": str(resolved_root),
                "extension": path.suffix.lower(),
                "bytes": stat.st_size,
                "modified_at": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(),
                **probe,
            }
        )
    return assets


def main() -> int:
    args = parse_args()
    warnings: list[str] = []
    assets: list[dict[str, Any]] = []

    for root in args.project_dir:
        assets.extend(collect(root, "project", None, warnings))
    for root in args.real_video_dir:
        assets.extend(collect(root, "real", "video", warnings))
    for root in args.real_image_dir:
        assets.extend(collect(root, "real", "image", warnings))
    for root in args.pexels_dir:
        assets.extend(collect(root, "pexels", "video", warnings))

    unique: dict[str, dict[str, Any]] = {}
    for asset in assets:
        unique.setdefault(asset["path"], asset)
    assets = sorted(unique.values(), key=lambda item: (item["source_kind"], item["path"]))

    counts: dict[str, int] = {}
    for asset in assets:
        counts[asset["source_kind"]] = counts.get(asset["source_kind"], 0) + 1

    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "asset_count": len(assets),
        "counts_by_source_kind": counts,
        "warnings": sorted(set(warnings)),
        "assets": assets,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(args.output.resolve()), "asset_count": len(assets), "warnings": len(output["warnings"])}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
