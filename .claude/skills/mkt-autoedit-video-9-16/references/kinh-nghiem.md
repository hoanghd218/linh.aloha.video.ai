# Kinh nghiệm — AutoEdit (video thô 9:16)

**Đọc trước mỗi lần làm.** Mục A–C là ghi chú của repo Linh; mục D–G là **nguyên văn** mục 7, 8, 9, 12 của `CLAUDE.md` gói AutoEdit gốc (chỉ thay 1 dòng đường dẫn thư viện âm thanh riêng của tác giả, đánh dấu ⟵).

## A. Khác với gói gốc (người chuyển thể ghi, 11/11/2026)

- Gói gốc là **một xưởng cố định** (`D:\AutoEdit` có `input/ work/ output/`). Ở repo Linh, mỗi video một thư mục `workspace/content/YYYY-MM-DD/<slug>/` (cùng quy ước với các skill `mkt-full-video-*`; thư mục này bị `.gitignore`, không lên GitHub) chứa `input/ work/ output/ assets/`. Kho hiệu ứng, preset, công cụ nằm trong skill (`assets/`, `scripts/`), không chép vào từng video.
- Trang chọn hiệu ứng và trang storyboard gốc dùng `base: "../effects/thumbs"` (đường dẫn theo xưởng cũ). Ở đây **dùng `scripts/tao-trang.mjs`** — tự tính đường dẫn tương đối tới `assets/effects/thumbs` theo nơi đặt tệp HTML. Viết bằng Node, kiểm trên Windows (tạo trang → Chrome headless chụp được hình thumbs).
- Phông (`BT Danta`, `OAI Showtilla`) **không chép vào repo**: gói gốc ghi "chỉ dùng nếu bạn có quyền sử dụng", repo này công khai. Chép từ gói gốc (`assets/fonts/`) hoặc từ thư viện của chị Linh vào `<video>/assets/fonts/` mỗi video.
- `assets/preset_A_example/build.py` còn đường dẫn cứng `D:/AutoEdit/work/demo1/` — chỉ là **mẫu**; muốn dùng thì sửa hai dòng đầu (`H`, đường dẫn `src.html`).
- Gói gốc có `cai-dat/chay-cai-dat.bat` (xin quyền Administrator, tải và cài Node, Python, Git, FFmpeg, Claude Code, HyperFrames). **Không chép vào repo, không chạy** — máy đã có thì bỏ qua; máy mới thì hỏi rồi cài từng thứ.
- Quy trình gốc không tốn credit (toàn bộ chạy trên máy: ffmpeg, Whisper, HyperFrames). Khác `mkt-full-video-*` (HeyGen, ElevenLabs).

## B. Chưa kiểm trên máy dev (11/11/2026)

Máy chuyển thể (Windows) **chưa có**: `faster-whisper`, `playwright` (cho `safe_check.py`), `rembg`/`onnxruntime` (preset A), HyperFrames CLI. Vì vậy **chưa chạy trọn pipeline** một video thật. Đã kiểm: `tao-trang.mjs` (Node) + hiển thị trang chọn / storyboard bằng Chrome. Lần chạy thật đầu tiên: ghi số đo (thời gian phiên âm, dựng, render) vào mục *Nhật ký* bên dưới.

## C. Chỗ nghi vấn của gói gốc

- Đoạn "Thư viện tài nguyên trên máy" (mục 2 gốc) là **chỗ điền** `ĐIỀN_ĐƯỜNG_DẪN…`; ở đây thay bằng thư mục có sẵn trong repo (xem `SKILL.md`).
- Nhiều hiệu ứng ghi "mô tả, chưa có mẫu" (`feature_card`, `screenshot_card`, `product_badge`, `cinematic_break`): **bắt buộc chụp khung thử cho chị duyệt** trước khi dựng cả video (mục 6 gốc).
- `map_route` gốc cần ảnh bản đồ có đánh dấu khu dự án do người dùng gửi hoặc KML. Chưa có ảnh bản đồ → dùng clip của skill `mkt-map-location-video` làm nguồn (chưa kiểm cách ghép — thử một lần rồi ghi vào *Nhật ký*).
- Phụ đề: gói gốc **đã gỡ**, mặc định không vẽ (cờ `captions` chỉ ghi, chưa vẽ). Video BĐS cần phụ đề thì dùng caption của skill `mkt-hyperframe-talking-head-video` hoặc chờ kiểu phụ đề mới duyệt.

## D. Người nói tách nền — chỉ khi preset yêu cầu (nguyên văn mục 7)

