# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Adversarial agents, named as the general pattern the three reviewers are one instance of.** An agent
  produces something, and a *different* agent attacks it before anyone trusts it. That applies well beyond a
  diff: a security review, a migration plan, a root-cause analysis. Three properties make the second pass worth
  running — it has to be a different agent (the first one holds the reasoning that produced the output and will
  defend it), ideally on a different model (two agents on one model share blind spots), and **a clean result is
  a claim rather than a conclusion**. "The security review found nothing" is itself agent output; *what did it
  not look at?* is the question that turns a clean pass into information. Which makes the pattern recursive: an
  adversarial review that comes back clean has not itself been verified.

### Fixed

- **The `AGENTS.md` length guidance was far too generous, and framed as a target rather than a ceiling.** The
  500-line figure belongs to `SKILL.md` and does not transfer — `AGENTS.md` is read before *every* task, so its
  budget is tighter by roughly an order of magnitude. Anthropic targets under 200 lines for `CLAUDE.md`;
  community consensus for `agents.md` lands near 150; **Addy Osmani's starting point is 20–30 lines**, grown
  only in response to real agent mistakes rather than hypothetical ones.

  The mechanism matters more than the number. Frontier models reliably follow somewhere around **150–200
  instructions** before adherence degrades, and a coding agent's system prompt already spends part of that
  before your file is read. Past the limit the model summarizes and drops rules — so an over-long `AGENTS.md`
  does not merely cost more, it makes the rules that matter **less likely to be followed**. Step 2 now says
  start at 20–30 lines and treat 150 as a ceiling, because a target invites filling and this file gets worse as
  it grows.

- **This repo's `AGENTS.md` went from 176 lines to 147**, applying the corrected rule to itself. The packaging
  model moved to `docs/authoring.md` — it is reference material for shipping the skill, not something needed on
  every task. Markdown, YAML and JSON style rules that an agent can infer by opening any file in the repo were
  replaced with the two that genuinely are not inferable: the 120-character wrap and the emphasis convention.

### Fixed

- **"Everything goes in `AGENTS.md`" was the wrong rule, and this repo was the worst offender.** The
  single-source-of-truth change fixed a real problem — the same convention living in
  `.github/copilot-instructions.md` and `CLAUDE.md` and `.cursorrules`, drifting apart. But it solved a
  duplication problem by creating a context problem, and the context problem is worse because it is invisible.
  `AGENTS.md` is read **before every agent task**, so every line is paid for on every run and competes with the
  actual work for attention. This is the same argument made for `SKILL.md`'s 500-line budget, applied
  inconsistently in the same release.

  Corrected: **single source of truth means one canonical entry point, not one enormous file.** New
  `references/agents-md.md` carries the policy, and Step 2 now applies two rules.

  **The discoverability test** (Addy Osmani): *can the agent find this by reading the code?* If yes, do not
  write it down. Directory trees, tech-stack inventories and architecture summaries all fail it — the agent can
  list a directory and read `package.json`. Step 2 no longer asks for Repository Structure and Tech Stack by
  default; it asks for what is **surprising** about the repo, and nothing when the layout is conventional.
  Also new: the anchoring trap — naming a deprecated technology biases generation *even when forbidding it*, so
  prefer stating the positive rule.

  **Narrowest scope that fits.** Every task → root `AGENTS.md`. One area → a **nested `AGENTS.md`** in that
  directory, which is part of the standard rather than a workaround, with the closest file winning. One
  procedure → a skill. Lookup material → a linked doc. Target ~150 lines for the root.

  "Never split conventions across files" was too strong and is now precise: never state the same convention
  twice, but *do* split by scope.

- **This repo's own `AGENTS.md` went from 310 lines to 176**, by moving rather than deleting. The 60-line ASCII
  directory tree is gone — it failed the new test outright — replaced by the part that is genuinely not
  guessable: the six files that carry a version and must agree. Skill-authoring conventions, the full CI check
  table, and *Adding a New Skill* moved to a new `docs/authoring.md`; they are needed when changing the skill,
  not on every task.

