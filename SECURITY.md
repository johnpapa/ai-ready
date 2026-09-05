# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue.** Instead, email [johnpapa@gmail.com](mailto:johnpapa@gmail.com) with details.

## Scope

This is an Agent Skill that generates markdown, YAML, and JSON files. The skill itself does not access networks or handle credentials. The primary security concerns are:

- **Skill instructions that could cause harmful file modifications** in target repos
- **`install.sh`** — the only executable in this repo. It clones this repository and creates symlinks or copies under `~/.agents/skills/`, `~/.claude/skills/`, `~/.cursor/skills/`, and `~/.codex/skills/`. Review it before piping it to a shell.
