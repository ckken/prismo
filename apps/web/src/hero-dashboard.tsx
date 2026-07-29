import { useEffect, useMemo, useState } from "react"
import { Button, Card, Chip } from "@heroui/react"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Columns3,
  Download,
  Eye,
  Filter,
  Github,
  Languages,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Moon,
  MoreVertical,
  Package,
  Pencil,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { AgenicMark } from "./components/logo"
import { dashboards, localize, type DashboardId } from "./dashboard-site-data"
import { applyPreferences, getInitialLocale, getInitialTheme, saveLocaleOverride, saveThemeOverride, type Theme } from "./preferences"
import type { Locale } from "./i18n"
import "./hero-dashboard.css"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const bars = [29, 52, 34, 16, 43, 23, 25, 31, 9, 43, 37, 32]
const organic = [2, 15, 8, 14, 15, 8, 18, 18, 20, 17, 22, 15]
const paid = [1, 10, 12, 14, 8, 9, 12, 10, 5, 12, 18, 9]
const employees = [
  ["#4586936", "Alex Turner", "alex@agenic.dev", "Product Manager"],
  ["#4586937", "Emma Davis", "emma@agenic.dev", "Senior Designer"],
  ["#4586933", "John Smith", "john@agenic.dev", "Engineering Lead"],
  ["#4586932", "Kate Moore", "kate@agenic.dev", "Operations Lead"],
  ["#4586935", "Mike Wilson", "mike@agenic.dev", "Agent Engineer"],
  ["#4586934", "Sara Johnson", "sara@agenic.dev", "Marketing Lead"],
]

function PolylineChart() {
  const points = (series: number[]) => series.map((value, index) => `${index * (100 / 11)},${86 - value * 3.4}`).join(" ")
  return (
    <div className="aligned-line-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Traffic source trend">
        {[20, 42, 64, 86].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} />)}
        <polyline className="is-organic" points={points(organic)} />
        <polyline className="is-paid" points={points(paid)} />
      </svg>
      <div>{months.map((month) => <span key={month}>{month}</span>)}</div>
    </div>
  )
}

function BarChart() {
  return (
    <div className="aligned-bar-chart">
      <div className="aligned-y-axis"><span>60</span><span>40</span><span>20</span><span>0</span></div>
      <div className="aligned-bars">{bars.map((value, index) => <div key={index}><i style={{ height: `${value * 2.45}px` }} /><span>{String(index + 1).padStart(2, "0")}</span></div>)}</div>
    </div>
  )
}

function CandidateView({ dashboardId, locale }: { dashboardId: DashboardId; locale: Locale }) {
  const navigate = useNavigate()
  const recipe = dashboards.find((item) => item.id === dashboardId) ?? dashboards[1]
  return (
    <section className="aligned-candidate">
      <div><Sparkles /></div>
      <Chip size="sm" variant="soft">{locale === "zh" ? "候选 Recipe" : "Candidate Recipe"}</Chip>
      <h1>{localize(recipe.title, locale)}</h1>
      <p>{locale === "zh" ? "先完成 dashboard-overview-01 的精品闭环，再逐个推进业务 Recipe。" : "We are completing the flagship dashboard-overview-01 loop before expanding business Recipes."}</p>
      <Button variant="primary" onPress={() => void navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })}>Open overview</Button>
    </section>
  )
}

function MetricCard({ label, value, delta, down = false }: { label: string; value: string; delta: string; down?: boolean }) {
  return (
    <div className="aligned-metric-card">
      <span>{label}</span>
      <div><strong>{value}</strong><Chip className={down ? "is-down" : "is-up"} size="sm">{down ? <ArrowDown /> : <ArrowUp />}{delta}</Chip></div>
    </div>
  )
}

