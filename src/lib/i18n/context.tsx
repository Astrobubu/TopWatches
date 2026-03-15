"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { type Locale, locales, defaultLocale, getTranslation, rtlLocales } from "./index"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key) => key,
  dir: "ltr",
})

const STORAGE_KEY = "gw-locale"

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && (locales as readonly string[]).includes(saved)) {
      setLocaleState(saved)
      return
    }
    // Auto-detect from browser language
    const browserLangs = navigator.languages || [navigator.language]
    for (const lang of browserLangs) {
      const code = lang.split("-")[0].toLowerCase()
      if ((locales as readonly string[]).includes(code)) {
        setLocaleState(code as Locale)
        localStorage.setItem(STORAGE_KEY, code)
        return
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = rtlLocales.includes(locale) ? "rtl" : "ltr"
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }, [])

  const t = useCallback(
    (key: string) => getTranslation(locale, key),
    [locale]
  )

  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr"

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export function useTranslation() {
  const { t, locale, dir } = useContext(I18nContext)
  return { t, locale, dir }
}
