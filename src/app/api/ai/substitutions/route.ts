import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { ingredients, recipe } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are a Greek cooking expert. For this recipe "${recipe.title}", suggest substitutions for the following ingredients. Consider Greek cuisine traditions and local availability.

Ingredients to substitute:
${ingredients.join('\n')}

For each ingredient, provide:
1. Best substitute (preferably Greek/Mediterranean)
2. Why it works
3. Any adjustments needed

Respond ONLY with valid JSON in this exact format:
{
  "substitutions": [
    {
      "original": "ingredient name",
      "substitute": "alternative ingredient",
      "reason": "explanation why it works",
      "adjustment": "how to use it"
    }
  ]
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
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{"substitutions":[]}';
    
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
    const substitutions = jsonMatch ? JSON.parse(jsonMatch[0]) : { substitutions: [] };

    return NextResponse.json(substitutions);
  } catch (error) {
    console.error('AI substitutions error:', error);
    return NextResponse.json(
      { substitutions: [], error: 'Failed to generate substitutions' },
      { status: 200 }
    );
  }
}
