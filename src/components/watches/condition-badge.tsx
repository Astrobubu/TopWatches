"use client"

import Link from "next/link"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n/context"

const conditionInfo: Record<string, { tagline: string; color: string }> = {
    unworn: {
        tagline: "Brand new, never worn on the wrist. Complete set with full warranty.",
        color: "#4ade80",
    },
    preowned: {
        tagline: "Previously owned. Fully inspected, serviced, and authenticated. Includes 1-year warranty.",
        color: "var(--primary)",
    },
    "unwanted-gift": {
        tagline: "Received as a gift, never used. Complete set in original packaging.",
        color: "#60a5fa",
    },
}

export function ConditionBadge({ condition }: { condition: string }) {
    const [showTooltip, setShowTooltip] = useState(false)
    const { t } = useTranslation()
    const info = conditionInfo[condition] || conditionInfo["preowned"]

    return (
        <div className="relative inline-block">
            <Link
                href="/condition-guide"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="inline-flex items-center gap-1.5 bg-border text-foreground/80 text-xs uppercase tracking-widest font-sans px-3 py-1 hover:bg-border/80 transition-colors cursor-help"
                style={{ borderRadius: 'var(--pill-radius)' }}
            >
                <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: info.color }}
                />
                {t(`conditions.${condition}`)}
            </Link>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-secondary rounded-xl p-3 z-50 pointer-events-none" style={{ boxShadow: '0 8px 32px rgba(44, 40, 36, 0.15)' }}>
                    <p className="text-xs text-foreground/80 leading-relaxed">{info.tagline}</p>
                    <p className="text-xs text-primary mt-1.5 font-sans tracking-wider">Click for full guide →</p>
                </div>
            )}
        </div>
    )
}
