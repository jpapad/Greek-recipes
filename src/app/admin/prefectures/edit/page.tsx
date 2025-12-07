import { getPrefectureById } from "@/lib/api";
import { PrefectureForm } from "@/components/admin/PrefectureForm";
import ClientPrefectureLoader from '@/components/admin/ClientPrefectureLoader';
import { headers as nextHeaders, cookies as nextCookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function EditPrefectureByQueryPage({ searchParams }: { searchParams?: Record<string, any> }) {
    let id: string | undefined = undefined;
    if (searchParams?.id) {
        const sp = String(searchParams.id);
        const m = sp.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
        if (m) id = m[0];
        else id = sp;
    }

    // If searchParams didn't provide an id (some server requests / edge
    // proxy flows strip query params), try extracting the id from the
    // Referer header. This covers flows where middleware redirected to
    // /login and the browser redirected back, or when the client navigated
    // from the list page with the id in the referer URL.
    if (!id) {
        try {
            const _hdrs = await nextHeaders();
            const referer = _hdrs.get('referer') || _hdrs.get('referrer') || '';
            if (referer) {
                // Attempt to find ?id= in the referer first
                const mQ = referer.match(/[?&]id=([^&]+)/);
                if (mQ && mQ[1]) {
                    const dec = decodeURIComponent(mQ[1]);
                    const uuidMatch = dec.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
                    if (uuidMatch) id = uuidMatch[0];
                    else id = dec;
                } else {
                    // Otherwise, try to extract a UUID from the referer path
                    const uuidMatch = referer.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
                    if (uuidMatch) id = uuidMatch[0];
                }
            }
        } catch (e) {
            // ignore parse errors
        }
    }

    // Normalize common literal garbage values
    if (typeof id === 'string') {
        id = decodeURIComponent(id).trim();
        if (id === 'undefined' || id === 'null' || id === '') id = undefined;
    }

    const cookiesForAuth = await nextCookies();
    const serverCookieNamesAuth = cookiesForAuth.getAll().map((c) => c.name || '');
    const hasAuthCookie = serverCookieNamesAuth.some((n) => n.startsWith('sb-'));

    if (!hasAuthCookie) {
        return (
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Edit Prefecture</h1>
                <p className="text-muted-foreground">Loading in browser — please sign in if prompted.</p>
                <ClientPrefectureLoader fallbackId={id} />
            </div>
        );
    }

    const prefecture = id ? await getPrefectureById(id) : null;

    if (prefecture) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Edit Prefecture</h1>
                    <p className="text-muted-foreground mt-1">Update {prefecture.name}</p>
                </div>
                <PrefectureForm prefecture={prefecture} />
            </div>
        );
    }

    const _hdrs = await nextHeaders();
    const serverHeaders = Object.fromEntries(_hdrs.entries());
    const _cookies = await nextCookies();
    const serverCookieNames = _cookies.getAll().map((c) => c.name);

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">Prefecture Not Found</h1>
            <p className="text-muted-foreground">No prefecture could be fetched for id <code>{String(id)}</code>.</p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <h3 className="font-semibold">Search Params (raw)</h3>
                <p className="text-xs mt-1">Search param keys: {JSON.stringify(Object.keys(searchParams || {}))}</p>
                <pre className="mt-2 text-xs p-3 bg-white rounded overflow-auto">{JSON.stringify(searchParams || null, null, 2)}</pre>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h2 className="font-semibold">Diagnostic</h2>
                <p className="text-sm text-muted-foreground mt-2">The page attempted to fetch the prefecture via server-side Supabase. Below is the raw response from Supabase (for debugging only).</p>
                <pre className="mt-3 overflow-auto text-xs bg-white p-3 rounded">
{JSON.stringify({ raw: null, supabaseError: { message: 'not found or missing id' }, serverHeaders, serverCookieNames }, null, 2)}
                </pre>
            </div>
            <div className="p-4 bg-blue-50 border rounded">
                <h3 className="font-semibold">Client-side fallback</h3>
                <p className="text-sm text-muted-foreground mt-1">If server params were empty, the client fallback will try to load the prefecture from the browser URL.</p>
                <ClientPrefectureLoader fallbackId={id} />
            </div>
        </div>
    );
}
