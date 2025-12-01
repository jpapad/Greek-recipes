"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { getUserFavorites, addFavorite as addFavoriteDB, removeFavorite as removeFavoriteDB } from "@/lib/api";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadFavorites() {
            try {
                const user = await getUser();

                if (user) {
                    // Authenticated user: use database
                    setUserId(user.id);
                    const dbFavorites = await getUserFavorites(user.id);
                    setFavorites(dbFavorites);
                } else {
                    // Anonymous user: use localStorage
                    setUserId(null);
                    const stored = localStorage.getItem("favorites");
                    if (stored) {
                        setFavorites(JSON.parse(stored));
                    }
                }
            } catch (error) {
                console.error("Error loading favorites:", error);
                // Fallback to localStorage
                const stored = localStorage.getItem("favorites");
                if (stored) {
                    setFavorites(JSON.parse(stored));
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadFavorites();
    }, []);

    const toggleFavorite = async (id: string) => {
        const isFav = favorites.includes(id);

        if (userId) {
            // Authenticated: update database
            if (isFav) {
                const success = await removeFavoriteDB(userId, id);
                if (success) {
                    setFavorites((prev) => prev.filter((favId) => favId !== id));
                }
            } else {
                const success = await addFavoriteDB(userId, id);
                if (success) {
                    setFavorites((prev) => [...prev, id]);
                }
            }
        } else {
            // Anonymous: update localStorage
            const newFavorites = isFav
                ? favorites.filter((favId) => favId !== id)
                : [...favorites, id];

            setFavorites(newFavorites);
            localStorage.setItem("favorites", JSON.stringify(newFavorites));
        }
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return { favorites, toggleFavorite, isFavorite, isLoading };
}
