---
name: ai-ready
license: MIT
metadata:
  version: "1.4.0"
description: "**ANALYSIS SKILL** — Analyze any repository and generate AI-ready configuration — a canonical AGENTS.md, thin per-tool pointer files, skills, CI workflows, issue templates. WHEN: \"make this repo ai-ready\", \"set up AI config\", \"add copilot instructions\", \"prepare this repo for AI contributions\", \"generate AGENTS.md\". INVOKES: glob, grep, view, create, edit for repo analysis and file generation. FOR SINGLE OPERATIONS: use create/edit directly for individual config files."
---

# AI-Ready Repo Skill

## Persona

Adopt the perspective of an experienced repo maintainer. Prioritize what **reduces review burden and contributor friction**. Every file you generate should earn its place — generic boilerplate creates noise.

---

Follow these steps in order to analyze the current repository and generate all missing AI-ready configuration assets.

**First run vs. re-run:** On the first run, most assets will be missing — the skill creates them. On re-runs, it **audits** existing assets against the current codebase, checking for drift, stale content, and new conventions from recent PR reviews.

**Skipping assets:** If the user's prompt mentions skipping specific assets, respect those exclusions. Still run the full analysis, but skip generation for the excluded assets.

**Report-only mode:** If the user asks for a report without generating files (e.g., "how ai-ready is this repo?", "score this repo"), run the full analysis (Steps 0–1) and display the report (Step 11) — but skip all generation steps (Steps 2–10).

### The 11 tracked assets

Assets are grouped into three categories. Count assets with **Nailed It** status for the score.

**🤖 AI Context** — what AI agents read to understand your repo

| # | Asset | Generated in |
|---|-------|-------------|
| 1 | `AGENTS.md` | Step 2 |
| 2 | Per-tool pointer files (`.github/copilot-instructions.md`, `CLAUDE.md`, …) | Step 3 |
| 3 | Maintenance matrix (in `AGENTS.md`) | Step 2 |
| 4 | Reviewer agents (`.github/agents/`) | Step 4c |
| 5 | Starter skill (`.github/skills/`) | Step 4d |
| 6 | Security skill (`.github/skills/`, when there is surface) | Step 4e |

**🔧 Dev Workflow** — what keeps PRs clean and contributors on track

| # | Asset | Generated in |
|---|-------|-------------|
| 7 | CI workflow (`.github/workflows/ci.yml`) | Step 5 |
| 8 | Issue templates (`.github/ISSUE_TEMPLATE/`) | Step 6 |
| 9 | PR template (`.github/PULL_REQUEST_TEMPLATE.md`) | Step 6 |

**📖 Onboarding** — what helps new contributors get started

| # | Asset | Generated in |
|---|-------|-------------|
| 10 | Changelog (`CHANGELOG.md`) | Step 9 |
| 11 | Documentation (or explicit "not needed" note) | Step 10 |

**Scoring:** 🟩 Nailed It (counted) · 🟨 Could Be Better (not counted) · ⬜ Missing (not counted).
Medals, the two prerequisites that cap them, and what the score may never claim are in
[references/report-template.md](references/report-template.md) — read it in Step 11.

---

## Step 0 — Detect GitHub context automatically

The skill is GitHub-native — it discovers everything from GitHub's tools.

### 0a. Identify the repo

Run `git remote -v` to extract the GitHub `owner/repo`. If not GitHub, fall back to local-only analysis.

### 0b–0d. Fetch metadata, mine PR reviews, check community health

Use GitHub MCP tools or `gh` CLI to auto-discover repo metadata, PR review patterns, and community health gaps. See [references/github-discovery.md](references/github-discovery.md) for the full API table, PR mining technique, and health gap mapping.

Repeated reviewer feedback — from humans *and* from review agents — becomes conventions in `AGENTS.md`. Weight recent patterns more heavily, and flag an abandoned one rather than resurrecting it as a current rule.

---

## Step 1 — Analyze the codebase

