---
name: mkt-linh-aloha-bds-video-script
description: Sinh kịch bản video ngắn (40–90s, TikTok/Reels/YouTube Shorts) cho môi giới bất động sản cao cấp theo brand voice Linh Aloha — giọng ấm áp + thẳng thắn, xưng em/anh chị, mở đầu "Aloha anh chị, em Linh đây", CTA "inbox hoặc gọi em Linh Aloha theo hotline". Dùng bộ 10 format kịch bản chắt lọc từ thực chiến (Tin sốc/Quay xe, Món hời hay cái bẫy, Cờ xanh-Cờ đỏ, Đập tan nỗi lo, Bài toán tiền, Đặt lên bàn cân, Giải mã chuyên gia, Người thật chuyện thật, Review dòng sản phẩm, Tham quan tiện ích). Output gồm script.txt sẵn sàng cho TTS + 3 hook thay thế + gợi ý chữ on-screen & b-roll theo từng beat. USE WHEN user says 'viết kịch bản video bđs', 'tạo script video [tên dự án]', 'content video Linh Aloha', 'viết video review dự án', 'kịch bản tiktok bất động sản', 'viết video bán căn hộ', 'lên kịch bản short video môi giới', 'script video dự án', 'viết content bđs ngắn', 'video review căn hộ'. Hãy dùng skill này BẤT CỨ KHI NÀO user muốn một kịch bản video ngắn về bất động sản — kể cả khi họ không nói tên format hay không nhắc "Linh Aloha".
---

# Kịch bản video ngắn BĐS — Brand voice Linh Aloha

Skill này biến một chủ đề ("video về giá dự án X", "video xử lý lo ngại Y", "review các dòng căn hộ") thành một kịch bản video ngắn **40–90 giây** hoàn chỉnh, viết đúng chất giọng thương hiệu **Linh Aloha** (BĐS cao cấp) và đúng một trong **10 format kịch bản** đã được chắt lọc từ thực chiến.

Mục tiêu: kịch bản đọc lên nghe như Linh đang **trò chuyện thật** với khách — ấm áp, thẳng thắn, có con số — chứ không phải một bản tin PR. Mỗi video chỉ chốt **một** thông điệp.

## Output mỗi lần chạy

Ghi 2 file vào `output/linh-aloha/scripts/<topic-slug>/`:

1. **`script.txt`** — lời thoại thuần, sẵn sàng đẩy TTS (ElevenLabs/MiniMax). Chỉ chữ được đọc, không nhãn, không markdown. Đây là input cho pipeline video (`mkt-full-video-with-11-*`).
2. **`brief.md`** — bản đầy đủ: format đã dùng + lý do, 3 hook thay thế, kịch bản chia beat, gợi ý chữ on-screen + b-roll/cảnh quay, checklist tự kiểm, ước tính thời lượng. Theo mẫu `assets/script-brief-template.md`.

## Quy trình

### Bước 0 — Thu thập input

Cần biết: **chủ đề/góc video**, **dự án** (mặc định: Cao Xà Lá — Lumière Hanoi Seasons Garden), **thời lượng mục tiêu** (mặc định ~60s), **format** (chỉ khi user chủ động chỉ định).

Nếu user chưa nói rõ chủ đề, hỏi đúng 1 câu gọn. Đừng hỏi dồn — phần lớn thông tin còn lại có default hợp lý.

### Bước 1 — Đọc references (BẮT BUỘC trước khi viết)

- `references/brand-voice.md` — chất giọng, xưng hô, từ nên/tránh, câu signature, các biến thể CTA.
- `references/script-formats.md` — công thức (chuỗi beat) + ví dụ của cả 10 format.

Không viết kịch bản theo trí nhớ — luôn mở 2 file này ra để bám sát. Giọng sai = hỏng thương hiệu.

### Bước 2 — Lấy dữ liệu thật của dự án

Kịch bản BĐS sống bằng **con số thật** (giá, diện tích, tiện ích, chính sách, mốc thời gian). **Không được bịa số.**

