# Kinh nghiệm — Kho cảnh trám

## Đã chạy thật
- Vinhomes Ocean Park 2-3: 146 cảnh (12/11/2026), kho ở `My Drive/Chị Linh/Kho cảnh Ocean Park 2-3 (2026-11-12)`. Kho này nuôi 3 video thành phẩm (`My Drive/Chị Linh/Thành phẩm/`: OCP2-3 #01 Bay 60 giây, #02 Tiện ích 4 phút, OCP2 #03 Cuối tuần).
- Tràng Cát (Hải Phòng).

## Bài học
- YouTube hay trả 403 lúc ghép hình + tiếng → `tai_video.sh` tự thử lại 3 lần; vẫn lỗi thì bỏ video, ghi lại.
- Mốc chuyển cảnh thô (`cuts/`) hay sót cảnh hoà tan → agent gắn nhãn phải trích khung kiểm ranh giới.
- Video có phụ đề / logo kênh in cứng ở đáy: vẫn chọn được nếu cảnh đẹp, ghi `chu_logo` để bước dựng crop bỏ (cột `h` của cat_clip trong bản #03).
- Phân khu dễ nhầm giữa các dự án cùng chủ đầu tư (OCP2 / OCP3) → không chắc thì `khong-ro` hoặc mã gộp `OCP2-3`.

## Nhật ký
- 2026-11-12: skill tạo trong tony-brain (`tony-kho-canh-tram`) sau khi làm kho Ocean Park 2-3.
- 2026-11-14: chép sang repo Linh Aloha thành `mkt-kho-canh-tram`. Sửa: bỏ đường dẫn tuyệt đối (thư mục Drive tìm bằng `ls -d ~/Library/CloudStorage/GoogleDrive-*/"My Drive/Chị Linh"`, script gọi từ gốc repo), trỏ skill kề sang tên `mkt-*`, thêm quy tắc ghi nguồn khi dựng cho chị Linh, thêm mục Tham khảo + tệp này. Script không đổi.
