"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ForceLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("jpapad85@gmail.com");
    const [password, setPassword] = useState("");
    const [checkResult, setCheckResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/check', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await res.json();
        setCheckResult(data);
        return data;
    };

    const clearAllCookies = () => {
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
    };

    const handleForceLogin = async () => {
        setLoading(true);
        setStep(2);
        
        try {
            // Step 1: Clear everything
            clearAllCookies();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setStep(3);
            // Step 2: Login
            const result = await signIn(email, password);
            
            if (!result?.user) {
                alert('Login failed!');
                setLoading(false);
                setStep(1);
                return;
            }
            
            setStep(4);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Step 3: Force refresh session
            await fetch('/api/auth/refresh', { method: 'POST' });
            
            setStep(5);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Step 4: Check if admin
            const check = await checkAuth();
            
            setStep(6);
            
            if (check.admin_checks?.is_admin_final) {
                alert('✅ Success! You are now admin. Redirecting to /admin...');
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 1000);
            } else {
                alert('❌ Still not admin. Check Supabase database.');
            }
        } catch (error) {
            console.error(error);
            alert('Error: ' + (error as Error).message);
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">🔧 Force Admin Login</h1>
                
                <GlassPanel className="p-6">
                    <h2 className="text-xl font-bold mb-4">Current Status</h2>
                    {checkResult ? (
                        <div className="space-y-2 text-sm">
                            <div>Email: <strong>{checkResult.user?.email || 'Not logged in'}</strong></div>
                            <div>is_admin value: <strong>{JSON.stringify(checkResult.admin_checks?.is_admin_value)}</strong></div>
                            <div>is_admin type: <strong>{checkResult.admin_checks?.is_admin_type}</strong></div>
                            <div>Can access admin: <strong className={checkResult.admin_checks?.is_admin_final ? 'text-green-500' : 'text-red-500'}>
                                {checkResult.admin_checks?.would_allow_admin}
                            </strong></div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <Button onClick={checkAuth} variant="outline" className="mt-4">
                        Refresh Status
                    </Button>
                </GlassPanel>

                <GlassPanel className="p-6">
                    <h2 className="text-xl font-bold mb-4">Force Clean Login</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        This will: 1) Clear all cookies & storage, 2) Login fresh, 3) Force session refresh, 4) Check admin status
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <Label>Email</Label>
                            <Input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        {loading && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 text-sm">
                                Step {step}/6: {
                                    step === 1 ? 'Ready' :
                                    step === 2 ? 'Clearing cookies & storage...' :
                                    step === 3 ? 'Logging in...' :
                                    step === 4 ? 'Refreshing session...' :
                                    step === 5 ? 'Checking admin status...' :
                                    'Done!'
                                }
                            </div>
                        )}
                        
                        <Button 
                            onClick={handleForceLogin} 
                            disabled={loading || !password}
                            className="w-full"
                        >
                            {loading ? 'Processing...' : 'Force Clean Login & Go to Admin'}
                        </Button>
                    </div>
                </GlassPanel>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm">
                    <h3 className="font-bold mb-2">⚠️ Before using this:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Make sure you ran FORCE_ADMIN_UPDATE.sql in Supabase</li>
                        <li>Verify in Supabase that is_admin = true for your email</li>
                        <li>Enter your password above</li>
                        <li>Click the button</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
