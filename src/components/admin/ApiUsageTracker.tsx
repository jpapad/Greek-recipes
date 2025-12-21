"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Activity, TrendingUp, Clock, AlertCircle } from "lucide-react";

interface UsageStats {
  tokensToday: number;
  requestsToday: number;
  lastReset: string;
}

const DAILY_LIMIT = 250000; // OpenAI free tier with data sharing
const STORAGE_KEY = "openai_usage_tracker";

export function ApiUsageTracker() {
  const [stats, setStats] = useState<UsageStats>({
    tokensToday: 0,
    requestsToday: 0,
    lastReset: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real usage data from API
    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/openai-usage");
        if (response.ok) {
          const data = await response.json();
          setStats({
            tokensToday: data.daily_tokens,
            requestsToday: data.total_requests,
            lastReset: data.last_reset
          });
        }
      } catch (error) {
        console.error("Failed to fetch usage stats:", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchUsage();

    // Poll every 5 seconds to get updates
    const interval = setInterval(fetchUsage, 5000);

    return () => clearInterval(interval);
  }, []);

  const percentageUsed = (stats.tokensToday / DAILY_LIMIT) * 100;
  const tokensRemaining = Math.max(0, DAILY_LIMIT - stats.tokensToday);
  const estimatedRequestsRemaining = Math.floor(tokensRemaining / 500); // ~500 tokens per request

  // Calculate time until reset (midnight UTC)
  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ώ ${minutes}λ`;
  };

  const getStatusColor = () => {
    if (percentageUsed >= 90) return "text-red-400";
    if (percentageUsed >= 70) return "text-yellow-400";
    return "text-green-400";
  };

  const getProgressBarColor = () => {
    if (percentageUsed >= 90) return "bg-red-500";
    if (percentageUsed >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <GlassPanel variant="card" className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-foreground">
          OpenAI API Usage
        </h2>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Daily Tokens</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {stats.tokensToday.toLocaleString()} / {DAILY_LIMIT.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(100, percentageUsed)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {percentageUsed.toFixed(1)}% χρησιμοποιημένο
            </span>
            <span className="text-xs text-muted-foreground">
              {tokensRemaining.toLocaleString()} tokens απομένουν
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Αιτήσεις Σήμερα</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.requestsToday}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ~{estimatedRequestsRemaining} απομένουν
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Reset σε</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {getTimeUntilReset()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Μεσάνυχτα UTC
            </div>
          </div>
        </div>

        {/* Warning */}
        {percentageUsed >= 90 && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">
                Προσοχή: Πλησιάζετε το ημερήσιο όριο!
              </p>
              <p className="text-xs text-red-300 mt-1">
                Έχετε χρησιμοποιήσει {percentageUsed.toFixed(1)}% των δωρεάν tokens.
                Οι επόμενες αιτήσεις μπορεί να χρεωθούν.
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-white/10">
          <p>• Free tier: 250,000 tokens/day με data sharing</p>
          <p>• Μέσος όρος: ~500 tokens ανά tourist data generation</p>
          <p>• Tracking: Μόνο αυτή η εφαρμογή (Greek Recipes)</p>
          <p className="pt-2">
            <a
              href="https://platform.openai.com/usage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Δες επίσημο usage στο OpenAI Dashboard →
            </a>
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
