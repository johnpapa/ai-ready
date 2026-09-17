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

```
ai-ready/
├── .github/
│   ├── copilot-instructions.md     # Pointer to AGENTS.md (Copilot auto-loads this)
│   ├── plugin/
│   │   └── plugin.json             # Plugin manifest for copilot plugin install
│   ├── workflows/copilot-setup-steps.yml  # Cloud agent setup (checkout only — no build)
│   ├── dependabot.yml              # GitHub Actions dependency updates
│   ├── workflows/ci.yml            # PR validation (packaging + detection tests)
│   ├── ISSUE_TEMPLATE/             # Bug reports, feature requests, new skill ideas
│   ├── PULL_REQUEST_TEMPLATE.md    # PR checklist (integrity checks, test evidence)
│   └── CODEOWNERS                  # @johnpapa owns all paths
├── .claude-plugin/
│   ├── plugin.json                 # Claude Code plugin manifest
│   └── marketplace.json            # Claude Code marketplace catalog (source: "./")
├── .codex-plugin/
│   └── plugin.json                 # OpenAI Codex plugin manifest
├── .agents/
│   └── plugins/marketplace.json    # Codex marketplace catalog (source.path: "./")
├── plugin.json                     # Agent Plugins 1.0.0 manifest (Cursor + neutral clients)
├── skills.sh.json                  # skills.sh registry page config
├── skills/
│   └── ai-ready/
│       ├── SKILL.md                   # The skill procedure, Steps 0-11 (<500 lines)
│       ├── data/                     # Machine-readable detection data (source of truth)
│       │   └── risk-paths.yml        # Risk globs + known false positives; tested in CI
│       └── references/               # Detailed reference material (loaded on demand)
│           ├── github-discovery.md   # GitHub API tables, PR mining, health gaps
│           ├── detection-tables.md   # Manifest detection, heuristics; risk table GENERATED
│           ├── reviewer-agents.md    # The three adversarial reviewers, .github/agents/ (Step 4c)
│           ├── report-template.md    # Report format, HTML spec, badge, PR flow
│           └── training-repos.md     # Repos used to validate skill heuristics
├── tools/
│   ├── globmatch.py                # Glob semantics the detection tables assume
│   └── gen_detection_tables.py     # Regenerates the risk table from data/risk-paths.yml
├── tests/
│   ├── test_detection.py           # Runs the globs against fixtures; CI blocks on failure
│   └── fixtures/                   # Fake repo trees + expected.yml (the known-correct answers)
├── evals/
│   ├── README.md                   # How to run a manual eval, and how to pick a target repo
│   ├── rubric.md                   # 24 binary checks across Truthfulness/Groundedness/…
│   └── results/                    # One file per run, committed — including the bad ones
├── docs/
│   └── how-it-works.md             # Detailed explanation of the 4 mechanisms + 15 assets
├── examples/
│   ├── sample-report-peacock.html  # Sample HTML report (GitHub Pages)
│   └── sample-report-peacock.md    # Sample markdown report
├── images/                         # Screenshots and visual assets
├── .vscode/
│   └── settings.json               # Editor settings
├── CLAUDE.md                       # Pointer to AGENTS.md
├── .cursorrules                    # Pointer to AGENTS.md
├── AGENTS.md                       # This file — the single source of truth
├── CHANGELOG.md                    # Version history
├── README.md                       # Project overview, quick start, what gets generated
├── SECURITY.md                     # Vulnerability reporting policy
└── LICENSE                         # MIT
```

## Packaging Model

