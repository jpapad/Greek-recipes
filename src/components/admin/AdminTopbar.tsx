"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { useAdminI18n } from "@/context/AdminI18nContext";
import { signOut } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./NotificationBell";

const navItems = [
    { href: "/admin", label: "Αρχική" },
    { 
        label: "Περιεχόμενο",
        submenu: [
            { href: "/admin/recipes", label: "Συνταγές" },
            { href: "/admin/articles", label: "Άρθρα" },
            { href: "/admin/collections", label: "Συλλογές" },
            { href: "/admin/categories", label: "Κατηγορίες" },
            { href: "/admin/pages", label: "Σελίδες" },
        ]
    },
    { 
        label: "Τοποθεσίες",
        submenu: [
            { href: "/admin/regions", label: "Περιοχές" },
            { href: "/admin/prefectures", label: "Νομοί" },
            { href: "/admin/cities", label: "Πόλεις" },
        ]
    },
    {
        label: "Ingredients & Tags",
        submenu: [
            { href: "/admin/ingredients", label: "Ingredients Library" },
            { href: "/admin/dietary-tags", label: "Dietary Tags" },
        ]
    },
    {
        label: "Moderation",
        submenu: [
            { href: "/admin/activity", label: "Activity Timeline" },
            { href: "/admin/comments", label: "Comments" },
        ]
    },
    { 
        label: "Ρυθμίσεις",
        submenu: [
            { href: "/admin/site-settings", label: "Site Settings" },
            { href: "/admin/homepage", label: "Αρχική Σελίδα" },
            { href: "/admin/menu", label: "Μενού" },
            { href: "/admin/footer", label: "Footer" },
            { href: "/admin/home-sections", label: "Sections" },
            { href: "/admin/seo", label: "SEO Tools" },
        ]
    },
    { href: "/admin/media", label: "Μέσα" },
    { href: "/admin/users", label: "Χρήστες" },
    { href: "/admin/authors", label: "Συγγραφείς" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/import", label: "Import" },
    { href: "/admin/audit", label: "Έλεγχος" },
];

interface AdminTopbarProps {
    user: {
        email?: string;
        user_metadata?: {
            full_name?: string;
        };
    };
}

export function AdminTopbar({ user }: AdminTopbarProps) {
    const { t, locale, setLocale } = useAdminI18n();
    const router = useRouter();
    const pathname = usePathname();
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("admin-theme") as "light" | "dark" | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("admin-theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
                {/* Logo & Brand */}
                <div className="flex items-center gap-6">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">ΕΣΠ</span>
                        <span className="hidden sm:inline text-sm font-medium text-muted-foreground">
                            Admin
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item, index) => {
                            // Check if item has submenu
                            if ('submenu' in item && item.submenu) {
                                const isAnySubItemActive = item.submenu.some(
                                    sub => pathname === sub.href || 
                                    (sub.href !== "/admin" && pathname.startsWith(sub.href))
                                );
                                return (
                                    <DropdownMenu key={index}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "px-3 py-2 text-sm font-medium",
                                                    isAnySubItemActive && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                {item.label}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {item.submenu.map((subItem) => {
                                                const isSubActive = pathname === subItem.href || 
                                                    (subItem.href !== "/admin" && pathname.startsWith(subItem.href));
                                                return (
                                                    <DropdownMenuItem key={subItem.href} asChild>
                                                        <Link
                                                            href={subItem.href}
                                                            className={cn(
                                                                "w-full cursor-pointer",
                                                                isSubActive && "bg-accent text-accent-foreground"
                                                            )}
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            }
                            
                            // Regular link
                            const isActive = pathname === item.href || 
                                           (item.href !== "/admin" && pathname.startsWith(item.href!));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                    {/* Notifications Bell */}
                    <NotificationBell />

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="hidden sm:flex"
                    >
                        {theme === "light" ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Language Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hidden sm:flex">
                                <Globe className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLocale("el")}>
                                <span className={locale === "el" ? "font-bold" : ""}>
                                    🇬🇷 Ελληνικά
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLocale("en")}>
                                <span className={locale === "en" ? "font-bold" : ""}>
                                    🇬🇧 English
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user.user_metadata?.full_name || "Admin"}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/" className="cursor-pointer">
                                    Πίσω στο Site
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                Αποσύνδεση
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t bg-background">
                    <nav className="container mx-auto py-4 px-4 flex flex-col gap-2">
                        {navItems.map((item, index) => {
                            // Check if item has submenu
                            if ('submenu' in item && item.submenu) {
                                return (
                                    <div key={index} className="space-y-1">
                                        <div className="px-3 py-2 text-sm font-semibold text-foreground">
                                            {item.label}
                                        </div>
                                        {item.submenu.map((subItem) => {
                                            const isSubActive = pathname === subItem.href || 
                                                (subItem.href !== "/admin" && pathname.startsWith(subItem.href));
                                            return (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={cn(
                                                        "px-6 py-2 rounded-md text-sm font-medium transition-colors block",
                                                        isSubActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    )}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                );
                            }
                            
                            // Regular link
                            const isActive = pathname === item.href || 
                                           (item.href !== "/admin" && pathname.startsWith(item.href!));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
