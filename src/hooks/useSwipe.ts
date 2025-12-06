"use client";

import { useRef, useState } from "react";

interface SwipeHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    threshold?: number;
}

export function useSwipe({
    onSwipeLeft,
    onSwipeRight,
    threshold = 50
}: SwipeHandlers) {
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;
        
        touchEndX.current = e.touches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;

        // Update direction for visual feedback
        if (Math.abs(diff) > 10) {
            setSwipeDirection(diff > 0 ? 'left' : 'right');
        }
    };

    const handleTouchEnd = () => {
        if (!isSwiping) return;

        const diff = touchStartX.current - touchEndX.current;

        // Swipe left (move finger left)
        if (diff > threshold && onSwipeLeft) {
            onSwipeLeft();
            vibrate();
        }

        // Swipe right (move finger right)
        if (diff < -threshold && onSwipeRight) {
            onSwipeRight();
            vibrate();
        }

        // Reset
        setIsSwiping(false);
        setSwipeDirection(null);
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const vibrate = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    return {
        handlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd
        },
        isSwiping,
        swipeDirection
    };
}
