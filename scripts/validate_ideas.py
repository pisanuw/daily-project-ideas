#!/usr/bin/env python3
"""Validate a schemaVersion 3 daily ideas file before it is committed.

Usage: python3 scripts/validate_ideas.py ideas/YYYY-MM-DD.json

Prints OK and exits 0 when the file passes, otherwise prints one problem per
line and exits 1. Checks structure, the quality gate, and evidence rules from
ROUTINE.md. It cannot check that URLs appeared in the run's search results;
the routine does that by hand.

Entries with complexity "Research" are skipped: they follow the research
format in ideas/SCHEMA.md, not the product-idea schema.
"""

import datetime
import json
import sys
from urllib.parse import urlsplit

SCORES = ["pain", "willingnessToPay", "reachability",
          "competitiveGap", "feasibility", "complianceBurden"]
REQUIRED = ["n", "title", "slug", "category", "complexity", "summary",
            "problemStatement", "description", "targetCustomer", "buyer",
            "whyNow", "founderFit", "problemEvidence", "competitors",
            "keyFeatures", "mvpScope", "techStack", "pricing",
            "revenueSketch", "distribution", "validationTest", "moat",
            "compliance", "risks", "scores", "scoreRationale", "review",
            "inspiredBy"]
CATEGORIES = {"Micro-SaaS", "EdTech: Higher Ed", "EdTech: K-12",
              "EdTech: Learners", "Developer Tool"}
COMPLEXITY = {"Weekend MVP", "Multi-week", "Multi-month"}
MAX_IDEAS = 6
MIN_TOTAL = 22
RECENT_DAYS = 90


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


def check_idea(idea, expected_n, today, errs):
    tag = f"idea {expected_n}"

    for field in REQUIRED:
        if idea.get(field) in (None, "", [], {}):
            errs.append(f"{tag}: missing or empty {field}")
    if idea.get("n") != expected_n:
        errs.append(f"{tag}: n is {idea.get('n')}, expected {expected_n}")
    if idea.get("category") not in CATEGORIES:
        errs.append(f"{tag}: category {idea.get('category')!r} is not allowed")
    if idea.get("complexity") not in COMPLEXITY:
        errs.append(f"{tag}: complexity {idea.get('complexity')!r} is not allowed")

    scores = idea.get("scores") or {}
    values = [scores.get(k) for k in SCORES]
    if not all(isinstance(v, int) and 1 <= v <= 5 for v in values):
        errs.append(f"{tag}: every score must be an integer from 1 to 5")
    else:
        if scores.get("total") != sum(values):
            errs.append(f"{tag}: total {scores.get('total')} is not the sum {sum(values)}")
        if sum(values) < MIN_TOTAL:
            errs.append(f"{tag}: total {sum(values)} is below the gate of {MIN_TOTAL}")
        if scores["pain"] < 4:
            errs.append(f"{tag}: pain {scores['pain']} is below the gate of 4")
        if scores["willingnessToPay"] < 3:
            errs.append(f"{tag}: willingnessToPay {scores['willingnessToPay']} is below the gate of 3")

    rationale = idea.get("scoreRationale") or {}
    for k in SCORES:
        if "http" not in str(rationale.get(k, "")):
            errs.append(f"{tag}: scoreRationale.{k} must cite a URL")

    if (idea.get("review") or {}).get("verdict") not in {"pass", "rescored"}:
        errs.append(f"{tag}: review.verdict must be pass or rescored")
    if not (idea.get("review") or {}).get("findings"):
        errs.append(f"{tag}: review.findings is empty")

    evidence = idea.get("problemEvidence") or []
    pages = {page_key(e.get("url", "")) for e in evidence if e.get("url")}
    if len(pages) < 2:
        errs.append(f"{tag}: needs evidence from at least 2 different pages")
    authors = [e.get("author") for e in evidence]
    known = [a for a in authors if a and a != "unknown"]
    if len(evidence) >= 2 and len(known) == len(evidence) and len(set(known)) == 1:
        errs.append(f"{tag}: all evidence is from one author")
    for e in evidence:
        for field in ("url", "source", "author", "date", "summary"):
            if not e.get(field):
                errs.append(f"{tag}: an evidence item is missing {field}")
    dated = [parse_date(e.get("date")) for e in evidence]
    if not any(d and 0 <= (today - d).days <= RECENT_DAYS for d in dated):
        errs.append(f"{tag}: no evidence dated within {RECENT_DAYS} days")


def main(path):
    errs = []
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)

    if "\u2014" in json.dumps(data, ensure_ascii=False):
        errs.append("file contains an em dash")
    if data.get("schemaVersion") != 3:
        errs.append("schemaVersion must be 3")
    if data.get("complete") is not True:
        errs.append("complete must be true")

    today = parse_date(data.get("date"))
    if today is None:
        errs.append("date is missing or not YYYY-MM-DD")
        today = datetime.date.today()

    ideas = [i for i in data.get("ideas", [])
             if str(i.get("complexity", "")).lower() != "research"]
    if len(ideas) > MAX_IDEAS:
        errs.append(f"{len(ideas)} ideas, maximum is {MAX_IDEAS}")
    run_notes = data.get("runNotes") or {}
    if len(ideas) < 3 and not run_notes.get("caveats"):
        errs.append("fewer than 3 ideas but runNotes.caveats does not explain why")

    for i, idea in enumerate(ideas, 1):
        check_idea(idea, i, today, errs)

    slugs = [i.get("slug") for i in ideas]
    if len(slugs) != len(set(slugs)):
        errs.append("two ideas share a slug")

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
