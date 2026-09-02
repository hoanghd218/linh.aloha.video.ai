#!/usr/bin/env python3
"""Align Whisper transcript text to the original script.txt (source of truth).

Whisper mis-transcribes Vietnamese — brand names ("Masterise" → "Master rise"),
clipped accent marks ("sổ" → "số"), missed compound words, made-up homophones.
The original spoken `script.txt` is what the speaker actually said, so we use
it as ground truth and replace ALL caption text with script text WHILE
preserving Whisper's word-level timestamps.

Pipeline position: runs AFTER `clean_transcript.py` (which produces
`transcript-cleaned.json` + `caption-groups.json`). This script overwrites
`caption-groups.json` and emits a new `transcript-aligned.json`.

Algorithm:
    1. Tokenize script.txt → expected words (strip stage directions, markdown)
    2. Take Whisper word-level transcript (text + start + end)
    3. Normalize both (strip accent + punctuation + lowercase) for fuzzy match
    4. SequenceMatcher.get_opcodes() → equal / replace / insert / delete
    5. For each opcode emit aligned words using SCRIPT text + WHISPER timing
       (replace: spread script words evenly across Whisper time range,
        insert: wedge into the gap between Whisper neighbors,
        delete: drop the Whisper-only word)
    6. Re-group into 3-5 word caption phrases (same logic as clean_transcript.py)

Refuses to align if SequenceMatcher ratio < 0.5 (script doesn't match audio).

Usage:
    python3 align_to_script.py \
        --transcript transcript-cleaned.json \
        --script script.txt \
        [--captions caption-groups.json]   # default: ./caption-groups.json
"""
import argparse
import json
import re
import sys
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

GAP_BREAK = 0.45     # silence gap (s) that breaks a caption group
MIN_WORDS = 2        # minimum words per caption group
MAX_WORDS = 5        # maximum words per caption group
MIN_RATIO = 0.5      # below this, refuse to align (script doesn't match audio)


def normalize_for_match(s: str) -> str:
    """Strip accents + punctuation + lowercase. For fuzzy matching only — never
    used as output text. 'Cửa sổ' and 'Cửa số' both normalize to 'cuaso',
    which lets SequenceMatcher align them so we can replace Whisper's wrong
    accent with the script's right one."""
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    return re.sub(r'[^a-z0-9]+', '', s)


def tokenize_script(text: str) -> list[str]:
    """Split script text into spoken-word tokens, preserving casing + any
    in-word punctuation. Strips stage directions, markdown markers, speaker
    labels — anything the voice talent would NOT have spoken aloud."""
    # Drop bracketed/parenthesized stage directions: [pause], (laughs)
    text = re.sub(r'\[[^\]]*\]', ' ', text)
    text = re.sub(r'\([^)]*\)', ' ', text)
    # Drop markdown headers at start of line
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    # Drop markdown emphasis markers (keep wrapped content)
    text = re.sub(r'\*+', '', text)
    text = re.sub(r'_{2,}', '', text)
    # Drop speaker labels like "NARRATOR:" at line start (uppercase block + colon)
    text = re.sub(r'^[A-ZÀ-Ỹ][A-ZÀ-Ỹ\s]{1,30}:\s+', '', text, flags=re.MULTILINE)
    # Split on whitespace, drop empty + pure-punctuation tokens
    return [t for t in re.split(r'\s+', text.strip()) if t and normalize_for_match(t)]


