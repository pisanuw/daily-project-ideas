# Idea data formats

The website (`build.js` → `dist/`) reads project ideas from this `ideas/`
directory. Two formats are supported per day; **JSON takes precedence over
Markdown** when both exist for the same date.

- `ideas/YYYY-MM-DD.md` — the historical Markdown format (still fully supported).
- `ideas/YYYY-MM-DD.json` — the preferred format going forward. Lets the daily
  routine supply a clean `summary` and avoid parsing ambiguity.

The daily routine may emit **either** (or both). Existing Markdown files do not
need to be converted; they are parsed automatically.

---

## Markdown format (`ideas/YYYY-MM-DD.md`)

Each day has three ideas. Each idea is one block:

```markdown
## 1. Project Title
**Category:** Side Project
**Complexity:** Weekend
**Inspired by:** short source note + link

### Description
One or more paragraphs describing the project.

### Key Features
- Feature one
- Feature two

### Suggested Tech Stack
React + Vite, Claude API, etc.

### Why It's Interesting
A paragraph on the value.
```

The card summary is auto-derived from the first 1–2 sentences of
`### Description`. `**Complexity:**` must contain one of: `Weekend`,
`1-2 Weeks`, `Multi-week` (matched case-insensitively).

---

## JSON format (`ideas/YYYY-MM-DD.json`) — preferred

```json
{
  "date": "2026-06-16",
  "ideas": [
    {
      "n": 1,
      "title": "Project Title",
      "category": "Side Project",
      "complexity": "Weekend",
      "summary": "One to two sentence card blurb. Optional: derived from description if omitted.",
      "description": "Full description paragraph(s).",
      "keyFeatures": ["Feature one", "Feature two"],
      "techStack": "React + Vite, Claude API, ...",
      "whyInteresting": "Why it is worth building.",
      "inspiredBy": "source note + link"
    }
  ]
}
```

A bare JSON array of idea objects is also accepted. `complexity` accepts the
same three values as Markdown. If `summary` is omitted it is derived from
`description` exactly like the Markdown path.

### Routine guidance

Going forward the daily routine SHOULD, in addition to (or instead of) the
Markdown file, write `ideas/YYYY-MM-DD.json` with a hand-written 1–2 sentence
`summary` per idea. Nothing else in the pipeline needs to change; the site
picks up JSON automatically on the next build.

---

## Commercial product ideas (schemaVersion 2 and 3)

Since 2026-10-21 the routine writes commercial product ideas instead of the
format above. `ROUTINE.md` (Step 7) is the authoritative field list; the
version history:

- **schemaVersion 2** (from 2026-10-21 until v3 replaced it): exactly 3 ideas per day,
  each with `problemStatement`, `targetCustomer`, `buyer`, `problemEvidence`,
  `competitors`, `pricing`, `scores` (six criteria, `total` out of 30), and so
  on. `complexity` is `Weekend MVP`, `Multi-week`, or `Multi-month`.
- **schemaVersion 3** (introduced 2026-10-30): 0 to 6 ideas per day, each of which
  cleared a quality gate (total at least 22, pain at least 4,
  willingnessToPay at least 3, 2 independent evidence items, one within 90
  days). Adds per idea `scoreRationale` (one cited line per score), `review`
  (adversarial review verdict and findings), and `author` on each evidence
  item. Adds at the top level `complete: true`, and in `runNotes`:
  `weekday`, `focusSources`, `unverifiedSignals`, and `watchlist` (near
  misses carried to the next run for up to 14 days).

Validate a v3 file with `python3 scripts/validate_ideas.py ideas/YYYY-MM-DD.json`.

The website renders these ideas with a commercial detail layout: score
breakdown (with rationales and review verdict for v3), problem, customer and
buyer, demand evidence, competitors, MVP scope, business model, validation
test, compliance, risks, and review findings. Cards show the score out of 30.
`build.js` passes the fields through via its `COMMERCIAL_KEYS` list. `Weekend MVP` maps to
the Weekend tier and `Multi-week` and `Multi-month` to the Multi-week tier.

## Idea index (`ideas/index.jsonl`)

