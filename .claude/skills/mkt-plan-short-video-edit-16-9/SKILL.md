---
name: mkt-plan-short-video-edit-16-9
description: Lập kế hoạch visual cho video LANDSCAPE 16:9 (1920×1080) talking-head + slide: đọc `script.txt` + `transcript.json` → `visual-plan.json` (mỗi cảnh 1 trong 15 dạng Visual Thinking + 1 metaphor trong thư viện 25 hình vẽ tay + tier-letter ≤ 5 ký tự + PIP) và `prompts.md` (prompt ảnh cream-paper dán vào AI33 / Nano Banana Pro). Slide chỉ chữ bị loại. Chạy GIỮA mkt-full-video-with-11-hyperframe-heygen-16-9 và mkt-hyperframe-talking-head-video-16-9. Dùng khi Hoàng nói "plan visual cho video 16:9", "plan b-roll", "plan slide visual thinking", "lên kế hoạch visual hyperframes", "tạo visual-plan.json", "infographic plan", "lên plan slide cho video keynote", "lên kế hoạch trực quan video editorial". Không dùng cho video dọc 9:16 (→ mkt-edit-video-bds-linh-hoat), ảnh b-roll KIE (→ mkt-kie-broll-image-generator), dựng / render (→ mkt-hyperframe-talking-head-video-16-9).
argument-hint: "[--workspace workspace/content/YYYY-MM-DD/<slug>] [--brand generic]"
---

# mkt-plan-short-video-edit-16-9

Phiên bản: v1.1 — 2026-11-11

Bộ lập kế hoạch hai lớp cho slide video 16:9:

1. **Lớp cấu trúc (15 dạng Visual Thinking)** — bố cục slide: Before-After, Mind Map, Flowchart, Matrix 2×2, Venn, Timeline, Pyramid, Comparison Table, Iceberg, Cycle, Funnel, Concept Map, Icon Grid, Number Infographic, 3-Pillar. Chọn theo vai trò của cảnh (hook → before-after, problem → icon-grid, solution → 3-pillar…).
2. **Lớp minh hoạ (25 metaphor)** — hình vẽ tay nền giấy kem đặt *trong* cấu trúc: đồng hồ cát, broken-chain, robot-orb, heo đất vỡ, ốc sên ↔ tên lửa, lego ghép, bậc thang, key-fits-lock, mountain-summit…

Kế hoạch thay cho việc điền tay ở checkpoint `scenes-outline`, và lặp lại được.

| Đầu vào (trong thư mục workspace `$W`) | Đầu ra |
|---|---|
| `script.txt` · `transcript.json` dạng phẳng `[{word, start, end}]` (hoặc `transcript-cleaned.json`) · tuỳ chọn `scenes-outline.json` | `visual-plan.json` — mỗi cảnh: `visual_type` + `metaphor` + `tier_letter` + `items[]` + `badges[]` + `pip_events[]` |
| | `prompts.md` — prompt cream-paper đánh số `1.png`, `2.png`…: chỉ thị cấu trúc + metaphor + tiêu đề / phụ đề tiếng Việt, sẵn sàng dán vào AI33 / Nano Banana Pro |
| | `scenes.json` (qua `apply_plan_to_scenes.py`) — dạng editor đọc được |
| | `storyboard.html` (tuỳ chọn, qua `build_storyboard.py`) — mỗi cảnh một thẻ để Hoàng duyệt bằng mắt |

Tóm tắt schema (bản đủ: `assets/templates/visual-plan.schema.json`):
```
{ workspace_slug, total_duration, brand,
  scenes: [{ id, num, kind, variant, start, end, kicker, heading, accent_words[], voiceover_anchor,
    tier_letter,                 // ≤ 5 ký tự: "8h" / "0h" / "∞" / "100tr" / "AI"
    items[], badges[],
    broll: [{ kind: "infographic-cream-paper",
      visual_type,               // 1 trong 15 — references/visual-thinking-types.md
      metaphor,                  // 1 trong 25 — references/visual-thinking-library.md (hoặc "none")
      title_vi, subtitle_vi, palette_accents[], layout_description, placeholder_filename, aspect }],
    pip_events: [{ t_in, t_out, trigger }] }] }
```

## Luật — không được phá

