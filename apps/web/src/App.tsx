import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clipboard,
  Command,
  FileCheck2,
  Languages,
  LayoutDashboard,
  Moon,
  MoreHorizontal,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router"
import { AppSidebar } from "./components/app-sidebar"
import { DateRangePicker } from "./components/date-range-picker"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb"
import { Separator } from "./components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar"
import {
  dashboards,
  localize,
  siteText,
  type DashboardDefinition,
  type DashboardId,
  type ListItem,
  type Metric,
  type StatusItem,
} from "./dashboard-site-data"
import {
  createDefaultDashboardDateRange,
  createMockDashboard,
  getRangePeriodLabel,
  type DashboardDateRange,
} from "./dashboard-mock-data"
import type { Locale } from "./i18n"
import {
  applyPreferences,
  getInitialLocale,
  getInitialTheme,
  getLocaleOverride,
  getSystemLocale,
  getSystemTheme,
  getThemeOverride,
  saveLocaleOverride,
  saveThemeOverride,
  type Theme,
} from "./preferences"

function joinBase(path: string) {
  return `${__PUBLIC_BASE_PATH__.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

const dashboardIcons: Record<DashboardId, LucideIcon> = {
  default: LayoutDashboard,
  sales: BarChart3,
  commerce: ShoppingBag,
  "agent-ops": Activity,
  crm: Users,
  finance: CircleDollarSign,
}

type SiteContextValue = {
  locale: Locale
  theme: Theme
  dateRange: DashboardDateRange
  setLocale: (locale: Locale) => void
  setTheme: (theme: Theme) => void
  setDateRange: (range: DashboardDateRange) => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

function useSiteContext() {
  const value = useContext(SiteContext)
  if (!value) throw new Error("Dashboard site context is missing")
  return value
}

function StatusBadge({ status, locale }: { status: DashboardDefinition["status"]; locale: Locale }) {
  const t = siteText[locale].page
  return (
    <span className={`kit-status ${status}`}>
      {status === "available" ? <CheckCircle2 size={12} /> : <span />}
      {status === "available" ? t.available : t.candidate}
    </span>
  )
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useSiteContext()
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const t = siteText[locale]

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized) return dashboards
    return dashboards.filter((dashboard) =>
      [localize(dashboard.title, locale), dashboard.recipeId, ...dashboard.modules.map((item) => localize(item, locale))]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalized),
    )
  }, [locale, query])

  useEffect(() => {
    if (!open) {
      setQuery("")
      return
    }
    window.requestAnimationFrame(() => inputRef.current?.focus())
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("input, button:not([disabled])"))
        .filter((element) => element.getClientRects().length > 0)
      if (!focusable.length) return
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
    window.addEventListener("keydown", handleKeys)
    return () => window.removeEventListener("keydown", handleKeys)
  }, [onClose, open])

  if (!open) return null

  async function goToDashboard(id: DashboardId) {
    await navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: id } })
    onClose()
  }

  return (
    <div className="kit-command-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="kit-command"
        role="dialog"
        aria-modal="true"
        aria-label={t.header.command}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <label>
          <Search size={18} />
          <span className="sr-only">{t.header.search}</span>
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.header.search} />
          <kbd>ESC</kbd>
        </label>
        <div className="kit-command-results">
          <span>{t.nav.dashboards}</span>
          {results.map((dashboard) => {
            const Icon = dashboardIcons[dashboard.id]
            return (
              <button type="button" key={dashboard.id} onClick={() => void goToDashboard(dashboard.id)}>
                <Icon size={17} />
                <span><strong>{localize(dashboard.title, locale)}</strong><small>{dashboard.recipeId}</small></span>
                <StatusBadge status={dashboard.status} locale={locale} />
              </button>
            )
          })}
          {!results.length ? <p>{locale === "zh" ? "没有匹配的 Dashboard" : "No matching dashboard"}</p> : null}
        </div>
      </div>
    </div>
  )
}

function RouteBreadcrumb() {
  const { locale } = useSiteContext()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const t = siteText[locale]
  const dashboard = dashboards.find((item) => pathname.includes(`/dashboard/${item.id}`))
  const current = dashboard
    ? localize(dashboard.title, locale)
    : pathname.includes("/catalog")
      ? t.nav.catalog
      : t.nav.workflow
  const section = dashboard ? t.nav.dashboards : t.nav.agentKit

  return (
    <Breadcrumb className="kit-breadcrumb">
      <BreadcrumbList>
        <BreadcrumbItem className="hidden sm:inline-flex">
          <BreadcrumbLink asChild>
            {dashboard ? (
              <Link to="/dashboard/$dashboardId" params={{ dashboardId: "default" }}>{section}</Link>
            ) : (
              <Link to="/catalog">{section}</Link>
            )}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function DashboardLayout() {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale())
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme())
  const [dateRange, setDateRange] = useState<DashboardDateRange>(() => createDefaultDashboardDateRange())
  const [commandOpen, setCommandOpen] = useState(false)
  const commandButtonRef = useRef<HTMLButtonElement>(null)
  const t = siteText[locale]

  function setLocale(localeValue: Locale) {
    saveLocaleOverride(localeValue)
    setLocaleState(localeValue)
  }

  function setTheme(themeValue: Theme) {
    saveThemeOverride(themeValue)
    setThemeState(themeValue)
  }

  useEffect(() => {
    applyPreferences(locale, theme)
  }, [locale, theme])

  useEffect(() => {
    const handleLanguageChange = () => {
      if (!getLocaleOverride()) setLocaleState(getSystemLocale())
    }
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")
    const handleThemeChange = () => {
      if (!getThemeOverride()) setThemeState(getSystemTheme())
    }
    window.addEventListener("languagechange", handleLanguageChange)
    colorScheme.addEventListener("change", handleThemeChange)
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange)
      colorScheme.removeEventListener("change", handleThemeChange)
    }
  }, [])

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeys)
    return () => window.removeEventListener("keydown", handleKeys)
  }, [])

  const contextValue = useMemo(
    () => ({ locale, theme, dateRange, setLocale, setTheme, setDateRange }),
    [dateRange, locale, theme],
  )

  return (
    <SiteContext.Provider value={contextValue}>
      <SidebarProvider className="kit-sidebar-layout">
        <AppSidebar
          locale={locale}
          theme={theme}
          onLocaleChange={() => setLocale(locale === "zh" ? "en" : "zh")}
          onThemeChange={() => setTheme(theme === "light" ? "dark" : "light")}
        />
        <SidebarInset className="kit-main">
          <header className="kit-header">
            <div className="kit-header-start">
              <SidebarTrigger aria-label={t.header.menu} />
              <Separator className="kit-header-separator" orientation="vertical" />
              <RouteBreadcrumb />
              <button ref={commandButtonRef} className="kit-search-trigger" type="button" onClick={() => setCommandOpen(true)}>
                <Search size={17} />
                <span>{t.header.search}</span>
                <kbd>⌘ K</kbd>
              </button>
            </div>
            <div className="kit-header-actions">
              <button type="button" onClick={() => setLocale(locale === "zh" ? "en" : "zh")} aria-label={t.header.language} title={t.header.language}>
                <Languages size={18} />
              </button>
              <button type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={t.header.theme} title={t.header.theme}>
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </header>
          <div className="kit-page"><Outlet /></div>
        </SidebarInset>
        <CommandPalette open={commandOpen} onClose={() => {
          setCommandOpen(false)
          window.requestAnimationFrame(() => commandButtonRef.current?.focus())
        }} />
      </SidebarProvider>
    </SiteContext.Provider>
  )
}

function PageHeader({ dashboard }: { dashboard: DashboardDefinition }) {
  const { dateRange, locale, setDateRange } = useSiteContext()
  const [copied, setCopied] = useState(false)
  const t = siteText[locale]
  const registryUrl = typeof window === "undefined"
    ? joinBase("r/dashboard-overview-01.json")
    : `${window.location.origin}${joinBase("r/dashboard-overview-01.json")}`
  const installCommand = `bunx --bun shadcn@4.14.1 add ${registryUrl} --dry-run`

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <header className="kit-page-header">
      <div>
        <div className="kit-page-title-row">
          <h1>{localize(dashboard.title, locale)}</h1>
          <StatusBadge status={dashboard.status} locale={locale} />
        </div>
        <p>{localize(dashboard.description, locale)}</p>
        <div className="kit-module-list" aria-label={t.page.details}>
          {dashboard.modules.map((module) => <span key={localize(module, locale)}>{localize(module, locale)}</span>)}
        </div>
      </div>
      <div className="kit-page-actions">
        <DateRangePicker locale={locale} value={dateRange} onChange={setDateRange} />
        {dashboard.status === "available" ? (
          <button className="kit-primary-action" type="button" onClick={copyInstall}>
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
            {copied ? t.page.copied : t.page.install}
          </button>
        ) : null}
      </div>
    </header>
  )
}

function MetricCard({ metric, className = "" }: { metric: Metric; className?: string }) {
  const { locale } = useSiteContext()
  const Direction = metric.direction === "up" ? ArrowUp : metric.direction === "down" ? ArrowDown : ArrowRight
  return (
    <article className={`kit-card kit-metric ${className}`}>
      <span>{localize(metric.label, locale)}</span>
      <strong>{metric.value}</strong>
      <small className={metric.direction ?? "neutral"}><Direction size={12} />{metric.delta} {locale === "zh" ? "较上期" : "from last period"}</small>
    </article>
  )
}

function MiniBars({ values }: { values: number[] }) {
  return (
    <div className="kit-mini-bars" aria-hidden="true">
      {values.slice(-8).map((value, index) => <i key={`${value}-${index}`} style={{ height: `${value}%` }} />)}
    </div>
  )
}

function FeatureMetricCard({ metric, values, line = false }: { metric: Metric; values: number[]; line?: boolean }) {
  const { locale } = useSiteContext()
  return (
    <article className="kit-card kit-feature-metric">
      <span>{localize(metric.label, locale)}</span>
      <strong>{metric.value}</strong>
      <small className={metric.direction ?? "neutral"}>{metric.delta} {locale === "zh" ? "较上期" : "from last period"}</small>
      {line ? <CompactLine values={values.slice(-6)} /> : <MiniBars values={values} />}
    </article>
  )
}

function CompactLine({ values }: { values: number[] }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * 100
    const y = 38 - ((value - min) / Math.max(max - min, 1)) * 30
    return `${x},${y}`
  }).join(" ")
  return (
    <svg className="kit-compact-line" viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" />
      {points.split(" ").map((point) => {
        const [cx, cy] = point.split(",")
        return <circle key={point} cx={cx} cy={cy} r="1.6" vectorEffect="non-scaling-stroke" />
      })}
    </svg>
  )
}

function TrendChart({ dashboard, className = "" }: { dashboard: DashboardDefinition; className?: string }) {
  const { dateRange, locale } = useSiteContext()
  const { chart } = dashboard
  const makePoints = (values: number[]) => {
    const max = Math.max(...values)
    const min = Math.min(...values)
    return values.map((value, index) => {
      const x = 24 + (index / Math.max(values.length - 1, 1)) * 552
      const y = 176 - ((value - min) / Math.max(max - min, 1)) * 128
      return `${x},${y}`
    }).join(" ")
  }
  return (
    <article className={`kit-card kit-chart ${className}`}>
      <div className="kit-card-heading">
        <div><h2>{localize(chart.title, locale)}</h2><p>{localize(chart.description, locale)}</p></div>
        <span>{getRangePeriodLabel(dateRange)}</span>
      </div>
      <div className="kit-chart-legend">
        <span><i />{localize(chart.primaryLabel, locale)}</span>
        {chart.secondary && chart.secondaryLabel ? <span><i className="secondary" />{localize(chart.secondaryLabel, locale)}</span> : null}
      </div>
      <svg viewBox="0 0 600 200" role="img" aria-label={localize(chart.title, locale)}>
        <desc>{localize(chart.description, locale)}</desc>
        {[48, 80, 112, 144, 176].map((y) => <line key={y} x1="24" x2="576" y1={y} y2={y} />)}
        {chart.secondary ? <polyline className="secondary" points={makePoints(chart.secondary)} fill="none" /> : null}
        <polyline points={makePoints(chart.primary)} fill="none" />
      </svg>
    </article>
  )
}

function ListCard({ dashboard, className = "" }: { dashboard: DashboardDefinition; className?: string }) {
  const { locale } = useSiteContext()
  return (
    <article className={`kit-card kit-list-card ${className}`}>
      <div className="kit-card-heading">
        <div><h2>{localize(dashboard.list.title, locale)}</h2><p>{localize(dashboard.list.description, locale)}</p></div>
      </div>
      <div className="kit-list">
        {dashboard.list.items.map((item: ListItem, index) => (
          <div key={localize(item.title, locale)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{localize(item.title, locale)}</strong><small>{localize(item.meta, locale)}</small></div>
            <em className={item.tone ?? "neutral"}>{item.value}</em>
          </div>
        ))}
      </div>
    </article>
  )
}

function StatusCard({ dashboard, className = "" }: { dashboard: DashboardDefinition; className?: string }) {
  const { locale } = useSiteContext()
  return (
    <article className={`kit-card kit-status-card ${className}`}>
      <div className="kit-card-heading">
        <div><h2>{localize(dashboard.statuses.title, locale)}</h2><p>{localize(dashboard.statuses.description, locale)}</p></div>
      </div>
      <div className="kit-progress-list">
        {dashboard.statuses.items.map((item: StatusItem) => (
          <div key={localize(item.label, locale)}>
            <div><strong>{localize(item.label, locale)}</strong><span>{item.value}</span></div>
            <small>{localize(item.meta, locale)}</small>
            <i><span className={item.tone ?? "blue"} style={{ width: `${item.progress}%` }} /></i>
          </div>
        ))}
      </div>
    </article>
  )
}

function DataTableCard({ dashboard, className = "" }: { dashboard: DashboardDefinition; className?: string }) {
  const { locale } = useSiteContext()
  const [query, setQuery] = useState("")
  const t = siteText[locale]
  const rows = dashboard.table.rows.filter((row) =>
    [...row.cells, localize(row.status, locale)].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )
  return (
    <article className={`kit-card kit-table-card ${className}`}>
      <div className="kit-table-heading">
        <div><h2>{localize(dashboard.table.title, locale)}</h2><p>{localize(dashboard.table.description, locale)}</p></div>
        <label><Search size={15} /><span className="sr-only">{localize(dashboard.table.filter, locale)}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={localize(dashboard.table.filter, locale)} /></label>
      </div>
      <div className="kit-table-wrap">
        <table>
          <caption className="sr-only">{localize(dashboard.table.title, locale)}</caption>
          <thead><tr>{dashboard.table.columns.map((column) => <th key={localize(column, locale)}>{localize(column, locale)}</th>)}<th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.cells[0]}-${index}`}>
                {row.cells.map((cell) => <td key={cell}>{cell}</td>)}
                <td><span className={`kit-table-status ${row.tone}`}>{localize(row.status, locale)}</span></td>
                <td><button type="button" aria-label={`${row.cells[0]} actions`}><MoreHorizontal size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="kit-table-footer">
        <span>{t.common.selected}</span>
        <div><button type="button" disabled aria-label={t.common.previous}><ChevronLeft size={15} /></button><button type="button" aria-label={t.common.next}><ChevronRight size={15} /></button></div>
      </div>
    </article>
  )
}