def align(whisper_words: list[dict], script_tokens: list[str]) -> list[dict] | None:
    """Return aligned word-level list: SCRIPT text wearing WHISPER timestamps.

    Returns None if alignment ratio is too low (refusing to corrupt timing
    when the script clearly doesn't match the audio)."""
    # Drop Whisper entries that are pure punctuation (normalize to empty)
    whisper_words = [w for w in whisper_words if normalize_for_match(w['text'])]

    w_norm = [normalize_for_match(w['text']) for w in whisper_words]
    s_norm = [normalize_for_match(t) for t in script_tokens]

    matcher = SequenceMatcher(a=w_norm, b=s_norm, autojunk=False)
    ratio = matcher.ratio()
    print(f'Alignment ratio: {ratio:.3f}')
    if ratio < MIN_RATIO:
        print(f'WARNING: ratio {ratio:.2f} < {MIN_RATIO} — refusing to align.', file=sys.stderr)
        print('         Script likely does not match the audio. Leaving files unchanged.', file=sys.stderr)
        return None

    out: list[dict] = []
    counts = {'equal': 0, 'replace': 0, 'insert': 0, 'delete': 0}

    for op, i1, i2, j1, j2 in matcher.get_opcodes():
        w_slice = whisper_words[i1:i2]
        s_slice = script_tokens[j1:j2]
        counts[op] += max(len(w_slice), len(s_slice))

        if op == 'equal':
            # 1:1 — take script text (may differ in casing/accents), Whisper timing
            for w, s in zip(w_slice, s_slice):
                out.append({'text': s, 'start': w['start'], 'end': w['end']})

        elif op == 'replace':
            # Different counts — spread script tokens evenly across Whisper time range
            if not s_slice or not w_slice:
                continue
            t_start = w_slice[0]['start']
            t_end = w_slice[-1]['end']
            total = max(t_end - t_start, 0.05)
            step = total / len(s_slice)
            for idx, s in enumerate(s_slice):
                out.append({
                    'text': s,
                    'start': round(t_start + idx * step, 3),
                    'end': round(t_start + (idx + 1) * step, 3),
                })

        elif op == 'insert':
            # Script has words Whisper missed — wedge into the gap
            prev_end = out[-1]['end'] if out else 0.0
            next_start = (whisper_words[i1]['start']
                          if i1 < len(whisper_words) else prev_end + 0.3)
            wedge = max(next_start - prev_end, 0.1)
            step = wedge / len(s_slice)
            for idx, s in enumerate(s_slice):
                out.append({
                    'text': s,
                    'start': round(prev_end + idx * step, 3),
                    'end': round(prev_end + (idx + 1) * step, 3),
                })

        # op == 'delete' — Whisper hallucinated; drop without emitting

    print(f'Opcode counts — equal:{counts["equal"]} replace:{counts["replace"]} '
          f'insert:{counts["insert"]} delete:{counts["delete"]}')
    return out


def group_captions(words: list[dict]) -> list[dict]:
    """Re-group aligned word-level transcript into 3-5 word caption phrases.
    Mirrors clean_transcript.py.group_captions for consistency."""
    groups: list[list[dict]] = []
    cur: list[dict] = []
    for w in words:
        if cur:
            gap = w['start'] - cur[-1]['end']
            if gap > GAP_BREAK or len(cur) >= MAX_WORDS:
                if len(cur) >= MIN_WORDS:
                    groups.append(cur)
                    cur = []
        cur.append(w)
    if cur:
        groups.append(cur)

    return [{
        'text': ' '.join(w['text'] for w in g).strip().rstrip(','),
        'start': round(g[0]['start'], 2),
        'end': round(g[-1]['end'], 2),
    } for g in groups]


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--transcript', required=True,
                   help='Path to transcript-cleaned.json (word-level)')
    p.add_argument('--script', required=True,
                   help='Path to script.txt (source of truth)')
    p.add_argument('--captions',
                   help='Path to caption-groups.json (default: same dir as transcript)')
    p.add_argument('--dry-run', action='store_true',
                   help='Print preview without writing files')
    args = p.parse_args()

    transcript_path = Path(args.transcript)
    script_path = Path(args.script)
    captions_path = Path(args.captions) if args.captions else transcript_path.parent / 'caption-groups.json'

    if not transcript_path.exists():
        print(f'Error: {transcript_path} not found', file=sys.stderr)
        sys.exit(1)
    if not script_path.exists():
        print(f'Error: {script_path} not found', file=sys.stderr)
        sys.exit(1)

    whisper_words = json.loads(transcript_path.read_text())
    script_tokens = tokenize_script(script_path.read_text())
    print(f'Whisper words: {len(whisper_words)} · Script tokens: {len(script_tokens)}')

    aligned = align(whisper_words, script_tokens)
    if aligned is None:
        sys.exit(2)
    print(f'Aligned words: {len(aligned)}')

    captions = group_captions(aligned)
    print(f'Caption groups: {len(captions)}')

    if args.dry_run:
        print('\n[dry-run] First 8 caption groups:')
        for c in captions[:8]:
            print(f'  {c["start"]:6.2f}s  {c["text"]}')
        return

    aligned_path = transcript_path.parent / 'transcript-aligned.json'
    aligned_path.write_text(json.dumps(aligned, ensure_ascii=False, indent=2))
    print(f'Wrote: {aligned_path}')

    captions_path.write_text(json.dumps(captions, ensure_ascii=False, indent=2))
    print(f'Wrote: {captions_path}')


if __name__ == '__main__':
    main()
