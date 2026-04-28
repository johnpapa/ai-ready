---
name: ai-ready
description: Analyze any repository and generate AI-ready configuration — AGENTS.md, copilot-instructions.md, skills, CI workflows, issue templates, and more. USE THIS SKILL when the user asks to "make this repo ai-ready", "set up AI config", "add copilot instructions", "prepare this repo for AI contributions", or similar. This skill analyzes the repo's code, tests, CI, and structure, then generates customized assets that teach AI agents and human contributors how to work in the repo correctly.
---

# AI-Ready Repo Skill

## Persona

When executing this skill, adopt the perspective of an experienced open source and enterprise repo maintainer — someone who has managed high-traffic repos, reviewed thousands of PRs, and felt the pain of repeating the same feedback on every contribution.

Prioritize what **reduces review burden and contributor friction**. Don't just generate config files — generate config that solves real problems:

- A maintenance matrix that catches the files contributors always forget to update
- Conventions mined from PR reviews that stop the same mistakes from recurring
- An AGENTS.md that answers the questions maintainers are tired of re-explaining
- CI that catches broken PRs before a human has to look at them

Every decision you make should pass this test: **"Would an experienced maintainer want this in their repo?"** If the answer is no, leave it out.

---

When invoked, follow these steps in order to analyze the current repository and generate all missing AI-ready configuration assets.

**First run vs. re-run:** The skill runs the same analysis every time. On the first run, most assets will be missing and the skill creates them. On re-runs, the skill **audits** existing assets against the current state of the codebase — checking for drift, stale content, and new conventions from recent PR reviews. It reports what's drifted in "Could Be Better" with specific suggestions, but **never overwrites existing files without user approval**. Only truly missing assets are created automatically.

---

## Step 0 — Detect GitHub context automatically

**This step requires zero user input.** The skill is GitHub-native — it automatically discovers everything about the repo from GitHub's own tools and services.

### 0a. Identify the repo

Run `git remote -v` or `git config --get remote.origin.url` to extract the GitHub `owner/repo`. This is your identity — everything else flows from it. If the remote is not GitHub, fall back to local-only analysis in Step 1.

### 0b. Fetch repo metadata from GitHub

Use the GitHub MCP tools (if available) or `gh` CLI to pull rich context the user should never have to explain:

| What to fetch | Tool / Command | What you learn |
|---------------|---------------|----------------|
| Repo description, topics, visibility | `github-mcp-server-get_file_contents` on `/` or `gh repo view --json description,topics,isPrivate,primaryLanguage` | What this project is about, how it's categorized |
| Language breakdown | `gh api repos/{owner}/{repo}/languages` (bash) | Accurate language percentages (better than guessing from files) |
| Community health | `gh api repos/{owner}/{repo}/community/profile` (bash) | Which community files exist (CONTRIBUTING, CODE_OF_CONDUCT, license, issue templates) — GitHub already knows this |
| Contributors | `gh api repos/{owner}/{repo}/contributors --jq '.[].login'` (bash) | Team size, contribution patterns |
| Open issues | `github-mcp-server-list_issues` or `gh issue list` | Active problems, what the project cares about |
| Recent merged PRs | `gh pr list --state merged --limit 10 --json title,body,files` (bash) | Contribution patterns — what files get touched together, what a typical PR looks like |
| PR review comments | `github-mcp-server-pull_request_read` on recent PRs | **Repeated review feedback = conventions that should be in copilot-instructions.md** |
| Releases | `gh release list --limit 5` (bash) | Release cadence, versioning scheme |
| GitHub Actions workflows | `github-mcp-server-actions_list` or read `.github/workflows/` | CI/CD setup, what runs on PRs |
| Branch protection | `github-mcp-server-list_branches` | Default branch, protection rules |

### 0c. Mine PR review comments for conventions

This is the highest-value GitHub-native insight. Look at the 5-10 most recent merged PRs:

1. Use `github-mcp-server-list_pull_requests` (state: closed, sort: updated) to find recent merged PRs
2. For each, use `github-mcp-server-pull_request_read` (method: get_review_comments) to read review threads
3. Look for **repeated patterns** — the same feedback given across multiple PRs becomes a convention:
   - "Please add tests for this" → add to test conventions
   - "Use X pattern instead of Y" → add to coding conventions
   - "Update the docs when you change this" → add to maintenance matrix
   - "Don't forget to update the changelog" → add to maintenance matrix

