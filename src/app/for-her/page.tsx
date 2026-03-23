"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import type { Watch } from "@/lib/types"
import { WatchCard } from "@/components/watches/watch-card"
import { watches as staticWatches } from "@/data/watches"

export default function ForHerPage() {
    const { t } = useTranslation()
    const [forHerWatches, setForHerWatches] = useState<Watch[]>(() =>
        staticWatches.filter((w) => parseInt(w.specs.caseSize) < 39)
    )

    useEffect(() => {
        fetch("/api/watches")
            .then((r) => r.json())
            .then((watches: Watch[]) =>
                setForHerWatches(watches.filter((w) => parseInt(w.specs.caseSize) < 39))
            )
    }, [])

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[calc(50vh+5rem)] min-h-[400px] flex items-center justify-center overflow-hidden -mt-20 pt-20">
                <img
                    src="https://hijabi.pk/cdn/shop/files/gemini-image-2_photography_of_the_uploaded_image_is_a_reference_of_hijab_hijab_matching_bracele-0_fbb79dd1-962d-4944-a2c7-d74fecf663d3.jpg?v=1765878218"
                    alt="Ladies Collection Hero"
                    className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/80" />
                <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-10">
                    <h3 className="font-mono text-primary text-xs tracking-[0.3em] mb-4 uppercase">{t("forHer.subtitle")}</h3>
                    <h1 className="font-serif italic text-5xl md:text-7xl text-foreground mb-6 leading-tight">{t("forHer.title")}</h1>
                    <p className="font-sans text-foreground/60 text-base md:text-lg max-w-xl mx-auto">
                        {t("forHer.description")}
                    </p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-16 py-20 lg:py-32">
                <div className="flex items-center justify-between mb-12">
                    <p className="font-mono text-sm text-foreground/40">{forHerWatches.length} {t("forHer.count")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {forHerWatches.map((watch) => (
                        <WatchCard key={watch.id} watch={watch} />
                    ))}
                </div>
            </section>
        </div>
    )
}
