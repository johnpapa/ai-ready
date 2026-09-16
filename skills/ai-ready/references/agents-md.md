# AGENTS.md Reference

What belongs in `AGENTS.md`, what does not, and where the rest goes. Read this in Step 2.

## The correction this file exists to make

"Single source of truth" means **one canonical entry point**, not one enormous file.

The failure mode `AGENTS.md` fixes is **duplication** — the same convention living in
`.github/copilot-instructions.md` and `CLAUDE.md` and `.cursorrules`, drifting apart until two agents work from
two versions of the same standard. That problem is real and pointer files solve it.

But solving it by moving *everything* into one file trades a drift problem for a context problem, and the
context problem is worse because it is invisible. `AGENTS.md` is read **before every agent task**. Every line in
it is paid for on every run, and every line competes for the model's attention with the actual task.

> Keep AGENTS.md under 150 lines when possible. Agents load files into context windows, and excessive length
> wastes tokens while burying important information.
>
> — community guidance, consistent across `agents.md` write-ups

Addy Osmani puts the failure more sharply: auto-generated context files *"hurt agent performance and inflate
costs because they duplicate what agents can already discover."*

## The discoverability test

Before writing any section, ask:

> **Can the agent find this by reading the code?**

If yes, **do not write it down.** It costs attention on every task and buys nothing.

| Commonly generated | Verdict |
|---|---|
| A directory tree of `src/`, `tests/`, `docs/` | **Cut.** The agent can list the directory |
| "This is a TypeScript project using React" | **Cut.** It can read `package.json` |
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

## The anchoring trap

Naming a deprecated technology biases generation **even when you are forbidding it**. The model struggles to
separate *"what we used to use"* from *"what you should use"*, and the name itself carries attention weight.

Prefer stating the positive rule. `Use the v2 client in lib/api/` beats `Do not use the old v1 client`.

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

## What "never split" actually means

Step 3's rule is about **duplication, not placement**:

- **Never state the same convention in two files.** That is what drifts.
- **Do split by scope.** A rule that only applies to `packages/api/` belongs in `packages/api/AGENTS.md`.

A pointer file (`CLAUDE.md`, `.cursorrules`) still holds nothing of its own. That part is unchanged — those
files exist because tools look for different filenames, not because they have different content.

## Length

Treat **~150 lines** as the target for the root file, the same way `SKILL.md` treats 500: a signal to move
something, never a reason to delete something load-bearing.

When it grows past that, work down the placement table above. If a section cannot move because it genuinely
applies to every task, it stays — and the file is longer than the target, which is fine and worth saying in the
report rather than quietly trimming something useful.

## Report this honestly

If the repo's existing `AGENTS.md` is well past the target, say so with the number and name the sections that
could move. Do not rewrite it unasked — the same Do No Harm rule applies here as everywhere else.

## Defining `## Never merges without a human`

The heading is ambiguous on its own, and it will be challenged the first time someone who works with agents
reads it. Every generated file must carry the definition directly under the heading:

> A person has to have **read this diff** before it lands. Telling an agent "merge it when you're done" is
> approving a goal, not this change — so it does not count for anything on this list. Everywhere else it counts
> fine, which is the point of having a list.

Three objections that sentence answers, all of which are fair:

**"I tell agents to merge when they're done. Is that banned?"** No, and it should not be. Standing approval is
a reasonable way to work, and drawing this boundary is exactly what makes it *safe* for everything off the
list. The section enables autonomy rather than withholding it — a repo with no list has to treat every change
as the risky one.

**"A human did merge it, though."** Someone approving four pull requests in ninety seconds without opening them
satisfies "a human merged it" and satisfies nothing else. If the bar is a click, the section buys you a record
of who to blame and no safety at all. The bar is that a person **read the diff**.

**"So who is allowed to merge?"** Not the question. This is about *when the decision is made* — before the
change exists, or after someone has seen it — not about who holds permissions. Branch protection answers the
permissions question; this section answers the timing one.

### What this means for the rest of the file

`## Done means` is the other half and is often mistaken for the same thing. `## Done means` is what a change
must satisfy to be **finished**; `## Never merges without a human` is what it cannot decide **alone**. A change
can be done and still be on the list.
