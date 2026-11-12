---
name: mkt-vn-short-video-script
description: Engine viết kịch bản video ngắn tiếng Việt (TikTok / Reels / Shorts / Facebook Reels) chạy theo profile thương hiệu `profiles/<name>/` — chủ đề + `--profile <name>` + `--tts <elevenlabs|minimax>` → `script.txt` (lời thoại thuần cho TTS) + `brief.md` (hook thay thế, beat, b-roll, checklist, footer `tts_provider`). Profile có sẵn `linh-aloha`. Dùng khi user nói 'viết kịch bản video ngắn', 'viết script video', 'tạo kịch bản TikTok', 'kịch bản Reels', 'tạo script Shorts', 'viết video Facebook Reels', 'viết kịch bản 60s', 'viết kịch bản 90s', 'tạo script 1 phút', nhắc tên một profile, hoặc muốn thêm profile thương hiệu mới. Không dùng khi chỉ cần kịch bản BĐS giọng Linh Aloha không kèm `--profile` / `--tts` ('script Linh Aloha', 'kịch bản BĐS Linh Aloha', 'video bất động sản' → mkt-linh-aloha-bds-video-script), tạo giọng đọc (→ mkt-elevenlabs-tts-to-mp3, mkt-video-script-to-mp3).
argument-hint: "[chủ đề] [--profile <name>] [--tts elevenlabs|minimax]"
---

# Kịch bản video ngắn tiếng Việt — engine theo profile

Phiên bản: v1.1 — 2026-11-11

Skill **không biết** brand nào: voice, công thức, kho chủ đề và mẫu brief nằm trong `profiles/<name>/`. Skill chỉ điều phối — chọn profile + TTS → đọc 4 file profile → viết đúng voice + công thức → ghi 2 tệp kèm footer cho pipeline phía sau. **Không hard-code luật brand ở đây.**

| Đầu vào | Mặc định | Đầu ra (thư mục `P`) |
|---|---|---|
| Chủ đề / góc video | thiếu thì hỏi 1 câu, gợi ý 2–3 mục từ `topic-pool.md` | `script.txt` — lời thoại thuần, sạch cho TTS |
| `--profile <name>` | user đã nói tên → dùng; chỉ có 1 profile → dùng, báo 1 dòng; nhiều profile → hỏi 1 câu | `brief.md` — công thức + lý do, hook thay thế, beat, chữ on-screen + b-roll, checklist, thời lượng ước tính, footer YAML |
| `--tts <elevenlabs\|minimax>` | theo khai báo trong `brand-voice.md` của profile; không có thì hỏi 1 câu kèm mặc định rõ ràng | (ghi vào footer `brief.md`) |
| Thời lượng | theo profile; profile không khai báo → ~90 giây | |

`K=.claude/skills/mkt-vn-short-video-script` · `P=output/<profile>/scripts/<topic-slug>`

## Chọn skill kịch bản nào

| Tình huống | Dùng |
|---|---|
| Kịch bản BĐS giọng Linh Aloha (mặc định, không cần `--profile` / `--tts`) | `mkt-linh-aloha-bds-video-script` — skill chủ: luật brand, tiêu đề / Hook A, Format 10, tra dữ liệu dự án |
| Thương hiệu khác, thêm profile mới, user gọi `--profile` / `--tts`, cần kho chủ đề | **skill này** |
| Profile = `linh-aloha` chạy qua skill này | được, nhưng **theo luật + bước 2–6 của skill chủ** — 4 file `profiles/linh-aloha/` chỉ trỏ về `references/` của skill chủ (trừ `topic-pool.md`) |

Profile có sẵn: `ls $K/profiles/`

| Profile | Voice | Chủ đề phù hợp | TTS mặc định |
|---|---|---|---|
| `linh-aloha` | Linh Aloha — chuyên gia BĐS hàng hiệu, ấm áp, thẳng thắn, sắc bén về con số, xưng "em" gọi "anh chị"; 10 format kịch bản | BĐS / review dự án / tài chính & dòng tiền / so sánh thị trường / mặt bằng / kinh nghiệm mua nhà | `elevenlabs` |

## Luật — không được phá

