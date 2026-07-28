# Prismo 品牌系统

![Prismo Logo](../../apps/web/public/brand/prismo-logo-mono-v1.png)

## 核心表达

- 名称：**Prismo**（命令与 package 使用小写 `prismo`）
- 主张：**From intent to proof.**
- 定位：让 Coding Agent 从文字或参考图走到可选择、可交付、可验证的本地 UI 源码。
- 性格：精准、明亮、可审计；不伪装成聊天机器人，也不承诺未证明的自动化。
- 叙事：**Intent → Variants → Select → Preview → Apply → Adapt → Verify → Proof**
- 产品入口：本地 CLI；不建设 Prismo MCP Server。

## 识别图形

Logo 是一个由黑、白、炭灰三块平面组成的折射棱镜：

- 三个平面表示同一请求下可比较的 Variant，而不是只改颜色的假分支。
- 中轴表示固定 Contract；折射后的方向表示选择、应用和验证前的明确状态。
- 它不复刻任何参考产品的图形资产。最小尺寸为 20px；小于该尺寸仅使用单色 `P` 后备标记。

Web 当前使用 [imagegen 单色栅格标记](../../apps/web/public/brand/prismo-logo-mono-v1.png)；它由绿色抠图底去背后以 RGBA PNG 保存，黑白形态在浅色和深色官网主题中均保持清晰。所有资产均随源码发布，不依赖图片服务。

## Web tokens

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `brand` | `#18181B` | `#FAFAFA` | 主操作、已选择状态 |
| `brand-strong` | `#09090B` | `#E4E4E7` | 高对比强调 |
| `brand-soft` | `#F4F4F5` | `#27272A` | 低强调容器 |
| `focus` | `#71717A` | `#D4D4D8` | 键盘焦点环 |

状态色只表示验证结果，不能拿来替代品牌色。正文、按钮、焦点环和状态提示以 WCAG AA 为最低目标；自动构建通过不等于无障碍通过。

## 内容规则

- 用具体产物与 Evidence，不使用“无限”“全自动”“一键完成”等未证明承诺。
- **Available** 才显示安装命令和完成态 Proof；**Building**、**Target**、**Candidate** 必须显式标注。
- 对齐的是免费功能的用户结果，不复制参考产品的接入方式、视觉资产、定价或付费机制。
- `shadcnagent` 和 `dashboard-agent` 仅作为迁移别名出现；所有新页面、示例和文档优先写 `Prismo` / `prismo`。
- 所有公开页面保留独立社区项目免责声明。
