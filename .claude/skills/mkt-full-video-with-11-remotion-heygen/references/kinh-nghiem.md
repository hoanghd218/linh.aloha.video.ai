# Kinh nghiệm — pipeline Remotion 9:16 (BDSGeneralTemplate)

Đọc khi gặp lỗi, hoặc trước mỗi lần chạy mới. Gặp lỗi mới → thêm một dòng vào bảng đúng chỗ + một dòng *Nhật ký*. 7 lỗi hay gặp nhất nằm sẵn ở SKILL.md; bảng dưới là phần còn lại. Nguyên nhân gốc của các lỗi render: [lessons-learned.md](lessons-learned.md).

## Lỗi đã gặp

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| TTS lỗi / 401 | Thiếu hoặc sai khoá trong `.env` (`ELEVENLABS_API_KEY`, hoặc `MINIMAX_API_KEY` nếu dùng MiniMax) → kiểm tên biến, đừng in giá trị |
| Phụ đề sai tên thương hiệu / dấu thanh / số ("Master rise", "Lumiêre", "Cửa số") | `align_to_script.py` chưa chạy hoặc bị bỏ vì tỉ lệ khớp < 0.5 → kiểm `transcript-aligned.json` có tồn tại và `caption-groups.json` khớp `script.txt`; tỉ lệ thấp nghĩa là script không khớp audio → kiểm đầu ra TTS |
| `validate.py`: `assets.voiceover: must be non-empty` | Thiếu `"voiceover": "voiceover.mp3"` trong `assets` |
| `validate.py`: `unknown variant 'punch-white'` (hoặc `logo-pill`, `count-up-*`, `glitch-text`…) | Packager dùng tên cũ → đổi thành `punch` + `color` — [lessons-learned.md](lessons-learned.md) mục 1 |
| Cảnh báo `'Audio' is deprecated` | Dùng `Html5Audio` (template đã dùng) — mục 3 |
| Chữ b-roll bị cắt giữa từ ("MASTERI/SE") | `BrollImage.tsx` đã có `wordBreak: 'keep-all'`; nếu vẫn bị, một từ quá dài → giảm `fontSize` |
| B-roll không lên khi render | Packager chưa gộp `broll-inserts.json` vào `overlays.json` — mục 5 |
| Thiếu contact card cuối | Packager không phát `contact-card` → thêm tay, `t_start = duration - 6` |
| Chữ tràn hai cạnh khung | Component dùng `useFitTextSize` mà không truyền font Mulish — mục 9 |
| Studio báo "overlays.json not found" | `init_project.sh` chưa chạy, hoặc dữ liệu workspace thiếu |
| Trên Windows `validate.py` báo `UnicodeEncodeError` | Bản cũ in ✗ / ⚠ ra console cp1252. Đã sửa 2026-11-11 (script tự đặt UTF-8); gặp ở bản cũ → chạy `python -X utf8 …` |
| `npm run render-final` báo không tìm thấy composition `Root` | Bản làm việc chỉ đăng ký `BdsGeneralReview` / `BdsApartmentDetail` → dùng `npx remotion render <CompositionId> …` |
| Render chậm / hết RAM | Hạ `--concurrency`, hạ CRF xuống 23, đóng Chromium khác |
| MP4 quá nặng để tải lên TikTok (> 287 MB bản web) | Dùng `npm run render-draft` (CRF 28) thay `render-final` (CRF 18) |
| HeyGen kẹt > 15 phút khi Phase 3 đã xong | Dừng agent HeyGen rồi tạo lại **chỉ sau khi hỏi người dùng** — video cũ có thể đã được tạo, tạo lại tốn credit lần nữa |

## Chưa khớp — ghi 2026-11-11, chưa sửa (ngoài phạm vi hoặc cần quyết)

