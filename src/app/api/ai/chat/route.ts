import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, recipe, conversationHistory } = await request.json();

    // Check for Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Build system prompt with recipe context
    const systemPrompt = `You are a helpful Greek cooking assistant. You're helping with the following recipe:

Title: ${recipe.title}
Ingredients: ${recipe.ingredients?.join(', ') || 'N/A'}
Steps: ${recipe.steps?.join(' ') || 'N/A'}
Difficulty: ${recipe.difficulty}
Time: ${recipe.time_minutes} minutes
Servings: ${recipe.servings}
${recipe.allergens?.length ? `Allergens: ${recipe.allergens.join(', ')}` : ''}

You can help with:
- Ingredient substitutions and alternatives
- Cooking tips and techniques
- Adjusting servings or portions
- Dietary modifications (vegetarian, vegan, gluten-free, etc.)
- Wine pairings
- Storage and reheating instructions
- Troubleshooting common issues

Always be friendly, concise, and practical. Give specific advice related to Greek cuisine when relevant.`;

    // Build conversation history for Gemini format
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood! I\'m ready to help you with this Greek recipe. What would you like to know?' }]
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      
      // Handle rate limiting
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error('AI chat error:', error);
    console.error('Error details:', error.message);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