These mined conventions go directly into `copilot-instructions.md` — turning repeated human review feedback into automated AI guidance.

### 0d. Check community health gaps

GitHub's community health API tells you exactly what's missing. Map it to the assets this skill generates:

| GitHub says missing | Skill generates |
|-------------------|-----------------|
| No issue templates | `.github/ISSUE_TEMPLATE/` (Step 6) |
| No pull request template | Can suggest adding one |
| No CONTRIBUTING guide | README Contributing section (Step 7) |
| No CODE_OF_CONDUCT | Can suggest adding one |
| No license | Flag in the report |
| No README | Flag in the report |

---

## Step 1 — Analyze the codebase

With GitHub context from Step 0, now scan the local codebase for deeper technical details. Use built-in tools (glob, grep, view) and the GitHub context together.

### 1a. Detect languages and frameworks

Use glob to find manifest files. Read each one with view to extract details:

| Manifest | Language | What to extract |
|----------|----------|-----------------|
| `package.json` | JavaScript/TypeScript | dependencies, devDependencies, scripts (build, test, lint, typecheck), engines.node |
| `Cargo.toml` | Rust | workspace members, dependencies, build/test profile |
| `go.mod` | Go | module name, Go version |
| `pyproject.toml` or `requirements.txt` | Python | dependencies, build system, scripts, python version |
| `*.csproj` or `*.sln` | C# / .NET | target framework, package references, test SDK |
| `Gemfile` | Ruby | dependencies, ruby version |
| `pom.xml` or `build.gradle` | Java | dependencies, plugins, build tasks |

