# Kho ảnh dự án BĐS — resolve · catalog · fetch

## Purpose
Lấy ảnh của **dự án BĐS đang bán** từ `workspace/data/` vào `media/` của project video, đúng theo chỉ định của user, tên file ASCII, có mô tả sẵn để gán beat. Đây là Phase 0.3 → 0.7 của profile `bds-broker`, chạy TRƯỚC TTS.

## When to Load
Bất cứ khi nào chạy skill với `--profile bds-broker`, hoặc khi user nhắc tên một dự án BĐS.

---

## 1. Cấu trúc dữ liệu

```
workspace/data/
├── projects.json                       ← registry (dự án nào đang bán, folder nào, map category)
└── <Tên dự án>/                        ← vd "Cao xà lá"
    ├── _kien-thuc-du-an/               ← knowledge notes (số liệu thật cho script)
    │   └── 12 - Thư viện hình ảnh.md   ← MÔ TẢ SẴN từng ảnh — nguồn vàng, đọc trước
    ├── _assets/asset-catalog.json      ← SINH RA, cache dùng chung cho mọi skill
    ├── PHỐI CẢNH/…                     ← ảnh render ngoại thất
    ├── MẶT BẰNG/…                      ← TMB + mặt bằng tầng L1/L2
    └── TIÊU CHUẨN BÀN GIAO…/…
```

`projects.json` — mỗi dự án: `slug · name · shortName · aliases[] · dir · developer · status · phase · location · scale · knowledgeDir · libraryMd · assetRoots{} · illustrativeDisclaimer · hotline · brandAssets{}`.
`status`: `dang-ban | sap-mo-ban | da-ban-het | tam-dung` — chỉ `dang-ban` được auto-chọn.
`assetRoots` map `thư mục → category`, **ghi đè** heuristic đoán theo tên folder. Thêm dự án mới mà không khai `assetRoots` vẫn chạy được (heuristic + mô tả), chỉ kém chính xác hơn.

## 2. Ba lệnh

```bash
SKILL=<abs path skill dir>

# 0.3 — tên dự án (tiếng Việt có dấu / không dấu / alias / slug) → folder
python3 $SKILL/scripts/resolve_project.py --project "Cao xà lá"
python3 $SKILL/scripts/resolve_project.py --list          # dự án đang bán

# 0.5 — dựng catalog (cache trong _assets/, chạy 1 lần / dự án)
python3 $SKILL/scripts/build_asset_catalog.py --project "Cao xà lá" --summary

# 0.7 — copy vào media/ theo chỉ định
python3 $SKILL/scripts/fetch_project_assets.py --project "Cao xà lá" --out $OUT/media \
    --files "thác nước về đêm,facade,mặt bằng tiện ích"
```

Exit code của resolve: `2` = không tìm thấy (in kèm candidates), `3` = mơ hồ. Cả 3 script in JSON ra stdout, log người-đọc ra stderr.

### Ba mức chỉ định, ưu tiên giảm dần

| Mức | Cú pháp | Hành vi |
|---|---|---|
| **User chỉ định** | `--files "thác nước về đêm,facade-01,floorplan-l1-02"` | LUÔN THẮNG. Match theo tên ASCII → tên gốc → **mọi từ trong token có mặt trong mô tả/synonym**. Token khớp nhiều ảnh → lấy ảnh rank cao nhất, log các ảnh bị bỏ. Token không khớp → `notFound`, KHÔNG im lặng bỏ qua |
| **Theo nhóm** | `--include exterior-night,amenity,handover-spec` | Lọc theo category (và subcategory), sort theo rank |
| **Auto** | (không truyền gì) | Rank = `hookRank` → `starred` → có mô tả → độ phân giải; trải đều category (tối đa 4/category, 2 với floorplan/masterplan/handover) |

`--max N` (mặc định 12) · `--exclude doc-scan` (mặc định) · `--max-dim 2160` (re-encode, tránh JPEG 6000px làm nghẽn render) · `--dry-run` để xem trước.

## 3. Catalog schema (`_assets/asset-catalog.json`)

