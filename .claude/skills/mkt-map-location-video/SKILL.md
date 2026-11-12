---
name: mkt-map-location-video
description: Làm clip dọc 9:16 (576×1024, 30 fps, ≈29 giây với 4 địa điểm) giới thiệu VỊ TRÍ & KẾT NỐI của dự án BĐS trên nền ảnh vệ tinh Esri nghiêng 3D (≈40°) — ghim dự án luôn ở giữa khung, mỗi địa điểm lân cận là một cảnh có tuyến đường OSRM vẽ dần, thẻ km/phút, label kim loại (vàng · xanh · đỏ), chân clip ghi nguồn Esri/OpenStreetMap. Dựng và ghi WebM ngay trong Chrome (canvas + MediaRecorder) qua Claude in Chrome, không tốn credit API. Dùng khi chị Linh nói "làm video vị trí dự án", "bản đồ kết nối", "xung quanh dự án có gì", "x phút tới trường/bệnh viện/metro", "ảnh vệ tinh tuyến đường", hoặc cần cảnh bản đồ cho hiệu ứng map_route của AutoEdit. Không dùng cho video thô cần chọn hiệu ứng từng cảnh (mkt-autoedit-video-9-16), video avatar HeyGen (mkt-full-video-with-11-*), mô phỏng thi công metro, video không phải vị trí.
argument-hint: "[tên dự án] [toạ độ lat,lon | link Google Maps]"
---

# Video vị trí & kết nối trên ảnh vệ tinh — Claude in Chrome

Phiên bản: v1.0 — 2026-11-11 · Chuyển thể từ gói `map-location-video.zip` (xem [kinh-nghiem.md](references/kinh-nghiem.md) mục A)

Clip ngắn cho chị Linh: ghim dự án ở giữa, camera nghiêng, mỗi cảnh một nơi lân cận (trường, bệnh viện, trung tâm thương mại, metro…) có đường đi vẽ dần + thẻ "x km · y phút". Mã gốc dựng trong Chrome nên không cần cài gì ngoài tiện ích **Claude in Chrome**; ghi hình ra **WebM**, đổi sang MP4 bằng ffmpeg khi chị cần.

## Chọn đúng skill

| Chị Linh muốn | Skill |
|---|---|
| Clip bản đồ vị trí & kết nối (skill này) | **mkt-map-location-video** |
| Video thô quay sẵn, chọn hiệu ứng từng cảnh | `mkt-autoedit-video-9-16` (cảnh `map_route` có thể dùng clip của skill này) |
| Kịch bản lời nói về vị trí | `mkt-linh-aloha-bds-video-script` |
| Video avatar HeyGen trọn gói | `mkt-full-video-with-11-hyperframe-heygen` |

## Luật — không được phá

1. **Không bịa toạ độ.** Ghim dự án sai chỗ trên quảng cáo BĐS là sai sự thật. Toạ độ dự án phải do **chị Linh đưa** (lat, lon hoặc link Google Maps) — kho `workspace/data/` chỉ có **địa chỉ chữ** (`233 / 233B / 235 Nguyễn Trãi, Thanh Xuân, Hà Nội`), **chưa có toạ độ**. Chưa có thì dựng bản **thử** bằng điểm tạm, ghi rõ "VỊ TRÍ TẠM", **không giao** bản đó. Tìm địa chỉ bằng geocoder có thể ra nơi trùng tên → đối chiếu tên + khu vực rồi mới dùng.
2. **Số phút / km không tự bịa, không tự "làm đẹp".** Số do OSRM tính (ô tô, không kẹt xe) là **ước tính**; số phút trong tài liệu kickoff của chủ đầu tư (`workspace/data/<dự án>/_kien-thuc-du-an/05 - Vị trí và Kết nối.md`, bảng "Trọn nhịp kết nối") là **công bố của chủ đầu tư**. Hai nguồn lệch nhau → **hỏi chị chọn**, kèm a / b / c (xem mục *Số km, số phút*). Địa điểm không có trong tài liệu thì chỉ dùng số OSRM và giữ dòng "Số liệu ước tính".
3. **Giữ dòng ghi nguồn ở chân clip** ("Ảnh vệ tinh: Esri, Maxar · Đường: © OpenStreetMap · Số liệu ước tính") — Esri và OpenStreetMap yêu cầu ghi nguồn. Clip đăng quảng cáo = dùng thương mại: **nhắc chị xem lại điều khoản Esri World Imagery và OpenStreetMap** trước khi đăng; chưa kiểm ở đây.
4. **Hỏi trước khi tải file về máy.** Tiện ích Chrome chỉ giữ WebM trong trang; nút "Tải video" ghi vào thư mục Tải xuống của chị → **hỏi, chờ "ok"** rồi mới bấm (nói rõ tên tệp và dung lượng). Không tự đăng clip lên đâu.
5. **Chỉ gọi dịch vụ công cộng miễn phí đúng như mã gốc:** `server.arcgisonline.com` (tile), `router.project-osrm.org` (tuyến), `photon.komoot.io` (tìm địa chỉ). Mỗi địa điểm một lần gọi, không lặp vòng; không gửi gì ngoài toạ độ. Không dùng Nominatim và tile raster OpenStreetMap (bị chặn từ trang này).
6. Mở **tab mới của riêng phiên này**, không dùng tab chị đang mở; xong thì đóng. Không điều hướng tab đi nơi khác trong lúc dựng và ghi (mã nằm trong trang).
7. Không để mặc định "Video được làm bởi Claude Code" làm dòng cuối cho thương hiệu Linh — hỏi chị dòng chân clip (đề xuất: tên thương hiệu). Không thêm câu hối thúc ("sắp hết", "chốt ngay").
8. Báo **số đo thật** (số khung trễ, dung lượng, số vi phạm bố cục); chỗ chưa xem bằng mắt thì nói rõ.

