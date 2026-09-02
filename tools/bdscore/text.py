"""Chuẩn hoá text tiếng Việt + gợi ý "did you mean".

Tách riêng vì cả resolver dự án, matcher mã căn lẫn thông báo lỗi đều cần
cùng một phép chuẩn hoá. Lệch nhau một chút là dự án "Cao xà lá" khớp ở
lệnh này mà trượt ở lệnh kia.
"""
from __future__ import annotations

import difflib
import unicodedata


def norm(s: str) -> str:
    """Lowercase, bỏ dấu tiếng Việt, gộp mọi ký tự không phải alnum thành 1 space.

    "Cao Xà Lá" -> "cao xa la" · "LUMIÈRE_Hanoi" -> "lumiere hanoi"
    """
    s = unicodedata.normalize("NFD", str(s))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("đ", "d").replace("Đ", "d").lower()
    return " ".join("".join(c if c.isalnum() else " " for c in s).split())


def ratio(a: str, b: str) -> float:
    return difflib.SequenceMatcher(None, a, b).ratio()


def did_you_mean(value: str, candidates: list[str], cutoff: float = 0.6) -> str | None:
    """Ứng viên gần nhất, hoặc None. Dùng để agent tự sửa lỗi mà không cần hỏi người."""
    if not value or not candidates:
        return None
    nv = norm(value)
    best, best_score = None, cutoff
    for c in candidates:
        score = ratio(norm(c), nv)
        if score > best_score:
            best, best_score = c, score
    return best
