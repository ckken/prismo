import type { RecipeCatalogEntry } from "./contracts.ts"

export const SHADCN_CLI_VERSION = "4.14.1"
export const PUBLIC_REGISTRY_BASE_URL = "https://ckken.github.io/shadcnagent/r"

export const dashboardOverviewRecipe = {
  id: "dashboard-overview-01",
  title: "Dashboard Overview 01",
  description: "A contract-aware admin dashboard with responsive sidebar navigation, command search, charts, a managed table, and four explicit data states.",
  status: "Available",
  installable: true,
  registryUrl: `${PUBLIC_REGISTRY_BASE_URL}/dashboard-overview-01.json`,
  capabilities: ["metric-grid", "trend-chart", "data-table", "controlled-query", "four-states"],
  tableLevel: "L2",
  states: ["success", "loading", "empty", "contract-error"],
  dependencies: ["@tanstack/react-table", "lucide-react", "recharts", "zod"],
  registryDependencies: ["badge", "button", "card", "chart", "input", "separator", "sidebar", "skeleton", "table"],
} as const satisfies RecipeCatalogEntry

export const catalog: RecipeCatalogEntry[] = [
  dashboardOverviewRecipe,
  {
    id: "sales-command-center",
    title: "Sales Command Center",
    description: "Targets, forecasting, ranking, pipeline, and server-filtered accounts.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["sales-target", "sales-trend", "rep-ranking", "customer-table"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"],
  },
  {
    id: "commerce-operations",
    title: "Commerce Operations",
    description: "GMV, conversion, channels, orders, products, and batch actions.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["gmv", "conversion", "orders", "products", "batch-actions"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"],
  },
  {
    id: "agent-operations",
    title: "Agent Operations",
    description: "Usage, cost, latency, errors, traces, and model mix.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["usage", "cost", "latency", "errors", "traces", "model-mix"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"],
  },
  {
    id: "crm-workspace",
    title: "CRM Workspace",
    description: "Customers, pipeline stages, follow-ups, and tasks.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["customers", "pipeline", "follow-ups", "tasks"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"],
  },
  {
    id: "finance-review",
    title: "Finance Review",
    description: "Income, budget, anomalies, and reconciliation.",
    status: "Candidate",
    installable: false,
    registryUrl: null,
    capabilities: ["income", "budget", "anomalies", "reconciliation"],
    tableLevel: "L2",
    states: ["success", "loading", "empty", "contract-error"],
  },
]
