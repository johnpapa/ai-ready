# Report Template Reference

Display format for the AI-Readiness Report (Step 11), HTML report, badge, and PR creation.

## Scoring

Count how many of the 11 assets (SKILL.md § The 11 tracked assets) have **Nailed It** status. That count sets
the medal — then **apply the prerequisites**, which can only lower it.

| Medal | Name | Count | Also required | What it means |
|-------|------|-------|---------------|---------------|
| 🥉 | **Getting Started** | 1–3 | — | A few of the files exist. Nothing in the repo tells an agent how it works |
| 🥈 | **On Track** | 4–6 | — | Real scaffolding is in place, but the conventions are still in people's heads |
| 🥇 | **Solid** | 7–9 | `AGENTS.md` nailed | The conventions are written down, in the one file every tool reads |
| 🏆 | **AI-Ready** | 10–11 | every 🤖 AI Context asset nailed | Conventions, boundaries, reviewers and procedures all live in the repo |

**The prerequisites are not decoration.** A repo can reach seven nailed assets on a changelog, docs, issue
templates, a PR template, CI, and two reviewer agents — with no `AGENTS.md` at all. That repo is well maintained. It is not AI-ready, and a plain count would hand it 🥇. So the count is a
ceiling, not a score: without `AGENTS.md` nailed the repo stops at 🥈 however high the count goes, and if any
🤖 AI Context asset is short it stops at 🥇.

**What the score does not measure.** It measures what is *in place*. It does not measure whether agents write
better pull requests in this repo, because nothing here has measured that.

Build the progress bar using 🟩 for nailed, 🟨 for could-be-better, and ⬜ for missing — always 11 squares.

**When a prerequisite caps the medal, say so on the score line** and name what would lift it — a capped medal
with no explanation reads like a bug. For example:

```
📊 **Your Repo Today** · 🥈 **On Track** · 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟨 · 9 of 11 nailed
↳ held below 🥇 — `AGENTS.md` has no `## Never merges without a human` section
```

**Never quote a time saving.** No "45-minute review becomes 5 minutes", no percentage, no multiplier. Nothing
in this skill measures review time, and a maintainer who does track it will spot the invented number and stop
trusting the rest of the report.

## AI-Readiness Report format

Display this report:

```
🎯 **AI-Readiness Report**

Here's what an AI agent can learn about this repo from the repo
itself today — and what it still has to guess.

**{repo-name}**

---

📊 **Your Repo Today** · {medal} **{level-name}** · {progress-bar} · {nailed} of 11 nailed
{languages} · {frameworks} · {test-runner} ({test-count}) · `{build-command}`

🤖 **Existing AI Config (detected)**

_Include this section only if the repo already has AI configuration (copilot-instructions.md, custom agents, custom skills). Omit it entirely if there is no pre-existing AI config._

| Asset | Detail |
|-------|--------|
| {asset-name} | {detail — e.g., "542 lines — components, testing, shims, docs"} |
| {.github/agents/} | {count} agents: {names} |
| {.github/skills/} | {count} skills: {names} |

⚠️ **Instruction Consistency**

_Show this section when consistency issues are found — skip it when everything lines up._

| Issue | Files | Detail |
|-------|-------|--------|
| {issue-type} | {file1} ↔ {file2} | {specific contradiction or duplication} |

✅ **Nailed It ({count})**

| Asset | Detail |
|-------|--------|
| {asset-name} | {one-line detail} |
| ... | ... |

💡 **Could Be Better ({count})**

| Asset | Suggestion |
|-------|-----------|
| {asset-name} | {suggestion} |
| ... | ... |

_Why these matter:_ {brief explanation of why the could-be-better items are worth improving}

⭕ **Missing ({count})**

| Asset | Why it matters |
|-------|---------------|
| {asset-name} | {why it matters} |
| ... | ... |

_Why these matter:_ {brief explanation of what the missing items cost the repo}

---

🛠️ **What I'd Like To Do** — proposed changes to close the gaps:

| Action | Detail |
|--------|--------|
| ➕ Create | `{filename}` — {what it will contain} |
| 🔍 Audit | `{filename}` — {what drifted and suggested fix} |
| ⏭️ Skip | `{filename}` — skipped (user requested) |
| 💬 Suggest | {suggestion} |
| ✅ Skip | {count} files already in great shape |

_For monorepos: list each `.github/instructions/{area}.instructions.md` file created as a separate ➕ Create row._

---

🏆 **If You Accept** · {after-progress-bar} · {after-nailed} of 11 nailed → {after-medal} **{after-level}**

🤖 AI Context        {6 status indicators}
🔧 Dev Workflow      {3 status indicators}
📖 Onboarding        {2 status indicators}

---

🚀 **What's Next?**

👉 **Create the PR now** — just say:
\```
create a branch and open a PR with these changes
\```

👉 **Tweak first** — tell me what to change:
\```
update the AGENTS.md to include more detail about the command registration pattern
\```

👉 **Share the report** — want a visual version for your team?
\```
generate an HTML report I can share
\```

👉 **Skip for now** — no worries, the analysis is done. Come back anytime and say `make this repo ai-ready` to pick up where you left off.
```

## Report template rules

