// src/lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServerClient() {
    const cookieStore = await cookies();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createServerClient(url, anon, {
        cookies: {
            getAll() {
                // Next 16: cookieStore is awaited, so getAll is available
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                // Σε Server Components μπορεί να μην επιτρέπεται set cookies.
                // Το κάνουμε safe/conditional για να μην σπάει το build.
                const setCookie = (cookieStore as any).set?.bind(cookieStore);

                if (!setCookie) return;

                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        setCookie(name, value, options);
                    });
                } catch {
                    // ignore
                }
            },
        },
    });
}
