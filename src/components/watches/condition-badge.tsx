"use client"

import Link from "next/link"
import { useState } from "react"

const conditionInfo: Record<string, { tagline: string; color: string }> = {
    new: {
        tagline: "Factory sealed, never sold. Full manufacturer warranty.",
        color: "#4ade80",
    },
    unworn: {
        tagline: "Complete set, never worn on the wrist. May have been briefly tried on.",
        color: "var(--primary)",
    },
    excellent: {
        tagline: "Minimal wear visible only under loupe. Crystal flawless, movement serviced.",
        color: "#60a5fa",
    },
    good: {
        tagline: "Honest signs of wear. Fully serviced movement. Polishing available.",
        color: "#a78bfa",
    },
}

export function ConditionBadge({ condition }: { condition: string }) {
    const [showTooltip, setShowTooltip] = useState(false)
    const info = conditionInfo[condition] || conditionInfo["good"]

    return (
        <div className="relative inline-block">
            <Link
                href="/condition-guide"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="inline-flex items-center gap-1.5 bg-border text-foreground/70 text-[10px] uppercase tracking-widest font-mono px-3 py-1 rounded-full hover:bg-border/80 transition-colors cursor-help"
            >
                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: info.color }}
                />
                {condition}
            </Link>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-secondary rounded-xl p-3 z-50 pointer-events-none" style={{ boxShadow: '0 8px 32px rgba(44, 40, 36, 0.15)' }}>
                    <p className="text-xs text-foreground/80 leading-relaxed">{info.tagline}</p>
                    <p className="text-[10px] text-primary mt-1.5 font-mono tracking-wider">Click for full guide →</p>
                </div>
            )}
        </div>
    )
}
