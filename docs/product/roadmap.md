# 短期滚动计划

只维护一个 Active 迭代。完成、停止或调整后，再从候选池拉入一个最有证据价值的增量；不做固定季度或多周承诺。

## Active：Agent-readable Plan

目标：让 Coding Agent 用一条命令得到可信的 `ProjectProfile + DashboardSpec + RecipeDecision + InstallPlan`，先消除 monorepo 误判和 Candidate 误装。

| 工作流 | 交付 | 完成门槛 |
|---|---|---|
| CLI | `dashboard-agent inspect/plan` | 单 workspace 自动定位，多 workspace 不猜 |
| Project truth | 固定版本 `shadcn info --json` | framework/base/alias/Tailwind 可复核 |
| Decision | DashboardSpec v1 + 能力评分 | 通用词不误选，Candidate 只解释不安装 |
| Plan | 只读 dry-run argv + adapter seam | 不写目标项目，输出可机器消费 |
| Regression | monorepo、选择、命令测试 | 根 `check` 绿色 |

## 滚动候选池

不排序、不承诺日期。每轮只拉入一个：

- 完成 `preview/apply/verify`，保存 plan revision 和统一 ProofReport。
- 为 `dashboard-overview-01` 补齐列显隐、选择以及浏览器交互 Proof。
- 在真实大数据量场景出现后，为对应 Recipe 补齐版本化 L2 Adapter Contract、取消请求和缓存约定。
- 将 Sales、Commerce、Agent Ops 中真实请求最多的一个转为 Building。
- 增加 Agent 选择评测集和 clarify/reject 指标。
- 将同一交付协议扩展到一个 Sites 或 Apps 场景。

## 每轮固定动作

选择一个增量 → 写清边界 → Registry/Fixture 实现 → CLI 与 Proof 验证 → 独立审查 → 发布 → 根据反馈重排候选池。
