# Profile `bds-broker` — 9 Scene Patterns (thay `references/scene-patterns.md`)

Canvas 1080×1920 full-canvas, scene phủ CẢ beat (12-30s) → mỗi scene phải có **2-3 nhịp nội dung** (dựng → phát triển → chốt), không đứng yên. Vùng cấm: `y > 1600` (captions), hộp `x > 780 && y < 320` (PIP).

Chọn pattern theo **nội dung beat**, không theo thứ tự. Beat không hợp pattern nào → tự sáng tạo, giữ đúng tokens của `design-system.md`.

---

### 1. `hero-reveal` — mở màn / brand reveal
Ảnh `exterior-hero` hoặc `exterior-night` full-canvas + scrim + tên dự án punch trắng viền đen giữa khung, kicker champagne phía trên ("MASTERISE HOMES • MỞ BÁN").
**Nhịp:** ảnh vào ken-burns → kicker fade → tên dự án scale-pop → sub-line (vị trí/quy mô) trượt lên.
**Dùng khi:** beat giới thiệu tên dự án, CĐT, định vị. **Ảnh:** exterior-hero / exterior-night / facade.

### 2. `location-metro` — vị trí & kết nối
Ảnh `aerial-location` full-canvas + scrim. Overlay: chấm pin đỏ pulse tại vị trí dự án, 2-4 nhãn khoảng cách trượt vào ("Metro số 2A: 200m", "Ngã Tư Sở: 5 phút"), đường nối SVG vẽ dần (`stroke-dasharray`).
**Nhịp:** ảnh → pin pulse → từng nhãn stagger 0.5s → chốt bằng punch "MẶT ĐẠI LỘ NGUYỄN TRÃI".
**Dùng khi:** beat vị trí, kết nối, tiềm năng tăng giá theo hạ tầng. **Ảnh:** aerial-location.

### 3. `masterplan-annotate` — quy mô / quy hoạch
Ảnh `masterplan` (dùng biến thể `-9x16.jpg`) làm nền hơi mờ (`filter: brightness(.55)`), overlay 3-4 số liệu lớn đếm lên (`82.820 m²`, `10 TÒA`, `28,8%`), mỗi số kèm label champagne. Có thể vẽ vòng tròn highlight SVG quanh cụm tháp đang nói.
**Nhịp:** nền vào → số 1 count-up + ting → số 2, 3 stagger → chốt câu định vị.
**Dùng khi:** beat quy mô tổng khu, mật độ, số tòa, phân khu. **Ảnh:** masterplan.

### 4. `amenity-stack` — tiện ích
Cột dọc 2-3 ô ảnh `amenity` bo góc 24px (KHÔNG grid ngang — canvas hẹp), mỗi ô có nhãn đè góc dưới-trái. Ô đang được nhắc tới sáng full, các ô còn lại `brightness(.5)`.
**Nhịp:** ô 1 trượt vào + tên → ô 2 → ô 3 → cả 3 sáng đều + punch tổng "HƠN 71% CHO CẢNH QUAN".
**Dùng khi:** beat liệt kê tiện ích, cảnh quan, lifestyle. **Ảnh:** 2-3 ảnh amenity khác nhau.

### 5. `floorplan-zoom` — layout căn hộ ⭐ luật riêng
**KHÔNG show nguyên bản vẽ** — co về 1080px là chữ không đọc nổi. Đặt `<img>` rộng 2.2-3.0× canvas, `transform-origin` tại cụm căn đang nói, GSAP pan+scale chậm từ tổng thể → cụm căn. Card số liệu (mã căn, DT tim tường, DT thông thủy, hướng) trượt vào từ phải, nền `--bg-panel` + viền champagne 1px.
**Nhịp:** toàn mặt bằng 1.5s → zoom vào cụm căn → card số liệu → highlight ô căn bằng khung đỏ.
**Dùng khi:** beat loại căn, diện tích, layout, hướng. **Ảnh:** floorplan (ghi rõ vùng zoom trong prompt sub-agent).

### 6. `price-tier` — bảng giá
Không ảnh (giá không có vật thể minh họa). Nền `--bg-deep`. 2-4 hàng tier: `STUDIO · 31,9 m² · từ X tỷ`. Hàng nổi bật có viền champagne + nền sáng hơn. Số tiền màu `--punch-red` 170-230px nếu chỉ có 1 con số chủ đạo.
**Nhịp:** header "GIÁ DỰ KIẾN" → từng hàng trượt vào stagger 0.35s + ting → hàng highlight scale-pop + đường kẻ gold chạy ngang.
**Dùng khi:** beat giá, mức giá theo loại căn. Ghi rõ "dự kiến / tin đồn" nếu chưa chốt.

### 7. `payment-timeline` — chính sách thanh toán
Không ảnh. Trục dọc từ trên xuống, 3-5 mốc: `Ký HĐMB 30%` → `Quý IV/2027 40%` → `Nhận nhà 30%`. Chấm mốc pulse, đường nối vẽ dần bằng `stroke-dasharray`. Mốc ưu đãi tô `--punch-yellow`.
**Nhịp:** trục vẽ xuống → mốc 1 → mốc 2 → mốc 3 → chip ưu đãi bung ra ("ân hạn gốc 24 tháng").
**Dùng khi:** beat chính sách bán hàng, tiến độ thanh toán, hỗ trợ lãi suất.

### 8. `handover-strip` — tiêu chuẩn bàn giao
Ảnh `handover-spec` full-canvas đổi luân phiên (2-3 ảnh trong 1 scene, mỗi ảnh 3-5s, cross-fade 0.4s), mỗi ảnh kèm 1 dòng label trượt lên từ đáy ("KÍNH LOW-E SÁT TRẦN", "SÀN GỖ XƯƠNG CÁ").
**Nhịp:** mỗi ảnh = 1 nhịp; ảnh cuối giữ + punch tổng "BÀN GIAO HOÀN THIỆN".
**Dùng khi:** beat vật liệu, thiết bị, chất lượng bàn giao. **Ảnh:** 2-3 handover-spec.

### 9. `compare-2col` — so sánh / phản biện
Không ảnh, hoặc 2 ảnh nhỏ đối xứng. Hai cột dọc chia đôi canvas theo chiều ngang: trái = "cái người ta nghĩ" (xám, `--ink-mute`), phải = "sự thật" (trắng + accent). Đường kẻ dọc champagne ở giữa.
**Nhịp:** cột trái vào → gạch ngang qua nội dung sai → cột phải bung ra → punch chốt.
**Dùng khi:** beat đập tan nỗi lo, so sánh với dự án khác, "món hời hay cái bẫy".

---

## Chọn pattern theo beat của video review dự án

| Beat | Pattern mặc định |
|---|---|
| Hook (avatar) | — avatar full-frame, không scene |
| Vị trí | `location-metro` |
| Quy mô / quy hoạch | `masterplan-annotate` |
| Tiện ích | `amenity-stack` |
| Sản phẩm / layout | `floorplan-zoom` |
| Bàn giao | `handover-strip` |
| Giá | `price-tier` |
| Chính sách | `payment-timeline` |
| Phản biện / so sánh | `compare-2col` |
| Re-hook, CTA (avatar) | — avatar full-frame |

Một video 60-90s dùng 3-5 scene. Đừng dùng cả 9 pattern trong 1 video.
