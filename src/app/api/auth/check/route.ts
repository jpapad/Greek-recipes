import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    
    // Get all Supabase cookies
    const allCookies = cookieStore.getAll();
    const supabaseCookies = allCookies.filter(c => 
        c.name.includes('supabase') || c.name.includes('sb-')
    );
    
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
    const { data: { session } } = await supabase.auth.getSession();

    // Check admin status multiple ways
    const isAdminBoolean = user?.user_metadata?.is_admin === true;
    const isAdminString = user?.user_metadata?.is_admin === 'true';
    const isAdminAny = isAdminBoolean || isAdminString;

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        user: user ? {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
            raw_metadata: JSON.stringify(user.user_metadata),
        } : null,
        session: session ? {
            expires_at: session.expires_at,
            user_metadata: session.user?.user_metadata,
        } : null,
        admin_checks: {
            is_admin_value: user?.user_metadata?.is_admin,
            is_admin_type: typeof user?.user_metadata?.is_admin,
            is_admin_boolean_check: isAdminBoolean,
            is_admin_string_check: isAdminString,
            is_admin_final: isAdminAny,
            would_allow_admin: isAdminAny ? 'YES ✅' : 'NO ❌',
        },
        cookies: {
            count: supabaseCookies.length,
            names: supabaseCookies.map(c => c.name),
        },
        error: error?.message,
    }, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
    });
}
