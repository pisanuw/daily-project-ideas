# Daily Project Ideas

**Live site: https://daily-project-ideas.netlify.app/**

Automated daily product ideas curated by a Claude Code scheduled routine.

Every day at 5am, Claude gathers demand signals (instructor complaints, feature
requests, proof that people pay for similar tools, policy changes, funding
solicitations, and CS education research) and turns them into commercially
viable software ideas, with a preference for educational software. Each idea
must clear a quality gate backed by cited evidence, so the count varies from 0
to 6 a day. Near misses go on a watchlist and get a second look on later runs.

The full routine, including sources, scoring, the quality gate, and the
adversarial review step, is in [ROUTINE.md](ROUTINE.md).

## Website

Live at **https://daily-project-ideas.netlify.app/** (auto-deployed from `main`).

A static site renders the ideas grouped by complexity (Weekend 🌶️, 1-2 Weeks 🌶️🌶️,
Multi-week 🌶️🌶️🌶️) plus an Implemented section. Build it with `node build.js`
(zero dependencies) and serve `dist/`. See [DEPLOY.md](DEPLOY.md) for Netlify setup.

## Structure

- `ROUTINE.md` - The daily routine prompt (reference copy; the scheduled task runs its own copy)
- `ideas/YYYY-MM-DD.json` - Daily idea files (older days may be `.md`; see `ideas/SCHEMA.md`)
- `ideas/index.jsonl` - Derived index of every idea, used for deduplication (`scripts/build_index.py`)
- `IDEAS.md` - Running table of all ideas with scores and a Rating column for feedback
- `scripts/validate_ideas.py` - Validates a daily file against the schema and quality gate
- `scripts/build_index.py` - Regenerates `ideas/index.jsonl`
- `scripts/notify-implemented.mjs` - Daily email digest of newly implemented projects
- `build.js` - Zero-dependency build: parses `ideas/` into `dist/`
- `web/` - Static site source (HTML/CSS/JS), copied into `dist/` at build time
- `implemented.json` - Hand-curated list of ideas that have been built
- `research-papers/papers-index.json` - Paper metadata used by the older research-idea format
- `DEPLOY.md` - How to preview locally and deploy to Netlify
