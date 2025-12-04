import { GlassPanel } from "@/components/ui/GlassPanel";
import { UnitConverter } from "@/components/recipes/UnitConverter";
import { Calculator } from "lucide-react";

export default function ToolsConverterPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-24">
            <GlassPanel className="p-8 text-center bg-white/40">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Calculator className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Μετατροπέας Μονάδων</h1>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Μετατρέψτε εύκολα όγκους, βάρη και θερμοκρασίες για τις συνταγές σας
                </p>
            </GlassPanel>

            <UnitConverter />
        </div>
    );
}
