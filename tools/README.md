# `bds` — API dữ liệu BĐS cho Claude Code / Codex

CLI zero-dependency (python3 stock) để agent tạo và tra cứu **dự án** + **căn hộ**.
Thiết kế đầy đủ: [`workspace/docs/bds-data-api-design.md`](../workspace/docs/bds-data-api-design.md).

```bash
tools/bds project list
tools/bds schema unit-type            # học contract, khỏi đoán field
tools/bds validate --project cao-xa-la
```

## Hợp đồng

- **stdout luôn là JSON.** Lỗi ra **stderr**, cũng là JSON.
- **Exit code:** `0` ok · `2` not_found · `3` ambiguous · `4` invalid · `5` conflict.
- **Mọi lệnh ghi có `--dry-run`** — in ra sẽ ghi gì, không đụng file.
- **Idempotent:** upsert theo khoá tự nhiên; chạy 2 lần ra cùng kết quả.
- **`--compact`** để JSON 1 dòng (đỡ token). Nhận ở cả 2 vị trí:
  `bds --compact project list` hoặc `bds project list --compact`.
- Lỗi luôn kèm `allowed` / `did_you_mean` để agent tự sửa, không phải hỏi người.

## Nguồn sự thật

```
workspace/data/projects.json              registry: danh tính + wiring dự án
workspace/data/<dự án>/
  _data/towers.json                       tòa + cụm tầng
  _data/unit-types.json                   typology  ← thứ pipeline video đọc
  _data/units-L1.json  units-L2.json      căn cụ thể (sinh tự động)
  _assets/asset-catalog.json              ảnh (do skill LITE sinh, bds chỉ đọc)
  _kien-thuc-du-an/*.md                   note cho người + LLM đọc
```

`unit-types.json` là resource **load-bearing**: video kể chuyện bằng typology
("2PN+1ĐN, 110,7 m² tim tường, ban công bo cong"), không phải bằng 966 căn.

## Lệnh

### Đọc
```bash
bds project list [--all-status]
bds project resolve --project "cao xà lá"        # fuzzy, bỏ dấu
bds project show    --project cao-xa-la          # tổng quan mọi tầng dữ liệu
bds project paths   --project cao-xa-la

bds tower list  --project cao-xa-la [--with-floors]
bds tower show  --project cao-xa-la --tower L1

bds unit-type list --project cao-xa-la [--tower L1] [--group 2br+1mr]
bds unit-type show --project cao-xa-la --code L1-2BR1MR-1

bds unit list --project cao-xa-la [--tower L1] [--floors 12-22] \
              [--type L1-2BR-3] [--status available] [--code CH-01] [--limit 200]
bds unit show --project cao-xa-la --tower L1 --code CH-01 --floor 20

bds asset list --project cao-xa-la [--category floorplan] [--starred]
bds validate   --project cao-xa-la [--full]
bds schema     [project|tower|unit-type|unit]
```

### Ghi
```bash
# tạo dự án mới + dựng khung thư mục
echo '{"name":"...","shortName":"...","developer":"..."}' \
  | bds project create --json - --dry-run

# nạp tài liệu thô + build lại asset-catalog
bds project ingest --project <slug> --src ~/Downloads/<thư mục>

# khai tòa rồi mới khai typology (thứ tự bắt buộc — có kiểm tra tham chiếu)
bds tower     upsert --project <slug> --file towers.json
bds unit-type upsert --project <slug> --file unit-types.json

# sinh căn từ towers × unit-types
bds unit generate --project <slug> --tower L1 [--floors 5-46] [--overwrite]

# sửa từng căn (chốt typology, điền hướng/giá/status)
echo '[{"tower":"L1","floor":10,"code":"CH-12","typeCode":"L1-1BR-2","direction":"DN"}]' \
  | bds unit upsert --project <slug> --json -
```

`--json -` đọc stdin · `--json '<inline>'` · `--file <path>`.

## Luồng tạo dự án mới

```
1. bds project create            ← API
2. bds project ingest --src ...  ← API (copy tài liệu + asset-catalog)
3. Đọc PDF/brochure → viết _kien-thuc-du-an/*.md   ← LLM, KHÔNG phải API
4. bds tower upsert              ← API
5. bds unit-type upsert          ← API
6. bds unit generate             ← API
7. bds validate                  ← API, phải exit 0
```

Ranh giới cố định: **API validate + ghi; LLM đọc + phán đoán.** Đừng nhét
việc đọc tài liệu vào API.

## Giới hạn đã biết

- **`unit generate` là scaffold gần đúng, không phải bảng hàng.** Một mã căn
  có thể thuộc nhiều typology tuỳ cụm tầng; tài liệu mặt bằng chỉ ghi
  typology→mã căn, không ghi tầng→typology. Căn nào không chốt được sẽ có
  `typeCode: null` + `typeCandidates: [...]` + `needsResolution: true`. Không
  đoán bừa. `bds validate` đếm số còn nợ.
- `_data/units-*.json` ~430 KB/tòa và **sinh lại được** từ towers + unit-types.
  Cân nhắc có commit hay không tuỳ nhu cầu.
- Chưa có: import Excel bảng hàng, bảng giá theo version, chính sách bán hàng
  — cố ý bỏ, ngoài phạm vi "phục vụ pipeline video" đã chốt.

## Cấu trúc code

```
tools/bds              CLI (vỏ mỏng, không có logic)
tools/bdscore/
  text.py        chuẩn hoá tiếng Việt + did_you_mean
  errors.py      lỗi có cấu trúc + exit code + gộp lỗi trùng
  paths.py       dò repo/workspace-data
  store.py       đọc/ghi JSON atomic, thứ tự key ổn định
  schema.py      schema các resource + validator tự viết
  registry.py    projects.json + resolver fuzzy
  towers.py      tòa + cụm tầng (parse "12-19,21-31,33")
  unit_types.py  typology
  units.py       sinh/sửa căn
  assets.py      đọc asset-catalog.json
  projects.py    create / ingest / show
  validate.py    lint toàn dự án
tools/seed/            dữ liệu seed đã rút từ markdown (Cao Xà Lá)
```

MCP server sẽ là vỏ thứ hai gọi đúng `bdscore` — không viết lại logic.
