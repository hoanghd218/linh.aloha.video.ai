#!/usr/bin/env python3
"""Cut avatar-window chunks out of the full voiceover for the LITE pipeline.

The lite pipeline only sends 30-40% of the voiceover to HeyGen (the avatar
windows: hook / re-hook / CTA). This script:

  1. Reads beats.json and takes every beat with "avatar": true as a raw window.
  2. Snaps each window boundary to the nearest inter-word SILENCE GAP
     (>= --gap seconds between two words in alignment.json) so we never cut
     mid-word. First window start clamps to 0; last window end clamps to the
     audio duration when the CTA is the final beat.
  3. Merges windows that overlap or sit closer than --merge-below seconds.
  4. Budget guard: total avatar time / total duration must be inside
     [--min-ratio, --max-ratio] or the script exits(2) with suggestions —
     fail fast BEFORE spending HeyGen credits.
  5. Cuts each window sample-exact from full.mp3 (single ffmpeg filter graph,
     one encode pass) and concatenates them with --pad seconds of silence in
     between, so the HeyGen avatar closes its mouth / resets between windows.
  6. Writes avatar-windows.json with windows[] and concatMap[] — the offsets
     split_avatar_video.sh later uses to cut the HeyGen MP4 back apart.

Usage:
  python cut_avatar_audio.py --project <OUT_DIR> [--min-ratio 0.30]
      [--max-ratio 0.42] [--gap 0.25] [--pad 0.4] [--merge-below 2.0]

Reads:  <OUT>/audio/full.mp3, <OUT>/audio/alignment.json, <OUT>/beats.json
Writes: <OUT>/audio/avatar.mp3, <OUT>/avatar-windows.json
"""
from __future__ import annotations
import argparse
import json
import subprocess
import sys
from pathlib import Path


def ffprobe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nk=1:nw=1", str(path)],
        check=True, capture_output=True, text=True).stdout.strip()
    return float(out)


def silence_gaps(words: list[dict], min_gap_s: float) -> list[tuple[float, float]]:
    """Return (gap_start_s, gap_end_s) for every inter-word gap >= min_gap_s."""
    gaps = []
    for a, b in zip(words, words[1:]):
        g0, g1 = a["end_ms"] / 1000.0, b["start_ms"] / 1000.0
        if g1 - g0 >= min_gap_s:
            gaps.append((g0, g1))
    return gaps


