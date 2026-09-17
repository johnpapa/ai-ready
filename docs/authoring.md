# Authoring this skill

Everything a contributor needs when **changing the skill itself**. Deliberately not in `AGENTS.md`: it is
needed on one kind of task, not on every task, and `AGENTS.md` is loaded before all of them.

## Why the length targets exist

A skill loads in three levels, and the middle one is the expensive one:

| Level | When it is in context | Cost |
|---|---|---|
| `name` + `description` | Always | ~100 words |
| **SKILL.md body** | **Every time the skill triggers** | **The whole file** |
| `references/`, `scripts/`, `assets/` | Only when something reads them | None until then |

So every line in `SKILL.md` is paid for on every invocation, whether or not that run needs it. A line only
Step 11 uses is still loaded on a run that stops at Step 1.

Anthropic's own skill-authoring guidance puts the target at **under 500 lines**, and names the remedy:

> Keep SKILL.md under 500 lines; if you're approaching this limit, add an additional layer of hierarchy along
> with clear pointers about where the model using the skill should go next to follow up.
>
> — [`skill-creator`](https://github.com/anthropics/skills), Anthropic

**Treat it as a target, not a limit.** The same guidance calls the counts approximate and says you may go
longer if needed. 501 lines is not a failure; 600 lines of material that three-quarters of runs never use is.

When the file grows, move content to `references/` and leave a pointer saying when to read it — do not delete
something load-bearing to hit a number. Content that only one step needs is the first thing to move.

### The same argument applies to AGENTS.md, harder

`AGENTS.md` is read **before every agent task** — not just when a skill triggers — so its budget is tighter.
Community guidance lands around **150 lines**, and Addy Osmani's test is the sharp version of it: *can the agent
find this by reading the code?* If yes, cut it. Directory trees, tech-stack inventories and architecture
summaries all fail.

This repo's own `AGENTS.md` was 310 lines when that rule was written into the skill, which is how
`docs/authoring.md` came to exist. The generated guidance is in
[`skills/ai-ready/references/agents-md.md`](../skills/ai-ready/references/agents-md.md).

### Why lines alone are a weak signal, and what CI checks instead

This file is written as long, unwrapped paragraphs — one markdown line can carry a hundred words. Trimming a
sentence inside that paragraph removes real content and real token cost, but `wc -l` doesn't move, because the
paragraph is still one line. Line count only reacts to whole lines disappearing (a cut bullet, a removed table
row) — it's blind to everything else, which is exactly the gap that let this file carry unnecessary words
while comfortably under its line ceiling.

The wider ecosystem doesn't rely on lines alone either. Anthropic's own SKILL.md guidance recommends the body
stay under roughly **5,000 tokens** once loaded — a token figure, not a line figure. Community tooling for
AGENTS.md/CLAUDE.md-style files (e.g. `agent-md-bench`) reports size as lines **and** bytes **and** tokens
together, and describes a healthy target as "~200 lines / ~10 KB" — always paired, never lines alone.

CI now prints a **word-count signal** next to the line count, as a cheap proxy for tokens (roughly 1.3 tokens
per English word) that needs no tokenizer dependency:

| File | Line ceiling (enforced) | Word signal (not enforced) | Source |
|---|---|---|---|
| `SKILL.md` | 500 | **~3,750** | Anthropic's ~5,000-token body guidance, converted |
| `AGENTS.md` | 150 | **~1,400** | Scaled down from the ecosystem's ~200-line/10 KB pairing |

**The word signal never fails the build.** It's a number to notice, not a gate — going over it is a prompt to
look at the file, not a broken PR. Unlike the line ceiling, there's no established authority for these exact
word numbers; they're derived by converting the token guidance above, and worth revisiting if a better source
turns up.

## Adding a New Skill

1. Create `skills/<skill-name>/SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: What this skill does and when to invoke it
   ---
   ```
   `name` **must** match the parent directory name — the Agent Skills spec requires it, and Cursor and Codex
   reject skills where it doesn't.
2. Write step-by-step instructions in the markdown body
3. Add the skill path to `.github/plugin/plugin.json` (Copilot needs an explicit list). The Claude, Codex, and
   Agent Plugins manifests pick it up automatically from `skills/`
4. Update `README.md` to mention the new skill
5. Update this file (`AGENTS.md`) to reflect the new structure


## The full CI picture

### What CI enforces

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`. It blocks the merge on any of
these, so you don't have to remember them:

| Check | What it rejects |
|---|---|
| **SKILL.md frontmatter** | Any `SKILL.md` under `skills/` with no frontmatter, malformed delimiters, or a missing `name` or `description` |
| **YAML syntax** | Any `.yml`/`.yaml` under `.github/` that doesn't parse |
| **Manifest version parity** | `metadata.version` in `SKILL.md` disagreeing with any of `plugin.json`, `.github/plugin/plugin.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, or `.claude-plugin/marketplace.json` — all six must match |
| **Agent Skills spec compliance** | `name` not matching its directory, a name that isn't kebab-case, a `description` outside 1–1024 characters, non-portable frontmatter keys (only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`), or non-string `metadata` values |
| **skills CLI discovery** | A repo state where `npx skills add ./ --list` can't find `ai-ready` |
| **`skills.sh.json` parity** | A skill directory missing from `skills.sh.json`, or a listed skill that doesn't exist |

Version parity is the one that bites most often: bumping `SKILL.md` without the five manifests fails the build.

Run the whole set locally before pushing:

```bash
python3 -c "import yaml,glob;[yaml.safe_load(open(f)) for f in glob.glob('.github/**/*.y*ml',recursive=True)]"
npx -y skills@latest add ./ --list
```

### Detection tests

`tests/test_detection.py` checks the risk-path globs in `skills/ai-ready/data/risk-paths.yml` against fixture
repos in `tests/fixtures/`, each carrying an `expected.yml` that states which rows must match, which must
produce nothing, and which known false positives must fire. It runs in CI.

```bash
python3 tests/test_detection.py            # the fixtures
python3 tools/gen_detection_tables.py      # regenerate the markdown table from the data
python3 tools/gen_detection_tables.py --check   # what CI runs
```

`data/risk-paths.yml` is the **source of truth**. The table in `references/detection-tables.md` is generated
from it between `<!-- BEGIN GENERATED -->` markers, and CI fails if they drift. Edit the YAML, run the
generator, commit both.

When you fix a bad detection, add the case to a fixture in the same PR. That is what turns a one-off fix into a
regression test — `tests/fixtures/vscode-extension/` exists because `src/notification.ts` was once written into
a boundary as customer contact, and it now fails the build if that comes back.

### What CI does not enforce

**CI validates the skill's packaging and its detection data — not the skill's judgment.** Every check passes on
a `SKILL.md` whose instructions are wrong, contradictory, or produce broken output. The globs can be perfect
while the step that reads them still writes nonsense, because an agent does not run the globs literally; it
reads the table and pattern-matches.

That gap is what [`evals/`](evals/) is for: a fixed rubric, run by a person against a real repo, recorded in
`evals/results/`. It is not automated and it does not pretend to be. Run one before shipping a release, and
commit the result even when it goes badly — a results directory with only good runs in it is not evidence.

The only thing that catches a bad *instruction* today is a manual smoke test: install the skill, invoke it on a
real repo, and read what it generated. Nothing records that this happened, which is why the PR template asks
you to name the repo you ran it against.

So before opening a PR that changes skill behavior:

1. Install the skill locally — copy `skills/ai-ready/SKILL.md` to `~/.copilot/skills/ai-ready/SKILL.md`
2. Run it against a repo that actually exercises the path you changed
3. Read the generated files, not just the report
4. Put the repo and the result in the **Tested On** table in your PR


## Packaging model

Distribution follows existing ecosystem conventions — **nothing bespoke**. The canonical
`skills/ai-ready/SKILL.md` follows the [Agent Skills](https://agentskills.io) standard, which is all the
[skills CLI](https://github.com/vercel-labs/skills) (`npx skills add`) needs to install into 70+ agents.

The native plugin manifests are additive, for users who prefer their tool's own plugin system. All of them
describe the **same** `skills/ai-ready/` directory. The repo root doubles as the plugin root, which is why no
manifest needs to copy or relocate skill content.

| File | Consumed by | How it finds the skill |
|---|---|---|
| *(none — convention)* | `npx skills add johnpapa/ai-ready` | scans `skills/*/SKILL.md` |
| `.github/plugin/plugin.json` | GitHub Copilot CLI | explicit `"skills": ["./skills/ai-ready"]` |
| `.claude-plugin/plugin.json` | Claude Code | convention — `skills/` in plugin root |
| `.claude-plugin/marketplace.json` | Claude Code `/plugin marketplace add` | plugin `source: "./"` |
| `.codex-plugin/plugin.json` | OpenAI Codex | explicit `"skills": "./skills/"` |
| `.agents/plugins/marketplace.json` | Codex `plugin marketplace add` | plugin `source.path: "./"` |
| `plugin.json` | Cursor and Agent Plugins clients | convention — `skills/` in plugin root |
| `skills.sh.json` | skills.sh registry page | groups skills for display |

The `version` field must be identical in all five plugin manifests and in `SKILL.md` frontmatter
`metadata.version`. CI enforces this.

