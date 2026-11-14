---
name: mkt-kie-broll-image-generator
description: Sinh ảnh b-roll cho video BĐS Linh Aloha qua KIE AI — Nano Banana 2 (mặc định, photoreal ấm) hoặc GPT Image 2 (khi cần chữ trong ảnh), kèm manifest JSON. Nhận `brief.md` (tự rút gợi ý b-roll) hoặc prompt dán tay; `--profile linh-aloha` áp phong cách luxury real estate. TỐN CREDIT KIE: báo số ảnh + độ phân giải, đợi Hoàng xác nhận trước khi gọi API; cần `KIE_API_KEY` trong `.env`. Ảnh AI chỉ là minh hoạ, không chứng minh dự án thật. Dùng khi Hoàng nói "tạo b-roll", "gen ảnh b-roll", "tạo ảnh chèn video", "kie ai image", "nano banana", "gpt image 2", "b-roll cho video", "auto-generate b-roll", hoặc cần ảnh minh hoạ chèn talking-head mà chưa có asset. Không dùng khi đã có ảnh / video thật của dự án, cần video b-roll (→ mkt-kho-canh-tram), cần slide kiến thức có chữ chính xác (→ mkt-plan-short-video-edit-16-9), avatar nói (→ heygen-mp3-to-mp4) hay dựng cả video (→ mkt-full-video-with-11-hyperframe-heygen).
argument-hint: "[--brief brief.md | prompt dán tay] [--output_dir workspace/content/<ngày>/<slug>/broll] [--profile linh-aloha] [--provider nano-banana|gpt-image]"
---

# mkt-kie-broll-image-generator

Phiên bản: v1.1 — 2026-11-11

Cầu nối từ "script đã viết" sang "có ảnh b-roll để chèn video". Hai chế độ nhập: tự rút gợi ý b-roll từ `brief.md` của `mkt-linh-aloha-bds-video-script` / `mkt-vn-short-video-script`, hoặc nhận danh sách prompt dán tay.

| Đầu vào | Đầu ra |
|---|---|
| `brief.md` (mục b-roll) **hoặc** danh sách prompt (JSON array / mỗi dòng một prompt) | `<output_dir>/broll-NN-<slug-ascii>.png` (hoặc `.jpg`) |
| `--profile linh-aloha` (tuỳ chọn) | `<output_dir>/broll-manifest.json` — prompt, tên tệp, provider, `task_id`, dung lượng |
| `KIE_API_KEY` trong `.env` | log `[kie] provider=… model=… ar=… res=…` ở stderr cho từng ảnh |

## Luật — không được phá

1. **Cổng xác nhận tiền** — KIE tính credit theo ảnh và độ phân giải. Chưa có "ok" của Hoàng sau cảnh báo ở bước 2 thì không gọi `generate_image.py`. Hỏi kèm a / b / c. Gen tuần tự, không tự retry khi lỗi (báo lỗi, Hoàng quyết định gen lại).
2. **Khoá chỉ đọc từ `.env`** — `KIE_API_KEY` ở `.env` gốc repo; thiếu hoặc còn stub `your_kie_api_key` thì dừng ngay, không gọi API. Không in giá trị khoá.
3. **Ảnh AI chỉ là minh hoạ** — không dùng để chứng minh dự án thật (view thực, nội thất bàn giao, tiện ích, tiến độ). Đã có ảnh/video thật thì dùng thật. Khi ảnh vào video, gắn nhãn minh hoạ theo skill dựng (vd chip "Ảnh minh họa", hoặc `TƯ LIỆU MINH HỌA` ở `mkt-hyperframe-heygen-bds-proof-first-9-16`). Chữ trong ảnh (GPT Image 2) chỉ được chứa số liệu có nguồn trong script/brief — không bịa giá, diện tích, tiến độ, pháp lý.
4. **Không ghi đè ảnh đã có** — ảnh trùng tên thì đặt tên mới (`-v2`) hoặc hỏi Hoàng; muốn thử biến thể thì ghi tên khác.
5. **Tên tệp ASCII** (bỏ dấu, chữ thường, gạch ngang, ≤ 40 ký tự); đường dẫn dùng tương đối từ gốc repo.
6. **Báo provider cho từng ảnh**; tự chuyển sang GPT Image 2 (khi prompt có "text in image", "typography overlay", "render text:", "book cover", "sign that reads", "banner with text") thì báo Hoàng trước.
7. **Xong thì báo đường dẫn + số đo thật** — số ảnh thành công / tổng, dung lượng từng tệp, thời gian chạy; chưa mở manifest kiểm thì không nói "xong".

## Tham số

