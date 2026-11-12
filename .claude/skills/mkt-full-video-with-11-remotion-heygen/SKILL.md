---
name: mkt-full-video-with-11-remotion-heygen
description: Pipeline Remotion dựng video review dự án BĐS 9:16 (TikTok/Reels) từ script.txt — TTS ElevenLabs/MiniMax → voiceover.mp3 → HeyGen lip-sync → source.mp4 → Phase 3 (Whisper, b-roll, SFX, zoom hook, overlay chữ, contact card) → overlays.json → mở Studio xem trước, KHÔNG tự render. Hỏi xác nhận trước khi tốn credit TTS/HeyGen; 2 cổng duyệt: nghe MP3, duyệt overlays-outline. Dùng khi nói "tạo video bđs remotion", "remotion video pipeline", "video bds 9:16", "video review dự án bđs", "script to remotion mp4", "video broker creator remotion", "remotion heygen pipeline", "react component video bđs", hoặc đưa script BĐS (so sánh dự án, phân khúc, chính sách) muốn ra MP4 9:16. Không dùng cho: review chi tiết 1 căn hộ — mặt bằng, finishing, bảng giá tier (→ mkt-full-video-with-11-remotion-heygen-apartment-detail); pipeline HyperFrames 9:16/16:9 (→ mkt-full-video-with-11-hyperframe-heygen, -16-9); đã có MP3 (→ heygen-mp3-to-mp4); chưa có kịch bản (→ mkt-linh-aloha-bds-video-script).
argument-hint: "[đường-dẫn script.txt] [slug] [--template BDSGeneralTemplate]"
---

# Video review dự án BĐS 9:16 — Remotion + HeyGen (script → preview)

Phiên bản: v1.1 — 2026-11-11

Orchestrator: người dùng chỉ đưa `script.txt`; skill lo TTS → HeyGen lip-sync → Phase 3 (Whisper, kế hoạch b-roll + SFX + zoom hook + chữ overlay + contact card, gộp thành `overlays.json`) → nạp dự án Remotion → báo URL Studio. **Dừng ở xem trước, không tự render MP4.** `$ARGUMENTS` (nếu có) = đường dẫn script hoặc slug; thiếu thì hỏi ở bước 0.

| Đầu vào | Đầu ra |
|---|---|
| `script.txt` (≤ 5000 ký tự). Tuỳ chọn: `broll/*.jpg` (tên ASCII), `logos/avatar.jpg` + `logos/qr-contact.jpg`, hotline, `brand_name` | Trong `workspace/content/YYYY-MM-DD/<slug>/`: `voiceover.mp3` · `source.mp4` · `transcript-cleaned.json` · `caption-groups.json` · `overlays-outline.json` · **`overlays.json`** (bản cuối). Dữ liệu được nạp vào `workspace/remotion-project/public/` + URL Studio `http://localhost:3000`. MP4 chỉ ra khi người dùng bảo render: `workspace/remotion-project/renders/<slug>-draft.mp4` / `-final.mp4` |

## Dùng skill nào

| Video | Skill |
|---|---|
| So sánh 2+ dự án, giới thiệu phân khúc, chính sách bán hàng chung, hook urgency, listicle "Top N điểm cộng", virtual tour | **skill này** (composition `BdsGeneralReview`) |
| Walkthrough chi tiết **1 căn hộ**: diện tích / hướng / view, mặt bằng từng layout, close-up nội thất + finishing brand, grid tiện ích, bảng giá theo tier | `mkt-full-video-with-11-remotion-heygen-apartment-detail` — dùng chung Phase 1 + 2 + Phase 3 transcribe với skill này, chỉ khác lập kế hoạch overlay |
| Đã có MP3, chỉ cần avatar MP4 | `heygen-mp3-to-mp4` |
| Đã có MP4, cần dựng overlay | gọi riêng agent Phase 3 với `source.mp4` có sẵn (bỏ bước 1–2) |
| Muốn HyperFrames thay Remotion (9:16) / video ngang 16:9 | `mkt-full-video-with-11-hyperframe-heygen` / `mkt-full-video-with-11-hyperframe-heygen-16-9` |
| Chưa có kịch bản | `mkt-linh-aloha-bds-video-script` |
| Script > 5000 ký tự | người dùng tách theo ý, mỗi phần một video |

