<p align="center">
  <img src="apps/web/public/brand/prismo-lockup.svg" width="360" alt="Prismo — Local UI delivery" />
</p>

<p align="center"><strong>From intent to proof.</strong><br />A local, CLI-first UI delivery system for Coding Agents.</p>

Prismo targets a complete free UI-delivery outcome: turn an intent or reference image into comparable UI directions, select one, deliver editable source, and prove the result. It does not copy another product's transport, hosted runtime, visual assets, or paid-plan behavior.

The CLI is the sole execution control plane. Skills and the website help an agent discover, review, and preview Prismo; they never replace its deterministic project inspection, plan, or proof boundary.

## What is available now

| Surface | Status | Evidence-backed boundary |
|---|---|---|
| `prismo inspect / plan` | Available | Finds one shadcn-compatible workspace, creates a `DashboardSpec`, selects only the available recipe, and emits a dry-run install argv. |
| `dashboard-overview-01` | Available | Editable Registry source with KPI, chart, server-paginated table, Zod contract, and four explicit states. |
| Dashboard web catalog | Available | Route-based responsive demo, deterministic data, and a copyable Registry dry-run command. |
| Prompt/Image, Variants, `preview / apply / verify`, Blocks, Components, Templates, Full-page, Starter | Target | Accepted product scope; not yet available until handoff proof passes. |

The [free-parity boundary](docs/product/prismo-free-parity-boundary.md) and [handoff acceptance boundary](docs/agents/prismo-handoff.md) prevent a green build from being presented as end-to-end delivery.

## Start locally

```bash
bun install
bun run dev

# From this checkout
bun run prismo inspect --cwd apps/web --json
bun run prismo plan \
  --cwd apps/web \
  --request "增加经营总览：3 个 KPI、趋势图、服务端分页表格" \
  --json
```

`inspect` and `plan` are read-only. `preview`, `apply`, and `verify` are intentionally not advertised as working commands until the planned handoff contract, stale/conflict protection, real route evidence, and fresh-process proof exist.

## Install the available recipe

```bash
bunx --bun shadcn@4.14.1 add \
  https://ckken.github.io/prismo/r/dashboard-overview-01.json \
  --dry-run
```

Review files and dependencies, then remove `--dry-run` only in a shadcn-initialized target project. Prismo produces editable source; it does not introduce a hosted UI runtime.

## Product boundary

Prismo targets these free functional outcomes: Prompt-to-UI, Image-to-UI, three materially distinct Variants, selection/refinement, direct source delivery, Blocks, Components, Templates, Full-page generation, and an optional-module Starter (UI, auth, data, email, AI, storage, docs, SEO). Pricing, subscriptions, trials, quotas, licenses, paid support, and payment handling are out of scope.

```text
Intent / Image → Prismo CLI → 3+ Variants → Select / refine
               → Preview → Apply → current codebase → Verify / Proof
```

## Brand assets

- [Prismo mark SVG](apps/web/public/brand/prismo-mark.svg)
- [Prismo lockup SVG](apps/web/public/brand/prismo-lockup.svg)
- [Brand system](docs/product/brand-system.md)

The mark is an original three-plane prism: shared contract in the center, differentiated directions around it, and a visible path from intent to proof. It deliberately does not reproduce another product's branding.

## Migration from shadcnagent

The canonical GitHub repository, CLI, workspace packages, Registry URL, web identity, and documentation are now `Prismo`. `shadcnagent` and `dashboard-agent` remain command aliases during migration, so existing local automation keeps working. The legacy `shadcn-agent-kit` Skill directory remains a compatibility distribution artifact until its own migration slice is complete.

## Verification

```bash
bun run check
bun run skill:validate
bun run proof:install
bun run handoff:verify
```

The daily 09:30 Asia/Shanghai [Prismo Handoff Audit](.github/workflows/prismo-handoff-audit.yml) is read-only: it can report an auditor regression as a GitHub Issue, but never edits source, commits, pushes, deploys, or upgrades an unverified capability.

## License and independence

[MIT](LICENSE). Prismo is an independent community project. It is not affiliated with, endorsed by, or sponsored by any reference product. Third-party names, when technically necessary, are used only to describe interoperability.
