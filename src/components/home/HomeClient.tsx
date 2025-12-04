"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HomeClientProps {
    featuredRecipeSlug?: string;
    featuredRecipeTitle?: string;
    featuredRecipeDescription?: string;
}

export function HomeClient({ featuredRecipeSlug, featuredRecipeTitle, featuredRecipeDescription }: HomeClientProps) {
    const { t } = useTranslations();

    return (
        <>
            <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-primary/90 rounded-full backdrop-blur-md">
                {t('Home.featured')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {featuredRecipeTitle || t('Home.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3">
                {featuredRecipeDescription || t('Home.heroSubtitle')}
            </p>
            <Button size="lg" className="rounded-full text-lg px-8" asChild>
                <Link href={featuredRecipeSlug ? `/recipes/${featuredRecipeSlug}` : '/recipes'}>
                    {t('Home.cta')} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </Button>
        </>
    );
}

export function HomeSectionHeaders() {
    const { t } = useTranslations();

    return {
        exploreRegions: t('Home.exploreRegions'),
        popularRecipes: t('Home.popularRecipes'),
        viewAll: t('Common.viewAll')
    };
}
