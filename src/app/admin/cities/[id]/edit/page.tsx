import { getCities } from "@/lib/api";
import { CityForm } from "@/components/admin/CityForm";
import { notFound } from "next/navigation";

export default async function EditCityPage({ params }: { params: { id: string } }) {
    const cities = await getCities();
    const city = cities.find((c) => c.id === params.id);

    if (!city) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Edit City</h1>
                <p className="text-muted-foreground mt-1">Update {city.name}</p>
            </div>
            <CityForm city={city} />
        </div>
    );
}
