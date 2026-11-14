#!/usr/bin/env bash
# Hoàn thiện bản render mới nhất: vignette + hạt nhẹ, H.264 1080x1920 bitrate vừa (crf 21, tối đa 6 Mb/s),
# âm lượng -16 LUFS, rồi kiểm số đo + tờ 12 khung. Không xuất 2K/4K.
# Chạy: bash hoan_thien.sh <thư mục dự án> <out.mp4>
set -euo pipefail
P="$(cd "$1" && pwd)"; OUT="$2"
IN=$(ls -t "$P"/renders/*.mp4 2>/dev/null | grep -v final | head -1)
[ -n "$IN" ] || { echo "LỖI: chưa có renders/*.mp4"; exit 1; }
echo "nguồn: $IN"
ffmpeg -nostdin -y -loglevel error -i "$IN" \
  -vf "vignette=angle=PI/5.2,noise=c0s=4:c0f=t,format=yuv420p" \
  -c:v libx264 -preset slow -crf 21 -maxrate 6M -bufsize 12M -profile:v high -movflags +faststart \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k "$OUT"
mkdir -p "$P/kiem"
echo "--- số đo"
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,bit_rate:format=duration,size,bit_rate -of default=nw=1 "$OUT"
echo "--- âm lượng"
ffmpeg -nostdin -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):" | tail -3
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")
ffmpeg -nostdin -y -loglevel error -i "$OUT" -vf "fps=12/$DUR,scale=270:480,tile=6x2" -frames:v 1 "$P/kiem/khung-cuoi.jpg"
echo "tờ khung: $P/kiem/khung-cuoi.jpg"
