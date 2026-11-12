#!/usr/bin/env python3
"""Kiểm tra timing, speech anchors, placement và asset của kế hoạch dựng."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from dong_bo_hieu_ung_theo_loi import find_anchor, flatten_words


ANCHOR_TYPES = {"text", "caption", "broll", "image", "pip", "map", "zoom", "sfx"}
EXCEPTIONS = {"transition-between-shots", "ambient-bed", "music-bed", "tail-playout"}
FOREGROUND_TYPES = {"text", "caption", "pip", "map", "image"}
RENDER_MARKERS = {"phối-cảnh", "phoi-canh", "render"}


def _load(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _duration(plan: dict[str, Any], words: list[Any] | None) -> float:
    value = plan.get("video", {}).get("duration")
    if value is not None:
        return float(value)
    if words:
        return max(word.end for word in words)
    return max((float(event.get("end", 0)) for event in plan.get("events", [])), default=0.0)


def _check_overlap(events: list[dict[str, Any]], warnings: list[str]) -> None:
    points: list[tuple[float, int, str]] = []
    for event in events:
        if event.get("type") not in FOREGROUND_TYPES:
            continue
        points.append((float(event.get("start", 0)), 1, str(event.get("id", "?"))))
        points.append((float(event.get("end", 0)), -1, str(event.get("id", "?"))))
    active = 0
    for timestamp, delta, event_id in sorted(points, key=lambda item: (item[0], item[1])):
        active += delta
        if active > 3:
            warnings.append(f"Quá nhiều lớp foreground ({active}) quanh {timestamp:.2f}s, event {event_id}.")


def validate(
    plan: dict[str, Any],
    *,
    plan_dir: Path,
    transcript: dict[str, Any] | None,
    strict: bool,
) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    words = flatten_words(transcript) if transcript is not None else None
    duration = _duration(plan, words)
    events = plan.get("events")
    if not isinstance(events, list):
        return ["Kế hoạch không có events array."], warnings

    seen: set[str] = set()
    for index, event in enumerate(events):
        if not isinstance(event, dict):
            errors.append(f"events[{index}] không phải object.")
            continue
        event_id = str(event.get("id") or f"events[{index}]")
        if event_id in seen:
            errors.append(f"Trùng event id: {event_id}")
        seen.add(event_id)

        try:
            start = float(event["start"])
            end = float(event["end"])
        except (KeyError, TypeError, ValueError):
            errors.append(f"{event_id}: thiếu start/end hợp lệ.")
            continue
        if start < 0 or end <= start:
            errors.append(f"{event_id}: khoảng thời gian không hợp lệ {start}–{end}.")
        if duration and end > duration + 0.25:
            errors.append(f"{event_id}: kết thúc {end:.2f}s ngoài video {duration:.2f}s.")

        event_type = str(event.get("type", ""))
        anchor = event.get("speech_anchor")
        exception = event.get("anchor_exception")
        if event_type in ANCHOR_TYPES and not isinstance(anchor, dict) and exception not in EXCEPTIONS:
            errors.append(f"{event_id}: {event_type} thiếu speech_anchor.")

        if isinstance(anchor, dict):
            confidence = float(anchor.get("confidence", 0))
            if confidence < 0.78:
                message = f"{event_id}: speech anchor confidence thấp ({confidence:.2f})."
                (errors if strict else warnings).append(message)
            if words is not None and anchor.get("trigger_text"):
                lookup_anchor = {
                    key: value for key, value in anchor.items()
                    if key not in {"word_start_index", "word_end_index"}
                }
                found = find_anchor(words, lookup_anchor, min_confidence=0.70)
                if found is None:
                    errors.append(f"{event_id}: không tìm lại được trigger_text trong transcript.")
                else:
                    first, last, _ = found
                    expected_start = words[first].start
                    expected_end = words[last].end
                    if abs(float(anchor.get("speech_start", expected_start)) - expected_start) > 0.15:
                        errors.append(f"{event_id}: speech_start lệch transcript >150ms.")
                    if abs(float(anchor.get("speech_end", expected_end)) - expected_end) > 0.20:
                        errors.append(f"{event_id}: speech_end lệch transcript >200ms.")

        asset = event.get("asset")
        if asset:
            asset_path = Path(str(asset))
            if not asset_path.is_absolute():
                asset_path = plan_dir / asset_path
            if not asset_path.exists():
                errors.append(f"{event_id}: asset không tồn tại: {asset}")
            normalized = str(asset).lower()
            if ("video-trám" in normalized or "video-tram" in normalized) and event.get("minh_hoa") is not True:
                message = f"{event_id}: asset từ kho video trám phải gắn minh_hoa=true."
                (errors if strict else warnings).append(message)

            metadata = event.get("metadata") if isinstance(event.get("metadata"), dict) else {}
            asset_kind = str(event.get("asset_kind") or metadata.get("loai_bang_chung") or "").lower()
            is_render = asset_kind in {"phoi-canh", "phối-cảnh", "render"} or any(
                marker in normalized for marker in RENDER_MARKERS
            )
            if is_render:
                if event.get("minh_hoa") is not True:
                    (errors if strict else warnings).append(
                        f"{event_id}: phối cảnh/render phải gắn minh_hoa=true."
                    )
                label = str(event.get("disclosure_label") or "").strip().upper()
                if label != "PHỐI CẢNH MINH HỌA":
                    (errors if strict else warnings).append(
                        f"{event_id}: phối cảnh/render thiếu disclosure_label 'PHỐI CẢNH MINH HỌA'."
                    )
                if event.get("label_persistent") is not True:
                    (errors if strict else warnings).append(
                        f"{event_id}: nhãn phối cảnh phải hiện suốt shot (label_persistent=true)."
                    )
                claim_kind = str(event.get("claim_kind") or metadata.get("claim_kind") or "").lower()
                if claim_kind in {"tien-do-thuc-te", "hiện-trạng", "hien-trang", "view-thuc-te"}:
                    errors.append(f"{event_id}: không dùng phối cảnh để chứng minh {claim_kind}.")

        placement = event.get("placement")
        if isinstance(placement, dict):
            x = float(placement.get("x", 0))
            y = float(placement.get("y", 0))
            width = float(placement.get("width", 0))
            height = float(placement.get("height", 0))
            if min(x, y, width, height) < 0 or x + width > 1 or y + height > 1:
                errors.append(f"{event_id}: placement nằm ngoài canvas chuẩn hóa 0–1.")
            elif y < 0.05 or y + height > 0.88 or x + width > 0.94:
                warnings.append(f"{event_id}: placement gần vùng UI không an toàn.")

        if not str(event.get("reason", "")).strip():
            warnings.append(f"{event_id}: thiếu lý do dựng.")

    _check_overlap(events, warnings)
    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", type=Path)
    parser.add_argument("--transcript", type=Path)
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()
    try:
        plan = _load(args.plan)
        transcript = _load(args.transcript) if args.transcript else None
        errors, warnings = validate(plan, plan_dir=args.plan.parent, transcript=transcript, strict=args.strict)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    for message in warnings:
        print(f"WARNING: {message}")
    for message in errors:
        print(f"ERROR: {message}", file=sys.stderr)
    print(f"Kết quả: {len(errors)} lỗi, {len(warnings)} cảnh báo, {len(plan.get('events', []))} event.")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