function Overview({ locale }: { locale: Locale }) {
  const [tab, setTab] = useState("Overview")
  const [period, setPeriod] = useState("Monthly")
  const [chartRange, setChartRange] = useState("Last 2 weeks")
  const [query, setQuery] = useState("")
  const [filtered, setFiltered] = useState(false)
  const [descending, setDescending] = useState(false)
  const [showWorkerType, setShowWorkerType] = useState(true)
  const visibleEmployees = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const rows = employees.filter((row) =>
      (!normalized || row.some((cell) => cell.toLowerCase().includes(normalized))) &&
      (!filtered || row[3].includes("Lead")),
    )
    return descending ? [...rows].reverse() : rows
  }, [descending, filtered, query])
  const cycle = (current: string, values: string[]) =>
    values[(values.indexOf(current) + 1) % values.length]

  return (
    <>
      <section className="aligned-toolbar">
        <div className="aligned-tabs">{["Overview", "Sales", "Expenses"].map((item) => <Button key={item} variant={tab === item ? "secondary" : "ghost"} onPress={() => setTab(item)}>{item}</Button>)}</div>
        <div className="aligned-controls"><Button isIconOnly variant="secondary" aria-label="Refresh" onPress={() => setChartRange("Last 2 weeks")}><RefreshCw /></Button><Button variant="secondary" onPress={() => setPeriod(cycle(period, ["Monthly", "Quarterly", "Yearly"]))}><CalendarDays />{locale === "zh" ? ({ Monthly: "月度", Quarterly: "季度", Yearly: "年度" }[period]) : period}<ChevronDown /></Button><Button variant="primary"><Download />{locale === "zh" ? "下载" : "Download"}</Button></div>
      </section>

      <section className="aligned-metrics" aria-label="Key metrics">
        <MetricCard label={locale === "zh" ? "收入" : "Revenue"} value="$228,441" delta="3.3%" />
        <MetricCard label={locale === "zh" ? "支出" : "Expenses"} value="$25,108" delta="3.3%" down />
        <MetricCard label={locale === "zh" ? "销售" : "Sales"} value="458" delta="3.3%" />
        <MetricCard label={locale === "zh" ? "利润" : "Profit"} value="$203,133" delta="4.1%" />
      </section>

      <section className="aligned-chart-grid">
        <Card className="aligned-chart-card">
          <Card.Header><Card.Title>{locale === "zh" ? "销售表现" : "Sales Performance"}</Card.Title><Button size="sm" variant="secondary" onPress={() => setChartRange(cycle(chartRange, ["Last week", "Last 2 weeks", "Last month", "Last 3 months"]))}>{chartRange}<ChevronDown /></Button></Card.Header>
          <Card.Content>
            <div className="aligned-chart-stats"><div><strong>$28,441</strong><b><ArrowUp />3.3%</b><span>Weekly Sales</span></div><div><strong>$4,063</strong><b><ArrowUp />3.3%</b><span>Daily Sales</span></div><div><strong>278</strong><b><ArrowUp />3.3%</b><span>Total Sales</span></div></div>
            <BarChart />
          </Card.Content>
        </Card>
        <Card className="aligned-chart-card">
          <Card.Header><Card.Title>{locale === "zh" ? "流量来源" : "Traffic Source"}</Card.Title><div className="aligned-legend"><span><i />Organic</span><span><i />Paid Ads</span><Button isIconOnly size="sm" variant="secondary" aria-label="More"><MoreVertical /></Button></div></Card.Header>
          <Card.Content>
            <div className="aligned-session"><strong>231,856</strong><span>Sessions</span></div>
            <PolylineChart />
          </Card.Content>
        </Card>
      </section>

      <section className="aligned-table-section">
        <header><h2>{locale === "zh" ? "全部成员" : "All employees"} <Chip size="sm">32</Chip></h2><div className="aligned-table-actions"><Button size="sm" variant={filtered ? "primary" : "secondary"} onPress={() => setFiltered((value) => !value)}><Filter />Filter</Button><Button size="sm" variant={descending ? "primary" : "secondary"} onPress={() => setDescending((value) => !value)}><SlidersHorizontal />Sort</Button><Button size="sm" variant={showWorkerType ? "secondary" : "primary"} onPress={() => setShowWorkerType((value) => !value)}><Columns3 />Columns</Button></div><label className="aligned-table-search"><Search /><input aria-label="Search employees" placeholder="Search..." value={query} onChange={(event) => setQuery(event.target.value)} /></label></header>
        <div className="aligned-table-wrap">
          <table>
            <thead><tr><th>Worker ID</th><th>Member</th><th>Role</th>{showWorkerType ? <th>Worker Type</th> : null}<th>Actions</th></tr></thead>
            <tbody>{visibleEmployees.map(([id, name, email, role]) => { const index = employees.findIndex((row) => row[0] === id); return <tr key={id}><td>{id}</td><td><span className={`aligned-avatar tone-${index}`}>{name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{name}</strong><small>{email}</small></div></td><td>{role}</td>{showWorkerType ? <td>Employee</td> : null}<td><Button isIconOnly size="sm" variant="secondary" aria-label="View"><Eye /></Button><Button isIconOnly size="sm" variant="secondary" aria-label="Edit"><Pencil /></Button><Button isIconOnly size="sm" className="is-danger" aria-label="Delete"><Trash2 /></Button></td></tr> })}</tbody>
          </table>
          {visibleEmployees.length === 0 ? <div className="aligned-empty">No employees match the current filters.</div> : null}
        </div>
        <footer><span><ShieldCheck />dashboard-overview-01 · Live Demo</span><span>{visibleEmployees.length} visible rows · Proof boundary explicit</span></footer>
      </section>
    </>
  )
}

