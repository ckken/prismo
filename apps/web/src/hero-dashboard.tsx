import { useEffect, useMemo, useState } from "react"
import { Button, Card, Chip, ProgressBar } from "@heroui/react"
import {
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleDollarSign,
  Download,
  Github,
  Languages,
  LayoutDashboard,
  Menu,
  Moon,
  MoreHorizontal,
  Package2,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Users,
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { startOfDay, subDays } from "date-fns"
import { AgenicMark } from "./components/logo"
import {
  createDefaultDashboardDateRange,
  createMockDashboard,
  getRangePeriodLabel,
  type DashboardDateRange,
} from "./dashboard-mock-data"
import { dashboards, localize, type DashboardId } from "./dashboard-site-data"
import { applyPreferences, getInitialLocale, getInitialTheme, saveLocaleOverride, saveThemeOverride, type Theme } from "./preferences"
import type { Locale } from "./i18n"
import "./hero-dashboard.css"

const periods = [7, 28, 90] as const
const activity = [
  { initials: "AL", name: "Atlas Labs", detail: "Upgraded to Scale", value: "+$4,800", tone: "violet" },
  { initials: "NR", name: "Northstar", detail: "Annual renewal", value: "+$3,200", tone: "blue" },
  { initials: "SC", name: "Sora Cloud", detail: "New workspace", value: "+$2,640", tone: "amber" },
  { initials: "VM", name: "Vertex Media", detail: "Added 12 seats", value: "+$1,920", tone: "green" },
]

function rangeFor(days: number): DashboardDateRange {
  const to = startOfDay(new Date())
  return { from: subDays(to, days - 1), to }
}

function AreaChart({ values }: { values: number[] }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * 720
    const y = 205 - ((value - min) / Math.max(max - min, 1)) * 150
    return [x, y]
  })
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ")
  const area = `${line} L720 230 L0 230 Z`

  return (
    <svg className="hero-overview-chart" viewBox="0 0 720 230" preserveAspectRatio="none" role="img" aria-label="Revenue over time">
      <defs><linearGradient id="overview-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".22" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
      {[55, 105, 155, 205].map((y) => <line key={y} x1="0" x2="720" y1={y} y2={y} />)}
      <path className="hero-overview-area" d={area} />
      <path className="hero-overview-line" d={line} />
      <circle cx={points.at(-1)?.[0]} cy={points.at(-1)?.[1]} r="5" />
    </svg>
  )
}

function CandidateView({ dashboardId, locale }: { dashboardId: DashboardId; locale: Locale }) {
  const navigate = useNavigate()
  const recipe = dashboards.find((item) => item.id === dashboardId) ?? dashboards[1]
  return (
    <section className="hero-candidate">
      <div className="hero-candidate-orb"><Sparkles /></div>
      <Chip size="sm" variant="soft">{locale === "zh" ? "候选 Recipe" : "Candidate Recipe"}</Chip>
      <h1>{localize(recipe.title, locale)}</h1>
      <p>{locale === "zh" ? "我们先把 dashboard-overview-01 做到精品，再逐个扩展业务 Recipe。当前页面仅保留方向，不展示伪完成的交付。" : "We are polishing dashboard-overview-01 first, then expanding one business Recipe at a time. This direction is intentionally not presented as completed delivery."}</p>
      <div><Button variant="primary" onPress={() => void navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: "default" } })}>Open the Available Recipe</Button><Button variant="secondary" onPress={() => void navigate({ to: "/catalog" })}>View catalog</Button></div>
    </section>
  )
}

