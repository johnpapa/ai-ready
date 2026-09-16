---
name: ai-ready
license: MIT
metadata:
  version: "1.4.0"
description: "**ANALYSIS SKILL** — Analyze any repository and generate AI-ready configuration — a canonical AGENTS.md, thin per-tool pointer files, skills, CI workflows, issue templates. WHEN: \"make this repo ai-ready\", \"set up AI config\", \"add copilot instructions\", \"prepare this repo for AI contributions\", \"generate AGENTS.md\". INVOKES: glob, grep, view, create, edit for repo analysis and file generation. FOR SINGLE OPERATIONS: use create/edit directly for individual config files."
---

# AI-Ready Repo Skill

## Persona

Adopt the perspective of an experienced repo maintainer who has managed high-traffic repos and reviewed thousands of PRs. Prioritize what **reduces review burden and contributor friction**. Every file you generate should earn its place — generic boilerplate creates noise.

---

Follow these steps in order to analyze the current repository and generate all missing AI-ready configuration assets.

**First run vs. re-run:** On the first run, most assets will be missing — the skill creates them. On re-runs, it **audits** existing assets against the current codebase, checking for drift, stale content, and new conventions from recent PR reviews. The skill **never overwrites existing files without user approval**.

**Skipping assets:** If the user's prompt mentions skipping specific assets (e.g., "skip CI and issue templates"), respect those exclusions. Still run the full analysis, but skip generation for the excluded assets.

**Report-only mode:** If the user asks for a report without generating files (e.g., "how ai-ready is this repo?", "score this repo"), run the full analysis (Steps 0–1) and display the report (Step 11) — but skip all generation steps (Steps 2–10).

### The 15 tracked assets

Assets are grouped into three categories. Count assets with **Nailed It** status for the score.

**🤖 AI Context** — what AI agents read to understand your repo

| # | Asset | Generated in |
|---|-------|-------------|
| 1 | `AGENTS.md` | Step 2 |
| 2 | Per-tool pointer files (`.github/copilot-instructions.md`, `CLAUDE.md`, …) | Step 3 |
| 3 | Maintenance matrix (in `AGENTS.md`) | Step 8 |
| 4 | `.mcp.json` | Step 4b |
| 5 | `.github/workflows/copilot-setup-steps.yml` | Step 4 |
| 6 | Reviewer agents (`.github/agents/`) | Step 4c |
| 7 | Starter skill (`.github/skills/`) | Step 4d |
| 8 | Security skill (`.github/skills/`, when there is surface) | Step 4e |

**🔧 Dev Workflow** — what keeps PRs clean and contributors on track

| # | Asset | Generated in |
|---|-------|-------------|
| 9 | CI workflow (`.github/workflows/ci.yml`) | Step 5 |
| 10 | Issue templates (`.github/ISSUE_TEMPLATE/`) | Step 6 |
| 11 | PR template (`.github/PULL_REQUEST_TEMPLATE.md`) | Step 6 |
| 12 | `.github/dependabot.yml` | (checked, not generated) |

**📖 Onboarding** — what helps new contributors get started

| # | Asset | Generated in |
|---|-------|-------------|
| 13 | README Contributing section | Step 7 |
| 14 | Changelog (`CHANGELOG.md`) | Step 9 |
| 15 | Documentation (or explicit "not needed" note) | Step 10 |

**Scoring:** 🟩 Nailed It (counted) · 🟨 Could Be Better (not counted) · ⬜ Missing (not counted)

| Medal | Name | Count | Also required | What it means |
|-------|------|-------|---------------|---------------|
| 🥉 | **Getting Started** | 1–4 | — | A few of the files exist. Nothing in the repo tells an agent how it works |
| 🥈 | **On Track** | 5–8 | — | Real scaffolding is in place, but the conventions are still in people's heads |
| 🥇 | **Solid** | 9–12 | `AGENTS.md` nailed | The conventions are written down, in the one file every tool reads |
| 🏆 | **AI-Ready** | 13–15 | every 🤖 AI Context asset nailed | Conventions, boundaries, reviewers and procedures all live in the repo |

