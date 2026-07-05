#!/usr/bin/env bash
# init_project.sh — feed workspace data into a SHARED Remotion project.
#
# Architecture: ONE Remotion project at `<repo>/workspace/remotion-project/` is shared
# across all per-project workspaces (e.g. `workspace/content/YYYY-MM-DD/<slug>/`).
#
# - First run (shared project doesn't exist): copy template → workspace/remotion-project/
#   + npm install (~30-90s one-time cost).
# - Subsequent runs: only copy the per-project data files (voiceover.mp3, source.mp4,
#   overlays.json, caption-groups.json, broll/, logos/) into the shared public/.
#   BGM and SFX defaults under public/bgm/ + public/sfx/ are PRESERVED.
#
# Usage:
#   scripts/init_project.sh <project-workspace> [--template <name>] [--remotion-root <path>]
#
# Defaults:
#   --template       BDSGeneralTemplate
#   --remotion-root  <repo>/workspace/remotion-project  (auto-detected via `git rev-parse`)
#
# After it finishes:
#   cd <remotion-root>
#   npm start                                          # Studio (localhost:3000)
#   npm run render-draft                               # crf 28 quick preview
#   npm run render-final                               # crf 18 final
#
# To re-preview a different project, just re-run this script with the new
# <project-workspace>. The shared public/ swaps out, template + node_modules stay.

set -euo pipefail

# ── Parse args ───────────────────────────────────────────────────────────────
TEMPLATE_NAME="BDSGeneralTemplate"
REMOTION_ROOT_OVERRIDE=""
PROJECT_WORKSPACE_ARG=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --template)         TEMPLATE_NAME="${2:-}"; shift 2 ;;
    --template=*)       TEMPLATE_NAME="${1#--template=}"; shift ;;
    --remotion-root)    REMOTION_ROOT_OVERRIDE="${2:-}"; shift 2 ;;
    --remotion-root=*)  REMOTION_ROOT_OVERRIDE="${1#--remotion-root=}"; shift ;;
    -h|--help)          sed -n '2,30p' "$0"; exit 0 ;;
    *)
      if [[ -z "$PROJECT_WORKSPACE_ARG" ]]; then
        PROJECT_WORKSPACE_ARG="$1"
      else
        echo "ERROR: unexpected argument '$1'" >&2
        exit 2
      fi
      shift
      ;;
  esac
done

if [[ -z "$PROJECT_WORKSPACE_ARG" ]]; then
  echo "Usage: $0 <project-workspace> [--template <name>] [--remotion-root <path>]" >&2
  exit 2
fi

PROJECT_WORKSPACE="$(cd "$PROJECT_WORKSPACE_ARG" 2>/dev/null && pwd || true)"
if [[ -z "$PROJECT_WORKSPACE" || ! -d "$PROJECT_WORKSPACE" ]]; then
  echo "ERROR: project-workspace '$PROJECT_WORKSPACE_ARG' does not exist" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE="$SKILL_DIR/templates/$TEMPLATE_NAME"

if [[ ! -d "$TEMPLATE" ]]; then
  echo "ERROR: template '$TEMPLATE_NAME' not found at $TEMPLATE" >&2
  echo "Available templates:" >&2
  ls "$SKILL_DIR/templates" 2>/dev/null | sed 's/^/  - /' >&2 || echo "  (none)" >&2
  exit 1
fi

# ── Resolve shared remotion-project root ────────────────────────────────────
if [[ -n "$REMOTION_ROOT_OVERRIDE" ]]; then
  REMO="$REMOTION_ROOT_OVERRIDE"
elif REPO_ROOT="$(git -C "$PROJECT_WORKSPACE" rev-parse --show-toplevel 2>/dev/null)"; then
  REMO="$REPO_ROOT/workspace/remotion-project"
else
  # Fallback: 3 levels up from project-workspace (assumes content/YYYY-MM-DD/<slug>/)
  REMO="$(cd "$PROJECT_WORKSPACE/../../.." 2>/dev/null && pwd)/remotion-project"
fi

echo "→ Template:           $TEMPLATE_NAME"
echo "→ Project workspace:  $PROJECT_WORKSPACE"
echo "→ Shared Remotion:    $REMO"
echo

