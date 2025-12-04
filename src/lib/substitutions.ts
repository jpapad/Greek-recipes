// Ingredient substitution database
export interface Substitution {
    ingredient: string;
    substitutes: Array<{
        name: string;
        ratio: string;
        notes?: string;
    }>;
}

export const SUBSTITUTIONS: Substitution[] = [
    {
        ingredient: 'βούτυρο',
        substitutes: [
            { name: 'ελαιόλαδο', ratio: '3/4 κούπας για 1 κούπα βούτυρο', notes: 'Για υγιεινότερη επιλογή' },
            { name: 'γιαούρτι', ratio: '1/2 κούπας για 1 κούπα βούτυρο', notes: 'Για λιγότερες θερμίδες' },
            { name: 'μαργαρίνη', ratio: '1:1', notes: 'Για vegan εκδοχή' }
        ]
    },
    {
        ingredient: 'ζάχαρη',
        substitutes: [
            { name: 'μέλι', ratio: '3/4 κούπας για 1 κούπα ζάχαρη', notes: 'Μειώστε τα υγρά κατά 1/4' },
            { name: 'στέβια', ratio: '1 κ.γ. για 1 κούπα ζάχαρη', notes: 'Για διαιτητικούς λόγους' },
            { name: 'καρύδα ζάχαρη', ratio: '1:1', notes: 'Χαμηλότερος γλυκαιμικός δείκτης' }
        ]
    },
    {
        ingredient: 'αυγά',
        substitutes: [
            { name: 'σπόροι chia', ratio: '1 κ.σ. σπόροι + 3 κ.σ. νερό για 1 αυγό', notes: 'Για vegan συνταγές' },
            { name: 'μπανάνα', ratio: '1/4 κούπας πολτός για 1 αυγό', notes: 'Προσθέτει γλυκύτητα' },
            { name: 'γιαούρτι', ratio: '1/4 κούπας για 1 αυγό', notes: 'Για πυκνότητα' }
        ]
    },
    {
        ingredient: 'γάλα',
        substitutes: [
            { name: 'γάλα αμυγδάλου', ratio: '1:1', notes: 'Για lactose intolerance' },
            { name: 'γάλα σόγιας', ratio: '1:1', notes: 'Πλούσιο σε πρωτεΐνη' },
            { name: 'γάλα καρύδας', ratio: '1:1', notes: 'Για πλούσια γεύση' }
        ]
    },
    {
        ingredient: 'αλεύρι',
        substitutes: [
            { name: 'αλεύρι ολικής', ratio: '1:1', notes: 'Περισσότερες φυτικές ίνες' },
            { name: 'αλεύρι αμυγδάλου', ratio: '1:1', notes: 'Για gluten-free' },
            { name: 'αλεύρι ρυζιού', ratio: '1:1', notes: 'Για gluten-free, ελαφριά υφή' }
        ]
    },
    {
        ingredient: 'κρέμα γάλακτος',
        substitutes: [
            { name: 'κρέμα καρύδας', ratio: '1:1', notes: 'Για vegan εκδοχή' },
            { name: 'evaporated milk', ratio: '1:1', notes: 'Για λιγότερο λίπος' },
            { name: 'γάλα + βούτυρο', ratio: '1 κούπα γάλα + 2 κ.σ. βούτυρο', notes: 'Σπιτική εναλλακτική' }
        ]
    },
    {
        ingredient: 'ξύδι',
        substitutes: [
            { name: 'χυμός λεμονιού', ratio: '1:1', notes: 'Φρέσκια γεύση' },
            { name: 'λευκό κρασί', ratio: '2:1', notes: 'Για μαγείρεμα' }
        ]
    },
    {
        ingredient: 'φέτα',
        substitutes: [
            { name: 'ricotta', ratio: '1:1', notes: 'Πιο ήπια γεύση' },
            { name: 'tofu', ratio: '1:1', notes: 'Για vegan εκδοχή' },
            { name: 'cottage cheese', ratio: '1:1', notes: 'Χαμηλότερο λίπος' }
        ]
    }
];

export function findSubstitutes(ingredient: string): Substitution | null {
    const lowerIngredient = ingredient.toLowerCase();
    return SUBSTITUTIONS.find(sub => 
        lowerIngredient.includes(sub.ingredient.toLowerCase())
    ) || null;
}
