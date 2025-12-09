"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MapPin } from "lucide-react";

const GREECE_CENTER: [number, number] = [39.0742, 21.8243];

export function MapExplorer() {
    return (
        <GlassPanel
            className="w-full min-h-[520px] md:min-h-[620px] flex flex-col gap-4"
            variant="card"
            hoverEffect
            gradientBorder
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
                        <MapPin className="h-3 w-3" />
                        Διαδραστικός Χάρτης
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Γαστρονομικός Χάρτης Ελλάδας
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Δοκιμαστική έκδοση: απλός χάρτης με έναν marker.
                    </p>
                </div>
            </div>

            {/* Χάρτης */}
            <div className="relative z-[1] flex-1 rounded-xl overflow-hidden border border-border/60 bg-transparent">
                <MapContainer
                    center={GREECE_CENTER}
                    zoom={6}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                    minZoom={5}
                    maxZoom={13}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[37.9838, 23.7275]}>
                        <Popup>Αθήνα</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </GlassPanel>
    );
}
