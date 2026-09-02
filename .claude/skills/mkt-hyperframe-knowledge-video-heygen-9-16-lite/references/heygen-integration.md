# HeyGen Integration — Phase 2 LITE (avatar.mp3 → clips)

Khác skill gốc: HeyGen chỉ nhận **`audio/avatar.mp3`** (~30–40% thời lượng, output của `cut_avatar_audio.py`), KHÔNG phải full voiceover. Nhận về 1 MP4 → `split_avatar_video.sh` cắt thành `avatar-clips/clip-NN.mp4` theo `concatMap`. **Đây chính là chỗ tiết kiệm ~60–65% credit.**

## Delegation strategy — KHÔNG re-implement

Skill `heygen-mp3-to-mp4` đã handle upload (REST helper) + create video (MCP) + poll + download. Delegate qua sub-agent `run_in_background: true`, orchestrator tự poll.

## Env requirements

```bash
HEYGEN_API_KEY=...                            # REST upload
HEYGEN_AVATAR_LOOKS=look_id_1,look_id_2,...   # pick random — 1 lần gọi = 1 look nhất quán mọi window
```

Real values ở `~/Documents/GitHub/hoang-ai-marketing/.env`.

## Delegation prompt template

```
Phase 2 — Convert avatar-window MP3 to HeyGen lip-sync MP4 (LITE pipeline).

# Files
- INPUT: <abs>/workspace/content/<date>/<slug>/audio/avatar.mp3   ← KHÔNG phải full.mp3
- OUTPUT: <abs>/workspace/content/<date>/<slug>/avatar_heygen_raw.mp4

# Constraints
- HeyGen avatar look: pick random from HEYGEN_AVATAR_LOOKS env
- Render aspectRatio="9:16", resolution="720p" (= 720×1280 portrait)
- Duration must match avatar.mp3 ±100ms
- Use the `heygen-mp3-to-mp4` skill — its SKILL.md has the full workflow.

# Status reporting
**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
```

## Polling (orchestrator — đừng tin sub-agent)

Audio ~30s → HeyGen render thường **~4–6 phút** (ngắn hơn hẳn bản gốc 10–15 phút). HeyGen KHÔNG stuck nếu `failure_code = null` — chỉ đang queue. Poll `mcp__heygen__get_video` trực tiếp; sub-agent hay bịa elapsed time.

## Split sau khi download

```bash
bash $SKILL/scripts/split_avatar_video.sh $OUT/avatar_heygen_raw.mp4 $OUT
# → cut-plan.json (offset ĐO ĐƯỢC), avatar-clips/clip-NN.mp4 (re-encode keyframe dày),
#   assets/pip-still.png (QA: Read ảnh — mắt mở, miệng đóng; xấu thì re-extract -ss khác)
```

`data-duration` của mount lấy theo **ffprobe clip thật**.

## Đảm bảo lip-sync khớp full.mp3 (cơ chế đo, không đoán)

Chuỗi đồng bộ: `full.mp3 → avatar.mp3 → HeyGen MP4 → clips`. Mũi tên đầu **sample-exact** vì `cut_avatar_audio.py` cắt bằng `atrim` từ chính `full.mp3`. Mũi tên HeyGen là ẩn số duy nhất — dịch vụ có thể chèn lead-in, đuôi, hoặc padding quanh từng chunk.

`verify_avatar_sync.py` (split tự gọi) **đo** chỗ đó thay vì giả định: decode cả `avatar.mp3` lẫn audio HeyGen thành envelope RMS mono 8 kHz / 50 Hz, rồi trượt từng chunk quanh vị trí kỳ vọng ±2.5s tìm lag có tương quan Pearson cao nhất. Envelope tiếng nói rất đặc trưng nên đỉnh tương quan sắc — định vị chính xác tới 1 frame 20ms. Vì đo **theo từng window**, mọi kiểu padding (đầu / đuôi / lệch riêng từng chunk) đều được xử lý bằng cùng một phép đo.

Kết quả test (fixture giả lập HeyGen chèn 0.35s đầu + 0.6s đuôi):

| clip | offset đo được | logic rescale-theo-duration (đã bỏ) | sai lệch nếu dùng logic cũ |
|---|---|---|---|
| 1 | 0.360s | 0.000s | **−360ms** |
| 2 | 9.460s | 9.418s | −42ms |
| 3 | 16.860s | 17.060s | **+200ms** |

Ngưỡng cảm nhận lệch môi ~80ms → logic cũ hỏng thấy rõ ở clip 1 và 3. Đây là lý do rescale theo tỉ lệ duration đã bị thay bằng đo tương quan.

### Hai kiểu lệch, chỉ một kiểu cứu được

