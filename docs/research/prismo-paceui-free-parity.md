# Prismo × PaceUI：非商业能力对等研究

调研日期：2026-07-28。范围仅覆盖公开页面所述的**功能**；价格、试用、额度、许可证、付费支持均排除。PaceUI 是比较对象，不是依赖或兼容性承诺。

## 结论

Prismo 不应复刻 PaceUI 的托管 MCP 或 IDE 插件路径。其等价物是一个本地、可审查的交付链：Coding Agent 理解请求后调用 `Prismo`，由 CLI 输出机器计划；Agent 审查计划、以官方 shadcn 工具安装可编辑源码、补齐 Adapter 与路由，最后以真实路由和 `ProofReport` 验收。这样保留“从意图到可用 UI”的结果，同时遵守「CLI 是唯一执行控制面、不得建设 Prismo MCP」的已接受决策。

用户已将 PaceUI 的全部非商业功能确认为 Prismo 的长期目标。当前 Dashboard 限制、未实现的 `apply / verify`、以及缺少通用 Templates / Starter 都是实现缺口，不是产品范围排除；目标边界见 [Prismo free-parity boundary](../product/prismo-free-parity-boundary.md)。

## 功能映射

| PaceUI 非商业能力 | 第一方证据 | CLI-first Prismo 等价物 | 当前状态 / 边界 |
| --- | --- | --- | --- |
| 用自然语言或参考图生成 UI，并比较不同设计变体 | [MCP](https://paceui.com/mcp) 说明 Prompt/Image-to-Code 与多变体 | Agent 将业务请求交给 `prismo plan`，得到 `ProjectProfile + DashboardSpec + RecipeDecision + InstallPlan`；不确定项写入 `unresolved`，由人或 Agent 选择，而非把模型首稿直接写入项目。 | `inspect`、`plan` 可用；这不是任意页面生成器，当前只覆盖可用 Dashboard Recipe。 |
| 在 IDE 中把选中的 UI 直接落入活动代码文件 | [MCP onboarding](https://paceui.com/mcp/onboarding) 列出 IDE/CLI 客户端；[MCP](https://paceui.com/mcp) 声称直接写入代码库 | 不接入 IDE/MCP server。Agent 在目标项目运行本地 CLI，先审查 dry-run；再通过官方 `shadcn` Registry 安装 editable source，并只在项目侧挂载 route、实现单一 Data Adapter。 | `apply` 是已接受但尚未 Available 的目标；现阶段可展示精确 dry-run argv，不能宣传一键写入已交付。 |
| 可直接整合的、按 Dashboard / Marketing / Apps / Layouts 分类的模块化 Blocks | [Blocks](https://paceui.com/blocks) | 版本化 shadcn-compatible Registry Recipe，提供可编辑源码、Contract 与 fixture；CLI 仅选择与项目/请求相容的 **Available** Recipe。 | `dashboard-overview-01` 可用，含 KPI、图表、表格和四态；其余业务域仍为 Candidate，不生成安装计划。 |
| 基础与动画组件（例如 AI UI、文本/按钮/卡片动效） | [Components](https://paceui.com/components) | 通用组件发现和安装委托官方 shadcn CLI/Skill；Prismo 聚焦 DashboardSpec、领域 Recipe、数据 Adapter 和 Proof，不复制通用组件目录。 | 不是 PaceUI 动效组件库的逐项替代；需要的视觉组件由目标项目按 shadcn 生态选择，并纳入项目验收。 |
| 基于模块化 Blocks 的可改造整页模板（后台、AI SaaS、作品集等） | [Templates](https://paceui.com/templates) | Recipe + route mount + Adapter 组成可审查的目标项目交付；Catalog 只展示已验证可安装 Recipe，避免模板预览与真实可用性脱节。 | 当前产品切入点是 Dashboard，不承诺通用站点模板库。 |
| Next.js / TanStack Start 的产品 Starter，以及认证、邮件、AI、存储、数据库、文档、SEO 等基础设施 | [Starter](https://paceui.com/starter) | 在已有 React + shadcn-compatible 应用中最小化增量：Recipe 管 UI/状态/Contract，目标项目保留现有认证、后端、路由与数据边界；由一个 typed Data Adapter 映射业务数据。 | 不提供全栈脚手架或替换用户的身份、支付、存储、AI、数据库栈；这些是明确范围外或由目标项目负责。 |
| 安装/集成指引 | [MCP onboarding](https://paceui.com/mcp/onboarding) | 可选 `shadcn-agent-kit` 只提供工作流说明；其独立 bundle 仍调用同一 CLI，避免出现第二套选择/写入/验证逻辑。 | Skill 与官网只负责发现和说明，不能成为执行控制面。 |

## MCP / IDE 对等替代

PaceUI 的交互闭环是「IDE chat → MCP → 生成多个候选 → 选择 → 写入活动文件」。Prismo 的闭环应为：

```text
业务请求 → Coding Agent → prismo inspect / plan → 可复核计划与 dry-run
        →（写入授权后，v1 target）官方 shadcn 安装 → Adapter + route mount
        → verify → 真实 HTTP route + ProofReport
```

它有意放弃两个 PaceUI 表层特征：远程/原生 MCP 连接与编辑器内即时生成。换取的是确定性项目识别、Recipe 适配判定、写入前 revision/fingerprint 冲突保护，以及可区分 `passed` / `failed` / `unverified` 的交付证据。该替代严格符合 [CLI-first 基准线](../product/cli-first-baseline.md) 的唯一控制面和无 MCP 决策，而不是以隐藏 MCP 重建同一架构。

## 建议的验收 oracle

对任一声称“PaceUI 非商业能力已由 Prismo 覆盖”的场景，以下全部为真才可判定通过：

1. 在单一 shadcn-compatible 目标 workspace 上，`inspect` 与 `plan` 返回 schema-valid JSON，且选择的 Recipe 为 Available；不匹配或有歧义时以退出码 3/4 停止。
2. 计划保存 `schemaVersion`、`planId`、revision、project fingerprint、recipe version、影响文件/依赖和 unresolved 项；不得从自然语言直接静默写文件。
3. 写入能力发布后，`preview` 的 dry-run 与 `apply` 结果一致；重试幂等、文件变动或过期 plan 被拒绝，并产生 `ApplyReceipt`。
4. 目标项目仅通过 Adapter 接入业务字段，挂载的真实前端 HTTP route 可在浏览器中打开；不是只通过 Registry fixture 或数据库检查。
5. `ProofReport` 记录 typecheck、测试、production build、success/loading/empty/contract-error、375/768/1440、声明的表格交互和基本无障碍，并明确列出 passed、failed、unverified。

## 已知未知项

- PaceUI 公共 `/theme` 导航链接在调研时返回 404，因此没有将 Theme 归类为可对等的已证实能力。
- PaceUI 公开页面没有给出其变体生成模型、输出契约、冲突策略或验收标准；不能据此推断可重复性或源代码质量。
- Prismo 的 `preview` / `apply` / `verify` 是 Accepted v1 target，尚非当前 Available 功能；在真实目标项目闭环通过前，不能把本报告的“等价物”表述为已完成的自动化体验。
- 当前唯一 Available Recipe 是 `dashboard-overview-01`；营销站、通用 SaaS 模板与 PaceUI 所示全栈 Starter 的广度均未被覆盖。
