"""Lỗi có cấu trúc — thiết kế để AGENT đọc, không phải người đọc.

Nguyên tắc: mỗi lỗi phải trả lời được "sửa thế nào". Nghĩa là luôn kèm
`field` + `value` + danh sách giá trị hợp lệ (hoặc `did_you_mean`) khi có
thể. Agent nhận `{"error":"unknown_tower","value":"L3","allowed":["L1","L2"]}`
là tự chữa được; nhận "Invalid tower" thì phải hỏi người.

Exit code (dùng chung cho mọi lệnh `bds`):
    0  ok
    2  not_found     — không tìm thấy dự án / tòa / loại căn / căn
    3  ambiguous     — nhiều kết quả khớp ngang nhau, cần chỉ định rõ hơn
    4  invalid       — sai schema hoặc sai tham chiếu (validate thất bại)
    5  conflict      — đã tồn tại / ghi đè không cho phép
    1  lỗi khác (IO, JSON hỏng, ...)
"""
from __future__ import annotations

from .text import did_you_mean

EXIT_OK = 0
EXIT_GENERIC = 1
EXIT_NOT_FOUND = 2
EXIT_AMBIGUOUS = 3
EXIT_INVALID = 4
EXIT_CONFLICT = 5


class BdsError(Exception):
    """Lỗi mang payload JSON. CLI in payload ra stderr rồi thoát bằng exit_code."""

    def __init__(self, code: str, message: str, exit_code: int = EXIT_GENERIC, **extra):
        super().__init__(message)
        self.code = code
        self.message = message
        self.exit_code = exit_code
        self.extra = {k: v for k, v in extra.items() if v is not None}

    def payload(self) -> dict:
        return {"error": self.code, "message": self.message, **self.extra}


class NotFound(BdsError):
    def __init__(self, code: str, message: str, value=None, allowed=None, **extra):
        hint = did_you_mean(str(value), list(allowed)) if value and allowed else None
        super().__init__(
            code,
            message,
            EXIT_NOT_FOUND,
            value=value,
            allowed=list(allowed) if allowed else None,
            did_you_mean=hint,
            **extra,
        )


class Ambiguous(BdsError):
    def __init__(self, message: str, matches: list, **extra):
        super().__init__("ambiguous", message, EXIT_AMBIGUOUS, matches=matches, **extra)


MAX_ISSUES = 25


MAX_EXAMPLES = 5


def compact_issues(issues: list[dict]) -> list[dict]:
    """Gộp lỗi cùng LOẠI lại thành một dòng kèm ví dụ.

    44 typology thiếu ảnh mặt bằng là MỘT việc phải làm, không phải 44
    việc — nhưng in ra 44 dòng thì agent tốn 44 lần token để hiểu đúng một
    điều đó. Gộp theo (scope, reason), giữ tối đa 5 ví dụ thật để vẫn sửa
    được. Cần đủ 100% thì dùng `--full`.

    Lỗi chỉ xuất hiện 1 lần được giữ nguyên vẹn, không bọc thêm lớp nào.
    """
    order: list[tuple] = []
    buckets: dict[tuple, list[dict]] = {}
    for it in issues:
        key = (it.get("scope"), it.get("reason"))
        if key not in buckets:
            buckets[key] = []
            order.append(key)
        buckets[key].append(it)

    out = []
    for key in order:
        group = buckets[key]
        if len(group) == 1:
            out.append(group[0])
            continue
        head = group[0]
        entry = {"scope": key[0], "reason": key[1], "count": len(group)}
        for k in ("allowed", "expected", "hint"):
            if head.get(k) is not None:
                entry[k] = head[k]
        entry["examples"] = [
            {k: v for k, v in it.items()
             if k in ("field", "value", "owners", "did_you_mean", "missingFloors")}
            for it in group[:MAX_EXAMPLES]
        ]
        if len(group) > MAX_EXAMPLES:
            entry["examplesTruncated"] = len(group) - MAX_EXAMPLES
        out.append(entry)
    return out[:MAX_ISSUES]


class Invalid(BdsError):
    def __init__(self, message: str, issues: list[dict] | None = None, **extra):
        packed = compact_issues(issues) if issues else None
        if issues and len(issues) > MAX_ISSUES:
            extra.setdefault("issuesTruncated", len(issues) - len(packed))
        super().__init__("invalid", message, EXIT_INVALID, issues=packed, **extra)


class Conflict(BdsError):
    def __init__(self, message: str, **extra):
        super().__init__("conflict", message, EXIT_CONFLICT, **extra)
