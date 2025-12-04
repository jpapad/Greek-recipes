import { RecipesGridBlock as RecipesGridBlockType } from '@/lib/types/pages';

export default function RecipesGridBlock({ block }: { block: RecipesGridBlockType }) {
    return (
        <div className="w-full my-6">
            {block.data.title && (
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">
                    {block.data.title}
                </h2>
            )}
            <div className="text-center p-6 sm:p-8 md:p-12 bg-muted/50 rounded-lg">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                    🍽️ Recipes Grid
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    Οι συνταγές θα φορτωθούν εδώ
                </p>
            </div>
        </div>
    );
}
