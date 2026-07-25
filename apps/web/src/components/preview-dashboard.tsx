import { useEffect, useRef, useState } from "react"
import {
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  ChevronsUpDown,
  CreditCard,
  Download,
  LayoutDashboard,
  ListChecks,
  LogOut,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const navigationRef = useRef<HTMLElement>(null)
  const navigationToggleRef = useRef<HTMLButtonElement>(null)
  const settingsLinkRef = useRef<HTMLAnchorElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const userMenuTriggerRef = useRef<HTMLButtonElement>(null)
  const userMenuOpenRef = useRef(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const toastTimerRef = useRef<number | null>(null)

  const announce = (message: string) => {
    setToast(message)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2200)
  }

  const closeNavigation = () => {
    setNavigationOpen(false)
    setUserMenuOpen(false)
    if (compactNavigation) window.requestAnimationFrame(() => navigationToggleRef.current?.focus())
  }

  userMenuOpenRef.current = userMenuOpen

  const selectUserMenuItem = (message: string) => {
    setUserMenuOpen(false)
    announce(message)
    window.requestAnimationFrame(() => userMenuTriggerRef.current?.focus())
  }

  useEffect(() => {
    setNavigationOpen(false)
    setNotificationsOpen(false)
    setUserMenuOpen(false)
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
        if (userMenuOpenRef.current) return
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

  useEffect(() => {
    if (!userMenuOpen) return
    window.requestAnimationFrame(() => userMenuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus())
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) setUserMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setUserMenuOpen(false)
      userMenuTriggerRef.current?.focus()
    }
    document.addEventListener("pointerdown", closeOnOutsidePress)
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress)
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [userMenuOpen])

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
          <ChevronsUpDown className="dashboard-brand-chevron" size={14} />
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
          <a ref={settingsLinkRef} href="#showcase" onClick={(event) => { event.preventDefault(); setActiveNav(t.navigation.settings); closeNavigation(); announce(locale === "zh" ? "设置为预览交互" : "Settings is simulated") }}><Settings size={13} /><span>{t.navigation.settings}</span></a>
          <div className="dashboard-user-menu" ref={userMenuRef}>
            {userMenuOpen ? (
              <div
                className="dashboard-user-popover"
                id="dashboard-user-menu"
                role="menu"
                aria-label={t.navigation.userMenu}
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    event.preventDefault()
                    setUserMenuOpen(false)
                    const destination = event.shiftKey
                      ? settingsLinkRef.current
                      : compactNavigation
                        ? userMenuTriggerRef.current
                        : searchRef.current
                    window.requestAnimationFrame(() => destination?.focus())
                    return
                  }
                  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return
                  event.preventDefault()
                  const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'))
                  const current = items.indexOf(document.activeElement as HTMLButtonElement)
                  const next = event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? items.length - 1
                      : event.key === "ArrowDown"
                        ? (current + 1) % items.length
                        : (current - 1 + items.length) % items.length
                  items[next]?.focus()
                }}
              >
                <div className="dashboard-user-summary">
                  <span className="dashboard-avatar">AK</span>
                  <div><strong>Agent Kit</strong><small>agent@shadcnkit.dev</small></div>
                </div>
                <div className="dashboard-user-separator" role="separator" />
                <button type="button" role="menuitem" onClick={() => selectUserMenuItem(`${t.navigation.account} · ${locale === "zh" ? "预览" : "preview"}`)}><BadgeCheck size={14} /><span>{t.navigation.account}</span></button>
                <button type="button" role="menuitem" onClick={() => selectUserMenuItem(`${t.navigation.billing} · ${locale === "zh" ? "预览" : "preview"}`)}><CreditCard size={14} /><span>{t.navigation.billing}</span></button>
                <button type="button" role="menuitem" onClick={() => selectUserMenuItem(`${t.navigation.notificationSettings} · ${locale === "zh" ? "预览" : "preview"}`)}><Bell size={14} /><span>{t.navigation.notificationSettings}</span></button>
                <div className="dashboard-user-separator" role="separator" />
                <button type="button" role="menuitem" onClick={() => selectUserMenuItem(t.navigation.logoutPreview)}><LogOut size={14} /><span>{t.navigation.logout}</span></button>
              </div>
            ) : null}
            <button
              ref={userMenuTriggerRef}
              className="dashboard-user"
              type="button"
              aria-haspopup="menu"
              aria-controls="dashboard-user-menu"
              aria-expanded={userMenuOpen}
              onClick={() => { setNotificationsOpen(false); setUserMenuOpen((value) => !value) }}
            >
              <span className="dashboard-avatar">AK</span>
              <span className="dashboard-user-copy"><strong>Agent Kit</strong><small>agent@shadcnkit.dev</small></span>
              <ChevronsUpDown size={14} />
            </button>
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
            <button type="button" aria-label={t.navigation.notifications} aria-expanded={notificationsOpen} onClick={() => { setUserMenuOpen(false); setNotificationsOpen((value) => !value) }}><Bell size={14} /><span /></button>
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
