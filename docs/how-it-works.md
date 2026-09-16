# How It Works

The AI-Ready skill prepares your repository for effective collaboration with AI coding agents — GitHub Copilot, Claude Code, OpenAI Codex, and Cursor — by generating a set of structured assets. These assets work together through three complementary mechanisms — each serving a different purpose, read at a different time, and targeting a different aspect of how AI understands your project.

---

## The Four Mechanisms

### AGENTS.md — The Single Source of Truth

**What it is:** A markdown file at the root of your repository. It is the one place your conventions live, and it is read across tools — GitHub Copilot, Claude Code, Codex, and Cursor all look for it.

**When it's read:** Before an agent writes any code. For the Copilot cloud agent, every time it starts on a pull request, issue, or task. It's the first thing it sees.

**What it contains:**

- **Repository structure** — directory layout, key files, and how the codebase is organized
- **Build commands** — how to install dependencies, compile, and run the project
- **Test commands** — how to run the test suite, what frameworks are used, and any special flags
- **Release process** — versioning strategy, deployment steps, CI/CD triggers
- **Architectural patterns** — how components are structured, naming conventions, data flow
- **Feature creation guides** — step-by-step instructions for adding new functionality
- **Language and framework conventions** — idioms, import styles, component structure, state management
- **Test conventions and code style** — naming, assertion style, mocking, formatting
- **Conventions mined from your own PR reviews** — the feedback your reviewers keep repeating
- **The maintenance matrix** — what must be updated when each part of the codebase changes
- **`## Done means`** — the conditions a change must meet to be finished, every line decidable by a machine
- **`## Never merges without a human`** — the boundary, seeded from risk paths actually present in this repo

**Think of it as:** The "new hire onboarding doc" for the AI. Just as you'd give a new developer a document explaining how the project works, what to build first, and how to ship code — AGENTS.md does the same for the coding agent.

**Why it matters:** Without AGENTS.md, the coding agent has to infer project structure from file names and code alone. With it, the agent knows exactly how to build, test, and contribute to your project from the start.

---

### Per-tool pointer files — One File, Many Doors

**What they are:** Short files that exist only because different tools look for different filenames —
`.github/copilot-instructions.md` for Copilot, `CLAUDE.md` for Claude Code, `.cursorrules` for Cursor. Each one
is a pointer, not a copy.

**What they contain:** Three lines directing the agent to `AGENTS.md`. Copilot's file is the one exception —
because Copilot auto-loads it into context, anything genuinely Copilot-specific may follow the pointer line in
that same file.

**Think of it as:** Signposts. The building is `AGENTS.md`; these just tell each visitor which door they came
through and where to go.

**Why it matters:** The moment the same convention lives in two files, they drift — and then two agents are
working from two different versions of your standards, silently. Writing it once also means you can switch
tools without rewriting anything, because the knowledge is in your repo rather than in a vendor's format.

---

### .github/skills/ — Procedures, Loaded When Relevant

**What it is:** A directory of markdown files, each containing a step-by-step procedure that can be invoked by name during a Copilot interaction.

**When it's read:** When its `description` matches what the agent is about to do — or when a user invokes it by name. That distinction is the whole point of a skill: `AGENTS.md` is read at the *start* of the work, while a skill loads at the *moment it becomes relevant*. Context is the first kind; procedure is the second.

**What it contains:**

- **A starter skill built from your maintenance matrix** (Step 4d) — the registration chain for whatever this repo adds most often, the change cascades, and the `## Done means` list from `AGENTS.md` verbatim
- **A security skill, only where there is real surface** (Step 4e) — populated from your `SECURITY.md`, your own review comments, and your actual trust boundaries. Never a generic checklist
- **Step-by-step instructions** with specific file paths, commands, and patterns to follow

**Think of it as:** A "runbook" the AI follows. Rather than explaining a multi-step process every time, you codify it once as a skill and invoke it whenever needed.

**Why it matters:** Complex, multi-step tasks (like adding a new game scene, creating an API endpoint, or scaffolding a new package) require following a specific sequence. Skills encode that sequence so the AI executes it correctly every time.

---

### .github/agents/ — Reviewers You Assign

**What it is:** A directory of agent definitions, each a reviewer with one question and an instruction to
ignore everything else. Generated in Step 4c.

**When it's read:** When you assign one to a pull request. This is the only mechanism that runs *after* code
exists rather than before it.

**What it contains:** Three reviewers that work in any repo, regardless of language or stack.

| Agent | The one question it answers |
|---|---|
| `spec-conformance` | Did we build the thing that was asked for? |
| `test-integrity` | Do the tests actually prove this change works? |
| `blast-radius` | How hard is this to undo if it's wrong? |

**Think of it as:** Three colleagues with narrow, non-overlapping remits. They're separate files rather than one
agent with three checklists so each gets its own context and its own verdict, and can't trade one concern off
against another. A reviewer with a broad remit gets muted — the same way a human who comments on everything
gets muted.

