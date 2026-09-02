# API dữ liệu BĐS (dự án + căn hộ) cho Claude Code / Codex / MCP — Thiết kế

> Trạng thái: **ĐÃ CHỐT — đang build**. Xem mục 9 cho 3 quyết định đã chốt.
> Mục tiêu: agent (Claude Code, Codex, hoặc MCP client) tạo/cập nhật **dự án** và **căn hộ** tự động, và pipeline video đọc lại được dữ liệu đó.
>
> **Phạm vi đã chốt: chỉ phục vụ pipeline video.** Bỏ khỏi bản build: import Excel bảng hàng, price-list có version, policy. `price` giữ lại như field thường trên Unit/UnitType vì scene giá trong skill `...-apartment-detail` cần.

---

## 0. Nguyên tắc cốt lõi (đọc trước)

- **API là "bàn tay an toàn", KHÔNG phải bộ não.** Việc đọc PDF mặt bằng / markdown / bảng hàng Excel rồi rút ra JSON là việc của LLM (Claude/Codex). API chỉ: nhận JSON → validate schema → ghi atomic → trả lỗi rõ ràng để agent tự sửa. Đừng nhồi "AI" vào API.
- **Filesystem đang là database và nó đang chạy tốt.** `workspace/data/projects.json` + `_assets/asset-catalog.json` đã là 2 bảng thật, được git version, được 5 script đọc. Không đập đi.
- **Đã có sẵn 3 "endpoint" dạng CLI** trong `.claude/skills/mkt-hyperframe-knowledge-video-heygen-9-16-lite/scripts/`: `resolve_project.py` (JSON stdout + exit code 0/2/3), `build_asset_catalog.py`, `fetch_project_assets.py`. Đây chính là prototype của API này — việc cần làm là **chuẩn hóa + mở rộng**, không phải làm lại từ đầu.
- **Khoảng trống lớn nhất: dữ liệu CĂN HỘ chưa hề có cấu trúc.** Toàn bộ 44 typology (24 tòa L1 + 20 tòa L2) đang nằm trong bảng markdown ở `_phan-tich/mat-bang-can-ho.md` và `_kien-thuc-du-an/08 - Sản phẩm căn hộ...`. Người đọc được, máy không query được. Đây là thứ phải làm trước tiên.
- **Mỗi lệnh ghi phải có `--dry-run` và phải idempotent.** Agent sẽ chạy lại lệnh nhiều lần khi retry; chạy 2 lần không được ra 2 bản ghi.

---

## 1. Vì sao cần — payoff thật

Không phải để "có API cho sang". Ba việc đang tốn tay:

| Việc đang làm tay | Sau khi có API |
|---|---|
| Mở 1 dự án mới → tạo thư mục, gõ entry vào `projects.json`, chạy 3 script rời rạc | `bds project create` + `bds project ingest` — 2 lệnh |
| Viết script video review căn CH-01 → tự tra DT tim / DT TT / hướng / view trong 4 file markdown | `bds unit show --code CH-01` → JSON đủ thông số, feed thẳng vào skill |
| Bảng hàng CĐT gửi hàng tuần (Excel) → đọc tay, không biết căn nào vừa bán | `bds unit import --xlsx` → diff ra căn nào đổi status/giá |
| Skill `...-apartment-detail` phải hard-code từng con số vào script | Skill đọc `units.json` → sinh video review **hàng loạt** cho N căn |

Cái cuối là ROI lớn nhất: từ "1 video/1 lần ngồi viết" thành "1 lệnh → 20 video review căn".

---

## 2. Kiến trúc đề xuất — 4 lớp, 1 lõi

```
┌─ L4 (SAU, tùy chọn) HTTP REST / Supabase ── web dashboard cho team sale
├─ L3  MCP server (stdio)  ────────────────── Claude Desktop, client khác
├─ L2  CLI  `bds <noun> <verb> --json`  ───── Claude Code + Codex gọi qua Bash  ★ ưu tiên
└─ L1  Core lib  tools/bdscore/  ──────────── schema + repository + validate
                        │
                        └── workspace/data/**  (nguồn sự thật, git-versioned)
```

**Nguyên tắc**: L2/L3/L4 là vỏ mỏng gọi đúng hàm của L1. Không lớp nào có logic riêng. Thêm 1 chức năng = sửa L1 + 3 dòng ở mỗi vỏ.

### Vì sao ưu tiên CLI (L2) chứ không phải MCP hay HTTP

