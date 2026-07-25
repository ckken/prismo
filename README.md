# Shadcn Agent Kit

> From request to proof.

面向 Coding Agent 的 shadcn-compatible Web Recipe Kit。当前先交付 Dashboard：Agent 识别目标项目、只从 Available Recipe 中选择、预览源码变更、接入数据，并输出可复核的验证结果。

## 当前可用

| 内容 | 状态 | 说明 |
|---|---|---|
| 品牌官网与 Showcase | Available | 三个确定性场景预览、四种数据状态、深浅主题 |
| `dashboard-overview-01` | Available | KPI、TanStack Table、Zod Contract、四态 |
| `shadcn-agent-kit` Skill | Available | Inspect → Select → Preview → Install → Adapt → Proof |
| Sales / Commerce / Agent Ops | Candidate | 只做概念预览，不提供安装命令 |
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

将 [Skill](skills/shadcn-agent-kit/SKILL.md) 提供给 Codex 或兼容的 Coding Agent，然后直接描述业务目标，例如：

```text
用 Shadcn Agent Kit 给这个项目增加经营总览：3 个 KPI、状态表格、
loading/empty/error 状态。先给 dry-run，确认后安装并运行 Proof。
```

Agent 只需要在目标项目写少量路由挂载和 Data Adapter；Recipe 内部承担 UI、状态和 Contract。详细边界见 [Agent integration](docs/product/agent-integration.md)。

## 表格边界

shadcn/ui 负责视觉组件，TanStack Table 负责表格状态。服务端分页、权限、导出任务、审计、虚拟化和跨页选择属于应用或后端；类 Excel 单元格编辑和计算应使用专业 Data Grid。

## License 与声明

[MIT](LICENSE)

Shadcn Agent Kit is an independent community project. It is not affiliated with, endorsed by, or sponsored by shadcn or shadcn/ui. The shadcn name is used only to describe compatibility.
