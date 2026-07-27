import { useEffect, useMemo, useRef, useState } from "react"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clipboard,
  Code2,
  Command,
  ExternalLink,
  FileCheck2,
  Github,
  Languages,
  LayoutDashboard,
  Menu,
  Moon,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react"
import { LogoMark } from "./components/logo"
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

type DashboardId = "overview" | "sales" | "commerce" | "agent-ops" | "crm" | "finance"
type DashboardCategory = "all" | "available" | "business" | "operations"

type DashboardRecipe = {
  id: DashboardId
  recipeId: string
  status: "available" | "candidate"
  category: Exclude<DashboardCategory, "all" | "available">
  icon: LucideIcon
  tone: "slate" | "blue" | "amber" | "violet" | "emerald" | "rose"
  title: string
  summary: string
  useCase: string
  modules: string[]
  metrics: Array<{ label: string; value: string; delta: string }>
  bars: number[]
  activity: Array<{ label: string; value: string }>
}

type HomeText = {
  meta: { title: string; description: string }
  navigation: {
    overview: string
    catalog: string
    workflow: string
    playground: string
    groups: { product: string; resources: string }
    search: string
    searchPlaceholder: string
    openMenu: string
    closeMenu: string
    theme: string
    language: string
  }
  hero: {
    eyebrow: string
    title: string
    description: string
    primary: string
    secondary: string
    note: string
  }
  stats: Array<{ label: string; value: string; detail: string }>
  catalog: {
    eyebrow: string
    title: string
    description: string
    filters: Record<DashboardCategory, string>
    empty: string
    functionCombination: string
    useCase: string
    viewDetails: string
  }
  detail: {
    eyebrow: string
    functionCombination: string
    preview: string
    available: string
    candidate: string
    availableNote: string
    candidateNote: string
    openPlayground: string
    copyInstall: string
    copied: string
    dryRun: string
  }
  workflow: {
    eyebrow: string
    title: string
    description: string
    steps: Array<{ title: string; description: string }>
  }
  footer: {
    description: string
    disclaimer: string
    source: string
    registry: string
  }
  recipes: DashboardRecipe[]
}

