#!/usr/bin/env python3
"""Fetch one URL with curl, safely, and log what happened.

Usage:
  python3 scripts/fetch_url.py [-o FILE] 'https://example.com/a?b=1&c[0]=2'
  python3 scripts/fetch_url.py [-o FILE] - <<'URL'
  https://example.com/it's-a-page
  URL

The routine's curl rung of the fetch ladder (roles/finder/ROUTINE.md in
pisan-labs/hintwise-workflow, Ground rules). A URL copied from a web page is
untrusted text. Typed into a shell command, its `&`, `$(...)`, backticks or
quotes act on the shell; this script takes the URL as one argument (or one
line on standard input, for a URL that contains a single quote) and hands it
to curl as one argument, so no shell ever reads it.

What it does:
  * refuses anything that is not a plain http or https URL (no whitespace, no
    control characters, no user:password@, no other scheme);
  * calls curl with -g (brackets and braces are literal), --proto =http,https,
    -m 20, --max-filesize, --compressed and -w '%{http_code} %{url_effective}';
  * follows a redirect only when it stays on the same host (a leading "www."
    and http to https do not count as a change), at most 5 times;
  * does NOT follow a redirect to another host: it stops, reports the outcome
    `redirect`, and logs where the site pointed. A consent wall or a login
    page on another host is the site's decision, not a page to chase;
  * writes the body to FILE, or to standard output;
  * prints one status line to standard error, starting "fetch: ";
  * appends the same record as one JSON line to the fetch log
    (/tmp/finder-fetches.jsonl, or --log FILE; --no-log turns it off).

The record's `outcome`:
  fetched      a 2xx answer. Not yet a success: read the body. The run logs it
               as `ok` or `empty` (an HTTP 200 is not a success).
  http_403, http_404, http_429, http_5xx, http_<code>
  redirect     a redirect to another host, not followed (`redirectTo` says where)
  timeout      curl's time limit
  too_large    the body is larger than --max-bytes
  environment  this session's own proxy or network refused the host. It says
               nothing about the site and never counts as a site block.
  error        curl failed some other way (`note` has curl's message)
  refused_url  the URL was not fetched at all (`note` says why)

`logAs` is the outcome to write in the run log (scripts/log_run.py) for the
ones that have no key of their own there.

Exit status: 0 for `fetched`, 2 for `refused_url` or a usage error, 1 for
everything else. Standard library and curl only.
"""

import argparse
import datetime
import json
import os
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import urlsplit

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0 Safari/537.36")
TIMEOUT = 20                      # seconds, curl -m
MAX_BYTES = 10 * 1024 * 1024      # curl --max-filesize
MAX_HOPS = 5                      # same-host redirects followed
MAX_URL = 4000                    # characters
LOG = "/tmp/finder-fetches.jsonl"
# One line each: the status and final URL, then where a 3xx points, then the
# proxy's answer to CONNECT (000 when no proxy tunnel was used).
WRITE_OUT = "%{http_code} %{url_effective}\n%{redirect_url}\n%{http_connect}\n"

# curl exit codes that mean the session's own proxy, not the site.
PROXY_EXITS = {5: "could not resolve the proxy", 97: "proxy handshake failed"}


def bad_url(url):
    """Return why this URL is refused, or None when it may be fetched."""
    if not url:
        return "empty URL"
    if len(url) > MAX_URL:
        return f"longer than {MAX_URL} characters"
    if any(ch.isspace() or ord(ch) < 0x20 or ord(ch) == 0x7f for ch in url):
        return "contains whitespace or a control character"
    try:
        parts = urlsplit(url)
        host = parts.hostname
    except ValueError as exc:
        return f"not a URL ({exc})"
    if parts.scheme.lower() not in ("http", "https"):
        return "only http and https URLs are fetched"
    if not host:
        return "no host"
    if "@" in parts.netloc:
        return "a user name or password in the URL is not allowed"
    return None


def site(url):
    """The host a redirect must stay on: lower case, without a leading www."""
    host = (urlsplit(url).hostname or "").lower().rstrip(".")
    return host[4:] if host.startswith("www.") else host


def curl_once(url, body_path, timeout, max_bytes):
    """Run curl once. Returns (exit code, http code, effective URL,
    redirect URL, proxy CONNECT code, curl's error text)."""
    cmd = ["curl", "-g", "-sS", "--compressed", "--proto", "=http,https",
           "-m", str(timeout), "--max-filesize", str(max_bytes),
           "-A", UA, "-o", body_path, "-w", WRITE_OUT, "--url", url]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True,
                              errors="replace", timeout=timeout + 10)
    except subprocess.TimeoutExpired:
        return 28, 0, url, "", 0, "curl did not return"
    lines = (proc.stdout or "").split("\n")
    first = lines[0].split(" ", 1) if lines else [""]
    code = int(first[0]) if first[0].isdigit() else 0
    effective = first[1] if len(first) > 1 and first[1] else url
    redirect = lines[1] if len(lines) > 1 else ""
    connect = int(lines[2]) if len(lines) > 2 and lines[2].isdigit() else 0
    return proc.returncode, code, effective, redirect, connect, (proc.stderr or "").strip()


