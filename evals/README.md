# Evals

CI validates this skill's **packaging** — frontmatter, YAML, version parity, spec compliance, discovery. Every
one of those checks passes on a `SKILL.md` whose instructions are wrong.

`tests/test_detection.py` goes one step further and validates the **data** the instructions depend on. It would
have caught the `vscode-peacock` false positive.

Neither of them can answer the question that actually matters: **when an agent follows these instructions
against a real repo, is what comes out any good?**

Nothing can answer that automatically. Judging whether `## Never merges without a human` names the right paths
for *this* repo requires knowing the repo. So this directory holds the next best thing — a fixed rubric, run by
a person, recorded in a file, repeatable across versions.

## Running one

1. Install the skill at the version you want to evaluate:
   ```bash
   cp skills/ai-ready/SKILL.md ~/.copilot/skills/ai-ready/SKILL.md
   cp -r skills/ai-ready/references ~/.copilot/skills/ai-ready/
   cp -r skills/ai-ready/data ~/.copilot/skills/ai-ready/
   ```
2. Clone a target repo you did not write, and have not already run this against.
3. Run `make this repo ai-ready` and let it generate — do not steer it.
4. Walk [`rubric.md`](rubric.md) top to bottom. Every check is binary. Where a check fails, paste the exact
   generated line that failed it.
5. Copy [`results/TEMPLATE.md`](results/TEMPLATE.md) to `results/<date>-<owner>-<repo>.md`, fill it in, commit it.

## Picking a target repo

The rubric is only as good as what you point it at. Choose deliberately:

| Want to exercise | Pick a repo with |
|---|---|
| Risk paths (Step 2) | Migrations, auth, and a payment or messaging path |
| The skip guardrails | A static site or a docs repo — most rows should produce nothing |
| Security skill (Step 4e) | A real trust boundary — an HTTP API, a browser extension, a webview |
| Review mining (Step 0c) | A long PR history with review threads, ideally both human and bot |
| The split-file case (Step 1d) | Both an `AGENTS.md` and a `.github/copilot-instructions.md` already present |

**A repo you maintain is the worst possible target.** You already know which files are risky, so you will read
the generated boundary as correct because it matches what is in your head. Use someone else's repo, where a
wrong line looks wrong.

## Reading the results

A run is not pass/fail overall. The number that matters is **how many checks failed and which ones** — a
failure in § Truthfulness is worse than a failure in § Coverage, because a report that invents a number costs
the reader's trust in everything around it, while a thin section only costs them a section.

Record every run, including the bad ones. A results directory with only good runs in it is not evidence.
