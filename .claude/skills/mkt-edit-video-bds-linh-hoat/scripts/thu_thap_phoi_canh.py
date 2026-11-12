#!/usr/bin/env python3
"""Tải ảnh phối cảnh từ manifest URL đã xác minh và tạo sidecar nguồn."""

from __future__ import annotations

import argparse
import json
import mimetypes
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


DEFAULT_GROUP = "01_tổng-thể-và-ngoại-thất"
ALLOWED_GROUPS = {
    "01_tổng-thể-và-ngoại-thất",
    "02_tiện-ích",
    "03_nội-thất-và-căn-hộ",
    "04_mặt-bằng-và-masterplan",
    "05_phối-cảnh-ban-đêm",
}
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


def safe_name(value: str) -> str:
    name = Path(urllib.parse.unquote(value)).name
    if not name or name in {".", ".."} or "/" in name or "\\" in name:
        raise ValueError(f"Tên file không hợp lệ: {value!r}")
    return name


def infer_name(url: str, requested: str | None, content_type: str | None = None) -> str:
    if requested:
        name = safe_name(requested)
    else:
        name = safe_name(urllib.parse.urlparse(url).path)
    suffix = Path(name).suffix.lower()
    if suffix not in EXTENSIONS and content_type:
        guessed = mimetypes.guess_extension(content_type.split(";", 1)[0].strip())
        if guessed in EXTENSIONS:
            name += guessed
    if Path(name).suffix.lower() not in EXTENSIONS:
        raise ValueError(f"Không xác định được định dạng ảnh từ {url}")
    return name


def validate_manifest(data: Any) -> dict[str, Any]:
    if not isinstance(data, dict) or not str(data.get("du_an", "")).strip():
        raise ValueError("Manifest phải có du_an.")
    assets = data.get("assets")
    if not isinstance(assets, list) or not assets:
        raise ValueError("Manifest phải có assets array không rỗng.")
    for index, asset in enumerate(assets):
        if not isinstance(asset, dict):
            raise ValueError(f"assets[{index}] không phải object.")
        parsed = urllib.parse.urlparse(str(asset.get("url", "")))
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError(f"assets[{index}].url phải là HTTP(S) hợp lệ.")
        group = asset.get("nhom", DEFAULT_GROUP)
        if group not in ALLOWED_GROUPS:
            raise ValueError(f"assets[{index}].nhom không thuộc folder phối cảnh chuẩn.")
    return data


def download(url: str, *, timeout: int, max_bytes: int) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 AssetCollector/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        content_type = response.headers.get_content_type()
        if not content_type.startswith("image/"):
            raise ValueError(f"URL không trả về ảnh ({content_type}): {url}")
        length = response.headers.get("Content-Length")
        if length and int(length) > max_bytes:
            raise ValueError(f"Ảnh vượt giới hạn {max_bytes} byte: {url}")
        payload = response.read(max_bytes + 1)
        if len(payload) > max_bytes:
            raise ValueError(f"Ảnh vượt giới hạn {max_bytes} byte: {url}")
        return payload, content_type


def collect(manifest: dict[str, Any], root: Path, *, dry_run: bool, overwrite: bool) -> tuple[int, int]:
    base = root / "02_hình-ảnh" / "07_phối-cảnh-và-render"
    downloaded = 0
    skipped = 0
    for asset in manifest["assets"]:
        url = str(asset["url"])
        group = str(asset.get("nhom", DEFAULT_GROUP))
        target_dir = base / group
        requested_name = asset.get("ten_file")
        if dry_run:
            print(f"DRY-RUN {group}: {url}")
            continue
        payload, content_type = download(url, timeout=30, max_bytes=40 * 1024 * 1024)
        name = infer_name(url, str(requested_name) if requested_name else None, content_type)
        target_dir.mkdir(parents=True, exist_ok=True)
        target = target_dir / name
        if target.exists() and not overwrite:
            print(f"SKIP đã tồn tại: {target}")
            skipped += 1
            continue
        target.write_bytes(payload)
        sidecar = {
            "du_an": manifest["du_an"],
            "trang_thai_du_an": manifest.get("trang_thai_du_an", "dang-xay"),
            "loai_bang_chung": "phoi-canh",
            "minh_hoa": True,
            "nguon": asset.get("nguon", manifest.get("nguon")),
            "url_nguon": asset.get("url_nguon", manifest.get("url_nguon", url)),
            "url_file": url,
            "ngay_nguon": asset.get("ngay_nguon", manifest.get("ngay_nguon")),
            "phien_ban_tu_lieu": asset.get("phien_ban_tu_lieu", manifest.get("phien_ban_tu_lieu")),
            "quyen_su_dung": asset.get("quyen_su_dung", manifest.get("quyen_su_dung")),
            "can_xac_minh_quyen": not bool(asset.get("quyen_su_dung", manifest.get("quyen_su_dung"))),
            "nhan_bat_buoc": "PHỐI CẢNH MINH HỌA",
            "tu_khoa": asset.get("tu_khoa", []),
        }
        Path(str(target) + ".json").write_text(
            json.dumps(sidecar, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"OK {target}")
        downloaded += 1
    return downloaded, skipped


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path, help="JSON gồm thông tin dự án và danh sách URL ảnh trực tiếp.")
    parser.add_argument("thu_muc_kho", type=Path, help="Gốc kho tư liệu tiếng Việt.")
    parser.add_argument("--dry-run", action="store_true", help="Chỉ kiểm tra manifest và in kế hoạch tải.")
    parser.add_argument("--ghi-de", action="store_true", help="Ghi đè file đã tồn tại.")
    args = parser.parse_args()
    try:
        data = validate_manifest(json.loads(args.manifest.read_text(encoding="utf-8")))
        downloaded, skipped = collect(
            data, args.thu_muc_kho.expanduser().resolve(), dry_run=args.dry_run, overwrite=args.ghi_de
        )
    except (OSError, ValueError, json.JSONDecodeError, urllib.error.URLError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    print(f"Hoàn tất: tải {downloaded}, bỏ qua {skipped}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
