#!/usr/bin/env python3
"""
validate.py — schema validator for overlays.json (BDSGeneralTemplate).

Usage:
    python3 validate.py path/to/overlays.json

Exit codes:
    0  valid (warnings non-fatal)
    1  one or more errors
    2  bad CLI args / file not readable

Stdlib only. No external deps.

Validates against the 9 shared variants of BDSGeneralTemplate:
    punch, punch-2line, price-red-3d, price-with-brand, callout-stack,
    icon-stack, broll-image, comment-bubble, contact-card
plus the 5 apartment-detail scene variants (used by overlays-apartment.json of the
sister skill mkt-full-video-with-11-remotion-heygen-apartment-detail):
    scene-spec-row, scene-apartment-price, scene-finishing-detail,
    scene-amenity-grid, scene-price-package
(+ deprecated aliases are rejected with a hint)

Designed for deterministic, machine-friendly error messages with full paths
(e.g. `overlays[3].text`) so a sub-agent can fix one item at a time.
"""

from __future__ import annotations

import json
import re
import sys
from typing import Any

# Windows consoles default to cp1252 and crash on the ✗ / ⚠ markers below.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

# ─── Registry ───────────────────────────────────────────────────────────────
ALLOWED_VARIANTS = {
    "punch",
    "punch-2line",
    "price-red-3d",
    "price-with-brand",
    "callout-stack",
    "icon-stack",
    "broll-image",
    "comment-bubble",
    "contact-card",
    # apartment-detail scenes (full-screen, z-index 60)
    "scene-spec-row",
    "scene-apartment-price",
    "scene-finishing-detail",
    "scene-amenity-grid",
    "scene-price-package",
}

# Full-frame variants (z-index 60, below text overlays at z-index 80).
SCENE_VARIANTS = {
    "scene-spec-row",
    "scene-apartment-price",
    "scene-finishing-detail",
    "scene-amenity-grid",
    "scene-price-package",
}

# Variants from the old skill version. Map → suggested new variant for the
# error message so packagers can self-correct without checking docs.
DEPRECATED_VARIANTS = {
    "punch-white":      "punch (set color='#ffffff')",
    "punch-red":        "punch (set color='#e63946')",
    "punch-yellow":     "punch (set color='#ffd60a')",
    "punch-subtle":     "punch (set color='#cccccc')",
    "logo-pill":        "icon-stack or contact-card",
    "logo-pill-single": "icon-stack",
    "count-up-money":   "price-red-3d (final value as text, e.g. '120 TR/M²')",
    "count-up-number":  "price-red-3d (final value as text)",
    "glitch-text":      "punch (set color='#ffd60a' for urgency)",
    "chip-stack":       "icon-stack (multi-line)",
    "before-after":     "callout-stack (setup_text + emphasis_text)",
    "type-on":          "punch (no typewriter animation in new template)",
}

ALLOWED_ZOOM_TYPES = {"soft2step", "quickpop", "doublepop", "zoomout"}

ALLOWED_AESTHETICS = {"broker_creator"}

OVERLAY_ID_RE = re.compile(r"^([a-z0-9][a-z0-9\-_]*\d*|o\d{2,3}|overlay-\d{2,3})$")

