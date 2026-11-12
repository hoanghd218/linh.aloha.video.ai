# SFX cho video BĐS broker-creator

Đọc khi: chọn / copy / đặt SFX cho project kiểu broker-creator (Phase 3 của `mkt-full-video-with-11-hyperframe-heygen` đọc file này — bản duy nhất của bảng SFX BĐS). SFX là lớp nhấn trên giọng đọc, không phải nhạc nền; giọng đọc là xương sống.

## Quy tắc chung

- Volume 0.22–0.36 (CTA tới 0.36); không bao giờ ≥ 0.40 — không được át giọng.
- Mỗi chữ overlay quan trọng (thương hiệu, giá, gấp rút, CTA) ghép một SFX cùng cường độ; không cần mọi overlay đều có SFX. Tổng ngân sách **tối đa 6 lần phát / video 60s** (quá nhiều thành ồn, người xem lướt).
- Hai SFX cách nhau < 0.6s thì chọn một.
- `data-duration` của `<audio>` đặt ngắn đúng khoảnh khắc (HyperFrames cắt clip audio).
- Tên tệp trong `sfx/` phải ASCII, chữ thường, không dấu cách (WAV gốc có dấu cách / chữ hoa → 404 lúc render).

## Bộ chuẩn 6 tệp (luôn có)

Nguồn: `.claude/skills/mkt-hyperframe-talking-head-video/assets/sfx/`. Đổi tên khi copy:

| Tệp nguồn | Tên trong `sfx/` | Dùng |
|---|---|---|
| `camera-flash.mp3` | `camera-flash.mp3` | Hook mở màn + lộ giá / thương hiệu (≤ 2 lần) |
| `búng tay.mp3` | `snap.mp3` | Câu chốt / punchline |
| `Laser.mp3` | `laser.mp3` | Dấu thương hiệu — tối đa 1 lần / video |
| `ting.mp3` | `ting.mp3` | Ping số / điểm nhấn (3–5 lần) |
| `Whoosh sound effect (1).mp3` | `whoosh.mp3` | Chuyển cảnh / mở danh sách (4–6 lần) |
| `Discord Notification - Sound Effect.mp3` | `chime.mp3` | Chuông CTA cuối — đúng 1 lần |

## Kho BĐS mở rộng (13 tệp theo thiết kế, hiện chỉ có 7 trong repo)

Nguồn: `workspace/assets/01_Sound Bất động sản/` (tên thư mục có dấu tiếng Việt và dấu cách; mới có 9 tệp, gồm cả `ting.mp3` và `Whoosh sound effect (1).mp3` trùng bộ chuẩn). Cột "Có" ghi theo kiểm tra thư mục này; tệp thiếu thì BỎ khỏi kế hoạch SFX — không bịa tên khác, không dừng pipeline (còn bộ chuẩn 6 tệp).

| Tệp nguồn | Tên sau rename | Có | Nhóm | Thời điểm dùng | Trần / video |
|---|---|---|---|---|---|
| `12120 collapsing building.wav` | `collapse.wav` | không | Impact | Đập định kiến / lộ twist (giá tăng, hết quỹ căn) | 1–2 |
| `Sound foot giant.m4a` | `giant-foot.m4a` | không | Impact | Chủ đầu tư bước vào (Masterise, Vingroup, Sun) | 1 |
| `Build Up.WAV` | `build-up.wav` | không | Build | 2–4s trước màn lộ lớn; LUÔN nối với một impact | 2 |
| `Unobtrusive count.WAV` | `count.wav` | không | Count | Đếm "1, 2, 3 lý do" / "120→125→130tr/m²"; volume ngầm | 2 |
| `Pop.WAV` | `pop.wav` | có | Text-pop | Chữ nhỏ: tên phân khu, diện tích, số PN, gạch đầu dòng tiện ích | 6 |
| `UI sound.WAV` | `ui-tap.wav` | có | UI | Chạm nhấn mặt bằng / khoanh tiện ích / icon | 4 |
| `Camera Shutter.WAV` | `camera-shutter.wav` | có | UI | Đổi ảnh render → ảnh thực; cú "chụp" lộ view | 2 |
| `Film Burn.WAV` | `film-burn.wav` | có | Transition | Cắt cảnh điện ảnh: drone → mặt bằng → căn mẫu | 2 |
| `Glitch Sound.WAV` | `glitch.wav` | có | Transition | Trước/sau: Cao Xà Lá xưa vs mới; quy hoạch then-now | 2 |
| `Cyber 11-1.WAV` | `cyber-1.wav` | có | Tech | Lộ số ROI / % tăng giá / yield (volume ≤ 30%) | 2 |
| `Cyber 13-3.WAV` | `cyber-2.wav` | không | Tech | Bản nhẹ hơn cyber-1, bảng so sánh giá | 2 |
| `Digital device.WAV` | `digital-device.wav` | không | Tech | Thông báo FOMO: "khách book cọc" / "căn vừa bị giữ" | 2 |
| `Sci-fi Monitor.WAV` | `scifi-monitor.wav` | có | Tech | Lộ dashboard / biểu đồ tăng giá khu vực 5 năm | 1 |

