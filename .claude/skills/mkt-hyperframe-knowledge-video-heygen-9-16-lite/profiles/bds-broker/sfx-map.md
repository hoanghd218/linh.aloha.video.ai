# Profile `bds-broker` — SFX map (thay `references/sfx-layer.md`)

Aesthetic broker-creator ăn SFX dày hơn profile knowledge, nhưng vẫn là **layer nhấn**, không phải nhạc nền. Mục tiêu: mỗi ranh giới avatar↔scene và mỗi peak nội dung có 1 hit, không hơn.

## Bộ file (copy vào `$OUT/assets/sfx/`, tên ASCII lowercase)

Nguồn chính — `.claude/skills/mkt-hyperframe-talking-head-video/assets/sfx/`:

| File nguồn | Tên sau khi copy | Dùng |
|---|---|---|
| `camera-flash.mp3` | `camera-flash.mp3` | Hook mở màn, brand reveal, giá bung ra (≤3 lần) |
| `Whoosh sound effect (1).mp3` | `whoosh.mp3` | Ranh giới avatar↔scene, chuyển pattern (4-8 lần) |
| `ting.mp3` | `ting.mp3` | Số đếm lên, mốc timeline, tick tiện ích (3-6 lần) |
| `Discord Notification - Sound Effect.mp3` | `chime.mp3` | CTA cuối video — **đúng 1 lần** |
| `búng tay.mp3` | `snap.mp3` | Punchline, câu chốt ngắn (≤2 lần) |
| `Laser.mp3` | `laser.mp3` | Stamp thương hiệu / con số đắt nhất — **≤1 lần** |

Tuỳ chọn thêm từ `workspace/assets/01_Sound Bất động sản/` (rename ASCII lowercase, bỏ space):
`Camera Shutter.WAV → camera-shutter.wav` (chốt ảnh trong `handover-strip`) · `Pop.WAV → pop.wav` (card số liệu bung ra) · `Film Burn.WAV → film-burn.wav` (cross-fade ảnh).

## Đặt ở đâu

| Thời điểm | SFX | Volume |
|---|---|---|
| t = 0 (hook mở màn) | `camera-flash` | 0.32 |
| Mọi ranh giới avatar → scene | `whoosh` | 0.28 |
| Mọi ranh giới scene → avatar | `whoosh` | 0.24 |
| Số tiền / stat scale-pop | `ting` (hoặc `laser` nếu là con số đắt nhất video) | 0.30 |
| Mỗi mốc `payment-timeline`, mỗi hàng `price-tier` | `ting` | 0.22 |
| Ảnh đổi trong `handover-strip` | `camera-shutter` | 0.20 |
| Câu chốt / punchline | `snap` | 0.30 |
| CTA cuối | `chime` | 0.34 |

## Luật

1. **Mọi ranh giới avatar↔scene phải có SFX** — đây là chỗ seam dễ lộ nhất; whoosh che chuyển cảnh.
2. Volume 0.20-0.34. Không bao giờ ≥ 0.40 — voiceover là spine.
3. Hai SFX cách nhau < 0.6s = chọn 1. Chồng tiếng nghe rẻ tiền.
4. `chime` và `laser` mỗi thứ tối đa 1 lần / video. Dùng 2 lần là mất tính "điểm nhấn".
5. Tổng số hit cho video 60-90s: **10-16**. Nhiều hơn thì đang làm ồn, không phải nhấn.
6. Tên file SFX phải ASCII lowercase không space — WAV gốc có space/uppercase sẽ 404 lúc render.