1. **Đọc đủ 4 file profile trước khi viết** — voice nằm trong file, không phải trong trí nhớ. File profile có dòng "Bản chuẩn:" thì mở tệp đích đó. Thiếu file nào → dừng (bảng *Lỗi* bên dưới).
2. **Không port vũ khí ngôn ngữ giữa các profile** — xưng hô, cách gọi khán giả, CTA, từ cấm, vũ khí ngôn ngữ (anaphora, câu kép đối lập, imagery, forward consequence, brand maxim, action count) theo đúng `brand-voice.md` + công thức của profile; không đổi xưng hô tự ý.
3. **Không bịa số / pháp lý** — số liệu thật do user hoặc nguồn của profile cung cấp; thiếu thì hỏi hoặc ghi "chưa có" (profile `linh-aloha` → `workspace/data/` theo skill chủ).
4. **Hook chạm trong 3 giây đầu** — vào thẳng nỗi đau / câu hỏi / khẳng định; không mở "Xin chào", không tự giới thiệu danh xưng trước hook (cài ở beat 2–3 sau khi hook xong, trừ khi profile quy định khác).
5. **`script.txt` thuần TTS:** chỉ chữ được đọc — không nhãn, markdown, từ đệm "ờ / à / uhm", không dấu " " quanh quote (TTS đọc cả ngoặc kép); số dạng "1.234" / "28,8" viết thành chữ.
6. **Cổng duyệt:** chưa được user duyệt kịch bản thì không đẩy sang TTS (tốn tiền). `P` đã có sẵn → hỏi: a. ghi đè · b. tạo `<slug>-v2` · c. dừng.
7. `--tts` chỉ nhận `elevenlabs` hoặc `minimax`; giá trị khác → từ chối.
8. **Báo số thật:** số tiếng đếm thật; thời lượng = số tiếng ÷ nhịp chỉ là ước tính, chưa đo bằng giọng đọc.

## Quy trình

0. **Profile + TTS** — chốt 2 giá trị theo bảng đầu vào. Xong khi biết tên profile và nhà cung cấp TTS.
1. **Đọc 4 file** `$K/profiles/<profile>/`: `brand-voice.md` (xưng hô, tone, từ cấm, signature, CTA, nhịp đọc, TTS mặc định) · `script-formulas.md` (công thức + ví dụ) · `topic-pool.md` (chủ đề theo trục) · `brief-template.md` (mẫu `brief.md`). Xong khi nêu được xưng hô, signature, CTA của profile.
2. **Chủ đề + công thức** — user đã chỉ định công thức thì dùng đúng; chưa thì chọn công thức hợp nhất theo bảng chọn của profile, nói **1 câu vì sao** rồi viết luôn (không chờ duyệt).
3. **Viết** bám đúng chuỗi beat của công thức, mỗi beat bằng giọng profile (luật 2–4). Độ dài theo nhịp đọc của profile; profile không khai báo thì dùng 3.3 tiếng / giây (chậm, nhiều cảm xúc — an toàn):

   | Thời lượng | Số tiếng ở nhịp 3.3 t/s | Số tiếng ở nhịp 3.6 t/s |
   |---|---|---|
   | 60s | 180–210 | 200–230 |
   | 75s | 230–260 | 250–280 |
   | 90s | 280–310 | 310–340 |
   | 105s | 320–360 | 360–390 |
   | 120s | 370–410 | 410–440 |

   Viết xong đếm số tiếng, ước tính thời lượng = số tiếng ÷ nhịp; lệch quá 20% so với mục tiêu thì cắt / giãn rồi báo "từ X → Y tiếng để khớp Z giây". Viết hook A (vào `script.txt`) + 2–3 hook thay thế vào `brief.md`; thân + CTA giữ nguyên. Script dài hơn 5000 ký tự (trần TTS) → đề xuất tách thành 2–3 đoạn, mỗi đoạn một `script.txt`.
4. **Xuất file** vào `P`: `script.txt` (hook A + thân + CTA, đoạn cách nhau một dòng trống) · `brief.md` điền đúng `brief-template.md`, giữ nguyên cấu trúc mục, **kèm footer YAML ở cuối** (mục dưới).
5. **Tự kiểm** theo checklist trong `brief-template.md` của profile; đọc to `script.txt` một lượt — có giống đúng người dẫn của profile không (sai giọng → viết lại). Báo user: profile + công thức + thời lượng ước tính + đường dẫn 2 tệp + TTS đã ghi + pipeline phù hợp (mục *Liên quan*).

## Footer `tts_provider`

Cuối `brief.md` luôn có khối YAML (mẫu: [assets/tts-provider-block-template.md](assets/tts-provider-block-template.md)):

```yaml
tts_provider: elevenlabs   # hoặc minimax
profile: linh-aloha        # tên profile đã dùng
```

