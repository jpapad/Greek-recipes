export type UnitType = 'volume' | 'weight' | 'temperature';
export type VolumeUnit = 'ml' | 'l' | 'cup' | 'tbsp' | 'tsp' | 'fl-oz';
export type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';
export type TemperatureUnit = 'c' | 'f';

// Conversion factors (all relative to base unit)
const VOLUME_TO_ML: Record<VolumeUnit, number> = {
    'ml': 1,
    'l': 1000,
    'cup': 236.588,
    'tbsp': 14.787,
    'tsp': 4.929,
    'fl-oz': 29.574
};

const WEIGHT_TO_GRAMS: Record<WeightUnit, number> = {
    'g': 1,
    'kg': 1000,
    'oz': 28.3495,
    'lb': 453.592
};

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
    const mlValue = value * VOLUME_TO_ML[from];
    return mlValue / VOLUME_TO_ML[to];
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
    const gramValue = value * WEIGHT_TO_GRAMS[from];
    return gramValue / WEIGHT_TO_GRAMS[to];
}

export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
    if (from === to) return value;
    
    if (from === 'c' && to === 'f') {
        return (value * 9/5) + 32;
    } else {
        return (value - 32) * 5/9;
    }
}

export const UNIT_LABELS: Record<VolumeUnit | WeightUnit | TemperatureUnit, string> = {
    // Volume
    'ml': 'Χιλιοστόλιτρα (ml)',
    'l': 'Λίτρα (L)',
    'cup': 'Κούπες (cup)',
    'tbsp': 'Κουταλιές Σούπας (tbsp)',
    'tsp': 'Κουταλάκια Γλυκού (tsp)',
    'fl-oz': 'Ουγγιές Υγρού (fl oz)',
    
    // Weight
    'g': 'Γραμμάρια (g)',
    'kg': 'Κιλά (kg)',
    'oz': 'Ουγγιές (oz)',
    'lb': 'Λίβρες (lb)',
    
    // Temperature
    'c': 'Κελσίου (°C)',
    'f': 'Φαρενάιτ (°F)'
};
