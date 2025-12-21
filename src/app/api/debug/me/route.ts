import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

/**
 * Debug endpoint to verify server-side authentication and admin status
 * Usage: GET /api/debug/me
 * 
 * Returns:
 * - User authentication data from Supabase
 * - Profile data including is_admin flag
 * - Helpful debugging information
 */
export async function GET() {
    try {
        const supabase = await getSupabaseServerClient();

        // 1. Get authenticated user
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
            return NextResponse.json({
                success: false,
                error: 'Auth error',
                details: authError.message,
                user: null,
                profile: null,
            }, { status: 401 });
        }

        const user = authData?.user;

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'No user found',
                message: 'Not authenticated. Please login first.',
                user: null,
                profile: null,
            }, { status: 401 });
        }

        // 2. Get profile with is_admin flag
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, is_admin, created_at, updated_at')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return NextResponse.json({
                success: false,
                error: 'Profile query error',
                details: profileError.message,
                user: {
                    id: user.id,
                    email: user.email,
                    user_metadata: user.user_metadata,
                    app_metadata: user.app_metadata,
                },
                profile: null,
            }, { status: 500 });
        }

        // 3. Success response
        return NextResponse.json({
            success: true,
            message: 'Authentication verified successfully',
            user: {
                id: user.id,
                email: user.email,
                user_metadata: user.user_metadata,
                app_metadata: user.app_metadata,
                created_at: user.created_at,
            },
            profile: {
                id: profile?.id,
                email: profile?.email,
                is_admin: profile?.is_admin,
                created_at: profile?.created_at,
                updated_at: profile?.updated_at,
            },
            debug: {
                timestamp: new Date().toISOString(),
                is_admin_from_profile: profile?.is_admin === true,
                is_admin_from_user_metadata: user.user_metadata?.is_admin === true,
                is_admin_from_app_metadata: user.app_metadata?.is_admin === true || user.app_metadata?.role === 'admin',
            }
        });

    } catch (error) {
        console.error('Debug endpoint error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
            user: null,
            profile: null,
        }, { status: 500 });
    }
}
