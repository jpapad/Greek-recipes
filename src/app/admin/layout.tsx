import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { LayoutDashboard, UtensilsCrossed, MapPin } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border/50 p-6 space-y-4">
                <div className="mb-8">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        Greek<span className="text-foreground">Recipes</span>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
                </div>

                <nav className="space-y-2">
                    <Link href="/admin">
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <LayoutDashboard className="w-5 h-5 text-primary" />
                            <span className="font-medium">Dashboard</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/recipes">
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <UtensilsCrossed className="w-5 h-5 text-primary" />
                            <span className="font-medium">Recipes</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/regions">
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span className="font-medium">Regions</span>
                        </GlassPanel>
                    </Link>
                </nav>

                <div className="pt-6 border-t border-border/50">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
