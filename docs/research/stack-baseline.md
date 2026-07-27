# 技术栈基线

基线日期：2026-07-25。以下版本已经在本仓库完成安装、类型检查和生产构建。

| 层 | 固定版本 | 用途 |
|---|---|---|
| Runtime / Workspace | Bun `1.3.14` | 安装、脚本、测试、Workspace |
| Type | TypeScript `7.0.2` | `tsc --noEmit`，不依赖 Compiler API |
| UI runtime | React / React DOM `19.2.8` | 应用运行时 |
| Build | Rsbuild `2.1.8` + React plugin `2.1.0` | 官网与 Fixture 构建 |
| Routing | TanStack Router `1.170.18` | Browser History + Pages basepath；Dashboard、Catalog、Workflow 使用真实路由 |
| Server state | TanStack Query `5.101.4` | 数据请求与缓存 seam |
| Table | TanStack Table `8.21.3` | Headless 表格状态 |
| Contract | Zod `4.4.3` | 运行时数据校验 |
| Styling | Tailwind CSS `4.3.3` | CSS-first 配置 |
| Registry CLI | shadcn `4.14.1` | dry-run 与安装 |

## 固定原则

- `packageManager` 与 CI 固定 Bun `1.3.14`。
- TypeScript 只承诺 CLI `tsc --noEmit`，不调用不稳定 Compiler API。
- shadcn/ui 作为源码组件和 Registry 协议，不作为应用框架。
- GitHub Pages 项目页设置 `PUBLIC_BASE_PATH=/<repo>/`。
- Registry 构建产物必须包含 `dist/r/<recipe>.json`。
