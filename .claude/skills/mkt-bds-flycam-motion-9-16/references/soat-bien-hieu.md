# Soát biển hiệu / logo bên thứ ba (bước 4)

`cat_clip.py` tạo `kiem/bien-hieu-N.jpg`, mỗi dòng một cảnh:
- Cột 1: khung gốc 16:9 giữa đoạn; **khung vàng** = vùng 9:16 được giữ.
- Cột 2–4: khung 9:16 thật ở đầu · giữa · cuối clip.

Cách soát:
1. Mở từng tờ bằng công cụ xem ảnh; nhìn cột 2–4 (cột 1 chỉ để biết còn gì ngoài khung).
2. Liệt kê mọi chữ/logo **đọc được**: tên cửa hàng, thương hiệu, biển quảng cáo, logo nhà phát triển/đối tác, số điện thoại, watermark kênh nguồn.
3. Ghi quyết định vào `kiem/bien-hieu.md`:
   - `doi-tam`: dịch `c0/c1` cho biển ra ngoài khung (ưu tiên).
   - `doi-doan`: đổi `ss` sang đoạn không có biển.
   - `che-nhan`: để nhãn khu/thẻ/phụ đề đè đúng vị trí biển trong thời gian biển hiện.
   - `chap-nhan`: biển nhỏ, mờ, không nổi bật, hoặc là địa danh công cộng (tên dự án, Vincom khi đang giới thiệu tiện ích). Ghi lý do và nêu trong báo cáo bàn giao.
4. Cột `chu_logo` của chỉ mục chỉ là gợi ý; chỉ mục ghi `khong` vẫn phải xem.
5. Sửa xong chạy lại `cat_clip.py` (bảng cũ được giữ, bảng mới ghi `bien-hieu.moi.md`).

Watermark/logo kênh nguồn trong khung: không chấp nhận, đổi tâm hoặc đổi cảnh.