## Hỏi chị Linh trước (thiếu gì hỏi nấy, một lượt, kèm a / b / c)

1. **Dự án + khu vực hiển thị** — ví dụ `LUMIÈRE HANOI SEASONS GARDEN` / `THANH XUÂN · HÀ NỘI` (tên dự án lấy từ `workspace/data/projects.json`).
2. **Toạ độ dự án** (lat, lon) hoặc link Google Maps — xem Luật 1.
3. **Danh sách địa điểm** (mặc định 4, hợp lý 3–6; mỗi cảnh 5,5 giây): tên + loại `Y TẾ` · `MUA SẮM` · `KẾT NỐI` · `GIÁO DỤC`. **Gợi ý lấy từ bảng "Trọn nhịp kết nối"** của tài liệu kickoff (chị chọn 4–6): Ga Metro Thượng Đình (KẾT NỐI) · ĐH Khoa học Tự nhiên / ĐH Hà Nội (GIÁO DỤC) · TTTM Mega Mall (MUA SẮM) · BV Quân Y 103 hoặc BV Bạch Mai (Y TẾ) · Hồ Tây / Hồ Hoàn Kiếm · Sân bay Nội Bài (xa — thẻ km lớn, camera lùi xa). Toạ độ từng nơi lấy bằng Photon rồi đối chiếu (Luật 1).
4. **Chữ trên clip:** 2 dòng mở đầu + 1 câu phụ (mặc định "Xung quanh có gì?"), tagline, chữ nút kêu gọi (mặc định "LIÊN HỆ NHẬN THÔNG TIN"), ghi chú cuối (mặc định "Số liệu và vị trí mang tính tham khảo"), dòng chân (Luật 7). Câu CTA, cách xưng hô theo `mkt-linh-aloha-bds-video-script`.
5. **Số km, số phút:** (a) dùng số OSRM cho mọi cảnh (km + phút ô tô, ước tính) — dễ, nhất quán; (b) **km theo OSRM + phút theo bảng chủ đầu tư** cho các nơi có trong bảng, nơi khác dùng OSRM — khớp tài liệu chị đang bán, **đề xuất b**; (c) chỉ hiện km, bỏ phút.

Không sao chép thương hiệu, tên kênh, watermark của video mẫu người khác.

## Quy trình

Đặt `K=.claude/skills/mkt-map-location-video`. Cách chạy một tệp JS: **đọc nội dung tệp bằng Read, rồi truyền nguyên văn vào tham số `text` của `javascript_tool`** (`action: "javascript_exec"`, `tabId` của tab mình) — tệp lớn nhất ≈ 19 KB.

0. **Chuẩn bị Chrome:** gọi skill `claude-in-chrome`, nạp công cụ trong **một** lần `ToolSearch` (`tabs_context_mcp`, `tabs_create_mcp`, `navigate`, `javascript_tool`, `computer`, `tabs_close_mcp`). `tabs_context_mcp` → `tabs_create_mcp` (tab mới) → ghi `tabId`. Tiện ích hỏi quyền site → cho `server.arcgisonline.com`.
1. **Mở một tile Esri làm "origin":** `navigate` tới `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/10/450/820`. Mọi mã chạy trong tab này nên tải tile và đọc vào canvas không bị chặn CORS. Giữ nguyên tab.
2. **Toạ độ địa điểm:** `javascript_tool` chạy `await (await fetch('https://photon.komoot.io/api/?limit=3&lat=<lat>&lon=<lon>&q=<tên>')).json()` — đối chiếu **tên, loại (`osm_value`) và vị trí** từng kết quả (Luật 1) — ví dụ tìm "Bệnh viện Bạch Mai" thì hai kết quả đầu là **trạm xe buýt** (`bus_stop`), phải chọn kết quả `hospital`; tìm "233 Nguyễn Trãi" không ra đúng số nhà. Ghi lại lat, lon từng nơi vào bảng để chị duyệt.
3. **Chạy `scripts/part-a-data.js`** sau khi **thay khối `CFG`** (tên, `intro`, `subtitle`, `area`, `tagline`, `cta`, `note`, `footer`, `project`, `pois[]`; `sty` mỗi nơi: `gold` mua sắm · `blue` kết nối / giáo dục · `ruby` y tế). Tệp trả về `[{n, km, min, pts}]` — **đọc cho chị xem** và hỏi lại nếu có tuyến bất thường (km quá lớn, `pts` quá ít).
   - Nếu chị chọn phương án **b** (Số km, số phút): chạy **trước** `part-b`, một lệnh `javascript_tool`: `window.D.pois.forEach((p,i)=>{ if (PHUT[i]!=null) p.min = PHUT[i]; })` với `PHUT` là mảng số phút theo bảng chủ đầu tư (`null` = giữ OSRM). Phương án **c**: để chị chốt, xem [quy-tac-thiet-ke.md](references/quy-tac-thiet-ke.md) mục "Sửa thẻ".
