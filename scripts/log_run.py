#!/usr/bin/env python3
"""Append one run record to ideas/run-log.jsonl.

Usage: python3 scripts/log_run.py <record.json>

The record is the routine's account of what it tried this run: which sources it
used, what every fetch returned, and where candidates died. It is append-only
and separate from the day's ideas file, so a run that produced nothing still
leaves a usable trace.

Exits 0 and prints OK after appending. Exits 1 and prints one problem per line
without writing anything if the record is malformed.

Fetch outcomes (use the narrowest one that fits):
  ok         usable content with the date and author the gate needs
  empty      HTTP 200 but nothing usable: a JS shell, a bot interstitial, an
             index page with no items. An HTTP 200 is not a success.
  allowlist  the WebFetch tool refused the host ("unable to fetch from")
  http_403 / http_404 / http_429 / http_5xx
  redirect   a cross-host redirect that was not followed (consent walls)
  timeout    no response in time

Gate-failure keys (count each candidate under the first condition it failed):
  rejectRule, totalBelowMin, painBelow4, wtpBelow3, evidenceCountBelow2,
  noRecentEvidence, unverifiedEvidence, noComplaintEvidence, reviewKill
"""

import json
import re
import sys

OUTCOMES = {"ok", "empty", "allowlist", "http_403", "http_404", "http_429",
            "http_5xx", "redirect", "timeout"}
CLIENTS = {"webfetch", "curl"}
MODES = {"first", "extra"}
GATE_KEYS = {"rejectRule", "totalBelowMin", "painBelow4", "wtpBelow3",
             "evidenceCountBelow2", "noRecentEvidence", "unverifiedEvidence",
             "noComplaintEvidence", "reviewKill"}
FUNNEL_KEYS = {"candidates", "passedRejectRules", "passedGate", "reviewKilled",
               "validated", "provisional", "watchlist"}
LOG = "ideas/run-log.jsonl"


def check(rec, errs):
    for field in ("runId", "date", "mode", "sourcesUsed", "fetches", "funnel"):
        if field not in rec:
            errs.append(f"missing {field}")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(rec.get("date", ""))):
        errs.append("date must be YYYY-MM-DD")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}#\d+", str(rec.get("runId", ""))):
        errs.append("runId must look like 2026-11-01#1")
    if rec.get("mode") not in MODES:
        errs.append(f"mode must be one of {sorted(MODES)}")

    for i, s in enumerate(rec.get("sourcesUsed") or []):
        if not s.get("id"):
            errs.append(f"sourcesUsed[{i}]: missing id")
        for k in ("searches", "fetchOk", "fetchFail", "candidates", "selected"):
            if not isinstance(s.get(k, 0), int):
                errs.append(f"sourcesUsed[{i}]: {k} must be an integer")
    if not rec.get("sourcesUsed"):
        errs.append("sourcesUsed is empty: a run always uses at least one source")

    for i, f in enumerate(rec.get("fetches") or []):
        if not str(f.get("url", "")).startswith("http"):
            errs.append(f"fetches[{i}]: url must be an http(s) URL")
        if f.get("outcome") not in OUTCOMES:
            errs.append(f"fetches[{i}]: outcome {f.get('outcome')!r} not in {sorted(OUTCOMES)}")
        if f.get("client") not in CLIENTS:
            errs.append(f"fetches[{i}]: client must be webfetch or curl")
        if f.get("outcome") != "ok" and f.get("usedAsEvidence"):
            errs.append(f"fetches[{i}]: usedAsEvidence is true but outcome is not ok")
    if not rec.get("fetches"):
        errs.append("fetches is empty: record every fetch, including the ones that failed")

    funnel = rec.get("funnel") or {}
    for k in FUNNEL_KEYS:
        if not isinstance(funnel.get(k), int):
            errs.append(f"funnel.{k} must be an integer")
    for k in funnel:
        if k not in FUNNEL_KEYS:
            errs.append(f"funnel.{k} is not a known key")
    produced = funnel.get("validated", 0) + funnel.get("provisional", 0)
    if isinstance(produced, int) and produced == 0 and not rec.get("floorFailure"):
        errs.append("no idea was produced but floorFailure does not say which floor "
                    "condition stopped every candidate")

    for k in rec.get("gateFailures") or {}:
        if k not in GATE_KEYS:
            errs.append(f"gateFailures.{k} is not a known key; use one of {sorted(GATE_KEYS)}")


def main(path):
    errs = []
    with open(path, encoding="utf-8") as fh:
        rec = json.load(fh)
    if not isinstance(rec, dict):
        print("the record must be a JSON object")
        return 1
    check(rec, errs)
    if errs:
        print("\n".join(errs))
        return 1
    with open(LOG, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(rec, ensure_ascii=False, sort_keys=True) + "\n")
    fetches = rec["fetches"]
    ok = sum(1 for f in fetches if f["outcome"] == "ok")
    print(f"OK: appended {rec['runId']} to {LOG} "
          f"({len(rec['sourcesUsed'])} sources, {ok}/{len(fetches)} fetches usable)")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python3 scripts/log_run.py <record.json>")
    sys.exit(main(sys.argv[1]))
