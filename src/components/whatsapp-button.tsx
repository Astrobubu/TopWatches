"use client"

import { useState, useEffect } from "react"

const SHOP_PHONE = "971507452323"

export function WhatsAppButton() {
  const [pulsed, setPulsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setPulsed(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <a
      href={`https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent("Hi, I'm interested in your luxury watches")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 md:w-[56px] md:h-[56px]"
      style={{ backgroundColor: "#25D366" }}
    >
      {!pulsed && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: "#25D366", opacity: 0.4 }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg"
        alt=""
        className="w-7 h-7 invert"
        aria-hidden="true"
      />
    </a>
  )
}
