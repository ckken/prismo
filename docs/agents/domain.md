# Domain Docs

This repository is a single Agenic product context despite containing an app, CLI, Registry, and Skills packages. Read [CONTEXT.md](../../CONTEXT.md) and accepted ADRs before changing product terminology or execution boundaries.

Before exploring a domain area, read `CONTEXT.md` or `CONTEXT-MAP.md` and the relevant `docs/adr/` entries when they exist. Their absence is not an error; create them only when a real terminology or architecture decision is resolved.

Use existing domain terms consistently:

- **Agenic** — the product and local CLI-first, Agent-first UI delivery system.
- **HeroUI** — a version-pinned upstream UI foundation; never an Agenic control plane or rebranded product.
- **Recipe** — a versioned, installable source unit from the Registry.
- **Variant** — a materially distinct UI direction for one request and contract.
- **Handoff** — the versioned execution state that lets another agent or session safely resume delivery.
- **ProofReport** — evidence grouped as passed, failed, and unverified.

If a proposed decision conflicts with a future ADR, surface the conflict rather than silently overriding it.
