"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Region {
    id: string;
    name: string;
    slug: string;
    description?: string;
    lat: number;
    lng: number;
}

interface GreeceMapProps {
    regions: Region[];
    onRegionClick?: (slug: string) => void;
}

export function GreeceMap({ regions, onRegionClick }: GreeceMapProps) {
    return (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-lg">
            <MapContainer
                center={[38.5, 23.5]}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                maxBounds={[
                    [33.5, 18.5],   // Southwest corner
                    [42.5, 30.0]    // Northeast corner
                ]}
                minZoom={5.5}
                maxZoom={11}
                maxBoundsViscosity={0.5}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {regions.map((region) => (
                    <Marker
                        key={region.id}
                        position={[region.lat, region.lng]}
                        eventHandlers={{
                            click: () => onRegionClick?.(region.slug),
                        }}
                    >
                        <Popup>
                            <div className="text-center p-2">
                                <h3 className="font-bold text-lg mb-1">{region.name}</h3>
                                {region.description && (
                                    <p className="text-sm text-gray-600">{region.description}</p>
                                )}
                                <button
                                    onClick={() => onRegionClick?.(region.slug)}
                                    className="mt-2 text-primary hover:underline text-sm font-medium"
                                >
                                    View Recipes →
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
