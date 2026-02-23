"use client"

import { useState, useEffect } from "react"
import { watches } from "@/data/watches"
import { WatchCard } from "@/components/watches/watch-card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, ClipboardList, ArrowRight, Upload, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type FlowStep = "gender" | "upload" | "questions" | "processing" | "recommendation"
type Gender = "male" | "female" | null

interface ConciergeSystemProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    initialFlow: "upload" | "questions" | null
}

export function ConciergeSystem({ isOpen, setIsOpen, initialFlow }: ConciergeSystemProps) {
    const [step, setStep] = useState<FlowStep>("gender")
    const [gender, setGender] = useState<Gender>(null)
    const [progress, setProgress] = useState(0)
    const [recommendationId, setRecommendationId] = useState<string | null>(null)
    const [uploaded, setUploaded] = useState(false)

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
                        <h3 className="font-serif italic text-3xl text-center text-foreground mb-2">Who are we styling?</h3>
                        <p className="text-center text-foreground/50 text-sm mb-8">Select to help us refine your recommendations.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleGenderSelect("male")}
                                className="group p-8 rounded-2xl border border-border bg-card hover:border-primary hover:bg-secondary transition-all flex flex-col items-center gap-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-background transition-colors">
                                    <span className="font-serif italic text-2xl">M</span>
                                </div>
                                <span className="font-sans font-medium text-foreground">For Him</span>
                            </button>
                            <button
                                onClick={() => handleGenderSelect("female")}
                                className="group p-8 rounded-2xl border border-border bg-card hover:border-primary hover:bg-secondary transition-all flex flex-col items-center gap-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-background transition-colors">
                                    <span className="font-serif italic text-2xl">W</span>
                                </div>
                                <span className="font-sans font-medium text-foreground">For Her</span>
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
                            <h3 className="font-serif italic text-2xl text-foreground mb-2">Show Us Your Style</h3>
                            <p className="text-foreground/50 text-sm">Upload a photo of your outfit, a watch you like, or your general aesthetic.</p>
                        </div>

                        {!uploaded ? (
                            <div
                                className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                                onClick={() => {
                                    setUploaded(true)
                                    setTimeout(handleSimulateProcess, 800)
                                }}
                            >
                                <Upload className="w-8 h-8 text-foreground/30 mx-auto mb-4" />
                                <p className="font-sans text-foreground mb-1">Click to browse or drag image here</p>
                                <p className="font-mono text-xs text-foreground/40">JPG, PNG, HEIC up to 5MB</p>
                            </div>
                        ) : (
                            <div className="border-2 border-border rounded-2xl p-10 text-center bg-secondary flex flex-col items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500 mb-4 animate-in zoom-in" />
                                <p className="font-sans text-foreground">Image uploaded successfully.</p>
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
                            <h3 className="font-serif italic text-2xl text-foreground mb-2">Style Preferences</h3>
                            <p className="text-foreground/50 text-sm">Select the vibes that resonate with you.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {['Minimalist', 'Sporty', 'Classic', 'Avant-Garde', 'Vintage', 'Diamond-set'].map(opt => (
                                <button
                                    key={opt}
                                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 text-foreground/70 hover:text-foreground transition-colors text-sm font-sans text-left"
                                    onClick={(e) => {
                                        e.currentTarget.classList.toggle('border-primary')
                                        e.currentTarget.classList.toggle('bg-primary/10')
                                        e.currentTarget.classList.toggle('text-foreground')
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSimulateProcess}
                            className="w-full py-4 rounded-xl bg-foreground text-background font-sans font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            Find My Watch <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )
            case "processing":
                return (
                    <div className="py-16 text-center animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center min-h-[300px]">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                        <h3 className="font-serif italic text-2xl text-foreground mb-2">Analyzing Profile...</h3>
                        <p className="text-foreground/50 text-sm font-mono tracking-widest uppercase mb-8">Matching constraints</p>

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
                            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-2 block">Perfect Match</span>
                            <h3 className="font-serif italic text-3xl text-foreground">Your Curated Timepiece</h3>
                        </div>

                        <div className="bg-card rounded-2xl p-4 border border-border">
                            <WatchCard watch={watch} />
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3.5 rounded-xl border border-border text-foreground font-sans font-semibold hover:bg-secondary transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setStep("gender")
                                    setGender(null)
                                    setRecommendationId(null)
                                }}
                                className="flex-1 py-3.5 rounded-xl bg-foreground text-background font-sans font-semibold hover:bg-white transition-colors"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md bg-background border-border text-foreground p-6 rounded-3xl" showCloseButton={false}>
                {renderContent()}
            </DialogContent>
        </Dialog>
    )
}
