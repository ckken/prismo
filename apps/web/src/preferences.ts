import type { Locale } from "./i18n"

export type Theme = "light" | "dark"

const localeKey = "shadcn-agent-kit-locale"
const themeKey = "shadcn-agent-kit-theme"

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // The active preference still applies even when storage is unavailable.
  }
}

export function getSystemLocale(): Locale {
  return window.navigator.languages.some((language) => language.toLowerCase().startsWith("zh"))
    ? "zh"
    : "en"
}

export function getLocaleOverride(): Locale | null {
  const value = readStorage(localeKey)
  return value === "zh" || value === "en" ? value : null
}

export function getInitialLocale(): Locale {
  return getLocaleOverride() ?? getSystemLocale()
}

export function saveLocaleOverride(locale: Locale) {
  writeStorage(localeKey, locale)
}

export function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function getThemeOverride(): Theme | null {
  const value = readStorage(themeKey)
  return value === "light" || value === "dark" ? value : null
}

export function getInitialTheme(): Theme {
  return getThemeOverride() ?? getSystemTheme()
}

export function saveThemeOverride(theme: Theme) {
  writeStorage(themeKey, theme)
}

export function applyPreferences(locale: Locale, theme: Theme) {
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"
  document.documentElement.dataset.theme = theme
}

export function applyInitialPreferences() {
  const locale = getInitialLocale()
  const theme = getInitialTheme()
  applyPreferences(locale, theme)
}
