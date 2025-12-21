import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function requireAdmin(locale: string) {
    const supabase = await getSupabaseServerClient();

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) redirect(`/${locale}/auth/login`);

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (error || !profile?.is_admin) redirect(`/${locale}`);

    return { user };
}
