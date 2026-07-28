---
name: dashboard-shadcn-delivery
description: Deliver a production dashboard in an existing shadcn-compatible app: preserve its stack, define the data contract, add filters and responsive states, then verify the route end to end.
---

# Dashboard Shadcn Delivery

将现有项目中的业务数据交付为可维护的 Dashboard，而不是只拼出一张静态页面。适用于经营复盘、运营分析、管理看板、账户监控等请求，且目标项目已经使用或计划使用 shadcn/ui-compatible 组件。

本 Skill 从一个已落地的 React、TanStack Query、TanStack Router、Tailwind 与 ECharts Dashboard 中提炼：认证后的品牌和日期筛选、前后端明确的读模型、单一数据适配层、开发 Mock 隔离，以及完整的加载/空/错误/成功状态。

## 与官方 shadcn Skill 协作

本 Skill 是官方 `shadcn/ui` Skill 的上层交付流程，不能替代它。先确保目标项目已按 [shadcn Skills 文档](https://ui.shadcn.com/docs/skills) 安装官方 Skill；它负责读取 `components.json`、执行 `shadcn info --json`、查找组件文档与安全地调用 `init`、`search`、`view`、`diff`、`add` 等 CLI 能力。

```bash
# 在目标项目中，按其包管理器使用对应的 dlx；Bun 项目示例：
bunx skills add shadcn/ui

# 再安装本项目的 Dashboard 交付流程：
npx skills add ckken/shadcnagent --skill dashboard-shadcn-delivery -a codex -y
```

- 官方 Skill 是 **组件项目事实来源**：框架、Tailwind 版本、aliases、base library、图标库、已安装组件和解析路径均以其 `shadcn info --json` 结果为准。
- 本 Skill 是 **Dashboard 领域事实来源**：DashboardSpec、数据契约、授权边界、查询状态、表格等级、四态和验收证据。
- 添加或替换原语前，先让官方 Skill 使用 `shadcn search`、`shadcn docs` 或 MCP 查证当前 API，再预览 `shadcn add --dry-run`。不要将本 Skill 中列出的原语名当作跨版本 API 保证。
- 若项目还没有 `components.json`，先停止 Dashboard 组件改造，按官方 `shadcn init` 流程取得用户确认；数据契约和页面结构分析可继续保持只读。

## 先界定交付边界

1. 阅读目标项目的 `AGENTS.md`、`package.json`、路由、认证方式和现有 UI 原语，并复用官方 Skill 的 `shadcn info --json` 结果。
   - 保持已有包管理器、构建工具、路径别名和 shadcn 配置；不要为了 Dashboard 迁移技术栈。
   - 多个 `components.json` 或多个前端工作区时，先要求用户指定挂载位置，不要猜测。
2. 写出 DashboardSpec，并在改动前暴露未决项：受众和权限、指标定义、过滤条件、时间口径、数据延迟、表格规模、刷新方式和空数据语义。
3. 定义最小读模型，再写组件。读模型至少包含：
   - `filters`：当前生效的筛选值、可选值、最小/最大日期；
   - `updatedAt` 与数据来源标识（例如受控开发 Mock 或 API）；
   - KPI、趋势、分布、明细行和结论；
   - 每个可能为空的区块使用空数组或显式 `null`，不要用缺失字段表达状态。
4. 鉴权和数据范围必须由服务端执行。前端可隐藏无权入口，但不能把品牌、租户、角色或日期边界当作可信输入。

## 实施顺序

1. **建立数据边界。** 在单独的 `dashboard-data` 或 `dashboard-api` 模块中声明查询、响应和空值模型。该模块负责：组装查询参数、携带既有认证凭据、将 HTTP 401/403/404/5xx 映射成可区分错误，以及把传输数据映射为 UI 所需视图模型。
   - 页面与图表不得直接 `fetch`，也不要把后端字段名散落在 JSX。
   - 如果项目已有 schema 工具（如 Zod），在适配层解析运行时响应；若没有，至少对关键数组、数值和日期做防御性校验。
   - 开发 Mock 必须是显式、仅开发环境可启用的路径；生产环境不能悄悄回退到虚构数据。
2. **让筛选状态可解释。** 将“编辑中的筛选”与“已应用查询”分开；查询键包含所有已应用的筛选值。日期范围应校验顺序和后端允许范围，切换筛选后取消或忽略过期请求。
3. **用已有 shadcn 原语组装布局。** 优先复用官方 Skill 已识别的 `Card`、`Button`、`Select`、`Popover`、`Calendar`、`Table`、`Skeleton`、`Alert`、`Sheet` 和既有侧边栏。缺少原语时，通过官方 Skill 的组件发现与 `shadcn add --dry-run` 预览改动；不要手工覆盖未知的生成文件。
4. **按信息层级实现。** 推荐顺序是筛选栏与数据来源提示 → KPI 卡片 → 趋势/结构图 → 排名或明细表 → 可操作结论。每个图表需要清晰标题、单位、时间口径、零值处理和同等信息的文本或表格替代；不要只依赖颜色传达趋势。
5. **选择正确的表格等级。**
   - L0：小型只读摘要；允许响应式横向滚动。
   - L1：客户端排序、筛选、分页，数据量明确可控。
   - L2：服务端控制分页、排序和筛选；请求携带总数、取消与权限边界。导出任务、审计、跨页选择、虚拟化和批量操作仍由应用/后端负责，不是 shadcn Table 的职责。
6. **实现四态和恢复路径。**
   - 加载：使用与最终布局匹配的 Skeleton，保留已成功数据时避免整页闪烁；
   - 空：解释筛选范围内无数据，并提供清除筛选或重试动作；
   - 错误：展示可理解的错误、重试入口和可安全给出的状态；401 跳转或触发既有登录流程，403 不泄露数据范围；
   - 成功：显示最近更新时间、当前筛选和受控数据来源。
7. **响应式与可访问性。** 在 375、768、1440 宽度检查筛选栏、指标网格、图表、侧边栏、表格和弹层。图表容器必须随尺寸变化重算；键盘可达的筛选、可见焦点、语义化标题/表头和足够对比度是交付门槛。

## 不要越界

- 不提交、推送、部署、修改数据库或覆盖已有文件，除非用户明确授权。
- 不把私有业务底表、凭据、真实客户名或生产 URL 写入组件、Mock、截图或 Skill。
- 不把构建成功当成数据正确、权限正确、可访问或生产可用。
- 不为“看起来完整”编造指标、筛选选项、接口、分页总数或验收证据。

## 验收与输出

完成后，按以下结构报告，明确区分通过、失败和未验证：

- `ProjectProfile`：检测到的工作区、包管理器、路由、shadcn 配置、已有原语与风险；
- `DashboardSpec`：用户、权限、指标、筛选、数据来源、图表、表格等级和未决项；
- `DataContract`：查询参数、读模型、授权边界、适配层位置与错误映射；
- `ChangeSet`：路由、组件、适配层、依赖和迁移说明；
- `ProofReport`：类型检查、测试、生产构建、四态、375/768/1440、键盘/基础语义、权限与数据来源检查。

运行目标项目现有的类型检查、测试和生产构建命令。若项目是 Bun workspace，使用其根脚本或明确的 `bun run --cwd <workspace> <script>` 形式，避免假定所有包管理器的工作区参数相同。
