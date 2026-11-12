# Workspace layout — dự án Remotion dùng chung

Đọc khi cần biết tệp nằm đâu, `init_project.sh` làm gì, hoặc vì sao Studio hiện nhầm video cũ. Skill biến thể `mkt-full-video-with-11-remotion-heygen-apartment-detail` dùng đúng bố cục này, chỉ khác tên tệp JSON.

## Mô hình MỘT dự án Remotion dùng chung

MỘT thư mục `workspace/remotion-project/` dùng cho MỌI video. Mỗi video có thư mục riêng giữ dữ liệu của nó; `init_project.sh` đổi dữ liệu đó vào `public/` của dự án chung khi cần xem trước / render.

```
workspace/
├── remotion-project/                # DÙNG CHUNG — một cái cho mọi video
│   ├── src/                         # component overlay + Root + Video + Avatar + Captions …
│   ├── public/                      # dữ liệu video đang nạp (đổi mỗi lần init)
│   │   ├── voiceover.mp3            # ← video hiện tại
│   │   ├── source.mp4               # ← video hiện tại
│   │   ├── overlays.json            # ← video hiện tại (hợp đồng workspace)
│   │   ├── overlays-general.json    # ← bản BdsGeneralReview đọc (cùng nội dung overlays.json)
│   │   ├── overlays-apartment.json  # ← bản BdsApartmentDetail đọc (skill biến thể ghi)
│   │   ├── caption-groups.json      # ← video hiện tại
│   │   ├── broll/  logos/           # ← video hiện tại
│   │   ├── bgm/coconut-groove.wav   # ← mặc định của template (giữ nguyên)
│   │   └── sfx/<14 tệp>             # ← mặc định của template (giữ nguyên trừ khi workspace ghi đè)
│   ├── node_modules/                # npm install MỘT lần (~150 MB, dùng chung)
│   ├── package.json + tsconfig + remotion.config.ts
│   └── renders/                     # MP4 ra: <slug>-draft.mp4 / <slug>-final.mp4
│
└── content/YYYY-MM-DD/<slug>/       # thư mục RIÊNG của từng video
    ├── script.txt                   # đầu vào
    ├── voiceover.mp3                # Phase 1
    ├── source.mp4                   # Phase 2
    ├── transcript.json              # Phase 3 (Whisper thô)
    ├── transcript-cleaned.json      # Phase 3 (đã sửa lỗi nghe)
    ├── caption-groups.json          # Phase 3 (3-5 từ / nhóm)
    ├── overlays-outline.json        # bản xem trước ở checkpoint #2
    ├── overlays.json                # BẢN CUỐI — nguồn sự thật duy nhất (gộp mọi overlay)
    ├── broll/                       # ảnh dự án người dùng đưa (tên ASCII)
    └── logos/                       # avatar.jpg + qr-contact.jpg
```

Vì sao dùng chung: tiết kiệm ~150 MB × N `node_modules` và bỏ `npm install` cho mọi video sau video đầu. Đổi lại: chỉ xem trước MỘT video tại một thời điểm; đổi video = chạy lại `init_project.sh <thư-mục-video-khác>` (nhanh).

## `init_project.sh` — 2 chế độ

```bash
bash .claude/skills/mkt-full-video-with-11-remotion-heygen/scripts/init_project.sh <workspace> [--template BDSGeneralTemplate] [--remotion-root <đường dẫn>]
```

- **Lần đầu** (chưa có `workspace/remotion-project/`): chép template (`src`, `public` có bgm + sfx, `package.json`, `tsconfig.json`, `remotion.config.ts`) rồi `npm install` (một lần, vài chục giây).
- **Các lần sau** (thư mục đã có): KHÔNG chép template, KHÔNG `npm install`. Chỉ đổi `voiceover.mp3`, `source.mp4`, `overlays.json` (+ bản trùng tên Root đọc), `caption-groups.json`, `broll/`, `logos/` vào `public/`. `bgm/` và `sfx/` được giữ — trừ khi workspace có `sfx/` (hoặc `sfx-bds/`) / `bgm/` riêng thì ghi đè.
- Script là bash: Windows chạy trong Git Bash; macOS chạy thẳng.

## Tệp JSON nằm ở GỐC `public/`, không phải `public/assets/`

`Root.tsx` đọc bằng `staticFile('<tên>.json')`. Bản làm việc `workspace/remotion-project/` đăng ký 2 composition: `BdsGeneralReview` đọc `overlays-general.json`, `BdsApartmentDetail` đọc `overlays-apartment.json`. `init_project.sh` ghi `overlays.json` VÀ bản đúng tên composition (`-general` hoặc `-apartment`, theo tên template). Chi tiết lỗi gốc: [lessons-learned.md](lessons-learned.md) mục 2 và 6.

Bản template chuẩn trong skill (`templates/BDSGeneralTemplate/`) chỉ có composition `Root` đọc `overlays.json`, 9 kiểu overlay, không có 5 scene căn hộ — xem *Chưa khớp* ở [kinh-nghiem.md](kinh-nghiem.md).

## Lệnh sau khi init

```bash
cd workspace/remotion-project
npm install                                   # chỉ khi chưa có node_modules (clone mới)
npm start                                     # Studio, http://localhost:3000
npx remotion render <CompositionId> renders/<slug>-draft.mp4 --crf 28 --concurrency 2   # bản nhẹ
npx remotion render <CompositionId> renders/<slug>-final.mp4 --crf 18                    # bản cuối
```

`<CompositionId>`: lấy bằng `grep -n 'id=' src/Root.tsx` — `BdsGeneralReview` / `BdsApartmentDetail` ở bản làm việc, `Root` ở bản template chuẩn. Các script `npm run render-draft` / `render-final` trong `package.json` đang gọi `Root` (xem *Chưa khớp*).
