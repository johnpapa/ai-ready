# Eval run — <owner>/<repo>

| | |
|---|---|
| **Date** | YYYY-MM-DD |
| **Skill version** | `metadata.version` from SKILL.md |
| **Commit** | The ai-ready commit SHA evaluated |
| **Agent / model** | e.g. Copilot CLI, Claude Code, Codex |
| **How it was run** | Installed and invoked / instructions applied by hand — say which, exactly |
| **Target repo** | Link, and one line on what kind of repo it is |
| **Did you write this repo?** | yes / no — if yes, say why no other target would do |

## Result

**Checks failed: N of M.** List the failing check ids, or "none".

## Failures

For each failure: the check id, the generated line that failed it, and one line on why it is wrong.

### <check-id>

```
<the exact generated text>
```

Why it fails: ...

## What the run confirmed works

Name the paths that behaved correctly — especially guardrails that correctly produced *nothing*. A skip is a
result, not an absence of one.

## What this run did not exercise

Be specific. "This repo has no database, so the schema/data-loss row was never tested" is the most useful
sentence in a results file, because it tells the next person what to go and find.

## Follow-ups filed

Links to issues or PRs opened from this run, or "none".
