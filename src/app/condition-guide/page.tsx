import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
    title: "Condition Guide | TopWatches",
    description: "Understand our watch condition grading system: New, Unworn, Excellent, and Good.",
}

const conditions = [
    {
        grade: "New",
        tagline: "Factory sealed, never sold",
        color: "#4ade80",
        description: "Brand new from an authorized dealer or directly from the manufacturer. The watch comes in its original, unopened packaging with all factory stickers, tags, and protective film intact. Full manufacturer warranty applies.",
        details: [
            "Original factory seals and stickers intact",
            "Never worn or sized",
            "Complete box, papers, and accessories",
            "Full manufacturer warranty",
            "No handling marks whatsoever",
        ],
    },
    {
        grade: "Unworn",
        tagline: "Complete set, never worn on the wrist",
        color: "var(--primary)",
        description: "The watch has been purchased but never worn on the wrist. It may have been tried on briefly or displayed. Comes with complete original packaging. May show extremely minor handling marks from inspection that are invisible to the naked eye.",
        details: [
            "Never worn on the wrist",
            "May have been briefly tried on or displayed",
            "Complete box and papers included",
            "No visible wear marks",
            "Bracelet has not been sized",
        ],
    },
    {
        grade: "Excellent",
        tagline: "Minimal wear, meticulously maintained",
        color: "#60a5fa",
        description: "A previously owned watch in outstanding condition. Shows very minimal signs of wear that are only visible under a jeweler's loupe. The movement has been serviced and certified. Crystal is flawless. Bracelet may have been sized. Includes our 1-year warranty.",
        details: [
            "Very light signs of wear (loupe-only)",
            "Crystal is scratch-free",
            "Movement serviced and verified",
            "Bracelet may have been sized",
            "Original box and papers when available",
            "1-year warranty included",
        ],
    },
    {
        grade: "Good",
        tagline: "Honest wear, fully functional",
        color: "#a78bfa",
        description: "A well-maintained pre-owned watch with visible but honest signs of regular wear. Light surface scratches on the case or bracelet that could be polished out. Fully functional movement that has been recently serviced by our certified watchmakers. Includes our 1-year warranty.",
        details: [
            "Visible light scratches on case or bracelet",
            "Crystal may have minor marks",
            "Movement fully serviced and tested",
            "Polishing available upon request",
            "Box and papers may not be included",
            "1-year warranty included",
        ],
    },
]

export default function ConditionGuidePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            {/* Back link */}
            <Link href="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors text-sm font-sans mb-10">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            {/* Header */}
            <div className="mb-12 md:mb-16">
                <h3 className="font-mono text-primary text-xs tracking-[0.2em] mb-3 uppercase">Transparency</h3>
                <h1 className="font-serif italic text-3xl md:text-5xl text-foreground mb-4">Condition Guide</h1>
                <p className="font-sans text-foreground/50 max-w-2xl leading-relaxed">
                    Every watch in our vault is graded by certified horologists using a standardized system. Here's exactly what each condition grade means — no ambiguity, no fine print.
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
                <p className="text-foreground/40 text-sm mb-4">Have questions about a specific watch's condition?</p>
                <Link
                    href="/collections"
                    className="inline-flex items-center gap-2 bg-primary text-background rounded-full px-7 py-3 font-sans font-bold text-sm hover:bg-foreground transition-colors"
                >
                    Browse the Collection
                </Link>
            </div>
        </div>
    )
}
