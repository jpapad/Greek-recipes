"use client";

import { useState } from "react";
import { Calculator, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/input";

interface ServingsCalculatorProps {
    originalServings: number;
    ingredients: string[];
    onScaleChange?: (scale: number) => void;
}

export function ServingsCalculator({ 
    originalServings, 
    ingredients,
    onScaleChange 
}: ServingsCalculatorProps) {
    const [servings, setServings] = useState(originalServings);
    const scale = servings / originalServings;

    const handleServingsChange = (newServings: number) => {
        if (newServings < 1) return;
        setServings(newServings);
        if (onScaleChange) {
            onScaleChange(newServings / originalServings);
        }
    };

    const scaleIngredient = (ingredient: string): string => {
        // Match numbers (including fractions like 1/2, 1.5, etc.)
        const regex = /(\d+\.?\d*\/?\d*\.?\d*)/g;
        
        return ingredient.replace(regex, (match) => {
            try {
                // Handle fractions
                if (match.includes('/')) {
                    const [num, den] = match.split('/').map(Number);
                    const decimal = num / den;
                    const scaled = decimal * scale;
                    
                    // Convert back to fraction if clean
                    if (scaled === Math.floor(scaled)) {
                        return scaled.toString();
                    } else if (scaled % 0.5 === 0) {
                        const whole = Math.floor(scaled);
                        return whole > 0 ? `${whole} 1/2` : '1/2';
                    } else if (scaled % 0.25 === 0) {
                        const whole = Math.floor(scaled);
                        const remainder = scaled - whole;
                        if (remainder === 0.25) return whole > 0 ? `${whole} 1/4` : '1/4';
                        if (remainder === 0.75) return whole > 0 ? `${whole} 3/4` : '3/4';
                    }
                    return scaled.toFixed(2);
                }
                
                // Handle decimals
                const num = parseFloat(match);
                const scaled = num * scale;
                
                // Round to reasonable precision
                if (scaled < 10) {
                    return scaled.toFixed(2).replace(/\.?0+$/, '');
                } else {
                    return Math.round(scaled).toString();
                }
            } catch {
                return match;
            }
        });
    };

    const scaledIngredients = ingredients.map(scaleIngredient);

    return (
        <GlassPanel className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Adjust Servings</h3>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleServingsChange(servings - 1)}
                    disabled={servings <= 1}
                >
                    <Minus className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        min="1"
                        value={servings}
                        onChange={(e) => handleServingsChange(parseInt(e.target.value) || 1)}
                        className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">servings</span>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleServingsChange(servings + 1)}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {scale !== 1 && (
                <>
                    <div className="mb-3 p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm text-center">
                            Recipe scaled by <strong>{scale.toFixed(2)}x</strong> from original {originalServings} servings
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Scaled Ingredients:</h4>
                        <ul className="space-y-1.5 text-sm">
                            {scaledIngredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleServingsChange(originalServings)}
                        className="w-full mt-4"
                    >
                        Reset to Original
                    </Button>
                </>
            )}
        </GlassPanel>
    );
}
