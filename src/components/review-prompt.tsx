"use client"

import { useEffect, useState } from "react"
import { Star, X } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/golden+planet+watches+%26+jewellery/@25.270517,55.2963121,788m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3e5f4323f101b867:0x24e1f97091e971b6!8m2!3d25.270517!4d55.298887!16s%2Fg%2F11pxk_xhjz?entry=tts&g_ep=EgoyMDI2MDMxMS4wIPu8ASoASAFQAw%3D%3D&skid=493d17c4-553c-41d6-be1a-55c50691f2dc"

const VISIT_KEY = "gw_visit_count"
const DISMISSED_KEY = "gw_review_dismissed"

export function ReviewPrompt() {
  const [show, setShow] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Don't show if already dismissed
    if (localStorage.getItem(DISMISSED_KEY)) return

    const count = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) + 1
    localStorage.setItem(VISIT_KEY, String(count))

    // Show on 3rd visit
    if (count >= 3) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  function dismiss() {
    setShow(false)
    localStorage.setItem(DISMISSED_KEY, "1")
  }

  function handleReview() {
    window.open(GOOGLE_MAPS_URL, "_blank", "noopener,noreferrer")
    dismiss()
  }

  if (!show) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={dismiss}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto relative w-full max-w-sm bg-card text-foreground p-8 animate-in zoom-in-95 fade-in duration-300"
          style={{
            borderRadius: "var(--card-radius)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          }}
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
            style={{ borderRadius: "var(--pill-radius)" }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Stars decoration */}
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Google icon */}
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>

          <h3 className="font-sans font-bold text-lg text-center mb-2">
            {t("reviews.popupTitle")}
          </h3>
          <p className="font-sans text-sm text-foreground/60 text-center leading-relaxed mb-6">
            {t("reviews.popupDesc")}
          </p>

          <button
            onClick={handleReview}
            className="w-full py-3 bg-foreground text-background font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ borderRadius: "var(--pill-radius)" }}
          >
            {t("reviews.popupCta")}
          </button>

          <button
            onClick={dismiss}
            className="w-full py-2.5 mt-2 text-foreground/50 font-sans text-sm hover:text-foreground transition-colors"
          >
            {t("reviews.popupDismiss")}
          </button>
        </div>
      </div>
    </>
  )
}
