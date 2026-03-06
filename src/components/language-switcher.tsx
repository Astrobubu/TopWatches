"use client"

import { useState, useRef, useEffect } from "react"
import { Globe } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline font-mono text-xs uppercase">{locale}</span>
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 right-0 bg-card border border-border rounded-xl overflow-hidden z-50 min-w-[160px]"
          style={{ boxShadow: "var(--soft-shadow)" }}
        >
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l as Locale)
                setOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-secondary transition-colors ${
                l === locale ? "bg-secondary/50 text-foreground font-medium" : "text-foreground/70"
              }`}
            >
              <span className="text-base">{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
