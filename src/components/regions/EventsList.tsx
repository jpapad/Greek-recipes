"use client";

import { Calendar, MapPin as MapPinIcon } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Event } from "@/lib/types";

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <GlassPanel className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-primary" />
        Εκδηλώσεις & Γιορτές
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <GlassPanel
            key={index}
            variant="card"
            className="p-4 hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                📅
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 leading-tight">{event.name}</h3>
                <p className="text-sm text-primary mb-2 font-medium">
                  {event.date}
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
                {event.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <MapPinIcon className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </GlassPanel>
  );
}
