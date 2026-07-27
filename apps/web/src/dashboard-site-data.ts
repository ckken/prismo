import type { Locale } from "./i18n"

export type DashboardId = "default" | "sales" | "commerce" | "agent-ops" | "crm" | "finance"
export type RecipeStatus = "available" | "candidate"
export type LocalizedText = Record<Locale, string>

export type Metric = {
  label: LocalizedText
  value: string
  delta: string
  direction?: "up" | "down" | "neutral"
  mockAggregation: "sum" | "average" | "snapshot"
}

export type ListItem = {
  title: LocalizedText
  meta: LocalizedText
  value: string
  tone?: "positive" | "warning" | "danger" | "neutral"
}

export type StatusItem = {
  label: LocalizedText
  value: string
  meta: LocalizedText
  progress: number
  tone?: "blue" | "green" | "amber" | "red"
}

export type DashboardDefinition = {
  id: DashboardId
  recipeId: string
  status: RecipeStatus
  title: LocalizedText
  description: LocalizedText
  modules: LocalizedText[]
  metrics: Metric[]
  chart: {
    title: LocalizedText
    description: LocalizedText
    primary: number[]
    secondary?: number[]
    primaryLabel: LocalizedText
    secondaryLabel?: LocalizedText
  }
  list: {
    title: LocalizedText
    description: LocalizedText
    items: ListItem[]
  }
  statuses: {
    title: LocalizedText
    description: LocalizedText
    items: StatusItem[]
  }
  table: {
    title: LocalizedText
    description: LocalizedText
    filter: LocalizedText
    columns: LocalizedText[]
    rows: Array<{ cells: string[]; status: LocalizedText; tone: "positive" | "warning" | "danger" | "neutral" }>
  }
}

const text = (zh: string, en: string): LocalizedText => ({ zh, en })

export const dashboardIds: DashboardId[] = ["default", "sales", "commerce", "agent-ops", "crm", "finance"]

export function isDashboardId(value: string): value is DashboardId {
  return dashboardIds.includes(value as DashboardId)
}

export function localize(value: LocalizedText, locale: Locale) {
  return value[locale]
}

