# Prompt tạo bảng concept

Công cụ: image_gen tích hợp, không dùng CLI/API riêng. Ngày: 30/09/2026.

Ảnh đầu vào: PHỐI CẢNH/PHỐI CẢNH BÊN NGOÀI/1.jpg, 4.jpg, Ảnh tiểu cảnh thác suối.jpg trong thư mục dự án.

Đầu ra: BA-HUONG-HINH-ANH.png — bảng 3 hướng hình ảnh để duyệt thiết kế. Đã xem kết quả: tiêu đề, CTA và chú thích AI đọc được; ảnh giữ các mô-típ từ phối cảnh nguồn. Công cụ có tái diễn giải một số chi tiết ảnh, vì vậy bản đăng cần dùng ảnh gốc và dựng chữ riêng.

## Prompt đầy đủ

```text
Use case: ads-marketing.
Create ONE polished wide landscape creative direction board showing THREE flat rectangular portrait 4:5 social post concepts side by side with generous ivory gutters, no devices, no mockup perspective. Vietnamese real estate content brainstorm for Hanoi Seasons Garden. Top board heading verbatim: "BA HƯỚNG NỘI DUNG". Small subtitle: "Hanoi Seasons Garden • Đề xuất hình ảnh".
Input 1 is the supplied sunset curved apartment balcony architectural render, use as photo panel in the RIGHT card. Input 2 is the supplied illuminated gold waterfall entrance render at night, use as photo panel in the LEFT card. Input 3 is the supplied garden stream and sculpture render, use as photo panel in the CENTER card. These are supporting source inserts, not license to invent project geometry. Keep each recognisable source composition and architecture faithful; crop tastefully, do not add new buildings, features, people or floor plans. Do not hallucinate brand logos. The supplied architectural views are illustrative renders, never real construction photos.
LEFT CARD: deep midnight blue with warm champagne gold, cinematic night entrance photo covering most of card. Small eyebrow "01 / KHOẢNH KHẮC VỀ NHÀ". Large elegant high contrast headline in spacious serif typography verbatim: "Về nhà,\nchậm lại một nhịp". Small CTA at base "Nhắn KHÔNG GIAN nhận bộ phối cảnh".
CENTER CARD: forest green and warm ivory, garden photo. Eyebrow "02 / NHỊP SỐNG TRONG VƯỜN". Large editorial serif headline verbatim "Một khoảng dừng\ngiữa nhịp phố". CTA "Nhắn GIA ĐÌNH nhận checklist chọn nhà".
RIGHT CARD: warm ivory and bronze, sunset curved balcony photo. Eyebrow "03 / CHỌN CĂN CÓ GU". Large refined serif headline verbatim "Căn góc:\nđẹp và hợp?". CTA "Nhắn CĂN GÓC nhận tiêu chí lựa chọn".
Each card has small plain-text project name "HANOI SEASONS GARDEN". Include legible bottom disclosure on each "Ý tưởng thiết kế • AI minh họa". A footer across the whole board reads "Mẫu định hướng nội dung — không phải ảnh hiện trạng". Refined premium editorial real estate design, correct Vietnamese diacritics, excellent readability, ample whitespace, no fake statistics, no prices, no availability promises, no claims about actual views or completion. This is a creative review board, not a finished official project advertisement.
```

