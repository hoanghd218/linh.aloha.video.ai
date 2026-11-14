#!/usr/bin/env python3
"""Cắt clip theo nhãn, xếp theo nhóm, làm ảnh xem nhanh, chỉ mục, tờ tổng và README.
Dùng: dong_goi.py --work DIR --out "THU_MUC_KHO" --prefix OP --ten "Vinhomes Ocean Park 2-3 (Văn Giang, Hưng Yên)" [--src-copy]
Đọc mọi file WORK/labels_*.tsv (cột: src_id t0 t1 du_an phan_khu nhom ten tags mo_ta thuc_te_hay_phoi_canh chu_logo chat_luong)."""
import argparse, csv, glob, json, os, re, shutil, subprocess, unicodedata, datetime
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont
ap = argparse.ArgumentParser()
for k in ('--work', '--out', '--prefix', '--ten'): ap.add_argument(k, required=True)
ap.add_argument('--src-copy', action='store_true', help='chép video gốc vào 00-video-nguon')
a = ap.parse_args(); W, OUT, P = a.work, a.out, a.prefix
ORDER = ['flycam-toan-canh', 'vinh-bien-ho-tao-song', 'song-ho-mat-nuoc', 'cong-vien-canh-quan', 'tien-ich-the-thao-ho-boi',
         'truong-hoc-y-te-tttm', 'duong-noi-khu-giao-thong', 'ha-tang-ket-noi-xung-quanh', 'lien-ke-biet-thu', 'shophouse-pho-thuong-mai',
         'chung-cu-cao-tang', 'nha-mau-noi-that', 'doi-song-cu-dan', 'ban-dem', 'tien-do-xay-dung', 'phoi-canh-3d', 'le-tet-su-kien']
titles = {}
if os.path.exists(W + '/titles.tsv'):
    for l in open(W + '/titles.tsv', encoding='utf-8'):
        p = l.rstrip('\n').split('\t'); titles[p[0]] = p + [''] * 5
rows = []
for fn in sorted(glob.glob(W + '/labels_*.tsv')):
    rows += [r for r in csv.DictReader(open(fn, encoding='utf-8'), delimiter='\t') if r.get('src_id')]
bad = [r for r in rows if not (2.5 <= float(r['t1']) - float(r['t0']) <= 25) or not os.path.exists(f"{W}/src/{r['src_id']}.mp4")]
for r in bad: print('BO nhan loi:', r['src_id'], r['t0'], r['t1'])
rows = [r for r in rows if r not in bad]
rows.sort(key=lambda r: (ORDER.index(r['nhom']) if r['nhom'] in ORDER else 99, r['du_an'], r['src_id'], float(r['t0'])))
def slug(s):
    s = s.replace('đ', 'd').replace('Đ', 'D'); s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').lower(); return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:50]
for i, r in enumerate(rows, 1):
    r['id'] = f'{P}{i:03d}'; nm = f"{r['id']}_{slug(r['du_an'])}_{slug(r['ten'])}"
    r['file'] = f"01-theo-loai/{r['nhom']}/{nm}.mp4"; r['anh'] = f"02-anh-xem-nhanh/{nm}.jpg"
    t0, t1 = float(r['t0']), float(r['t1']); r['thoi_luong_s'] = round(t1 - t0, 1)
    r['moc_nguon'] = f"{int(t0 // 60):02d}:{t0 % 60:04.1f}–{int(t1 // 60):02d}:{t1 % 60:04.1f}"
    r['link_nguon'] = f"https://www.youtube.com/watch?v={r['src_id']}&t={int(t0)}s"
    tt = titles.get(r['src_id'], [''] * 5); r['kenh_nguon'] = tt[2]
    r['ngay_dang'] = f"{tt[1][6:8]}/{tt[1][4:6]}/{tt[1][:4]}" if len(tt[1]) == 8 else ''
    r['quyen_su_dung'] = 'Nguồn YouTube – quyền chưa xác minh'
os.makedirs(OUT + '/02-anh-xem-nhanh', exist_ok=True)
def cut(r):
    src = f"{W}/src/{r['src_id']}.mp4"; out = f"{OUT}/{r['file']}"; os.makedirs(os.path.dirname(out), exist_ok=True)
    t0 = float(r['t0']); d = r['thoi_luong_s']
    x = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t0), '-i', src, '-t', str(d), '-c:v', 'libx264', '-crf', '18', '-preset', 'fast',
                        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out]).returncode
    y = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t0 + d / 2), '-i', src, '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', '4', f"{OUT}/{r['anh']}"]).returncode
    dur = 0.0
    try: dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]))
    except Exception: pass
    return r['id'], x, y, abs(dur - d) < 0.6
