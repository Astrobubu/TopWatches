"use client"

import { useState, useEffect } from "react"

const SHOP_PHONE = "1234567890"

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
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" aria-hidden="true">
        <path d="M16.004 2.667A13.26 13.26 0 0 0 2.79 19.533L1.333 30.667l11.414-1.43A13.26 13.26 0 1 0 16.004 2.667Zm0 24.266a10.94 10.94 0 0 1-5.582-1.527l-.4-.237-4.145.52.554-4.04-.26-.414a10.95 10.95 0 1 1 9.833 5.698Zm6.01-8.2c-.33-.165-1.95-.962-2.252-1.072-.302-.11-.522-.165-.742.165-.22.33-.853 1.072-1.046 1.293-.193.22-.386.247-.716.082-.33-.165-1.393-.513-2.653-1.636-.981-.874-1.643-1.953-1.836-2.283-.193-.33-.02-.508.145-.672.15-.147.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.027-.578-.083-.165-.742-1.79-1.017-2.45-.268-.644-.54-.557-.742-.567l-.633-.01c-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.75 0 1.622 1.183 3.19 1.348 3.41.165.22 2.328 3.555 5.64 4.984.788.34 1.403.543 1.882.695.791.251 1.511.216 2.08.131.635-.095 1.95-.797 2.225-1.567.275-.77.275-1.43.193-1.567-.083-.138-.303-.22-.633-.385Z" />
      </svg>
    </a>
  )
}