Ghi lựa chọn một lần ở đây để người / agent điều phối khỏi hỏi lại: `elevenlabs` → `mkt-elevenlabs-tts-to-mp3`, `minimax` → `mkt-video-script-to-mp3`. Lưu ý: orchestrator `mkt-full-video-with-11-*` hiện nhận `tts_provider` qua tham số đầu vào (mặc định `elevenlabs`) — chưa thấy chỗ nào tự parse footer này, nên khi chuyển tiếp hãy truyền lại giá trị.

## Thêm profile mới

1. Tạo `profiles/<tên-mới>/` với **đủ 4 file** (không chép tệp trỏ-về của `linh-aloha`):
   - `brand-voice.md` — xưng hô, tone, từ cấm / ưu tiên, signature, CTA, **nhịp đọc** (tiếng / giây), **thời lượng mặc định**, dòng "TTS mặc định: elevenlabs / minimax" để bước 0 đọc được
   - `script-formulas.md` — bộ công thức (chuỗi beat) + ví dụ thật + câu mẫu mồi + bảng chọn công thức theo chủ đề
   - `topic-pool.md` — chủ đề gợi ý chia trục
   - `brief-template.md` — mẫu `brief.md` + checklist riêng của brand + footer
2. Mẫu cấu trúc để học (đường dẫn đầy đủ từ gốc repo): `.claude/skills/mkt-linh-aloha-bds-video-script/references/brand-voice.md`, `.claude/skills/mkt-linh-aloha-bds-video-script/references/script-formats.md`, `.claude/skills/mkt-linh-aloha-bds-video-script/assets/script-brief-template.md` và `.claude/skills/mkt-vn-short-video-script/profiles/linh-aloha/topic-pool.md`.
3. (Tuỳ chọn) thêm một dòng vào bảng profile ở trên. Skill đọc thư mục `profiles/` lúc chạy nên không cần sửa gì khác.
4. Thử: chạy với `--profile <tên-mới>`, viết một script, đối chiếu với video mẫu của brand.

## Lỗi

| Triệu chứng | Hành động |
|---|---|
| Chưa chỉ định profile + có nhiều profile | Hỏi 1 câu liệt kê tên có sẵn (`ls $K/profiles/`), gợi ý mặc định theo ngữ cảnh |
| Profile không tồn tại | Dừng. Báo "Không tìm thấy profile `<name>`. Có sẵn: <list>." Đề xuất tạo mới (mục trên) |
| Profile thiếu 1 trong 4 file | Dừng. Báo "Profile `<name>` thiếu `<file>`" — cần đủ `brand-voice.md` / `script-formulas.md` / `topic-pool.md` / `brief-template.md` |
| `--tts` không phải `elevenlabs` / `minimax` | Dừng. Báo "TTS provider không hợp lệ. Chọn `elevenlabs` hoặc `minimax`." |
| Yêu cầu của user sai voice profile (vd tự xưng "Linh" thiếu "em" ở `linh-aloha`) | Cảnh báo + đề xuất sửa; vẫn xuất, ghi "Cảnh báo brand voice: …" vào `brief.md` |
| Chủ đề không hợp profile (vd tâm lý chữa lành đưa vào `linh-aloha`) | Cảnh báo + đề xuất đổi profile hoặc reframe chủ đề; không tự viết lệch giọng |
| User muốn một brand voice chưa có profile | Đề xuất tạo profile mới theo mục *Thêm profile mới*; không ép giọng profile cũ |
| Script > 5000 ký tự | Đề xuất tách ngữ nghĩa thành 2–3 đoạn, mỗi đoạn một `script.txt` |
| `P` đã tồn tại | Hỏi: ghi đè hay `-v2` (luật 6) |
| Số tiếng chênh > 20% mục tiêu | Tự cắt / giãn rồi báo "từ X → Y tiếng để khớp Z giây" |

## Cải tiến skill

Gặp lỗi mới hoặc quyết định mới → ghi vào [references/kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*, sửa đúng một chỗ (luật brand → file của profile hoặc skill chủ, không sửa SKILL.md này cho từng brand).

## Liên quan

- Skill chủ của profile `linh-aloha`: `mkt-linh-aloha-bds-video-script`.
- Sau: `mkt-elevenlabs-tts-to-mp3` / `mkt-video-script-to-mp3` → pipeline dựng; `mkt-kie-broll-image-generator` đọc `brief.md` để sinh b-roll.

| Profile | Pipeline 9:16 | Pipeline 16:9 |
|---|---|---|
| `linh-aloha` | `mkt-full-video-with-11-remotion-heygen` hoặc `mkt-full-video-with-11-hyperframe-heygen` | `mkt-full-video-with-11-hyperframe-heygen-16-9` |