- **`## Never merges without a human` asserted more than it meant, and would not have survived a question.**
  Telling an agent "merge it when you're done" puts a human in the loop — at delegation time — so the heading
  as written forbade something that is fine. Every generated file now carries the definition directly under the
  heading:

  > A person has to have **read this diff** before it lands. Telling an agent "merge it when you're done" is
  > approving a goal, not this change — so it does not count for anything on this list. Everywhere else it
  > counts fine, which is the point of having a list.

  Three objections it answers, with the reasoning in `references/agents-md.md`: standing approval is fine and
  the list is what makes it *safe* off the list; a human clicking merge is not the bar, because approving four
  pull requests in ninety seconds satisfies "a human merged it" and nothing else; and it is about *when* the
  decision is made, not who holds permissions — branch protection answers that one. `AGENTS.md` now counts as
  Nailed It only when the definition line is present.

### Fixed

- **The 500-line budget is now sourced, and reframed as a target rather than a rule.** `AGENTS.md` carried a
  bare `(<500 lines)` with no origin and no reason, which is exactly the kind of unattributed number this
  project spent a release removing from its own output. It turns out to be real: Anthropic's `skill-creator`
  guidance says *"Keep SKILL.md under 500 lines; if you're approaching this limit, add an additional layer of
  hierarchy along with clear pointers"* — and the mechanism is the useful part, so it is written down too. A
  skill loads in three levels and the SKILL.md body is in context **every time the skill triggers**, so a line
  only Step 11 uses is still paid for on a run that stops at Step 1. The same guidance calls the counts
  approximate, so the note now says 501 lines is not a failure — 600 lines of material three-quarters of runs
  never touch is. New maintenance matrix row points at `references/` as the remedy.

- **A generated rule named this repo's own files.** *"ALWAYS update docs to repo standards"* ended with
  *"(for this repo: `README.md`, `docs/how-it-works.md`, `AGENTS.md`, `CHANGELOG.md`)"* — inside the skill that
  gets installed into **other people's** repositories. Run against a Phaser game, it told the agent to update a
  `docs/how-it-works.md` that does not exist there. The rule now points at whatever the target repo's own
  maintenance matrix names.

### Changed

- **`SKILL.md` trimmed from 490 to 465 lines**, by moving content rather than deleting it:
  - **The medal table, the prerequisites and the "what the score doesn't measure" rule moved to
    `references/report-template.md`.** They are report rules, only needed at Step 11 — and `report-template.md`
    had been pointing *back* at `SKILL.md` for them, which is backwards ownership. `SKILL.md` keeps the 15-asset
    table, which Step 1i genuinely needs mid-run.
  - Cut a "Key detections" list in Step 1a that restated the sentence directly above it.
  - Cut a line at the end of Step 1d telling the agent to check instruction files for "duplicates,
    contradictions, stale references" — superseded by the two-failure-modes block above it, and left behind
    when split detection was added.

### Changed

- **The three generated reviewers are now called what they are: adversarial reviewers** — and the principle
  behind them is written down instead of merely implemented. Adversarial does not mean harsh and it is not a
  tone; it means the reviewer has a **different objective from the author**. Four mechanics produce that, and
  all four were already design decisions in these agents:

  1. **A question with a wrong answer.** Ask an agent to "review this pull request" and it will find it good —
     you handed it the author's goal, so it completes the author's work. Each of these asks something that can
     come back *no*.
  2. **Fresh context.** An agent that wrote the code and then reviews it is marking its own homework: it still
     holds the reasoning that produced the change, so it defends the change.
  3. **No authority to approve.** They find things. None can say the change is fine. A reviewer that can
     approve will eventually approve to be agreeable.
  4. **A narrow remit**, so it cannot trade one concern off against another to reach a comfortable overall
     opinion.

  New guidance in `references/reviewer-agents.md` on **writing a fourth one**, with those four as pass/fail
  tests, and a note that good candidates come from the questions a maintainer keeps repeating in review threads
  — which Step 0c already mines.

- **Step 4e's generated-skill skeleton moved into `references/detection-tables.md`**, next to the security
  surface table it already pointed at. Naming the adversarial principle pushed `SKILL.md` to 510 lines, past
  the documented 500-line budget; this brings it back to 490. Progressive disclosure is the escape hatch the
  skill recommends to everyone else, so it is the one this repo uses too.

