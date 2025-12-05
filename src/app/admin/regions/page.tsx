import { getRegions } from "@/lib/api";
import RegionsListClient from "@/components/admin/RegionsListClient";

export default async function AdminRegionsPage() {
    const regions = await getRegions();

    return <RegionsListClient initialRegions={regions} />;
}
