import { getRegions } from "@/lib/api";
import RegionsListClient from "@/components/admin/RegionsListClient";

// Ensure the admin regions page is always rendered dynamically so the server
// fetches fresh data on each request (prevents stale cached renders).
export const dynamic = 'force-dynamic';

export default async function AdminRegionsPage() {
    const regions = await getRegions();

    return <RegionsListClient initialRegions={regions} />;
}