# Per-variant required/optional fields. Matches src/overlays/index.tsx contract.
VARIANT_REQS: dict[str, tuple[set[str], set[str]]] = {
    "punch":            ({"text"},                              {"color", "italic", "placement"}),
    "punch-2line":      ({"text"},                              {"color", "placement"}),
    "price-red-3d":     ({"text"},                              {"placement"}),
    "price-with-brand": ({"price_text", "brand_text"},          {"placement"}),
    "callout-stack":    ({"setup_text", "emphasis_text"},       {"emphasis_color", "placement"}),
    "icon-stack":       ({"line1", "line2"},                    {"icon_path", "color", "placement"}),
    "broll-image":      ({"image_path"},                        {"caption"}),
    "comment-bubble":   ({"comment_text"},                      {"username"}),
    "contact-card":     ({"avatar_path", "qr_path"},            {"name", "cta_text", "hotline", "bg_color", "accent"}),
    # apartment-detail scenes — mirror workspace/remotion-project/src/overlays/index.tsx
    "scene-spec-row":         ({"title", "rows"},               {"subtitle", "title_color", "bg_color"}),
    "scene-apartment-price":  ({"title", "images"},             {"subtitle", "icon", "title_color", "subtitle_color", "bg_color", "image_fit"}),
    "scene-finishing-detail": ({"image_path", "callouts"},      {"title"}),
    "scene-amenity-grid":     ({"title", "cells"},              {"subtitle", "title_color", "bg_color"}),
    "scene-price-package":    ({"title", "tiers"},              {"subtitle", "footer", "title_color", "bg_color"}),
}

OVERLAY_COMMON = {"id", "variant", "t_start", "duration"}


def _err(errors: list[str], path: str, msg: str) -> None:
    errors.append(f"  ✗ {path}: {msg}")


def _warn(warnings: list[str], path: str, msg: str) -> None:
    warnings.append(f"  ⚠ {path}: {msg}")


def _is_number(v: Any) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def validate_overlay(o: Any, idx: int, video_duration: float, errors: list[str], warnings: list[str]) -> None:
    path = f"overlays[{idx}]"
    if not isinstance(o, dict):
        _err(errors, path, f"must be an object, got {type(o).__name__}")
        return

    missing = OVERLAY_COMMON - set(o.keys())
    if missing:
        _err(errors, path, f"missing required keys: {sorted(missing)}")

    oid = o.get("id")
    if oid and not (isinstance(oid, str) and OVERLAY_ID_RE.match(oid)):
        _err(errors, f"{path}.id", f"invalid id '{oid}' (pattern: {OVERLAY_ID_RE.pattern})")

    variant = o.get("variant")
    if variant in DEPRECATED_VARIANTS:
        _err(errors, f"{path}.variant", f"variant '{variant}' is deprecated — use {DEPRECATED_VARIANTS[variant]}")
        return
    if variant not in ALLOWED_VARIANTS:
        _err(errors, f"{path}.variant", f"unknown variant '{variant}' (allowed: {sorted(ALLOWED_VARIANTS)})")
        return

    t_start = o.get("t_start")
    duration = o.get("duration")
    if not _is_number(t_start) or t_start < 0:
        _err(errors, f"{path}.t_start", f"must be non-negative number, got {t_start!r}")
    if not _is_number(duration) or duration <= 0:
        _err(errors, f"{path}.duration", f"must be positive number, got {duration!r}")

    if _is_number(t_start) and _is_number(duration):
        if t_start >= video_duration:
            _err(errors, f"{path}.t_start", f"{t_start} >= video_duration {video_duration} — overlay starts after video ends")
        if t_start + duration > video_duration + 0.05:
            _warn(warnings, path, f"t_start+duration ({t_start + duration:.2f}) overflows video_duration ({video_duration:.2f})")

    req, opt = VARIANT_REQS[variant]
    missing_var = req - set(o.keys())
    if missing_var:
        _err(errors, path, f"variant '{variant}' missing required fields: {sorted(missing_var)}")

    # Per-variant type / value checks
    if variant in {"punch", "punch-2line", "price-red-3d", "callout-stack", "icon-stack"}:
        color = o.get("color") or o.get("emphasis_color")
        if color is not None and not (isinstance(color, str) and re.match(r"^#[0-9A-Fa-f]{3,8}$", color)):
            _err(errors, f"{path}.color", f"must be hex color string like '#ffffff', got {color!r}")

    if variant == "punch" and "placement" in o and o["placement"] not in {"top", "bottom"}:
        _err(errors, f"{path}.placement", f"must be 'top' or 'bottom', got {o['placement']!r}")

    if variant == "broll-image":
        ip = o.get("image_path")
        if not isinstance(ip, str) or not ip:
            _err(errors, f"{path}.image_path", "must be non-empty string (e.g. 'facade.jpg' or 'broll/facade.jpg')")
        if "caption" in o and not isinstance(o["caption"], str):
            _err(errors, f"{path}.caption", f"must be string if provided, got {type(o['caption']).__name__}")

    if variant == "contact-card":
        for k in ("avatar_path", "qr_path"):
            v = o.get(k)
            if not isinstance(v, str) or not v:
                _err(errors, f"{path}.{k}", "must be non-empty string (e.g. 'logos/avatar.jpg')")
        hotline = o.get("hotline")
        if hotline and not isinstance(hotline, str):
            _err(errors, f"{path}.hotline", f"must be string, got {type(hotline).__name__}")

    if variant in SCENE_VARIANTS:
        # Array fields must be non-empty lists; counts follow apartment-detail variant-catalog.md.
        list_field, lo, hi = {
            "scene-spec-row":         ("rows", 3, 6),
            "scene-apartment-price":  ("images", 1, None),
            "scene-finishing-detail": ("callouts", 1, 4),
            "scene-amenity-grid":     ("cells", 3, 6),
            "scene-price-package":    ("tiers", 2, 4),
        }[variant]
        items = o.get(list_field)
        if list_field in o:
            if not isinstance(items, list) or not items:
                _err(errors, f"{path}.{list_field}", "must be a non-empty array")
            else:
                if len(items) < lo or (hi is not None and len(items) > hi):
                    rng = f"{lo}-{hi}" if hi is not None else f"{lo}+"
                    _warn(warnings, f"{path}.{list_field}", f"{len(items)} item(s) — recommended {rng} for '{variant}'")
                if variant == "scene-price-package":
                    n_hl = sum(1 for t in items if isinstance(t, dict) and t.get("highlight") is True)
                    if n_hl > 1:
                        _warn(warnings, f"{path}.tiers", f"{n_hl} tiers have highlight:true — keep exactly 1")
        if _is_number(duration) and duration < 4:
            _warn(warnings, f"{path}.duration", f"{duration}s — full-screen scenes need >= 4s for reading time")


