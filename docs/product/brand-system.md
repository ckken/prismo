# Agenic 品牌系统

## 核心表达

- 名称：**Agenic**（命令与 package 使用小写 `agenic`）
- 含义：来自 *agentic*；不是“更大的英雄”，而是具备理解、选择、行动和自证能力的系统。
- 主张：**From intent to proof.**
- 定位：让 Coding Agent 从需求或参考图，走到可编辑 UI 组合、真实路由验证和可恢复交接。
- 性格：清晰、克制、可审计；不伪装成聊天机器人，不承诺未证明的自动化。
- 叙事：**Intent → Spec → Recipe → Adapt → Verify → Proof**。

## 识别图形

Web 标记是一个抽象的 `A`：上升的外轮廓代表 Agent 的行动，内部留白代表可审查的决策空间。它是仓库内联 SVG，不依赖图片服务，也不复刻 HeroUI 或任何参考产品资产。

## Web tokens

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `brand` | `#18181B` | `#FAFAFA` | 主操作、已选择状态 |
| `brand-strong` | `#09090B` | `#E4E4E7` | 高对比强调 |
| `brand-soft` | `#F4F4F5` | `#27272A` | 低强调容器 |
| `focus` | `#71717A` | `#D4D4D8` | 键盘焦点环 |

状态色只表示验证结果，不能代替品牌色。正文、按钮、焦点环和状态提示以 WCAG AA 为最低目标；自动构建通过不等于无障碍通过。

## 内容规则

- 用具体产物与 Evidence，不使用“无限”“全自动”“一键完成”等未证明承诺。
- **Available** 才显示安装命令和完成态 Proof；**Building**、**Target**、**Candidate** 必须显式标注。
- HeroUI 只作为技术上游出现；不暗示隶属、背书或使用其 Pro 内容。
- `Agenic` / `agenic` 是公开名称；旧名称只能在迁移说明或兼容命令中出现。
- 所有公开页面保留独立社区项目免责声明。