GitHub context tells you *what* the repo is. Local analysis tells you *how* it works. Use glob, grep, and view combined with GitHub context from Step 0.

### 1a. Detect languages, frameworks, and repo type

Find manifest files and extract details. See [references/detection-tables.md](references/detection-tables.md) for the full manifest table, VS Code extension detection, multi-app collections, demo app patterns, and course/tutorial repo detection.

**Course repos** (3+ signals: numbered folders, lesson keywords, no primary app) adapt Steps 2–5. See detection-tables.md for the full signal list and step adaptations.

### 1b–1c. Detect test setup and CI

**Community workflows (stale, welcome, labeler) are valid automation, not missing CI.** Do not report a repo
as having no CI because its only workflow is a stale-bot.

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

### 1e–1h. Check configuration, changelog, docs, and structure

Detect `CODEOWNERS`, `dependabot.yml`, issue and PR templates, `LICENSE`, a README Contributing section,
changelog health, and docs setup. Two judgments that are not obvious: a changelog may live in a docs site
rather than `CHANGELOG.md`, so **follow pointer files before reporting one missing**; and freshness is measured
against the latest git tag, not the file's date.

### 1i. Compile findings

Produce a structured findings table combining GitHub context and codebase analysis with file-path evidence. See [references/detection-tables.md](references/detection-tables.md) for the full findings table template.

List which of the 11 assets are missing. For existing assets, compare against analysis and flag drift as "Could Be Better."

### 1j. Detect monorepo areas

If workspace config found, list areas with name, path glob, and primary stack. For large library monorepos, map cross-package dependencies. See [references/detection-tables.md](references/detection-tables.md) for details.

---

## Step 2 — Generate AGENTS.md

If missing, create `AGENTS.md` at the repo root. If it exists, compare against analysis and flag drift.

`AGENTS.md` is the **canonical entry point** for how this repo works — the one file every tool reads, and the
one place a given convention is stated. That is not the same as putting everything in it. Read
[references/agents-md.md](references/agents-md.md) before generating: what belongs, what does not, and where
the rest goes.

Two rules govern everything below.

**1. The discoverability test.** Before writing any section, ask: *can the agent find this by reading the
code?* If yes, do not write it down. `AGENTS.md` is loaded before **every** task, so every line is paid for on
every run and competes for attention with the actual work. Directory trees, tech-stack inventories and
architecture summaries all fail this test — generate them only for what is genuinely **surprising** about this
repo, and skip them entirely when the layout is conventional.

**2. Put it at the narrowest scope that fits.** Needed on every task → root `AGENTS.md`. Needed only in one
area → a **nested `AGENTS.md`** in that directory, which is part of the standard and how monorepos are meant to
scale (closest file wins). Needed only when doing one procedure → a skill (Step 4d). Lookup material → a linked
doc.

**Start at 20–30 lines** — what agents most often get wrong in this repo — and grow only when a real mistake
proves something is missing. 150 is a ceiling, not a target: past it, move something. This file gets *worse*
as it gets longer, because a model follows roughly 150–200 instructions before adherence degrades and every
line competes with the ones already there.

**Generate these. They exist nowhere in the code, so they always pass the test:**

- **Build, test and run commands** — buried in tooling config, needed on every task. Never hardcode versions;
  reference the manifest.
- **Conventions that are not inferable** — language, framework, test and style rules a reader could not derive
  from the code and its linter config. If the linter already enforces it, link the config instead of restating
  it.
- **Conventions Mined from PR Reviews** (Step 0c)
- **Adding a New [Feature/Module]** — the full registration chain: enums, index re-exports, config
  declarations. Nobody infers a registration chain by reading one file
- **Common Pitfalls** — what people get wrong here. This is experience, and it is not in the code
- **Maintenance Matrix** — what must be updated when each part of the codebase changes. Real file paths. Trace
  the actual dependency graph rather than stopping at top-level files: `.csproj` ProjectReferences, import
  chains, `mod` declarations, `__init__.py` re-exports. Keep it a table; Step 4d turns it into the *procedure*,
  so do not write the procedure here as well.

