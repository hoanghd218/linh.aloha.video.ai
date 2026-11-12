# B-roll insert full-screen — mẫu, luật khớp ngữ cảnh, layout

Đọc khi: có ảnh/video b-roll từ người dùng và cần quyết chèn ở đâu, hoặc dựng `compositions/broll-NN.html`.

## Mẫu composition

Dùng thưa: 1–3 insert / video 60s, mỗi cái 2–5s, tổng ~6–15s (10–25%). Quá nhiều thì avatar biến mất, người xem mất điểm tựa.

```html
<template id="broll-01-template">
  <div data-composition-id="broll-01" data-start="0" data-width="1080" data-height="1920">
    <style>
      [data-composition-id="broll-01"] {
        width: 100%; height: 100%;
        position: relative; overflow: hidden;
        background: #000;
      }
      [data-composition-id="broll-01"] .broll-img {
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        animation: kb 6s ease-in-out infinite alternate;
      }
      @keyframes kb {
        from { transform: scale(1.04); }
        to   { transform: scale(1.12); }
      }
      [data-composition-id="broll-01"] .broll-text {
        position: absolute; bottom: 380px; left: 50%;
        transform: translateX(-50%);
        max-width: 960px;                   /* TRẦN CỨNG — như overlay punch */
        text-align: center;
        font-family: 'Be Vietnam Pro', sans-serif;
        font-size: 140px; font-weight: 900;  /* mặc định — fitText() co nếu cần */
        line-height: 0.95;
        word-break: keep-all;
        overflow-wrap: break-word;
        text-transform: uppercase;
        color: #fff;
        -webkit-text-stroke: 6px #000;
        paint-order: stroke fill;
        text-shadow: 0 8px 24px rgba(0,0,0,0.5);
      }
    </style>
    <img class="broll-img" src="../broll/facade.jpg" alt="" />
    <div class="broll-text">LUMIÈRE BLOOM</div>

    <script>
      // Cùng cơ chế fitText như overlay punch — chặn tràn ngang với chuỗi dài.
      (function(){
        function fitText(el, maxWidth, maxFs, minFs, step){
          let fs = maxFs; el.style.fontSize = fs+'px';
          const saved = el.style.maxWidth;
          el.style.maxWidth = 'none'; el.style.whiteSpace = 'nowrap';
          while (el.scrollWidth > maxWidth && fs > minFs) { fs -= step; el.style.fontSize = fs+'px'; }
          el.style.maxWidth = saved || (maxWidth+'px'); el.style.whiteSpace = '';
        }
        function run(){
          const el = document.querySelector('[data-composition-id="broll-01"] .broll-text');
          if (el) fitText(el, 960, 180, 70, 4);
        }
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); else run();
      })();
    </script>
  </div>
</template>
```

Tên tệp ảnh trong `broll/` phải ASCII (`facade.jpg`, không `Ảnh facade dự án.jpg` — 404 lúc render).

## Luật khớp ngữ cảnh (BẮT BUỘC)

**Chất lượng hơn số lượng. Để trống avatar còn hơn chèn b-roll lạc đề.** Mỗi insert phải khớp ĐÚNG điều người nói ở thời điểm đó.

1. Mở `transcript-cleaned.json`, tìm từ được nói trong cửa sổ b-roll (`data-start` đến `data-start + data-duration`).
2. Hỏi: ảnh có thể hiện đúng nghĩa lời nói không? Nghiêm khắc.
3. CÓ → chèn. KHÔNG → bỏ, để avatar gánh.