| | CLI | MCP | HTTP |
|---|---|---|---|
| Claude Code dùng được | ✅ ngay, qua Bash | ✅ cần cấu hình `.mcp.json` | ✅ cần server chạy |
| **Codex dùng được** | ✅ ngay | ⚠️ tùy version | ✅ |
| Chạy trong skill/script Python | ✅ | ❌ | ✅ |
| Cron / CI | ✅ | ❌ | ✅ |
| Hạ tầng phải nuôi | không | không | có (process, port, auth) |
| Debug bằng tay | ✅ gõ thẳng terminal | ❌ | curl |

→ **CLI trước.** MCP thêm sau ~0,5 ngày vì chỉ là wrapper. HTTP chỉ khi có web UI thật.

---

## 3. Mô hình dữ liệu

Tách rõ 2 khái niệm mà hiện markdown đang trộn:

- **UnitType (loại căn / typology)** — "1BR+1MR – Loại 4", DT Tim 90,1 m², DT TT 83,7–84,2 m². Tòa L1 có 24 loại.
- **Unit (căn cụ thể)** — CH-08 tầng 15 tòa L1, hướng Đông Nam, DT TT 83,9 m², giá 6,2 tỷ, còn hàng. Tòa L1 có ~966 căn (23 căn × tầng 5–46).

Môi giới bán **Unit**; marketing kể chuyện bằng **UnitType**. Cần cả hai.

```
Project (dự án)  ── slug, name, developer, status, location, scale, hotline, disclaimer
 └── Tower (tòa / phân khu)  ── code "L1", floorFrom/To, unitsPerFloor, floorGroups[]
      ├── UnitType (typology) ── code, group(studio|1br|1br+1mr|2br|2br+1mr|3br+1mr),
      │                          dtTim, dtTtMin/Max, bedrooms, mrRooms, features[],
      │                          floorplanAsset → trỏ vào asset-catalog
      └── Unit (căn)          ── code "CH-01", floor, typeCode, direction, view,
                                 dtTt, price, pricePerM2, status(available|reserved|sold|hold)
PriceList (bảng giá)  ── version, effectiveDate, rows[]        ← lịch sử, không ghi đè
Policy (chính sách)   ── payment schedules, khuyến mãi, timeline
Asset (ảnh/tài liệu)  ── ĐÃ CÓ: _assets/asset-catalog.json
```

### Layout file trên đĩa

```
workspace/data/projects.json                 ← registry (GIỮ NGUYÊN, chỉ thêm field)
workspace/data/<dir>/
  _data/                                     ← MỚI
    project.json                             metadata chuẩn hóa
    towers.json                              L1, L2 + floorGroups
    unit-types.json                          44 typology (parse từ markdown hiện có)
    units-L1.json  units-L2.json             ~1000 căn/file — tách theo tòa để diff git đọc được
    price-list.json                          có version
    policy.json
  _assets/asset-catalog.json                 ← ĐÃ CÓ, giữ nguyên
  _kien-thuc-du-an/                          ← ĐÃ CÓ — markdown cho người + LLM đọc
  _phan-tich/                                ← ĐÃ CÓ
  MẶT BẰNG/ PHỐI CẢNH/ ...                   ← tài liệu gốc
```

Markdown **không bị thay thế** — nó vẫn là nơi kể chuyện, `_data/*.json` là nơi query. Hai chiều bổ sung nhau, và `bds validate` sẽ cảnh báo khi 2 bên lệch số.

---

## 4. Bề mặt API — danh sách lệnh cụ thể

Mỗi lệnh = **1 MCP tool tương ứng 1:1**. Luôn JSON ra stdout, lỗi ra stderr, exit code có nghĩa.

### Đọc (read)

| Lệnh | Trả về |
|---|---|
| `bds project list [--status dang-ban]` | mảng dự án |
| `bds project resolve "cao xà lá"` | 1 dự án — **tái dùng `resolve_project.py`** (fuzzy, bỏ dấu) |
| `bds project show cao-xa-la` | project + towers + counts + tổng quan asset |
| `bds unit-type list --project cao-xa-la [--tower L1] [--group 2br]` | typology |
| `bds unit list --project cao-xa-la [--tower L1] [--floors 12-22] [--type ...] [--status available] [--price-max 6e9]` | căn, có phân trang |
| `bds unit show --project cao-xa-la --tower L1 --code CH-01 [--floor 20]` | 1 căn + typology + ảnh mặt bằng |
| `bds asset list --project cao-xa-la [--category floorplan]` | wrap asset-catalog |
| `bds schema <project\|unit\|unit-type\|...>` | JSON Schema — **để agent tự học contract, khỏi đoán** |

