# Brief thiết kế: Web hệ thống kinh doanh BĐS cho môi giới (tham khảo Realtor OS)

> Tài liệu để giao cho ChatGPT hoặc người thiết kế vẽ giao diện. AI soạn ngày 21/11/2026, Hoàng duyệt.
> **Nguồn tính năng**, ghi rõ để biết cái nào đã thấy tận mắt, cái nào mới là lời giới thiệu:
> - 👁️ **Đã thấy trên màn hình** trong buổi dạy 70 phút về Realtor OS, hoặc trong video học viên Ngọc Lâm mở hệ thống thật của mình (blog vungoclam.com, trang bảng giá, Google Ads, Facebook Ads, CRM).
> - 🗣️ **Chỉ nghe kể**, chưa thấy giao diện. Phần này người thiết kế được tự đề xuất.
>
> Ảnh tham khảo:
> - `../kenh-mau/ngoc-lam-bds/anh-showcase/`: trang bảng giá, Google Ads, Facebook Ads, CRM
> - blog thật: https://vungoclam.com
> - trang bảng giá thật: https://vungoclam.com/anzen-residences/

---

## 0 · Sản phẩm này là gì

Một web app cho **môi giới BĐS** (bản cá nhân) và **sàn, đội sale** (bản doanh nghiệp). Web app gom mọi việc kinh doanh vào một chỗ: đặt mục tiêu → hiểu khách → làm nội dung → đăng lên các kênh → thu khách về → chăm khách → chốt. AI (Claude) làm phần lớn việc lặp lại. Môi giới chỉ quay video, gặp khách và chốt.

**Người dùng:**
- **Môi giới** (chủ tài khoản cá nhân): dùng điện thoại nhiều, ít rành công nghệ.
- **Trưởng nhóm, chủ sàn** (bản doanh nghiệp): xem cả đội, chia khách, xếp hạng sale.
- **Sale trong đội**: nhận khách, cập nhật trạng thái.
- **Khách mua nhà**: chỉ thấy phần web công khai (blog, trang dự án, trang quà, form).

**Khung tư duy (dùng làm thanh điều hướng chính):** nửa trên là **La bàn** (4 ô định hướng), nửa dưới là **5 hệ thống**: Nội dung → Traffic (phân phối) → Thu lead → Chuyển đổi → Nhân sự. "Đầu ra của khối này là đầu vào của khối kia."

---

## 1 · Phần quản trị (môi giới đăng nhập)

### 1.1 Bảng điều khiển · Mục tiêu tài chính 👁️
Web app tính ngược mục tiêu ra số khách cần có.
- **Ô nhập:** mục tiêu lợi nhuận 12 tháng tới · giá bán trung bình một căn · lợi nhuận trung bình một giao dịch.
- **Ô tự đo từ CRM** (môi giới không nhập tay): tỷ lệ chốt hiện tại · số lần mua trung bình của một khách · **số khách tiềm năng cần có**.
- Kèm thẻ báo cáo: khách mới tuần này, lịch hẹn, cọc, nguồn khách nhiều nhất.
- Tab con: **Báo cáo** · **Cấu hình** · **Kết nối** (xem mục 1.10).
- Bản doanh nghiệp có thêm ô **Chấm điểm sale** (mục 1.9).

### 1.2 La bàn · Bộ nhớ riêng cho AI 👁️
Nơi chứa mọi dữ liệu để AI đọc trước khi làm việc. Mỗi ngăn là một thư mục.
- **Mục tiêu tài chính:** liên kết với mục 1.1.
- **Sản phẩm chủ lực:** mỗi dự án một thư mục (giá, chính sách, mặt bằng, ảnh, pháp lý). Kèm 3 câu tự kiểm: giúp đạt mục tiêu không · có nhu cầu thật không · nếu có tiền mình có mua không.
- **Khách hàng lý tưởng:** chân dung từng nhóm khách. Kèm thư mục **Dữ liệu thô** chia hai ngăn **Khách đã mua** và **Khách chưa mua** (đoạn chat, video quay cùng khách, ghi chú). AI rút ra: vấn đề · rào cản · niềm tin sai · động lực mua.
- **Định vị thương hiệu:** số điện thoại, hotline, logo, mã màu, mô tả ngắn, giọng nói, tầm nhìn (bản công ty). AI dùng đồng nhất cho mọi ấn phẩm.
- Bản nâng cao 🗣️: AI đọc thẳng Zalo, CRM (chạy trên máy chủ ảo).