def classify(exit_code, code, connect, err, size, max_bytes):
    """Return (outcome, note) for a response that was not a followed redirect."""
    if exit_code in PROXY_EXITS:
        return "environment", f"{PROXY_EXITS[exit_code]} (curl exit {exit_code})"
    if code == 0 and connect not in (0, 200):
        return "environment", f"the session's proxy answered CONNECT with {connect}"
    if exit_code == 28:
        return "timeout", err or "no answer in time"
    if exit_code == 63 or size > max_bytes:
        return "too_large", f"larger than {max_bytes} bytes"
    if exit_code != 0 and code == 0:
        return "error", f"curl exit {exit_code}: {err}"[:300]
    if 200 <= code < 300:
        if exit_code != 0:
            return "error", f"HTTP {code} but curl exit {exit_code}: {err}"[:300]
        return "fetched", ""
    if code in (403, 404, 429):
        return f"http_{code}", ""
    if code >= 500:
        return "http_5xx", f"HTTP {code}"
    return f"http_{code}", ""


def log_as(outcome, code):
    """The run-log outcome (scripts/log_run.py) for this result."""
    if outcome == "fetched":
        return "ok or empty: read the body"
    if outcome in ("http_403", "http_404", "http_429", "http_5xx",
                   "redirect", "timeout", "environment"):
        return outcome
    if outcome == "too_large":
        return "empty"
    if outcome == "error":
        return "timeout"
    if code in (401, 407, 451):
        return "http_403"
    return "http_404"  # another 4xx, or a 3xx that named no target


def fetch(url, out_path=None, timeout=TIMEOUT, max_bytes=MAX_BYTES):
    """Fetch url. Returns the record; the body is in out_path when given."""
    record = {"url": url, "client": "curl", "httpCode": None, "urlEffective": url,
              "outcome": None, "logAs": None, "bytes": 0, "hops": []}
    why = bad_url(url)
    if why:
        record.update(outcome="refused_url", logAs="not a fetch: do not log it", note=why)
        return record
    if shutil.which("curl") is None:
        record.update(outcome="environment", logAs="environment",
                      note="curl is not installed in this session")
        return record

    fd, tmp = tempfile.mkstemp(prefix="fetch_url_")
    os.close(fd)
    try:
        current = url
        for _ in range(MAX_HOPS + 1):
            exit_code, code, effective, redirect, connect, err = curl_once(
                current, tmp, timeout, max_bytes)
            size = os.path.getsize(tmp) if os.path.exists(tmp) else 0
            record.update(httpCode=code or None, urlEffective=effective, bytes=size)
            if 300 <= code < 400 and redirect:
                if bad_url(redirect):
                    record.update(outcome="redirect", redirectTo=redirect[:MAX_URL],
                                  note="redirect to a URL this script refuses: "
                                       + bad_url(redirect))
                    break
                if site(redirect) != site(current):
                    record.update(outcome="redirect", redirectTo=redirect,
                                  note=f"redirect to another host ({site(redirect)}), "
                                       "not followed")
                    break
                record["hops"].append(redirect)
                current = redirect
                continue
            outcome, note = classify(exit_code, code, connect, err, size, max_bytes)
            record["outcome"] = outcome
            if note:
                record["note"] = note
            break
        else:
            record.update(outcome="redirect", redirectTo=current,
                          note=f"more than {MAX_HOPS} redirects on the same host")
        record["logAs"] = log_as(record["outcome"], record["httpCode"] or 0)
        if record["outcome"] == "too_large":
            record["bytes"] = 0
        elif out_path:
            shutil.copyfile(tmp, out_path)
        else:
            with open(tmp, "rb") as fh:
                shutil.copyfileobj(fh, sys.stdout.buffer)
            sys.stdout.buffer.flush()
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)
    return record


def write_log(record, path):
    line = dict(record, at=datetime.datetime.now(datetime.timezone.utc)
                .strftime("%Y-%m-%dT%H:%M:%SZ"))
    try:
        with open(path, "a", encoding="utf-8") as fh:
            fh.write(json.dumps(line, ensure_ascii=False, sort_keys=True) + "\n")
    except OSError as exc:
        print(f"fetch: could not write the fetch log {path}: {exc}", file=sys.stderr)


def main(argv):
    ap = argparse.ArgumentParser(
        description="Fetch one URL with curl, safely, and log what happened.")
    ap.add_argument("url", help="the URL, as one argument; or - to read it from "
                                "the first line of standard input")
    ap.add_argument("-o", "--output", metavar="FILE",
                    help="write the body here instead of standard output")
    ap.add_argument("--max-bytes", type=int, default=MAX_BYTES,
                    help=f"refuse a larger body (default {MAX_BYTES})")
    ap.add_argument("--timeout", type=int, default=TIMEOUT,
                    help=f"seconds per request (default {TIMEOUT})")
    ap.add_argument("--log", default=LOG, metavar="FILE",
                    help=f"append the record here (default {LOG})")
    ap.add_argument("--no-log", action="store_true", help="do not write the fetch log")
    args = ap.parse_args(argv)

    url = args.url
    if url == "-":
        # One line; an indented heredoc must not turn into a refused URL.
        url = sys.stdin.readline().strip()
    record = fetch(url, args.output, args.timeout, args.max_bytes)
    if not args.no_log:
        write_log(record, args.log)
    print("fetch: " + json.dumps(record, ensure_ascii=False, sort_keys=True),
          file=sys.stderr)
    if record["outcome"] == "fetched":
        return 0
    return 2 if record["outcome"] == "refused_url" else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
