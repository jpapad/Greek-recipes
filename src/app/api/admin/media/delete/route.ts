import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAdminServer } from "@/lib/adminServerGuard";

export async function DELETE(request: NextRequest) {
    try {
        // Verify admin access
        await requireAdminServer();

        const { name, bucket = "media" } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "File name is required" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseServerClient();

        const { error } = await supabase.storage.from(bucket).remove([name]);

        if (error) {
            console.error("Delete error:", error);
            return NextResponse.json(
                { error: "Failed to delete file" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
