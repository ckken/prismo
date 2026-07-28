import { join } from "node:path"

type CliResult = {
  exitCode: number
  stdout: string
  stderr: string
}

type Scenario = {
  id: string
  status: "passed" | "failed" | "unverified"
  detail: string
}

const cli = join(import.meta.dir, "../packages/dashboard-agent/src/cli.ts")
const project = join(import.meta.dir, "../apps/web")
const request = "经营总览：3 个 KPI、趋势图、服务端分页表格"

async function runFreshPlan(): Promise<CliResult> {
  const process = Bun.spawn(["bun", cli, "plan", "--cwd", project, "--request", request, "--json"], {
    stdout: "pipe",
    stderr: "pipe",
  })
  const [exitCode, stdout, stderr] = await Promise.all([
    process.exited,
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
  ])
  return { exitCode, stdout, stderr }
}

function validatePlan(result: CliResult): string | null {
  if (result.exitCode !== 0) return `plan exited ${result.exitCode}: ${result.stderr.trim()}`
  try {
    const plan = JSON.parse(result.stdout) as {
      dashboardSpec?: { intent?: string }
      recipeDecision?: { status?: string; recipe?: { id?: string } }
      installPlan?: { argv?: string[] }
    }
    if (plan.dashboardSpec?.intent !== "overview") return "plan did not preserve overview intent"
    if (plan.recipeDecision?.status !== "selected" || plan.recipeDecision.recipe?.id !== "dashboard-overview-01") return "plan did not safely select the Available recipe"
    if (!plan.installPlan?.argv?.includes("--dry-run")) return "plan did not produce a dry-run install plan"
    return null
  } catch (error) {
    return `plan did not produce valid JSON: ${error instanceof Error ? error.message : String(error)}`
  }
}

const first = await runFreshPlan()
const second = await runFreshPlan()
const firstError = validatePlan(first)
const secondError = validatePlan(second)
const scenarios: Scenario[] = [
  {
    id: "H1-new-process-after-plan",
    status: firstError || secondError ? "failed" : "passed",
    detail: firstError ?? secondError ?? "Two fresh CLI processes produced a safe, selected dry-run plan.",
  },
  {
    id: "H2-H6-delivery-handoff",
    status: "unverified",
    detail: "The current CLI implements only inspect/plan; preview, apply, adapter/route evidence, verify, and resumable handoff artifacts are not available yet.",
  },
]

const report = {
  schemaVersion: "1",
  kind: "PrismoHandoffAudit",
  auditedAt: new Date().toISOString(),
  deliveryStatus: "incomplete",
  currentCliBoundary: ["inspect", "plan"],
  scenarios,
  summary: {
    passed: scenarios.filter((scenario) => scenario.status === "passed").length,
    failed: scenarios.filter((scenario) => scenario.status === "failed").length,
    unverified: scenarios.filter((scenario) => scenario.status === "unverified").length,
  },
}

console.log(JSON.stringify(report, null, 2))
if (firstError || secondError) process.exitCode = 1