### Added

- **Guidance to spread adversarial reviewers across models.** Running the same prompt through two models is not
  redundancy, it is coverage: a review agent on one model catches things an agent on another walks straight
  past, on the same diff. Three adversaries on one model is one adversary with three prompts. The report now
  says this. The `model` key is still not generated — its accepted values move between tool versions — so this
  is a recommendation to the user rather than something written into frontmatter.

### Fixed

- **The sample report is now labelled as stale instead of quietly misleading.**
  `examples/sample-report-peacock.{md,html}` was generated on 28 April 2026 against a 12-asset version, then
  hand-adjusted to 14 — so it shows neither a real run nor current output, and it predates the security skill,
  the reviewer agents, the starter skill, and the score prerequisites. Both files now carry a banner saying
  exactly that. Deliberately **not** hand-corrected to 15: a file that presents itself as the output of a real
  run should be the output of a real run, and regenerating it against `vscode-peacock` is the first job queued
  for the `evals/` harness.

## [1.4.0] — 2026-09-16

The release that made `AGENTS.md` the only file that matters, gave agents a boundary they can't cross
alone, and stopped the skill from claiming things nobody measured.

### Added

- **`AGENTS.md` now gets two sections almost no repo has** — `## Done means` and
  `## Never merges without a human`. The first states the conditions a change must meet; the second draws the
  line agents may not cross alone. Every line in both must be decidable by a machine with nobody interpreting
  it, so `npm run verify` exits 0 qualifies and "write clean code" does not. The boundary is seeded from risk
  paths actually found in the repo — migrations, API contracts, auth, billing, customer messaging,
  infrastructure, secrets, release plumbing — and lists nothing the repo does not have. `AGENTS.md` now counts
  as Nailed It only when both sections are present.

- **Reviewer agents are now generated** (`.github/agents/`) — `spec-conformance` asks whether the diff does what
  the issue asked for, `test-integrity` asks whether the tests would have failed against the old code and
  whether any were weakened or skipped, and `blast-radius` asks how hard the change is to undo and checks the
  diff against the `## Never merges without a human` boundary. Each is narrow by design and told to ignore
  everything the others own. Step 1d has always *checked* for `.github/agents/`; nothing ever generated one.
  Tracked assets go from 12 to 13 and the medal bands shift accordingly.

- **A starter skill is now generated** (`.github/skills/shipping-a-change/SKILL.md`) — built from the
  maintenance matrix and the registration chain, so the repo's hardest-won knowledge ("when you touch this you
  also have to update that") lives somewhere an agent loads automatically when it becomes relevant, rather than
  in a document somebody has to remember to read. Skipped when the matrix is thin, because a one-row skill is
  noise. Tracked assets go from 13 to 14.

- **A security skill is now generated, but only when there is real surface** (`.github/skills/security-review/`)
  — populated from what the repo actually has: an existing `SECURITY.md`, a checklist already sitting in
  `AGENTS.md`, the real trust boundaries, and security questions reviewers keep repeating. A generic security
  skill is explicitly refused: "don't hardcode secrets" is already in every model's weights, and a security file
  that reads like a blog post dilutes the rules that actually matter until people stop reading it. When no
  surface is detected the skill says so in one line instead of emitting a placeholder. New detection table
  covers web views, trust-boundary input, secrets, auth and permissions, crypto, and query construction.
  Tracked assets go from 14 to 15.

- **A Test Conventions rule for "this can't be tested" claims.** When a repo has more than one test lane,
  `AGENTS.md` now gets a rule telling agents to check the *other* lane for precedent before accepting that a
  change is uncoverable. A claim that is true for one lane is often false once another is checked, and
  "untestable" is the easiest way for a change to land with no coverage and nobody arguing. Skipped for
  single-lane repos. From a real case: `vscode-peacock#757` claimed a `vscode.env.remoteName` feature couldn't
  be covered because the mocked unit lane has no `env.remoteName` to toggle — while the host lane was already
  stubbing exactly that in another file.

