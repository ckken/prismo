# CLI 接入与最少代码原则

## 接入方式

`agenic` CLI 是唯一执行入口。仓库开发和当前验证使用：

```bash
bun run agenic inspect --cwd <project> --json
bun run agenic plan \
  --cwd <project> \
  --request "增加经营总览：3 个 KPI、趋势图和服务端分页表格" \
  --json
```

CLI 尚未发布为独立版本化 package，不能给出虚构的外部安装命令。在完成
`preview / apply / verify` 和发布矩阵前，外部 Agent 可以选择安装兼容 Skill bundle：

```bash
npx skills add ckken/agenic \
  --skill agenic-agent-kit \
  -a codex \
  -y
```

命令将 Skill 复制到 `.agents/skills/agenic-agent-kit/`。Skill 内置兼容 CLI bundle
`scripts/dashboard-agent.js`，离开仓库也能运行 `inspect` 和 `plan`；不会引用仓库
内部 `packages/` 路径。Skill 只负责使用流程和安全策略，不得实现另一套项目识别、
Recipe 选择或 Proof 逻辑。

当前以 Codex + Bun + Rsbuild Fixture 完成验证，其他宿主必须跑同一矩阵后才宣称支持。

安装后可直接给 Agent 请求：

```text
用 Agenic 增加经营总览：3 个 KPI、趋势图和服务端分页表格。
先 inspect 和 plan，展示 dry-run 与文件影响；确认后再安装、接入数据并给出 Proof。
```

需要人工查看机器计划时：

```bash
bun .agents/skills/agenic-agent-kit/scripts/dashboard-agent.js plan \
  --cwd . \
  --request "增加经营总览：3 个 KPI、趋势图、服务端分页表格" \
  --json
```

| 阶段 | Agent 行为 | 确定性产物 |
|---|---|---|
| Inspect | 定位目标 workspace，并以 `shadcn info --json` 读取项目真相 | `ProjectProfile` |
| Plan | 结构化需求，只评分兼容的 Available Recipe | `DashboardSpec` + `RecipeDecision` |
| Preview | `shadcn add --dry-run` | `InstallPlan` |
| Install | 用户确认后写入源码 | 文件与依赖清单 |
| Adapt | 业务字段映射到 Contract | 一个 Data Source / Adapter |
| Proof | 类型、构建、四态、响应式 | `ProofReport` |

当前 Dashboard vertical 的通用 shadcn 项目识别、Registry 搜索和安装交给固定版本的官方 CLI；Agenic 维护 DashboardSpec、领域选择、Adapter 和 Proof。HeroUI 是 Agenic 的上游 UI 基础，不是另一个 CLI 或 MCP 控制面。

当前 CLI 只负责只读 `inspect / plan`。安装、路由接入和 Proof 仍由 Coding Agent 按
plan 执行；尚未实现的 `agenic preview / apply / verify` 不作为可用命令宣传。
Accepted 的完整命令、退出码、schema 和门禁见
[CLI-first 基准线](cli-first-baseline.md)。

## 最少项目侧代码

Recipe 内部包含布局、UI 状态、Zod Contract 和 TanStack Table 配置。项目侧通常只保留：

```tsx
const raw = await salesSource.load(query, { signal })
const data = dashboardOverviewSchema.parse(toDashboardOverview(raw))
return <DashboardOverview01 data={data} />
```

当 API 字段与 Contract 已一致，Adapter 只负责请求与解析；需要字段映射时，映射集中在一个文件，页面不重复加工数据。

## Data Source seam

```ts
type Query = {
  page?: number
  pageSize?: number
  sort?: Array<{ id: string; desc: boolean }>
  filters?: Record<string, string | number | boolean>
}

interface DataSource<TQuery, TRaw> {
  load(query: TQuery, options?: { signal?: AbortSignal }): Promise<TRaw>
}
```

`toDashboardOverview(raw)` 是项目侧唯一字段映射，输出 Recipe 的 `{ metrics, chart, rows }` ViewModel。只有原始 API 已严格匹配该结构时才可省略映射并直接 `dashboardOverviewSchema.parse(raw)`。L2 列表可让 `TRaw` 使用 `{ items, total }`，由 Adapter 分别映射为 Recipe 数据和受控 `rowCount`。

Fixture 与 REST Adapter 使用同一 Contract 测试。网络错误、权限错误、取消和 Contract mismatch 不合并为同一种状态。

## 表格能力边界

| 等级 | 覆盖 | 不覆盖 |
|---|---|---|
| L0 | 静态摘要、响应式滚动 | 排序、筛选、选择 |
| L1 | 客户端排序/筛选/分页、列显隐、行选择 | 大数据量和后台任务 |
| L2 | 受控服务端分页/排序/筛选、取消请求、总数 | 权限、审计、导出、虚拟化、跨页选择 |

当前 `dashboard-overview-01` 同时支持内部客户端状态与外部受控查询，按最高能力标记为 L2；是否实际启用 L2 由接入方式决定。

类 Excel 的单元格编辑、公式、冻结区和协同不由 shadcn + TanStack Table 承诺。

## 安全边界

- Candidate 不能生成安装 URL。
- 未经授权不覆盖未知文件，不提交、不推送、不部署。
- 不建设或依赖 Agenic MCP Server；Agent 通过本地 CLI 执行。
- Build 通过不等于 Contract、交互、无障碍或生产验收通过。
- Proof 必须分别记录 passed、failed、unverified。
