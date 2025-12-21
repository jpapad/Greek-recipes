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
import { Input } from "@/components/ui/input";
import { Search, Bell, User, LogOut, Globe, Moon, Sun } from "lucide-react";
import { useAdminI18n } from "@/context/AdminI18nContext";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    const toggleLocale = () => {
        setLocale(locale === "el" ? "en" : "el");
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("topbar.search")}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                {/* Locale Switcher */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLocale}
                    title={locale === "el" ? "Switch to English" : "Αλλαγή σε Ελληνικά"}
                >
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Change language</span>
                </Button>

                {/* Theme Switcher */}
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        title={theme === "dark" ? "Light mode" : "Dark mode"}
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="hidden flex-col items-start text-left text-sm md:flex">
                                <span className="font-medium">
                                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>{t("topbar.profile")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            {t("topbar.logout")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
