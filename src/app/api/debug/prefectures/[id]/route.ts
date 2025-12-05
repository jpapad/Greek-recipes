import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getPrefectureById } from '@/lib/api';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
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
