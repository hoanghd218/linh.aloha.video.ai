---
name: mkt-full-video-with-11-remotion-heygen-apartment-detail
description: Biến thể của mkt-full-video-with-11-remotion-heygen cho video 9:16 review CHI TIẾT 1 CĂN HỘ — script.txt → voiceover.mp3 → source.mp4 (HeyGen) → overlays-apartment.json → composition BdsApartmentDetail trong Remotion Studio, không tự render. Có scene full-screen cho thông số (diện tích, hướng, view), mặt bằng từng layout, close-up nội thất + finishing brand (Caesarstone, Hafele, Bosch, Toto…), grid tiện ích, bảng giá theo tier. Dùng khi nói "tạo video review chi tiết căn hộ", "video chi tiết 1 căn", "walkthrough căn hộ", "review nội thất căn hộ", "video bảng giá căn hộ theo tier", "video tiện ích chung cư", "video bóc tách căn hộ", "remotion apartment detail", "review finishing nội thất", hoặc đưa script BĐS tập trung 1 căn cụ thể. Không dùng cho video so sánh nhiều dự án, chính sách bán hàng chung, listicle điểm cộng (→ mkt-full-video-with-11-remotion-heygen); pipeline HyperFrames (→ mkt-full-video-with-11-hyperframe-heygen). TTS, HeyGen, cổng duyệt, luật chung: theo skill cha.
argument-hint: "[đường-dẫn script.txt] [slug] [thư-mục floorplans · interiors · amenities]"
---

# Review chi tiết 1 căn hộ — Remotion (biến thể của skill cha)

Phiên bản: v1.1 — 2026-11-11

Sister skill của [`mkt-full-video-with-11-remotion-heygen`](../mkt-full-video-with-11-remotion-heygen/SKILL.md) — **đọc skill cha trước**. Phase 1 (TTS), checkpoint #1 (MP3), Phase 2 (HeyGen), transcribe + căn phụ đề theo script, `init_project.sh`, `validate.py`, bố cục workspace, cổng xác nhận trước khi tốn credit, luật `.env` / không bịa số / đường dẫn — dùng y hệt, **không chép lại ở đây**. Skill này chỉ khác **Phase 3: lập kế hoạch overlay** (nhóm scene căn hộ, tên tệp JSON, composition). `$ARGUMENTS` (nếu có) = đường dẫn script hoặc slug.

| Đầu vào | Đầu ra |
|---|---|
| `script.txt` về 1 căn hộ (≤ 5000 ký tự) + `floorplans/` · `interiors/` · `amenities/` + `logos/avatar.jpg`, `logos/qr-contact.jpg`, hotline, `brand_name` | Trong `workspace/content/YYYY-MM-DD/<slug>/`: `voiceover.mp3` · `source.mp4` · `caption-groups.json` · `overlays-outline-apartment.json` · **`overlays-apartment.json`**. Nạp vào `workspace/remotion-project/public/` → Studio `http://localhost:3000`, composition **`BdsApartmentDetail`** |

## Dùng skill này hay skill cha

| Trường hợp | Skill |
|---|---|
| Video walkthrough chi tiết **1 căn hộ cụ thể** — diện tích / hướng / view, layout từng kiểu, brand nội thất, bảng giá theo tier, gallery tiện ích | **skill này** |
| Review tiện ích sâu của 1 toà / 1 phân khu (gym, bể bơi, sky bar… từng cái) | **skill này** |
| So sánh 2+ dự án, chính sách bán hàng chung, hook urgency tổng thể | `mkt-full-video-with-11-remotion-heygen` |
| Listicle "Top 5 điểm cộng dự án X" | skill cha — format point-by-point gần review chung hơn |

Script vừa có review chung vừa có chi tiết căn → chia 2 video.

## Luật — không được phá

