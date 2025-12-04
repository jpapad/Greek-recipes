'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response: ${outcome}`);
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!showPrompt || localStorage.getItem('pwa-prompt-dismissed')) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Download className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Install Greek Recipes</h3>
                            <p className="text-sm text-muted-foreground">Quick access, offline mode</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDismiss}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleInstall} className="flex-1">
                        Install
                    </Button>
                    <Button variant="outline" onClick={handleDismiss}>
                        Not now
                    </Button>
                </div>
            </div>
        </div>
    );
}
