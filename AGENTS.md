# AI-Ready Repo — Agent Guide

This is an **Agent Skill** — not a traditional application. The deliverable is a skill definition
(`SKILL.md`) that teaches an AI coding agent how to make any repository AI-ready. There is nothing to compile
and nothing to ship a binary from.

There *is* code, though, and it has to pass before you push: a small Python validation harness under `tools/`
and `tests/` that checks the skill's detection data against fixture repos. See [§ Testing](#testing).

The skill follows the vendor-neutral [Agent Skills](https://agentskills.io) standard, so one canonical
`skills/ai-ready/SKILL.md` is consumed by GitHub Copilot, Claude Code, OpenAI Codex, and Cursor. Each tool gets
its own thin manifest that points at that same directory — **never duplicate the skill content.**

## Repository Structure

Conventional where you'd expect: `skills/ai-ready/` holds the skill, `docs/` the prose, `tests/` and `tools/`
the validation harness, `evals/` the manual rubric. Run `ls` for the rest.

The part that is **not** guessable, and that CI enforces:

**Six files carry a version and all six must agree** — `skills/ai-ready/SKILL.md` (`metadata.version`, the
source of truth), `plugin.json`, `.github/plugin/plugin.json`, `.claude-plugin/plugin.json`,
`.codex-plugin/plugin.json`, and `.claude-plugin/marketplace.json` (nested under `plugins[0]`). There is also
`.agents/plugins/marketplace.json`, which carries no version. Bumping one and not the rest is the most common
way to fail the build.

## Packaging Model

One canonical `skills/ai-ready/SKILL.md`; every tool gets a thin manifest pointing at that same directory.
**Never duplicate the skill content.** Details of each tool's manifest: [docs/authoring.md](docs/authoring.md).

## Tech Stack

- **Content format:** Markdown, YAML, JSON — this is a documentation-driven project
- **No build system and nothing to compile.** The repo ships files agents read directly
- **Validation harness:** Python 3 with `pyyaml`, under `tools/` and `tests/`. Dependency-free otherwise — no
  framework, no test runner. `tests/test_detection.py` is a plain script that exits non-zero

## Build & Run

There is no build step. This repo ships markdown, YAML and JSON files that agents read directly.

Before pushing, run what CI runs:

```bash
pip install pyyaml
python3 tests/test_detection.py               # risk-path globs against fixtures
python3 tools/gen_detection_tables.py --check # generated tables match their data
```

**To test the skill locally in every installed tool:**

```bash
npx skills add ./ --agent claude-code codex cursor
```

That installs `skills/ai-ready/` into each tool, so edits take effect on the next agent restart. Then
start your agent and invoke the skill:

```
make this repo ai-ready
```

Use `npx skills add ./ --list` to confirm the skill is discoverable without installing it, and
`npx skills remove ai-ready` to clean up. **Native plugin installs** are documented in `README.md`.

## Testing

Run these before you push — they are what CI runs:

```bash
pip install pyyaml
python3 tests/test_detection.py                  # risk-path globs against tests/fixtures/
python3 tools/gen_detection_tables.py --check    # generated tables match their data
npx -y skills@latest add ./ --list               # the skill is discoverable
```

CI additionally checks `SKILL.md` frontmatter, YAML syntax across `.github/`, version parity across the six
files above, Agent Skills spec compliance, and `skills.sh.json` parity. Full table in
[docs/authoring.md](docs/authoring.md).

`skills/ai-ready/data/risk-paths.yml` is the **source of truth** for detection; the table in
`references/detection-tables.md` is generated from it and CI fails on drift. Edit the YAML, run the generator,
commit both. When you fix a bad detection, add the case to a fixture in the same PR.

**CI validates packaging and detection data — not the skill's judgment.** Every check passes on a `SKILL.md`
whose instructions are wrong. That gap is what [`evals/`](evals/) is for, and why the PR template asks which
repo you ran against. See [docs/authoring.md](docs/authoring.md) before changing skill behavior.

## Key Patterns and Conventions

- **Skills live in `skills/<name>/SKILL.md`** — each skill is a markdown file with YAML frontmatter (`name`, `description`) and step-by-step instructions
- **The skill is self-sufficient** — it uses Copilot's built-in tools (glob, grep, view, create) to analyze repos and generate files. No custom extensions or code required
- **Never overwrite existing files** — the skill checks for existing assets before generating
- **Issue/PR provenance is required** — issue and PR communication produced by this skill must explicitly mention AI Ready (for example: `Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)`)
- **Docs must stay in sync** — when skill behavior changes, update `README.md`, `docs/how-it-works.md`, and `CHANGELOG.md` to match repo standards
- **PR conflicts must be addressed** — when opening PRs, attempt conflict resolution first; if unresolved, ask for user direction

## Writing Conventions

Match the surrounding files for anything not listed here — indentation, heading style and code-fence language
tags are all visible in any file you open.

- **Wrap markdown at 120 characters.** Not inferable; the existing files are inconsistent
- **Tables for structured data**, always with a header row. Prefer them over prose for anything comparative
- `**bold**` for emphasis, `_italic_` for terms, `` `backticks` `` for file paths and commands
- Quote YAML strings containing special characters

## Skill Writing Conventions

**`references/` holds only what changes agent behavior.** Reasoning goes in [docs/why.md](docs/why.md) — an
explanation the agent cannot act on still costs attention on every run that loads it.


- Each step should be independently actionable — executable without context from other steps
- Include explicit "check if exists" guards before creating files
- Use real file paths and real commands, not placeholders
- Prefer structured output (tables) over prose for analysis results
- Always end with a summary step listing what was created, skipped, and what to do next

**CI fails the build if `SKILL.md` exceeds 500 lines or this file exceeds 150.** Both are loaded on every
invocation, so length costs adherence, not just tokens. When you hit a ceiling, move content out — never delete
something load-bearing to get under it. Sources and reasoning: [docs/authoring.md](docs/authoring.md).

## Maintenance Matrix

| When this changes... | Also update... |
|---|---|
| `skills/ai-ready/SKILL.md` | `README.md` (if skill behavior changed), `docs/how-it-works.md`, `AGENTS.md`, `CHANGELOG.md` |
| `SKILL.md` past ~500 lines, or `AGENTS.md` past ~150 | Move narrow-scope content out — `references/` for the skill, `docs/` or a nested `AGENTS.md` for this file. See [docs/authoring.md](docs/authoring.md). Never cut something load-bearing to hit a number |
| `.github/workflows/ci.yml` | The check list in [docs/authoring.md](docs/authoring.md) § The full CI picture, and the CI summary in `README.md` § Contributing |
| `skills/ai-ready/references/*` | Verify consistency with `SKILL.md` steps that reference them |
| New skill added to `skills/` | `README.md`, `AGENTS.md` (structure section), `CHANGELOG.md` |
| `docs/how-it-works.md` | Verify consistency with `SKILL.md` steps and `README.md` |
| `README.md` problem statement or architecture | Verify consistency with `docs/how-it-works.md` |
| Repo structure changes (new dirs, moved files) | `AGENTS.md` (structure section), `CHANGELOG.md` |
| Version bump (`SKILL.md` metadata) | **All** manifests — `.github/plugin/plugin.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, root `plugin.json` — plus `CHANGELOG.md` and GitHub Release |
| Any plugin manifest | Keep `version` identical across all manifests and `SKILL.md`; CI fails on drift |
| `skills.sh.json` | Must list every directory under `skills/`; CI fails on drift |
| New tool/platform supported | `README.md` install table, `AGENTS.md` (packaging model); add a manifest only if the tool cannot use `npx skills` |
| `skills/ai-ready/data/*.yml` | Run `python3 tools/gen_detection_tables.py` and commit the regenerated `references/detection-tables.md`; add or update a fixture in `tests/fixtures/` covering the change |
| A detection bug found in a real repo | Add the case to a fixture in `tests/fixtures/` in the same PR, and add the pattern to `false_positives` in `data/risk-paths.yml` if it is one |
| `evals/rubric.md` | `evals/results/TEMPLATE.md` if the sections changed; previous results keep their original rubric version |
| Scoring, medals, or the tracked asset list | `SKILL.md` (asset table + medal table), `references/report-template.md` (square count, category indicators, cap wording), `README.md` § Scoring, `docs/how-it-works.md`, `CHANGELOG.md` |

## Common Pitfalls

- **Don't add build/test/runtime dependencies** — this is a markdown-only project. Agents should not invent `npm install`, `pip install`, or any setup commands for this repo
- **SKILL.md frontmatter is required** — the `name` and `description` fields in the YAML frontmatter are how agents discover and match the skill to user requests. Keep frontmatter to the portable Agent Skills fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`); vendor-specific keys break portability
- **Test on real repos** — the only meaningful test is invoking the skill on different repo types and reading what it generated
