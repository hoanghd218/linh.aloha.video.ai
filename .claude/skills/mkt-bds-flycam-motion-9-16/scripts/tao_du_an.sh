#!/usr/bin/env bash
# Tạo dự án mới từ khung mẫu. Chạy: bash tao_du_an.sh <thư mục dự án mới> <slug> [thư mục kho cảnh]
# Quy ước repo: thư mục dự án = workspace/content/YYYY-MM-DD/<slug>/ (bị .gitignore).
set -euo pipefail
D="$1"; SLUG="$2"; KHO="${3:-}"; S="$(cd "$(dirname "$0")" && pwd)"; SK="$(dirname "$S")"
[ -e "$D" ] && { echo "LỖI: $D đã tồn tại"; exit 1; }
REPO="$(git -C "$SK" rev-parse --show-toplevel 2>/dev/null || (cd "$SK/../../.." && pwd))"
AV="$REPO/workspace/assets/brand/linh avatar.jpg"
[ -f "$AV" ] || { echo "LỖI: thiếu avatar chị Linh: $AV"; exit 1; }
mkdir -p "$D"; cp -R "$SK/template/." "$D/"
mkdir -p "$D/assets/img" "$D/assets/audio" "$D/assets/video" "$D/nguon" "$D/kiem" "$D/renders"
cp "$AV" "$D/assets/img/linh.jpg"
mv "$D/video.mau.json" "$D/video.json"
sed -i '' "s/__SLUG__/$SLUG/" "$D/package.json"
python3 - "$D/video.json" "$SLUG" "$KHO" <<'PY'
import json,sys; p,s,k=sys.argv[1:]; c=json.load(open(p)); c['slug']=s
if k: c['kho']=k
json.dump(c,open(p,'w'),ensure_ascii=False,indent=2)
PY
echo "ok $D — sửa video.json (kho, scenes, zones, captions, cta.hotline), đặt giọng vào assets/audio/, mốc vào nguon/moc.json"
