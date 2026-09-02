#!/usr/bin/env bash
# Helpers for user-supplied filler media (b-roll) in the LITE pipeline.
#
#   probe <file>
#       Print one JSON line: {type, duration, width, height, orientation}.
#       Use during Phase 1b inventory.
#
#   frames <video> <outdir>
#       Extract 3 frames (10% / 50% / 90% of duration) as <outdir>/<stem>-f1..3.png
#       so the orchestrator can Read them and describe the video's content +
#       pick the bestSegment.
#
#   trim <video> <start> <dur> <out.mp4>
#       Cut the bestSegment and normalize: H.264, 30fps, dense keyframes (1s GOP),
#       AUDIO STRIPPED (voiceover is the spine — foreign audio breaks the rhythm).
#       Keeps original resolution; the master mount letterboxes via object-fit:cover.
set -euo pipefail

cmd="${1:-}"
case "$cmd" in
  probe)
    F="${2:?usage: prep_broll.sh probe <file>}"
    python3 - "$F" <<'PY'
import json, subprocess, sys, pathlib
f = sys.argv[1]
ext = pathlib.Path(f).suffix.lower()
is_video = ext in {".mp4", ".mov", ".webm", ".m4v"}
args = ["ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height", "-show_entries", "format=duration",
        "-of", "json", f]
d = json.loads(subprocess.run(args, check=True, capture_output=True, text=True).stdout)
w = d["streams"][0]["width"]; h = d["streams"][0]["height"]
dur = round(float(d["format"].get("duration", 0)), 2) if is_video else None
print(json.dumps({"file": f, "type": "video" if is_video else "image",
                  "duration": dur, "width": w, "height": h,
                  "orientation": "portrait" if h >= w else "landscape"}))
PY
    ;;
  frames)
    V="${2:?usage: prep_broll.sh frames <video> <outdir>}"
    D="${3:?usage: prep_broll.sh frames <video> <outdir>}"
    mkdir -p "$D"
    DUR="$(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$V")"
    STEM="$(basename "${V%.*}")"
    i=1
    for PCT in 0.1 0.5 0.9; do
      TS="$(python3 -c "print(f'{$DUR * $PCT:.2f}')")"
      ffmpeg -y -ss "$TS" -i "$V" -frames:v 1 "$D/$STEM-f$i.png" 2>/dev/null
      echo "$D/$STEM-f$i.png  (t=${TS}s)"
      i=$((i+1))
    done
    ;;
  trim)
    V="${2:?usage: prep_broll.sh trim <video> <start> <dur> <out.mp4>}"
    SS="${3:?start}"; T="${4:?dur}"; O="${5:?out.mp4}"
    mkdir -p "$(dirname "$O")"
    ffmpeg -y -ss "$SS" -i "$V" -t "$T" \
      -c:v libx264 -r 30 -g 30 -keyint_min 30 -pix_fmt yuv420p -movflags +faststart \
      -an "$O" 2>/dev/null
    echo "trimmed -> $O ($(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$O")s)"
    ;;
  *)
    echo "usage:"
    echo "  prep_broll.sh probe  <file>"
    echo "  prep_broll.sh frames <video> <outdir>"
    echo "  prep_broll.sh trim   <video> <start> <dur> <out.mp4>"
    exit 1
    ;;
esac
