---
name: auto-commit
description: Commit big updates in ProfileRAG automatically on a feature branch, then ask the user to review. Use when finishing a feature or a large multi-file change, when the user asks to commit, or when a Stop hook auto-commit fired.
---

# Auto-commit big updates (ProfileRAG)

## When a commit is "big"
A change counts as big when staged changes reach either threshold:
- 5 or more changed files (`AUTO_COMMIT_MIN_FILES`), or
- 150 or more added+deleted lines (`AUTO_COMMIT_MIN_LINES`).

Files over 5 MB are never auto-committed (`AUTO_COMMIT_MAX_FILE_BYTES`). Data and model files such as `data/embeddings/*` need a human decision.

## How it runs
- The project `Stop` hook in `.claude/settings.json` calls `.claude/hooks/auto-commit.sh` after each turn. It applies the thresholds above and commits only if they are met.
- You can also run it yourself: `.claude/hooks/auto-commit.sh`.

## Rules
1. **Never commit on `main` or `master`.** If you are on one of them, create a feature branch first (`git checkout -b <topic>`). The hook skips the default branch on purpose.
2. **Never push**, never `--amend`, never force anything. Pushing is outward-facing and needs the user's go-ahead.
3. **Prefer a real commit message.** When you finish a feature yourself, stage the relevant files and commit with a specific subject and body, ending with `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`. The hook's generic `Auto-commit:` message is the safety net, not the first choice.
4. **Verify before committing.** Run `npm run build` in `frontend/` and `pytest` when the change touches backend code. Don't commit a change you know is broken without saying so in the commit body.
5. **Don't commit secrets.** `.env`, `contact_messages.log`, and similar files are gitignored. Check `git status` before staging anything new.

## Ask for review (required after every auto or manual commit)
After a commit, tell the user:
- the commit SHA, branch, and subject;
- the files changed and the +/- line count;
- what the change does, in two or three sentences;
- how to inspect or undo it: `git show <sha>`, or `git reset --soft HEAD~1` to undo it while keeping the changes.

Then ask: "Review this commit. Should I keep it, open a PR, or revert it?" Do not push or open a PR until the user approves.