export const dashboards: DashboardDefinition[] = [
  {
    id: "default",
    recipeId: "dashboard-overview-01",
    status: "available",
    title: text("通用经营总览", "Business Overview"),
    description: text("在一个工作面板中查看经营指标、趋势、交付动态和待处理事项。", "See business health, trends, delivery activity, and work that needs attention in one place."),
    modules: [
      text("KPI 概览", "KPI overview"),
      text("趋势分析", "Trend analysis"),
      text("运营表格", "Operations table"),
      text("数据契约", "Data contract"),
      text("四态处理", "Four states"),
    ],
    metrics: [
      { label: text("活跃客户", "Active customers"), value: "2,350", delta: "+18.0%", direction: "up", mockAggregation: "snapshot" },
      { label: text("总收入", "Total revenue"), value: "¥452k", delta: "+20.1%", direction: "up", mockAggregation: "sum" },
      { label: text("转化率", "Conversion"), value: "12.2%", delta: "+1.9%", direction: "up", mockAggregation: "average" },
      { label: text("待处理事项", "Open actions"), value: "18", delta: "-12.5%", direction: "down", mockAggregation: "snapshot" },
    ],
    chart: {
      title: text("经营趋势", "Operating trend"),
      description: text("最近 12 个月的收入与目标走势", "Revenue and target performance over the last 12 months"),
      primary: [32, 39, 36, 48, 45, 58, 55, 68, 64, 76, 72, 84],
      secondary: [29, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70, 74],
      primaryLabel: text("实际收入", "Actual revenue"),
      secondaryLabel: text("目标", "Target"),
    },
    list: {
      title: text("Agent 交付动态", "Agent delivery activity"),
      description: text("最近完成与待确认的交付动作", "Recent delivery actions and pending reviews"),
      items: [
        { title: text("经营总览 Recipe", "Overview recipe"), meta: text("类型检查与构建已通过", "Typecheck and build passed"), value: "Ready", tone: "positive" },
        { title: text("客户字段映射", "Customer field mapping"), meta: text("等待 Data Adapter 确认", "Waiting for Data Adapter review"), value: "Review", tone: "warning" },
        { title: text("响应式 Proof", "Responsive proof"), meta: text("375 / 768 / 1440", "375 / 768 / 1440"), value: "3/3", tone: "positive" },
      ],
    },
    statuses: {
      title: text("Recipe 状态", "Recipe readiness"),
      description: text("唯一已开放安装的 Dashboard Recipe", "The only dashboard recipe currently open for installation"),
      items: [
        { label: text("Registry", "Registry"), value: "Ready", meta: text("源码可安装", "Source installable"), progress: 100, tone: "green" },
        { label: text("数据契约", "Data contract"), value: "Valid", meta: text("Zod 运行时校验", "Zod runtime validation"), progress: 100, tone: "green" },
        { label: text("四态", "Four states"), value: "4/4", meta: text("成功、加载、空态、错误", "Success, loading, empty, error"), progress: 100, tone: "blue" },
      ],
    },
    table: {
      title: text("运营明细", "Operations detail"),
      description: text("支持受控查询、排序与分页的 L2 表格边界", "An L2 table boundary with controlled query, sorting, and pagination"),
      filter: text("筛选运营事项…", "Filter operations…"),
      columns: [text("事项", "Item"), text("负责人", "Owner"), text("金额", "Value"), text("状态", "Status")],
      rows: [
        { cells: ["华东增长计划", "Iris", "¥86k"], status: text("正常", "Healthy"), tone: "positive" },
        { cells: ["企业续约", "Morgan", "¥64k"], status: text("待确认", "Review"), tone: "warning" },
        { cells: ["渠道升级", "Taylor", "¥48k"], status: text("正常", "Healthy"), tone: "positive" },
        { cells: ["客户迁移", "Robin", "¥39k"], status: text("风险", "At risk"), tone: "danger" },
        { cells: ["新市场验证", "Alex", "¥31k"], status: text("推进中", "In progress"), tone: "neutral" },
      ],
    },
  },
  {
    id: "sales",
    recipeId: "sales-command-center",
    status: "candidate",
    title: text("销售指挥中心", "Sales Command Center"),
    description: text("集中跟踪目标、预测、团队表现、Pipeline 和重点客户。", "Track targets, forecasts, team performance, pipeline, and priority accounts."),
    modules: [text("目标进度", "Target progress"), text("销售趋势", "Sales trend"), text("团队排名", "Team ranking"), text("Pipeline", "Pipeline"), text("客户表格", "Accounts table")],
    metrics: [
      { label: text("区间收入", "Period revenue"), value: "$184k", delta: "+12.4%", direction: "up", mockAggregation: "sum" },
      { label: text("Pipeline", "Pipeline"), value: "$612k", delta: "+18.7%", direction: "up", mockAggregation: "snapshot" },
      { label: text("成交率", "Win rate"), value: "31.8%", delta: "+2.1%", direction: "up", mockAggregation: "average" },
      { label: text("预测达成", "Forecast"), value: "92%", delta: "-3.0%", direction: "down", mockAggregation: "average" },
    ],
    chart: {
      title: text("收入与预测", "Revenue and forecast"),
      description: text("最近 28 天的实际收入与预测基线", "Actual revenue and forecast baseline over the last 28 days"),
      primary: [24, 35, 31, 46, 42, 53, 49, 62, 58, 71, 67, 79],
      secondary: [28, 31, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70],
      primaryLabel: text("实际", "Actual"),
      secondaryLabel: text("预测", "Forecast"),
    },
    list: {
      title: text("团队排名", "Team ranking"),
      description: text("按已确认收入排序", "Ranked by confirmed revenue"),
      items: [
        { title: text("Iris · 企业业务", "Iris · Enterprise"), meta: text("12 个活跃商机", "12 active opportunities"), value: "$86k", tone: "positive" },
        { title: text("Morgan · 大客户", "Morgan · Strategic"), meta: text("9 个活跃商机", "9 active opportunities"), value: "$72k", tone: "positive" },
        { title: text("Taylor · 成长业务", "Taylor · Growth"), meta: text("15 个活跃商机", "15 active opportunities"), value: "$58k", tone: "neutral" },
      ],
    },
    statuses: {
      title: text("Pipeline 阶段", "Pipeline stages"),
      description: text("当前商机的阶段分布", "Current opportunity distribution"),
      items: [
        { label: text("线索", "Lead"), value: "235", meta: text("$420k", "$420k"), progress: 76, tone: "blue" },
        { label: text("方案", "Proposal"), value: "84", meta: text("$192k", "$192k"), progress: 48, tone: "amber" },
        { label: text("谈判", "Negotiation"), value: "52", meta: text("$129k", "$129k"), progress: 32, tone: "green" },
        { label: text("赢单", "Closed won"), value: "36", meta: text("$87k", "$87k"), progress: 22, tone: "green" },
      ],
    },
    table: {
      title: text("重点客户", "Priority accounts"),
      description: text("服务端筛选与阶段跟进边界", "Server-filtered account and stage follow-up boundary"),
      filter: text("筛选客户…", "Filter accounts…"),
      columns: [text("客户", "Account"), text("负责人", "Owner"), text("金额", "Value"), text("阶段", "Stage")],
      rows: [
        { cells: ["Northstar Labs", "Iris", "$86k"], status: text("方案", "Proposal"), tone: "warning" },
        { cells: ["Atlas Retail", "Morgan", "$72k"], status: text("谈判", "Negotiation"), tone: "neutral" },
        { cells: ["Vertex Health", "Taylor", "$58k"], status: text("赢单", "Closed won"), tone: "positive" },
        { cells: ["Helio Systems", "Robin", "$44k"], status: text("线索", "Lead"), tone: "neutral" },
        { cells: ["Cedar Finance", "Alex", "$39k"], status: text("风险", "At risk"), tone: "danger" },
      ],
    },
  },
  {
    id: "commerce",
    recipeId: "commerce-operations",
    status: "candidate",
    title: text("电商运营中心", "Commerce Operations"),
    description: text("同时观察交易结果、渠道结构、商品表现、库存和订单执行。", "Monitor transactions, channel mix, product performance, inventory, and order execution."),
    modules: [text("GMV 与转化", "GMV and conversion"), text("渠道结构", "Channel mix"), text("商品表现", "Product performance"), text("订单表格", "Orders table"), text("批量动作", "Bulk actions")],
    metrics: [
      { label: text("GMV", "GMV"), value: "¥928k", delta: "+8.9%", direction: "up", mockAggregation: "sum" },
      { label: text("订单", "Orders"), value: "3,248", delta: "+6.2%", direction: "up", mockAggregation: "sum" },
      { label: text("转化率", "Conversion"), value: "4.8%", delta: "+0.7%", direction: "up", mockAggregation: "average" },
      { label: text("客单价", "AOV"), value: "¥286", delta: "-1.3%", direction: "down", mockAggregation: "average" },
    ],
    chart: {
      title: text("GMV 与订单趋势", "GMV and order trend"),
      description: text("最近 12 周的交易规模", "Transaction volume over the last 12 weeks"),
      primary: [31, 37, 35, 46, 43, 56, 61, 58, 69, 74, 71, 82],
      secondary: [25, 29, 31, 35, 39, 42, 47, 51, 55, 59, 63, 68],
      primaryLabel: text("GMV", "GMV"),
      secondaryLabel: text("订单", "Orders"),
    },
    list: {
      title: text("热销商品", "Best-selling products"),
      description: text("销售额与库存健康度", "Revenue and inventory health"),
      items: [
        { title: text("工作室台灯", "Studio lamp"), meta: text("库存 142", "142 in stock"), value: "¥128k", tone: "positive" },
        { title: text("旅行背包", "Travel pack"), meta: text("库存 36", "36 in stock"), value: "¥96k", tone: "warning" },
        { title: text("桌面系统", "Desk system"), meta: text("库存 84", "84 in stock"), value: "¥82k", tone: "positive" },
      ],
    },
    statuses: {
      title: text("订单状态", "Order status"),
      description: text("当前订单履约分布", "Current fulfillment distribution"),
      items: [
        { label: text("新订单", "New"), value: "43", meta: text("+0.5%", "+0.5%"), progress: 74, tone: "blue" },
        { label: text("处理中", "Processing"), value: "12", meta: text("-0.3%", "-0.3%"), progress: 38, tone: "amber" },
        { label: text("已完成", "Completed"), value: "40", meta: text("+0.5%", "+0.5%"), progress: 82, tone: "green" },
        { label: text("退货", "Return"), value: "2", meta: text("+0.1%", "+0.1%"), progress: 12, tone: "red" },
      ],
    },
    table: {
      title: text("订单明细", "Order detail"),
      description: text("当前页选择、批量履约与导出边界", "Current-page selection, bulk fulfillment, and export boundary"),
      filter: text("筛选订单…", "Filter orders…"),
      columns: [text("订单", "Order"), text("渠道", "Channel"), text("金额", "Amount"), text("状态", "Status")],
      rows: [
        { cells: ["#1083", "直营", "¥2,486"], status: text("新订单", "New"), tone: "neutral" },
        { cells: ["#1082", "社交渠道", "¥1,920"], status: text("处理中", "Processing"), tone: "warning" },
        { cells: ["#1081", "搜索渠道", "¥1,684"], status: text("已完成", "Completed"), tone: "positive" },
        { cells: ["#1080", "直营", "¥1,428"], status: text("已完成", "Completed"), tone: "positive" },
        { cells: ["#1079", "联盟渠道", "¥986"], status: text("退货", "Return"), tone: "danger" },
      ],
    },
  },
  {
    id: "agent-ops",
    recipeId: "agent-operations",
    status: "candidate",
    title: text("Agent 运行中心", "Agent Operations"),
    description: text("统一观察请求规模、成本、延迟、错误、Trace 和模型路由。", "Observe request volume, cost, latency, errors, traces, and model routing."),
    modules: [text("请求与成本", "Requests and cost"), text("P95 延迟", "P95 latency"), text("错误代码", "Error codes"), text("模型分布", "Model mix"), text("Trace 表格", "Trace table")],
    metrics: [
      { label: text("请求量", "Requests"), value: "1.24m", delta: "+18.2%", direction: "up", mockAggregation: "sum" },
      { label: text("成本", "Cost"), value: "$6.8k", delta: "-5.3%", direction: "down", mockAggregation: "sum" },
      { label: text("P95 延迟", "P95 latency"), value: "1.8s", delta: "-210ms", direction: "down", mockAggregation: "average" },
      { label: text("错误率", "Error rate"), value: "0.42%", delta: "-0.08%", direction: "down", mockAggregation: "average" },
    ],
    chart: {
      title: text("请求、延迟与成本", "Requests, latency, and cost"),
      description: text("最近 24 小时的运行趋势", "Runtime trend over the last 24 hours"),
      primary: [45, 52, 49, 61, 56, 68, 64, 76, 71, 84, 80, 91],
      secondary: [64, 61, 58, 56, 53, 50, 48, 45, 43, 41, 38, 36],
      primaryLabel: text("请求量", "Requests"),
      secondaryLabel: text("P95 延迟", "P95 latency"),
    },
    list: {
      title: text("模型路由", "Model routing"),
      description: text("请求分布与成功率", "Request distribution and success rate"),
      items: [
        { title: text("gpt-5.6", "gpt-5.6"), meta: text("99.94% 成功率", "99.94% success"), value: "742k", tone: "positive" },
        { title: text("gpt-5.6-terra", "gpt-5.6-terra"), meta: text("99.91% 成功率", "99.91% success"), value: "318k", tone: "positive" },
        { title: text("gpt-5.3-spark", "gpt-5.3-spark"), meta: text("99.87% 成功率", "99.87% success"), value: "180k", tone: "warning" },
      ],
    },
    statuses: {
      title: text("错误代码", "Error codes"),
      description: text("最近一小时的主要失败原因", "Top failure reasons in the last hour"),
      items: [
        { label: text("RATE_LIMIT", "RATE_LIMIT"), value: "28", meta: text("自动退避", "Auto backoff"), progress: 62, tone: "amber" },
        { label: text("UPSTREAM_TIMEOUT", "UPSTREAM_TIMEOUT"), value: "16", meta: text("重试中", "Retrying"), progress: 38, tone: "red" },
        { label: text("CONTRACT_ERROR", "CONTRACT_ERROR"), value: "9", meta: text("待处理", "Needs review"), progress: 24, tone: "red" },
        { label: text("CANCELLED", "CANCELLED"), value: "6", meta: text("用户取消", "User cancelled"), progress: 14, tone: "blue" },
      ],
    },
    table: {
      title: text("运行 Trace", "Runtime traces"),
      description: text("Trace 查询、详情与重试为本地概念演示", "Trace query, detail, and retry are local concept interactions"),
      filter: text("筛选 Trace…", "Filter traces…"),
      columns: [text("Trace", "Trace"), text("模型", "Model"), text("延迟", "Latency"), text("状态", "Status")],
      rows: [
        { cells: ["tr_9fe21", "gpt-5.6", "1.2s"], status: text("成功", "Success"), tone: "positive" },
        { cells: ["tr_9fe18", "gpt-5.6-terra", "2.8s"], status: text("超时", "Timeout"), tone: "danger" },
        { cells: ["tr_9fe12", "gpt-5.3-spark", "0.6s"], status: text("成功", "Success"), tone: "positive" },
        { cells: ["tr_9fd98", "gpt-5.6", "1.9s"], status: text("重试", "Retry"), tone: "warning" },
        { cells: ["tr_9fd76", "gpt-5.6-terra", "1.4s"], status: text("成功", "Success"), tone: "positive" },
      ],
    },
  },
  {
    id: "crm",
    recipeId: "crm-workspace",
    status: "candidate",
    title: text("CRM 客户工作台", "CRM Workspace"),
    description: text("围绕客户阶段组织线索、商机、跟进任务和下一步行动。", "Organize leads, deals, follow-up tasks, and next actions around customer stages."),
    modules: [text("客户分层", "Customer tiers"), text("线索来源", "Lead sources"), text("跟进任务", "Follow-up tasks"), text("Pipeline", "Pipeline"), text("客户台账", "Customer ledger")],
    metrics: [
      { label: text("客户", "Customers"), value: "1,890", delta: "+10.4%", direction: "up", mockAggregation: "snapshot" },
      { label: text("商机", "Deals"), value: "1,300", delta: "-0.8%", direction: "down", mockAggregation: "snapshot" },
      { label: text("收入", "Revenue"), value: "$435k", delta: "+20.1%", direction: "up", mockAggregation: "sum" },
      { label: text("续约率", "Renewal"), value: "92.4%", delta: "+3.6%", direction: "up", mockAggregation: "average" },
    ],
    chart: {
      title: text("客户增长", "Customer growth"),
      description: text("最近 12 个月的新增与活跃客户", "New and active customers over the last 12 months"),
      primary: [28, 34, 31, 43, 40, 51, 48, 59, 56, 68, 65, 77],
      secondary: [44, 47, 49, 52, 55, 58, 61, 64, 67, 70, 73, 76],
      primaryLabel: text("新增客户", "New customers"),
      secondaryLabel: text("活跃客户", "Active customers"),
    },
    list: {
      title: text("跟进任务", "Follow-up tasks"),
      description: text("即将到期的客户动作", "Upcoming customer actions"),
      items: [
        { title: text("跟进 Northstar", "Follow up Northstar"), meta: text("今天 · 高优先级", "Today · High priority"), value: "Today", tone: "danger" },
        { title: text("准备季度报告", "Prepare quarterly report"), meta: text("明天 · 中优先级", "Tomorrow · Medium priority"), value: "Tomorrow", tone: "warning" },
        { title: text("更新客户资料", "Update customer profile"), meta: text("10 月 15 日 · 低优先级", "Oct 15 · Low priority"), value: "Oct 15", tone: "neutral" },
      ],
    },
    statuses: {
      title: text("销售 Pipeline", "Sales pipeline"),
      description: text("当前商机金额与阶段占比", "Deal value and stage distribution"),
      items: [
        { label: text("线索", "Lead"), value: "235", meta: text("$420k", "$420k"), progress: 76, tone: "blue" },
        { label: text("已评估", "Qualified"), value: "146", meta: text("$267k", "$267k"), progress: 58, tone: "green" },
        { label: text("方案", "Proposal"), value: "84", meta: text("$192k", "$192k"), progress: 42, tone: "amber" },
        { label: text("谈判", "Negotiation"), value: "52", meta: text("$129k", "$129k"), progress: 27, tone: "red" },
      ],
    },
    table: {
      title: text("客户台账", "Customer ledger"),
      description: text("概念预览；Contract、持久化跟进和权限仍待定义", "Concept preview; contract, persistent follow-up, and permissions remain undefined"),
      filter: text("筛选客户…", "Filter customers…"),
      columns: [text("客户", "Customer"), text("负责人", "Owner"), text("金额", "Value"), text("状态", "Status")],
      rows: [
        { cells: ["Northstar Labs", "Iris", "$86k"], status: text("活跃", "Active"), tone: "positive" },
        { cells: ["Atlas Retail", "Morgan", "$72k"], status: text("待跟进", "Follow-up"), tone: "warning" },
        { cells: ["Vertex Health", "Taylor", "$58k"], status: text("活跃", "Active"), tone: "positive" },
        { cells: ["Helio Systems", "Robin", "$44k"], status: text("流失风险", "At risk"), tone: "danger" },
        { cells: ["Cedar Finance", "Alex", "$39k"], status: text("新客户", "New"), tone: "neutral" },
      ],
    },
  },
  {
    id: "finance",
    recipeId: "finance-review",
    status: "candidate",
    title: text("财务复盘中心", "Finance Review"),
    description: text("把现金流、预算偏差、异常项目、交易和对账动作放到一处。", "Bring cash flow, budget variance, anomalies, transactions, and reconciliation together."),
    modules: [text("现金流", "Cash flow"), text("预算偏差", "Budget variance"), text("异常检测", "Anomaly detection"), text("交易表格", "Transactions"), text("对账状态", "Reconciliation")],
    metrics: [
      { label: text("现金余额", "Cash balance"), value: "¥1.25m", delta: "+12.5%", direction: "up", mockAggregation: "snapshot" },
      { label: text("净利润", "Net profit"), value: "¥387k", delta: "+8.5%", direction: "up", mockAggregation: "sum" },
      { label: text("支出", "Expenses"), value: "¥264k", delta: "+5.5%", direction: "down", mockAggregation: "sum" },
      { label: text("待对账", "To reconcile"), value: "24", delta: "-18.0%", direction: "down", mockAggregation: "snapshot" },
    ],
    chart: {
      title: text("月度收支", "Monthly cash flow"),
      description: text("最近 6 个月的收入与支出", "Income and expenses over the last six months"),
      primary: [46, 53, 49, 64, 61, 76, 72, 82, 79, 88, 85, 94],
      secondary: [38, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72],
      primaryLabel: text("收入", "Income"),
      secondaryLabel: text("支出", "Expenses"),
    },
    list: {
      title: text("收入来源", "Income sources"),
      description: text("本月收入结构", "Income mix this month"),
      items: [
        { title: text("订阅收入", "Subscriptions"), meta: text("占比 38%", "38% of income"), value: "¥350k", tone: "positive" },
        { title: text("项目收入", "Projects"), meta: text("占比 31%", "31% of income"), value: "¥280k", tone: "positive" },
        { title: text("服务收入", "Services"), meta: text("占比 20%", "20% of income"), value: "¥180k", tone: "neutral" },
      ],
    },
    statuses: {
      title: text("预算与异常", "Budget and anomalies"),
      description: text("预算使用率与需要复核的项目", "Budget usage and items requiring review"),
      items: [
        { label: text("市场预算", "Marketing budget"), value: "78%", meta: text("正常", "Healthy"), progress: 78, tone: "green" },
        { label: text("研发预算", "Engineering budget"), value: "64%", meta: text("正常", "Healthy"), progress: 64, tone: "blue" },
        { label: text("运营预算", "Operations budget"), value: "82%", meta: text("接近阈值", "Near threshold"), progress: 82, tone: "amber" },
        { label: text("异常交易", "Anomalies"), value: "7", meta: text("需要复核", "Needs review"), progress: 34, tone: "red" },
      ],
    },
    table: {
      title: text("交易与对账", "Transactions and reconciliation"),
      description: text("概念预览；真实审批、审计与写入属于应用后端", "Concept preview; approvals, audit, and mutations belong to the application backend"),
      filter: text("筛选交易…", "Filter transactions…"),
      columns: [text("交易", "Transaction"), text("日期", "Date"), text("金额", "Amount"), text("状态", "Status")],
      rows: [
        { cells: ["企业订阅续费", "07-26", "+¥164k"], status: text("已对账", "Reconciled"), tone: "positive" },
        { cells: ["云服务支出", "07-25", "-¥72k"], status: text("待复核", "Review"), tone: "warning" },
        { cells: ["渠道结算", "07-23", "-¥38k"], status: text("已对账", "Reconciled"), tone: "positive" },
        { cells: ["项目回款", "07-20", "+¥98k"], status: text("处理中", "Processing"), tone: "neutral" },
        { cells: ["异常退款", "07-18", "-¥12k"], status: text("异常", "Anomaly"), tone: "danger" },
      ],
    },
  },
]

