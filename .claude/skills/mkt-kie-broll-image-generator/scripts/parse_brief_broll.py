#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""
Extract b-roll suggestions from a brief.md (mkt-vn-short-video-script output).

Heuristics — handles the Thu brief-template format and similar:
    - Markdown table rows where header includes "B-roll" / "cảnh quay" — take that column
    - Lines under section "### Gợi ý b-roll" / "## Gợi ý b-roll" / "Gợi ý hình ảnh"
      that start with `- ` or `* `
    - Inline `(b-roll: ...)` markers in beat sections

If --profile <name> is given, the matching `profiles/<name>/style.md` content is
appended as STYLE suffix to each prompt.

Output JSON: [{idx, raw_text, prompt, suggested_filename}, ...]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

SECTION_HEADERS_RE = re.compile(
    r"^#{2,4}\s*(?:gợi\s*ý\s*(?:hình\s*ảnh|b[- ]?roll)|b[- ]?roll|cảnh\s*quay)",
    re.IGNORECASE,
)
TABLE_COL_BROLL_RE = re.compile(r"\b(b-?roll|cảnh\s*quay|hình\s*ảnh)\b", re.IGNORECASE)
INLINE_BROLL_RE = re.compile(r"\(b-?roll\s*[:：]\s*([^)]+)\)", re.IGNORECASE)
BULLET_RE = re.compile(r"^\s*[-*]\s+(.+)")


def slugify(text: str, max_len: int = 40) -> str:
    norm = unicodedata.normalize("NFKD", text)
    ascii_only = "".join(c for c in norm if not unicodedata.combining(c))
    ascii_only = ascii_only.replace("đ", "d").replace("Đ", "d")
    ascii_only = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_only).strip("-").lower()
    return ascii_only[:max_len] or "scene"


def strip_brackets(text: str) -> str:
    # remove leading "[" / trailing "]" from template placeholders
    return re.sub(r"^\[|\]$", "", text).strip()


def extract_table_broll_cells(lines: list[str]) -> list[str]:
    out: list[str] = []
    header_idx = -1
    broll_col = -1
    for i, ln in enumerate(lines):
        if not ln.lstrip().startswith("|"):
            header_idx = -1
            broll_col = -1
            continue
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        # header detect
        if any(TABLE_COL_BROLL_RE.search(c) for c in cells):
            header_idx = i
            for j, c in enumerate(cells):
                if TABLE_COL_BROLL_RE.search(c):
                    broll_col = j
                    break
            continue
        # separator row
        if header_idx >= 0 and re.match(r"^\s*\|?\s*[-: ]+\|", ln):
            continue
        # data row
        if header_idx >= 0 and broll_col >= 0 and broll_col < len(cells):
            val = cells[broll_col].strip()
            if val and val not in {"[...]"} and not val.startswith("---"):
                out.append(val)
    return out


def extract_section_bullets(lines: list[str]) -> list[str]:
    out: list[str] = []
    in_section = False
    for ln in lines:
        if SECTION_HEADERS_RE.match(ln.strip()):
            in_section = True
            continue
        if in_section and ln.lstrip().startswith("#"):
            in_section = False
            continue
        if in_section:
            m = BULLET_RE.match(ln)
            if m:
                out.append(m.group(1).strip())
    return out


def extract_inline_markers(text: str) -> list[str]:
    return [m.group(1).strip() for m in INLINE_BROLL_RE.finditer(text)]


def load_style_block(profile: str, profiles_dir: Path) -> str:
    style_path = profiles_dir / profile / "style.md"
    if not style_path.exists():
        print(f"[parse_brief] WARN profile style not found: {style_path}", file=sys.stderr)
        return ""
    text = style_path.read_text()
    # drop heading lines starting with `#`
    body = "\n".join(line for line in text.splitlines() if not line.lstrip().startswith("#"))
    return body.strip()


def build_prompt(concept: str, style_block: str) -> str:
    scene = concept.strip().rstrip(".") + "."
    parts = [f"SCENE: {scene}"]
    if style_block:
        parts.append(f"STYLE: {style_block}")
    parts.append(
        "AVOID: text overlays, watermarks, AI artifacts, distorted hands, oversaturated colors."
    )
    return "\n\n".join(parts)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--brief", required=True, help="Path to brief.md")
    ap.add_argument("--profile", default=None, help="Apply profiles/<name>/style.md as suffix")
    ap.add_argument(
        "--profiles_dir",
        default=str(Path(__file__).resolve().parent.parent / "profiles"),
        help="Profiles directory (default: sibling profiles/ folder)",
    )
    ap.add_argument("--output_json", default=None, help="Write JSON here; else stdout")
    args = ap.parse_args()

    brief_path = Path(args.brief).expanduser().resolve()
    if not brief_path.exists():
        print(f"ERROR brief not found: {brief_path}", file=sys.stderr)
        sys.exit(1)

    text = brief_path.read_text()
    lines = text.splitlines()

    concepts: list[str] = []
    concepts.extend(extract_table_broll_cells(lines))
    concepts.extend(extract_section_bullets(lines))
    concepts.extend(extract_inline_markers(text))

    # Dedup preserving order, drop empties + template placeholders
    seen: set[str] = set()
    cleaned: list[str] = []
    for c in concepts:
        c2 = strip_brackets(c)
        if not c2 or c2 in seen:
            continue
        if c2.startswith("[") or c2 in {"...", "[...]"}:
            continue
        seen.add(c2)
        cleaned.append(c2)

    style_block = load_style_block(args.profile, Path(args.profiles_dir)) if args.profile else ""

    items = []
    for idx, raw in enumerate(cleaned, start=1):
        items.append(
            {
                "idx": idx,
                "raw_text": raw,
                "prompt": build_prompt(raw, style_block),
                "suggested_filename": f"broll-{idx:02d}-{slugify(raw)}.png",
            }
        )

    out_str = json.dumps(items, ensure_ascii=False, indent=2)
    if args.output_json:
        Path(args.output_json).write_text(out_str + "\n")
        print(f"OK {args.output_json} ({len(items)} concepts)", file=sys.stderr)
    else:
        print(out_str)


if __name__ == "__main__":
    main()