Template: `BDSGeneralTemplate` (mặc định) — code React + ~35 MB âm thanh ở `templates/BDSGeneralTemplate/`, **để nguyên, không sửa `src/` từ pipeline**. Thêm template mới = tạo `templates/<Tên>/` cùng cấu trúc rồi gọi `init_project.sh --template <Tên>`.

## Tham số

| Tham số | Bắt buộc | Mặc định / định dạng |
|---|---|---|
| Script | Có | Đường dẫn `.txt` / `.md` hoặc chữ dán thẳng; ≤ 5000 ký tự |
| `slug` | Không | 5 từ đầu của script, chữ thường ASCII, nối bằng gạch ngang |
| `broll/` | Không | Thư mục ảnh dự án (tên ASCII) → chép sang `$W/broll/`. Không có → bỏ overlay b-roll |
| `logos/` | Không | Cần `avatar.jpg` + `qr-contact.jpg` cho contact card → `$W/logos/`. Thiếu → bỏ contact card, dùng `comment-bubble` làm CTA |
| `hotline`, `brand_name` | Cần nếu có contact card | Hỏi người dùng nếu thiếu (vd `brand_name`: "EM LINH ALOHA") |
| `tts_provider` | Không | `elevenlabs` (mặc định) hoặc `minimax` |
| `voice_id` | Không | `--voice_id <id>`; mặc định lấy từ `.env` |
| `auto_overlays` | Không | `false` — `true` bỏ checkpoint #2 (chỉ khi người dùng nói rõ) |
| `template` | Không | `BDSGeneralTemplate` |

## Luật — không được phá

