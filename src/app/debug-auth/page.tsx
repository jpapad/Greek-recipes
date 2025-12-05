"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import Link from "next/link";

export default function DebugAuthPage() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [apiInfo, setApiInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchInfo = async () => {
        setLoading(true);
        
        // Get from client
        const clientUser = await getUser();
        setUserInfo(clientUser);
        
        // Get from API
        const response = await fetch('/api/auth/debug');
        const data = await response.json();
        setApiInfo(data);
        
        setLoading(false);
    };

    const handleRefresh = async () => {
        const response = await fetch('/api/auth/refresh', { method: 'POST' });
        const data = await response.json();
        console.log('Refresh result:', data);
        await fetchInfo();
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">🔍 Auth Debug Info</h1>
                    <div className="flex gap-2">
                        <Button onClick={fetchInfo} variant="outline">Refresh</Button>
                        <Button onClick={handleRefresh}>Force Session Refresh</Button>
                        <Link href="/admin">
                            <Button>Go to Admin</Button>
                        </Link>
                    </div>
                </div>

                <GlassPanel className="p-6">
                    <h2 className="text-xl font-bold mb-4">Client-side User Info</h2>
                    <pre className="bg-black/50 p-4 rounded overflow-auto text-xs">
                        {JSON.stringify(userInfo, null, 2)}
                    </pre>
                </GlassPanel>

                <GlassPanel className="p-6">
                    <h2 className="text-xl font-bold mb-4">Server API Info</h2>
                    <pre className="bg-black/50 p-4 rounded overflow-auto text-xs">
                        {JSON.stringify(apiInfo, null, 2)}
                    </pre>
                </GlassPanel>

                <GlassPanel className="p-6">
                    <h2 className="text-xl font-bold mb-4">📋 Checklist</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            {apiInfo?.user?.email ? '✅' : '❌'}
                            <span>User is logged in: <strong>{apiInfo?.user?.email || 'NO'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            {apiInfo?.user?.is_admin === true ? '✅' : '❌'}
                            <span>is_admin flag: <strong>{String(apiInfo?.user?.is_admin)}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            {apiInfo?.user?.email && apiInfo?.user?.is_admin === true ? '✅' : '❌'}
                            <span>Can access /admin: <strong>{apiInfo?.user?.email && apiInfo?.user?.is_admin === true ? 'YES' : 'NO'}</strong></span>
                        </div>
                    </div>
                </GlassPanel>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm">
                    <h3 className="font-bold mb-2">💡 Troubleshooting Steps:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Make sure you ran <code className="bg-black/30 px-1 rounded">SET_ADMIN_NOW.sql</code> in Supabase</li>
                        <li>Click "Force Session Refresh" above</li>
                        <li>If still not working, logout and login again</li>
                        <li>Check that email in SQL matches your login email</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
