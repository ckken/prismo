import { describe, expect, test } from "bun:test"
import { resolve } from "node:path"

const root = resolve(import.meta.dir, "..")

describe("registry build", () => {
  test("publishes one available installable block", async () => {
    const item = await Bun.file(resolve(root, "apps/web/public/r/dashboard-overview-01.json")).json()
    expect(item.name).toBe("dashboard-overview-01")
    expect(item.type).toBe("registry:block")
    expect(item.meta.status).toBe("available")
    expect(item.meta.tableLevel).toBe("L2")
    expect(item.registryDependencies).toContain("sidebar")
    expect(item.registryDependencies).toContain("chart")
    expect(item.meta.states).toEqual(["success", "loading", "empty", "contract-error"])
    expect(item.meta.capabilities).toContain("controlled-query")
    expect(item.files[0].content).toContain("dashboardOverviewSchema")
    expect(item.files[0].content).toContain("onTableQueryChange")
    expect(item.files[0].content).toContain("export type DashboardOverviewProps")
    expect(item.files[0].content).toContain("manualPagination: serverControlled")
    expect(item.files[0].content).toContain("aria-sort={sorted === \"asc\"")
    expect(item.files[0].content).toContain("No records for the current query")
    expect(item.files[0].content).toContain("No trend data for this range")
    expect(item.files[0].content).not.toContain("parsed.data.chart ?? fixture.chart")
  })

  test("registry index excludes candidate showcase concepts", async () => {
    const registry = await Bun.file(resolve(root, "apps/web/public/r/registry.json")).json()
    expect(registry.items.map((item: { name: string }) => item.name)).toEqual(["dashboard-overview-01"])
  })

  test("publishes the dashboard agent contract schemas", async () => {
    const spec = await Bun.file(resolve(root, "apps/web/public/schemas/dashboard-spec.v1.schema.json")).json()
    const plan = await Bun.file(resolve(root, "apps/web/public/schemas/dashboard-plan.v1.schema.json")).json()
    expect(spec.$id).toEndWith("/dashboard-spec.v1.schema.json")
    expect(plan.properties.dashboardSpec.$ref).toBe("./dashboard-spec.v1.schema.json")
  })
})
