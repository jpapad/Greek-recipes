import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="container max-w-4xl py-16">
            <GlassPanel className="p-12 text-center space-y-6">
                <div className="text-9xl font-bold text-primary/20">404</div>
                <h1 className="text-4xl font-bold">Η σελίδα δεν βρέθηκε</h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Δυστυχώς, η σελίδα που ψάχνετε δεν υπάρχει. Μπορεί να έχει μετακινηθεί ή διαγραφεί.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Link href="/">
                        <Button size="lg" className="gap-2">
                            <Home className="w-5 h-5" />
                            Πίσω στην Αρχική
                        </Button>
                    </Link>
                    <Link href="/recipes">
                        <Button size="lg" variant="outline" className="gap-2">
                            <Search className="w-5 h-5" />
                            Περιήγηση Συνταγών
                        </Button>
                    </Link>
                </div>

                <div className="pt-8 border-t border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Δημοφιλείς Συνδέσεις:</h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/recipes" className="text-primary hover:underline">
                            Συνταγές
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link href="/regions" className="text-primary hover:underline">
                            Περιοχές
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link href="/favorites" className="text-primary hover:underline">
                            Αγαπημένα
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link href="/shopping-list" className="text-primary hover:underline">
                            Λίστα Αγορών
                        </Link>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