### 1.3 Hệ thống Nội dung 👁️ + 🗣️
- **Kế hoạch nội dung 90 ngày** 👁️: lịch theo tuần, mỗi video gắn 1 trong 3 tầng: **Thu hút** (chú ý) · **Dẫn dắt** (gỡ từ chối, tạo niềm tin) · **Chuyển đổi** (bán). Bảng dạng cột tuần × dòng video, có màu theo tầng.
- **Chuỗi trợ lý AI**, mỗi trợ lý một việc 🗣️: quét địa bàn (hội nhóm Facebook, báo chí) → phân tích khách → lập kế hoạch 90 ngày → viết kịch bản theo giọng của môi giới. Lệnh mẫu: "đọc La bàn và lên kế hoạch 90 ngày".
- **Kịch bản:** AI viết khung, người sửa (trạng thái nháp → đã duyệt → đã quay).
- **Dựng video bằng AI** 👁️ (Claude cài sẵn các kỹ năng dựng): cắt đoạn thừa, hiệu ứng, phụ đề, sửa chỗ nói sai số. Hàng chờ: đang dựng → xong → chờ đăng.
- **Cắt video dài thành Shorts:** mỗi Short một ý, tiêu đề riêng (học viên cắt 5–25 Shorts từ một video dài).

### 1.4 Hệ thống Traffic (phân phối) 👁️
- **Tự đăng** 👁️ lên YouTube → Facebook, TikTok, website. Màn hình gồm lịch đăng, trạng thái từng kênh, link bài đã đăng.
- **Video → bài blog tự động** 👁️: video lên YouTube → AI lấy lời → viết bài chuẩn SEO → đăng lên website. Chạy theo lịch trên máy chủ ảo; học viên đăng bài cùng ngày với video.
- **Video ngắn → bài ảnh Facebook** 🗣️.
- **3 loại traffic** hiển thị thành 3 thẻ: **Miễn phí** (đăng bài) · **Trả phí** (quảng cáo, mục 1.7) · **Sở hữu** (nhóm Zalo, danh sách số điện thoại, email).

### 1.5 Hệ thống Thu lead · Quà tặng 👁️
- **Thư viện quà** (lead magnet, tức quà đổi lấy thông tin khách), mỗi quà gắn một chân dung và một thời điểm dự án (chưa có giá → "nhận thông tin chủ đầu tư công bố"; có giá → quỹ căn, bản đồ quy hoạch, bảng tính lãi vay).
  - Ví dụ thấy trong video: "Top 50 căn nhà dòng tiền đáng mua nhất Đà Nẵng", "Bản đồ quy hoạch Vinhomes Olympic cập nhật mới nhất", "Danh sách 20 căn nhà phố đẹp nhất Đống Đa".
- **AI tạo trang quà** trong vài phút (mục 2.3).
- **Link ghim:** tạo link ngắn để gắn vào mô tả video, bình luận ghim, lời nói trong video. Kèm thống kê lượt bấm.
- Tuỳ chọn **bán quà giá nhỏ** để lọc khách thật lòng 🗣️.

