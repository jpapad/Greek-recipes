"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRecipeBySlug } from "@/lib/api";
import { Recipe } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, CheckCircle2, Timer, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceCommands } from "@/components/recipes/VoiceCommands";
import { useTranslations } from "@/hooks/useTranslations";

export default function CookModePage() {
    const { t } = useTranslations();
    const params = useParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
    
    // Timer states
    const [timerMinutes, setTimerMinutes] = useState(0);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showTimerInput, setShowTimerInput] = useState(false);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        async function fetchRecipe() {
            if (typeof params.slug === "string") {
                const data = await getRecipeBySlug(params.slug);
                setRecipe(data);
            }
        }
        fetchRecipe();
    }, [params.slug]);

    // Wake Lock Integration
    useEffect(() => {
        async function requestWakeLock() {
            try {
                if ("wakeLock" in navigator) {
                    const sentinel = await navigator.wakeLock.request("screen");
                    setWakeLock(sentinel);
                    console.log("Wake Lock active");
                }
            } catch (err) {
                console.error("Wake Lock failed:", err);
            }
        }

        requestWakeLock();

        return () => {
            if (wakeLock) {
                wakeLock.release();
                console.log("Wake Lock released");
            }
        };
    }, []);

    // Timer logic
    useEffect(() => {
        if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
            timerIntervalRef.current = setInterval(() => {
                if (timerSeconds > 0) {
                    setTimerSeconds(prev => prev - 1);
                } else if (timerMinutes > 0) {
                    setTimerMinutes(prev => prev - 1);
                    setTimerSeconds(59);
                } else {
                    // Timer finished
                    setIsTimerRunning(false);
                    if ('vibrate' in navigator) {
                        navigator.vibrate([200, 100, 200]);
                    }
                    alert(t('CookMode.timerFinished'));
                }
            }, 1000);
        } else if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [isTimerRunning, timerMinutes, timerSeconds]);

    const startTimer = (minutes: number) => {
        setTimerMinutes(minutes);
        setTimerSeconds(0);
        setIsTimerRunning(true);
        setShowTimerInput(false);
    };

    const pauseTimer = () => {
        setIsTimerRunning(false);
    };

    const resumeTimer = () => {
        if (timerMinutes > 0 || timerSeconds > 0) {
            setIsTimerRunning(true);
        }
    };

    const resetTimer = () => {
        setIsTimerRunning(false);
        setTimerMinutes(0);
        setTimerSeconds(0);
        setShowTimerInput(false);
    };

    if (!recipe) return <div className="p-8 text-center">{t('CookMode.loading')}</div>;

    const steps = Array.isArray(recipe.steps) ? recipe.steps : [JSON.stringify(recipe.steps)];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/50">
                <h2 className="text-xl font-bold truncate max-w-[70%]">{recipe.title}</h2>
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <X className="w-6 h-6" />
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-muted w-full">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                <GlassPanel className="max-w-4xl w-full p-8 md:p-16 text-center relative min-h-[400px] flex flex-col justify-center items-center">
                    <span className="absolute top-6 left-6 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        {t('CookMode.step')} {currentStep + 1} {t('CookMode.of')} {steps.length}
                    </span>

                    {/* Timer Display */}
                    {(timerMinutes > 0 || timerSeconds > 0) && (
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <div className="bg-primary/20 px-4 py-2 rounded-full">
                                <span className="text-lg font-bold tabular-nums">
                                    {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={isTimerRunning ? pauseTimer : resumeTimer}
                            >
                                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={resetTimer}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    <p className="text-2xl md:text-4xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500" key={currentStep}>
                        {steps[currentStep]}
                    </p>

                    {/* Timer Quick Actions */}
                    {!showTimerInput && !(timerMinutes > 0 || timerSeconds > 0) && (
                        <div className="mt-8 flex gap-3 flex-wrap justify-center">
                            {/* Voice Commands */}
                            <VoiceCommands
                                onNextStep={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
                                onPreviousStep={() => setCurrentStep(s => Math.max(0, s - 1))}
                                onStartTimer={(mins) => startTimer(mins)}
                                onPauseTimer={pauseTimer}
                            />
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startTimer(5)}
                                className="gap-2"
                            >
                                <Timer className="w-4 h-4" /> 5 min
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startTimer(10)}
                                className="gap-2"
                            >
                                <Timer className="w-4 h-4" /> 10 min
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startTimer(15)}
                                className="gap-2"
                            >
                                <Timer className="w-4 h-4" /> 15 min
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowTimerInput(true)}
                                className="gap-2"
                            >
                                <Timer className="w-4 h-4" /> {t('CookMode.custom')}
                            </Button>
                        </div>
                    )}

                    {/* Custom Timer Input */}
                    {showTimerInput && (
                        <div className="mt-8 flex items-center gap-3">
                            <input
                                type="number"
                                min="1"
                                max="180"
                                placeholder={t('CookMode.minutes')}
                                className="w-24 px-3 py-2 rounded-lg border border-border bg-background"
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    if (val > 0) startTimer(val);
                                }}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowTimerInput(false)}
                            >
                                {t('CookMode.cancel')}
                            </Button>
                        </div>
                    )}
                </GlassPanel>
            </div>

            {/* Controls */}
            <div className="p-6 md:p-8 border-t border-border/50 flex justify-between items-center max-w-4xl mx-auto w-full">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="text-lg px-8 py-6 rounded-full"
                >
                    <ArrowLeft className="mr-2 w-5 h-5" /> {t('CookMode.previous')}
                </Button>

                {currentStep < steps.length - 1 ? (
                    <Button
                        size="lg"
                        onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                        className="text-lg px-8 py-6 rounded-full"
                    >
                        {t('CookMode.next')} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        onClick={() => router.back()}
                        className="text-lg px-8 py-6 rounded-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        {t('CookMode.finish')} <CheckCircle2 className="ml-2 w-5 h-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
