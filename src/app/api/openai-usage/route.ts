import { NextRequest, NextResponse } from "next/server";
import { getUsageData } from "@/lib/track-openai-usage";

export async function GET(request: NextRequest) {
    try {
        const usage = getUsageData();
        const dailyLimit = 250000;

        return NextResponse.json({
            daily_tokens: usage.daily_tokens,
            daily_limit: dailyLimit,
            total_requests: usage.total_requests,
            last_reset: usage.last_reset,
            usage_percentage: (usage.daily_tokens / dailyLimit) * 100
        });

    } catch (error: any) {
        console.error("Error fetching OpenAI usage:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch usage data" },
            { status: 500 }
        );
    }
}
