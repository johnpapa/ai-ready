---
name: ai-ready-repo
description: Analyze any repository and generate AI-ready configuration — AGENTS.md, copilot-instructions.md, skills, CI workflows, issue templates, and more. USE THIS SKILL when the user asks to "make this repo ai-ready", "set up AI config", "add copilot instructions", "prepare this repo for AI contributions", or similar. This skill analyzes the repo's code, tests, CI, and structure, then generates customized assets that teach AI agents and human contributors how to work in the repo correctly.
---

# AI-Ready Repo Skill

When invoked, follow these steps in order to analyze the current repository and generate all missing AI-ready configuration assets. Each step checks whether the target file already exists — **never overwrite existing files**.

---

## Step 1 — Analyze the repo

Call the `analyze_repo_for_ai_readiness` tool to scan the current repository. This returns a structured analysis of:

- Languages and frameworks detected
- Test framework and test commands
- Build commands and CI/CD setup
- Existing AI config (what's already there)
- What's missing (which assets need to be created)

Review the analysis results before proceeding. **Do NOT overwrite existing files** — only create assets that don't exist yet.

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

## Step 9 — Summary

After generating all assets, provide a clear summary:

1. **Created** — list every file that was generated, with a one-line description of each.
2. **Skipped** — list every file that was skipped because it already existed.
3. **Next Steps** — suggest what the user should do:
   - Review each generated file and customize to their preferences
   - Pay special attention to AGENTS.md and the maintenance matrix
   - Commit the new files to the repo
   - Consider adding project-specific skills if the repo has complex workflows

---

## Important Rules

- **NEVER overwrite existing files** — only create assets that are missing.
- **ALWAYS customize to the repo's actual language, framework, and patterns** — do not produce generic boilerplate.
- **Prefer specific, actionable instructions over generic advice** — include real file paths, real commands, and real patterns from the repo.
- **If the repo already has some AI config, respect it and fill in the gaps** — treat existing config as authoritative.
- **Generate asset/content rules only if the project has assets** (images, sounds, fonts, models, etc.).
- **Use the `create` tool to write files** — never use `edit` to create a new file from scratch.
- **Run the analysis tool first** — do not guess at the repo's structure or toolchain.
