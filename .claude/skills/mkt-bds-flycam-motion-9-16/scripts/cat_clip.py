#!/usr/bin/env python3
"""Cắt clip 9:16 từ kho cảnh theo <dự án>/video.json và làm tờ soát biển hiệu/logo.

Chạy:  python3 cat_clip.py <thư mục dự án> [--chi-soat]
- Tra mã clip (vd OP099) trong <kho>/chi-muc.csv (cột id, file, thuc_te_hay_phoi_canh, chu_logo...).
- Thời lượng mỗi clip tính giống build.mjs (PRE 0.25, POST 0.12, max).
- Crop 9:16 lia từ tâm c0 → c1 (tỉ lệ ngang 0..1), scale 1080x1920, chỉnh màu nhẹ, 30 fps, không tiếng.
- Ghi assets/video/cNN.mp4; tờ soát kiem/bien-hieu-N.jpg (khung gốc có khung vàng = vùng crop + 3 khung crop đầu/giữa/cuối)
  và kiem/bien-hieu.md (bảng để điền quyết định từng biển hiệu).
- --chi-soat: không cắt lại, chỉ làm tờ soát.
"""
import csv, glob, json, os, subprocess, sys, tempfile

PRE, POST = 0.25, 0.12


def resolve_kho(k):
    """Cho phép `~` và `*` (vd ~/Library/CloudStorage/GoogleDrive-*/My Drive/Chị Linh/Kho cảnh …) để không ghi tài khoản Drive vào repo."""
    k = os.path.expanduser(k)
    hits = sorted(glob.glob(k)) if any(ch in k for ch in '*?[') else [k]
    if not hits or not os.path.isfile(os.path.join(hits[0], 'chi-muc.csv')):
        sys.exit(f'LỖI: không thấy kho cảnh có chi-muc.csv ở "{k}" — sửa khoá "kho" trong video.json')
    if len(hits) > 1:
        print(f'CẢNH BÁO: "kho" khớp {len(hits)} thư mục, dùng {hits[0]}', file=sys.stderr)
    return hits[0]