export function HeroDashboardPage({ dashboardId }: { dashboardId: DashboardId }) {
  const navigate = useNavigate()
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale())
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    applyPreferences(locale, theme)
    document.title = `${dashboardId === "default" ? "Dashboard overview" : localize(dashboards.find((item) => item.id === dashboardId)?.title ?? dashboards[0].title, locale)} — Agenic`
  }, [dashboardId, locale, theme])

  const openRecipe = (id: DashboardId) => {
    setNavOpen(false)
    void navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: id } })
  }

  return (
    <main className="aligned-dashboard">
      <aside className={`aligned-sidebar ${navOpen ? "is-open" : ""}`}>
        <button className="aligned-profile" type="button" onClick={() => void navigate({ to: "/" })}><AgenicMark /><div><strong>Alex Bennett</strong><span>Agent operator</span></div></button>
        <nav aria-label="Dashboard navigation">
          <Button variant={dashboardId === "default" ? "primary" : "ghost"} onPress={() => openRecipe("default")}><LayoutDashboard />Dashboard</Button>
          <Button variant="ghost"><ShoppingBag />Orders</Button>
          <Button variant="ghost"><ListChecks />Tracker<Chip size="sm" color="success">New</Chip></Button>
          <Button variant="ghost"><BarChart3 />Analytics</Button>
          <Button variant="ghost"><Settings />Settings</Button>
          <p>Next Recipes</p>
          {dashboards.filter((item) => item.id !== "default").slice(0, 2).map((item) => <Button key={item.id} variant={dashboardId === item.id ? "secondary" : "ghost"} onPress={() => openRecipe(item.id)}><Sparkles />{localize(item.title, locale)}<small>Soon</small></Button>)}
        </nav>
        <div className="aligned-sidebar-bottom"><Button variant="ghost"><CircleHelp />Help & information</Button><Button variant="ghost"><LogOut />Log out</Button><a href={__PUBLIC_REPOSITORY_URL__} target="_blank" rel="noreferrer"><Github />GitHub</a></div>
      </aside>

      <div className="aligned-shell">
        <header className="aligned-topbar">
          <div><Button isIconOnly variant="ghost" className="aligned-menu" aria-label="Open navigation" onPress={() => setNavOpen((value) => !value)}><Menu /></Button><span className="aligned-topbar-mark"><AgenicMark /></span><h1>{locale === "zh" ? "早上好，Alex" : "Good morning, Alex"}</h1></div>
          <div><Button isIconOnly variant="secondary" aria-label="Search"><Search /></Button><Button isIconOnly variant="secondary" aria-label="Notifications"><Bell /></Button><Button isIconOnly variant="ghost" aria-label="Toggle language" onPress={() => { const next = locale === "zh" ? "en" : "zh"; saveLocaleOverride(next); setLocale(next) }}><Languages /></Button><Button isIconOnly variant="ghost" aria-label="Toggle theme" onPress={() => { const next = theme === "light" ? "dark" : "light"; saveThemeOverride(next); setTheme(next) }}>{theme === "light" ? <Moon /> : <Sun />}</Button><Button variant="primary"><UserPlus />Invite</Button></div>
        </header>
        <div className="aligned-content">{dashboardId === "default" ? <Overview locale={locale} /> : <CandidateView dashboardId={dashboardId} locale={locale} />}</div>
      </div>
    </main>
  )
}