4. **Chạy `scripts/part-b-render.js`.** Mã chạy ngầm: tải tile → đo tốc độ dựng → kiểm bố cục tự động → ghi video (thời gian thực ≈ 29 s) → tạo bảng khung hình. **Giữ tab hiển thị** (không thu nhỏ cửa sổ, không chuyển tab) trong lúc ghi. Đợi bằng `computer` `wait` rồi đọc `JSON.stringify(window.ST)` tới khi `done` là `true` (≈ 1 phút).
5. **Kiểm số đo:** `ST.check.violationCount` phải **= 0**; `ST.late` (khung trễ) nên **= 0** và dung lượng thường **≥ 13 MB** (lần thử trong Chrome headless: 0 vi phạm, **1** khung trễ, 14,2 MB, 29,4 s — báo chị số thật, đừng làm tròn). Khung trễ nhiều hoặc dung lượng nhỏ bất thường → chạy `scripts/rerecord.js` (tile đã nằm trong bộ nhớ; N cảnh ≠ 4 thì đặt trước `window.RECORD_SECONDS = 3.5 + 5.5*N + 3.5`); kết quả ở `window.REC2`, trạng thái `window.ST2`.
6. **Xem bằng mắt:** pane đang hiện bảng khung hình có đường viền an toàn nét đứt hồng — `computer` `screenshot` để xem; cận cảnh thì vẽ crop từ `window.CVS` sau khi gọi `window.RENDER(t)` ([quy-tac-thiet-ke.md](references/quy-tac-thiet-ke.md)). Soi: ghim dự án đúng khu đất, label không đè thẻ, chữ trong vùng an toàn, tuyến hợp lý.
7. **Phát thử:** `window.showVideo()` hiện video và nút **Tải video** — **đừng bấm** khi chưa được chị đồng ý (Luật 4).
8. **Giao chị:** báo số đo (thời lượng, dung lượng, khung trễ, vi phạm bố cục), phương án số phút đã chọn, địa điểm nào dùng số công bố / số ước tính, vị trí chính xác hay tạm. Hỏi: **a)** tải WebM về `workspace/content/YYYY-MM-DD/<slug>/output/` **b)** đổi sang MP4 (xem dưới) **c)** làm lại với địa điểm khác. Xong thì `tabs_close_mcp` đóng tab.

### Sau khi chị đồng ý tải
Chị bấm nút trong tab, hoặc bảo bấm. Tệp `map_video.webm` vào thư mục Tải xuống → chép vào `workspace/content/YYYY-MM-DD/<slug>/output/map_video.webm` rồi (nếu chị muốn MP4):
```bash
ffmpeg -i map_video.webm -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p map_video.mp4
# thêm nhạc: -i "workspace/assets/background music/<tệp>" -shortest -c:a aac  (chỉ tệp có sẵn trong repo)
# lên 1080×1920 cho khớp các video khác: -vf scale=1080:1920:flags=lanczos — ảnh sẽ MỀM (gốc 576×1024)
```
Giới hạn thật: **độ phân giải gốc 576×1024** (toạ độ cứng trong mã) — phóng lên 1080×1920 không thêm chi tiết. Muốn nét hơn phải sửa mã theo hệ số tỉ lệ (chưa làm).

## Cải tiến skill

Lỗi mới hoặc chị đổi cách làm → một dòng vào [kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*, sửa **đúng một chỗ**. Đổi skill thì `node tools/kiem-skill.mjs --all .claude/skills`.

## Liên quan

- Dùng clip làm cảnh `map_route` trong video thô: `mkt-autoedit-video-9-16` (chưa kiểm cách ghép).
- Chi tiết: [quy-tac-thiet-ke.md](references/quy-tac-thiet-ke.md) (vùng an toàn · camera · label · icon) · [kinh-nghiem.md](references/kinh-nghiem.md).
