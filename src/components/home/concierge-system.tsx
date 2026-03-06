"use client"

import { useState, useEffect } from "react"
import { WatchCard } from "@/components/watches/watch-card"
import type { Watch } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, ClipboardList, ArrowRight, Upload, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/context"

type FlowStep = "gender" | "upload" | "questions" | "processing" | "recommendation"
type Gender = "male" | "female" | null

interface ConciergeSystemProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initialFlow: "upload" | "questions" | null
}

export function ConciergeSystem({ isOpen, setIsOpen, initialFlow }: ConciergeSystemProps) {
    const { t } = useTranslation()
    const [step, setStep] = useState<FlowStep>("gender")
    const [gender, setGender] = useState<Gender>(null)
    const [progress, setProgress] = useState(0)
    const [recommendationId, setRecommendationId] = useState<string | null>(null)
    const [uploaded, setUploaded] = useState(false)
    const [watches, setWatches] = useState<Watch[]>([])

    useEffect(() => {
        fetch("/api/watches")
            .then((res) => res.json())
            .then((data) => { if (Array.isArray(data)) setWatches(data) })
            .catch(() => {})
    }, [])

    // Reset state when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep("gender")
                setGender(null)
                setProgress(0)
                setRecommendationId(null)
                setUploaded(false)
            }, 300)
        }
    }, [isOpen])

    const handleGenderSelect = (g: Gender) => {
        setGender(g)
        setStep(initialFlow || "upload")
    }

    const handleSimulateProcess = () => {
        setStep("processing")
        let progressValue = 0
        const interval = setInterval(() => {
            progressValue += Math.floor(Math.random() * 15) + 5
            if (progressValue >= 100) {
                progressValue = 100
                clearInterval(interval)

                // Pick a watch based on gender
                const sizeLimit = gender === "male" ? 39 : 0
                const sizeMax = gender === "female" ? 38 : 100

                const eligibleWatches = watches.filter(w => {
                    const s = parseInt(w.specs.caseSize)
                    return s >= sizeLimit && s <= sizeMax
                })

                if (eligibleWatches.length > 0) {
                    const randomIdx = Math.floor(Math.random() * eligibleWatches.length)
                    setRecommendationId(eligibleWatches[randomIdx].id)
                } else {
                    setRecommendationId(watches[0].id)
                }

                setTimeout(() => setStep("recommendation"), 500)
            }
            setProgress(progressValue)
        }, 400)
    }

    const renderContent = () => {
        switch (step) {
            case "gender":
                return (
                    <div className="py-6 animate-in fade-in zoom-in-95 duration-300">
                        <h3 className="font-serif italic text-3xl text-center text-foreground mb-2">{t("concierge.whoStyling")}</h3>
                        <p className="text-center text-foreground/50 text-sm mb-8">{t("concierge.selectToRefine")}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleGenderSelect("male")}
                                className="group p-8 rounded-2xl bg-card hover:bg-secondary transition-all flex flex-col items-center gap-4"
                                style={{ boxShadow: 'var(--soft-shadow)' }}
                            >
                                <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-background transition-colors">
                                    <span className="font-serif italic text-2xl">M</span>
                                </div>
                                <span className="font-sans font-medium text-foreground">{t("home.forHim")}</span>
                            </button>
                            <button
                                onClick={() => handleGenderSelect("female")}
                                className="group p-8 rounded-2xl bg-card hover:bg-secondary transition-all flex flex-col items-center gap-4"
                                style={{ boxShadow: 'var(--soft-shadow)' }}
                            >
                                <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-background transition-colors">
                                    <span className="font-serif italic text-2xl">W</span>
                                </div>
                                <span className="font-sans font-medium text-foreground">{t("home.forHer")}</span>
                            </button>
                        </div>
                    </div>
                )
            case "upload":
                return (
                    <div className="py-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center mx-auto mb-4">
                                <Camera className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif italic text-2xl text-foreground mb-2">{t("concierge.showUsStyle")}</h3>
                            <p className="text-foreground/50 text-sm">{t("concierge.uploadPhotoDesc")}</p>
                        </div>

                        {!uploaded ? (
                            <div
                                className="border-2 border-dashed border-foreground/10 rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                                onClick={() => {
                                    setUploaded(true)
                                    setTimeout(handleSimulateProcess, 800)
                                }}
                            >
                                <Upload className="w-8 h-8 text-foreground/30 mx-auto mb-4" />
                                <p className="font-sans text-foreground mb-1">{t("concierge.clickToBrowse")}</p>
                                <p className="font-mono text-xs text-foreground/40">{t("concierge.fileTypes")}</p>
                            </div>
                        ) : (
                            <div className="border-2 border-foreground/10 rounded-2xl p-10 text-center bg-secondary flex flex-col items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500 mb-4 animate-in zoom-in" />
                                <p className="font-sans text-foreground">{t("concierge.uploadSuccess")}</p>
                            </div>
                        )}
                    </div>
                )
            case "questions":
                return (
                    <div className="py-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center mx-auto mb-4">
                                <ClipboardList className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif italic text-2xl text-foreground mb-2">{t("concierge.stylePreferences")}</h3>
                            <p className="text-foreground/50 text-sm">{t("concierge.selectVibes")}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {(['minimalist', 'sporty', 'classic', 'avantGarde', 'vintage', 'diamondSet'] as const).map(key => (
                                <button
                                    key={key}
                                    className="p-4 rounded-xl bg-card hover:bg-secondary text-foreground/70 hover:text-foreground transition-colors text-sm font-sans text-left"
                                    style={{ boxShadow: 'var(--soft-shadow)' }}
                                    onClick={(e) => {
                                        e.currentTarget.classList.toggle('border-primary')
                                        e.currentTarget.classList.toggle('bg-primary/10')
                                        e.currentTarget.classList.toggle('text-foreground')
                                    }}
                                >
                                    {t(`concierge.${key}`)}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSimulateProcess}
                            className="w-full py-4 rounded-xl bg-foreground text-background font-sans font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            {t("concierge.findMyWatch")} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )
            case "processing":
                return (
                    <div className="py-16 text-center animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center min-h-[300px]">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                        <h3 className="font-serif italic text-2xl text-foreground mb-2">{t("concierge.analyzing")}</h3>
                        <p className="text-foreground/50 text-sm font-mono tracking-widest uppercase mb-8">{t("concierge.matching")}</p>

                        <div className="w-full max-w-xs h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )
            case "recommendation":
                const watch = watches.find(w => w.id === recommendationId)
                if (!watch) return null

                return (
                    <div className="py-4 animate-in fade-in zoom-in-95 duration-500">
                        <div className="text-center mb-6">
                            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-2 block">{t("concierge.perfectMatch")}</span>
                            <h3 className="font-serif italic text-3xl text-foreground">{t("concierge.curatedTimepiece")}</h3>
                        </div>

                        <div className="bg-card rounded-2xl p-4" style={{ boxShadow: 'var(--soft-shadow)' }}>
                            <WatchCard watch={watch} />
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3.5 rounded-xl text-foreground font-sans font-semibold hover:bg-secondary transition-colors"
                                style={{ boxShadow: 'var(--soft-shadow)' }}
                            >
                                {t("concierge.close")}
                            </button>
                            <button
                                onClick={() => {
                                    setStep("gender")
                                    setGender(null)
                                    setRecommendationId(null)
                                }}
                                className="flex-1 py-3.5 rounded-xl bg-foreground text-background font-sans font-semibold hover:bg-white transition-colors"
                            >
                                {t("concierge.startOver")}
                            </button>
                        </div>
                    </div>
                )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md bg-background text-foreground p-6 rounded-3xl" style={{ boxShadow: '0 8px 40px rgba(44, 40, 36, 0.2)', border: 'none' }} showCloseButton={false}>
                {renderContent()}
            </DialogContent>
        </Dialog>
    )
}
