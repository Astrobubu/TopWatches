"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

export function ConditionGuideClient() {
    const { t } = useTranslation()

    const conditions = [
        {
            grade: t("conditionGuide.gradeNew"),
            tagline: t("conditionGuide.taglineNew"),
            color: "#4ade80",
            description: t("conditionGuide.descNew"),
            details: [
                t("conditionGuide.newDetail1"),
                t("conditionGuide.newDetail2"),
                t("conditionGuide.newDetail3"),
                t("conditionGuide.newDetail4"),
                t("conditionGuide.newDetail5"),
            ],
        },
        {
            grade: t("conditionGuide.gradeUnworn"),
            tagline: t("conditionGuide.taglineUnworn"),
            color: "var(--primary)",
            description: t("conditionGuide.descUnworn"),
            details: [
                t("conditionGuide.unwornDetail1"),
                t("conditionGuide.unwornDetail2"),
                t("conditionGuide.unwornDetail3"),
                t("conditionGuide.unwornDetail4"),
                t("conditionGuide.unwornDetail5"),
            ],
        },
        {
            grade: t("conditionGuide.gradeExcellent"),
            tagline: t("conditionGuide.taglineExcellent"),
            color: "#60a5fa",
            description: t("conditionGuide.descExcellent"),
            details: [
                t("conditionGuide.excellentDetail1"),
                t("conditionGuide.excellentDetail2"),
                t("conditionGuide.excellentDetail3"),
                t("conditionGuide.excellentDetail4"),
                t("conditionGuide.excellentDetail5"),
                t("conditionGuide.excellentDetail6"),
            ],
        },
        {
            grade: t("conditionGuide.gradeGood"),
            tagline: t("conditionGuide.taglineGood"),
            color: "#a78bfa",
            description: t("conditionGuide.descGood"),
            details: [
                t("conditionGuide.goodDetail1"),
                t("conditionGuide.goodDetail2"),
                t("conditionGuide.goodDetail3"),
                t("conditionGuide.goodDetail4"),
                t("conditionGuide.goodDetail5"),
                t("conditionGuide.goodDetail6"),
            ],
        },
    ]

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            {/* Back link */}
            <Link href="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors text-sm font-sans mb-10">
                <ArrowLeft className="w-4 h-4" />
                {t("conditionGuide.backToHome")}
            </Link>

            {/* Header */}
            <div className="mb-12 md:mb-16">
                <h3 className="font-mono text-primary text-xs tracking-[0.2em] mb-3 uppercase">{t("conditionGuide.transparency")}</h3>
                <h1 className="font-serif italic text-3xl md:text-5xl text-foreground mb-4">{t("conditionGuide.title")}</h1>
                <p className="font-sans text-foreground/50 max-w-2xl leading-relaxed">
                    {t("conditionGuide.intro")}
                </p>
            </div>

            {/* Condition Cards */}
            <div className="space-y-6">
                {conditions.map((c) => (
                    <div
                        key={c.grade}
                        className="bg-card rounded-2xl p-6 md:p-10 transition-all"
                        style={{ boxShadow: 'var(--soft-shadow)' }}
                    >
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span
                                        className="inline-block w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: c.color }}
                                    />
                                    <h2 className="font-sans font-bold text-xl md:text-2xl text-foreground">{c.grade}</h2>
                                </div>
                                <p className="font-serif italic text-sm text-primary mb-4">{c.tagline}</p>
                                <p className="text-foreground/50 text-sm leading-relaxed mb-6">
                                    {c.description}
                                </p>
                                <ul className="space-y-2">
                                    {c.details.map((d) => (
                                        <li key={d} className="flex items-start gap-2 text-sm text-foreground/70">
                                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
                <p className="text-foreground/40 text-sm mb-4">{t("conditionGuide.questionsAbout")}</p>
                <Link
                    href="/collections"
                    className="inline-flex items-center gap-2 bg-primary text-background rounded-full px-7 py-3 font-sans font-bold text-sm hover:bg-foreground transition-colors"
                >
                    {t("conditionGuide.browseCollection")}
                </Link>
            </div>
        </div>
    )
}
