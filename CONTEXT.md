# Agenic Context

## Product

**Agenic** is an open-source, local CLI-first UI delivery system for Coding Agents.
Its promise is `Intent → Spec → Recipe → Adapt → Verify → Proof`.

HeroUI v3 is the version-pinned upstream foundation for UI primitives, accessible
interaction, and design tokens. Agenic is not a HeroUI fork or hosted wrapper:
it owns the delivery contracts, deterministic CLI, Recipe catalog, Data Adapter
boundary, route evidence, handoff record, and ProofReport.

## Control plane

- `agenic` is the only executable control plane.
- Skills, `AGENTS.md`, and the website help an agent discover and understand the
  CLI; they never duplicate its selection, writing, or verification behavior.
- Agenic does not publish an MCP server. Upstream tooling may be consulted by a
  developer, but it is not an Agenic runtime dependency or product surface.

## Current capability

`dashboard-overview-01` is the only Available Recipe. Its live Demo is rendered
with HeroUI primitives; its current installable Registry source remains the
shadcn-compatible baseline until the HeroUI Renderer closes apply/verify and
handoff Proof. Other listed scenarios remain Candidate or Target and must not
show installation or completion claims.

## Naming

Public names are `Agenic`, `agenic`, and `@agenic/*`. `prismo`,
`shadcnagent`, and `dashboard-agent` are compatibility aliases only.
