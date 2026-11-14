#!/usr/bin/env python3
"""Chèn khoảng nghỉ giữa các khối giọng để flycam "thở" theo nhạc; ghi giọng đã giãn + moc.json.

Chạy:
  python3 gian_giong.py <giọng gốc .wav/.mp3> <out.wav> <moc.json> --srt voice.srt [--extra "1:0.5,2:1.0,16:3.5"] [--lead 0.25]
  python3 gian_giong.py <giọng> <out.wav> <moc.json> --loi-thoai loi-thoai.txt   (không có SRT: dò khoảng lặng)
- SRT: mỗi khối phụ đề = một khối giọng (SRT theo khối do srt_khoi.py tạo từ Whisper hoặc từ file từng khối).
- --loi-thoai: các khối cách nhau bằng dòng trống; lấy N-1 khoảng lặng dài nhất (ffmpeg silencedetect) làm ranh giới.
- --extra: giây nghỉ thêm SAU khối i (đánh số từ 1). --lead: giây lặng đầu video.
moc.json: [{"i","start","end","text"}] — giây trên giọng đã giãn; build.mjs dùng để đặt phụ đề.
"""
import argparse, json, os, re, subprocess, tempfile, wave

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out'); ap.add_argument('moc')
ap.add_argument('--srt'); ap.add_argument('--loi-thoai')
ap.add_argument('--extra', default=''); ap.add_argument('--lead', type=float, default=0.25)
A = ap.parse_args()
EXTRA = {int(k): float(v) for k, v in (x.split(':') for x in A.extra.split(',') if x.strip())}

src = A.src
if not src.lower().endswith('.wav'):
    tmp = os.path.join(tempfile.mkdtemp(), 'v.wav')
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', src, '-ar', '48000', '-ac', '1', tmp], check=True)
    src = tmp
w = wave.open(src); sr = w.getframerate(); sw = w.getsampwidth(); ch = w.getnchannels(); data = w.readframes(w.getnframes()); w.close()
fb = sw * ch; n = len(data) // fb; total = n / sr


def ts(s):
    h, m, x = s.strip().split(':'); return int(h) * 3600 + int(m) * 60 + float(x.replace(',', '.'))


blocks = []
if A.srt:
    for b in re.split(r'\n\s*\n', open(A.srt, encoding='utf-8-sig').read().strip()):
        L = b.strip().split('\n')
        a, c = L[1].split(' --> ')
        blocks.append((ts(a), ts(c), ' '.join(L[2:]).strip()))
elif A.loi_thoai:
    texts = [' '.join(x.split()) for x in re.split(r'\n\s*\n', open(A.loi_thoai, encoding='utf-8').read().strip()) if x.strip()]
    log = subprocess.run(['ffmpeg', '-nostdin', '-i', src, '-af', 'silencedetect=noise=-38dB:d=0.18', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    sil = [(a, b) for a, b in zip(st, en) if a > 0.05 and b < total - 0.05]
    if len(sil) < len(texts) - 1:
        raise SystemExit(f'LỖI: chỉ dò được {len(sil)} khoảng lặng cho {len(texts)} khối — dùng --srt')
    gaps = sorted(sorted(sil, key=lambda x: x[1] - x[0], reverse=True)[:len(texts) - 1])
    head = re.search(r'silence_end: ([\d.]+)', log) if st and st[0] <= 0.05 else None
    t0 = float(head.group(1)) if head else 0.0
    bounds = [t0] + [x for g in gaps for x in g] + [total]
    for i, t in enumerate(texts):
        blocks.append((bounds[2 * i], bounds[2 * i + 1], t))
    print('CẢNH BÁO: mốc khối dò bằng khoảng lặng — nghe lại moc.json trước khi dựng')
else:
    raise SystemExit('Cần --srt hoặc --loi-thoai')

cuts = [0.0] + [(blocks[i][1] + blocks[i + 1][0]) / 2 for i in range(len(blocks) - 1)] + [total]
outb = bytearray(b'\x00' * int(A.lead * sr) * fb); moc = []
for i, (a, c, t) in enumerate(blocks, 1):
    s0, s1 = int(cuts[i - 1] * sr), int(cuts[i] * sr)
    base = len(outb) / fb / sr - cuts[i - 1]
    moc.append({'i': i, 'start': round(a + base, 3), 'end': round(c + base, 3), 'text': t})
    outb += data[s0 * fb:s1 * fb]
    outb += b'\x00' * int(EXTRA.get(i, 0) * sr) * fb
o = wave.open(A.out, 'wb'); o.setnchannels(ch); o.setsampwidth(sw); o.setframerate(sr); o.writeframes(bytes(outb)); o.close()
json.dump(moc, open(A.moc, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('tổng', round(len(outb) / fb / sr, 2), 's ·', len(moc), 'khối')
for m in moc:
    print(m['i'], m['start'], m['end'], m['text'][:50])
