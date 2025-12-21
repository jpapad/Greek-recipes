import { requireAdminServer } from "@/lib/adminServerGuard";
import { AdminI18nProvider } from "@/context/AdminI18nContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
    title: "Admin Dashboard | Greek Recipes",
    description: "Admin panel for managing Greek recipes content",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side auth check
    const { user } = await requireAdminServer();

    return (
        <AdminI18nProvider>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-hidden ml-64">
                    {/* Topbar */}
                    <AdminTopbar user={user} />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
                        {children}
                    </main>
                </div>
            </div>

            {/* Toast Notifications */}
            <Toaster />
        </AdminI18nProvider>
    );
}
