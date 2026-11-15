#!/usr/bin/env bash
# Auto-commit a "big update" on a feature branch.
# - Never commits on main/master (or a detached HEAD).
# - Never pushes, amends, or rewrites history.
# - Commits only when staged changes cross a threshold, so small edits are left alone.
# - Always exits 0 so a failure here never blocks the Claude session.

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$ROOT" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

MIN_FILES="${AUTO_COMMIT_MIN_FILES:-5}"          # changed files that count as "big"
MIN_LINES="${AUTO_COMMIT_MIN_LINES:-150}"        # added+deleted lines that count as "big"
MAX_FILE_BYTES="${AUTO_COMMIT_MAX_FILE_BYTES:-5242880}"  # never auto-commit files over 5 MB

branch="$(git branch --show-current 2>/dev/null)"
case "$branch" in
  ""|main|master) exit 0 ;;
esac

# Nothing changed at all.
[ -z "$(git status --porcelain)" ] && exit 0

git add -A 2>/dev/null || exit 0

# Refuse to auto-commit oversized files (data, models, binaries); leave them for a human.
oversized=""
while IFS= read -r -d '' f; do
  size="$(git cat-file -s ":$f" 2>/dev/null || echo 0)"
  if [ "$size" -gt "$MAX_FILE_BYTES" ]; then oversized="$oversized $f"; fi
done < <(git diff --cached --name-only -z)
if [ -n "$oversized" ]; then
  git reset -q
  echo "auto-commit: skipped, oversized file(s):$oversized" >&2
  exit 0
fi

files="$(git diff --cached --name-only | wc -l | tr -d ' ')"
[ "$files" -eq 0 ] && exit 0

added="$(git diff --cached --numstat | awk '{ if ($1 ~ /^[0-9]+$/) a += $1 } END { print a + 0 }')"
deleted="$(git diff --cached --numstat | awk '{ if ($2 ~ /^[0-9]+$/) d += $2 } END { print d + 0 }')"
lines=$((added + deleted))

if [ "$files" -lt "$MIN_FILES" ] && [ "$lines" -lt "$MIN_LINES" ]; then
  git reset -q   # below threshold: unstage, keep working-tree changes
  exit 0
fi

msg_file="$(mktemp)"
{
  echo "Auto-commit: $files files, +$added/-$deleted on $branch"
  echo
  git diff --cached --name-status | sed 's/^/  /'
  echo
  echo "Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>"
} > "$msg_file"

if git commit -q -F "$msg_file"; then
  sha="$(git rev-parse --short HEAD)"
  echo "auto-commit: $sha on $branch ($files files, +$added/-$deleted). Not pushed. Ask the user to review." >&2
else
  echo "auto-commit: commit failed; changes left staged." >&2
fi
rm -f "$msg_file"
exit 0
