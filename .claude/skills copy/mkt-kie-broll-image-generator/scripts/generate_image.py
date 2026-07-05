#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["requests>=2.31"]
# ///
"""
Generate a single image via KIE AI (Nano Banana 2 default, GPT Image 2 alternative).

Flow:
    1. Resolve KIE_API_KEY (CLI env-var-name override -> os.environ -> .env at repo root).
    2. POST https://api.kie.ai/api/v1/jobs/createTask  -> taskId.
    3. Poll  GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=...
       every --poll_interval (default 5s) up to --poll_timeout (default 300s).
    4. On success, parse `data.resultJson` (JSON string) -> resultUrls[0] -> download.
    5. Save to --output (verify >1 KB).

Usage:
    uv run generate_image.py --prompt "..." --output path.png
    uv run generate_image.py --prompt "..." --provider gpt-image --output path.png
    uv run generate_image.py --prompt "..." --aspect_ratio 1:1 --resolution 2K -o path.png

Exit 0 on success (prints `OK <path>` to stdout). Non-zero on any failure.
"""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import re
import sys
import time
from pathlib import Path

import requests

CREATE_URL = "https://api.kie.ai/api/v1/jobs/createTask"
POLL_URL = "https://api.kie.ai/api/v1/jobs/recordInfo"
UPLOAD_URL = "https://kieai.redpandaai.co/api/file-base64-upload"

MODEL_MAP = {
    "nano-banana": "nano-banana-2",
    "gpt-image": "gpt-image-2-text-to-image",
}


def _read_key_from_env_file(path: Path, key_name: str) -> str | None:
    if not path.exists():
        return None
    pattern = re.compile(rf'^\s*{re.escape(key_name)}\s*=\s*"?([^"\s#]+)"?\s*$')
    for line in path.read_text().splitlines():
        if line.lstrip().startswith("#"):
            continue
        m = pattern.match(line)
        if not m:
            continue
        val = m.group(1).strip()
        if not val or val.startswith("your_") or "placeholder" in val.lower():
            continue
        return val
    return None


def resolve_api_key(env_var_name: str) -> str | None:
    if val := os.environ.get(env_var_name, "").strip():
        if not val.startswith("your_") and "placeholder" not in val.lower():
            return val
    # Repo root .env (.claude/skills/<skill>/scripts/foo.py -> parents[4])
    repo_root_env = Path(__file__).resolve().parents[4] / ".env"
    if val := _read_key_from_env_file(repo_root_env, env_var_name):
        return val
    # Fallback: cwd/.env
    if val := _read_key_from_env_file(Path(".env"), env_var_name):
        return val
    return None


def upload_local_image(api_key: str, path: Path) -> str:
    """Upload a local image to KIE's base64 endpoint, return its public downloadUrl.

    KIE-hosted URLs are required because image_input does not accept base64/file content.
    Uploaded files are auto-deleted after 3 days (fine for one-shot generation runs).
    """
    if not path.exists():
        print(f"ERROR reference image not found: {path}", file=sys.stderr)
        sys.exit(1)
    mime = mimetypes.guess_type(str(path))[0] or "image/png"
    data_url = f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode("ascii")
    resp = requests.post(
        UPLOAD_URL,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={"base64Data": data_url, "uploadPath": "kie-broll-refs", "fileName": path.name},
        timeout=120,
    )
    try:
        data = resp.json()
    except Exception:
        print(f"ERROR upload non-JSON status={resp.status_code} body={resp.text[:400]}", file=sys.stderr)
        sys.exit(1)
    if resp.status_code >= 400 or data.get("code", 0) != 200:
        print(f"ERROR upload code={data.get('code')} msg={data.get('msg')} body={data}", file=sys.stderr)
        sys.exit(1)
    d = data.get("data") or {}
    url = d.get("fileUrl") or d.get("downloadUrl")
    if not url:
        print(f"ERROR upload missing fileUrl/downloadUrl in {data}", file=sys.stderr)
        sys.exit(1)
    print(f"[kie] uploaded ref {path.name} -> {url}", file=sys.stderr)
    return url


def resolve_image_inputs(api_key: str, items: list[str]) -> list[str]:
    """Each item is either an http(s) URL (used as-is) or a local path (uploaded first)."""
    urls: list[str] = []
    for it in items:
        if it.startswith("http://") or it.startswith("https://"):
            urls.append(it)
        else:
            urls.append(upload_local_image(api_key, Path(it).expanduser().resolve()))
    return urls


def build_body(
    model: str, prompt: str, aspect_ratio: str, resolution: str, output_format: str, image_input: list[str]
) -> dict:
    if model == "nano-banana-2":
        return {
            "model": model,
            "callBackUrl": None,
            "input": {
                "prompt": prompt,
                "image_input": image_input,
                "aspect_ratio": aspect_ratio,
                "resolution": resolution,
                "output_format": output_format,
            },
        }
    if model == "gpt-image-2-text-to-image":
        return {
            "model": model,
            "input": {
                "prompt": prompt,
                "aspect_ratio": aspect_ratio,
                "resolution": resolution,
            },
        }
    raise ValueError(f"unknown model: {model}")


