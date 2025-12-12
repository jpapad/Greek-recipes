import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Recipe, IngredientGroup, StepGroup } from "./types";

// Lazy initialize Gemini to avoid errors on module load
function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    return new GoogleGenerativeAI(apiKey);
}

interface SchemaRecipe {
    "@type": string;
    name?: string;
    description?: string;
    recipeIngredient?: string[];
    recipeInstructions?: any[];
    totalTime?: string;
    cookTime?: string;
    prepTime?: string;
    recipeYield?: string | number;
    recipeCategory?: string;
    recipeCuisine?: string;
    image?: string | string[] | { url: string };
    keywords?: string;
    nutrition?: {
        calories?: string;
        proteinContent?: string;
        carbohydrateContent?: string;
        fatContent?: string;
    };
}

/**
 * Parse Schema.org Recipe JSON-LD from HTML
 */
export function parseSchemaOrg(html: string): Partial<Recipe> | null {
    try {
        // Find all JSON-LD script tags
        const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);

        if (!jsonLdMatches) return null;

        for (const match of jsonLdMatches) {
            const jsonContent = match.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
            const data = JSON.parse(jsonContent);

            // Handle both single object and array of objects
            const recipes = Array.isArray(data) ? data : [data];

            for (const item of recipes) {
                if (item["@type"] === "Recipe" || (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))) {
                    return normalizeSchemaRecipe(item);
                }

                // Check nested @graph
                if (item["@graph"]) {
                    const recipe = item["@graph"].find((g: any) =>
                        g["@type"] === "Recipe" || (Array.isArray(g["@type"]) && g["@type"].includes("Recipe"))
                    );
                    if (recipe) return normalizeSchemaRecipe(recipe);
                }
            }
        }

        return null;
    } catch (error) {
        console.error("Schema.org parsing error:", error);
        return null;
    }
}

/**
 * Normalize Schema.org Recipe data to our Recipe type
 */
function normalizeSchemaRecipe(schema: SchemaRecipe): Partial<Recipe> {
    const recipe: Partial<Recipe> = {};

    if (schema.name) recipe.title = schema.name;
    if (schema.description) recipe.short_description = schema.description;

    // Ingredients - detect groups
    if (schema.recipeIngredient) {
        recipe.ingredients = detectIngredientGroups(schema.recipeIngredient);
    }

    // Instructions - detect groups
    if (schema.recipeInstructions) {
        const steps = normalizeInstructions(schema.recipeInstructions);
        recipe.steps = detectStepGroups(steps);
    }

    // Time
    recipe.time_minutes = parseTimeToMinutes(schema.totalTime || schema.cookTime || schema.prepTime);

    // Servings
    if (schema.recipeYield) {
        recipe.servings = parseServings(schema.recipeYield);
    }

    // Category
    if (schema.recipeCategory) {
        recipe.category = schema.recipeCategory.toLowerCase();
    }

    // Image
    if (schema.image) {
        if (typeof schema.image === "string") {
            recipe.image_url = schema.image;
        } else if (Array.isArray(schema.image)) {
            recipe.image_url = schema.image[0];
        } else if (schema.image.url) {
            recipe.image_url = schema.image.url;
        }
    }

    // Nutrition
    if (schema.nutrition) {
        if (schema.nutrition.calories) {
            recipe.calories = parseInt(schema.nutrition.calories.replace(/[^\d]/g, ""));
        }
        if (schema.nutrition.proteinContent) {
            recipe.protein_g = parseFloat(schema.nutrition.proteinContent);
        }
        if (schema.nutrition.carbohydrateContent) {
            recipe.carbs_g = parseFloat(schema.nutrition.carbohydrateContent);
        }
        if (schema.nutrition.fatContent) {
            recipe.fat_g = parseFloat(schema.nutrition.fatContent);
        }
    }

    // Keywords
    if (schema.keywords) {
        recipe.keywords = schema.keywords.split(",").map((k) => k.trim());
    }

    return recipe;
}

/**
 * Normalize recipe instructions from various formats
 */
function normalizeInstructions(instructions: any[]): string[] {
    const steps: string[] = [];

    for (const instruction of instructions) {
        if (typeof instruction === "string") {
            steps.push(instruction);
        } else if (instruction["@type"] === "HowToStep") {
            steps.push(instruction.text || instruction.itemListElement?.text || "");
        } else if (instruction.text) {
            steps.push(instruction.text);
        } else if (instruction.itemListElement) {
            // Nested steps
            for (const step of instruction.itemListElement) {
                if (step.text) steps.push(step.text);
            }
        }
    }

    return steps.filter(Boolean);
}

/**
 * Detect ingredient groups by analyzing patterns
 */
