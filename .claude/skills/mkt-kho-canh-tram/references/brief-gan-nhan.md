# Brief gắn nhãn cảnh (gửi cho từng nhóm video)

Thay {DU_AN}, {MA_DU_AN}, {PHAN_KHU}, {WORK}, {VIDS}, {TAG} trước khi gửi.

Bạn đang chọn cảnh trám (B-roll) cho kho cảnh bất động sản {DU_AN}. Video nguồn ở {WORK}/src/<id>.mp4. Contact sheet (6 cột, mốc phút:giây màu vàng góc trái trên) ở {WORK}/sheets/<id>_NN.jpg. Mốc chuyển cảnh thô (giây) ở {WORK}/cuts/<id>.txt (hay sót cảnh hoà tan, cần kiểm khung). Tiêu đề/ngày đăng/kênh ở {WORK}/titles.tsv.

Video của bạn: {VIDS}

1. Xem từng contact sheet bằng Read (ảnh). Cần ranh giới chính xác thì trích khung: `ffmpeg -v error -ss 123 -i {WORK}/src/ID.mp4 -frames:v 1 -vf scale=480:-2 /tmp/kc_{TAG}_x.jpg` rồi Read. Không ghi file vào src.
2. Chọn đoạn dùng được: 4–12 giây (flycam lia dài liên tục tới 20 giây), nằm trọn trong một cảnh, không dính chuyển cảnh.
3. BỎ: người nói vào máy, bảng giá/chữ to/bản đồ đồ hoạ, màn đen, cảnh rung mờ, intro/outro logo. Cảnh tốt có logo/chữ nhỏ vẫn chọn, ghi cột chu_logo.
4. Video >5 phút: 8–15 đoạn; video ngắn: 2–6 đoạn. Không chọn nhiều đoạn gần giống nhau.
5. nhom (một trong): flycam-toan-canh, vinh-bien-ho-tao-song, song-ho-mat-nuoc, cong-vien-canh-quan, tien-ich-the-thao-ho-boi, truong-hoc-y-te-tttm, duong-noi-khu-giao-thong, ha-tang-ket-noi-xung-quanh, lien-ke-biet-thu, shophouse-pho-thuong-mai, chung-cu-cao-tang, nha-mau-noi-that, doi-song-cu-dan, ban-dem, tien-do-xay-dung, phoi-canh-3d, le-tet-su-kien.
6. du_an: một trong {MA_DU_AN}. phan_khu chỉ khi chắc chắn (gợi ý: {PHAN_KHU}), không chắc ghi "khong-ro". Không đoán bừa.

Ghi {WORK}/labels_{TAG}.tsv (UTF-8, tab), dòng tiêu đề:
src_id	t0	t1	du_an	phan_khu	nhom	ten	tags	mo_ta	thuc_te_hay_phoi_canh	chu_logo	chat_luong
- t0,t1 giây thập phân; ten tiếng Việt có dấu ≤8 từ; tags không dấu nối gạch, phân cách dấu phẩy; mo_ta 1 câu; thuc_te_hay_phoi_canh: thuc-te/phoi-canh; chu_logo: khong/logo-goc-trai/logo-goc-phai/chu-nho/phu-de/so-dien-thoai/bang-chu; chat_luong: tot/kha.
- Không có tab hay xuống dòng trong ô. Trả lời ngắn: số đoạn mỗi video, vấn đề gặp phải.
