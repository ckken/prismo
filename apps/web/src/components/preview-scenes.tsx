import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Cpu,
  Database,
  Gauge,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  X,
  Zap,
} from "lucide-react"
import type { DemoState, Scenario, ScenarioId } from "../data"
import type { Locale } from "../i18n"

export type PreviewRange = "7d" | "30d" | "90d"

type SceneProps = {
  locale: Locale
  query: string
  range: PreviewRange
  scenario: Scenario
  state: DemoState
  announce: (message: string) => void
}

const chromeCopy = {
  en: {
    sales: {
      brand: "Revenue OS",
      workspace: "Sales workspace",
      navigation: [["Workspace", "Overview", "Pipeline", "Forecast"], ["Management", "Accounts", "Activities", "Team"]],
      search: "Search accounts or owners...",
      range: { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "This quarter" },
      exportReady: "sales-performance.csv prepared",
      notification: "3 deals need attention before Friday.",
    },
    commerce: {
      brand: "Storefront",
      workspace: "Commerce operations",
      navigation: [["Store", "Overview", "Orders", "Products"], ["Growth", "Channels", "Campaigns", "Customers"]],
      search: "Search orders or customers...",
      range: { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "This quarter" },
      exportReady: "commerce-operations.csv prepared",
      notification: "2 inventory alerts and 4 orders need review.",
    },
    "agent-ops": {
      brand: "Agent Control",
      workspace: "Production observability",
      navigation: [["Observe", "Overview", "Traces", "Models"], ["Operate", "Alerts", "Budgets", "Routing"]],
      search: "Search traces, agents or models...",
      range: { "7d": "Last 24 hours", "30d": "Last 7 days", "90d": "Last 30 days" },
      exportReady: "agent-ops-snapshot.json prepared",
      notification: "P95 latency crossed the warning threshold.",
    },
  },
  zh: {
    sales: {
      brand: "Revenue OS",
      workspace: "销售工作台",
      navigation: [["工作台", "经营总览", "商机管道", "业绩预测"], ["销售管理", "客户", "跟进活动", "团队"]],
      search: "搜索客户或负责人...",
      range: { "7d": "近 7 天", "30d": "近 30 天", "90d": "本季度" },
      exportReady: "销售经营数据.csv 已生成",
      notification: "本周五前有 3 个商机需要处理。",
    },
    commerce: {
      brand: "Storefront",
      workspace: "电商运营台",
      navigation: [["店铺", "经营总览", "订单", "商品"], ["增长", "渠道", "营销活动", "客户"]],
      search: "搜索订单或客户...",
      range: { "7d": "近 7 天", "30d": "近 30 天", "90d": "本季度" },
      exportReady: "电商运营数据.csv 已生成",
      notification: "有 2 个库存预警和 4 笔订单待处理。",
    },
    "agent-ops": {
      brand: "Agent Control",
      workspace: "生产可观测中心",
      navigation: [["观测", "运行总览", "调用记录", "模型"], ["运维", "告警", "预算", "路由"]],
      search: "搜索调用、Agent 或模型...",
      range: { "7d": "近 24 小时", "30d": "近 7 天", "90d": "近 30 天" },
      exportReady: "Agent 运行快照.json 已生成",
      notification: "P95 延迟已超过预警阈值。",
    },
  },
} as const

export function getSceneChrome(locale: Locale, id: ScenarioId) {
  return chromeCopy[locale][id]
}

function Delta({ value, favorable }: { value: string; favorable?: boolean }) {
  const down = /^[\s]*[-−]/.test(value)
  const Icon = down ? ArrowDownRight : ArrowUpRight
  const negative = favorable === undefined ? down : !favorable
  return <small className={negative ? "scene-delta down" : "scene-delta"}><Icon size={13} />{value}</small>
}

function MetricCard({ icon: Icon, label, value, delta, deltaFavorable, tone = "default", progress }: { icon: typeof Target; label: string; value: string; delta: string; deltaFavorable?: boolean; tone?: "default" | "warning" | "danger"; progress?: number }) {
  return (
    <article className={`scene-metric ${tone}`}>
      <div className="scene-metric-heading"><span>{label}</span><Icon size={15} /></div>
      <strong>{value}</strong>
      <Delta value={delta} favorable={deltaFavorable} />
      {progress !== undefined ? <div className="scene-progress" aria-label={`${label} ${progress}%`}><i style={{ width: `${progress}%` }} /></div> : null}
    </article>
  )
}

function MiniTrend({ values, label, compare = false }: { values: number[]; label: string; compare?: boolean }) {
  const build = (series: number[], offset = 0) => series.map((value, index) => {
    const min = Math.min(...series)
    const max = Math.max(...series)
    const x = (index / Math.max(series.length - 1, 1)) * 100
    const y = 74 - ((value - min) / (max - min || 1)) * 56 + offset
    return `${x},${y}`
  }).join(" ")
  const comparison = values.map((value, index) => value * .82 + (index % 2 ? 4 : -2))
  return (
    <svg className="scene-trend" viewBox="0 0 100 82" preserveAspectRatio="none" role="img" aria-label={label}>
      <path className="scene-chart-grid" d="M0 18H100 M0 46H100 M0 74H100" />
      {compare ? <polyline className="scene-line comparison" points={build(comparison, 2)} /> : null}
      <polyline className="scene-line" points={build(values)} />
    </svg>
  )
}

