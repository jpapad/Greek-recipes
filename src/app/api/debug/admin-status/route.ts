import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET() {
    const supabase = await getSupabaseServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({
            error: 'Not authenticated',
            authError: authError?.message
        }, { status: 401 });
    }

    // Check profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return NextResponse.json({
        user: {
            id: user.id,
            email: user.email,
            app_metadata: user.app_metadata,
            user_metadata: user.user_metadata,
        },
        profile: profile || null,
        profileError: profileError?.message || null,
        checks: {
            hasProfile: !!profile,
            profileIsAdmin: profile?.is_admin === true,
            appMetadataRole: user.app_metadata?.role,
            appMetadataIsAdmin: user.app_metadata?.is_admin,
            userMetadataIsAdmin: user.user_metadata?.is_admin,
        }
    });
}