- **The detection data is now testable, and tested.** `skills/ai-ready/data/risk-paths.yml` holds the risk
  globs, the reason each one needs a human, the question to answer by opening the file, and — new — a list of
  **known false positives**, every entry a line this skill actually got wrong in a real repo. The table in
  `references/detection-tables.md` is generated from that file, and CI fails if the two drift.

- **Fixture repos with known-correct answers** (`tests/fixtures/`). Four fake repo trees — a VS Code extension,
  a SaaS app, a docs site, a client SDK — each with an `expected.yml` naming which rows must match, which must
  produce **nothing**, and which false positives must fire. `tests/test_detection.py` runs them in CI. Putting
  the Peacock bug back fails the build with the exact line it wrote:
  `customer-contact: expected NO matches, got ['src/notification.ts', ...]`.

- **`evals/` — a manual eval harness for the part no script can judge.** A 24-check binary rubric across
  Truthfulness, Groundedness, The boundary, Restraint and Fit, plus a results template and the honest
  instruction to commit runs that go badly. The Peacock run is recorded as `evals/results/`'s first entry,
  labelled a partial run, because it predates the rubric and was done by hand rather than by installing the
  skill. Deliberately not scored as a single number — averaging the sections would be the exact dishonesty the
  rubric exists to catch.

### Changed

- **`AGENTS.md` is now the single source of truth** — conventions, mined PR-review rules, and the maintenance
  matrix all move into `AGENTS.md`, which Copilot, Claude Code, Codex, and Cursor all read. Tool-specific files
  become three-line pointers to it (`.github/copilot-instructions.md`, `CLAUDE.md`, `.cursorrules`), with
  Copilot's file allowed to carry genuinely Copilot-only content after the pointer since Copilot auto-loads it.
  Previously the most valuable section — the maintenance matrix — lived in a Copilot-specific file, so no other
  tool read it. Step 1d now flags duplicated guidance as drift rather than letting two agents work from two
  versions of the same standard.

- **The score is now a ceiling, not just a count.** Equal weighting was quietly dishonest: a repo can reach
  nine nailed assets on a changelog, docs, issue templates, a PR template, `dependabot.yml`, CI and a README
  contributing section — with no `AGENTS.md` at all. That repo is well maintained and not remotely AI-ready,
  and a plain count handed it 🥇. Two prerequisites fix it without inventing weights: 🥇 requires `AGENTS.md`
  nailed, 🏆 requires every 🤖 AI Context asset nailed. When a prerequisite caps the medal the report says so
  on the score line and names what would lift it, because a capped medal with no explanation reads like a bug.

- **Medal descriptions describe the repo, not a prediction about agents.** "AI agents contribute like your best
  team members" was a claim about an outcome nobody has measured. 🏆 now reads "Conventions, boundaries,
  reviewers and procedures all live in the repo" — which is simply what a 🏆 repo contains, and is checkable.

- **The report no longer opens with a promise it can't keep.** "AI agents will know your conventions, follow
  your patterns, and deliver PRs that are ready to merge" became "here's what an AI agent can learn about this
  repo from the repo itself today — and what it still has to guess."

- **`AGENTS.md` now documents exactly what CI enforces** — and, more usefully, what it doesn't. CI validates
  the skill's *packaging*: frontmatter, YAML syntax, version parity across all six manifests, Agent Skills spec
  compliance, CLI discovery, `skills.sh.json` parity. Every one of those passes on a `SKILL.md` whose
  instructions are wrong. The only thing that catches a bad instruction is running it against a real repo,
  which is why the PR template asks which one.

- **Review mining now reads agent comments and weights recency** — review threads are no longer only humans
  correcting humans, so coding-agent and review-agent comments are mined alongside human ones, and the source
  of each rule is recorded (an agent repeating itself means a rule is missing from `AGENTS.md`, which is a
  different signal than a human repeating themselves). History is read as an evolution rather than a flat list:
  recent comments count double, patterns that appear early and then stop are flagged as possibly superseded
  instead of being written up as current rules, recent-but-infrequent patterns are captured because new
  conventions are exactly the ones nobody has written down, and human/agent disagreements are surfaced rather
  than silently resolved.

