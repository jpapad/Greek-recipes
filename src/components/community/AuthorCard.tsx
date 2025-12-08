'use client';

import Link from 'next/link';
import { UserProfile } from '@/lib/types';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, UtensilsCrossed, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

interface AuthorCardProps {
    author: UserProfile & {
        recipe_count?: number;
        total_likes?: number;
    };
    className?: string;
}

export function AuthorCard({ author, className }: AuthorCardProps) {
    const { t } = useTranslations();

    // Get display name: either name, or email prefix, or 'Unknown'
    const displayName = author.name || author.email?.split('@')[0] || t('Common.unknown');

    return (
        <Link href={`/profile/${author.user_id}`} className="block h-full group">
            <GlassPanel
                variant="card"
                hoverEffect
                className={cn(
                    "h-full p-6 flex flex-col items-center text-center transition-all duration-300",
                    "group-hover:scale-[1.02] group-hover:shadow-lg",
                    className
                )}
            >
                <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-4 border-white/20 shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <AvatarImage src={author.avatar_url} alt={displayName} />
                        <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                            {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {author.is_admin && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                            ADMIN
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">
                    {displayName}
                </h3>

                {author.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                        {author.bio}
                    </p>
                )}

                <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground w-full justify-center border-t border-border pt-4">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg text-foreground transition-colors group-hover:text-primary flex items-center gap-1.5">
                            <UtensilsCrossed className="w-4 h-4" />
                            {author.recipe_count || 0}
                        </span>
                        <span className="text-xs uppercase tracking-wider opacity-70">Συνταγές</span>
                    </div>
                </div>
            </GlassPanel>
        </Link>
    );
}