**The prerequisites are not decoration.** A repo can reach nine nailed assets on a changelog, docs, issue
templates, a PR template, `dependabot.yml`, CI and a README contributing section — with no `AGENTS.md` at all.
That repo is well maintained. It is not AI-ready, and a plain count would hand it 🥇. So the count is a ceiling,
not a score: if `AGENTS.md` is not nailed the repo stops at 🥈 however high the count goes, and if any
🤖 AI Context asset is short it stops at 🥇.

**Say so when the cap applies**, and say what would lift it:

> 11 of 15 nailed — 🥈 **On Track**, held below 🥇 because `AGENTS.md` is missing its
> `## Never merges without a human` section.

**What the score does not measure.** It measures what is *in place*. It does not measure whether agents write
better pull requests in this repo, because nothing here has measured that. Never tell the user their review
time will drop by some amount. You have no way to know, and an invented number is the fastest way to lose a
maintainer who does know.

---

## Step 0 — Detect GitHub context automatically

**Zero user input required.** The skill is GitHub-native — it discovers everything from GitHub's tools.

### 0a. Identify the repo

Run `git remote -v` to extract the GitHub `owner/repo`. If not GitHub, fall back to local-only analysis.

### 0b–0d. Fetch metadata, mine PR reviews, check community health

Use GitHub MCP tools or `gh` CLI to auto-discover repo metadata, PR review patterns, and community health gaps. See [references/github-discovery.md](references/github-discovery.md) for the full API table, PR mining technique, and health gap mapping.

Key insight: **PR review mining is the highest-value step.** Repeated reviewer feedback — from humans *and* from review agents — becomes conventions in `AGENTS.md`, weighted so recent patterns count for more and abandoned ones are flagged rather than resurrected.

---

## Step 1 — Analyze the codebase

GitHub context tells you *what* the repo is. Local analysis tells you *how* it works. Use glob, grep, and view combined with GitHub context from Step 0.

### 1a. Detect languages, frameworks, and repo type

Find manifest files and extract details. See [references/detection-tables.md](references/detection-tables.md) for the full manifest table, VS Code extension detection, multi-app collections, demo app patterns, and course/tutorial repo detection.

Key detections: lockfiles, runtime version files, monorepo markers, notebooks, VS Code extensions, multi-app collections, demo apps.

**Course repos** (3+ signals: numbered folders, lesson keywords, no primary app) adapt Steps 2–5. See detection-tables.md for the full signal list and step adaptations.

### 1b. Detect test setup

Identify test runner, find test directories (`tests/`, `__tests__/`, `spec/`, `e2e/`), extract test commands from scripts.

### 1c. Detect CI/CD

Check `.github/workflows/` for PR triggers. Check for other CI systems. Recognize community workflows (stale, welcome) as valid automation — not missing CI.

### 1d. Check existing AI configuration

Check for: `AGENTS.md`, `.github/copilot-instructions.md`, `CLAUDE.md`, `.cursorrules`, `.cursor/rules/`,
`.github/skills/`, `.github/agents/`, `.github/extensions/`, `.devcontainer/`.

**Two failure modes, and the second is the common one.** `AGENTS.md` is canonical; every other instruction
file should be a short pointer to it.

1. **Duplication** — a tool file restates conventions that also live in `AGENTS.md`. Flag as
   **Could Be Better**: duplicated guidance drifts silently, and then two agents work from two versions of the
   same standard.
2. **Split** — each file holds *different* content and neither is complete. This is what most repos actually
   have, and it is worse than duplication because nothing looks wrong. A tool reading only `AGENTS.md` never
   sees the conventions; a tool reading only the Copilot file never sees the build and test commands.

For a split, list specifically **which sections exist in the tool file but not in `AGENTS.md`** — those are
what Step 2 needs to absorb. Do not rewrite the tool file here; propose the move and let the user decide.

**copilot-setup-steps.yml** — check ALL known locations: `.github/workflows/copilot-setup-steps.yml` (canonical), `.github/copilot-setup-steps.yml` (legacy), and repo root. If found in a non-canonical location, flag it for consolidation into `.github/workflows/` — do not create a duplicate.

