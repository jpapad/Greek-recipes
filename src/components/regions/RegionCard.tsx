import Link from "next/link";
import Image from "next/image";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface RegionCardProps {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
    description?: string;
}

export function RegionCard({ name, slug, image_url, description }: RegionCardProps) {
    return (
        <Link href={`/regions/${slug}`} className="block h-full">
            <GlassPanel variant="card" hoverEffect className="h-full overflow-hidden group relative">
                <div className="relative w-full">
                    <AspectRatio ratio={16 / 9}>
                        <Image
                            src={image_url || "/placeholder-region.jpg"}
                            alt={name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        />
                        {/* Gradient overlays */}\n                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-2xl tracking-wide mb-2 transform transition-all duration-300 group-hover:scale-110 group-hover:mb-3">{name}</h3>
                            {description && (
                                <p className="text-sm text-white/90 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 transform translate-y-4 group-hover:translate-y-0 max-w-xs">{description}</p>
                            )}
                        </div>
                        
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </AspectRatio>
                </div>
            </GlassPanel>
        </Link>
    );
}