1. **Cổng xác nhận trước khi tốn tiền** — TTS và HeyGen đều tính credit. Bước 0 báo kịch bản + provider + giọng rồi chờ `OK` mới gọi TTS; `OK` ở checkpoint #1 chính là lệnh cho HeyGen chạy (ghi rõ điều đó trong tin nhắn checkpoint); tạo lại MP3 hay video HeyGen → hỏi lại, không tự thử lại. Hỏi luôn kèm phương án a / b / c.
2. **Giữ 2 checkpoint có sẵn** — #1 nghe MP3 (orchestrator dừng chờ) · #2 duyệt `overlays-outline.json` trước khi finalize (agent Phase 3 giữ). Không tự render MP4, không tự mở trình duyệt, không đăng bài — render là cổng riêng ở Studio.
3. **Khoá API chỉ đọc từ `.env`** (`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `MINIMAX_API_KEY`, `HEYGEN_API_KEY`, `HEYGEN_AVATAR_LOOKS` — xem `.env.example`) — không in giá trị, không chép sang tệp khác.
4. **Không bịa số / pháp lý BĐS** — giá, %, diện tích, mật độ, tiến độ, chính sách trên overlay lấy đúng từ `script.txt`; thiếu thì bỏ overlay đó, ghi "chưa có". Hotline và `brand_name` do người dùng đưa; thiếu thì hỏi, không lấy số trong JSON ví dụ.
5. **Chữ overlay tiếng Việt đủ dấu** (`TÒA`, `M²`), chép từ `script.txt`; mỗi kiểu overlay có hạn độ dài chữ (vd `price-red-3d` ≤ 12 ký tự) — chữ không dấu / quá dài là lỗi hay gặp, xem [lessons-learned.md](references/lessons-learned.md) mục 7.
6. **Brand Linh Aloha** — xưng "em", gọi "anh chị"; câu mở và CTA theo skill kịch bản `mkt-linh-aloha-bds-video-script` (chỉ nhắc, không chép lại ở đây).
7. **Đường dẫn** — tương đối từ gốc repo, không `C:\Users\…` hay `/Users/…`. Tệp `.sh` chạy bằng Git Bash trên Windows; Python: `python` (Windows) / `python3` (macOS); script TTS và HeyGen chạy bằng `uv run`.
8. **Tên tệp bất biến** — `voiceover.mp3`, `source.mp4`, `overlays.json`, `caption-groups.json`; template tìm đúng tên qua `staticFile()`, ở GỐC `public/` (không phải `public/assets/`).
9. **Phase 2 giao trọn cho `heygen-mp3-to-mp4`** — nó tự upload MP3 (REST v3, `.claude/skills/heygen-mp3-to-mp4/scripts/upload_asset.py`), tạo video và poll qua HeyGen MCP. Skill này không gọi tay HeyGen; không dùng endpoint v1/v2 (HeyGen đã ngừng).
10. **Giới hạn cứng** — script ≤ 5000 ký tự; MP3 ≤ 300 giây (HeyGen). Vượt → dừng ở bước 0/1, yêu cầu tách, không tự cắt.
11. **Song song sau checkpoint #1** — HeyGen (nền) + Phase 3 (tiền cảnh) khởi chạy trong MỘT message.
12. **Avatar full-frame 1080×1920** — không chia đôi màn, không PIP. Contact card đúng MỘT lần ở cuối nếu có avatar + QR: `t_start = video_duration − 6`, `duration = 6`, `video_duration = thời lượng MP3 + 3`.
13. **Packager chỉ ghi JSON** — không sửa `.tsx`; chỉ dùng 9 tên variant ở [variant-catalog.md](references/variant-catalog.md); MỘT `overlays.json` gộp b-roll + contact card + chữ (không `broll-inserts.json`) — [lessons-learned.md](references/lessons-learned.md) mục 1 và 5.
14. **Âm thanh** — BGM `coconut-groove.wav` đã gắn sẵn (volume 0.12) trong `Video.tsx`, không thêm BGM thứ hai; SFX ≤ 6 cue / 60 giây.
15. **Xong việc → báo đường dẫn tệp ra + số đo thật** (thời lượng, dung lượng, số overlay, kết quả `validate.py`); chưa chạy bước kiểm thì không nói "xong".

## Quy trình

Đặt `K=.claude/skills/mkt-full-video-with-11-remotion-heygen` · `W=workspace/content/YYYY-MM-DD/<slug>` · `R=workspace/remotion-project`.

**0. Chuẩn bị + cổng xác nhận trước TTS.**
   - Đếm ký tự `script.txt` (≤ 5000); tạo `$W/`, lưu `script.txt`; chép `broll/`, `logos/` vào `$W/` (đổi tên ASCII nếu cần).
   - Kiểm hotline + `brand_name` (thiếu thì hỏi) và khoá TTS có trong `.env` (chỉ kiểm có / không, không in).
   - Báo: workspace, số ký tự, provider + giọng, số ảnh b-roll, có / không logos, template; hỏi `OK` kèm a / b / c (a. ElevenLabs giọng mặc định · b. MiniMax · c. sửa script trước).
   - Xong khi: người dùng trả lời `OK` cho đúng một phương án.

**1. Phase 1 — script → MP3.**
   ```bash
   uv run .claude/skills/mkt-elevenlabs-tts-to-mp3/scripts/text_to_mp3.py --file $W/script.txt -o $W/voiceover.mp3
   uv run .claude/skills/heygen-mp3-to-mp4/scripts/check_duration.py "$W/voiceover.mp3"   # in "OK <giây>"
   ```
   MiniMax → cách gọi ở `.claude/skills/mkt-video-script-to-mp3/SKILL.md`. Xong khi: `voiceover.mp3` có mặt và `check_duration.py` in `OK` (≤ 300 giây).

**2. Checkpoint #1 — người dùng nghe MP3.** Gửi đúng mẫu rồi **dừng chờ**:
   ```markdown
   ## Voiceover xong
   **Tệp:** <W>/voiceover.mp3 · **Thời lượng:** <X>s · **Dung lượng:** <Y> MB · **Provider:** <elevenlabs|minimax>

   Trả lời:
   - `OK` / `tiếp` → chạy HeyGen (TỐN CREDIT HeyGen) + Phase 3 song song
   - `regen` + lý do → chỉnh giọng, tạo lại (tốn credit TTS lần nữa)
   - `sửa script` + nội dung → lưu lại, chạy lại Phase 1
   ```

**3. Phase 2 + Phase 3 song song** (một message, hai agent). Trước khi gọi agent B, Glob `.claude/agents/mkt-full-video-phase3-remotion-packager.md`; **không thấy → dừng, hỏi người dùng** (a. chờ có agent · b. giao `general-purpose` với brief theo mục *Phase 3 làm gì* bên dưới).
   ```
   Agent A — subagent_type: general-purpose · run_in_background: true
     Gọi /heygen-mp3-to-mp4: mp3 = <W>/voiceover.mp3 · output = <W>/source.mp4 (tên `source.mp4` bất biến).
     Lỗi → báo lại, KHÔNG tự tạo video thứ hai (mỗi lần tạo tốn credit).

   Agent B — subagent_type: mkt-full-video-phase3-remotion-packager
     workspace_dir: <W> · slug · script_text · template: BDSGeneralTemplate
     broll_list: <tệp trong $W/broll> · logos: { avatar: logos/avatar.jpg, qr: logos/qr-contact.jpg }
     contact: { name: "<brand_name>", hotline: "<hotline>" }
     auto_overlays: false · audio_source: voiceover.mp3 · source_mp4_pending: true
     Skill folder: .claude/skills/mkt-full-video-with-11-remotion-heygen/ — trả URL Studio, không mở trình duyệt.
   ```

   **Phase 3 làm gì** (đặc tả cho agent; HeyGen render song song nên tổng thời gian chủ yếu là thời gian HeyGen):
   1. Whisper transcribe `voiceover.mp3` → `transcript.json` → `transcript-cleaned.json`; nhóm phụ đề 3–5 từ → `caption-groups.json`. Helper có sẵn ở skill khác: `.claude/skills/mkt-hyperframe-talking-head-video/scripts/clean_transcript.py`, `.claude/skills/mkt-hyperframe-talking-head-video-16-9/scripts/transcribe_audio.py`.
   2. **Căn chữ phụ đề theo `script.txt`** (nguồn sự thật) — sửa Whisper nghe sai tên thương hiệu / dấu thanh / số, giữ mốc thời gian của Whisper: `.claude/skills/mkt-hyperframe-talking-head-video/scripts/align_to_script.py` → `transcript-aligned.json`.
   3. Chọn 12–20 khoảnh khắc nhấn / 60 giây → variant theo cây quyết định ở [variant-catalog.md](references/variant-catalog.md) → 1 b-roll / 10–15 giây → 4–6 SFX → 15–22 zoom hook (cách nhau ≤ 4 giây) → contact card cuối.
   4. Ghi `overlays-outline.json` → **checkpoint #2** (người dùng duyệt danh sách overlay + b-roll + mốc thời gian + variant) → gộp MỘT `overlays.json` → `validate.py` → chờ `source.mp4` → `bash $K/scripts/init_project.sh $W` → trả URL Studio.

**4. Kiểm sau Phase 3** (orchestrator tự chạy).
   ```bash
   python $K/scripts/validate.py $W/overlays.json        # exit 0; Windows: python/py · macOS: python3
   ```
   Xong khi: (a) `validate.py` exit 0; (b) overlay đầu tiên của `$R/public/overlays-general.json` đúng hook của script này, không phải video trước ([lessons-learned.md](references/lessons-learned.md) mục 6); (c) có đúng 1 `contact-card` nếu có avatar + QR, có `broll-image` nếu có b-roll, SFX ≤ 6; (d) `source.mp4` đã nằm trong `$R/public/`.

**5. Bàn giao — dừng ở đây.**
   ```markdown
   ## Pipeline xong — sẵn sàng xem trước
   **Workspace:** <W>
   **Phase 1 (<provider>):** voiceover.mp3 — <D>s, <S> MB
   **Phase 2 (HeyGen):** source.mp4 — <D>s, <S> MB
   **Phase 3:** <N> overlay (gồm <K> broll-image, 1 contact-card), <Z> zoom hook, <S>/6 SFX
   **Studio:** http://localhost:3000 — chọn composition `BdsGeneralReview`
   **Render (khi người dùng bảo):** `npx remotion render <CompositionId> …` (lệnh ở dưới)
   ```
   Render chỉ khi người dùng bảo (lấy `<CompositionId>` bằng `grep -n 'id=' $R/src/Root.tsx`):
   ```bash
   cd $R && npx remotion render <CompositionId> renders/<slug>-draft.mp4 --crf 28 --concurrency 2   # bản nhẹ
   cd $R && npx remotion render <CompositionId> renders/<slug>-final.mp4 --crf 18                    # bản cuối
   ```
   Cấu trúc thư mục, hai chế độ của `init_project.sh`, mô hình dự án dùng chung: [workspace-layout.md](references/workspace-layout.md).

## Chi tiết nằm ở references/

| Cần | Đọc |
|---|---|
| Chọn variant overlay (cây quyết định, trường từng variant, bảng màu, zoom hook, thư viện SFX 14 tệp, BGM, phong cách khoá) | [variant-catalog.md](references/variant-catalog.md) |
| Schema `overlays.json` + ví dụ đủ bộ | [overlays-schema.md](references/overlays-schema.md) |
| 9 lỗi render đã gặp + checklist cho packager | [lessons-learned.md](references/lessons-learned.md) |
| Bố cục workspace, `init_project.sh`, lệnh sau init | [workspace-layout.md](references/workspace-layout.md) |
| Bảng lỗi đầy đủ, việc chưa khớp, nhật ký | [kinh-nghiem.md](references/kinh-nghiem.md) — đọc trước mỗi lần chạy |

## Lỗi hay gặp

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| Script > 5000 ký tự / MP3 > 300 giây | Dừng, yêu cầu tách theo ý (HeyGen giới hạn 5 phút) |
| HeyGen render lỗi | Kiểm credit bằng `mcp__heygen__get_current_user`; lỗi lặp lại → hỏi người dùng (tạo lại tốn credit) |
| `validate.py`: `unknown variant 'punch-white'` (hoặc `logo-pill`, `count-up-*`, `glitch-text`) | Packager dùng tên cũ → `punch` + `color` ([lessons-learned.md](references/lessons-learned.md) mục 1) |
| Studio hiện overlay của VIDEO CŨ (vd caption dự án khác) | `public/overlays-general.json` chưa đổi → chạy lại `bash $K/scripts/init_project.sh $W` ([lessons-learned.md](references/lessons-learned.md) mục 6) |
| Render ra 245 KB / đúng 5 giây | Root rơi vào FALLBACK: thiếu `public/overlays-general.json` (hoặc `-apartment.json`) → chạy `init_project.sh` |
| `npm start` / `remotion: not found` | Chưa có `node_modules` (clone mới; `init_project.sh` bỏ qua `npm install` khi `$R` đã có) → `cd $R && npm install` |
| Máy mới chạy lần đầu mất composition căn hộ | Template chuẩn chưa có `BdsApartmentDetail` — xem *Chưa khớp* ở [kinh-nghiem.md](references/kinh-nghiem.md) |

## Cải tiến skill

Gặp lỗi mới hoặc đổi cách làm → ghi một dòng vào `references/kinh-nghiem.md` (mục *Nhật ký*) và sửa **đúng một chỗ** (SKILL.md này, `references/`, hoặc `scripts/`). Lỗi sinh ra do packager → ghi vào `references/lessons-learned.md` và checklist cuối tệp đó. Kiểm lại: `evals/evals.json`.

## Liên quan

- **Biến thể:** `mkt-full-video-with-11-remotion-heygen-apartment-detail` (review chi tiết 1 căn hộ).
- **Đứng trước:** `mkt-linh-aloha-bds-video-script` / `mkt-vn-short-video-script` (kịch bản) · `mkt-kie-broll-image-generator` (ảnh b-roll).
- **TTS:** `mkt-elevenlabs-tts-to-mp3` (mặc định) · `mkt-video-script-to-mp3` (MiniMax). **HeyGen:** `heygen-mp3-to-mp4`.
- **Agent Phase 3:** `.claude/agents/mkt-full-video-phase3-remotion-packager.md` (nhóm khác phụ trách).
- **Đối chiếu HyperFrames:** `mkt-full-video-with-11-hyperframe-heygen`.
