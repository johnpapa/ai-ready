#!/usr/bin/env python3
"""Check the risk-path globs against fixture repos with known-correct answers.

What this proves: the patterns in skills/ai-ready/data/risk-paths.yml match what
we intend them to match, and — just as important — do NOT match the paths we have
already been burned by.

What this does NOT prove: that an agent following the skill reaches the same
conclusion. The agent does not run these globs literally; it reads the table and
pattern-matches. The vscode-peacock bug happened that way — `src/notification.ts`
never matched `**/notification*/**` as a glob, and got written into the boundary
anyway. So this file pins the patterns, and `false_positives` exists to give the
agent an explicit list to check itself against rather than prose it can skim.

Run: python3 tests/test_detection.py
"""

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

from globmatch import matching_paths  # noqa: E402

DATA = ROOT / "skills" / "ai-ready" / "data" / "risk-paths.yml"
FIXTURES = ROOT / "tests" / "fixtures"


def load_data():
    data = yaml.safe_load(DATA.read_text())
    rows = {r["id"]: r for r in data["rows"]}
    fps = {f["id"]: f for f in data["false_positives"]}
    return data, rows, fps


def check_fixture(name, rows, fps):
    d = FIXTURES / name
    paths = [ln.strip() for ln in (d / "files.txt").read_text().splitlines() if ln.strip()]
    expected = yaml.safe_load((d / "expected.yml").read_text())
    failures = []

    for row_id, want in (expected.get("expect_match") or {}).items():
        if row_id not in rows:
            failures.append(f"expect_match names unknown row {row_id!r}")
            continue
        got = sorted(matching_paths(rows[row_id]["globs"], paths))
        if got != sorted(want):
            failures.append(
                f"{row_id}: expected {sorted(want)}\n      got      {got}"
            )

    for row_id in expected.get("expect_no_match") or []:
        if row_id not in rows:
            failures.append(f"expect_no_match names unknown row {row_id!r}")
            continue
        got = matching_paths(rows[row_id]["globs"], paths)
        if got:
            failures.append(f"{row_id}: expected NO matches, got {sorted(got)}")

    for fp_id, want in (expected.get("expect_false_positive") or {}).items():
        if fp_id not in fps:
            failures.append(f"expect_false_positive names unknown entry {fp_id!r}")
            continue
        got = sorted(matching_paths([fps[fp_id]["glob"]], paths))
        if got != sorted(want):
            failures.append(
                f"false positive {fp_id}: expected {sorted(want)}\n      got      {got}"
            )

    return failures, len(paths)


def check_coverage(rows, fps):
    """Every row and every known false positive must appear in some fixture."""
    seen_rows, seen_fps = set(), set()
    for d in sorted(p for p in FIXTURES.iterdir() if p.is_dir()):
        exp = yaml.safe_load((d / "expected.yml").read_text())
        seen_rows |= set(exp.get("expect_match") or {})
        seen_rows |= set(exp.get("expect_no_match") or [])
        seen_fps |= set(exp.get("expect_false_positive") or {})
    failures = []
    for missing in sorted(set(rows) - seen_rows):
        failures.append(f"row {missing!r} is not exercised by any fixture")
    for missing in sorted(set(fps) - seen_fps):
        failures.append(f"false positive {missing!r} is not exercised by any fixture")
    return failures


def main():
    _, rows, fps = load_data()
    total_failures = []

    for d in sorted(p for p in FIXTURES.iterdir() if p.is_dir()):
        failures, n = check_fixture(d.name, rows, fps)
        status = "FAIL" if failures else "ok"
        print(f"  [{status}] {d.name} ({n} paths)")
        for f in failures:
            print(f"      {f}")
        total_failures += failures

    coverage = check_coverage(rows, fps)
    print(f"  [{'FAIL' if coverage else 'ok'}] fixture coverage")
    for f in coverage:
        print(f"      {f}")
    total_failures += coverage

    if total_failures:
        print(f"\n{len(total_failures)} failure(s)")
        return 1
    print(f"\nAll {len(rows)} risk rows and {len(fps)} known false positives verified.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
