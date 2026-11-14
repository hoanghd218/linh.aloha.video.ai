#!/bin/bash
# Tải video đã chọn, ≤1080p mp4, kèm info.json. Dùng: tai_video.sh WORK_DIR id1 id2 ...
# Thử lại 3 lần mỗi video (YouTube hay trả 403 lúc ghép).
W="$1"; shift; mkdir -p "$W/src"
for id in "$@"; do
  [ -f "$W/src/$id.mp4" ] && { echo "co roi $id"; continue; }
  for k in 1 2 3; do
    yt-dlp -q --no-warnings -f 'bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[height<=1080]' --merge-output-format mp4 \
      --write-info-json -o "$W/src/%(id)s.%(ext)s" -- "$id" && break
    echo "thu lai $id ($k)"; sleep 3
  done
  [ -f "$W/src/$id.mp4" ] && echo "OK $id" || echo "LOI $id"
done
