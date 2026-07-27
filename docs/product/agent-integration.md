# Agent 接入与最少代码原则

## 接入方式

在目标 shadcn 项目根目录一键安装：

```bash
npx skills add ckken/shadcnagent \
  --skill shadcn-agent-kit \
  -a codex \
  -y
```

命令将 Skill 复制到 `.agents/skills/shadcn-agent-kit/`。Skill 内置独立
`scripts/dashboard-agent.js`，离开 Shadcn Agent Kit 仓库也能运行 `inspect` 和
`plan`；不会引用仓库内部 `packages/` 路径。首发以 Codex + Bun + Rsbuild Fixture
完成验证，其他宿主必须跑同一矩阵后才宣称支持。

安装后可直接给 Agent 请求：

```text
用 Shadcn Agent Kit 增加经营总览：3 个 KPI、趋势图和服务端分页表格。
先 inspect 和 plan，展示 dry-run 与文件影响；确认后再安装、接入数据并给出 Proof。
```

需要人工查看机器计划时：

```bash
bun .agents/skills/shadcn-agent-kit/scripts/dashboard-agent.js plan \
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

通用 shadcn 项目识别、Registry 搜索和安装交给固定版本的官方 CLI；本项目只维护 DashboardSpec、领域选择、Adapter 和 Proof。

当前 CLI 只负责只读 `inspect / plan`。安装、路由接入和 Proof 由 Coding Agent 按
Skill 工作流执行；尚未实现的 `dashboard-agent apply / verify` 不作为可用命令宣传。

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
- Build 通过不等于 Contract、交互、无障碍或生产验收通过。
- Proof 必须分别记录 passed、failed、unverified。
