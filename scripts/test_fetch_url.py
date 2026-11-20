# python3 scripts/test_fetch_url.py
"""Tests for scripts/fetch_url.py and the `environment` outcome in log_run.py.

They run real curl against a web server started on 127.0.0.1 for the test, so
they need no internet. Standard library only.
"""

import http.server
import json
import os
import socket
import subprocess
import sys
import tempfile
import threading
import time
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "fetch_url.py")
LOG_RUN = os.path.join(HERE, "log_run.py")
sys.path.insert(0, HERE)
import fetch_url  # noqa: E402


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


class Handler(http.server.BaseHTTPRequestHandler):
    seen = []

    def log_message(self, *args):
        pass

    def send(self, code, body=b"", headers=()):
        self.send_response(code)
        for name, value in headers:
            self.send_header(name, value)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        Handler.seen.append(self.path)
        port = self.server.server_address[1]
        if self.path.startswith("/ok"):
            self.send(200, b"hello " + self.path.encode())
        elif self.path == "/missing":
            self.send(404, b"gone")
        elif self.path == "/forbidden":
            self.send(403, b"no")
        elif self.path == "/unauthorized":
            self.send(401, b"no")
        elif self.path == "/broken":
            self.send(503, b"down")
        elif self.path == "/same-host":
            self.send(302, headers=[("Location", "/ok?after=redirect")])
        elif self.path == "/other-host":
            # localhost and 127.0.0.1 are the same machine but different hosts.
            self.send(302, headers=[("Location", f"http://localhost:{port}/ok?consent=1")])
        elif self.path == "/to-file":
            self.send(302, headers=[("Location", "file:///etc/passwd")])
        elif self.path == "/loop":
            self.send(302, headers=[("Location", "/loop")])
        elif self.path == "/big":
            self.send(200, b"x" * 5000)
        elif self.path == "/slow":
            time.sleep(3)
            self.send(200, b"late")
        else:
            self.send(200, b"other")


def refusing_proxy():
    """A proxy that answers every CONNECT with 403, as a session's egress
    proxy does for a host it does not allow."""
    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    sock.listen(5)

    def serve():
        while True:
            try:
                conn, _ = sock.accept()
            except OSError:
                return
            conn.recv(4096)
            conn.sendall(b"HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n")
            conn.close()

    threading.Thread(target=serve, daemon=True).start()
    return sock


class FetchTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        cls.port = cls.server.server_address[1]
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.base = f"http://127.0.0.1:{cls.port}"
        cls.tmp = tempfile.TemporaryDirectory()
        # The test server is local: keep any session proxy out of the way.
        cls.env = {k: v for k, v in os.environ.items() if "proxy" not in k.lower()}

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.tmp.cleanup()

    def run_script(self, *args, stdin=None, env=None):
        log = os.path.join(self.tmp.name, "fetches.jsonl")
        if os.path.exists(log):
            os.unlink(log)
        proc = subprocess.run(
            [sys.executable, SCRIPT, "--log", log, *args], input=stdin,
            capture_output=True, text=True, cwd=self.tmp.name, env=env or self.env)
        status = [l for l in proc.stderr.splitlines() if l.startswith("fetch: ")]
        record = json.loads(status[-1][len("fetch: "):]) if status else None
        logged = [json.loads(l) for l in read(log).splitlines()] if os.path.exists(log) else []
        return proc, record, logged

    def test_a_page_is_fetched_and_logged(self):
        proc, record, logged = self.run_script(self.base + "/ok")
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(proc.stdout, "hello /ok")
        self.assertEqual(record["outcome"], "fetched")
        self.assertEqual(record["httpCode"], 200)
        self.assertEqual(record["urlEffective"], self.base + "/ok")
        self.assertEqual(record["client"], "curl")
        self.assertEqual(len(logged), 1)
        self.assertEqual(logged[0]["url"], self.base + "/ok")
        self.assertIn("at", logged[0])

    def test_the_body_goes_to_a_file_when_asked(self):
        out = os.path.join(self.tmp.name, "body.html")
        proc, record, _ = self.run_script("-o", out, self.base + "/ok")
        self.assertEqual(proc.stdout, "")
        self.assertEqual(read(out), "hello /ok")
        self.assertEqual(record["bytes"], len("hello /ok"))

    def test_brackets_braces_and_ampersands_reach_the_server_unchanged(self):
        path = "/ok?ratings[]=1&ratings[]=2&x={a,b}&y=[1-3]"
        proc, record, _ = self.run_script(self.base + path)
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(proc.stdout, "hello " + path)

    def test_shell_characters_in_a_url_run_nothing(self):
        canary = os.path.join(self.tmp.name, "canary")
        path = f"/ok?a=$(touch${{IFS}}{canary})&b=`touch${{IFS}}{canary}`&c=';touch${{IFS}}{canary};'"
        proc, record, _ = self.run_script(self.base + path)
        self.assertEqual(record["outcome"], "fetched")
        self.assertEqual(proc.stdout, "hello " + path)
        self.assertFalse(os.path.exists(canary))

    def test_a_url_can_come_from_standard_input(self):
        path = "/ok?it's=fine"
        proc, record, _ = self.run_script("-", stdin=self.base + path + "\n")
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(proc.stdout, "hello " + path)

    def test_http_errors_are_named_and_exit_1(self):
        for path, outcome, log_as in (("/missing", "http_404", "http_404"),
                                      ("/forbidden", "http_403", "http_403"),
                                      ("/unauthorized", "http_401", "http_403"),
                                      ("/broken", "http_5xx", "http_5xx")):
            proc, record, _ = self.run_script(self.base + path)
            self.assertEqual(proc.returncode, 1, path)
            self.assertEqual(record["outcome"], outcome, path)
            self.assertEqual(record["logAs"], log_as, path)

    def test_a_redirect_on_the_same_host_is_followed(self):
        proc, record, _ = self.run_script(self.base + "/same-host")
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(proc.stdout, "hello /ok?after=redirect")
        self.assertEqual(record["hops"], [self.base + "/ok?after=redirect"])
        self.assertEqual(record["urlEffective"], self.base + "/ok?after=redirect")

    def test_a_redirect_to_another_host_is_logged_and_not_followed(self):
        Handler.seen.clear()
        proc, record, logged = self.run_script(self.base + "/other-host")
        self.assertEqual(proc.returncode, 1)
        self.assertEqual(record["outcome"], "redirect")
        self.assertEqual(record["logAs"], "redirect")
        self.assertEqual(record["redirectTo"], f"http://localhost:{self.port}/ok?consent=1")
        self.assertIn("another host (localhost)", record["note"])
        self.assertEqual(Handler.seen, ["/other-host"])
        self.assertEqual(logged[0]["redirectTo"], record["redirectTo"])

    def test_a_redirect_to_a_file_url_is_not_followed(self):
        proc, record, _ = self.run_script(self.base + "/to-file")
        self.assertEqual(record["outcome"], "redirect")
        self.assertIn("only http and https", record["note"])
        self.assertNotIn("root:", proc.stdout)

    def test_a_redirect_loop_stops(self):
        proc, record, _ = self.run_script(self.base + "/loop")
        self.assertEqual(record["outcome"], "redirect")
        self.assertIn("more than 5 redirects", record["note"])

    def test_www_and_https_do_not_count_as_another_host(self):
        self.assertEqual(fetch_url.site("http://Example.com/a"),
                         fetch_url.site("https://www.example.com/b"))
        self.assertNotEqual(fetch_url.site("https://example.com/"),
                            fetch_url.site("https://consent.example.com/"))

    def test_a_body_over_the_limit_is_refused(self):
        proc, record, _ = self.run_script("--max-bytes", "1000", self.base + "/big")
        self.assertEqual(proc.returncode, 1)
        self.assertEqual(record["outcome"], "too_large")
        self.assertEqual(record["logAs"], "empty")
        self.assertEqual(proc.stdout, "")

    def test_a_slow_site_is_a_timeout(self):
        proc, record, _ = self.run_script("--timeout", "1", self.base + "/slow")
        self.assertEqual(proc.returncode, 1)
        self.assertEqual(record["outcome"], "timeout")

    def test_urls_that_are_not_plain_http_are_refused_before_curl_runs(self):
        Handler.seen.clear()
        for url in ("file:///etc/passwd", "ftp://example.com/x", "example.com/x",
                    self.base + "/ok a", self.base + "/ok\tb", "", "-K/etc/passwd",
                    f"http://user:pw@127.0.0.1:{self.port}/ok",
                    self.base + "/" + "a" * 5000):
            proc, record, logged = self.run_script("--", url)
            self.assertEqual(proc.returncode, 2, url)
            self.assertEqual(record["outcome"], "refused_url", url)
            self.assertEqual(proc.stdout, "", url)
        self.assertEqual(Handler.seen, [])

    def test_a_refusal_by_the_sessions_proxy_is_environment_not_a_site_block(self):
        proxy = refusing_proxy()
        try:
            env = dict(self.env, https_proxy=f"http://127.0.0.1:{proxy.getsockname()[1]}")
            proc, record, _ = self.run_script("https://blocked.example/", env=env)
        finally:
            proxy.close()
        self.assertEqual(proc.returncode, 1)
        self.assertEqual(record["outcome"], "environment")
        self.assertEqual(record["logAs"], "environment")
        self.assertIn("403", record["note"])

    def test_no_log_writes_no_log(self):
        log = os.path.join(self.tmp.name, "unused.jsonl")
        subprocess.run([sys.executable, SCRIPT, "--log", log, "--no-log", self.base + "/ok"],
                       capture_output=True, env=self.env)
        self.assertFalse(os.path.exists(log))


