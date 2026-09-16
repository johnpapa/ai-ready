#!/usr/bin/env python3
"""Regenerate the risk-path tables in references/detection-tables.md from YAML.

skills/ai-ready/data/risk-paths.yml is the source of truth. The markdown is what
the agent reads. Keeping both by hand is how they drift, so the markdown between
the GENERATED markers is written from the data and CI fails if it is stale.

Run:    python3 tools/gen_detection_tables.py
Check:  python3 tools/gen_detection_tables.py --check
"""

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "skills" / "ai-ready" / "data" / "risk-paths.yml"
DOC = ROOT / "skills" / "ai-ready" / "references" / "detection-tables.md"

BEGIN = "<!-- BEGIN GENERATED: risk-paths -->"
END = "<!-- END GENERATED: risk-paths -->"


def render(data):
    lines = [
        BEGIN,
        "<!-- Generated from skills/ai-ready/data/risk-paths.yml — edit that file, then run",
        "     python3 tools/gen_detection_tables.py -->",
        "",
        "Known false positives, every one of them seen in a real repo. When one of these matches, the",
        "confirm question is not optional:",
        "",
        "| Match | Looks like | Usually is | Seen in |",
        "|---|---|---|---|",
    ]
    rows_by_id = {r["id"]: r for r in data["rows"]}
    for fp in data["false_positives"]:
        label = rows_by_id[fp["looks_like"]]["label"]
        lines.append(
            f"| `{fp['glob']}` | {label} | {fp['usually_is']} | {fp['seen_in']} |"
        )
    lines += [
        "",
        "Order matters less than honesty — a section listing risks the repo does not have is worse than a",
        "short one.",
        "",
        "| Risk | Look for | Why a human | Confirm by opening it |",
        "|---|---|---|---|",
    ]
    for r in data["rows"]:
        globs = ", ".join(f"`{g}`" for g in r["globs"])
        lines.append(f"| {r['label']} | {globs} | {r['why']} | {r['confirm']} |")
    lines += ["", END]
    return "\n".join(lines)


def main():
    data = yaml.safe_load(DATA.read_text())
    doc = DOC.read_text()

    if BEGIN not in doc or END not in doc:
        print(f"{DOC}: missing generated-block markers", file=sys.stderr)
        return 1

    head, rest = doc.split(BEGIN, 1)
    _, tail = rest.split(END, 1)
    updated = head + render(data) + tail

    if "--check" in sys.argv:
        if updated != doc:
            print(
                "detection-tables.md is stale.\n"
                "Edit skills/ai-ready/data/risk-paths.yml, then run:\n"
                "  python3 tools/gen_detection_tables.py",
                file=sys.stderr,
            )
            return 1
        print("detection-tables.md matches risk-paths.yml")
        return 0

    if updated != doc:
        DOC.write_text(updated)
        print(f"Wrote {DOC.relative_to(ROOT)}")
    else:
        print("Already up to date")
    return 0


if __name__ == "__main__":
    sys.exit(main())
