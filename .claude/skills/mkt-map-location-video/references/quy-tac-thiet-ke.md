# Quy tắc thiết kế & mẹo — clip vị trí trên ảnh vệ tinh

Nguồn: `SKILL.md` của gói `map-location-video.zip` (tác giả gói không ghi tên); các mục dưới là **quy tắc đã được người dùng gói duyệt** nên giữ nguyên, kèm vài ghi chú của repo Linh (đánh dấu **[Linh]**).

## Vùng an toàn cho mạng xã hội
- Chữ, thẻ, label cách mép trái phải **36 px**; thẻ dưới cách đáy **84 px**; thanh trên cùng hạ xuống `y=64`, thanh tiến trình `y=82`. Mọi chữ tự co (`fitFont`) để không tràn viền.
- Khung 576×1024 → vùng an toàn này tương ứng ≈ 6% hai bên và ≈ 8% dưới; **nhỏ hơn** vùng 10% / 25% mà `mkt-autoedit-video-9-16` dùng cho video thô. **[Linh]** Nếu clip này chèn vào video khác thì đặt trong khung và để autoedit xử lý vùng an toàn của cả video.

## Dòng chân clip
- Dòng chính do người dùng chọn; dòng nhỏ bên dưới ghi nguồn: `Ảnh vệ tinh: Esri, Maxar · Đường: © OpenStreetMap · Số liệu ước tính`. **Không xoá dòng nguồn** trừ khi chị Linh yêu cầu rõ (Esri và OpenStreetMap yêu cầu ghi nguồn — xem Luật 3 trong `SKILL.md`).
- Dự án mẫu, vị trí chưa xác thực: ghi chú cuối nói rõ số liệu và vị trí mang tính tham khảo (`CFG.note`).

## Camera
- Nghiêng ≈ 40° (strip warp), tâm camera luôn là dự án nên ghim dự án luôn ở giữa khung (`y=500`).
- Zoom chọn bằng cách lùi dần tới khi mọi điểm của tuyến nằm trong khung `x` từ 80 tới `W-80`, `y` từ 215 tới đỉnh thẻ trừ 44. Mở đầu nghiêng dần từ 15° tới 40°.
- Tile tối đa **zoom 17**.

## Label và icon
- Label: đầu nhọn ghim luôn đúng vị trí trên bản đồ. Nếu label căn giữa tràn mép phải thì chữ nằm bên trái icon; tràn mép trái thì nằm bên phải; còn lại căn trục giữa phía trên icon. Cách icon 14 px (12 px khi ở bên). Label tự né logo dự án và thân ghim dự án; nếu cả ba hướng đều vướng thì dùng `center*` (căn giữa, dịch vào trong cho khỏi tràn viền).
- Label không bao giờ đè thẻ chữ phía dưới: cách thẻ tối thiểu 14 px.
- Màu icon kim loại: `gold` cho ghim dự án và mua sắm, `blue` cho kết nối (sân bay, giao thông), `ruby` cho y tế. Thêm loại mới: thêm nhánh trong `glyph()` và chọn `sty`.
- **[Linh]** Đã thêm loại **`GIÁO DỤC`** (mũ cử nhân) vào `glyph()` trong `scripts/part-b-render.js` — dùng `sty: 'blue'`. Loại khác không có nhánh sẽ ra icon mũi tên.

## Số cảnh và thời lượng
- Số cảnh bằng số phần tử của `pois` (3–6 là hợp lý); thời lượng `T = 3,5 + 5,5 × N + 3,5` giây. Với N ≠ 4 đặt `window.RECORD_SECONDS = T` trước khi chạy `rerecord.js`.

## Mẹo và lỗi hay gặp
- Shell của sandbox gốc không tải được tile; **mọi việc tải tile, định tuyến, tìm địa chỉ phải làm bằng `fetch` trong tab trình duyệt**. Nominatim và tile raster của openstreetmap.org bị chặn từ trang; dùng Photon cho tìm địa chỉ, OSRM (`router.project-osrm.org`) cho tuyến, tile Esri World Imagery cho nền.
- `MediaRecorder` ghi theo thời gian thực: mỗi khung phải dựng dưới 33 ms. Mã tự đo, nếu quá 24 ms thì giảm độ phân giải dải strip (`STEP=2`). **Tab phải đang hiển thị** trong lúc ghi (đừng chuyển tab, đừng thu nhỏ cửa sổ).
- Xem cận cảnh: gọi `window.RENDER(t)` rồi `drawImage(window.CVS, …)` phóng to một vùng vào canvas mới, đặt vào `#stage` và chụp. `window.RENDER(t)` chỉ vẽ lên canvas `CVS`, không cần canvas gắn vào trang.
- Kết quả là tệp WebM nằm trong trình duyệt. Muốn MP4 hoặc thêm nhạc: ffmpeg (lệnh ở `SKILL.md`). Không tự tải xuống máy chị nếu chưa được đồng ý.

## Sửa thẻ (phương án c — chỉ hiện km, bỏ phút) — **[Linh]**
Trước khi truyền `part-b-render.js` vào `javascript_tool`, thay **trong bộ nhớ** (không sửa tệp) đoạn:
```
const e=cx+chip(cx,y+66,Math.max(1,Math.round(p.min))+' phút',p.sty)-8;
```
bằng:
```
const e=cx-8;
```
Chip "x phút" biến mất, chip km còn nguyên; vùng kiểm bố cục `cardtext` vẫn đúng vì `e` là mép phải chip km.

## Kho label riêng (chưa triển khai)
Gói gốc ghi người dùng có kho icon và thiết kế label riêng. Khi có kho: đọc cấu trúc, ánh xạ từng loại địa điểm sang một icon SVG/PNG, nạp bằng `new Image()` (SVG qua data URL) rồi thay `glyph()`, `pinBody()`, `drawLabel()`. Giữ nguyên quy tắc vùng an toàn, cách đặt label và bước kiểm tự động; làm bản demo cho chị so sánh trước khi chốt. **[Linh]** Repo này chưa có kho label của thương hiệu Linh.
