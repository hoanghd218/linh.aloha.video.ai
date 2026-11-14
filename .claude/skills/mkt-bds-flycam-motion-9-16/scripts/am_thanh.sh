#!/usr/bin/env bash
# Nhạc nền + nén theo giọng (ducking) cho dự án flycam.
# Chạy: bash am_thanh.sh <thư mục dự án>   → assets/audio/bgm.wav, assets/audio/bgm-duck.wav
#   Mặc định: tự tổng hợp (nhac.py, 100 BPM, không bản quyền, khớp lưới cắt cảnh 2,4 s). Tinh chỉnh: NHAC_ARGS="--strong 39.5 --swell 49"
#   Dùng bài có sẵn: NHAC_FILE="workspace/assets/background music/coconut groove.WAV" bash am_thanh.sh <dir>
#     (lặp nếu ngắn, cắt đúng thời lượng giọng, fade in 0,5 s / fade out 1,5 s; không khớp lưới nhạc — cắt cảnh theo giọng).
#     Chỉ dùng bài đã có quyền dùng (thư viện của chị Linh trong repo); không tải nhạc trên mạng về.
# Thời lượng lấy từ giọng (video.json: voice); mốc CTA lấy từ video.json: cta.at.
set -euo pipefail
P="$(cd "$1" && pwd)"; S="$(cd "$(dirname "$0")" && pwd)"
VOICE=$(python3 -c "import json;c=json.load(open('$P/video.json'));print(c.get('voice','assets/audio/voice.wav'))")
CTA=$(python3 -c "import json;print(json.load(open('$P/video.json'))['cta']['at'])")
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$P/$VOICE")
mkdir -p "$P/assets/audio"
if [ -n "${NHAC_FILE:-}" ]; then
  [ -f "$NHAC_FILE" ] || { echo "LỖI: không thấy NHAC_FILE=$NHAC_FILE"; exit 1; }
  FO=$(python3 -c "print(max(0.0, $DUR - 1.5))")
  ffmpeg -nostdin -y -loglevel error -stream_loop -1 -i "$NHAC_FILE" -t "$DUR" \
    -af "aformat=channel_layouts=stereo,aresample=48000,loudnorm=I=-20:TP=-2,afade=t=in:d=0.5,afade=t=out:st=$FO:d=1.5" \
    -ar 48000 "$P/assets/audio/bgm.wav"
  SRC="bài có sẵn: $(basename "$NHAC_FILE")"
else
  uv run -q --with numpy python3 "$S/nhac.py" "$P/assets/audio/bgm.wav" "$DUR" --cta "$CTA" ${NHAC_ARGS:-}
  SRC="tự tổng hợp"
fi
ffmpeg -nostdin -y -loglevel error -i "$P/assets/audio/bgm.wav" -i "$P/$VOICE" -filter_complex \
  "[1:a]aformat=channel_layouts=stereo,aresample=48000[sc];[0:a][sc]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=350[o]" \
  -map "[o]" -ar 48000 "$P/assets/audio/bgm-duck.wav"
echo "ok nhạc ${DUR}s ($SRC) → assets/audio/bgm-duck.wav"
