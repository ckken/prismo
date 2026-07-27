import {
  differenceInCalendarDays,
  format,
  startOfDay,
  subDays,
} from "date-fns"
import {
  dashboards,
  type DashboardDefinition,
  type DashboardId,
  type LocalizedText,
  type Metric,
} from "./dashboard-site-data"

export type DashboardDateRange = {
  from: Date
  to: Date
}

export type MockDashboardDefinition = DashboardDefinition & {
  mock: {
    source: "local-deterministic"
    rangeDays: number
    periodLabel: string
  }
}

const BASE_RANGE_DAYS = 28

const chartDescriptions: Record<DashboardId, LocalizedText> = {
  default: { zh: "所选时间区间的收入与目标走势", en: "Revenue and target performance for the selected range" },
  sales: { zh: "所选时间区间的实际收入与预测基线", en: "Actual revenue and forecast baseline for the selected range" },
  commerce: { zh: "所选时间区间的交易规模", en: "Transaction volume for the selected range" },
  "agent-ops": { zh: "所选时间区间的运行趋势", en: "Runtime trend for the selected range" },
  crm: { zh: "所选时间区间的新增与活跃客户", en: "New and active customers for the selected range" },
  finance: { zh: "所选时间区间的收入与支出", en: "Income and expenses for the selected range" },
}

function normalizeDateRange(range: DashboardDateRange): DashboardDateRange {
  const first = startOfDay(range.from)
  const second = startOfDay(range.to)
  return first <= second
    ? { from: first, to: second }
    : { from: second, to: first }
}

export function createDefaultDashboardDateRange(today = new Date()): DashboardDateRange {
  const to = startOfDay(today)
  return { from: subDays(to, BASE_RANGE_DAYS - 1), to }
}

export function getRangeDays(range: DashboardDateRange) {
  const normalized = normalizeDateRange(range)
  return differenceInCalendarDays(normalized.to, normalized.from) + 1
}

export function getRangePeriodLabel(range: DashboardDateRange) {
  const days = getRangeDays(range)
  if (days <= 31) return `${days}D`
  if (days <= 330) return `${Math.round(days / 30)}M`
  return `${Math.max(1, Math.round(days / 365))}Y`
}

function hashString(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function noise(seed: string) {
  return (hashString(seed) % 2001) / 1000 - 1
}

function decimalPlaces(value: string) {
  return value.includes(".") ? value.split(".")[1]?.length ?? 0 : 0
}

function formatNumber(value: number, decimals: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function scaleMetricValue(metric: Metric, days: number, seed: string) {
  const match = metric.value.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/)
  if (!match) return metric.value

  const [, prefix, rawNumber, rawSuffix] = match
  const baseValue = Number(rawNumber.replaceAll(",", ""))
  if (!Number.isFinite(baseValue)) return metric.value

  const rangeScale = days / BASE_RANGE_DAYS
  const seededNoise = noise(seed)
  const factor = metric.mockAggregation === "sum"
    ? rangeScale * (1 + seededNoise * 0.06)
    : metric.mockAggregation === "average"
      ? 1 + seededNoise * 0.035
      : 1 + seededNoise * 0.08

  let value = Math.max(0, baseValue * factor)
  let suffix = rawSuffix
  let decimals = decimalPlaces(rawNumber)

  if (suffix === "%") {
    value = Math.min(99.9, value)
    decimals = Math.max(decimals, value < 10 ? 1 : 0)
  } else if (suffix.toLocaleLowerCase() === "k" && value >= 1000) {
    value /= 1000
    suffix = "m"
    decimals = 1
  } else if (suffix.toLocaleLowerCase() === "m" && value < 1) {
    value *= 1000
    suffix = "k"
    decimals = value < 10 ? 1 : 0
  } else if (!suffix) {
    decimals = 0
  }

  return `${prefix}${formatNumber(value, decimals)}${suffix}`
}

function scaleDelta(delta: string, seed: string) {
  const match = delta.match(/^([+-]?)([0-9]+(?:\.[0-9]+)?)(.*)$/)
  if (!match) return delta

  const [, sign, rawNumber, suffix] = match
  const decimals = decimalPlaces(rawNumber)
  const value = Number(rawNumber) * (1 + noise(seed) * 0.18)
  return `${sign}${formatNumber(value, decimals)}${suffix}`
}

function chartPointCount(days: number) {
  if (days <= 14) return Math.max(days, 2)
  if (days <= 62) return 12
  if (days <= 120) return 13
  return 12
}

function interpolate(values: number[], position: number) {
  const lower = Math.floor(position)
  const upper = Math.min(values.length - 1, Math.ceil(position))
  const progress = position - lower
  return values[lower] + (values[upper] - values[lower]) * progress
}

function createSeries(values: number[], count: number, seed: string) {
  return Array.from({ length: count }, (_, index) => {
    const position = (index / Math.max(count - 1, 1)) * (values.length - 1)
    const base = interpolate(values, position)
    const variation = noise(`${seed}:${index}`) * 5
    return Math.max(1, Math.round(base + variation))
  })
}

export function createMockDashboard(
  dashboardId: DashboardId,
  range: DashboardDateRange,
): MockDashboardDefinition {
  const normalized = normalizeDateRange(range)
  const rangeDays = getRangeDays(normalized)
  const dateSeed = `${dashboardId}:${format(normalized.from, "yyyy-MM-dd")}:${format(normalized.to, "yyyy-MM-dd")}`
  const dashboard = dashboards.find((item) => item.id === dashboardId) ?? dashboards[0]
  const points = chartPointCount(rangeDays)
  const rowDivisor = Math.max(dashboard.table.rows.length - 1, 1)
  const dateColumnIndex = dashboard.table.columns.findIndex((column) => column.en === "Date")

  return {
    ...dashboard,
    metrics: dashboard.metrics.map((metric, index) => ({
      ...metric,
      value: scaleMetricValue(metric, rangeDays, `${dateSeed}:metric:${index}`),
      delta: scaleDelta(metric.delta, `${dateSeed}:delta:${index}`),
    })),
    chart: {
      ...dashboard.chart,
      description: chartDescriptions[dashboardId],
      primary: createSeries(dashboard.chart.primary, points, `${dateSeed}:primary`),
      secondary: dashboard.chart.secondary
        ? createSeries(dashboard.chart.secondary, points, `${dateSeed}:secondary`)
        : undefined,
    },
    table: {
      ...dashboard.table,
      rows: dashboard.table.rows.map((row, index) => {
        const offset = Math.round((index / rowDivisor) * Math.max(rangeDays - 1, 0))
        return {
          ...row,
          cells: row.cells.map((cell, cellIndex) =>
            cellIndex === dateColumnIndex ? format(subDays(normalized.to, offset), "MM-dd") : cell),
        }
      }),
    },
    mock: {
      source: "local-deterministic",
      rangeDays,
      periodLabel: getRangePeriodLabel(normalized),
    },
  }
}