```json
{ "file": "PHỐI CẢNH/PHỐI CẢNH BÊN NGOÀI/4.jpg",
  "abs": "/…/4.jpg",
  "category": "exterior-night", "subcategory": null,
  "ascii": "exterior-night-01.jpg",
  "description": "Thác nước biểu tượng về đêm — phát sáng vàng rực, đèn LED dưới hồ",
  "useFor": ["Thumbnail / hook mạnh nhất", "cú wow, dễ viral"],
  "hookRank": 1, "starred": true,
  "w": 1536, "h": 1024, "orientation": "landscape",
  "illustrative": true, "fitMode": "cover",
  "needsDescription": false, "source": "library-md" }
```

- **`ascii`** = `{category}[-l1|-l2]-{NN}[-slug].jpg` — chống trùng theo cấu trúc: `1.jpg` của PHỐI CẢNH và `1.jpg` của TIÊU CHUẨN BÀN GIAO ra 2 tên khác nhau.
- **`source`**: `library-md` (có mô tả tay) · `fs-scan` (chỉ quét được, `needsDescription: true`) · `orchestrator` (mô tả do agent Read ảnh rồi patch vào, được giữ nguyên khi rebuild trừ khi `--force`).
- **`fitMode`**: `cover` (crop 9:16 thoải mái) · `pad` (floorplan / masterplan / doc-scan — `fetch` sinh thêm biến thể `-9x16.jpg` nền tối, contain-fit).
- **`hookRank` 1-3** đọc từ callout "3 ảnh đắt giá nhất làm hook" trong note.

**Ảnh chưa có mô tả**: đọc catalog, lọc `needsDescription: true`, Read ảnh, ghi mô tả + `useFor` ngược vào catalog với `"source": "orchestrator"`. Lần chạy sau không phải làm lại. Không cần mô tả toàn bộ 42 mặt bằng tầng — chỉ mô tả những ảnh thực sự định dùng.

## 4. Category taxonomy → dùng cho beat nào

| Category | Nội dung | Beat hợp | fitMode |
|---|---|---|---|
| `exterior-hero` | Hero shot toàn cụm tháp, ánh nắng vàng | Hook, mở màn, brand reveal, kết | cover |
| `exterior-night` | Cảnh đêm, đèn, thác nước phát sáng | **Hook mạnh nhất**, cú wow, thumbnail | cover |
| `facade` | Mặt đứng, chi tiết kiến trúc | Beat kiến trúc / thương hiệu CĐT | cover |
| `aerial-location` | Drone, định vị trong đô thị, metro | Beat vị trí / kết nối / tiềm năng | cover |
| `masterplan` | TMB top-down, phân khu, legend tiện ích | Beat quy mô / quy hoạch / phân khu | pad |
| `amenity` | Clubhouse, bể bơi, cảnh quan, pavilion | Beat tiện ích / lifestyle | cover |
| `interior` | Phòng khách, bếp, view từ căn hộ | Beat sản phẩm / trải nghiệm sống | cover |
| `handover-spec` | Cửa, trần, sàn, thiết bị bàn giao | Beat tiêu chuẩn bàn giao / chất lượng | cover |
| `floorplan` | Mặt bằng tầng L1/L2 | Beat layout / loại căn / diện tích | pad |
| `doc-scan` | Scan brochure, bảng biểu | Hiếm dùng, mặc định bị `--exclude` | pad |

## 5. Gán ảnh vào beat — luật chống lạc đề (HARD)

Ảnh chỉ được chèn khi **minh họa đúng nghĩa câu đang nói tại đúng giây đó**. Beat trống để avatar/motion-graphic gánh vẫn tốt hơn ảnh sai ngữ cảnh.

| Câu đang nói | Chèn ảnh? | Loại ảnh |
|---|---|---|
| Tên dự án / CĐT (brand reveal) | CÓ | `exterior-hero`, `facade` |
| Vị trí, đất, metro, kết nối | CÓ | `aerial-location` |
| Quy mô, số tòa, mật độ xây dựng | CÓ | `masterplan`, `facade` |
| Tiện ích cụ thể (bể bơi, clubhouse) | CÓ | `amenity` (đúng tiện ích đang nói) |
| Căn hộ, view, không gian sống | CÓ | `interior` |
| Diện tích / loại căn / layout | CÓ | `floorplan` (**zoom vào cụm căn**, xem §6) |
| Tiêu chuẩn bàn giao, vật liệu | CÓ | `handover-spec` |
| **Giá, so sánh giá, "tính ra rẻ hơn"** | **KHÔNG** | Giá không có vật thể để minh họa → motion-graphic số |
| **Chính sách, lãi suất, tiến độ thanh toán** | **KHÔNG** | Dùng timeline/bảng motion-graphic |
| **CTA ("inbox em Linh", "bình luận BLOOM")** | **KHÔNG** | Avatar + contact card |
| **Khái niệm trừu tượng ("hợp lý", "đáng tiền")** | **KHÔNG** | — |
| **Quá khứ ("ngày xưa khu này là nhà máy")** | **KHÔNG** (trừ khi có ảnh tư liệu cũ) | Render hiện đại KHÔNG BAO GIỜ hợp cảnh quá khứ |