function DefaultBoard({ dashboard }: { dashboard: DashboardDefinition }) {
  return (
    <div className="kit-board kit-board-default">
      <ListCard dashboard={dashboard} className="kit-default-team" />
      <FeatureMetricCard metric={dashboard.metrics[0]} values={dashboard.chart.primary} />
      <FeatureMetricCard metric={dashboard.metrics[1]} values={dashboard.chart.primary} line />
      <StatusCard dashboard={dashboard} className="kit-default-status" />
      <TrendChart dashboard={dashboard} className="kit-default-chart" />
      <DataTableCard dashboard={dashboard} className="kit-default-table" />
      <article className="kit-card kit-adapter-card">
        <div className="kit-card-heading"><div><h2>Data Adapter</h2><p>Project fields map in one explicit boundary.</p></div><PackageCheck size={18} /></div>
        <div><span>metrics[]</span><strong>Mapped</strong></div>
        <div><span>chart[]</span><strong>Optional</strong></div>
        <div><span>rows[]</span><strong>Controlled L2</strong></div>
        <div><span>contract</span><strong>Validated</strong></div>
      </article>
    </div>
  )
}

function SalesCommerceBoard({ dashboard }: { dashboard: DashboardDefinition }) {
  return (
    <div className="kit-board">
      <div className="kit-summary-split">
        <TrendChart dashboard={dashboard} />
        <div className="kit-metric-quartet">{dashboard.metrics.map((metric) => <MetricCard metric={metric} key={localize(metric.label, "en")} />)}</div>
      </div>
      <div className="kit-detail-split">
        <ListCard dashboard={dashboard} />
        <div className="kit-detail-stack"><StatusCard dashboard={dashboard} /><DataTableCard dashboard={dashboard} /></div>
      </div>
    </div>
  )
}

