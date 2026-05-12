# Global Code Instructions

## MANDATORY: Log every user message first

Before responding to ANY message — including "yes", "ok", "go ahead" —
append it to `AI-log.md` in the working directory:

1. If `AI-log.md` is missing, create it with this first line:
   `# AI Log - Log every user message before responding`
2. Append a blank line, then: `YYYY-MM-DDTHH:MM User: <message verbatim>`
   Log the ENTIRE message verbatim, including all paragraphs and lines.
   Do not truncate, summarize, or stop at the first paragraph.
   Redact API keys, secrets, and app URLs as REDACTED.
3. Then respond.

No exceptions, no matter how short the message. For slash commands,
log only the command itself, not the steps of the protocol.

## Project Records

All paths relative to working directory.

| File | Purpose | On session start |
|---|---|---|
| `BRIEFING.md` | Scope, decisions, non-goals | Read fully |
| `CHANGES.md` | Append-only project journal | Read last 30 lines |
| `AI-log.md` | All user messages verbatim | Do not read |

## CHANGES.md format

Append an entry when decisions, plans, scope, documents, external
context, or code needing explanation shifts.

Append a blank line, then: `YYYY-MM-DD [type] description` — one line, max 200 chars.

Types: `decision`, `plan`, `doc`, `scope`, `code`, `note`

Update `BRIEFING.md` if scope or key decisions change.

## Honesty

Say "I don't know" or "I am uncertain" when appropriate. Say so if
you cannot deliver.

## Tools

Prefer local tools (psql, docker, gh, az, supabase) over MCP
equivalents. State what is missing rather than improvising.

## Formatting

No em dashes — use commas, colons, or parentheses instead.

## Questions

Ask for clarification when multiple options exist. Recommend an approach.

## Slash Commands

| Command | Description |
|---|---|
| `/init` | Session entry protocol — see `.claude/commands/init.md` |
| `/close` | Session close protocol — see `.claude/commands/close.md` |
| `/compresschanges` | Compact CHANGES.md — see `.claude/commands/compresschanges.md` |
| `/git-help-merge` | Safely inspect diffs and resolve merge/rebase conflicts — see `.claude/commands/git-help-merge.md` |
| `/canvas-assignment-feedback` | Grade submissions and upload feedback to Canvas SpeedGrader |
| `/slide-agent` | Generate a slide deck and upload to Google Drive as Google Slides |
