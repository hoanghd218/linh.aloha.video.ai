---
name: mkt-linh-aloha-bds-video-script
description: Viết kịch bản video ngắn 40–90 giây (TikTok / Reels / Shorts) cho môi giới BĐS cao cấp theo giọng Linh Aloha — chủ đề + dữ liệu dự án → `script.txt` (lời thoại cho TTS) + `brief.md` (hook thay thế, beat, b-roll, checklist). Skill CHỦ giữ brand voice Linh Aloha (xưng em / gọi anh chị, "Aloha anh chị, em Linh đây", CTA inbox / hotline) và 10 format kịch bản (Quay xe, Cờ xanh–Cờ đỏ, Đập tan nỗi lo, Bài toán tiền, Review dòng sản phẩm…). Dùng khi user nói 'viết kịch bản video bđs', 'tạo script video [tên dự án]', 'content video Linh Aloha', 'viết video review dự án', 'kịch bản tiktok bất động sản', 'viết video bán căn hộ', 'lên kịch bản short video môi giới', 'viết content bđs ngắn', 'video review căn hộ' — kể cả khi không nhắc tên format hay "Linh Aloha". Không dùng cho profile / thương hiệu khác hoặc khi cần `--profile` / `--tts` (→ mkt-vn-short-video-script), tạo giọng đọc (→ mkt-elevenlabs-tts-to-mp3), dựng video (→ mkt-full-video-with-11-*).
argument-hint: "[chủ đề video] [dự án] [thời lượng giây] [format 1–10]"
---

# Kịch bản video ngắn BĐS — giọng Linh Aloha

Phiên bản: v1.1 — 2026-11-11

Biến một chủ đề ("giá dự án X", "xử lý lo ngại Y", "review các dòng căn hộ") thành kịch bản **40–90 giây** đúng giọng thương hiệu **Linh Aloha** và đúng một trong **10 format** chắt lọc từ thực chiến. Kịch bản đọc lên phải nghe như Linh đang **trò chuyện thật** với khách — ấm áp, thẳng thắn, có con số — không phải bản tin PR. Mỗi video chỉ chốt **một** thông điệp. Skill này là **skill chủ về brand voice**: các skill khác chỉ trỏ về đây, không chép lại luật brand.

| Đầu vào | Mặc định | Đầu ra (thư mục `P`) |
|---|---|---|
| Chủ đề / góc video | thiếu thì hỏi đúng 1 câu | `script.txt` — lời thoại thuần cho TTS (chỉ chữ được đọc) |
| Dự án | Cao Xà Lá — Lumière Hanoi Seasons Garden | `brief.md` — format + lý do, hook thay thế, beat, chữ on-screen + b-roll, checklist, thời lượng ước tính, footer `tts_provider` |
| Thời lượng | ~60 giây | |
| Format | chỉ khi user chỉ định, không thì tự chọn (bước 3) | |

`P=output/linh-aloha/scripts/<topic-slug>` · `K=.claude/skills/mkt-linh-aloha-bds-video-script` · `D=workspace/data/<dir dự án>`

## Chọn skill kịch bản nào

| Tình huống | Dùng |
|---|---|
| Kịch bản BĐS giọng Linh Aloha (mặc định) | **skill này** — có đủ luật brand, Format 10, tiêu đề / Hook A, tra dữ liệu dự án |
| Thương hiệu khác, thêm profile mới, user gọi `--profile` / `--tts`, cần gợi ý từ kho chủ đề | `mkt-vn-short-video-script` (profile `linh-aloha` của nó trỏ ngược về `references/` của skill này) |

## Luật — không được phá

1. **Không bịa số, không bịa pháp lý** (giá, diện tích, tiến độ, chính sách) — số lấy từ `D`; thiếu thì hỏi user hoặc ghi "chưa có". Con số tin đồn / ước tính gọi đúng là "tin đồn" / "dự kiến", không trình bày như giá chốt. Số trong ví dụ của `references/` là **minh hoạ** (dự án The Bloom), không chép sang dự án khác.
2. **Đọc cả hai `references/` trước khi viết** — không viết theo trí nhớ, giọng sai là hỏng thương hiệu. Bản chuẩn là `references/` của skill; `output/linh-aloha/brand-voice.md` (nếu có) chỉ là bản làm việc của user — hai bản lệch thì theo `references/`.
3. **Xưng hô:** tự xưng luôn có "em" ("em", "em Linh", "em Linh Aloha"), không bao giờ trống "Linh"; gọi khách "anh chị" (không "các bác", "bạn", "quý khách"). Cứ vài câu hướng về anh chị, dùng "nhé / ạ / đấy" — không nói trống không.
4. **Hook trước tiên** (trong 3 giây đầu, có con số / câu hỏi / tin nóng); câu "Aloha anh chị, em Linh đây" lồng **ngay sau** cú đấm của hook, không đặt trước — phí 2 giây vàng.
5. **Tiêu đề / Hook A** *(phản hồi reviewer 2026-05-25)* — ví dụ đầy đủ ở [references/kinh-nghiem.md](references/kinh-nghiem.md):
   - Không hỏi có/không khi câu trả lời nghiêng tiêu cực ("sống có ngột ngạt không?") — frame bằng khẳng định tích cực hoặc con số / tiền lệ giải toả lo.
   - Không dùng từ gây ác cảm trong tiêu đề / hook ("khôn / dại", "ngột ngạt", "ô nhiễm", "rủi ro", "lừa", "ham rẻ"…). Phần thân được giải thích, tiêu đề thì không.
   - Hook phải có góc nhìn em-Linh, không giống bản tin. Test: thêm "Theo Reuters…" vào đầu hook mà vẫn hợp lý thì viết lại.
