# Media trám (b-roll) — phân tích & đặt vị trí tự động

## Purpose
User có thể cung cấp ảnh/video trám (bỏ vào `media/` của project, hoặc đưa đường dẫn), kèm hoặc không kèm chỉ định beat. Orchestrator tự phân tích nội dung từng asset rồi gán vào beat phù hợp. Output là `media-manifest.json` — nguồn duy nhất để Phase 3 wire ảnh vào scene và b-roll vào master.

## When to Load
Phase 1b (khi project có `media/` hoặc user đưa asset), và khi wire master/scene có media.

---

## Thuật toán (Phase 1b — chạy song song với TTS)

1. **Inventory** — với mỗi file trong `media/`:
   ```bash
   bash $SKILL/scripts/prep_broll.sh probe <file>   # → {type, duration, width, height, orientation}
   ```
2. **Phân tích nội dung:**
   - **Ảnh:** Read trực tiếp file → mô tả 1-2 câu: nội dung chính, text trong ảnh, chất lượng, phù hợp dọc/ngang.
   - **Video:** `prep_broll.sh frames <video> <scratch_dir>` → 3 frame (10/50/90%) → Read cả 3 → mô tả nội dung + chọn **bestSegment** 3–6s (đoạn ổn định, chủ thể rõ, không rung/chuyển cảnh giữa chừng — suy từ 3 frame + duration).
3. **Gán beat:**
   - User chỉ định sẵn ("ảnh dashboard.png cho beat 3") → **chỉ định LUÔN thắng**, `assignedBy: "user"`.
   - Còn lại: chấm điểm semantic mô tả asset ↔ (summary + đoạn voiceover) của từng beat **SCENE** (beat avatar không nhận media). Điểm là judgment của orchestrator, thang 0–1, ghi vào manifest để trace.
   - **Ngưỡng 0.5**: dưới ngưỡng → cho vào `unused` kèm lý do. KHÔNG ép nhét ảnh lạc đề.
   - Mỗi asset dùng 1 lần. Mỗi beat ≤ 2 asset (1 ảnh trong scene + 1 b-roll). Cả video lẫn ảnh cùng match 1 beat → **video thắng** (chuyển động giữ retention tốt hơn), ảnh rơi xuống beat điểm cao kế tiếp.
4. **Chuẩn bị b-roll video:**
   ```bash
   bash $SKILL/scripts/prep_broll.sh trim <video> <bestSegment.start> <bestSegment.dur> broll-clips/<slug>.mp4
   ```
   Luôn re-encode chuẩn hoá (H.264 30fps keyframe dày, **strip audio** — voiceover là spine). Video >10s chỉ lấy bestSegment, phần còn lại bỏ.

## media-manifest.json schema

```json
{
  "assets": [
    { "file": "media/dashboard.png", "type": "image", "orientation": "landscape",
      "description": "Screenshot dashboard doanh thu, số 128M nổi bật",
      "assignedBeat": "scene-03-how", "assignedBy": "user",
      "usage": "evidence-screenshot" },
    { "file": "media/factory.mp4", "type": "video", "duration": 22.4,
      "description": "Cảnh xưởng sản xuất góc rộng, ánh sáng tốt",
      "bestSegment": { "start": 6.5, "dur": 4.5 },
      "trimmed": "broll-clips/factory.mp4",
      "assignedBeat": "scene-01-problem", "assignedBy": "auto", "score": 0.87,
      "usage": "broll-fullscreen" }
  ],
  "unused": [
    { "file": "media/random-cat.jpg", "reason": "không liên quan beat nào (max score 0.21)" }
  ]
}
```

## Quy tắc đặt vị trí

| usage | Loại | Đặt ở đâu | Cách wire |
|---|---|---|---|
| `evidence-screenshot` | Ảnh dọc / screenshot | Trong scene HTML | Sub-agent prompt kèm abs path + mô tả; card nghiêng nhẹ + border + shadow, pattern theo `image-thumbnail-overlay.md`; LUÔN `onerror` ẩn container |
| `hero-kenburns` | Ảnh ngang chất lượng cao | Trong scene HTML | Nền full pane + gradient tối + hero text đè; GSAP scale 1.0→1.08 chậm |
| `broll-fullscreen` | Video trám | **MASTER** track 45+, z25 | `<video class="clip broll-clip">` `data-start` giữa beat, 3–6s, muted; BROLLS[] wiring (fade + ken-burns + #broll-shade) đã có trong template |

Timing b-roll trong beat: đặt ở **giữa beat** (sau khi scene đã dựng xong phase 1, trước phase chốt), không đè 2s đầu/cuối beat. Sub-agent của beat đó được báo khoảng bị che (`b-roll covers 30.0–34.5s`) để không đặt nhịp nội dung quan trọng vào khoảng đó.

## Fallback & edge cases

- Beat không có asset → scene pure motion graphic (mặc định, không bắt buộc media).
- Không có `media/` → skip toàn bộ Phase 1b, không tạo manifest.
- Video orientation ngang trên canvas dọc: object-fit cover tự crop center — nếu 3 frame cho thấy chủ thể lệch mép, hạ cấp thành ảnh (`hero-kenburns` với frame đẹp nhất).
- Ảnh quá nhỏ (<600px cạnh dài) → chỉ dùng `evidence-screenshot` cỡ nhỏ, không phóng to làm nền.
- Asset trùng nội dung nhau → giữ cái chất lượng cao hơn, cái kia vào `unused` ("duplicate of X").
