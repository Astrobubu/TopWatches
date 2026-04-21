"use client"

import { useState, useRef, useEffect } from "react"
import { Globe, Coins } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { useCurrency } from "@/lib/currency-context"
import { locales, localeFlags, type Locale } from "@/lib/i18n"
import { currencies, type CurrencyCode, availableCurrencies } from "@/lib/currency"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const currentCurrency = currencies[currency]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors px-2 py-1.5 hover:bg-secondary"
        style={{ borderRadius: 'var(--pill-radius)' }}
        aria-label="Change language and currency"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline font-mono text-xs uppercase">{locale}</span>
        <span className="hidden sm:inline text-xs text-foreground/50">·</span>
        <span className="hidden sm:inline font-mono text-xs">{currency}</span>
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 right-0 bg-card border border-border overflow-hidden z-50 min-w-[200px]"
          style={{ boxShadow: "var(--soft-shadow)", borderRadius: 'var(--card-radius)' }}
        >
          <div className="p-3 border-b border-border">
            <p className="text-xs text-foreground/50 uppercase tracking-wider mb-2">Language</p>
            <div className="flex flex-wrap gap-1">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l as Locale)}
                  className={`px-2 py-1 text-xs uppercase font-mono transition-colors ${
                    l === locale
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                  }`}
                  style={{ borderRadius: 'var(--xs-radius)' }}
                >
                  {localeFlags[l]} {l}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3">
            <p className="text-xs text-foreground/50 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Coins className="w-3 h-3" /> Currency
            </p>
            <div className="flex flex-wrap gap-1">
              {availableCurrencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c as CurrencyCode)}
                  className={`px-2 py-1 text-xs font-mono transition-colors ${
                    c === currency
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                  }`}
                  style={{ borderRadius: 'var(--xs-radius)' }}
                >
                  {currencies[c].symbol} {c}
                </button>
              ))}
            </div>
            {currentCurrency.isApproximate && (
              <p className="mt-2 text-[10px] text-amber-600/80 flex items-center gap-1">
                ⚠️ {currentCurrency.warning}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}