If multiple instruction files exist, check for duplicates, contradictions, stale references, and scope clarity. See [references/detection-tables.md](references/detection-tables.md) for drift detection details.

### 1e. Check repo configuration

Check for: `CODEOWNERS`, `dependabot.yml`, issue templates, PR template, `LICENSE`, README Contributing section.

### 1f–1g. Evaluate changelog and documentation

Assess changelog health (exists, format, freshness). Assess docs (exists, framework, navigation, deploy pipeline, README linkage).

### 1h. Scan directory structure

List top-level directories and immediate children (skip `node_modules`, `.git`, `dist`, `build`, `target`, `vendor`).

### 1i. Compile findings

Produce a structured findings table combining GitHub context and codebase analysis with file-path evidence. See [references/detection-tables.md](references/detection-tables.md) for the full findings table template.

List which of the 15 assets are missing. For existing assets, compare against analysis and flag drift as "Could Be Better."

### 1j. Detect monorepo areas

If workspace config found, list areas with name, path glob, and primary stack. For large library monorepos, map cross-package dependencies. See [references/detection-tables.md](references/detection-tables.md) for details.

---

## Step 2 — Generate AGENTS.md

If missing, create `AGENTS.md` at the repo root. If it exists, compare against analysis and flag drift. **Do not overwrite.**

`AGENTS.md` is the **single source of truth** for how this repo works. Every other instruction file points at
it. Never split conventions across files — see Step 3.

Sections: Project Overview (never hardcode versions — reference manifests), Repository Structure, Tech Stack,
Build & Run, Testing, Key Patterns and Conventions, CI/CD, Adding a New [Feature/Module] (trace the full
registration chain — enums, index re-exports, config declarations), Screen Size / Responsive Rules (UI projects
only), Common Pitfalls.

Also include, moved here from the old Copilot-only file so every tool reads them:

- **Language-Specific Conventions** (separate subsections for multi-language repos)
- **Notebook Conventions** (if `.ipynb` detected) and **Course/Lesson Conventions** (if a course repo)
- **Framework Patterns**, **Test Conventions**, **Code Style Notes** (reference linter configs)
- **Conventions Mined from PR Reviews** (Step 0c)
- **Asset/Content Rules** (if assets detected)
- **Maintenance Matrix** — what must be updated when each part of the codebase changes. Populate with real file
  paths; trace import chains and registration patterns rather than stopping at top-level files. This is the
  most valuable section in the file.

**Test Conventions — untestable claims.** If the repo has more than one test lane — a fast mocked unit lane
plus a slower one with real framework access, or unit plus integration plus e2e — add a rule telling agents not
to take a pull request's *"this can't be tested"* at face value. Before agreeing, search the **other** lane for
existing precedent of stubbing the exact API or state the new code depends on. A claim that is true for one
lane is often false once another is checked, and "untestable" is the easiest way for a change to arrive with no
coverage and nobody arguing.

This came out of a real case: `vscode-peacock#757` claimed a `vscode.env.remoteName` feature couldn't be
covered, because the mocked unit lane's `vscode` stub has no `env.remoteName` to toggle. True for that lane.
The host lane was already stubbing `vscode.env.remoteName` in another file.

Only generate this rule when multiple lanes actually exist — skip it for a single-lane setup, where it would be
advice about a situation the repo doesn't have.

### Two sections almost no repo has — generate both

Agents now open pull requests faster than anyone reads them. These two sections are what let a repo decide
which of those changes actually need a person. **Every line in both must be decidable by a machine with nobody
interpreting it** — "write clean code" fails that test; `npm run verify` exits 0 passes it.

**`## Done means`** — the conditions a change must meet before it is finished. Derive from the repo's real
commands and real conventions:

```markdown
## Done means
- `npm run verify` exits 0
- Any behavior change ships with a test that fails without the change
- Public API changes update `openapi.yaml` in the same pull request
- No new runtime dependency without a linked issue
- Generated files are never hand-edited
```

**`## Never merges without a human`** — the boundary. Seed it from the risk paths actually present in this
repo (see [references/detection-tables.md](references/detection-tables.md) § Risk path detection, generated
from [data/risk-paths.yml](data/risk-paths.yml)), then state each as a path or a condition rather than a
category.

