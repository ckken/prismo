# Agenic free-parity boundary

状态：Accepted

本决策将 Agenic 的长期功能边界定义为完整的免费 UI 交付体验。它定义的是**产品目标**，不把尚未实现的能力误写成当前 Available。

## 结果承诺

Agenic 的目标不是复刻任何参考产品的远程协议、托管服务或 IDE 插件，而是在本地 CLI 中交付完整的用户结果：从文字或参考图出发，得到可比较的 UI 方向，选择并迭代其中一个，将可编辑源码安全地交付到当前项目，并在 handoff 后以真实运行证据判断是否完成。

```text
Prompt / Image → Agenic CLI → 3+ Variants → Select / Refine
               → Preview → Apply → Current codebase → Verify / Handoff Proof
```

MCP 只是某些产品的接入方式；Agenic 的接入方式是 Coding Agent 在目标项目中直接调用本地 CLI。不得以“不做 MCP”为理由删除同等的功能结果。

## 对齐范围

以下能力都是 Agenic 的免费功能目标：

| 能力域 | 必须具备的结果 | CLI-first 边界 |
|---|---|---|
| Prompt to UI | 从自然语言生成 Block、Component 或整页交付计划 | 输入、约束和未决项必须保存为 schema-valid Spec |
| Image to UI | 从用户提供的参考图提取布局、层级和视觉 token，生成受控候选 | 不复制品牌、私密内容或受版权保护素材；原图不进入公开 fixture |
| Variants | 每次至少 3 个布局或信息层级有实质差异的候选 | 共享可验证 Contract；禁止仅改颜色/文案就称为 Variant |
| Select and refine | 按 Variant id 选择，并从选择结果继续定向迭代 | 每次 refine 保留父 Variant、请求和差异摘要 |
| Direct to codebase | 将选中候选安全落入当前项目的可编辑源码 | 先 preview，再按 revision/fingerprint apply；未知冲突立即停止 |
| Blocks | 可独立安装、组合和验证的页面区块 | Registry Manifest 声明所有权、slot、依赖、状态和 Proof |
| Components | 可发现、可组合、可验证的基础和视觉组件 | HeroUI 提供上游原语；Agenic 维护自身 Recipe 组合、Variant 和验收契约 |
| Templates | 可改造的多 Block 页面模板 | 必须在真实 route 中运行，不只提供静态展示图 |
| Full-page | 端到端生成一个响应式页面并交付源码 | 每页具备 loading / empty / error / success 或适用的状态矩阵 |
| Starter | 新项目可选择的基础应用骨架 | 覆盖 UI、认证、数据、邮件、AI、存储、文档与 SEO 的可选模块；支付和商业计费除外 |

此表是 Agenic 已接受的完整免费功能清单；它独立于任何外部产品、品牌或服务。

## 非商业排除

Agenic 不实现或模拟：价格页、订阅、Trial、额度、License、用量限制、优先支持、付费账户管理或付款处理。

资源保护（例如最大文件大小、超时、并发和本地磁盘安全）不是商业额度，仍可存在，但必须以工程保护的形式公开说明。

## 当前能力与声明纪律

当前只有 `inspect / plan` 和一个 Dashboard Recipe 可用。它们只是实现这条路线的起点。

- 任何页面、文档、CLI help 或 Issue 都必须区分 **Available**、**Building**、**Target** 与 **Candidate**。
- 没有通过 handoff matrix 的能力不能称为已交付，也不能把 green build 当作功能完成。
- 每个新能力域先建立最小可验证纵向切片，再扩充 Catalog；不接受用大量静态预览替代可应用源码。

## Handoff completion predicate

一个 Agenic 请求只有同时满足以下条件才是 `complete`：

1. 需求、输入图摘要、Spec、Variant、选择理由、plan revision 和项目 fingerprint 都可重放。
2. Preview 与 Apply 的文件和依赖影响一致，重复 apply 幂等，过期或冲突状态会停止。
3. 真实项目保留一个明确 Adapter / integration seam；生产不会静默使用 fixture 数据。
4. 真实 HTTP route、浏览器交互、状态矩阵、响应式和项目质量门均有 ProofReport。
5. 新进程或新 Agent 按 handoff record 重跑后，能得到相同的 passed / failed / unverified 结论。

## 演进顺序

1. **Delivery kernel**：handoff record、preview/apply/verify、真实 route Proof。
2. **Variant kernel**：Prompt、3+ Variants、选择与 refine；首先覆盖 Dashboard，再推广到 Blocks 和 Components。
3. **Asset expansion**：Blocks、Components、Templates、Full-page，全部复用同一 apply/verify/handoff 协议。
4. **Image and Starter**：参考图解析，以及不含支付的模块化 Starter。

顺序不缩小范围：后续阶段是已接受的免费功能目标。每一阶段必须先通过 handoff matrix，才能提升为 Available。
