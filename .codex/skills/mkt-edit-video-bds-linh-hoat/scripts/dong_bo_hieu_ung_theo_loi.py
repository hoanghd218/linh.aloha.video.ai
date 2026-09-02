#!/usr/bin/env python3
"""Neo cue dựng video vào word timestamps của transcript Whisper."""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Iterable


@dataclass(frozen=True)
class Word:
    index: int
    text: str
    start: float
    end: float
    probability: float | None = None


def _plain(text: str) -> str:
    decomposed = unicodedata.normalize("NFD", text.lower())
    no_marks = "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^0-9a-zA-ZđĐ]+", " ", no_marks).strip().replace("đ", "d").replace("Đ", "d")


def _token(text: str, *, accentless: bool = False) -> str:
    base = unicodedata.normalize("NFC", text.lower())
    if accentless:
        return _plain(base).replace(" ", "")
    return re.sub(r"[^0-9a-zA-ZÀ-ỹđĐ]+", "", base)


def phrase_tokens(text: str, *, accentless: bool = False) -> list[str]:
    text = re.sub(r"(?<=\d)[,.](?=\d)", "", text)
    raw = _plain(text).split() if accentless else re.findall(r"[0-9a-zA-ZÀ-ỹđĐ]+", text.lower())
    return [_token(item, accentless=accentless) for item in raw if _token(item, accentless=accentless)]


def flatten_words(data: Any) -> list[Word]:
    candidates: list[dict[str, Any]] = []
    if isinstance(data, dict) and isinstance(data.get("words"), list):
        candidates = data["words"]
    elif isinstance(data, dict) and isinstance(data.get("segments"), list):
        for segment in data["segments"]:
            if isinstance(segment, dict) and isinstance(segment.get("words"), list):
                candidates.extend(segment["words"])
    elif isinstance(data, list):
        candidates = data

    words: list[Word] = []
    for item in candidates:
        if not isinstance(item, dict):
            continue
        text = item.get("word", item.get("text", ""))
        if not str(text).strip() or item.get("start") is None or item.get("end") is None:
            continue
        words.append(
            Word(
                index=len(words),
                text=str(text).strip(),
                start=float(item["start"]),
                end=float(item["end"]),
                probability=float(item["probability"]) if item.get("probability") is not None else None,
            )
        )
    if not words:
        raise ValueError("Transcript không có word timestamps. Cần segments[].words[] hoặc words[].")
    return words


def _exact_spans(words: list[Word], trigger: str, accentless: bool) -> list[tuple[int, int, float]]:
    target = phrase_tokens(trigger, accentless=accentless)
    if not target:
        return []
    normalized = [_token(word.text, accentless=accentless) for word in words]
    spans: list[tuple[int, int, float]] = []
    size = len(target)
    for start in range(0, len(words) - size + 1):
        if normalized[start : start + size] == target:
            spans.append((start, start + size - 1, 0.97 if accentless else 1.0))
    return spans


def _fuzzy_best(words: list[Word], trigger: str) -> tuple[int, int, float] | None:
    target = _plain(trigger)
    count = max(1, len(target.split()))
    best: tuple[int, int, float] | None = None
    for size in sorted({max(1, count - 1), count, count + 1}):
        for start in range(0, len(words) - size + 1):
            candidate = " ".join(_plain(word.text) for word in words[start : start + size]).strip()
            score = SequenceMatcher(None, target, candidate).ratio()
            if best is None or score > best[2]:
                best = (start, start + size - 1, score)
    return best


def find_anchor(
    words: list[Word],
    cue: dict[str, Any],
    *,
    min_confidence: float,
) -> tuple[int, int, float] | None:
    if cue.get("word_start_index") is not None:
        start = int(cue["word_start_index"])
        end = int(cue.get("word_end_index", start))
        if 0 <= start <= end < len(words):
            return start, end, 1.0
        return None

    trigger = str(cue.get("trigger_text", "")).strip()
    if not trigger:
        return None
    occurrence = max(1, int(cue.get("occurrence", 1)))
    spans = _exact_spans(words, trigger, accentless=False)
    if len(spans) < occurrence:
        spans = _exact_spans(words, trigger, accentless=True)
    if len(spans) >= occurrence:
        return spans[occurrence - 1]

    fuzzy = _fuzzy_best(words, trigger)
    if fuzzy and fuzzy[2] >= min_confidence:
        return fuzzy
    return None


