import Link from "next/link"
import { notFound } from "next/navigation"
import { getRegionBySlug, getPrefectures, getRecipes } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ChevronRight } from "lucide-react"

export default async function RegionDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const { locale, slug } = await params

    const region = await getRegionBySlug(slug)
    if (!region) return notFound()

    const [prefectures, recipes] = await Promise.all([getPrefectures(region.id), getRecipes({ regionId: region.id })])

    return (
        <div className="space-y-10">
            <header className="space-y-4">
                <Link
                    href={`/${locale}/regions`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    {locale === "el" ? "Πίσω στις Περιφέρειες" : "Back to Regions"}
                </Link>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{region.name}</h1>
                        <p className="text-muted-foreground text-lg max-w-3xl">
                            {region.description ||
                                (locale === "el"
                                    ? "Ανακάλυψε συνταγές, νομούς και πόλεις/χωριά της περιοχής."
                                    : "Discover recipes, prefectures and cities/villages of this region.")}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Badge className="rounded-full">{recipes.length} {locale === "el" ? "συνταγές" : "recipes"}</Badge>
                        <Badge variant="secondary" className="rounded-full">
                            {prefectures.length} {locale === "el" ? "νομοί" : "prefectures"}
                        </Badge>
                    </div>
                </div>

                <Card className="overflow-hidden rounded-3xl">
                    <div className="relative h-56 md:h-72 w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={region.image_url || "/images/placeholder-region.jpg"}
                            alt={region.name}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                    </div>
                </Card>
            </header>

            {/* Prefectures list */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">{locale === "el" ? "Νομοί" : "Prefectures"}</h2>

                {prefectures.length === 0 ? (
                    <p className="text-muted-foreground">
                        {locale === "el" ? "Δεν υπάρχουν ακόμη νομοί για αυτή την περιφέρεια." : "No prefectures yet for this region."}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {prefectures.map((p) => (
                            <Card key={p.id} className="rounded-2xl">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="font-semibold">{p.name}</div>
                                    <ChevronRight className="size-5 text-muted-foreground" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Recipes list (simple) */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">{locale === "el" ? "Συνταγές" : "Recipes"}</h2>

                {recipes.length === 0 ? (
                    <p className="text-muted-foreground">
                        {locale === "el" ? "Δεν υπάρχουν ακόμη συνταγές για αυτή την περιφέρεια." : "No recipes yet for this region."}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recipes.slice(0, 12).map((r) => (
                            <Link key={r.id} href={`/${locale}/recipes/${r.slug}`} className="group">
                                <Card className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <div className="relative h-36 w-full bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={r.image_url || "/images/placeholder-recipe.jpg"}
                                            alt={r.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="font-bold line-clamp-2">{r.title}</div>
                                        <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{r.category || ""}</div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
