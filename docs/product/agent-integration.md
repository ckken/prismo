# Agent 接入与最少代码原则

## 接入方式

Agent 加载仓库内的 `skills/shadcn-agent-kit/`。首发以 Codex + Bun + Rsbuild Fixture 完成验证；其他宿主必须跑同一矩阵后才宣称支持。

| 阶段 | Agent 行为 | 确定性产物 |
|---|---|---|
| Inspect | 读取目标项目局部 | `ProjectProfile` |
| Select | 只评分 Available | `RecipeDecision` |
| Preview | `shadcn add --dry-run` | `InstallPlan` |
| Install | 用户确认后写入源码 | 文件与依赖清单 |
| Adapt | 业务字段映射到 Contract | 一个 Data Source / Adapter |
| Proof | 类型、构建、四态、响应式 | `ProofReport` |

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

`toDashboardOverview(raw)` 是项目侧唯一字段映射，输出 Recipe 的 `{ metrics, rows }` ViewModel。只有原始 API 已严格匹配该结构时才可省略映射并直接 `dashboardOverviewSchema.parse(raw)`。L2 列表可让 `TRaw` 使用 `{ items, total }`，但必须由 Adapter 转成对应 Recipe Contract，不能直接传给当前 L0 Recipe。

Fixture 与 REST Adapter 使用同一 Contract 测试。网络错误、权限错误、取消和 Contract mismatch 不合并为同一种状态。

## 表格能力边界

| 等级 | 覆盖 | 不覆盖 |
|---|---|---|
| L0 | 静态摘要、响应式滚动 | 排序、筛选、选择 |
| L1 | 客户端排序/筛选/分页、列显隐、行选择 | 大数据量和后台任务 |
| L2 | 受控服务端分页/排序/筛选、取消请求、总数 | 权限、审计、导出、虚拟化、跨页选择 |

类 Excel 的单元格编辑、公式、冻结区和协同不由 shadcn + TanStack Table 承诺。

## 安全边界

- Candidate 不能生成安装 URL。
- 未经授权不覆盖未知文件，不提交、不推送、不部署。
- Build 通过不等于 Contract、交互、无障碍或生产验收通过。
- Proof 必须分别记录 passed、failed、unverified。
