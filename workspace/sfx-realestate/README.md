# SFX Library — DEPRECATED 2026-05-16

> ⚠️ **Folder này không còn được pipeline `/mkt-full-video-with-11-hyperframe-heygen` sử dụng nữa.**

## Why

Thiết kế BĐS đã đổi từ **Luxury Editorial** (Cormorant Garamond + champagne gold + 5 SFX tinh tế) sang **Broker-Creator Punchy** (avatar full-frame + text overlay punch + 4 SFX tech) — phong cách viral broker TikTok VN 2025-2026.

`aesthetic=broker_creator` (default mới) dùng 4 SFX có sẵn ở:

```
.claude/skills/mkt-hyperframe-talking-head-video/assets/sfx/
├── camera-flash.mp3                       # hook + price reveal (2× max)
├── Whoosh sound effect (1).mp3            # transition / list reveal (4-6×)
├── ting.mp3                               # number ping (3-5×)
└── Discord Notification - Sound Effect.mp3  # CTA chime cuối video (1× only)
```

Phase 3 packager copy 4 file này vào `<workspace>/sfx/` tự động. Không cần user provide SFX riêng.

## Có thể xóa folder này?

Có. Folder này được tạo cho thiết kế Luxury Editorial cũ. Nếu bạn chắc chắn không quay lại luxury aesthetic, có thể `rm -rf workspace/sfx-realestate/`.

Nếu muốn giữ lại làm reference cho future luxury project (vd: branded residence cao cấp hơn 200tr/m² cần aesthetic editorial), giữ folder + README này.

## Lịch sử (cũ — luxury editorial spec)

Trước đây folder này được hướng dẫn tải 5 file SFX:

| Filename | Đặc tả |
|---|---|
| `transition.mp3` | Soft paper-fold / silk swoosh, 0.3-0.5s |
| `impact.mp3` | Marble knock / deep wood thump, 0.4s |
| `riser.mp3` | Cinematic orchestral swell 2-3s |
| `signature.mp3` | Champagne ting / wind chime 1-1.5s |
| `bgm.mp3` | Felt piano + soft strings loop 60-90s |

Spec này không còn được pipeline mới đọc tới. Để giữ lại làm asset, tải file về vẫn được — chỉ là pipeline sẽ không tự copy chúng nữa.
