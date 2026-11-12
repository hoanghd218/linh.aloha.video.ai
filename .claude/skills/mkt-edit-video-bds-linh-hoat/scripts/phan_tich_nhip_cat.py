#!/usr/bin/env python3
"""Đo scene cuts của video mẫu và tạo phần định lượng của hồ sơ phong cách."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import statistics
import subprocess
import sys
from pathlib import Path
from typing import Any


PTS_PATTERN = re.compile(r"pts_time:([0-9]+(?:\.[0-9]+)?)")


def percentile(values: list[float], fraction: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    position = (len(ordered) - 1) * fraction
    lower = int(position)
    upper = min(lower + 1, len(ordered) - 1)
    weight = position - lower
    return ordered[lower] * (1 - weight) + ordered[upper] * weight


def source_info(path: Path) -> dict[str, Any]:
    command = [
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "format=duration:stream=width,height,r_frame_rate",
        "-of", "json", str(path),
    ]
    data = json.loads(subprocess.run(command, check=True, capture_output=True, text=True).stdout)
    stream = data["streams"][0]
    numerator, denominator = stream["r_frame_rate"].split("/", 1)
    return {
        "path": str(path),
        "duration": float(data["format"]["duration"]),
        "fps": float(numerator) / float(denominator),
        "width": int(stream["width"]),
        "height": int(stream["height"]),
    }


def detect_cuts(path: Path, threshold: float) -> list[float]:
    filter_value = f"select='gt(scene,{threshold})',showinfo"
    command = ["ffmpeg", "-hide_banner", "-i", str(path), "-vf", filter_value, "-an", "-f", "null", "-"]
    completed = subprocess.run(command, capture_output=True, text=True)
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr[-2000:])
    return sorted({float(match.group(1)) for match in PTS_PATTERN.finditer(completed.stderr)})


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video", type=Path)
    parser.add_argument("--threshold", type=float, default=0.25)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        print("ERROR: cần ffmpeg và ffprobe.", file=sys.stderr)
        return 2
    try:
        video = args.video.expanduser().resolve()
        info = source_info(video)
        cuts = [value for value in detect_cuts(video, args.threshold) if 0 < value < info["duration"]]
    except (OSError, ValueError, KeyError, json.JSONDecodeError, subprocess.CalledProcessError, RuntimeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    boundaries = [0.0, *cuts, info["duration"]]
    intervals = [right - left for left, right in zip(boundaries, boundaries[1:]) if right > left]
    observations = {
        "cut_times": [round(value, 4) for value in cuts],
        "cut_count": len(cuts),
        "cut_interval_median": round(statistics.median(intervals), 4) if intervals else None,
        "cut_interval_p25": round(percentile(intervals, 0.25), 4) if intervals else None,
        "cut_interval_p75": round(percentile(intervals, 0.75), 4) if intervals else None,
        "scene_threshold": args.threshold,
        "text_regions": [],
        "text_hierarchy": [],
        "visual_modes": [],
        "zoom_palette": [],
        "transition_palette": [],
        "audio_notes": [],
    }
    result = {
        "version": "1.0",
        "source": info,
        "observations": observations,
        "creative_notes": ["Bổ sung quan sát chữ, B-roll, zoom và transition sau khi xem frame/video."],
        "do_not_copy": ["Không biến cut interval đo được thành lịch cắt cố định cho video mới."],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Phát hiện {len(cuts)} cut; median interval {observations['cut_interval_median']}s → {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

