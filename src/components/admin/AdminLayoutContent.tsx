"use client";

import { AdminTopbar } from "@/components/admin/AdminTopbar";
import type { User } from "@supabase/supabase-js";

interface AdminLayoutContentProps {
    user: User;
    children: React.ReactNode;
}

export function AdminLayoutContent({ user, children }: AdminLayoutContentProps) {
    return (
        <div className="min-h-screen">
            {/* Top Navigation */}
            <AdminTopbar user={user} />

            {/* Page Content */}
            <main className="pt-16 min-h-screen bg-muted/10">
                <div className="container mx-auto p-6 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
