#!/usr/bin/env python3
"""Validate a schemaVersion 3 daily ideas file before it is committed.

Usage: python3 scripts/validate_ideas.py ideas/YYYY-MM-DD.json

Prints OK and exits 0 when the file passes, otherwise prints one problem per
line and exits 1. Checks structure, the quality gate for validated ideas, the
floor for provisional ones, and the evidence rules from ROUTINE.md. On files
dated 2026-11-10 or later it also checks the shape rubric (`shape`,
`substantial`), `platformNeeds` and the weekly build's `buildPlan`. It cannot
check that URLs appeared in the run's search results; the routine does that by
hand.

Entries with complexity "Research" are skipped: they follow the research
format in ideas/SCHEMA.md, not the product-idea schema.
"""

import datetime
import json
import pathlib
import sys
from urllib.parse import urlsplit

SCORES = ["pain", "willingnessToPay", "reachability",
          "competitiveGap", "feasibility", "complianceBurden"]
REQUIRED = ["n", "title", "slug", "category", "complexity", "confidence", "topic",
            "summary", "problemStatement", "description", "targetCustomer",
            "buyer", "whyNow", "founderFit", "problemEvidence", "competitors",
            "keyFeatures", "mvpScope", "techStack", "pricing",
            "revenueSketch", "distribution", "validationTest", "moat",
            "compliance", "risks", "scores", "scoreRationale", "review",
            "inspiredBy"]
CATEGORIES = {"Micro-SaaS", "EdTech: Higher Ed", "EdTech: K-12",
              "EdTech: Learners", "Developer Tool",
              "Accessibility & Compliance", "Research & Lab Tools",
              "Small Business Ops", "Civic & Public Sector",
              "Creative & Prosumer"}
COMPLEXITY = {"Weekend MVP", "Multi-week", "Multi-month"}
CONFIDENCE = {"validated", "provisional"}
# One topic per idea, for topic browsing. Read from the shared taxonomy so this
# list cannot drift from build.js and scripts/tag_topics.py.
TAXONOMY_FILE = pathlib.Path(__file__).resolve().parent.parent / "ideas" / "topics-taxonomy.json"
TOPICS = set(json.loads(TAXONOMY_FILE.read_text(encoding="utf-8"))["topics"])
EVIDENCE_KINDS = {"complaint", "spend", "mandate"}
MAX_IDEAS = 10  # per day, first run plus extra runs (2026-11-04)
MIN_IDEAS = 3  # since 2026-11-04
MAX_PROVISIONAL = 10  # per day; ROUTINE.md caps each run (4 first, 3 extra)
MAX_PER_CATEGORY = 2
MIN_TOTAL = 22
RECENT_DAYS = 90
FLOOR_DAYS = 180



def is_small_business(idea):
    """The day's floor since 2026-11-02 (owner: small businesses first)."""
    return idea.get("category") == "Small Business Ops" or idea.get("smallBusiness") is True

def parse_date(value):
    try:
        return datetime.date.fromisoformat(str(value))
    except ValueError:
        return None


def page_key(url):
    """A URL without query string or fragment, so two comments on one thread
    count as one page."""
    parts = urlsplit(str(url).strip())
    return f"{parts.netloc.lower()}{parts.path.rstrip('/')}"


def check_evidence(idea, tag, today, errs):
    """Returns (distinct_pages, has_complaint, newest_age_in_days)."""
    evidence = idea.get("problemEvidence") or []
    for e in evidence:
        for field in ("url", "source", "author", "date", "summary", "kind"):
            if not e.get(field):
                errs.append(f"{tag}: an evidence item is missing {field}")
        if e.get("kind") and e["kind"] not in EVIDENCE_KINDS:
            errs.append(f"{tag}: evidence kind {e['kind']!r} is not one of "
                        f"{sorted(EVIDENCE_KINDS)}")

    pages = {page_key(e.get("url", "")) for e in evidence if e.get("url")}
    authors = [e.get("author") for e in evidence]
    known = [a for a in authors if a and a != "unknown"]
    if len(evidence) >= 2 and len(known) == len(evidence) and len(set(known)) == 1:
        errs.append(f"{tag}: all evidence is from one author")

    has_complaint = any(e.get("kind") == "complaint" for e in evidence)
    ages = [(today - d).days for d in
            (parse_date(e.get("date")) for e in evidence) if d is not None]
    youngest = min((a for a in ages if a >= 0), default=None)
    return len(pages), has_complaint, youngest


