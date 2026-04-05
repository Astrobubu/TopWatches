import type { Locale } from "@/lib/i18n"

interface CurrencyConfig {
  code: string
  symbol: string
  rate: number // 1 AED = X of this currency
}

// Approximate exchange rates (AED base)
// Last updated: 2026-04-05 — Review quarterly or when major currency moves occur
export const currencyByLocale: Record<Locale, CurrencyConfig> = {
  en: { code: "USD", symbol: "$", rate: 0.27 },
  zh: { code: "CNY", symbol: "¥", rate: 1.97 },
  ar: { code: "AED", symbol: "د.إ", rate: 1 },
  fa: { code: "AED", symbol: "د.إ", rate: 1 },
  ru: { code: "RUB", symbol: "₽", rate: 23.5 },
  pcm: { code: "NGN", symbol: "₦", rate: 420 },
}

// BCP 47 locale tags for number/date formatting
export const bcp47Map: Record<Locale, string> = {
  en: "en-US", zh: "zh-CN", ar: "ar-AE", fa: "fa-IR", ru: "ru-RU", pcm: "en-NG",
}

export function convertPrice(priceAED: number, locale: Locale): number {
  const config = currencyByLocale[locale] || currencyByLocale.en
  return Math.round(priceAED * config.rate)
}

export function getCurrencyCode(locale: Locale): string {
  return (currencyByLocale[locale] || currencyByLocale.en).code
}

export function formatPrice(priceAED: number, locale: Locale): string {
  const converted = convertPrice(priceAED, locale)
  return converted.toLocaleString(bcp47Map[locale] || "en-US")
}
