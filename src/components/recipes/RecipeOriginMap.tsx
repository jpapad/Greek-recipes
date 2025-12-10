"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";

// Fix default marker icons (CDN)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom pin για τη συνταγή
const recipeIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="
    background-color:#f97316;
    width:26px;
    height:26px;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:2px solid white;
    box-shadow:0 3px 6px rgba(0,0,0,0.4);
  "></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 24],
});

interface RecipeOriginMapProps {
    lat: number;
    lng: number;
    regionName?: string;
    prefectureName?: string;
    cityName?: string;
}

export function RecipeOriginMap({
    lat,
    lng,
    regionName,
    prefectureName,
    cityName,
}: RecipeOriginMapProps) {
    const center = useMemo<[number, number]>(() => [lat, lng], [lat, lng]);

    const title =
        cityName ||
        prefectureName ||
        regionName ||
        "Προέλευση συνταγής";

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <MapContainer
                center={center}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution={
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                        'contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    }
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <Marker position={center} icon={recipeIcon}>
                    <Popup>
                        <div className="text-center space-y-1">
                            <h3 className="font-semibold text-sm">{title}</h3>
                            {regionName && (
                                <p className="text-xs text-gray-300">
                                    Περιοχή: {regionName}
                                </p>
                            )}
                            {prefectureName && (
                                <p className="text-xs text-gray-300">
                                    Νομός: {prefectureName}
                                </p>
                            )}
                            {cityName && (
                                <p className="text-xs text-gray-300">Πόλη/Χωριό: {cityName}</p>
                            )}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
