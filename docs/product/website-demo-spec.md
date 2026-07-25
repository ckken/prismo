# 官网与 Demo 规范

## 目标

用户在 10 秒内理解：这是给 Coding Agent 使用的 shadcn-compatible Recipe Kit，交付 editable source，并把 Proof 纳入流程。

## 单页结构

| 区域 | 任务 | 关键证据 |
|---|---|---|
| Hero | 建立定位 | 主张、Agent plan、无黑盒 runtime |
| Workflow | 解释协议 | Understand、Match、Install、Bind、Prove |
| Showcase | 让用户操作 | 三场景、四态、Contract 路径 |
| Recipes | 划定当前与扩展 | Dashboard Available；Sites/Apps Candidate |
| Proof | 说明验收 | Type、Build、Contract、States、Responsive、A11y |
| Get started | 最短接入 | 真实 Registry URL 与复制命令 |

## 静态运行边界

- GitHub Pages 不接在线 LLM，Showcase 是确定性演示。
- `dashboard-overview-01` 是唯一首发可安装项。
- Sales、Commerce、Agent Ops 是 Candidate，不显示安装命令。
- Registry JSON 与官网同源发布到 `/r/*.json`。
- 官网当前只有根路由，TanStack Browser History 使用 Pages basepath；页面分区使用普通锚点。

## 响应式验收

- 375、768、1440 均无页面级横向溢出。
- 移动端菜单、场景选择、四态和复制命令可操作。
- 深浅主题均可读，`focus-visible` 清楚。
- 支持 `prefers-reduced-motion`。
