import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
    try {
        // regions + counts (recipes ανά region + prefectures ανά region)
        const { data: regions, error } = await supabase
            .from("regions")
            .select("id,name,slug,description,image_url");

        if (error) throw error;

        // recipes count per region
        const { data: recipeCounts, error: recipeErr } = await supabase
            .from("recipes")
            .select("region_id", { count: "exact", head: false });

        if (recipeErr) throw recipeErr;

        // prefectures count per region
        const { data: prefData, error: prefErr } = await supabase
            .from("prefectures")
            .select("region_id");

        if (prefErr) throw prefErr;

        const prefCountMap = new Map<string, number>();
        for (const row of prefData || []) {
            prefCountMap.set(row.region_id, (prefCountMap.get(row.region_id) || 0) + 1);
        }

        // ⚠️ για recipes count, το παραπάνω select δεν μας δίνει group counts.
        // πιο απλά: κάνουμε δεύτερο query με group μέσω RPC ή κάνουμε fetch all region_id
        // εδώ πάμε straightforward:
        const { data: recipeIds, error: r2err } = await supabase
            .from("recipes")
            .select("region_id");

        if (r2err) throw r2err;

        const recipeCountMap = new Map<string, number>();
        for (const row of recipeIds || []) {
            recipeCountMap.set(row.region_id, (recipeCountMap.get(row.region_id) || 0) + 1);
        }

        const result = (regions || []).map((r) => ({
            ...r,
            recipes_count: recipeCountMap.get(r.id) || 0,
            subregions_count: prefCountMap.get(r.id) || 0,
        }));

        // sort by recipes desc
        result.sort((a, b) => (b.recipes_count ?? 0) - (a.recipes_count ?? 0));

        return NextResponse.json(result);
    } catch (e) {
        console.error("regions/summary error", e);
        return NextResponse.json({ error: "Failed to fetch region summary" }, { status: 500 });
    }
}
