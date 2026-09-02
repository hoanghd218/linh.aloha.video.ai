# Zoom và chuyển cảnh TikTok

## Zoom

| Tên | Chuyển động tham khảo | Dùng khi |
|---|---|---|
| `zoom-mem` | 1.00 → 1.03–1.05 trong 0.8–1.8s | Shot người dẫn hơi tĩnh |
| `nhan-nhanh` | 1.00 → 1.07–1.10 → 1.03 trong 8–14 frame | Keyword, giá, reveal |
| `cat-nhay-phong-gan` | Đổi crop 4–10% tại điểm cắt lời | Che jump cut tự nhiên |
| `thu-ra-tiet-lo` | 1.08 → 1.00 | Lộ toàn cảnh mặt tiền/tiện ích |
| `ken-burns` | Pan + zoom 3–9% | Ảnh tĩnh |
| `troi-may-nhe` | Dịch vị trí 1–2% + scale nhỏ | HeyGen quá tĩnh |
| `zoom-theo-chu-the` | Track khuôn mặt/vật thể | Người dẫn di chuyển hoặc chỉ |

Tính peak theo speech anchor khi zoom nhằm nhấn lời. Không lặp cùng một đường cong liên tiếp nếu không phải motif có chủ ý.

## Chuyển cảnh

Ưu tiên theo thứ tự:

1. `cat-thang-theo-loi` — sạch, nhanh, mặc định.
2. `cat-khop-chuyen-dong` — nối gesture, pan hoặc hướng xe/người.
3. `quet-ngang-nhanh` — đổi vị trí/không gian có cùng hướng.
4. `keo-soc-doc` — reveal ảnh/drone hoặc học theo video mẫu.
5. `day-nhoe-chuyen-dong` — chuyển giữa shot di chuyển.
6. `che-bang-vat-the` — khi có foreground phù hợp.
7. `tang-toc-chuyen-canh` — drone, đi bộ, di chuyển tuyến đường.
8. `lat-trang-ban-do` — map, masterplan, pháp lý.
9. `mo-chong-cao-cap` — nội dung luxury, nhịp chậm.

## Guardrails

- Chỉ dùng transition đặc biệt khi có quan hệ hình hoặc ý nghĩa giữa hai shot.
- Giữ duration thường 4–12 frame; dài hơn khi phong cách luxury yêu cầu.
- Không dùng flash/glitch cho pháp lý, cảnh báo nghiêm túc hoặc nội dung cao cấp nếu video mẫu không có.
- Không đặt transition lên phụ âm đầu quan trọng nếu SFX hoặc blur làm giảm khả năng nghe/đọc.
- Kiểm tra seek ở frame đầu, giữa và cuối transition.