export const siteText = {
  zh: {
    nav: { dashboards: "Dashboards", agentKit: "Agent Kit", catalog: "功能目录", workflow: "交付流程", github: "GitHub" },
    header: { search: "搜索页面与操作…", command: "命令面板", language: "Switch to English", theme: "切换主题", menu: "打开导航", close: "关闭导航" },
    page: { available: "Available", candidate: "Candidate · 概念预览", install: "复制 dry-run", copied: "已复制", details: "功能组合" },
    common: { filter: "筛选", columns: "列", selected: "0 行已选择", previous: "上一页", next: "下一页", export: "导出", viewAll: "查看全部" },
    catalog: { title: "Dashboard 功能目录", description: "按功能组合、状态和交付边界选择 Dashboard。", status: "状态", modules: "功能组合", boundary: "交付边界", action: "查看" },
    workflow: { title: "Agent 交付流程", description: "从需求到 Proof 的可检查交付链。", steps: [["Understand", "识别技术栈、业务目标和数据边界。"], ["Match", "只从 Available Recipe 中生成安装计划。"], ["Install", "先 dry-run，再写入可编辑源码。"], ["Bind", "通过单一 Data Adapter 映射项目数据。"], ["Prove", "验证类型、构建、四态、响应式与可访问性。"]] },
  },
  en: {
    nav: { dashboards: "Dashboards", agentKit: "Agent Kit", catalog: "Capability catalog", workflow: "Delivery rail", github: "GitHub" },
    header: { search: "Search pages and actions…", command: "Command palette", language: "切换为中文", theme: "Toggle theme", menu: "Open navigation", close: "Close navigation" },
    page: { available: "Available", candidate: "Candidate · Concept preview", install: "Copy dry-run", copied: "Copied", details: "Capability set" },
    common: { filter: "Filter", columns: "Columns", selected: "0 row(s) selected", previous: "Previous", next: "Next", export: "Export", viewAll: "View all" },
    catalog: { title: "Dashboard capability catalog", description: "Choose a dashboard by capability set, status, and delivery boundary.", status: "Status", modules: "Capability set", boundary: "Delivery boundary", action: "View" },
    workflow: { title: "Agent delivery rail", description: "An inspectable path from request to proof.", steps: [["Understand", "Identify the stack, business goal, and data boundary."], ["Match", "Create install plans from Available recipes only."], ["Install", "Dry-run before writing editable source."], ["Bind", "Map project data through one Data Adapter."], ["Prove", "Verify type, build, four states, responsive behavior, and a11y."]] },
  },
} satisfies Record<Locale, unknown>
