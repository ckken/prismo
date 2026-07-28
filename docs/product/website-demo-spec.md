# 官网与 Dashboard Catalog 规范

## 目标

用户在 10 秒内理解：这是给 Coding Agent 使用的 shadcn-compatible Recipe Kit，交付 editable source，并把 Proof 纳入流程。

## 信息架构与路由

官网使用 TanStack Router Browser History；根路由先解释 Agenic 的 Agent-first 交付闭环，每个 Dashboard 则是可直接访问、可复制和可回退的独立 Demo 路由。

| 路由 | 用例 | 突出的功能组合 |
|---|---|---|
| `/` | Agenic 首页 | Intent、Spec、Recipe、Proof 与首个真实 Demo |
| `/dashboard/default` | 通用经营总览 | KPI、趋势、交付动态、运营表格、Data Adapter |
| `/dashboard/sales` | 销售指挥中心 | 目标、预测、团队排名、Pipeline、重点客户 |
| `/dashboard/commerce` | 电商运营中心 | GMV、渠道、商品、履约状态、订单表格 |
| `/dashboard/agent-ops` | Agent 运营中心 | 运行量、成功率、成本、队列、异常运行 |
| `/dashboard/crm` | CRM 工作台 | 季度目标、客户来源、任务、Pipeline、客户表格 |
| `/dashboard/finance` | 财务复盘 | 收支、利润、预算、异常、交易与对账 |
| `/catalog` | 功能目录 | 六个用例的功能组合、状态与交付边界 |
| `/workflow` | 交付流程 | Understand、Match、Install、Bind、Prove |

Dashboard 身份由路径表达；查询参数只保留给页面筛选等局部状态。首页不伪装为可运行的交付结果，而是链接到真实 Dashboard Demo 和 Workflow。

## 视觉原则

- 官网首页使用 HeroUI v3 的上游交互与样式基础；Dashboard Demo 保留已验证的 shadcn-compatible SidebarProvider、Sidebar、SidebarInset 和移动 Sheet，直至 HeroUI Renderer 通过端到端 Proof。
- Dashboard 页头使用 shadcn `Popover + Calendar` 时间区间组件，提供最近 7 / 28 / 90 天、最近 1 年与自定义起止日期。
- 参考 shadcn UI Kit 的信息密度和组合方式，但保持 Agenic 的品牌、Recipe 状态和真实交付边界。
- 每个路由先展示该 Dashboard 的功能组合，再展示与场景匹配的卡片、趋势、列表和表格。
- 桌面 Sidebar 可折叠为图标栏；移动端使用 `sidebar-07` 的 Sheet 抽屉，内容保持单列。

## 静态运行边界

- GitHub Pages 不接在线 LLM，Showcase 是确定性演示。
- 六个用例的数据来自本地确定性 Mock；同一用例与时间区间总是生成相同结果，切换区间会重算指标、趋势点和表格日期。
- 时间区间状态由 Dashboard Layout 持有，使用 TanStack Router 切换用例时继续保留；刷新后恢复最近 28 天。
- `dashboard-overview-01` 是唯一首发可安装项。
- Sales、Commerce、Agent Ops、CRM、Finance 是 Candidate，只展示概念预览，不显示安装命令。
- Registry JSON 与官网同源发布到 `/r/*.json`。
- TanStack Browser History 使用 Pages basepath；构建时为公开路由生成静态 `index.html`，并生成 `404.html` 回退，支持 GitHub Pages 深层链接。

## 响应式验收

- 375、768、1440 均无页面级横向溢出。
- 移动端菜单、命令面板、用例导航和复制命令可操作。
- 时间预设与自定义区间均可操作，选择后指标、趋势周期和表格日期同步变化。
- 六个 Dashboard、Catalog、Workflow 的深层 URL 可直接打开并刷新。
- 深浅主题均可读，`focus-visible` 清楚。
- 支持 `prefers-reduced-motion`。
