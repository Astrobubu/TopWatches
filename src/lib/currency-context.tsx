"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  type CurrencyCode,
  currencies,
  currencyByLocale,
  convertPrice,
  formatPriceSimple,
  getCurrencySymbol,
} from "@/lib/currency"
import { useI18n } from "@/lib/i18n/context"

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  convertPrice: (priceAED: number) => number
  formatPrice: (priceAED: number) => string
  formatPriceWithWarning: (
    priceAED: number
  ) => { formatted: string; warning?: string; isApproximate: boolean }
  getSymbol: () => string
  isApproximate: () => boolean
  getWarning: () => string | undefined
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "AED",
  setCurrency: () => {},
  convertPrice: (priceAED: number) => priceAED,
  formatPrice: (priceAED: number) => String(priceAED),
  formatPriceWithWarning: (priceAED: number) => ({
    formatted: String(priceAED),
    isApproximate: false,
  }),
  getSymbol: () => "د.إ",
  isApproximate: () => false,
  getWarning: () => undefined,
})

const CURRENCY_STORAGE_KEY = "gw-currency"

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n()
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window === "undefined") return "AED"
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null
    if (saved && currencies[saved]) return saved
    return currencyByLocale[locale]
  })
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency)
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency)
  }, [])

  const convert = useCallback(
    (priceAED: number) => convertPrice(priceAED, currency),
    [currency]
  )

  const format = useCallback(
    (priceAED: number) => formatPriceSimple(priceAED, currency),
    [currency]
  )

  const formatWithWarning = useCallback(
    (priceAED: number) => {
      const config = currencies[currency]
      const converted = convertPrice(priceAED, currency)
      return {
        formatted: converted.toLocaleString(),
        warning: config.isApproximate ? config.warning : undefined,
        isApproximate: config.isApproximate,
      }
    },
    [currency]
  )

  const getSymbol = useCallback(
    () => getCurrencySymbol(currency),
    [currency]
  )

  const isApprox = useCallback(
    () => currencies[currency].isApproximate,
    [currency]
  )

  const getWarn = useCallback(
    () => currencies[currency].warning,
    [currency]
  )

  if (!isInitialized) {
    return null
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice: convert,
        formatPrice: format,
        formatPriceWithWarning: formatWithWarning,
        getSymbol,
        isApproximate: isApprox,
        getWarning: getWarn,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}