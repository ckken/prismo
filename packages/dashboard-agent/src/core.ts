import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import type {
  DashboardPlan,
  DashboardSpecV1,
  InstallPlan,
  PackageManager,
  ProjectProfile,
  RecipeCatalogEntry,
  RecipeDecision,
} from "./contracts.ts"
import { catalog, dashboardOverviewRecipe, SHADCN_CLI_VERSION } from "./catalog.ts"

const ignoredDirectories = new Set(["node_modules", ".git", ".next", ".turbo", "build", "dist", "coverage"])
const lockfiles: Array<[string, PackageManager]> = [
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
]

export { catalog }

export class DashboardAgentError extends Error {
  constructor(readonly code: "NOT_FOUND" | "AMBIGUOUS" | "INVALID_ARGUMENT", message: string, readonly candidates: string[] = []) {
    super(message)
  }
}

export function findComponentsJson(cwd: string): string[] {
  const start = resolve(cwd)
  if (!existsSync(start)) throw new DashboardAgentError("NOT_FOUND", `Target directory does not exist: ${start}.`)
  const found: string[] = []
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) visit(join(directory, entry.name))
      } else if (entry.isFile() && entry.name === "components.json") {
        found.push(join(directory, entry.name))
      }
    }
  }
  visit(start)
  return found.sort()
}

export function selectProjectDir(cwd: string): string {
  const matches = findComponentsJson(cwd)
  if (matches.length === 0) throw new DashboardAgentError("NOT_FOUND", `No components.json found below ${resolve(cwd)}.`)
  if (matches.length > 1) throw new DashboardAgentError("AMBIGUOUS", "Multiple components.json files found; pass --cwd for one project.", matches)
  return dirname(matches[0])
}

