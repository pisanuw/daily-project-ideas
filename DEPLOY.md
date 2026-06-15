# Deploying the website

The site is a zero-dependency static build. `build.js` parses the `ideas/`
files and writes everything into `dist/`.

## Preview locally

```bash
node build.js          # writes dist/
cd dist && python3 -m http.server 8000
# open http://localhost:8000
```

(`dist/` is git-ignored; it is regenerated on every build.)

## Deploy to Netlify (continuous, recommended)

This is already set up — the site is live at https://daily-project-ideas.netlify.app/
and auto-deploys from `main`. The steps below are for reference / re-connecting.

1. Push this repo to a Git host Netlify can read (GitHub/GitLab/Bitbucket).
   This repo lives on GitHub at `pisanuw/daily-project-ideas`.
2. In the Netlify dashboard: **Add new site → Import an existing project**.
3. Pick this repository. Netlify reads `netlify.toml`, so the settings are
   already filled in:
   - **Build command:** `node build.js`
   - **Publish directory:** `dist`
   - No `npm install` needed (zero dependencies).
4. Click **Deploy**.

After that, every push to `main` (including the daily 5am idea commits)
triggers an automatic rebuild and redeploy. Nothing else to wire up.

### Optional: deploy from the CLI instead

```bash
npm i -g netlify-cli      # one-time
netlify login
node build.js
netlify deploy --prod --dir=dist
```

## How the data flows

```
ideas/YYYY-MM-DD.md   ─┐
ideas/YYYY-MM-DD.json ─┤→  build.js  →  dist/data.js  →  index.html / app.js
implemented.json      ─┘                                  (renders the page)
```

- JSON beats Markdown for the same date (see `ideas/SCHEMA.md`).
- `implemented.json` promotes built ideas into the **Implemented** section.
