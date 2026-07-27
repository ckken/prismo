# 场景目录

Catalog version: `0.1.0`。

机器真相源为 `packages/dashboard-agent/src/catalog.ts`；本文只做产品说明，Registry build 与选择器都直接消费该 Catalog。

| Recipe | 状态 | 使用场景 | 表格等级 | 是否可安装 |
|---|---|---|---|---|
| `dashboard-overview-01` | Available | KPI + 趋势图 + 客户端或受控服务端表格 | L2 | 是 |
| `sales-command-center` | Candidate | 目标、趋势、排名、客户表 | L2 | 否 |
| `commerce-operations` | Candidate | GMV、渠道、订单、商品、批量动作 | L2 | 否 |
| `agent-operations` | Candidate | 调用量、成本、P95、错误、模型分布 | L1/L2 | 否 |
| `crm-workspace` | Candidate | 客户、阶段、跟进、任务 | L2 | 否 |
| `finance-review` | Candidate | 收支、预算、异常、对账 | L2 | 否 |

机器选择必须先执行 `status === "Available"`，再做关键词和能力评分。没有匹配项时返回澄清或拒绝，不能用 Candidate 生成安装计划。

新 Recipe 只有同时满足 Registry schema、CLI dry-run/安装、Fixture typecheck/build、四态、响应式和边界文档，才可转为 Available。
