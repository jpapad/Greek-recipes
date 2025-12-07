import { getPrefectureById } from "@/lib/api";
import { PrefectureForm } from "@/components/admin/PrefectureForm";
 
import { supabase } from '@/lib/supabaseClient';
import { headers as nextHeaders, cookies as nextCookies } from 'next/headers';
import ClientPrefectureLoader from '@/components/admin/ClientPrefectureLoader';

export const dynamic = 'force-dynamic';

export default async function EditPrefecturePage({ params, searchParams }: { params: Record<string, any>, searchParams?: Record<string, any> }) {
    // Defensive: Next's internal named capture groups can sometimes use a different
    // key name (e.g. `nxtPid`) in the compiled route. Accept common fallbacks
    // and be tolerant of encoded values, full URLs, or accidental literal
    // strings like "undefined". Extract a UUID if present. Prefer route
    // params, but fall back to `searchParams.id` which we now include on links.
    let id: string | undefined = params?.id ?? params?.nxtPid ?? Object.values(params || {})[0];

    if (typeof id === 'string') {
        id = decodeURIComponent(id).trim();
        if (id === 'undefined' || id === 'null' || id === '') {
            id = undefined;
        } else {
            const uuidMatch = id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
            if (uuidMatch) id = uuidMatch[0];
        }
    }

    // Prefer a valid `searchParams.id` when present. In some preview/redirect
    // flows the route `params` can be present but contain an invalid value
    // (e.g. 'undefined' or a full URL). If the query `id` is a valid UUID,
    // prefer it (override bad route params). Otherwise fall back to the
    // existing behavior.
    if (searchParams?.id) {
        const sp = String(searchParams.id);
        const spUuid = sp.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
        if (spUuid) {
            id = spUuid[0];
        } else if (!id) {
            id = sp;
        }
    }

    // If still no id, try extracting it from Referer header's redirect param
    // This covers the case where middleware redirected to /login and the
    // login page redirected back using ?redirect=/admin/prefectures/:id/edit
    if (!id) {
        const _hdrs = await nextHeaders();
        const referer = _hdrs.get('referer') || _hdrs.get('referrer') || '';
        try {
            const m = referer.match(/[?&]redirect=([^&]+)/);
            if (m && m[1]) {
                const decoded = decodeURIComponent(m[1]);
                const uuidMatch = decoded.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
                if (uuidMatch) id = uuidMatch[0];
            }
        } catch (e) {
            // ignore parse errors
        }
    }

    // If the server request does not include an auth cookie, avoid attempting
    // a server-side fetch — render the client loader so the browser (with the
    // user's cookies) can fetch and render the prefecture. This avoids showing
    // the login/diagnostic HTML when the preview edge or server is unauthenticated.
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

    // If we get here, the prefecture wasn't returned. Only attempt a direct
    // Supabase server query when `id` looks like a UUID — otherwise skip the
    // query to avoid errors like `invalid input syntax for type uuid: "undefined"`.
    let raw = null as any;
    let error: any = null;
    const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    if (id && uuidRegex.test(String(id))) {
        const res = await supabase
            .from('prefectures')
            .select('*, region:region_id(*)')
            .eq('id', id);
        raw = res.data || null;
        error = res.error || null;
    } else {
        // Do not call Supabase with an invalid id. Surface a small diagnostic
        // marker instead of the database error.
        raw = null;
        error = { message: 'skipped server fetch: missing or invalid id' };
    }

    // Collect server-side view of headers and cookie names (do not dump cookie values)
    const _hdrs = await nextHeaders();
    const serverHeaders = Object.fromEntries(_hdrs.entries());
    const _cookies = await nextCookies();
    const serverCookieNames = _cookies.getAll().map((c) => c.name);

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">Prefecture Not Found</h1>
            <p className="text-muted-foreground">No prefecture could be fetched for id <code>{String(id)}</code>.</p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <h3 className="font-semibold">Route Params (raw)</h3>
                <p className="text-xs mt-1">Param keys: {JSON.stringify(Object.keys(params || {}))}</p>
                <pre className="mt-2 text-xs p-3 bg-white rounded overflow-auto">{JSON.stringify(params, null, 2)}</pre>
                <h3 className="font-semibold mt-3">Search Params (raw)</h3>
                <p className="text-xs mt-1">Search param keys: {JSON.stringify(Object.keys(searchParams || {}))}</p>
                <pre className="mt-2 text-xs p-3 bg-white rounded overflow-auto">{JSON.stringify(searchParams || null, null, 2)}</pre>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h2 className="font-semibold">Diagnostic</h2>
                <p className="text-sm text-muted-foreground mt-2">The page attempted to fetch the prefecture via server-side Supabase. Below is the raw response from Supabase (for debugging only).</p>
                <pre className="mt-3 overflow-auto text-xs bg-white p-3 rounded">
{JSON.stringify({ raw: raw || null, supabaseError: error || null, serverHeaders, serverCookieNames }, null, 2)}
                </pre>
            </div>
            <div className="p-4 bg-blue-50 border rounded">
                <h3 className="font-semibold">Client-side fallback</h3>
                <p className="text-sm text-muted-foreground mt-1">If server params were empty, the client fallback will try to load the prefecture from the browser URL.</p>
                <ClientPrefectureLoader fallbackId={id} />
            </div>
            <div>
                <p className="text-sm">If you see a permission error here, ensure RLS policies were applied to the target Supabase project and that Vercel env vars point to the same project.</p>
            </div>
        </div>
    );
}
