# Agenic handoff acceptance boundary

## Purpose

Agenic is complete only when a second Coding Agent or a new session can resume a request from recorded state and produce the same evidence-backed outcome. A prior agent writing files is not completion.

## State model

```text
intake → inspected → planned → selected → previewed → applied → adapted → verified → complete
                              ↘ blocked / stale / conflict / failed
```

The future CLI stores one immutable handoff record at `.agenic/handoffs/<handoff-id>/`. Each record contains the request, project fingerprint, DashboardSpec, Variant selection, plan revision, file-impact summary, ApplyReceipt, route evidence, and ProofReport.

`complete` requires every applicable gate below. `unverified` is never equivalent to `complete`.

| Gate | Required evidence | Rejection condition |
|---|---|---|
| Inspect | one target workspace and detected project profile | missing or ambiguous `components.json` |
| Plan | compatible Available Recipe and explicit unresolved fields | Candidate, unsupported capability, or critical unknown |
| Variant | three materially distinct layouts sharing one data contract | cosmetic-only alternatives |
| Preview | exact dry-run, dependency list, file list, and conflicts | unreviewed overwrite or unpinned plan |
| Apply | matching plan revision, project fingerprint, and file digest | stale project or unknown file conflict |
| Adapt | one project-side Data Adapter and production-safe state mapping | silent fixture fallback |
| Route | real HTTP route and browser-rendered page | fixture-only or build-only evidence |
| Verify | project checks, four states, 375/768/1440, declared interactions | failed or missing evidence |
| Resume | a fresh process repeats the required prior checks | state cannot be reconstructed |

## Scenario matrix

| Id | Interruption | Expected result |
|---|---|---|
| H1 | New process after `plan` | recover plan or safely reject it as stale |
| H2 | New Agent after Variant selection | preserve selected Variant and its rationale |
| H3 | Target files change before `apply` | stop with `stale` or `conflict` |
| H4 | Fresh checkout at another path | resolve project paths without machine-specific state |
| H5 | Interruption after `apply`, before Adapter | report exact remaining integration work |
| H6 | New process after `verify` | rerun Proof and retain passed/failed/unverified distinction |

## Scheduled audit policy

The daily scheduled audit verifies the CLI's currently implemented capability in fresh processes and emits a JSON report. Until `preview`, `apply`, and `verify` are implemented, its report must state `deliveryStatus: incomplete`; a green workflow only means the auditor ran correctly, not that Agenic has completed end-to-end delivery.

The audit may read the checkout, install dependencies, create temporary files, and upload an artifact. It must not modify tracked source, create commits, push, deploy, or claim completion beyond the available CLI boundary.