def validate_zoom_hook(h: Any, idx: int, video_duration: float, errors: list[str], warnings: list[str]) -> None:
    path = f"zoom_hooks[{idx}]"
    if not isinstance(h, dict):
        _err(errors, path, f"must be an object, got {type(h).__name__}")
        return
    if "t" not in h or "type" not in h:
        _err(errors, path, "missing required keys: 't' and/or 'type'")
        return
    t = h.get("t")
    htype = h.get("type")
    if not _is_number(t) or t < 0:
        _err(errors, f"{path}.t", f"must be non-negative number, got {t!r}")
    if htype not in ALLOWED_ZOOM_TYPES:
        _err(errors, f"{path}.type", f"unknown type '{htype}' (allowed: {sorted(ALLOWED_ZOOM_TYPES)})")
        return
    if _is_number(t) and t > video_duration:
        _warn(warnings, path, f"t={t} > video_duration={video_duration}")

    if htype in {"soft2step", "quickpop", "doublepop"}:
        peak = h.get("peak")
        if not _is_number(peak):
            _err(errors, f"{path}.peak", f"required for type '{htype}', got {peak!r}")
        else:
            if peak < 1.0:
                _err(errors, f"{path}.peak", f"peak {peak} < 1.0 (use type 'zoomout' for scale < 1)")
            elif peak > 1.15:
                _warn(warnings, f"{path}.peak", f"peak {peak} > 1.15 — unnatural (recommended 1.04-1.10)")
    elif htype == "zoomout":
        low = h.get("low")
        dur = h.get("duration")
        if not _is_number(low):
            _err(errors, f"{path}.low", f"required for type 'zoomout', got {low!r}")
        elif low >= 1.0:
            _err(errors, f"{path}.low", f"low {low} >= 1.0 (use 'soft2step'/'quickpop'/'doublepop' for scale > 1)")
        if not _is_number(dur) or dur <= 0:
            _err(errors, f"{path}.duration", f"required positive number for type 'zoomout', got {dur!r}")


