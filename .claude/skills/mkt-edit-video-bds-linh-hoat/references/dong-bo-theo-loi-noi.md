# Đồng bộ hiệu ứng theo lời nói

## Mục tiêu

Cho người xem cảm giác hình ảnh phản ứng tức thời với lời nói. Dùng word timestamps làm đồng hồ chính, không ước lượng bằng độ dài câu hoặc chia đều timeline.

## Đơn vị neo

Chọn một trong ba mức:

1. `word`: một từ quyết định như “10 tỷ”, “7,5 hecta”, “sổ đỏ”.
2. `phrase`: cụm 2–7 từ như “vị trí kinh doanh” hoặc “công viên trung tâm”.
3. `beat`: cả ý khi B-roll phải bao trùm một luận điểm.

Ưu tiên phrase cho text và B-roll, word cho impact/SFX, beat cho background hoặc chuỗi hình minh họa.

## Timing

- Text pop/impact: bắt đầu trước từ 40–100 ms; đạt peak ở phụ âm hoặc âm tiết đầu.
- SFX click/pop: peak trong khoảng ±1 frame quanh `speech_start`.
- Bass impact: peak tại từ mang con số/lợi ích; giảm transient nếu che lời.
- Zoom punch: bắt đầu trước 2–3 frame, peak sau 3–5 frame, hồi về trong 8–14 frame.
- B-roll: có thể vào trước phrase 0–250 ms để người xem nhận diện hình khi nghe danh từ.
- PIP/map: vào trước phrase 100–300 ms nếu cần thời gian đọc.
- Subtitle: xuất hiện từ đầu phrase; biến mất sau từ cuối 80–250 ms.

Các khoảng trên là dải điều chỉnh, không phải quota.

## Chọn từ cần nhấn

Nhấn khi từ/cụm từ thay đổi quyết định của người mua:

- Giá, diện tích, số tầng, pháp lý, tiến độ.
- Tên dự án, phân khu, vị trí, landmark.
- Lợi ích, nhược điểm, so sánh.
- Động từ hành động trong CTA.

Không nhấn từ nối, lời đệm hoặc lặp lại. Không cho tất cả subtitle nhảy như nhau; tạo thứ bậc giữa caption đọc hiểu và keyword thu hút.

## Quan hệ giữa các lớp

- Cho caption ổn định để đọc; chỉ keyword bên trong hoặc overlay riêng được pop.
- Dùng chung một anchor cho text + zoom + SFX khi đó là một “hero moment”.
- Giảm còn một hoặc hai lớp khi khung hình đã nhiều thông tin.
- Nếu B-roll cung cấp bằng chứng mạnh, ưu tiên B-roll và text ngắn; không giữ avatar/PIP chỉ để lấp chỗ.

## Khớp transcript

Chuẩn hóa khi tìm kiếm: lowercase, bỏ dấu câu, gom khoảng trắng và cho phép so sánh không dấu. Luôn lưu lại text có dấu gốc để render.

Nếu phrase xuất hiện nhiều lần:

- Dùng `occurrence` hoặc word index.
- Kết hợp semantic beat gần nhất.
- Không tự chọn lần đầu nếu cue có thể gây hiểu sai.

Nếu confidence thấp:

- Không đoán timing trong final.
- Sửa transcript, đổi trigger phrase hoặc chỉ định word index.
- Ghi cảnh báo trong storyboard.

