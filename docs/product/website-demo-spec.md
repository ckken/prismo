# 官网与 Dashboard Catalog 规范

## 目标

用户在 10 秒内理解：这是给 Coding Agent 使用的 shadcn-compatible Recipe Kit，交付 editable source，并把 Proof 纳入流程。

## 单页结构

| 区域 | 任务 | 关键证据 |
|---|---|---|
| App shell | 建立产品感 | 固定侧栏、搜索、主题、语言、资源入口 |
| Hero | 建立定位 | 按功能组合选择 Dashboard、现有技术栈、确定性预览 |
| Summary | 给出规模 | Dashboard 数量、Available 数量、四态、响应式断点 |
| Catalog | 对比场景 | 六个 Dashboard 的功能组合、适用场景与交付状态 |
| Selected Dashboard | 展示细节 | 当前组合、确定性预览、状态边界、Playground 入口 |
| Delivery rail | 解释协议 | Understand、Match、Install、Bind、Prove |
| Get started | 最短接入 | 仅 Available 展示真实 Registry URL 与 dry-run 命令 |

## 视觉原则

- 使用管理后台式产品壳：固定分组侧栏、紧凑工具栏、细边框、低阴影和中性画布。
- 首页首先展示 Dashboard 的功能组合，不按截图或装饰风格分类。
- 桌面以多列信息密度为主；移动端侧栏改为可关闭、可聚焦管理的抽屉，内容保持单列。

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
