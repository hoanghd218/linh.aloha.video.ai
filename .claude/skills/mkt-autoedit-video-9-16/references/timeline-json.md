# Định dạng `timeline.json` (mục 10 của CLAUDE.md gốc, nguyên văn)

Mẫu đầy đủ: `assets/mau/timeline_mau.json`.

```json
{
  "preset": "xanh_gradient",
  "source": "input/video.MOV",
  "output": {"name": "ten_v1", "size": [1080, 1920], "fps": 30, "language": "vi"},
  "cuts_original_seconds": [[8.24, 8.58]],
  "duration_after_cut": 39.1,
  "scenes": [
    {"id": "s1", "t_in": 0.0, "t_out": 6.0, "effect": "typo_fire",
     "caption": "lời hiển thị", "data": {"lines": ["ĐỪNG MUA SKILL", "nếu thiếu"], "count_up": {"from": 0, "to": 5}}},
    {"id": "s2", "t_in": 6.0, "t_out": 12.0, "effect": "chart_bars", "group": "g1",
     "data": {"title": "BIỂU ĐỒ", "data": [{"label": "2024", "value": "ĐIỀN"}], "highlight": 4}}
  ],
  "captions": {"off_ranges_after_cut": [[24.0, 32.0]]},
  "audio": {"music": null, "sfx": null, "duck_music_under_voice": true}
}
```
- Mốc giây theo video đã cắt. Trường chưa có dữ liệu ghi `"ĐIỀN"` (Claude Code phải hỏi, không tự bịa). Cảnh cùng `group` = một cụm hiệu ứng liên tục.
