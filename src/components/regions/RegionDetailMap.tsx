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
const createCustomIcon = (color: string, size = 26) =>
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

const regionIcon = createCustomIcon("#f97316", 30); // πορτοκαλί για περιοχές
const prefectureIcon = createCustomIcon("#22c55e", 24); // πράσινο για νομούς

type RegionWithCoords = {
    id: string;
    name: string;
    lat: number;
    lng: number;
};

type PrefectureWithCoords = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    recipeCount?: number;
    slug?: string;
};

interface RegionDetailMapProps {
    region: RegionWithCoords;
    prefectures: PrefectureWithCoords[];
    onPrefectureClick?: (id: string) => void;
}

export default function RegionDetailMap({
    region,
    prefectures,
    onPrefectureClick,
}: RegionDetailMapProps) {
    const bounds = useMemo(() => {
        if (!prefectures.length) return undefined;
        const latLngs = prefectures.map((p) => L.latLng(p.lat, p.lng));
        return L.latLngBounds(latLngs);
    }, [prefectures]);

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <MapContainer
                center={[region.lat, region.lng]}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                bounds={bounds}
                boundsOptions={{ padding: [40, 40] }}
            >
                <TileLayer
                    attribution={
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                        'contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    }
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Marker περιοχής */}
                <Marker position={[region.lat, region.lng]} icon={regionIcon}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-semibold mb-1">{region.name}</h3>
                            <p className="text-xs text-gray-300">
                                Κεντρικό σημείο της περιοχής
                            </p>
                        </div>
                    </Popup>
                </Marker>

                {/* Markers νομών */}
                {prefectures.map((pref) => (
                    <Marker
                        key={pref.id}
                        position={[pref.lat, pref.lng]}
                        icon={prefectureIcon}
                        eventHandlers={{
                            click: () => onPrefectureClick?.(pref.id),
                        }}
                    >
                        <Popup>
                            <div className="text-center space-y-1">
                                <h3 className="font-semibold">{pref.name}</h3>
                                {typeof pref.recipeCount === "number" && (
                                    <p className="text-xs text-gray-300">
                                        {pref.recipeCount} συνταγές
                                    </p>
                                )}
                                {pref.slug && (
                                    <a
                                        href={`/prefectures/${pref.slug}`}
                                        className="text-xs text-blue-400 hover:underline font-medium"
                                    >
                                        Δείτε τον νομό →
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
