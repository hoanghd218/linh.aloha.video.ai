# Media contracts

## Phân cấp nguồn

| Source kind | Được chứng minh | Nhãn mặc định |
|---|---|---|
| `project-video` | Hiện trạng của đúng dự án/căn tại thời điểm quay | Không, nếu provenance rõ |
| `project-image` | Chi tiết nhìn thấy trong đúng ảnh dự án/căn | Không, nếu là ảnh thật |
| `location-video` | Đường, khu vực, tiện ích đúng địa điểm | Không, nếu quay đúng nơi |
| `library-video` | Loại hình/không khí BĐS chung | `TƯ LIỆU MINH HỌA` khi dễ hiểu nhầm |
| `library-image` | Thiết kế/không gian chung | `TƯ LIỆU MINH HỌA` khi dễ hiểu nhầm |
| `render-image` | Ý đồ thiết kế hoặc hình dung tương lai | `PHỐI CẢNH MINH HỌA` liên tục |
| `pexels-video` | Hành động/lifestyle/khái niệm generic | `TƯ LIỆU MINH HỌA` khi liên quan tài sản |
| `map` / `document` | Vị trí, số liệu hoặc hồ sơ đúng nguồn | Ghi nguồn ngắn khi cần |

## Claim routing

- `project-specific`: chỉ dùng `project-video`, `project-image`, `map`, `document`; render chỉ minh họa thiết kế, không chứng minh hiện trạng.
- `location-specific`: dùng `location-video`, `map`, `document`; kho chung chỉ làm lớp phụ.
- `generic`: có thể dùng kho video/ảnh thật và Pexels.
- `none`: avatar, transition hoặc mood shot; vẫn phải đúng tone.

## Provenance tối thiểu

Mỗi asset phải lưu:

- `asset_id`, `source_kind`, local path hoặc URL.
- Dự án/khu vực được xác nhận, ngày quay hoặc ngày truy cập nếu biết.
- Nguồn/copyright/license; Pexels giữ URL và photographer khi có.
- `illustrative`, `disclosure_label`, khoảng thời gian dùng.
- Claim hoặc spoken anchor mà asset hỗ trợ.

## Pexels local-first

1. Tìm trong kho local theo metadata/filename/tags.
2. Mở frame và xác minh hành động thực tế, không chọn bằng thumbnail hoặc từ khóa đơn.
3. Chỉ gọi Pexels khi local không có asset phù hợp.
4. Query theo `noun + verb + context`, ví dụ `young couple walking apartment lobby vertical`, không dùng `luxury real estate` chung chung.
5. Dùng clip 2–6 giây, mute audio, một lần mỗi video.

## Những điều cấm

- Không dùng Pexels/render cho lời kiểu “đây là sảnh dự án”, “view từ căn”, “tiến độ hiện tại”.
- Không lấy media có watermark hoặc không truy được nguồn.
- Không dùng clip thành phố khác để minh họa claim vị trí cụ thể.
- Không crop mất nhãn pháp lý, số liệu hoặc dấu hiệu cho biết asset chỉ là render.
