import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set() {},
                remove() {},
            },
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    return NextResponse.json({
        user: user ? {
            email: user.email,
            user_metadata: user.user_metadata,
            is_admin: user.user_metadata?.is_admin,
        } : null,
        error: error?.message,
    });
}
