import { MetadataRoute } from 'next';
import { getRecipes, getRegions } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://greek-recipes.com';
  
  // Fetch all recipes and regions
  const recipes = await getRecipes();
  const regions = await getRegions();
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/regions`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shopping-list`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/meal-plan`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];
  
  // Recipe pages
  const recipePages = recipes.map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.slug}`,
    lastModified: new Date(recipe.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // Region pages
  const regionPages = regions.map((region) => ({
    url: `${baseUrl}/regions/${region.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  return [...staticPages, ...recipePages, ...regionPages];
}
