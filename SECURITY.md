# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue.** Instead, email [johnpapa@gmail.com](mailto:johnpapa@gmail.com) with details.

## Scope

This is a Copilot CLI plugin that generates markdown, YAML, and JSON files. It does not execute code, access networks, or handle credentials. The primary security concerns are:

- **Skill instructions that could cause harmful file modifications** in target repos
- **Plugin manifest issues** that could cause unexpected behavior during installation
