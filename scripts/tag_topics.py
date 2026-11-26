#!/usr/bin/env python3
"""Assign exactly one topic to every idea, for topic browsing on the site.

Usage:
  python3 scripts/tag_topics.py --sample 20     # tag a sample, print, write nothing
  python3 scripts/tag_topics.py                 # tag every idea still without a topic
  python3 scripts/tag_topics.py --retag         # tag again every idea without its own topic
  python3 scripts/tag_topics.py --retag --sample 1000   # preview a retag, write nothing

Writes ideas/topics.json: {"<idea id>": "<topic>"}, where the id is
"YYYY-MM-DD-N", matching the id build.js gives each idea.

ideas/topics.json holds a topic for every idea up to 2026-11-25: the archive,
which predates the `topic` field, and the November ideas, where it overrides
the topic the Finder wrote. build.js shows the topics.json entry when there is
one, and otherwise the idea's own `topic` field. The topic lives here rather
than in the daily idea files because those files are an append-only record
that should not be rewritten, and a taxonomy that turns out wrong should be
fixable without touching them.

This script never tags an idea whose daily file carries a topic on the list:
the Finder's pick stands unless someone writes an override into topics.json
by hand. Under --retag, an idea that is not tagged again (its own topic, a
failed batch, an answer off the list) keeps its previous entry, unless that
topic has left the list.

When the list grows, do not run a full --retag: on 26 Nov 2026 it moved 91 of
the 601 archived ideas between old topics, because the tagger answers
differently on a second run. Instead tag only the ideas without a topic (a
plain run), preview the rest with --retag --sample 1000, and copy into
topics.json only the ideas the preview moves into a new topic.

Uses the local `claude` CLI, which is covered by the subscription. It does not
use an API key.
"""

import argparse
import glob
import json
import os
import re
import subprocess
import sys

IDEAS_DIR = "ideas"
TOPICS_FILE = "ideas/topics.json"
DATA_JS = "dist/data.js"
BATCH = 40
CLI_TIMEOUT = 300

TAXONOMY_FILE = "ideas/topics-taxonomy.json"

# One topic per idea, chosen on 2026-11-01 to split the 601 ideas then archived
# into browsable piles (Small Business Operations and Nonprofit Operations were
# added on 2026-11-26). Derived from a keyword survey of the actual titles and summaries, then
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
- "Small Business Operations" is for the back office and customer-facing work of a small business: compliance and HR records, tax, shop and order operations, bookings, invoicing. A café's booking tool is "Small Business Operations"; a grading tool sold to schools stays "Assessment & Grading".
- "Nonprofit Operations" is for the work of running a nonprofit: donations and receipts, events and waivers, volunteers, grants, membership. A charity's donor receipts are "Nonprofit Operations".
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


def own_topics():
    """The on-list `topic` each daily file gives its ideas, by id "<date>-<n>".

    Read from the daily files: dist/data.js cannot show them, because build.js
    lets TOPICS_FILE override them there.
    """
    own = {}
    for path in sorted(glob.glob(os.path.join(IDEAS_DIR, "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].json"))):
        date = os.path.basename(path)[:10]
        try:
            data = json.load(open(path, encoding="utf-8"))
        except ValueError:
            continue
        items = data if isinstance(data, list) else data.get("ideas", [])
        for n, idea in enumerate(items, 1):
            if isinstance(idea, dict) and idea.get("topic") in TOPICS:
                own[f"{date}-{idea.get('n') or n}"] = idea["topic"]
    return own


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
    ids = {i["id"] for i in ideas}
    previous = {}
    if os.path.exists(TOPICS_FILE):
        previous = json.load(open(TOPICS_FILE, encoding="utf-8"))
    existing = {} if args.retag else previous

    # The Finder's own topic stands: an idea whose daily file names one on the
    # list is never tagged. Read from the daily files, not from dist/data.js,
    # where build.js has already filled TOPICS_FILE in (reading it there made
    # --retag skip all 601 archived ideas and write a TOPICS_FILE without them).
    own = own_topics()
    todo = [i for i in ideas if i["id"] not in existing and i["id"] not in own]
    if args.sample:
        todo = todo[:args.sample]
    if not todo:
        print(f"nothing to do: {len(existing)} in {TOPICS_FILE}, "
              f"{len(own)} carry their own topic")
        return 0

    print(f"tagging {len(todo)} of {len(ideas)} ideas "
          f"({len(existing)} already in {TOPICS_FILE}, {len(own)} carry their own topic)")
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
            was = previous.get(key, "-")
            print(f"  {key:22} {topic:30} (was {was:30}) {by_id[key]['title'][:52]}")
        print("\n(sample run: nothing written)")
        return 0

    if args.retag:
        # An idea not tagged again keeps its previous entry, unless that topic
        # has left the list, so a failed batch cannot drop ideas from the file.
        merged = {k: v for k, v in previous.items() if k in ids and v in TOPICS}
    else:
        merged = dict(existing)
    merged.update(tagged)
    with open(TOPICS_FILE, "w", encoding="utf-8") as fh:
        json.dump(dict(sorted(merged.items())), fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    covered = len({k for k in ids if merged.get(k) in TOPICS or k in own})
    print(f"\nwrote {TOPICS_FILE}: {len(merged)} entries "
          f"({covered}/{len(ideas)} ideas have a topic)")
    if covered < len(ideas):
        print(f"  {len(ideas) - covered} still untagged: run again to retry them")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
