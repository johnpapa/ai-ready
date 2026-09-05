# Copilot Instructions — ai-ready

## Project Type

This is an **Agent Skill** containing only markdown, YAML, and JSON files. There is no source code, no build system, no test framework, and no runtime dependencies.

The skill targets GitHub Copilot, Claude Code, OpenAI Codex, and Cursor from one canonical
`skills/ai-ready/SKILL.md`. Per-tool manifests are thin pointers — never copy skill content into them.

**Do not** generate or suggest build commands, test commands, package installs, or runtime setup for this repo.

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
