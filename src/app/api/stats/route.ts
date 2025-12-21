import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
    try {
        const [{ count: recipesCount }, { count: regionsCount }, { count: prefecturesCount }] =
            await Promise.all([
                supabase.from("recipes").select("*", { count: "exact", head: true }),
                supabase.from("regions").select("*", { count: "exact", head: true }),
                supabase.from("prefectures").select("*", { count: "exact", head: true }),
            ]).then((res) => res.map((r) => r.data === null ? r : r)); // no-op, just keeps shape

        return NextResponse.json({
            recipes: recipesCount ?? 0,
            regions: regionsCount ?? 0,
            prefectures: prefecturesCount ?? 0,
        });
    } catch (e) {
        console.error("stats error:", e);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