def snap(t: float, gaps: list[tuple[float, float]], radius: float = 1.5) -> tuple[float, bool]:
    """Snap t to the midpoint of the nearest silence gap within +/- radius s.
    Returns (snapped_time, was_snapped)."""
    best, best_d = None, radius
    for g0, g1 in gaps:
        mid = (g0 + g1) / 2.0
        d = abs(mid - t)
        if d < best_d:
            best, best_d = mid, d
    if best is None:
        return t, False
    return best, True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--min-ratio", type=float, default=0.30)
    ap.add_argument("--max-ratio", type=float, default=0.42)
    ap.add_argument("--gap", type=float, default=0.25, help="min silence gap (s) to cut in")
    ap.add_argument("--pad", type=float, default=0.4, help="silence inserted between chunks (s)")
    ap.add_argument("--merge-below", type=float, default=2.0, help="merge windows closer than this (s)")
    args = ap.parse_args()
    out = Path(args.project)

    full_mp3 = out / "audio" / "full.mp3"
    align = json.loads((out / "audio" / "alignment.json").read_text(encoding="utf-8"))
    beats_doc = json.loads((out / "beats.json").read_text(encoding="utf-8"))
    beats = beats_doc["beats"]
    total = ffprobe_duration(full_mp3)
    words = align["words"]
    gaps = silence_gaps(words, args.gap)

    # -- 1. raw windows from avatar beats ------------------------------------
    raw = [b for b in beats if b.get("avatar")]
    if not raw:
        sys.stderr.write("!! no beat has \"avatar\": true — nothing to cut.\n"
                         "   Mark hook / re-hook / CTA beats with avatar:true in beats-spec.json.\n")
        return 2

    # -- 2. snap boundaries to silence ---------------------------------------
    windows = []
    for i, b in enumerate(raw):
        s, e = b["start_ms"] / 1000.0, b["end_ms"] / 1000.0
        s_snap, s_ok = snap(s, gaps)
        e_snap, e_ok = snap(e, gaps)
        if b is raw[0] and b["start_ms"] == 0:
            s_snap = 0.0
        if abs(e - total) < 0.05 or b["end_ms"] >= align["duration_ms"] - 50:
            e_snap = total
        if not s_ok and s_snap != 0.0:
            sys.stderr.write(f"~~ {b['id']}: no silence gap within 1.5s of start {s:.2f}s — keeping raw cut\n")
        if not e_ok and e_snap != total:
            sys.stderr.write(f"~~ {b['id']}: no silence gap within 1.5s of end {e:.2f}s — keeping raw cut\n")
        role = b.get("role") or ("hook" if i == 0 else ("cta" if i == len(raw) - 1 else "rehook"))
        windows.append({"id": b["id"], "role": role,
                        "start": round(max(0.0, s_snap), 3),
                        "end": round(min(total, e_snap), 3)})

    # -- 3. merge windows that overlap / sit too close -----------------------
    windows.sort(key=lambda w: w["start"])
    merged = [windows[0]]
    for w in windows[1:]:
        prev = merged[-1]
        if w["start"] - prev["end"] < args.merge_below:
            prev["end"] = max(prev["end"], w["end"])
            prev["id"] = prev["id"] + "+" + w["id"]
            sys.stderr.write(f"~~ merged {w['id']} into {prev['id']} (gap < {args.merge_below}s)\n")
        else:
            merged.append(w)
    windows = merged

    # -- 4. budget guard ------------------------------------------------------
    avatar_total = sum(w["end"] - w["start"] for w in windows)
    ratio = avatar_total / total
    print(f"avatar windows: {len(windows)}  avatarTotal={avatar_total:.2f}s  "
          f"fullTotal={total:.2f}s  ratio={ratio:.3f}")
    for w in windows:
        print(f"  {w['role']:7s} {w['start']:7.2f} → {w['end']:7.2f}  ({w['end']-w['start']:.2f}s)  {w['id']}")
    if ratio < args.min_ratio:
        sys.stderr.write(f"!! ratio {ratio:.3f} < {args.min_ratio} — widen hook/CTA windows "
                         f"or add a re-hook beat (avatar:true) near mid-video.\n")
        return 2
    if ratio > args.max_ratio:
        sys.stderr.write(f"!! ratio {ratio:.3f} > {args.max_ratio} — narrow the re-hook windows "
                         f"or drop one avatar beat.\n")
        return 2

    # -- 5. cut + concat in ONE ffmpeg filter graph (single encode pass) ------
    parts, concat_inputs = [], []
    for i, w in enumerate(windows):
        parts.append(f"[0:a]atrim=start={w['start']}:end={w['end']},asetpts=PTS-STARTPTS[c{i}]")
        concat_inputs.append(f"[c{i}]")
        if i < len(windows) - 1:
            parts.append(f"anullsrc=r=44100:cl=stereo,atrim=duration={args.pad}[s{i}]")
            concat_inputs.append(f"[s{i}]")
    n = len(concat_inputs)
    graph = ";".join(parts) + ";" + "".join(concat_inputs) + f"concat=n={n}:v=0:a=1[outa]"
    avatar_mp3 = out / "audio" / "avatar.mp3"
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(full_mp3), "-filter_complex", graph,
         "-map", "[outa]", "-c:a", "libmp3lame", "-b:a", "192k", str(avatar_mp3)],
        check=True, capture_output=True)

    # -- 6. concatMap + manifest ----------------------------------------------
    concat_map, offset = [], 0.0
    for i, w in enumerate(windows):
        dur = w["end"] - w["start"]
        clip = f"avatar-clips/clip-{i+1:02d}.mp4"
        w["clip"] = clip
        concat_map.append({"clip": i + 1, "file": clip,
                           "offsetInAvatarMp3": round(offset, 3), "dur": round(dur, 3)})
        offset += dur + (args.pad if i < len(windows) - 1 else 0.0)

    manifest = {
        "windows": windows,
        "concatMap": concat_map,
        "pad": args.pad,
        "avatarTotal": round(avatar_total, 3),
        "fullTotal": round(total, 3),
        "ratio": round(ratio, 3),
        "expectedAvatarMp3Dur": round(offset, 3),
    }
    (out / "avatar-windows.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    real = ffprobe_duration(avatar_mp3)
    print(f"wrote {avatar_mp3}  ({real:.2f}s, expected {offset:.2f}s)")
    print(f"wrote {out / 'avatar-windows.json'}")
    if abs(real - offset) > 0.15:
        sys.stderr.write(f"~~ avatar.mp3 duration off by {abs(real-offset):.2f}s vs expected — "
                         f"split_avatar_video.sh will rescale offsets from the real HeyGen MP4.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
