import { requireAdminServer } from "@/lib/adminServerGuard";
import { AdminI18nProvider } from "@/context/AdminI18nContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Toaster } from "@/components/ui/toaster";
import { AdminLayoutContent } from "@/components/admin/AdminLayoutContent";

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
            <AdminLayoutContent user={user}>
                {children}
            </AdminLayoutContent>
            <Toaster />
        </AdminI18nProvider>
    );
}
