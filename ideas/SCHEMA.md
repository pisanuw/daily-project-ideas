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
- **schemaVersion 3, revised 2026-11-01.** The first five v3 runs produced zero
  ideas between them, so v3 gained a second tier instead of an all-or-nothing
  gate. The version number did not change: the fields below are additions, and
  older v3 files stay valid. Changes:
  - Since 2026-11-04 a day carries 3 to 6 ideas: validated ones first, then
    provisional ones (at most 4) to make up at least 3. Fewer than 3 needs a
    `runNotes.caveats` line saying why.
  - `confidence` (required, `"validated"` or `"provisional"`). A validated idea
    cleared the gate, whose numbers are unchanged. A provisional idea is the
    run's best reviewed candidate when nothing cleared it, and it must still
    pass every rejection rule, carry one fetched evidence item dated within 180
    days, and have been researched and adversarially reviewed.
  - `gateGap` (required on provisional ideas, forbidden on validated ones):
    `missing`, a list naming every gate condition the idea misses, and
    `closedBy`, what result would promote it. The site renders this as a panel
    directly under the scores, so a provisional idea announces its own weakness.
  - `kind` on each `problemEvidence` item: `"complaint"` (a named person
    describing a problem), `"spend"` (a price, sales count, or install count on
    something paid), or `"mandate"` (a rule, deadline, standard, or job posting
    that forces work). `pain` above 3 now requires at least one complaint item,
    which stops a market-size number from standing in for suffering.
  - `runNotes.floorFailure` (optional, and only when `ideas` is empty): the
    floor condition that stopped every candidate. The validator refuses an
    empty `ideas` array without it, because every run is supposed to produce at
    least one idea and a zero-idea day is a defect report.
  - `category` gained five non-education values: `Accessibility & Compliance`,
    `Research & Lab Tools`, `Small Business Ops`, `Civic & Public Sector`, and
    `Creative & Prosumer`. At most 2 ideas in a day may share a category, and
    at least one must still be `EdTech:` something. Since 2026-11-02 that floor
    is a small-business buyer instead (see `smallBusiness`).
  - `public` (object, required from 2026-11-03): the customer-facing copy the
    public site shows: `summary`, `problem`, `forWhom`, `benefits` (3 to 5),
    optional `audience` (small-business, teams, education). Ideas written
    before then get theirs from `ideas/public.json`, keyed by idea id. Every
    other field is the owner's notes, served only at /notes/ behind a password.
  - `smallBusiness` (optional boolean, added 2026-11-02): `true` when the buyer
    is a small business but the `category` is not `Small Business Ops`. A day
    needs at least one idea that is `Small Business Ops` or `smallBusiness:
    true`, or a `runNotes.caveats` line saying why none qualified.

  - `topic` (required): exactly one topic from the closed list in
    `ideas/topics-taxonomy.json`, chosen by what the product is about rather
    than who buys it or what it is built with. It drives topic browsing on the
    site. `scripts/validate_ideas.py` rejects anything off the list.

### Topic files added 2026-11-01

Topic browsing needed one topic per idea, and `category` could not supply it:
566 of the 601 archived ideas carry one of four legacy *format* labels (Side
Project, Teaching Tool, Classroom Assignment, Research), and the topical v3
categories covered only 29. A keyword tagger was tried first and averaged 3.4
matches per idea, too loose to browse by.

| File | Written by | Purpose |
|---|---|---|
| `ideas/topics-taxonomy.json` | by hand | The closed list of 13 topics, in display order. `build.js`, `scripts/tag_topics.py` and `scripts/validate_ideas.py` all read it, so the list cannot drift between them. Renaming or adding a topic means re-running the tagger with `--retag`, because existing assignments were made against the old list. |
| `ideas/topics.json` | `scripts/tag_topics.py` | `{"<idea id>": "<topic>"}` for the archive, where the id is `YYYY-MM-DD-N`. Generated with the local `claude` CLI in batches of 40. |

The archive's topics live in `topics.json` rather than being written back into
the daily files, because those files are an append-only record and a taxonomy
that turns out wrong should be regenerable without rewriting them. New ideas
carry their own `topic` field, and that always wins over `topics.json`.

### Operational files added 2026-11-01

These are not idea data, but the routine reads and writes them every run.

| File | Written by | Purpose |
|---|---|---|
| `ideas/sources.json` | by hand | The source catalog. Each entry has an `id` (A1 to A14, B1 to B10, C1 to C11), the evidence `kind` it yields, a `status` (`ok`, `ok-curl`, `partial`, `blocked`, `unknown`), and `paths`: concrete URL templates with the client that was verified to work. Blocked IDs stay in the catalog so historical `focusSources` entries remain readable. |
| `ideas/run-log.jsonl` | `scripts/log_run.py` | Append-only, one record per run: sources used with their search and fetch counts, every fetch with its outcome, the candidate funnel, where candidates died at the gate, and `floorFailure` if the run shipped nothing. |
| `ideas/source-health.json` and `.md` | `scripts/source_health.py` | Derived from the run log. The avoid list, the reachable sources with their last working access path, the per-host outcome history, and the gate condition killing the most candidates. The routine reads this at Step 0. |

The point of the run log is that a failed search costs something only once. An
earlier run recorded Reddit as unreachable in prose, inside one day's caveats,
and a later run the same day spent a quarter of its budget rediscovering it.

Validate a v3 file with `python3 scripts/validate_ideas.py ideas/YYYY-MM-DD.json`.

The website renders these ideas with a commercial detail layout: score
breakdown (with rationales and review verdict for v3), problem, customer and
buyer, demand evidence, competitors, MVP scope, business model, validation
test, compliance, risks, and review findings. Cards show the score out of 30,
and a provisional idea also carries a "Provisional" chip on its card and a
gap panel in its detail view.
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