### Luật ghép (áp ở bước duyệt danh sách chữ nhấn)

- **Build → Reveal:** `build-up.wav` (đuôi 3s) bắt buộc kết thúc bằng một impact (`collapse` / `giant-foot` / `camera-shutter`); không nối build-up với text-pop nhẹ.
- **Không đôi impact:** mỗi video chọn 1 trong 2 file impact; không xếp hai impact cách nhau < 4s.
- **Text-pop:** mỗi overlay `punch-white` / `punch-red` ghép `pop.wav` HOẶC `ui-tap.wav`, không cả hai.
- **Cụm tech theo persona:** `cyber-*`, `scifi-monitor`, `digital-device` chỉ cho persona "đầu tư trẻ" / "ROI buyer"; persona "ở thật" để volume 0 hoặc bỏ.
- **CTA:** video chốt bằng "BLOOM gửi inbox" / "comment 1" có thể dùng `digital-device.wav` 1 lần làm chuông thông báo (nếu có tệp), nếu không dùng `chime.mp3`.

## Copy + đổi tên (chạy ở gốc repo; `P` = thư mục project)

```bash
S="workspace/assets/01_Sound Bất động sản"; K=.claude/skills/mkt-hyperframe-talking-head-video/assets/sfx
D="$P/sfx"; mkdir -p "$D"
# Bộ chuẩn 6 tệp
cp "$K/camera-flash.mp3" "$D/camera-flash.mp3"; cp "$K/búng tay.mp3" "$D/snap.mp3"
cp "$K/Laser.mp3" "$D/laser.mp3";               cp "$K/ting.mp3" "$D/ting.mp3"
cp "$K/Whoosh sound effect (1).mp3" "$D/whoosh.mp3"
cp "$K/Discord Notification - Sound Effect.mp3" "$D/chime.mp3"
# Kho BĐS (chỉ copy tệp có thật, in ra tệp thiếu)
while IFS='|' read -r src dst; do
  if [ -f "$S/$src" ]; then cp "$S/$src" "$D/$dst"; else echo "THIẾU: $src"; fi
done <<'EOF'
12120 collapsing building.wav|collapse.wav
Build Up.WAV|build-up.wav
Camera Shutter.WAV|camera-shutter.wav
Cyber 11-1.WAV|cyber-1.wav
Cyber 13-3.WAV|cyber-2.wav
Digital device.WAV|digital-device.wav
Film Burn.WAV|film-burn.wav
Glitch Sound.WAV|glitch.wav
Pop.WAV|pop.wav
Sci-fi Monitor.WAV|scifi-monitor.wav
Sound foot giant.m4a|giant-foot.m4a
UI sound.WAV|ui-tap.wav
Unobtrusive count.WAV|count.wav
EOF
```

Xong khi: `ls "$D"` có đủ 6 tệp chuẩn và mọi `src="sfx/..."` trong `index.html` trỏ tới tệp có thật.