1. **Cổng duyệt** — chưa có "OK" của Hoàng ở checkpoint (bước 8) thì không chạy `apply_plan_to_scenes.py` và không bàn giao sang editor; kể cả khi orchestrator đặt `auto_scenes=true` vẫn in bản tóm tắt 3 dòng để Hoàng chặn được. Hỏi kèm a / b / c, mỗi lượt một thay đổi.
2. **Không tốn tiền ở bước này** — chỉ chạy script local. `--llm-mode claude-api` chưa được cài trong script (chỉ cảnh báo rồi chạy như `native`) — luôn dùng `native`; Claude Code tự sửa scaffold. Sinh ảnh từ `prompts.md` (AI33 / Nano Banana Pro / KIE) tốn tiền → việc của bước sau, hỏi Hoàng trước.
3. **Mỗi b-roll `infographic-cream-paper` phải có cả `visual_type` (1/15) và `metaphor` (1/25, hoặc `"none"` cho sơ đồ thuần cấu trúc)** — slide chỉ chữ bị loại.
4. **`tier_letter` ≤ 5 ký tự**; PIP không chồng nhau, cách ≥ 0,3 giây.
5. **Tiêu đề tiếng Việt đủ dấu**; tên thương hiệu và ký hiệu toán giữ nguyên tiếng Anh.
6. **Scaffold chỉ là nội dung mẫu** — phải viết lại theo script thật (bước 6) trước khi duyệt hay giao fan-out. Số liệu (giá, diện tích, tiến độ, pháp lý, chính sách) lấy từ script/brief, không bịa; số minh hoạ phải nói rõ là minh hoạ.
7. **Báo Hoàng bằng bản tóm tắt markdown**, không dán JSON thô.
8. **Không ghi đè `visual-plan.json` đã sửa** — `plan_visuals.py` chạy lại không kèm `--dry-run` sẽ ghi đè bằng scaffold mới; đã có tệp thì hỏi Hoàng (giữ bản cũ đổi tên `visual-plan.v1.json` · ghi đè · dừng).
9. **Xong thì báo đường dẫn tệp ra + số đo thật** (số cảnh, tổng giây, số b-roll); chưa chạy kiểm schema thì không nói "xong".

## Quy trình

Đặt `K=.claude/skills/mkt-plan-short-video-edit-16-9` · `W=workspace/content/YYYY-MM-DD/<slug>`. Windows: dùng `python` thay `python3`; `render_infographic_prompts.py` cần `pip install jinja2`.

### 1. Chia cảnh và chạy scaffold
```bash
python3 $K/scripts/plan_visuals.py --workspace $W --brand generic        # thêm --dry-run để chỉ in, không ghi
```
Outline cảnh lấy theo thứ tự: `scenes-outline.json` có sẵn → `detect_scenes.py` của editor (nếu có) → mặc định 5 cảnh (hook → problem → solution → recap → cta). Script có `--brand claude|deepseek|openai|gemini|generic` (mặc định `claude` = palette cam Claude); repo Linh Aloha chưa có palette riêng nên dùng `generic` rồi chỉnh `palette_accents` ở bước 6.
**Listicle:** script 1 hook + N mẹo + 1 CTA → N+2 cảnh, đặt `kind: "tip-1"`…`"tip-N"` (N = 3..7, tối đa 10); editor mount thành `compositions/scene-{num}.html` bất kể N (không đụng tên `fs-lesson-1` / `recap-card`).
**Xong khi** in `visual-plan.json — N scenes, total Ts` và không có `VALIDATION ERRORS`.

### 2. Chọn `visual_type` cho từng cảnh
Tra [references/visual-thinking-types.md](references/visual-thinking-types.md); mặc định theo vai trò cảnh:

| Vai trò | `visual_type` mặc định | Dự phòng |
|---|---|---|
| hook | `before-after` | `number-infographic` |
| problem / fail | `icon-grid` | `iceberg` |
| pivot | `before-after` | `flowchart` |
| solution | `three-pillar` | `flowchart` |
| differentiator | `comparison-table` | `venn` |
| proof / result | `number-infographic` | `comparison-table` |
| recap | `number-infographic` | `mind-map` |
| cta | `icon-grid` | `three-pillar` |

Cây quyết định vai trò → variant → metaphor gợi ý: [references/scene-archetype-pattern-mapping.md](references/scene-archetype-pattern-mapping.md).

### 3. Chọn `metaphor`
Tra [references/visual-thinking-library.md](references/visual-thinking-library.md) (25 mục). Chọn hình nằm tự nhiên trong cấu trúc đã chọn (before-after + `dong-ho-cat`, three-pillar + `robot-orb-with-tasks`, number-infographic + `heo-dat-vo-ket-sat`). Đặt `"none"` khi sơ đồ thuần cấu trúc dễ đọc hơn (vd `comparison-table` các dấu tích tính năng).