function SceneLoading({ label }: { label: string }) {
  return (
    <div className="scene-loading" role="status" aria-label={label}>
      <div className="scene-metrics-grid">{[0, 1, 2, 3].map((item) => <span className="scene-skeleton metric" key={item} />)}</div>
      <div className="scene-loading-grid"><span className="scene-skeleton chart" /><span className="scene-skeleton side" /></div>
      <span className="scene-skeleton table" />
    </div>
  )
}

function SceneEmpty({ locale, kind }: { locale: Locale; kind: ScenarioId }) {
  const text = locale === "zh" ? {
    sales: ["当前条件下没有商机", "调整时间、负责人或商机阶段后再查看。"],
    commerce: ["当前渠道没有订单", "切换到全部渠道，或扩大时间范围。"],
    "agent-ops": ["当前环境没有运行记录", "切换到生产环境或查看过去 24 小时。"],
  }[kind] : {
    sales: ["No opportunities match these filters", "Change the range, owner, or pipeline stage to continue."],
    commerce: ["No orders in this channel", "View all channels or expand the selected date range."],
    "agent-ops": ["No runs in this environment", "Switch to Production or inspect the previous 24 hours."],
  }[kind]
  return <div className="scene-state" role="status"><Search size={22} /><strong>{text[0]}</strong><span>{text[1]}</span></div>
}

function ContractAlert({ locale, path }: { locale: Locale; path: string }) {
  return (
    <div className="scene-contract-alert" role="alert">
      <AlertTriangle size={16} />
      <div><strong>{locale === "zh" ? "部分模块的数据格式不匹配" : "Widget contract mismatch"}</strong><span>{locale === "zh" ? "其他模块仍显示最近一次有效数据。" : "Other widgets keep the last valid snapshot."}</span></div>
      <code>{path}</code>
    </div>
  )
}

const salesAccounts = [
  { id: "northwind", name: "Northwind", owner: "Maya", stage: "Proposal", amount: 84000, close: "Aug 08", risk: "On track" },
  { id: "acme", name: "Acme Labs", owner: "Theo", stage: "Qualified", amount: 67000, close: "Aug 12", risk: "At risk" },
  { id: "sora", name: "Sora Retail", owner: "Iris", stage: "Negotiation", amount: 52000, close: "Jul 31", risk: "Overdue" },
  { id: "linear", name: "Linear Works", owner: "Maya", stage: "Discovery", amount: 46000, close: "Aug 19", risk: "On track" },
  { id: "vertex", name: "Vertex Cloud", owner: "Theo", stage: "Proposal", amount: 39000, close: "Aug 25", risk: "Watch" },
  { id: "orbit", name: "Orbit Foods", owner: "Iris", stage: "Qualified", amount: 31000, close: "Sep 02", risk: "On track" },
] as const

const salesStageZh: Record<string, string> = {
  All: "全部",
  Discovery: "需求沟通",
  Qualified: "已确认",
  Proposal: "方案中",
  Negotiation: "谈判中",
}

const salesRiskZh: Record<string, string> = {
  "On track": "正常",
  "At risk": "有风险",
  Overdue: "已逾期",
  Watch: "需关注",
}

const commerceChannelZh: Record<string, string> = {
  All: "全部渠道",
  Direct: "直营",
  Social: "社交",
  Search: "搜索",
}

const commerceStatusZh: Record<string, string> = {
  Paid: "已支付",
  Review: "待复核",
  Packed: "已打包",
}

function localizedLabel(value: string, zh: boolean, labels: Record<string, string>) {
  return zh ? labels[value] ?? value : value
}

function localizedSalesDate(value: string, zh: boolean) {
  if (!zh) return value
  const [month, day] = value.split(" ")
  const monthNumber = { Jul: 7, Aug: 8, Sep: 9 }[month as "Jul" | "Aug" | "Sep"]
  return `${monthNumber} 月 ${Number(day)} 日`
}