### Ghi (write) — mọi lệnh đều có `--dry-run`

| Lệnh | Việc |
|---|---|
| `bds project create --json -` | scaffold thư mục + ghi entry vào registry |
| `bds project ingest --project <slug> --src <folder>` | copy tài liệu thô vào đúng chỗ + chạy `build_asset_catalog` |
| `bds project update --project <slug> --patch -` | patch từng field (JSON merge patch) |
| `bds tower upsert --project <slug> --json -` | khai báo tòa + cụm tầng |
| `bds unit-type upsert --project <slug> --json -` | bulk array typology |
| **`bds unit generate --project <slug> --tower L1 --from-types --floors 5-46`** | **sinh ~966 căn tự động** từ typology × cụm tầng — đây là phần "tự động" chính |
| `bds unit upsert --project <slug> --json -` | bulk, idempotent theo khóa `(tower, floor, code)` |
| `bds unit import --project <slug> --xlsx "bảng hàng.xlsx" --map -` | nhập bảng hàng CĐT, in ra **diff** căn nào đổi giá/status |
| `bds price-list apply --project <slug> --file ...` | bảng giá mới, giữ version cũ |
| `bds validate --project <slug>` | lint toàn bộ; exit ≠ 0 nếu sai |

### Hợp đồng dành riêng cho agent (chi tiết nhỏ nhưng quyết định thành bại)

- **Lỗi phải sửa được**: `{"error":"unit_type_not_found","field":"typeCode","value":"1BR-L9","hint":"loại hợp lệ: 1BR-L1..1BR-L5","did_you_mean":"1BR-L5"}` — agent tự chữa được, không cần hỏi người.
- **`--dry-run` in ra diff** (thêm/sửa/xóa bao nhiêu bản ghi) trước khi ghi thật.
- **Ghi atomic** (tmp file + rename) + **thứ tự key ổn định** → git diff đọc được, không nhiễu.
- **Idempotent** theo khóa tự nhiên; chạy lại 2 lần ra cùng kết quả.
- `bds schema` để agent discover runtime — không phải nhét cả schema vào prompt.

---

## 5. Luồng "tạo dự án tự động" trông như thế nào

Người dùng: *"Thêm dự án mới, tài liệu ở ~/Downloads/Vinhomes Global Gate"*

```
1. Agent: bds project create --json '{"slug":"global-gate","name":"...","developer":"..."}'
2. Agent: bds project ingest --project global-gate --src ~/Downloads/...
          → copy tài liệu, build asset-catalog, báo "66 ảnh, 24 chưa có mô tả"
3. Agent ĐỌC (việc của LLM): PDF kickoff + mặt bằng → viết _kien-thuc-du-an/*.md
4. Agent: bds tower upsert      ← từ những gì vừa đọc
5. Agent: bds unit-type upsert  ← 24 typology rút từ bảng mặt bằng
6. Agent: bds unit generate --tower L1 --from-types --floors 5-46   ← 966 căn
7. Agent: bds validate --project global-gate   → phải exit 0
8. Người duyệt → git commit
```

Bước 3 là LLM. Bước 1,2,4,5,6,7 là API. Ranh giới rõ ràng chính là điểm mạnh của thiết kế này.

---

## 6. Lộ trình

| Phase | Nội dung | Trạng thái |
|---|---|---|
| **0** | Chốt schema + validator + `bds schema` | ✅ xong |
| **1** | Core lib + toàn bộ đường **đọc** + **migrate Cao Xà Lá thật** | ✅ xong — 44 typology, 2.006 căn |
| **2** | Đường **ghi**: create / ingest / upsert / generate / validate | ✅ xong |
| **3** | MCP server wrap lõi + thêm vào `.mcp.json` | ⬜ chưa (≈0,5 ngày) |
| **4** | Nối vào skill video — `...-apartment-detail` đọc `unit-types.json` thay vì gõ tay | ⬜ chưa (≈1 ngày) |

Code: [`tools/`](../../tools/) — CLI `tools/bds` + lõi `tools/bdscore/`. Hướng dẫn: [`tools/README.md`](../../tools/README.md).

**Phase 1 là bài test schema, và schema đã qua.** 44 typology của Cao Xà Lá vào vừa, không phải bẻ cong field nào. Nhưng nó lộ ra 3 vấn đề dữ liệu có thật ở mục 6b.

---

## 6b. Ba vấn đề dữ liệu lộ ra khi migrate (chưa xử lý)

