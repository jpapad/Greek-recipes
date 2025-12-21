// src/lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Helper to require environment variables at runtime
 * @throws Error if environment variable is missing
 */
function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

/**
 * Creates a Supabase client configured for server-side usage with Next.js 16+
 * Handles async cookies() API and proper cookie management
 */
export async function getSupabaseServerClient() {
    const cookieStore = await cookies();

    const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
    const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    return createServerClient(url, anon, {
        cookies: {
            getAll() {
                // Next 16: cookieStore is awaited, so getAll is available
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                // In Server Components, setting cookies may not be allowed.
                // Make this safe/conditional to avoid breaking the build.
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                } catch {
                    // Ignore cookie setting errors in read-only contexts
                }
            },
        },
    });
}
