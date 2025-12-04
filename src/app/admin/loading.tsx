import { GlassPanel } from "@/components/ui/GlassPanel";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <GlassPanel className="p-12 flex flex-col items-center gap-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground text-lg">Loading admin data...</p>
            </GlassPanel>
        </div>
    );
}
