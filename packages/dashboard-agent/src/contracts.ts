export type PackageManager = "bun" | "pnpm" | "yarn" | "npm" | "unknown"

export interface ProjectProfile {
  projectDir: string
  componentsJson: string
  rootDir: string
  lockfile: string | null
  packageManager: PackageManager
  packageScripts: Record<string, string>
  routerPackages: string[]
  agentInstructionFiles: string[]
  risks: string[]
  shadcn: {
    source: "shadcn@4.14.1"
    info: unknown
  } | null
}

export interface DashboardSpecV1 {
  schemaVersion: "1"
  request: string
  intent: "overview" | "sales" | "commerce" | "agent-operations" | "crm" | "finance" | "unknown"
  widgets: Array<"metric-grid" | "trend-chart" | "data-table">
  dataMode: "client" | "server" | "unknown"
  tableLevel: "L0" | "L1" | "L2" | "unknown"
  states: ["success", "loading", "empty", "contract-error"]
  unresolved: string[]
}

export type RecipeStatus = "Available" | "Candidate"

export interface RecipeCatalogEntry {
  id: string
  title: string
  description: string
  status: RecipeStatus
  capabilities: readonly string[]
  installable: boolean
  registryUrl: string | null
  tableLevel: "L0" | "L1" | "L2"
  states: readonly ["success", "loading", "empty", "contract-error"]
  dependencies?: readonly string[]
  registryDependencies?: readonly string[]
}

export interface RecipeDecision {
  status: "selected" | "clarify" | "rejected"
  recipe: RecipeCatalogEntry | null
  reason: string
  candidates: RecipeCatalogEntry[]
  matchedCapabilities: string[]
  missingCapabilities: string[]
  forbiddenCapabilities: string[]
}

export interface InstallPlan {
  executable: false
  argv: string[]
  command: string
}

export interface DashboardPlan {
  dashboardSpec: DashboardSpecV1
  projectProfile: ProjectProfile
  recipeDecision: RecipeDecision
  installPlan: InstallPlan | null
  nextActions: string[]
}

export interface InspectionResult {
  kind: "ProjectInspection"
  version: 1
  project: ProjectProfile
}
