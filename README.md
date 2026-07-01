# Daily Project Ideas

**Live site: https://daily-project-ideas.netlify.app/**

Automated daily project ideas curated by a Claude Code Remote Trigger.

Every day at 5am, Claude searches Reddit and the web for interesting project ideas and commits 3 new ones here. It also generates 1 research idea grounded in recent CS education conference papers (SIGCSE TS 2026, ITiCSE 2025), complete with source papers, additional references, and a 3-6 month research plan.

## Sources (by priority)

- [r/SideProject](https://www.reddit.com/r/SideProject/)
- [r/sideprojects](https://www.reddit.com/r/sideprojects/)
- [r/ProductHunters](https://www.reddit.com/r/ProductHunters/)
- [r/coolgithubprojects](https://www.reddit.com/r/coolgithubprojects/)
- [r/AI_Agents](https://www.reddit.com/r/AI_Agents/)

## Idea Categories (by priority)

1. Side projects
2. Tools for teaching
3. Classroom assignments
4. Anything useful for students

## Website

Live at **https://daily-project-ideas.netlify.app/** (auto-deployed from `main`).

A static site renders the ideas grouped by complexity (Weekend 🌶️, 1-2 Weeks 🌶️🌶️,
Multi-week 🌶️🌶️🌶️) plus an Implemented section. Build it with `node build.js`
(zero dependencies) and serve `dist/`. See [DEPLOY.md](DEPLOY.md) for Netlify setup.

## Structure

- `ideas/YYYY-MM-DD.md` - Daily idea files (`.json` also supported, preferred — see `ideas/SCHEMA.md`)
- `IDEAS.md` - Running index of all ideas
- `build.js` - Zero-dependency build: parses `ideas/` into `dist/`
- `web/` - Static site source (HTML/CSS/JS), copied into `dist/` at build time
- `implemented.json` - Hand-curated list of ideas that have been built
- `research-papers/papers-index.json` - Extracted metadata for all papers from local proceedings
- `DEPLOY.md` - How to preview locally and deploy to Netlify
