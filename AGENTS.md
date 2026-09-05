# AI-Ready Repo — Agent Guide

This is an **Agent Skill** — not a traditional application. It contains no source code to build or test. The deliverable is a skill definition (`SKILL.md`) that teaches an AI coding agent how to make any repository AI-ready.

The skill follows the vendor-neutral [Agent Skills](https://agentskills.io) standard, so one canonical
`skills/ai-ready/SKILL.md` is consumed by GitHub Copilot, Claude Code, OpenAI Codex, and Cursor. Each tool gets
its own thin manifest that points at that same directory — **never duplicate the skill content.**

## Repository Structure

```
ai-ready/
├── .github/
│   ├── copilot-instructions.md     # Conventions for contributing to THIS repo
│   ├── plugin/
│   │   └── plugin.json             # Plugin manifest for copilot plugin install
│   ├── workflows/copilot-setup-steps.yml  # Cloud agent setup (checkout only — no build)
│   ├── dependabot.yml              # GitHub Actions dependency updates
│   ├── workflows/ci.yml            # PR validation (skill integrity checks)
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
│       ├── SKILL.md                   # The 12-step skill procedure (<500 lines)
│       └── references/               # Detailed reference material (loaded on demand)
│           ├── github-discovery.md   # GitHub API tables, PR mining, health gaps
│           ├── detection-tables.md   # Manifest detection, course/monorepo heuristics
│           ├── report-template.md    # Report format, HTML spec, badge, PR flow
│           └── training-repos.md     # Repos used to validate skill heuristics
├── docs/
│   └── how-it-works.md             # Detailed explanation of the 3 mechanisms + 12 assets
├── examples/
│   ├── sample-report-peacock.html  # Sample HTML report (GitHub Pages)
│   └── sample-report-peacock.md    # Sample markdown report
├── images/                         # Screenshots and visual assets
├── .vscode/
│   └── settings.json               # Editor settings
├── AGENTS.md                       # This file
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

- **Content format:** Markdown, YAML, JSON
- **No runtime, build system, or test framework** — this is a documentation-driven project

## Build & Run

There is no build step. This repo ships markdown and JSON files that agents read directly.

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

There is no automated test suite. Validation is:

1. **Skill integrity** — SKILL.md exists and frontmatter is valid Agent Skills
2. **Manifest integrity** — all plugin manifests are valid JSON and agree on `version`
3. **Discovery** — `npx skills add ./ --list` finds `ai-ready`
4. **Smoke test** — install the skill, invoke it on a sample repo, verify the analysis is correct and files are generated properly
5. **CI** — the workflow validates YAML syntax, skill frontmatter, manifest versions, and skills CLI discovery on every PR

## Key Patterns and Conventions

- **Skills live in `skills/<name>/SKILL.md`** — each skill is a markdown file with YAML frontmatter (`name`, `description`) and step-by-step instructions
- **The skill is self-sufficient** — it uses Copilot's built-in tools (glob, grep, view, create) to analyze repos and generate files. No custom extensions or code required
- **Never overwrite existing files** — the skill checks for existing assets before generating
- **Issue/PR provenance is required** — issue and PR communication produced by this skill must explicitly mention AI Ready (for example: `Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)`)
- **Docs must stay in sync** — when skill behavior changes, update `README.md`, `docs/how-it-works.md`, and `CHANGELOG.md` to match repo standards
- **PR conflicts must be addressed** — when opening PRs, attempt conflict resolution first; if unresolved, ask for user direction

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
