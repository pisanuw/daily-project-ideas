#!/usr/bin/env python3
"""Turn ideas/run-log.jsonl into a source-health briefing for the next run.

Usage:
  python3 scripts/source_health.py            # write the report, print a summary
  python3 scripts/source_health.py --print    # also print the full report
  python3 scripts/source_health.py --days 60  # change the window (default 45)

Writes two files:
  ideas/source-health.json  machine-readable; the routine reads this at Step 0
  ideas/source-health.md    the same thing as a table, for a human

It answers the questions a run needs before it spends a search:
  * which hosts are unreachable, and how they fail
  * which access path last worked for a source
  * which sources have produced accepted evidence or a selected idea lately
  * which gate condition is killing the most candidates

It never edits ideas/sources.json. It reports disagreements between the
catalog's hand-set status and what the log shows, so a human decides.
"""

import argparse
import collections
import datetime
import json
import os
import sys
from urllib.parse import urlsplit

SOURCES = "ideas/sources.json"
LOG = "ideas/run-log.jsonl"
OUT_JSON = "ideas/source-health.json"
OUT_MD = "ideas/source-health.md"
DEAD_AFTER = 4  # consecutive unusable attempts before a source is called dead


def load_runs(days, today):
    if not os.path.exists(LOG):
        return []
    cutoff = today - datetime.timedelta(days=days)
    runs = []
    for line in open(LOG, encoding="utf-8"):
        line = line.strip()
        if not line:
            continue
        rec = json.loads(line)
        try:
            when = datetime.date.fromisoformat(rec["date"])
        except (KeyError, ValueError):
            continue
        if when >= cutoff:
            runs.append(rec)
    return sorted(runs, key=lambda r: r.get("runId", ""))


def host_of(url):
    return urlsplit(str(url)).netloc.lower()


def summarize(runs, catalog):
    by_source = collections.defaultdict(lambda: {
        "searches": 0, "fetchOk": 0, "fetchFail": 0, "candidates": 0,
        "selected": 0, "runs": 0, "lastUsed": None,
    })
    by_host = collections.defaultdict(lambda: {
        "attempts": 0, "ok": 0, "outcomes": collections.Counter(),
        "lastOk": None, "lastAttempt": None, "workingPaths": [],
        "evidenceItems": 0,
    })
    gate = collections.Counter()
    funnel = collections.Counter()
    floor_failures = []

    for rec in runs:
        day = rec.get("date")
        for s in rec.get("sourcesUsed") or []:
            row = by_source[s["id"]]
            row["runs"] += 1
            row["lastUsed"] = max(filter(None, [row["lastUsed"], day]))
            for k in ("searches", "fetchOk", "fetchFail", "candidates", "selected"):
                row[k] += s.get(k, 0)
        for f in rec.get("fetches") or []:
            h = host_of(f.get("url", ""))
            if not h:
                continue
            row = by_host[h]
            row["attempts"] += 1
            row["outcomes"][f.get("outcome", "?")] += 1
            row["lastAttempt"] = max(filter(None, [row["lastAttempt"], day]))
            if f.get("outcome") == "ok":
                row["ok"] += 1
                row["lastOk"] = max(filter(None, [row["lastOk"], day]))
                path = f"{f.get('client', '?')} {f.get('url')}"
                if path not in row["workingPaths"]:
                    row["workingPaths"].append(path)
            if f.get("usedAsEvidence"):
                row["evidenceItems"] += 1
        gate.update(rec.get("gateFailures") or {})
        funnel.update(rec.get("funnel") or {})
        if rec.get("floorFailure"):
            floor_failures.append({"runId": rec.get("runId"),
                                   "floorFailure": rec["floorFailure"]})

    # Keep only the few most informative working paths per host.
    for row in by_host.values():
        row["workingPaths"] = row["workingPaths"][:3]
        row["outcomes"] = dict(row["outcomes"])

    disagreements = []
    for src in catalog["sources"]:
        row = by_source.get(src["id"])
        if not row or row["searches"] == 0:
            continue
        attempts = row["fetchOk"] + row["fetchFail"]
        claimed = src["status"]
        if row["fetchOk"] == 0 and attempts >= DEAD_AFTER and claimed != "blocked":
            disagreements.append({
                "id": src["id"], "name": src["name"], "catalogStatus": claimed,
                "logSays": "blocked",
                "why": f"{attempts} attempts in the window, none usable",
            })
        if row["fetchOk"] > 0 and claimed == "blocked":
            disagreements.append({
                "id": src["id"], "name": src["name"], "catalogStatus": claimed,
                "logSays": "reachable",
                "why": f"{row['fetchOk']} usable fetches in the window",
            })

    return {
        "bySource": dict(by_source),
        "byHost": dict(by_host),
        "gateFailures": dict(gate.most_common()),
        "funnel": dict(funnel),
        "floorFailures": floor_failures,
        "disagreements": disagreements,
    }


