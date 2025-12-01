import { getRegionById } from "@/lib/api";
import { RegionForm } from "@/components/admin/RegionForm";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditRegionPage({ params }: PageProps) {
    const { id } = await params;
    const region = await getRegionById(id);

    if (!region) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2">Edit Region</h1>
                <p className="text-muted-foreground">Update {region.name}</p>
            </div>

            <RegionForm region={region} />
        </div>
    );
}
