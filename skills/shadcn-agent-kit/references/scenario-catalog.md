# Scenario catalog

Catalog version: `0.1.0`.

The machine source of truth is `packages/dashboard-agent/src/catalog.ts`; this file is the compact Skill reference.

| Recipe | Status | Fit | Installable |
|---|---|---|---|
| `dashboard-overview-01` | Available | KPI cards, trend chart, client or controlled server table (L2), success/loading/empty/contract-error | Yes |
| `sales-command-center` | Candidate | Target, trend, ranking, server-filtered accounts | No |
| `commerce-operations` | Candidate | GMV, channels, orders, products, bulk actions | No |
| `agent-operations` | Candidate | Usage, cost, latency, errors, model mix | No |
| `crm-workspace` | Candidate | Customers, stages, follow-ups, and tasks | No |
| `finance-review` | Candidate | Income, budget, anomalies, and reconciliation | No |

Selection must filter `status === Available` before scoring. A Candidate may explain future fit but must never produce an install URL or proof claim.
