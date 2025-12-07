import { getPrefectureById } from "@/lib/api";
import { PrefectureForm } from "@/components/admin/PrefectureForm";
 
import { supabase } from '@/lib/supabaseClient';
import { headers as nextHeaders, cookies as nextCookies } from 'next/headers';

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

    // If route params didn't provide an id, attempt query fallback
    if (!id && searchParams?.id) {
        id = String(searchParams.id);
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

    // If we get here, the prefecture wasn't returned. Surface Supabase diagnostic info
    // and the raw `params` object so we can see what Next provided for debugging.
    const { data: raw, error } = await supabase
        .from('prefectures')
        .select('*, region:region_id(*)')
        .eq('id', id);

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
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h2 className="font-semibold">Diagnostic</h2>
                <p className="text-sm text-muted-foreground mt-2">The page attempted to fetch the prefecture via server-side Supabase. Below is the raw response from Supabase (for debugging only).</p>
                <pre className="mt-3 overflow-auto text-xs bg-white p-3 rounded">
{JSON.stringify({ raw: raw || null, supabaseError: error || null, serverHeaders, serverCookieNames }, null, 2)}
                </pre>
            </div>
            <div>
                <p className="text-sm">If you see a permission error here, ensure RLS policies were applied to the target Supabase project and that Vercel env vars point to the same project.</p>
            </div>
        </div>
    );
}
