# Âm thanh và SFX

## Chọn theo sự kiện

| Nhóm | Ví dụ | Speech anchor |
|---|---|---|
| Nhấn mạnh | impact trầm, pop mạnh, hit mềm | Giá, diện tích, lợi ích lớn |
| Chữ/giao diện | pop mềm, tick, UI tap | Bullet, nhãn, keyword |
| Chuyển cảnh | whoosh ngắn/dài, sweep | Điểm cắt có chuyển động |
| Bản đồ | pin, route tick, radar nhẹ | Tên đường, khoảng cách |
| Cao trào | riser, downer | Trước reveal hoặc đổi luận điểm |
| Không gian | phố, công viên, showroom | Nền B-roll thật |
| CTA | pop sáng, chime ngắn | Động từ hành động |

## Đồng bộ

- Đặt transient SFX tại hoặc trước `speech_start` tối đa 1–2 frame.
- Cho riser kết thúc đúng keyword/reveal, không bắt đầu đúng lúc reveal.
- Duck SFX nếu che phụ âm; không tăng volume để bù một file không phù hợp.
- Cho ambience crossfade 150–500 ms khi vào/ra B-roll.

## Mix

- Giữ giọng là lớp ưu tiên.
- Dùng nhạc không vocal hoặc vocal rất thưa dưới thoại.
- Duck nhạc theo speech 3–6 dB tùy mật độ.
- Mục tiêu final tham khảo: -14 đến -16 LUFS integrated, true peak ≤ -1 dBTP.
- Kiểm tra bằng loa điện thoại và tai nghe.

Không bắt buộc BGM hoặc số lượng SFX. Một đoạn nói tự nhiên có thể không cần hiệu ứng.

