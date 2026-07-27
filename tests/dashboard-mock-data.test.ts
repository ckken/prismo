import { describe, expect, test } from "bun:test"
import {
  createDefaultDashboardDateRange,
  createMockDashboard,
  getRangeDays,
} from "../apps/web/src/dashboard-mock-data"
import { dashboards } from "../apps/web/src/dashboard-site-data"

const today = new Date(2026, 6, 27)

describe("dashboard mock data", () => {
  test("creates an inclusive default 28-day range", () => {
    const range = createDefaultDashboardDateRange(today)

    expect(getRangeDays(range)).toBe(28)
    expect(range.to).toEqual(today)
  })

  test("is deterministic for the same dashboard and range", () => {
    const range = createDefaultDashboardDateRange(today)

    expect(createMockDashboard("default", range)).toEqual(createMockDashboard("default", range))
  })

  test("regenerates metrics and series without mutating semantic fixture fields", () => {
    const originalMetric = dashboards[0].metrics[1].value
    const sevenDays = createMockDashboard("default", {
      from: new Date(2026, 6, 21),
      to: today,
    })
    const ninetyDays = createMockDashboard("default", {
      from: new Date(2026, 3, 29),
      to: today,
    })

    expect(sevenDays.mock).toEqual({
      source: "local-deterministic",
      rangeDays: 7,
      periodLabel: "7D",
    })
    expect(sevenDays.metrics[1].value).not.toBe(ninetyDays.metrics[1].value)
    expect(sevenDays.chart.primary).toHaveLength(7)
    expect(ninetyDays.chart.primary).toHaveLength(13)
    expect(sevenDays.table.rows[0].cells[1]).toBe("Iris")
    expect(dashboards[0].metrics[1].value).toBe(originalMetric)
  })

  test("updates an explicit date column and preserves semantic columns", () => {
    const finance = createMockDashboard("finance", {
      from: new Date(2026, 6, 21),
      to: today,
    })

    expect(finance.table.rows[0].cells[1]).toBe("07-27")
    expect(finance.table.rows.at(-1)?.cells[1]).toBe("07-21")
    expect(finance.table.rows[0].cells[0]).toBe("企业订阅续费")
  })
})
