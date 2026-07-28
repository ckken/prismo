# Agenic 产品定位

## 一句话

把 Coding Agent 收到的 Web UI 需求，转换成可选择、可交付、可接数据、可验证并可交接的开源 UI 成果。

| 项目 | 定义 |
|---|---|
| 品牌 | `Agenic` |
| 主张 | From intent to proof. |
| 主入口 | 本地 `agenic` CLI |
| 仓库 | `agenic` |
| Package namespace | `@agenic` |
| UI 上游 | HeroUI v3（固定版本依赖） |
| 当前切入点 | Dashboard；长期覆盖 Prompt/Image、Variants、Blocks、Components、Templates、Full-page 与 Starter |
| 协议决策 | 不建设自有 MCP Server |

## 为谁解决什么

目标用户是使用 Codex 等 Coding Agent 的开发者和小团队。常见问题不是缺 UI 原语，而是 Agent 每次从零拼页面、忽略项目约束和数据边界，并在没有真实路由证据时宣称完成。

Agenic 将稳定部分沉淀为六层：

1. **Intent + ProjectProfile**：请求和目标项目的可审查输入。
2. **Spec**：把需求、未决项与交付边界变成机器协议；Dashboard 是首个垂直场景。
3. **Agenic CLI**：唯一控制面，负责确定性识别、计划、应用与验证。
4. **Renderer + Recipe**：HeroUI 是上游 UI 基础；Agenic Recipe 是可编辑的页面组合和领域交付单元。
5. **Contract + Adapter**：业务字段只在一处映射，页面不直接消费原始接口。
6. **Proof + Handoff**：真实路由证据、未验证项与可恢复的执行状态。

完整范围与声明纪律见 [Agenic free-parity boundary](agenic-free-parity-boundary.md)；架构选择见 [ADR 0001](../adr/0001-agenic-hero-ui-upstream.md)。

## 角色边界

- **HeroUI** 提供开源、可访问的 UI 原语、主题与交互基础。
- **Agenic** 提供 Agent-first 交付协议、CLI、Recipe、数据适配、验证、Proof 与 Handoff。
- **Coding Agent** 理解自然语言、暴露真实未决项、审查计划，并在授权后调用 CLI。
- **官网与 Skill** 只用于发现、说明和预览，不能复制 CLI Core 的选择、写入或验证实现。

## 当前能力与诚实边界

- `dashboard-overview-01` 是唯一 Available Recipe。
- Sales、Commerce、Agent Ops、CRM、Finance 仍是 Candidate；不能显示安装命令或完成态 Proof。
- 当前 Dashboard Demo 以 HeroUI primitives 渲染；CLI 的 `inspect / plan` 和可安装 Registry source 仍覆盖 shadcn-compatible 供应链。HeroUI Renderer 的端到端 `apply / verify` 在真实目标项目 Proof 前是 Target。
- Agent-first 不等于托管 Agent、不等于 MCP Server，也不等于绕过用户授权。

## 开源与品牌边界

Agenic 是免费开源项目，不提供价格、订阅、额度、License、试用或付费计划行为。HeroUI 是 Apache-2.0 上游依赖：不复制其名称、视觉资产、文档图形或 Pro 内容，不把其 MCP server 伪装为 Agenic 功能。`prismo`、`shadcnagent` 与 `dashboard-agent` 仅保留为命令兼容别名。