def _load_cues(data: Any) -> list[dict[str, Any]]:
    raw = data.get("cues", []) if isinstance(data, dict) else data
    if not isinstance(raw, list):
        raise ValueError("Cue file phải là array hoặc object có key 'cues'.")
    cues = [item for item in raw if isinstance(item, dict)]
    if len(cues) != len(raw):
        raise ValueError("Mọi cue phải là JSON object.")
    return cues


def _matched_text(words: list[Word], start: int, end: int) -> str:
    return " ".join(word.text for word in words[start : end + 1]).strip()


def build_events(
    words: list[Word],
    cues: Iterable[dict[str, Any]],
    *,
    fps: float,
    min_confidence: float,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    events: list[dict[str, Any]] = []
    unmatched: list[dict[str, Any]] = []
    reserved = {
        "trigger_text",
        "occurrence",
        "word_start_index",
        "word_end_index",
        "lead_ms",
        "tail_ms",
        "pre_roll_ms",
        "post_roll_ms",
        "hold_ms",
    }

    for position, cue in enumerate(cues):
        anchor = find_anchor(words, cue, min_confidence=min_confidence)
        cue_id = str(cue.get("id") or f"cue-{position + 1:03d}")
        if anchor is None:
            unmatched.append({"id": cue_id, "trigger_text": cue.get("trigger_text", ""), "reason": "khong-tim-thay-anchor"})
            continue

        first, last, confidence = anchor
        speech_start = words[first].start
        speech_end = words[last].end
        lead_ms = float(cue.get("lead_ms", cue.get("pre_roll_ms", 80)))
        tail_ms = float(cue.get("tail_ms", cue.get("post_roll_ms", 220)))
        start = max(0.0, speech_start - lead_ms / 1000.0)
        end = speech_end + tail_ms / 1000.0
        if cue.get("hold_ms") is not None:
            end = max(end, start + float(cue["hold_ms"]) / 1000.0)

        event = {key: value for key, value in cue.items() if key not in reserved}
        event.update(
            {
                "id": cue_id,
                "type": str(cue.get("type", "text")),
                "start": round(start, 4),
                "end": round(end, 4),
                "frame_start": max(0, round(start * fps)),
                "frame_end": max(0, round(end * fps)),
                "speech_anchor": {
                    "trigger_text": str(cue.get("trigger_text") or _matched_text(words, first, last)),
                    "matched_text": _matched_text(words, first, last),
                    "occurrence": int(cue.get("occurrence", 1)),
                    "word_start_index": first,
                    "word_end_index": last,
                    "speech_start": round(speech_start, 4),
                    "speech_end": round(speech_end, 4),
                    "confidence": round(confidence, 4),
                },
                "reason": str(cue.get("reason") or "dong-bo-theo-loi-noi"),
                "confidence": round(confidence, 4),
            }
        )
        events.append(event)
    return events, unmatched


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--transcript", required=True, type=Path)
    parser.add_argument("--cues", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--fps", type=float, default=30.0)
    parser.add_argument("--min-confidence", type=float, default=0.78)
    parser.add_argument("--strict", action="store_true", help="Fail nếu có cue không khớp hoặc confidence thấp.")
    args = parser.parse_args()

    try:
        words = flatten_words(load_json(args.transcript))
        cues = _load_cues(load_json(args.cues))
        events, unmatched = build_events(words, cues, fps=args.fps, min_confidence=args.min_confidence)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    low_confidence = [event for event in events if event["speech_anchor"]["confidence"] < args.min_confidence]
    result = {
        "version": "1.0",
        "video": {
            "duration": round(max(word.end for word in words), 4),
            "fps": args.fps,
            "width": 1080,
            "height": 1920,
        },
        "events": sorted(events, key=lambda item: (item["start"], item["end"])),
        "unmatched": unmatched,
        "warnings": [f"{len(unmatched)} cue không tìm thấy speech anchor"] if unmatched else [],
        "metadata": {"transcript": str(args.transcript), "cue_source": str(args.cues)},
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Đã đồng bộ {len(events)}/{len(cues)} cue → {args.output}")
    if unmatched:
        print("Không khớp: " + ", ".join(item["id"] for item in unmatched), file=sys.stderr)
    if args.strict and (unmatched or low_confidence):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
