# ADR 0001: Use HeroUI as the Agenic upstream UI foundation

- Status: Accepted
- Date: 2026-07-29

## Context

The project is a free, open-source Agent-first UI delivery system. A standalone
component library would duplicate a large accessibility and interaction surface,
while a source-block marketplace would not provide the deterministic delivery,
adaptation, verification, and handoff behavior that differentiates the product.

## Decision

Use version-pinned HeroUI v3 packages as the upstream UI foundation in the web
application and future renderer work. Agenic owns:

1. the local `agenic` CLI and its contracts;
2. intent interpretation, Spec, Recipe selection, plan and file-impact records;
3. editable Agenic Recipe composition and the Data Adapter boundary;
4. route verification, versioned Handoff, and ProofReport.

HeroUI remains an upstream dependency. Do not fork its repository, copy its
branding, represent its Pro assets as open source, or expose its MCP server as
an Agenic product surface. Keep HeroUI versions explicit and wrap upstream
selection behind an Agenic renderer boundary before multiple renderers exist.

## Consequences

- Public claims say "editable Recipe composition", not that every UI primitive
  is dependency-free source.
- The live Dashboard Demo uses HeroUI primitives. The installable
  shadcn-compatible Registry source remains the current Available delivery
  baseline; do not claim a completed HeroUI apply/verify migration before a
  real target route and Proof pass.
- Apache-2.0 notices apply to the upstream dependency. Third-party notices are
  maintained in the repository.
- Agenic remains CLI-first and does not add pricing, subscriptions, quotas,
  paid-plan behavior, or a hosted Agent runtime.
