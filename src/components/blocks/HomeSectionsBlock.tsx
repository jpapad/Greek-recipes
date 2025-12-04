import { HomeSectionsBlock as HomeSectionsBlockType } from '@/lib/types/pages';

export default function HomeSectionsBlock({ block }: { block: HomeSectionsBlockType }) {
    return (
        <div className="w-full">
            <div className="text-center p-6 sm:p-8 md:p-12 bg-muted/50 rounded-lg">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                    🏠 Home Sections
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    Τα sections της αρχικής θα φορτωθούν εδώ
                </p>
            </div>
        </div>
    );
}
