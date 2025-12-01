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
        <Link href={`/regions/${slug}`}>
            <GlassPanel variant="card" hoverEffect className="h-full overflow-hidden group">
                <div className="relative w-full">
                    <AspectRatio ratio={16 / 9}>
                        <Image
                            src={image_url || "/placeholder-region.jpg"}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-2xl font-bold text-white drop-shadow-lg tracking-wide">{name}</h3>
                        </div>
                    </AspectRatio>
                </div>
                {description && (
                    <div className="p-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                    </div>
                )}
            </GlassPanel>
        </Link>
    );
}
