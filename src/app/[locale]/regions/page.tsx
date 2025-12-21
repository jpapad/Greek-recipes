import Link from "next/link"
import { getRegions, getPrefectures, getRecipes } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, MapPin } from "lucide-react"

export default async function RegionsPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    const [regions, prefectures, recipes] = await Promise.all([
        getRegions(),
        getPrefectures(),
        getRecipes(),
    ])

    const recipesByRegion = new Map<string, number>()
    for (const r of recipes) {
        if (!r.region_id) continue
        recipesByRegion.set(r.region_id, (recipesByRegion.get(r.region_id) || 0) + 1)
    }

    const prefecturesByRegion = new Map<string, number>()
    for (const p of prefectures as any[]) {
        const rid = p.region_id
        if (!rid) continue
        prefecturesByRegion.set(rid, (prefecturesByRegion.get(rid) || 0) + 1)
    }

    const copy = {
        el: {
            badge: "Περιφέρειες",
            title: "Εξερεύνησε την Ελλάδα ανά Περιφέρεια",
            subtitle:
                "Διάλεξε περιφέρεια για να δεις νομούς, πόλεις/χωριά και τις παραδοσιακές συνταγές της.",
            recipes: "συνταγές",
            prefectures: "νομοί",
            more: "Δες περισσότερα",
            fallbackDesc: "Πλούσια γαστρονομική παράδοση και μοναδικές τοπικές γεύσεις.",
        },
        en: {
            badge: "Regions",
            title: "Explore Greece by Region",
            subtitle:
                "Choose a region to explore prefectures, cities/villages and its traditional recipes.",
            recipes: "recipes",
            prefectures: "prefectures",
            more: "Explore",
            fallbackDesc: "Rich culinary tradition and unique local flavors.",
        },
    } as const

    const c = locale === "el" ? copy.el : copy.en

    return (
        <div className="space-y-10">
            <header className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-muted/60 ring-1 ring-border">
                    <MapPin className="size-4" />
                    <span className="text-sm font-semibold">{c.badge}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {c.title}
                </h1>

                <p className="text-muted-foreground text-lg max-w-3xl">
                    {c.subtitle}
                </p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regions.map((region) => {
                    const recipesCount = recipesByRegion.get(region.id) || 0
                    const subCount = prefecturesByRegion.get(region.id) || 0

                    return (
                        <Link
                            key={region.id}
                            href={`/${locale}/regions/${region.slug}`}
                            className="group"
                        >
                            <Card className="overflow-hidden rounded-3xl border bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative h-44 w-full overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={region.image_url || "/images/placeholder-region.jpg"}
                                        alt={region.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Badge className="rounded-full bg-white/90 text-neutral-900">
                                            {recipesCount} {c.recipes}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full bg-white/90 text-neutral-900"
                                        >
                                            {subCount} {c.prefectures}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-6 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="text-xl font-bold leading-tight">
                                            {region.name}
                                        </h2>
                                        <ChevronRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {region.description || c.fallbackDesc}
                                    </p>

                                    <div className="pt-1 text-sm font-semibold text-primary">
                                        {c.more}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </section>
        </div>
    )
}
