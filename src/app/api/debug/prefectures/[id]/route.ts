import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getPrefectureById } from '@/lib/api';

export async function GET(request: NextRequest, context: any) {
    // Next's context.params can be either an object or a Promise depending on runtime/types.
    // Normalize to an object by awaiting if necessary.
    try {
        const paramsObj = await (context?.params ?? {});
        const id: string | undefined = paramsObj?.id;

        if (!id) {
            return NextResponse.json({ ok: false, error: 'Missing id param' }, { status: 400 });
        }

        const prefecture = await getPrefectureById(id);

        const { data: raw, error } = await supabase
            .from('prefectures')
            .select('*, region:region_id(*)')
            .eq('id', id);

        return NextResponse.json({ ok: true, prefecture, raw: raw || null, supabaseError: error || null });
    } catch (err) {
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}
