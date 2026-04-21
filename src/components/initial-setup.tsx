"use client"

import { useState, useEffect, useMemo } from "react"
import { Globe, Coins, ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { useCurrency } from "@/lib/currency-context"
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n"
import { currencies, type CurrencyCode, availableCurrencies } from "@/lib/currency"

const SETUP_KEY = "gw-setup-complete"

export function InitialSetup() {
  const { setLocale } = useI18n()
  const { setCurrency } = useCurrency()
  const [showSetup, setShowSetup] = useState(false)
  const [step, setStep] = useState<"language" | "currency">("language")
  const [selectedLang, setSelectedLang] = useState<Locale>("en")
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("AED")

  const isComplete = useMemo(
    () => typeof window !== "undefined" && localStorage.getItem(SETUP_KEY),
    []
  )

  useEffect(() => {
    if (!isComplete) {
      setShowSetup(true)
    }
  }, [isComplete])

  const handleContinue = () => {
    if (step === "language") {
      setLocale(selectedLang)
      setStep("currency")
    } else {
      setCurrency(selectedCurrency)
      localStorage.setItem(SETUP_KEY, "true")
      setShowSetup(false)
    }
  }

  const handleSkip = () => {
    setCurrency("AED")
    localStorage.setItem(SETUP_KEY, "true")
    setShowSetup(false)
  }

  if (!showSetup) return null

  const currentCurrency = currencies[selectedCurrency]

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            {step === "language" ? (
              <Globe className="w-8 h-8 text-primary" />
            ) : (
              <Coins className="w-8 h-8 text-primary" />
            )}
          </div>
          <h2 className="text-2xl font-serif font-semibold">
            {step === "language" ? "Choose Language" : "Choose Currency"}
          </h2>
          <p className="text-foreground/60 mt-2 text-sm">
            {step === "language"
              ? "Select your preferred language"
              : "Prices shown in your preferred currency"}
          </p>
        </div>

        {step === "language" ? (
          <div className="grid grid-cols-3 gap-2 mb-8">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLang(l as Locale)}
                className={`p-3 text-center transition-all ${
                  selectedLang === l
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
                style={{ borderRadius: "var(--card-radius)" }}
              >
                <span className="text-2xl block mb-1">{localeFlags[l]}</span>
                <span className="text-sm font-medium">{localeNames[l]}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {availableCurrencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCurrency(c as CurrencyCode)}
                  className={`p-3 text-center transition-all ${
                    selectedCurrency === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                  style={{ borderRadius: "var(--card-radius)" }}
                >
                  <span className="text-xl font-mono block mb-1">{currencies[c].symbol}</span>
                  <span className="text-sm font-medium">{currencies[c].code}</span>
                </button>
              ))}
            </div>
            {currentCurrency.isApproximate && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>
                    {currentCurrency.warning} Final billing is always in AED.
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 px-4 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            Use Defaults
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            style={{ borderRadius: "var(--button-radius)" }}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}