# Kinh nghiệm — mkt-kie-broll-image-generator

Chỉ ghi điều đã có trong skill hoặc đã gặp thật; không bịa lỗi, không bịa số đo.

## Lỗi đã gặp (phần còn lại của bảng trong SKILL.md)

| Triệu chứng | Nguyên nhân → cách xử lý |
|---|---|
| 401 unauthorized | Khoá sai / hết hạn → kiểm khoá ở kie.ai/dashboard |
| 404 task not found | `taskId` chưa tồn tại (có thể do đua giữa tạo và poll) → chạy lại |
| 500 / 501 lỗi server hoặc gen thất bại | Phía KIE → chờ 1–2 phút chạy lại; lặp lại thì xem trang trạng thái kie.ai |
| 505 disabled | Model bị tắt tạm → đổi provider hoặc chờ |
| `resultJson` không phải JSON hợp lệ | Lỗi phía KIE → ghi lại nội dung thô, chạy lại |
| Prompt > 20000 ký tự | Script dừng trước khi POST → cắt `SCENE` ngắn lại; khối `STYLE` thường dài nhất, vẫn quá thì rút gọn style |
| Tên tệp có dấu tiếng Việt (Hoàng tự đặt) | `parse_brief_broll.py` đã chuyển ASCII; nếu ép tên có dấu thì đổi tên trước khi gọi |

## Ghi chú kỹ thuật

- `resultJson` trong phản hồi poll là **chuỗi JSON**, phải parse lần nữa trước khi lấy `resultUrls[0]`.
- Nano Banana nhận `image_input` + `output_format`; GPT Image 2 không nhận (script bỏ qua kèm cảnh báo).
- `--image_input` với tệp trên máy: script tải ảnh lên máy chủ KIE trước để lấy URL (KIE xoá sau 3 ngày), vì `image_input` không nhận base64 / nội dung tệp.
- Khối `AVOID` mặc định do parser thêm vào: text overlays, watermarks, AI artifacts, distorted hands, oversaturated colors.
- Prompt hay: giữ `SCENE` ngắn (1–2 câu), cụ thể (không gian, vật liệu, ánh sáng, góc máy) — phần thẩm mỹ để `STYLE` của profile lo. Chi tiết: [../assets/prompt-builder.md](../assets/prompt-builder.md).

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): bỏ đường dẫn tuyệt đối theo máy (thư mục cá nhân của một máy cụ thể) ở bước kiểm khoá, thay bằng `.env` gốc repo; thêm luật cổng xác nhận tiền, luật ảnh AI là minh hoạ, luật không ghi đè; ghi thêm tham số `--image_input` (đã có trong script, trước chưa ghi); thêm bảng Đầu vào → Đầu ra, "xong khi" từng bước; dời mã lỗi phụ sang tệp này.