**Why it matters:** `spec-conformance` catches the failure mode that reading code never does — building the
wrong thing correctly. And `blast-radius` reads the `## Never merges without a human` section from Step 2,
which is what turns that boundary from a document into something that runs.

---

## How the Four Mechanisms Work Together

| Mechanism | Scope | Trigger | Runs |
|---|---|---|---|
| `AGENTS.md` | Whole project context and conventions | Automatic, before any work | Before code |
| Per-tool pointer files | Nothing of their own — they point at `AGENTS.md` | Automatic, per tool | Before code |
| `.github/skills/` | Task-specific procedures | When the description matches the task | During the work |
| `.github/agents/` | One review question each | When you assign one to a PR | After code exists |

Together, they form a layered system:

1. **AGENTS.md** gives the agent the big picture and the rules — what the project is, how it works, what
   "done" means, and what never merges without a person.
2. **Pointer files** make sure every tool finds it, whichever filename that tool happens to look for.
3. **Skills** provide the playbooks, loaded at the moment the work calls for them.
4. **Reviewer agents** ask the questions afterward that the first three can't — because they need a diff to
   look at.

---

## The Steps

The skill performs up to 16 steps, each serving a specific purpose. Several of them can end
in *doing nothing*, which is a result rather than a gap — a generated file nobody needs is worse than a
missing one.

### 0. GitHub Auto-Discovery

Before looking at local files, the skill pulls context directly from GitHub — repo metadata, community health score, recent merged PRs, PR review comments, CI workflows, and releases. PR review mining discovers repeated feedback patterns that become automated conventions.

### 1. Codebase Analysis

Scans the local repository for languages, frameworks, test setup, CI configuration, existing AI config, changelog, documentation, directory structure, and monorepo detection. Combined with Step 0, this produces a complete picture of the repo's current state.

### 2. AGENTS.md

The project context file for the coding agent. Contains repository structure, build/test/release commands, architectural patterns, and contribution guides. Placed at the repo root.

### 3. Per-tool pointer files

Short files for each tool that looks for its own filename — `.github/copilot-instructions.md`, `CLAUDE.md`,
`.cursorrules`. Each points at `AGENTS.md` rather than restating it.

### 4. .github/workflows/copilot-setup-steps.yml

Configuration for the Copilot coding agent's environment. Defines the setup steps the agent runs before working on your repo — installing dependencies, building the project, running any required bootstrapping. This ensures the agent's environment matches what a human developer would set up.

### 4b. .mcp.json

MCP server configuration connecting AI agents to your project's databases, APIs, and tools. Generated at the repo root (`.mcp.json`). Uses environment variable placeholders for secrets so the config is safe to commit.

### 4c. Reviewer agents (.github/agents/)

Three reviewers — `spec-conformance`, `test-integrity`, `blast-radius` — that apply to any repo regardless of
stack. Each answers exactly one question and is told to ignore everything else. Frontmatter is `name` and
`description` only; `tools`, `model` and `mcp-servers` are left for you to pin, because their accepted values
move between tool versions.

### 4d. Starter skill (.github/skills/)

Turns the maintenance matrix into a skill an agent loads when it's about to make the kind of change the matrix
covers. **Skipped when the matrix has fewer than three real cascades** — a one-row skill looks authoritative
and teaches nothing.

### 4e. Security skill (.github/skills/), when there is surface

Generated only if the repo has real security surface — web views and CSP, input crossing a trust boundary,
secrets handling, auth and permissions, crypto, query construction. **A generic security skill is explicitly
refused:** "don't hardcode secrets" is already in every model's weights, and a security file that reads like a
blog post dilutes the rules that actually matter until people stop reading it. When nothing matches, the skill
says so in one line instead of emitting a placeholder.

### 5. CI Workflow (.github/workflows/ci.yml)

A GitHub Actions workflow for continuous integration. Runs your test suite and linters on pull requests and pushes. If your repo already has CI, the skill respects the existing configuration and may suggest improvements rather than replacing it.

### 6. Issue Templates (.github/ISSUE_TEMPLATE/)

Structured issue templates that guide contributors (both human and AI) to provide the right information when filing bugs, requesting features, or proposing changes. Well-structured issues lead to better coding agent output.

### 7. README Contributing Section

A contributing guide section for your README (or a standalone CONTRIBUTING.md) that explains how to set up the development environment, run tests, and submit changes. This helps both human contributors and provides additional context for AI tools.

### 8. Maintenance Matrix

