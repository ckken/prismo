# Domain Docs

This repository is a single Prismo product context despite containing an app, CLI, Registry, and Skills packages.

Before exploring a domain area, read `CONTEXT.md` or `CONTEXT-MAP.md` and the relevant `docs/adr/` entries when they exist. Their absence is not an error; create them only when a real terminology or architecture decision is resolved.

Use existing domain terms consistently:

- **Prismo** — the product and local CLI-first UI builder.
- **Recipe** — a versioned, installable source unit from the Registry.
- **Variant** — a materially distinct UI direction for one request and contract.
- **Handoff** — the versioned execution state that lets another agent or session safely resume delivery.
- **ProofReport** — evidence grouped as passed, failed, and unverified.

If a proposed decision conflicts with a future ADR, surface the conflict rather than silently overriding it.