Also check for:
- **Lockfiles** — `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`, `Cargo.lock`, `go.sum`, `poetry.lock`, `Pipfile.lock`
- **Runtime version files** — `.nvmrc`, `.node-version`, `.python-version`, `.tool-versions`, `.ruby-version`, `rust-toolchain.toml`
- **Monorepo markers** — `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, `turbo.json`, Cargo workspace, Go workspace

### 1b. Detect test setup

- Identify test runner from dependencies (Jest, Vitest, Playwright, pytest, go test, cargo test, xUnit, NUnit, RSpec, etc.)
- Find test directories: `tests/`, `test/`, `__tests__/`, `spec/`, `e2e/`, `*_test.go`, `**/*.test.*`
- Extract test commands from scripts (npm test, pytest, cargo test, dotnet test, etc.)

### 1c. Detect CI/CD

- Check `.github/workflows/` — read each YAML file to determine triggers (`pull_request`, `push`), jobs, and steps
- Note whether PR checks already exist
- Check for other CI systems: `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/`, `azure-pipelines.yml`

### 1d. Check existing AI configuration

Check whether each of these exists:
- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/copilot-setup-steps.yml`
- `.github/skills/` (any skill files)
- `.github/extensions/` (any extension files)

### 1e. Check repo configuration

Check whether each of these exists:
- `.github/CODEOWNERS` or `CODEOWNERS`
- `.github/dependabot.yml`
- `.github/ISSUE_TEMPLATE/` (any templates)
- `.github/PULL_REQUEST_TEMPLATE.md`
- `LICENSE` or `LICENSE.md`
- `README.md` with a `## Contributing` section (grep for it)

### 1f. Evaluate changelog

Check for a changelog and assess its health:

1. **Find the changelog** — look for `CHANGELOG.md` at the repo root. If it exists, read it. If it's a pointer file (e.g., "See the changelog in our docs"), follow the pointer and read the actual changelog content.
2. **Check alternative locations** — if no root changelog, check `docs/changelog/`, `docs/CHANGELOG.md`, GitHub Releases (via the GitHub MCP tools if available), or a docs site changelog page.
3. **Assess format** — is it Keep a Changelog format, a flat list, GitHub Releases only, or a docs-site page? Note the format.
4. **Assess freshness** — compare the most recent changelog entry against the latest git tag (`git tag --sort=-v:refname | head -1`). If the changelog is significantly behind the latest release, flag it as stale.
5. **Note non-standard locations** — if the changelog lives somewhere other than `CHANGELOG.md` at the root, this is acceptable but should be noted. The root file should at minimum link to the real location.

### 1g. Evaluate documentation

Check if the repo has documentation and assess its health:

1. **Find documentation** — check for `docs/`, `documentation/`, a docs config file (`docusaurus.config.js`, `mkdocs.yml`, `docs/index.html`, `.vitepress/`, `_config.yml`), or a wiki link.
2. **Detect framework** — if docs exist, identify the framework: Docsify, Docusaurus, MkDocs, VitePress, Jekyll, Hugo, or plain markdown.
3. **Check navigation** — does the docs site have a sidebar, table of contents, or nav config? (e.g., `_sidebar.md`, `sidebars.js`, `mkdocs.yml nav:`, `_config.yml`)
4. **Check deploy pipeline** — is there a GitHub Actions workflow that builds/deploys docs? (look in `.github/workflows/` for docs-related workflows)
5. **Check README linkage** — does the README link to the docs site or docs directory?
6. **Assess whether docs are needed** — if no docs exist, consider the project type. Libraries with public APIs, frameworks, and tools with complex configuration generally need documentation. Simple utilities or single-file projects may not.

### 1h. Scan directory structure

List the top-level directories and their immediate children (skip `node_modules`, `.git`, `dist`, `build`, `target`, `vendor`, `__pycache__`, `.venv`).

### 1i. Compile findings

Before proceeding, produce a structured summary combining GitHub context (Step 0) and codebase analysis (Step 1). Include file-path evidence for each finding:

| Category | Finding | Evidence (source) |
|----------|---------|-------------------|
| Repo | e.g., johnpapa/ai-ready | `git remote -v` |
| Description | e.g., "Copilot CLI plugin..." | GitHub API / repo metadata |
| Topics | e.g., copilot, skills, ai-ready | GitHub API |
| Language | e.g., TypeScript (65%), Rust (30%) | GitHub API language breakdown |
| Framework | e.g., React, Phaser | `package.json` dependencies |
| Test runner | e.g., Vitest | `package.json` devDependencies |
| Test command | e.g., `npm test` | `package.json` scripts.test |
| Build command | e.g., `npm run build` | `package.json` scripts.build |
| Runtime version | e.g., Node 22 | `.nvmrc` or `package.json` engines |
| Package manager | e.g., pnpm | `pnpm-lock.yaml` exists |
| Contributors | e.g., 3 contributors | GitHub API |
| Team size | e.g., solo / small / large | Contributor count |
| PR CI exists | yes/no | `.github/workflows/` or GitHub Actions API |
| Community health | e.g., 71% | GitHub API community/profile |
| PR review patterns | e.g., "maintainer often asks for tests" | Mined from recent PR review comments |
| Release cadence | e.g., monthly, tagged releases | GitHub Releases API |
| AGENTS.md | exists / missing | repo root |
| copilot-instructions.md | exists / missing | `.github/` |
| Changelog | exists / pointer / missing | `CHANGELOG.md`, Releases |
| Changelog freshness | current / stale | latest entry vs latest git tag |
| Docs exist | yes / no | `docs/`, config file |
| Docs framework | Docsify / Docusaurus / etc. | config file path |
| Docs deploy pipeline | yes / no | workflow file path |
| README links to docs | yes / no | README.md link |

**List which of the 9 assets are missing and need to be created.** Do NOT overwrite existing files — only create assets that don't exist yet.

**For existing AI-ready assets**, read their current contents and compare against your analysis. Flag drift in any of these dimensions:

| Asset | What to compare |
|-------|----------------|
| `AGENTS.md` | Repo structure still accurate? Build/test commands still correct? Tech stack changed? |
| `copilot-instructions.md` | New conventions from recent PR reviews? Maintenance matrix still covers current file relationships? |
| `copilot-setup-steps.yml` | Runtime versions match? Install/build commands still correct? New dependencies? |
| CI workflow | Build/test/lint commands still match the project? New tools added? |
| Issue templates | Still relevant to the project type? |
| README Contributing | Links still valid? Commands still correct? |

For each existing asset where you find drift, classify it as **"Could Be Better"** in the report with a specific suggestion (e.g., "AGENTS.md lists Node 18 but `.nvmrc` now says Node 22"). Do not silently skip existing files — always evaluate them.

---

## Step 2 — Generate AGENTS.md

If `AGENTS.md` does not already exist at the repository root, create it with the following sections (all content must be derived from the analysis in Step 1 and from inspecting the actual repo).

If `AGENTS.md` already exists, read it and compare against the current analysis. Flag any drift (e.g., outdated repo structure, stale build commands, missing sections) as a "Could Be Better" suggestion in the report. **Do not overwrite** — suggest specific updates and let the user decide.

Sections to include (or verify):

- **Project Overview** — derived from README, package.json, pyproject.toml, Cargo.toml, or similar manifest files. **Never hardcode the project/package version** — reference the manifest file for it (e.g., "See `package.json` for the current version") so the file doesn't go stale. Runtime/tool versions may be included when they are derived from the repo (e.g., `.nvmrc`, `engines`, `.python-version`, CI/workflow files, or other manifests/config).
- **Repository Structure** — a directory tree showing the key folders and what they contain.
- **Tech Stack** — languages, frameworks, runtimes, and major dependencies.
- **Build & Run** — exact commands to install dependencies, build, and run the project locally.
- **Testing** — test runner, how to run tests, any special setup required (e.g., browser drivers, database fixtures).
- **Key Patterns and Conventions** — architectural patterns, naming conventions, module structure, and any patterns inferred from the codebase (e.g., "all API routes live in `src/routes/`", "scenes extend BaseScene").
- **CI/CD** — summary of existing CI workflows, what triggers them, and what they do.
- **Adding a New [Feature/Module]** — a step-by-step guide customized to the project type (e.g., "Adding a New Game" for a game project, "Adding a New API Endpoint" for a web API, "Adding a New Command" for a CLI tool). **Trace the full registration chain** — don't just list the obvious files. Follow imports to find enum definitions, type registries, index re-exports, and config declarations that must also be updated. For example, if commands are registered in `extension.ts` but their IDs come from an enum in `models/enums.ts`, include both files.
- **Screen Size / Responsive Rules** — include this section only if the project is a frontend or UI project.
- **Common Pitfalls** — things that frequently trip up contributors (e.g., "run `npm run build:frontend` before tests", "version must be updated in three files"). **If the analysis found any pointer files or non-standard locations** (e.g., a root `CHANGELOG.md` that redirects to `docs/changelog/`), call this out explicitly as a pitfall so agents edit the real file, not the pointer.

---

## Step 3 — Generate .github/copilot-instructions.md

If `.github/copilot-instructions.md` does not already exist, create it with:

If it already exists, read it and compare against the current analysis — especially new PR review patterns from Step 0c that aren't yet captured as conventions, and maintenance matrix entries that no longer reflect the current file structure. Flag drift as "Could Be Better" suggestions.

Content to include (or verify):

- **Language-Specific Conventions** — coding style, idioms, and patterns for the project's primary language(s) (TypeScript, Python, Go, Rust, etc.), derived from the analysis.
- **Framework Patterns** — how the project uses its framework(s) (React component patterns, Express middleware conventions, Django app structure, etc.).
- **Conventions Mined from PR Reviews** — if Step 0c found repeated review feedback, include those as explicit conventions. For example, if the maintainer frequently asks "add tests for new features," make that a rule. This is the highest-value section — it turns human review fatigue into automated AI guidance.
- **Test Conventions** — which test runner to use, naming patterns for test files, what to test (unit, integration, e2e), how to run tests.
- **Code Style Notes** — inferred from linter/formatter configs if present (ESLint, Prettier, Black, Ruff, rustfmt, etc.). Reference the config files rather than duplicating rules.
- **Asset and Content Rules** — include only if the project has static assets (images, sounds, fonts, etc.). Cover naming conventions, file formats, and where assets live.
- **Maintenance Matrix** — this is critical. Define what must be updated when different parts of the codebase change:

  | Change Made | Files to Update |
  |---|---|
  | New feature added | List the specific files, configs, registries, docs, and tests that must be created or updated |
  | Existing feature modified | List what else must change (tests, docs, related modules) |
  | Shared/common code changed | List all consumers and dependents to check |
  | Build or tooling changed | List CI configs, Dockerfiles, setup scripts to update |
  | Project structure changed | List AGENTS.md, README, import paths, CI paths to update |

  Populate the matrix with **real file paths and real patterns** from the repo. **Trace import chains and registration patterns** — don't stop at the obvious top-level files. Follow imports to find enum definitions, type interfaces, index re-exports, config declarations, and other files in the dependency chain. For example, if a new command requires updating both `commands.ts` and an enum in `models/enums.ts`, include both. If a feature has a registration step in an index file, include that too. **If the analysis found pointer files or non-standard locations** (e.g., a changelog that lives in `docs/changelog/` instead of the root), use the real path in the matrix — never reference the pointer file.

---

## Step 4 — Generate .github/copilot-setup-steps.yml

If `.github/copilot-setup-steps.yml` does not already exist, create it with steps to:

If it already exists, read it and verify that runtime versions, install commands, and build steps still match the current project. Flag any mismatches as "Could Be Better" suggestions.

Steps to include (or verify):

- Check out the repository
- Set up the language runtime (Node.js, Python, Go, Rust, .NET, etc.) at the correct version
- Install project dependencies (npm install, pip install, go mod download, cargo fetch, etc.)
- Install test dependencies if separate (e.g., Playwright browsers, test fixtures)
- Build the project (if a build step is required before tests can run)

Base every step on the analysis results from Step 1. Use the exact commands and versions the project actually uses.

---

## Step 5 — Generate CI workflow

Check `.github/workflows/` for any existing workflow that triggers on `pull_request`. If none exists, create `.github/workflows/ci.yml` with:

- **Triggers:** `pull_request` (all branches) and `push` to `main`
- **Jobs:** A build-and-test job that:
  - Checks out the code
  - Sets up the correct language runtime
  - Installs dependencies
  - Runs linting (if a lint command exists)
  - Builds the project
  - Runs the test suite
- Match the project's actual build/test toolchain from the analysis

**Do NOT modify or replace any existing workflow files.**

---

## Step 6 — Generate issue templates

If `.github/ISSUE_TEMPLATE/` does not already exist, create:

- **Bug Report** (`bug-report.yml`) — a structured issue form with fields relevant to the project type (steps to reproduce, expected vs. actual behavior, environment details, screenshots if UI project).
- **Feature Request** (`feature-request.yml`) — a structured form for proposing new features (description, motivation, alternatives considered).
- **Project-Specific Templates** — if the project type warrants it, add a third template (e.g., "New Game Proposal" for a game project, "New Integration" for a platform with plugins, "API Change" for an API-heavy project).

Use the YAML issue form format (not the older markdown template format).

---

## Step 7 — Update README Contributing section

If `README.md` exists at the repo root but does not contain a "Contributing" section (search for `## Contributing` or `# Contributing`):

- Add a `## Contributing` section near the end of the README with:
  - A suggestion to use Copilot CLI for contributions, with an example prompt in a code block:
    ```
    Add a new [feature/command/endpoint] called X that does Y
    ```
  - How to fork, branch, and submit a PR
  - How to run tests locally (exact commands)
  - A link to `AGENTS.md` for the full contributor guide
- **Do NOT rewrite or restructure the rest of the README** — only append the Contributing section.

If a Contributing section already exists, skip this step.

---

## Step 8 — Verify maintenance matrix

The maintenance matrix should already be part of `copilot-instructions.md` (generated in Step 3). Verify that it covers:

- What files reference each other (e.g., a game registry that must be updated when a new scene is added)
- What must be updated when different parts of the codebase change
- Cross-cutting concerns (e.g., version numbers in multiple files, route registrations, module re-exports)

If the matrix is missing or incomplete, suggest specific additions in the report. If `copilot-instructions.md` was just created in Step 3, add the matrix directly. If it already existed before this run, report the gaps as "Could Be Better" and let the user decide.

---

## Step 9 — Evaluate and improve changelog

Based on the changelog analysis from Step 1f:

### If no changelog exists at all:
- Create `CHANGELOG.md` at the repo root with a Keep a Changelog format header and an initial `[Unreleased]` section
- If the project has git tags or GitHub Releases, populate it with entries from the most recent releases

### If a changelog exists but is a pointer file:
- This is acceptable — some projects maintain their changelog in a docs site. **Do not overwrite the pointer file.**
- Verify the pointer target actually exists and contains real changelog content
- If the pointer target is missing or empty, flag this in the summary as needing attention
- If the root `CHANGELOG.md` doesn't clearly link to the real location, suggest adding a direct link

### If a changelog exists but is stale:
- Flag this in the summary with the date of the last entry vs. the latest release/tag
- Suggest the maintainer update it, but **do not auto-generate changelog entries** — the maintainer knows what changed

### Changelog in AGENTS.md:
- If the project maintains a changelog in a non-standard location, document this in `AGENTS.md` so AI agents know where to find and update it

---

## Step 10 — Evaluate and improve documentation

Based on the documentation analysis from Step 1g:

### If documentation exists:
- **Include in AGENTS.md** — add a "Documentation" section noting the framework, location, and how to build/preview docs locally
- **Include in copilot-instructions.md** — add docs conventions (where docs live, naming, how to update them when code changes)
- **Add to maintenance matrix** — ensure the matrix includes rules like "when a feature is added, update the docs"
- **Check for docs CI** — if docs have a deploy pipeline but no validation (link checking, build verification), suggest adding one to CI

### If no documentation exists:
- **Assess whether docs are needed** based on the project type:
  - Libraries, frameworks, CLIs, and plugins → docs recommended
  - Simple utilities, scripts, or single-purpose tools → README may be sufficient
- If docs are recommended, note this in the summary as a suggestion — **do not generate a docs site**. Docs frameworks are a preference decision for the maintainer.

### Documentation in AGENTS.md:
- Always include a "Documentation" section in `AGENTS.md` that describes:
  - Where docs live (if they exist)
  - What framework is used (if any)
  - How to preview docs locally
  - Or explicitly state "This project does not have a docs site — documentation is in README.md"

---

## Step 11 — Display the AI-Readiness Report

After completing all steps, you MUST display the AI-Readiness Report using the **exact format** below. Fill in the placeholders from your analysis. Do not skip, abbreviate, or restructure this report.

Calculate the score: count how many of the 11 assets are in "Nailed It" status. Build the progress bar using 🟩 for nailed, 🟨 for could-be-better, and ⬜ for missing — always 11 squares total.

Display this report:

```
🎯 **AI-Readiness Report**

Your repo is about to get a whole lot easier to contribute to — and
a whole lot faster to review. AI agents will know your conventions,
follow your patterns, and deliver PRs that are ready to merge.
Let's see where you stand.

**{repo-name}** · Score: **{nailed}/{total}** · {progress-bar} {percent}%

| Category | Detail |
|----------|--------|
| Languages | {languages} |
| Frameworks | {frameworks} |
| Tests | {test-runner} ({test-count}) |
| Build | `{build-command}` |

---

✅ **Nailed It ({count})**

| Asset | Detail |
|-------|--------|
| {asset-name} | {one-line detail} |
| ... | ... |

💡 **Could Be Better ({count})**

| Asset | Suggestion |
|-------|-----------|
| {asset-name} | {suggestion} |
| ... | ... |

⭕ **Missing ({count})**

| Asset | Why it matters |
|-------|---------------|
| {asset-name} | {why it matters} |
| ... | ... |

---

🛠️ **What I Did**

| Action | Detail |
|--------|--------|
| ➕ Create | `{filename}` — {what it will contain} |
| 🔍 Audit | `{filename}` — {what drifted and suggested fix} |
| 💬 Suggest | {suggestion} |
| ✅ Skip | {count} files already in great shape |

**Updated Score: {new-nailed}/{total}** · {updated-progress-bar} {new-percent}%

---

🚀 **What To Do Next**

1. Review the generated files and tweak anything you'd like
2. Enable Copilot code review: **Settings → Copilot → Code review**
3. Add an **AI-Ready badge** to your README — show the world your repo is AI-ready!

Want me to create a branch and open a draft PR with these changes? You can review and edit before merging.
```

After displaying the report, handle the badge, topic, and PR in this order:

### 11a. Offer AI-Ready badge

Check if the README already contains an `AI--Ready` badge. If not, ask the user if they'd like one added. If yes, insert this badge at the top of the README, after any existing title or badge row:

```markdown
[![AI Ready](https://img.shields.io/badge/AI--Ready-yes-brightgreen?style=flat)](https://github.com/johnpapa/ai-ready)
```

The badge is a static Shields.io image with zero dependencies. It links back to the ai-ready plugin repo so others can discover it.

### 11b. Offer GitHub topic

Check the topics fetched in Step 0b. If the repo does not already have the `ai-ready` topic, ask the user if they'd like it added:

```bash
gh repo edit --add-topic ai-ready
```

This makes the repo discoverable at `github.com/topics/ai-ready` alongside other AI-ready repos. Add the topic immediately if the user agrees (this is repo metadata, not a file change — it doesn't need to be in the PR).

### 11c. Offer draft PR

**Ask the user** if they want a draft PR created. If they say yes, create a feature branch (e.g., `feat/ai-ready-config`), commit all new/modified files (including the badge if they accepted it), push, and open a draft PR with a summary of what was added and the before/after score.

Rules for filling in the template:

- **Nailed It** = asset exists and is well-customized to the repo
- **Could Be Better** = asset exists but has gaps or could be enhanced
- **Missing** = asset does not exist and should be created
- If a section has 0 items (e.g., nothing missing), omit that section entirely
- The tech profile table should only include rows that apply (e.g., skip "Frameworks" if none detected)
- Keep each detail to one short line — no multi-line descriptions
- The "What I Did" section should list every file that was created, suggested, or skipped
- **Show an updated progress bar** after the "What I Did" section — recalculate the score counting all created files as now "Nailed It." This shows the user the improvement visually (e.g., going from 🟩🟩🟩🟩🟩🟨⬜⬜⬜⬜⬜ 45% → 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100%)
- The "What To Do Next" section should include only the bullet points that are relevant — e.g., if no files were created, skip "review generated files" and instead say something like "Your repo is already AI-ready — nice work!"

---

## Important Rules

- **NEVER overwrite existing files** — only create assets that are missing.
- **ALWAYS customize to the repo's actual language, framework, and patterns** — do not produce generic boilerplate.
- **Self-consistency — every generated file must follow the conventions you establish.** The skill creates `copilot-instructions.md` with conventions, and then creates other files (CI workflows, issue templates, AGENTS.md, setup steps) in the same PR. If Copilot code review reviews that PR, it should find **zero issues**. Before finalizing files, cross-check: does the CI workflow follow the YAML style you documented? Does AGENTS.md follow the markdown conventions you set? Do issue templates match the patterns you prescribed? If any generated file contradicts the conventions in `copilot-instructions.md`, fix the file before creating it. The skill's own PR is the first test of its output — it must pass its own rules.
- **GitHub-native by default** — you are almost certainly in a GitHub repo. Use GitHub MCP tools and `gh` CLI to auto-discover repo metadata, community health, PR patterns, and contribution history. Never ask the user to explain what their repo is or what tools they use — discover it automatically. If GitHub tools are unavailable, fall back to local git + filesystem analysis.
- **Mine PR reviews for conventions** — the maintainer's repeated review feedback is the most valuable source of conventions. Turn it into `copilot-instructions.md` rules so the AI stops making the same mistakes.
- **Prefer specific, actionable instructions over generic advice** — include real file paths, real commands, and real patterns from the repo.
- **If the repo already has some AI config, respect it and fill in the gaps** — treat existing config as authoritative.
- **Generate asset/content rules only if the project has assets** (images, sounds, fonts, models, etc.).
- **Use the `create` tool to write files** — never use `edit` to create a new file from scratch.
- **Run the full analysis first (Steps 0 and 1)** — do not guess at the repo's structure or toolchain. Every generated asset must be based on evidence from the analysis.
- **ALWAYS display the AI-Readiness Report at the end** — use the exact format from the summary step. This is the user-facing output. Do not skip it, abbreviate it, or use a different layout.
- **NEVER use markdown headings (`#`, `##`, `###`) in your output to the user** — headings render in red/colored text in most terminals. Use **bold text** with emojis instead (e.g., `✅ **Nailed It (9)**`). This applies to the AI-Readiness Report and all other user-facing output during the skill execution.
