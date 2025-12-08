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

        // Map location type to Greek
        const locationTypeGreek: Record<string, string> = {
            region: "περιοχή",
            prefecture: "νομός",
            city: "πόλη"
        };

        const greekType = locationTypeGreek[locationType] || "τοποθεσία";

        const prompt = `Γράψε μια λεπτομερή περιγραφή 2-3 παραγράφων για ${greekType === "περιοχή" ? "την" : "τον"} ${greekType} "${locationName}" στην Ελλάδα.

Η περιγραφή πρέπει να περιλαμβάνει:
1. Γεωγραφική θέση και γενικά χαρακτηριστικά
2. Ιστορική και πολιτιστική σημασία
3. Κύρια αξιοθέατα ή χαρακτηριστικά που την κάνουν ξεχωριστή

Γράψε στα Ελληνικά, με επαγγελματικό και ενημερωτικό ύφος, κατάλληλο για τουριστικό οδηγό.`;

        // Call OpenAI API with GPT-4o
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
                            content: "Είσαι ειδικός στην ελληνική γεωγραφία, ιστορία και πολιτισμό. Γράφεις πάντα στα Ελληνικά με επαγγελματικό και ενημερωτικό ύφος."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
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
        const description = data.choices?.[0]?.message?.content;

        if (!description) {
            throw new Error("No response from AI");
        }

        // Extract usage information
        const usage = data.usage || {};
        const tokensUsed = usage.total_tokens || 0;

        console.log(`✅ OpenAI Description: ${tokensUsed} tokens (prompt: ${usage.prompt_tokens}, completion: ${usage.completion_tokens})`);

        return NextResponse.json({
            description: description.trim(),
            _usage: {
                tokens: tokensUsed,
                prompt_tokens: usage.prompt_tokens,
                completion_tokens: usage.completion_tokens
            }
        });
    } catch (error: unknown) {
        console.error("Error generating description:", error);

        return NextResponse.json(
            {
                error: "Failed to generate description",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
