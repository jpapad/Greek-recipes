"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { User, LogOut, Shield } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        async function loadUser() {
            const currentUser = await getUser();
            setUser(currentUser);
        }
        loadUser();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
        router.refresh();
    };

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
        );
    }

    const isAdmin = user.user_metadata?.is_admin === true;

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2"
            >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">{user.email}</span>
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-border/50 z-20">
                        <div className="p-2 space-y-1">
                            {isAdmin && (
                                <Link href="/admin" onClick={() => setIsOpen(false)}>
                                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/50 rounded-lg cursor-pointer transition-colors">
                                        <Shield className="w-4 h-4" />
                                        <span>Admin Panel</span>
                                    </div>
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleSignOut();
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
