"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import type { Watch } from "@/lib/types"
import { WatchCard } from "@/components/watches/watch-card"
import { WatchCardSkeleton } from "@/components/watches/watch-card-skeleton"

export default function ForHimPage() {
    const { t } = useTranslation()
    const [forHimWatches, setForHimWatches] = useState<Watch[]>([])

    useEffect(() => {
        fetch("/api/watches")
            .then((r) => r.json())
            .then((watches: Watch[]) =>
                setForHimWatches(watches.filter((w) => parseInt(w.specs.caseSize) >= 39))
            )
    }, [])

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[calc(50vh+5rem)] min-h-[400px] flex items-center justify-center overflow-hidden -mt-20 pt-20">
                <img
                    src="https://i.pinimg.com/1200x/a2/ab/aa/a2abaad39785e84615742e5c50e68772.jpg"
                    alt="Gents Collection Hero"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-10">
                    <h3 className="font-mono text-primary text-xs tracking-[0.3em] mb-4 uppercase">{t("forHim.subtitle")}</h3>
                    <h1 className="font-serif italic text-5xl md:text-7xl text-foreground mb-6 leading-tight">{t("forHim.title")}</h1>
                    <p className="font-sans text-foreground/60 text-base md:text-lg max-w-xl mx-auto">
                        {t("forHim.description")}
                    </p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-16 py-20 lg:py-32">
                <div className="flex items-center justify-between mb-12">
                    <p className="font-mono text-sm text-foreground/40">{forHimWatches.length} {t("forHim.count")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {forHimWatches.length === 0
                        ? Array.from({ length: 8 }).map((_, i) => <WatchCardSkeleton key={i} />)
                        : forHimWatches.map((watch) => (
                            <WatchCard key={watch.id} watch={watch} />
                        ))
                    }
                </div>
            </section>
        </div>
    )
}
