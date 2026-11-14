# Nhạc nền tự tổng hợp (không API, không bản quyền): piano rải + pad dây + bass + nhịp nhẹ, vang bằng IR tự sinh.
# Chạy: uv run -q --with numpy python3 nhac.py <out.wav> <thời lượng s> [--cta 52.2] [--kick-from 6.5] [--strong 39.5] [--swell 49.0] [--lift 5:17] [--seed 7]
# Mặc định (khi chỉ có --cta): kick mạnh từ cta-12.7, dây vút ở cta-3.2, lên quãng tám từ ô nhịp 5 tới ô nhịp trước đoạn mạnh.
# Lưới 100 BPM: 1 ô nhịp = 2,4 s, nhịp = 0,6 s — đặt mốc cắt cảnh (scenes[].at) trên lưới này.
import sys, wave, argparse, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('dur', type=float)
ap.add_argument('--cta', type=float); ap.add_argument('--kick-from', type=float, default=6.5)
ap.add_argument('--strong', type=float); ap.add_argument('--swell', type=float)
ap.add_argument('--lift'); ap.add_argument('--seed', type=int, default=7)
A = ap.parse_args(); out, DUR = A.out, A.dur
CTA = A.cta if A.cta is not None else DUR - 3.0
STRONG = A.strong if A.strong is not None else max(A.kick_from, CTA - 12.7)
SWELL = A.swell if A.swell is not None else max(0.0, CTA - 3.2)
LIFT = tuple(int(x) for x in A.lift.split(':')) if A.lift else (5, max(5, int(STRONG / 2.4) + 1))
SR = 48000; N = int(SR * DUR)
rng = np.random.default_rng(A.seed)
L = np.zeros(N); R = np.zeros(N)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
BAR = 2.4                         # 100 BPM, 4/4 (nhịp 0,6 s — cắt cảnh khớp lưới này)
# D maj7 · B m7 · G maj7 · A sus2 → lặp; cuối: G maj7 → D maj9
PROG = [(50, [62, 66, 69, 73]), (47, [62, 66, 69, 71]), (43, [62, 66, 67, 71]), (45, [61, 64, 69, 71])]
def add(sig, t0, pan=0.0, g=1.0):
    i0 = max(0, int(t0 * SR)); i1 = min(N, i0 + len(sig))
    if i1 <= i0: return
    s = sig[: i1 - i0] * g
    L[i0:i1] += s * np.sqrt(0.5 * (1 - pan)); R[i0:i1] += s * np.sqrt(0.5 * (1 + pan))
def piano(m, vel, dur=2.4):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    s = np.zeros(n)
    for k, a in enumerate([1, .55, .32, .18, .1, .06, .03], 1):
        fk = f * k * (1 + 0.0004 * k * k)
        s += a * np.sin(2 * np.pi * fk * t) * np.exp(-t * (1.1 + 0.9 * k) * (f / 400) ** 0.3)
    att = np.minimum(1, t / 0.004)
    return s * att * vel * 0.16
def pad(ms, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for m in ms:
        for d in (-0.07, 0.0, 0.06):
            f = hz(m) * 2 ** (d / 12)
            s += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) + 0.25 * np.sin(4 * np.pi * f * t)
    env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.0)
    return s * env * 0.012
def bass(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)
    return s * np.minimum(1, t / 0.03) * np.exp(-t * 0.6) * 0.11
def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.22
def shaker():
    n = int(0.08 * SR); t = np.arange(n) / SR
    s = rng.normal(0, 1, n); s = np.diff(np.concatenate([[0], s]))
    return s * np.exp(-t * 60) * 0.018
bars = int(np.ceil(DUR / BAR))
for b in range(bars):
    t0 = b * BAR
    root, ch = PROG[b % 4]
    if t0 > DUR - 4.5: root, ch = 50, [62, 66, 69, 73, 76]       # hợp âm kết
    add(pad(ch, BAR + 1.0), t0, rng.uniform(-.3, .3))
    add(bass(root, BAR), t0, 0, 1.0 if b > 0 else 0.6)
    # rải piano: 8 nốt móc đơn, lên 1 quãng tám ở đoạn giữa
    up = 12 if LIFT[0] <= b < LIFT[1] else 0
    seq = [ch[0], ch[1], ch[2], ch[3], ch[2] + 12, ch[3], ch[2], ch[1]]
    for k, m in enumerate(seq):
        tt = t0 + k * BAR / 8 + rng.normal(0, 0.006)
        if tt > DUR - 1.2: break
        vel = (0.85 if k == 0 else 0.55) * rng.uniform(0.85, 1.05)
        add(piano(m + up, vel), tt, -0.35 + 0.1 * k)
    if b % 2 == 0: add(piano(ch[-1] + 24, 0.35, 3.0), t0 + BAR * 0.5, 0.4)   # nốt cao lấp lánh
    # nhịp nhẹ từ --kick-from, mạnh hơn từ --strong (dẫn vào kêu gọi)
    if A.kick_from <= t0 < DUR - 3:
        for q in range(4):
            add(kick(), t0 + q * BAR / 4, 0, 0.7 if t0 < STRONG else 1.0)
            add(shaker(), t0 + q * BAR / 4 + BAR / 8, 0.3)
# dây vút lên trước CTA
n = int(3.2 * SR); t = np.arange(n) / SR
sw = sum(np.sin(2 * np.pi * hz(m) * t) for m in (62, 69, 74, 78)) * (t / 3.2) ** 2 * 0.03
add(sw, SWELL)
# vang: IR nhiễu suy giảm 2,2 s, khác nhau hai kênh
irn = int(2.2 * SR); ti = np.arange(irn) / SR
def ir(): h = rng.normal(0, 1, irn) * np.exp(-ti * 3.2); h[: int(0.012 * SR)] *= 0; return h / np.sqrt(np.sum(h ** 2))
def conv(x, h):
    m = len(x) + len(h); F = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(h, F), F)[: len(x)]
L2 = 0.72 * L + 0.42 * conv(L, ir()); R2 = 0.72 * R + 0.42 * conv(R, ir())
fade = np.ones(N); fo = int(min(1.6, DUR / 4) * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
fi = int(0.05 * SR); fade[:fi] *= np.linspace(0, 1, fi)
L2 *= fade; R2 *= fade
pk = max(np.abs(L2).max(), np.abs(R2).max()); L2 /= pk / 0.89; R2 /= pk / 0.89
pcm = (np.stack([L2, R2], 1) * 32767).astype('<i2')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', out, DUR)
