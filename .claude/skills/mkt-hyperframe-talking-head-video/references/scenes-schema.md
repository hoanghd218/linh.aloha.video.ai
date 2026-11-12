# scenes.json — cấu trúc

Đọc khi: chạy `detect_scenes.py`, hoặc viết / sửa `scenes.json` bằng tay cho `scaffold_infographic_v2.py` và `generate_root_index.py`. Schema nội dung (`content`) của từng `mockup_variant` nằm ở `infographic-design-system.md`.

## 1. Đầu ra của `detect_scenes.py` (chưa có variant / content)

Script tìm trong transcript các dấu mốc: "Bài học đầu tiên / thứ 2 / thứ 3 / thứ N" → cảnh `lesson`; "Tips số 1 / Tip 1 / Số 1" → cảnh tip; "Tổng kết lại / Recap / Kết luận" → `recap`; "Comment / Đăng ký / Like / Theo dõi" → `cta`.

```json
{
  "type": "lessons",
  "scenes": [
    { "kind": "lesson", "num": 1, "start": 9.4, "end": 13.0, "kicker": "Bài học #1", "heading": "..." },
    { "kind": "lesson", "num": 2, "start": 34.5, "end": 38.0 },
    { "kind": "lesson", "num": 3, "start": 61.5, "end": 65.5 },
    { "kind": "recap", "start": 84.9, "end": 99.0 },
    { "kind": "cta", "start": 99.0, "end": 106.94 }
  ]
}
```

Không tìm ra cấu trúc rõ (vlog tự do): đưa kết quả cho người dùng xác nhận; họ có thể ghi đè mốc thời gian.

## 2. Bản đầy đủ cho `scaffold_infographic_v2.py`

Mỗi cảnh thêm `mockup_variant` + `content` (+ tuỳ chọn `badges`, `accent_words`):

```json
{
  "scenes": [
    {
      "kind": "lesson",
      "num": 1,
      "start": 12.71,
      "end": 26.40,
      "kicker": "Tư vấn AI",
      "heading": "Tư vấn AI cho 1 ngành",
      "accent_words": [2],
      "mockup_variant": "post-stack",
      "content": { "posts": [] },
      "badges": [
        { "pos": "tr", "color": "orange", "icon": "📅", "num": "30", "label": "Ngày" }
      ]
    },
    { "kind": "recap", "mockup_variant": "team-grid", "content": {} },
    { "kind": "cta", "mockup_variant": "comment-box", "content": {} }
  ]
}
```

Bản dùng với `generate_root_index.py` (bố cục chia đôi màn hình) cần thêm cho mỗi cảnh: `brollEnd` (mốc b-roll gỡ ra, lấy từ chỗ BẮT ĐẦU câu chốt cuối cảnh — không đặt máy móc 1.4s) và `hasBreath: true` (mặt toàn khung ở cuối cảnh); cấp tệp thêm `total_duration`.

```json
{
  "total_duration": 108.92,
  "scenes": [
    { "kind": "lesson", "num": 1, "start": 12.71, "end": 26.40, "brollEnd": 24.90, "hasBreath": true },
    { "kind": "recap", "start": 92.59, "end": 103.20, "brollEnd": 99.00, "hasBreath": true },
    { "kind": "cta", "start": 103.40, "end": 108.92, "brollEnd": 105.40, "hasBreath": true }
  ]
}
```

## 3. Gán b-roll của người dùng

```
[
  { path: "alphabet-screenshot.png", purpose: "Bài học 1 — Alphabet ship beta" },
  { path: "clock-icon.mp4",         purpose: "Bài học 2 — minh họa 24h" },
  { path: "team-meeting.png",       purpose: "Bài học 3 — bỏ rào cản team" }
]
```

- Mỗi b-roll khớp 1 cảnh theo chữ "Bài học N" trong `purpose`.
- Ảnh → nền toàn màn hình của cảnh đó (thay cho cảnh chỉ có chữ); video → nền toàn màn hình hoặc picture-in-picture (mặc định toàn màn hình).
- Hiệu ứng mặc định của cảnh (vòng xung, góc, quét sáng…) vẫn xếp LÊN TRÊN ảnh/video b-roll.
- Không có b-roll thì dùng cảnh chỉ có chữ do script sinh (tiêu đề + số lớn + dòng phụ).
- Tên tệp b-roll ASCII.
