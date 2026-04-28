# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **AI-Ready badge** (Step 12) — opt-in Shields.io badge and `ai-ready` GitHub topic offered after the report, linking back to this plugin for discoverability
- **Self-consistency rule** — generated files must follow the conventions established in the same PR's `copilot-instructions.md`, so Copilot code review finds zero issues

### Changed

- Contributors row rationale changed from "who to put in CODEOWNERS" to "contribution patterns" — CODEOWNERS is a human reviewer workflow, not an AI-readiness concern
- Skill now has 12 steps (was 11)

## [0.3.0-alpha] — 2026-04-24

### Added

- Made repo public (alpha release)
- PR template with integrity checklist and "Tested On" table
- CODEOWNERS (`@johnpapa`)
- Alpha banner in README
- GitHub repo topics and description
- CHANGELOG.md, SECURITY.md, dependabot.yml
- **Changelog evaluation** (Step 1f/9) — detects changelog location (root, docs, releases), follows pointer files, checks freshness against git tags, assesses format
- **Documentation evaluation** (Step 1g/10) — detects docs framework (Docsify, Docusaurus, MkDocs, etc.), checks nav/TOC, deploy pipeline, README linkage, assesses whether docs are needed
- Expanded analysis findings table with changelog and docs rows

### Changed

- Skill now has 11 steps (was 9)
- Bumped version to 0.3.0-alpha
- Updated docs/how-it-works.md with steps 10-11

## [0.2.0] — 2026-04-24

### Changed

- Removed custom extension (`extension.mjs`) — plugin system doesn't load extensions
- Rewrote SKILL.md Step 1 to use built-in tools (glob, grep, view) with structured analysis schema
- Skill is now fully self-sufficient — no custom tools required

### Added

- AGENTS.md — contributor guide for this repo
- `.github/copilot-instructions.md` — conventions + maintenance matrix
- `.github/copilot-setup-steps.yml` — checkout-only setup
- `.github/workflows/ci.yml` — plugin integrity validation
- Issue templates (bug report, feature request, new skill idea)
- README Contributing section with smoke test guide

### Removed

- `extensions/ai-ready-repo/extension.mjs` — replaced by skill-native analysis

## [0.1.0] — 2026-04-23

### Added

- Initial plugin: skill, extension, docs, and README
- Plugin manifest (`plugin.json`) for `copilot plugin install`
- 9-step skill procedure (`SKILL.md`)
- `analyze_repo_for_ai_readiness` extension tool
- Documentation: README, `docs/how-it-works.md`
- MIT License
