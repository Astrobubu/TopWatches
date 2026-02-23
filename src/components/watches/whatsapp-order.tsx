"use client"

import { MessageCircle, Heart, Share2 } from "lucide-react"
import type { Watch } from "@/lib/types"

interface WhatsAppOrderProps {
  watch: Watch
}

const SHOP_PHONE = "1234567890"

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TW-${timestamp}-${random}`
}

export function WhatsAppOrder({ watch }: WhatsAppOrderProps) {
  function handleOrder() {
    const orderNumber = generateOrderNumber()
    const message = [
      `Order #${orderNumber}`,
      ``,
      `Watch: ${watch.brand} ${watch.model}`,
      `Ref: ${watch.reference}`,
      `Condition: ${watch.condition}`,
      ``,
      `I'm interested in this watch. Please confirm availability and pricing.`,
    ].join("\n")

    const url = `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleOrder}
        className="magnetic-btn flex-1 bg-primary hover:bg-foreground text-primary-foreground hover:text-background py-4 font-sans font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        style={{ borderRadius: 'var(--card-radius)' }}
      >
        <MessageCircle className="w-4 h-4" />
        Order via WhatsApp
      </button>
      <button className="w-12 h-12 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary/40 transition-colors" style={{ borderRadius: 'var(--card-radius)', border: 'var(--border-w) solid var(--border)' }}>
        <Heart className="w-4 h-4" />
      </button>
      <button className="w-12 h-12 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary/40 transition-colors" style={{ borderRadius: 'var(--card-radius)', border: 'var(--border-w) solid var(--border)' }}>
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  )
}
