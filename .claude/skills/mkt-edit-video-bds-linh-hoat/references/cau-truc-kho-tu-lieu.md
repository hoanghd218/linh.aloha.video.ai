# Cấu trúc kho tư liệu

Tạo kho bằng `scripts/tao_kho_tu_lieu.py`. Giữ folder tiếng Việt; script và database phải xử lý Unicode.

## Nhánh chính

- `01_video-trám`: footage dùng chung, bắt buộc ghi rõ có phải minh họa hay không.
- `02_hình-ảnh`: ảnh thật, bản đồ, masterplan, render, pháp lý.
- `03_âm-thanh`: nhạc nền, SFX, ambience.
- `04_tư-liệu-thương-hiệu`: logo, font, CTA, ảnh đại diện.
- `05_tư-liệu-riêng-từng-dự-án`: asset có giá trị chứng minh cao nhất.

Trong `02_hình-ảnh/07_phối-cảnh-và-render`, chia theo nội dung: `01_tổng-thể-và-ngoại-thất`, `02_tiện-ích`, `03_nội-thất-và-căn-hộ`, `04_mặt-bằng-và-masterplan`, `05_phối-cảnh-ban-đêm`. Không coi folder này là ảnh thực tế.

## Metadata database

Mỗi asset lưu:

- `id`, đường dẫn tương đối, loại media, nhóm và chủ đề.
- Dự án/khu vực, từ khóa tiếng Việt.
- `minh_hoa`, nguồn, quyền sử dụng.
- Duration, kích thước, fps, codec và audio.
- Hướng chuyển động, vị trí chủ thể, mức năng lượng, độ tin cậy.
- Thời điểm cập nhật và hash file.
- Loại bằng chứng, trạng thái dự án, URL/ngày/phiên bản nguồn và nhãn disclosure bắt buộc.

`lap_chi_muc_media.py` tự lấy metadata kỹ thuật. Các tag ngữ nghĩa chưa biết để trống hoặc lấy từ sidecar cùng tên `.json`; không suy đoán pháp lý hay dự án từ hình ảnh chung.

## Quy tắc file

- Cho phép Unicode trong folder.
- Ưu tiên tên file ngắn, không ký tự điều khiển.
- Không đổi tên asset gốc khi chỉ lập chỉ mục.
- Lưu license/nguồn trong sidecar hoặc database trước khi dùng cho quảng cáo.
