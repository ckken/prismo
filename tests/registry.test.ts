import { describe, expect, test } from "bun:test"
import { resolve } from "node:path"

const root = resolve(import.meta.dir, "..")

describe("registry build", () => {
  test("publishes one available installable block", async () => {
    const item = await Bun.file(resolve(root, "apps/web/public/r/dashboard-overview-01.json")).json()
    expect(item.name).toBe("dashboard-overview-01")
    expect(item.type).toBe("registry:block")
    expect(item.meta.status).toBe("available")
    expect(item.meta.tableLevel).toBe("L0")
    expect(item.meta.states).toEqual(["success", "loading", "empty", "contract-error"])
    expect(item.files[0].content).toContain("dashboardOverviewSchema")
  })

  test("registry index excludes candidate showcase concepts", async () => {
    const registry = await Bun.file(resolve(root, "apps/web/public/r/registry.json")).json()
    expect(registry.items.map((item: { name: string }) => item.name)).toEqual(["dashboard-overview-01"])
  })
})
