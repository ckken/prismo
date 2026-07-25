import { useEffect, useMemo, useRef, useState } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  FileText,
  LayoutDashboard,
  ListChecks,
  LoaderCircle,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react"
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
    <div className="trend-frame">
      <svg className="trend" viewBox="0 0 100 76" preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
        <defs>
          <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 0,14 H 100 M 0,41 H 100 M 0,68 H 100" className="trend-grid" />
        <path d={`M 0,68 L ${points} L 100,68 Z`} fill="url(#trend-fill)" />
        <polyline points={points} fill="none" stroke="var(--brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="trend-axis" aria-hidden="true"><span>W1</span><span>W4</span><span>W8</span><span>W12</span></div>
    </div>
  )
}

export function PreviewDashboard({ scenario, state, locale }: { scenario: Scenario; state: DemoState; locale: Locale }) {
  const t = copy[locale].preview
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [compactNavigation, setCompactNavigation] = useState(false)
  const navigationRef = useRef<HTMLElement>(null)
  const navigationToggleRef = useRef<HTMLButtonElement>(null)
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
  const chartMetric = scenario.metrics[2] ?? scenario.metrics[0]
  const chartMin = Math.min(...scenario.chart)
  const chartMax = Math.max(...scenario.chart)
  const closeNavigation = () => {
    setNavigationOpen(false)
    if (compactNavigation) requestAnimationFrame(() => navigationToggleRef.current?.focus())
  }

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)")
    const sync = () => setCompactNavigation(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!compactNavigation || !navigationOpen) return
    const sidebar = navigationRef.current
    const focusable = Array.from(sidebar?.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])") ?? [])
    focusable[0]?.focus()
    const handleNavigationKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNavigation()
        return
      }
      if (event.key !== "Tab" || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", handleNavigationKeys)
    return () => window.removeEventListener("keydown", handleNavigationKeys)
  }, [compactNavigation, navigationOpen])

  const stateContent = state === "loading" ? (
      <div className="dashboard-state" role="status">
        <LoaderCircle className="spin" />
        <strong>{t.loadingTitle}</strong>
        <span>{t.loadingDescription}</span>
      </div>
    ) : state === "empty" ? (
      <div className="dashboard-state" role="status">
        <span className="state-symbol">0</span>
        <strong>{t.emptyTitle}</strong>
        <span>{t.emptyDescription}</span>
      </div>
    ) : state === "contract-error" ? (
      <div className="dashboard-state error-state" role="alert">
        <AlertTriangle />
        <strong>{t.errorTitle}</strong>
        <code>{scenario.contractPath}</code>
        <span>{t.errorDescription}</span>
      </div>
    ) : (
      <>
        <div className="dashboard-summary-grid">
          {scenario.metrics.slice(0, 3).map((metric) => {
            const decreasing = /^[\s]*[-−]/.test(metric.delta)
            return (
              <article className="metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{decreasing ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />} {metric.delta}</small>
                <div className="metric-bars" aria-hidden="true">
                  {scenario.chart.slice(-8).map((value, index) => (
                    <i key={`${metric.label}-${index}`} style={{ height: `${28 + ((value - chartMin) / (chartMax - chartMin || 1)) * 66}%` }} />
                  ))}
                </div>
              </article>
            )
          })}
        </div>

        <div className="dashboard-detail-grid">
          <article className="team-card">
            <div className="widget-heading">
              <div><strong>{t.widgets.teamTitle}</strong><span>{t.widgets.teamDescription}</span></div>
              <button type="button" aria-label={t.widgets.invite}><Plus size={14} /></button>
            </div>
            <div className="team-list">
              {scenario.rows.slice(0, 3).map((row) => (
                <div className="team-member" key={`${row.owner}-${row.name}`}>
                  <span className="dashboard-avatar">{row.owner.slice(0, 2).toUpperCase()}</span>
                  <div><strong>{row.owner}</strong><small>{row.name}</small></div>
                  <span>{row.status}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="activity-card">
            <div className="widget-heading">
              <div><strong>{t.widgets.activityTitle}</strong><span>{t.widgets.activityDescription}</span></div>
              <button type="button" aria-label={t.widgets.newMessage}><MessageSquare size={12} /></button>
            </div>
            <div className="activity-thread">
              {t.widgets.activityMessages.map((message, index) => (
                <span className={index % 2 === 1 ? "from-agent" : undefined} key={message}>{message}</span>
              ))}
            </div>
          </article>

          <article className="chart-card">
            <div className="chart-heading">
              <div><span className="dash-kicker">{t.momentum}</span><strong>{t.trend}</strong></div>
              <div><span>{chartMetric.label}</span><strong>{chartMetric.value}</strong></div>
            </div>
            <Trend values={scenario.chart} ariaLabel={t.trendAria} />
          </article>
        </div>

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
      </>
    )

  const navigation = [
    {
      label: t.navigation.workspace,
      items: [
        { label: t.navigation.overview, icon: LayoutDashboard, active: true },
        { label: t.navigation.analytics, icon: BarChart3, active: false },
        { label: t.navigation.reports, icon: FileText, active: false },
      ],
    },
    {
      label: t.navigation.operations,
      items: [
        { label: t.navigation.records, icon: ListChecks, active: false },
        { label: t.navigation.automations, icon: Bot, active: false },
        { label: t.navigation.team, icon: Users, active: false },
      ],
    },
  ]

  return (
    <div className={navigationOpen ? "dashboard-shell navigation-open" : "dashboard-shell"}>
      <aside
        aria-hidden={compactNavigation && !navigationOpen ? true : undefined}
        aria-label={compactNavigation ? t.navigation.label : undefined}
        aria-modal={compactNavigation && navigationOpen ? true : undefined}
        className="dashboard-sidebar"
        id="showcase-dashboard-navigation"
        inert={compactNavigation && !navigationOpen ? true : undefined}
        ref={navigationRef}
        role={compactNavigation ? "dialog" : undefined}
      >
        <div className="dashboard-brand">
          <span><Sparkles size={16} /></span>
          <div><strong>Shadcn Agent</strong><small>{t.navigation.workspace}</small></div>
          <ChevronDown className="dashboard-brand-chevron" size={14} />
          <button className="dashboard-sidebar-close" type="button" aria-label={t.navigation.close} onClick={closeNavigation}><X size={15} /></button>
        </div>
        <nav className="dashboard-navigation" aria-label={t.navigation.label}>
          {navigation.map((group) => (
            <div className="dashboard-nav-group" key={group.label}>
              <span>{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <a href="#showcase" className={item.active ? "active" : undefined} aria-current={item.active ? "page" : undefined} key={item.label} onClick={closeNavigation}>
                    <Icon size={13} />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="dashboard-sidebar-footer">
          <a href="#showcase" onClick={closeNavigation}><Settings size={13} /><span>{t.navigation.settings}</span></a>
          <div className="dashboard-user">
            <span className="dashboard-avatar">AK</span>
            <div><strong>Agent Kit</strong><small>{t.navigation.role}</small></div>
            <ChevronDown size={12} />
          </div>
        </div>
      </aside>

      <div className="dashboard-workspace" aria-hidden={compactNavigation && navigationOpen ? true : undefined} inert={compactNavigation && navigationOpen ? true : undefined}>
        <header className="dashboard-topbar">
          <button ref={navigationToggleRef} className="dashboard-nav-toggle" type="button" aria-label={navigationOpen ? t.navigation.close : t.navigation.open} aria-controls="showcase-dashboard-navigation" aria-expanded={navigationOpen} onClick={() => setNavigationOpen(!navigationOpen)}>
            {navigationOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
          <label className="dashboard-search">
            <Search size={13} />
            <input type="search" placeholder={t.navigation.search} aria-label={t.navigation.search} />
            <kbd>⌘ K</kbd>
          </label>
          <div className="dashboard-topbar-actions">
            <button type="button" aria-label={t.navigation.notifications}><Bell size={14} /><span /></button>
            <span className="dashboard-avatar">AK</span>
          </div>
        </header>

        <section className="dashboard-content" aria-label={scenario.eyebrow}>
          <div className="dash-heading">
            <div>
              <span className="dash-kicker">{t.overview}</span>
              <h3>{scenario.eyebrow}</h3>
            </div>
            <div className="dash-actions">
              <button className="mini-button" type="button">{t.range}</button>
              <button className="mini-button primary" type="button">{t.navigation.export}</button>
            </div>
          </div>
          <div className="dashboard-canvas">{stateContent}</div>
        </section>
      </div>
      <button className="dashboard-nav-backdrop" type="button" aria-label={t.navigation.close} onClick={closeNavigation} />
    </div>
  )
}