function Overview({ locale, dateRange, setDateRange }: { locale: Locale; dateRange: DashboardDateRange; setDateRange: (range: DashboardDateRange) => void }) {
  const dashboard = useMemo(() => createMockDashboard("default", dateRange), [dateRange])
  return (
    <>
      <header className="hero-overview-heading">
        <div><p>{locale === "zh" ? "2026 年 7 月 29 日，星期三" : "Wednesday, July 29, 2026"}</p><h1>{locale === "zh" ? "早上好，Alex。" : "Good morning, Alex."}</h1><span>{locale === "zh" ? "这里是今天最值得关注的业务信号。" : "Here are the signals worth your attention today."}</span></div>
        <div className="hero-overview-actions"><Button variant="secondary"><Download />{locale === "zh" ? "导出" : "Export"}</Button><Button variant="primary">{locale === "zh" ? "查看报告" : "View report"}<ArrowUpRight /></Button></div>
      </header>

      <section className="hero-overview-metrics" aria-label="Key metrics">
        {dashboard.metrics.map((metric, index) => (
          <Card key={localize(metric.label, "en")} className={index === 0 ? "is-featured" : ""}>
            <Card.Content>
              <div className="hero-metric-top"><span>{localize(metric.label, locale)}</span><div>{index === 0 ? <CircleDollarSign /> : index === 1 ? <Users /> : index === 2 ? <ShoppingBag /> : <Package2 />}</div></div>
              <strong>{metric.value}</strong>
              <small><b>{metric.delta}</b> {locale === "zh" ? "较上期" : "from last period"}</small>
            </Card.Content>
          </Card>
        ))}
      </section>

      <section className="hero-overview-primary-grid">
        <Card className="hero-overview-revenue">
          <Card.Header>
            <div><Card.Title>{locale === "zh" ? "收入概览" : "Revenue overview"}</Card.Title><Card.Description>{locale === "zh" ? "净收入与目标进度" : "Net revenue and target progress"}</Card.Description></div>
            <div className="hero-periods">{periods.map((days) => <Button key={days} size="sm" variant={getRangePeriodLabel(dateRange) === `${days}D` ? "primary" : "ghost"} onPress={() => setDateRange(rangeFor(days))}>{days}D</Button>)}</div>
          </Card.Header>
          <Card.Content>
            <div className="hero-revenue-total"><strong>$124,860</strong><Chip size="sm" color="success" variant="soft">+12.4%</Chip></div>
            <AreaChart values={dashboard.chart.primary} />
            <div className="hero-chart-axis"><span>May 05</span><span>May 26</span><span>Jun 16</span><span>Jul 07</span><span>Jul 29</span></div>
          </Card.Content>
        </Card>

        <Card className="hero-overview-goal">
          <Card.Header><div><Card.Title>{locale === "zh" ? "月度目标" : "Monthly goal"}</Card.Title><Card.Description>{locale === "zh" ? "7 月进度" : "July progress"}</Card.Description></div><Button isIconOnly variant="ghost" aria-label="More"><MoreHorizontal /></Button></Card.Header>
          <Card.Content>
            <div className="hero-goal-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" /><circle className="is-value" cx="60" cy="60" r="50" pathLength="100" /></svg><div><strong>82%</strong><span>{locale === "zh" ? "已完成" : "completed"}</span></div></div>
            <div className="hero-goal-copy"><strong>$164,200 <span>/ $200,000</span></strong><p>{locale === "zh" ? "保持当前速度，预计提前 3 天达成目标。" : "At this pace, you are projected to reach the goal 3 days early."}</p></div>
            <ProgressBar aria-label="Monthly goal progress" value={82} />
          </Card.Content>
        </Card>
      </section>

      <section className="hero-overview-secondary-grid">
        <Card className="hero-overview-activity">
          <Card.Header><div><Card.Title>{locale === "zh" ? "近期活动" : "Recent activity"}</Card.Title><Card.Description>{locale === "zh" ? "最近产生收入的客户动作" : "Customer actions that generated revenue"}</Card.Description></div><Button size="sm" variant="ghost">{locale === "zh" ? "查看全部" : "View all"}</Button></Card.Header>
          <Card.Content>{activity.map((item) => <div className="hero-activity-row" key={item.name}><span className={`hero-avatar is-${item.tone}`}>{item.initials}</span><div><strong>{item.name}</strong><small>{item.detail}</small></div><b>{item.value}</b><span>2h</span></div>)}</Card.Content>
        </Card>
        <Card className="hero-overview-proof">
          <Card.Header><div><Card.Title>{locale === "zh" ? "交付可信度" : "Delivery confidence"}</Card.Title><Card.Description>dashboard-overview-01</Card.Description></div><ShieldCheck /></Card.Header>
          <Card.Content>
            {[["DashboardSpec", "passed"], ["Data Adapter", "mapped"], ["Route evidence", "live"]].map(([label, state]) => <div key={label}><span><Check />{label}</span><Chip size="sm" color="success" variant="soft">{state}</Chip></div>)}
            <p>{locale === "zh" ? "这是 Live Demo 的证据状态；安装型 HeroUI Renderer 仍需独立通过 apply / verify。" : "This is Live Demo evidence. The installable HeroUI Renderer still requires its own apply / verify pass."}</p>
          </Card.Content>
        </Card>
      </section>
    </>
  )
}