type PackageManifest = {
  packageManager?: string
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

function readPackageManifest(directory: string): PackageManifest | null {
  const manifest = join(directory, "package.json")
  if (!existsSync(manifest)) return null
  try {
    return JSON.parse(readFileSync(manifest, "utf8")) as PackageManifest
  } catch {
    return null
  }
}

function packageManagerFromManifest(rootDir: string): PackageManager {
  const value = readPackageManifest(rootDir)
  if (!value) return "unknown"
  try {
    const manager = value.packageManager?.split("@")[0]
    return manager === "bun" || manager === "pnpm" || manager === "yarn" || manager === "npm" ? manager : "unknown"
  } catch {
    return "unknown"
  }
}

export function getProjectProfile(projectDir: string): ProjectProfile {
  let current = resolve(projectDir)
  let rootDir = current
  let lockfile: string | null = null
  let packageManager: PackageManager = "unknown"
  while (true) {
    const lock = lockfiles.find(([name]) => existsSync(join(current, name)))
    if (lock) {
      rootDir = current
      lockfile = join(current, lock[0])
      packageManager = lock[1]
      break
    }
    if (existsSync(join(current, ".git"))) {
      rootDir = current
      break
    }
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }
  if (!lockfile) packageManager = packageManagerFromManifest(rootDir)
  const resolvedProjectDir = resolve(projectDir)
  const manifest = readPackageManifest(resolvedProjectDir)
  const dependencies = { ...manifest?.dependencies, ...manifest?.devDependencies }
  const routerPackages = Object.keys(dependencies).filter((name) =>
    name === "next"
    || name === "wouter"
    || name === "react-router"
    || name === "react-router-dom"
    || name.startsWith("@tanstack/react-router")
    || name.startsWith("@remix-run/"))
  const agentInstructionFiles = [...new Set([
    join(rootDir, "AGENTS.md"),
    join(resolvedProjectDir, "AGENTS.md"),
  ].filter(existsSync))]
  const packageScripts = manifest?.scripts ?? {}
  const risks = [
    packageManager === "unknown" ? "package-manager-unknown" : null,
    routerPackages.length === 0 ? "router-not-detected" : null,
    !packageScripts.typecheck ? "typecheck-script-not-detected" : null,
    !packageScripts.build ? "build-script-not-detected" : null,
  ].filter((risk): risk is string => risk !== null)
  return {
    projectDir: resolvedProjectDir,
    componentsJson: join(resolvedProjectDir, "components.json"),
    rootDir,
    lockfile,
    packageManager,
    packageScripts,
    routerPackages,
    agentInstructionFiles,
    risks,
    shadcn: null,
  }
}

function shellQuote(value: string): string {
  return /^[a-zA-Z0-9_./:@=-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`
}

export function createInstallPlan(packageManager: Exclude<PackageManager, "unknown">, projectDir: string): InstallPlan {
  const prefix = packageManager === "pnpm" ? ["pnpm", "dlx"] : packageManager === "yarn" ? ["yarn", "dlx"] : packageManager === "npm" ? ["npx"] : ["bunx", "--bun"]
  const argv = [...prefix, `shadcn@${SHADCN_CLI_VERSION}`, "add", dashboardOverviewRecipe.registryUrl, "--dry-run", "-c", projectDir]
  return { executable: false, argv, command: argv.map(shellQuote).join(" ") }
}

const domainRules = [
  { intent: "agent-operations", recipe: "agent-operations", pattern: /agent[\s-]*(ops|operations)|\btoken(s)?\b|\bp95\b|latency|trace(s)?|智能体|模型调用|调用量|延迟|错误率/i },
  { intent: "sales", recipe: "sales-command-center", pattern: /\bsales\b|\bpipeline\b|\bquota\b|sales forecast|销售|商机|线索|销售漏斗/i },
  { intent: "commerce", recipe: "commerce-operations", pattern: /\be-?commerce\b|\bgmv\b|\border(s)?\b|\bproduct(s)?\b|电商|订单|商品|转化率/i },
  { intent: "crm", recipe: "crm-workspace", pattern: /\bcrm\b|customer lifecycle|客户阶段|客户跟进/i },
  { intent: "finance", recipe: "finance-review", pattern: /\bbudget\b|reconciliation|finance review|预算|对账|财务复盘/i },
] as const
const forbiddenRules = [
  { id: "spreadsheet-grid", pattern: /\bexcel\b|spreadsheet|formula|cell edit|冻结(列|行|区)|公式|单元格编辑/i },
  { id: "application-security", pattern: /\baudit\b|permission(s)?|role-based|审计|权限/i },
  { id: "background-export", pattern: /\bexport job\b|batch export|后台导出|导出任务/i },
  { id: "cross-page-selection", pattern: /cross-page selection|跨页选择/i },
  { id: "large-data-virtualization", pattern: /virtuali[sz]ation|100k|十万|百万行|虚拟化/i },
] as const

export function makeSpec(request: string): DashboardSpecV1 {
  const text = request.toLowerCase()
  const domain = domainRules.find((rule) => rule.pattern.test(text))
  const widgets: DashboardSpecV1["widgets"] = []
  if (/\bkpi(s)?\b|\bmetric(s)?\b|stat cards?|指标|数据卡|统计卡/.test(text)) widgets.push("metric-grid")
  if (/\btrend\b|\bchart(s)?\b|time series|趋势|图表|走势图/.test(text)) widgets.push("trend-chart")
  if (/\btable\b|\blist\b|\brecords\b|表格|列表|明细/.test(text)) widgets.push("data-table")
  const dataMode = /\bserver\b|\bapi\b|\bremote\b|服务端|后端接口/.test(text)
    ? "server"
    : /\bclient\b|\blocal\b|\bfixture\b|客户端|本地数据|静态数据/.test(text)
      ? "client"
      : "unknown"
  const tableLevel = widgets.includes("data-table")
    ? dataMode === "server" || /pagination|sorting|filtering|分页|排序|筛选/.test(text)
      ? "L2"
      : dataMode === "client"
        ? "L1"
        : "unknown"
    : "unknown"
  const unresolved = ["route", "data-source-contract"]
  if (dataMode === "unknown") unresolved.push("data-mode")
  if (widgets.length < 2) unresolved.push("dashboard-widgets")
  return {
    schemaVersion: "1",
    request,
    intent: domain?.intent ?? (/dashboard|overview|经营总览|总览|看板|仪表盘/.test(text) ? "overview" : "unknown"),
    widgets,
    dataMode,
    tableLevel,
    states: ["success", "loading", "empty", "contract-error"],
    unresolved,
  }
}

export function selectRecipe(request: string, spec = makeSpec(request)): RecipeDecision {
  const domain = domainRules.find((rule) => rule.intent === spec.intent)
  const candidates = domain ? catalog.filter((item) => item.id === domain.recipe) : []
  const forbiddenCapabilities = forbiddenRules.filter((rule) => rule.pattern.test(request)).map((rule) => rule.id)
  const matchedCapabilities: string[] = dashboardOverviewRecipe.capabilities.filter((capability) =>
    capability === "metric-grid" ? spec.widgets.includes("metric-grid")
      : capability === "trend-chart" ? spec.widgets.includes("trend-chart")
        : capability === "data-table" ? spec.widgets.includes("data-table")
          : capability === "controlled-query" ? spec.tableLevel === "L2"
            : capability === "four-states")
  const missingCapabilities = ["metric-grid", "data-table"].filter((capability) => !matchedCapabilities.includes(capability))
  if (forbiddenCapabilities.length) {
    return {
      status: "rejected", recipe: null,
      reason: "The request includes application or data-grid capabilities outside the Available recipe boundary.",
      candidates, matchedCapabilities, missingCapabilities, forbiddenCapabilities,
    }
  }
  if (candidates.length) {
    return {
      status: "rejected", recipe: null,
      reason: "A domain-specific Candidate matches, but Candidate recipes are not installable.",
      candidates, matchedCapabilities, missingCapabilities, forbiddenCapabilities,
    }
  }
  if (spec.intent === "overview" && missingCapabilities.length === 0) {
    return {
      status: "selected", recipe: dashboardOverviewRecipe,
      reason: "Matched the Available overview recipe with metric and table capabilities.",
      candidates: [], matchedCapabilities, missingCapabilities, forbiddenCapabilities,
    }
  }
  return {
    status: "clarify", recipe: null,
    reason: "No Available recipe can be selected safely. Clarify the dashboard intent and required widgets.",
    candidates: [], matchedCapabilities, missingCapabilities, forbiddenCapabilities,
  }
}

export function createPlan(cwd: string, request: string): DashboardPlan {
  const projectDir = selectProjectDir(cwd)
  const projectProfile = getProjectProfile(projectDir)
  const dashboardSpec = makeSpec(request)
  const recipeDecision = selectRecipe(request, dashboardSpec)
  const installPlan = recipeDecision.status === "selected" && projectProfile.packageManager !== "unknown"
    ? createInstallPlan(projectProfile.packageManager, projectDir)
    : null
  const nextActions = installPlan
    ? ["Review the dry-run command; Prismo has not executed it.", "Resolve the route and data-source contract before apply."]
    : projectProfile.packageManager === "unknown" && recipeDecision.status === "selected"
      ? ["Confirm the target package manager before creating an install plan."]
      : recipeDecision.status === "clarify"
        ? ["Clarify the dashboard intent and required metric/table widgets."]
        : ["Use an Available recipe or reduce capabilities to its documented boundary."]
  return {
    dashboardSpec, projectProfile, recipeDecision, installPlan, nextActions,
  }
}

export async function readShadcnInfo(projectDir: string): Promise<unknown> {
  const process = Bun.spawn(["bunx", "--bun", `shadcn@${SHADCN_CLI_VERSION}`, "info", "--json", "-c", projectDir], { stdout: "pipe", stderr: "pipe" })
  const [exitCode, stdout, stderr] = await Promise.all([process.exited, new Response(process.stdout).text(), new Response(process.stderr).text()])
  if (exitCode !== 0) throw new Error(`shadcn@${SHADCN_CLI_VERSION} info failed (${exitCode}): ${stderr.trim()}`)
  try { return JSON.parse(stdout) } catch { return { raw: stdout.trim() } }
}

export async function inspectProject(cwd: string) {
  const projectDir = selectProjectDir(cwd)
  const project = getProjectProfile(projectDir)
  project.shadcn = { source: `shadcn@${SHADCN_CLI_VERSION}`, info: await readShadcnInfo(projectDir) }
  return { kind: "ProjectInspection" as const, version: 1 as const, project }
}

export async function createHydratedPlan(cwd: string, request: string): Promise<DashboardPlan> {
  const plan = createPlan(cwd, request)
  plan.projectProfile.shadcn = {
    source: `shadcn@${SHADCN_CLI_VERSION}`,
    info: await readShadcnInfo(plan.projectProfile.projectDir),
  }
  return plan
}