### 4. Rút `tier_letter`, `items`, `badges`
Quy tắc chọn glyph: [references/tier-letter-selection-rules.md](references/tier-letter-selection-rules.md). Số + đơn vị thắng (`8h`, `100tr`, `15h`); ký hiệu được (`∞`, `→`, `×`); tối đa 5 ký tự.

### 5. Tính PIP
Mặc định 1 cửa sổ mỗi cảnh: `t_in = scene_start + 1,4 s`, `t_out = t_in + 3,5 s` (không quá `scene_end − 0,3 s`). Cảnh dài ≥ 12 giây (thường là solution) có 2 cửa sổ. Hook không có PIP.

### 6. Viết lại scaffold theo script thật (bắt buộc — luật 6)
Scaffold là mẫu chung ("Soạn email / Đọc tài liệu / Tổng hợp báo cáo", tier-letter `8h`→`0h`, metaphor `robot-orb-with-tasks`, logo Claude…), không liên quan nội dung thật; giao fan-out từ bản thô thì cảnh nào cũng chung chung. Với mỗi cảnh, đè 6 trường bằng nội dung rút từ `script.txt`:
- `tier_letter` — số / từ khoá chốt của cảnh (vd `94%`, `30h`, `+45%`, `3`, `AI`)
- `accent_words` — từ khoá tô gradient trong heading
- `items[]` — 2–4 dòng `{icon, label}` đúng ý cảnh (không để "Soạn email")
- `badges[]` — 1–2 chip góc `{color, icon, label, num, pos}` cho số chứng minh / rủi ro
- `broll[0].metaphor` — slug riêng của cảnh (vd `scroll-tape-burn-vs-return`, `pacific-vs-vietnam-timezone`), không để metaphor mặc định chung
- `broll[0].title_vi`, `subtitle_vi`, `layout_description` (chỉ dẫn vẽ cụ thể, tiếng Việt), `decorative_elements`, `palette_accents`

Sửa bằng Edit trực tiếp `visual-plan.json` (hoặc đoạn Python ghi lại cả tệp), giữ đúng schema. **Hợp đồng với bước sau:** orchestrator `mkt-full-video-with-11-hyperframe-heygen-16-9` không gọi `generate_compositions.py` (bộ sinh Jinja2 đã bỏ) mà giao N sub-agent `general-purpose`, mỗi cảnh một agent, tự viết `compositions/scene-{num}.html` chỉ từ khối cảnh trong `visual-plan.json` — nên khối cảnh phải **tự đủ**: kicker, heading, accent_words, tier_letter, items, badges, metaphor kèm `layout_description`, `pip_events` (giờ tương đối + tuyệt đối). `metaphor` và `layout_description` được chép thẳng vào prompt sub-agent: mô tả càng giàu, cảnh càng hay. Ảnh chỉ nằm ở lớp ROOT (`<img id="broll-N">` trong `index.html`); HTML cảnh **không** nhúng `image-slot` — nhắc rõ điều này trong prompt sub-agent.
Kiểm lại tệp đã sửa (lưu ý: `plan_visuals.py --dry-run` chỉ dựng lại scaffold mới từ transcript, **không** đọc `visual-plan.json` đã sửa):
```bash
python3 -c "import json,sys; sys.path.insert(0,'$K/scripts'); import plan_visuals as p; e=p.validate_plan(json.load(open('$W/visual-plan.json',encoding='utf-8'))); print('OK' if not e else '\n'.join(e))"
```
**Xong khi** không còn nội dung mẫu chung trong `visual-plan.json` và lệnh trên in `OK`.

### 7. Dựng `prompts.md`
```bash
python3 $K/scripts/render_infographic_prompts.py --workspace $W
```
Đi qua `visual-plan.json`, đặt chỉ thị `visual_type` lên đầu mỗi prompt rồi chồng metaphor + chi tiết trang trí + bảng màu → prompt cream-paper dán được ngay. **Chạy lại sau mọi lần đổi metaphor / tiêu đề** — không thì `prompts.md` giữ prompt cũ và ảnh sinh ra lệch plan.
**Xong khi** `prompts.md` có đủ một prompt cho mỗi b-roll và khớp bản đã chỉnh.

