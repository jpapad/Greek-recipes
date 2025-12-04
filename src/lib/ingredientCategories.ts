// Ingredient category mapping
export type IngredientCategory = 'produce' | 'dairy' | 'meat' | 'seafood' | 'pantry' | 'spices' | 'other';

interface CategoryConfig {
    label: string;
    color: string;
    icon: string;
}

export const CATEGORIES: Record<IngredientCategory, CategoryConfig> = {
    produce: {
        label: 'Φρούτα & Λαχανικά',
        color: 'text-green-600',
        icon: '🥬'
    },
    dairy: {
        label: 'Γαλακτοκομικά',
        color: 'text-blue-600',
        icon: '🥛'
    },
    meat: {
        label: 'Κρέας & Πουλερικά',
        color: 'text-red-600',
        icon: '🥩'
    },
    seafood: {
        label: 'Ψάρι & Θαλασσινά',
        color: 'text-cyan-600',
        icon: '🐟'
    },
    pantry: {
        label: 'Ντουλάπι',
        color: 'text-amber-600',
        icon: '🏺'
    },
    spices: {
        label: 'Μπαχαρικά',
        color: 'text-orange-600',
        icon: '🌿'
    },
    other: {
        label: 'Άλλα',
        color: 'text-gray-600',
        icon: '📦'
    }
};

// Categorize ingredient based on keywords
export function categorizeIngredient(name: string): IngredientCategory {
    const lowerName = name.toLowerCase();

    // Produce
    const produceKeywords = [
        'ντομάτα', 'κρεμμύδι', 'σκόρδο', 'πατάτα', 'καρότο', 'αγγούρι', 'μαρούλι',
        'λάχανο', 'μελιτζάνα', 'κολοκύθι', 'πιπεριά', 'φασολάκι', 'ρόκα', 'σπανάκι',
        'μαϊντανό', 'άνηθο', 'δυόσμο', 'λεμόνι', 'πορτοκάλι', 'μήλο', 'μπανάνα',
        'tomato', 'onion', 'garlic', 'potato', 'carrot', 'cucumber', 'lettuce',
        'cabbage', 'eggplant', 'zucchini', 'pepper', 'bean', 'arugula', 'spinach',
        'parsley', 'dill', 'mint', 'lemon', 'orange', 'apple', 'banana'
    ];

    // Dairy
    const dairyKeywords = [
        'γάλα', 'τυρί', 'φέτα', 'γιαούρτι', 'κρέμα', 'βούτυρο', 'μοτσαρέλα', 'παρμεζάνα',
        'milk', 'cheese', 'feta', 'yogurt', 'cream', 'butter', 'mozzarella', 'parmesan'
    ];

    // Meat
    const meatKeywords = [
        'κρέας', 'μοσχάρι', 'χοιρινό', 'αρνί', 'κοτόπουλο', 'κιμά', 'μπέικον', 'λουκάνικο',
        'meat', 'beef', 'pork', 'lamb', 'chicken', 'mince', 'bacon', 'sausage'
    ];

    // Seafood
    const seafoodKeywords = [
        'ψάρι', 'γαρίδες', 'καλαμάρι', 'χταπόδι', 'μύδια', 'όστρακα', 'σολομό', 'τόνο',
        'fish', 'shrimp', 'squid', 'octopus', 'mussels', 'shellfish', 'salmon', 'tuna'
    ];

    // Pantry
    const pantryKeywords = [
        'αλεύρι', 'ζάχαρη', 'ρύζι', 'ζυμαρικά', 'λάδι', 'ξύδι', 'σάλτσα', 'ντομάτα κονσέρβα',
        'φακές', 'ρεβύθια', 'φασόλια', 'ελιές',
        'flour', 'sugar', 'rice', 'pasta', 'oil', 'vinegar', 'sauce', 'canned tomato',
        'lentils', 'chickpeas', 'beans', 'olives'
    ];

    // Spices
    const spicesKeywords = [
        'αλάτι', 'πιπέρι', 'ρίγανη', 'θυμάρι', 'δεντρολίβανο', 'κανέλα', 'κύμινο', 'μοσχοκάρυδο',
        'salt', 'pepper', 'oregano', 'thyme', 'rosemary', 'cinnamon', 'cumin', 'nutmeg'
    ];

    if (produceKeywords.some(keyword => lowerName.includes(keyword))) return 'produce';
    if (dairyKeywords.some(keyword => lowerName.includes(keyword))) return 'dairy';
    if (meatKeywords.some(keyword => lowerName.includes(keyword))) return 'meat';
    if (seafoodKeywords.some(keyword => lowerName.includes(keyword))) return 'seafood';
    if (pantryKeywords.some(keyword => lowerName.includes(keyword))) return 'pantry';
    if (spicesKeywords.some(keyword => lowerName.includes(keyword))) return 'spices';

    return 'other';
}
