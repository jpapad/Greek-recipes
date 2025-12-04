import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { recipe, variationType } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const variations = {
      'vegetarian': 'Create a vegetarian version',
      'vegan': 'Create a vegan version',
      'quick': 'Create a faster version (under 30 minutes)',
      'gourmet': 'Create an elevated, restaurant-quality version',
      'budget': 'Create a budget-friendly version',
      'spicy': 'Create a spicier version',
    };

    const prompt = `You are a Greek cooking expert. ${variations[variationType as keyof typeof variations]} of this recipe:

Original Recipe: ${recipe.title}
Ingredients: ${recipe.ingredients?.join(', ') || 'N/A'}
Steps: ${recipe.steps?.join(' ').substring(0, 500) || 'N/A'}
Time: ${recipe.time_minutes} minutes
Servings: ${recipe.servings}

Provide a complete variation with:
- New recipe title
- Modified ingredients list
- Adjusted cooking steps
- New cooking time
- Brief description of changes

Respond ONLY with valid JSON in this exact format:
{
  "title": "New Recipe Name",
  "description": "What changed and why",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"],
  "time_minutes": 45,
  "changes": ["change 1", "change 2"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1200,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Clean up the response to extract JSON - handle markdown code blocks
    let jsonText = text;
    if (text.includes('```json')) {
      const match = text.match(/```json\s*([\s\S]*?)\s*```/);
      jsonText = match ? match[1] : text;
    } else if (text.includes('```')) {
      const match = text.match(/```\s*([\s\S]*?)\s*```/);
      jsonText = match ? match[1] : text;
    }
    
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    const variation = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return NextResponse.json(variation);
  } catch (error) {
    console.error('AI variation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate variation' },
      { status: 200 }
    );
  }
}
