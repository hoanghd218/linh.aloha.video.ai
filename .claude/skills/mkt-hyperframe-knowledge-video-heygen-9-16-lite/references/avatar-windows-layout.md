# Avatar Windows Layout — 9:16 LITE (1080×1920)

## Purpose
Geometry, DOM, GSAP timeline và timing rules cho cơ chế AVATAR WINDOWS: HeyGen avatar full-screen chỉ trong các window (hook / re-hook / CTA, 30–40% thời lượng), ngoài window là scene motion-graphic FULL-CANVAS + PIP tĩnh. KHÔNG còn FULL↔SPLIT, không divider, không height tween.

## When to Load
Khi wire master index.html (Step 7-8.5) hoặc khi debug layout/boundary/PIP.

---

## Nguyên tắc cốt lõi

1. **Audio spine = `audio/full.mp3`** (ElevenLabs/MiniMax gốc), KHÔNG phải video HeyGen. Mọi `data-duration` root/captions/overlay tính từ **ffprobe full.mp3**.
2. **Avatar chỉ tồn tại dạng clip mount** — mỗi window 1 `<video class="clip avatar-clip">` với `data-start = window.start`, `data-duration = ffprobe của clip đó`. Clip hết → framework tự ẩn → scene phía trên (z20 > z10) là thứ duy nhất trên màn hình.
3. **Lip-sync khớp tự động** vì clip được cắt sample-exact từ chính đoạn audio đó (xem `concatMap` trong `avatar-windows.json`). KHÔNG offset gì thêm — mount clip đúng `window.start` là xong.
4. **Scene = full-canvas 1080×1920**, che kín avatar stage khi active. Scene không cần biết avatar tồn tại.

## Geometry

| Element | Spec |
|---|---|
| `#avatar-stage` | inset 0 cố định (full 1080×1920), z10 — KHÔNG tween height/top |
| `.avatar-clip` | object-fit cover, object-position `center 25%` (chỉnh 20–30% theo avatar) |
| `.scene-mount` | 1080×1920 full-canvas, z20, opacity fade-in |
| `.broll-clip` | 1080×1920 full-canvas, z25 (trên scene, dưới PIP/captions), muted |
| `#pip-still` | tròn 180px, `top:80px; right:48px`, viền 3px #d97757, z35 |
| captions `.caption-stage` | `bottom:160px` CỐ ĐỊNH (không còn đổi theo mode) |
| `#scene-flash` / `#scene-wipe` | full-canvas 1920px cao (scene là full-screen) |

## DOM tree (master)

```
#root (1080×1920, data-duration = ffprobe full.mp3)
├── #scene-bg                      z5   (đen lót)
├── <audio #a-source>              track 1  — audio/full.mp3 (SPINE)
├── SFX <audio> clips              track 70+
├── #avatar-stage                  z10  (cố định full)
│   └── .avatar-breathing [data-layout-allow-overflow]
│       └── .avatar-punch [data-layout-allow-overflow]
│           ├── <video #av1>       track 10 — clip-01, data-start=w1.start
│           ├── <video #av2>       track 11 — clip-02, data-start=w2.start
│           └── <video #avK>       track 1K — ...
├── .scene-mount #m1..#mN          z20, track 40+ — full-canvas
├── <video .broll-clip> #br1..     z25, track 45+ — filler 3-6s (optional)
├── #broll-shade                   z26  (gradient tối đáy, GSAP toggle)
├── #pip-still                     z35  (KHÔNG phải clip — GSAP toggle theo segment)
├── #scene-wipe / #scene-flash     z50/51, track 55/56
├── #brand-mark                    z45, track 2
└── captions-mount                 z100, track 60 — LUÔN mount CUỐI
```

## Timing convention tại ranh giới (QUAN TRỌNG NHẤT)

```
          w1.end                      w2.start
t: ──────────┃━━━━━ SCENE SEGMENT ━━━━━┃──────────
avatar clip: ┤                          ├─ clip 2 bắt đầu ĐÚNG w2.start
scene mount: ├— start = w1.end − 0.25 ——┤  mount cuối segment KẾT THÚC đúng w2.start
flash:          ▮ (w1.end − 0.10)    ▮ (w2.start − 0.05)
PIP:              ↗ hiện (w1.end+0.4)  ↘ ẩn (w2.start−0.35)
SFX:            whoosh/snap tại mỗi ranh giới
```

- **Mount đầu segment** `data-start = prevWindow.end − 0.25` (overlap 0.25s đè lên đuôi avatar → không hở frame).
- **Mount cuối segment** kết thúc **đúng `nextWindow.start`** (avatar clip kế đã sẵn frame ở z10 phía dưới — mount ẩn là avatar hiện ngay).
- Nhiều beat trong 1 segment → mounts nối đuôi nhau (mount sau start = mount trước end), chỉ mount đầu có overlap.
- **Flash 0.09s + SFX tại MỌI ranh giới** avatar↔scene — vừa che seam vừa tạo nhịp.
- Window cuối (CTA) end = TOTAL → không có segment sau, không flash cuối.