def avoid_and_prefer(catalog, summary):
    """The two lists a run actually acts on."""
    avoid, prefer = [], []
    for src in catalog["sources"]:
        row = summary["bySource"].get(src["id"], {})
        attempts = row.get("fetchOk", 0) + row.get("fetchFail", 0)
        dead_in_log = row.get("fetchOk", 0) == 0 and attempts >= DEAD_AFTER
        if src["status"] == "blocked" or dead_in_log:
            why = src.get("blockedBecause")
            if not why:
                why = ("no usable fetch in the window" if dead_in_log
                       else (src.get("notes") or "blocked").split(".")[0] + ".")
            avoid.append({"id": src["id"], "name": src["name"], "why": why})
        elif src["status"] in ("ok", "ok-curl"):
            paths = [p for p in src.get("paths", []) if p.get("verified")]
            prefer.append({
                "id": src["id"], "name": src["name"], "evidence": src["evidence"],
                "status": src["status"],
                "path": paths[0]["url"] if paths else None,
                "client": paths[0]["client"] if paths else None,
                "selectedIdeas": row.get("selected", 0),
            })
    prefer.sort(key=lambda r: (-r["selectedIdeas"], r["id"]))
    return avoid, prefer


def failing_paths(catalog):
    """Paths that failed their last probe inside a source that counts as reachable.

    A source is marked reachable if any one path works, so a dead primary path
    can hide behind a working fallback. A run that follows the source expecting
    the primary vein needs to know.
    """
    rows = []
    for src in catalog["sources"]:
        if src["status"] == "blocked":
            continue  # already on the avoid list, nothing hidden
        paths = src.get("paths") or []
        probed = [p for p in paths if p.get("probeOutcome")]
        if not probed or all(p["probeOutcome"] == "ok" for p in probed):
            continue
        working = [p for p in probed if p["probeOutcome"] == "ok"]
        for p in probed:
            if p["probeOutcome"] != "ok":
                rows.append({
                    "id": src["id"], "name": src["name"],
                    "status": src["status"],
                    "url": p.get("probeUrl") or p.get("url"),
                    "outcome": p["probeOutcome"],
                    "detail": p.get("probeDetail", ""),
                    "fallbacks": len(working),
                })
    return rows