class LogRunTest(unittest.TestCase):
    """log_run.py accepts the `environment` outcome, and still refuses others."""

    def record(self, outcome):
        return {"runId": "2026-11-20#1", "date": "2026-11-20", "mode": "first",
                "sourcesUsed": [{"id": "A13", "name": "Discourse", "searches": 1,
                                 "fetchOk": 1, "fetchFail": 0, "candidates": 1,
                                 "selected": 1}],
                "fetches": [{"url": "https://example.com/", "client": "curl",
                             "outcome": "ok", "usedAsEvidence": True},
                            {"url": "https://example.org/", "client": "curl",
                             "outcome": outcome, "usedAsEvidence": False}],
                "funnel": {"candidates": 1, "passedRejectRules": 1, "passedGate": 0,
                           "reviewKilled": 0, "validated": 0, "provisional": 1,
                           "watchlist": 0}}

    def log(self, outcome):
        with tempfile.TemporaryDirectory() as tmp:
            os.mkdir(os.path.join(tmp, "ideas"))
            path = os.path.join(tmp, "record.json")
            with open(path, "w") as fh:
                json.dump(self.record(outcome), fh)
            proc = subprocess.run([sys.executable, LOG_RUN, path], cwd=tmp,
                                  capture_output=True, text=True)
            log = os.path.join(tmp, "ideas", "run-log.jsonl")
            return proc, (read(log) if os.path.exists(log) else "")

    def test_environment_is_an_allowed_outcome(self):
        proc, written = self.log("environment")
        self.assertEqual(proc.returncode, 0, proc.stdout)
        self.assertIn('"outcome": "environment"', written)

    def test_an_unknown_outcome_is_still_refused(self):
        proc, written = self.log("proxy_said_no")
        self.assertEqual(proc.returncode, 1)
        self.assertEqual(written, "")


if __name__ == "__main__":
    unittest.main()