def ffprobe_dur(p):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                         capture_output=True, text=True).stdout.strip()
    return float(out or 0)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    root = os.path.abspath(sys.argv[1])
    only_check = '--chi-soat' in sys.argv
    cfg = json.load(open(os.path.join(root, 'video.json'), encoding='utf-8'))
    kho = resolve_kho(cfg['kho'])
    idx = {r['id']: r for r in csv.DictReader(open(os.path.join(kho, 'chi-muc.csv'), encoding='utf-8-sig'))}
    dur = cfg.get('duration') or ffprobe_dur(os.path.join(root, cfg.get('voice', 'assets/audio/voice.wav')))
    sc = cfg['scenes']
    os.makedirs(os.path.join(root, 'assets/video'), exist_ok=True)
    os.makedirs(os.path.join(root, 'kiem'), exist_ok=True)
    warns, rows, md = [], [], []
    md.append('# Soát biển hiệu / logo bên thứ ba\n')
    md.append('Xem `kiem/bien-hieu-*.jpg`: cột 1 là khung gốc giữa đoạn (khung vàng = vùng giữ lại), 3 cột sau là khung 9:16 đầu · giữa · cuối.\n')
    md.append('Quyết định cho mỗi biển hiệu đọc được: **doi-tam** (đổi c0/c1) · **doi-doan** (đổi ss) · **che-nhan** (đặt nhãn/thẻ đè lên) · **chap-nhan** (ghi lý do, báo trong bàn giao).\n')
    md.append('| Cảnh | Mã | Chỉ mục: chữ/logo | Thực tế/phối cảnh | Thấy gì trên tờ soát | Quyết định |')
    md.append('|---|---|---|---|---|---|')
    tmp = tempfile.mkdtemp(prefix='soat-')
    for k, s in enumerate(sc):
        r = idx.get(s['src'])
        if not r:
            sys.exit(f'LỖI: không có mã {s["src"]} trong chi-muc.csv')
        src = os.path.join(kho, r['file'])
        if not os.path.exists(src):
            sys.exit(f'LỖI: thiếu tệp {src}')
        st = 0 if k == 0 else s['at'] - PRE
        end = dur if k == len(sc) - 1 else sc[k + 1]['at'] + POST
        if s.get('max'):
            end = min(end, st + s['max'])
        du = round(end - st + 0.05, 3)
        ss, c0, c1 = float(s.get('ss', 0)), float(s.get('c0', 0.5)), float(s.get('c1', 0.5))
        sdur = ffprobe_dur(src)
        if ss + du > sdur + 0.01:
            warns.append(f'cảnh {k} ({s["src"]}): cần {ss}+{du:.2f}s nhưng nguồn chỉ {sdur:.2f}s → clip bị hụt, giảm ss hoặc thêm "max"')
        loai = r.get('thuc_te_hay_phoi_canh', '')
        if loai and loai != 'thuc-te':
            warns.append(f'cảnh {k} ({s["src"]}): {loai} → phải có nhãn "PHỐI CẢNH MINH HỌA" khi hiện (thêm vào tags/credits)')
        logo = r.get('chu_logo', '')
        if logo and logo != 'khong':
            warns.append(f'cảnh {k} ({s["src"]}): chỉ mục ghi chữ/logo "{logo}" → soát kỹ tờ biển hiệu')
        out = os.path.join(root, f'assets/video/c{k:02d}.mp4')
        if not only_check:
            vf = (f"crop=w=ih*9/16:h=ih:x='max(0,min(iw-ow,iw*({c0}+({c1}-{c0})*t/{du})-ow/2))':y=0,"
                  "scale=1080:1920:flags=lanczos,eq=contrast=1.07:saturation=1.16:gamma=0.98,fps=30")
            if s.get('blur'):
                vf += ',boxblur=24:2,eq=brightness=-0.12'
            subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-ss', str(ss), '-t', str(du), '-i', src,
                            '-vf', vf, '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-g', '15',
                            '-pix_fmt', 'yuv420p', '-an', out], check=True)
            got = ffprobe_dur(out)
            if got < du - 0.15:
                warns.append(f'cảnh {k}: c{k:02d}.mp4 dài {got:.2f}s < cần {du:.2f}s')
        # tờ soát: nguồn thu nhỏ 640x360, vùng crop rộng 202
        row = os.path.join(tmp, f'r{k:02d}.png')
        times = [ss + 0.05, ss + du / 2, ss + max(du - 0.15, 0.1)]
        cs = [c0 + (c1 - c0) * (t - ss) / du for t in times]
        xs = [int(max(0, min(438, 640 * c - 101))) for c in cs]
        args = ['ffmpeg', '-nostdin', '-y', '-loglevel', 'error']
        for t in [times[1]] + times:
            args += ['-ss', f'{t:.2f}', '-i', src]
        fc = (f'[0:v]scale=640:360,drawbox=x={xs[1]}:y=0:w=202:h=360:color=yellow@0.95:t=4,'
              f'pad=652:372:6:6:color=0x0A0E1F[a];'
              + ''.join(f'[{i + 1}:v]scale=640:360,crop=202:360:{xs[i]}:0,pad=214:372:6:6:color=0x0A0E1F[v{i}];' for i in range(3))
              + '[a][v0][v1][v2]hstack=4')
        args += ['-filter_complex', fc, '-frames:v', '1', row]
        subprocess.run(args, check=True)
        rows.append(row)
        md.append(f'| {k} (t={s["at"]}s) | {s["src"]} | {logo or "?"} | {loai or "?"} |  |  |')
    # ghép trang 5 dòng
    for p in range(0, len(rows), 5):
        chunk = rows[p:p + 5]
        dst = os.path.join(root, f'kiem/bien-hieu-{p // 5 + 1}.jpg')
        a = ['ffmpeg', '-nostdin', '-y', '-loglevel', 'error']
        for c in chunk:
            a += ['-i', c]
        fc = ''.join(f'[{i}:v]' for i in range(len(chunk))) + (f'vstack={len(chunk)}' if len(chunk) > 1 else 'null')
        subprocess.run(a + ['-filter_complex', fc, '-q:v', '3', dst], check=True)
        print('soát:', dst)
    mdp = os.path.join(root, 'kiem/bien-hieu.md')
    if os.path.exists(mdp):  # không ghi đè quyết định đã điền
        mdp = os.path.join(root, 'kiem/bien-hieu.moi.md')
    open(mdp, 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print('bảng soát:', mdp)
    for w in warns:
        print('CẢNH BÁO:', w, file=sys.stderr)
    print(f'ok {len(sc)} clip · thời lượng video {dur:.2f}s · {len(warns)} cảnh báo')


if __name__ == '__main__':
    main()
