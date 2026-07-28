# Agenic Agent Guide

## Agent skills

### Issue tracker

Agenic planning and long-running decisions live in GitHub Issues for `ckken/agenic`. See `docs/agents/issue-tracker.md`.

### Domain docs

This is a single product context. Read `CONTEXT.md` and relevant `docs/adr/` entries when they exist. See `docs/agents/domain.md`.

## Agenic delivery boundary

- Use the local CLI as the only execution control plane; do not add an Agenic MCP server.
- Do not add pricing, subscriptions, licenses, quotas, or paid-plan behavior.
- Treat handoff as incomplete until the versioned handoff record, real route evidence, and ProofReport all pass.
- Scheduled verification is read-only: it must not modify source, push commits, deploy, or expand scope.
