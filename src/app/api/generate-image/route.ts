import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, recipeName, type = "food" } = await request.json();

    if (!recipeName && !prompt) {
      return NextResponse.json(
        { error: "Recipe name or prompt is required" },
        { status: 400 }
      );
    }

    // Generate professional prompt
    let finalPrompt = prompt;
    
    if (!prompt && recipeName) {
      const promptTemplates = {
        food: `Professional food photography of ${recipeName}, Greek traditional cuisine, overhead view, rustic wooden table, natural lighting, appetizing presentation, shallow depth of field, warm tones, authentic ingredients, high quality, culinary magazine style`,
        place: `Beautiful landscape photography of ${recipeName}, Greece, golden hour lighting, stunning scenery, travel magazine quality, vivid colors, professional photography`,
        product: `Product photography of ${recipeName}, Greek artisan product, clean white background, professional lighting, commercial quality, detailed texture`
      };
      
      finalPrompt = promptTemplates[type as keyof typeof promptTemplates] || promptTemplates.food;
    }

    console.log(`🎨 Generating image with Pollinations.ai: "${finalPrompt}"`);

    // Use Pollinations.ai - Completely FREE, no API key needed!
    // It generates images on-the-fly via URL
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=true`;

    console.log(`✅ Image URL generated successfully`);

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: finalPrompt,
    });

  } catch (error: unknown) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
