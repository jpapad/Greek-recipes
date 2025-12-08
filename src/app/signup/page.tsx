"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

export default function SignupPage() {
    const t = useTranslations();
    const router = useRouter();
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError(t('Auth.passwordsDontMatch'));
            return;
        }

        if (password.length < 6) {
            setError(t('Auth.passwordMinLength'));
            return;
        }

        setIsLoading(true);

        try {
            const result = await signUp(email, password);

            // Check if email confirmation is required
            if (result?.user && result.user.confirmed_at) {
                // User is auto-confirmed (email verification disabled)
                showToast(t('Auth.signUpSuccess'), "success");
            } else if (result?.user && !result.user.confirmed_at) {
                // Email verification required
                showToast(t('Auth.signUpSuccess'), "success");
            } else {
                // Account created but status unclear
                showToast(t('Auth.signUpSuccess'), "success");
            }

            router.push("/login");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || t('Auth.signUpFailed'));
            } else {
                setError(t('Auth.signUpFailed'));
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassPanel className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">{t('Auth.createAccount')}</h1>
                    <p className="text-muted-foreground">{t('Auth.joinCommunity')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="email">{t('Auth.email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">{t('Auth.password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">{t('Auth.confirmPassword')}</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? t('Admin.saving') : t('Auth.signUp')}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">{t('Auth.alreadyHaveAccount')} </span>
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        {t('Auth.signIn')}
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                        ← {t('Navbar.home')}
                    </Link>
                </div>
            </GlassPanel>
        </div>
    );
}