def validate_sfx_cue(c: Any, idx: int, video_duration: float, errors: list[str], warnings: list[str]) -> None:
    path = f"sfx_cues[{idx}]"
    if not isinstance(c, dict):
        _err(errors, path, f"must be an object, got {type(c).__name__}")
        return
    if "t" not in c or "file" not in c:
        _err(errors, path, "missing required keys: 't' and/or 'file'")
        return
    t = c.get("t")
    f = c.get("file")
    if not _is_number(t) or t < 0:
        _err(errors, f"{path}.t", f"must be non-negative number, got {t!r}")
    if not isinstance(f, str) or not f:
        _err(errors, f"{path}.file", f"must be non-empty string, got {f!r}")
    elif "/" in f:
        _warn(warnings, f"{path}.file", "should be basename only; init_project.sh resolves sfx/ for you")
    vol = c.get("volume", 0.3)
    if not _is_number(vol) or not (0.0 <= vol <= 1.0):
        _err(errors, f"{path}.volume", f"must be number in [0,1], got {vol!r}")
    if _is_number(t) and t > video_duration:
        _warn(warnings, path, f"t={t} > video_duration={video_duration}")


def detect_overlap_warnings(overlays: list[dict], warnings: list[str]) -> None:
    """Same z-index text overlays overlapping in time can visually conflict.
    B-roll (z=60) overlapping text (z=80) is intentional, so skip those pairs.
    """
    sortable = []
    for i, o in enumerate(overlays):
        t = o.get("t_start")
        d = o.get("duration")
        if _is_number(t) and _is_number(d):
            sortable.append((t, t + d, i, o.get("id", f"#{i}"), o.get("variant", "?")))
    sortable.sort()
    for i in range(len(sortable) - 1):
        a_start, a_end, a_idx, a_id, a_var = sortable[i]
        b_start, b_end, b_idx, b_id, b_var = sortable[i + 1]
        # Skip if either is broll-image — different z-index from text overlays
        if a_var == "broll-image" or b_var == "broll-image":
            continue
        # Skip a scene (z=60) paired with a text overlay (z=80) — intentional layering.
        if (a_var in SCENE_VARIANTS) != (b_var in SCENE_VARIANTS):
            continue
        if b_start < a_end - 0.05:
            _warn(
                warnings,
                f"overlays[{a_idx}]+overlays[{b_idx}]",
                f"{a_id} ({a_var}) overlaps {b_id} ({b_var}) at t={b_start:.2f}s — same z-index may visually conflict",
            )