Đo một offset cho cả window chỉ mô tả được **dịch cứng** (rigid shift). Nếu HeyGen kéo giãn audio hoặc drop/duplicate frame thì miệng khớp ở đầu clip và sai dần về cuối — một điểm cắt không thể sửa được, và một phép đo toàn cục sẽ không nhìn thấy. Nên script đo thêm **drift nội bộ**: chọn 2 mẫu (một ở nửa đầu, một ở nửa sau window) rồi định vị độc lập; chênh lệch lag giữa 2 mẫu chính là độ giãn.

Hai chi tiết khiến phép đo này đáng tin:
- Mẫu được chọn theo **mức năng lượng cao nhất**, không phải vị trí cố định — window kết thúc bằng khoảng lặng (CTA rất hay như vậy) thì đoạn cuối không có gì để tương quan; nếu nửa sau toàn im lặng, script báo `drift n/a` một cách trung thực (và im lặng thì cũng không có miệng để lệch).
- Drift được **quy đổi ra sai số trên toàn bộ clip** trước khi so ngưỡng, vì cái người xem chịu là lỗi tích luỹ hết clip chứ không phải lỗi trên đoạn mẫu. Kèm điều kiện đọc thô ≥2 khung để nhiễu lượng tử hoá không thành báo động giả.

| Kịch bản test | Kết quả | Exit | Hành động |
|---|---|---|---|
| HeyGen trả nguyên vẹn | lag ~0.000s, drift 0.000s | 0 | cắt bình thường |
| Padding 0.35s đầu + 0.6s đuôi | lag +0.36s (tự bù), drift ~0 | 0 | cắt theo offset đo |
| Kéo giãn audio 1.5% | drift +0.131s / +0.110s trên clip | **4** | `split_avatar_video.sh` **từ chối cắt** (exit 1) |

Đọc output: `corr` gần 1.0 = định vị chắc chắn; `lag` = lượng HeyGen dịch (đã tự bù trong plan); `drift ... across clip` = sai số lip-sync chênh giữa đầu và cuối clip.

- `status: stretched` → exit 4, split dừng hẳn. Chạy lại Phase 2; lặp lại thì chẻ window dài đó thành 2 beat avatar ngắn hơn để mỗi clip gánh ít sai số tích luỹ.
- `status: low-confidence` → exit 3, fallback offset kỳ vọng cho window đó — **dừng lại kiểm tra**, thường do raw MP4 không phải lip-sync của `avatar.mp3` hiện tại (sót file lần chạy trước).

Ngoài ra `-ss` đặt **sau** `-i` khi cắt: fast-seek có thể nhảy về keyframe gần nhất (HeyGen GOP ~8s) và 1 frame lệch ở đây là 1 frame lệch môi.

## Placeholder trong lúc chờ (validate sớm)

Tạo clip placeholder tối màu cho từng window để lint/draft-render toàn composition ngay:

```bash
# đọc windows từ avatar-windows.json, mỗi window 1 placeholder
python3 -c "
import json,subprocess
m=json.load(open('$OUT/avatar-windows.json'))
for c in m['concatMap']:
    subprocess.run(['ffmpeg','-y','-f','lavfi','-i',f'color=c=0x141a28:s=720x1280:d={c[\"dur\"]}',
        '-c:v','libx264','-r','30','-g','30','-pix_fmt','yuv420p',f'$OUT/avatar-clips/clip-{c[\"clip\"]:02d}.mp4'],check=True)
"
```

Swap bằng clip thật (chạy split) khi HeyGen xong, rồi render final.

## Duration & TOTAL

**TOTAL của master = ffprobe `audio/full.mp3`** — KHÔNG liên quan duration video HeyGen (giờ chỉ ~35% video). Chỉ dùng ffprobe từng clip cho `data-duration` của các avatar mount.

## Resume mode (skip Phase 2)

Nếu `avatar-clips/` đã đủ clip khớp `avatar-windows.json` (số lượng + duration ±150ms) → skip Phase 2, vào thẳng scaffold + fanout.

## Common pitfalls

| Pitfall | Fix |
|---|---|
| Gửi nhầm `full.mp3` lên HeyGen | Double-check input là `audio/avatar.mp3` — gửi full là mất luôn khoản tiết kiệm |
| HeyGen render landscape | Set aspectRatio="9:16" resolution="720p" |
| Clip duration lệch window | Trust ffprobe clip; mount `data-duration` theo clip, overlap 0.25s của scene mount che phần dư |
| MCP chỉ expose `authenticate` | Chưa OAuth — run auth flow trước (xem skill `heygen-mp3-to-mp4`) |
| Sub-agent báo "stuck" | Poll trực tiếp `get_video`; `failure_code=null` = đang queue |
| PIP still xấu | Re-extract frame khác: `ffmpeg -ss <t> -i clip-01.mp4 -frames:v 1 assets/pip-still.png` |
