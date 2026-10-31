#!/usr/bin/env python3
"""Re-measure every source in ideas/sources.json from wherever this runs.

Usage:
  python3 scripts/probe_sources.py             # probe everything, print a report
  python3 scripts/probe_sources.py --write     # also update status/lastVerified
  python3 scripts/probe_sources.py --ids A5,A7 # probe only these sources

Run this after the routine's run environment changes: a different egress IP or
a widened allowlist changes what is reachable, and the statuses in the catalog
were measured in one specific environment.

It uses curl, so it measures the network, not the WebFetch allowlist. A source
that this script reaches but WebFetch refuses belongs at status ok-curl; the
routine's fetch ladder handles that case. Only the run log can tell you about
WebFetch, because only the routine calls it.

A fetch counts as usable only if the body contains the path's `expect` marker.
That is the "an HTTP 200 is not a success" rule in executable form: Reddit's
JSON paths answer 200 with a constant-size interstitial that carries no
`created_utc`, and this catches that.
"""

import argparse
import json
import re
import subprocess
import sys
import datetime
from concurrent.futures import ThreadPoolExecutor

SOURCES = "ideas/sources.json"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
TIMEOUT = 20
MIN_BODY = 400  # with no `expect` marker, smaller than this is a stub

# Bodies that mean "blocked" despite a 200.
INTERSTITIALS = [
    "welcome to reddit", "<title>blocked", "access denied", "just a moment",
    "attention required", "enable javascript", "verifying you are human",
    "consent.google.com", "are you a robot",
]


def probe_one(url, expect):
    """Return (outcome, detail)."""
    try:
        proc = subprocess.run(
            ["curl", "-sL", "-g", "-m", str(TIMEOUT), "-A", UA,
             "-w", "\n__HTTP__%{http_code}", url],
            capture_output=True, text=True, errors="replace", timeout=TIMEOUT + 10)
    except subprocess.TimeoutExpired:
        return "timeout", "curl did not return"
    out = proc.stdout or ""
    m = re.search(r"__HTTP__(\d{3})\s*$", out)
    status = int(m.group(1)) if m else 0
    body = out[:m.start()] if m else out
    size = len(body)
    low = body.lower()

    if status == 0:
        return "timeout", f"no status (curl exit {proc.returncode})"
    if status == 403:
        return "http_403", f"{size}B"
    if status == 404:
        return "http_404", f"{size}B"
    if status == 429:
        return "http_429", f"{size}B"
    if status >= 500:
        return "http_5xx", f"HTTP {status}, {size}B"
    if status >= 400:
        return f"http_{status}", f"{size}B"

    hit = next((s for s in INTERSTITIALS if s in low), None)
    if hit:
        return "empty", f"HTTP {status}, {size}B, interstitial ({hit!r})"
    if expect:
        if expect.lower() in low:
            return "ok", f"HTTP {status}, {size}B"
        return "empty", f"HTTP {status}, {size}B, but {expect!r} is absent"
    if size < MIN_BODY:
        return "empty", f"HTTP {status}, only {size}B"
    return "ok", f"HTTP {status}, {size}B"


def status_from(outcomes):
    """Collapse a source's path outcomes into a catalog status."""
    if not outcomes:
        return "unknown"
    if any(o == "ok" for o in outcomes):
        return "ok-curl"  # curl reached it; only the routine can confirm WebFetch
    return "blocked"


def main(argv):
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true",
                    help="update status and lastVerified in the catalog")
    ap.add_argument("--ids", help="comma-separated source ids to probe")
    args = ap.parse_args(argv)

    catalog = json.load(open(SOURCES, encoding="utf-8"))
    wanted = {s.strip().upper() for s in args.ids.split(",")} if args.ids else None

    jobs = []
    for src in catalog["sources"]:
        if wanted and src["id"] not in wanted:
            continue
        for path in src.get("paths") or []:
            url = path.get("probeUrl") or path.get("url")
            if not url or "{" in url:
                continue  # still templated, nothing concrete to probe
            jobs.append((src, path, url, path.get("expect")))

    if not jobs:
        print("nothing probeable (no concrete probeUrl on the selected sources)")
        return 0

    print(f"probing {len(jobs)} paths across "
          f"{len({s['id'] for s, _, _, _ in jobs})} sources via curl\n")

    with ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(lambda j: probe_one(j[2], j[3]), jobs))

    by_source, changes = {}, []
    for (src, path, url, _), (outcome, detail) in zip(jobs, results):
        by_source.setdefault(src["id"], []).append(outcome)
        flag = "ok  " if outcome == "ok" else "FAIL"
        print(f"  [{flag}] {src['id']:4} {outcome:10} {detail:42} {url[:72]}")
        path["probeOutcome"] = outcome
        path["probeDetail"] = detail

    print()
    today = datetime.date.today().isoformat()
    for src in catalog["sources"]:
        outcomes = by_source.get(src["id"])
        if not outcomes:
            continue
        observed = status_from(outcomes)
        recorded = src["status"]
        # ok and ok-curl both mean reachable; only flag a reachability flip.
        reachable_now = observed != "blocked"
        reachable_before = recorded in ("ok", "ok-curl", "partial")
        if reachable_now != reachable_before:
            changes.append((src, recorded, observed))
        if args.write:
            # Keep a hand-set "ok" when curl agrees it is reachable.
            if reachable_now and recorded == "ok":
                pass
            else:
                src["status"] = observed
            src["lastVerified"] = today

    if changes:
        print("CHANGED since the catalog was written:")
        for src, before, after in changes:
            verb = "now reachable" if after != "blocked" else "now unreachable"
            print(f"  {src['id']:4} {src['name'][:40]:42} {before} -> {after}  ({verb})")
    else:
        print("No reachability changes: the catalog still matches what curl sees.")

    if args.write:
        json.dump(catalog, open(SOURCES, "w", encoding="utf-8"),
                  indent=2, ensure_ascii=False)
        open(SOURCES, "a", encoding="utf-8").write("\n")
        print(f"\nwrote {SOURCES} (status and lastVerified updated to {today})")
    else:
        print("\n(dry run: pass --write to update the catalog)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
