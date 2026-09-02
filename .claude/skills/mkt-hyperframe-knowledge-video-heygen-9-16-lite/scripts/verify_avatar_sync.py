#!/usr/bin/env python3
"""Measure where each avatar window really lands inside the HeyGen MP4.

WHY THIS EXISTS
---------------
The lite pipeline's lip-sync correctness rests on one unverified link:

    full.mp3 --[ffmpeg atrim]--> avatar.mp3 --[HeyGen]--> raw.mp4 --[split]--> clips

The first arrow is sample-exact by construction. The HeyGen arrow is NOT: the
service may prepend a lead-in, append a tail, or pad differently around each
chunk. Cutting the raw MP4 at the offsets we *sent* (or at proportionally
rescaled ones) silently misaligns every clip after the first pad — the avatar's
mouth then runs ahead of / behind the voiceover, which is exactly the artifact
the whole pipeline exists to avoid.

So instead of assuming, we MEASURE. Both files are decoded to a mono 8 kHz RMS
envelope (50 Hz frames); for each window we slide the known avatar.mp3 chunk
across the HeyGen audio around its expected position and keep the lag with the
highest Pearson correlation. Speech envelopes are highly distinctive, so the
peak is sharp — this locates each chunk to within one 20 ms frame regardless of
what padding HeyGen applied, and it does so per-window, so head padding, tail
padding and per-chunk drift are all handled by the same measurement.

Output is a cut plan consumed by split_avatar_video.sh, plus a per-window
report so the orchestrator can see the real numbers instead of trusting a
duration check.

Usage:
  python verify_avatar_sync.py --project <OUT_DIR> --raw <avatar_heygen_raw.mp4>
      [--max-lag 2.5] [--warn-lag 0.08] [--min-confidence 0.5]
      [--out cut-plan.json]

Reads:  <OUT>/avatar-windows.json, <OUT>/audio/avatar.mp3, <raw mp4>
Writes: <OUT>/cut-plan.json   (measured offsets + confidence per window)
Exit:   0 = every window located confidently and rigid (shift-only)
        3 = at least one window could not be located (plan written with the
            expected offset as fallback for those windows)
        4 = at least one window is time-stretched — a cut point cannot fix it,
            so the caller must NOT split blind
"""
from __future__ import annotations
import argparse
import array
import json
import subprocess
import sys
from pathlib import Path

SR = 8000        # decode rate — plenty for an amplitude envelope
HOP = 160        # 20 ms frames -> 50 Hz envelope


