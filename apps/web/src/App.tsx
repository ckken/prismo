import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clipboard,
  Code2,
  FileCheck2,
  Github,
  Menu,
  Moon,
  PackageCheck,
  Search,
  ShieldCheck,
  Sun,
  WandSparkles,
  X,
} from "lucide-react"
import { LogoMark } from "./components/logo"
import { PreviewDashboard } from "./components/preview-dashboard"
import { scenarios, type DemoState, type ScenarioId } from "./data"

const states: Array<{ id: DemoState; label: string }> = [
  { id: "success", label: "Success" },
  { id: "loading", label: "Loading" },
  { id: "empty", label: "Empty" },
  { id: "contract-error", label: "Contract error" },
]

const proofSteps = [
  ["01", "Understand", "Project and requirement profiles"],
  ["02", "Match", "Available recipes only"],
  ["03", "Install", "Dry-run before source changes"],
  ["04", "Bind", "One project-side data source"],
  ["05", "Prove", "Type, build, states and a11y"],
]

const proofChecks = [
  ["Type + Build", "passed", "TS 7 noEmit · Rsbuild production"],
  ["Contract", "passed", "Runtime schema with field paths"],
  ["States", "passed", "Success · Loading · Empty · Error"],
  ["Responsive", "manual", "375 · 768 · 1440 browser review"],
  ["Accessibility", "planned", "Keyboard and contrast audit"],
]