6. **Một video một ý.** Chủ đề quá rộng → chọn một lát cắt, đề xuất tách phần còn lại thành video khác. Mỗi nhận định có dẫn chứng (con số, mốc thời gian, ví dụ, tiền lệ).
7. **Gọi tên dự án đủ ngữ cảnh:** "The Bloom" không bao giờ đứng trơ — lần nhắc đầu gắn chủ đầu tư Masterise + khu đất Cao Xà Lá (vd "The Bloom — dự án của Masterise trên khu đất Cao Xà Lá").
8. **Liệt kê có thứ tự:** mở bằng tổng số rồi đếm "1 là… 2 là… 3 là…". Nối đoạn bằng "Nhưng" / "Vì vậy"; câu ngắn–dài đan xen; tự phản ứng với con số; một câu chốt đáng nhớ trước CTA. Viết xong **đọc to** — nghe như thuyết trình hay như AI thì viết lại. Chi tiết: `references/brand-voice.md`.
9. **CTA** có tên "Linh Aloha" + mời inbox hoặc gọi hotline (biến thể ở `references/brand-voice.md`); không dùng "em tư vấn thật, không hối thúc"; tránh hối thúc kiểu chợ và sáo rỗng ("siêu phẩm", "chấn động", "bùng nổ").
10. **Cấm tour ảo** *(2026-05-25)* — Format 10 chỉ cho dự án đã bàn giao hoặc có nhà mẫu / sale gallery thật quay được (và nói rõ "khu nhà mẫu" / "phối cảnh"). Dự án off-plan (Cao Xà Lá bàn giao Q2/2029) → Format 9 hoặc 7.
11. **`script.txt` thuần TTS:** không nhãn, không markdown, không ngoặc kép quanh câu trích. Số có dấu phân cách hoặc thập phân ("28,8", "82.820") viết thành chữ trong `script.txt` — TTS đọc sai (xem `mkt-elevenlabs-tts-to-mp3`).
12. **Cổng duyệt:** kịch bản chưa được user duyệt thì không đẩy sang TTS / HeyGen (tốn tiền). `P` đã có sẵn → hỏi user: a. ghi đè · b. tạo `<slug>-v2` · c. dừng — không tự ghi đè.
13. **Báo số thật:** số tiếng đếm thật; thời lượng = số tiếng ÷ 3.5 chỉ là **ước tính** — thước đo cuối là MP3 của TTS. Nói rõ "chưa đo bằng giọng đọc".

## Quy trình

0. **Thu thập input** — chủ đề, dự án, thời lượng, format (nếu user chỉ định). Chưa rõ chủ đề → hỏi 1 câu; bí ý → gợi ý 2–3 mục từ `.claude/skills/mkt-vn-short-video-script/profiles/linh-aloha/topic-pool.md`. Xong khi có chủ đề + dự án.
1. **Đọc `$K/references/brand-voice.md` và `$K/references/script-formats.md`** (luật 2). Xong khi nêu được chuỗi beat của format sẽ dùng.
2. **Lấy dữ liệu thật** (luật 1): `workspace/data/projects.json` (danh sách dự án, `status: dang-ban` là mặc định, `dir` là tên thư mục) → `D/_kien-thuc-du-an/` (bắt đầu từ `00 - INDEX - Bản đồ tài liệu.md`), `D/_phan-tich/`, `D/_data/*.json`; tra nhanh bằng `tools/bds project list` nếu cần. Không có thư mục hoặc thiếu đúng phần cần → hỏi user con số cụ thể. Xong khi mỗi con số dự định dùng có nguồn.
3. **Chọn format** — user đã chỉ định thì dùng đúng; chưa thì chọn theo bảng, nói **1 câu vì sao** rồi viết luôn (không chờ duyệt):

   | Chủ đề / tình huống | Format |
   |---|---|
   | Tin / sự kiện mới: công bố giá, kick-off, ra hàng | 1 — Tin sốc "Quay xe" |
   | Thị trường đang đồn đoán, nghi ngờ giá | 2 — Món hời hay cái bẫy |
   | Xây niềm tin, tạo khác biệt | 3 — Cờ xanh / Cờ đỏ |
   | Khách có đúng 1 nỗi lo (tiến độ, pháp lý, oversupply…) | 4 — Đập tan nỗi lo |
   | Câu hỏi đầu tư / theo ngân sách / dòng tiền | 5 — Bài toán tiền |
   | So sánh 2 dự án / 2 lựa chọn | 6 — Đặt lên bàn cân |
   | Pháp lý, quy hoạch, cơ chế, "tại sao" | 7 — Giải mã chuyên gia |
   | Có khách thật / sự kiện thật để kể | 8 — Người thật chuyện thật |
   | Giới thiệu / so sánh các dòng căn hộ trong dự án | 9 — Review dòng sản phẩm |
   | Tiện ích, dịch vụ, phí dịch vụ, trải nghiệm sống (luật 10) | 10 — Tham quan tiện ích |

