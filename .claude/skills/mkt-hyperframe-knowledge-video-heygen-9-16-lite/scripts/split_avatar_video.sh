#!/usr/bin/env bash
# Split the HeyGen MP4 (lip-synced to avatar.mp3) back into per-window clips.
#
#   split_avatar_video.sh <avatar_heygen_raw.mp4> <project_dir>
#
# Reads  <project_dir>/avatar-windows.json (concatMap from cut_avatar_audio.py)
# Writes <project_dir>/avatar-clips/clip-NN.mp4  (dense keyframes, 30fps)
#        <project_dir>/assets/pip-still.png      (static frame for the PIP)
#
# If the HeyGen MP4 duration drifts from the expected avatar.mp3 duration
# (HeyGen sometimes pads/truncates silence), offsets are rescaled
# proportionally so cut points stay on the right words.
set -euo pipefail

RAW="${1:?usage: split_avatar_video.sh <avatar_heygen_raw.mp4> <project_dir>}"
OUT="${2:?usage: split_avatar_video.sh <avatar_heygen_raw.mp4> <project_dir>}"
MANIFEST="$OUT/avatar-windows.json"
[ -f "$MANIFEST" ] || { echo "!! $MANIFEST not found — run cut_avatar_audio.py first" >&2; exit 1; }

mkdir -p "$OUT/avatar-clips" "$OUT/assets"

# Where each window REALLY sits inside the HeyGen MP4 is measured, not assumed:
# verify_avatar_sync.py correlates each avatar.mp3 chunk against the returned
# audio. Any lead-in / tail / per-chunk padding HeyGen added is absorbed here,
# which is what keeps the avatar's mouth locked to full.mp3 after the split.
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
set +e
python3 "$SELF_DIR/verify_avatar_sync.py" --project "$OUT" --raw "$RAW"
VERIFY_RC=$?
set -e
if [ "$VERIFY_RC" -eq 4 ]; then
  echo "!! a window is time-stretched — splitting would ship visibly bad lip-sync." >&2
  echo "   Re-run Phase 2, or shorten that avatar window, then split again." >&2
  exit 1
fi
if [ "$VERIFY_RC" -ne 0 ] && [ "$VERIFY_RC" -ne 3 ]; then
  echo "!! verify_avatar_sync.py failed (rc=$VERIFY_RC) — refusing to split blind" >&2
  exit 1
fi
[ "$VERIFY_RC" -eq 3 ] && echo "~~ proceeding with fallback offsets for the unlocated window(s)" >&2

PLAN="$(python3 - "$OUT/cut-plan.json" <<'PY'
import json, sys
for w in json.loads(open(sys.argv[1], encoding="utf-8").read())["windows"]:
    print(f"{w['clip']} {w['measuredOffset']:.3f} {w['dur']:.3f}")
PY
)"

while read -r IDX OFF DUR; do
  CLIP="$OUT/avatar-clips/clip-$(printf '%02d' "$IDX").mp4"
  # -ss AFTER -i: sample-accurate seek. Fast seek can land on the nearest
  # keyframe (HeyGen ships ~8s GOPs), and a frame of slop here is a frame of
  # lip-sync error. Re-encode with dense keyframes (1s GOP) like
  # prep_source_video.sh — the hyperframes renderer seeks per-frame and
  # freezes on sparse-keyframe sources.
  ffmpeg -y -i "$RAW" -ss "$OFF" -t "$DUR" \
    -c:v libx264 -r 30 -g 30 -keyint_min 30 -pix_fmt yuv420p -movflags +faststart \
    -an "$CLIP" 2>/dev/null
  echo "clip-$IDX: offset=${OFF}s dur=${DUR}s -> $CLIP ($(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$CLIP")s)"
done <<< "$PLAN"

# PIP still: grab a frame 1s into clip-01 (mouth usually mid-word — the
# orchestrator MUST Read the png and re-extract at another -ss if eyes are
# closed / mouth wide open).
ffmpeg -y -ss 1.0 -i "$OUT/avatar-clips/clip-01.mp4" -frames:v 1 "$OUT/assets/pip-still.png" 2>/dev/null
echo "pip still -> $OUT/assets/pip-still.png (QA it: Read the image, re-extract if the face looks bad)"
