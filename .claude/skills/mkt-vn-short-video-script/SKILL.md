---
name: mkt-vn-short-video-script
description: Sinh kịch bản video ngắn tiếng Việt (60–120s, TikTok/Reels/YouTube Shorts/Facebook Reels) theo BRAND VOICE riêng của từng profile. Skill brand-agnostic — voice + công thức kịch bản + chủ đề + brief template nằm trong `profiles/<name>/` (KHÔNG hard-code trong SKILL.md). Available profiles hiện có **`linh-aloha`** (Linh Aloha — Chuyên gia BĐS Hàng Hiệu, ấm áp, thẳng thắn, xưng em gọi anh chị, 10 format kịch bản BĐS/phân tích dự án/tài chính/mặt bằng/so sánh thị trường) — thêm profile mới bằng cách tạo `profiles/<name>/` với 4 file (`brand-voice.md` + `script-formulas.md` + `topic-pool.md` + `brief-template.md`). Param: `--profile <name>` (mặc định hỏi user nếu có nhiều profile, chọn duy nhất nếu chỉ có 1) + `--tts <elevenlabs|minimax>` (lưu vào metadata footer của `brief.md` để pipeline downstream biết gọi TTS skill nào không cần hỏi lại). Output 2 file: `script.txt` thuần TTS-clean + `brief.md` có 3 hook thay thế + beats + chữ on-screen + b-roll + checklist + YAML metadata footer. USE WHEN user nói 'viết kịch bản video ngắn', 'viết script video', 'tạo kịch bản TikTok', 'kịch bản Reels', 'tạo script Shorts', 'viết video Facebook Reels', 'viết kịch bản 60s', 'viết kịch bản 90s', 'tạo script 1 phút', 'viết kịch bản cho Linh Aloha', 'script Linh Aloha', 'kịch bản BĐS Linh Aloha', 'video bất động sản' — hoặc bất cứ khi nào user nhắc tên 1 profile có trong `profiles/`.
---

# Kịch bản video ngắn Việt Nam — brand-agnostic, profile-driven

Skill này biến một chủ đề thành kịch bản video ngắn **60–120 giây** hoàn chỉnh, viết đúng brand voice của profile user chọn và đúng công thức kịch bản tương ứng.

Skill **KHÔNG biết** brand voice nào — voice + công thức + topic pool + brief template nằm trong `profiles/<name>/`. Skill chỉ orchestrate: hỏi profile + TTS provider → đọc 4 file profile → viết theo đúng voice + công thức → ghi 2 file output có metadata footer cho pipeline downstream.

## Available profiles

Hiện tại có:

| Profile | Brand voice | Phù hợp chủ đề |
|---|---|---|
| `linh-aloha` | Linh Aloha — Chuyên gia BĐS Hàng Hiệu ("Sang trong sản phẩm — Ấm trong giọng nói"). Ấm áp, thẳng thắn, sắc bén về con số, xưng "em" gọi "anh chị", 10 format kịch bản BĐS chuẩn chỉnh | Bất động sản / Review dự án / Phân tích tài chính & dòng tiền / So sánh thị trường / Phân tích mặt bằng / Kinh nghiệm mua nhà |

Để xem profile có sẵn ở thời điểm chạy:

```bash
ls .claude/skills/mkt-vn-short-video-script/profiles/
```

## Output mỗi lần chạy

Ghi 2 file vào `output/<profile>/scripts/<topic-slug>/`:

