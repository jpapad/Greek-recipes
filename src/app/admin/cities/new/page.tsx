import { CityForm } from "@/components/admin/CityForm";

export default function NewCityPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Create New City</h1>
                <p className="text-muted-foreground mt-1">Add a new Greek city or village (πόλη/χωριό)</p>
            </div>
            <CityForm />
        </div>
    );
}