- Tìm thư mục dữ liệu dự án trong `workspace/data/` (vd `workspace/data/Cao xà lá/`). Nếu có, đọc các file `.md` liên quan tới chủ đề video.
- Nếu không có thư mục, hoặc dữ liệu thiếu đúng phần đang cần — hỏi user cung cấp con số cụ thể. Thà hỏi còn hơn bịa.
- Nếu một con số là ước tính/tin đồn (vd giá rumor), nói rõ trong kịch bản là "tin đồn" / "dự kiến" — đừng trình bày như giá chốt.

### Bước 3 — Chọn format

Nếu user đã chỉ định format → dùng đúng nó.
Nếu chưa → chọn format hợp nhất với chủ đề theo bảng dưới, nói rõ **1 câu vì sao**, rồi viết luôn (user có thể đổi nếu muốn — không cần dừng chờ duyệt).

| Chủ đề / tình huống | Format |
|---|---|
| Tin/sự kiện mới: công bố giá, kick-off, ra hàng | 1 — Tin sốc "Quay xe" |
| Thị trường đang đồn đoán, nghi ngờ giá | 2 — Món hời hay cái bẫy |
| Muốn xây niềm tin, tạo khác biệt | 3 — Cờ xanh / Cờ đỏ |
| Khách có đúng 1 nỗi lo cụ thể (tiến độ, pháp lý, oversupply...) | 4 — Đập tan nỗi lo |
| Câu hỏi đầu tư / theo ngân sách / dòng tiền | 5 — Bài toán tiền |
| So sánh 2 dự án / 2 lựa chọn | 6 — Đặt lên bàn cân |
| Pháp lý, quy hoạch, cơ chế, "tại sao" | 7 — Giải mã chuyên gia |
| Có khách thật / sự kiện thật để kể | 8 — Người thật chuyện thật |
| Giới thiệu / so sánh các dòng căn hộ trong dự án | 9 — Review dòng sản phẩm |
| Tiện ích, dịch vụ, phí dịch vụ, trải nghiệm sống (CHỈ khi dự án đã bàn giao / đã có nhà mẫu thật) | 10 — Tham quan tiện ích |

> **CẤM tour ảo (2026-05-25 từ feedback reviewer):** không dùng Format 10 cho dự án **off-plan** chưa bàn giao. Lý do: không thể "tham quan" tiện ích chưa xây xong — quay video kiểu này mất uy tín. Ngoại lệ duy nhất: dự án đã có **nhà mẫu / sale gallery thật** mà em có thể đến quay trực tiếp; vẫn phải nói rõ trong video đây là "khu nhà mẫu" / "phối cảnh", không phải tiện ích thật đang vận hành. Với dự án off-plan (Cao Xà Lá bàn giao Q2/2029), chuyển sang Format 9 (review dòng sản phẩm) hoặc Format 7 (giải mã chuyên gia về quy hoạch tiện ích).

### Bước 4 — Viết kịch bản

Bám **công thức** (chuỗi beat) của format đã chọn trong `script-formats.md`. Với mỗi beat, viết bằng giọng Linh Aloha.

Quy tắc viết (chi tiết đầy đủ trong `brand-voice.md` — đây là bản rút gọn):
- **Hook trước tiên.** 3 giây đầu là câu chốt sự chú ý (con số, câu hỏi, hoặc tin nóng). Câu signature "Aloha anh chị, em Linh đây" lồng vào **ngay sau** cú đấm của hook — KHÔNG đặt trước hook (phí 2 giây vàng).
- **Một video một ý.** Không nhồi. Nếu chủ đề quá rộng, chọn 1 lát cắt và đề xuất tách phần còn lại thành video khác.
- **Mỗi nhận định có dẫn chứng** — con số, mốc thời gian, ví dụ, dự án tiền lệ.
- **Xưng hô đúng.** Tự xưng LUÔN có "em" ("em", "em Linh") — KHÔNG bao giờ tự xưng trống "Linh". Gọi khách "anh chị".
- **Không nói trống không.** Cứ vài câu phải hướng về "anh chị"; dùng tiểu từ "nhé/ạ/đấy" cho câu có người nghe.
- **Gọi tên dự án đủ ngữ cảnh.** Lần nhắc đầu trong mỗi video phải gắn dự án với chủ đầu tư + khu đất quen thuộc (vd "The Bloom — dự án Masterise tại Cao Xà Lá"), không gọi trơ tên phân khu.
- **Liệt kê theo thứ tự** — mở bằng tổng số rồi đếm "1 là... 2 là... 3 là...".
- **Giọng người thật, không máy móc.** Nối đoạn bằng "Nhưng"/"Vì vậy" (không "rồi sau đó"); câu ngắn-dài đan xen; tự phản ứng với con số; cài câu hỏi tu từ; đặt 1 câu chốt đáng nhớ trước CTA. Đọc to lên — phải nghe như đang ngồi cà phê kể chuyện.
- **Đóng bằng CTA** — biến thể CTA Linh Aloha hợp ngữ cảnh (xem `brand-voice.md`), có tên "Linh Aloha" + mời "inbox hoặc gọi theo hotline". KHÔNG dùng "em tư vấn thật, không hối thúc".
- **Tránh từ cấm** trong `brand-voice.md` (hối thúc kiểu chợ "vắt chân lên cổ"/"kẻo hết", lạm dụng "siêu phẩm/chấn động/bùng nổ").

