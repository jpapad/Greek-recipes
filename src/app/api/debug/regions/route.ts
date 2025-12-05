import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getRegions } from '@/lib/api';

export async function GET() {
    try {
        const regions = await getRegions();

        // Also fetch a count directly to be explicit
        const { data: rows, error } = await supabase
            .from('regions')
            .select('id');

        const count = error ? null : (rows || []).length;

        return NextResponse.json({ ok: true, regions, count });
    } catch (err) {
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}
