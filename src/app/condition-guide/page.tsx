import type { Metadata } from "next"
import { ConditionGuideClient } from "@/components/condition-guide/condition-guide-client"

export const metadata: Metadata = {
    title: "Watch Condition Guide | How We Grade Luxury Watches",
    description: "Understand our luxury watch condition grading system: New, Unworn, Excellent, and Good. Know exactly what you're buying at Golden Planet Watches Dubai.",
    openGraph: {
        title: "Watch Condition Guide | Golden Planet Watches",
        description: "Learn how we grade luxury watches: New, Unworn, Excellent, and Good condition ratings explained.",
    },
}

export default function ConditionGuidePage() {
    return <ConditionGuideClient />
}
