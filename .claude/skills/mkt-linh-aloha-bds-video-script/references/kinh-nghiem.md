# Kinh nghiệm — kịch bản video BĐS giọng Linh Aloha

Đọc khi bị reviewer chê tiêu đề / hook, hoặc khi gặp một lỗi lặp lại. Gặp lỗi hay phản hồi mới → thêm vào đúng mục + một dòng *Nhật ký*. Chỉ ghi điều có thật, không bịa số đo.

## Phản hồi reviewer 2026-05-25 (dự án The Bloom)

Ba lỗi reviewer chê nhiều nhất — tránh ngay từ khi viết, đừng để bị bắt lúc duyệt. Luật ngắn nằm ở luật 5 của `SKILL.md`; đây là ví dụ đầy đủ.

### 1. Cấm câu hỏi có/không khi câu trả lời nghiêng tiêu cực

Tiêu đề / hook không được hỏi "có X không?" khi X là lo lắng của người xem — câu hỏi tự nó gieo lo trước, nhất là với người chỉ lướt qua hook.

- ❌ "Sống có ngột ngạt không?" / "Có lo ô nhiễm không?" / "Bàn giao 2029 có quá xa không?"
- ✅ Frame qua khẳng định tích cực hoặc qua con số / tiền lệ giải toả lo:
  - "10 tòa, mấy nghìn căn — nhưng có 1 con số khiến em yên tâm về không gian sống."
  - "Đất Cao Xà Lá ngày xưa là nhà máy — nhưng anh chị có biết Times City và Royal City cũng từng vậy không?"
  - "3 năm chờ bàn giao — em chỉ cho anh chị xem 3 năm đó hạ tầng làm gì."

### 2. Cấm từ gây ác cảm trong tiêu đề / Hook A

Phần thân có thể giải thích, đối chiếu — nhưng tiêu đề / hook đập vào mắt người lướt là cú đầu, đừng gieo cảm xúc tiêu cực hoặc ngụ ý đánh giá người mua.

- ❌ Trong tiêu đề / hook: "khôn / dại", "ngột ngạt", "ô nhiễm", "bí bách", "rủi ro", "lừa", "ngu", "ham rẻ", "ham lời", "tham". (Phần thân vẫn có thể dùng "ngột ngạt" để so sánh với chung cư mật độ cao — chỉ cấm trong tiêu đề / hook.)
- ✅ Reframe: "khôn hay dại?" → "đang mua quyền gì?"; "có ngột ngạt không?" → "vì sao em yên tâm về không gian sống"; "có lo ô nhiễm không?" → "Times City đã trả lời câu hỏi này".

### 3. Cấm hook kiểu bản tin báo chí

Hook không được nghe như bài báo — phải có **góc nhìn cá nhân em-Linh** ngay câu đầu. Một câu cũng đủ biến tin nóng thành lời thì thầm của broker.

- ❌ Hook bản tin: "Masterise Homes vừa thắng cú đúp tại Asia Pacific Property Awards 2026..." / "Hơn 20 năm, khu đất Cao Xà Lá nằm ngay lõi nội đô..."
- ✅ Hook broker: "Có 1 lý do em yên tâm tư vấn The Bloom — tuần này, Masterise vừa nhận 2 giải vàng châu Á." / "Em làm nghề ở Hà Nội mấy năm — đây là lần đầu em thấy có người chính thức được vào Cao Xà Lá sau 20 năm."
- Test nhanh: thay câu hook bằng "Theo Reuters/AP..." mà nghe vẫn hợp lý → bị bản tin hoá → viết lại với góc nhìn em-Linh. Công thức broker-hook (4 kiểu) ở `brand-voice.md`.

## Lỗi hay gặp → cách tránh

| Lỗi | Cách tránh |
|---|---|
| Tự xưng trống "Linh" | Luôn "em Linh" / "em" |
| "The Bloom" đứng trơ | Gắn Masterise / Cao Xà Lá ở mọi lần nhắc |
| Format 10 cho dự án off-plan | Dùng Format 9 hoặc 7; Format 10 chỉ khi đã bàn giao / có nhà mẫu thật |
| CTA "em tư vấn thật, không hối thúc" | Thay bằng "em tư vấn trực tiếp với anh chị" |
| Gọi "bảng giá dự kiến" khi dự án đã có bảng giá chi tiết | Gọi "bảng giá chi tiết", không quote con số giá trong video — đẩy về inbox / hotline (mốc thời gian và chính sách còn thăm dò vẫn ghi "dự kiến") |
| Số có dấu phân cách trong `script.txt` | Viết thành chữ trước khi đưa TTS (TTS đọc "82.820" như số thập phân) |

## Nhật ký

- **2026-11-11 — tối ưu theo chuẩn skill video (v1.1):** viết lại `SKILL.md` theo bố cục Đầu vào → Đầu ra / Luật / Quy trình / Lỗi / Liên quan (141 → 104 dòng, luật gọn và đánh số); dời ví dụ phản hồi reviewer 2026-05-25 sang tệp này; gộp checklist 16 mục vào `assets/script-brief-template.md` (thêm dòng *Brand voice*, 4 mục reviewer, footer `tts_provider` / `profile`); làm rõ ranh giới với `mkt-vn-short-video-script` (skill này là chủ, profile `linh-aloha` bên kia chỉ trỏ về `references/`); thêm tra dữ liệu qua `workspace/data/projects.json`; thêm luật cổng duyệt, số tiếng viết chữ.