**Before you write a line, check it against `data/risk-paths.yml` § `false_positives`.** Those are not
hypothetical — every entry is a line this skill actually got wrong in a real repo. If what you matched appears
there, answer the row's `confirm` question by opening the file, and drop the line unless the answer holds up.
That list is the one part of this step with a regression test behind it
(`tests/fixtures/`), so treat a match as a stop sign rather than a hint:

```markdown
## Never merges without a human
- Anything under `db/migrations/`
- Anything that changes the shape of an existing API response
- Anything that sends messages to customers
- Anything that grants or changes permissions
```

Only list risk paths this repo actually has — a static site has no migrations, and inventing categories to
fill the section is the noise this skill exists to avoid. If the analysis finds none, say so explicitly in one
line rather than omitting the heading.

**Scoring:** `AGENTS.md` counts as **Nailed It** only when both sections are present and every line in them is
machine-checkable. An `AGENTS.md` without them is **Could Be Better** — it tells an agent how to work, but
nothing about what it may finish on its own.

---

## Step 3 — Generate per-tool pointer files

Different tools look for different filenames. Rather than maintaining the same conventions in several places,
generate a **short pointer** for each tool the repo targets. One file holds the content; everything else points
at it.

Generate a pointer for each tool detected in Step 1d, plus `.github/copilot-instructions.md` by default:

| Tool | File |
|---|---|
| GitHub Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |

Pointer content is three lines:

```markdown
# Conventions

The conventions for this repository live in [`AGENTS.md`](<relative path>). Read that file first.
```

**The link is relative to the pointer file, not to the repo root.** `AGENTS.md` sits at the root, so the path
depends on where the pointer lives:

| Pointer file | Link |
|---|---|
| `.github/copilot-instructions.md` | `../AGENTS.md` |
| `CLAUDE.md`, `.cursorrules` (repo root) | `./AGENTS.md` |
| `.github/instructions/*.instructions.md` | `../../AGENTS.md` |

Getting this wrong points the reader outside the repository, and it fails quietly — the file still renders, the
link just goes nowhere.

**Copilot is the one exception worth a little more.** Copilot auto-loads `.github/copilot-instructions.md` into
context, so anything genuinely Copilot-specific (and *only* that) may follow the pointer line in the same file.
Never restate conventions that already live in `AGENTS.md`.

**Never duplicate.** If an existing tool file restates `AGENTS.md`, do not silently rewrite it — flag it as
drift in the report and let the user decide (see *Do No Harm*).

**Monorepo:** Create `.github/instructions/{area-name}.instructions.md` with `applyTo` patterns for areas with
different stacks. These may carry real content, since they are scoped to paths rather than duplicating the root
conventions.

---

## Step 4 — Generate copilot-setup-steps.yml

Check ALL locations first: `.github/workflows/copilot-setup-steps.yml`, `.github/copilot-setup-steps.yml`, and repo root. If one exists anywhere, do NOT create another — consolidate into `.github/workflows/` if at a legacy location.

If truly missing from all locations, create `.github/workflows/copilot-setup-steps.yml`. Steps: checkout, set up runtime, install dependencies, install test dependencies, build. Derive from existing CI when possible. For .NET multi-target, install all required SDK versions.

---

## Step 4b — Generate .mcp.json

If missing, generate `.mcp.json` at the repo root based on detected dependencies (databases, APIs, cloud platforms, browser automation, DevOps tools). Use `${VAR}` for secrets. Only include servers the project actually needs — do not speculatively add servers.

*Why?*: Copilot CLI no longer supports `.vscode/mcp.json` — the correct location is `.mcp.json` at the repo root. If `.vscode/mcp.json` exists, flag it as "Could Be Better" and suggest migrating to `.mcp.json`.

---

## Step 4c — Generate reviewer agents

If `.github/agents/` is missing or contains no reviewers, generate three agents that apply to any repository:
`spec-conformance`, `test-integrity`, and `blast-radius`. Full bodies and generation rules in
[references/reviewer-agents.md](references/reviewer-agents.md).