### 8. Checkpoint với Hoàng
Trình bản tóm tắt markdown (không JSON thô); mẫu, cách xử lý từng kiểu sửa ("đổi scene N metaphor…", "gộp scene N+M"…) và các điều cấm ở [references/plan-checkpoint-protocol.md](references/plan-checkpoint-protocol.md). Muốn Hoàng xem bằng mắt: `python3 $K/scripts/build_storyboard.py --workspace $W [--video source.mp4]` → `storyboard.html` (mở bằng trình duyệt, không cần thư viện ngoài).
**Xong khi** Hoàng trả lời "OK".

### 9. Chốt và bàn giao
```bash
python3 $K/scripts/apply_plan_to_scenes.py --workspace $W      # → scenes.json cho editor
```
Báo: `visual-plan.json` ✓ · `prompts.md` ✓ (K prompt b-roll) · `scenes.json` ✓; bước sau là `mkt-hyperframe-talking-head-video-16-9` (do orchestrator điều phối). Ảnh `1.png`…`N.png` đặt cùng thư mục `$W`; editor tự nhận khi tệp xuất hiện.

## Cấu trúc skill

```
mkt-plan-short-video-edit-16-9/
├── SKILL.md
├── scripts/
│   ├── plan_visuals.py                  ← CHÍNH: --workspace <dir> [--brand …] [--dry-run]
│   ├── render_infographic_prompts.py    ← visual-plan.json → prompts.md (cần jinja2)
│   ├── apply_plan_to_scenes.py          ← visual-plan.json → scenes.json
│   └── build_storyboard.py              ← visual-plan.json → storyboard.html
├── assets/templates/
│   ├── visual-plan.schema.json          ← JSON Schema (visual_type + metaphor bắt buộc)
│   └── infographic-prompt.j2            ← Jinja: chỉ thị cấu trúc + metaphor + bảng màu
└── references/
    ├── visual-thinking-types.md         ← 15 dạng cấu trúc (lăng kính chính)
    ├── visual-thinking-library.md       ← 25 metaphor (lớp minh hoạ)
    ├── tier-letter-selection-rules.md   ← chọn glyph
    ├── scene-archetype-pattern-mapping.md ← vai trò cảnh → variant + metaphor
    ├── plan-checkpoint-protocol.md      ← mẫu tóm tắt + xử lý các kiểu sửa
    └── kinh-nghiem.md                   ← ví dụ vàng, điểm lệch của script, nhật ký
```

## Lỗi hay gặp

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| `Neither transcript-cleaned.json nor transcript.json found` | Chưa có bản phiên âm **phẳng** `[{word, start, end}]`. Whisper của editor (`mkt-hyperframe-talking-head-video-16-9/scripts/transcribe_audio.py`) có thể chỉ ra `voiceover_segments.json` (lồng) → làm phẳng theo đoạn code ở Phase 3a của `mkt-full-video-with-11-hyperframe-heygen-16-9` |
| `VALIDATION ERRORS` | Thiếu `visual_type` / `metaphor`, `tier_letter` > 5 ký tự, PIP chồng → sửa trong `visual-plan.json`, chạy lại lệnh kiểm ở bước 6 |
| Metaphor hiện `custom` + `TODO: title` | Metaphor không có trong thư viện → chọn mục thật ở `visual-thinking-library.md` |
| `jinja2 missing` | `pip install jinja2` rồi chạy lại bước 7 |
| `prompts.md` còn prompt cũ | Quên chạy lại bước 7 sau khi đổi metaphor |

## Cải tiến skill
Gặp lỗi mới hoặc Hoàng đổi cách duyệt → ghi vào [references/kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*, sửa đúng một chỗ (script · reference · tệp này).

## Liên quan
- Đứng trước: `mkt-full-video-with-11-hyperframe-heygen-16-9` (orchestrator; Phase 3b gọi skill này) · phiên âm (`transcript.json`) · `mkt-linh-aloha-bds-video-script` (lời thoại; giọng "em", "anh chị", "Aloha anh chị, em Linh đây" thuộc skill đó — plan này không viết lại lời).
- Đứng sau: `mkt-hyperframe-talking-head-video-16-9` (editor đọc `visual-plan.json` / `scenes.json`).
- Ảnh từ `prompts.md`: hiện dán thủ công vào AI33 / Nano Banana Pro; `mkt-kie-broll-image-generator` là skill KIE cho ảnh b-roll không gian — chưa được thiết kế cho prompt cream-paper của skill này.
- Video dọc 9:16: `mkt-edit-video-bds-linh-hoat` (kế hoạch dựng theo lời) · `mkt-hyperframe-knowledge-video-heygen-9-16-lite`.
