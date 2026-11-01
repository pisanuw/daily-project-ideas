#!/usr/bin/env python3
"""Assign exactly one topic to every idea, for topic browsing on the site.

Usage:
  python3 scripts/tag_topics.py --sample 20     # tag a sample, print, write nothing
  python3 scripts/tag_topics.py                 # tag everything still untagged
  python3 scripts/tag_topics.py --retag         # tag everything from scratch

Writes ideas/topics.json: {"<idea id>": "<topic>"}, where the id is
"YYYY-MM-DD-N", matching the id build.js gives each idea.

The topic lives here rather than in the daily idea files for two reasons: the
daily files are an append-only record that should not be rewritten to add a
field, and a taxonomy that turns out wrong should be regenerable without
touching them. ROUTINE.md has new ideas carry a `topic` field going forward,
and this script leaves those alone.

Uses the local `claude` CLI, which is covered by the subscription. It does not
use an API key.
"""

import argparse
import json
import os
import re
import subprocess
import sys

TOPICS_FILE = "ideas/topics.json"
DATA_JS = "dist/data.js"
BATCH = 40
CLI_TIMEOUT = 300

TAXONOMY_FILE = "ideas/topics-taxonomy.json"

# One topic per idea, chosen to split this corpus of 601 ideas into browsable
# piles. Derived from a keyword survey of the actual titles and summaries, then
# pruned: a plain keyword tagger averaged 3.4 matches per idea, so these are
# meant as "the single best fit", not as labels that happen to apply. The list
# is shared with build.js and scripts/validate_ideas.py through one file.
TOPICS = json.load(open(TAXONOMY_FILE, encoding="utf-8"))["topics"]

PROMPT = """You are labelling an archive of software project ideas so a website can offer topic browsing.

Assign each idea EXACTLY ONE topic, the single best fit, from this closed list:
{topics}

Rules:
- Choose by what the thing being built is ABOUT, not by who it is for and not by the technology it happens to use.
- Nearly every idea here involves AI somewhere, because of when they were written. Use "AI Literacy & Ethics" only when the SUBJECT is AI itself: teaching how models behave, prompting, bias, agent oversight, AI policy. A grading tool that calls an LLM is "Assessment & Grading".
- Likewise ignore the stack: a React app about sorting is "Algorithms & Data Structures", not "Developer Tooling". Use "Developer Tooling" for ideas about the practice of programming itself: version control, debugging, testing, code review, IDEs, deployment.
- "Teaching Operations" is for the administrative work around a course: scheduling, rosters, syllabi, advising, accreditation, office hours.
- "Data & Visualization" is for ideas whose point is exploring or presenting a dataset, when no other topic fits better.
- There is no "other". Pick the closest topic even when the fit is loose.

Return ONLY a JSON object mapping each id to its topic, no prose, no code fence:
{{"2026-05-12-1": "Games & Puzzles", "2026-05-12-2": "Assessment & Grading"}}

Ideas:
{ideas}"""


def load_ideas():
    """Read the ideas out of the built data.js payload."""
    if not os.path.exists(DATA_JS):
        sys.exit(f"{DATA_JS} not found: run `node build.js` first")
    raw = open(DATA_JS, encoding="utf-8").read()
    payload = json.loads(raw[raw.index("{"):raw.rindex("}") + 1])
    return [i for i in payload["ideas"] if not i.get("placeholder")]


def call_claude(prompt):
    proc = subprocess.run(["claude", "-p", prompt], capture_output=True,
                          text=True, timeout=CLI_TIMEOUT)
    if proc.returncode != 0:
        raise RuntimeError(f"claude exited {proc.returncode}: {proc.stderr[:400]}")
    out = proc.stdout.strip()
    # Tolerate a code fence even though the prompt forbids one.
    fence = re.search(r"```(?:json)?\s*(.+?)\s*```", out, re.S)
    if fence:
        out = fence.group(1)
    start, end = out.find("{"), out.rfind("}")
    if start < 0 or end < 0:
        raise ValueError(f"no JSON object in reply: {out[:300]}")
    return json.loads(out[start:end + 1])


def tag_batch(batch, n, total):
    lines = []
    for idea in batch:
        text = f"{idea['title']}. {idea.get('summary') or idea.get('description', '')}"
        lines.append(f"{idea['id']}: {text[:400]}")
    prompt = PROMPT.format(topics="\n".join(f"- {t}" for t in TOPICS),
                           ideas="\n".join(lines))
    print(f"  batch {n}/{total}: {len(batch)} ideas ...", end="", flush=True)
    result = call_claude(prompt)

    clean, bad = {}, []
    wanted = {i["id"] for i in batch}
    for key, topic in result.items():
        if key not in wanted:
            continue
        if topic in TOPICS:
            clean[key] = topic
        else:
            bad.append((key, topic))
    missing = wanted - set(clean)
    print(f" {len(clean)} tagged", end="")
    if bad:
        print(f", {len(bad)} off-list ({bad[0][1]!r} ...)", end="")
    if missing:
        print(f", {len(missing)} missing", end="")
    print()
    return clean


def main(argv):
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", type=int, help="tag only N ideas and write nothing")
    ap.add_argument("--retag", action="store_true", help="ignore existing topics")
    args = ap.parse_args(argv)

    ideas = load_ideas()
    existing = {}
    if os.path.exists(TOPICS_FILE) and not args.retag:
        existing = json.load(open(TOPICS_FILE, encoding="utf-8"))

    # An idea that already carries its own topic field (written by the routine)
    # is authoritative; never overwrite it.
    own = {i["id"]: i["topic"] for i in ideas if i.get("topic") in TOPICS}

    todo = [i for i in ideas if i["id"] not in existing and i["id"] not in own]
    if args.sample:
        todo = todo[:args.sample]
    if not todo:
        print(f"nothing to do: {len(existing)} tagged in {TOPICS_FILE}, "
              f"{len(own)} carry their own topic")
        return 0

    print(f"tagging {len(todo)} of {len(ideas)} ideas "
          f"({len(existing)} already in {TOPICS_FILE}, {len(own)} self-tagged)")
    batches = [todo[i:i + BATCH] for i in range(0, len(todo), BATCH)]
    tagged = {}
    for n, batch in enumerate(batches, 1):
        try:
            tagged.update(tag_batch(batch, n, len(batches)))
        except Exception as exc:                      # keep going; report at the end
            print(f" FAILED: {exc}")

    if args.sample:
        print("\nsample result:")
        by_id = {i["id"]: i for i in ideas}
        for key, topic in sorted(tagged.items()):
            print(f"  {topic:30} {by_id[key]['title'][:52]}")
        print("\n(sample run: nothing written)")
        return 0

    merged = dict(existing)
    merged.update(tagged)
    with open(TOPICS_FILE, "w", encoding="utf-8") as fh:
        json.dump(dict(sorted(merged.items())), fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    covered = len(merged) + len(own)
    print(f"\nwrote {TOPICS_FILE}: {len(merged)} entries "
          f"({covered}/{len(ideas)} ideas have a topic)")
    if covered < len(ideas):
        print(f"  {len(ideas) - covered} still untagged: run again to retry them")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