# The customer-facing copy the public site shows (see ROUTINE.md Step 7).
# Required for ideas written from this date on; older ideas get theirs from
# ideas/public.json.
PUBLIC_FROM = datetime.date(2026, 11, 3)
PUBLIC_AUDIENCES = {"small-business", "teams", "education"}


def check_public(idea, tag, today, errs):
    pub = idea.get("public")
    if pub is None:
        if today >= PUBLIC_FROM:
            errs.append(f"{tag}: missing public (the customer-facing summary, problem, "
                        "forWhom and benefits)")
        return
    if not isinstance(pub, dict):
        errs.append(f"{tag}: public must be an object")
        return
    for field in ("summary", "problem", "forWhom"):
        if not isinstance(pub.get(field), str) or not pub.get(field).strip():
            errs.append(f"{tag}: public.{field} is missing or empty")
    benefits = pub.get("benefits")
    if not isinstance(benefits, list) or not 3 <= len(benefits) <= 5 \
            or not all(isinstance(b, str) and b.strip() for b in benefits):
        errs.append(f"{tag}: public.benefits must be 3 to 5 non-empty strings")
    if "audience" in pub and pub["audience"] not in PUBLIC_AUDIENCES:
        errs.append(f"{tag}: public.audience must be one of {sorted(PUBLIC_AUDIENCES)}")


# The shape rubric (ROUTINE.md Step 4) and the weekly build's plan (Step 7).
# Required for ideas written from this date on; the build routine in
# claude-built-apps judges older ideas against the same rubric by hand.
SHAPE_FROM = datetime.date(2026, 11, 10)
SHAPE_MARKS = ["stateful", "connected", "unattended", "engine", "shared"]
SUBSTANTIAL_MARKS = 2  # two or more true marks make an idea substantial
PLATFORM_NEEDS = {"accounts", "database", "llm", "email", "scheduled", "backend"}
BUILD_PLAN_COMPLEXITY = {"Multi-week", "Multi-month"}
MIN_MILESTONES = 5
MAX_MILESTONES = 7


def is_buildable(idea):
    """What the weekly build picks from (owner, 2026-11-09): a substantial
    Multi-week idea that carries a build plan."""
    return (idea.get("substantial") is True
            and idea.get("complexity") == "Multi-week"
            and bool(idea.get("buildPlan")))


def check_shape(idea, tag, today, errs):
    if today < SHAPE_FROM:
        return
    shape = idea.get("shape")
    marks = 0
    if not isinstance(shape, dict):
        errs.append(f"{tag}: missing shape (the five rubric marks "
                    f"{SHAPE_MARKS} as booleans, plus notes)")
    else:
        if set(shape) != set(SHAPE_MARKS) | {"notes"}:
            errs.append(f"{tag}: shape must have exactly the keys {SHAPE_MARKS} "
                        "and notes")
        for mark in SHAPE_MARKS:
            if not isinstance(shape.get(mark), bool):
                errs.append(f"{tag}: shape.{mark} must be true or false")
        notes = shape.get("notes")
        if not isinstance(notes, dict):
            errs.append(f"{tag}: shape.notes must be an object with one line per "
                        "true mark")
            notes = {}
        extra = sorted(set(notes) - set(SHAPE_MARKS))
        if extra:
            errs.append(f"{tag}: shape.notes has keys that are not marks: {extra}")
        for mark in SHAPE_MARKS:
            if shape.get(mark) is True:
                marks += 1
                note = notes.get(mark)
                if not isinstance(note, str) or not note.strip():
                    errs.append(f"{tag}: shape.{mark} is true but shape.notes.{mark} "
                                "does not say what in the idea earns it")

    substantial = idea.get("substantial")
    if not isinstance(substantial, bool):
        errs.append(f"{tag}: missing substantial (true when {SUBSTANTIAL_MARKS} or "
                    "more shape marks are true)")
    elif isinstance(shape, dict) and substantial != (marks >= SUBSTANTIAL_MARKS):
        errs.append(f"{tag}: substantial is {str(substantial).lower()} but {marks} "
                    f"shape marks are true; {SUBSTANTIAL_MARKS} or more make it "
                    "substantial")

    needs = idea.get("platformNeeds")
    if not isinstance(needs, list):
        errs.append(f"{tag}: missing platformNeeds (a list drawn from "
                    f"{sorted(PLATFORM_NEEDS)}, possibly empty)")
    else:
        bad = [n for n in needs if n not in PLATFORM_NEEDS]
        if bad:
            errs.append(f"{tag}: platformNeeds {bad} are not in {sorted(PLATFORM_NEEDS)}")
        if len(needs) != len(set(map(str, needs))):
            errs.append(f"{tag}: platformNeeds has duplicates")

    plan = idea.get("buildPlan")
    if plan is None:
        if substantial is True and idea.get("complexity") in BUILD_PLAN_COMPLEXITY:
            errs.append(f"{tag}: substantial and {idea.get('complexity')} but no "
                        f"buildPlan ({MIN_MILESTONES} to {MAX_MILESTONES} milestones)")
        return
    if not isinstance(plan, list) or not MIN_MILESTONES <= len(plan) <= MAX_MILESTONES:
        errs.append(f"{tag}: buildPlan must be a list of {MIN_MILESTONES} to "
                    f"{MAX_MILESTONES} milestones")
        return
    for k, milestone in enumerate(plan, 1):
        if not isinstance(milestone, dict):
            errs.append(f"{tag}: buildPlan milestone {k} must be an object")
            continue
        if milestone.get("n") != k:
            errs.append(f"{tag}: buildPlan milestone {k} has n {milestone.get('n')}, "
                        f"expected {k}")
        for field in ("title", "delivers", "acceptance"):
            value = milestone.get(field)
            if not isinstance(value, str) or not value.strip():
                errs.append(f"{tag}: buildPlan milestone {k} is missing {field}")


