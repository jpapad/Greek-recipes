import { getCities } from "@/lib/api";
import { CityForm } from "@/components/admin/CityForm";
import { notFound } from "next/navigation";
import { headers as nextHeaders, cookies as nextCookies } from 'next/headers';
import ClientCityLoader from '@/components/admin/ClientCityLoader';

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

export default async function EditCityPage({ params, searchParams }: { params: Record<string, any>, searchParams?: Record<string, any> }) {
    const cities = await getCities();
    // Prefer a valid `searchParams.id` when present. If the query `id` is a
    // valid UUID prefer it (override a potentially-bad route param). Otherwise
    // fall back to the route param or the raw query value.
    const idFromParams = extractIdFromParams(params || {});
    const idFromQuery = searchParams?.id ? String(searchParams.id) : undefined;
    let id = idFromParams;
    if (idFromQuery) {
        const m = idFromQuery.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
        if (m) {
            id = m[0];
        } else if (!id) {
            id = idFromQuery;
        }
    }

    // If still no id, try extracting it from Referer header's redirect param
    if (!id) {
        try {
            const _hdrs = await nextHeaders();
            const referer = _hdrs.get('referer') || _hdrs.get('referrer') || '';
            const m = referer.match(/[?&]redirect=([^&]+)/);
            if (m && m[1]) {
                const decoded = decodeURIComponent(m[1]);
                const uuidMatch = decoded.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
                if (uuidMatch) id = uuidMatch[0];
            }
        } catch (e) {
            // ignore
        }
    }
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
                <div className="p-4 bg-blue-50 border rounded mt-4">
                    <h3 className="font-semibold">Client-side fallback</h3>
                    <p className="text-sm text-muted-foreground mt-1">Client fallback will try to load the city from the browser URL if server params were empty.</p>
                    {/* Render client component for fallback */}
                    <ClientCityLoader />
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