### 1.6 CRM · Quản lý khách 👁️
- **Bảng cột (pipeline), kéo thả.** Cột mặc định thấy trên màn hình: **Lead mới → Đã liên hệ → Đã hẹn gặp → Đã đi xem → Đang tư vấn**. Thêm 🗣️: **Đã cọc · Đã mua · Không tiềm năng**. Môi giới **tự thêm bớt cột**.
- **Thẻ khách:** tên · số điện thoại · **nguồn** (TikTok / Facebook / YouTube / Zalo / Google / blog, đo tự động nhờ mã theo dõi) · **nhãn loại căn** (căn hộ / liền kề / shophouse — thấy trên màn hình) · khu vực · mua để (ở / đầu tư / cả hai) · ngân sách · khi nào mua · ghi chú · lịch sử chăm sóc.
- **Nhắc chăm sóc** theo lịch; **email + Zalo tự động nhắn** khi khách vừa điền form 👁️ (thấy trong video giới thiệu).
- **Chống quên khách:** cảnh báo khách cũ lâu chưa liên hệ (chuyện "khách cũ mua của đồng nghiệp mới biết").
- **Báo cáo nguồn:** khách đến từ nền tảng nào → nên đẩy quảng cáo nền tảng nào.

### 1.7 Quảng cáo do AI chạy 👁️
- **Google Ads** 👁️: danh sách từ khoá (ví dụ "chung cư hải phòng", "căn hộ hải phòng", "bán căn hộ hải phòng") với chi phí, số lần bấm, tỷ lệ bấm; mẫu quảng cáo đang chạy; biểu đồ 30 ngày.
- **Facebook Ads** 👁️: chiến dịch · kết quả (ví dụ trên màn hình: 35 khách) · chi phí mỗi khách (khoảng 25.027 đ) · bật/tắt · thử nghiệm A/B.
- **Vòng ngược** 👁️/🗣️: AI lấy 3 nhóm trong CRM (**đã mua · đã cọc · đang đàm phán**) làm tệp mẫu để quảng cáo tìm người giống; AI đọc chân dung khách trong CRM sau 1–2 ngày rồi tối ưu lại quảng cáo.
- Chỉ đẩy tiền cho video, quà đã tự ra khách.

### 1.8 Hệ thống Chuyển đổi · 5 phễu 🗣️
Mỗi phễu một trang quản lý: danh sách khách được mời, lịch, trạng thái.
1. **Cố vấn 1-1:** giới hạn số suất mỗi tháng, tặng hoặc thu phí.
2. **Sự kiện online (Zoom kín):** thu trước câu hỏi của khách, biết ai vào và ở lại bao lâu.
3. **Sự kiện offline.**
4. **Video bán hàng một bài** (sales letter): một video gom lợi ích và xử lý từ chối.
5. **Dẫn khách xem dự án (site tour).**

### 1.9 Bản doanh nghiệp · Chia khách và chấm điểm sale 👁️
- **Chia lead tự động:** khách mới tự giao cho sale A. **5 phút** không nhận thì chuyển sang sale B, sale A bị **trừ điểm**.
- **Chấm điểm và xếp hạng sale** theo tỷ lệ hẹn gặp · tỷ lệ chốt · số giao dịch. Bảng xếp hạng, sale điểm cao được ưu tiên nhận khách.
- Quản lý đội: thêm sale, phân quyền, xem pipeline từng người.

### 1.10 Kết nối và cấu hình 👁️
Thẻ kết nối: YouTube · Facebook (trang + quảng cáo) · TikTok · Zalo · Google Ads · website/blog · email · máy chủ ảo chạy trợ lý. Mỗi thẻ hiển thị trạng thái đã nối / chưa nối và nút sửa.

### 1.11 Nhân sự và trợ lý 🗣️
Danh sách **trợ lý AI**, mỗi trợ lý một việc: quét địa bàn, kịch bản, dựng, đăng, blog, quảng cáo, chăm khách. Bên cạnh là **con người** (sale, cố vấn) và **cộng đồng**.

---

## 2 · Phần công khai (khách mua nhà thấy)