- **This repo now eats its own dog food** — the writing conventions, skill-writing conventions, and the
  maintenance matrix move from `.github/copilot-instructions.md` into `AGENTS.md`, and that file becomes a
  pointer. Added `CLAUDE.md` and `.cursorrules` pointers so every tool lands in the same place. The skill tells
  other repos that duplicated guidance drifts; it should not have been keeping its own most valuable section
  somewhere only Copilot would read it.

- **Copilot install now uses the marketplace** — documented
  `copilot plugin install ai-ready@awesome-copilot` instead of installing straight from the repo. Copilot CLI
  reports direct repo, URL, and local-path installs as deprecated.

### Fixed

- **Risk-path globs produced false positives** — found by running the skill against `vscode-peacock`, where
  `src/notification.ts` matched the customer-contact row. In a VS Code extension that is an editor toast, not a
  message to a customer, and it would have written a wrong line into `## Never merges without a human`. Glob
  matches are now candidates to confirm rather than conclusions, with a table of the false positives seen in
  real repos. A wrong entry is worse than a missing one: it puts a human back into merges that never needed
  one, and it teaches the reader the section cannot be trusted.

- **Step 1d only looked for duplication, and split is the common case** — also found against `vscode-peacock`,
  whose `AGENTS.md` and `copilot-instructions.md` hold entirely different content with neither complete.
  Nothing looks wrong in a split, which is what makes it worse: a tool reading only one file silently misses
  half the repo's conventions. Step 1d now detects both and names which sections need absorbing.

- **The generated pointer files could link outside the repository.** The Step 3 template hardcoded
  `[AGENTS.md](../AGENTS.md)`, which is right from `.github/copilot-instructions.md` and wrong from `CLAUDE.md`
  or `.cursorrules` at the repo root. It fails quietly — the file still renders, the link just goes nowhere.
  The template now says the path is relative to the pointer file, with a table covering `.github/`, the root,
  and `.github/instructions/`. Found by GitHub Copilot reviewing the open stack.

- **Two instructions still routed content into a pointer file.** Step 10 said to record docs status "in
  AGENTS.md and copilot-instructions.md", and a general rule said to turn mined PR review feedback into
  "`copilot-instructions.md` rules". Both predate the single-source model and both contradict it — a pointer
  holds no content of its own, so anything written there is invisible to every tool that reads `AGENTS.md`.
  Both now target `AGENTS.md`.

- **Contributor docs said this repo has no code.** `AGENTS.md` opened with "it contains no source code to build
  or test" and listed "no runtime, build system, or test framework" — true until the detection harness landed.
  It now names Python 3 with `pyyaml`, points at `tools/` and `tests/`, and lists the two commands to run
  before pushing. `README.md`'s CI summary picks up the fixture tests and the generated-table drift check.

- **`docs/how-it-works.md` had drifted out from under the rest of this release, and one line of it was simply
  wrong.** The mechanisms table still described `.github/copilot-instructions.md` as holding "coding
  conventions", which stopped being true the moment that file became a three-line pointer — a reader following
  the docs would have put conventions in the one file most tools never read. Fixed, along with everything else
  the release changed and the docs didn't:

  - `.github/agents/` is documented as a **fourth mechanism**. It earns the slot on timing: it is the only one
    that runs *after* code exists rather than before it, so folding it into the skills section would have lost
    the thing that makes it useful.
  - The skills section said skills are read "only when a user explicitly invokes" one. They load when their
    `description` matches the work. That distinction — context is read at the start, procedure loads when it
    becomes relevant — is the entire argument for generating a starter skill, and the docs contradicted it.
  - "The 12 Steps" is now "The Steps", and 4c, 4d and 4e are described, with their skip conditions. Several
    steps can correctly end in doing nothing, which the page now says out loud.
  - The `AGENTS.md` mechanism lists `## Done means` and `## Never merges without a human`.

  Worth naming how this happened: this repo's own maintenance matrix says that changing `SKILL.md` means
  updating `docs/how-it-works.md`. Every PR in this stack ticked that box as "no change to the three
  mechanisms". That judgment was wrong four times in a row, and the matrix was right — which is a fair argument
  that a matrix row a person can wave off is worth less than one a machine can check.

