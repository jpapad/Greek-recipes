"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    convertVolume, 
    convertWeight, 
    convertTemperature,
    UNIT_LABELS,
    UnitType,
    VolumeUnit,
    WeightUnit,
    TemperatureUnit
} from "@/lib/unitConversions";
import { ArrowRight, ArrowLeftRight } from "lucide-react";

export function UnitConverter() {
    const [unitType, setUnitType] = useState<UnitType>('volume');
    const [value, setValue] = useState<string>('1');
    const [fromUnit, setFromUnit] = useState<string>('cup');
    const [toUnit, setToUnit] = useState<string>('ml');
    const [result, setResult] = useState<number | null>(null);

    const volumeUnits: VolumeUnit[] = ['ml', 'l', 'cup', 'tbsp', 'tsp', 'fl-oz'];
    const weightUnits: WeightUnit[] = ['g', 'kg', 'oz', 'lb'];
    const temperatureUnits: TemperatureUnit[] = ['c', 'f'];

    const getUnitsForType = (): string[] => {
        switch (unitType) {
            case 'volume': return volumeUnits;
            case 'weight': return weightUnits;
            case 'temperature': return temperatureUnits;
        }
    };

    const handleConvert = () => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            setResult(null);
            return;
        }

        let converted: number;
        switch (unitType) {
            case 'volume':
                converted = convertVolume(numValue, fromUnit as VolumeUnit, toUnit as VolumeUnit);
                break;
            case 'weight':
                converted = convertWeight(numValue, fromUnit as WeightUnit, toUnit as WeightUnit);
                break;
            case 'temperature':
                converted = convertTemperature(numValue, fromUnit as TemperatureUnit, toUnit as TemperatureUnit);
                break;
        }

        setResult(Math.round(converted * 100) / 100);
    };

    const swapUnits = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
        setResult(null);
    };

    return (
        <GlassPanel className="p-6 space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-2">Μετατροπέας Μονάδων</h3>
                <p className="text-sm text-muted-foreground">
                    Μετατρέψτε εύκολα μεταξύ διαφορετικών μονάδων μέτρησης
                </p>
            </div>

            {/* Unit Type Selection */}
            <div className="flex gap-2">
                <Button
                    variant={unitType === 'volume' ? 'default' : 'outline'}
                    onClick={() => {
                        setUnitType('volume');
                        setFromUnit('cup');
                        setToUnit('ml');
                        setResult(null);
                    }}
                    className="flex-1"
                >
                    Όγκος
                </Button>
                <Button
                    variant={unitType === 'weight' ? 'default' : 'outline'}
                    onClick={() => {
                        setUnitType('weight');
                        setFromUnit('lb');
                        setToUnit('g');
                        setResult(null);
                    }}
                    className="flex-1"
                >
                    Βάρος
                </Button>
                <Button
                    variant={unitType === 'temperature' ? 'default' : 'outline'}
                    onClick={() => {
                        setUnitType('temperature');
                        setFromUnit('c');
                        setToUnit('f');
                        setResult(null);
                    }}
                    className="flex-1"
                >
                    Θερμοκρασία
                </Button>
            </div>

            {/* Conversion Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                {/* From */}
                <div className="space-y-2">
                    <Label>Από</Label>
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setResult(null);
                        }}
                        placeholder="Εισάγετε τιμή"
                        className="mb-2"
                    />
                    <select
                        value={fromUnit}
                        onChange={(e) => {
                            setFromUnit(e.target.value);
                            setResult(null);
                        }}
                        className="w-full p-2 rounded-lg border border-border bg-background"
                    >
                        {getUnitsForType().map(unit => (
                            <option key={unit} value={unit}>
                                {UNIT_LABELS[unit as keyof typeof UNIT_LABELS]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center md:justify-start mb-8 md:mb-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={swapUnits}
                        className="rounded-full"
                    >
                        <ArrowLeftRight className="w-5 h-5" />
                    </Button>
                </div>

                {/* To */}
                <div className="space-y-2">
                    <Label>Σε</Label>
                    <div className="h-10 mb-2 flex items-center">
                        {result !== null && (
                            <span className="text-2xl font-bold text-primary">
                                {result}
                            </span>
                        )}
                    </div>
                    <select
                        value={toUnit}
                        onChange={(e) => {
                            setToUnit(e.target.value);
                            setResult(null);
                        }}
                        className="w-full p-2 rounded-lg border border-border bg-background"
                    >
                        {getUnitsForType().map(unit => (
                            <option key={unit} value={unit}>
                                {UNIT_LABELS[unit as keyof typeof UNIT_LABELS]}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Convert Button */}
            <Button onClick={handleConvert} className="w-full gap-2">
                <ArrowRight className="w-4 h-4" />
                Μετατροπή
            </Button>

            {/* Quick Reference */}
            <div className="pt-4 border-t border-border/50">
                <h4 className="font-semibold mb-2 text-sm">Γρήγορη Αναφορά:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {unitType === 'volume' && (
                        <>
                            <div>1 κούπα = 236.6 ml</div>
                            <div>1 tbsp = 14.8 ml</div>
                            <div>1 tsp = 4.9 ml</div>
                            <div>1 λίτρο = 1000 ml</div>
                        </>
                    )}
                    {unitType === 'weight' && (
                        <>
                            <div>1 λίβρα = 453.6 g</div>
                            <div>1 ουγγιά = 28.3 g</div>
                            <div>1 κιλό = 1000 g</div>
                            <div>100 g ≈ 3.5 oz</div>
                        </>
                    )}
                    {unitType === 'temperature' && (
                        <>
                            <div>0°C = 32°F</div>
                            <div>100°C = 212°F</div>
                            <div>180°C = 356°F</div>
                            <div>200°C = 392°F</div>
                        </>
                    )}
                </div>
            </div>
        </GlassPanel>
    );
}
