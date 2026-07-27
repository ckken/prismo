# Dashboard Agent 生态研究

研究日期：2026-07-27。

## 结论

最快的实现路径不是再做一个通用 UI 生成模型，而是把 Dashboard 的高频交付闭环固化为：

`DashboardSpec → Recipe resolve → editable source install → data adapter → proof`

现有生态已经解决了部分问题：

| 能力 | 适合作为 | 不负责 |
|---|---|---|
| shadcn CLI / Registry / Skill / MCP | 项目识别、组件发现、源码安装和 Registry 访问 | 指标口径、数据契约、权限、Dashboard 验收 |
| v0 | 首次视觉探索和区域级视觉调整 | 本地项目的确定性交付与生产证明 |
| AI SDK Generative UI | 产品运行时把 typed tool result 映射为受控 React UI | 生成后源码的维护性、安装和工程验收 |
| AGENTS.md / Agent Skills | 项目约束与按需加载的领域工作流 | 可执行动作和机器门禁 |
| MCP | 给不同 Agent 宿主暴露类型化工具 | 领域策略和真实源码供应链 |

因此，Shadcn Agent Kit 的差异化不应是“更多漂亮 Block”，而应是：

1. 用机器可读的 `DashboardSpec` 表达业务意图、组件、数据模式与未决项。
2. 用有能力标签和兼容矩阵的 Recipe Catalog 做可解释选择。
3. 把 Contract、Fixture、四态和验收断言与源码一起交付。
4. 用统一 `ProofReport` 区分 passed、failed 和 unverified。
5. 允许视觉探索，但安装、适配和验证始终回到本地可审计闭环。

## 借鉴与边界

### shadcn：作为确定性源码供应链

官方 Skill 会运行 `shadcn info --json` 获取 framework、Tailwind、alias、base 和已安装组件；CLI 与 MCP 已提供 search、view、add 等 Registry 能力。项目应复用这些通用能力，不继续维护一套不完整的 shadcn 项目探测器。

2026-07-27 实时检查 `shadcn@latest` 为 `4.15.0`；仓库本轮仍保留已跑完安装 Proof 的 `4.14.1`，后续升级必须重新通过同一 Fixture 门禁。

Shadcn Agent Kit 只补充 Dashboard 特有层：

- 请求结构化与最少澄清。
- Recipe 能力匹配和 Candidate 拒绝。
- 指标、图表、表格、筛选和 drill-down 的组合约束。
- Data Source / Adapter seam。
- 功能、数据、响应式、无障碍和视觉 Proof。

### v0：作为可选视觉探索面

v0 适合从自然语言快速得到首版视觉，也适合在 Design Mode 中做区域级调整。它可以成为 Recipe 设计阶段或用户预览阶段的可选工具，但不能成为安装与验证的必需运行时，也不能把“预览看起来正确”当作生产证明。

### AI SDK Generative UI：只用于运行时 Agent UI

AI SDK 通过 tool 输出结构化数据，再映射到受控组件。这一模式可用于未来的 Dashboard 内嵌 Agent，也可启发 `DashboardSpec` 的 allowlist widget 设计；但源码交付仍需 Registry、diff、文件归属和工程测试。

### MCP：最后增加的薄协议层

MCP 适合公开 `inspect`、`resolve`、`preview`、`verify` 等类型化动作。CLI 应先成为唯一业务实现和可测试真相源；MCP 只调用同一个 core，避免出现 CLI、Skill、MCP 三套逻辑。

## 官方资料

- [shadcn Skills](https://ui.shadcn.com/docs/skills)
- [shadcn Registry](https://ui.shadcn.com/docs/registry)
- [shadcn Registry namespaces](https://ui.shadcn.com/docs/registry/namespace)
- [shadcn MCP](https://ui.shadcn.com/docs/mcp)
- [shadcn Dashboard blocks](https://ui.shadcn.com/blocks?category=dashboard)
- [v0 文档](https://vercel.com/docs/v0)
- [v0 Design Mode 公告](https://community.vercel.com/t/introducing-design-mode-on-v0/13225)
- [AI SDK Generative UI](https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces)
- [AI SDK Testing](https://ai-sdk.dev/docs/ai-sdk-core/testing)
- [MCP tools specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [Agent Skills](https://github.com/anthropics/skills)
