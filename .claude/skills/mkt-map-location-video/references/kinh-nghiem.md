# Kinh nghiệm — mkt-map-location-video

**Đọc trước mỗi lần làm.** Chỉ ghi điều đã có trong skill / repo này; gặp lỗi mới thì thêm vào *Nhật ký*.

## A. Khác với gói gốc (người chuyển thể ghi, 11/11/2026)

- Gói gốc (`map-location-video.zip`, không ghi tác giả, không ghi giấy phép) viết cho **trình duyệt tích hợp của app Claude desktop** (`mcp__remote-devices__Claude_Browser`, `request_access`, `preview_start`). Ở Claude Code dùng **Claude in Chrome**: `tabs_create_mcp` → `navigate` tới một tile Esri → `javascript_tool`. Ba tệp JS **giữ nguyên văn** (đã so `cmp` với bản gốc), **trừ một chỗ**: thêm nhánh loại `GIÁO DỤC` (mũ cử nhân) vào `glyph()` trong `part-b-render.js` — dòng có chú thích `// [Linh] …`.
- Gói gốc có **dòng mặc định "Video được làm bởi Claude Code"** ở chân clip và dữ liệu mẫu **HAPPY ONE ELITE** (Thủ Đức, toạ độ tạm) — là dự án khác, **không dùng** cho chị Linh. `SKILL.md` đổi thành hỏi chị dòng chân clip.
- Kho `workspace/data/` của chị Linh chỉ có **địa chỉ chữ**, chưa có toạ độ → bước hỏi toạ độ là bắt buộc (Luật 1 trong `SKILL.md`).
- Số phút: tài liệu kickoff (bảng "Trọn nhịp kết nối") và OSRM **sẽ lệch nhau** (OSRM = ô tô, không kẹt xe, tính theo đường bộ; bảng chủ đầu tư là số công bố). Chưa so thử từng cặp — đề xuất hỏi chị chọn.
- Giấy phép: gói gốc nhắc ghi nguồn Esri/Maxar và OpenStreetMap, "dùng thương mại hãy kiểm tra điều khoản". Quảng cáo BĐS là thương mại → **chưa kiểm** điều khoản; `SKILL.md` Luật 3 bắt buộc nhắc chị.
- Độ phân giải gốc cố định **576×1024**; các video khác trong repo là 1080×1920. Phóng lên sẽ mềm.

## B. Đã kiểm / chưa kiểm (11/11/2026)

**Đã kiểm — Chrome headless điều khiển bằng CDP** (không phải tiện ích Claude in Chrome; lúc thử tiện ích báo "chưa kết nối"): mở tile Esri → Photon → `part-a` → `part-b` → đọc `ST` → xuất bảng khung hình. 4 địa điểm, **điểm dự án là điểm TẠM** gần Thượng Đình (chỉ để thử kỹ thuật, bản thử ghi "KHÔNG ĐĂNG"; không giao cho chị):

| Số đo | Kết quả |
|---|---|
| Tile tải | 339, lỗi 0 |
| Thời gian dựng mỗi khung | 27,9 ms → mã tự hạ `STEP=2` (trên 24 ms) |
| Kiểm bố cục tự động | 661 hộp, **0 vi phạm** |
| Ghi video | 29,4 s, **14,2 MB**, **1 khung trễ** |
| Icon `GIÁO DỤC` | hiện đúng (mũ cử nhân) trên thẻ cảnh 2 |

Đã xem bảng khung hình 6 khung (mở đầu, 4 cảnh, kết) — ghim, label, thẻ, đường đi, dòng nguồn đều trong vùng an toàn. **Chưa xem bằng mắt toàn bộ video** và chưa nghe/mở bản WebM.

**Chưa kiểm:**
- Trên **tiện ích Claude in Chrome**: `javascript_tool` nhận tệp 19 KB không · có `await` được promise của `part-a` không · tab nền có ghi đủ 30 fps không (tab phải hiển thị).
- Cách ghép clip làm cảnh `map_route` của `mkt-autoedit-video-9-16`.
- Nút "Tải video", chuyển MP4 bằng ffmpeg (không bấm / không chạy khi chưa có chị đồng ý).

## C. Điều đã thấy khi thử

- Photon: tìm "Bệnh viện Bạch Mai" thì **hai kết quả đầu là trạm xe buýt**, kết quả thứ ba mới là `hospital`; tìm "233 Nguyễn Trãi Thanh Xuân" ra Bách hoá / đường, **không ra đúng số nhà** → phải đối chiếu loại + vị trí, toạ độ dự án phải do chị đưa.
- OSRM (từ điểm tạm): Thượng Đình 1,4 km · 2 phút; ĐH Khoa học Tự nhiên 0,8 km · 2 phút; Vincom Mega Mall Royal City 2,7 km · 5 phút; BV Bạch Mai 5,4 km · 8 phút. Bảng chủ đầu tư ghi 1 phút (Thượng Đình), 1–2 phút (ĐH Khoa học Tự nhiên), 3 phút (Mega Mall), 8 phút (Bạch Mai) → **lệch ở một số nơi** (vì điểm dự án thật khác điểm tạm, chỉ là chỉ dấu) → giữ bước hỏi chị chọn phương án số phút.
- Dòng ghi nguồn chân clip vẽ cỡ chữ 7–9 px trên khung 576 px — rất nhỏ nhưng có mặt; chị nên biết khi cân nhắc điều khoản.
- Cảnh Sân bay Nội Bài (xa ≈ 30 phút) chưa thử — camera sẽ lùi rất xa; thử trước khi hứa với chị.

## Nhật ký

- 2026-11-11 — Chuyển thể từ gói zip: copy 3 tệp JS, thêm `GIÁO DỤC`, viết lại `SKILL.md` cho Claude in Chrome + dữ liệu chị Linh. Thử trong Chrome headless (mục B).
