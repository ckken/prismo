import { useEffect, useRef, useState } from "react"
import {
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  Download,
  LayoutDashboard,
  ListChecks,
  Menu,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react"
import type { DemoState, Scenario } from "../data"
import { copy, type Locale } from "../i18n"
import { getSceneChrome, PreviewScene, type PreviewRange } from "./preview-scenes"

const navigationIcons = [LayoutDashboard, BarChart3, ListChecks, Bot, Users]

export function PreviewDashboard({ scenario, state, locale }: { scenario: Scenario; state: DemoState; locale: Locale }) {
  const t = copy[locale].preview
  const chrome = getSceneChrome(locale, scenario.id)
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [compactNavigation, setCompactNavigation] = useState(false)
  const [activeNav, setActiveNav] = useState<string>(chrome.navigation[0][1])
  const [query, setQuery] = useState("")
  const [range, setRange] = useState<PreviewRange>("30d")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const navigationRef = useRef<HTMLElement>(null)
  const navigationToggleRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const toastTimerRef = useRef<number | null>(null)

  const announce = (message: string) => {
    setToast(message)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2200)
  }

  const closeNavigation = () => {
    setNavigationOpen(false)
    if (compactNavigation) window.requestAnimationFrame(() => navigationToggleRef.current?.focus())
  }

  useEffect(() => {
    setNavigationOpen(false)
    setNotificationsOpen(false)
    setActiveNav(chrome.navigation[0][1])
    setQuery("")
    setRange("30d")
    setToast(null)
  }, [chrome, scenario.id])

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)")
    const sync = () => setCompactNavigation(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", focusSearch)
    return () => window.removeEventListener("keydown", focusSearch)
  }, [])

  useEffect(() => {
    if (!compactNavigation || !navigationOpen) return
    const sidebar = navigationRef.current
    sidebar?.querySelector<HTMLElement>("button, a")?.focus()
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNavigation()
        return
      }
      if (event.key !== "Tab") return
      const focusable = Array.from(sidebar?.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])") ?? [])
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", trapFocus)
    return () => window.removeEventListener("keydown", trapFocus)
  }, [compactNavigation, navigationOpen])

  let iconIndex = 0

  return (
    <div className={navigationOpen ? "dashboard-shell navigation-open" : "dashboard-shell"}>
      <aside
        aria-hidden={compactNavigation && !navigationOpen ? true : undefined}
        aria-label={compactNavigation ? t.navigation.label : undefined}
        aria-modal={compactNavigation && navigationOpen ? true : undefined}
        className="dashboard-sidebar"
        id="showcase-dashboard-navigation"
        inert={compactNavigation && !navigationOpen ? true : undefined}
        ref={navigationRef}
        role={compactNavigation ? "dialog" : undefined}
      >
        <div className="dashboard-brand">
          <span><Sparkles size={16} /></span>
          <div><strong>{chrome.brand}</strong><small>{chrome.workspace}</small></div>
          <ChevronDown className="dashboard-brand-chevron" size={14} />
          <button className="dashboard-sidebar-close" type="button" aria-label={t.navigation.close} onClick={closeNavigation}><X size={15} /></button>
        </div>
        <nav className="dashboard-navigation" aria-label={t.navigation.label}>
          {chrome.navigation.map(([group, ...items]) => (
            <div className="dashboard-nav-group" key={group}>
              <span>{group}</span>
              {items.map((item) => {
                const Icon = navigationIcons[iconIndex++ % navigationIcons.length]
                return (
                  <a
                    href="#showcase"
                    className={activeNav === item ? "active" : undefined}
                    aria-current={activeNav === item ? "page" : undefined}
                    key={item}
                    onClick={(event) => { event.preventDefault(); setActiveNav(item); closeNavigation(); announce(`${item} · ${locale === "zh" ? "预览已切换" : "preview selected"}`) }}
                  >
                    <Icon size={13} />
                    <span>{item}</span>
                  </a>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="dashboard-sidebar-footer">
          <a href="#showcase" onClick={(event) => { event.preventDefault(); setActiveNav(t.navigation.settings); closeNavigation(); announce(locale === "zh" ? "设置为预览交互" : "Settings is simulated") }}><Settings size={13} /><span>{t.navigation.settings}</span></a>
          <div className="dashboard-user">
            <span className="dashboard-avatar">AK</span>
            <div><strong>Agent Kit</strong><small>{t.navigation.role}</small></div>
            <ChevronDown size={12} />
          </div>
        </div>
      </aside>

      <div className="dashboard-workspace" aria-hidden={compactNavigation && navigationOpen ? true : undefined} inert={compactNavigation && navigationOpen ? true : undefined}>
        <header className="dashboard-topbar">
          <button ref={navigationToggleRef} className="dashboard-nav-toggle" type="button" aria-label={navigationOpen ? t.navigation.close : t.navigation.open} aria-controls="showcase-dashboard-navigation" aria-expanded={navigationOpen} onClick={() => setNavigationOpen(!navigationOpen)}>
            {navigationOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
          <label className="dashboard-search">
            <Search size={13} />
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={chrome.search} aria-label={chrome.search} />
            <kbd>⌘ K</kbd>
          </label>
          <div className="dashboard-topbar-actions">
            <button type="button" aria-label={t.navigation.notifications} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={14} /><span /></button>
            <span className="dashboard-avatar">AK</span>
            {notificationsOpen ? <div className="notification-popover" role="status"><strong>{locale === "zh" ? "通知" : "Notifications"}</strong><p>{chrome.notification}</p><button type="button" onClick={() => setNotificationsOpen(false)}>{locale === "zh" ? "知道了" : "Dismiss"}</button></div> : null}
          </div>
        </header>

        <section className="dashboard-content" aria-label={scenario.eyebrow}>
          <div className="dash-heading">
            <div>
              <span className="dash-kicker">{activeNav}</span>
              <h3>{scenario.eyebrow}</h3>
              <p>{locale === "zh" ? "所有操作均为本地仿真，不会写入真实数据。" : "Every action is a local simulation with no persistent writes."}</p>
            </div>
            <div className="dash-actions">
              <select className="mini-button" aria-label={locale === "zh" ? "时间范围" : "Date range"} value={range} onChange={(event) => setRange(event.target.value as PreviewRange)}>
                {(["7d", "30d", "90d"] as const).map((item) => <option value={item} key={item}>{chrome.range[item]}</option>)}
              </select>
              <button className="mini-button primary" type="button" onClick={() => announce(chrome.exportReady)}><Download size={13} />{t.navigation.export}</button>
            </div>
          </div>
          <div className="dashboard-canvas">
            <PreviewScene key={`${scenario.id}-${locale}-${state}`} scenario={scenario} state={state} locale={locale} query={query} range={range} announce={announce} />
          </div>
        </section>
      </div>
      <button className="dashboard-nav-backdrop" type="button" aria-label={t.navigation.close} onClick={closeNavigation} />
      {toast ? <div className="scene-toast" role="status" aria-live="polite"><span><Sparkles size={13} /></span>{toast}</div> : null}
    </div>
  )
}