### 2.1 Trang chủ blog 👁️ (mẫu: vungoclam.com)
- Danh sách bài mới: ảnh lớn + tiêu đề dạng câu hỏi + 1 đoạn tóm tắt có số.
- Chia 3 mảng: **Hạ tầng – quy hoạch** · **Dự án đang bán** · **Trước khi mua** (pháp lý, hợp đồng, tài chính).
- Trang giới thiệu: "Công việc của em là…", nguồn thông tin, các kênh (YouTube, Facebook, TikTok), nút "Nhắn Zalo trao đổi", dòng miễn trừ "không phải lời khuyên đầu tư".

### 2.2 Trang bài viết 👁️
Bố cục từ trên xuống:
1. Ảnh đầu bài có chú thích.
2. Đoạn mở.
3. Các mục H2 dạng câu hỏi.
4. Bảng số liệu, ảnh sơ đồ có chú thích, nguồn có link.
5. **Câu hỏi thường gặp.**
6. **Bài viết liên quan.**
7. **Video gốc** nhúng cuối bài.
8. **Form tư vấn:**
   - Tiêu đề: *"Anh chị đang tìm căn thế nào?"*
   - Mô tả: *"Anh chị cho em vài ý, em chọn sẵn những căn phù hợp rồi gửi lại."*
   - 3 câu bấm chọn: **Mua để** (ở / đầu tư / cả hai) · **Ngân sách** (dưới 3 tỷ / 3–6 tỷ / trên 6 tỷ / chưa rõ) · **Khi nào** (trong 1 tháng / 1–3 tháng / chưa vội), ghi chú "có thể bỏ qua".
   - Ô nhập: họ tên* · số điện thoại* · dặn thêm.
   - Nút: **"Nhờ em [tên] chọn giúp"**.
   - Kèm: "Hoặc nhắn trực tiếp Zalo …" · cam kết "chỉ giới thiệu căn thực sự phù hợp", "thông tin được giữ kín".
   - Có ô chống spam ẩn.
9. Nút Zalo nổi.

### 2.3 Trang dự án · Bảng giá 👁️ (mẫu: vungoclam.com/anzen-residences/)
- Thanh menu riêng của dự án: Tổng quan · Vị trí · Phối cảnh · Căn hộ · Tính giá · Mặt bằng · Tiện ích · Tiến độ.
- Phần đầu: dòng nhỏ chủ đầu tư → tiêu đề lớn tên dự án + vị trí → đoạn mô tả ngắn.
- **Form nổi bên phải:**
  - Tiêu đề: *"Nhận bảng giá tháng này — bảng giá từng căn và chính sách gửi qua Zalo trong 5 phút"*
  - Ô nhập: họ tên · số điện thoại · email nhận bảng giá · loại căn quan tâm
  - Nút: **"Gửi cho tôi bảng giá"**
  - Dưới nút: ✓ Miễn phí · ✓ Gửi trong 5 phút · ✓ Không gọi làm phiền
- Thanh số liệu: ví dụ "887 căn · 1,49 ha đất dự án · 3.200 m² sân vườn".
- Nút gọi và nút Zalo.

### 2.4 Trang quà tặng 👁️ (mẫu: "Danh sách 20 căn nhà phố đẹp nhất Đống Đa")
- Dòng nhỏ khu vực → tiêu đề cụ thể → 4 dấu tích lợi ích (ví dụ: ngõ ô tô tránh · sổ riêng chính chủ · đã kiểm quy hoạch · khoảng giá 20–60 tỷ).
- Form: họ tên · số điện thoại (Zalo) · khoảng giá quan tâm · nhu cầu mua.
- Nút: **"Gửi tôi danh sách qua Zalo"**.

### 2.5 Công cụ tính 👁️ (mẫu: vungoclam.com/nha-xay-tho/)
Tính các khoản phải trả ngoài giá nhà khi nhận nhà thô (kênh mẫu liệt kê 9 khoản). Kết quả hiện thành bảng, có nút "gửi bảng này qua Zalo".

---

## 3 · Luồng chính cần vẽ