def validate(data: Any) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    if not isinstance(data, dict):
        errors.append(f"  ✗ root: must be a JSON object, got {type(data).__name__}")
        return errors, warnings

    top_required = {"aesthetic", "video_duration", "fps", "width", "height", "assets", "overlays", "zoom_hooks"}
    missing_top = top_required - set(data.keys())
    if missing_top:
        errors.append(f"  ✗ root: missing required keys: {sorted(missing_top)}")

    aesthetic = data.get("aesthetic")
    if aesthetic not in ALLOWED_AESTHETICS:
        _err(errors, "aesthetic", f"unknown aesthetic '{aesthetic}' (allowed: {sorted(ALLOWED_AESTHETICS)})")

    video_duration = data.get("video_duration", 0)
    if not _is_number(video_duration) or video_duration <= 0:
        _err(errors, "video_duration", f"must be positive number, got {video_duration!r}")
        video_duration = float("inf")

    fps = data.get("fps")
    if not _is_number(fps) or fps <= 0:
        _err(errors, "fps", f"must be positive number, got {fps!r}")
    elif fps not in (24, 25, 30, 60):
        _warn(warnings, "fps", f"non-standard fps {fps} — typical 24/25/30/60")

    width = data.get("width")
    height = data.get("height")
    if not _is_number(width) or width <= 0:
        _err(errors, "width", f"must be positive number, got {width!r}")
    if not _is_number(height) or height <= 0:
        _err(errors, "height", f"must be positive number, got {height!r}")
    if _is_number(width) and _is_number(height) and (width, height) != (1080, 1920):
        _warn(warnings, "width/height", f"({width}x{height}) — BDSGeneralTemplate default is 1080×1920 (9:16)")

    assets = data.get("assets")
    if not isinstance(assets, dict):
        _err(errors, "assets", "must be an object")
    else:
        for k in ("source_video", "voiceover"):
            v = assets.get(k)
            if not isinstance(v, str) or not v:
                _err(errors, f"assets.{k}", f"must be non-empty string, got {v!r}")

    overlays = data.get("overlays", [])
    if not isinstance(overlays, list):
        _err(errors, "overlays", "must be an array")
    else:
        seen_ids: set[str] = set()
        for i, o in enumerate(overlays):
            validate_overlay(o, i, float(video_duration), errors, warnings)
            if isinstance(o, dict):
                oid = o.get("id")
                if isinstance(oid, str):
                    if oid in seen_ids:
                        _err(errors, f"overlays[{i}].id", f"duplicate id '{oid}'")
                    seen_ids.add(oid)
        detect_overlap_warnings([o for o in overlays if isinstance(o, dict)], warnings)

        # Recommend at least one contact-card at end if total overlays >= 5
        non_broll = [o for o in overlays if isinstance(o, dict) and o.get("variant") != "broll-image"]
        if len(non_broll) >= 5 and not any(o.get("variant") == "contact-card" for o in overlays):
            _warn(warnings, "overlays", "no contact-card at end — BĐS videos should close with avatar + hotline + QR")

    hooks = data.get("zoom_hooks", [])
    if not isinstance(hooks, list):
        _err(errors, "zoom_hooks", "must be an array")
    else:
        for i, h in enumerate(hooks):
            validate_zoom_hook(h, i, float(video_duration), errors, warnings)
        ts = sorted([h["t"] for h in hooks if isinstance(h, dict) and _is_number(h.get("t"))])
        for i in range(len(ts) - 1):
            gap = ts[i + 1] - ts[i]
            if gap > 4.0:
                _warn(warnings, "zoom_hooks", f"gap of {gap:.1f}s between t={ts[i]:.2f} and t={ts[i + 1]:.2f} (rule: ≤ 4s)")

    sfx = data.get("sfx_cues", [])
    if sfx:
        if not isinstance(sfx, list):
            _err(errors, "sfx_cues", "must be an array")
        else:
            if len(sfx) > 6:
                _warn(warnings, "sfx_cues", f"{len(sfx)} cues — recommended max 6 per 60s to avoid noise")
            for i, c in enumerate(sfx):
                validate_sfx_cue(c, i, float(video_duration), errors, warnings)

    return errors, warnings


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Usage: validate.py <path-to-overlays.json>", file=sys.stderr)
        return 2
    path = argv[1]
    try:
        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        print(f"ERROR: file not found: {path}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as e:
        print(f"ERROR: invalid JSON: {e}", file=sys.stderr)
        return 1
    except OSError as e:
        print(f"ERROR: cannot read file: {e}", file=sys.stderr)
        return 2

    errors, warnings = validate(data)

    if warnings:
        print("Warnings:")
        for w in warnings:
            print(w)
    if errors:
        print(f"\nErrors ({len(errors)}):")
        for e in errors:
            print(e)
        print(f"\nVALIDATION FAILED — {len(errors)} error(s), {len(warnings)} warning(s)")
        return 1

    print(f"\nVALIDATION OK — 0 errors, {len(warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
