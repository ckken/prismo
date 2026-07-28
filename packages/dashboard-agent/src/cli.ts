#!/usr/bin/env bun
import { createHydratedPlan, DashboardAgentError, inspectProject } from "./core.ts"

const help = `shadcnagent <command> [options]

Commands:
  inspect [--cwd <dir>]                         Inspect a project with shadcn@4.14.1 info.
  plan --request <text> [--cwd <dir>] [--json]  Produce a DashboardSpec and read-only install plan.

Exit codes:
  0  Plan selected or inspection completed
  2  Invalid CLI arguments
  3  Clarification or rejection required
  4  Project discovery failed
  1  Unexpected command failure
`

function fail(message: string, exitCode = 2, details?: unknown): never {
  console.error(JSON.stringify({ error: message, exitCode, ...(details ? { details } : {}) }))
  process.exit(exitCode)
}

function parse(argv: string[]) {
  const [command, ...rest] = argv
  if (!command || command === "--help" || command === "-h") return { command: "help" as const }
  if (command !== "inspect" && command !== "plan") fail(`Unknown command: ${command}`)
  const values: Record<string, string> = {}
  for (let index = 0; index < rest.length;) {
    const flag = rest[index]
    if (flag === "--json") {
      index += 1
      continue
    }
    const value = rest[index + 1]
    if ((flag !== "--cwd" && flag !== "--request") || !value || value.startsWith("--")) fail(`Invalid argument: ${flag}`)
    if (values[flag]) fail(`Duplicate argument: ${flag}`)
    values[flag] = value
    index += 2
  }
  if (command === "plan" && !values["--request"]) fail("Missing required argument: --request")
  if (command === "inspect" && values["--request"]) fail("Invalid argument for inspect: --request")
  return { command, cwd: values["--cwd"] ?? process.cwd(), request: values["--request"] }
}

async function main() {
  const args = parse(process.argv.slice(2))
  if (args.command === "help") return console.log(help)
  if (args.command === "plan") {
    const plan = await createHydratedPlan(args.cwd!, args.request!)
    console.log(JSON.stringify(plan, null, 2))
    if (plan.recipeDecision.status !== "selected" || !plan.installPlan) process.exitCode = 3
    return
  }
  console.log(JSON.stringify(await inspectProject(args.cwd!), null, 2))
}

main().catch((error: unknown) => {
  if (error instanceof DashboardAgentError) return fail(error.message, 4, error.candidates.length ? { code: error.code, candidates: error.candidates } : { code: error.code })
  fail(error instanceof Error ? error.message : String(error), 1)
})