Each answers one question and is told to ignore everything else — a reviewer with a broad remit gets muted, the
same way a human who comments on everything gets muted. They are separate agents rather than one agent with
three checklists, so each gets its own context and its own verdict.

`blast-radius` reads the `## Never merges without a human` section written in Step 2, which is what connects
the boundary to something that actually runs.

**Never overwrite** an existing reviewer. If the repo already has agents covering these concerns, leave them and
flag drift instead.

---

## Step 4d — Generate a starter skill from the maintenance matrix

The maintenance matrix written in Step 2 already encodes the repo's hardest-won knowledge: *when you touch this,
you also have to update that.* Today it sits in a document somebody has to read. A skill is the portable
container for it — named and described, so any agent loads it when it becomes relevant.

Generate `.github/skills/shipping-a-change/SKILL.md` from the matrix plus the *Adding a New [Feature/Module]*
registration chain:

```markdown
---
name: shipping-a-change
description: What to update when you change something in this repo, and what "done" requires. Use before opening a pull request.
---

# Shipping a change

## Add a new <thing this repo adds most often>
1. <real path> — create it
2. <real path> — register it
3. <real path> — export or declare it
4. <real command> — verify

## When you change this, also change that
| Change | Also update |
|---|---|
| <real path> | <real paths> |

## Done
<the `## Done means` list from AGENTS.md, verbatim>
```

**Use real paths and real commands.** A skill full of placeholders is worse than no skill — it looks
authoritative and teaches nothing.

**Why a skill rather than another document:** `AGENTS.md` is read at the start of the work. A skill is loaded
when its description matches what the agent is about to do. Procedural knowledge belongs in the second kind —
and unlike an instructions file, a skill travels to any tool that follows the Agent Skills standard.

**Never overwrite** an existing skill. If `.github/skills/` already has one covering this, flag drift instead.
If the matrix is thin — fewer than three real cascades — skip generation and say why; a one-row skill is noise.

---

## Step 4e — Generate a security skill, only if there is surface

**Do not generate a generic security skill.** "Don't hardcode secrets" is already in every model's weights;
writing it to a file adds noise and teaches nothing. This step exists to capture the security knowledge that is
specific to *this* repo and exists nowhere else.

Scan for security surface (see [references/detection-tables.md](references/detection-tables.md) § Security
surface detection). **If none is found, do not generate the skill** — say so in the report in one line, the same
way Step 4d skips a thin matrix.

If surface is found, generate `.github/skills/security-review/SKILL.md`, populated from what the repo actually
has. Sources, in priority order:

1. **Security notes already written down** — a `SECURITY.md`, a checklist inside `AGENTS.md`, comments near the
   sensitive code. This is the highest-value input and it is usually already there. Move it, don't invent
   alongside it.
2. **The surface itself** — the real handlers, the real trust boundary, named with real paths.
3. **PR review comments about security** (Step 0c) — a reviewer who keeps asking the same security question has
   written your skill for you.

```markdown
---
name: security-review
description: The security rules specific to this repo — trust boundaries, what must never be trusted, and what to check before merging. Use when touching <the real surfaces found>.
---

# Security review

## Trust boundaries in this repo
<real paths, and what crosses them>

## Never
<the repo's real invariants — from SECURITY.md, AGENTS.md, or reviewer comments>

