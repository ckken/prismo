import { useMemo } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { AlertTriangle, ArrowUpRight, LoaderCircle } from "lucide-react"
import type { DemoState, Scenario } from "../data"
import { copy, type Locale } from "../i18n"

type PreviewRow = Scenario["rows"][number]
const column = createColumnHelper<PreviewRow>()

function Trend({ values, ariaLabel }: { values: number[]; ariaLabel: string }) {
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const min = Math.min(...values)
      const max = Math.max(...values)
      const y = 68 - ((value - min) / (max - min || 1)) * 54
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg className="trend" viewBox="0 0 100 76" preserveAspectRatio="none" aria-label={ariaLabel}>
      <defs>
        <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M 0,68 L ${points} L 100,68 Z`} fill="url(#trend-fill)" />
      <polyline points={points} fill="none" stroke="var(--brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function PreviewDashboard({ scenario, state, locale }: { scenario: Scenario; state: DemoState; locale: Locale }) {
  const t = copy[locale].preview
  const data = useMemo(() => scenario.rows, [scenario])
  const columns = useMemo(() => [
    column.accessor("name", { header: t.columns.name }),
    column.accessor("owner", { header: t.columns.owner }),
    column.accessor("status", {
      header: t.columns.status,
      cell: (info) => <span className="row-status">{info.getValue()}</span>,
    }),
    column.accessor("value", { header: t.columns.value }),
  ], [t])
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  if (state === "loading") {
    return (
      <div className="dashboard-state" role="status">
        <LoaderCircle className="spin" />
        <strong>{t.loadingTitle}</strong>
        <span>{t.loadingDescription}</span>
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="dashboard-state">
        <span className="state-symbol">0</span>
        <strong>{t.emptyTitle}</strong>
        <span>{t.emptyDescription}</span>
      </div>
    )
  }

  if (state === "contract-error") {
    return (
      <div className="dashboard-state error-state" role="alert">
        <AlertTriangle />
        <strong>{t.errorTitle}</strong>
        <code>{scenario.contractPath}</code>
        <span>{t.errorDescription}</span>
      </div>
    )
  }

  return (
    <div className="dashboard-canvas">
      <div className="dash-heading">
        <div>
          <span className="dash-kicker">{t.overview}</span>
          <h3>{scenario.eyebrow}</h3>
        </div>
        <button className="mini-button" type="button">{t.range}</button>
      </div>

      <div className="metric-grid">
        {scenario.metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small><ArrowUpRight size={13} /> {metric.delta}</small>
          </article>
        ))}
      </div>

      <article className="chart-card">
        <div>
          <span className="dash-kicker">{t.momentum}</span>
          <strong>{t.trend}</strong>
        </div>
        <Trend values={scenario.chart} ariaLabel={t.trendAria} />
      </article>

      <article className="table-card">
        <div className="table-title">
          <div><span className="dash-kicker">{t.records}</span><strong>{t.priority}</strong></div>
          <span>{scenario.rows.length} {t.shown}</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}
