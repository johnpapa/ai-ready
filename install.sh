#!/usr/bin/env bash
#
# Install the ai-ready skill for any Agent Skills compatible AI coding tool.
#
#   curl -fsSL https://raw.githubusercontent.com/johnpapa/ai-ready/main/install.sh | bash
#
# or, from a clone:
#
#   ./install.sh            # link/copy into every detected tool
#   ./install.sh --all      # install for every known tool, even undetected ones
#   ./install.sh --copy     # copy files instead of symlinking
#   ./install.sh --uninstall
#
set -euo pipefail

SKILL_NAME="ai-ready"
REPO="johnpapa/ai-ready"
MODE="link"
FORCE_ALL=0
UNINSTALL=0

for arg in "$@"; do
  case "$arg" in
    --all) FORCE_ALL=1 ;;
    --copy) MODE="copy" ;;
    --link) MODE="link" ;;
    --uninstall) UNINSTALL=1 ;;
    -h|--help)
      sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

info()  { printf '  \033[32m✓\033[0m %s\n' "$1"; }
warn()  { printf '  \033[33m!\033[0m %s\n' "$1"; }
plain() { printf '    %s\n' "$1"; }

# ---------------------------------------------------------------------------
# Locate the canonical skill directory
# ---------------------------------------------------------------------------
SOURCE_DIR=""
SCRIPT_DIR=""
if [ -n "${BASH_SOURCE[0]:-}" ] && [ -f "${BASH_SOURCE[0]}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

if [ -n "$SCRIPT_DIR" ] && [ -f "$SCRIPT_DIR/skills/$SKILL_NAME/SKILL.md" ]; then
  SOURCE_DIR="$SCRIPT_DIR/skills/$SKILL_NAME"
elif [ "$UNINSTALL" -eq 0 ]; then
  # Piped from curl — fetch a copy, then always install by copying.
  MODE="copy"
  TMP_DIR="$(mktemp -d)"
  trap 'rm -rf "$TMP_DIR"' EXIT
  echo "Downloading $REPO..."
  if ! git clone --quiet --depth 1 "https://github.com/$REPO.git" "$TMP_DIR/repo"; then
    echo "Failed to download $REPO" >&2
    exit 1
  fi
  SOURCE_DIR="$TMP_DIR/repo/skills/$SKILL_NAME"
fi

if [ "$UNINSTALL" -eq 0 ] && [ ! -f "$SOURCE_DIR/SKILL.md" ]; then
  echo "Could not find skills/$SKILL_NAME/SKILL.md" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Decide which tools to target
#
# ~/.agents/skills is the vendor-neutral Agent Skills location, read by Codex
# and Cursor. Claude Code and Cursor also read their own directories.
# ---------------------------------------------------------------------------
TARGETS=()
add_target() {
  for existing in ${TARGETS[@]+"${TARGETS[@]}"}; do
    [ "$existing" = "$1" ] && return 0
  done
  TARGETS+=("$1")
}

detected() { [ -d "$1" ] || command -v "$2" >/dev/null 2>&1; }

# Vendor-neutral location always wins — it covers Codex and Cursor at once.
add_target "$HOME/.agents/skills"

if [ "$FORCE_ALL" -eq 1 ] || detected "$HOME/.claude" claude; then
  add_target "$HOME/.claude/skills"
fi
if [ "$FORCE_ALL" -eq 1 ] || detected "$HOME/.cursor" cursor; then
  add_target "$HOME/.cursor/skills"
fi
if [ "$FORCE_ALL" -eq 1 ] || detected "$HOME/.codex" codex; then
  add_target "$HOME/.codex/skills"
fi

# ---------------------------------------------------------------------------
# Install / uninstall
# ---------------------------------------------------------------------------
if [ "$UNINSTALL" -eq 1 ]; then
  echo "Removing $SKILL_NAME..."
  for base in "$HOME/.agents/skills" "$HOME/.claude/skills" "$HOME/.cursor/skills" "$HOME/.codex/skills"; do
    dest="$base/$SKILL_NAME"
    if [ -e "$dest" ] || [ -L "$dest" ]; then
      rm -rf "$dest"
      info "removed $dest"
    fi
  done
  echo
  plain "Copilot CLI: copilot plugin uninstall $SKILL_NAME"
  exit 0
fi

echo "Installing $SKILL_NAME from $SOURCE_DIR"
echo

for base in "${TARGETS[@]}"; do
  dest="$base/$SKILL_NAME"
  mkdir -p "$base"

  if [ -L "$dest" ]; then
    rm -f "$dest"
  elif [ -d "$dest" ]; then
    rm -rf "$dest"
  fi

  if [ "$MODE" = "link" ]; then
    ln -s "$SOURCE_DIR" "$dest"
    info "linked $dest"
  else
    cp -R "$SOURCE_DIR" "$dest"
    info "copied $dest"
  fi
done

echo
echo "Installed. Restart your agent, then ask:"
echo
plain "make this repo ai-ready"
echo
if [ "$MODE" = "link" ]; then
  plain "Symlinked — git pull in this clone updates every tool at once."
fi
plain "GitHub Copilot CLI users instead run: copilot plugin install $REPO"
