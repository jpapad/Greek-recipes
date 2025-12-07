import { getCities } from "@/lib/api";
import { CityForm } from "@/components/admin/CityForm";
import { notFound } from "next/navigation";
import { headers as nextHeaders, cookies as nextCookies } from 'next/headers';

function extractIdFromParams(params: Record<string, any>) {
    // Accept multiple param names used by routes or frameworks, decode, and
    // extract a UUID-like segment if present to be robust against preview URL
    // rewrites and encoded segments.
    const raw = params?.id || params?.cityId || params?.params || "";
    try {
        const dec = decodeURIComponent(String(raw || ""));
        // find first UUID in the string
        const match = dec.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
        if (match) return match[0];
        return dec;
    } catch (e) {
        return String(raw || "");
    }
}

export default async function EditCityPage({ params }: { params: Record<string, any> }) {
    const cities = await getCities();
    const id = extractIdFromParams(params || {});
    const city = cities.find((c) => c.id === id || c.slug === id || c.id === decodeURIComponent(String(id || "")));

    if (!city) {
        // Render diagnostics instead of throwing immediately so preview shows
        // useful information to debug param mismatches, auth, or stale SW caches.
        const _hdrs = await nextHeaders();
        const serverHeaders = Object.fromEntries(_hdrs.entries());
        const _cookies = await nextCookies();
        const serverCookieNames = _cookies.getAll().map((c) => c.name);
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">City Not Found</h1>
                    <p className="text-muted-foreground mt-1">Could not find a city matching the provided id.</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded">
                    <pre className="text-sm whitespace-pre-wrap">{JSON.stringify({ params, extractedId: id, serverHeaders, serverCookieNames }, null, 2)}</pre>
                </div>
                <div className="p-4 bg-gray-50 border rounded">
                    <h2 className="font-medium">Available city ids (first 20)</h2>
                    <pre className="text-sm mt-2">{JSON.stringify(cities.slice(0, 20).map((c) => ({ id: c.id, slug: c.slug, name: c.name })), null, 2)}</pre>
                </div>
            </div>
        );
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