1. **Template chuẩn ≠ bản làm việc.** `templates/BDSGeneralTemplate/` có một composition `Root` (đọc `overlays.json`) và 9 kiểu overlay. `workspace/remotion-project/` có 2 composition `BdsGeneralReview` + `BdsApartmentDetail` và thêm 5 component `Scene*`. Bản làm việc là bản mới hơn nhưng chưa được đưa ngược vào template → máy mới chạy `init_project.sh` lần đầu sẽ chép template cũ, không có composition căn hộ.
2. **`package.json` (cả hai bản) vẫn gọi `remotion render Root`**, mà bản làm việc không còn composition `Root`. `init_project.sh` cũng in gợi ý `npx remotion render Root …`.
3. **`init_project.sh` bỏ qua `npm install` khi `workspace/remotion-project/` đã có** — clone mới của repo có thư mục này nhưng không có `node_modules` → phải `npm install` tay (suy từ logic script; chưa chạy thử vì không render).
4. **Agent Phase 3 `mkt-full-video-phase3-remotion-packager`** (SKILL.md gọi đến) chưa có trong `.claude/agents/` lúc kiểm 2026-11-11; thư mục chỉ có `mkt-full-video-phase3-packager.md` (của pipeline HyperFrames).
5. **"10 variant" thực ra là 9.** `ALLOWED_VARIANTS` ở `templates/BDSGeneralTemplate/src/overlays/index.tsx` có 9 tên; `_placement` là hàm hỗ trợ, không phải variant. Ghi "10" còn sót ở docstring `scripts/validate.py` và `package.json` của template.
6. **`references/examples/cap-may-xai-claude.overlays.json` là mẫu cũ** (dùng `punch-white`, `logo-pill`, `count-up-*`, `glitch-text`): `validate.py` báo 17 lỗi — đúng thiết kế, dùng làm ca "phải fail". Skill chưa có mẫu đúng hiện hành; `workspace/remotion-project/public/overlays-general.json` qua validator 0 lỗi — có thể đọc để tham khảo.
7. `references/overlays-schema.md` từng nhắc `examples/linh-lumiere-comparison.overlays.json` — tệp không có trong repo.
8. `assets/logos/` chỉ có `README.md` mô tả cơ chế cũ (LogoPill, symlink); không có tệp logo. Logo của video lấy từ `<workspace>/logos/`.
9. Bản cũ của SKILL.md nhắc `.claude/skills/remotion-best-practices/SKILL.md` — skill này không có trong repo; đã bỏ dòng đó.
10. Giọng mặc định ghi là "voice Hoàng" (`ELEVENLABS_VOICE_ID` trong `.env.example`: "Hoàng's brand voice") trong khi thương hiệu video là Linh Aloha — chưa rõ có chủ đích hay không.
11. Hotline `0977.856.086` và `@linhaloha` xuất hiện trong ví dụ JSON ở `variant-catalog.md` / `overlays-schema.md` — là dữ liệu mẫu từ video cũ; video mới phải lấy hotline và tên từ người dùng.

12. **Helper transcribe / căn phụ đề không nằm ở skill này.** Skill biến thể apartment-detail viết "dùng helper ở `mkt-full-video-with-11-remotion-heygen/scripts/`" nhưng thư mục đó chỉ có `init_project.sh` + `validate.py`. Helper thật: `clean_transcript.py`, `align_to_script.py`, `fix_caption_typos.py` ở `.claude/skills/mkt-hyperframe-talking-head-video/scripts/`; `transcribe_audio.py` ở `.claude/skills/mkt-hyperframe-talking-head-video-16-9/scripts/`. SKILL.md đã trỏ đúng; nên gom về một chỗ.

## Số đo thư mục (2026-11-11)

`templates/BDSGeneralTemplate/` ≈ 41 MB: `public/bgm/coconut-groove.wav` ≈ 34 MiB + 14 tệp `public/sfx/` ≈ 6,2 MiB. Để nguyên, không nén.

## Nhật ký

- 2026-11-11 — tối ưu theo chuẩn skill video (v1.1): viết lại SKILL.md (luật + cổng duyệt tốn credit, quy trình có tiêu chí "xong khi", bảng chọn skill so với biến thể apartment-detail); chuyển bố cục workspace sang `workspace-layout.md`, bảng lỗi sang tệp này; sửa đường dẫn upload HeyGen trỏ đúng `heygen-mp3-to-mp4/scripts/upload_asset.py`; `validate.py` nhận 5 variant `scene-*` và tự đặt UTF-8 (chạy thử: 2 tệp overlays thật 0 lỗi, mẫu cũ 17 lỗi, ca thiếu `rows` báo lỗi); viết lại `evals/evals.json` theo hành vi hiện tại.
