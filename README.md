<h1 align="center">Agenic</h1>

<p align="center"><strong>From intent to proof.</strong><br />A local, CLI-first UI delivery system for Coding Agents.</p>

Agenic is an open-source, Agent-first UI delivery system. It turns an intent or reference image into comparable UI directions, a reviewable plan, editable source composition, and proof from the real route. HeroUI is the version-pinned upstream UI foundation; Agenic owns the delivery protocol, Recipe layer, data adaptation, verification, and handoff.

The CLI is the sole execution control plane. Skills and the website help an agent discover, review, and preview Agenic; they never replace its deterministic project inspection, plan, or proof boundary.

## What is available now

| Surface | Status | Evidence-backed boundary |
|---|---|---|
| `agenic inspect / plan` | Available | Finds one supported workspace, creates a `DashboardSpec`, selects only the available recipe, and emits a dry-run install argv. |
| `dashboard-overview-01` | Available | Editable Registry source with KPI, chart, server-paginated table, Zod contract, and four explicit states. |
| Dashboard web catalog | Available | Route-based responsive demo, deterministic data, and a copyable Registry dry-run command. |
| Prompt/Image, Variants, `preview / apply / verify`, Blocks, Components, Templates, Full-page, Starter | Target | Accepted product scope; not yet available until handoff proof passes. |

The [free-parity boundary](docs/product/agenic-free-parity-boundary.md) and [handoff acceptance boundary](docs/agents/agenic-handoff.md) prevent a green build from being presented as end-to-end delivery.

## Start locally

```bash
bun install
bun run dev

# From this checkout
bun run agenic inspect --cwd apps/web --json
bun run agenic plan \
  --cwd apps/web \
  --request "增加经营总览：3 个 KPI、趋势图、服务端分页表格" \
  --json
```

`inspect` and `plan` are read-only. `preview`, `apply`, and `verify` are intentionally not advertised as working commands until the planned handoff contract, stale/conflict protection, real route evidence, and fresh-process proof exist.

## Install the available recipe

```bash
bunx --bun shadcn@4.14.1 add \
  https://ckken.github.io/agenic/r/dashboard-overview-01.json \
  --dry-run
```

Review files and dependencies, then remove `--dry-run` only in a compatible target project. Agenic produces editable Recipe composition and does not introduce a hosted UI runtime.

## Product boundary

Agenic targets these free functional outcomes: Prompt-to-UI, Image-to-UI, three materially distinct Variants, selection/refinement, direct source delivery, Blocks, Components, Templates, Full-page generation, and an optional-module Starter (UI, auth, data, email, AI, storage, docs, SEO). Pricing, subscriptions, trials, quotas, licenses, paid support, and payment handling are out of scope.

```text
Intent / Image → Agenic CLI → 3+ Variants → Select / refine
               → Preview → Apply → current codebase → Verify / Proof
```

## Migration to Agenic

The canonical GitHub repository, CLI, workspace packages, Registry URL, web identity, and documentation are now `Agenic`. `prismo`, `shadcnagent`, and `dashboard-agent` remain compatibility command aliases so existing local automation keeps working. The first delivery vertical remains Dashboard; it does not imply that unimplemented wider UI capabilities are already available.

## Verification

```bash
bun run check
bun run skill:validate
bun run proof:install
bun run handoff:verify
```

The daily 09:30 Asia/Shanghai [Agenic Handoff Audit](.github/workflows/agenic-handoff-audit.yml) is read-only: it can report an auditor regression as a GitHub Issue, but never edits source, commits, pushes, deploys, or upgrades an unverified capability.

## License and independence

[MIT](LICENSE). Agenic is an independent community project. HeroUI is an Apache-2.0 upstream dependency, not an Agenic brand, hosted service, or control plane; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
