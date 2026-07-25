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
  X,
} from "lucide-react"
import { LogoMark } from "./components/logo"
import { PreviewDashboard } from "./components/preview-dashboard"
import { scenariosByLocale, type DemoState, type ScenarioId } from "./data"
import { copy, type Locale } from "./i18n"
import {
  applyPreferences,
  getInitialLocale,
  getInitialTheme,
  getLocaleOverride,
  getSystemLocale,
  getSystemTheme,
  getThemeOverride,
  saveLocaleOverride,
  saveThemeOverride,
  type Theme,
} from "./preferences"

function joinBase(path: string) {
  return `${__PUBLIC_BASE_PATH__.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

export function App() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("sales")
  const [demoState, setDemoState] = useState<DemoState>("success")
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale())
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const [mobileOpen, setMobileOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const t = copy[locale]
  const scenarios = scenariosByLocale[locale]
  const states: Array<{ id: DemoState; label: string }> = [
    { id: "success", label: t.showcase.states.success },
    { id: "loading", label: t.showcase.states.loading },
    { id: "empty", label: t.showcase.states.empty },
    { id: "contract-error", label: t.showcase.states["contract-error"] },
  ]
  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId, scenarios],
  )
  const registryUrl = useMemo(() => {
    if (typeof window === "undefined") return joinBase("r/dashboard-overview-01.json")
    return `${window.location.origin}${joinBase("r/dashboard-overview-01.json")}`
  }, [])
  const installCommand = `bunx --bun shadcn@4.14.1 add ${registryUrl} --dry-run`
  const repositoryUrl = __PUBLIC_REPOSITORY_URL__

  useEffect(() => {
    applyPreferences(locale, theme)
    document.title = t.meta.title
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", t.meta.description)
  }, [locale, t.meta.description, t.meta.title, theme])

  useEffect(() => {
    const handleLanguageChange = () => {
      if (!getLocaleOverride()) setLocale(getSystemLocale())
    }
    window.addEventListener("languagechange", handleLanguageChange)
    return () => window.removeEventListener("languagechange", handleLanguageChange)
  }, [])

  useEffect(() => {
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")
    const handleColorSchemeChange = () => {
      if (!getThemeOverride()) setTheme(getSystemTheme())
    }
    colorScheme.addEventListener("change", handleColorSchemeChange)
    return () => colorScheme.removeEventListener("change", handleColorSchemeChange)
  }, [])

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

  function toggleLocale() {
    const nextLocale = locale === "en" ? "zh" : "en"
    saveLocaleOverride(nextLocale)
    setLocale(nextLocale)
    setMobileOpen(false)
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark"
    saveThemeOverride(nextTheme)
    setTheme(nextTheme)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="#top" className="logo-link"><LogoMark /></a>
        <nav className={mobileOpen ? "site-nav open" : "site-nav"} aria-label={t.aria.mainNavigation}>
          <a href="#workflow" onClick={() => setMobileOpen(false)}>{t.nav.workflow}</a>
          <a href="#showcase" onClick={() => setMobileOpen(false)}>{t.nav.showcase}</a>
          <a href="#recipes" onClick={() => setMobileOpen(false)}>{t.nav.recipes}</a>
          <a href="#skill" onClick={() => setMobileOpen(false)}>{t.nav.skill}</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button locale-button" type="button" onClick={toggleLocale} aria-label={t.aria.switchLanguage}>
            {locale === "en" ? "中" : "EN"}
          </button>
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? t.aria.switchToLight : t.aria.switchToDark}>
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a className="icon-button" href={repositoryUrl} aria-label={t.aria.openGithub}><Github size={17} /></a>
          <button className="icon-button mobile-menu" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={t.aria.toggleMenu}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span /> {t.hero.eyebrow}</div>
            <h1>{t.hero.titleBefore}<br />{t.hero.titleAfter} <em>{t.hero.titleEmphasis}</em></h1>
            <p>{t.hero.description}</p>
            <div className="hero-actions">
              <a className="button primary" href="#showcase">{t.hero.primaryAction} <ArrowRight size={16} /></a>
              <a className="button secondary" href="#skill">{t.hero.secondaryAction} <ChevronRight size={16} /></a>
            </div>
            <div className="hero-footnote"><ShieldCheck size={15} /> {t.hero.footnote}</div>
          </div>
          <div className="hero-console" aria-label={t.aria.agentPreview}>
            <div className="console-bar"><span /><span /><span /><code>agent-plan.json</code></div>
            <div className="console-body">
              <div className="console-line muted">{t.console.command}</div>
              <div className="console-group">
                <span className="line-number">01</span>
                <div><small>{t.console.project}</small><strong>{t.console.projectValue}</strong></div>
                <Check size={16} />
              </div>
              <div className="console-group active">
                <span className="line-number">02</span>
                <div><small>{t.console.match}</small><strong>{t.console.matchValue}</strong></div>
                <span className="score">94</span>
              </div>
              <div className="console-group">
                <span className="line-number">03</span>
                <div><small>{t.console.dryRun}</small><strong>{t.console.dryRunValue}</strong></div>
                <Check size={16} />
              </div>
              <div className="console-group">
                <span className="line-number">04</span>
                <div><small>{t.console.proof}</small><strong>{t.console.proofValue}</strong></div>
                <FileCheck2 size={16} />
              </div>
            </div>
            <div className="console-proof"><span className="pulse" /> {t.console.note}</div>
          </div>
        </section>

        <section className="trust-strip" aria-label={t.aria.projectProperties}>
          <span>{t.trust[0]}</span><i />
          <span>{t.trust[1]}</span><i />
          <span>{t.trust[2]}</span><i />
          <span>{t.trust[3]}</span>
        </section>

        <section className="workflow section-wrap" id="workflow">
          <div className="section-heading split-heading">
            <div><span className="section-index">{t.workflow.index}</span><h2>{t.workflow.title}</h2></div>
            <p>{t.workflow.description}</p>
          </div>
          <div className="rail">
            {t.workflow.steps.map((step) => (
              <article className="rail-step" key={step.index}>
                <span>{step.index}</span><div className="rail-dot" /><h3>{step.title}</h3><p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="showcase section-wrap" id="showcase">
          <div className="section-heading">
            <span className="section-index">{t.showcase.index}</span>
            <h2>{t.showcase.title}</h2>
            <p>{t.showcase.description}</p>
          </div>

          <div className="showcase-frame preview-only">
            <div className="preview-panel">
              <div className="preview-toolbar preview-toolbar-rich">
                <div className="preview-mode-group">
                  <span><span className="status-dot" /> {t.showcase.preview}</span>
                  <div className="scenario-tabs" role="group" aria-label={t.aria.scenario}>
                    {scenarios.map((item) => (
                      <button key={item.id} aria-pressed={scenarioId === item.id} className={scenarioId === item.id ? "active" : ""} type="button" onClick={() => { setScenarioId(item.id); setDemoState("success") }}>{item.label}</button>
                    ))}
                  </div>
                </div>
                <div className="state-tabs" role="group" aria-label={t.aria.dataState}>
                  {states.map((item) => <button key={item.id} aria-pressed={demoState === item.id} className={demoState === item.id ? "active" : ""} type="button" onClick={() => setDemoState(item.id)}>{item.label}</button>)}
                </div>
              </div>
              <PreviewDashboard key={scenario.id} scenario={scenario} state={demoState} locale={locale} />
            </div>
          </div>
        </section>

        <section className="recipes section-wrap" id="recipes">
          <div className="section-heading split-heading">
            <div><span className="section-index">{t.recipes.index}</span><h2>{t.recipes.title}</h2></div>
            <p>{t.recipes.description}</p>
          </div>
          <div className="family-grid">
            <article className="family-card featured">
              <span className="family-status available">{t.recipes.available}</span>
              <Code2 />
              <h3>{t.recipes.dashboards.title}</h3>
              <p>{t.recipes.dashboards.description}</p>
              <div className="family-list">{t.recipes.dashboards.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
            <article className="family-card">
              <span className="family-status">{t.recipes.candidate}</span>
              <Search />
              <h3>{t.recipes.sites.title}</h3>
              <p>{t.recipes.sites.description}</p>
              <div className="family-list">{t.recipes.sites.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
            <article className="family-card">
              <span className="family-status">{t.recipes.candidate}</span>
              <PackageCheck />
              <h3>{t.recipes.apps.title}</h3>
              <p>{t.recipes.apps.description}</p>
              <div className="family-list">{t.recipes.apps.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          </div>
        </section>

        <section className="proof-section section-wrap">
          <div className="proof-copy">
            <span className="section-index">{t.proof.index}</span>
            <h2>{t.proof.title}</h2>
            <p>{t.proof.description}</p>
            <div className="proof-quote"><FileCheck2 /><span>proof-report.json</span><strong>{t.proof.quote}</strong></div>
          </div>
          <div className="proof-list">
            {t.proof.checks.map((check) => (
              <div className="proof-row" key={check.label}>
                <span className={`proof-icon ${check.status}`}><Check size={14} /></span>
                <div><strong>{check.label}</strong><small>{check.detail}</small></div>
                <span className={`proof-status ${check.status}`}>{check.statusLabel}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="getting-started section-wrap" id="skill">
          <div className="section-heading">
            <span className="section-index">{t.gettingStarted.index}</span>
            <h2>{t.gettingStarted.title}</h2>
            <p>{t.gettingStarted.description}</p>
          </div>
          <div className="command-card">
            <div className="command-tabs"><span className="active">{t.gettingStarted.directUrl}</span><span>{t.gettingStarted.namespace}</span></div>
            <div className="command-line"><code>{installCommand}</code><button type="button" onClick={copyInstall} aria-label={copied ? t.aria.copiedCommand : t.aria.copyCommand}>{copied ? <Check size={16} /> : <Clipboard size={16} />}</button></div>
            <div className="command-meta">{t.gettingStarted.meta.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</div>
          </div>
        </section>

        <section className="final-cta section-wrap">
          <LogoMark compact />
          <h2>{t.finalCta.titleBefore}<br />{t.finalCta.titleAfter}</h2>
          <p>{t.finalCta.description}</p>
          <a className="button primary" href="#showcase">{t.finalCta.action} <ArrowRight size={16} /></a>
        </section>
      </main>

      <footer className="site-footer">
        <div><LogoMark /><p>{t.footer.slogan}</p></div>
        <p className="disclaimer">{t.footer.disclaimer}</p>
        <div className="footer-links"><a href="#workflow">{t.footer.workflow}</a><a href="#recipes">{t.footer.recipes}</a><a href="#skill">{t.footer.skill}</a><a href={repositoryUrl}>GitHub</a></div>
      </footer>
    </div>
  )
}
