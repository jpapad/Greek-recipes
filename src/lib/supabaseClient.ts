// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ⚠️ IMPORTANT: σε Client Components πρέπει να είναι ΣΤΑΤΙΚΗ η πρόσβαση
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function assertEnv() {
    if (!SUPABASE_URL) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
    if (!SUPABASE_ANON_KEY) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
    if (_client) return _client;
    assertEnv();
    _client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    return _client;
}

// Για να μην αλλάξεις όλο το project (supabase.from(...))
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const client = getClient();
        const value = (client as any)[prop];
        return typeof value === "function" ? value.bind(client) : value;
    },
});
