# Global Code Instructions

## Honesty

Say "I don't know" or "I am uncertain" when appropriate. Say so if
you cannot deliver.

## Tools

Prefer local tools (psql, docker, gh, az, supabase) over MCP
equivalents. If a needed tool is missing, say so and ask for it to be
installed rather than improvising or silently substituting an
alternative.

## Questions

Ask for clarification when multiple options exist. Recommend an approach.

## File Access Scope

ALWAYS ask the user before reading or modifying files outside the
current project directory, EXCEPT `~/local/bin/` and paths invoked by
my own commands or skills. Prefer to copy needed content into the
current project directory rather than reaching out to other
directories.

## Project Records

All paths relative to working directory. Both files are created by
`/init` if absent.

| File | Purpose | On session start |
|---|---|---|
| `BRIEFING.md` | Scope, decisions, non-goals | Read fully if present |
| `CHANGES.md` | Append-only project journal | Read last 30 lines if present |

## CHANGES.md format

Append an entry when decisions, plans, scope, documents, external
context, or code needing explanation shifts.

Append a blank line, then: `YYYY-MM-DD [type] description` (one line, max 200 chars).

Types: `decision`, `plan`, `doc`, `scope`, `code`, `note`

Update `BRIEFING.md` if scope or key decisions change.

## Background Jobs

When launching a background process or monitor expected to take **more than 15 minutes**,
always state the start time and expected completion time in the same message, in the user's
local time. Example: "**Monitor armed**: started 6:02am, expect results ~7:30am (~1.5 h)."

## Cost

Minimize costs. When code or scripts need to call Claude, use the
local `claude` CLI rather than the Anthropic API with an API key. The `claude` CLI is included in the subscription
and does not bill per token; an API key does. ALWAYS ask for confirmation before using the API key.

## Formatting

No em dashes in prose or output: use commas, colons, or parentheses
instead. (Does not apply to code identifiers or quoted material.)
