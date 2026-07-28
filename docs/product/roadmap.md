# 短期滚动计划

只维护一个 Active 迭代。完成、停止或调整后，再从候选池拉入一个最有证据价值的增量；不做固定季度或多周承诺。

## Completed：Agent-readable Plan

已完成目标：让 Coding Agent 用一条命令得到可信的
`ProjectProfile + DashboardSpec + RecipeDecision + InstallPlan`，消除 monorepo
误判和 Candidate 误装。

| 工作流 | 交付 | 完成门槛 |
|---|---|---|
| CLI | `shadcnagent inspect/plan` | 单 workspace 自动定位，多 workspace 不猜 |
| Project truth | 固定版本 `shadcn info --json` | framework/base/alias/Tailwind 可复核 |
| Decision | DashboardSpec v1 + 能力评分 | 通用词不误选，Candidate 只解释不安装 |
| Plan | 只读 dry-run argv + adapter seam | 不写目标项目，输出可机器消费 |
| Regression | monorepo、选择、命令测试 | 根 `check` 绿色 |

## Active：CLI One-command Delivery

目标：关闭唯一 Available Recipe 的真实交付闭环：

`Inspect → Plan → Preview → Apply → Adapt → Route → Verify → Proof`

| 工作流 | 交付 | 完成门槛 |
|---|---|---|
| Plan artifact | `planId + revision + project fingerprint` | 可重放、过期计划拒绝 |
| Preview | 精确 dry-run 与文件/依赖/冲突清单 | 不写目标项目 |
| Apply | 幂等安装、摘要校验、ApplyReceipt | 未知冲突停止 |
| Integration | REST/fixture Adapter 与 route slot | demo fixture 不冒充生产 success |
| Verify | 项目门禁、四态、交互、真实 HTTP route | 标准 ProofReport |
| Browser | 375 / 768 / 1440 | 声明过的响应式与交互通过 |

完整产品和发布门禁以 [CLI-first 基准线](cli-first-baseline.md) 为准。

## 滚动候选池

不排序、不承诺日期。每轮只拉入一个：

- 为 `dashboard-overview-01` 补齐列显隐、选择以及浏览器交互 Proof。
- 在真实大数据量场景出现后，为对应 Recipe 补齐版本化 L2 Adapter Contract、取消请求和缓存约定。
- 将 Sales、Commerce、Agent Ops 中真实请求最多的一个转为 Building。
- 增加 Agent 选择评测集和 clarify/reject 指标。

## 每轮固定动作

选择一个增量 → 写清边界 → Registry/Fixture 实现 → CLI 与 Proof 验证 → 独立审查 → 发布 → 根据反馈重排候选池。项目不建设 MCP；新增宿主通过 CLI 和可选 Skill 复用同一契约。
