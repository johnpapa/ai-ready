# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue.** Instead, email [johnpapa@gmail.com](mailto:johnpapa@gmail.com) with details.

## Scope

This is an Agent Skill that generates markdown, YAML, and JSON files. The skill itself does not access networks or handle credentials. This repo contains **no executables** — installation is handled by your agent's own plugin system or the third-party [skills CLI](https://github.com/vercel-labs/skills). The primary security concerns are:

- **Skill instructions that could cause harmful file modifications** in target repos
- **Plugin manifests** that could point an agent at unexpected content. Every manifest here references only the local `skills/ai-ready/` directory.