def check_idea(idea, expected_n, today, errs):
    tag = f"idea {expected_n}"
    check_public(idea, tag, today, errs)
    check_shape(idea, tag, today, errs)

    for field in REQUIRED:
        if idea.get(field) in (None, "", [], {}):
            errs.append(f"{tag}: missing or empty {field}")
    if idea.get("n") != expected_n:
        errs.append(f"{tag}: n is {idea.get('n')}, expected {expected_n}")
    if idea.get("category") not in CATEGORIES:
        errs.append(f"{tag}: category {idea.get('category')!r} is not allowed")
    if idea.get("complexity") not in COMPLEXITY:
        errs.append(f"{tag}: complexity {idea.get('complexity')!r} is not allowed")
    if idea.get("topic") not in TOPICS:
        errs.append(f"{tag}: topic {idea.get('topic')!r} is not one of the "
                    f"{len(TOPICS)} allowed topics")

    confidence = idea.get("confidence")
    if confidence not in CONFIDENCE:
        errs.append(f"{tag}: confidence must be validated or provisional")

    scores = idea.get("scores") or {}
    values = [scores.get(k) for k in SCORES]
    total = None
    if not all(isinstance(v, int) and 1 <= v <= 5 for v in values):
        errs.append(f"{tag}: every score must be an integer from 1 to 5")
    else:
        total = sum(values)
        if scores.get("total") != total:
            errs.append(f"{tag}: total {scores.get('total')} is not the sum {total}")

    rationale = idea.get("scoreRationale") or {}
    for k in SCORES:
        if "http" not in str(rationale.get(k, "")):
            errs.append(f"{tag}: scoreRationale.{k} must cite a URL")

    if (idea.get("review") or {}).get("verdict") not in {"pass", "rescored"}:
        errs.append(f"{tag}: review.verdict must be pass or rescored")
    if not (idea.get("review") or {}).get("findings"):
        errs.append(f"{tag}: review.findings is empty")

    pages, has_complaint, youngest = check_evidence(idea, tag, today, errs)

    if isinstance(scores.get("pain"), int) and scores["pain"] >= 4 and not has_complaint:
        errs.append(f"{tag}: pain is {scores['pain']} but no evidence item has "
                    "kind complaint; pain above 3 needs someone describing the pain")

    if confidence == "validated":
        if total is not None and total < MIN_TOTAL:
            errs.append(f"{tag}: validated but total {total} is below the gate of {MIN_TOTAL}")
        if isinstance(scores.get("pain"), int) and scores["pain"] < 4:
            errs.append(f"{tag}: validated but pain {scores['pain']} is below the gate of 4")
        if isinstance(scores.get("willingnessToPay"), int) and scores["willingnessToPay"] < 3:
            errs.append(f"{tag}: validated but willingnessToPay "
                        f"{scores['willingnessToPay']} is below the gate of 3")
        if pages < 2:
            errs.append(f"{tag}: validated needs evidence from at least 2 different pages")
        if not has_complaint:
            errs.append(f"{tag}: validated needs at least one complaint evidence item")
        if youngest is None or youngest > RECENT_DAYS:
            errs.append(f"{tag}: validated needs evidence dated within {RECENT_DAYS} days")
        if idea.get("gateGap") is not None:
            errs.append(f"{tag}: gateGap must be absent on a validated idea")

    elif confidence == "provisional":
        gap = idea.get("gateGap") or {}
        if not gap.get("missing"):
            errs.append(f"{tag}: provisional needs gateGap.missing listing every "
                        "gate condition it misses")
        if not gap.get("closedBy"):
            errs.append(f"{tag}: provisional needs gateGap.closedBy naming what "
                        "would promote it to validated")
        if youngest is None or youngest > FLOOR_DAYS:
            errs.append(f"{tag}: provisional needs at least one evidence item "
                        f"dated within {FLOOR_DAYS} days")
        if pages < 1:
            errs.append(f"{tag}: provisional needs at least one evidence page")


