# 官网与 Dashboard Catalog 规范

## 目标

用户在 10 秒内理解：这是给 Coding Agent 使用的 shadcn-compatible Recipe Kit，交付 editable source，并把 Proof 纳入流程。

## 信息架构与路由

官网使用 TanStack Router Browser History，每个 Dashboard 是可直接访问、可复制和可回退的独立路由。

| 路由 | 用例 | 突出的功能组合 |
|---|---|---|
| `/dashboard/default` | 通用经营总览 | KPI、趋势、交付动态、运营表格、Data Adapter |
| `/dashboard/sales` | 销售指挥中心 | 目标、预测、团队排名、Pipeline、重点客户 |
| `/dashboard/commerce` | 电商运营中心 | GMV、渠道、商品、履约状态、订单表格 |
| `/dashboard/agent-ops` | Agent 运营中心 | 运行量、成功率、成本、队列、异常运行 |
| `/dashboard/crm` | CRM 工作台 | 季度目标、客户来源、任务、Pipeline、客户表格 |
| `/dashboard/finance` | 财务复盘 | 收支、利润、预算、异常、交易与对账 |
| `/catalog` | 功能目录 | 六个用例的功能组合、状态与交付边界 |
| `/workflow` | 交付流程 | Understand、Match、Install、Bind、Prove |
| `/playground/` | 独立演练入口 | Fixture、四态和 Recipe 预览 |

根路由 `/` 重定向到 `/dashboard/default`。Dashboard 身份由路径表达；查询参数只保留给页面筛选等局部状态。

## 视觉原则

- 使用管理后台式产品壳：桌面 256px 固定侧栏、紧凑工具栏、细边框、低阴影和中性画布。
- 参考 shadcn UI Kit 的信息密度和组合方式，但保持 Shadcn Agent Kit 的品牌、Recipe 状态和真实交付边界。
- 每个路由先展示该 Dashboard 的功能组合，再展示与场景匹配的卡片、趋势、列表和表格。
- 平板使用图标侧栏；移动端使用可关闭、可聚焦管理的 288px 抽屉，内容保持单列。

## 静态运行边界

- GitHub Pages 不接在线 LLM，Showcase 是确定性演示。
- `dashboard-overview-01` 是唯一首发可安装项。
- Sales、Commerce、Agent Ops、CRM、Finance 是 Candidate，只展示概念预览与 Playground 入口，不显示安装命令。
- Registry JSON 与官网同源发布到 `/r/*.json`。
- TanStack Browser History 使用 Pages basepath；构建时为公开路由生成静态 `index.html`，并生成 `404.html` 回退，支持 GitHub Pages 深层链接。

## 响应式验收

- 375、768、1440 均无页面级横向溢出。
- 移动端菜单、命令面板、用例导航和复制命令可操作。
- 六个 Dashboard、Catalog、Workflow 的深层 URL 可直接打开并刷新。
- 深浅主题均可读，`focus-visible` 清楚。
- 支持 `prefers-reduced-motion`。
