🎯 **AI-Readiness Report**

Your repo is about to get a whole lot easier to contribute to — and
a whole lot faster to review. AI agents will know your conventions,
follow your patterns, and deliver PRs that are ready to merge.

**johnpapa/vscode-peacock**

| Category | Detail |
|----------|--------|
| Languages | TypeScript (99%), JavaScript (1%) |
| Frameworks | VS Code Extension API |
| Tests | Jest (87 tests) |
| Build | `npm run build` |

---

📊 **Your Repo Today** · 🥈 **On Track** · 🟩🟩🟩🟩🟩🟨🟨⬜⬜⬜⬜⬜ · 5 of 12 nailed

✅ **Nailed It (5)**

| Asset | Detail |
|-------|--------|
| README Contributing section | Links to CONTRIBUTING.md with full setup guide |
| Changelog | CHANGELOG.md — Keep a Changelog format, current with latest release |
| Documentation | `docs/` directory linked from README |
| `.github/dependabot.yml` | Configured for npm and GitHub Actions |
| CI workflow | `build.yml` — build + test + lint on PR |

💡 **Could Be Better (2)**

| Asset | Suggestion |
|-------|-----------|
| Issue templates | Has old-format `.md` templates — consider converting to YAML form format |
| `.github/copilot-instructions.md` | No PR review patterns captured — 12 merged PRs had no review comments |

*Why these matter:* YAML form templates give contributors structured fields instead of a blank text box. PR review mining turns repeated feedback into automated conventions — but it needs review comments to mine.

⭕ **Missing (5)**

| Asset | Why it matters |
|-------|---------------|
| `AGENTS.md` | AI agents won't know the repo structure, build commands, or how to add a new color command |
| Maintenance matrix | Contributors won't know that adding a command requires updating `package.json`, the command enum, and the docs |
| `.github/copilot-setup-steps.yml` | Cloud agent can't build the project without setup steps |
| PR template | PRs have no structured description, checklist, or test instructions |
| `.vscode/mcp.json` | No MCP servers configured — N/A (no database or API dependencies detected) |

*Why these matter:* Without AGENTS.md and a maintenance matrix, every AI agent (and new contributor) has to rediscover which files need updating when something changes. That's the knowledge that lives in a maintainer's head — until now.

---

🛠️ **What I'd Like To Do** — proposed changes to close the gaps:

| Action | Detail |
|--------|--------|
| ➕ Create | `AGENTS.md` — repo structure, build/test commands, how to add a color command |
| ➕ Create | `.github/copilot-instructions.md` — TypeScript conventions, VS Code extension patterns, maintenance matrix |
| ➕ Create | `.github/copilot-setup-steps.yml` — Node 20, npm install, npm run build |
| ➕ Create | `.github/PULL_REQUEST_TEMPLATE.md` — description, changes, test steps, checklist |
| ➕ Create | `.github/ISSUE_TEMPLATE/bug-report.yml` — structured form with VS Code version, OS, Peacock settings |
| ➕ Create | `.github/ISSUE_TEMPLATE/feature-request.yml` — description, motivation, alternatives |
| ⏭️ Skip | `.vscode/mcp.json` — N/A, no database or API dependencies |
| 💬 Suggest | Convert old `.md` issue templates to YAML form format for consistency |

---

🏆 **If You Accept** · 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 · 12 of 12 nailed → **AI-Ready**

🤖 AI Context        ✅✅✅✅✅
🔧 Dev Workflow      ✅✅✅✅
📖 Onboarding        ✅✅✅

---

🚀 **Ready?**

1. Review the proposed files above and let me know if you'd like to tweak anything
2. When you're happy, I'll create a branch and open a PR with these changes
3. After merging, enable Copilot code review: **Settings → Copilot → Code review**