function AnalyticsBoard({ dashboard }: { dashboard: DashboardDefinition }) {
  return (
    <div className="kit-board">
      <div className="kit-metrics-row">{dashboard.metrics.map((metric) => <MetricCard metric={metric} key={localize(metric.label, "en")} />)}</div>
      <div className="kit-analytics-grid"><TrendChart dashboard={dashboard} /><ListCard dashboard={dashboard} /></div>
      <div className="kit-analytics-grid reverse"><StatusCard dashboard={dashboard} /><DataTableCard dashboard={dashboard} /></div>
    </div>
  )
}

function CrmBoard({ dashboard }: { dashboard: DashboardDefinition }) {
  const { locale } = useSiteContext()
  return (
    <div className="kit-board">
      <div className="kit-target-banner">
        <div><span>{locale === "zh" ? "季度目标" : "Quarterly target"}</span><strong>{locale === "zh" ? "当前目标尚未完成" : "Your target is incomplete"}</strong><p>{locale === "zh" ? "已完成 68%，需要继续推进重点客户。" : "68% complete. Keep moving priority accounts forward."}</p></div>
        <div><strong>68%</strong><i><span /></i></div>
      </div>
      <div className="kit-metrics-row">{dashboard.metrics.map((metric) => <MetricCard metric={metric} key={localize(metric.label, "en")} />)}</div>
      <div className="kit-analytics-grid"><ListCard dashboard={dashboard} /><StatusCard dashboard={dashboard} /></div>
      <TrendChart dashboard={dashboard} />
      <DataTableCard dashboard={dashboard} />
    </div>
  )
}

