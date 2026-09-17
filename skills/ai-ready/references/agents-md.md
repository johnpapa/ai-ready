# AGENTS.md Reference

What belongs in `AGENTS.md`, what does not, and where the rest goes. Read this in Step 2.

## The discoverability test

Before writing any section, ask:

> **Can the agent find this by reading the code?**

If yes, **do not write it down.** It costs attention on every task and buys nothing.

| Commonly generated | Verdict |
|---|---|
| A directory tree of `src/`, `tests/`, `docs/` | **Cut.** The agent can list the directory |
| A statement of the language or framework | **Cut.** The manifest says so |
| An architecture summary restating the file layout | **Cut.** Same information, stale within a month |
| A data-model summary | **Cut.** It can read `schema.prisma` |
| Build, test and lint **commands** | **Keep.** Often buried in tooling config, and needed every task |
| *Why* the layout is unusual — a directory that is not what it looks like | **Keep.** Not discoverable |
| Conventions mined from PR reviews | **Keep.** Exists nowhere in the code |
| The maintenance matrix | **Keep.** Cross-file coupling is the hardest thing to infer |
| `## Done means` / `## Never merges without a human` | **Keep.** Decisions, not facts |

Structure and stack sections are the ones to be ruthless about: generate them only for what is **surprising**,
and skip them entirely when the layout is conventional. A repo with `src/`, `tests/` and `docs/` needs no
structure section at all.

## Two rules with no room for judgment

- **State the positive rule, never the prohibition.** Write `Use the v2 client in lib/api/`, not `Do not use
  the v1 client`. Naming a deprecated thing makes the model more likely to reach for it, not less.
- **Never state the same convention in two files. Do split by scope.** A rule that only applies to
  `packages/api/` belongs in `packages/api/AGENTS.md`.

## Where everything else goes

Four placements, in order. Ask "how often is this needed?" and put it at the first one that fits.

| Needed | Goes in | Why |
|---|---|---|
| On **every** task | Root `AGENTS.md` | This is what the root file is for, and the only thing it is for |
| Only in one area of the repo | A **nested `AGENTS.md`** in that directory | Loaded only when work happens there |
| Only when performing one procedure | A **skill** (`.github/skills/`, Step 4d) | Loaded when its description matches the task |
| Rarely, or as lookup material | A linked doc in `docs/` | Read on demand, costs nothing until then |

**Nested `AGENTS.md` is part of the standard, not a workaround.** Agents walk up the directory tree from the
file being edited and combine every `AGENTS.md` they find, with the **closest one winning** on conflicts. This
is the intended way to scale: OpenAI's main repository carries dozens of them.

So for a monorepo, per-area conventions belong in `packages/<area>/AGENTS.md`, not in a growing root file. The
root keeps only what is true everywhere.

## Length

Start at **20–30 lines** and grow only when a real agent mistake proves something is missing. Treat **150** as
a ceiling rather than a target: past it, move something. Never delete something load-bearing to hit a number.

The difference between a target and a ceiling matters here. A target invites filling. This file gets *worse*
as it gets longer, because the rules compete with each other for a finite instruction budget.

When it grows past that, work down the placement table above. If a section cannot move because it genuinely
applies to every task, it stays — and the file is longer than the target, which is fine and worth saying in the
report rather than quietly trimming something useful.

## Report this honestly

If the repo's existing `AGENTS.md` is well past the target, say so with the number and name the sections that
could move. Do not rewrite it unasked — the same Do No Harm rule applies here as everywhere else.

## Generating the two sections

**`## Done means`** — the conditions a change must meet before it is finished.

**There is no template. Derive all three to five lines from this repo**, in this order:

1. **The verify command.** Find the command a maintainer runs before pushing — in this repo's task runner,
   script block, or CI workflow, whichever it uses. Name it exactly as it is written there. If the repo runs
   several, name them in order. If it has none, skip this line rather than inventing one.
2. **The test condition.** *Any behavior change ships with a test that fails without the change.* This is the
   only line that applies to every repo that has tests, so include it wherever tests exist.
3. **The contract line, only if this repo publishes something others depend on.** A schema, an interface
   definition, a public type — whatever this repo's consumers build against. Most repos publish nothing of the
   kind. Omit rather than invent.

Stop at five. A longer list is a checklist nobody finishes.

**`## Never merges without a human`** — the boundary.

**Always write the definition into the generated file**, directly under the heading, exactly as in the template
below. The phrase is ambiguous alone and it *will* be challenged — "I tell agents to merge when they're done,
is that banned?" is the first question anyone asks. It is not banned: the definition draws the line at whether
a person read *this diff*, so standing approval stays fine everywhere off the list. 

Seed the list from the risk paths actually present in this repo (see [detection-tables.md](detection-tables.md) § Risk path detection, generated
from [../data/risk-paths.yml](../data/risk-paths.yml)), then state each as a path or a condition rather than a
category.

**Before you write a line, check it against [`../data/risk-paths.yml`](../data/risk-paths.yml) § `false_positives`.** Those are not
hypothetical — every entry is a line this skill actually got wrong in a real repo. If what you matched appears
there, answer the row's `confirm` question by opening the file, and drop the line unless the answer holds up.
That list is the one part of this step with a regression test behind it
(`tests/fixtures/`), so treat a match as a stop sign rather than a hint:

```markdown
## Never merges without a human

A person has to have **read this diff** before it lands. Telling an agent "merge it when you're done" is
approving a goal, not this change — so it does not count for anything on this list. Everywhere else it counts
fine, which is the point of having a list.

- Anything under `db/migrations/`
- Anything that changes the shape of an existing API response
- Anything that sends messages to customers
- Anything that grants or changes permissions
```

Only list risk paths this repo actually has — a static site has no migrations, and inventing categories to
fill the section is the noise this skill exists to avoid. If the analysis finds none, say so explicitly in one
line rather than omitting the heading.


## Defining `## Never merges without a human`

The heading is ambiguous on its own, and it will be challenged the first time someone who works with agents
reads it. Every generated file must carry the definition directly under the heading:

> A person has to have **read this diff** before it lands. Telling an agent "merge it when you're done" is
> approving a goal, not this change — so it does not count for anything on this list. Everywhere else it counts
> fine, which is the point of having a list.

### What this means for the rest of the file

`## Done means` is the other half and is often mistaken for the same thing. `## Done means` is what a change
must satisfy to be **finished**; `## Never merges without a human` is what it cannot decide **alone**. A change
can be done and still be on the list.
