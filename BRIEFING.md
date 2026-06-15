# Briefing

- Purpose: Automated daily project idea curation via Claude Code Remote Trigger
- Current scope: Daily 5am routine searches Reddit/HN/GitHub for 3 project ideas, commits to pisanuw/daily-project-ideas; a static website (Netlify) renders the ideas grouped by complexity
- Key decisions: Remote Trigger on Sonnet 4.6, pushes to main, ideas stored in ideas/YYYY-MM-DD.md with index in IDEAS.md. Website built by zero-dep build.js into dist/ (Netlify build = `node build.js`, publish = dist). Landing page groups by complexity pepper tiers (Weekend 🌶️ / 1-2 Weeks 🌶️🌶️ / Multi-week 🌶️🌶️🌶️) plus an Implemented section; cards show a 1-2 sentence summary and open a detail modal. build.js prefers ideas/YYYY-MM-DD.json over .md; routine should emit JSON + summary going forward (ideas/SCHEMA.md). Implemented projects are hand-curated in implemented.json.
- Non-goals: No local cron, no email notifications, no manual curation step (idea generation). Implemented-project curation is the one intentional manual step.
