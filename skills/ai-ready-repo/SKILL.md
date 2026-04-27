---
name: ai-ready-repo
description: Analyze any repository and generate AI-ready configuration — AGENTS.md, copilot-instructions.md, skills, CI workflows, issue templates, and more. USE THIS SKILL when the user asks to "make this repo ai-ready", "set up AI config", "add copilot instructions", "prepare this repo for AI contributions", or similar. This skill analyzes the repo's code, tests, CI, and structure, then generates customized assets that teach AI agents and human contributors how to work in the repo correctly.
---

# AI-Ready Repo Skill

When invoked, follow these steps in order to analyze the current repository and generate all missing AI-ready configuration assets. Each step checks whether the target file already exists — **never overwrite existing files**.

---

## Step 1 — Analyze the repo

Scan the repository using built-in tools (glob, grep, view) to build a structured analysis. **Do not proceed to Step 2 until the analysis is complete and confirmed.**

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

Before proceeding, produce a structured summary with file-path evidence for each finding:

| Category | Finding | Evidence (file path) |
|----------|---------|---------------------|
| Language | e.g., TypeScript | `package.json` (typescript in devDependencies) |
| Framework | e.g., React, Phaser | `package.json` (react in dependencies) |
| Test runner | e.g., Vitest | `package.json` (vitest in devDependencies) |
| Test command | e.g., `npm test` | `package.json` scripts.test |
| Build command | e.g., `npm run build` | `package.json` scripts.build |
| Runtime version | e.g., Node 22 | `.nvmrc` or `package.json` engines |
| Package manager | e.g., pnpm | `pnpm-lock.yaml` exists |
| PR CI exists | yes/no | `.github/workflows/ci.yml` |
| AGENTS.md | missing | not found at repo root |
| Changelog | exists / pointer / missing | `CHANGELOG.md`, `docs/changelog/`, Releases |
| Changelog location | root / docs / releases | path to actual content |
| Changelog freshness | current / stale | latest entry vs latest git tag |
| Docs exist | yes / no | `docs/`, config file, README-only |
| Docs framework | Docsify / Docusaurus / etc. | config file path |
| Docs deploy pipeline | yes / no | workflow file path |
| Docs nav/TOC | present / missing | sidebar or nav config |
| README links to docs | yes / no | README.md link |
| ... | ... | ... |

**List which of the 9 assets are missing and need to be created.** Do NOT overwrite existing files — only create assets that don't exist yet.

---

## Step 2 — Generate AGENTS.md

If `AGENTS.md` does not already exist at the repository root, create it with the following sections (all content must be derived from the analysis in Step 1 and from inspecting the actual repo):

- **Project Overview** — derived from README, package.json, pyproject.toml, Cargo.toml, or similar manifest files.
- **Repository Structure** — a directory tree showing the key folders and what they contain.
- **Tech Stack** — languages, frameworks, runtimes, and major dependencies.
- **Build & Run** — exact commands to install dependencies, build, and run the project locally.
- **Testing** — test runner, how to run tests, any special setup required (e.g., browser drivers, database fixtures).
- **Key Patterns and Conventions** — architectural patterns, naming conventions, module structure, and any patterns inferred from the codebase (e.g., "all API routes live in `src/routes/`", "scenes extend BaseScene").
- **CI/CD** — summary of existing CI workflows, what triggers them, and what they do.
- **Adding a New [Feature/Module]** — a step-by-step guide customized to the project type (e.g., "Adding a New Game" for a game project, "Adding a New API Endpoint" for a web API, "Adding a New Command" for a CLI tool).
- **Screen Size / Responsive Rules** — include this section only if the project is a frontend or UI project.
- **Common Pitfalls** — things that frequently trip up contributors (e.g., "run `npm run build:frontend` before tests", "version must be updated in three files").

---

## Step 3 — Generate .github/copilot-instructions.md

If `.github/copilot-instructions.md` does not already exist, create it with:

- **Language-Specific Conventions** — coding style, idioms, and patterns for the project's primary language(s) (TypeScript, Python, Go, Rust, etc.), derived from the analysis.
- **Framework Patterns** — how the project uses its framework(s) (React component patterns, Express middleware conventions, Django app structure, etc.).
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

  Populate the matrix with **real file paths and real patterns** from the repo.

---

## Step 4 — Generate .github/copilot-setup-steps.yml

If `.github/copilot-setup-steps.yml` does not already exist, create it with steps to:

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
  - How to fork, branch, and submit a PR
  - How to run tests locally (exact commands)
  - A link to `AGENTS.md` for the full contributor guide
  - Mention of any skills or AI-assisted workflows available in the repo
- **Do NOT rewrite or restructure the rest of the README** — only append the Contributing section.

If a Contributing section already exists, skip this step.

---

## Step 8 — Verify maintenance matrix

The maintenance matrix should already be part of `copilot-instructions.md` (generated in Step 3). Verify that it covers:

- What files reference each other (e.g., a game registry that must be updated when a new scene is added)
- What must be updated when different parts of the codebase change
- Cross-cutting concerns (e.g., version numbers in multiple files, route registrations, module re-exports)

If the matrix is missing or incomplete, update `copilot-instructions.md` to include it.

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

  {asset-name} ··· {one-line detail}
  {asset-name} ··· {one-line detail}
  ...

💡 **Could Be Better ({count})**

  {asset-name} ··· {suggestion}
  ...

⭕ **Missing ({count})**

  {asset-name} ··· {why it matters}
  ...

---

🛠️ **What I'll Do**

  ➕ Create   {filename} — {what it will contain}
  💬 Suggest  {suggestion}
  ✅ Skip     {count} files already in great shape
```

Rules for filling in the template:

- **Nailed It** = asset exists and is well-customized to the repo
- **Could Be Better** = asset exists but has gaps or could be enhanced
- **Missing** = asset does not exist and should be created
- If a section has 0 items (e.g., nothing missing), omit that section entirely
- Use dot-leaders (`···`) between asset name and detail for visual alignment
- The tech profile table should only include rows that apply (e.g., skip "Frameworks" if none detected)
- Keep each detail to one short line — no multi-line descriptions
- The "What I'll Do" section should list every file that was created, suggested, or skipped

---

## Important Rules

- **NEVER overwrite existing files** — only create assets that are missing.
- **ALWAYS customize to the repo's actual language, framework, and patterns** — do not produce generic boilerplate.
- **Prefer specific, actionable instructions over generic advice** — include real file paths, real commands, and real patterns from the repo.
- **If the repo already has some AI config, respect it and fill in the gaps** — treat existing config as authoritative.
- **Generate asset/content rules only if the project has assets** (images, sounds, fonts, models, etc.).
- **Use the `create` tool to write files** — never use `edit` to create a new file from scratch.
- **Run the full analysis first (Step 1)** — do not guess at the repo's structure or toolchain. Every generated asset must be based on evidence from the analysis.
- **ALWAYS display the AI-Readiness Report at the end** — use the exact format from Step 11. This is the user-facing output. Do not skip it, abbreviate it, or use a different layout.
