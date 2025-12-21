import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

/**
 * Server-side admin guard for protected pages
 * Verifies authentication and admin status from profiles table
 * 
 * @param locale - Current locale (e.g., 'en', 'el')
 * @returns User object if authorized
 * @throws Redirects to login if not authenticated or not admin
 */
export async function requireAdmin(locale: string) {
    const supabase = await getSupabaseServerClient();

    // 1. Check authentication
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData?.user;

    if (authError || !user) {
        // Redirect to login with return URL
        redirect(`/${locale}/auth/login?next=/${locale}/admin&reason=auth_required`);
    }

    // 2. Check admin status from profiles table
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (profileError) {
        console.error('Admin guard - profile query error:', profileError);
        redirect(`/${locale}/auth/login?next=/${locale}/admin&reason=profile_error`);
    }

    if (!profile?.is_admin) {
        // User exists but is not admin
        redirect(`/${locale}/auth/login?next=/${locale}/admin&reason=admin_required`);
    }

    return { user };
}
