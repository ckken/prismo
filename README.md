# shadcnagent

> From request to proof.

面向 Coding Agent 的本地 CLI-first Dashboard 专家。它用机器计划约束改动，用
shadcn-compatible Registry 交付可编辑源码，并用 Proof 区分通过、失败和未验证项。
`shadcnagent` CLI 是唯一执行控制面；Skill 是可选使用说明，官网只负责文档、Catalog
和预览。本项目不建设自有 MCP Server。

## 当前可用

| 内容 | 状态 | 说明 |
|---|---|---|
| `shadcnagent inspect / plan` | Available | workspace-aware 项目识别、DashboardSpec、Recipe 决策与 dry-run argv |
| 路由化品牌官网 | Available | `sidebar-07` 布局、六个 Dashboard 功能组合、确定性 Mock 数据与时间区间筛选 |
| `dashboard-overview-01` | Available | KPI、TanStack Table、Zod Contract、四态 |
| `shadcn-agent-kit` Skill | Available | 一键安装、独立 CLI bundle、Inspect → Select → Preview → Install → Adapt → Proof |
| `dashboard-shadcn-delivery` Skill | Available | 从数据契约到四态与响应式验收的生产 Dashboard 交付流程 |
| Sales / Commerce / Agent Ops / CRM / Finance | Candidate | 只做概念预览，不提供安装命令 |

Accepted 的 CLI-first 产品、协议、安全和发布基准见
[CLI-first 基准线](docs/product/cli-first-baseline.md)。未在“当前可用”表中列为
Available 的命令或 Recipe 都不能作为已交付能力宣传。

## 技术基线

- Bun Workspace `1.3.14`
- TypeScript `7.0.2`，只使用 `tsc --noEmit`
- React `19.2.8`
- Rsbuild `2.1.8`
- TanStack Router / Query / Table
- shadcn/ui Registry + Tailwind CSS `4.3.3`

## 本地运行

```bash
bun install
bun run dev
```

本地入口：

- 官网：`http://localhost:3000/`

完整校验：

```bash
bun run check
bun run skill:validate
bun run proof:install
```

## CLI

仓库内直接运行：

```bash
bun run shadcnagent --help
bun run shadcnagent inspect --cwd apps/web --json
bun run shadcnagent plan \
  --cwd apps/web \
  --request "增加经营总览：3 个 KPI、趋势图、服务端分页表格" \
  --json
```

当前只有只读 `inspect / plan` 可用。`preview / apply / verify` 是 v1 Accepted
target，在实现并通过基准门禁前不作为可用命令宣传。CLI 发布为独立版本化 package
之前，外部目标项目继续通过可选 Skill 中的独立 bundle 调用同一只读能力。

## 安装首个 Recipe

官网发布后，使用它展示的公共 Registry URL：

```bash
bunx --bun shadcn@4.14.1 add \
  https://ckken.github.io/shadcnagent/r/dashboard-overview-01.json \
  --dry-run
```

确认文件和依赖清单后，移除 `--dry-run` 安装 editable source。目标项目需要先完成 shadcn 初始化。

## 可选 Agent Skill

在目标 shadcn 项目目录执行一条命令，将 Skill 安装给 Codex：

```bash
npx skills add ckken/shadcnagent \
  --skill shadcn-agent-kit \
  -a codex \
  -y
```

它会把 Skill 复制到当前项目的 `.agents/skills/shadcn-agent-kit/`。其中的
`scripts/dashboard-agent.js` 是独立 bundle，不依赖本仓库源码。

随后直接向 Agent 描述业务目标；Agent 最终仍调用本地 CLI：

```text
用 shadcnagent 给这个项目增加经营总览：3 个 KPI、趋势图、服务端分页表格。
先 inspect 和 plan，展示 shadcn dry-run；确认边界后安装、接入 Data Adapter 并运行 Proof。
```

直接调用安装后的只读 CLI：

```bash
bun .agents/skills/shadcn-agent-kit/scripts/dashboard-agent.js plan \
  --cwd . \
  --request "增加经营总览：3 个 KPI、趋势图、服务端分页表格" \
  --json
```

CLI 会自动定位单一 shadcn workspace，以固定版本 `shadcn info --json` 读取项目配置，并输出 `DashboardSpec + ProjectProfile + RecipeDecision + InstallPlan`。多个 workspace、只有通用词的请求、Candidate 场景和越界能力都会停止猜测，不产生安装计划。Skill 不实现另一套项目识别或 Recipe 选择逻辑。

### 从既有项目交付生产 Dashboard

当项目已有后端、认证、路由和 shadcn-compatible 组件时，安装不依赖本仓库 Recipe 的交付 Skill：

```bash
# 先安装官方 shadcn Skill（Bun 项目示例；其他包管理器使用对应 dlx）
bunx skills add shadcn/ui

# 再安装 Dashboard 领域交付 Skill
npx skills add ckken/shadcnagent \
  --skill dashboard-shadcn-delivery \
  -a codex \
  -y
```

官方 Skill 负责 `components.json`、`shadcn info --json`、组件发现和 CLI/API 正确性；本 Skill 保留目标项目的技术栈，要求先定义前后端读模型和授权边界，再实现筛选、KPI、图表、表格和加载/空/错误/成功四态；最后以类型检查、构建和 375/768/1440 宽度验证交付。它不包含、也不会要求复制任何私有业务数据。

Agent 只需要在目标项目写少量路由挂载和 Data Adapter；Recipe 内部承担 UI、状态和 Contract。详细边界见 [Agent integration](docs/product/agent-integration.md)。

Accepted 基准见 [CLI-first 基准线](docs/product/cli-first-baseline.md)，目标架构、阶段门禁和成功指标见 [Dashboard Agent 演进方案](docs/product/dashboard-agent-evolution.md)，生态取舍见 [Dashboard Agent 研究](docs/research/dashboard-agent-landscape.md)。

## 表格边界

shadcn/ui 负责视觉组件，TanStack Table 负责表格状态。服务端分页、权限、导出任务、审计、虚拟化和跨页选择属于应用或后端；类 Excel 单元格编辑和计算应使用专业 Data Grid。

## License 与声明

[MIT](LICENSE)

shadcnagent is an independent community project. It is not affiliated with, endorsed by, or sponsored by shadcn or shadcn/ui. The shadcn name is used only to describe compatibility.
