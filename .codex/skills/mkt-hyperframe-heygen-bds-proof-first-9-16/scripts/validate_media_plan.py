#!/usr/bin/env python3
"""Validate source integrity and visual ratios for a Proof-First media plan."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


VALID_ROLES = {"hook", "proof", "bridge", "objection", "cta"}
VALID_SCOPES = {"project-specific", "location-specific", "generic", "none"}
VALID_KINDS = {
    "heygen",
    "project-video",
    "project-image",
    "location-video",
    "library-video",
    "library-image",
    "render-image",
    "pexels-video",
    "map",
    "document",
    "text",
}
REAL_KINDS = {"project-video", "project-image", "location-video", "library-video", "library-image"}
PROJECT_PROOF_KINDS = {"project-video", "project-image", "map", "document"}
LOCATION_PROOF_KINDS = {"location-video", "map", "document"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", type=Path)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--strict", action="store_true")
    return parser.parse_args()


def load_plan(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"Plan not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON at line {exc.lineno}, column {exc.colno}: {exc.msg}") from exc
    if not isinstance(payload, dict):
        raise ValueError("Plan root must be an object")
    return payload


def main() -> int:
    args = parse_args()
    errors: list[str] = []
    warnings: list[str] = []

    def issue(message: str, strict_only: bool = False) -> None:
        if strict_only and not args.strict:
            warnings.append(message)
        else:
            errors.append(message)

    try:
        plan = load_plan(args.plan)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    if plan.get("format") != "proof-first-9-16":
        errors.append("format must be 'proof-first-9-16'")

    duration = plan.get("duration_s")
    if not isinstance(duration, (int, float)) or isinstance(duration, bool) or duration <= 0:
        errors.append("duration_s must be a positive number")
        duration = 0.0
    else:
        duration = float(duration)

    raw_segments = plan.get("segments")
    if not isinstance(raw_segments, list) or not raw_segments:
        errors.append("segments must be a non-empty array")
        raw_segments = []

    segments: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    pexels_ids: set[str] = set()
    totals = {"heygen": 0.0, "real": 0.0, "pexels": 0.0, "other": 0.0}

    for index, segment in enumerate(raw_segments):
        label = f"segments[{index}]"
        if not isinstance(segment, dict):
            errors.append(f"{label} must be an object")
            continue

        segment_id = segment.get("id")
        if not isinstance(segment_id, str) or not segment_id.strip():
            errors.append(f"{label}.id must be a non-empty string")
            segment_id = label
        elif segment_id in seen_ids:
            errors.append(f"Duplicate segment id: {segment_id}")
        seen_ids.add(str(segment_id))

        start = segment.get("start_s")
        end = segment.get("end_s")
        if not isinstance(start, (int, float)) or isinstance(start, bool):
            errors.append(f"{segment_id}: start_s must be numeric")
            continue
        if not isinstance(end, (int, float)) or isinstance(end, bool):
            errors.append(f"{segment_id}: end_s must be numeric")
            continue
        start, end = float(start), float(end)
        if start < 0 or end <= start:
            errors.append(f"{segment_id}: invalid interval {start}–{end}")
            continue
        if duration and end > duration + 0.02:
            errors.append(f"{segment_id}: end_s {end} exceeds duration_s {duration}")

        role = segment.get("role")
        scope = segment.get("claim_scope")
        spoken_text = segment.get("spoken_text")
        if role not in VALID_ROLES:
            errors.append(f"{segment_id}: invalid role {role!r}")
        if scope not in VALID_SCOPES:
            errors.append(f"{segment_id}: invalid claim_scope {scope!r}")
        if not isinstance(spoken_text, str) or not spoken_text.strip():
            errors.append(f"{segment_id}: spoken_text must be a non-empty string")

        visual = segment.get("primary_visual")
        if not isinstance(visual, dict):
            errors.append(f"{segment_id}: primary_visual must be an object")
            continue
        kind = visual.get("source_kind")
        if kind not in VALID_KINDS:
            errors.append(f"{segment_id}: invalid source_kind {kind!r}")
            continue

        span = end - start
        if kind == "heygen":
            totals["heygen"] += span
        elif kind in REAL_KINDS:
            totals["real"] += span
        elif kind == "pexels-video":
            totals["pexels"] += span
        else:
            totals["other"] += span

        claim_source = segment.get("claim_source")
        if scope in {"project-specific", "location-specific"} and (
            not isinstance(claim_source, str) or not claim_source.strip()
        ):
            errors.append(f"{segment_id}: specific claim requires claim_source")

        if scope == "project-specific" and kind not in PROJECT_PROOF_KINDS:
            if not (kind == "heygen" and role in {"hook", "bridge", "cta"}):
                errors.append(f"{segment_id}: {kind} cannot be primary proof for a project-specific claim")
        if scope == "location-specific" and kind not in LOCATION_PROOF_KINDS:
            if not (kind == "heygen" and role in {"hook", "bridge", "cta"}):
                errors.append(f"{segment_id}: {kind} cannot be primary proof for a location-specific claim")

        disclosure = visual.get("disclosure_label")
        if kind == "render-image" and disclosure != "PHỐI CẢNH MINH HỌA":
            errors.append(f"{segment_id}: render-image requires persistent 'PHỐI CẢNH MINH HỌA'")
        if kind == "pexels-video":
            if visual.get("illustrative") is not True:
                errors.append(f"{segment_id}: Pexels must set illustrative=true")
            if visual.get("could_be_misread_as_project") and disclosure != "TƯ LIỆU MINH HỌA":
                errors.append(f"{segment_id}: ambiguous Pexels requires 'TƯ LIỆU MINH HỌA'")
            asset_id = visual.get("asset_id")
            if asset_id:
                if asset_id in pexels_ids:
                    errors.append(f"{segment_id}: Pexels asset {asset_id!r} is reused")
                pexels_ids.add(asset_id)

        if kind in {"library-video", "library-image"} and visual.get("could_be_misread_as_project"):
            if disclosure != "TƯ LIỆU MINH HỌA":
                errors.append(f"{segment_id}: ambiguous library media requires 'TƯ LIỆU MINH HỌA'")

        if kind not in {"heygen", "text"}:
            asset_id = visual.get("asset_id")
            asset_path = visual.get("asset_path")
            source_url = visual.get("source_url")
            if args.strict and (not isinstance(asset_id, str) or not asset_id.strip()):
                errors.append(f"{segment_id}: strict mode requires asset_id")
            if not asset_path and not source_url:
                issue(f"{segment_id}: media requires asset_path or source_url", strict_only=True)
            if args.strict and asset_path and not Path(asset_path).expanduser().exists():
                errors.append(f"{segment_id}: missing asset_path {asset_path}")
            if args.strict and source_url:
                parsed = urlparse(str(source_url))
                if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                    errors.append(f"{segment_id}: unresolved or invalid source_url {source_url}")

        segments.append({"id": str(segment_id), "start": start, "end": end, "role": role})

    segments.sort(key=lambda item: (item["start"], item["end"]))
    previous_end = 0.0
    for segment in segments:
        if segment["start"] < previous_end - 0.02:
            errors.append(f"{segment['id']}: overlaps previous primary segment")
        elif segment["start"] > previous_end + 0.25:
            issue(f"Gap of {segment['start'] - previous_end:.2f}s before {segment['id']}", strict_only=True)
        previous_end = max(previous_end, segment["end"])
    if duration and previous_end < duration - 0.25:
        issue(f"Timeline ends {duration - previous_end:.2f}s before duration_s", strict_only=True)

    role_counts = {role: sum(1 for item in segments if item["role"] == role) for role in VALID_ROLES}
    if role_counts["proof"] == 0:
        errors.append("At least one proof segment is required")
    if role_counts["cta"] == 0:
        warnings.append("No CTA segment")
    if role_counts["cta"] > 1:
        warnings.append("Use one CTA segment unless the brief explicitly requires otherwise")
    if totals["heygen"] == 0:
        errors.append("At least one HeyGen segment is required")

    denominator = duration or sum(totals.values()) or 1.0
    ratios = {name: round(value / denominator, 4) for name, value in totals.items()}
    if ratios["heygen"] > 0.35:
        errors.append(f"HeyGen ratio {ratios['heygen']:.1%} exceeds 35%")
    elif ratios["heygen"] < 0.15 or ratios["heygen"] > 0.30:
        warnings.append(f"HeyGen ratio {ratios['heygen']:.1%} is outside 15–30% target")
    if ratios["real"] < 0.50:
        issue(f"Real-media ratio {ratios['real']:.1%} is below 50%", strict_only=True)
    if ratios["pexels"] > 0.20:
        errors.append(f"Pexels ratio {ratios['pexels']:.1%} exceeds 20%")
    elif ratios["pexels"] > 0.15:
        warnings.append(f"Pexels ratio {ratios['pexels']:.1%} exceeds 15% target")

    report = {
        "status": "PASS" if not errors else "FAIL",
        "strict": args.strict,
        "plan": str(args.plan.resolve()),
        "ratios": ratios,
        "role_counts": role_counts,
        "errors": errors,
        "warnings": warnings,
    }
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
