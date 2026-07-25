import { useMemo } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { AlertTriangle, ArrowUpRight, LoaderCircle } from "lucide-react"
import type { DemoState, Scenario } from "../data"

type PreviewRow = Scenario["rows"][number]
const column = createColumnHelper<PreviewRow>()

const columns = [
  column.accessor("name", { header: "Name" }),
  column.accessor("owner", { header: "Owner" }),
  column.accessor("status", {
    header: "Status",
    cell: (info) => <span className="row-status">{info.getValue()}</span>,
  }),
  column.accessor("value", { header: "Value" }),
]

function Trend({ values }: { values: number[] }) {
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
    <svg className="trend" viewBox="0 0 100 76" preserveAspectRatio="none" aria-label="12 period trend">
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

export function PreviewDashboard({ scenario, state }: { scenario: Scenario; state: DemoState }) {
  const data = useMemo(() => scenario.rows, [scenario])
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  if (state === "loading") {
    return (
      <div className="dashboard-state" role="status">
        <LoaderCircle className="spin" />
        <strong>Loading dashboard data</strong>
        <span>The recipe keeps layout stable while the source resolves.</span>
      </div>
    )
  }

  if (state === "empty") {
    return (
      <div className="dashboard-state">
        <span className="state-symbol">0</span>
        <strong>No records in this range</strong>
        <span>Try another date range or clear the active filters.</span>
      </div>
    )
  }

  if (state === "contract-error") {
    return (
      <div className="dashboard-state error-state" role="alert">
        <AlertTriangle />
        <strong>Contract mismatch</strong>
        <code>{scenario.contractPath}</code>
        <span>Expected a string but received null. Map the field in your source adapter.</span>
      </div>
    )
  }

  return (
    <div className="dashboard-canvas">
      <div className="dash-heading">
        <div>
          <span className="dash-kicker">Overview</span>
          <h3>{scenario.eyebrow}</h3>
        </div>
        <button className="mini-button" type="button">Last 12 weeks</button>
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
          <span className="dash-kicker">Momentum</span>
          <strong>12-period trend</strong>
        </div>
        <Trend values={scenario.chart} />
      </article>

      <article className="table-card">
        <div className="table-title">
          <div><span className="dash-kicker">Records</span><strong>Priority view</strong></div>
          <span>{scenario.rows.length} shown</span>
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

