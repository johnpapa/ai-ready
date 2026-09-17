# Why the skill says what it says

Reasoning behind the rules in `skills/ai-ready/`. **Nothing here is read by an agent.**

`references/` holds only what changes agent behavior. Anything that exists to explain *why* a rule is the way
it is lives here, because an explanation the agent cannot act on still costs attention on every run that loads
it.

Read this when you want to argue with a rule, or when someone asks you to defend one.

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

## The anchoring trap

Naming a deprecated technology biases generation **even when you are forbidding it**. The model struggles to
separate *"what we used to use"* from *"what you should use"*, and the name itself carries attention weight.

Prefer stating the positive rule. `Use the v2 client in lib/api/` beats `Do not use the old v1 client`.

## What "never split" actually means

Step 3's rule is about **duplication, not placement**:

- **Never state the same convention in two files.** That is what drifts.
- **Do split by scope.** A rule that only applies to `packages/api/` belongs in `packages/api/AGENTS.md`.

A pointer file (`CLAUDE.md`, `.cursorrules`) still holds nothing of its own. That part is unchanged — those
files exist because tools look for different filenames, not because they have different content.

## Where the untestable-claims rule came from

Provenance for the Step 2 rule about *"this can't be tested"* claims, in case someone asks whether it is real.

`vscode-peacock#757` claimed a `vscode.env.remoteName` feature could not be covered, because the fast mocked
unit lane's `vscode` stub has no `env.remoteName` to toggle. True for that lane. The slower host lane, with a
real Extension Host and Sinon, was already stubbing `vscode.env.remoteName` in another test file.

The claim was false once the other lane was checked, and a regression test was added. That is why the rule is
gated on a repo actually having more than one lane: in a single-lane setup it would be advice about a situation
the repo does not have.

## The three objections

Three fair objections, answered:

- **"I tell agents to merge when they're done — is that banned?"** No. The list is what makes standing approval
  *safe* everywhere off it. A repo with no list has to treat every change as the risky one.
- **"A human did merge it, though."** Approving four pull requests in ninety seconds satisfies "a human merged
  it" and nothing else. A click buys a record of who to blame, not safety.
- **"So who is allowed to merge?"** Wrong question. This is about *when* the decision is made, not who holds
  permissions. Branch protection answers that one.

## Different models miss different things

Running the same prompt through two models is not redundancy — it is coverage. In practice a review agent on
one model catches things an agent on another model walks straight past, and the reverse, on the same diff.

So where the tool supports pinning a model per agent, **spread them**. Three adversarial reviewers on one model
is one reviewer with three prompts. Say this in the report; do not generate the `model` key (see *Frontmatter*).

## Why adding to SKILL.md requires naming a cut

`SKILL.md` sat within ten lines of its 500-line ceiling for three days. Not because the ceiling is too low —
because every trim was followed by a new rule going back in. Cut five instructions, add a new step. Move a
template to `references/`, write a new policy section.

The CI budget check catches the symptom. It does not stop the cause, which is that adding always feels
justified in the moment and removing never does. Requiring a change to name what it removes forces the
comparison that otherwise never happens: is this new rule worth more than the one it displaces?

## Why detection tables may name tools but rules may not

These look like the same thing and are opposites.

A table listing `package-lock.json`, `Cargo.lock`, `go.sum`, `poetry.lock` is **coverage**. Naming many
ecosystems is how the agent recognizes any repo it lands in. Cutting that list would make the skill worse.

A rule that says *"every line must be machine-checkable — `npm run verify` exits 0 passes the test"* is a
**defect**. The rule is universal but the illustration is not, and an agent reading it in a Rust repo has to
decide whether the rule applies at all. Worse, it may write `npm run verify` into a file for a repo that has
no such command.

The test: if the tool name were removed, would the sentence still say what to do? In a detection table, no —
the names *are* the content. In a rule, yes — the names are decoration that narrows it.
