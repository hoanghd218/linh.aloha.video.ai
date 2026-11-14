#!/usr/bin/env python3
"""Tìm video YouTube cho một dự án. Không cần API key (yt-dlp).
Dùng: tim_video.py --work DIR --q "Vinhomes Ocean Park 2 flycam" --q "..." [--n 15]
Ghi DIR/cand.tsv: id, giây, kênh, ngày đăng, lượt xem, tiêu đề (gộp, bỏ trùng)."""
import argparse, json, os, subprocess
ap = argparse.ArgumentParser(); ap.add_argument('--work', required=True)
ap.add_argument('--q', action='append', required=True); ap.add_argument('--n', type=int, default=15)
a = ap.parse_args(); os.makedirs(a.work, exist_ok=True)
seen, rows = set(), []
for q in a.q:
    out = subprocess.run(['yt-dlp', '--flat-playlist', '-J', f'ytsearch{a.n}:{q}'], capture_output=True, text=True)
    if out.returncode: print('LOI tim:', q, out.stderr[-300:]); continue
    for e in json.loads(out.stdout).get('entries') or []:
        if not e or e['id'] in seen: continue
        seen.add(e['id'])
        rows.append([e['id'], str(int(e.get('duration') or 0)), (e.get('channel') or e.get('uploader') or '').replace('\t', ' '),
                     str(e.get('upload_date') or ''), str(e.get('view_count') or ''), (e.get('title') or '').replace('\t', ' '), q])
with open(os.path.join(a.work, 'cand.tsv'), 'w', encoding='utf-8') as f:
    f.write('id\tgiay\tkenh\tngay_dang\tluot_xem\ttieu_de\ttu_khoa\n')
    for r in rows: f.write('\t'.join(r) + '\n')
print(len(rows), 'video ->', os.path.join(a.work, 'cand.tsv'))
