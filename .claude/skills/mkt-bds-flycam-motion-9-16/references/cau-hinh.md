# Cấu hình video.json

Mẫu đầy đủ: `template/video.mau.json` (= #01). Mọi mốc tính bằng giây **trên giọng đã giãn** (`assets/audio/voice.wav`); xem mốc khối trong `nguon/moc.json`.

| Khoá | Ý nghĩa | Mặc định |
|---|---|---|
| `slug` | tên dự án, tên tệp render | do tao_du_an.sh đặt |
| `kho` | thư mục kho cảnh có `chi-muc.csv`; nhận `~` và `*` (vd `~/Library/CloudStorage/GoogleDrive-*/My Drive/Chị Linh/Kho cảnh …`) | — (bắt buộc) |
| `brand` | `{name, tag, avatar}` nhãn góc trên + end card | `LINH ALOHA`, `BĐS HÀNG HIỆU`, `assets/img/linh.jpg` |
| `voice`, `moc` | giọng đã giãn, mốc khối | `assets/audio/voice.wav`, `nguon/moc.json` |
| `duration` | ép thời lượng (chỉ dùng khi thử) | đo từ giọng |
| `bgm` | `{file, volume}` | `bgm-duck.wav`, 0.34 |
| `scenes[]` | `{at, src, ss, c0, c1, tr, blur, max}` | xem dưới |
| `hook` | `{until, setup[], big, strike, kicker, boxes[], counter{label,to,unit}, times{}}`; `null` = bỏ | mốc theo #01, co giãn theo `until/6.6` |
| `hud` | `{from, to, total}` đồng hồ + thanh tiến độ | from 3.55, to = cta.at, total = thời lượng làm tròn 5 s |
| `zones[]` | `{at, until, title, sub, mm}` nhãn "ĐIỂM 0n / 0N" + mini-map | — |
| `tags[]` | `[chữ, từ, đến]` thẻ chi tiết (y 1150) | — |
| `credits[]` | `[chữ, từ, đến]` dòng ghi nguồn (y 1458) | — |
| `captions` | `{khối: "cụm | cụm [từ khoá]"}` | tự chia nếu không có `|` |
| `syl` | số âm tiết của từ ngoại (Ocean: 2…) | có sẵn vài từ |
| `recap` | `{at, map, lines[{text, at, kw_at, size s/l/m}]}`; `null` = bỏ | lines cách nhau 1,5 s |
| `cta` | `{at, lead[], lead_at[], keyword, keyword_at, line, line_at, hotline, zalo, contact_at, footer}` | lead "Inbox em Linh chữ", keyword_at = at+1.15, contact_at = line_at+0.35 |
| `extra_sfx[]` | `[tệp, t, dài, âm lượng, media_start?]` | — |

## scenes
- `at`: giây cảnh bắt đầu thấy rõ (đặt trên lưới 0,6 s / 2,4 s của nhạc). Clip thật bắt đầu sớm `PRE=0.25` s để chuyển cảnh, kéo dài thêm `POST=0.12` s sau cảnh kế.
- `src`: mã trong `chi-muc.csv` (vd `OP099`). `ss`: giây bắt đầu trong clip nguồn.
- `c0`, `c1`: tâm khung 9:16 theo chiều ngang (0 = trái, 1 = phải) ở đầu/cuối clip, tạo lia ngang. Chọn sau khi xem tờ soát.
- `tr`: `zoom` (phóng + mờ), `whip` (quét ngang), `whipU` (quét dọc), `fade`. Cảnh đầu không có.
- `blur: true`: làm mờ + tối (nền end card). `max`: giới hạn độ dài (clip nguồn ngắn).

## Mốc nên giữ (từ #01, 60 s)
Hook 0–6,6 · mỗi khu 4–6 s · recap ~5 s trước CTA · CTA ≥ 5 s tới cuối. Câu cuối cần ≥ 2 s trên màn hình (check báo `line_unread`).

## Hotline / Zalo
`"hotline": ""` và `"zalo": ""` → không hiện dòng liên hệ (build cảnh báo: brand Linh mời "gọi hotline trên màn hình"). Có số → dòng "Hotline … · Zalo …" màu vàng champagne dưới dòng `line` (hai số trùng nhau thì ghi "Hotline … · Zalo"), footer dịch xuống y 1350. **Chỉ dùng số chị Linh cung cấp** — không lấy từ ví dụ, không tự bịa.
