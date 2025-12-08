"use client";

import { Star, User } from "lucide-react";
import { Review } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";

interface ReviewListProps {
    reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    const t = useTranslations();

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                {t('Reviews.noReviews')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <GlassPanel key={review.id} className="p-4 bg-white/30">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">
                                    {review.user?.email?.split("@")[0] || t('Reviews.anonymous')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                </GlassPanel>
            ))}
        </div>
    );
}