function detectIngredientGroups(ingredients: string[]): IngredientGroup[] | string[] {
    const groups: IngredientGroup[] = [];
    let currentGroup: IngredientGroup | null = null;

    const groupPatterns = [
        /^(for the|για το|για τη|για την|για τα)\s+(.+):?$/i,
        /^(.+)\s*:$/,
    ];

    for (const ingredient of ingredients) {
        let isGroupHeader = false;

        for (const pattern of groupPatterns) {
            const match = ingredient.match(pattern);
            if (match) {
                // Save previous group
                if (currentGroup && currentGroup.items.length > 0) {
                    groups.push(currentGroup);
                }
                // Start new group
                currentGroup = {
                    title: ingredient.replace(":", "").trim(),
                    items: [],
                };
                isGroupHeader = true;
                break;
            }
        }

        if (!isGroupHeader) {
            if (!currentGroup) {
                currentGroup = { items: [] };
            }
            currentGroup.items.push(ingredient);
        }
    }

    // Add last group
    if (currentGroup && currentGroup.items.length > 0) {
        groups.push(currentGroup);
    }

    // If only one group without title, return as simple array
    if (groups.length === 1 && !groups[0].title) {
        return groups[0].items;
    }

    return groups.length > 0 ? groups : ingredients;
}

/**
 * Detect step groups by analyzing patterns
 */
function detectStepGroups(steps: string[]): StepGroup[] | string[] {
    const groups: StepGroup[] = [];
    let currentGroup: StepGroup | null = null;

    const groupPatterns = [
        /^(preparation|cooking|baking|assembly|serving|προετοιμασία|μαγείρεμα|ψήσιμο|σερβίρισμα)\s*:?$/i,
    ];

    for (const step of steps) {
        let isGroupHeader = false;

        for (const pattern of groupPatterns) {
            if (pattern.test(step.trim())) {
                // Save previous group
                if (currentGroup && currentGroup.items.length > 0) {
                    groups.push(currentGroup);
                }
                // Start new group
                currentGroup = {
                    title: step.replace(":", "").trim(),
                    items: [],
                };
                isGroupHeader = true;
                break;
            }
        }

        if (!isGroupHeader) {
            if (!currentGroup) {
                currentGroup = { items: [] };
            }
            currentGroup.items.push(step);
        }
    }

    // Add last group
    if (currentGroup && currentGroup.items.length > 0) {
        groups.push(currentGroup);
    }

    // If only one group without title, return as simple array
    if (groups.length === 1 && !groups[0].title) {
        return groups[0].items;
    }

    return groups.length > 0 ? groups : steps;
}

/**
 * Parse ISO 8601 duration to minutes
 */
function parseTimeToMinutes(time?: string): number {
    if (!time) return 30; // Default

    const match = time.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
        const hours = parseInt(match[1] || "0");
        const minutes = parseInt(match[2] || "0");
        return hours * 60 + minutes;
    }

    return 30;
}

/**
 * Parse servings from various formats
 */
function parseServings(servings: string | number): number {
    if (typeof servings === "number") return servings;

    const match = servings.match(/(\d+)/);
    return match ? parseInt(match[1]) : 4;
}

/**
 * Extract recipe using Gemini AI
 */
export async function extractWithGemini(html: string, url: string): Promise<Partial<Recipe>> {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Strip HTML to reduce tokens, keep only text content
    const textContent = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 30000); // Limit to avoid token limits

    const prompt = `Extract the recipe from this webpage content. Return ONLY valid JSON, no markdown formatting.

Expected JSON structure:
{
  "title": "Recipe name",
  "short_description": "Brief description",
  "ingredients": [
    {"title": "Group name (optional)", "items": ["ingredient 1", "ingredient 2"]},
    {"items": ["ingredient 3"]}
  ],
  "steps": [
    {"title": "Step group name (optional)", "items": ["step 1", "step 2"]},
    {"items": ["step 3"]}
  ],
  "time_minutes": 30,
  "servings": 4,
  "difficulty": "easy|medium|hard",
  "category": "category name",
  "image_url": "image URL if found",
  "calories": 350,
  "protein_g": 15,
  "carbs_g": 45,
  "fat_g": 12
}

IMPORTANT:
- If ingredients or steps are grouped (e.g., "For the dough", "Για τη ζύμη"), use the grouped format with "title" field
- If no groups, omit the "title" field in ingredient/step objects
- Extract all numeric nutrition values as numbers, not strings
- Guess difficulty based on number of steps and complexity
- Return ONLY the JSON object, no explanations or markdown

Webpage content:
${textContent}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        console.log("Gemini raw response:", text.substring(0, 500)); // Log first 500 chars

        // Remove markdown code blocks if present
        text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        const data = JSON.parse(text);

        // Add source attribution
        data.source_attribution = url;

        return data;
    } catch (error) {
        console.error("Gemini extraction error:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        throw new Error("Failed to extract recipe using AI");
    }
}

/**
 * Main function to import recipe from URL
 */
export async function importRecipeFromUrl(url: string): Promise<Partial<Recipe>> {
    // Fetch HTML
    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Try Schema.org first
    const schemaRecipe = parseSchemaOrg(html);

    if (schemaRecipe && schemaRecipe.title) {
        console.log("Recipe extracted via Schema.org");
        schemaRecipe.source_attribution = url;
        return schemaRecipe;
    }

    // Fallback to Gemini
    console.log("Schema.org not found, using Gemini AI");
    return extractWithGemini(html, url);
}