def main(path):
    errs = []
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)

    if data.get("schemaVersion") != 3:
        errs.append("schemaVersion must be 3")
    if data.get("complete") is not True:
        errs.append("complete must be true")

    today = parse_date(data.get("date"))
    if today is None:
        errs.append("date is missing or not YYYY-MM-DD")
        today = datetime.date.today()

    run_notes = data.get("runNotes") or {}
    ideas = [i for i in data.get("ideas", [])
             if str(i.get("complexity", "")).lower() != "research"]

    if not ideas:
        if not run_notes.get("floorFailure"):
            errs.append("no ideas: every run must produce at least one. If no "
                        "candidate met the floor, runNotes.floorFailure must name "
                        "the floor condition that stopped every one of them, and "
                        "the run log must record it too")
    if ideas and len(ideas) < MIN_IDEAS and not run_notes.get("caveats"):
        errs.append(f"{len(ideas)} ideas: a first run ships at least {MIN_IDEAS}; if "
                    "fewer met the floor, runNotes.caveats must say why")
    if len(ideas) > MAX_IDEAS:
        errs.append(f"{len(ideas)} ideas, maximum is {MAX_IDEAS}")

    for i, idea in enumerate(ideas, 1):
        check_idea(idea, i, today, errs)

    confidences = [i.get("confidence") for i in ideas]
    provisional = confidences.count("provisional")
    validated = confidences.count("validated")
    if provisional > MAX_PROVISIONAL:
        errs.append(f"{provisional} provisional ideas, maximum is {MAX_PROVISIONAL}")

    slugs = [i.get("slug") for i in ideas]
    if len(slugs) != len(set(slugs)):
        errs.append("two ideas share a slug")

    counts = {}
    for i in ideas:
        counts[i.get("category")] = counts.get(i.get("category"), 0) + 1
    for category, n in counts.items():
        if n > MAX_PER_CATEGORY:
            errs.append(f"{n} ideas share the category {category!r}, maximum is "
                        f"{MAX_PER_CATEGORY}")
    for i in ideas:
        if "smallBusiness" in i and not isinstance(i["smallBusiness"], bool):
            errs.append(f"idea {i.get('n', '?')}: smallBusiness must be true or false")
    if ideas and not any(is_small_business(i) for i in ideas):
        if not run_notes.get("caveats"):
            errs.append("no idea has a small-business buyer and runNotes.caveats does "
                        "not explain why none qualified")
    if ideas and today >= SHAPE_FROM and not any(is_buildable(i) for i in ideas):
        if not run_notes.get("caveats"):
            errs.append("no idea is substantial, Multi-week and carries a buildPlan, so "
                        "the weekly build has nothing to pick, and runNotes.caveats "
                        "does not explain why none qualified")

    for w in run_notes.get("watchlist", []):
        name = w.get("title", "?")
        if parse_date(w.get("firstSeen")) is None:
            errs.append(f"watchlist {name!r}: firstSeen is missing or not YYYY-MM-DD")
        if not w.get("evidence"):
            errs.append(f"watchlist {name!r}: no evidence URLs")
    if len(run_notes.get("watchlist", [])) > 8:
        errs.append("watchlist has more than 8 entries")

    print("\n".join(errs) if errs else "OK")
    return 1 if errs else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python3 scripts/validate_ideas.py ideas/YYYY-MM-DD.json")
    sys.exit(main(sys.argv[1]))
