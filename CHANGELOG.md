# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0-alpha] — 2026-04-24

### Added

- Made repo public (alpha release)
- PR template with integrity checklist and "Tested On" table
- CODEOWNERS (`@johnpapa`)
- Alpha banner in README
- GitHub repo topics and description

### Changed

- Bumped version to 0.3.0-alpha

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