Kế thừa đủ 15 luật skill cha — đặc biệt **cổng xác nhận trước khi tốn credit TTS / HeyGen**, **2 checkpoint** (#1 nghe MP3, đồng thời là lệnh cho HeyGen chạy · #2 duyệt `overlays-outline-apartment.json` — scene flow + ảnh gán cho từng scene), khoá chỉ từ `.env`, không bịa số / pháp lý BĐS, không tự render. Thêm:

1. **Tên tệp ra `overlays-apartment.json`** (không ghi `overlays.json` / `overlays-general.json` — đó là của skill cha); composition `BdsApartmentDetail`. Hai composition đọc JSON riêng nên không đè nhau.
2. **Pool 9 variant** — 5 scene full-screen (`scene-spec-row`, `scene-apartment-price`, `scene-finishing-detail`, `scene-amenity-grid`, `scene-price-package`) + 4 dùng chung (`punch`, `callout-stack`, `comment-bubble`, `contact-card`). Bảng giá tier dùng `scene-price-package`, KHÔNG dùng `price-red-3d` / `price-with-brand`.
3. **Ảnh là đầu vào của scene** (mặt bằng, nội thất, tiện ích); `broll-image` đứng riêng rất hiếm.
4. **Số liệu căn hộ không bịa** — diện tích, giá từng tier, thương hiệu finishing chỉ lấy từ script hoặc `spec_sheet` / `price_tiers` / `finishing_brands` người dùng đưa; thiếu thì bỏ dòng / tier đó, không thêm brand cho "đẹp".
5. **Scene full-screen ≥ 4 giây** — người xem cần thời gian đọc.
6. **Tối đa 1 `scene-finishing-detail` mỗi phòng** — không xếp 2 close-up bếp liền nhau.
7. **Tối đa 1 tier `highlight: true`** trong `scene-price-package` — chọn tier bán chạy nhất (thường 2PN / 3PN).
8. **Ảnh theo từng video**: `$W/broll/<slug>/<tên>.jpg`, JSON dùng đường dẫn đầy đủ `broll/<slug>/<tên>.jpg` (tên trần sẽ 404). Ảnh dùng chung nhiều video → nhân bản vào thư mục từng video, không symlink. Avatar + QR ở `logos/`.
9. **Chữ trên scene** tiếng Việt đủ dấu; `value` của spec ≤ 16 ký tự, caption tiện ích ≤ 14 ký tự, chuỗi giá ngắn ("9.9 - 11.5 TỶ") — quá dài thì tràn khung.

## Đầu vào khác skill cha

| Tham số | Bắt buộc | Dùng cho |
|---|---|---|
| `floorplan_images` | Nên có | `scene-apartment-price`. Thiếu → packager dùng `interior-living.jpg` thay tạm và CẢNH BÁO người dùng |
| `interior_images` | Nên có | `scene-finishing-detail` (ảnh nền toàn khung) |
| `amenity_images` | Nên có | `scene-amenity-grid` — cần ≥ 4 ảnh (4 → lưới 2×2, 5–6 → 2×3) |
| `spec_sheet` | Không | JSON `[{label, value}]` cho `scene-spec-row`; thiếu thì trích từ script |
| `price_tiers` | Không | JSON `[{tier, meta, price, highlight?}]` cho `scene-price-package` |
| `finishing_brands` | Không | `{room, label, brand, icon?}` cho callout; thiếu thì trích từ script |
| `broll_folder` | Không | Chỉ cho `broll-image` ambient (hiếm) |

Quy ước tên ảnh (để packager tự gán): `floorplan-<layout>.jpg` (`floorplan-studio.jpg`, `floorplan-2pn.jpg`) · `interior-<room>.jpg` (`interior-kitchen.jpg`, `interior-bathroom.jpg`, `interior-living.jpg`) · `amenity-<tên>.jpg` (`amenity-gym.jpg`, `amenity-pool.jpg`). Không theo quy ước → người dùng đưa bảng gán rõ ràng.

Khác biệt trong thư mục video `$W`: thêm `floorplans/`, `interiors/`, `amenities/` (đầu vào); `overlays-outline-apartment.json` + `overlays-apartment.json` thay `overlays-outline.json` + `overlays.json`; ảnh sau khi gán nằm ở `broll/<slug>/` (luật 8).

## 9 variant — dùng khi nào

| Variant | Khi dùng | Trường bắt buộc |
|---|---|---|
| `scene-spec-row` | Tổng quan thông số — thường đầu video, sau hook | `title`, `rows[]` (3–6 × `{icon, label, value}`) |
| `scene-apartment-price` | Mặt bằng từng layout (1 ảnh full, 2 xếp dọc, 3+ chạy lần lượt) | `title`, `images[]` (+ `subtitle`, `image_fit`) |
| `scene-finishing-detail` | Close-up nội thất 1 phòng + 1–4 brand callout | `image_path`, `callouts[]` (`{label, brand, icon?}`) |
| `scene-amenity-grid` | Gallery 4–6 tiện ích cùng một khung | `title`, `cells[]` (`{image_path, caption, icon?}`) |
| `scene-price-package` | Bảng giá theo tier, nổi bật 1 tier | `title`, `tiers[]` (2–4 × `{tier, meta?, price, highlight?}`), `footer?` |
| `punch` / `callout-stack` | Nhịp giữa các scene (urgency, brand drop, tagline) | như skill cha |
| `comment-bubble` | CTA inbox giữa video | như skill cha |
| `contact-card` | Thẻ cuối: `t_start = video_duration − 6` | như skill cha |

Schema đầy đủ + JSON mẫu + cây quyết định + bảng SFX: [variant-catalog.md](references/variant-catalog.md).

## Luồng scene gợi ý (60–120 giây — chỉnh theo độ dài script)

```
00:00-00:05  Hook (avatar nói, chỉ có punch text, chưa scene full-screen)
00:05-00:12  scene-spec-row           Tổng quan thông số
00:12-00:28  scene-apartment-price    Mặt bằng layout 1, 2 (studio · 1PN · 2PN …)
00:28-00:46  scene-finishing-detail   Bếp, phòng tắm + brand callout
00:46-00:55  scene-amenity-grid       Tiện ích 4–6 cái
00:55-01:05  scene-price-package      Bảng giá theo tier
01:05-01:15  callout-stack + punch    Urgency (mở bán, hạn chỗ)
01:15-01:22  comment-bubble           CTA inbox
01:22-01:28  contact-card             Thẻ cuối
```

## Quy trình

Đặt `K=.claude/skills/mkt-full-video-with-11-remotion-heygen` (skill cha) · `W=workspace/content/YYYY-MM-DD/<slug>` · `R=workspace/remotion-project`.

0. **Chuẩn bị + cổng trước TTS** — như skill cha (bước 0), cộng: đếm tệp trong `floorplans/`, `interiors/`, `amenities/`. Cả 3 thiếu → hỏi (a. bổ sung ảnh · b. chuyển sang skill cha · c. tiếp tục chỉ với `punch` / `contact-card`). Báo số lượng ảnh từng loại.
1. **Phase 1 + checkpoint #1** — như skill cha (bước 1–2). Xong khi: người dùng `OK` MP3.
2. **Phase 2 + Phase 3 song song** — Agent A (HeyGen nền) y hệt skill cha. Agent B: chưa có agent riêng nên gọi `general-purpose` với toàn bộ prompt trong [phase3-prompt-template.md](references/phase3-prompt-template.md), thay `<…>` bằng giá trị thật; khác biệt chính: `composition_target: BdsApartmentDetail`, `output_json_filename: overlays-apartment.json`, `component_pool: 9_apartment_variants`, kèm danh sách `floorplans` / `interiors` / `amenities` / `spec_sheet` / `price_tiers` / `finishing_brands`. Packager: tách script thành 6–10 scene → gán variant + ảnh → thêm nhịp `punch` / `callout-stack` → `comment-bubble` + `contact-card` → viết `overlays-outline-apartment.json` → **checkpoint #2** → ghi bản cuối.
3. **Kiểm** (sau khi packager xong):
   ```bash
   python $K/scripts/validate.py $W/overlays-apartment.json        # exit 0 (python3 trên macOS); nhận cả 5 scene-*
   cp $W/overlays-apartment.json $R/public/overlays-apartment.json  # init_project.sh KHÔNG đồng bộ tệp này
   ```
   Xong khi: validate exit 0; đường dẫn ảnh đều dạng `broll/<slug>/…` và tệp có thật trong `$R/public/broll/<slug>/`; mỗi scene ≥ 4 giây; có đúng 1 `contact-card` ở cuối; SFX dùng tên có trong `public/sfx/`; `source.mp4` đã vào `$R/public/`. Số liệu trên scene khớp script.
4. **Bàn giao** — như skill cha (bước 5), nhưng: `Studio: http://localhost:3000 → chọn composition BdsApartmentDetail (KHÔNG phải BdsGeneralReview)`. Render chỉ khi người dùng bảo:
   ```bash
   cd $R && npx remotion render BdsApartmentDetail renders/<slug>-apartment-final.mp4 --crf 18
   ```

## Lỗi hay gặp (phần khác skill cha)

| Triệu chứng | Nguyên nhân → cách sửa |
|---|---|
| Studio trống / "overlays-apartment.json not found" | Chưa có `public/overlays-apartment.json` → chạy lại bước 3 (`cp`) |
| Studio hiện video của skill cha | Chọn nhầm composition → chọn `BdsApartmentDetail` ở thanh bên |
| Ảnh không hiện / 404 | Đường dẫn tên trần hoặc ảnh chưa nằm ở `$W/broll/<slug>/` trước `init_project.sh` (script thay cả thư mục `public/broll/` bằng `$W/broll/`) |
| `scene-amenity-grid` ô trống | < 4 ảnh trong `amenities/` (cần ≥ 4 cho 2×2, ≥ 5 cho 2×3) |
| `scene-finishing-detail` không có pill | Mỗi callout cần cả `label` và `brand`; `icon` là tuỳ chọn |
| `scene-price-package` mất nổi bật | Đặt `highlight: true` trên ĐÚNG 1 tier |
| `validate.py` báo `unknown variant 'scene-…'` | Bản `validate.py` cũ chưa biết scene căn hộ — dùng bản trong skill cha (đã cập nhật 2026-11-11) |
| Tiếng hiệu ứng không phát / render lỗi tệp | Tên SFX không có trong `public/sfx/` (vd `swoosh.mp3`) → dùng bảng SFX ở `variant-catalog.md` |

Lỗi khác (TTS, HeyGen, Studio hiện video cũ, render 5 giây, `npm start`…): bảng ở skill cha và [kinh-nghiem.md](references/kinh-nghiem.md).

## Cải tiến skill

Gặp lỗi mới → ghi một dòng vào `references/kinh-nghiem.md` (mục *Nhật ký*), sửa **đúng một chỗ**. Việc chung với skill cha (TTS, HeyGen, `init_project.sh`, `validate.py`) sửa ở skill cha, không sửa lặp ở đây. Khi có agent Phase 3 riêng cho căn hộ → thay mục "gọi `general-purpose`" ở bước 2 bằng tên agent.

## Liên quan

- **Skill cha:** [`mkt-full-video-with-11-remotion-heygen`](../mkt-full-video-with-11-remotion-heygen/SKILL.md) — Phase 1 + 2, `.claude/skills/mkt-full-video-with-11-remotion-heygen/scripts/init_project.sh`, `.../scripts/validate.py`, bố cục workspace ([workspace-layout.md](../mkt-full-video-with-11-remotion-heygen/references/workspace-layout.md)).
- **Chi tiết skill này:** [variant-catalog.md](references/variant-catalog.md) · [phase3-prompt-template.md](references/phase3-prompt-template.md) · [kinh-nghiem.md](references/kinh-nghiem.md).
- **Code scene:** `workspace/remotion-project/src/overlays/` — `SceneApartmentPrice.tsx`, `SceneSpecRow.tsx`, `SceneAmenityGrid.tsx`, `SceneFinishingDetail.tsx`, `ScenePricePackage.tsx`. Mẫu đúng định dạng: `workspace/remotion-project/public/overlays-apartment.json` (chỉ đọc).
- **Đứng trước:** `mkt-linh-aloha-bds-video-script` (kịch bản) · `mkt-kie-broll-image-generator` (ảnh).