export function DashboardPage({ dashboardId }: { dashboardId: DashboardId }) {
  const { dateRange, locale } = useSiteContext()
  const dashboard = useMemo(
    () => createMockDashboard(dashboardId, dateRange),
    [dashboardId, dateRange],
  )

  useEffect(() => {
    document.title = `${localize(dashboard.title, locale)} — shadcnagent`
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", localize(dashboard.description, locale))
  }, [dashboard, locale])

  return (
    <>
      <PageHeader dashboard={dashboard} />
      {dashboard.id === "default" ? <DefaultBoard dashboard={dashboard} /> : null}
      {dashboard.id === "sales" || dashboard.id === "commerce" ? <SalesCommerceBoard dashboard={dashboard} /> : null}
      {dashboard.id === "agent-ops" || dashboard.id === "finance" ? <AnalyticsBoard dashboard={dashboard} /> : null}
      {dashboard.id === "crm" ? <CrmBoard dashboard={dashboard} /> : null}
    </>
  )
}

export function CatalogPage() {
  const { locale } = useSiteContext()
  const t = siteText[locale]
  useEffect(() => { document.title = `${t.catalog.title} — shadcnagent` }, [t.catalog.title])
  return (
    <>
      <header className="kit-page-header kit-simple-header"><div><h1>{t.catalog.title}</h1><p>{t.catalog.description}</p></div></header>
      <section className="kit-catalog-grid">
        {dashboards.map((dashboard) => {
          const Icon = dashboardIcons[dashboard.id]
          return (
            <article className="kit-card kit-catalog-card" key={dashboard.id}>
              <div><span><Icon size={19} /></span><StatusBadge status={dashboard.status} locale={locale} /></div>
              <h2>{localize(dashboard.title, locale)}</h2>
              <code>{dashboard.recipeId}</code>
              <p>{localize(dashboard.description, locale)}</p>
              <div className="kit-module-list">{dashboard.modules.map((module) => <span key={localize(module, locale)}>{localize(module, locale)}</span>)}</div>
              <Link to="/dashboard/$dashboardId" params={{ dashboardId: dashboard.id }}>{t.catalog.action}<ArrowRight size={15} /></Link>
            </article>
          )
        })}
      </section>
    </>
  )
}

export function WorkflowPage() {
  const { locale } = useSiteContext()
  const t = siteText[locale]
  useEffect(() => { document.title = `${t.workflow.title} — shadcnagent` }, [t.workflow.title])
  return (
    <>
      <header className="kit-page-header kit-simple-header"><div><h1>{t.workflow.title}</h1><p>{t.workflow.description}</p></div></header>
      <section className="kit-workflow-grid">
        {t.workflow.steps.map(([title, description], index) => (
          <article className="kit-card" key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>{index === t.workflow.steps.length - 1 ? <FileCheck2 size={20} /> : <Command size={20} />}<h2>{title}</h2></div>
            <p>{description}</p>
          </article>
        ))}
      </section>
      <section className="kit-card kit-proof-summary">
        <div><ShieldCheck size={22} /><div><h2>Proof Report</h2><p>Type · Build · Contract · States · Responsive · A11y</p></div></div>
        <div><span><Check size={14} />Type</span><span><Check size={14} />Build</span><span><Check size={14} />States</span><span><Check size={14} />Responsive</span></div>
      </section>
    </>
  )
}

export function App({ children }: { children?: ReactNode }) {
  return children ?? <Outlet />
}
