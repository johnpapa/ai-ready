import { joinSession } from "@github/copilot-sdk/extension";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const session = await joinSession({
    tools: [
        {
            name: "analyze_repo_for_ai_readiness",
            description: "Analyzes the current repository to determine its language, framework, test setup, CI/CD, and existing AI configuration. Returns a structured report of what exists and what's missing for AI-ready configuration.",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
            handler: async (_args, _invocation) => {
                const cwd = process.cwd();
                const analysis = {
                    repoRoot: cwd,
                    repoName: basename(cwd),
                    languages: [],
                    frameworks: [],
                    packageManager: null,
                    buildCommands: [],
                    testSetup: { runner: null, directory: null, commands: [] },
                    cicd: { workflows: [], hasPrChecks: false },
                    existingAiConfig: {
                        hasAgentsMd: false,
                        hasCopilotInstructions: false,
                        hasCopilotSetupSteps: false,
                        hasSkills: false,
                        hasExtensions: false,
                    },
                    repoConfig: {
                        hasCodeowners: false,
                        hasDependabot: false,
                        hasIssueTemplates: false,
                        hasPrTemplate: false,
                        hasContributing: false,
                        hasLicense: false,
                    },
                    directoryStructure: [],
                    missing: [],
                };

                // Detect languages
                if (existsSync(join(cwd, "package.json"))) {
                    analysis.languages.push("JavaScript/TypeScript");
                    analysis.packageManager = "npm";
                    try {
                        const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
                        if (pkg.scripts) {
                            analysis.buildCommands = Object.entries(pkg.scripts)
                                .filter(([k]) => /build|compile|bundle/i.test(k))
                                .map(([k, v]) => ({ name: k, command: v }));
                            const testScripts = Object.entries(pkg.scripts)
                                .filter(([k]) => /test/i.test(k));
                            if (testScripts.length > 0) {
                                analysis.testSetup.commands = testScripts.map(([k, v]) => ({ name: k, command: v }));
                            }
                        }
                        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
                        // Framework detection
                        if (allDeps["react"]) analysis.frameworks.push("React");
                        if (allDeps["next"]) analysis.frameworks.push("Next.js");
                        if (allDeps["vue"]) analysis.frameworks.push("Vue");
                        if (allDeps["angular"]) analysis.frameworks.push("Angular");
                        if (allDeps["express"]) analysis.frameworks.push("Express");
                        if (allDeps["phaser"]) analysis.frameworks.push("Phaser");
                        if (allDeps["svelte"]) analysis.frameworks.push("Svelte");
                        if (allDeps["fastify"]) analysis.frameworks.push("Fastify");
                        // Test runner detection
                        if (allDeps["@playwright/test"]) analysis.testSetup.runner = "Playwright";
                        else if (allDeps["jest"]) analysis.testSetup.runner = "Jest";
                        else if (allDeps["vitest"]) analysis.testSetup.runner = "Vitest";
                        else if (allDeps["mocha"]) analysis.testSetup.runner = "Mocha";
                        // TypeScript
                        if (allDeps["typescript"]) {
                            if (!analysis.languages.includes("TypeScript")) {
                                analysis.languages = analysis.languages.filter(l => l !== "JavaScript/TypeScript");
                                analysis.languages.push("TypeScript");
                            }
                        }
                    } catch {}
                }
                if (existsSync(join(cwd, "Cargo.toml"))) analysis.languages.push("Rust");
                if (existsSync(join(cwd, "go.mod"))) analysis.languages.push("Go");
                if (existsSync(join(cwd, "requirements.txt")) || existsSync(join(cwd, "pyproject.toml"))) analysis.languages.push("Python");
                if (existsSync(join(cwd, "Gemfile"))) analysis.languages.push("Ruby");
                if (existsSync(join(cwd, "pom.xml")) || existsSync(join(cwd, "build.gradle"))) analysis.languages.push("Java");

                // Package manager
                if (existsSync(join(cwd, "yarn.lock"))) analysis.packageManager = "yarn";
                if (existsSync(join(cwd, "pnpm-lock.yaml"))) analysis.packageManager = "pnpm";
                if (existsSync(join(cwd, "bun.lockb"))) analysis.packageManager = "bun";

                // Test directory
                for (const dir of ["tests", "test", "__tests__", "spec", "e2e"]) {
                    if (existsSync(join(cwd, dir))) {
                        analysis.testSetup.directory = dir;
                        break;
                    }
                }

                // CI/CD
                const workflowDir = join(cwd, ".github", "workflows");
                if (existsSync(workflowDir)) {
                    try {
                        const files = readdirSync(workflowDir).filter(f => f.endsWith(".yml") || f.endsWith(".yaml"));
                        for (const file of files) {
                            try {
                                const content = readFileSync(join(workflowDir, file), "utf-8");
                                const hasPrTrigger = /pull_request/i.test(content);
                                analysis.cicd.workflows.push({ name: file, hasPrTrigger });
                                if (hasPrTrigger) analysis.cicd.hasPrChecks = true;
                            } catch {}
                        }
                    } catch {}
                }

                // Existing AI config
                analysis.existingAiConfig.hasAgentsMd = existsSync(join(cwd, "AGENTS.md"));
                analysis.existingAiConfig.hasCopilotInstructions = existsSync(join(cwd, ".github", "copilot-instructions.md"));
                analysis.existingAiConfig.hasCopilotSetupSteps = existsSync(join(cwd, ".github", "copilot-setup-steps.yml"));
                analysis.existingAiConfig.hasSkills = existsSync(join(cwd, ".github", "skills"));
                analysis.existingAiConfig.hasExtensions = existsSync(join(cwd, ".github", "extensions"));

                // Repo config
                analysis.repoConfig.hasCodeowners = existsSync(join(cwd, ".github", "CODEOWNERS")) || existsSync(join(cwd, "CODEOWNERS"));
                analysis.repoConfig.hasDependabot = existsSync(join(cwd, ".github", "dependabot.yml"));
                analysis.repoConfig.hasIssueTemplates = existsSync(join(cwd, ".github", "ISSUE_TEMPLATE"));
                analysis.repoConfig.hasPrTemplate = existsSync(join(cwd, ".github", "PULL_REQUEST_TEMPLATE.md"));
                analysis.repoConfig.hasLicense = existsSync(join(cwd, "LICENSE")) || existsSync(join(cwd, "LICENSE.md"));
                // Check for contributing section in README
                try {
                    if (existsSync(join(cwd, "README.md"))) {
                        const readme = readFileSync(join(cwd, "README.md"), "utf-8");
                        analysis.repoConfig.hasContributing = /## Contributing/i.test(readme);
                    }
                } catch {}

                // Directory structure (top 2 levels, skip common noise)
                const skipDirs = new Set(["node_modules", ".git", "dist", "build", ".next", "__pycache__", ".venv", "target", "vendor"]);
                try {
                    const entries = readdirSync(cwd);
                    for (const entry of entries.sort()) {
                        if (skipDirs.has(entry)) continue;
                        const fullPath = join(cwd, entry);
                        try {
                            const stat = statSync(fullPath);
                            if (stat.isDirectory()) {
                                const subEntries = readdirSync(fullPath)
                                    .filter(e => !skipDirs.has(e))
                                    .slice(0, 10);
                                analysis.directoryStructure.push({
                                    name: entry + "/",
                                    children: subEntries.map(e => {
                                        try {
                                            return statSync(join(fullPath, e)).isDirectory() ? e + "/" : e;
                                        } catch { return e; }
                                    }),
                                });
                            } else {
                                analysis.directoryStructure.push({ name: entry });
                            }
                        } catch {}
                    }
                } catch {}

                // Determine what's missing
                if (!analysis.existingAiConfig.hasAgentsMd) analysis.missing.push("AGENTS.md");
                if (!analysis.existingAiConfig.hasCopilotInstructions) analysis.missing.push(".github/copilot-instructions.md");
                if (!analysis.existingAiConfig.hasCopilotSetupSteps) analysis.missing.push(".github/copilot-setup-steps.yml");
                if (!analysis.cicd.hasPrChecks) analysis.missing.push(".github/workflows/ci.yml (PR checks)");
                if (!analysis.repoConfig.hasIssueTemplates) analysis.missing.push(".github/ISSUE_TEMPLATE/");
                if (!analysis.repoConfig.hasContributing) analysis.missing.push("README.md Contributing section");
                if (!analysis.repoConfig.hasCodeowners) analysis.missing.push(".github/CODEOWNERS");
                if (!analysis.repoConfig.hasDependabot) analysis.missing.push(".github/dependabot.yml");

                return JSON.stringify(analysis, null, 2);
            },
        },
    ],
    hooks: {
        onSessionStart: async () => {
            await session.log("AI-Ready Repo plugin loaded. Say 'make this repo ai-ready' to get started.");
        },
    },
});