Chi tiết theo file preset. Tóm tắt: dùng `rembg` với mô hình `u2net_human_seg` (`pip install rembg onnxruntime`, mô hình tự tải lần đầu); chạy trên khung đã thu nhỏ (~540×960) rồi phóng lại nếu máy chậm; chỉ giữ vùng lớn nhất (bỏ mảng rác như mảng gạch trên đầu); làm mịn viền (guided filter hoặc làm mờ 1–2 px) và làm mượt alpha giữa các khung liên tiếp để tóc không nhấp nháy; khung nào còn rác thì dùng khung lân cận. Tách một lần rồi dùng chung cho mọi cảnh, báo người dùng thời gian ước tính vì máy không có GPU. Khung người nói gần vuông (rộng bằng ngang video 1080, cao ~1080), bắt đầu cách đỉnh đầu theo preset, vì người nói chiếm rất lớn khung hình gốc (đầu cao ~45%); không dùng khung dẹt.

## E. Phông chữ (nguyên văn mục 8)

- Phông KHÔNG tải từ mạng (Google Fonts, CDN). Chỉ dùng file cục bộ trong `assets/fonts/`, khai báo `@font-face` đường dẫn tương đối.
- Ba vai phông (KHÔNG tự đổi sang phông khác; chưa có file thì hỏi, không dùng phông dự phòng của hệ thống):

| Vai | Dùng cho | File (trong `assets/fonts/`) |
|---|---|---|
| `font_script` | chữ viết tay/thư pháp: dòng dẫn, chữ ký ("Từng ngày", "nếu thiếu") | `OAI SHOWTILLA.OTF` |
| `font_bold` | cụm khóa đậm, tiêu đề, số lớn | `BTDanta-Bold.otf` (số rất lớn, tiêu đề nhấn: `BTDanta-ExtraBold.otf`) |
| `font_text` | chữ phụ, nhãn, phụ đề | `BTDanta-Medium.otf` |

- Các phông khác trong `assets/fonts/` (OAI AGNIFA, IRONFIST, OTEGLOS, RANGUNA, BROVILE, CHERIONE, LACOTTE, LAWRAISE, PORK-BELLY, QYLEN, THE-RAMBLER, VALTER-STD, `BTDantaVF.ttf`) chỉ dùng khi người dùng yêu cầu rõ. Người dùng gọi phông viết tay là "OAI Showtilla Regular", khớp file `OAI SHOWTILLA.OTF`; không thấy file thì hỏi lại.
- Kiểm tra dấu tiếng Việt trước khi dựng: dựng một khung thử mỗi vai phông chứa chuỗi `ĂÂÊÔƠƯĐ ẰẮẲẴẶ ẦẤẨẪẬ ỆỔỖ ỤỨỮ ỜỚỞỠỢ ăâêôơưđ ằắẳẵặ ầấẩẫậ ệổỗ ụứữ ờớởỡợ`, chụp và mở ra xem. Có ô vuông, thiếu dấu hoặc phông bị thay thì dừng và báo; đạt mới dựng tiếp. Sau khi render, mở 1–2 khung video thật để xác nhận lại.
- Chữ gradient/`background-clip:text`: BT Danta có dấu rất cao nên PHẢI nới khung chữ (padding trên ~0.4em, dưới ~0.25em, bù bằng margin âm), nếu không dấu bị cắt ("ĐỪNG" thành "ĐƯNG").
- BT Danta là phông rộng: cụm khóa 8–13 cqw tùy độ dài, một dòng tối đa ~12 ký tự ở cỡ lớn. Không có bản nghiêng thật; chỗ nghiêng là nghiêng giả, bỏ nghiêng nếu xấu.
- OAI Showtilla nét mảnh: cỡ nhỏ khó đọc; dùng cỡ lớn (≥ 15 cqw cho dòng ký tự) kèm viền ~0.2–0.3 cqw và glow nhẹ; không dùng cho dòng dài.

## F. Phiên âm (nguyên văn mục 9)

- Không đưa thẳng video cho `faster-whisper` (lỗi thư viện `av`). FFmpeg tách âm thanh `-vn -ac 1 -ar 16000 -f f32le -` rồi đưa mảng numpy cho `transcribe`, `word_timestamps=True`.
- Máy không có GPU NVIDIA: `WhisperModel('small', device='cpu', compute_type='int8')`, `language='vi'`.
- Ghi kết quả bằng `open(..., encoding='utf-8')`; không `print` ra PowerShell (lỗi bảng mã). Lưu `work/<ten>/transcript.json` (từng từ kèm giây) và `transcript.srt`.
- Model nghe sai nhiều từ (ví dụ "skill", "tiện ích", "typography", tên riêng): luôn đưa lời cho người dùng sửa trước khi chia cảnh.

## G. Kinh nghiệm đã chạy được (nguyên văn mục 12)

Bổ sung từ dự án thật. Công cụ nằm ở `tools/` (xem `tools/README.md`).