### Quy tắc Tiêu đề + Hook A *(thêm 2026-05-25 từ feedback reviewer dự án The Bloom)*

3 anti-pattern reviewer flag nhiều nhất — tránh ngay từ khi viết, đừng để bị bắt lúc duyệt:

1. **CẤM câu hỏi có/không khi câu trả lời nghiêng tiêu cực.** Tiêu đề/hook không được hỏi "có X không?" khi X là lo lắng của người xem — vì câu hỏi đó tự nó gieo lo trước, đặc biệt với người chỉ lướt qua hook.
   - ❌ "Sống có ngột ngạt không?" / "Có lo ô nhiễm không?" / "Bàn giao 2029 có quá xa không?"
   - ✅ Frame qua khẳng định positive HOẶC qua con số/tiền lệ giải toả lo:
     - "10 tòa, mấy nghìn căn — nhưng có 1 con số khiến em yên tâm về không gian sống."
     - "Đất Cao Xà Lá ngày xưa là nhà máy — nhưng anh chị có biết Times City và Royal City cũng từng vậy không?"
     - "3 năm chờ bàn giao — em chỉ cho anh chị xem 3 năm đó hạ tầng làm gì."

2. **CẤM từ gây ác cảm trong tiêu đề / Hook A.** Body có thể giải thích, đối chiếu — nhưng tiêu đề/hook đập vào mắt người lướt là cú đầu, đừng gieo cảm xúc tiêu cực hoặc ngụ ý đánh giá người mua.
   - ❌ Trong tiêu đề/hook: "khôn / dại", "ngột ngạt", "ô nhiễm", "bí bách", "rủi ro", "lừa", "ngu", "ham rẻ", "ham lời", "tham". (Body vẫn có thể dùng "ngột ngạt" để so sánh với chung cư mật độ cao — chỉ cấm trong tiêu đề/hook.)
   - ✅ Reframe: "khôn hay dại?" → "đang mua quyền gì?"; "có ngột ngạt không?" → "vì sao em yên tâm về không gian sống"; "có lo ô nhiễm không?" → "Times City đã trả lời câu hỏi này".

3. **CẤM hook kiểu bản tin báo chí.** Hook không được nghe như bài báo — phải có **góc nhìn cá nhân em-Linh** ngay từ câu đầu. Chỉ 1 câu thôi cũng đủ để biến tin nóng thành lời thì thầm của broker.
   - ❌ Hook bản tin: "Masterise Homes vừa thắng cú đúp tại Asia Pacific Property Awards 2026..." / "Hơn 20 năm, khu đất Cao Xà Lá nằm ngay lõi nội đô..."
   - ✅ Hook broker: "Có 1 lý do em yên tâm tư vấn The Bloom — tuần này, Masterise vừa nhận 2 giải vàng châu Á." / "Em làm nghề ở Hà Nội mấy năm — đây là lần đầu em thấy có người chính thức được vào Cao Xà Lá sau 20 năm."
   - Test nhanh: thay câu hook bằng "Theo Reuters/AP..." mà nghe vẫn hợp lý → bị bản tin hoá → viết lại với góc nhìn em-Linh.

