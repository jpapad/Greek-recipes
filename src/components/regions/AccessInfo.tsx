"use client";

import { Navigation } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface AccessInfoProps {
  howToGetThere: string;
  title?: string;
}

export default function AccessInfo({
  howToGetThere,
  title = "Πώς να φτάσετε",
}: AccessInfoProps) {
  if (!howToGetThere) {
    return null;
  }

  return (
    <GlassPanel className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Navigation className="w-6 h-6 text-primary" />
        {title}
      </h2>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p className="text-muted-foreground whitespace-pre-line">{howToGetThere}</p>
      </div>
    </GlassPanel>
  );
}