A cross-reference table embedded in `AGENTS.md` that maps "when X changes, update Y." This is one of the most valuable assets — it ensures that when code changes, the related documentation, tests, templates, and CI configuration all stay in sync. See [The Maintenance Matrix](#the-maintenance-matrix) section below for details.

### 9. Changelog Evaluation

The skill checks whether the repo has a changelog and whether it's healthy. It handles non-standard locations — some projects maintain changelogs in their docs site rather than a root `CHANGELOG.md`. The skill follows pointer files, checks freshness against git tags, and flags stale changelogs. If no changelog exists, it creates one in Keep a Changelog format.

### 10. Documentation Evaluation

The skill checks whether the repo has documentation, identifies the framework (Docsify, Docusaurus, MkDocs, VitePress, etc.), verifies the docs deploy pipeline, and checks that the README links to the docs. If docs exist, their location and conventions are documented in AGENTS.md and the maintenance matrix. If docs don't exist, the skill assesses whether they're needed based on the project type.

### 11. AI-Readiness Report

Displays the final readiness report — current score, category breakdown (AI Context, Dev Workflow, Onboarding), what was created or updated, and a projected score. Offers to create a PR with all changes and add the AI-Ready badge to the README. When the skill posts to an issue or PR thread, it includes explicit AI Ready skill attribution (`Assisted by ai-ready`), keeps docs updates aligned to repo standards, and attempts to resolve PR conflicts before asking for manual help.

---

## How the Analysis Works

Before generating any assets, the skill performs a comprehensive analysis of your repository. This is what makes the output customized rather than generic.

The skill instructs Copilot to scan your repository for:

### Languages

Detects the programming languages used by examining manifest files:

- `package.json` → JavaScript/TypeScript
- `Cargo.toml` → Rust
- `go.mod` → Go
- `requirements.txt` / `pyproject.toml` → Python
- `*.csproj` / `*.sln` → C# / .NET
- And others

### Frameworks

Identifies the frameworks and libraries in use:

- **Frontend:** React, Vue, Angular, Svelte, Phaser
- **Backend:** Express, Fastify, Django, Flask, Actix, Gin
- **Mobile:** React Native, Flutter
- **Others** based on dependency declarations

### Test Setup

Determines how testing is configured:

- **Test runner** — Jest, Vitest, Playwright, pytest, go test, cargo test
- **Test directory** — where tests live (`tests/`, `__tests__/`, `src/**/*.test.*`)
- **Test commands** — how to invoke the test suite
- **Coverage configuration** — if and how coverage is measured

### CI/CD

Examines existing continuous integration and deployment:

- **Existing workflows** — what's already in `.github/workflows/`
- **PR triggers** — whether CI runs on pull requests
- **Build steps** — what the current pipeline does
- **Deployment targets** — where and how the project is deployed

### Existing AI Configuration

Checks what AI-readiness assets already exist:

- Does `AGENTS.md` already exist? What does it contain?
- Is there a `.github/copilot-instructions.md`?
- Are there existing skills in `.github/skills/`?
- Is `.github/workflows/copilot-setup-steps.yml` configured?

### Directory Structure

Maps the layout of the repository:

- Source directories and their organization
- Asset directories (images, sounds, static files)
- Configuration files and their locations
- Documentation structure

### What's Missing

Based on all of the above, the analysis identifies gaps — which of the 15 assets are missing, incomplete, or could be improved.

### Customized Output

The AI uses this analysis to generate assets that are specific to your project. For example:

- A **Phaser game** project gets AGENTS.md content about scene lifecycle, physics setup, and sprite management — not generic web app boilerplate.
- A **Go microservice** gets copilot-instructions about error handling patterns, interface conventions, and module structure — not React component guidelines.
- A **monorepo** gets skills that understand the package structure and cross-package dependencies.

This is the key difference from template-based approaches: every generated asset reflects your actual codebase.

---

## The Maintenance Matrix

The maintenance matrix is one of the most impactful assets the skill generates. It solves a common problem: when one part of the codebase changes, other parts need to be updated to stay in sync — but it's easy to forget which parts.

### The Problem

In any non-trivial project, changes ripple:

- Add a new API endpoint → update the OpenAPI spec, add tests, update the README
- Change a database schema → update the model, migration, seed data, and related tests
- Add a new game scene → register it in the game config, add assets, create tests, update the scene list

Without a reference, these secondary updates are often missed — leading to stale docs, missing tests, and broken workflows.

### The Solution

The maintenance matrix is a structured cross-reference table that explicitly maps these relationships:

```
| When this changes...        | Also update...                                    |
|-----------------------------|---------------------------------------------------|
| `src/game/scenes/`          | `src/game/game.ts` (scene registry), tests, AGENTS.md |
| `package.json` dependencies | `.github/workflows/copilot-setup-steps.yml`, CI workflow              |
| API routes                  | OpenAPI spec, API tests, README endpoints list      |
| Database schema             | Migrations, seed data, model tests                  |
```

### Where It Lives

The maintenance matrix is embedded in `.github/copilot-instructions.md`, which means it is automatically included in every Copilot interaction. When Copilot suggests a change to a file in the "when this changes" column, it knows to also suggest or remind about the corresponding updates.

### Why It Works

- **For the coding agent:** When working on a PR, the agent sees the matrix and proactively makes the secondary updates — resulting in more complete PRs that don't miss related changes.
- **For Copilot Chat:** When discussing a change, Copilot can reference the matrix to remind you what else needs updating.
- **For code review:** PR reviewers (human or AI) can check the matrix to verify all related updates were made.

The matrix is generated based on your actual repository structure and the relationships the analysis discovers — not a generic template.
