"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Region, Prefecture, City } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from "lucide-react";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker colors
const createCustomIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 24],
    });
};

const regionIcon = createCustomIcon('#ef4444'); // Red for regions
const prefectureIcon = createCustomIcon('#3b82f6'); // Blue for prefectures
const cityIcon = createCustomIcon('#10b981'); // Green for cities

type ViewLevel = 'regions' | 'prefectures' | 'cities';

interface HierarchicalMapProps {
    regions: (Region & { lat: number; lng: number })[];
    prefectures: (Prefecture & { lat: number; lng: number })[];
    cities: (City & { lat: number; lng: number })[];
    onRegionClick?: (slug: string) => void;
    onPrefectureClick?: (slug: string) => void;
    onCityClick?: (slug: string) => void;
}

export function HierarchicalMap({ 
    regions, 
    prefectures, 
    cities,
    onRegionClick,
    onPrefectureClick,
    onCityClick 
}: HierarchicalMapProps) {
    const [viewLevel, setViewLevel] = useState<ViewLevel>('regions');
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([38.5, 23.5]);
    const [mapZoom, setMapZoom] = useState<number>(6);

    const handleRegionClick = (region: Region & { lat: number; lng: number }) => {
        setSelectedRegion(region.id);
        setViewLevel('prefectures');
        setMapCenter([region.lat, region.lng]);
        setMapZoom(8);
    };

    const handlePrefectureClick = (prefecture: Prefecture & { lat: number; lng: number }) => {
        setSelectedPrefecture(prefecture.id);
        setViewLevel('cities');
        setMapCenter([prefecture.lat, prefecture.lng]);
        setMapZoom(10);
    };

    const handleCityClick = (city: City & { lat: number; lng: number }) => {
        if (onCityClick) {
            onCityClick(city.slug);
        }
    };

    const goBack = () => {
        if (viewLevel === 'cities') {
            setViewLevel('prefectures');
            setSelectedPrefecture(null);
            setMapZoom(8);
        } else if (viewLevel === 'prefectures') {
            setViewLevel('regions');
            setSelectedRegion(null);
            setMapCenter([38.5, 23.5]);
            setMapZoom(6);
        }
    };

    const goHome = () => {
        setViewLevel('regions');
        setSelectedRegion(null);
        setSelectedPrefecture(null);
        setMapCenter([38.5, 23.5]);
        setMapZoom(6);
    };

    const filteredPrefectures = selectedRegion 
        ? prefectures.filter(p => p.region_id === selectedRegion)
        : prefectures;

    const filteredCities = selectedPrefecture
        ? cities.filter(c => c.prefecture_id === selectedPrefecture)
        : cities;

    const getBreadcrumb = () => {
        const parts = ['Regions'];
        if (viewLevel === 'prefectures' && selectedRegion) {
            const region = regions.find(r => r.id === selectedRegion);
            parts.push(region?.name || 'Prefecture');
        }
        if (viewLevel === 'cities' && selectedPrefecture) {
            const prefecture = prefectures.find(p => p.id === selectedPrefecture);
            parts.push(prefecture?.name || 'Cities');
        }
        return parts.join(' → ');
    };

    return (
        <div className="space-y-4">
            {/* Navigation breadcrumb */}
            <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">📍 {getBreadcrumb()}</span>
                </div>
                <div className="flex gap-2">
                    {viewLevel !== 'regions' && (
                        <Button variant="outline" size="sm" onClick={goBack}>
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                    )}
                    {viewLevel !== 'regions' && (
                        <Button variant="outline" size="sm" onClick={goHome}>
                            <Home className="w-4 h-4 mr-1" />
                            Home
                        </Button>
                    )}
                </div>
            </div>

            {/* Map container */}
            <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-lg">
                <MapContainer
                    key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                    maxBounds={[
                        [33.5, 18.5],
                        [42.5, 30.0]
                    ]}
                    minZoom={5.5}
                    maxZoom={11}
                    maxBoundsViscosity={0.5}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Show regions */}
                    {viewLevel === 'regions' && regions.map((region) => (
                        <Marker
                            key={region.id}
                            position={[region.lat, region.lng]}
                            icon={regionIcon}
                            eventHandlers={{
                                click: () => handleRegionClick(region),
                            }}
                        >
                            <Popup>
                                <div className="text-center p-2">
                                    <h3 className="font-bold text-lg mb-1">{region.name}</h3>
                                    {region.description && (
                                        <p className="text-sm text-gray-600 mb-2">{region.description}</p>
                                    )}
                                    <button
                                        onClick={() => handleRegionClick(region)}
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        View Prefectures →
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Show prefectures */}
                    {viewLevel === 'prefectures' && filteredPrefectures.map((prefecture) => (
                        <Marker
                            key={prefecture.id}
                            position={[prefecture.lat, prefecture.lng]}
                            icon={prefectureIcon}
                            eventHandlers={{
                                click: () => handlePrefectureClick(prefecture),
                            }}
                        >
                            <Popup>
                                <div className="text-center p-2">
                                    <h3 className="font-bold text-lg mb-1">{prefecture.name}</h3>
                                    {prefecture.description && (
                                        <p className="text-sm text-gray-600 mb-2">{prefecture.description}</p>
                                    )}
                                    <button
                                        onClick={() => handlePrefectureClick(prefecture)}
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        View Cities →
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Show cities */}
                    {viewLevel === 'cities' && filteredCities.map((city) => (
                        <Marker
                            key={city.id}
                            position={[city.lat, city.lng]}
                            icon={cityIcon}
                            eventHandlers={{
                                click: () => handleCityClick(city),
                            }}
                        >
                            <Popup>
                                <div className="text-center p-2">
                                    <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                                    {city.description && (
                                        <p className="text-sm text-gray-600 mb-2">{city.description}</p>
                                    )}
                                    <button
                                        onClick={() => handleCityClick(city)}
                                        className="text-green-600 hover:underline text-sm font-medium"
                                    >
                                        View Recipes →
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 bg-white/60 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Regions</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Prefectures</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Cities</span>
                </div>
            </div>
        </div>
    );
}
