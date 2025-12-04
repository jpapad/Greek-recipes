"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addReview } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getUser } from "@/lib/auth";
import { useTranslations } from "@/hooks/useTranslations";

interface ReviewFormProps {
    recipeId: string;
    onReviewAdded: () => void;
}

export function ReviewForm({ recipeId, onReviewAdded }: ReviewFormProps) {
    const { t } = useTranslations();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (rating === 0) {
            setError(t('Reviews.selectRating'));
            return;
        }

        setIsSubmitting(true);
        try {
            const user = await getUser();
            if (!user) {
                setError(t('Reviews.mustBeLoggedIn'));
                return;
            }

            const result = await addReview({
                recipe_id: recipeId,
                user_id: user.id,
                rating,
                comment,
            });

            if (result) {
                setRating(0);
                setComment("");
                onReviewAdded();
            } else {
                setError(t('Reviews.failed'));
            }
        } catch (err) {
            setError(t('Reviews.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GlassPanel className="p-6 space-y-4 bg-white/40">
            <h3 className="text-xl font-semibold">{t('Reviews.writeReview')}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <Textarea
                    placeholder={t('Reviews.shareThoughts')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px] bg-white/60"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('Reviews.submitting') : t('Reviews.postReview')}
                </Button>
            </form>
        </GlassPanel>
    );
}
