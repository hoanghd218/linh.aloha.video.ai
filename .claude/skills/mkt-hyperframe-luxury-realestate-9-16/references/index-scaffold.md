# index.html gốc — avatar full-frame + overlay + b-roll + captions

Đọc khi: nối (wire) `index.html` của project. Không có `goSplit()` / `goFull()`, không `.split-mount`, không `#split-divider` — avatar là phông nền không đổi.

## Layer stack

```
z-index 100    — Captions (Be Vietnam Pro 600, dưới giữa, pill bo tròn)
z-index 80-90  — Chữ overlay punch (scale-pop 0.4s, giữ 1-3s, fade-out 0.3s)
z-index 70     — B-roll full-screen (tuỳ chọn, 2-5s mỗi cái)
z-index 30     — Header pill / brand mark (tuỳ chọn, góc trên)
z-index 1      — #v-source avatar HeyGen (object-fit: cover, full 1080×1920)
```

## Mẫu index.html

```html
<div data-composition-id="root" data-start="0" data-width="1080" data-height="1920">
  <video id="v-source" data-start="0" data-duration="60.0" data-track-index="0"
         src="source.mp4" muted playsinline></video>
  <audio id="a-source" data-start="0" data-duration="60.0" data-track-index="1" data-volume="1"
         src="source.mp4"></audio>

  <!-- SFX (camera-flash, búng tay, ting, whoosh, laser, discord ...) -->
  <audio id="sfx-01" data-start="0.11" data-duration="0.6" data-track-index="20" data-volume="0.35" src="sfx/camera-flash.mp3"></audio>
  <!-- ... -->

  <!-- Header pill (tuỳ chọn) -->
  <div id="header-pill" class="clip header-pill"
       data-start="0" data-duration="60.0" data-track-index="3">
    <div class="dot"></div>
    <div class="label">VINHOMES CAO XÀ LÁ • MỞ BÁN</div>
  </div>

  <!-- Brand mark chân (tuỳ chọn) -->
  <div id="brand-mark" class="clip brand-mark"
       data-start="0" data-duration="60.0" data-track-index="2">@linh.aloha</div>

  <!-- CHỮ OVERLAY — N div, mỗi div một khoảnh khắc nhấn -->
  <div class="clip overlay-mount" data-composition-src="compositions/overlay-01.html"
       data-start="0.11" data-duration="2.50" data-composition-id="overlay-01"
       data-track-index="50" style="z-index: 80;"></div>
  <div class="clip overlay-mount" data-composition-src="compositions/overlay-02.html"
       data-start="3.20" data-duration="2.00" data-composition-id="overlay-02"
       data-track-index="51" style="z-index: 81;"></div>
  <!-- ... 10-20 overlay mỗi video -->

  <!-- B-ROLL FULL-SCREEN (tuỳ chọn, thưa) -->
  <div class="clip broll-mount" data-composition-src="compositions/broll-01.html"
       data-start="24.00" data-duration="3.50" data-composition-id="broll-01"
       data-track-index="70" style="z-index: 70;"></div>

  <!-- CAPTIONS CUỐI CÙNG (dưới giữa, z-index 100) -->
  <div class="clip captions-mount" data-composition-src="compositions/captions.html"
       data-start="0" data-duration="60.0" data-composition-id="captions"
       data-track-index="60" style="z-index: 100;"></div>
</div>
```

`data-duration` của `#v-source`, `#a-source`, header, brand, captions = thời lượng thật đo bằng `ffprobe` (số 60.0 ở trên chỉ minh hoạ). Header/brand lấy từ tham số `header_label` / `footer_handle`.

## CSS

```css
/* Avatar LUÔN full-frame */
#v-source {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center 22%;     /* mặt cao hơn tâm hình học một chút */
  z-index: 1;
  will-change: transform;
}

/* Khoá kích thước mount (nếu overlay bị cắt) */
.overlay-mount,
.broll-mount {
  position: absolute !important;
  top: 0 !important; left: 0 !important;
  width: 1080px !important; height: 1920px !important;
  overflow: hidden !important;
}
```

## Cấu trúc thư mục project

```
workspace/content/YYYY-MM-DD/<slug>/
├── script.txt
├── voiceover.mp3
├── source.mp4
├── broll/                       # ảnh người dùng đưa (tên ASCII!)
├── transcript.json
├── transcript-cleaned.json
├── caption-groups.json
├── overlays-outline.json        # danh sách khoảnh khắc nhấn + kiểu chữ
├── overlays/                    # JSON từng overlay (chữ, variant, vị trí)
├── overlays.json                # đã gộp
├── compositions/
│   ├── overlay-01.html ... overlay-NN.html   (10-20 cái)
│   ├── broll-01.html ... (tuỳ chọn, tối đa 1-3)
│   └── captions.html
├── sfx/
├── renders/
└── index.html
```

## Hợp đồng đầu ra

Project xem trước được bằng Studio (thường `http://localhost:3002`), lint 0 lỗi (cảnh báo `composition_self_attribute_selector` an toàn — HyperFrames cần mẫu đó). Người dùng duyệt, rồi mới gọi `npx hyperframes render -q draft -o renders/<slug>-draft.mp4` (bản xem thử), sau đó `-q standard` hoặc `-q high` cho bản cuối.
