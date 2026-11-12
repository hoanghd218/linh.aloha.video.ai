#!/usr/bin/env python3
"""Tạo kho media/SFX tiếng Việt và database SQLite cho video BĐS."""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path


FOLDERS = [
    "01_video-trám/01_toàn-cảnh-đô-thị",
    "01_video-trám/02_mặt-tiền-và-đường-phố",
    "01_video-trám/03_nội-thất-và-chi-tiết",
    "01_video-trám/04_công-viên-và-hồ-cảnh-quan",
    "01_video-trám/05_tiện-ích-nội-khu",
    "01_video-trám/06_giao-thông-và-kết-nối",
    "01_video-trám/07_trường-học-bệnh-viện",
    "01_video-trám/08_trung-tâm-thương-mại",
    "01_video-trám/09_kinh-doanh-và-dòng-người",
    "01_video-trám/10_gia-đình-và-phong-cách-sống",
    "01_video-trám/11_tiến-độ-xây-dựng",
    "01_video-trám/12_tài-chính-và-đầu-tư",
    "01_video-trám/13_pháp-lý-và-hợp-đồng",
    "01_video-trám/14_bản-đồ-và-vị-trí",
    "01_video-trám/15_kêu-gọi-hành-động",
    "02_hình-ảnh/01_ảnh-dự-án-thực-tế",
    "02_hình-ảnh/02_ảnh-mặt-tiền",
    "02_hình-ảnh/03_ảnh-nội-thất",
    "02_hình-ảnh/04_ảnh-tiện-ích",
    "02_hình-ảnh/05_bản-đồ-vị-trí",
    "02_hình-ảnh/06_mặt-bằng-và-masterplan",
    "02_hình-ảnh/07_phối-cảnh-và-render/01_tổng-thể-và-ngoại-thất",
    "02_hình-ảnh/07_phối-cảnh-và-render/02_tiện-ích",
    "02_hình-ảnh/07_phối-cảnh-và-render/03_nội-thất-và-căn-hộ",
    "02_hình-ảnh/07_phối-cảnh-và-render/04_mặt-bằng-và-masterplan",
    "02_hình-ảnh/07_phối-cảnh-và-render/05_phối-cảnh-ban-đêm",
    "02_hình-ảnh/08_pháp-lý-và-bảng-giá",
    "02_hình-ảnh/09_hình-minh-họa",
    "03_âm-thanh/01_nhạc-nền",
    "03_âm-thanh/02_hiệu-ứng-nhấn-mạnh",
    "03_âm-thanh/03_hiệu-ứng-chữ-và-giao-diện",
    "03_âm-thanh/04_hiệu-ứng-chuyển-cảnh",
    "03_âm-thanh/05_hiệu-ứng-bản-đồ",
    "03_âm-thanh/06_hiệu-ứng-cao-trào",
    "03_âm-thanh/07_âm-thanh-không-gian",
    "03_âm-thanh/08_hiệu-ứng-kêu-gọi-hành-động",
    "04_tư-liệu-thương-hiệu/01_logo",
    "04_tư-liệu-thương-hiệu/02_font-chữ",
    "04_tư-liệu-thương-hiệu/03_ảnh-đại-diện",
    "04_tư-liệu-thương-hiệu/04_kêu-gọi-hành-động",
    "05_tư-liệu-riêng-từng-dự-án",
]

SFX_CATALOG = {
    "version": "1.0",
    "nguyen_tac": "Chỉ chọn SFX theo speech anchor hoặc chuyển cảnh có chủ đích; không dùng quota cố định.",
    "nhom": [
        {"thu_muc": "02_hiệu-ứng-nhấn-mạnh", "goi_y": ["impact-trầm", "hit-mềm", "pop-mạnh"]},
        {"thu_muc": "03_hiệu-ứng-chữ-và-giao-diện", "goi_y": ["pop-mềm", "tick", "ui-tap"]},
        {"thu_muc": "04_hiệu-ứng-chuyển-cảnh", "goi_y": ["whoosh-ngắn", "whoosh-dài", "quét-ngang", "kéo-sọc-dọc"]},
        {"thu_muc": "05_hiệu-ứng-bản-đồ", "goi_y": ["ghim-bản-đồ", "đường-chạy", "radar-nhẹ"]},
        {"thu_muc": "06_hiệu-ứng-cao-trào", "goi_y": ["riser-ngắn", "downer", "reveal"]},
        {"thu_muc": "07_âm-thanh-không-gian", "goi_y": ["phố", "công-viên", "showroom", "nội-thất"]},
        {"thu_muc": "08_hiệu-ứng-kêu-gọi-hành-động", "goi_y": ["cta-pop", "chime-ngắn"]}
    ]
}