Đây là giá trị phụ của việc ép dữ liệu vào schema — những chỗ markdown mâu thuẫn mà đọc bằng mắt không thấy.

**1. Hai tài liệu nội bộ mâu thuẫn về cơ cấu tòa L2.**

| Nguồn | 2BR+1MR | 3BR+1MR | Tổng |
|---|---|---|---|
| `_phan-tich/mat-bang-can-ho.md` | 2 loại | 4 loại | 21 (nhưng tự ghi "20") |
| `_kien-thuc-du-an/08 - Sản phẩm căn hộ...` | 4 loại | 1 loại | 20 ✓ |

`_phan-tich` xếp CH-08, CH-01 và CH-18/22/26 vào 3BR+1MR; note 08 xếp chúng vào 2BR+1MR. `_phan-tich` cũng liệt kê dòng CH-18/22/26 (116,9 m²) **hai lần** và tự ghi chú "xác nhận lại theo HĐMB".

→ Đã lấy theo **note 08** (bản curated, ghi rõ "đã verify từng trang 2026-05-21"), tổng 20 typology khớp. Ghi lý do vào `notes` của `L2-2BR1MR-2`. **Cần đối chiếu HĐMB trước khi lên số trong video** — nói nhầm 2 ngủ thành 3 ngủ là sai lệch bán hàng.

**2. Năm mã căn không thuộc typology nào:** `CH-04`, `CH-07`, `CH-13`, `CH-14`, `CH-17` — ở **cả hai tòa**. Tài liệu mặt bằng liệt kê typology theo mã căn nhưng bỏ sót đúng 5 mã này. Chưa rõ là căn không tồn tại (đánh số nhảy) hay tài liệu thiếu.

**3. Không có ánh xạ tầng → typology.** Tài liệu ghi chiều ngược lại (typology → các mã căn), nên 16 mã căn bị nhiều typology cùng nhận. Ví dụ CH-12 tòa L1 vừa là Studio, vừa là 1BR–Loại 2, vừa là 1BR+1MR–Loại 3 — tuỳ cụm tầng. Hệ quả: **908/2.006 căn chưa chốt được `typeCode`** và mang cờ `needsResolution: true`.

Đây KHÔNG phải lỗi công cụ mà là giới hạn của dữ liệu nguồn. Sinh bừa một phương án là tạo ra một toà nhà không tồn tại, nên API để `null` + liệt kê `typeCandidates` và báo số còn nợ.

**Ba việc này không chặn pipeline video**, vì video kể chuyện bằng typology (44 bản ghi đã sạch) chứ không bằng từng căn.

---

## 7. Rủi ro & cách chặn

| Rủi ro | Chặn |
|---|---|
| Agent ghi đè hỏng dữ liệu thật | `--dry-run` mặc định in diff; mọi thứ trong git; `bds validate` chạy trước commit |
| `units-L1.json` ~1.000 bản ghi → diff git khổng lồ | Tách file theo tòa + key ổn định + chỉ ghi field đổi |
| Markdown và JSON lệch nhau theo thời gian | `bds validate` đối chiếu số typology / diện tích giữa 2 nguồn, cảnh báo |
| Schema sai sau khi đã có nhiều dự án | Phase 1 test trên data thật trước khi mở đường ghi |
| Bảng hàng CĐT format đổi mỗi tuần | `unit import` nhận `--map` (mapping cột) do agent tự suy ra, không hard-code |

---

## 8. Vì sao KHÔNG chọn DB ngay (Supabase/Postgres)

Anh đã có prior art Supabase + Next.js admin (bộ `biz-admin-*`). Nhưng hiện tại:

- 1 người dùng, không có concurrent write → DB giải quyết vấn đề chưa tồn tại.
- 5 script hiện tại đọc file trực tiếp → chuyển DB là phải sửa hết.
- Render video cần file **local** → có DB vẫn phải sync ngược ra file.
- Git đang là audit log + undo miễn phí.

**Nhưng thiết kế schema theo dạng bảng quan hệ** (khóa tự nhiên, FK rõ ràng) → khi thật sự cần web dashboard cho team sale, migrate sang Supabase chỉ là 1 script import + đổi tầng L1. Không phải làm lại.

---

## 9. Ba quyết định — ĐÃ CHỐT

1. **Nơi lưu**: JSON trong `workspace/data/`. Không dùng DB.
2. **Phạm vi**: chỉ phục vụ pipeline video. Bỏ import Excel bảng hàng, price-list có version, chính sách bán hàng.
3. **Kênh truy cập**: CLI trước (xong), MCP sau.