export function HeroDashboardPage({ dashboardId }: { dashboardId: DashboardId }) {
  const navigate = useNavigate()
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale())
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const [dateRange, setDateRange] = useState<DashboardDateRange>(() => createDefaultDashboardDateRange())
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
    <main className="hero-dashboard">
      <aside className={`hero-dashboard-sidebar ${navOpen ? "is-open" : ""}`}>
        <button className="hero-dashboard-brand" type="button" onClick={() => void navigate({ to: "/" })}><AgenicMark /><span>Agenic</span></button>
        <div className="hero-dashboard-workspace"><span>AC</span><div><strong>Acme Inc.</strong><small>Product workspace</small></div><ChevronDown /></div>
        <nav className="hero-dashboard-nav" aria-label="Dashboard navigation">
          <p>{locale === "zh" ? "工作区" : "Workspace"}</p>
          <Button variant={dashboardId === "default" ? "primary" : "ghost"} onPress={() => openRecipe("default")}><LayoutDashboard /><span>{locale === "zh" ? "概览" : "Overview"}</span></Button>
          <Button variant="ghost"><Users /><span>{locale === "zh" ? "客户" : "Customers"}</span><Chip size="sm">1,284</Chip></Button>
          <Button variant="ghost"><ShoppingBag /><span>{locale === "zh" ? "订单" : "Orders"}</span></Button>
          <p>{locale === "zh" ? "后续 Recipe" : "Next Recipes"}</p>
          {dashboards.filter((item) => item.id !== "default").slice(0, 3).map((item) => <Button key={item.id} variant={dashboardId === item.id ? "secondary" : "ghost"} onPress={() => openRecipe(item.id)}><Sparkles /><span>{localize(item.title, locale)}</span><small>Soon</small></Button>)}
        </nav>
        <div className="hero-dashboard-sidebar-bottom"><Button variant="ghost" onPress={() => void navigate({ to: "/catalog" })}><Package2 />Recipes</Button><Button variant="ghost"><Settings2 />Settings</Button><a href={__PUBLIC_REPOSITORY_URL__} target="_blank" rel="noreferrer"><Github />GitHub</a></div>
      </aside>

      <div className="hero-dashboard-main">
        <header className="hero-dashboard-topbar">
          <div><Button isIconOnly variant="ghost" className="hero-dashboard-menu" aria-label="Open navigation" onPress={() => setNavOpen((open) => !open)}><Menu /></Button><div className="hero-dashboard-search"><Search /><span>{locale === "zh" ? "搜索…" : "Search anything…"}</span><kbd>⌘ K</kbd></div></div>
          <div className="hero-dashboard-top-actions"><Button isIconOnly variant="ghost" aria-label="Notifications"><Bell /></Button><Button isIconOnly variant="ghost" aria-label="Toggle language" onPress={() => { const next = locale === "zh" ? "en" : "zh"; saveLocaleOverride(next); setLocale(next) }}><Languages /></Button><Button isIconOnly variant="ghost" aria-label="Toggle theme" onPress={() => { const next = theme === "light" ? "dark" : "light"; saveThemeOverride(next); setTheme(next) }}>{theme === "light" ? <Moon /> : <Sun />}</Button><span className="hero-dashboard-user">AB</span></div>
        </header>
        <div className="hero-dashboard-content">{dashboardId === "default" ? <Overview locale={locale} dateRange={dateRange} setDateRange={setDateRange} /> : <CandidateView dashboardId={dashboardId} locale={locale} />}</div>
      </div>
    </main>
  )
}
