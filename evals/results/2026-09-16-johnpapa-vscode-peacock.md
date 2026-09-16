# Eval run — johnpapa/vscode-peacock

| | |
|---|---|
| **Date** | 2026-09-16 |
| **Skill version** | 1.3.0 (unreleased) |
| **Commit** | `890931f` — the state before the fixes this run produced |
| **Agent / model** | Claude Opus 5 |
| **How it was run** | **Instructions applied by hand, not installed and invoked.** The skill's steps were read and executed against the repo's files directly. This is weaker than a real run: it tests the instructions, not the instructions-plus-an-agent-interpreting-them. |
| **Target repo** | <https://github.com/johnpapa/vscode-peacock> — VS Code extension, TypeScript, Mocha |
| **Did you write this repo?** | **Yes.** Which makes it a poor target by this harness's own advice. It was chosen for availability, and the results should be read with that discount applied. |

## Result

**Partial run — this predates the rubric.** Of the 24 checks, **4 were genuinely exercised** and the rest were
not assessed. Recording it anyway, because a harness with nothing in it is a harness nobody opens.

`T:– G:– B:1 R:0 F:1` over the checks actually performed.

## Failures

### `B2` — a known false positive was written into the boundary

```
- src/notification.ts — customer contact
```

Why it fails: in a VS Code extension that file is `window.showInformationMessage`. It is an editor toast, not
a message to a customer. The line would have put a human into every merge touching a UI notification, and the
first maintainer to read it would have concluded the section was guesswork.

Fixed in #43. It is now `toast-not-customer` in `risk-paths.yml` § `false_positives`, and
`tests/fixtures/vscode-extension/` fails the build if it comes back.

### `F4` — existing AI config was not absorbed

Peacock has `AGENTS.md` (216 lines: structure, build, test, release) **and**
`.github/copilot-instructions.md` (59 lines: TypeScript conventions, VS Code patterns, colour handling, and
the maintenance matrix). They do not overlap. Neither is complete.

Why it fails: Step 1d only looked for *duplication*, so it found nothing wrong. A split is worse than a
duplicate precisely because nothing looks wrong — a tool reading only `AGENTS.md` never sees the conventions,
and a tool reading only the Copilot file never sees how to build.

Fixed in #43. Step 1d now detects both shapes and names which sections need absorbing.

## What the run confirmed works

- **`R4` — skips are explained.** With no migrations, API contracts, auth, billing or infrastructure in the
  repo, the risk table correctly produced almost nothing and said so, rather than inventing categories.
- **`B1`, partially.** The release-plumbing row matched `.github/workflows/` correctly and survives its
  confirm question — Peacock genuinely ships from there.
- Peacock's maintenance matrix has **ten real cascades**, comfortably past the three-row threshold, so Step 4d
  reaches its generate path rather than its skip path on a mature repo.

## What this run did not exercise

A great deal, and this is the useful part:

- **No populated risk table.** Peacock has no database, no API contract, no auth boundary, no billing, no
  infrastructure. The `confirm` questions on seven of eight rows were never put to a real file.
- **No security surface** worth the name, so Step 4e was never tested on its generate path — only the skip.
- **§ Truthfulness entirely unassessed.** The medal prerequisites did not exist yet.
- **No review mining.** The twelve most recent merged PRs carried no review comments at all, so Step 0c had
  nothing to read.

**The next run should be against something with a database and an HTTP API**, owned by someone else.

## Follow-ups filed

- #43 — both failures above, fixed.
- #44 — security skill, which this run could not exercise.
- #45 — the medal prerequisites and the removed claims that § Truthfulness now checks for.
