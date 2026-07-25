# 短期滚动计划

只维护一个 Active 迭代。完成、停止或调整后，再从候选池拉入一个最有证据价值的增量；不做固定季度或多周承诺。

## Active：最小交付链

目标：公开证明一个品牌化 Registry POC 能被 shadcn CLI 安装到 Bun + Rsbuild 项目，并生成统一 Proof。

| 工作流 | 交付 | 完成门槛 |
|---|---|---|
| Workspace | Bun、TS 7、React、Rsbuild、TanStack、Tailwind | clean install、typecheck、build |
| 官网 | 品牌 Hero、Workflow、Showcase、Proof、Get started | 375/768/1440、深浅主题、无溢出 |
| Registry | `dashboard-overview-01` | dry-run、真实 add、Fixture typecheck/build |
| Skill | Inspect → Select → Preview → Install → Adapt → Proof | `quick_validate.py`、Candidate 过滤 |
| 发布 | 公共 GitHub 仓库与 Pages | 公网页面和公网 Registry 可访问 |

## 滚动候选池

不排序、不承诺日期。每轮只拉入一个：

- 让 `dashboard-overview-01` 从 L0 升级到 L1，补齐客户端排序、筛选、分页、列显隐和选择。
- 在真实大数据量场景出现后，再为对应 Recipe 定义 L2 服务端 Contract。
- 将 Sales、Commerce、Agent Ops 中真实请求最多的一个转为 Building。
- 增加 Agent 选择评测集和 clarify/reject 指标。
- 将同一交付协议扩展到一个 Sites 或 Apps 场景。

## 每轮固定动作

选择一个增量 → 写清边界 → Registry/Fixture 实现 → CLI 与 Proof 验证 → 独立审查 → 发布 → 根据反馈重排候选池。
