"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

// Custom marker pins
const createCustomIcon = (color: string, size = 24) =>
    L.divIcon({
        className: "custom-marker",
        html: `<div style="
      background-color:${color};
      width:${size}px;
      height:${size}px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 3px 6px rgba(0,0,0,0.4);
    "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size - 2],
    });

const prefectureIcon = createCustomIcon("#f97316", 28); // πορτοκαλί για κέντρο νομού
const cityIcon = createCustomIcon("#3b82f6", 22); // μπλε για πόλεις/χωριά

type PrefectureWithCoords = {
    id: string;
    name: string;
    lat: number;
    lng: number;
};

type CityWithCoords = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    recipeCount?: number;
    slug?: string;
};

interface PrefectureDetailMapProps {
    prefecture: PrefectureWithCoords;
    cities: CityWithCoords[];
    onCityClick?: (id: string) => void;
}

export default function PrefectureDetailMap({
    prefecture,
    cities,
    onCityClick,
}: PrefectureDetailMapProps) {
    const bounds = useMemo(() => {
        if (!cities.length) return undefined;
        const latLngs = cities.map((c) => L.latLng(c.lat, c.lng));
        return L.latLngBounds(latLngs);
    }, [cities]);

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <MapContainer
                center={[prefecture.lat, prefecture.lng]}
                zoom={9}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                bounds={bounds}
                boundsOptions={{ padding: [40, 40] }}
                minZoom={7}
                maxZoom={13}
            >
                <TileLayer
                    attribution={
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                        'contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    }
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Marker νομού */}
                <Marker
                    position={[prefecture.lat, prefecture.lng]}
                    icon={prefectureIcon}
                >
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-semibold mb-1">{prefecture.name}</h3>
                            <p className="text-xs text-gray-300">
                                Κεντρικό σημείο του νομού
                            </p>
                        </div>
                    </Popup>
                </Marker>

                {/* Markers πόλεων / χωριών */}
                {cities.map((city) => (
                    <Marker
                        key={city.id}
                        position={[city.lat, city.lng]}
                        icon={cityIcon}
                        eventHandlers={{
                            click: () => onCityClick?.(city.id),
                        }}
                    >
                        <Popup>
                            <div className="text-center space-y-1">
                                <h3 className="font-semibold">{city.name}</h3>
                                {typeof city.recipeCount === "number" && (
                                    <p className="text-xs text-gray-300">
                                        {city.recipeCount} συνταγές
                                    </p>
                                )}
                                {city.slug && (
                                    <a
                                        href={`/cities/${city.slug}`}
                                        className="text-xs text-blue-400 hover:underline font-medium"
                                    >
                                        Δείτε την πόλη →
                                    </a>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
