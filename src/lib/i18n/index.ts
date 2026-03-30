import en from "./translations/en.json"
import zh from "./translations/zh.json"
import ar from "./translations/ar.json"
import ru from "./translations/ru.json"
import pcm from "./translations/pcm.json"
import fa from "./translations/fa.json"

export const locales = ["en", "zh", "ar", "fa", "ru", "pcm"] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ar: "العربية",
  fa: "فارسی",
  ru: "Русский",
  pcm: "Pidgin",
}

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  zh: "🇨🇳",
  ar: "🇸🇦",
  fa: "🇮🇷",
  ru: "🇷🇺",
  pcm: "🇳🇬",
}

export const rtlLocales: Locale[] = ["ar", "fa"]

const translations: Record<Locale, typeof en> = { en, zh, ar, fa, ru, pcm }

export type TranslationKey = string

/** Get a nested value from an object using dot-notation key */
function getNestedValue(obj: any, key: string): string {
  return key.split(".").reduce((o, k) => o?.[k], obj) ?? key
}

export function getTranslation(locale: Locale, key: string): string {
  return getNestedValue(translations[locale], key) || getNestedValue(translations.en, key) || key
}

export function getTranslations(locale: Locale): typeof en {
  return translations[locale] || translations.en
}

export const defaultLocale: Locale = "en"