with ThreadPoolExecutor(6) as ex: res = list(ex.map(cut, rows))
loi = [x for x in res if x[1] or x[2] or not x[3]]
print('cat', len(res), 'loi', loi)
cols = ['id', 'du_an', 'phan_khu', 'nhom', 'ten', 'tags', 'mo_ta', 'thuc_te_hay_phoi_canh', 'chu_logo', 'chat_luong', 'thoi_luong_s',
        'moc_nguon', 'src_id', 'kenh_nguon', 'ngay_dang', 'link_nguon', 'quyen_su_dung', 'file', 'anh']
with open(OUT + '/chi-muc.csv', 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols, extrasaction='ignore'); w.writeheader(); w.writerows(rows)
json.dump(rows, open(W + '/jobs.json', 'w'), ensure_ascii=False)
md = [f'# Chỉ mục kho cảnh {a.ten}', '', '| ID | Dự án | Phân khu | Nhóm | Tên | Giây | Thực tế/Phối cảnh | Chữ/logo | Chất lượng | Nguồn |', '|---|---|---|---|---|---|---|---|---|---|']
md += [f"| {r['id']} | {r['du_an']} | {r['phan_khu']} | {r['nhom']} | {r['ten']} | {r['thoi_luong_s']} | {r['thuc_te_hay_phoi_canh']} | {r['chu_logo']} | {r['chat_luong']} | [{r['kenh_nguon']} {r['ngay_dang']}]({r['link_nguon']}) |" for r in rows]
open(OUT + '/chi-muc.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
font = ImageFont.truetype(FONT, 18) if os.path.exists(FONT) else ImageFont.load_default()
w, h, c = 320, 180, 8; sh = Image.new('RGB', (c * w, max(1, (len(rows) + c - 1) // c) * h), 'black'); dr = ImageDraw.Draw(sh)
for i, r in enumerate(rows):
    x, y = (i % c) * w, (i // c) * h
    try: sh.paste(Image.open(f"{OUT}/{r['anh']}").resize((w, h)), (x, y))
    except Exception: pass
    lab = f"{r['id']} {r['du_an']} {r['nhom'][:16]}"; dr.rectangle([x, y, x + len(lab) * 10, y + 22], fill='black'); dr.text((x + 3, y + 1), lab, fill='yellow', font=font)
sh.save(OUT + '/to-kho-canh.jpg', quality=82)
used = sorted({r['src_id'] for r in rows})
if a.src_copy:
    os.makedirs(OUT + '/00-video-nguon', exist_ok=True)
    for v in sorted(glob.glob(W + '/src/*.mp4')): shutil.copy2(v, OUT + '/00-video-nguon/')
    with open(OUT + '/00-video-nguon/danh-sach-nguon.tsv', 'w', encoding='utf-8') as f:
        f.write('id\tngay_dang\tkenh\ttieu_de\tdo_cao\n'); [f.write('\t'.join(t[:5]) + '\n') for t in titles.values()]
from collections import Counter
cn = Counter(r['nhom'] for r in rows); da = Counter(r['du_an'] for r in rows)
logo = sum(r['chu_logo'] not in ('', 'khong') for r in rows); pc = sum(r['thuc_te_hay_phoi_canh'] == 'phoi-canh' for r in rows)
tong = sum(r['thoi_luong_s'] for r in rows)
readme = f"""# Kho cảnh {a.ten}

Tạo ngày {datetime.date.today():%d/%m/%Y}. {len(rows)} cảnh ({P}001–{P}{len(rows):03d}), tổng ~{round(tong/60)} phút, cắt từ {len(used)} video YouTube.

## Thư mục
- `00-video-nguon/`: video gốc + `danh-sach-nguon.tsv`.
- `01-theo-loai/<nhóm>/`: clip đã cắt, có tiếng gốc. Tên file `{P}xxx_<dự án>_<tên cảnh>.mp4`.
- `02-anh-xem-nhanh/`: ảnh giữa clip. `to-kho-canh.jpg`: tờ xem nhanh toàn bộ.
- `chi-muc.csv` / `chi-muc.md`: dự án, phân khu, nhóm, tên, tags, mô tả, thực tế/phối cảnh, chữ-logo, chất lượng, thời lượng, mốc nguồn, kênh, ngày đăng, link.

## Thống kê
- Theo nhóm: {', '.join(f'{k} {v}' for k, v in cn.most_common())}
- Theo dự án: {', '.join(f'{k} {v}' for k, v in da.most_common())}
- Có logo/chữ cần crop/che: {logo}. Phối cảnh 3D: {pc}.

## Lưu ý khi dùng
- Phân khu chỉ ghi khi chắc chắn; còn lại "khong-ro".
- Ngày đăng ≠ ngày quay. Cảnh tiến độ cũ không dùng để nói hiện trạng.
- Phối cảnh 3D không dùng như cảnh thực tế.
- Quyền sử dụng: nguồn đã ghi, quyền chưa xác minh.
"""
open(OUT + '/README.md', 'w', encoding='utf-8').write(readme)
print(readme)
