import type { Locale } from "@/lib/i18n"

export interface CurrencyConfig {
  code: string
  symbol: string
  rate: number
  name: string
  isApproximate: boolean
  warning?: string
}

export const currencies: Record<string, CurrencyConfig> = {
  AED: {
    code: "AED",
    symbol: "AED",
    rate: 1,
    name: "UAE Dirham",
    isApproximate: false,
  },
  USD: {
    code: "USD",
    symbol: "$",
    rate: 0.27,
    name: "US Dollar",
    isApproximate: true,
    warning: "Approximate - final billing in AED",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    rate: 0.25,
    name: "Euro",
    isApproximate: true,
    warning: "Approximate - final billing in AED",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    rate: 0.21,
    name: "British Pound",
    isApproximate: true,
    warning: "Approximate - final billing in AED",
  },
  CNY: {
    code: "CNY",
    symbol: "¥",
    rate: 1.97,
    name: "Chinese Yuan",
    isApproximate: true,
    warning: "Approximate - final billing in AED",
  },
  RUB: {
    code: "RUB",
    symbol: "₽",
    rate: 23.5,
    name: "Russian Ruble",
    isApproximate: true,
    warning: "Approximate - final billing in AED",
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    rate: 420,
    name: "Nigerian Naira",
    isApproximate: true,
    warning: "Approximate - final billing in AED",
  },
}

export type CurrencyCode = keyof typeof currencies

export const currencyByLocale: Record<Locale, CurrencyCode> = {
  en: "USD",
  zh: "CNY",
  ar: "AED",
  fa: "AED",
  ru: "RUB",
  pcm: "NGN",
}

export const availableCurrencies: CurrencyCode[] = [
  "AED",
  "USD",
  "EUR",
  "GBP",
  "CNY",
  "RUB",
  "NGN",
]

// BCP 47 locale tags for number/date formatting
export const bcp47Map: Record<string, string> = {
  AED: "ar-AE",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  CNY: "zh-CN",
  RUB: "ru-RU",
  NGN: "en-NG",
}

export function convertPrice(priceAED: number, currencyCode: CurrencyCode): number {
  const config = currencies[currencyCode]
  return Math.round(priceAED * config.rate)
}

export function getCurrencyCode(locale: Locale): CurrencyCode {
  return currencyByLocale[locale]
}

export function formatPrice(
  priceAED: number,
  currencyCode: CurrencyCode,
  showWarning = false
): { formatted: string; warning?: string; isApproximate: boolean } {
  const config = currencies[currencyCode]
  const converted = convertPrice(priceAED, currencyCode)
  return {
    formatted: converted.toLocaleString(bcp47Map[currencyCode] || "en-US"),
    warning: showWarning && config.isApproximate ? config.warning : undefined,
    isApproximate: config.isApproximate,
  }
}

export function formatPriceSimple(priceAED: number, currencyCode: CurrencyCode): string {
  const config = currencies[currencyCode]
  const converted = convertPrice(priceAED, currencyCode)
  return converted.toLocaleString(bcp47Map[currencyCode] || "en-US")
}

export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  return currencies[currencyCode].symbol
}