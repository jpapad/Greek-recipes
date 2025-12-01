"use client";

import { useState } from "react";
import { Review } from "@/lib/types";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { getReviews } from "@/lib/api";

interface RecipeReviewsProps {
    recipeId: string;
    initialReviews: Review[];
}

export function RecipeReviews({ recipeId, initialReviews }: RecipeReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);

    const handleReviewAdded = async () => {
        // Refresh reviews
        const updatedReviews = await getReviews(recipeId);
        setReviews(updatedReviews);
    };

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold border-b border-border/50 pb-4">Reviews ({reviews.length})</h3>

            <ReviewForm recipeId={recipeId} onReviewAdded={handleReviewAdded} />

            <ReviewList reviews={reviews} />
        </div>
    );
}