**Do not generate these unless the repo makes them surprising:** a project overview, a CI/CD section, a
repository structure section, or a tech stack list. Each costs attention on every task and tells the agent
something it can see.

A *Key Patterns and Conventions* heading is usually the conventions bullet above under a second name. Pick one.

**Test Conventions — untestable claims.** If the repo has more than one test lane — a fast mocked unit lane
plus a slower one with real framework access, or unit plus integration plus e2e — add a rule telling agents not
to take a pull request's *"this can't be tested"* at face value. Before agreeing, search the **other** lane for
existing precedent of stubbing the exact API or state the new code depends on. A claim that is true for one
lane is often false once another is checked, and "untestable" is the easiest way for a change to arrive with no
coverage and nobody arguing.

Only generate this rule when multiple lanes actually exist — skip it for a single-lane setup, where it would be
advice about a situation the repo doesn't have.

### Two sections almost no repo has — generate both

**Every line in both must be decidable by a machine with nobody interpreting it.** A command that exits
non-zero on failure passes the test. "Write clean code" does not.

**`## Done means`** — the conditions a change must meet before it is finished, derived from the repo's real
commands.

**`## Never merges without a human`** — the boundary, seeded from the risk paths actually present in this repo
and stated as paths or conditions rather than categories.

**Before writing any boundary line, check what you matched against
[`data/risk-paths.yml`](data/risk-paths.yml) § `false_positives`.** Every entry there is a line this skill got
wrong in a real repo. A wrong entry is worse than a missing one — it puts a human back into merges that never
needed one, and the first obviously-wrong line teaches the reader the section is guesswork.

Templates for both sections, and the definition line that must sit under the boundary heading, are in
[references/agents-md.md](references/agents-md.md) § Generating the two sections.

**Scoring:** `AGENTS.md` counts as **Nailed It** only when both sections are present, every line in them is
machine-checkable, and `## Never merges without a human` carries its definition line. An `AGENTS.md` without them is **Could Be Better** — it tells an agent how to work, but
nothing about what it may finish on its own.

---

## Step 3 — Generate per-tool pointer files

Generate a **short pointer** for each tool detected in Step 1d, plus `.github/copilot-instructions.md` by
default.

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

**The link is relative to the pointer file, not to the repo root:**

| Pointer file | Link |
|---|---|
| `.github/copilot-instructions.md` | `../AGENTS.md` |
| `CLAUDE.md`, `.cursorrules` (repo root) | `./AGENTS.md` |
| `.github/instructions/*.instructions.md` | `../../AGENTS.md` |

**Copilot is the one exception worth a little more.** Copilot auto-loads `.github/copilot-instructions.md` into
context, so anything genuinely Copilot-specific (and *only* that) may follow the pointer line in the same file.
Never restate conventions that already live in `AGENTS.md`.

**Never duplicate.** If an existing tool file restates `AGENTS.md`, do not silently rewrite it — flag it as
drift in the report and let the user decide (see *Do No Harm*).

**Monorepo:** Create `.github/instructions/{area-name}.instructions.md` with `applyTo` patterns for areas with
different stacks. These may carry real content, since they are scoped to paths rather than duplicating the root
conventions.

---

## Step 4b — Generate .mcp.json

If missing, generate `.mcp.json` at the repo root based on detected dependencies (databases, APIs, cloud platforms, browser automation, DevOps tools). Use `${VAR}` for secrets. Only include servers the project actually needs — do not speculatively add servers.

If `.vscode/mcp.json` exists, flag it as "Could Be Better" and suggest migrating to `.mcp.json`.

---

## Step 4c — Generate reviewer agents