# ── Step 1: ensure shared remotion-project exists ───────────────────────────
if [[ ! -d "$REMO" ]]; then
  echo "→ First-time setup: copying template + npm install (~30-90s)..."
  mkdir -p "$REMO"
  # Copy template src/ + configs + public/ (with bgm + sfx defaults)
  for entry in src package.json tsconfig.json remotion.config.ts public; do
    if [[ -e "$TEMPLATE/$entry" ]]; then
      cp -R "$TEMPLATE/$entry" "$REMO/$entry"
    fi
  done
  mkdir -p "$REMO/renders"
  echo "→ Running npm install..."
  (cd "$REMO" && npm install --no-audit --no-fund --loglevel=error)
  echo "✓ Shared Remotion project ready at $REMO"
else
  echo "✓ Shared Remotion project already exists — only swapping inputs"
fi

# ── Step 2: swap per-project data into public/ ──────────────────────────────
# IMPORTANT: only touch data files. Preserve public/bgm/ and public/sfx/ (template defaults)
# unless workspace has its own sfx/ to override.
echo "→ Copying project data into $REMO/public/..."

# Template-aware overlays filename:
# - BDSGeneralTemplate  → Root.tsx reads `overlays-general.json`
# - BDSApartmentDetail* → Root.tsx reads `overlays-apartment.json`
# Workspace always writes `overlays.json`; init renames into the slot the
# composition expects so Studio actually picks up the new data. Without this
# rename, Root.tsx fetches the stale prior-project file and the user sees the
# wrong title (lesson learned 2026-05-25 — see references/lessons-learned.md).
case "$TEMPLATE_NAME" in
  *Apartment*) OVERLAYS_TARGET="overlays-apartment.json" ;;
  *)           OVERLAYS_TARGET="overlays-general.json" ;;
esac

for f in voiceover.mp3 source.mp4 caption-groups.json; do
  SRC="$PROJECT_WORKSPACE/$f"
  DST="$REMO/public/$f"
  if [[ -f "$SRC" ]]; then
    cp "$SRC" "$DST"
    echo "   ✓ $f"
  else
    echo "   ⚠ $f not found at $SRC"
  fi
done

# overlays.json → target name expected by Root.tsx composition
SRC="$PROJECT_WORKSPACE/overlays.json"
if [[ -f "$SRC" ]]; then
  cp "$SRC" "$REMO/public/overlays.json"
  cp "$SRC" "$REMO/public/$OVERLAYS_TARGET"
  echo "   ✓ overlays.json (also copied to $OVERLAYS_TARGET for $TEMPLATE_NAME)"
else
  echo "   ⚠ overlays.json not found at $SRC"
fi

# B-roll / logos folders — swap whole dir if present
for dir in broll logos; do
  SRC="$PROJECT_WORKSPACE/$dir"
  DST="$REMO/public/$dir"
  if [[ -d "$SRC" ]]; then
    rm -rf "$DST"
    cp -R "$SRC" "$DST"
    COUNT=$(find "$DST" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "   ✓ $dir/ ($COUNT files)"
  fi
done

# Workspace SFX override (optional — only if user has custom sfx/ or sfx-bds/)
for sfx_dir in sfx sfx-bds; do
  if [[ -d "$PROJECT_WORKSPACE/$sfx_dir" ]]; then
    rm -rf "$REMO/public/sfx"
    cp -R "$PROJECT_WORKSPACE/$sfx_dir" "$REMO/public/sfx"
    COUNT=$(find "$REMO/public/sfx" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "   ✓ sfx/ ← $sfx_dir/ ($COUNT files, workspace override)"
    break
  fi
done

# Workspace BGM override (optional)
if [[ -d "$PROJECT_WORKSPACE/bgm" ]]; then
  rm -rf "$REMO/public/bgm"
  cp -R "$PROJECT_WORKSPACE/bgm" "$REMO/public/bgm"
  echo "   ✓ bgm/ (workspace override)"
fi

# ── Done ────────────────────────────────────────────────────────────────────
mkdir -p "$REMO/renders"

# Read project slug from overlays.json if present, for naming renders
SLUG="$(basename "$PROJECT_WORKSPACE")"

cat <<EOF

✓ Inputs ready in shared Remotion project:
    $REMO

Project loaded: $SLUG

Next:
    cd "$REMO"
    npm start                                                  # Studio (localhost:3000)
    npx remotion render Root renders/${SLUG}-draft.mp4 --crf 28
    npx remotion render Root renders/${SLUG}-final.mp4 --crf 18

To preview a different project, re-run:
    bash $0 <other-project-workspace>
EOF
