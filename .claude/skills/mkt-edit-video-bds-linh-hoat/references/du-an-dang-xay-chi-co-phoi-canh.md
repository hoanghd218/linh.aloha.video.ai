# Dự án đang xây chỉ có ảnh phối cảnh

Áp dụng khi không có footage công trường hoặc hình thực tế đủ dùng. Dựng hấp dẫn từ ảnh tĩnh nhưng không khiến người xem hiểu phối cảnh là hiện trạng.

## 1. Thu thập ảnh có nguồn

Ưu tiên theo thứ tự:

1. Bộ media/brochure do chủ đầu tư hoặc người dùng cung cấp.
2. Website chính thức của chủ đầu tư hoặc dự án.
3. Brochure PDF, press kit hoặc bài công bố chính thức.
4. Masterplan, mặt bằng, bản đồ và ảnh khu vực thật để giải thích bối cảnh.
5. Stock chỉ để minh họa lifestyle, không dùng làm hình dự án.

Khi chỉ có tên dự án và được phép truy cập internet:

- Tìm chính xác tên dự án kèm `phối cảnh`, `render`, `brochure PDF`, `masterplan` và tên chủ đầu tư.
- Mở trang nguồn, xác nhận tên dự án và chủ thể phát hành trước khi lấy file.
- Ưu tiên file ảnh gốc thay cho screenshot. Lưu URL trang nguồn và URL file nếu có.
- Không vượt đăng nhập, paywall hoặc biện pháp bảo vệ. Không lấy ảnh có watermark của sàn/môi giới khác.
- Nếu quyền dùng thương mại chưa rõ, chỉ đưa vào danh sách ứng viên và đánh dấu `can_xac_minh_quyen: true`; không đưa vào final quảng cáo.

Lưu mỗi ảnh vào `02_hình-ảnh/07_phối-cảnh-và-render/...` hoặc folder riêng của dự án. Tạo sidecar `<tên-file>.<ext>.json`:

```json
{
  "du_an": "Tên dự án",
  "trang_thai_du_an": "dang-xay",
  "loai_bang_chung": "phoi-canh",
  "minh_hoa": true,
  "nguon": "Website chính thức / brochure",
  "url_nguon": "https://...",
  "phien_ban_tu_lieu": "2026-08",
  "ngay_nguon": "2026-08-09",
  "quyen_su_dung": "do-chu-dau-tu-cung-cap",
  "nhan_bat_buoc": "PHỐI CẢNH MINH HỌA",
  "tu_khoa": ["ngoại thất", "góc trên cao", "tiện ích"]
}
```

Không suy đoán ngày, quyền sử dụng hoặc phiên bản. Để trống và cảnh báo nếu chưa xác nhận.

Manifest đầu vào cho `scripts/thu_thap_phoi_canh.py`:

```json
{
  "du_an": "Tên dự án",
  "trang_thai_du_an": "dang-xay",
  "nguon": "Website chính thức",
  "url_nguon": "https://trang-du-an.example/",
  "quyen_su_dung": "do-chu-dau-tu-cung-cap",
  "assets": [
    {
      "url": "https://cdn.example/phoi-canh-tong-the.jpg",
      "ten_file": "phoi-canh-tong-the-01.jpg",
      "nhom": "01_tổng-thể-và-ngoại-thất",
      "tu_khoa": ["tổng thể", "góc trên cao"]
    }
  ]
}
```

Luôn chạy `--dry-run` trước. Script chỉ tải URL ảnh trực tiếp đã được người thực thi xác minh; không tự suy đoán website nào là chính thức.

## 2. Chọn bộ ảnh theo lời thoại

Không đặt số lượng cứng. Cần đủ góc để mỗi tuyên bố có hình phù hợp:

- Tổng thể/ngoại thất và góc trên cao cho quy mô, kiến trúc, vị trí tương đối.
- Masterplan/mặt bằng cho phân khu, luồng di chuyển và vị trí tiện ích.
- Phối cảnh tiện ích đúng tên cho hồ bơi, công viên, sảnh, khu thương mại.
- Phối cảnh căn hộ/nội thất đúng loại căn nếu lời nói đề cập công năng.
- Bản đồ và footage khu vực thật cho kết nối; không thay bằng phối cảnh.
- Ảnh tiến độ có ngày chụp nếu nội dung nói về tình trạng thi công. Nếu không có, bỏ tuyên bố hoặc ghi rõ chưa có hình tiến độ.

Loại ảnh bị trùng góc, độ phân giải thấp, sai phiên bản thiết kế hoặc không xác định được nguồn.

## 3. Biến ảnh tĩnh thành B-roll 9:16

Phân tích chủ thể và vùng trống trước khi chọn motion. Giữ đường thẳng kiến trúc và tỷ lệ công trình.

- `push-in`: scale nhẹ về điểm chính khi lời nói reveal lợi ích hoặc tên tiện ích.
- `pull-out`: mở rộng từ chi tiết ra tổng thể khi nói quy mô hoặc bối cảnh.
- `pan`: dịch ngang theo chiều mặt tiền, tuyến đường hoặc chuỗi tiện ích.
- `tilt`: đi từ chân lên đỉnh tòa nhà; tránh nghiêng làm méo phối cảnh.
- `parallax 2.5D`: chỉ dùng khi tách foreground/background sạch; chuyển động nhỏ, không tạo vật thể mới.
- `crop + nền mờ`: dùng cho ảnh ngang không đủ crop dọc; không kéo giãn ảnh.
- `PIP/card`: dùng khi cần giữ người dẫn và ảnh chỉ bổ trợ.

Mức chuyển động phụ thuộc thời lượng semantic beat và độ phân giải, không dùng cùng một zoom cho mọi ảnh. Ưu tiên chuyển động chậm, có điểm đến; tránh rung, zoom quá sâu, AI morph làm biến dạng ban công, cửa sổ, logo hoặc chữ.

Neo điểm bắt đầu/đỉnh chuyển động vào danh từ hoặc lợi ích đang được nói; cắt sang ảnh mới khi semantic beat đổi.

## 4. Nhãn và tuyên bố trung thực

- Hiển thị `PHỐI CẢNH MINH HỌA` trong toàn bộ thời gian render xuất hiện, không chỉ ở frame đầu.
- Đặt nhãn nhỏ nhưng đọc được trong vùng an toàn; không để caption hoặc CTA che nhãn.
- Không gọi render là “hình ảnh thực tế”, “view thực”, “tiến độ hiện tại” hoặc bằng chứng đã hoàn thiện.
- Có thể nói “theo phối cảnh”, “dự kiến”, “thiết kế đề xuất” khi đúng nguồn và kịch bản.
- Nếu render và footage khu vực thật xen kẽ, gắn nhãn cho từng đoạn để nguồn hình không bị nhập nhằng.

## 5. Kiểm tra trước final

- Mọi render có sidecar nguồn và `minh_hoa: true`.
- Mọi event render có `asset_kind`, nhãn disclosure và `label_persistent: true`.
- Không có render nào gắn với claim tiến độ thực tế.
- Không crop mất tòa nhà, tên tiện ích hoặc điểm nhấn được nói.
- Không có chuyển động làm biến dạng kiến trúc.
- Ảnh không rõ quyền sử dụng không xuất hiện trong bản quảng cáo final.