Độ dài — bám bảng nhịp (nhịp đọc điềm tĩnh ≈ **3.5 tiếng/giây**):

| Thời lượng | Số tiếng (âm tiết) |
|---|---|
| 40s | 125–150 |
| 60s | 190–220 |
| 75s | 235–275 |
| 90s | 290–330 |

Sau khi viết xong, đếm số tiếng của phần lời thoại và ước tính thời lượng = số tiếng ÷ 3.5. Lệch khoảng mục tiêu thì cắt/giãn. Pipeline TTS là thước đo cuối.

Viết **3–4 hook thay thế**: hook A (dùng trong `script.txt`) + 2–3 hook B/C/D cùng chủ đề nhưng khác cách vào (vd: hook con số / hook câu hỏi / hook kể chuyện). Phần thân + CTA giữ nguyên — đổi hook chỉ là thay đoạn đầu.

### Bước 5 — Xuất file

- `script.txt` — chỉ hook A + thân + CTA, lời thoại thuần, các đoạn cách nhau bằng dòng trống. Không tiêu đề, không markdown, không ghi chú.
- `brief.md` — theo `assets/script-brief-template.md`.

### Bước 6 — Tự kiểm trước khi giao

Đối chiếu checklist:
- [ ] Hook nằm trong 3s đầu, có con số / câu hỏi / tin nóng
- [ ] Đúng công thức beat của format đã chọn
- [ ] Signature là "Aloha anh chị, em Linh đây" — tự xưng luôn có "em", không trống "Linh"
- [ ] Không câu nào nói trống không — luôn có "anh chị" / tiểu từ tình thái
- [ ] Tên dự án gắn Masterise + Cao Xà Lá ở lần nhắc đầu, không gọi trơ "The Bloom"
- [ ] Liệt kê đếm "1 là, 2 là, 3 là"
- [ ] Đoạn nối bằng "Nhưng/Vì vậy"; có câu chốt đáng nhớ trước CTA
- [ ] Có con số thật, không bịa; tin đồn được gọi đúng là tin đồn
- [ ] CTA có tên "Linh Aloha" + hotline; KHÔNG có "tư vấn thật, không hối thúc"
- [ ] Không dùng từ cấm (hối thúc kiểu chợ, sáo rỗng)
- [ ] Số tiếng khớp thời lượng mục tiêu
- [ ] Chỉ một thông điệp duy nhất
- [ ] **Tiêu đề / Hook A KHÔNG là câu hỏi có/không với câu trả lời tiêu cực** ("có ngột ngạt không?", "có lo ô nhiễm không?")
- [ ] **Tiêu đề / Hook A KHÔNG chứa từ gây ác cảm** ("khôn/dại", "ngột ngạt", "ô nhiễm", "rủi ro", "lừa"...) — body được phép giải thích, tiêu đề thì không
- [ ] **Hook A có góc nhìn cá nhân em-Linh** — không phải bản tin báo chí (test nhanh: nếu thay bằng "Theo Reuters..." mà vẫn hợp lý → bị bản tin hoá → viết lại)
- [ ] Nếu chọn Format 10 — dự án **đã bàn giao / có nhà mẫu thật**; dự án off-plan thì chuyển Format 9 hoặc 7

Báo lại user: format đã dùng + thời lượng ước tính + đường dẫn 2 file, và nhắc có thể đẩy `script.txt` qua `/mkt-full-video-with-11-remotion-heygen` hoặc `/mkt-full-video-with-11-hyperframe-heygen` để dựng video.

## Lưu ý

- Skill này tái dùng được cho **mọi dự án BĐS**, không chỉ Cao Xà Lá — chỉ cần đổi dữ liệu dự án ở Bước 2. Brand voice Linh Aloha giữ nguyên.
- Brand voice + 10 format trong `references/` là bản chuẩn của skill. File `output/linh-aloha/brand-voice.md` (nếu có) là bản làm việc của user — khi hai bản lệch nhau, ưu tiên `references/` của skill.