If `.github/agents/` is missing or contains no reviewers, generate a starting set of **reviewer agents**.
Three cover most repos — `spec-conformance`, `test-integrity`, `blast-radius` — but **the count follows the
repo, not a rule.** Generate only the ones whose question can come back *no* here: skip `test-integrity` in a
repo with no tests, skip `blast-radius` where nothing is hard to undo. Say what you skipped and why. Full
bodies and how to add one are in [references/reviewer-agents.md](references/reviewer-agents.md).

**Tell the user to spread them across models** where their tool supports pinning one. Reviewer agents on a
single model largely miss the same things; three on one model is one reviewer with three prompts.

`blast-radius` reads the `## Never merges without a human` section written in Step 2, which is what connects
the boundary to something that actually runs.

If the repo already has agents covering these concerns, leave them and flag drift instead.

---

## Step 4d — Generate a starter skill from the maintenance matrix

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

If `.github/skills/` already has one covering this, flag drift instead.
If the matrix is thin — fewer than three real cascades — skip generation and say why; a one-row skill is noise.

---

## Step 4e — Generate a security skill, only if there is surface

**Do not generate a generic security skill.** "Don't hardcode secrets" is already in every model's
weights — a security skill that reads like a blog post is worse than none, because it dilutes the rules that
actually matter here and people stop reading it. This step exists to capture what is specific to *this* repo
and exists nowhere else.

Scan for security surface (see [references/detection-tables.md](references/detection-tables.md) § Security
surface detection). **If none is found, do not generate the skill** — say so in the report in one line, the same
way Step 4d skips a thin matrix.

If surface is found, generate `.github/skills/security-review/SKILL.md`, populated from what the repo actually
has. Sources, in priority order:

1. **Security notes already written down** — a `SECURITY.md`, a checklist inside `AGENTS.md`, comments near the
   sensitive code. It is usually already there — move it, don't invent alongside it.
2. **The surface itself** — the real handlers, the real trust boundary, named with real paths.
3. **PR review comments about security** (Step 0c) — a reviewer who keeps asking the same security question has
   written your skill for you.

The skeleton to fill is in [references/detection-tables.md](references/detection-tables.md) § Security
surface detection.

**Every line must name something real in this repo.** If a section would only restate general good practice,
drop it.

If a security skill or `SECURITY.md` already exists, propose the move and let the user decide.

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

This skill's first obligation is to leave the repo in a **better state than it found it — never worse**.

- **NEVER create duplicates** — before creating any file, check ALL known locations (canonical, legacy, and root). If a file exists anywhere, do not create another copy. Consolidate instead.
- **NEVER push directly to main/master** — always create a feature branch and open a PR for review. The only exception is if the user explicitly asks to commit to the default branch.
- **NEVER leave an opened PR unattended** — once a PR is open and CI passes, either merge it (small, well-tested, no ambiguous judgment calls) or ask the user which way to go; report the outcome either way. If CI is red or still pending, don't merge — fix it, wait, or report the blocker instead.
- **Whenever a merge happens, use squash and delete the branch afterward** — both local and remote.
- **NEVER overwrite existing files** — only create missing assets. Flag drift for user review.
- **NEVER delete files without user approval** — if consolidating duplicates or removing stale files, include the deletion in the PR for review.

### General Rules

- **NEVER open a pager** — append `| cat` to every `gh`/`git` command. Use `git --no-pager`.
- **ALWAYS show the full report** — it's the user's view into what was found and changed.
- **NEVER use markdown headings in user output** — use bold + emojis instead.
- **ALWAYS mention the AI Ready skill in issue/PR communication** — when posting to an issue or PR (body or comment), include explicit attribution such as `Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)`.
- **ALWAYS update docs to repo standards** — when generated guidance or workflows change, update the docs and changelog that *this* repo's maintenance matrix names. Do not assume a file exists because another repo has one.
- **ALWAYS handle PR conflicts proactively** — when creating PRs, sync with the target branch and attempt conflict resolution; if conflicts remain, explicitly ask the user how they want to proceed.

---