1. **`script.txt`** — lời thoại thuần, sẵn sàng đẩy TTS. Chỉ chữ được đọc, không nhãn, không markdown, không từ đệm "ờ/à/uhm". Đây là input cho pipeline video downstream.
2. **`brief.md`** — bản đầy đủ: công thức đã dùng + lý do, 3 hook thay thế, kịch bản chia beat, gợi ý chữ on-screen + b-roll, checklist tự kiểm, ước tính thời lượng. Theo `profiles/<chosen>/brief-template.md`. **Cuối file** có YAML metadata footer (xem mục [TTS metadata footer](#tts-metadata-footer)).

## Quy trình

### Bước 0 — Profile + TTS selection

Trước khi viết, hỏi user 2 thông tin:

1. **Profile** (`--profile <name>`):
   - Nếu user đã nói tên profile trong câu yêu cầu (vd "viết script Linh Aloha" → `linh-aloha`) → dùng luôn, không hỏi lại.
   - Nếu user không nói VÀ chỉ có 1 profile trong `profiles/` → dùng profile đó, báo lại 1 dòng "Đang dùng profile `<name>`".
   - Nếu user không nói VÀ có nhiều profile → hỏi 1 câu liệt kê các profile có sẵn (đọc từ `ls profiles/`), ngắn gọn, không dồn.

2. **TTS provider** (`--tts <elevenlabs|minimax>`):
   - Default suggest theo profile (xem `profiles/<name>/brand-voice.md` — nhiều profile có note "voice mặc định: minimax/elevenlabs"). VD: `linh-aloha` mặc định `elevenlabs`; profile khác có thể mặc định `minimax`.
   - Nếu user không nói + profile không có note → hỏi user "Phase TTS sau dùng ElevenLabs hay MiniMax?" (1 câu, default value rõ ràng).
   - Hợp lệ: `elevenlabs` hoặc `minimax`. Khác → reject.

Save 2 giá trị này → cài vào YAML metadata footer của `brief.md` ở Bước 4.

### Bước 1 — Đọc 4 file của profile (BẮT BUỘC trước khi viết)

Đọc HẾT 4 file dưới đây — voice nằm TRONG file, không phải trong trí nhớ:

- `profiles/<chosen>/brand-voice.md` — chất giọng, xưng hô, từ nên dùng / tránh, câu signature, CTA pattern
- `profiles/<chosen>/script-formulas.md` — bộ công thức (chuỗi beat) + ví dụ tham chiếu + câu mẫu mồi
- `profiles/<chosen>/topic-pool.md` — chủ đề gợi ý chia trục, dùng khi user bí ý tưởng
- `profiles/<chosen>/brief-template.md` — template `brief.md` xuất ở Bước 4

Nếu thiếu bất kỳ file nào → STOP, báo user "Profile `<name>` thiếu file `<file>`. Tạo file đó hoặc chọn profile khác." (xem [Failure modes](#failure-modes)).

KHÔNG viết kịch bản theo trí nhớ — luôn mở 4 file trên để bám sát. Giọng sai = hỏng thương hiệu.

### Bước 2 — Thu thập chủ đề + chọn công thức

Cần biết: **chủ đề/góc video**, **thời lượng mục tiêu** (mặc định ~90s).

- Nếu user chưa nói rõ chủ đề → hỏi 1 câu gọn, có thể đề xuất 2-3 ý từ `topic-pool.md` của profile.
- Nếu user đã chỉ định công thức cụ thể → dùng đúng nó.
- Nếu chưa → chọn công thức hợp nhất với chủ đề theo bảng mapping trong `script-formulas.md`, nói rõ **1 câu vì sao**, rồi viết luôn (user có thể đổi nếu muốn — không cần dừng chờ duyệt mỗi lần).

### Bước 3 — Viết kịch bản

Bám **đúng chuỗi beat** của công thức đã chọn trong `profiles/<chosen>/script-formulas.md`. Với mỗi beat, viết bằng giọng profile (theo `brand-voice.md`).

Quy tắc chung (chi tiết hơn nằm trong `brand-voice.md` của từng profile — đây là tầng giao thoa):

- **Hook chạm trong 3s đầu.** Vào thẳng nỗi đau / câu hỏi / khẳng định. KHÔNG mở "Xin chào", KHÔNG tự giới thiệu danh xưng (cài vào beat 2-3 sau khi đã hook xong).
- **Tự xưng theo profile.** `brand-voice.md` của mỗi profile khai báo cách tự xưng (vd `linh-aloha` → luôn có "em", "em Linh", "em Linh Aloha", gọi "anh chị"). KHÔNG đổi xưng hô tự ý.
- **Gọi khán giả theo profile.** Tương tự — `brand-voice.md` định nghĩa rõ.
- **Vũ khí ngôn ngữ đặc trưng** (anaphora / câu kép đối lập / imagery cụ thể / forward consequence / brand maxim / action count): theo định nghĩa trong `brand-voice.md` + `script-formulas.md` của profile. Mỗi profile có bộ vũ khí riêng — đừng port pattern của profile này sang profile khác.
- **CTA theo profile.** Mỗi profile có pattern CTA riêng (mềm / cứng / có hotline / không hotline). Bám đúng pattern khai báo trong `brand-voice.md`.
- **Tránh từ cấm.** Mỗi profile có list từ cấm riêng — đọc kỹ trong `brand-voice.md`.

Độ dài — bám nhịp đọc tiêu chuẩn (tùy profile có thể chỉnh trong `brand-voice.md`):

| Thời lượng | Số tiếng (âm tiết) — nhịp chậm 3.3 t/s | Số tiếng — nhịp trung bình 3.6 t/s |
|---|---|---|
| 60s | 180–210 | 200–230 |
| 75s | 230–260 | 250–280 |
| 90s | 280–310 | 310–340 |
| 105s | 320–360 | 360–390 |
| 120s | 370–410 | 410–440 |

Nhịp đọc mặc định lấy từ `brand-voice.md` của profile (nếu khai báo). Nếu không khai báo → dùng 3.3 t/s (chậm + emotional) cho safety.

Sau khi viết xong, đếm số tiếng phần lời thoại và ước tính thời lượng = số tiếng ÷ nhịp. Lệch khoảng mục tiêu thì cắt/giãn.

Viết **3 hook thay thế** (hook A đi vào `script.txt`, hook B + C ghi vào `brief.md`). Phần thân + CTA giữ nguyên — đổi hook chỉ là thay đoạn đầu.

### Bước 4 — Xuất file

Thư mục output: `output/<profile>/scripts/<topic-slug>/`

- **`script.txt`** — chỉ hook A + thân + CTA, lời thoại thuần, các đoạn cách nhau bằng dòng trống. Không tiêu đề, không markdown, không ghi chú, không dấu " " quanh quote (TTS đọc cả dấu ngoặc kép). Không số dạng "1.234" / "28,8" — viết chữ.
- **`brief.md`** — theo `profiles/<chosen>/brief-template.md`, FILL placeholders, GIỮ NGUYÊN cấu trúc section. **Append YAML metadata footer ở CUỐI file** (xem mục dưới).

### Bước 5 — Tự kiểm trước khi giao

Đối chiếu checklist trong `brief-template.md` của profile (mỗi profile có checklist riêng — ví dụ `linh-aloha` check "tự xưng có chữ em", "tên dự án gắn mỏ neo Masterise Cao Xà Lá", "không nói trống không", "liệt kê đếm 1 là 2 là"). Đọc to `script.txt` 1 lần — nghe có giống đúng người dẫn của profile đang nói không. Sai giọng = viết lại.

Báo lại user: profile + công thức + thời lượng ước tính + đường dẫn 2 file + TTS provider đã ghi trong metadata footer + tên pipeline downstream phù hợp.

## TTS metadata footer

Cuối `brief.md` PHẢI có YAML metadata block (template tham chiếu: `assets/tts-provider-block-template.md`):

```markdown
---
tts_provider: elevenlabs       # hoặc "minimax"
profile: linh-aloha           # tên profile đã dùng
---
```

Pipeline orchestrator downstream (vd `mkt-full-video-with-11-remotion-heygen`, `mkt-full-video-with-11-hyperframe-heygen`) đọc block này để biết:
- Gọi TTS skill nào ở Phase 1 (`mkt-elevenlabs-tts-to-mp3` nếu `elevenlabs`, `mkt-video-script-to-mp3` nếu `minimax`)
- Brand voice nào để apply aesthetic override ở Phase 3 (vd `linh-aloha` → aesthetic broker luxury; profile khác → etc.)

→ Sau khi sinh `script.txt` xong, user (hoặc orchestrator) **KHÔNG cần hỏi lại** TTS provider — đọc thẳng từ footer.

## Adding a new profile

Để thêm 1 brand voice mới:

1. Tạo thư mục `profiles/<new-name>/`
2. Copy cấu trúc 4 file từ `profiles/linh-aloha/` làm template:
   ```bash
   cp -r .claude/skills/mkt-vn-short-video-script/profiles/linh-aloha \
         .claude/skills/mkt-vn-short-video-script/profiles/<new-name>
   ```
3. Rewrite 4 file cho brand mới:
   - `brand-voice.md` — xưng hô, tone, từ cấm/ưu tiên, signature, CTA pattern, **nhịp đọc mặc định** (tiếng/giây), **TTS provider mặc định** (note rõ "TTS mặc định: minimax/elevenlabs" để Bước 0 đọc được)
   - `script-formulas.md` — bộ công thức (chuỗi beat) đặc trưng + ví dụ thực + câu mẫu mồi
   - `topic-pool.md` — chủ đề gợi ý chia trục
   - `brief-template.md` — template `brief.md`, có checklist tự kiểm riêng cho brand
4. (Tuỳ chọn) thêm 1 dòng vào bảng "Available profiles" trong SKILL.md này
5. Test: chạy skill với `--profile <new-name>`, viết 1 script thử, đối chiếu với video mẫu của brand

KHÔNG cần sửa SKILL.md mỗi lần thêm profile — skill tự đọc thư mục `profiles/` runtime.

## Failure modes

| Triệu chứng | Hành động |
|---|---|
| User chưa chỉ định profile + có nhiều profile | Hỏi 1 câu liệt kê tên profile có sẵn (`ls profiles/`), default suggest theo context nếu đoán được |
| User chỉ định profile không tồn tại | STOP. Báo: "Không tìm thấy profile `<name>` trong `profiles/`. Profile có sẵn: <list>." Đề xuất tạo mới theo [Adding a new profile](#adding-a-new-profile) |
| Profile thiếu 1 trong 4 file bắt buộc | STOP. Báo: "Profile `<name>` thiếu `<file>`. Profile phải có đủ 4 file: brand-voice.md / script-formulas.md / topic-pool.md / brief-template.md." |
| `--tts` không phải `elevenlabs` hoặc `minimax` | STOP. Báo: "TTS provider không hợp lệ. Chọn `elevenlabs` hoặc `minimax`." |
| Script user yêu cầu sai brand voice (vd tự xưng "Linh" thiếu "em" trong khi profile linh-aloha bắt luôn có "em") | Cảnh báo + đề xuất sửa — nhưng vẫn xuất, ghi note trong `brief.md` "Cảnh báo brand voice: ..." |
| Chủ đề user đưa không phù hợp profile (vd chủ đề tâm lý chữa lành đưa profile linh-aloha BĐS) | Cảnh báo + đề xuất chuyển profile khác hoặc reframe chủ đề. Không tự viết lệch giọng |
| Script vượt 5000 ký tự (TTS cap) | Đề xuất user split semantic thành 2-3 segment, mỗi cái 1 script.txt riêng |
| `output/<profile>/scripts/<slug>/` đã tồn tại | Hỏi user: overwrite hay tạo slug mới với suffix `-v2` |
| Số tiếng chênh > 20% so với thời lượng mục tiêu | Tự cắt/giãn rồi báo user "Đã chỉnh từ X → Y tiếng để khớp Z giây" |

## Reference pipelines downstream

Sau khi có `script.txt` + `brief.md`, pipeline downstream đọc YAML footer để biết route tiếp:

| Profile | Pipeline 9:16 phù hợp | Pipeline 16:9 phù hợp |
|---|---|---|
| `linh-aloha` | `/mkt-full-video-with-11-remotion-heygen` hoặc `/mkt-full-video-with-11-hyperframe-heygen` | `/mkt-full-video-with-11-hyperframe-heygen-16-9` |

Orchestrator pipeline KHÔNG hỏi lại TTS provider — đọc thẳng từ `tts_provider:` trong footer.

## Lưu ý

- Skill này **brand-agnostic** — voice + công thức + chủ đề + checklist nằm trong `profiles/<name>/`. SKILL.md chỉ orchestrate flow, KHÔNG hard-code brand-specific rule.
- Mỗi profile có ràng buộc voice riêng — đọc CẢ 4 file của profile trước khi viết, không viết theo trí nhớ.
- TTS provider được lưu vào metadata footer của `brief.md` để pipeline downstream tự biết, KHÔNG hỏi lại user.
- Khi user yêu cầu brand voice mới chưa có profile → đề xuất tạo profile mới theo cấu trúc linh-aloha, KHÔNG ép giọng profile cũ.
