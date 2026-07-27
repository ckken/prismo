import { StrictMode, useEffect, useMemo, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { AlertCircle, Check, Copy, ExternalLink, RefreshCw } from "lucide-react"
import { PreviewDashboard } from "./components/preview-dashboard"
import { scenariosByLocale, type DemoState, type ScenarioId } from "./data"
import type { Locale } from "./i18n"
import { applyInitialPreferences, getInitialLocale } from "./preferences"
import "./styles.css"
import "./playground.css"

const skillCommand = "npx skills add ckken/shadcnagent --skill shadcn-agent-kit -a codex -y"
const states: DemoState[] = ["success", "loading", "empty", "contract-error"]
const viewports = ["desktop", "tablet", "mobile"] as const
const tabs = ["preview", "code", "agent"] as const

const blocks = [
  { id: "dashboard-overview-01", status: "Available", modules: "Shell · Metrics · Analytics · Operations · Data Contract · States", scenarioId: "sales" },
  { id: "sales", status: "Candidate", modules: "Shell · Metrics · Analytics · Operations", scenarioId: "sales" },
  { id: "commerce", status: "Candidate", modules: "Shell · Metrics · Analytics · Operations", scenarioId: "commerce" },
  { id: "agent-ops", status: "Candidate", modules: "Shell · Metrics · Analytics · Data Contract", scenarioId: "agent-ops" },
  { id: "crm", status: "Candidate", modules: "Catalog-only · Data Contract", scenarioId: null },
  { id: "finance", status: "Candidate", modules: "Catalog-only · Metrics · States", scenarioId: null },
] as const

type BlockId = (typeof blocks)[number]["id"]
type Tab = (typeof tabs)[number]
type Viewport = (typeof viewports)[number]
type RegistryItem = {
  name: string
  title: string
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: Array<{ path: string; content: string }>
}

function base(path: string) {
  return `${__PUBLIC_BASE_PATH__.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function isBlockId(value: string | null): value is BlockId {
  return blocks.some(({ id }) => id === value)
}

function isState(value: string | null): value is DemoState {
  return states.some((state) => state === value)
}

function isTab(value: string | null): value is Tab {
  return tabs.some((tab) => tab === value)
}

function isViewport(value: string | null): value is Viewport {
  return viewports.some((viewport) => viewport === value)
}

function ClipboardButton({ value, label }: { value: string; label: string }) {
  const [result, setResult] = useState<"idle" | "copied" | "failed">("idle")

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value)
      setResult("copied")
    } catch {
      setResult("failed")
    }
    window.setTimeout(() => setResult("idle"), 1600)
  }

  return (
    <button className="pg-icon" type="button" onClick={copyValue} aria-label={label}>
      {result === "copied" ? <Check size={15} /> : result === "failed" ? <AlertCircle size={15} /> : <Copy size={15} />}
      <span aria-live="polite">{result === "copied" ? "Copied" : result === "failed" ? "Copy failed" : "Copy"}</span>
    </button>
  )
}

function Playground() {
  const locale = useMemo<Locale>(() => getInitialLocale(), [])
  const initialQuery = useMemo(() => new URLSearchParams(window.location.search), [])
  const initialBlock = initialQuery.get("block")
  const initialTab = initialQuery.get("mode")
  const initialViewport = initialQuery.get("viewport")
  const initialState = initialQuery.get("state")
  const [block, setBlock] = useState<BlockId>(() => isBlockId(initialBlock) ? initialBlock : "dashboard-overview-01")
  const [tab, setTab] = useState<Tab>(() => isTab(initialTab) ? initialTab : "preview")
  const [viewport, setViewport] = useState<Viewport>(() => isViewport(initialViewport) ? initialViewport : "desktop")
  const [state, setState] = useState<DemoState>(() => isState(initialState) ? initialState : "success")
  const [refreshKey, setRefreshKey] = useState(0)
  const [registry, setRegistry] = useState<RegistryItem | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const navigationReturnFocusRef = useRef<HTMLButtonElement>(null)
  const [prompt, setPrompt] = useState(() => locale === "zh"
    ? "使用 Shadcn Agent Kit：先检查当前项目并生成计划，再 dry-run dashboard-overview-01；确认文件影响后接入 Data Adapter，并验证四态与 375/768/1440 响应式。"
    : "Use Shadcn Agent Kit to inspect this project, plan and dry-run dashboard-overview-01, then connect the data adapter and verify all four states at 375/768/1440.")

  const active = blocks.find(({ id }) => id === block) ?? blocks[0]
  const available = active.status === "Available"
  const scenario = active.scenarioId
    ? scenariosByLocale[locale].find(({ id }) => id === active.scenarioId as ScenarioId) ?? scenariosByLocale[locale][0]
    : null
  const registryUrl = useMemo(() => `${window.location.origin}${base("r/dashboard-overview-01.json")}`, [])
  const installCommand = `bunx --bun shadcn@4.14.1 add ${registryUrl} --dry-run`

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
    document.title = locale === "zh" ? "Dashboard Agent Playground" : "Dashboard Agent Playground"
  }, [locale])

  useEffect(() => {
    const query = new URLSearchParams({ block, mode: tab, viewport, state })
    window.history.replaceState(null, "", `${base("playground/")}?${query.toString()}`)
  }, [block, state, tab, viewport])

  useEffect(() => {
    if (!available || registry) return
    const controller = new AbortController()
    setLoadError(null)
    fetch(base("r/dashboard-overview-01.json"), { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((item: RegistryItem) => setRegistry(item))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setLoadError(error.message)
      })
    return () => controller.abort()
  }, [available, loadAttempt, registry])

  const text = locale === "zh"
    ? {
        workbench: "交互式组件工作台",
        home: "首页",
        title: "从真实 Block 开始，让 Agent 进入交付闭环。",
        intro: "Available 展示真实 Registry 源码与安装命令；Candidate 在验证通过前只提供概念预览和能力目录。",
        distribution: "业务组件分布",
        catalog: "组件目录",
        delivery: "交付分布",
        available: "Registry 已开放",
        candidate: "仅 Candidate",
        catalogOnly: "尚未发布源码或安装命令。",
        agent: "一键接入 Agent",
        prompt: "给 Coding Agent 的提示词",
        static: "本站只提供命令和源码上下文，不能直接修改你的本地项目。",
        availablePreview: "代表性交互预览：真实可安装源码以 Code 页签中的 Registry 为准，本预览不执行 Registry 源码。",
        candidatePreview: "确定性概念预览：该 Candidate 尚不可安装，也不会生成 Registry URL。",
        retry: "重新加载",
      }
    : {
        workbench: "Interactive block workbench",
        home: "Home",
        title: "Build from a real block, with the Agent in the loop.",
        intro: "Available exposes real Registry source and commands. Candidates remain concept previews and capability catalogs until verified.",
        distribution: "Business component distribution",
        catalog: "Block catalog",
        delivery: "Delivery map",
        available: "Registry available",
        candidate: "Candidate only",
        catalogOnly: "No source or install command is published.",
        agent: "One-click Agent connection",
        prompt: "Prompt for your coding Agent",
        static: "This site provides commands and source context; it cannot modify your local project.",
        availablePreview: "Representative interactive preview. The Registry in Code is the source of truth; this preview does not execute that source.",
        candidatePreview: "Deterministic concept preview. This Candidate is not installable and has no Registry URL.",
        retry: "Retry",
      }

  const currentUrl = `${base("playground/")}?${new URLSearchParams({ block, mode: tab, viewport, state }).toString()}`

  function selectBlock(id: BlockId) {
    setBlock(id)
    setState("success")
    setTab("preview")
  }

  return (
    <main className="playground-shell">
      <header className="pg-header">
        <a href={base("")} className="brand-lockup">
          <span className="brand-name"><strong>shadcn</strong> Agent Kit</span>
        </a>
        <span>{text.workbench}</span>
        <a className="pg-icon" href={base("")}><ExternalLink size={15} /> {text.home}</a>
      </header>

      <section className="pg-intro">
        <div>
          <span className="section-index">PLAYGROUND / 01</span>
          <h1>{text.title}</h1>
          <p>{text.intro}</p>
        </div>
        <div className="pg-distribution">
          <strong>{text.distribution}</strong>
          <span>Shell · Metrics · Analytics · Operations · Data Contract · States</span>
        </div>
      </section>

      <div className="pg-workbench">
        <aside className="pg-catalog">
          <span className="panel-label">{text.catalog}</span>
          {blocks.map(({ id, status, modules }) => (
            <button key={id} type="button" className={block === id ? "active" : ""} onClick={() => selectBlock(id)}>
              <span className="pg-block-heading">
                <strong>{id}</strong>
                <small className={status === "Available" ? "available" : "candidate"}>{status}</small>
              </span>
              <span>{modules}</span>
            </button>
          ))}
        </aside>

        <section className="pg-main">
          <div className="pg-toolbar">
            <div role="tablist" aria-label="Playground view">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={tab === item}
                  className={tab === item ? "active" : ""}
                  onClick={() => setTab(item)}
                >
                  {item === "agent" ? "Agent" : item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
            <span>{active.status} · {active.id}</span>
          </div>

          {tab === "preview" ? (
            <div className="pg-preview" role="tabpanel">
              <div className="pg-controls">
                <div aria-label="Viewport">
                  {viewports.map((item) => <button type="button" className={viewport === item ? "active" : ""} onClick={() => setViewport(item)} key={item}>{item}</button>)}
                </div>
                <div aria-label="Data state">
                  {states.map((item) => <button type="button" className={state === item ? "active" : ""} onClick={() => setState(item)} key={item}>{item}</button>)}
                </div>
                <button className="pg-icon" type="button" onClick={() => setRefreshKey((value) => value + 1)}><RefreshCw size={14} /> Refresh</button>
                <a className="pg-icon" href={currentUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> New</a>
              </div>
              {scenario ? (
                <>
                  <p className="pg-preview-note">{available ? text.availablePreview : text.candidatePreview}</p>
                  <div className={`pg-device ${viewport}`}>
                    <PreviewDashboard
                      scenario={scenario}
                      state={state}
                      locale={locale}
                      viewport={viewport}
                      resetKey={refreshKey}
                      navigationVisible={viewport === "desktop"}
                      onNavigationVisibleChange={() => {}}
                      navigationReturnFocusRef={navigationReturnFocusRef}
                    />
                  </div>
                </>
              ) : (
                <div className="pg-catalog-only">{active.id} is catalog-only. {text.catalogOnly}</div>
              )}
            </div>
          ) : null}

          {tab === "code" ? (
            <div className="pg-code" role="tabpanel">
              {available ? (
                loadError ? (
                  <div className="pg-error">
                    <p>Could not load the Registry: {loadError}</p>
                    <button className="pg-icon" type="button" onClick={() => setLoadAttempt((value) => value + 1)}>{text.retry}</button>
                  </div>
                ) : !registry ? (
                  <p>Loading real Registry JSON…</p>
                ) : (
                  <>
                    <div className="pg-command">
                      <code>{installCommand}</code>
                      <ClipboardButton value={installCommand} label="Copy dry-run install command" />
                    </div>
                    <div className="pg-package-map">
                      <span><strong>{registry.files?.length ?? 0}</strong> source file</span>
                      <span><strong>{registry.dependencies?.length ?? 0}</strong> packages</span>
                      <span><strong>{registry.registryDependencies?.length ?? 0}</strong> shadcn dependencies</span>
                    </div>
                    <div className="pg-files">
                      {registry.files?.map((file) => (
                        <details key={file.path}>
                          <summary>{file.path}</summary>
                          <pre><code>{file.content}</code></pre>
                        </details>
                      ))}
                    </div>
                  </>
                )
              ) : (
                <div className="pg-catalog-only">
                  <strong>Candidate block</strong>
                  <p>{text.catalogOnly}</p>
                </div>
              )}
            </div>
          ) : null}

          {tab === "agent" ? (
            <div className="pg-agent" role="tabpanel">
              <h2>{text.agent}</h2>
              <div className="pg-command">
                <code>{skillCommand}</code>
                <ClipboardButton value={skillCommand} label="Copy one-click Skill install command" />
              </div>
              <label>
                {text.prompt}
                <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
              </label>
              <ClipboardButton value={prompt} label="Copy Agent prompt" />
              <ol>
                <li>Inspect the target project and its local constraints.</li>
                <li>Plan files, contracts, states, and responsive behavior.</li>
                <li>Run shadcn dry-run before writing source.</li>
                <li>Apply after review, then typecheck, build, and verify.</li>
              </ol>
              <p>{text.static}</p>
            </div>
          ) : null}
        </section>

        <aside className="pg-delivery">
          <span className="panel-label">{text.delivery}</span>
          <dl>
            <dt>Shell</dt><dd>Sidebar, navigation, command search</dd>
            <dt>Metrics</dt><dd>KPI grid and trend</dd>
            <dt>Analytics</dt><dd>Chart and range controls</dd>
            <dt>Operations</dt><dd>Managed data table</dd>
            <dt>Data Contract</dt><dd>Runtime schema and field paths</dd>
            <dt>States</dt><dd>Success · Loading · Empty · Contract error</dd>
          </dl>
          <div className="pg-status">
            <strong>{available ? text.available : text.candidate}</strong>
            <span>{available ? "13-file dry-run is ready to inspect." : text.catalogOnly}</span>
          </div>
        </aside>
      </div>
    </main>
  )
}

applyInitialPreferences()
const root = document.getElementById("root")
if (!root) throw new Error("Missing #root element")
createRoot(root).render(<StrictMode><Playground /></StrictMode>)
