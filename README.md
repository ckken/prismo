# Shadcn Agent Kit

> From request to proof.

面向 Coding Agent 的 CLI-first Dashboard 专家能力包。它用 Skill 约束领域流程，用 CLI 生成机器计划，用 shadcn-compatible Registry 交付可编辑源码，并用 Proof 区分通过、失败和未验证项。

## 当前可用

| 内容 | 状态 | 说明 |
|---|---|---|
| `dashboard-agent inspect / plan` | Available | workspace-aware 项目识别、DashboardSpec、Recipe 决策与 dry-run argv |
| 品牌官网与 Playground | Available | 独立 Blocks 工作台、真实源码、安装命令、三档视口与四种数据状态 |
| `dashboard-overview-01` | Available | KPI、TanStack Table、Zod Contract、四态 |
| `shadcn-agent-kit` Skill | Available | 一键安装、独立 CLI bundle、Inspect → Select → Preview → Install → Adapt → Proof |
| Sales / Commerce / Agent Ops / CRM / Finance | Candidate | 只做概念预览，不提供安装命令 |
| Sites / Apps | Candidate | 后续按真实需求滚动拉入 |

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
- Playground：`http://localhost:3000/playground/`

完整校验：

```bash
bun run check
bun run skill:validate
bun run proof:install
```

## 安装首个 Recipe

官网发布后，使用它展示的公共 Registry URL：

```bash
bunx --bun shadcn@4.14.1 add \
  https://ckken.github.io/shadcnagent/r/dashboard-overview-01.json \
  --dry-run
```

确认文件和依赖清单后，移除 `--dry-run` 安装 editable source。目标项目需要先完成 shadcn 初始化。

## Agent 接入

在目标 shadcn 项目目录执行一条命令，将 Skill 安装给 Codex：

```bash
npx skills add ckken/shadcnagent \
  --skill shadcn-agent-kit \
  -a codex \
  -y
```

它会把 Skill 复制到当前项目的 `.agents/skills/shadcn-agent-kit/`。其中的
`scripts/dashboard-agent.js` 是独立 bundle，不依赖本仓库源码。

随后直接向 Agent 描述业务目标：

```text
用 Shadcn Agent Kit 给这个项目增加经营总览：3 个 KPI、趋势图、服务端分页表格。
先 inspect 和 plan，展示 shadcn dry-run；确认边界后安装、接入 Data Adapter 并运行 Proof。
```

也可以直接调用安装后的只读 CLI：

```bash
bun .agents/skills/shadcn-agent-kit/scripts/dashboard-agent.js plan \
  --cwd . \
  --request "增加经营总览：3 个 KPI、趋势图、服务端分页表格" \
  --json
```

CLI 会自动定位单一 shadcn workspace，以固定版本 `shadcn info --json` 读取项目配置，并输出 `DashboardSpec + ProjectProfile + RecipeDecision + InstallPlan`。多个 workspace、只有通用词的请求、Candidate 场景和越界能力都会停止猜测，不产生安装计划。

Agent 只需要在目标项目写少量路由挂载和 Data Adapter；Recipe 内部承担 UI、状态和 Contract。详细边界见 [Agent integration](docs/product/agent-integration.md)。

目标架构、阶段门禁和成功指标见 [Dashboard Agent 演进方案](docs/product/dashboard-agent-evolution.md)，生态取舍见 [Dashboard Agent 研究](docs/research/dashboard-agent-landscape.md)。

## 表格边界

shadcn/ui 负责视觉组件，TanStack Table 负责表格状态。服务端分页、权限、导出任务、审计、虚拟化和跨页选择属于应用或后端；类 Excel 单元格编辑和计算应使用专业 Data Grid。

## License 与声明

[MIT](LICENSE)

Shadcn Agent Kit is an independent community project. It is not affiliated with, endorsed by, or sponsored by shadcn or shadcn/ui. The shadcn name is used only to describe compatibility.