Derived file, one JSON object per line for every idea ever written (JSON and
Markdown days): `date`, `n`, `slug`, `title`, `category`, `complexity`,
`targetCustomer`, `problemStatement`. Regenerate it with
`python3 scripts/build_index.py`; never edit it by hand. The routine uses it
to deduplicate new ideas against the full history. `build.js` ignores it.

---

## Research idea format (legacy, n=4)

Through 2026-10-18 each daily JSON file included a fourth entry with
`"complexity": "Research"`. The commercial routine no longer generates these;
the format is kept because older files and occasional manual additions use it.
Research ideas are grounded in one or more conference papers and include a
detailed research plan. They appear in a separate **Research Ideas** section
on the website.

```json
{
  "n": 4,
  "title": "Research Idea Title",
  "category": "Research",
  "complexity": "Research",
  "summary": "One to two sentence card blurb for the website card.",
  "description": "Full description of the research idea and how it extends the source paper(s).",
  "papers": [
    {
      "title": "Source Paper Title",
      "authors": "Author One, Author Two",
      "venue": "SIGCSE TS 2026",
      "year": 2026,
      "doi": "10.1145/XXXXXXX.YYYYYYY",
      "url": "https://doi.org/10.1145/XXXXXXX.YYYYYYY",
      "abstract": "Paper abstract (first 2-3 sentences).",
      "relevance": "How this paper connects to the research idea."
    }
  ],
  "additionalRefs": [
    {
      "title": "Related Work Title",
      "authors": "Author(s)",
      "venue": "Conference or Journal, Year",
      "year": 2024,
      "url": "https://...",
      "relevance": "How this reference supports or contextualizes the idea."
    }
  ],
  "researchPlan": {
    "overview": "2-3 sentence summary of the research agenda.",
    "milestones": [
      { "month": 1, "goal": "Literature review and problem scoping", "deliverable": "Annotated bibliography + refined research questions" },
      { "month": 2, "goal": "...", "deliverable": "..." },
      { "month": 3, "goal": "...", "deliverable": "..." },
      { "month": 4, "goal": "...", "deliverable": "..." },
      { "month": 5, "goal": "...", "deliverable": "..." },
      { "month": 6, "goal": "...", "deliverable": "Draft paper ready for submission" }
    ],
    "targetVenues": ["SIGCSE", "ICER", "EDM", "ITiCSE"],
    "resources": "What data, compute, APIs, student collaborators, or infrastructure would be needed.",
    "risks": [
      { "risk": "Description of a risk", "mitigation": "How to address it" }
    ],
    "humanSubjects": false
  }
}
```

### Paper index

`research-papers/papers-index.json` contains metadata for all papers from the
local proceedings (SIGCSE TS 2026 v1/v2, ITiCSE 2025 v1/v2): title, authors,
abstract, DOI, venue, year. The daily routine reads this index to pick a paper
not yet used, then does additional web research to enrich the idea.

Used-paper tracking: the routine checks existing `ideas/*.json` files and reads
the `papers[].doi` arrays to know which papers have already generated ideas.

---

## Implemented projects (`implemented.json`, repo root)

Hand-curated. The daily routine does **not** touch this file. An idea becomes
"implemented" only when a human decides it has been built. Implemented projects
are moved out of their complexity tier into the dedicated **Implemented**
section, with optional live-URL and repo links.

Two entry shapes:

```jsonc
{
  "projects": [
    // (1) Promote an existing idea by reference:
    {
      "ref": { "date": "2026-05-12", "n": 1 },
      "url": "https://live-demo.example.com",
      "repo": "https://github.com/you/project",
      "summary": "Optional override of the card blurb.",
      "notes": "Optional extra paragraph shown in the detail modal.",
      "implementedOn": "2026-06-01"
    },
    // (2) Standalone implemented project (no matching idea):
    {
      "title": "Standalone Project",
      "summary": "Short blurb.",
      "description": "Full description.",
      "category": "Implemented",
      "complexity": "Implemented",
      "url": "https://...",
      "repo": "https://...",
      "implementedOn": "2026-06-01"
    }
  ]
}
```

Set `"placeholder": true` on an entry to mark it as a not-yet-real seed (it is
excluded from idea counts). Remove the placeholder entry once you add a real one.