function joinBase(path: string) {
  return `${__PUBLIC_BASE_PATH__.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

export function App() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("sales")
  const [demoState, setDemoState] = useState<DemoState>("success")
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId],
  )
  const registryUrl = useMemo(() => {
    if (typeof window === "undefined") return joinBase("r/dashboard-overview-01.json")
    return `${window.location.origin}${joinBase("r/dashboard-overview-01.json")}`
  }, [])
  const installCommand = `bunx --bun shadcn@4.14.1 add ${registryUrl} --dry-run`
  const repositoryUrl = __PUBLIC_REPOSITORY_URL__

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const sectionId = window.location.hash.slice(1)
    if (!sectionId) return
    window.requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView())
  }, [])

  async function copyInstall() {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="#top" className="logo-link"><LogoMark /></a>
        <nav className={mobileOpen ? "site-nav open" : "site-nav"} aria-label="Main navigation">
          <a href="#workflow" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#showcase" onClick={() => setMobileOpen(false)}>Showcase</a>
          <a href="#recipes" onClick={() => setMobileOpen(false)}>Recipes</a>
          <a href="#skill" onClick={() => setMobileOpen(false)}>Skill</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle color theme">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a className="icon-button" href={repositoryUrl} aria-label="Open GitHub repository"><Github size={17} /></a>
          <button className="icon-button mobile-menu" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Independent toolkit for shadcn-compatible React projects</div>
            <h1>From request<br />to <em>proof.</em></h1>
            <p>Give your coding agent a dashboard request. It selects an installable recipe, keeps the source in your project, connects your data, and verifies the result.</p>
            <div className="hero-actions">
              <a className="button primary" href="#showcase">Explore showcase <ArrowRight size={16} /></a>
              <a className="button secondary" href="#skill">Read the skill <ChevronRight size={16} /></a>
            </div>
            <div className="hero-footnote"><ShieldCheck size={15} /> No black-box UI runtime. No silent overwrite.</div>
          </div>
          <div className="hero-console" aria-label="Agent delivery plan preview">
            <div className="console-bar"><span /><span /><span /><code>agent-plan.json</code></div>
            <div className="console-body">
              <div className="console-line muted">$ shadcn-agent inspect</div>
              <div className="console-group">
                <span className="line-number">01</span>
                <div><small>PROJECT</small><strong>React 19 · Rsbuild · shadcn</strong></div>
                <Check size={16} />
              </div>
              <div className="console-group active">
                <span className="line-number">02</span>
                <div><small>RECIPE MATCH</small><strong>dashboard-overview-01</strong></div>
                <span className="score">94</span>
              </div>
              <div className="console-group">
                <span className="line-number">03</span>
                <div><small>DRY RUN</small><strong>5 files · 0 conflicts</strong></div>
                <Check size={16} />
              </div>
              <div className="console-group">
                <span className="line-number">04</span>
                <div><small>PROOF</small><strong>4 passed · 1 planned</strong></div>
                <FileCheck2 size={16} />
              </div>
            </div>
            <div className="console-proof"><span className="pulse" /> Simulated agent plan · deterministic demo</div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Project properties">
          <span>Editable source</span><i />
          <span>shadcn Registry</span><i />
          <span>Runtime contracts</span><i />
          <span>Proof reports</span>
        </section>

        <section className="workflow section-wrap" id="workflow">
          <div className="section-heading split-heading">
            <div><span className="section-index">01 / WORKFLOW</span><h2>A delivery rail your agent can follow.</h2></div>
            <p>Reasoning stays with the coding agent. Fragile steps become inspectable scripts, schemas, and file plans.</p>
          </div>
          <div className="rail">
            {proofSteps.map(([index, title, description]) => (
              <article className="rail-step" key={index}>
                <span>{index}</span><div className="rail-dot" /><h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="showcase section-wrap" id="showcase">
          <div className="section-heading">
            <span className="section-index">02 / SHOWCASE</span>
            <h2>One request. A concrete plan.</h2>
            <p>Explore three scenario contracts before they become public recipes. The live preview is deterministic and runs without an online model.</p>
          </div>

          <div className="showcase-frame">
            <aside className="prompt-panel">
              <span className="panel-label">REQUEST</span>
              <div className="scenario-tabs" role="tablist" aria-label="Scenario">
                {scenarios.map((item) => (
                  <button key={item.id} role="tab" aria-selected={scenarioId === item.id} className={scenarioId === item.id ? "active" : ""} type="button" onClick={() => setScenarioId(item.id)}>{item.label}</button>
                ))}
              </div>
              <div className="prompt-box"><WandSparkles size={16} /><p>{scenario.prompt}</p></div>
              <div className="requirement-list">
                <span className="panel-label">EXTRACTED REQUIREMENTS</span>
                {["KPI overview", "Time-series trend", "Managed data table", "Runtime contract"].map((item) => <div key={item}><Check size={13} />{item}</div>)}
              </div>
              <div className="concept-note"><span>Candidate</span> No install command until verification passes.</div>
            </aside>

            <div className="preview-panel">
              <div className="preview-toolbar">
                <div><span className="status-dot" /> Preview</div>
                <div className="state-tabs" role="tablist" aria-label="Data state">
                  {states.map((item) => <button key={item.id} role="tab" aria-selected={demoState === item.id} className={demoState === item.id ? "active" : ""} type="button" onClick={() => setDemoState(item.id)}>{item.label}</button>)}
                </div>
              </div>
              <PreviewDashboard scenario={scenario} state={demoState} />
            </div>

            <aside className="inspector-panel">
              <span className="panel-label">INSPECTOR</span>
              <div className="inspector-tabs" aria-label="Inspector view"><span className="active">Recipe</span><span>Data</span><span>Proof</span></div>
              <div className="tree">
                <div><ChevronRight size={13} /> <strong>{scenario.id}</strong></div>
                <div className="tree-child"><PackageCheck size={13} /> metric-cards</div>
                <div className="tree-child"><PackageCheck size={13} /> trend-chart</div>
                <div className="tree-child"><PackageCheck size={13} /> managed-table</div>
              </div>
              <div className="inspector-card"><span>TABLE LEVEL</span><strong>L2 · Server controlled</strong></div>
              <div className="inspector-card"><span>ADAPTER</span><strong>Fixture / REST source</strong></div>
              <div className="inspector-card"><span>STATES</span><strong>4 required · 1 failure branch</strong></div>
            </aside>
          </div>
        </section>

        <section className="recipes section-wrap" id="recipes">
          <div className="section-heading split-heading">
            <div><span className="section-index">03 / RECIPES</span><h2>Start with dashboards. Keep the protocol.</h2></div>
            <p>The same inspect, install, bind, and prove contract can later support brand sites and workflow apps.</p>
          </div>
          <div className="family-grid">
            <article className="family-card featured">
              <span className="family-status available">Registry POC available</span>
              <Code2 />
              <h3>Dashboards</h3>
              <p>KPI, charts, filters, management tables, contracts, and data states.</p>
              <div className="family-list"><span>Overview starter</span><span>Sales</span><span>Commerce</span><span>Agent Ops</span></div>
            </article>
            <article className="family-card">
              <span className="family-status">Candidate</span>
              <Search />
              <h3>Sites</h3>
              <p>Brand pages, product launches, documentation, metadata, links, and performance.</p>
              <div className="family-list"><span>SaaS landing</span><span>Docs</span><span>Launch page</span></div>
            </article>
            <article className="family-card">
              <span className="family-status">Candidate</span>
              <PackageCheck />
              <h3>Apps</h3>
              <p>Onboarding, settings, billing, approvals, state transitions, and permissions.</p>
              <div className="family-list"><span>Onboarding</span><span>Settings</span><span>Billing</span></div>
            </article>
          </div>
        </section>

        <section className="proof-section section-wrap">
          <div className="proof-copy">
            <span className="section-index">04 / PROOF</span>
            <h2>Proof is part of the recipe.</h2>
            <p>A build is useful evidence, not the whole answer. Reports preserve failed and unverified checks instead of turning them green.</p>
            <div className="proof-quote"><FileCheck2 /><span>proof-report.json</span><strong>Machine-readable. Human-reviewable.</strong></div>
          </div>
          <div className="proof-list">
            {proofChecks.map(([label, status, detail]) => (
              <div className="proof-row" key={label}>
                <span className={`proof-icon ${status}`}><Check size={14} /></span>
                <div><strong>{label}</strong><small>{detail}</small></div>
                <span className={`proof-status ${status}`}>{status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="getting-started section-wrap" id="skill">
          <div className="section-heading">
            <span className="section-index">05 / GET STARTED</span>
            <h2>Install the first registry POC.</h2>
            <p>The URL below resolves to a real static Registry item on this site. Preview it before adding source to a project.</p>
          </div>
          <div className="command-card">
            <div className="command-tabs"><span className="active">Direct URL</span><span>Namespace</span></div>
            <div className="command-line"><code>{installCommand}</code><button type="button" onClick={copyInstall} aria-label={copied ? "Dry-run command copied" : "Copy dry-run command"}>{copied ? <Check size={16} /> : <Clipboard size={16} />}</button></div>
            <div className="command-meta"><span><Check size={14} /> Editable React source</span><span><Check size={14} /> No runtime package</span><span><Check size={14} /> Dry-run supported</span></div>
          </div>
        </section>

        <section className="final-cta section-wrap">
          <LogoMark compact />
          <h2>Give your agent something<br />it can actually ship.</h2>
          <p>Start with one proven recipe. Keep every line of source.</p>
          <a className="button primary" href="#showcase">Open showcase <ArrowRight size={16} /></a>
        </section>
      </main>

      <footer className="site-footer">
        <div><LogoMark /><p>From request to proof.</p></div>
        <p className="disclaimer">Shadcn Agent Kit is an independent community project. It is not affiliated with, endorsed by, or sponsored by shadcn or shadcn/ui. The shadcn name is used only to describe compatibility.</p>
        <div className="footer-links"><a href="#workflow">Workflow</a><a href="#recipes">Recipes</a><a href="#skill">Skill</a><a href={repositoryUrl}>GitHub</a></div>
      </footer>
    </div>
  )
}
