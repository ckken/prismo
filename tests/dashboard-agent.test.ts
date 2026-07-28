import { afterEach, describe, expect, test } from "bun:test"
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createInstallPlan, createPlan, makeSpec, selectProjectDir } from "../packages/dashboard-agent/src/core.ts"
import { PUBLIC_REGISTRY_BASE_URL } from "../packages/dashboard-agent/src/catalog.ts"

const directories: string[] = []
function fixture(): string {
  const directory = mkdtempSync(join(tmpdir(), "dashboard-agent-"))
  directories.push(directory)
  return directory
}
function project(directory: string) {
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, "components.json"), "{}")
  writeFileSync(join(directory, "package.json"), JSON.stringify({ packageManager: "bun@1.3.14" }))
}
afterEach(() => directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true, force: true })))

describe("dashboard-agent core", () => {
  test("automatically finds a single workspace project in a monorepo", () => {
    const root = fixture()
    project(join(root, "apps", "admin"))
    writeFileSync(join(root, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n")
    const plan = createPlan(root, "经营总览 KPI 趋势 表格")
    expect(plan.projectProfile.projectDir).toBe(join(root, "apps", "admin"))
    expect(plan.projectProfile.packageManager).toBe("pnpm")
  })

  test("reports target scripts and router packages", () => {
    const root = fixture()
    project(root)
    writeFileSync(join(root, "package.json"), JSON.stringify({
      packageManager: "bun@1.3.14",
      scripts: { typecheck: "tsc --noEmit", build: "vite build" },
      dependencies: { "@tanstack/react-router": "1.0.0" },
    }))
    const plan = createPlan(root, "经营总览 KPI 表格")
    expect(plan.projectProfile.packageScripts.build).toBe("vite build")
    expect(plan.projectProfile.routerPackages).toEqual(["@tanstack/react-router"])
    expect(plan.projectProfile.risks).not.toContain("router-not-detected")
  })

  test("rejects ambiguous workspace discovery", () => {
    const root = fixture()
    project(join(root, "apps", "admin")); project(join(root, "apps", "store"))
    expect(() => selectProjectDir(root)).toThrow(/Multiple components.json/)
  })

  test("does not prefer a root config when a nested workspace config also exists", () => {
    const root = fixture()
    project(root)
    project(join(root, "apps", "admin"))
    expect(() => selectProjectDir(root)).toThrow(/Multiple components.json/)
  })

  test("reports a missing target before scanning", () => {
    const root = fixture()
    expect(() => selectProjectDir(join(root, "missing"))).toThrow(/does not exist/)
  })

  test("does not inherit an unrelated lockfile above the repository boundary", () => {
    const container = fixture()
    writeFileSync(join(container, "bun.lock"), "")
    const repository = join(container, "repository")
    mkdirSync(join(repository, ".git"), { recursive: true })
    writeFileSync(join(repository, "package.json"), JSON.stringify({ packageManager: "pnpm@10.0.0" }))
    project(join(repository, "apps", "admin"))
    const plan = createPlan(repository, "经营总览 KPI 表格")
    expect(plan.projectProfile.rootDir).toBe(repository)
    expect(plan.projectProfile.packageManager).toBe("pnpm")
    expect(plan.projectProfile.lockfile).toBeNull()
  })

  test("selects the Available overview only for its required capabilities", () => {
    const root = fixture(); project(root)
    const plan = createPlan(root, "经营总览，需要 KPI、趋势图和表格")
    expect(plan.recipeDecision.status).toBe("selected")
    expect(plan.recipeDecision.recipe?.id).toBe("dashboard-overview-01")
    expect(plan.installPlan?.argv).toContain("--dry-run")
  })

  test("does not turn dashboard or agent-ops requests into an install plan", () => {
    const root = fixture(); project(root)
    const dashboard = createPlan(root, "dashboard")
    const agentOps = createPlan(root, "agent ops token p95 dashboard")
    expect(dashboard.recipeDecision.status).toBe("clarify")
    expect(dashboard.installPlan).toBeNull()
    expect(agentOps.recipeDecision.candidates.map((item) => item.id)).toContain("agent-operations")
    expect(agentOps.installPlan).toBeNull()
  })

  test("does not treat a generic English trend as a Sales Candidate", () => {
    const root = fixture(); project(root)
    const plan = createPlan(root, "Build an overview dashboard with KPI cards, trend chart, and a table")
    expect(plan.recipeDecision.status).toBe("selected")
    expect(plan.recipeDecision.candidates).toEqual([])
  })

  test("rejects capabilities outside the recipe boundary", () => {
    const root = fixture(); project(root)
    const plan = createPlan(root, "经营总览 KPI 趋势图 表格，还要 Excel 公式、跨页选择和后台导出任务")
    expect(plan.recipeDecision.status).toBe("rejected")
    expect(plan.recipeDecision.forbiddenCapabilities).toEqual(expect.arrayContaining(["spreadsheet-grid", "background-export", "cross-page-selection"]))
    expect(plan.installPlan).toBeNull()
  })

  test("keeps unknown request details unresolved instead of inventing them", () => {
    const spec = makeSpec("dashboard")
    expect(spec.widgets).toEqual([])
    expect(spec.dataMode).toBe("unknown")
    expect(spec.tableLevel).toBe("unknown")
    expect(spec.unresolved).toEqual(expect.arrayContaining(["data-mode", "dashboard-widgets"]))
  })

  test("builds dry-run argv for each supported package manager", () => {
    expect(createInstallPlan("bun", "/project").argv).toEqual(["bunx", "--bun", "shadcn@4.14.1", "add", `${PUBLIC_REGISTRY_BASE_URL}/dashboard-overview-01.json`, "--dry-run", "-c", "/project"])
    expect(createInstallPlan("pnpm", "/project").argv.slice(0, 2)).toEqual(["pnpm", "dlx"])
    expect(createInstallPlan("yarn", "/project").argv.slice(0, 2)).toEqual(["yarn", "dlx"])
    expect(createInstallPlan("npm", "/project").argv[0]).toBe("npx")
  })

  test("quotes the displayed command without changing argv", () => {
    const plan = createInstallPlan("bun", "/project with spaces")
    expect(plan.command).toContain("'/project with spaces'")
    expect(plan.argv.at(-1)).toBe("/project with spaces")
  })

  test("ships stable machine-readable contract schemas", async () => {
    const specSchema = await Bun.file(join(import.meta.dir, "../packages/dashboard-agent/schemas/dashboard-spec.v1.schema.json")).json()
    const planSchema = await Bun.file(join(import.meta.dir, "../packages/dashboard-agent/schemas/dashboard-plan.v1.schema.json")).json()
    expect(specSchema.$id).toContain("dashboard-spec.v1.schema.json")
    expect(planSchema.properties.dashboardSpec.$ref).toBe("./dashboard-spec.v1.schema.json")
  })

  test("keeps shadcnagent CLI as the sole public control surface", async () => {
    const rootManifest = await Bun.file(join(import.meta.dir, "../package.json")).json()
    const cliManifest = await Bun.file(join(import.meta.dir, "../packages/dashboard-agent/package.json")).json()
    const webManifest = await Bun.file(join(import.meta.dir, "../apps/web/package.json")).json()
    const registryManifest = await Bun.file(join(import.meta.dir, "../packages/registry/package.json")).json()
    const manifests = [rootManifest, cliManifest, webManifest, registryManifest]

    expect(rootManifest.name).toBe("shadcnagent")
    expect(rootManifest.scripts.shadcnagent).toBe("bun packages/dashboard-agent/src/cli.ts")
    expect(cliManifest.name).toBe("@shadcnagent/cli")
    expect(cliManifest.bin.shadcnagent).toBe("./src/cli.ts")
    expect(cliManifest.bin["dashboard-agent"]).toBe("./src/cli.ts")
    for (const manifest of manifests) {
      const dependencyNames = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })
      expect(dependencyNames.some((name) => name.includes("modelcontextprotocol"))).toBe(false)
    }

    const cli = Bun.spawnSync(["bun", join(import.meta.dir, "../packages/dashboard-agent/src/cli.ts"), "--help"])
    expect(cli.exitCode).toBe(0)
    expect(cli.stdout.toString()).toStartWith("shadcnagent <command>")
  })
})
