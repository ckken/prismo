import { useEffect, useMemo, useState } from "react"
import { Button, Card, Chip, ProgressBar } from "@heroui/react"
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Github,
  Languages,
  LayoutDashboard,
  Menu,
  Moon,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { startOfDay, subDays } from "date-fns"
import { AgenicMark } from "./components/logo"
import {
  createDefaultDashboardDateRange,
  createMockDashboard,
  getRangePeriodLabel,
  type DashboardDateRange,
  type MockDashboardDefinition,
} from "./dashboard-mock-data"
import { dashboards, localize, type DashboardId, type RecipeStatus } from "./dashboard-site-data"
import { applyPreferences, getInitialLocale, getInitialTheme, saveLocaleOverride, saveThemeOverride, type Theme } from "./preferences"
import type { Locale } from "./i18n"
import "./hero-dashboard.css"

const icons: Record<DashboardId, LucideIcon> = {
  default: LayoutDashboard,
  sales: BarChart3,
  commerce: ShoppingBag,
  "agent-ops": Activity,
  crm: Users,
  finance: CircleDollarSign,
}

const presetDays = [7, 28, 90] as const

function getRange(days: number): DashboardDateRange {
  const to = startOfDay(new Date())
  return { from: subDays(to, days - 1), to }
}

function StatusChip({ status, locale }: { status: RecipeStatus; locale: Locale }) {
  const available = status === "available"
  return (
    <Chip className={`hero-dashboard-status ${available ? "is-available" : "is-candidate"}`} size="sm">
      {available ? <CheckCircle2 aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
      {available ? (locale === "zh" ? "可用" : "Available") : (locale === "zh" ? "候选" : "Candidate")}
    </Chip>
  )
}

function TrendChart({ dashboard, locale }: { dashboard: MockDashboardDefinition; locale: Locale }) {
  const values = dashboard.chart.primary
  const secondary = dashboard.chart.secondary
  const max = Math.max(...values, ...(secondary ?? []))
  const min = Math.min(...values, ...(secondary ?? []))
  const makePoints = (series: number[]) => series.map((value, index) => {
    const x = (index / Math.max(series.length - 1, 1)) * 100
    const y = 84 - ((value - min) / Math.max(max - min, 1)) * 66
    return `${x},${y}`
  }).join(" ")

  return (
    <Card className="hero-dashboard-chart-card">
      <Card.Header className="hero-dashboard-card-header">
        <div><Card.Title>{localize(dashboard.chart.title, locale)}</Card.Title><Card.Description>{localize(dashboard.chart.description, locale)}</Card.Description></div>
        <span className="hero-dashboard-range-label">{dashboard.mock.periodLabel}</span>
      </Card.Header>
      <Card.Content className="hero-dashboard-chart-content">
        <svg viewBox="0 0 100 100" role="img" aria-label={localize(dashboard.chart.title, locale)} preserveAspectRatio="none">
          {[22, 45, 68].map((line) => <line key={line} x1="0" x2="100" y1={line} y2={line} />)}
          {secondary ? <polyline className="hero-dashboard-chart-secondary" points={makePoints(secondary)} /> : null}
          <polyline className="hero-dashboard-chart-primary" points={makePoints(values)} />
        </svg>
        <div className="hero-dashboard-chart-legend"><span><i />{localize(dashboard.chart.primaryLabel, locale)}</span>{secondary ? <span><i />{localize(dashboard.chart.secondaryLabel!, locale)}</span> : null}</div>
      </Card.Content>
    </Card>
  )
}

function DashboardContent({ dashboard, locale }: { dashboard: MockDashboardDefinition; locale: Locale }) {
  return (
    <>
      <section className="hero-dashboard-metrics" aria-label={locale === "zh" ? "关键指标" : "Key metrics"}>
        {dashboard.metrics.map((metric) => {
          const down = metric.direction === "down"
          return (
            <Card className="hero-dashboard-metric" key={localize(metric.label, "en")}>
              <Card.Content>
                <span>{localize(metric.label, locale)}</span>
                <strong>{metric.value}</strong>
                <small className={down ? "is-down" : "is-up"}>{down ? <ArrowDownRight aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}{metric.delta}</small>
              </Card.Content>
            </Card>
          )
        })}
      </section>

      <section className="hero-dashboard-grid">
        <TrendChart dashboard={dashboard} locale={locale} />
        <Card className="hero-dashboard-list-card">
          <Card.Header className="hero-dashboard-card-header"><div><Card.Title>{localize(dashboard.list.title, locale)}</Card.Title><Card.Description>{localize(dashboard.list.description, locale)}</Card.Description></div></Card.Header>
          <Card.Content className="hero-dashboard-list">
            {dashboard.list.items.map((item, index) => <div key={localize(item.title, "en")}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{localize(item.title, locale)}</strong><small>{localize(item.meta, locale)}</small></span><em>{item.value}</em></div>)}
          </Card.Content>
        </Card>
      </section>

      <section className="hero-dashboard-grid">
        <Card className="hero-dashboard-status-card">
          <Card.Header className="hero-dashboard-card-header"><div><Card.Title>{localize(dashboard.statuses.title, locale)}</Card.Title><Card.Description>{localize(dashboard.statuses.description, locale)}</Card.Description></div></Card.Header>
          <Card.Content className="hero-dashboard-progresses">
            {dashboard.statuses.items.map((item) => <div key={localize(item.label, "en")}><div><span>{localize(item.label, locale)}</span><b>{item.value}</b></div><ProgressBar aria-label={localize(item.label, locale)} value={item.progress} /><small>{localize(item.meta, locale)}</small></div>)}
          </Card.Content>
        </Card>
        <Card className="hero-dashboard-proof-card">
          <Card.Header className="hero-dashboard-card-header"><div><Card.Title>Proof boundary</Card.Title><Card.Description>{locale === "zh" ? "展示与交付状态分别记录" : "Presentation and delivery status stay separate"}</Card.Description></div><ShieldCheck aria-hidden="true" /></Card.Header>
          <Card.Content className="hero-dashboard-proof-list">
            <div><span>{locale === "zh" ? "HeroUI 渲染" : "HeroUI rendering"}</span><Chip size="sm">live</Chip></div>
            <div><span>Data Adapter</span><Chip size="sm">mapped</Chip></div>
            <div><span>Route evidence</span><Chip size="sm">demo</Chip></div>
            <p>{locale === "zh" ? "安装型 HeroUI Renderer 尚未通过 apply / verify，因此不会冒充已完成交付。" : "The installable HeroUI Renderer has not passed apply / verify, so it is not claimed as completed delivery."}</p>
          </Card.Content>
        </Card>
      </section>

      <Card className="hero-dashboard-table-card">
        <Card.Header className="hero-dashboard-card-header"><div><Card.Title>{localize(dashboard.table.title, locale)}</Card.Title><Card.Description>{localize(dashboard.table.description, locale)}</Card.Description></div><Chip size="sm">L2</Chip></Card.Header>
        <Card.Content className="hero-dashboard-table-scroll">
          <table>
            <thead><tr>{dashboard.table.columns.map((column) => <th key={localize(column, "en")}>{localize(column, locale)}</th>)}<th>{locale === "zh" ? "状态" : "Status"}</th></tr></thead>
            <tbody>{dashboard.table.rows.map((row) => <tr key={row.cells.join("-")}>{row.cells.map((cell) => <td key={cell}>{cell}</td>)}<td><Chip size="sm">{localize(row.status, locale)}</Chip></td></tr>)}</tbody>
          </table>
        </Card.Content>
      </Card>
    </>
  )
}

export function HeroDashboardPage({ dashboardId }: { dashboardId: DashboardId }) {
  const navigate = useNavigate()
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale())
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const [dateRange, setDateRange] = useState<DashboardDateRange>(() => createDefaultDashboardDateRange())
  const [navOpen, setNavOpen] = useState(false)
  const dashboard = useMemo(() => createMockDashboard(dashboardId, dateRange), [dashboardId, dateRange])

  useEffect(() => {
    applyPreferences(locale, theme)
    document.title = `${localize(dashboard.title, locale)} — Agenic`
  }, [dashboard.title, locale, theme])

  const selectDashboard = (id: DashboardId) => {
    setNavOpen(false)
    void navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: id } })
  }

  return (
    <main className="hero-dashboard">
      <aside className={`hero-dashboard-sidebar ${navOpen ? "is-open" : ""}`}>
        <button className="hero-dashboard-brand" type="button" onClick={() => void navigate({ to: "/" })}><AgenicMark /><span>Agenic</span></button>
        <div className="hero-dashboard-sidebar-label">{locale === "zh" ? "可交付 Recipe" : "Delivery Recipes"}</div>
        <nav className="hero-dashboard-nav" aria-label={locale === "zh" ? "Dashboard 导航" : "Dashboard navigation"}>
          {dashboards.map((item) => {
            const Icon = icons[item.id]
            return <Button key={item.id} variant={item.id === dashboardId ? "primary" : "ghost"} onPress={() => selectDashboard(item.id)}><Icon aria-hidden="true" /><span>{localize(item.title, locale)}</span><StatusChip status={item.status} locale={locale} /></Button>
          })}
        </nav>
        <div className="hero-dashboard-sidebar-bottom"><Button variant="ghost" onPress={() => void navigate({ to: "/workflow" })}><Workflow aria-hidden="true" />{locale === "zh" ? "交付流程" : "Workflow"}</Button><a href={__PUBLIC_REPOSITORY_URL__} target="_blank" rel="noreferrer"><Github aria-hidden="true" />GitHub</a></div>
      </aside>

      <div className="hero-dashboard-main">
        <header className="hero-dashboard-topbar">
          <div><Button isIconOnly variant="ghost" className="hero-dashboard-menu" aria-label="Open navigation" onPress={() => setNavOpen((open) => !open)}><Menu aria-hidden="true" /></Button><span className="hero-dashboard-breadcrumb">Agenic / {localize(dashboard.title, locale)}</span></div>
          <div className="hero-dashboard-top-actions"><Button isIconOnly variant="ghost" aria-label="Toggle language" onPress={() => { const next = locale === "zh" ? "en" : "zh"; saveLocaleOverride(next); setLocale(next) }}><Languages aria-hidden="true" /></Button><Button isIconOnly variant="ghost" aria-label="Toggle theme" onPress={() => { const next = theme === "light" ? "dark" : "light"; saveThemeOverride(next); setTheme(next) }}>{theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</Button></div>
        </header>

        <div className="hero-dashboard-content">
          <header className="hero-dashboard-page-header">
            <div><div className="hero-dashboard-title-row"><h1>{localize(dashboard.title, locale)}</h1><StatusChip status={dashboard.status} locale={locale} /></div><p>{localize(dashboard.description, locale)}</p></div>
            <div className="hero-dashboard-presets"><CalendarDays aria-hidden="true" />{presetDays.map((days) => <Button key={days} size="sm" variant={getRangePeriodLabel(dateRange) === `${days}D` ? "primary" : "secondary"} onPress={() => setDateRange(getRange(days))}>{days}D</Button>)}</div>
          </header>
          <DashboardContent dashboard={dashboard} locale={locale} />
        </div>
      </div>
    </main>
  )
}