def render_md(report):
    L = []
    L.append("# Source health")
    L.append("")
    L.append(f"Generated {report['generated']} from the last {report['windowDays']} days "
             f"of `ideas/run-log.jsonl` ({report['runsInWindow']} runs). "
             "Do not edit by hand: regenerate with `python3 scripts/source_health.py`.")
    L.append("")

    if not report["runsInWindow"]:
        L.append("No runs in the window yet. Until the log fills up, "
                 "`ideas/sources.json` is the only guide.")
        L.append("")

    L.append("## Do not spend searches here")
    L.append("")
    if report["avoid"]:
        L.append("| Source | Why |")
        L.append("|---|---|")
        for a in report["avoid"]:
            L.append(f"| {a['id']} {a['name']} | {a['why']} |")
    else:
        L.append("Nothing is known to be blocked.")
    L.append("")

    L.append("## Reachable sources, best first")
    L.append("")
    L.append("`selected` counts ideas chosen in the window that came from this source.")
    L.append("")
    L.append("| Source | Yields | Status | selected | Access path |")
    L.append("|---|---|---|---|---|")
    for p in report["prefer"]:
        path = f"`{p['client']}: {p['path']}`" if p["path"] else "no verified path"
        L.append(f"| {p['id']} {p['name']} | {p['evidence']} | {p['status']} "
                 f"| {p['selectedIdeas']} | {path} |")
    L.append("")

    if report.get("failingPaths"):
        L.append("## Reachable sources with a failing path")
        L.append("")
        L.append("These sources are not on the avoid list, because at least one of their "
                 "paths works. The paths below are the ones that did not. If the failing "
                 "path is the vein you came for, use the fallback or pick another source.")
        L.append("")
        L.append("| Source | Status | Failing path | Outcome | Working paths left |")
        L.append("|---|---|---|---|---|")
        for r in report["failingPaths"]:
            L.append(f"| {r['id']} {r['name']} | {r['status']} | `{r['url']}` "
                     f"| {r['outcome']} ({r['detail']}) | {r['fallbacks']} |")
        L.append("")

    hosts = report["byHost"]
    if hosts:
        L.append("## Hosts, as actually observed")
        L.append("")
        L.append("| Host | usable/tried | Outcomes | Last usable |")
        L.append("|---|---|---|---|")
        for h, row in sorted(hosts.items(), key=lambda kv: (-kv[1]["attempts"], kv[0])):
            outcomes = ", ".join(f"{k} {v}" for k, v in sorted(row["outcomes"].items()))
            L.append(f"| {h} | {row['ok']}/{row['attempts']} | {outcomes} "
                     f"| {row['lastOk'] or 'never'} |")
        L.append("")

    gate = report["gateFailures"]
    if gate:
        L.append("## Where candidates die")
        L.append("")
        L.append("| Gate condition | Candidates lost |")
        L.append("|---|---|")
        for k, v in gate.items():
            L.append(f"| {k} | {v} |")
        L.append("")
        L.append("The largest row is the one to argue about before changing anything else.")
        L.append("")

    if report["funnel"]:
        f = report["funnel"]
        L.append("## Funnel over the window")
        L.append("")
        L.append(" -> ".join(
            f"{k} {f[k]}" for k in
            ("candidates", "passedRejectRules", "passedGate", "reviewKilled",
             "validated", "provisional", "watchlist") if k in f))
        L.append("")

    if report["floorFailures"]:
        L.append("## Runs that produced nothing")
        L.append("")
        for ff in report["floorFailures"]:
            L.append(f"- `{ff['runId']}`: {ff['floorFailure']}")
        L.append("")
        L.append("A run producing nothing is a routine bug, not a quiet day. "
                 "Each line above is one to fix.")
        L.append("")

    if report["disagreements"]:
        L.append("## Catalog disagrees with the log")
        L.append("")
        for d in report["disagreements"]:
            L.append(f"- **{d['id']} {d['name']}**: catalog says `{d['catalogStatus']}`, "
                     f"the log says `{d['logSays']}` ({d['why']}). "
                     "Update `ideas/sources.json` by hand.")
        L.append("")

    return "\n".join(L) + "\n"


def main(argv):
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=45)
    ap.add_argument("--print", dest="do_print", action="store_true")
    args = ap.parse_args(argv)

    today = datetime.date.today()
    catalog = json.load(open(SOURCES, encoding="utf-8"))
    runs = load_runs(args.days, today)
    summary = summarize(runs, catalog)
    avoid, prefer = avoid_and_prefer(catalog, summary)

    report = {
        "generated": today.isoformat(),
        "windowDays": args.days,
        "runsInWindow": len(runs),
        "avoid": avoid,
        "prefer": prefer,
        "failingPaths": failing_paths(catalog),
        **summary,
    }
    with open(OUT_JSON, "w", encoding="utf-8") as fh:
        json.dump(report, fh, indent=2, ensure_ascii=False, sort_keys=True)
        fh.write("\n")
    md = render_md(report)
    with open(OUT_MD, "w", encoding="utf-8") as fh:
        fh.write(md)

    if args.do_print:
        print(md)
    else:
        print(f"OK: {len(runs)} runs in the last {args.days} days -> "
              f"{OUT_JSON}, {OUT_MD}")
        print(f"  avoid {len(avoid)} sources, prefer {len(prefer)}")
        if report["failingPaths"]:
            print(f"  {len(report['failingPaths'])} failing paths inside reachable sources:")
            for r in report["failingPaths"]:
                print(f"    {r['id']} {r['outcome']} on {r['url'][:62]}")
        if summary["gateFailures"]:
            top = next(iter(summary["gateFailures"].items()))
            print(f"  biggest candidate killer: {top[0]} ({top[1]})")
        for d in summary["disagreements"]:
            print(f"  catalog/log disagreement: {d['id']} {d['catalogStatus']} "
                  f"vs {d['logSays']} ({d['why']})")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
