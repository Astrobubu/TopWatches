"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Check, Palette } from "lucide-react"

const themes = [
    { name: "Organic Tech", value: "theme-organic-tech", desc: "Clinical Boutique", color: "#2E4036" },
    { name: "Midnight Luxe", value: "theme-midnight-luxe", desc: "Dark Editorial", color: "#C9A84C" },
    { name: "Brutalist Signal", value: "theme-brutalist-signal", desc: "Raw Precision", color: "#E63B2E" },
    { name: "Neon Cyberpunk", value: "theme-neon-cyberpunk", desc: "Digital Hacker", color: "#39FF14" },
    { name: "Minimalist Sand", value: "theme-minimalist-sand", desc: "Warm Editorial", color: "#8B5A2B" },
    { name: "Ocean Depth", value: "theme-ocean-depth", desc: "Deep Naval", color: "#38BDF8" },
    { name: "Rolex Heritage", value: "theme-rolex-heritage", desc: "Green & Gold", color: "#006039" },
]

export function ThemeSwitcher({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => { setMounted(true) }, [])

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!mounted) {
        return (
            <button className="p-2 rounded-full text-foreground/80">
                <Palette className="w-5 h-5" />
            </button>
        )
    }

    return (
        <div className={`relative ${className || ''}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
                style={{ borderRadius: 'var(--pill-radius)' }}
                aria-label="Switch Theme"
            >
                <Palette className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 py-2 bg-card/95 backdrop-blur-xl z-50" style={{ borderRadius: 'var(--card-radius)', boxShadow: '0 8px 32px rgba(44, 40, 36, 0.15)' }}>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 font-mono">
                        Design Presets
                    </div>
                    {themes.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => {
                                setTheme(t.value)
                                setIsOpen(false)
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 hover:text-primary flex items-center gap-3 transition-colors font-sans"
                        >
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                            <span className="flex-1">
                                <span className="block font-semibold text-sm">{t.name}</span>
                                <span className="block text-[10px] text-muted-foreground font-mono tracking-wide">{t.desc}</span>
                            </span>
                            {theme === t.value && <Check className="w-4 h-4 text-primary shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
