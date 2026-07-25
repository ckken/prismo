---
name: shadcn-agent-kit
description: Inspect a React project, select an available shadcn-compatible dashboard recipe, preview source changes, connect a typed data adapter, and produce verification evidence. Use for requests to add dashboard UI with minimal project-side code through a shadcn Registry URL.
---

# Shadcn Agent Kit

Turn a dashboard request into an inspectable install plan and proof report. Install editable source only after the user reviews the dry-run.

This is an independent community project. It is not affiliated with, endorsed by, or sponsored by shadcn or shadcn/ui. The shadcn name describes compatibility only.

## Workflow

1. Inspect the target before choosing a recipe.
   - Run `bun scripts/inspect-project.ts <project-dir>` from this skill directory.
   - Read the target `AGENTS.md`, package manager, `components.json`, aliases, router, Tailwind version, and existing UI conventions.
   - Do not switch the target package manager or replace established configuration.
2. Select from Available recipes only.
   - Read [scenario-catalog.md](references/scenario-catalog.md).
   - Run `bun scripts/select-recipe.ts '<request>'` for a deterministic shortlist.
   - Candidate entries are explanatory only. Never generate an install command for them.
   - If no Available recipe satisfies the request, explain the gap and stop before installation.
3. Preview the change.
   - Resolve the public Registry URL.
   - Run `shadcn add <url> --dry-run` with the target project's package runner.
   - Report files to create or update, dependencies, conflicts, and assumptions.
   - Ask before overwriting a modified or unknown file.
4. Install source and adapt data.
   - Run the reviewed add command.
   - Keep installed source in the target project; do not introduce a hosted UI runtime.
   - Read [data-adapters.md](references/data-adapters.md) and place project-specific mapping behind one source adapter.
   - For tables, read [table-boundaries.md](references/table-boundaries.md) and choose L0, L1, or L2 explicitly.
5. Produce proof.
   - Run `bun scripts/verify-install.ts <project-dir> [component-path]`.
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
- `RecipeDecision`: request summary, considered Available recipes, selected recipe, fit, and rejected alternatives.
- `InstallPlan`: Registry URL, exact command, file/dependency changes, adapter seam, table level, and conflicts.
- `ProofReport`: typecheck, build, contract, four states, responsive widths, accessibility basics, and unverified items.