const content: Record<Locale, HomeText> = {
  zh: {
    meta: {
      title: "Shadcn Agent Kit — 按功能组合选择 Dashboard",
      description: "为 Coding Agent 提供可选择、可安装、可接数据、可验证的 Dashboard Recipe。",
    },
    navigation: {
      overview: "总览",
      catalog: "Dashboard 目录",
      workflow: "交付流程",
      playground: "Playground",
      groups: { product: "产品", resources: "资源" },
      search: "搜索 Dashboard",
      searchPlaceholder: "搜索场景或功能…",
      openMenu: "打开导航",
      closeMenu: "关闭导航",
      theme: "切换主题",
      language: "Switch to English",
    },
    hero: {
      eyebrow: "Dashboard Recipe Catalog",
      title: "按功能组合选择 Dashboard",
      description:
        "不再从一张截图开始拼页面。先选业务场景与功能组合，再由 Coding Agent 安装可编辑源码、接入真实数据并完成验证。",
      primary: "浏览 Dashboard",
      secondary: "打开 Playground",
      note: "React 19 · Rsbuild · TanStack · Tailwind CSS 4 · shadcn-compatible",
    },
    stats: [
      { label: "Dashboard 组合", value: "06", detail: "覆盖核心业务场景" },
      { label: "可安装 Recipe", value: "01", detail: "其余保持候选状态" },
      { label: "运行时状态", value: "04", detail: "成功、加载、空态、契约错误" },
      { label: "响应式断点", value: "03", detail: "375 / 768 / 1440" },
    ],
    catalog: {
      eyebrow: "Dashboard Catalog",
      title: "每个 Dashboard 都是一组明确的能力",
      description: "对比功能组合、适用场景与交付状态，选择最接近真实需求的起点。",
      filters: { all: "全部", available: "可安装", business: "业务增长", operations: "运营管理" },
      empty: "没有匹配的 Dashboard，请换一个关键词。",
      functionCombination: "功能组合",
      useCase: "适用",
      viewDetails: "查看组合",
    },
    detail: {
      eyebrow: "Selected Dashboard",
      functionCombination: "功能组合",
      preview: "确定性预览",
      available: "Available",
      candidate: "Candidate",
      availableNote: "已通过 Registry、类型、构建、四态与响应式门禁，可 dry-run 安装。",
      candidateNote: "用于确认场景与能力边界；转为 Available 前不提供安装命令。",
      openPlayground: "在 Playground 中检查",
      copyInstall: "复制 dry-run",
      copied: "已复制",
      dryRun: "只读安装计划",
    },
    workflow: {
      eyebrow: "Agent Delivery Rail",
      title: "从需求到证据，一条可检查的交付链",
      description: "Agent 负责判断，Recipe Kit 固化容易出错的选择、安装、数据边界和验收步骤。",
      steps: [
        { title: "Understand", description: "识别项目技术栈、业务目标和表格复杂度。" },
        { title: "Match", description: "只从 Available Recipe 中选择，候选项只解释不安装。" },
        { title: "Install", description: "先生成 dry-run 文件计划，再写入可编辑源码。" },
        { title: "Bind", description: "用单一 Data Adapter 映射项目字段和远端状态。" },
        { title: "Prove", description: "验证类型、构建、四态、响应式与可访问性。" },
      ],
    },
    footer: {
      description: "给 Coding Agent 使用的 shadcn-compatible Dashboard Recipe Kit。",
      disclaimer: "独立社区项目，与 shadcn 官方无隶属关系。",
      source: "查看源码",
      registry: "Registry JSON",
    },
    recipes: [
      {
        id: "overview",
        recipeId: "dashboard-overview-01",
        status: "available",
        category: "operations",
        icon: LayoutDashboard,
        tone: "slate",
        title: "通用经营总览",
        summary: "用一屏建立业务健康度、趋势和待处理事项的共同视图。",
        useCase: "经营驾驶舱、团队周报、业务总览",
        modules: ["KPI 概览", "趋势分析", "运营表格", "数据契约", "四态处理"],
        metrics: [
          { label: "总收入", value: "¥452k", delta: "+20.1%" },
          { label: "活跃客户", value: "2,350", delta: "+18.0%" },
          { label: "转化率", value: "12.2%", delta: "+1.9%" },
        ],
        bars: [38, 51, 43, 67, 58, 74, 69, 86, 78, 92, 84, 96],
        activity: [
          { label: "华东增长计划", value: "¥86k" },
          { label: "企业续约", value: "¥64k" },
          { label: "渠道升级", value: "¥48k" },
        ],
      },
      {
        id: "sales",
        recipeId: "sales-command-center",
        status: "candidate",
        category: "business",
        icon: BarChart3,
        tone: "blue",
        title: "销售指挥中心",
        summary: "把目标、趋势、团队表现和客户推进集中到一个销售工作台。",
        useCase: "销售例会、目标追踪、Pipeline 管理",
        modules: ["目标进度", "销售趋势", "团队排名", "客户表格", "阶段筛选"],
        metrics: [
          { label: "本月收入", value: "$184k", delta: "+12.4%" },
          { label: "Pipeline", value: "$612k", delta: "+18.7%" },
          { label: "成交率", value: "31.8%", delta: "+2.1%" },
        ],
        bars: [28, 42, 36, 54, 49, 64, 58, 76, 71, 88, 82, 94],
        activity: [
          { label: "Northstar Labs", value: "$86k" },
          { label: "Atlas Retail", value: "$52k" },
          { label: "Vertex Health", value: "$44k" },
        ],
      },
      {
        id: "commerce",
        recipeId: "commerce-operations",
        status: "candidate",
        category: "business",
        icon: ShoppingBag,
        tone: "amber",
        title: "电商运营中心",
        summary: "同时观察交易结果、渠道结构、商品表现和订单执行。",
        useCase: "电商日常运营、活动复盘、订单管理",
        modules: ["GMV 与转化", "渠道结构", "商品表现", "订单表格", "批量操作"],
        metrics: [
          { label: "GMV", value: "¥928k", delta: "+8.9%" },
          { label: "订单", value: "3,248", delta: "+6.2%" },
          { label: "转化率", value: "4.8%", delta: "+0.7%" },
        ],
        bars: [34, 41, 38, 55, 48, 61, 68, 63, 79, 84, 77, 91],
        activity: [
          { label: "工作室台灯", value: "¥128k" },
          { label: "旅行背包", value: "¥96k" },
          { label: "桌面系统", value: "¥82k" },
        ],
      },
      {
        id: "agent-ops",
        recipeId: "agent-operations",
        status: "candidate",
        category: "operations",
        icon: Activity,
        tone: "violet",
        title: "Agent 运行中心",
        summary: "把调用规模、成本、延迟和失败原因放进同一套运行视图。",
        useCase: "AI 产品运维、模型治理、成本优化",
        modules: ["请求与成本", "P95 延迟", "错误代码", "模型分布", "运行追踪"],
        metrics: [
          { label: "请求量", value: "1.24m", delta: "+18.2%" },
          { label: "成本", value: "$6.8k", delta: "-5.3%" },
          { label: "P95 延迟", value: "1.8s", delta: "-210ms" },
        ],
        bars: [49, 58, 54, 67, 61, 78, 72, 85, 81, 93, 88, 98],
        activity: [
          { label: "gpt-5.6", value: "742k" },
          { label: "gpt-5.6-terra", value: "318k" },
          { label: "gpt-5.3-spark", value: "180k" },
        ],
      },
      {
        id: "crm",
        recipeId: "crm-workspace",
        status: "candidate",
        category: "operations",
        icon: Users,
        tone: "emerald",
        title: "CRM 客户工作台",
        summary: "围绕客户阶段组织跟进、任务和下一步行动。",
        useCase: "客户成功、商机跟进、续约管理",
        modules: ["客户分层", "阶段看板", "跟进任务", "客户台账", "负责人筛选"],
        metrics: [
          { label: "活跃客户", value: "842", delta: "+7.4%" },
          { label: "待跟进", value: "126", delta: "-12.0%" },
          { label: "续约率", value: "92.4%", delta: "+3.6%" },
        ],
        bars: [62, 57, 66, 64, 72, 69, 78, 75, 84, 81, 89, 94],
        activity: [
          { label: "企业客户", value: "286" },
          { label: "成长客户", value: "348" },
          { label: "新客户", value: "208" },
        ],
      },
      {
        id: "finance",
        recipeId: "finance-review",
        status: "candidate",
        category: "operations",
        icon: CircleDollarSign,
        tone: "rose",
        title: "财务复盘中心",
        summary: "把现金流、预算偏差、异常项目和对账动作放到一处。",
        useCase: "月度复盘、预算管理、财务对账",
        modules: ["现金流", "预算偏差", "异常检测", "对账表格", "审批状态"],
        metrics: [
          { label: "净现金流", value: "¥318k", delta: "+6.8%" },
          { label: "预算使用", value: "78.2%", delta: "+2.4%" },
          { label: "待对账", value: "24", delta: "-18.0%" },
        ],
        bars: [44, 52, 49, 61, 57, 69, 64, 72, 78, 75, 86, 82],
        activity: [
          { label: "市场预算", value: "78%" },
          { label: "研发预算", value: "64%" },
          { label: "运营预算", value: "82%" },
        ],
      },
    ],
  },
  en: {
    meta: {
      title: "Shadcn Agent Kit — Choose dashboards by capability",
      description: "Selectable, installable, data-ready, and verifiable dashboard recipes for coding agents.",
    },
    navigation: {
      overview: "Overview",
      catalog: "Dashboard catalog",
      workflow: "Delivery rail",
      playground: "Playground",
      groups: { product: "Product", resources: "Resources" },
      search: "Search dashboards",
      searchPlaceholder: "Search scenarios or capabilities…",
      openMenu: "Open navigation",
      closeMenu: "Close navigation",
      theme: "Toggle theme",
      language: "切换为中文",
    },
    hero: {
      eyebrow: "Dashboard Recipe Catalog",
      title: "Choose a dashboard by capability",
      description:
        "Stop rebuilding from a screenshot. Pick a business scenario and capability set, then let your coding agent install editable source, connect real data, and prove the result.",
      primary: "Browse dashboards",
      secondary: "Open Playground",
      note: "React 19 · Rsbuild · TanStack · Tailwind CSS 4 · shadcn-compatible",
    },
    stats: [
      { label: "Dashboard sets", value: "06", detail: "Core business scenarios" },
      { label: "Installable recipe", value: "01", detail: "Others stay candidates" },
      { label: "Runtime states", value: "04", detail: "Success, loading, empty, contract error" },
      { label: "Breakpoints", value: "03", detail: "375 / 768 / 1440" },
    ],
    catalog: {
      eyebrow: "Dashboard Catalog",
      title: "Each dashboard is a defined capability set",
      description: "Compare capabilities, fit, and delivery status before choosing the closest starting point.",
      filters: { all: "All", available: "Installable", business: "Growth", operations: "Operations" },
      empty: "No dashboard matches this search. Try another term.",
      functionCombination: "Capability set",
      useCase: "Best for",
      viewDetails: "View set",
    },
    detail: {
      eyebrow: "Selected Dashboard",
      functionCombination: "Capability set",
      preview: "Deterministic preview",
      available: "Available",
      candidate: "Candidate",
      availableNote: "Registry, type, build, four-state, and responsive gates are complete. Ready for dry-run.",
      candidateNote: "Use this to confirm scope. No install command is shown until the recipe becomes Available.",
      openPlayground: "Inspect in Playground",
      copyInstall: "Copy dry-run",
      copied: "Copied",
      dryRun: "Read-only install plan",
    },
    workflow: {
      eyebrow: "Agent Delivery Rail",
      title: "One inspectable path from request to proof",
      description: "The agent makes the judgment. The kit stabilizes selection, installation, data boundaries, and proof.",
      steps: [
        { title: "Understand", description: "Identify the project stack, business goal, and table complexity." },
        { title: "Match", description: "Choose Available recipes only; explain candidates without installing." },
        { title: "Install", description: "Produce a dry-run file plan before writing editable source." },
        { title: "Bind", description: "Map project fields and remote state through one Data Adapter." },
        { title: "Prove", description: "Verify type, build, four states, responsive behavior, and a11y." },
      ],
    },
    footer: {
      description: "A shadcn-compatible Dashboard Recipe Kit for coding agents.",
      disclaimer: "Independent community project. Not affiliated with shadcn.",
      source: "Source",
      registry: "Registry JSON",
    },
    recipes: [
      {
        id: "overview",
        recipeId: "dashboard-overview-01",
        status: "available",
        category: "operations",
        icon: LayoutDashboard,
        tone: "slate",
        title: "Business overview",
        summary: "A shared view of business health, trends, and work that needs attention.",
        useCase: "Executive overview, weekly review, operating dashboard",
        modules: ["KPI overview", "Trend analysis", "Operations table", "Data contract", "Four states"],
        metrics: [
          { label: "Revenue", value: "$452k", delta: "+20.1%" },
          { label: "Customers", value: "2,350", delta: "+18.0%" },
          { label: "Conversion", value: "12.2%", delta: "+1.9%" },
        ],
        bars: [38, 51, 43, 67, 58, 74, 69, 86, 78, 92, 84, 96],
        activity: [
          { label: "East growth plan", value: "$86k" },
          { label: "Enterprise renewal", value: "$64k" },
          { label: "Channel upgrade", value: "$48k" },
        ],
      },
      {
        id: "sales",
        recipeId: "sales-command-center",
        status: "candidate",
        category: "business",
        icon: BarChart3,
        tone: "blue",
        title: "Sales command center",
        summary: "Targets, trends, team performance, and account movement in one workspace.",
        useCase: "Sales reviews, quota tracking, pipeline management",
        modules: ["Target progress", "Sales trend", "Team ranking", "Accounts table", "Stage filters"],
        metrics: [
          { label: "Revenue", value: "$184k", delta: "+12.4%" },
          { label: "Pipeline", value: "$612k", delta: "+18.7%" },
          { label: "Win rate", value: "31.8%", delta: "+2.1%" },
        ],
        bars: [28, 42, 36, 54, 49, 64, 58, 76, 71, 88, 82, 94],
        activity: [
          { label: "Northstar Labs", value: "$86k" },
          { label: "Atlas Retail", value: "$52k" },
          { label: "Vertex Health", value: "$44k" },
        ],
      },
      {
        id: "commerce",
        recipeId: "commerce-operations",
        status: "candidate",
        category: "business",
        icon: ShoppingBag,
        tone: "amber",
        title: "Commerce operations",
        summary: "Transaction results, channel mix, product performance, and order execution.",
        useCase: "Daily operations, campaign review, order management",
        modules: ["GMV & conversion", "Channel mix", "Product performance", "Orders table", "Bulk actions"],
        metrics: [
          { label: "GMV", value: "$928k", delta: "+8.9%" },
          { label: "Orders", value: "3,248", delta: "+6.2%" },
          { label: "Conversion", value: "4.8%", delta: "+0.7%" },
        ],
        bars: [34, 41, 38, 55, 48, 61, 68, 63, 79, 84, 77, 91],
        activity: [
          { label: "Studio lamp", value: "$128k" },
          { label: "Travel pack", value: "$96k" },
          { label: "Desk system", value: "$82k" },
        ],
      },
      {
        id: "agent-ops",
        recipeId: "agent-operations",
        status: "candidate",
        category: "operations",
        icon: Activity,
        tone: "violet",
        title: "Agent operations",
        summary: "Request volume, cost, latency, and failure reasons in one runtime view.",
        useCase: "AI product operations, model governance, cost control",
        modules: ["Requests & cost", "P95 latency", "Error codes", "Model mix", "Runtime traces"],
        metrics: [
          { label: "Requests", value: "1.24m", delta: "+18.2%" },
          { label: "Cost", value: "$6.8k", delta: "-5.3%" },
          { label: "P95 latency", value: "1.8s", delta: "-210ms" },
        ],
        bars: [49, 58, 54, 67, 61, 78, 72, 85, 81, 93, 88, 98],
        activity: [
          { label: "gpt-5.6", value: "742k" },
          { label: "gpt-5.6-terra", value: "318k" },
          { label: "gpt-5.3-spark", value: "180k" },
        ],
      },
      {
        id: "crm",
        recipeId: "crm-workspace",
        status: "candidate",
        category: "operations",
        icon: Users,
        tone: "emerald",
        title: "CRM workspace",
        summary: "Organize follow-ups, tasks, and next actions around customer stages.",
        useCase: "Customer success, opportunity follow-up, renewals",
        modules: ["Customer tiers", "Stage board", "Follow-up tasks", "Customer ledger", "Owner filters"],
        metrics: [
          { label: "Active accounts", value: "842", delta: "+7.4%" },
          { label: "Follow-ups", value: "126", delta: "-12.0%" },
          { label: "Renewal", value: "92.4%", delta: "+3.6%" },
        ],
        bars: [62, 57, 66, 64, 72, 69, 78, 75, 84, 81, 89, 94],
        activity: [
          { label: "Enterprise", value: "286" },
          { label: "Growth", value: "348" },
          { label: "New", value: "208" },
        ],
      },
      {
        id: "finance",
        recipeId: "finance-review",
        status: "candidate",
        category: "operations",
        icon: CircleDollarSign,
        tone: "rose",
        title: "Finance review",
        summary: "Cash flow, budget variance, anomalies, and reconciliation actions together.",
        useCase: "Monthly review, budget control, reconciliation",
        modules: ["Cash flow", "Budget variance", "Anomaly detection", "Reconciliation", "Approval state"],
        metrics: [
          { label: "Net cash flow", value: "$318k", delta: "+6.8%" },
          { label: "Budget used", value: "78.2%", delta: "+2.4%" },
          { label: "To reconcile", value: "24", delta: "-18.0%" },
        ],
        bars: [44, 52, 49, 61, 57, 69, 64, 72, 78, 75, 86, 82],
        activity: [
          { label: "Marketing", value: "78%" },
          { label: "Engineering", value: "64%" },
          { label: "Operations", value: "82%" },
        ],
      },
    ],
  },
}

