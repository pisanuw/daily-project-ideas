# python3 scripts/test_tag_topics.py
"""Tests for scripts/tag_topics.py, with a stub in place of the `claude` CLI.

They write a small fake ideas/ and dist/data.js in a temporary directory, so
they never call the CLI and never touch the real ideas/topics.json. Standard
library only.
"""

import contextlib
import io
import json
import os
import re
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
_cwd = os.getcwd()
os.chdir(ROOT)  # the module reads ideas/topics-taxonomy.json on import
try:
    import tag_topics  # noqa: E402
finally:
    os.chdir(_cwd)

A, B = "Accessibility", "Music & Audio"


class Stub:
    """Answers every id with `answer`, except the call numbers in `fail`."""

    def __init__(self, answer=B, fail=(), overrides=None):
        self.answer, self.fail, self.overrides = answer, set(fail), overrides or {}
        self.calls, self.seen = 0, []

    def __call__(self, prompt):
        self.calls += 1
        ids = re.findall(r"^(\S+): ", prompt.split("\nIdeas:\n", 1)[1], re.M)
        self.seen.extend(ids)
        if self.calls in self.fail:
            raise RuntimeError("claude exited 1: stub failure")
        return {i: self.overrides.get(i, self.answer) for i in ids}


class TagTopicsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        d = self.tmp.name
        os.makedirs(os.path.join(d, "ideas"))
        os.makedirs(os.path.join(d, "dist"))
        self.patches = {
            "IDEAS_DIR": os.path.join(d, "ideas"),
            "TOPICS_FILE": os.path.join(d, "ideas", "topics.json"),
            "DATA_JS": os.path.join(d, "dist", "data.js"),
            "BATCH": 2,
        }
        self.saved = {k: getattr(tag_topics, k) for k in self.patches}
        self.saved["call_claude"] = tag_topics.call_claude
        for k, v in self.patches.items():
            setattr(tag_topics, k, v)

    def tearDown(self):
        for k, v in self.saved.items():
            setattr(tag_topics, k, v)
        self.tmp.cleanup()

    def write(self, ideas, topics, daily=None):
        """ideas: ids shown in data.js; topics: topics.json; daily: {date: [idea]}."""
        payload = {"ideas": [{"id": i, "title": f"Idea {i}", "summary": "s"} for i in ideas]}
        with open(self.patches["DATA_JS"], "w", encoding="utf-8") as fh:
            fh.write("window.IDEAS_DATA = " + json.dumps(payload) + ";\n")
        with open(self.patches["TOPICS_FILE"], "w", encoding="utf-8") as fh:
            json.dump(topics, fh)
        for date, items in (daily or {}).items():
            with open(os.path.join(self.patches["IDEAS_DIR"], f"{date}.json"), "w", encoding="utf-8") as fh:
                json.dump({"ideas": items}, fh)

    def run_main(self, stub, *argv):
        tag_topics.call_claude = stub
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            tag_topics.main(list(argv))
        with open(self.patches["TOPICS_FILE"], encoding="utf-8") as fh:
            return json.load(fh), out.getvalue()

    def test_retag_failed_batch_keeps_previous_entries(self):
        ids = ["2026-05-01-1", "2026-05-01-2", "2026-05-02-1", "2026-05-02-2"]
        self.write(ids, {i: A for i in ids})
        result, out = self.run_main(Stub(answer=B, fail={2}), "--retag")
        self.assertIn("FAILED", out)
        self.assertEqual(result, {"2026-05-01-1": B, "2026-05-01-2": B,
                                  "2026-05-02-1": A, "2026-05-02-2": A})

    def test_retag_off_list_answer_keeps_previous_entry(self):
        ids = ["2026-05-01-1", "2026-05-01-2"]
        self.write(ids, {i: A for i in ids})
        result, _ = self.run_main(Stub(answer=B, overrides={"2026-05-01-1": "Other"}), "--retag")
        self.assertEqual(result, {"2026-05-01-1": A, "2026-05-01-2": B})

    def test_retag_does_not_keep_a_topic_that_left_the_list(self):
        ids = ["2026-05-01-1", "2026-05-01-2", "2026-05-02-1"]
        self.write(ids, {"2026-05-01-1": A, "2026-05-01-2": A, "2026-05-02-1": "Renamed Topic"})
        result, out = self.run_main(Stub(answer=B, fail={2}), "--retag")
        self.assertNotIn("2026-05-02-1", result)
        self.assertIn("1 still untagged", out)

    def test_own_topic_is_never_tagged_and_the_untagged_still_are(self):
        own, archived = "2026-11-20-1", "2026-05-01-1"
        self.write([own, archived], {}, daily={"2026-11-20": [{"n": 1, "title": "x", "topic": A}]})
        stub = Stub(answer=B)
        result, out = self.run_main(stub)
        self.assertEqual(stub.seen, [archived])
        self.assertEqual(result, {archived: B})
        self.assertIn("(2/2 ideas have a topic)", out)

    def test_retag_keeps_an_override_of_an_own_topic(self):
        own = "2026-11-20-1"
        self.write([own], {own: B}, daily={"2026-11-20": [{"n": 1, "title": "x", "topic": A}]})
        stub = Stub(answer="Games & Puzzles")
        result, _ = self.run_main(stub, "--retag")
        self.assertEqual(stub.seen, [])
        self.assertEqual(result, {own: B})

    def test_sample_writes_nothing(self):
        ids = ["2026-05-01-1"]
        self.write(ids, {})
        result, out = self.run_main(Stub(answer=B), "--sample", "5")
        self.assertEqual(result, {})
        self.assertIn("nothing written", out)


if __name__ == "__main__":
    unittest.main()
