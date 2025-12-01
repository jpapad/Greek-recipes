"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRecipeBySlug } from "@/lib/api";
import { Recipe } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CookModePage() {
    const params = useParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

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

    if (!recipe) return <div className="p-8 text-center">Loading...</div>;

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
                        Step {currentStep + 1} of {steps.length}
                    </span>

                    <p className="text-2xl md:text-4xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 key={currentStep}">
                        {steps[currentStep]}
                    </p>
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
                    <ArrowLeft className="mr-2 w-5 h-5" /> Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                    <Button
                        size="lg"
                        onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                        className="text-lg px-8 py-6 rounded-full"
                    >
                        Next <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        onClick={() => router.back()}
                        className="text-lg px-8 py-6 rounded-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        Finish <CheckCircle2 className="ml-2 w-5 h-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
