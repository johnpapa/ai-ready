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

**The numbers, and they are much smaller than a skill's.** `SKILL.md` targets 500 lines. That number does not
transfer — `AGENTS.md` is read before *every* task, not only when a skill triggers, so its budget is tighter by
roughly an order of magnitude:

| Source | Target |
|---|---|
| Anthropic, for `CLAUDE.md` | Under **200 lines**; longer files consume more context and reduce adherence |
| Community consensus, `agents.md` | Under **150 lines** where possible |
| **Addy Osmani, starting point** | **20–30 lines**, covering what agents most often get wrong |

Osmani's is the one worth taking seriously, because it changes the default. Start at 20–30 lines and **add
sections in response to real agent mistakes, not hypothetical ones.** Treat 150 as a ceiling you should rarely
approach, never as a budget to fill.

There is a mechanism behind the ceiling, not just token cost. Frontier models reliably follow somewhere around
**150–200 instructions** before adherence degrades, and a coding agent's own system prompt already spends a
chunk of that before your file is read. Past the limit the model starts summarizing and dropping rules — so an
over-long `AGENTS.md` does not merely cost more, it makes the rules that matter **less likely to be followed**.
Every line you add competes with the lines already there.

Osmani names the usual cause: auto-generated context files *"hurt agent performance and inflate costs because
they duplicate what agents can already discover."*

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

**Derive every line from this repo. Do not copy a list.** Only one of these conditions generalizes; the rest
depend entirely on what the repo has. The example below is a Node web service with a published API — a VS Code
extension or a static site shares almost none of it:

```markdown
## Done means
- `npm run verify` exits 0
- Any behavior change ships with a test that fails without the change
- A change to a response shape updates `openapi.yaml` in the same pull request
```

Line by line, so you can tell which kind you are writing:

| Line | Where it came from |
|---|---|
| `npm run verify` exits 0 | **This repo's actual script.** Read `package.json`. If the repo has no single verify command, name the real ones: `npm test && npm run lint` |
| A test that fails without the change | **The only line that generalizes.** Include it in every repo that has tests at all |
| `openapi.yaml` in the same pull request | **Only because this repo publishes a contract.** Omit it entirely when there is none |

Three to five lines is the right size. A longer list is a checklist nobody finishes, and every line still has
to be decidable by a machine — `npm run verify` exits 0 qualifies, "code is clean" does not.

**`## Never merges without a human`** — the boundary.

**Always write the definition into the generated file**, directly under the heading, exactly as in the template
below. The phrase is ambiguous alone and it *will* be challenged — "I tell agents to merge when they're done,
is that banned?" is the first question anyone asks. It is not banned: the definition draws the line at whether
a person read *this diff*, so standing approval stays fine everywhere off the list. See § Defining below for the objections and the answers.

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

Three fair objections, answered:

- **"I tell agents to merge when they're done — is that banned?"** No. The list is what makes standing approval
  *safe* everywhere off it. A repo with no list has to treat every change as the risky one.
- **"A human did merge it, though."** Approving four pull requests in ninety seconds satisfies "a human merged
  it" and nothing else. A click buys a record of who to blame, not safety.
- **"So who is allowed to merge?"** Wrong question. This is about *when* the decision is made, not who holds
  permissions. Branch protection answers that one.

### What this means for the rest of the file

`## Done means` is the other half and is often mistaken for the same thing. `## Done means` is what a change
must satisfy to be **finished**; `## Never merges without a human` is what it cannot decide **alone**. A change
can be done and still be on the list.

## Where the untestable-claims rule came from

Provenance for the Step 2 rule about *"this can't be tested"* claims, in case someone asks whether it is real.

`vscode-peacock#757` claimed a `vscode.env.remoteName` feature could not be covered, because the fast mocked
unit lane's `vscode` stub has no `env.remoteName` to toggle. True for that lane. The slower host lane, with a
real Extension Host and Sinon, was already stubbing `vscode.env.remoteName` in another test file.

The claim was false once the other lane was checked, and a regression test was added. That is why the rule is
gated on a repo actually having more than one lane: in a single-lane setup it would be advice about a situation
the repo does not have.