function SalesScene({ locale, query, range, scenario, state, announce }: SceneProps) {
  const zh = locale === "zh"
  const [stage, setStage] = useState("All")
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [scheduled, setScheduled] = useState<string[]>([])
  useEffect(() => { setStage("All"); setPage(0); setSelected(null) }, [range])
  useEffect(() => { setPage(0) }, [query, stage])
  const accounts = useMemo(() => [...salesAccounts]
    .filter((item) => stage === "All" || item.stage === stage)
    .filter((item) => `${item.name} ${item.owner}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sortDesc ? b.amount - a.amount : a.amount - b.amount), [query, sortDesc, stage])
  const current = accounts.slice(page * 3, page * 3 + 3)
  const selectedAccount = salesAccounts.find((item) => item.id === selected)
  const rangeData = {
    "7d": { revenue: "$214k", target: "82.6%", pipeline: "$1.42m", winRate: "29.4%", chart: scenario.chart.slice(-7) },
    "30d": { revenue: scenario.metrics[0].value, target: scenario.metrics[1].value, pipeline: scenario.metrics[2].value, winRate: "31.8%", chart: scenario.chart.slice(-10) },
    "90d": { revenue: "$2.38m", target: "91.4%", pipeline: "$2.64m", winRate: "34.1%", chart: scenario.chart.map((item, index) => item + [2, -5, 4, -2][index % 4]) },
  }[range]
  if (state === "loading") return <SceneLoading label={zh ? "正在加载销售数据" : "Loading sales dashboard"} />
  return (
    <div className="scene sales-scene">
      <div className="scene-metrics-grid">
        <MetricCard icon={CircleDollarSign} label={scenario.metrics[0].label} value={rangeData.revenue} delta={scenario.metrics[0].delta} />
        <MetricCard icon={Target} label={scenario.metrics[1].label} value={rangeData.target} delta={scenario.metrics[1].delta} progress={Number.parseFloat(rangeData.target)} />
        <MetricCard icon={TrendingUp} label={scenario.metrics[2].label} value={rangeData.pipeline} delta={scenario.metrics[2].delta} />
        <MetricCard icon={CheckCircle2} label={zh ? "赢单率" : "Win rate"} value={rangeData.winRate} delta="+2.6%" />
      </div>
      {state === "empty" ? <SceneEmpty locale={locale} kind="sales" /> : (
        <>
          <div className="sales-main-grid">
            <article className="scene-card sales-forecast">
              <div className="scene-card-heading"><div><span>{zh ? "预测" : "Forecast"}</span><strong>{zh ? "营收与目标对比" : "Revenue vs target"}</strong></div><div className="scene-legend"><span /><small>{zh ? "实际" : "Actual"}</small><span className="comparison" /><small>{zh ? "目标" : "Target"}</small></div></div>
              <MiniTrend values={rangeData.chart} label={zh ? "销售实际与目标趋势" : "Sales actual versus target trend"} compare />
              <div className="scene-axis"><span>{zh ? "第 1 周" : "W1"}</span><span>{zh ? "第 4 周" : "W4"}</span><span>{zh ? "第 8 周" : "W8"}</span><span>{zh ? "第 12 周" : "W12"}</span></div>
            </article>
            <article className="scene-card followups-card">
              <div className="scene-card-heading"><div><span>{zh ? "今日" : "Today"}</span><strong>{zh ? "优先跟进事项" : "Priority follow-ups"}</strong></div><span className="scene-count">{2 - Math.min(scheduled.length, 2)}</span></div>
              <div className="followup-list">
                {salesAccounts.filter((item) => ["acme", "sora"].includes(item.id) && !scheduled.includes(item.id)).map((item) => (
                  <div key={item.id}><span className="scene-avatar">{item.owner.slice(0, 2).toUpperCase()}</span><div><strong>{item.name}</strong><small>{localizedLabel(item.risk, zh, salesRiskZh)} · {localizedSalesDate(item.close, zh)}</small></div><button type="button" aria-label={zh ? `安排 ${item.name} 跟进` : `Schedule ${item.name} follow-up`} onClick={() => { setScheduled((value) => [...value, item.id]); announce(zh ? `${item.name} 已安排跟进` : `${item.name} follow-up scheduled`) }}><Check size={13} /></button></div>
                ))}
                {scheduled.length >= 2 ? <div className="scene-inline-success"><CheckCircle2 size={15} />{zh ? "今日重点已处理" : "Priority queue cleared"}</div> : null}
              </div>
            </article>
          </div>
          <article className="scene-card pipeline-card">
            <div className="scene-card-heading"><div><span>{zh ? "销售管道" : "Pipeline"}</span><strong>{zh ? "各阶段转化" : "Stage conversion"}</strong></div><small>{zh ? "点击阶段筛选客户" : "Select a stage to filter accounts"}</small></div>
            <div className="pipeline-funnel" role="group" aria-label={zh ? "商机阶段筛选" : "Pipeline stage filter"}>
              {[["All", 32, "$1.8m"], ["Discovery", 24, "$620k"], ["Qualified", 18, "$480k"], ["Proposal", 11, "$342k"], ["Negotiation", 6, "$214k"]].map(([name, count, value], index) => (
                <button aria-pressed={stage === name} className={stage === name ? "active" : ""} style={{ width: `${100 - index * 9}%` }} type="button" key={name} onClick={() => { setStage(String(name)); setPage(0) }}><span>{localizedLabel(String(name), zh, salesStageZh)}</span><strong>{count}</strong><small>{value}</small></button>
              ))}
            </div>
          </article>
          <article className="scene-card scene-table-card">
            <div className="scene-card-heading"><div><span>{zh ? "客户商机" : "Accounts"}</span><strong>{zh ? "重点商机列表" : "Priority pipeline"}</strong></div><span>{accounts.length} {zh ? "个商机" : "opportunities"}</span></div>
            {state === "contract-error" ? <ContractAlert locale={locale} path={scenario.contractPath} /> : (
              <div className="scene-table-scroll"><table><thead><tr><th>{zh ? "客户" : "Account"}</th><th>{zh ? "阶段" : "Stage"}</th><th>{zh ? "负责人" : "Owner"}</th><th aria-sort={sortDesc ? "descending" : "ascending"}><button type="button" onClick={() => setSortDesc(!sortDesc)}>{zh ? "金额" : "Value"}<ChevronDown className={sortDesc ? "" : "rotated"} size={12} /></button></th><th>{zh ? "风险" : "Risk"}</th></tr></thead><tbody>{current.length ? current.map((item) => <tr key={item.id}><td><button className="scene-link" type="button" onClick={() => setSelected(selected === item.id ? null : item.id)}>{item.name}</button></td><td><span className="scene-badge">{localizedLabel(item.stage, zh, salesStageZh)}</span></td><td>{item.owner}</td><td>${Math.round(item.amount / 1000)}k</td><td><span className={`scene-risk ${item.risk === "Overdue" || item.risk === "At risk" ? "danger" : ""}`}>{localizedLabel(item.risk, zh, salesRiskZh)}</span></td></tr>) : <tr><td className="scene-table-empty" colSpan={5}>{zh ? "没有匹配的商机" : "No matching opportunities"}</td></tr>}</tbody></table></div>
            )}
            {state !== "contract-error" ? <div className="scene-pagination"><span>{zh ? `第 ${page + 1} 页` : `Page ${page + 1}`}</span><button type="button" aria-label={zh ? "上一页" : "Previous page"} disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={13} /></button><button type="button" aria-label={zh ? "下一页" : "Next page"} disabled={(page + 1) * 3 >= accounts.length} onClick={() => setPage(page + 1)}><ChevronRight size={13} /></button></div> : null}
            {selectedAccount ? <div className="scene-detail"><div><Sparkles size={15} /><strong>{selectedAccount.name}</strong><button type="button" aria-label={zh ? "关闭客户详情" : "Close account details"} onClick={() => setSelected(null)}><X size={13} /></button></div><p>{zh ? "建议操作：确认决策人，并在 48 小时内发送方案摘要。" : "Agent suggestion: confirm the decision maker and send the proposal summary within 48 hours."}</p><span>{zh ? "下一步" : "Next step"}: {localizedSalesDate(selectedAccount.close, zh)}</span></div> : null}
          </article>
        </>
      )}
    </div>
  )
}

const commerceOrders = [
  { id: "#10428", customer: "Olivia Martin", channel: "Direct", status: "Paid", amount: 1240 },
  { id: "#10427", customer: "Jackson Lee", channel: "Social", status: "Review", amount: 890 },
  { id: "#10426", customer: "Sofia Davis", channel: "Search", status: "Packed", amount: 640 },
  { id: "#10425", customer: "Noah Wilson", channel: "Direct", status: "Review", amount: 520 },
] as const

function CommerceScene({ locale, query, range, scenario, state, announce }: SceneProps) {
  const zh = locale === "zh"
  const [channel, setChannel] = useState("All")
  const [metric, setMetric] = useState<"GMV" | "Orders">("GMV")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [fulfilled, setFulfilled] = useState<string[]>([])
  const [product, setProduct] = useState<string | null>(null)
  const [replenished, setReplenished] = useState(false)
  useEffect(() => { setChannel("All"); setSelectedOrders([]); setProduct(null) }, [range])
  const orders = commerceOrders.filter((item) => (channel === "All" || item.channel === channel) && `${item.id} ${item.customer}`.toLowerCase().includes(query.toLowerCase()))
  const rangeData = {
    "7d": { gmv: "$31.4k", orders: "824", conversion: "4.5%", pending: "9", pattern: [-4, 2, -3, 5, 1, 8, 4] },
    "30d": { gmv: scenario.metrics[0].value, orders: scenario.metrics[1].value, conversion: scenario.metrics[2].value, pending: "24", pattern: [0, 3, -2, 4, -3, 2, 0, 3, -2, 4, -1, 2] },
    "90d": { gmv: "$362k", orders: "9,604", conversion: "5.1%", pending: "42", pattern: [5, -4, 3, -6, 8, -2, 6, -5, 4, -3, 7, -1] },
  }[range]
  const rangeChart = scenario.chart.slice(range === "7d" ? -7 : 0).map((item, index) => item + rangeData.pattern[index])
  if (state === "loading") return <SceneLoading label={zh ? "正在加载电商数据" : "Loading commerce dashboard"} />
  return (
    <div className="scene commerce-scene">
      <div className="scene-metrics-grid">
        <MetricCard icon={CircleDollarSign} label={scenario.metrics[0].label} value={rangeData.gmv} delta={scenario.metrics[0].delta} />
        <MetricCard icon={ShoppingCart} label={scenario.metrics[1].label} value={rangeData.orders} delta={scenario.metrics[1].delta} />
        <MetricCard icon={TrendingUp} label={scenario.metrics[2].label} value={rangeData.conversion} delta={scenario.metrics[2].delta} progress={64} />
        <MetricCard icon={Clock3} label={zh ? "待处理订单" : "Pending orders"} value={rangeData.pending} delta="+6" tone="warning" />
      </div>
      <div className="scene-filter-row" role="group" aria-label={zh ? "渠道筛选" : "Channel filter"}>{["All", "Direct", "Social", "Search"].map((item) => <button aria-pressed={channel === item} className={channel === item ? "active" : ""} type="button" key={item} onClick={() => { setChannel(item); setSelectedOrders([]) }}>{localizedLabel(item, zh, commerceChannelZh)}</button>)}</div>
      {state === "empty" ? <SceneEmpty locale={locale} kind="commerce" /> : (
        <>
          <div className="commerce-main-grid">
            <article className="scene-card commerce-trend-card">
              <div className="scene-card-heading"><div><span>{zh ? "经营趋势" : "Performance"}</span><strong>{metric === "GMV" ? (zh ? "GMV 趋势" : "GMV trend") : (zh ? "订单趋势" : "Order volume")}</strong></div><div className="scene-segmented" role="group" aria-label={zh ? "趋势指标" : "Trend metric"}><button aria-pressed={metric === "GMV"} className={metric === "GMV" ? "active" : ""} type="button" onClick={() => setMetric("GMV")}>GMV</button><button aria-pressed={metric === "Orders"} className={metric === "Orders" ? "active" : ""} type="button" onClick={() => setMetric("Orders")}>{zh ? "订单" : "Orders"}</button></div></div>
              <MiniTrend values={metric === "GMV" ? rangeChart : rangeChart.map((item) => Math.round(item * .64))} label={metric === "GMV" ? (zh ? "GMV 趋势" : "GMV trend") : (zh ? "订单趋势" : "Order trend")} />
              <div className="scene-axis"><span>{zh ? "周一" : "Mon"}</span><span>{zh ? "周三" : "Wed"}</span><span>{zh ? "周五" : "Fri"}</span><span>{zh ? "周日" : "Sun"}</span></div>
            </article>
            <article className="scene-card channel-card">
              <div className="scene-card-heading"><div><span>{zh ? "渠道" : "Channels"}</span><strong>{zh ? "成交贡献" : "Revenue mix"}</strong></div><small>{localizedLabel(channel, zh, commerceChannelZh)}</small></div>
              <div className="channel-bars" role="group" aria-label={zh ? "渠道成交贡献" : "Revenue by channel"}>{[["Direct", 48], ["Social", 31], ["Search", 21]].map(([name, value]) => <button aria-pressed={channel === name} type="button" key={name} onClick={() => setChannel(String(name))}><span>{localizedLabel(String(name), zh, commerceChannelZh)}</span><div><i style={{ width: `${value}%` }} /></div><strong>{value}%</strong></button>)}</div>
            </article>
          </div>
          <div className="commerce-detail-grid">
            <article className="scene-card products-card">
              <div className="scene-card-heading"><div><span>{zh ? "商品" : "Products"}</span><strong>{zh ? "热销商品" : "Top products"}</strong></div><Box size={15} /></div>
              {[{ name: zh ? "工作室台灯" : "Studio lamp", value: "$18.4k", trend: "+18%" }, { name: zh ? "旅行背包" : "Travel pack", value: "$14.2k", trend: "+11%" }, { name: zh ? "桌面系统" : "Desk system", value: "$12.8k", trend: "+9%" }].map((item) => <button aria-pressed={product === item.name} className={product === item.name ? "active" : ""} type="button" key={item.name} onClick={() => setProduct(product === item.name ? null : item.name)}><PackageCheck size={14} /><span><strong>{item.name}</strong><small>{item.value}</small></span><em>{item.trend}</em></button>)}
              {product ? <div className="product-detail"><strong>{product}</strong><span>{zh ? "转化率 6.8% · 库存可售 18 天" : "6.8% conversion · 18 days of inventory"}</span></div> : null}
            </article>
            <article className="scene-card inventory-card">
              <div className="scene-card-heading"><div><span>{zh ? "库存" : "Inventory"}</span><strong>{zh ? "补货预警" : "Replenishment alert"}</strong></div><TriangleAlert size={15} /></div>
              <div className="inventory-alert"><span className="scene-product-icon"><Box size={17} /></span><div><strong>{zh ? "旅行背包 · 沙色" : "Travel pack · Sand"}</strong><small>{replenished ? (zh ? "补货单已建立" : "Replenishment created") : (zh ? "仅剩 4 天库存" : "4 days of stock remaining")}</small></div></div>
              <button className="scene-action" type="button" disabled={replenished} onClick={() => { setReplenished(true); announce(zh ? "补货单已建立" : "Replenishment created") }}>{replenished ? <Check size={13} /> : <RefreshCw size={13} />}{replenished ? (zh ? "已建立" : "Created") : (zh ? "创建补货单" : "Create replenishment")}</button>
            </article>
          </div>
          <article className="scene-card scene-table-card orders-card">
            <div className="scene-card-heading"><div><span>{zh ? "订单" : "Orders"}</span><strong>{zh ? "操作队列" : "Operations queue"}</strong></div><span>{orders.length} {zh ? "笔" : "orders"}</span></div>
            {state === "contract-error" ? <ContractAlert locale={locale} path={scenario.contractPath} /> : <div className="scene-table-scroll"><table><thead><tr><th><span className="sr-only">{zh ? "选择" : "Select"}</span></th><th>{zh ? "订单" : "Order"}</th><th>{zh ? "客户" : "Customer"}</th><th>{zh ? "渠道" : "Channel"}</th><th>{zh ? "状态" : "Status"}</th><th>{zh ? "金额" : "Amount"}</th></tr></thead><tbody>{orders.length ? orders.map((item) => <tr key={item.id}><td><input type="checkbox" aria-label={`${zh ? "选择订单" : "Select order"} ${item.id}`} checked={selectedOrders.includes(item.id)} onChange={() => setSelectedOrders((value) => value.includes(item.id) ? value.filter((id) => id !== item.id) : [...value, item.id])} /></td><td><strong>{item.id}</strong></td><td>{item.customer}</td><td>{localizedLabel(item.channel, zh, commerceChannelZh)}</td><td><span className={`scene-badge ${item.status === "Review" && !fulfilled.includes(item.id) ? "warning" : ""}`}>{fulfilled.includes(item.id) ? (zh ? "已履约" : "Fulfilled") : localizedLabel(item.status, zh, commerceStatusZh)}</span></td><td>${item.amount.toLocaleString()}</td></tr>) : <tr><td className="scene-table-empty" colSpan={6}>{zh ? "没有匹配的订单" : "No matching orders"}</td></tr>}</tbody></table></div>}
            {selectedOrders.length ? <div className="bulk-bar" role="status"><strong>{selectedOrders.length} {zh ? "笔已选" : "selected"}</strong><button type="button" onClick={() => { setFulfilled((value) => [...new Set([...value, ...selectedOrders])]); announce(zh ? `已将 ${selectedOrders.length} 笔订单标记为已履约` : `${selectedOrders.length} orders marked fulfilled`); setSelectedOrders([]) }}><CheckCircle2 size={13} />{zh ? "标记为已履约" : "Mark fulfilled"}</button><button type="button" onClick={() => { announce(zh ? "已生成选中订单文件" : "Selection export prepared"); setSelectedOrders([]) }}>{zh ? "导出选中项" : "Export selection"}</button></div> : null}
          </article>
        </>
      )}
    </div>
  )
}

const traces = [
  { id: "tr_8f21", agent: "Support triage", model: "gpt-5.6", latency: "1.2s", status: "Succeeded", cost: "$0.042", code: "OK" },
  { id: "tr_8f20", agent: "Research brief", model: "gpt-5.6-terra", latency: "4.8s", status: "Failed", cost: "$0.118", code: "TOOL_5XX" },
  { id: "tr_8f19", agent: "Lead scoring", model: "gpt-5.3-spark", latency: "0.8s", status: "Succeeded", cost: "$0.016", code: "OK" },
  { id: "tr_8f18", agent: "Invoice review", model: "gpt-5.6", latency: "2.4s", status: "Failed", cost: "$0.061", code: "RATE_LIMIT" },
] as const

const agentNameZh: Record<string, string> = {
  "Support triage": "客服分流",
  "Research brief": "研究简报",
  "Lead scoring": "线索评分",
  "Invoice review": "发票审核",
}

const traceStatusZh: Record<string, string> = {
  Succeeded: "已成功",
  Failed: "已失败",
}

function AgentOpsScene({ locale, query, range, scenario, state, announce }: SceneProps) {
  const zh = locale === "zh"
  const [environment, setEnvironment] = useState<"Production" | "Staging">("Production")
  const [live, setLive] = useState(true)
  const [metric, setMetric] = useState<"Requests" | "Latency" | "Cost">("Requests")
  const [failureCode, setFailureCode] = useState("All")
  const [selectedTrace, setSelectedTrace] = useState<string | null>(null)
  const [retried, setRetried] = useState<string[]>([])
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!live) return
    const timer = window.setInterval(() => setTick((value) => (value + 1) % 9), 2000)
    return () => window.clearInterval(timer)
  }, [live])
  useEffect(() => { setFailureCode("All"); setSelectedTrace(null) }, [range, environment])
  const visibleTraces = traces.filter((item) => (failureCode === "All" || item.code === failureCode) && `${item.id} ${item.agent} ${item.model}`.toLowerCase().includes(query.toLowerCase()))
  const selected = traces.find((item) => item.id === selectedTrace)
  const rangeData = {
    "7d": { requests: 0.18, cost: "$912", latency: "1.4s", pattern: [-5, 3, -4, 6, -2, 5, 1, -3, 4, -1, 6, 0] },
    "30d": { requests: 1.24, cost: scenario.metrics[1].value, latency: scenario.metrics[2].value, pattern: [0, 4, -2, 3, -4, 2, -1, 5, -3, 2, -2, 4] },
    "90d": { requests: 5.48, cost: "$28.6k", latency: "2.1s", pattern: [6, -4, 5, -5, 7, -3, 4, -6, 8, -2, 5, -1] },
  }[range]
  if (state === "loading") return <SceneLoading label={zh ? "正在加载 Agent 运行数据" : "Loading agent operations dashboard"} />
  return (
    <div className="scene agent-scene">
      <div className="agent-control-row">
        <div className="scene-segmented" role="group" aria-label={zh ? "环境" : "Environment"}>{["Production", "Staging"].map((item) => <button aria-pressed={environment === item} className={environment === item ? "active" : ""} type="button" key={item} onClick={() => setEnvironment(item as "Production" | "Staging")}>{zh ? (item === "Production" ? "生产" : "预发") : item}</button>)}</div>
        <button className={live ? "live-toggle active" : "live-toggle"} type="button" aria-pressed={live} onClick={() => { setLive(!live); announce(!live ? (zh ? "实时更新已恢复" : "Live updates resumed") : (zh ? "快照已暂停" : "Snapshot paused")) }}><span />{zh ? "实时" : "Live"}</button>
      </div>
      <div className="scene-metrics-grid">
        <MetricCard icon={Zap} label={scenario.metrics[0].label} value={environment === "Staging" ? `${Math.round(rangeData.requests * 68)}k` : `${(rangeData.requests + tick / 100).toFixed(2)}m`} delta={scenario.metrics[0].delta} />
        <MetricCard icon={CircleDollarSign} label={scenario.metrics[1].label} value={environment === "Staging" ? "$438" : rangeData.cost} delta={scenario.metrics[1].delta} deltaFavorable />
        <MetricCard icon={Gauge} label={scenario.metrics[2].label} value={environment === "Staging" ? "920ms" : rangeData.latency} delta={scenario.metrics[2].delta} deltaFavorable tone={environment === "Production" ? "warning" : "default"} />
        <MetricCard icon={AlertTriangle} label={zh ? "错误率" : "Error rate"} value={environment === "Staging" ? "0.08%" : "0.42%"} delta="-0.11%" deltaFavorable tone={environment === "Production" ? "danger" : "default"} />
      </div>
      {state === "empty" ? <SceneEmpty locale={locale} kind="agent-ops" /> : (
        <>
          <div className="agent-main-grid">
            <article className="scene-card agent-trend-card">
              <div className="scene-card-heading"><div><span>{zh ? "实时流量" : "Live traffic"}</span><strong>{metric === "Requests" ? (zh ? "请求量" : "Request volume") : metric === "Latency" ? (zh ? "延迟" : "Latency") : (zh ? "成本" : "Cost")}</strong></div><div className="scene-segmented compact" role="group" aria-label={zh ? "趋势指标" : "Trend metric"}>{["Requests", "Latency", "Cost"].map((item) => <button aria-pressed={metric === item} className={metric === item ? "active" : ""} type="button" key={item} onClick={() => setMetric(item as typeof metric)}>{item === "Requests" && zh ? "请求" : item === "Latency" && zh ? "延迟" : item === "Cost" && zh ? "成本" : item}</button>)}</div></div>
              <MiniTrend values={scenario.chart.map((item, index) => Math.round((metric === "Requests" ? item + tick : metric === "Latency" ? item * .72 + (index % 2 ? 5 : -3) : item * .34 + (index % 3) * 4) + rangeData.pattern[index]))} label={zh ? `${metric === "Requests" ? "请求量" : metric === "Latency" ? "延迟" : "成本"}趋势` : `${metric} trend`} />
              <div className="scene-axis"><span>00:00</span><span>08:00</span><span>16:00</span><span>{zh ? "现在" : "Now"}</span></div>
            </article>
            <article className="scene-card alerts-card">
              <div className="scene-card-heading"><div><span>{zh ? "告警" : "Alerts"}</span><strong>{zh ? "当前告警" : "Active now"}</strong></div><span className="scene-count danger">{environment === "Production" ? 2 : 0}</span></div>
              {environment === "Production" ? <div className="alert-list"><button type="button" onClick={() => { setSelectedTrace("tr_8f20"); setFailureCode("TOOL_5XX") }}><span className="alert-dot" /><div><strong>{zh ? "P95 延迟 > 1.5 秒" : "P95 latency > 1.5s"}</strong><small>{zh ? "研究简报 Agent 受影响" : "Research brief affected"}</small></div><ChevronRight size={13} /></button><button type="button" onClick={() => { setSelectedTrace("tr_8f18"); setFailureCode("RATE_LIMIT") }}><span className="alert-dot warning" /><div><strong>{zh ? "限流压力升高" : "Rate limit pressure"}</strong><small>{zh ? "gpt-5.6 路由" : "gpt-5.6 route"}</small></div><ChevronRight size={13} /></button></div> : <div className="scene-inline-success"><CheckCircle2 size={15} />{zh ? "预发环境正常" : "Staging is healthy"}</div>}
            </article>
          </div>
          <div className="agent-detail-grid">
            <article className="scene-card routing-card">
              <div className="scene-card-heading"><div><span>{zh ? "路由" : "Routing"}</span><strong>{zh ? "模型分布" : "Model distribution"}</strong></div><Cpu size={15} /></div>
              <div className="routing-stack"><button type="button" style={{ width: "58%" }} onClick={() => announce("gpt-5.6 · 58%")}>gpt-5.6</button><button type="button" style={{ width: "27%" }} onClick={() => announce("gpt-5.6-terra · 27%")}>terra</button><button type="button" style={{ width: "15%" }} onClick={() => announce("gpt-5.3-spark · 15%")}>spark</button></div>
            </article>
            <article className="scene-card failure-card">
              <div className="scene-card-heading"><div><span>{zh ? "诊断" : "Diagnostics"}</span><strong>{zh ? "失败代码" : "Failure codes"}</strong></div><Database size={15} /></div>
              <div className="failure-codes" role="group" aria-label={zh ? "失败代码筛选" : "Failure code filter"}>{[["All", 18], ["TOOL_5XX", 9], ["RATE_LIMIT", 6], ["SCHEMA", 3]].map(([code, count]) => <button aria-pressed={failureCode === code} className={failureCode === code ? "active" : ""} type="button" key={code} onClick={() => setFailureCode(String(code))}><span>{code === "All" && zh ? "全部" : code}</span><strong>{count}</strong></button>)}</div>
            </article>
          </div>
          <article className="scene-card scene-table-card traces-card">
            <div className="scene-card-heading"><div><span>{zh ? "调用记录" : "Trace explorer"}</span><strong>{zh ? "最近运行" : "Recent runs"}</strong></div><span>{visibleTraces.length} {zh ? "条调用记录" : "traces"}</span></div>
            {state === "contract-error" ? <ContractAlert locale={locale} path={scenario.contractPath} /> : <div className="scene-table-scroll"><table><thead><tr><th>{zh ? "调用 ID" : "Trace"}</th><th>Agent</th><th>{zh ? "模型" : "Model"}</th><th>{zh ? "延迟" : "Latency"}</th><th>{zh ? "状态" : "Status"}</th><th>{zh ? "成本" : "Cost"}</th></tr></thead><tbody>{visibleTraces.length ? visibleTraces.map((item) => <tr key={item.id}><td><button className="scene-link mono" type="button" onClick={() => setSelectedTrace(selectedTrace === item.id ? null : item.id)}>{item.id}</button></td><td>{localizedLabel(item.agent, zh, agentNameZh)}</td><td>{item.model}</td><td>{item.latency}</td><td><span className={`scene-badge ${item.status === "Failed" && !retried.includes(item.id) ? "danger" : ""}`}>{retried.includes(item.id) ? (zh ? "已成功" : "Succeeded") : localizedLabel(item.status, zh, traceStatusZh)}</span></td><td>{item.cost}</td></tr>) : <tr><td className="scene-table-empty" colSpan={6}>{zh ? "没有匹配的调用记录" : "No matching traces"}</td></tr>}</tbody></table></div>}
            {selected ? <div className="trace-detail"><div><div><span className="trace-status-dot" /><strong>{selected.id}</strong></div><button type="button" aria-label={zh ? "关闭调用详情" : "Close trace details"} onClick={() => setSelectedTrace(null)}><X size={13} /></button></div><div className="trace-timeline"><span><i /><strong>{zh ? "提示词组装完成" : "Prompt assembled"}</strong><small>84ms</small></span><span><i /><strong>{zh ? "模型响应" : "Model response"}</strong><small>{selected.latency}</small></span><span className={selected.status === "Failed" && !retried.includes(selected.id) ? "failed" : ""}><i /><strong>{retried.includes(selected.id) ? (zh ? "重试已成功" : "Retry succeeded") : selected.code}</strong><small>{selected.cost}</small></span></div>{selected.status === "Failed" && !retried.includes(selected.id) ? <button className="scene-action" type="button" onClick={() => { announce(zh ? `${selected.id} 重试已成功` : `${selected.id} retry succeeded`); setRetried((value) => [...value, selected.id]) }}><RefreshCw size={13} />{zh ? "模拟重试" : "Retry simulation"}</button> : null}</div> : null}
          </article>
        </>
      )}
    </div>
  )
}

export function PreviewScene(props: SceneProps) {
  if (props.scenario.id === "commerce") return <CommerceScene {...props} />
  if (props.scenario.id === "agent-ops") return <AgentOpsScene {...props} />
  return <SalesScene {...props} />
}
