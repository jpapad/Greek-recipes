'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { User, MapPin, Globe, Twitter, Instagram, Star, UtensilsCrossed, MessageSquare, Settings } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { useEffect } from 'react';
import { Recipe } from '@/lib/types';

interface UserProfile {
    user_id: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    location?: string;
    website?: string;
    twitter_handle?: string;
    instagram_handle?: string;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    recipe?: {
        title: string;
        slug: string;
    };
}

interface UserProfileViewProps {
    profile: UserProfile;
    recipes: Recipe[];
    reviews: Review[];
}

export function UserProfileView({ profile, recipes, reviews }: UserProfileViewProps) {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'recipes' | 'reviews'>('recipes');

    useEffect(() => {
        async function loadUser() {
            const user = await getUser();
            setCurrentUser(user);
        }
        loadUser();
    }, []);

    const isOwnProfile = currentUser?.id === profile.user_id;

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <GlassPanel className="p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0">
                        {profile.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt={profile.display_name || 'User'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                                <User className="w-16 h-16 text-primary" />
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-grow">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    {profile.display_name || 'Anonymous User'}
                                </h1>
                                {profile.bio && (
                                    <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
                                )}
                            </div>
                            {isOwnProfile && (
                                <Link href="/profile/edit">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Settings className="w-4 h-4" /> Edit Profile
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mb-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{recipes.length}</div>
                                <div className="text-sm text-muted-foreground">Recipes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                                <div className="text-sm text-muted-foreground">Reviews</div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-3">
                            {profile.location && (
                                <Badge variant="outline" className="gap-2">
                                    <MapPin className="w-3 h-3" /> {profile.location}
                                </Badge>
                            )}
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                    <Badge variant="outline" className="gap-2 hover:bg-primary/10 cursor-pointer">
                                        <Globe className="w-3 h-3" /> Website
                                    </Badge>
                                </a>
                            )}
                            {profile.twitter_handle && (
                                <a href={`https://twitter.com/${profile.twitter_handle}`} target="_blank" rel="noopener noreferrer">
                                    <Badge variant="outline" className="gap-2 hover:bg-primary/10 cursor-pointer">
                                        <Twitter className="w-3 h-3" /> @{profile.twitter_handle}
                                    </Badge>
                                </a>
                            )}
                            {profile.instagram_handle && (
                                <a href={`https://instagram.com/${profile.instagram_handle}`} target="_blank" rel="noopener noreferrer">
                                    <Badge variant="outline" className="gap-2 hover:bg-primary/10 cursor-pointer">
                                        <Instagram className="w-3 h-3" /> @{profile.instagram_handle}
                                    </Badge>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </GlassPanel>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('recipes')}
                    className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
                        activeTab === 'recipes'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <UtensilsCrossed className="w-4 h-4" />
                    Recipes ({recipes.length})
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
                        activeTab === 'reviews'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Reviews ({reviews.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === 'recipes' ? (
                recipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <GlassPanel className="p-12 text-center">
                        <p className="text-muted-foreground">No recipes yet.</p>
                    </GlassPanel>
                )
            ) : (
                reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <GlassPanel key={review.id} className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        {review.recipe && (
                                            <Link
                                                href={`/recipes/${review.recipe.slug}`}
                                                className="font-semibold hover:text-primary transition-colors"
                                            >
                                                {review.recipe.title}
                                            </Link>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < review.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-muted-foreground">{review.comment}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </GlassPanel>
                        ))}
                    </div>
                ) : (
                    <GlassPanel className="p-12 text-center">
                        <p className="text-muted-foreground">No reviews yet.</p>
                    </GlassPanel>
                )
            )}
        </div>
    );
}