| Tham số | Bắt buộc | Mặc định | Ghi chú |
|---|---|---|---|
| `output_dir` | có | — | thư mục ảnh + manifest, vd `workspace/content/YYYY-MM-DD/<slug>/broll/` |
| `--brief` hoặc prompt dán tay | có | — | đường dẫn `brief.md` để tự parse, hoặc danh sách prompt |
| `--provider` | không | `nano-banana` | `nano-banana` (model `nano-banana-2`) · `gpt-image` (`gpt-image-2-text-to-image`) |
| `--profile` | không | không | áp `profiles/<tên>/style.md` làm khối `STYLE:`; hiện có `linh-aloha` |
| `--aspect_ratio` | không | `9:16` | Nano Banana: `auto, 1:1, 1:4, 1:8, 2:3, 3:2, 3:4, 4:1, 4:3, 4:5, 5:4, 8:1, 9:16, 16:9, 21:9`; GPT: `auto, 1:1, 9:16, 16:9, 4:3, 3:4` |
| `--resolution` | không | `1K` | `1K / 2K / 4K`; GPT `1:1` không dùng được `4K` |
| `--output_format` | không | `png` | `png` / `jpg`; chỉ Nano Banana, GPT bỏ qua |
| `--image_input` | không | không | ảnh tham chiếu (≤ 14), đường dẫn máy hoặc URL; chỉ Nano Banana. Ảnh trên máy được **tải lên KIE** (KIE xoá sau 3 ngày) — nói với Hoàng ở bước 2 |

**Chọn provider.** Nano Banana 2 cho hầu hết b-roll BĐS (ảnh ấm, ánh sáng ban ngày, kiến trúc/nội thất sang trọng; đủ 15 tỉ lệ, 3 độ phân giải). GPT Image 2 khi Hoàng chỉ định hoặc khi cần chữ chính xác trong ảnh (tựa sách, biển hiệu, banner, chữ Việt).

**Profile** là tệp markdown thuần (không frontmatter, không heading) mô tả bảng màu, ánh sáng, bố cục, thứ cần tránh; `linh-aloha` = luxury real estate: kem ấm, vàng champagne, gỗ óc chó, kính suốt trần, cây xanh đô thị — xem `profiles/linh-aloha/style.md`. Thêm profile mới = tạo `profiles/<tên>/style.md`, không sửa script. Cách ráp prompt (SCENE + STYLE + AVOID), ví dụ và mẹo: [assets/prompt-builder.md](assets/prompt-builder.md).

## Quy trình

Đặt `K=.claude/skills/mkt-kie-broll-image-generator` · `OUT=<output_dir>`. Script chạy bằng `uv run $K/scripts/<tên>.py …`; Windows chưa có `uv` thì `python` (cần `pip install requests`).

### 0. Kiểm khoá (không in giá trị)
```bash
grep -E '^KIE_API_KEY=' .env | grep -vq 'your_' && echo CO_KHOA || echo THIEU_KHOA     # PowerShell: Select-String '^KIE_API_KEY=' .env
```
`THIEU_KHOA` → dừng, báo: "Chưa có `KIE_API_KEY` trong `.env`. Lấy khoá tại kie.ai/dashboard → API Keys, thêm dòng `KIE_API_KEY=…` vào `.env` gốc repo rồi chạy lại." Script tự tìm khoá theo thứ tự: biến môi trường → `.env` gốc repo → `.env` ở thư mục đang đứng.
**Xong khi** in `CO_KHOA`.

### 1. Dựng danh sách prompt
**Chế độ A — từ `brief.md`:**
```bash
uv run $K/scripts/parse_brief_broll.py --brief <brief.md> --profile linh-aloha --output_json $OUT/broll-prompts.json
```
Script đọc: bảng markdown có cột `B-roll / cảnh quay / hình ảnh` · mục `### Gợi ý b-roll` / `### Gợi ý hình ảnh` (các gạch đầu dòng) · marker `(b-roll: …)` trong beat. Ra JSON `[{idx, raw_text, prompt, suggested_filename}]`; prompt có dạng `SCENE: … / STYLE: … / AVOID: …`.
**Chế độ B — dán tay:** bỏ qua parser; Claude ráp prompt từ ý Hoàng, thêm khối `STYLE` của profile.
**Xong khi** có danh sách prompt + tên tệp ASCII; đọc lại từng `SCENE` xem có bịa số / khẳng định về dự án thật không (luật 3).

### 2. Cảnh báo chi phí — dừng chờ Hoàng (luật 1)
> Sắp gen **N ảnh** qua KIE AI (provider `<X>`, độ phân giải `<Y>`, tỉ lệ `<Z>`). KIE tính credit theo ảnh + độ phân giải; số credit mỗi ảnh chưa có — xem kie.ai/dashboard. **a.** gen cả N ảnh · **b.** gen thử 1 ảnh trước · **c.** dừng / đổi prompt.

**Xong khi** Hoàng chọn a hoặc b.

