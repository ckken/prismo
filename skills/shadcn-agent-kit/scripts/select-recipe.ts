const request = (process.argv.slice(2).join(" ") || "").toLowerCase()

const recipes = [
  {
    id: "dashboard-overview-01",
    status: "available",
    keywords: ["dashboard", "overview", "kpi", "metric", "table", "仪表盘", "看板", "总览", "指标", "表格"],
    fit: "KPI overview with a managed client-side table and four explicit data states",
  },
  {
    id: "sales-command-center",
    status: "candidate",
    keywords: ["sales", "pipeline", "销售", "商机"],
  },
  {
    id: "commerce-operations",
    status: "candidate",
    keywords: ["commerce", "order", "gmv", "电商", "订单"],
  },
  {
    id: "agent-operations",
    status: "candidate",
    keywords: ["agent", "latency", "token", "智能体", "调用量"],
  },
] as const

const scored = recipes
  .filter((recipe) => recipe.status === "available")
  .map((recipe) => ({ ...recipe, score: recipe.keywords.filter((keyword) => request.includes(keyword)).length }))
  .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))

const selected = scored[0]?.score > 0 ? scored[0] : null

console.log(JSON.stringify({
  normalizedRequest: request.trim(),
  catalogVersion: "0.1.0",
  considered: scored,
  selected,
  action: selected ? "preview" : "clarify-or-reject",
  note: selected ? "Run shadcn add with --dry-run before installation." : "No Available recipe matched. Candidate concepts are not installable.",
}, null, 2))