4. **Viết** theo chuỗi beat của format, mỗi beat bằng giọng Linh Aloha (luật 3–9). Bám bảng độ dài (nhịp đọc điềm tĩnh ≈ 3.5 tiếng / giây):

   | Thời lượng | Số tiếng (âm tiết) |
   |---|---|
   | 40s | 125–150 |
   | 60s | 190–220 |
   | 75s | 235–275 |
   | 90s | 290–330 |

   Viết xong đếm số tiếng phần lời thoại, ước tính thời lượng = số tiếng ÷ 3.5; lệch khỏi khoảng mục tiêu thì cắt / giãn. Viết **hook A** (vào `script.txt`) + **2–3 hook thay thế B/C/D** cùng chủ đề nhưng khác cách vào (con số / câu hỏi / kể chuyện) — thân + CTA giữ nguyên, đổi hook chỉ là thay đoạn đầu.
5. **Xuất file** vào `P`: `script.txt` = hook A + thân + CTA, các đoạn cách nhau một dòng trống (luật 11); `brief.md` theo [assets/script-brief-template.md](assets/script-brief-template.md), giữ nguyên tên mục (b-roll / cảnh quay do `mkt-kie-broll-image-generator` đọc từ bảng *Gợi ý hình ảnh theo beat*). Footer `tts_provider` mặc định `elevenlabs`; user nói dùng MiniMax thì ghi `minimax`.
6. **Tự kiểm** — tick hết checklist cuối `brief.md` (16 mục, gồm cả ba mục tiêu đề / Hook A và mục Format 10); mục nào chưa tick thì sửa kịch bản. Xong khi không còn ô trống và số tiếng nằm trong khoảng của bước 4.
7. **Báo user:** format đã dùng + thời lượng ước tính (luật 13) + đường dẫn `script.txt`, `brief.md`. Bước sau, khi user duyệt: tạo giọng bằng `mkt-elevenlabs-tts-to-mp3` (hoặc `mkt-video-script-to-mp3`), rồi dựng bằng `mkt-full-video-with-11-remotion-heygen` / `mkt-full-video-with-11-hyperframe-heygen`.

## Lỗi hay gặp

| Triệu chứng | Nguyên nhân | Sửa |
|---|---|---|
| Có câu "Linh đây", "Linh nghĩ…" | tự xưng thiếu "em" | đổi thành "em Linh đây", "em nghĩ" |
| Reviewer chê hook "như tin tức" | hook mở bằng sự kiện khô | thêm góc nhìn em-Linh (công thức broker-hook ở `references/brand-voice.md`) |
| Câu hỏi có/không ở tiêu đề gieo lo ngại | luật 5 | frame khẳng định hoặc dùng con số giải toả |
| "The Bloom" đứng một mình | thiếu mỏ neo | gắn "Masterise" / "Cao Xà Lá" |
| Chọn Format 10 cho dự án off-plan | quên luật 10 | chuyển Format 9 hoặc 7 |
| Số tiếng lệch xa thời lượng mục tiêu | viết dài / ngắn | cắt / giãn rồi báo "từ X → Y tiếng" |
| Không có số liệu cho chủ đề | `D` thiếu phần đó | hỏi user, không bịa |

Lỗi mới → ghi vào [references/kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*.

## Cải tiến skill

Gặp phản hồi mới của reviewer hoặc lỗi lặp lại → ghi vào `references/kinh-nghiem.md` (mục *Nhật ký*), sửa đúng **một** chỗ: luật brand ở `references/brand-voice.md`, công thức ở `references/script-formats.md`, checklist ở `assets/script-brief-template.md`. Ba tình huống kiểm mẫu: `evals/evals.json`.

## Liên quan

- **Skill này tái dùng được cho mọi dự án BĐS** — đổi dữ liệu ở bước 2, brand voice giữ nguyên.
- Sau: `mkt-elevenlabs-tts-to-mp3` (mặc định) / `mkt-video-script-to-mp3` (MiniMax) → `mkt-full-video-with-11-*`; `mkt-kie-broll-image-generator` đọc `brief.md` để sinh b-roll.
- Song song: `mkt-vn-short-video-script` — engine đa profile, dùng cho thương hiệu khác.