Bẫy hay gặp: ảnh nội thất đè lên đoạn so sánh giá · ảnh gym/bể bơi đè đoạn "giá khởi điểm" · ảnh clubhouse đè đoạn "10 tòa" (phải là TMB/facade) · ảnh sảnh đè đoạn "khu đất cuối cùng" (phải là drone).

**Định lượng cho video 60-90s:** 5-9 ảnh dùng thật, 1-3 lần b-roll full-canvas. Không đạt chỉ tiêu vì thiếu ảnh hợp → **giảm chỉ tiêu**, đừng nhét ảnh lạc đề.

## 6. Ba luật riêng của ảnh BĐS

1. **Mặt bằng KHÔNG show nguyên bản.** Bản vẽ A3 co về 1080px là chữ không đọc nổi (đã kiểm chứng). Luôn zoom vào cụm căn đang nói: đặt `<img>` rộng 2.2-3x canvas, `transform-origin` tại cụm căn, GSAP scale/translate chậm; hoặc dùng biến thể `-9x16.jpg` làm nền mờ + card số liệu motion-graphic đè lên. Ghi rõ vùng cần zoom trong prompt sub-agent.
2. **Disclaimer bắt buộc.** Ảnh có `illustrative: true` → scene phải có chip nhỏ "Ảnh minh họa" (12-14px, opacity 0.55, góc dưới-trái, trên vùng cấm captions).
3. **Số liệu lấy từ `_kien-thuc-du-an/`, không lấy từ trí nhớ.** Ảnh và số phải cùng một nguồn dự án; giá tin đồn phải nói rõ là "dự kiến / tin đồn".

## 7. Thêm dự án mới — checklist

1. Tạo `workspace/data/<Tên dự án>/`, đổ ảnh vào các thư mục con theo chủ đề.
2. Thêm entry vào `projects.json` (`status: dang-ban`, `aliases` gồm cả cách gõ không dấu, `assetRoots` map thư mục → category).
3. (Nên có) Viết `_kien-thuc-du-an/12 - Thư viện hình ảnh.md` theo đúng format bảng của Cao Xà Lá: `| \`file.jpg\` | Nội dung | Dùng tốt cho |`, header section chứa đường dẫn thư mục trong backtick, callout `> [!tip] … hook` để đánh dấu 3 ảnh hook.
4. `build_asset_catalog.py --project <tên> --summary` → soi cột `_described`; ảnh quan trọng còn `needsDescription` thì Read rồi patch mô tả.

## 8. Troubleshooting

| Triệu chứng | Nguyên nhân / xử lý |
|---|---|
| `error: not-found` | Sai tên → xem `--list`; hoặc dự án chưa có trong `projects.json` (folder mới vẫn được auto-discover với `status: unknown`) |
| `error: ambiguous` | 2 dự án cùng điểm → gọi bằng `slug` |
| Warning "Section … trỏ tới thư mục không tồn tại" | Note MD viết sai đường dẫn hoặc thư mục đã đổi tên → sửa note rồi `--force` |
| `_described` thấp bất thường | Note MD không đúng format bảng (thiếu backtick quanh tên file, header cột lạ) |
| Ảnh 404 lúc render | Đang trỏ thẳng vào `workspace/data/` thay vì `media/` — mọi ảnh PHẢI đi qua `fetch_project_assets.py` (tên gốc có dấu, có case thừa space cuối tên) |
| Ảnh vào nhầm category | Khai `assetRoots` cho thư mục đó trong `projects.json` rồi `build_asset_catalog.py --force` |
