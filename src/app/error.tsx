"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Home, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="container max-w-4xl py-16">
            <GlassPanel className="p-12 text-center space-y-6">
                <div className="text-9xl font-bold text-destructive/20">500</div>
                <h1 className="text-4xl font-bold">Κάτι πήγε στραβά</h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Συγγνώμη, αντιμετωπίσαμε ένα απροσδόκητο σφάλμα. Η ομάδα μας έχει ειδοποιηθεί και εργαζόμαστε για να το διορθώσουμε.
                </p>

                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="p-4 bg-destructive/10 rounded-lg text-left max-w-2xl mx-auto">
                        <p className="font-mono text-sm text-destructive break-all">
                            {error.message}
                        </p>
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Button size="lg" onClick={reset} className="gap-2">
                        <RefreshCcw className="w-5 h-5" />
                        Δοκιμάστε Ξανά
                    </Button>
                    <Link href="/">
                        <Button size="lg" variant="outline" className="gap-2">
                            <Home className="w-5 h-5" />
                            Πίσω στην Αρχική
                        </Button>
                    </Link>
                </div>

                <div className="pt-8 border-t border-border/50 text-sm text-muted-foreground">
                    <p>Αν το πρόβλημα συνεχίζεται, επικοινωνήστε μαζί μας.</p>
                    {error.digest && (
                        <p className="mt-2 font-mono text-xs">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
}