### 3. Gen từng ảnh
```bash
uv run $K/scripts/generate_image.py --prompt "<SCENE + STYLE + AVOID>" --provider nano-banana \
  --aspect_ratio 9:16 --resolution 1K --output_format png \
  --output $OUT/broll-01-<slug>.png --poll_interval 5 --poll_timeout 300
```
Script: lấy khoá → `POST https://api.kie.ai/api/v1/jobs/createTask` → poll `GET …/jobs/recordInfo?taskId=…` mỗi 5 giây (tối đa 5 phút) tới `state=success` → `resultJson` là **chuỗi JSON**, parse lấy `resultUrls[0]` → tải về → kiểm > 1 KB → in `OK <đường dẫn>` (log ở stderr). Mã thoát 0 = thành công; lỗi mạng / 4xx / quá hạn poll / tệp quá nhỏ = khác 0.
**Xong khi** mỗi ảnh in `OK` và tệp tồn tại.

### 4. Ghi manifest `broll-manifest.json`
Tệp gồm `generated_at` (ISO), `provider`, `model`, `profile`, `aspect_ratio`, `resolution`, và `items[]` mỗi phần tử `{idx, filename, prompt, task_id, size_bytes}`. Dùng để gen lại, gỡ lỗi, kiểm tra; packager của pipeline đọc manifest để xếp ảnh vào timeline.
**Xong khi** `items` khớp số ảnh đã gen.

### 5. Báo Hoàng
```markdown
## B-roll đã gen — KIE AI
**Thư mục:** <OUT> · **Provider:** nano-banana (`nano-banana-2`) · **Profile:** linh-aloha · **Tỉ lệ:** 9:16 · **Độ phân giải:** 1K
**Kết quả:** N/N ảnh (T phút) · **Manifest:** <OUT>/broll-manifest.json
- broll-01-<slug>.png (<KB>) · …
Xem từng ảnh; muốn gen lại ảnh N → nói "gen lại ảnh N với prompt: …" (qua cổng xác nhận bước 2).
```

## Lỗi hay gặp

| Triệu chứng | Cách xử lý |
|---|---|
| `KIE_API_KEY` thiếu / stub | Dừng ở bước 0, hướng dẫn thêm vào `.env` |
| 402 hết credit | Nạp tại kie.ai/dashboard rồi hỏi Hoàng chạy lại |
| 422 sai schema | `aspect_ratio` / `resolution` ngoài enum, hoặc prompt > 20000 ký tự → xem `data.msg` trong log |
| 429 rate limit | Chờ ~30 giây rồi chạy lại một ảnh (không chạy song song) |
| Poll quá 5 phút | Kiểm `taskId` ở dashboard; ổn thì chạy lại với `--poll_timeout 600` |
| Tệp tải về < 1 KB | URL rỗng / CDN lỗi → chạy lại ảnh đó |

Các mã còn lại (401, 404, 500/501, 505, `resultJson` hỏng, tên tệp có dấu): [references/kinh-nghiem.md](references/kinh-nghiem.md).

## Skill này không làm
Quyết định ảnh nào vào cảnh nào (việc của packager / skill dựng) · ghép ảnh vào video · cache hay chạy song song · render slide kiến thức có chữ chính xác (→ `mkt-plan-short-video-edit-16-9`) · video b-roll (KIE ở đây chỉ ra ảnh tĩnh).

## Cải tiến skill
Gặp lỗi mới → ghi vào [references/kinh-nghiem.md](references/kinh-nghiem.md) mục *Nhật ký*, sửa đúng một chỗ (script · profile · tệp này).

## Liên quan
- Đứng trước: `mkt-linh-aloha-bds-video-script` / `mkt-vn-short-video-script` → `brief.md` (script skill ghi ở `output/linh-aloha/scripts/<slug>/brief.md`; video chạy ở `workspace/content/YYYY-MM-DD/<slug>/`).
- Đứng sau: các pipeline BĐS Linh Aloha (`mkt-full-video-with-11-hyperframe-heygen`, `-16-9`, `mkt-full-video-with-11-remotion-heygen`, `mkt-full-video-with-11-remotion-heygen-apartment-detail`, `mkt-hyperframe-knowledge-video-heygen-9-16-lite`) gọi skill này **tuỳ chọn** khi chưa có ảnh thật và Hoàng đồng ý (`auto_broll: true` hoặc trả lời "gen b-roll" ở checkpoint), truyền `--brief`, `--profile linh-aloha`, `output_dir = …/<slug>/broll/`.
- Cùng giai đoạn: `heygen-mp3-to-mp4` (avatar), `mkt-ai-video-extract-srt-segment` (SRT).
- Docs: Nano Banana 2 — docs.kie.ai/market/google/nanobanana2 · GPT Image 2 — docs.kie.ai/market/gpt/gpt-image-2-text-to-image · endpoint poll chung `GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId={taskId}`.
