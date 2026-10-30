#!/usr/bin/env python3
"""Regenerate ideas/index.jsonl from every ideas/YYYY-MM-DD.{json,md} file.

Usage: python3 scripts/build_index.py

One line per idea: date, n, slug, title, category, complexity,
targetCustomer, problemStatement. The daily routine reads this file to
deduplicate new ideas against all past ones, instead of opening every daily
file. Older ideas lack targetCustomer and problemStatement; for those,
problemStatement falls back to the summary or the start of the description.

Same precedence as build.js: a date's .json file wins over its .md file.
The output is derived, so it is safe to regenerate at any time.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IDEAS_DIR = ROOT / "ideas"
OUT = IDEAS_DIR / "index.jsonl"
DATE_FILE = re.compile(r"^(\d{4}-\d{2}-\d{2})\.(json|md)$")


def clean(text, limit=None):
    text = re.sub(r"\s+", " ", str(text or "")).strip()
    text = text.replace(" \u2014 ", ", ").replace("\u2014", ", ")
    if limit and len(text) > limit:
        text = text[: limit - 3].rsplit(" ", 1)[0] + "..."
    return text


def first_sentences(text, count=2):
    sentences = re.findall(r"[^.!?]+[.!?]+(?:\s|$)", str(text or ""))
    return " ".join(sentences[:count]) if sentences else str(text or "")


def slugify(title):
    return re.sub(r"[^a-z0-9]+", "-", str(title).lower()).strip("-")


def from_json(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    ideas = data if isinstance(data, list) else data.get("ideas", [])
    return [dict(i, n=i.get("n") or k) for k, i in enumerate(ideas, 1)]


def from_markdown(path):
    ideas, current = [], None
    for line in path.read_text(encoding="utf-8").splitlines():
        heading = re.match(r"^##\s+(?:(\d+)\.\s+)?(.+)$", line)
        if heading:
            current = {"n": int(heading.group(1) or len(ideas) + 1),
                       "title": heading.group(2).strip(), "description": "",
                       "_section": None}
            ideas.append(current)
            continue
        if current is None:
            continue
        field = re.match(r"^\*\*(Category|Complexity):\*\*\s*(.+)$", line.strip(), re.I)
        if field:
            current[field.group(1).lower()] = field.group(2).strip()
        elif line.startswith("### "):
            current["_section"] = line[4:].strip().lower()
        elif (current["_section"] or "").startswith("description"):
            current["description"] += " " + line.strip()
    return ideas


def entry(date, idea):
    problem = (idea.get("problemStatement") or idea.get("summary")
               or first_sentences(idea.get("description")))
    return {
        "date": date,
        "n": idea.get("n"),
        "slug": idea.get("slug") or slugify(idea.get("title", "")),
        "title": clean(idea.get("title")),
        "category": clean(idea.get("category")),
        "complexity": clean(idea.get("complexity")),
        "targetCustomer": clean(idea.get("targetCustomer")),
        "problemStatement": clean(problem, 300),
    }


def main():
    dates = {}
    for path in IDEAS_DIR.iterdir():
        m = DATE_FILE.match(path.name)
        if m:
            dates.setdefault(m.group(1), {})[m.group(2)] = path

    lines = []
    for date in sorted(dates):
        files = dates[date]
        try:
            ideas = from_json(files["json"]) if "json" in files else from_markdown(files["md"])
        except (json.JSONDecodeError, OSError) as err:
            print(f"! skipped {date}: {err}")
            continue
        lines += [entry(date, i) for i in ideas]

    OUT.write_text("".join(json.dumps(l, ensure_ascii=False) + "\n" for l in lines),
                   encoding="utf-8")
    print(f"Wrote {len(lines)} ideas from {len(dates)} days to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