### Thứ tự làm việc
Theo Bước 4 → 5 → 6: chia cảnh, tạo trang chọn hiệu ứng, chờ người dùng dán kết quả, tạo trang storyboard để chốt, rồi mới dựng và xem thử. Dữ liệu thiếu thì dựng khung giữ chỗ để duyệt; bản cuối không được còn nhãn "ẢNH CẦN CHÈN", "SỐ MẪU", "NHÃN n". Khi nghi ngờ lời nói lặp/vấp (nói lại cả câu), cắt đoạn đầu và báo người dùng.

### Vùng an toàn: luôn cho người dùng xem
- Chuẩn hiện hành là mục 4 (trên 15% = 288 px, dưới 25% = từ y 1440 px, hai bên 10% = 108 px); đây là số đo gần đúng, không đo trực tiếp từ app.
- Cách xem: `python build.py guides` (trong `tools/preset_A_example/`) vẽ vùng đỏ gạch chéo và khung xanh lá "VÙNG AN TOÀN" lên video xem thử. Xuất bản chuẩn thì dùng bản sạch. Kết hợp `tools/safe_check.py` để kiểm tự động.
- Đồ họa (thẻ, chữ) đặt trọn trong khung xanh lá; cỡ chữ ~38–44 px là vừa. Thấy "to quá" thì thu nhỏ trước khi hỏi.
- Preset A: khung người nói 950x950 sát đáy video nằm một phần trong vùng che dưới (video được phép tràn). Khi có phụ đề kiểu mới, không được che miệng: dịch hoặc thu nhỏ người nói (mục 4).

### Preset A: người nói tách nền, đầu nhô khỏi khung
- `python -I tools/matte_person.py cut.mp4 person.webm 24` (khoảng 2 phút cho clip 17 giây, máy không GPU).
- Trong HyperFrames: lớp 1 là video thật trong khung (clip-path bo góc), lớp 2 là `person.webm` cùng vị trí và cùng kích thước, chỉ lấy phần trên cùng (`clip-path: inset`) để tóc nhô lên khỏi mép khung. Mép khung nằm khoảng 90–100 px dưới đỉnh tóc.
- Cảnh chỉ người nói: khung mở rộng toàn khung bằng `clip-path` + `scale` của video (không animate width/height), thu lại khi cảnh đồ họa vào.

### Âm thanh đã cân bằng
- Giọng quay điện thoại thường nhỏ (~ −31 dB trung bình): tăng bằng `data-volume="3"` trên `<video data-has-audio>` (đỉnh vẫn dưới −3 dB).
- Nhạc nền `data-volume≈0.055` với file nhạc ~ −14 dB trung bình (thấp hơn giọng hơn 18 dB), mở dần 0.8 giây, tắt dần 1.6 giây.
- SFX nhẹ khi thẻ/nhãn bật lên: thông báo `data-volume≈0.30`, tiếng kim loại lớn một lần ở nút kêu gọi `≈0.22`. Mỗi `<audio>` cần `id`.
- Đo sau khi render: `ffmpeg -i out.mp4 -af volumedetect -vn -f null -` (tổng thể quanh −21 dB trung bình, đỉnh dưới −2 dB).
- Thư viện âm thanh của chị Linh (repo này) ⟵ thay dòng gốc: nhạc nền `workspace/assets/background music/` (`coconut groove.WAV`, `gods.mp3`, `suffocasting.mp3`), SFX BĐS `workspace/sfx-realestate/` và `workspace/assets/01_Sound Bất động sản/` (Camera Shutter, Cyber, Film Burn, Glitch, Pop…). Chỉ copy file cần dùng vào `<video>/assets/music`, `<video>/assets/sfx`; không sửa file gốc.

### Lỗi HyperFrames đã gặp
- Phải nạp GSAP trong `<head>`: `<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>`.
- Nét SVG thẳng đứng/ngang dùng gradient mặc định sẽ KHÔNG hiện (bbox rộng 0): dùng `gradientUnits="userSpaceOnUse"` hoặc màu đặc.
- `fromTo` mặc định `immediateRender`: hai `fromTo` cùng một phần tử ở hai mốc khác nhau sẽ ghi đè trạng thái đầu; dùng `.to` cho lần sau.
- Thư mục dự án chỉ có MỘT file HTML gốc (`index.html`); file nguồn đặt ngoài.
- Render: `npx hyperframes render -q draft` để xem nhanh, `-q delivery` để xuất bản.

## Nhật ký

- **2026-11-11 — v1.0:** chuyển thể từ gói `AutoEdit.zip`. Chép nguyên `presets/`, `effects/` (CATALOG, 2 trang mẫu, 78 hình thumbs, 4 trang tham chiếu), `mau/`, `tools/`; **không chép** `assets/fonts/` (giấy phép) và `cai-dat/`. Viết lại `CLAUDE.md` gốc thành `SKILL.md` + 3 tệp references; thêm `scripts/tao-trang.mjs`. Chưa chạy pipeline thật (mục B).
