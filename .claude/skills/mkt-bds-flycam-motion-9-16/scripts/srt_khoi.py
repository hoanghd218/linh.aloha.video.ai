#!/usr/bin/env python3
"""Tạo voice.srt THEO KHỐI (mỗi khối lời = một mục) cho gian_giong.py --srt, khi giọng không tự xuất SRT theo khối (ElevenLabs, chị Linh tự thu).

Cách A — một file giọng (ElevenLabs đọc cả bài, hoặc chị Linh tự thu) + mốc từng từ của Whisper:
  python3 srt_khoi.py --segments voice-goc_segments.json --loi-thoai nguon/loi-thoai.txt --out nguon/voice.srt
  (segments do skill mkt-ai-video-extract-srt-segment tạo: [{start,end,text,words:[{word,start,end}]}])
  Ranh giới khối = chỗ chữ cuối/đầu khối khớp lời gốc (bỏ dấu) + khoảng nghỉ dài, quanh vị trí dự kiến. In bảng để soát.

Cách B — mỗi khối một file (ElevenLabs đọc từng khối) → ghép, mốc chính xác:
  python3 srt_khoi.py --tep k01.mp3 k02.mp3 ... --loi-thoai nguon/loi-thoai.txt --out nguon/voice.srt --ghep voice-goc.wav
  Mốc mỗi khối = phần có tiếng trong file đó (bỏ lặng đầu/cuối bằng silencedetect).

loi-thoai.txt: các khối cách nhau bằng một dòng trống, đúng thứ tự đọc. Chữ trong SRT lấy từ loi-thoai (không lấy chữ Whisper).
"""
import argparse, json, os, re, subprocess, sys, tempfile, unicodedata, wave


def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


def write_srt(path, blocks):
    with open(path, 'w', encoding='utf-8') as f:
        for i, (a, b, t) in enumerate(blocks, 1):
            f.write(f'{i}\n{ts(a)} --> {ts(b)}\n{t}\n\n')


def norm(w):
    return re.sub(r'[^\wÀ-ỹ]+', '', w.lower())


def bare(w):
    """Bỏ dấu (Whisper hay sai dấu tiếng Việt: 'tháp xanh' → 'thát sang') để so khớp chữ."""
    w = norm(w).replace('đ', 'd')
    return ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn')


def khop(a, b):
    """Số cặp chữ trùng theo vị trí (đã bỏ dấu)."""
    return sum(1 for x, y in zip(a, b) if x and x == y)


ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('--loi-thoai', required=True); ap.add_argument('--out', required=True)
ap.add_argument('--segments'); ap.add_argument('--tep', nargs='+'); ap.add_argument('--ghep')
A = ap.parse_args()
texts = [' '.join(x.split()) for x in re.split(r'\n\s*\n', open(A.loi_thoai, encoding='utf-8').read().strip()) if x.strip()]
if not texts:
    sys.exit('LỖI: loi-thoai.txt trống')
out = []

if A.segments:
    segs = json.load(open(A.segments, encoding='utf-8'))
    words = [w for s in segs for w in (s.get('words') or []) if norm(w.get('word', ''))]
    if not words:
        sys.exit('LỖI: segments không có mốc từng từ (words) — chạy lại mkt-ai-video-extract-srt-segment')
    W = len(words); n = [len(t.split()) for t in texts]; T = sum(n)
    if abs(W - T) > 0.15 * T:
        print(f'CẢNH BÁO: Whisper ra {W} từ, lời có {T} chữ (lệch {abs(W - T) / T:.0%}) — ranh giới có thể sai, soát kỹ bảng dưới', file=sys.stderr)
    wb = [bare(w['word']) for w in words]
    tb = [[bare(x) for x in t.split()] for t in texts]
    bounds, prev, cum = [], -1, 0  # bounds[k] = chỉ số từ cuối của khối k
    for k in range(len(texts) - 1):
        cum += n[k]
        exp = round(cum * W / T) - 1
        win = max(4, round(0.4 * min(n[k], n[k + 1]) * W / T))
        best, score = None, None
        for i in range(max(prev + 1, exp - win), min(W - 2, exp + win) + 1):
            gap = words[i + 1]['start'] - words[i]['end']
            # chữ cuối khối k và chữ đầu khối k+1 khớp lời gốc → ranh giới đúng chỗ (trọng số lớn hơn khoảng nghỉ)
            m = khop(wb[max(0, i - 2):i + 1][::-1], tb[k][-3:][::-1]) + khop(wb[i + 1:i + 4], tb[k + 1][:3])
            sc = gap + 0.5 * m - 0.01 * abs(i - exp)
            if score is None or sc > score:
                best, score = i, sc
        if best is None:
            sys.exit(f'LỖI: không tìm được ranh giới sau khối {k + 1} — lời và giọng không khớp?')
        bounds.append(best); prev = best
    bounds.append(W - 1)
    print('khối  bắt đầu  kết thúc  nghỉ sau   Whisper cuối khối → đầu khối sau')
    st = 0
    for k, e in enumerate(bounds):
        a, b = words[st]['start'], words[e]['end']
        gap = words[e + 1]['start'] - b if e + 1 < W else 0.0
        tail = ' '.join(w['word'].strip() for w in words[max(st, e - 2):e + 1])
        head = ' '.join(w['word'].strip() for w in words[e + 1:e + 4])
        flag = '  ⚠ nghỉ ngắn, nghe lại' if e + 1 < W and gap < 0.15 else ''
        print(f'{k + 1:>4}  {a:7.2f}  {b:8.2f}  {gap:8.2f}   …{tail} → {head}…{flag}')
        out.append((a, b, texts[k])); st = e + 1

elif A.tep:
    if len(A.tep) != len(texts):
        sys.exit(f'LỖI: {len(A.tep)} file nhưng loi-thoai có {len(texts)} khối')
    tmp = tempfile.mkdtemp(); wavs, off = [], 0.0
    for k, f in enumerate(A.tep):
        w = os.path.join(tmp, f'{k:03d}.wav')
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-i', f, '-ar', '48000', '-ac', '1', w], check=True)
        with wave.open(w) as h:
            d = h.getnframes() / h.getframerate()
        log = subprocess.run(['ffmpeg', '-nostdin', '-i', w, '-af', 'silencedetect=noise=-40dB:d=0.08', '-f', 'null', '-'],
                             capture_output=True, text=True).stderr
        st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
        en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
        a = en[0] if st and st[0] <= 0.02 and en else 0.0
        b = st[-1] if st and (len(en) < len(st) or en[-1] >= d - 0.02) and st[-1] > a else d
        out.append((off + a, off + b, texts[k])); wavs.append(w)
        print(f'{k + 1:>4}  {off + a:7.2f}  {off + b:8.2f}  ({os.path.basename(f)}, {d:.2f}s)')
        off += d
    if A.ghep:
        lst = os.path.join(tmp, 'ds.txt')
        open(lst, 'w').write(''.join(f"file '{w}'\n" for w in wavs))
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', A.ghep], check=True)
        print('ghép:', A.ghep, f'{off:.2f}s')
    else:
        print('CẢNH BÁO: chưa --ghep — mốc SRT tính theo thứ tự các file; nhớ ghép đúng thứ tự đó', file=sys.stderr)
else:
    sys.exit('Cần --segments (cách A) hoặc --tep (cách B)')

write_srt(A.out, out)
print(f'ok {A.out}: {len(out)} khối → chạy gian_giong.py <giọng> assets/audio/voice.wav nguon/moc.json --srt {A.out}')
