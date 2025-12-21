import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAdminServer } from "@/lib/adminServerGuard";

export async function POST(request: NextRequest) {
    try {
        // Verify admin access
        const { user: currentUser } = await requireAdminServer();

        const { userId, isAdmin } = await request.json();

        if (!userId || typeof isAdmin !== "boolean") {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            );
        }

        // Prevent self-demotion
        if (userId === currentUser.id && !isAdmin) {
            return NextResponse.json(
                { error: "Cannot remove admin access from yourself" },
                { status: 403 }
            );
        }

        const supabase = await getSupabaseServerClient();

        const { error } = await supabase
            .from("profiles")
            .update({ is_admin: isAdmin })
            .eq("id", userId);

        if (error) {
            console.error("Update error:", error);
            return NextResponse.json(
                { error: "Failed to update user" },
                { status: 500 }
            );
        }

        // Log to audit table
        await supabase.from("admin_audit_log").insert({
            user_id: currentUser.id,
            action: "update",
            table_name: "profiles",
            record_id: userId,
            changes: {
                is_admin: isAdmin,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Toggle admin error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