## Editorial cheat sheet

| Moment | Nội dung |
|---|---|
| Hook 0 → ~6-8s | **AVATAR full face** — 3s đầu BẮT BUỘC không gì đè mặt |
| Thân beat (data/mockup heavy) | **SCENE full-canvas** + PIP tĩnh + captions |
| Giữa video (~40-60%) | **AVATAR re-hook** 4-5s — câu chuyển mạnh nhất, nói thẳng camera |
| Giữa beat dài | (optional) **B-ROLL** 3-6s đổi nhịp thị giác |
| CTA cuối ~7-8s | **AVATAR full face** kêu gọi trực tiếp |

Video ≤60s: 1 re-hook. Video >75s: 2 re-hook. Ratio tổng luôn 0.30–0.42 (script `cut_avatar_audio.py` enforce).

## Master GSAP timeline (verbatim — copy từ template)

```js
const WINDOWS = [ { start: 0, end: 7.2, clip: '#av1' }, /* ... */ ];

// Punch-in mỗi lần avatar quay lại + ken-burns push trong window
WINDOWS.forEach((w, i) => {
  if (i > 0) tl.fromTo('.avatar-punch', { scale: 1.08 }, { scale: 1.0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' }, w.start + 0.05);
  const push = Math.min(3.6, (w.end - w.start) - 0.4);
  tl.fromTo(w.clip, { scale: 1.0 }, { scale: 1.06, duration: push, ease: 'sine.inOut', transformOrigin: 'center 30%', overwrite: 'auto' }, w.start + 0.1);
});

// Flash tại mọi ranh giới
WINDOWS.forEach((w, i) => {
  if (w.end < TOTAL - 0.5) boundaryFlash(w.end - 0.10);
  if (i > 0) boundaryFlash(w.start - 0.05);
});

// PIP: hiện trong segment, ẩn trong window (kèm hard-kill set)
WINDOWS.forEach((w, i) => {
  const segStart = w.end, segEnd = WINDOWS[i+1] ? WINDOWS[i+1].start : TOTAL;
  if (segEnd - segStart < 2) return;
  tl.to('#pip-still', { opacity: 1, scale: 1.0, duration: 0.5, ease: 'back.out(1.6)', overwrite: 'auto' }, segStart + 0.4);
  tl.to('#pip-still', { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power2.in', overwrite: 'auto' }, segEnd - 0.35);
  tl.set('#pip-still', { opacity: 0 }, segEnd);
});
```

Ken-burns per-window tween trên **chính clip element** (`w.clip`), không phải selector chung — mỗi clip là 1 video riêng.

## PIP tĩnh spec

- Nguồn: `assets/pip-still.png` — frame trích từ `avatar-clips/clip-01.mp4` bởi `split_avatar_video.sh` (mặc định t=1.0s). **QA bắt buộc:** Read ảnh — mắt mở, miệng đóng/gần đóng; xấu thì re-extract `ffmpeg -ss <t khác> -i clip-01.mp4 -frames:v 1 ...`.
- KHÔNG phải clip (ảnh tĩnh luôn trong DOM) — GSAP toggle opacity theo segment.
- Breathing riêng: scale 1.04 yoyo 3.5s, repeat hữu hạn từ TOTAL.
- Scene sub-agents phải chừa hộp `x>780 && y<320` (đã ghi trong scene reference).

## Pitfalls riêng của lite

- **TOTAL từ full.mp3, KHÔNG từ video HeyGen** — HeyGen giờ chỉ dài ~35% video.
- **Mount avatar clip theo `window.start` trong avatar-windows.json**, còn `data-duration` theo **ffprobe từng clip** (HeyGen có thể padding vài chục ms; clip dài hơn window một chút vô hại vì scene mount đè lên với overlap 0.25s).
- **Đừng tween `.avatar-punch` scale trong lúc KHÔNG có clip nào active** — vô hại về hình (bị scene che) nhưng thừa; giữ punch-in đúng `w.start`.
- **PIP là ảnh trong DOM thường** — nhớ `tl.set(opacity:0)` hard-kill sau mỗi lần ẩn, và set opacity 0 tại t=0.
- **Loop hữu hạn**: mọi repeat (breathing avatar, breathing PIP, bokeh scene) tính từ TOTAL/DURATION — loop dư kéo dài MP4 render (bug kinh điển 60s → 88s).
- **3 giây đầu luôn full face** — window hook bắt đầu tại 0, mount scene đầu tiên không được start < 4.0s.
- **B-roll orientation ngang**: object-fit cover tự crop; nếu chủ thể lệch khung quá thì hạ cấp asset thành ảnh tĩnh (frame đẹp nhất + ken-burns trong scene).
