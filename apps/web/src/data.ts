import { z } from "zod"

export const scenarioIds = ["sales", "commerce", "agent-ops"] as const
export type ScenarioId = (typeof scenarioIds)[number]
export type DemoState = "success" | "loading" | "empty" | "contract-error"

const scenarioSchema = z.object({
  id: z.enum(scenarioIds),
  label: z.string(),
  eyebrow: z.string(),
  prompt: z.string(),
  metrics: z.array(
    z.object({ label: z.string(), value: z.string(), delta: z.string() }),
  ),
  rows: z.array(
    z.object({ name: z.string(), owner: z.string(), status: z.string(), value: z.string() }),
  ),
  chart: z.array(z.number()),
  contractPath: z.string(),
})

export type Scenario = z.infer<typeof scenarioSchema>

export const scenarios = z.array(scenarioSchema).parse([
  {
    id: "sales",
    label: "Sales",
    eyebrow: "Sales command center",
    prompt:
      "Build a sales dashboard with target progress, weekly trend, rep ranking, and a server-filtered account table.",
    metrics: [
      { label: "Revenue", value: "$842k", delta: "+12.4%" },
      { label: "Target", value: "86.2%", delta: "+4.1%" },
      { label: "Pipeline", value: "$1.8m", delta: "+9.8%" },
    ],
    rows: [
      { name: "Northwind", owner: "Maya", status: "Qualified", value: "$84k" },
      { name: "Acme Labs", owner: "Theo", status: "Proposal", value: "$67k" },
      { name: "Sora Retail", owner: "Iris", status: "Negotiation", value: "$52k" },
    ],
    chart: [34, 48, 42, 61, 57, 72, 68, 83, 79, 92, 88, 104],
    contractPath: "accounts.items[2].owner.name",
  },
  {
    id: "commerce",
    label: "Commerce",
    eyebrow: "E-commerce operations",
    prompt:
      "Create an operations dashboard for GMV, conversion, channels, products, and order batch actions.",
    metrics: [
      { label: "GMV", value: "$126k", delta: "+8.9%" },
      { label: "Orders", value: "3,248", delta: "+6.2%" },
      { label: "Conversion", value: "4.8%", delta: "+0.7%" },
    ],
    rows: [
      { name: "Studio lamp", owner: "Direct", status: "Healthy", value: "$18k" },
      { name: "Travel pack", owner: "Social", status: "Watch", value: "$14k" },
      { name: "Desk system", owner: "Search", status: "Healthy", value: "$12k" },
    ],
    chart: [28, 34, 31, 46, 43, 55, 62, 58, 71, 77, 74, 86],
    contractPath: "orders.items[8].currency",
  },
  {
    id: "agent-ops",
    label: "Agent Ops",
    eyebrow: "Agent operations",
    prompt:
      "Show model usage, cost, P95 latency, error rate, and the most frequent failure codes.",
    metrics: [
      { label: "Requests", value: "1.24m", delta: "+18.2%" },
      { label: "Cost", value: "$6.8k", delta: "-5.3%" },
      { label: "P95 latency", value: "1.8s", delta: "-210ms" },
    ],
    rows: [
      { name: "gpt-5.6", owner: "Reasoning", status: "99.94%", value: "742k" },
      { name: "gpt-5.6-terra", owner: "General", status: "99.91%", value: "318k" },
      { name: "gpt-5.3-spark", owner: "Fast", status: "99.87%", value: "180k" },
    ],
    chart: [58, 64, 61, 72, 66, 81, 78, 88, 84, 96, 91, 101],
    contractPath: "series[4].cost.usd",
  },
])