- **Docs-only PRs could never merge** — `validate` is a required status check, but the CI workflow's
  `pull_request` trigger used `paths-ignore` for markdown. A PR touching only docs never ran the check, so
  branch protection blocked it forever. Removed `paths-ignore` from the `pull_request` trigger; the job takes
  about ten seconds.

### Removed

- **The "45-minute review becomes a 5-minute review" claim.** Nobody measured it. The skill now states plainly
  that the score measures what is in place, not whether agents write better pull requests, and the report
  template forbids quoting any time saving — no percentage, no multiplier. A maintainer who does track review
  time will spot an invented number and stop trusting everything around it.

- **"The Killer Feature"** as a heading, and "this is the highest-value thing the skill does" as its opening
  line. PR review mining is still the most interesting thing here; it can say what it does and let the reader
  decide that.

## [1.3.0] — 2026-09-05

### Added

- **Multi-tool support** — the skill now installs in Claude Code, OpenAI Codex, and Cursor in addition to GitHub
  Copilot, via the vendor-neutral [Agent Skills](https://agentskills.io) standard. Added `.claude-plugin/plugin.json`,
  `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, and an [Agent Plugins](https://agent-plugins.org)
  `plugin.json` at the repo root. All manifests point at the same canonical `skills/ai-ready/` — no content is
  duplicated.
- **`npx skills add johnpapa/ai-ready`** — documented as the primary install path. The open
  [skills CLI](https://github.com/vercel-labs/skills) reads the standard `skills/<name>/SKILL.md` layout and
  installs into 70+ agents, so no bespoke installer is needed. Added `skills.sh.json` so the repo renders
  correctly on the skills.sh registry.

- **Install troubleshooting** — README now covers the three failure modes users actually hit: the agent not
  picking up the skill, SHA-vs-tag marketplace clone errors, and Claude marketplace SSH auth failures.

### Fixed

- **Incomplete Codex install instructions** — the documented Codex path registered the marketplace but never
  installed the plugin. Added the required second command, `codex plugin add ai-ready@johnpapa-ai-ready`.
- **Wrong Codex invocation syntax** — Codex CLI mentions skills with `$ai-ready`, not `/ai-ready`. Documented
  the correct prefix per tool.
- **Skill not discovered outside GitHub Copilot** — the repo previously shipped only a Copilot plugin manifest, so
  Claude Code, Codex, and Cursor had nothing to discover and never invoked the skill.
- **Marketplace install metadata** — aligned `.github/plugin/plugin.json` with the released `1.2.0` skill
  version and added a CI check that fails when the plugin manifest version drifts from
  `skills/ai-ready/SKILL.md`. Marketplace refs should use a release tag such as `v1.2.0`, not a commit SHA.
  (Fixes #26)

### Changed

- **Documentation sync rule** — when skill behavior changes, update related docs to match repo standards and maintenance matrix.
- **PR conflict handling rule** — when preparing PRs, sync with the target branch and attempt conflict resolution; if conflicts remain, ask the user how to proceed.
- **PR follow-through rule** — the never-push-to-main rule now covers what happens after a PR is opened too: once CI passes, merge it (if low-risk and well-tested) or ask the user, and always report the outcome. An opened PR left unattended, with no report back, is no longer acceptable.
- **Squash + delete-branch rule** — whenever a merge happens, use squash and delete the branch afterward (local and remote).

## [1.2.0] — 2026-07-17

### Changed

- **PR comment etiquette in report flow** — Step 11b guidance now requires a single consolidated PR report comment (including immediate clarifications) and advises updating that same comment instead of posting serial clarification comments.
- **Issue/PR attribution rule** — every issue comment, PR comment, and PR body update produced by the skill must explicitly mention AI Ready (for example: `Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)`).
- **Attribution phrasing** — changed from "Generated by" to "Assisted by" throughout report footers and comment templates.

## [1.1.0] — 2026-05-19

### Added

- **Plugin manifest** (`.github/plugin/plugin.json`) — enables installation via `copilot plugin install johnpapa/ai-ready` from the terminal. Submitted as external plugin to awesome-copilot marketplace (issue #1750).

### Fixed

- **MCP config path** — changed from `.vscode/mcp.json` to `.mcp.json` at repo root (Copilot CLI dropped `.vscode/mcp.json` support). Existing `.vscode/mcp.json` files are now flagged for migration. (Fixes #24)
- **Install instructions** — fixed install command to use `copilot plugin install johnpapa/ai-ready`. (Fixes #23)

### Changed

- **CI workflow** — added `paths-ignore` to skip runs on docs-only changes

## [1.0.0] — 2026-05-15

### Changed

- **SKILL.md refactored for Agent Skills spec compliance** — split from 964 lines / ~15,800 tokens to 225 lines / ~2,800 tokens with progressive disclosure via `references/` directory
- **Frontmatter improved** — added `license: MIT`, `metadata.version: 1.0.0`, WHEN: trigger phrases, INVOKES:, FOR SINGLE OPERATIONS:, ANALYSIS SKILL prefix (sensei High score)
- **Version displayed in report output** — report now shows `Assisted by ai-ready v1.0.0`
- **Install instructions** — primary install method is now `gh skills install johnpapa/ai-ready ai-ready --scope user`
- **All references to "plugin"** updated to "skill" across README, AGENTS.md, copilot-instructions.md, CI, issue templates, PR template, SECURITY.md, and docs
- **Writing style pass** — added *Why?* explanations throughout SKILL.md for key decisions and rules, matching John Papa's Angular Style Guide voice
- **Interactive post-report flow** — instead of telling users to copy-paste commands, the skill now asks directly: _"Would you like me to create a branch and open a PR?"_
- PR creation changed from draft PR to regular PR
- **Pager prevention** — all `gh` and `git` commands now mandate `| cat` or `--no-pager` to prevent hanging sessions
- **PR review mining** (Step 0c) — expands search to 20 PRs if initial batch has no review comments, and notes when no patterns are found
- **Topic addition** (Step 11b) — checks push permissions before attempting `gh repo edit`; skips silently if no access
- **Setup steps** (Step 4) — now derives from existing CI workflow as source of truth for SDK versions and build commands
- **README Contributing** (Step 7) — if standalone CONTRIBUTING.md exists, links to it instead of duplicating content
- **Issue templates** (Step 6) — flags old-format markdown templates as "Could Be Better" with migration suggestion
- **CI workflow** (Step 5) — uses detected default branch instead of hardcoding `main`
- Contributors row rationale changed from "who to put in CODEOWNERS" to "contribution patterns" — CODEOWNERS is a human reviewer workflow, not an AI-readiness concern
- Skill now has 12 steps (was 11)

### Added

- `skills/ai-ready/references/` directory with 4 reference files:
  - `github-discovery.md` — GitHub API tables, PR mining, health gap mapping
  - `detection-tables.md` — manifest/course/monorepo detection heuristics
  - `report-template.md` — report format, HTML spec, badge, PR flow
  - `training-repos.md` — validation repo list
- "Tested Against" section in README linking to training repos
- `references/*` entry in maintenance matrix
- **"Do No Harm" principle** — safety rules: never create duplicates, never push to main/master without permission, never overwrite files, never delete without approval
- **Duplicate file prevention** — Step 1d and Step 4 check ALL known locations for `copilot-setup-steps.yml` before creating
- `Updated CHANGELOG.md` checkbox added to PR template checklist
- **Course repo detection** (Step 1a-ii) — multi-signal detection (numbered folders + README language + topics + lesson structure + no root manifest) to identify course/tutorial repos and adapt generation accordingly
- **Notebook awareness** (Step 1a) — detects `.ipynb` files and generates notebook conventions (clear outputs, pin kernel, focused cells)
- **Multi-language support** (Step 3) — repos with no dominant language get per-language convention sections instead of one blended block
- **Community workflow recognition** (Step 1c) — welcome/stale/lock workflows are recognized as valid automation, not flagged as "missing CI"
- **Monorepo area support** (Step 1j/3) — detects workspace areas and generates per-area .instructions.md files with applyTo glob patterns for scoped AI instructions
- **MCP server config generation** (Step 4b) — generates `.mcp.json` based on detected database, API, and tool dependencies
- **HTML readiness reports** (Step 11) — optional self-contained HTML report for sharing with stakeholders, triggered by user request
- **Instruction consistency checking** (Step 1d) — detects contradictions, duplicates, and stale references across AGENTS.md, copilot-instructions.md, CLAUDE.md, and .instructions.md files
- **4-level maturity model** — repos earn a medal from 🥉 Getting Started to 🏆 AI-Ready based on weighted AI-readiness percentage
- **Weighted impact scoring** — assets use a 3-tier weight system (High=3, Medium=2, Low=1), so copilot-instructions.md matters more than dependabot.yml
- **AI-Ready badge** — opt-in Shields.io badge added to README, linking back to this skill for discoverability
- **Self-consistency rule** — generated files must follow the conventions established in the same PR's `copilot-instructions.md`, so Copilot code review finds zero issues
- **Explicit asset list** — the 12 tracked assets are now enumerated with a scoring rubric (Nailed It = 1, Could Be Better = 0.5, Missing = 0)
- **Pre-existing AI Config section** in the report — repos with existing copilot-instructions.md, custom agents, or custom skills get a dedicated section acknowledging what's already there
- **Push permissions check** (Step 0b) — detects whether the user can push directly or needs a fork
- **Fork-based PR workflow** — when the user lacks push access, the skill automatically forks, pushes to the fork, and opens a cross-fork PR
- **Default branch detection** — uses `defaultBranchRef` from GitHub API instead of assuming `main`
- **Custom agents/skills enumeration** (Step 1d) — lists and describes each agent/skill found in `.github/agents/` and `.github/skills/`
- **Maintenance matrix import chain guidance** — language-specific techniques for tracing dependency graphs (.NET, Node.js, Go, Python, Rust)
- **Multi-target .NET support** (Step 4) — detects `<TargetFrameworks>` in .csproj and ensures all SDK versions are in setup steps

### Removed

- **Daily tip hook** — removed `sessionStart` prompt hook and `hooks/hooks.json`
- **Daily tip skill** — removed `skills/daily-tip/SKILL.md`
- **Plugin wrapper** — removed `.github/plugin/plugin.json`; ai-ready is now a standalone skill, not a plugin

### Fixed

- **Duplicate `copilot-setup-steps.yml` creation** — previous runs could create a second copy if the file existed at a legacy location

## [0.3.0-alpha] — 2026-04-24

### Added

- Made repo public (alpha release)
- PR template with integrity checklist and "Tested On" table
- CODEOWNERS (`@johnpapa`)
- Alpha banner in README
- GitHub repo topics and description
- CHANGELOG.md, SECURITY.md, dependabot.yml
- **Changelog evaluation** (Step 1f/9) — detects changelog location (root, docs, releases), follows pointer files, checks freshness against git tags, assesses format
- **Documentation evaluation** (Step 1g/10) — detects docs framework (Docsify, Docusaurus, MkDocs, etc.), checks nav/TOC, deploy pipeline, README linkage, assesses whether docs are needed
- Expanded analysis findings table with changelog and docs rows

### Changed

- Skill now has 11 steps (was 9)
- Bumped version to 0.3.0-alpha
- Updated docs/how-it-works.md with steps 10-11

## [0.2.0] — 2026-04-24

### Changed

- Removed custom extension (`extension.mjs`) — plugin system doesn't load extensions
- Rewrote SKILL.md Step 1 to use built-in tools (glob, grep, view) with structured analysis schema
- Skill is now fully self-sufficient — no custom tools required

### Added

- AGENTS.md — contributor guide for this repo
- `.github/copilot-instructions.md` — conventions + maintenance matrix
- `.github/workflows/copilot-setup-steps.yml` — checkout-only setup
- `.github/workflows/ci.yml` — plugin integrity validation
- Issue templates (bug report, feature request, new skill idea)
- README Contributing section with smoke test guide

### Removed

- `extensions/ai-ready-repo/extension.mjs` — replaced by skill-native analysis

## [0.1.0] — 2026-04-23

### Added

- Initial plugin: skill, extension, docs, and README
- Plugin manifest (`plugin.json`) for `copilot plugin install`
- 9-step skill procedure (`SKILL.md`)
- `analyze_repo_for_ai_readiness` extension tool
- Documentation: README, `docs/how-it-works.md`
- MIT License
