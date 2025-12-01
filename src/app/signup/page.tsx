"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password);
            alert("Account created! Please check your email to verify your account.");
            router.push("/login");
        } catch (err: any) {
            setError(err.message || "Failed to sign up");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassPanel className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Join Greek Recipes today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="email">Email</Label>
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
                        <Label htmlFor="password">Password</Label>
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
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                        ← Back to Home
                    </Link>
                </div>
            </GlassPanel>
        </div>
    );
}
