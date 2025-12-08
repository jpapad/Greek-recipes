import { Recipe } from "@/lib/types";
import { flattenIngredients, flattenSteps } from "@/lib/recipeHelpers";

export function generateRecipeSchema(recipe: Recipe) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": recipe.title,
        "description": recipe.short_description,
        "image": recipe.image_url,
        "author": {
            "@type": "Organization",
            "name": "Greek Recipes"
        },
        "datePublished": recipe.created_at,
        "prepTime": `PT${recipe.time_minutes}M`,
        "cookTime": `PT${recipe.time_minutes}M`,
        "totalTime": `PT${recipe.time_minutes}M`,
        "recipeYield": `${recipe.servings} μερίδες`,
        "recipeCategory": recipe.category,
        "recipeCuisine": "Ελληνική",
        "recipeIngredient": flattenIngredients(recipe.ingredients),
        "recipeInstructions": flattenSteps(recipe.steps).map((step: string, index: number) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "text": step
        })),
        "aggregateRating": recipe.average_rating ? {
            "@type": "AggregateRating",
            "ratingValue": recipe.average_rating,
            "reviewCount": recipe.review_count || 0
        } : undefined,
        "keywords": [
            recipe.category,
            recipe.difficulty,
            "Ελληνική κουζίνα",
            ...(recipe.region ? [recipe.region.name] : [])
        ].filter(Boolean).join(", ")
    };

    return schema;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
}

export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Greek Recipes",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://greek-recipes.com",
        "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://greek-recipes.com"}/logo.png`,
        "description": "Ανακαλύψτε αυθεντικές ελληνικές συνταγές από όλες τις περιοχές της Ελλάδας",
        "sameAs": [
            "https://facebook.com/greekrecipes",
            "https://instagram.com/greekrecipes",
            "https://twitter.com/greekrecipes"
        ]
    };
}

export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Greek Recipes",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://greek-recipes.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://greek-recipes.com"}/recipes?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
}
