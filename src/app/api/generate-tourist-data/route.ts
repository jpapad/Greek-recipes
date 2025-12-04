import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { locationName, locationType } = await request.json();

    if (!locationName) {
      return NextResponse.json(
        { error: "Location name is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    const prompt = `You are a Greek tourism expert. Generate detailed tourist information for "${locationName}" in Greece.
Location type: ${locationType || "region"}

Provide the response in VALID JSON format with the following structure:
{
  "photo_gallery": ["https://images.unsplash.com/...", "https://images.unsplash.com/..."],
  "attractions": [
    {
      "name": "Name in Greek",
      "type": "museum|monument|beach|park|archaeological|religious|nature",
      "description": "Description in Greek (2-3 sentences)",
      "image_url": "https://images.unsplash.com/...",
      "address": "Full address in Greek",
      "website": "https://..."
    }
  ],
  "how_to_get_there": "Detailed access instructions in Greek (airports, trains, buses, ferries). 3-4 sentences.",
  "tourist_info": "General tourist information and tips in Greek. Include best time to visit, what to expect, recommendations. 4-5 sentences.",
  "events_festivals": [
    {
      "name": "Event name in Greek",
      "date": "Month or specific period",
      "description": "Description in Greek (2 sentences)",
      "location": "Specific location within the area"
    }
  ],
  "local_products": [
    {
      "name": "Product name in Greek",
      "category": "food|wine|craft|other",
      "description": "Description in Greek (2 sentences)",
      "image_url": "https://images.unsplash.com/..."
    }
  ]
}

IMPORTANT:
1. All text MUST be in Greek language
2. Generate 3-5 attractions (mix of different types)
3. Generate 2-4 events/festivals (real ones if known, otherwise traditional ones)
4. Generate 3-5 local products (PDO/PGI products if applicable)
5. Use real Unsplash image URLs when possible (search for similar images)
6. Be accurate about real places, events, and products
7. Return ONLY valid JSON, no markdown, no explanations
8. Ensure all JSON strings are properly escaped`;

    // Call OpenAI API with GPT-4o (free with data sharing enabled)
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a Greek tourism expert. Always respond in Greek (Ελληνικά) and provide accurate, detailed information about Greek locations."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          response_format: { type: "json_object" }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: "Πάρα πολλές αιτήσεις. Παρακαλώ περιμένετε 1 λεπτό.",
          },
          { status: 429 }
        );
      }
      
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("No response from AI");
    }

    // Extract usage information from OpenAI response
    const usage = data.usage || {};
    const tokensUsed = usage.total_tokens || 0;

    console.log(`✅ OpenAI Usage: ${tokensUsed} tokens (prompt: ${usage.prompt_tokens}, completion: ${usage.completion_tokens})`);

    // Parse JSON response (OpenAI returns clean JSON with response_format)
    let touristData;
    try {
      touristData = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response", details: text },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!touristData.attractions || !Array.isArray(touristData.attractions)) {
      return NextResponse.json(
        { error: "Invalid response structure", details: touristData },
        { status: 500 }
      );
    }

    // Return data with usage information
    return NextResponse.json({
      ...touristData,
      _usage: {
        tokens: tokensUsed,
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens
      }
    });
  } catch (error: unknown) {
    console.error("Error generating tourist data:", error);

    return NextResponse.json(
      {
        error: "Failed to generate tourist data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