## Before merging a change to <real path>
<the actual checklist>
```

**Every line must name something real in this repo.** If a section would only restate general good practice,
drop the section. A security skill that reads like a blog post is worse than none — it dilutes the rules that
actually matter here, and people stop reading it.

**Never overwrite** an existing security skill or `SECURITY.md`. Propose the move and let the user decide.

---

## Step 5 — Generate CI workflow

If no PR-triggered workflow exists, create `.github/workflows/ci.yml` with: `pull_request` + `push` triggers with `paths-ignore` for docs/config, a build-and-test job matching the project's actual toolchain. Use the **default branch** detected in Step 0b — do not hardcode `main`. Never modify existing workflows.

---

## Step 6 — Generate issue templates and PR template

If missing, create bug report and feature request YAML forms, plus a PR template with description, changes, how-to-test, and checklist (derived from maintenance matrix). Note old-format `.md` templates as "Could Be Better."

---

## Step 7 — Update README Contributing section

If README exists but has no Contributing section: link to `CONTRIBUTING.md` if it exists, otherwise add a Contributing section with fork/branch/PR instructions and test commands. Never rewrite the rest of the README.

---

## Step 8 — Verify maintenance matrix

Verify the matrix in `AGENTS.md` covers file cross-references, change cascades, and cross-cutting concerns. Trace actual dependency graphs per language (`.csproj` ProjectReferences, import chains, `mod` declarations, `__init__.py` re-exports).

---

## Step 9 — Evaluate and improve changelog

If missing, create `CHANGELOG.md` with Keep a Changelog format. If a pointer file, verify the target. If stale, flag with dates. Document non-standard locations in AGENTS.md.

---

## Step 10 — Evaluate and improve documentation

If docs exist, record their location, framework, and conventions in `AGENTS.md` — not in a pointer file, which holds no content of its own. If missing, assess whether they are needed by project type. Always document docs status in `AGENTS.md`.

---

## Step 11 — Display the AI-Readiness Report

Display the report using the format in [references/report-template.md](references/report-template.md). Include the skill version from frontmatter `metadata.version` at the bottom of the report (e.g., `Assisted by ai-ready v1.0.0`). Then:
1. Add AI-Ready badge (see report-template.md § 11a)
2. Offer to create PR (see report-template.md § 11b)

---

## Important Rules

### Do No Harm

This skill's first obligation is to leave the repo in a **better state than it found it — never worse**. Every rule below serves this principle.

- **NEVER create duplicates** — before creating any file, check ALL known locations (canonical, legacy, and root). If a file exists anywhere, do not create another copy. Consolidate instead.
- **NEVER push directly to main/master** — always create a feature branch and open a PR for review. The only exception is if the user explicitly asks to commit to the default branch.
- **NEVER leave an opened PR unattended** — once a PR is open and CI passes, either merge it (small, well-tested, no ambiguous judgment calls) or ask the user which way to go; report the outcome either way. Opening a PR and going quiet is not acceptable. If CI is red or still pending, don't merge — fix it, wait, or report the blocker instead.
- **Whenever a merge happens, use squash and delete the branch afterward** — both local and remote. Don't leave merged branches lying around.
- **NEVER overwrite existing files** — only create missing assets. Flag drift for user review.
- **NEVER delete files without user approval** — if consolidating duplicates or removing stale files, include the deletion in the PR for review.

### General Rules

- **NEVER open a pager** — append `| cat` to every `gh`/`git` command. Use `git --no-pager`.
- **ALWAYS customize to the repo's actual stack** — never produce generic boilerplate.
- **Self-consistency** — every generated file must follow the conventions you establish. Cross-check before finalizing.
- **GitHub-native by default** — auto-discover via MCP tools and `gh` CLI. Fall back to local analysis.
- **Mine PR reviews** — turn repeated review feedback into `AGENTS.md` conventions, where every tool reads them.
- **Be specific** — real file paths, real commands, real patterns.
- **Use `create` to write new files** — never `edit` from scratch.
- **Run full analysis first (Steps 0–1)** — never guess.
- **ALWAYS display the report at the end** — never skip or abbreviate.
- **NEVER use markdown headings in user output** — use bold + emojis instead.
- **ALWAYS mention the AI Ready skill in issue/PR communication** — when posting to an issue or PR (body or comment), include explicit attribution such as `Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)`.
- **ALWAYS update docs to repo standards** — when generated guidance or workflows change, update related docs and changelog per the repo's maintenance matrix (for this repo: `README.md`, `docs/how-it-works.md`, `AGENTS.md`, `CHANGELOG.md`).
- **ALWAYS handle PR conflicts proactively** — when creating PRs, sync with the target branch and attempt conflict resolution; if conflicts remain, explicitly ask the user how they want to proceed.

---

## Training Repos

See [references/training-repos.md](references/training-repos.md) for the full list of repos used to validate this skill's heuristics.