function DashboardPreview({ recipe, previewLabel }: { recipe: DashboardRecipe; previewLabel: string }) {
  const Icon = recipe.icon
  return (
    <div className={`home-preview tone-${recipe.tone}`} aria-label={`${recipe.title} · ${previewLabel}`}>
      <aside className="home-preview-sidebar" aria-hidden="true">
        <span className="home-preview-logo"><Icon size={13} /></span>
        {[0, 1, 2, 3, 4].map((item) => <span className={item === 0 ? "active" : ""} key={item} />)}
      </aside>
      <div className="home-preview-main">
        <div className="home-preview-toolbar">
          <span />
          <div><i /><i /><i /></div>
        </div>
        <div className="home-preview-content">
          <div className="home-preview-heading">
            <div><strong>{recipe.title}</strong><span>{recipe.recipeId}</span></div>
            <i />
          </div>
          <div className="home-preview-metrics">
            {recipe.metrics.map((metric) => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.delta}</small>
              </div>
            ))}
          </div>
          <div className="home-preview-detail">
            <div className="home-preview-chart">
              <div className="home-preview-card-heading"><strong>{recipe.modules[1]}</strong><span>12M</span></div>
              <div className="home-preview-bars">
                {recipe.bars.map((height, index) => <i style={{ height: `${height}%` }} key={`${height}-${index}`} />)}
              </div>
            </div>
            <div className="home-preview-list">
              <div className="home-preview-card-heading"><strong>{recipe.modules[2]}</strong><span>•••</span></div>
              {recipe.activity.map((item, index) => (
                <div key={item.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <small>{item.value}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function App() {
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale())
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const [mobileOpen, setMobileOpen] = useState(false)
  const [filter, setFilter] = useState<DashboardCategory>("all")
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<DashboardId>("overview")
  const [copied, setCopied] = useState(false)
  const [compactNavigation, setCompactNavigation] = useState(() => window.matchMedia("(max-width: 860px)").matches)
  const searchRef = useRef<HTMLInputElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const sidebarCloseRef = useRef<HTMLButtonElement>(null)
  const t = content[locale]
  const repositoryUrl = __PUBLIC_REPOSITORY_URL__
  const registryUrl = useMemo(() => {
    if (typeof window === "undefined") return joinBase("r/dashboard-overview-01.json")
    return `${window.location.origin}${joinBase("r/dashboard-overview-01.json")}`
  }, [])
  const installCommand = `bunx --bun shadcn@4.14.1 add ${registryUrl} --dry-run`

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return t.recipes.filter((recipe) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "available" && recipe.status === "available") ||
        recipe.category === filter
      if (!matchesFilter) return false
      if (!normalizedQuery) return true
      return [recipe.title, recipe.recipeId, recipe.summary, recipe.useCase, ...recipe.modules]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    })
  }, [filter, query, t.recipes])

  const selectedRecipe = t.recipes.find((recipe) => recipe.id === selectedId) ?? t.recipes[0]

  useEffect(() => {
    applyPreferences(locale, theme)
    document.title = t.meta.title
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", t.meta.description)
  }, [locale, t.meta.description, t.meta.title, theme])

  useEffect(() => {
    const handleLanguageChange = () => {
      if (!getLocaleOverride()) setLocale(getSystemLocale())
    }
    window.addEventListener("languagechange", handleLanguageChange)
    return () => window.removeEventListener("languagechange", handleLanguageChange)
  }, [])

  useEffect(() => {
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")
    const handleColorSchemeChange = () => {
      if (!getThemeOverride()) setTheme(getSystemTheme())
    }
    colorScheme.addEventListener("change", handleColorSchemeChange)
    return () => colorScheme.removeEventListener("change", handleColorSchemeChange)
  }, [])

  useEffect(() => {
    const compactLayout = window.matchMedia("(max-width: 860px)")
    const handleLayoutChange = () => {
      setCompactNavigation(compactLayout.matches)
      if (!compactLayout.matches) setMobileOpen(false)
    }
    handleLayoutChange()
    compactLayout.addEventListener("change", handleLayoutChange)
    return () => compactLayout.removeEventListener("change", handleLayoutChange)
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault()
        setMobileOpen(false)
        window.requestAnimationFrame(() => searchRef.current?.focus())
      }
    }
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  useEffect(() => {
    if (!compactNavigation || !mobileOpen) return
    const sidebar = sidebarRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.requestAnimationFrame(() => sidebarCloseRef.current?.focus())

    const handleDrawerKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeMobileMenu()
        return
      }
      if (event.key !== "Tab" || !sidebar) return
      const focusable = Array.from(
        sidebar.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((element) => element.getClientRects().length > 0)
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

    window.addEventListener("keydown", handleDrawerKeys)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleDrawerKeys)
    }
  }, [compactNavigation, mobileOpen])

  function changeLocale() {
    const nextLocale = locale === "en" ? "zh" : "en"
    saveLocaleOverride(nextLocale)
    setLocale(nextLocale)
  }

  function changeTheme() {
    const nextTheme = theme === "light" ? "dark" : "light"
    saveThemeOverride(nextTheme)
    setTheme(nextTheme)
  }

  async function copyInstallCommand() {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  function selectRecipe(id: DashboardId) {
    setSelectedId(id)
    window.requestAnimationFrame(() => document.getElementById("dashboard-detail")?.scrollIntoView({ block: "start" }))
  }

  function openMobileMenu() {
    setMobileOpen(true)
  }

  function closeMobileMenu() {
    setMobileOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  const sidebar = (
    <aside
      ref={sidebarRef}
      className={`home-sidebar ${mobileOpen ? "open" : ""}`}
      aria-label={t.navigation.overview}
      aria-hidden={compactNavigation && !mobileOpen ? true : undefined}
      aria-modal={compactNavigation && mobileOpen ? true : undefined}
      role={compactNavigation ? "dialog" : undefined}
    >
      <div className="home-sidebar-brand">
        <a className="home-logo-link" href={joinBase("")} aria-label="Shadcn Agent Kit">
          <LogoMark />
        </a>
        <button ref={sidebarCloseRef} className="home-sidebar-close" type="button" onClick={closeMobileMenu} aria-label={t.navigation.closeMenu}>
          <X size={17} />
        </button>
      </div>
      <nav className="home-nav">
        <div>
          <span>{t.navigation.groups.product}</span>
          <a className="active" href="#overview" onClick={closeMobileMenu}><LayoutDashboard size={17} />{t.navigation.overview}</a>
          <a href="#catalog" onClick={closeMobileMenu}><Boxes size={17} />{t.navigation.catalog}<small>6</small></a>
          <a href="#workflow" onClick={closeMobileMenu}><Workflow size={17} />{t.navigation.workflow}</a>
        </div>
        <div>
          <span>{t.navigation.groups.resources}</span>
          <a href={joinBase("playground/")}><Code2 size={17} />{t.navigation.playground}<ExternalLink size={13} /></a>
          <a href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={17} />GitHub<ExternalLink size={13} /></a>
        </div>
      </nav>
      <div className="home-sidebar-proof">
        <span><ShieldCheck size={16} /></span>
        <div>
          <strong>From request to proof.</strong>
          <small>{t.hero.note}</small>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="home-shell">
      <div className="home-layout">
        {sidebar}
        {compactNavigation && mobileOpen ? <button className="home-sidebar-backdrop" type="button" onClick={closeMobileMenu} aria-label={t.navigation.closeMenu} /> : null}
        <main className="home-main">
          <header className="home-topbar">
            <div className="home-topbar-left">
              <button ref={menuButtonRef} className="home-menu-button" type="button" onClick={openMobileMenu} aria-label={t.navigation.openMenu}>
                <Menu size={18} />
              </button>
              <a className="active" href="#overview">{t.navigation.overview}</a>
              <a href="#catalog">{t.navigation.catalog}</a>
              <a href="#workflow">{t.navigation.workflow}</a>
            </div>
            <div className="home-topbar-actions">
              <label className="home-search">
                <Search size={15} />
                <span className="sr-only">{t.navigation.search}</span>
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  placeholder={t.navigation.searchPlaceholder}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <kbd>⌘ K</kbd>
              </label>
              <button type="button" onClick={changeLocale} aria-label={t.navigation.language} title={t.navigation.language}>
                <Languages size={17} />
              </button>
              <button type="button" onClick={changeTheme} aria-label={t.navigation.theme} title={t.navigation.theme}>
                {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
              </button>
              <a href={repositoryUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
            </div>
          </header>

          <div className="home-content">
            <section className="home-hero" id="overview">
              <div className="home-hero-copy">
                <span className="home-eyebrow"><Sparkles size={14} />{t.hero.eyebrow}</span>
                <h1>{t.hero.title}</h1>
                <p>{t.hero.description}</p>
                <div className="home-hero-actions">
                  <a className="home-button primary" href="#catalog">{t.hero.primary}<ArrowRight size={16} /></a>
                  <a className="home-button secondary" href={joinBase("playground/")}>{t.hero.secondary}<ExternalLink size={15} /></a>
                </div>
                <small className="home-stack-note"><Command size={13} />{t.hero.note}</small>
              </div>
              <DashboardPreview recipe={selectedRecipe} previewLabel={t.detail.preview} />
            </section>

            <section className="home-stats" aria-label="Product summary">
              {t.stats.map((stat, index) => {
                const icons = [Boxes, PackageCheck, FileCheck2, LayoutDashboard]
                const Icon = icons[index]
                return (
                  <article key={stat.label}>
                    <div><span>{stat.label}</span><Icon size={17} /></div>
                    <strong>{stat.value}</strong>
                    <small>{stat.detail}</small>
                  </article>
                )
              })}
            </section>

            <section className="home-section" id="catalog">
              <div className="home-section-heading">
                <div>
                  <span className="home-eyebrow">{t.catalog.eyebrow}</span>
                  <h2>{t.catalog.title}</h2>
                  <p>{t.catalog.description}</p>
                </div>
                <div className="home-filter" aria-label={t.catalog.title}>
                  {(Object.keys(t.catalog.filters) as DashboardCategory[]).map((item) => (
                    <button
                      className={filter === item ? "active" : ""}
                      type="button"
                      aria-pressed={filter === item}
                      onClick={() => setFilter(item)}
                      key={item}
                    >
                      {t.catalog.filters[item]}
                    </button>
                  ))}
                </div>
              </div>

              {filteredRecipes.length ? (
                <div className="home-recipe-grid">
                  {filteredRecipes.map((recipe) => {
                    const Icon = recipe.icon
                    return (
                      <article className={`home-recipe-card tone-${recipe.tone} ${selectedId === recipe.id ? "selected" : ""}`} key={recipe.id}>
                        <button className="home-recipe-select" type="button" onClick={() => selectRecipe(recipe.id)} aria-label={`${t.catalog.viewDetails}: ${recipe.title}`}>
                          <div className="home-recipe-head">
                            <span className="home-recipe-icon"><Icon size={19} /></span>
                            <span className={`home-status ${recipe.status}`}>
                              {recipe.status === "available" ? <CheckCircle2 size={12} /> : <span />}
                              {recipe.status === "available" ? t.detail.available : t.detail.candidate}
                            </span>
                          </div>
                          <div className="home-recipe-title">
                            <div><h3>{recipe.title}</h3><code>{recipe.recipeId}</code></div>
                            <ChevronRight size={17} />
                          </div>
                          <p>{recipe.summary}</p>
                          <div className="home-module-block">
                            <span>{t.catalog.functionCombination}</span>
                            <div>{recipe.modules.map((module) => <small key={module}>{module}</small>)}</div>
                          </div>
                          <div className="home-use-case"><span>{t.catalog.useCase}</span><strong>{recipe.useCase}</strong></div>
                        </button>
                      </article>
                    )
                  })}
                </div>
              ) : <div className="home-empty"><Search size={20} /><p>{t.catalog.empty}</p></div>}
            </section>

            <section className="home-detail" id="dashboard-detail">
              <div className="home-detail-preview">
                <div className="home-detail-bar">
                  <div><span className="home-eyebrow">{t.detail.eyebrow}</span><strong>{selectedRecipe.title}</strong></div>
                  <span>{t.detail.preview}</span>
                </div>
                <DashboardPreview recipe={selectedRecipe} previewLabel={t.detail.preview} />
              </div>
              <aside className="home-detail-info">
                <span className={`home-status ${selectedRecipe.status}`}>
                  {selectedRecipe.status === "available" ? <CheckCircle2 size={12} /> : <span />}
                  {selectedRecipe.status === "available" ? t.detail.available : t.detail.candidate}
                </span>
                <div>
                  <span className="home-eyebrow">{t.detail.functionCombination}</span>
                  <h2>{selectedRecipe.title}</h2>
                  <p>{selectedRecipe.summary}</p>
                </div>
                <ul>
                  {selectedRecipe.modules.map((module) => <li key={module}><Check size={15} />{module}</li>)}
                </ul>
                <div className={`home-delivery-note ${selectedRecipe.status}`}>
                  {selectedRecipe.status === "available" ? <PackageCheck size={18} /> : <ShieldCheck size={18} />}
                  <p>{selectedRecipe.status === "available" ? t.detail.availableNote : t.detail.candidateNote}</p>
                </div>
                <a
                  className="home-button secondary wide"
                  href={`${joinBase("playground/")}?block=${selectedRecipe.id === "overview" ? "dashboard-overview-01" : selectedRecipe.id}`}
                >
                  {t.detail.openPlayground}<ExternalLink size={15} />
                </a>
                {selectedRecipe.status === "available" ? (
                  <div className="home-command">
                    <span>{t.detail.dryRun}</span>
                    <code>{installCommand}</code>
                    <button type="button" onClick={copyInstallCommand}>
                      {copied ? <Check size={15} /> : <Clipboard size={15} />}
                      <span aria-live="polite">{copied ? t.detail.copied : t.detail.copyInstall}</span>
                    </button>
                  </div>
                ) : null}
              </aside>
            </section>

            <section className="home-workflow" id="workflow">
              <div className="home-section-heading">
                <div>
                  <span className="home-eyebrow">{t.workflow.eyebrow}</span>
                  <h2>{t.workflow.title}</h2>
                  <p>{t.workflow.description}</p>
                </div>
              </div>
              <ol>
                {t.workflow.steps.map((step, index) => (
                  <li key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{step.title}</strong><p>{step.description}</p></div>
                    {index < t.workflow.steps.length - 1 ? <ChevronRight size={16} /> : <FileCheck2 size={16} />}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <footer className="home-footer">
            <div><LogoMark /><p>{t.footer.description}</p><small>{t.footer.disclaimer}</small></div>
            <nav>
              <a href={repositoryUrl} target="_blank" rel="noreferrer">{t.footer.source}<ExternalLink size={13} /></a>
              <a href={joinBase("r/dashboard-overview-01.json")} target="_blank" rel="noreferrer">{t.footer.registry}<ExternalLink size={13} /></a>
              <a href={joinBase("playground/")}>{t.navigation.playground}<ArrowRight size={13} /></a>
            </nav>
          </footer>
        </main>
      </div>
    </div>
  )
}
