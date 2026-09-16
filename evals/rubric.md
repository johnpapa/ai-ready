# Eval rubric

Every check is binary. If you have to argue for a pass, it is a fail.

Work top to bottom against the files the skill actually generated — **read the generated files, not the
report.** The report is the skill describing itself; the files are what an agent will read next Tuesday.

---

## § Truthfulness

Failures here are the expensive ones. A reader who catches one invented number stops believing the true ones.

| id | Check | Fails if |
|---|---|---|
| `T1` | The report quotes no time saving, percentage, or multiplier | Any number appears that nothing in the run measured |
| `T2` | The medal respects its prerequisites | 🥇 shown without `AGENTS.md` nailed, or 🏆 without every 🤖 AI Context asset nailed |
| `T3` | A capped medal says so | The count would have earned a higher medal and the report does not name the missing prerequisite |
| `T4` | Nailed counts match the listed assets | The progress bar, the count, and the asset tables disagree with each other |
| `T5` | Nothing was overwritten | Any pre-existing file's content changed without being proposed as a move first |

## § Groundedness

Every generated line has to name something that exists. This is where a confident-sounding file goes wrong.

| id | Check | Fails if |
|---|---|---|
| `G1` | Every path named in `AGENTS.md` exists | Any referenced file or directory is not in the repo |
| `G2` | Every command in `AGENTS.md` runs | A build, test, or lint command fails or does not exist in the manifest |
| `G3` | No placeholders survive | Any `<...>`, `TODO`, `FIXME`, `your-project-here`, or lorem text in a generated file |
| `G4` | Maintenance matrix rows are real | A "when X changes, update Y" pair where changing X plainly does not require touching Y |
| `G5` | Mined conventions are traceable | A convention is asserted that you cannot find in an actual PR review comment |

## § The boundary

`## Never merges without a human` is the section this whole skill builds toward. It is also the easiest to get
subtly wrong, and a wrong line here is worse than a missing one.

| id | Check | Fails if |
|---|---|---|
| `B1` | Every line names a real risk in THIS repo | Any line survives the row's `confirm` question being answered honestly |
| `B2` | No known false positive was written in | A path listed in `risk-paths.yml` § `false_positives` appears as a boundary line |
| `B3` | Every line is machine-decidable | Any line needs a person to interpret it — "well-tested", "clean", "reasonable" |
| `B4` | `## Done means` has something runnable | No command, or a command that cannot produce an exit code |
| `B5` | An empty boundary is stated, not dropped | The repo has no risk surface and the section is silently missing rather than saying so in one line |

## § Restraint

The failure mode of a generator is generating. Most of these checks pass by producing nothing.

| id | Check | Fails if |
|---|---|---|
| `R1` | Security skill skipped with no surface | A `security-review` skill appears in a repo with no trust boundary |
| `R2` | Security skill is repo-specific when present | Any line would be equally true of a repo the skill has never seen |
| `R3` | Starter skill skipped on a thin matrix | A `shipping-a-change` skill appears with fewer than three real cascades |
| `R4` | Skips are explained | Anything was skipped without one line saying what and why |
| `R5` | No asset was invented to raise the score | A generated file exists that this repo has no use for |

## § Fit

Would a maintainer of this repo recognise their own project in what came out?

| id | Check | Fails if |
|---|---|---|
| `F1` | The repo type was identified correctly | A VS Code extension treated as a web app, a course treated as a library, etc. |
| `F2` | Conventions match the code | A generated convention is contradicted by the majority of existing source files |
| `F3` | Reviewer agents are answerable here | Any of the three asks a question this repo gives an agent no way to answer |
| `F4` | Existing AI config was absorbed, not duplicated | The repo had an `AGENTS.md` and a tool file, and the output restates rather than consolidates |

---

## Scoring

Count failures per section. Do not average them, and do not turn this into a number — the sections are not
worth the same, and a single-number eval score would be the exact dishonesty this rubric exists to catch.

Write the result as: **`T:0 G:1 B:0 R:2 F:0`**, then explain every non-zero.
