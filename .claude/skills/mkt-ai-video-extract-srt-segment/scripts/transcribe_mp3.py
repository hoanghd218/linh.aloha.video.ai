#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Whisper (lệnh `whisper` chạy trên máy) -> <stem>.srt + <stem>_segments.json cạnh file MP3.

Viết lại 2026-11-11 theo đúng giao diện và định dạng đầu ra mô tả trong SKILL.md của skill này,
thay cho `heygen-short-video/scripts/transcribe_mp3.py` (skill đó không có trong repo).

- Chỉ dùng thư viện chuẩn. Cần `whisper` (pip install openai-whisper) và `ffmpeg` trong PATH.
- Chạy cục bộ, không gọi API trả phí.
- KHÔNG ghi đè: nếu <stem>.srt hoặc <stem>_segments.json đã có thì dừng (dùng --force để ghi đè),
  vì SRT thường đã được sửa chữ theo script gốc.

Dùng (python3 trên macOS, python trên Windows, hoặc uv run):
    uv run scripts/transcribe_mp3.py "<mp3>" [--language vi] [--model base] [--output-dir DIR] [--force]

Ra:
    <output-dir>/<stem>.srt              SRT mức đoạn
    <output-dir>/<stem>_segments.json    [{id, start, end, text, words:[{word, start, end}]}]
"""
import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass


def srt_time(seconds: float) -> str:
    ms = int(round(max(float(seconds), 0.0) * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def run_whisper(mp3: Path, language: str, model: str, tmp: Path) -> dict:
    exe = shutil.which("whisper")
    if not exe:
        sys.exit("Loi: khong thay lenh `whisper` trong PATH. Cai: pip install openai-whisper (can ffmpeg).")
    cmd = [
        exe, str(mp3),
        "--model", model,
        "--language", language,
        "--word_timestamps", "True",
        "--output_format", "json",
        "--output_dir", str(tmp),
        "--verbose", "False",
    ]
    print("[transcribe] " + " ".join(cmd), file=sys.stderr)
    subprocess.run(cmd, check=True)
    raw = tmp / f"{mp3.stem}.json"
    if not raw.exists():
        sys.exit(f"Loi: whisper khong tao {raw}")
    return json.loads(raw.read_text(encoding="utf-8"))


def build_segments(data: dict) -> list:
    segments = []
    for i, seg in enumerate(data.get("segments", [])):
        words = []
        for w in seg.get("words") or []:
            text = (w.get("word") or "").strip()
            if not text:
                continue
            words.append({
                "word": text,
                "start": round(float(w.get("start", 0.0)), 2),
                "end": round(float(w.get("end", 0.0)), 2),
            })
        segments.append({
            "id": i,
            "start": round(float(seg.get("start", 0.0)), 2),
            "end": round(float(seg.get("end", 0.0)), 2),
            "text": (seg.get("text") or "").strip(),
            "words": words,
        })
    return segments


def build_srt(data: dict) -> str:
    blocks = []
    n = 0
    for seg in data.get("segments", []):
        text = (seg.get("text") or "").strip()
        if not text:
            continue
        n += 1
        blocks.append(f"{n}\n{srt_time(seg.get('start', 0.0))} --> {srt_time(seg.get('end', 0.0))}\n{text}\n")
    return "\n".join(blocks)


def main() -> None:
    ap = argparse.ArgumentParser(description="Whisper (local) -> SRT + segments JSON")
    ap.add_argument("mp3_path", help="Duong dan file MP3 (nen dat trong dau nhay)")
    ap.add_argument("--language", default="vi", help="Ma ngon ngu Whisper (mac dinh: vi)")
    ap.add_argument("--model", default="base", help="tiny / base / small / medium / large (mac dinh: base)")
    ap.add_argument("--output-dir", default=None, help="Thu muc ghi SRT + JSON (mac dinh: thu muc cua MP3)")
    ap.add_argument("--force", action="store_true", help="Ghi de SRT / JSON da co")
    args = ap.parse_args()

    mp3 = Path(args.mp3_path).expanduser().resolve()
    if not mp3.exists():
        sys.exit(f"Loi: khong thay {mp3}")
    out_dir = Path(args.output_dir).expanduser().resolve() if args.output_dir else mp3.parent
    out_dir.mkdir(parents=True, exist_ok=True)
    srt_path = out_dir / f"{mp3.stem}.srt"
    seg_path = out_dir / f"{mp3.stem}_segments.json"

    existing = [p for p in (srt_path, seg_path) if p.exists()]
    if existing and not args.force:
        sys.exit(
            "Dung: da co " + ", ".join(str(p) for p in existing)
            + ". Dung lai, hoac chay lai voi --force (se mat chu da sua theo script)."
        )

    with tempfile.TemporaryDirectory() as td:
        data = run_whisper(mp3, args.language, args.model, Path(td))

    segments = build_segments(data)
    srt_path.write_text(build_srt(data), encoding="utf-8")
    seg_path.write_text(json.dumps(segments, ensure_ascii=False, indent=2), encoding="utf-8")

    total = segments[-1]["end"] if segments else 0.0
    print(f"SRT:      {srt_path}")
    print(f"Segments: {seg_path}")
    print(f"Segments count: {len(segments)}")
    print(f"Total duration: {total:.1f}s")


if __name__ == "__main__":
    main()
