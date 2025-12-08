import { IngredientGroup, StepGroup } from './types';

/**
 * Check if data is in old format (string array)
 */
export function isOldFormat<T>(data: T[] | { items: string[] }[]): data is T[] {
    return Array.isArray(data) && data.length > 0 && typeof data[0] === 'string';
}

/**
 * Migrate ingredients from old format (string[]) to new format (IngredientGroup[])
 */
export function migrateIngredientsToGroups(
    ingredients: string[] | IngredientGroup[] | undefined
): IngredientGroup[] {
    if (!ingredients || ingredients.length === 0) {
        return [{ title: '', items: [''] }];
    }

    // Check if it's old format (array of strings)
    if (typeof ingredients[0] === 'string') {
        // Old format: convert to single group with no title
        return [{ title: '', items: ingredients as string[] }];
    }

    // Already in new format
    return ingredients as IngredientGroup[];
}

/**
 * Migrate steps from old format (string[]) to new format (StepGroup[])
 */
export function migrateStepsToGroups(
    steps: string[] | StepGroup[] | undefined
): StepGroup[] {
    if (!steps || steps.length === 0) {
        return [{ title: '', items: [''] }];
    }

    // Check if it's old format (array of strings)
    if (typeof steps[0] === 'string') {
        // Old format: convert to single group with no title
        return [{ title: '', items: steps as string[] }];
    }

    // Already in new format
    return steps as StepGroup[];
}

/**
 * Flatten groups back to simple array (for backward compatibility if needed)
 */
export function flattenGroups<T extends { items: string[] }>(groups: T[]): string[] {
    return groups.flatMap(g => g.items.filter(item => item.trim() !== ''));
}

/**
 * Check if all groups have empty titles (meaning it's essentially ungrouped)
 */
export function isUngrouped<T extends { title?: string }>(groups: T[]): boolean {
    return groups.every(g => !g.title || g.title.trim() === '');
}

/**
 * Flatten ingredient groups to simple string array
 */
export function flattenIngredients(ingredients: IngredientGroup[] | string[] | undefined): string[] {
    if (!ingredients) return [];
    if (typeof ingredients[0] === 'string') return ingredients as string[];
    return (ingredients as IngredientGroup[]).flatMap(g => g.items);
}

/**
 * Flatten step groups to simple string array
 */
export function flattenSteps(steps: StepGroup[] | string[] | undefined): string[] {
    if (!steps) return [];
    if (typeof steps[0] === 'string') return steps as string[];
    return (steps as StepGroup[]).flatMap(g => g.items);
}
