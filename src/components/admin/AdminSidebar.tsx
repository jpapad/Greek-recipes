"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    UtensilsCrossed,
    MapPin,
    Building2,
    Home,
    Image as ImageIcon,
    Settings,
    Users,
    FileText,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useAdminI18n } from "@/context/AdminI18nContext";
import { useState } from "react";

interface NavItem {
    href: string;
    icon: React.ElementType;
    labelKey: string;
}

const navItems: NavItem[] = [
    { href: "/admin", icon: LayoutDashboard, labelKey: "sidebar.dashboard" },
    { href: "/admin/recipes", icon: UtensilsCrossed, labelKey: "sidebar.recipes" },
    { href: "/admin/regions", icon: MapPin, labelKey: "sidebar.regions" },
    { href: "/admin/prefectures", icon: Building2, labelKey: "sidebar.prefectures" },
    { href: "/admin/cities", icon: Home, labelKey: "sidebar.cities" },
    { href: "/admin/media", icon: ImageIcon, labelKey: "sidebar.media" },
    { href: "/admin/settings", icon: Settings, labelKey: "sidebar.settings" },
    { href: "/admin/users", icon: Users, labelKey: "sidebar.users" },
    { href: "/admin/audit", icon: FileText, labelKey: "sidebar.audit" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { t } = useAdminI18n();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b px-4">
                {!collapsed && (
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">ΕΣΠ</span>
                        <span className="text-sm text-muted-foreground">Admin</span>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn("h-8 w-8", collapsed && "mx-auto")}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 p-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3",
                                    collapsed && "justify-center px-0"
                                )}
                                title={collapsed ? t(item.labelKey) : undefined}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && (
                                    <span className="truncate">{t(item.labelKey)}</span>
                                )}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="absolute bottom-0 left-0 right-0 border-t p-4">
                    <Link href="/">
                        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                            <ChevronLeft className="h-4 w-4" />
                            {t("topbar.backToSite")}
                        </Button>
                    </Link>
                </div>
            )}
        </aside>
    );
}