def create_task(api_key: str, body: dict) -> str:
    resp = requests.post(
        CREATE_URL,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json=body,
        timeout=60,
    )
    try:
        data = resp.json()
    except Exception:
        print(f"ERROR createTask non-JSON status={resp.status_code} body={resp.text[:400]}", file=sys.stderr)
        sys.exit(1)
    if resp.status_code >= 400 or data.get("code", 0) != 200:
        print(f"ERROR createTask code={data.get('code')} msg={data.get('msg')} body={data}", file=sys.stderr)
        sys.exit(1)
    task_id = (data.get("data") or {}).get("taskId")
    if not task_id:
        print(f"ERROR createTask missing taskId in {data}", file=sys.stderr)
        sys.exit(1)
    return task_id


def poll_task(api_key: str, task_id: str, interval: float, timeout: float) -> str:
    headers = {"Authorization": f"Bearer {api_key}"}
    deadline = time.time() + timeout
    while time.time() < deadline:
        resp = requests.get(POLL_URL, headers=headers, params={"taskId": task_id}, timeout=30)
        try:
            data = resp.json()
        except Exception:
            print(f"[poll] non-JSON status={resp.status_code}; retry", file=sys.stderr)
            time.sleep(interval)
            continue
        if data.get("code", 0) != 200:
            print(f"ERROR poll code={data.get('code')} msg={data.get('msg')}", file=sys.stderr)
            sys.exit(1)
        d = data.get("data") or {}
        state = d.get("state")
        print(f"[poll] taskId={task_id} state={state}", file=sys.stderr)
        if state == "success":
            result_json_str = d.get("resultJson") or "{}"
            try:
                rj = json.loads(result_json_str)
            except Exception as e:
                print(f"ERROR malformed resultJson: {e} raw={result_json_str[:300]}", file=sys.stderr)
                sys.exit(1)
            urls = rj.get("resultUrls") or []
            if not urls:
                print(f"ERROR resultJson missing resultUrls: {rj}", file=sys.stderr)
                sys.exit(1)
            return urls[0]
        if state == "fail":
            print(f"ERROR task failed: {d}", file=sys.stderr)
            sys.exit(1)
        # waiting / queuing / generating
        time.sleep(interval)
    print(f"ERROR poll timeout after {timeout}s (taskId={task_id})", file=sys.stderr)
    sys.exit(1)


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=120) as r:
        if r.status_code >= 400:
            print(f"ERROR download status={r.status_code} url={url}", file=sys.stderr)
            sys.exit(1)
        with dest.open("wb") as f:
            for chunk in r.iter_content(chunk_size=65536):
                if chunk:
                    f.write(chunk)
    size = dest.stat().st_size
    if size < 1024:
        print(f"ERROR downloaded file too small ({size} bytes): {dest}", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--prompt", required=True, help="Image prompt (max 20000 chars)")
    ap.add_argument("--provider", choices=list(MODEL_MAP.keys()), default="nano-banana")
    ap.add_argument("--aspect_ratio", default="9:16")
    ap.add_argument("--resolution", default="1K", choices=["1K", "2K", "4K"])
    ap.add_argument("--output_format", default="png", choices=["png", "jpg"], help="Nano Banana only; ignored for GPT")
    ap.add_argument(
        "--image_input",
        nargs="*",
        default=[],
        help="Reference image(s) — local paths (auto-uploaded to KIE) or public http(s) URLs. "
        "Nano Banana only (max 14); ignored for GPT. Local files are deleted from KIE after 3 days.",
    )
    ap.add_argument("--output", "-o", required=True, help="Local file path to save image")
    ap.add_argument("--api_key_env", default="KIE_API_KEY", help="Env var name holding KIE API key")
    ap.add_argument("--poll_interval", type=float, default=5.0)
    ap.add_argument("--poll_timeout", type=float, default=300.0)
    args = ap.parse_args()

    if len(args.prompt) > 20000:
        print(f"ERROR prompt too long ({len(args.prompt)} > 20000)", file=sys.stderr)
        sys.exit(1)

    api_key = resolve_api_key(args.api_key_env)
    if not api_key:
        print(
            f"ERROR {args.api_key_env} not found. Add `{args.api_key_env}=sk_...` to repo-root .env "
            f"or export {args.api_key_env}=... in shell. Placeholders starting with `your_` are skipped.",
            file=sys.stderr,
        )
        sys.exit(1)

    model = MODEL_MAP[args.provider]

    image_input: list[str] = []
    if args.image_input:
        if model != "nano-banana-2":
            print(
                f"WARN --image_input ignored: {args.provider} (text-to-image) has no reference-image support",
                file=sys.stderr,
            )
        elif len(args.image_input) > 14:
            print(f"ERROR too many reference images ({len(args.image_input)} > 14)", file=sys.stderr)
            sys.exit(1)
        else:
            image_input = resolve_image_inputs(api_key, args.image_input)

    body = build_body(model, args.prompt, args.aspect_ratio, args.resolution, args.output_format, image_input)
    print(
        f"[kie] provider={args.provider} model={model} ar={args.aspect_ratio} res={args.resolution} "
        f"refs={len(image_input)}",
        file=sys.stderr,
    )

    task_id = create_task(api_key, body)
    print(f"[kie] taskId={task_id}", file=sys.stderr)
    image_url = poll_task(api_key, task_id, args.poll_interval, args.poll_timeout)
    print(f"[kie] downloading {image_url}", file=sys.stderr)

    dest = Path(args.output).expanduser().resolve()
    download(image_url, dest)
    print(f"OK {dest}")


if __name__ == "__main__":
    main()
