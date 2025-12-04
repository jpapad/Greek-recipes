"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UtensilsCrossed, MapPin, Building2, Home, Text, Layout, FileText, Users, FolderOpen, Sparkles, Settings, FileCode, Menu as MenuIcon, X } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const user = await getUser();
            
            if (!user) {
                router.push('/login?redirect=/admin');
                return;
            }

            const isAdmin = user.user_metadata?.is_admin === true;
            
            if (!isAdmin) {
                router.push('/?error=unauthorized');
                return;
            }

            setIsAuthorized(true);
            setIsLoading(false);
        }

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <GlassPanel className="p-12 flex flex-col items-center gap-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground text-lg">Verifying access...</p>
                </GlassPanel>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row pt-16 lg:pt-24">
            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="sm"
                className="fixed top-20 left-4 z-50 lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-16 lg:top-24 bottom-0 left-0 
                w-64 bg-background border-r border-border/50 
                p-4 sm:p-6 space-y-4 overflow-y-auto z-50
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="mb-6 lg:mb-8">
                    <Link href="/" className="text-xl sm:text-2xl font-bold text-primary">
                        Greek<span className="text-foreground">Recipes</span>
                    </Link>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Admin Panel</p>
                </div>

                <nav className="space-y-2">
                    <Link href="/admin" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Dashboard</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/recipes" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Recipes</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/articles" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Articles</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/categories" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Categories</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/collections" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Collections</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/authors" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Authors</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/regions" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Regions</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/prefectures" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Prefectures</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/cities" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Cities</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/footer" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <Text className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Footer Settings</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/home-sections" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Home Sections</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/site-settings" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-2 border-orange-500/20">
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Site Settings</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/pages" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
                            <FileCode className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Pages</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/menu" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/20">
                            <MenuIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Menu</span>
                        </GlassPanel>
                    </Link>

                    <Link href="/admin/homepage" onClick={() => setSidebarOpen(false)}>
                        <GlassPanel className="p-3 hover:bg-white/60 transition-colors cursor-pointer flex items-center gap-3">
                            <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">Homepage Settings</span>
                        </GlassPanel>
                    </Link>
                </nav>

                <div className="pt-6 border-t border-border/50">
                    <Link href="/" onClick={() => setSidebarOpen(false)} className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 w-full">
                {children}
            </main>
        </div>
    );
}