def decode_envelope(path: Path) -> list[float]:
    """Decode any audio/video file to a mono RMS envelope at 50 Hz."""
    pcm = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-vn",
         "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
        check=True, capture_output=True).stdout
    samples = array.array("h")
    samples.frombytes(pcm[: len(pcm) // 2 * 2])
    env = []
    for i in range(0, len(samples) - HOP, HOP):
        acc = 0
        for s in samples[i:i + HOP]:
            acc += s * s
        env.append((acc / HOP) ** 0.5)
    return env


def pearson(a: list[float], b: list[float]) -> float:
    n = len(a)
    if n == 0:
        return 0.0
    ma, mb = sum(a) / n, sum(b) / n
    cov = va = vb = 0.0
    for i in range(n):
        da, db = a[i] - ma, b[i] - mb
        cov += da * db
        va += da * da
        vb += db * db
    if va <= 0 or vb <= 0:
        return 0.0
    return cov / (va * vb) ** 0.5


def pick_probe(env: list[float], lo: int, hi: int, want: int) -> int | None:
    """Pick the `want`-frame sub-window in [lo, hi) carrying the most speech.

    Drift probes must land on audible speech: a window that trails off into
    silence (a CTA usually does) has no envelope structure there, and
    correlating silence against silence yields no information at all. So choose
    the candidate with the highest variance rather than a fixed position.
    """
    best_i, best_v = None, 0.0
    if hi - lo < want:
        return None
    step = max(1, want // 4)
    for i in range(lo, hi - want + 1, step):
        seg = env[i:i + want]
        m = sum(seg) / want
        var = sum((x - m) ** 2 for x in seg)
        if var > best_v:
            best_i, best_v = i, var
    return best_i if best_v > 0 else None


def locate(ref: list[float], hay: list[float], expected_idx: int,
           max_lag_frames: int) -> tuple[int, float]:
    """Slide ref across hay around expected_idx; return (best_idx, correlation)."""
    best_idx, best_c = expected_idx, -2.0
    lo = max(0, expected_idx - max_lag_frames)
    hi = min(len(hay) - len(ref), expected_idx + max_lag_frames)
    if hi < lo:
        return expected_idx, 0.0
    for idx in range(lo, hi + 1):
        c = pearson(ref, hay[idx:idx + len(ref)])
        if c > best_c:
            best_idx, best_c = idx, c
    return best_idx, best_c


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--raw", required=True, help="avatar_heygen_raw.mp4")
    ap.add_argument("--max-lag", type=float, default=2.5,
                    help="how far around the expected offset to search (s)")
    ap.add_argument("--warn-lag", type=float, default=0.08,
                    help="lag above this is flagged as perceptible lip-sync drift (s)")
    ap.add_argument("--min-confidence", type=float, default=0.5)
    ap.add_argument("--out", default="cut-plan.json")
    args = ap.parse_args()

    out = Path(args.project)
    manifest = json.loads((out / "avatar-windows.json").read_text(encoding="utf-8"))
    avatar_mp3 = out / "audio" / "avatar.mp3"
    raw = Path(args.raw)

    ref_env = decode_envelope(avatar_mp3)
    hay_env = decode_envelope(raw)
    frame_s = HOP / SR
    max_lag_frames = int(round(args.max_lag / frame_s))

    print(f"avatar.mp3 {len(ref_env)*frame_s:.2f}s   heygen raw {len(hay_env)*frame_s:.2f}s   "
          f"(envelope {1/frame_s:.0f} Hz, search ±{args.max_lag}s)\n")

    plan, degraded = [], False
    for c in manifest["concatMap"]:
        off, dur = c["offsetInAvatarMp3"], c["dur"]
        i0 = int(round(off / frame_s))
        n = int(round(dur / frame_s))
        chunk = ref_env[i0:i0 + n]
        if len(chunk) < 5:
            sys.stderr.write(f"!! clip {c['clip']}: window too short to measure — using expected offset\n")
            plan.append({**c, "measuredOffset": off, "lag": 0.0, "confidence": None,
                         "status": "unmeasurable"})
            degraded = True
            continue

        idx, conf = locate(chunk, hay_env, i0, max_lag_frames)
        measured = idx * frame_s
        lag = measured - off
        ok = conf >= args.min_confidence

        # A single offset can only express a whole-window shift. If HeyGen
        # stretched the audio (or dropped/duplicated frames), the mouth would be
        # right at the start of the window and progressively wrong by the end —
        # invisible to one global measurement. So locate the head and the tail of
        # the window independently: if they disagree, the window is not shifted,
        # it is STRETCHED, and no cut point can fix it.
        drift = drift_span = None
        local = int(round(0.5 / frame_s))
        if ok and n >= int(round(3.0 / frame_s)):
            want = min(int(round(3.0 / frame_s)),
                       max(int(round(1.0 / frame_s)), int(n * 0.25)))
            hp = pick_probe(ref_env, i0, i0 + int(n * 0.45), want)
            tp = pick_probe(ref_env, i0 + int(n * 0.55), i0 + n, want)
            if hp is not None and tp is not None:
                hidx, hconf = locate(ref_env[hp:hp + want], hay_env, idx + (hp - i0), local)
                tidx, tconf = locate(ref_env[tp:tp + want], hay_env, idx + (tp - i0), local)
                if min(hconf, tconf) >= args.min_confidence:
                    head_lag = hidx - (idx + (hp - i0))
                    tail_lag = tidx - (idx + (tp - i0))
                    drift = (tail_lag - head_lag) * frame_s
                    drift_span = (tp - hp) * frame_s

        # Drift is measured between two probes, but what the viewer sees is the
        # error accumulated across the WHOLE clip, so extrapolate to its duration
        # before judging. Require the raw reading to be at least 2 envelope
        # frames as well, otherwise single-frame quantisation noise on a short
        # probe span would extrapolate into a false alarm.
        drift_window = None
        if drift is not None and drift_span:
            drift_window = drift / drift_span * dur

        if not ok:
            status = "low-confidence"
            degraded = True
            measured, lag = off, 0.0   # fall back to what we sent
        elif (drift_window is not None and abs(drift_window) > args.warn_lag
              and abs(drift) >= 2 * frame_s):
            status = "stretched"
            degraded = True
        elif abs(lag) > args.warn_lag:
            status = "drift"
        else:
            status = "ok"

        plan.append({"clip": c["clip"], "file": c["file"],
                     "expectedOffset": off, "measuredOffset": round(measured, 3),
                     "dur": dur, "lag": round(lag, 3),
                     "internalDrift": None if drift is None else round(drift, 3),
                     "driftMeasuredOverSpan": None if drift_span is None else round(drift_span, 2),
                     "driftAcrossWindow": None if drift_window is None else round(drift_window, 3),
                     "confidence": round(conf, 3), "status": status})

        flag = {"ok": "", "drift": "  <-- shifted, but confidently located (offset corrects it)",
                "stretched": "  <-- STRETCHED inside the window: no cut point can fix this",
                "low-confidence": "  <-- NOT located, falling back to expected offset"}[status]
        dtxt = ("  drift n/a" if drift_window is None
                else f"  drift {drift_window:+.3f}s across clip")
        print(f"clip {c['clip']}: expected {off:7.3f}s  measured {measured:7.3f}s  "
              f"lag {lag:+.3f}s  corr {conf:.3f}{dtxt}{flag}")

    (out / args.out).write_text(
        json.dumps({"windows": plan,
                    "frameResolution": round(frame_s, 3),
                    "warnLag": args.warn_lag}, ensure_ascii=False, indent=2),
        encoding="utf-8")
    print(f"\nwrote {out / args.out}")

    worst = max((abs(p["lag"]) for p in plan if p.get("confidence")), default=0.0)
    if any(p["status"] == "stretched" for p in plan):
        sys.stderr.write(
            "\n!! HeyGen time-stretched at least one window: the mouth is in sync at one end\n"
            "   of the clip and off at the other, and cutting elsewhere cannot repair it.\n"
            "   Re-run Phase 2 for this avatar.mp3; if it repeats, split the long window into\n"
            "   two shorter avatar beats so each clip carries less accumulated error.\n")
        return 4
    if degraded:
        sys.stderr.write("\n!! at least one window could not be located confidently.\n"
                         "   Check that --raw really is the lip-sync of THIS avatar.mp3.\n")
        return 3
    if worst > args.warn_lag:
        print(f"\nHeyGen shifted content by up to {worst:.3f}s — the measured offsets "
              f"in the plan correct for it, so the split stays in sync.")
    else:
        print(f"\nAll windows within ±{args.warn_lag}s of where they were sent — "
              f"HeyGen returned the audio unshifted.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
