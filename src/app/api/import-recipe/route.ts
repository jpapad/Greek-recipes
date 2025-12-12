import { NextRequest, NextResponse } from "next/server";
import { importRecipeFromUrl } from "@/lib/recipe-parser";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format" },
                { status: 400 }
            );
        }

        // Import recipe
        console.log("Importing recipe from:", url);
        const recipe = await importRecipeFromUrl(url);
        console.log("Recipe imported successfully:", recipe.title);

        if (!recipe.title) {
            return NextResponse.json(
                { error: "No recipe found at this URL" },
                { status: 404 }
            );
        }

        return NextResponse.json({ recipe });
    } catch (error: any) {
        console.error("Import error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            {
                error: error.message || "Failed to import recipe",
                details: process.env.NODE_ENV === "development" ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
