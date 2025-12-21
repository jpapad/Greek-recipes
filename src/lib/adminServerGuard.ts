import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

/**
 * Server-side admin guard
 * Checks authentication and admin status from profiles table
 */
export async function requireAdminServer() {
    const supabase = await getSupabaseServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/login?redirect=/admin&reason=auth_required');
    }

    // Check admin status from profiles table
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, email')
        .eq('id', user.id)
        .single();

    if (profileError || !profile?.is_admin) {
        redirect('/?error=unauthorized');
    }

    return { user, profile };
}