Distribution follows existing ecosystem conventions — **nothing bespoke**. The canonical
`skills/ai-ready/SKILL.md` follows the [Agent Skills](https://agentskills.io) standard, which is all the
[skills CLI](https://github.com/vercel-labs/skills) (`npx skills add`) needs to install into 70+ agents.

The native plugin manifests are additive, for users who prefer their tool's own plugin system. All of them
describe the **same** `skills/ai-ready/` directory. The repo root doubles as the plugin root, which is why no
manifest needs to copy or relocate skill content.

| File | Consumed by | How it finds the skill |
|---|---|---|
| *(none — convention)* | `npx skills add johnpapa/ai-ready` | scans `skills/*/SKILL.md` |
| `.github/plugin/plugin.json` | GitHub Copilot CLI | explicit `"skills": ["./skills/ai-ready"]` |
| `.claude-plugin/plugin.json` | Claude Code | convention — `skills/` in plugin root |
| `.claude-plugin/marketplace.json` | Claude Code `/plugin marketplace add` | plugin `source: "./"` |
| `.codex-plugin/plugin.json` | OpenAI Codex | explicit `"skills": "./skills/"` |
| `.agents/plugins/marketplace.json` | Codex `plugin marketplace add` | plugin `source.path: "./"` |
| `plugin.json` | Cursor and Agent Plugins clients | convention — `skills/` in plugin root |
| `skills.sh.json` | skills.sh registry page | groups skills for display |

The `version` field must be identical in all five plugin manifests and in `SKILL.md` frontmatter
`metadata.version`. CI enforces this.

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

### What CI enforces

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`. It blocks the merge on any of
these, so you don't have to remember them:

| Check | What it rejects |
|---|---|
| **SKILL.md frontmatter** | Any `SKILL.md` under `skills/` with no frontmatter, malformed delimiters, or a missing `name` or `description` |
| **YAML syntax** | Any `.yml`/`.yaml` under `.github/` that doesn't parse |
| **Manifest version parity** | `metadata.version` in `SKILL.md` disagreeing with any of `plugin.json`, `.github/plugin/plugin.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, or `.claude-plugin/marketplace.json` — all six must match |
| **Agent Skills spec compliance** | `name` not matching its directory, a name that isn't kebab-case, a `description` outside 1–1024 characters, non-portable frontmatter keys (only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`), or non-string `metadata` values |
| **skills CLI discovery** | A repo state where `npx skills add ./ --list` can't find `ai-ready` |
| **`skills.sh.json` parity** | A skill directory missing from `skills.sh.json`, or a listed skill that doesn't exist |

Version parity is the one that bites most often: bumping `SKILL.md` without the five manifests fails the build.

Run the whole set locally before pushing:

```bash
python3 -c "import yaml,glob;[yaml.safe_load(open(f)) for f in glob.glob('.github/**/*.y*ml',recursive=True)]"
npx -y skills@latest add ./ --list
```

### Detection tests

`tests/test_detection.py` checks the risk-path globs in `skills/ai-ready/data/risk-paths.yml` against fixture
repos in `tests/fixtures/`, each carrying an `expected.yml` that states which rows must match, which must
produce nothing, and which known false positives must fire. It runs in CI.

```bash
python3 tests/test_detection.py            # the fixtures
python3 tools/gen_detection_tables.py      # regenerate the markdown table from the data
python3 tools/gen_detection_tables.py --check   # what CI runs
```

`data/risk-paths.yml` is the **source of truth**. The table in `references/detection-tables.md` is generated
from it between `<!-- BEGIN GENERATED -->` markers, and CI fails if they drift. Edit the YAML, run the
generator, commit both.

When you fix a bad detection, add the case to a fixture in the same PR. That is what turns a one-off fix into a
regression test — `tests/fixtures/vscode-extension/` exists because `src/notification.ts` was once written into
a boundary as customer contact, and it now fails the build if that comes back.

### What CI does not enforce

**CI validates the skill's packaging and its detection data — not the skill's judgment.** Every check passes on
a `SKILL.md` whose instructions are wrong, contradictory, or produce broken output. The globs can be perfect
while the step that reads them still writes nonsense, because an agent does not run the globs literally; it
reads the table and pattern-matches.

That gap is what [`evals/`](evals/) is for: a fixed rubric, run by a person against a real repo, recorded in
`evals/results/`. It is not automated and it does not pretend to be. Run one before shipping a release, and
commit the result even when it goes badly — a results directory with only good runs in it is not evidence.

The only thing that catches a bad *instruction* today is a manual smoke test: install the skill, invoke it on a
real repo, and read what it generated. Nothing records that this happened, which is why the PR template asks
you to name the repo you ran it against.

So before opening a PR that changes skill behavior:

1. Install the skill locally — copy `skills/ai-ready/SKILL.md` to `~/.copilot/skills/ai-ready/SKILL.md`
2. Run it against a repo that actually exercises the path you changed
3. Read the generated files, not just the report
4. Put the repo and the result in the **Tested On** table in your PR

## Key Patterns and Conventions

- **Skills live in `skills/<name>/SKILL.md`** — each skill is a markdown file with YAML frontmatter (`name`, `description`) and step-by-step instructions
- **The skill is self-sufficient** — it uses Copilot's built-in tools (glob, grep, view, create) to analyze repos and generate files. No custom extensions or code required
- **Never overwrite existing files** — the skill checks for existing assets before generating
- **Issue/PR provenance is required** — issue and PR communication produced by this skill must explicitly mention AI Ready (for example: `Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)`)
- **Docs must stay in sync** — when skill behavior changes, update `README.md`, `docs/how-it-works.md`, and `CHANGELOG.md` to match repo standards
- **PR conflicts must be addressed** — when opening PRs, attempt conflict resolution first; if unresolved, ask for user direction

## Writing Conventions

### Markdown

- Use ATX-style headings (`#`, `##`, `###`)
- Use fenced code blocks with language identifiers (```yaml, ```bash, ```json)
- Use tables for structured data — always include a header row
- Keep lines under 120 characters where practical
- Use `**bold**` for emphasis, `_italic_` for terms, `` `backticks` `` for file paths and commands

### YAML (skill frontmatter, workflows, issue templates)

- Use 2-space indentation
- Quote strings that contain special YAML characters
- Always include `name` and `description` in skill frontmatter

### JSON

- Use 2-space indentation

## Skill Writing Conventions

- Each step should be independently actionable — the AI should be able to execute it without context from other steps
- Include explicit "check if exists" guards before creating files
- Use real file paths and real commands, not placeholders
- Prefer structured output (tables) over prose for analysis results
- Always end with a summary step listing what was created, skipped, and what to do next

## Maintenance Matrix

| When this changes... | Also update... |
|---|---|
| `skills/ai-ready/SKILL.md` | `README.md` (if skill behavior changed), `docs/how-it-works.md`, `AGENTS.md`, `CHANGELOG.md` |
| `skills/ai-ready/references/*` | Verify consistency with `SKILL.md` steps that reference them |
| New skill added to `skills/` | `README.md`, `AGENTS.md` (structure section), `CHANGELOG.md` |
| `docs/how-it-works.md` | Verify consistency with `SKILL.md` steps and `README.md` |
| `README.md` problem statement or architecture | Verify consistency with `docs/how-it-works.md` |
| Repo structure changes (new dirs, moved files) | `AGENTS.md` (structure section), `CHANGELOG.md` |
| Version bump (`SKILL.md` metadata) | **All** manifests — `.github/plugin/plugin.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, root `plugin.json` — plus `CHANGELOG.md` and GitHub Release |
| Any plugin manifest | Keep `version` identical across all manifests and `SKILL.md`; CI fails on drift |
| `skills.sh.json` | Must list every directory under `skills/`; CI fails on drift |
| New tool/platform supported | `README.md` install table, `AGENTS.md` (packaging model); add a manifest only if the tool cannot use `npx skills` |
| `.github/workflows/ci.yml` | `AGENTS.md` (§ Testing — *What CI enforces*) and the CI summary in `README.md` § Contributing. A check nobody documented is a check contributors work around |
| `skills/ai-ready/data/*.yml` | Run `python3 tools/gen_detection_tables.py` and commit the regenerated `references/detection-tables.md`; add or update a fixture in `tests/fixtures/` covering the change |
| A detection bug found in a real repo | Add the case to a fixture in `tests/fixtures/` in the same PR, and add the pattern to `false_positives` in `data/risk-paths.yml` if it is one |
| `evals/rubric.md` | `evals/results/TEMPLATE.md` if the sections changed; previous results keep their original rubric version |
| Scoring, medals, or the tracked asset list | `SKILL.md` (asset table + medal table), `references/report-template.md` (square count, category indicators, cap wording), `README.md` § Scoring, `docs/how-it-works.md`, `CHANGELOG.md` |

## Adding a New Skill

1. Create `skills/<skill-name>/SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What this skill does and when to invoke it
   ---
   ```
   `name` **must** match the parent directory name — the Agent Skills spec requires it, and Cursor and Codex
   reject skills where it doesn't.
2. Write step-by-step instructions in the markdown body
3. Add the skill path to `.github/plugin/plugin.json` (Copilot needs an explicit list). The Claude, Codex, and
   Agent Plugins manifests pick it up automatically from `skills/`
4. Update `README.md` to mention the new skill
5. Update this file (`AGENTS.md`) to reflect the new structure

## Common Pitfalls

- **Don't add build/test/runtime dependencies** — this is a markdown-only project. Agents should not invent `npm install`, `pip install`, or any setup commands for this repo
- **SKILL.md frontmatter is required** — the `name` and `description` fields in the YAML frontmatter are how agents discover and match the skill to user requests. Keep frontmatter to the portable Agent Skills fields (`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`); vendor-specific keys break portability
- **Never duplicate skill content per tool** — every manifest points at the one canonical `skills/ai-ready/`. Copying it would guarantee drift
- **Bump the version in all five manifests** — `SKILL.md`, `.github/plugin/plugin.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, and root `plugin.json`. CI fails otherwise
- **Test on real repos** — the only meaningful test is invoking the skill on different repo types (Node.js, Python, Go, Rust, etc.) and verifying the output
