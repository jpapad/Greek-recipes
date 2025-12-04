import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { recipe } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are a Greek cooking expert. Provide practical cooking tips for this recipe:

Recipe: ${recipe.title}
Difficulty: ${recipe.difficulty}
Time: ${recipe.time_minutes} minutes
Ingredients: ${recipe.ingredients?.slice(0, 10).join(', ') || 'N/A'}

Provide 5-7 specific, actionable tips. Include:
- Pro techniques for better results
- Common mistakes to avoid
- Greek cooking traditions
- Timing and temperature tips
- Flavor enhancement suggestions

Respond ONLY with valid JSON in this exact format:
{
  "tips": [
    {
      "title": "Short tip title",
      "description": "Detailed explanation",
      "category": "technique"
    }
  ]
}

Categories can be: technique, timing, flavor, or tradition`;

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
            temperature: 0.8,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{"tips":[]}';
    
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
    const tips = jsonMatch ? JSON.parse(jsonMatch[0]) : { tips: [] };

    return NextResponse.json(tips);
  } catch (error) {
    console.error('AI tips error:', error);
    return NextResponse.json(
      { tips: [], error: 'Failed to generate tips' },
      { status: 200 }
    );
  }
}