SCHEMA = """
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    duong_dan TEXT NOT NULL UNIQUE,
    loai_media TEXT NOT NULL,
    nhom TEXT,
    chu_de TEXT,
    du_an TEXT,
    khu_vuc TEXT,
    tu_khoa TEXT,
    minh_hoa INTEGER NOT NULL DEFAULT 0,
    nguon TEXT,
    quyen_su_dung TEXT,
    loai_bang_chung TEXT,
    trang_thai_du_an TEXT,
    url_nguon TEXT,
    ngay_nguon TEXT,
    phien_ban_tu_lieu TEXT,
    nhan_bat_buoc TEXT,
    thoi_luong REAL,
    chieu_rong INTEGER,
    chieu_cao INTEGER,
    fps REAL,
    codec TEXT,
    co_am_thanh INTEGER,
    huong_chuyen_dong TEXT,
    vi_tri_chu_the TEXT,
    muc_nang_luong TEXT,
    do_tin_cay REAL,
    kich_thuoc_byte INTEGER,
    hash_nhanh TEXT,
    cap_nhat_luc TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_assets_loai ON assets(loai_media);
CREATE INDEX IF NOT EXISTS idx_assets_nhom ON assets(nhom, chu_de);
CREATE INDEX IF NOT EXISTS idx_assets_du_an ON assets(du_an);
CREATE VIRTUAL TABLE IF NOT EXISTS assets_fts USING fts5(
    id UNINDEXED,
    duong_dan,
    nhom,
    chu_de,
    du_an,
    khu_vuc,
    tu_khoa
);
"""

MIGRATION_COLUMNS = {
    "loai_bang_chung": "TEXT",
    "trang_thai_du_an": "TEXT",
    "url_nguon": "TEXT",
    "ngay_nguon": "TEXT",
    "phien_ban_tu_lieu": "TEXT",
    "nhan_bat_buoc": "TEXT",
}


def ensure_database(path: Path) -> None:
    with sqlite3.connect(path) as connection:
        connection.executescript(SCHEMA)
        existing = {row[1] for row in connection.execute("PRAGMA table_info(assets)")}
        for name, column_type in MIGRATION_COLUMNS.items():
            if name not in existing:
                connection.execute(f"ALTER TABLE assets ADD COLUMN {name} {column_type}")
        connection.commit()


def create_library(root: Path) -> tuple[int, int]:
    root.mkdir(parents=True, exist_ok=True)
    created = 0
    existing = 0
    for relative in FOLDERS:
        folder = root / relative
        if folder.exists():
            existing += 1
        else:
            folder.mkdir(parents=True, exist_ok=True)
            created += 1
    database = root / "thư-viện-media.sqlite"
    ensure_database(database)
    index = root / "chỉ-mục-media.json"
    if not index.exists():
        index.write_text(json.dumps({"version": "1.0", "assets": []}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    sfx_catalog = root / "03_âm-thanh" / "danh-mục-hiệu-ứng.json"
    if not sfx_catalog.exists():
        sfx_catalog.write_text(json.dumps(SFX_CATALOG, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return created, existing


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("thu_muc", type=Path, help="Đường dẫn kho tư liệu cần tạo.")
    args = parser.parse_args()
    created, existing = create_library(args.thu_muc.expanduser().resolve())
    print(f"Kho tư liệu: {args.thu_muc.expanduser().resolve()}")
    print(f"Đã tạo {created} folder; giữ nguyên {existing} folder có sẵn.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
