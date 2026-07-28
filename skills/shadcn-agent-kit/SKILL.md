---
name: shadcn-agent-kit
description: Plan and deliver a dashboard through the Prismo CLI, an available shadcn-compatible recipe, one typed data adapter, and explicit verification evidence. Use for dashboard requests that need minimal project-side code and a reviewable Registry install.
---

# Prismo CLI Skill

Use the local Prismo CLI to turn a dashboard request into an inspectable install plan and proof report. The CLI is the execution boundary; this Skill supplies workflow and safety guidance only. Install editable source only after the user reviews the dry-run. The directory name remains `shadcn-agent-kit` only as a migration alias.

This is an independent community project. It is not affiliated with, endorsed by, or sponsored by shadcn or shadcn/ui. The shadcn name describes compatibility only.

## Workflow

1. Inspect the target before choosing a recipe.
   - Locate this installed Skill directory (the directory containing this `SKILL.md`), then run `bun <skill-dir>/scripts/dashboard-agent.js inspect --cwd <project-dir>`.
   - The bundled script is self-contained: do not invoke repository scripts or import repository source files.
   - The CLI locates a single shadcn workspace and uses fixed `shadcn info --json` output as the project truth source.
   - If multiple `components.json` files exist, pass the exact workspace; never guess.
   - Also read the target `AGENTS.md`, router, scripts, and existing UI conventions.
   - Do not switch the target package manager or replace established configuration.
2. Create a machine-readable plan.
   - Run `bun <skill-dir>/scripts/dashboard-agent.js plan --cwd <project-dir> --request '<request>' --json`.
   - Review `DashboardSpec`, `ProjectProfile`, `RecipeDecision`, `InstallPlan`, and unresolved fields.
   - Exit code `3` means clarification or rejection is required; do not work around it.
   - Candidate entries are explanatory only. Never generate an install command for them.
   - If no Available recipe satisfies the request, explain the gap and stop before installation.
3. Preview the change.
   - Execute the exact `InstallPlan.argv`; it uses the public Registry URL and `--dry-run`.
   - Report files to create or update, dependencies, conflicts, and assumptions.
   - Ask before overwriting a modified or unknown file.
4. Install source and adapt data.
   - Run the reviewed add command.
   - Keep installed source in the target project; do not introduce a hosted UI runtime.
   - Read [data-adapters.md](references/data-adapters.md) and place project-specific mapping behind one source adapter.
   - For tables, read [table-boundaries.md](references/table-boundaries.md) and choose L0, L1, or L2 explicitly.
5. Produce proof.
   - Run `bun <skill-dir>/scripts/verify-install.ts <project-dir> [component-path]`.
   - Also run the target's relevant typecheck, tests, and production build.
   - Verify success, loading, empty, and contract-error states plus 375, 768, and 1440 widths.
   - Report passed, failed, and unverified checks separately. Never infer production or accessibility success from a build alone.

## Safety boundaries

- Do not commit, push, deploy, delete files, modify databases, or manage worktrees unless the user explicitly authorizes it.
- Do not install Candidate recipes or fabricate Registry endpoints, dry-run output, screenshots, or proof results.
- Do not silently overwrite target files.
- Prefer the smallest adapter and route integration that satisfies the request.
- Treat authentication, permissions, export jobs, virtualization, and cross-page selection as application concerns, not shadcn component features.

## Output contract

Return:

- `ProjectProfile`: detected stack, package manager, aliases, router, styling, and risks.
- `DashboardSpec`: inferred intent, widgets, data mode, table level, states, and unresolved fields.
- `RecipeDecision`: request summary, considered Available recipes, selected recipe, fit, and rejected alternatives.
- `InstallPlan`: Registry URL, exact command, file/dependency changes, adapter seam, table level, and conflicts.
- `ProofReport`: typecheck, build, contract, four states, responsive widths, accessibility basics, and unverified items.
