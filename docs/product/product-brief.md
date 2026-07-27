# Shadcn Agent Kit 产品定位

## 一句话

把 Coding Agent 收到的 Web 需求，转换成可选择、可安装、可接数据、可验证的 shadcn-compatible 源码交付。

| 项目 | 定义 |
|---|---|
| 品牌 | Shadcn Agent Kit |
| 主张 | From request to proof. |
| 仓库 | `shadcn-agent-kit` |
| Registry namespace | `@shadcnagent` |
| Agent Skill | `shadcn-agent-kit` |
| 当前切入点 | Dashboard Recipe |
| 扩展方向 | Sites、Apps，按真实需求滚动进入 |

## 为谁解决什么

目标用户是使用 Codex 等 Coding Agent 的开发者和小团队。常见问题不是缺 UI，而是 Agent 每次从零拼页面、数据边界混乱、复杂表格被低估、完成后缺少证据。

本项目把稳定部分沉淀为五层：

1. DashboardSpec：把请求转换为可验证的机器协议。
2. Skill：约束领域判断和交付步骤。
3. CLI + Registry：确定性识别、选择并安装 editable React source。
4. Contract + Adapter：业务字段只在一处映射。
5. Proof：区分通过、失败和未验证项。

## 使用边界

- 适合 KPI、趋势、筛选、普通管理表格和常见后台状态。
- shadcn/ui 不负责服务端数据能力；TanStack Table 只负责 headless 状态。
- 权限、审计、导出任务、跨页选择、虚拟化由应用或后端实现。
- 类 Excel 编辑、公式、冻结区、海量单元格协同使用专业 Data Grid。
- Candidate 不可安装，也不能展示假 Proof。

## 品牌边界

本项目为独立社区项目，只说明与 shadcn 生态兼容。名称、图形和配色不复制 shadcn 官方品牌资产，不使用 `@shadcn` 官方感命名空间。
