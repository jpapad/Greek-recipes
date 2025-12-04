import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { UserProfileView } from '@/components/profile/UserProfileView';
import { supabase } from '@/lib/supabaseClient';

interface ProfilePageProps {
    params: {
        userId: string;
    };
}

async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error || !data) return null;
    return data;
}

async function getUserRecipes(userId: string) {
    const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return data || [];
}

async function getUserReviews(userId: string) {
    const { data } = await supabase
        .from('reviews')
        .select('*, recipe:recipes(title, slug)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return data || [];
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const profile = await getUserProfile(params.userId);

    if (!profile) {
        notFound();
    }

    const [recipes, reviews] = await Promise.all([
        getUserRecipes(params.userId),
        getUserReviews(params.userId)
    ]);

    return (
        <div className="space-y-8">
            <Suspense fallback={<GlassPanel className="h-64 animate-pulse" />}>
                <UserProfileView
                    profile={profile}
                    recipes={recipes}
                    reviews={reviews}
                />
            </Suspense>
        </div>
    );
}