1. **Khách:** xem video (YouTube / Facebook / TikTok) → bấm link mô tả → bài blog hoặc trang dự án → điền form (3 câu + tên + số) → nhận Zalo, email tự động trong 5 phút.
2. **Hệ thống:** form đổ vào CRM ở cột "Lead mới", ghi sẵn nguồn và nhãn loại căn → (bản doanh nghiệp) chia sale, đếm 5 phút → nhắc chăm.
3. **Môi giới:** mở thẻ khách → gọi, nhắn → kéo thẻ "Đã liên hệ → Đã hẹn gặp → Đã đi xem → Đang tư vấn → Đã cọc".
4. **AI:** mỗi 1–2 ngày đọc CRM → cập nhật chân dung khách → tối ưu quảng cáo Google, Facebook → đề xuất chủ đề video tuần sau.
5. **Nội dung:** La bàn → kế hoạch 90 ngày → kịch bản → quay → AI dựng → tự đăng → tự viết blog → cắt Shorts.

## 4 · Dữ liệu chính

- **Khách:** id, tên, sđt, email, nguồn, chiến dịch, mua để, ngân sách, khi nào, loại căn, dự án quan tâm, khu vực, giai đoạn pipeline, sale phụ trách, lịch sử, ghi chú, ngày tạo
- **Dự án:** tên, chủ đầu tư, vị trí, loại căn, bảng giá theo tháng, chính sách, mặt bằng, ảnh, tiến độ, pháp lý
- **Nội dung:** video, tầng (thu hút / dẫn dắt / chuyển đổi), chân dung đích, kịch bản, trạng thái, link từng kênh, bài blog, Shorts con, lượt xem, số khách sinh ra
- **Quà:** tên, chân dung, thời điểm dự án, trang, link ngắn, lượt bấm, số khách
- **Quảng cáo:** nền tảng, chiến dịch, từ khoá, chi phí, kết quả, chi phí mỗi khách
- **Sale** (bản doanh nghiệp): điểm, tỷ lệ hẹn, tỷ lệ chốt, số giao dịch, số khách bị chuyển do quá 5 phút

## 5 · Danh sách màn hình cần thiết kế

**Quản trị:**
1. Đăng nhập
2. Bảng điều khiển + mục tiêu tài chính
3. La bàn: 4 ngăn + dữ liệu thô khách
4. Kế hoạch 90 ngày
5. Kịch bản
6. Hàng chờ dựng, đăng
7. Lịch đăng đa kênh
8. Thư viện quà + trình tạo trang quà
9. CRM bảng cột
10. Thẻ khách chi tiết
11. Báo cáo nguồn khách
12. Google Ads
13. Facebook Ads
14. 5 phễu chuyển đổi
15. Chấm điểm + xếp hạng sale (doanh nghiệp)
16. Quản lý đội
17. Kết nối, cấu hình
18. Trợ lý AI

**Công khai:**
19. Trang chủ blog
20. Bài viết + form tư vấn
21. Trang dự án, bảng giá
22. Trang quà tặng
23. Công cụ tính nhà thô
24. Trang giới thiệu

## 6 · Ghi chú cho người thiết kế

- **Ưu tiên điện thoại:** môi giới cập nhật CRM ngay ở dự án. Bảng cột trên điện thoại cuộn ngang được.
- Toàn bộ chữ **tiếng Việt, câu ngắn, xưng "em", gọi khách "anh chị"** ở phần công khai.
- Phần công khai **sang, thoáng, nhiều ảnh thật**. Mọi số liệu có dòng nguồn. Có dòng miễn trừ "không phải lời khuyên đầu tư".
- **Không dùng tên, logo Realtor OS hay vungoclam.com trong bản thiết kế.** Đây chỉ là mẫu tham khảo. Nếu làm cho chị Linh thì theo thương hiệu Linh Aloha (logo, ảnh, mã QR trong `workspace/assets/brand/`).
- Phần 🗣️ chưa thấy giao diện thật, người thiết kế được tự đề xuất bố cục.
