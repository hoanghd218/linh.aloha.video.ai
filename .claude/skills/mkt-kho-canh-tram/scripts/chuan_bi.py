#!/usr/bin/env python3
"""Sau khi tải: tạo titles.tsv, mốc chuyển cảnh thô (cuts/<id>.txt) và contact sheet có mốc giờ (sheets/<id>_NN.jpg).
Dùng: chuan_bi.py --work DIR"""
import argparse, glob, json, os, re, subprocess
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont
ap = argparse.ArgumentParser(); ap.add_argument('--work', required=True); W = ap.parse_args().work
for d in ('sheets', 'frames', 'cuts'): os.makedirs(f'{W}/{d}', exist_ok=True)
FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
font = ImageFont.truetype(FONT, 22) if os.path.exists(FONT) else ImageFont.load_default()
vids = sorted(glob.glob(W + '/src/*.mp4'))
with open(W + '/titles.tsv', 'w', encoding='utf-8') as f:
    for v in vids:
        vid = os.path.basename(v)[:-4]; j = {}
        try: j = json.load(open(v[:-4] + '.info.json'))
        except Exception: pass
        f.write('\t'.join([vid, str(j.get('upload_date', '')), (j.get('channel') or '').replace('\t', ' '),
                           (j.get('title') or '').replace('\t', ' '), str(j.get('height', ''))]) + '\n')
def one(f):
    vid = os.path.basename(f)[:-4]
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
    r = subprocess.run(['ffmpeg', '-hide_banner', '-skip_frame', 'nokey', '-i', f, '-vf', 'select=gt(scene\\,0.25),showinfo', '-f', 'null', '-'],
                       capture_output=True, text=True)
    ts = re.findall(r'pts_time:([\d.]+)', r.stderr)
    open(f'{W}/cuts/{vid}.txt', 'w').write('\n'.join(f'{float(t):.2f}' for t in ts) + '\n')
    N = 4 if d < 120 else 8 if d < 300 else 12 if d < 700 else 20
    fd = f'{W}/frames/{vid}'; os.makedirs(fd, exist_ok=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-vf', f'fps=1/{N},scale=320:-2', '-q:v', '5', fd + '/%04d.jpg'])
    fr = sorted(glob.glob(fd + '/*.jpg')); per = 30; n = 0
    for s in range(0, len(fr), per):
        chunk = fr[s:s + per]; w, h = Image.open(chunk[0]).size; cols = 6; rows = (len(chunk) + cols - 1) // cols
        sh = Image.new('RGB', (cols * w, rows * h), 'black'); dr = ImageDraw.Draw(sh)
        for i, p in enumerate(chunk):
            t = (s + i) * N; x, y = (i % cols) * w, (i // cols) * h
            sh.paste(Image.open(p).resize((w, h)), (x, y))
            dr.rectangle([x, y, x + 80, y + 28], fill='black'); dr.text((x + 4, y + 2), f'{int(t // 60)}:{int(t % 60):02d}', fill='yellow', font=font)
        sh.save(f'{W}/sheets/{vid}_{s // per + 1:02d}.jpg', quality=80); n += 1
    return vid, round(d), N, len(ts), n
with ThreadPoolExecutor(3) as ex:
    for r in ex.map(one, vids): print('%s  %ss  moi-o=%ss  cut=%s  sheets=%s' % r)
