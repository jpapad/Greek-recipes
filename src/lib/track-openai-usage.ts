// Track OpenAI usage locally since OpenAI doesn't provide real-time usage API
interface UsageData {
    daily_tokens: number;
    total_requests: number;
    last_reset: string;
}

const STORAGE_KEY = 'openai_usage';

// Get current date in YYYY-MM-DD format
function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

// Get usage data from storage (in-memory for now, could use Redis/DB in production)
let usageData: UsageData = {
    daily_tokens: 0,
    total_requests: 0,
    last_reset: getToday()
};

export function getUsageData(): UsageData {
    const today = getToday();

    // Reset if it's a new day
    if (usageData.last_reset !== today) {
        usageData = {
            daily_tokens: 0,
            total_requests: 0,
            last_reset: today
        };
    }

    return usageData;
}

export function trackUsage(promptTokens: number, completionTokens: number): void {
    const today = getToday();

    // Reset if it's a new day
    if (usageData.last_reset !== today) {
        usageData = {
            daily_tokens: 0,
            total_requests: 0,
            last_reset: today
        };
    }

    usageData.daily_tokens += promptTokens + completionTokens;
    usageData.total_requests += 1;

    console.log(`OpenAI Usage - Tokens: ${promptTokens + completionTokens}, Total today: ${usageData.daily_tokens}`);
}