- **Nailed It** = asset exists and is well-customized to the repo
- **Could Be Better** = asset exists but has gaps or could be enhanced
- **Missing** = asset does not exist and should be created
- If a section has 0 items (e.g., nothing missing), omit that section entirely
- The tech profile table should only include rows that apply (e.g., skip "Frameworks" if none detected)
- Keep each detail to one short line — no multi-line descriptions
- The "What I Did" section should list every file that was created, suggested, or skipped
- **Show an updated progress bar** after the "What I Did" section — recount nailed assets (counting all created files as now "Nailed It"), determine the new medal, and show the category breakdown. This shows the user the improvement visually (e.g., going from 🥈 On Track · 🟩🟩🟩🟩🟩🟨⬜⬜⬜⬜⬜ · 5 of 11 → 🏆 AI-Ready · 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 · 11 of 11)
- The "What To Do Next" section should include only the bullet points that are relevant — e.g., if no files were created, skip "review generated files" and instead say something like "Your repo is already AI-ready — nice work!"
- **Issue/PR provenance is mandatory** — every issue comment, PR comment, or PR body update generated by this skill must include `Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)`.
- **Documentation sync is mandatory** — when changing generated guidance, templates, or PR behavior, update related documentation to match the repository's documented standards and maintenance matrix.

## HTML report (optional)

*Why?*: Terminal reports are great for the developer running the skill. But when you need to share results with a manager, post to a wiki, or attach to an email — you need something visual.

If the user asks for an HTML report (e.g., "generate a report I can share", "make an HTML report"), generate a self-contained `ai-ready-report.html` in the repo root.

The HTML report mirrors the terminal summary — same sections, same data, same structure:

1. **Header** — repo name, maturity level with emoji medal (🥉🥈🥇🏆), weighted score percentage, progress bar, generation date
2. **Tech profile** — languages, frameworks, test runner, build command
3. **Existing AI config** — if detected (copilot-instructions.md, custom agents/skills)
4. **Instruction consistency** — if issues found
5. **Asset status** — three groups: ✅ Nailed It, 💡 Could Be Better, ⭕ Missing — with one-line details per asset
6. **What was generated** — action table (➕ Create, 🔍 Audit, ⏭️ Skip, 💬 Suggest)
7. **Updated score** — before/after with maturity level change
8. **What to do next** — remaining recommendations

The file must be self-contained (inline CSS, no external dependencies) and shareable — one file you can open in any browser or drop into an email. Use green/amber/gray status colors, system fonts, and a responsive layout. Keep it simple — this is a summary, not a dashboard.

Generate the HTML report only when the user asks for it. The terminal output is always the default.

## 11a. AI-Ready badge

Check if the README already contains an `AI--Ready` badge. If it does not, **automatically** insert this badge at the top of the README, after any existing title or badge row — do not ask, just add it:

```markdown
[![AI Ready](https://img.shields.io/badge/AI--Ready-yes-brightgreen?style=flat)](https://github.com/johnpapa/ai-ready)
```

The badge is a static Shields.io image with zero dependencies. It links back to the ai-ready repo so others can discover it. Include this in the "What I Did" section of the report as a `➕ Create` action.

## 11b. PR creation flow

After displaying the report and handling the badge, **ask the user** if they want to create a branch and open a PR. Do not tell them to type a command — ask them directly:

_"Would you like me to create a branch and open a PR with these changes?"_

If the user agrees:

1. **Check push permissions** from Step 0b.
2. **If the user has push access**: create a feature branch (e.g., `feat/ai-ready-config`), commit all new/modified files (including the badge), push, and open a PR targeting the **default branch** (detected in Step 0b — never assume `main`).
3. **If the user does NOT have push access**: use a fork-based flow automatically — fork the repo (`gh repo fork --clone=false`), add the fork as a remote, push the branch to the fork, then open a cross-fork PR (`gh pr create --head {user}:feat/ai-ready-config`). Handle it end-to-end — never ask the user to figure out the fork workflow.
4. **Before opening the PR**: sync with the target branch and attempt to resolve merge conflicts. If conflicts cannot be resolved confidently, ask the user whether to proceed with help resolving conflicts or pause for manual intervention.

Include a summary of what was added and the before/after score in the PR body, and include `Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)` in that PR body summary. If the user declines, end the session gracefully.

**Always add exactly one consolidated report comment to the PR.** After creating the PR, post a single comment with a condensed version of the AI-Readiness Report and include all immediate asks/clarifications in that same comment:

```
## 🎯 AI-Readiness Report

**{repo-name}**

**Before:** {before-medal} **{before-level}** · {before-nailed} of 11 nailed
**After this PR:** {after-medal} **{after-level}** · {after-nailed} of 11 nailed

🤖 AI Context        {status indicators}
🔧 Dev Workflow      {status indicators}
📖 Onboarding        {status indicators}

| Action | File |
|--------|------|
| ➕ Create | `{filename}` |
| ... | ... |

Assisted by [ai-ready](https://github.com/johnpapa/ai-ready)
```

If additional clarification is needed right away, **update the same comment** (or include it in the PR body update) instead of posting serial "quick/final clarification" follow-up comments. Only add a new comment later when there is truly new information (e.g., user asked a new question, CI status changed, or scope changed).

*Why?*: The PR body is written once, but the report comment is what reviewers see first. A single, scannable summary avoids notification spam and makes it easy to understand impact at a glance.
