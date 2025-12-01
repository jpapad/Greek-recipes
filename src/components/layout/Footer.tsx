import { GlassPanel } from "@/components/ui/GlassPanel";

export function Footer() {
    return (
        <footer className="mt-20 pb-10 px-4">
            <GlassPanel className="mx-auto max-w-7xl p-8 text-center text-muted-foreground bg-white/20">
                <p>&copy; {new Date().getFullYear()} Traditional Greek Recipes. Made with love.</p>
            </GlassPanel>
        </footer>
    );
}
