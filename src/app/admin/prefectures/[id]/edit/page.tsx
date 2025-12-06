import { getPrefectureById } from "@/lib/api";
import { PrefectureForm } from "@/components/admin/PrefectureForm";
import { notFound } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default async function EditPrefecturePage({ params }: { params: { id: string } }) {
    const id = params?.id;

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

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">Prefecture Not Found</h1>
            <p className="text-muted-foreground">No prefecture could be fetched for id <code>{String(id)}</code>.</p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <h3 className="font-semibold">Route Params (raw)</h3>
                <pre className="mt-2 text-xs p-3 bg-white rounded overflow-auto">{JSON.stringify(params, null, 2)}</pre>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h2 className="font-semibold">Diagnostic</h2>
                <p className="text-sm text-muted-foreground mt-2">The page attempted to fetch the prefecture via server-side Supabase. Below is the raw response from Supabase (for debugging only).</p>
                <pre className="mt-3 overflow-auto text-xs bg-white p-3 rounded">
{JSON.stringify({ raw: raw || null, supabaseError: error || null }, null, 2)}
                </pre>
            </div>
            <div>
                <p className="text-sm">If you see a permission error here, ensure RLS policies were applied to the target Supabase project and that Vercel env vars point to the same project.</p>
            </div>
        </div>
    );
}
