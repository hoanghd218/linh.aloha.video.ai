# Kinh nghiệm — mkt-plan-short-video-edit-16-9

Chỉ ghi điều đã có trong skill hoặc đọc được từ script; không bịa lỗi, không bịa số đo.

## Ví dụ vàng (dự án thật `loi-ich-claude-ai`, video kiến thức về Claude — không phải video BĐS)

Có `script.txt` + `transcript.json` của dự án đó thì `plan_visuals.py --workspace .` phải dựng lại bảng này:

| Cảnh | Vai trò | `visual_type` | Metaphor | Tier | Variant HyperFrame |
|---|---|---|---|---|---|
| 1 | hook | `before-after` | `dong-ho-cat` | 8h / 0h | tier-row |
| 2 | problem | `icon-grid` | `broken-chain` | 3× | chats-stack |
| 3 | solution | `three-pillar` | `robot-orb-with-tasks` | ∞ / 100tr / 8h | hero-orb |
| 4 | recap | `number-infographic` | `heo-dat-vo-ket-sat` | 15h | counter-row |
| 5 | cta | `icon-grid` | `gift-box-open` | AI | terminal-row |

## Điểm lệch của script cần nhớ

- **Scaffold mặc định mang nội dung Claude/AI** (items "Soạn email / Đọc tài liệu / Tổng hợp báo cáo", tier-letter `8h` / `3×` / `∞` / `15h` / `AI`, metaphor `robot-orb-with-tasks`, nhắc logo Claude, palette cam Claude khi `--brand claude`). Video BĐS Linh Aloha phải viết lại toàn bộ (SKILL.md bước 6). Palette: `--brand` chỉ có `claude · deepseek · openai · gemini · generic` — chưa có palette Linh Aloha.
- **`--llm-mode claude-api` chưa được cài**: script chỉ cảnh báo khi thiếu `ANTHROPIC_API_KEY` rồi vẫn dựng scaffold như `native`.
- **Docstring ghi `--scenes-outline <path>` nhưng `argparse` không nhận** — muốn dùng outline riêng thì đặt `scenes-outline.json` trong workspace (script tự đọc).
- **`--dry-run` không đọc `visual-plan.json` đã sửa** — chỉ dựng scaffold mới rồi in; chạy không `--dry-run` thì ghi đè tệp. Kiểm tệp đã sửa bằng `validate_plan` (SKILL.md bước 6).
- **Cần `jsonschema` mới kiểm schema đầy đủ**; thiếu thì script chỉ kiểm các khoá chính và luật `visual_type` / `metaphor` / `tier_letter`.
- **Khung ảnh `aspect`**: mặc định `16:10`; AI33 không có 16:10 nên dùng `16:9` (≈ 1344×768) — ghi trong tiêu đề `prompts.md`.
- **Bản phiên âm phải phẳng** `[{word, start, end}]`; `voiceover_segments.json` lồng nhau làm `plan_visuals.py` báo không tìm thấy transcript.
- **Ảnh chỉ ở lớp ROOT**: `<img id="broll-N">` trong `index.html`; HTML cảnh không nhúng `image-slot`.

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): thêm bảng Đầu vào → Đầu ra, luật (cổng duyệt, không tốn tiền, không ghi đè plan, scaffold chỉ là mẫu), quy trình 9 bước có "xong khi", lệnh kiểm `validate_plan` cho tệp đã sửa, `build_storyboard.py` (trước chưa ghi trong SKILL.md), `--brand`; bỏ ví dụ tóm tắt lặp với `plan-checkpoint-protocol.md`; sửa `plan-checkpoint-protocol.md` (brand `generic`, bỏ `generate_compositions.py`, bỏ bước "re-validate bằng --dry-run" gây hiểu nhầm); chuyển ví dụ vàng sang tệp này.