| Ngữ cảnh lời nói | Chèn? | Loại ảnh hợp |
|---|---|---|
| Lộ tên thương hiệu (dự án / chủ đầu tư) | CÓ | Mặt tiền / facade / drone tổng thể |
| Vị trí / đất / địa chỉ ("đất vàng", "lõi Nguyễn Trãi") | CÓ | Drone / tổng thể / bản đồ khu vực |
| Số toà / cấu trúc ("10 tòa", "8 tòa căn hộ") | CÓ | Kiến trúc / facade thấy các toà |
| Định vị cao cấp ("hàng hiệu", "cao cấp") | CÓ | Sảnh / lounge / thư viện / tiện ích cao cấp |
| Nhắc căn / nội thất ("một căn", "căn hộ") | CÓ | Ảnh nội thất (phòng khách / ngủ / bếp) |
| Nhắc tiện ích ("bể bơi", "phòng gym", "khu vui chơi") | CÓ | Đúng tiện ích đó |
| **Giá / so sánh giá** ("120tr/m²", "so với Royal City", "hợp lý hơn") | **KHÔNG** | Giá không có hình tương ứng — bỏ |
| **Quá khứ** ("ba mươi năm trước", "ngày xưa") | **KHÔNG** trừ khi có ảnh cũ | Ảnh hiện đại KHÔNG bao giờ hợp bối cảnh lịch sử |
| **CTA** ("Bình luận BLOOM", "inbox em") | **KHÔNG** | Dồn vào avatar / overlay CTA |
| **Mở bài / nhá thương hiệu chung chung** ("Cái tên ai cũng biết") | **KHÔNG** | Để hook thở bằng avatar |
| **Khái niệm trừu tượng** ("hợp lý", "tốt nhất", "khởi điểm") | **KHÔNG** | Không có hình tương ứng |

Bẫy lạc đề hay gặp:
- Nội thất khi đang so giá (cảnh phòng khách 4PN lúc nói "so với Royal City") → GỠ
- Gym / sân chơi khi nói giá ("giá khởi điểm tốt nhất") → GỠ
- Clubhouse khi nói số toà ("8 tòa") → ĐỔI sang kiến trúc / facade
- Sảnh khi nói đất ("đất vàng cuối cùng") → ĐỔI sang tổng thể / drone
- Ảnh phối cảnh hiện đại khi nói chuyện lịch sử → GỠ hẳn

Quy trình khi dựng b-roll:
1. Đọc cả transcript trước, gắn nhãn ngữ cảnh từng khoảnh khắc theo bảng trên.
2. Liệt kê ảnh hiện có, gắn nhãn nội dung từng ảnh.
3. Chỉ ghép ảnh vào khoảnh khắc khớp. KHÔNG lấp im lặng bằng b-roll ngẫu nhiên cho "đa dạng".
4. Video 60s kiểu broker-creator thường ra 5–10 insert tổng 12–25s, không phải 30s — như vậy là đúng.
5. Nếu mục tiêu thời lượng b-roll (ví dụ "50% video") không đạt nổi bằng ảnh khớp → hạ mục tiêu, không nhét ảnh sai.

## Layout: full-screen takeover là MẶC ĐỊNH (luật cứng)

Ảnh phủ 1080×1920, avatar biến mất trong cửa sổ insert 2–5s rồi quay lại.

CẤM:
- **top-strip** (ảnh ở `top: 0`) — che mặt avatar cận cảnh. KHÔNG BAO GIỜ.
- **Bottom-strip giữ > 50% video** — người dùng từng từ chối: ra thành kiểu split-screen, không còn là broker-creator. Cần > 3 bottom-strip thì đổi sang full-screen takeover.
- **Side-strip / PIP / split-screen** — là thẩm mỹ khác (xem `mkt-hyperframe-talking-head-video`).

`bottom-strip` (hiếm, tối đa 1–2 / video) chỉ khi người nói đang **chỉ vào thứ nhìn thấy mà vẫn phải ở trên hình** ("nhìn vào mặt bằng tầng này" → mặt bằng hiện bên dưới). Thông số:

```css
[data-composition-id="broll-XX"] {
  width: 100%; height: 100%;
  position: relative; overflow: hidden;
  background: transparent;             /* avatar lộ ra ở 60% phía trên */
}
[data-composition-id="broll-XX"] .strip {
  position: absolute;
  left: 0; bottom: 0;
  width: 1080px;
  height: 768px;                       /* tối đa 40% của 1920 */
  overflow: hidden;
  background: #000;
  box-shadow: 0 -12px 32px rgba(0,0,0,0.55);
}
```

Hoạt ảnh: `gsap.fromTo(strip, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.40, ease: 'power3.out' })`.

Cây quyết định cho từng b-roll:
1. Người nói chỉ vào thứ nhìn thấy và vẫn phải ở trên hình? → `bottom-strip` (tối đa 1–2).
2. Chỉ là lộ thương hiệu / vị trí / tiện ích? → `full-screen takeover` (mặc định).
3. Mặt avatar phải luôn hiện suốt video, không b-roll? → bỏ insert.

Kiểm: `npx hyperframes snapshot` ở các mốc b-roll trước khi render — xác nhận full-screen thay avatar sạch và bottom-strip (nếu có) không cắt mặt.
