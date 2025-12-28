"use client";

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { FeatureCollection, Feature, Point } from 'geojson';
import { Region, Prefecture, City } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewLevel = 'regions' | 'prefectures' | 'cities' | 'settlements';

interface UnifiedMapProps {
  // Data με coordinates (για markers)
  regions: (Region & { lat: number; lng: number })[];
  prefectures: (Prefecture & { lat: number; lng: number })[];
  cities: (City & { lat: number; lng: number })[];
  
  // Optional: GeoJSON paths (για polygons)
  useGeoJSON?: boolean;
  regionsGeoJSON?: string;
  prefecturesGeoJSON?: string; // Ή "nomoi"
  citiesGeoJSON?: string; // Ή "municipalities"
  settlementsGeoJSON?: string;
  
  // Callbacks
  onRegionClick?: (id: string, slug?: string) => void;
  onPrefectureClick?: (id: string, slug?: string) => void;
  onCityClick?: (id: string, slug?: string) => void;
  
  className?: string;
}

// Component to handle map updates
function MapUpdater({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [bounds, map]);
  
  return null;
}

export default function UnifiedMap({
  regions,
  prefectures,
  cities,
  useGeoJSON = false,
  regionsGeoJSON = '/data/regions_simplified_0.01deg.geojson',
  prefecturesGeoJSON = '/data/nomoi_simplified_0.01deg.geojson',
  citiesGeoJSON = '/data/municipalities_simplified_0.005deg.geojson',
  settlementsGeoJSON = '/data/settlements.geojson',
  onRegionClick,
  onPrefectureClick,
  onCityClick,
  className,
}: UnifiedMapProps) {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('regions');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([38.5, 23.5]);
  const [mapZoom, setMapZoom] = useState<number>(6);
  
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [history, setHistory] = useState<Array<{ level: ViewLevel; regionId: string | null; prefectureId: string | null; cityId: string | null }>>([]);
  
  const mapRef = useRef<L.Map | null>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  // Load GeoJSON if enabled
  useEffect(() => {
    if (!useGeoJSON) return;

    async function loadGeoJSON() {
      setIsLoading(true);
      try {
        let path = '';
        let filterField = '';
        let filterValue = '';

        switch (viewLevel) {
          case 'regions':
            path = regionsGeoJSON;
            break;
          case 'prefectures':
            path = prefecturesGeoJSON;
            filterField = 'region_id';
            filterValue = selectedRegion || '';
            break;
          case 'cities':
            path = citiesGeoJSON;
            filterField = 'nomos_id'; // or 'prefecture_id'
            filterValue = selectedPrefecture || '';
            break;
          case 'settlements':
            path = settlementsGeoJSON;
            filterField = 'municipality_id';
            filterValue = selectedCity || '';
            break;
        }

        const response = await fetch(path);
        const data: FeatureCollection = await response.json();
        
        // Filter by parent if needed
        if (filterField && filterValue) {
          const filtered = {
            ...data,
            features: (data as any).features.filter((feature: Feature) => 
              feature.properties?.[filterField] === filterValue
            ),
          };
          setGeojsonData(filtered);
        } else {
          setGeojsonData(data);
        }
      } catch (error) {
        console.error(`Error loading ${viewLevel} GeoJSON:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGeoJSON();
  }, [viewLevel, selectedRegion, selectedPrefecture, selectedCity, useGeoJSON]);

  // Calculate bounds when GeoJSON changes
  useEffect(() => {
    if (useGeoJSON && geojsonData) {
      const geoJsonLayer = L.geoJSON(geojsonData);
      const layerBounds = geoJsonLayer.getBounds();
      if (layerBounds.isValid()) {
        setBounds(layerBounds);
      }
    }
  }, [geojsonData, useGeoJSON]);

  // Handle settlements with clustering
  useEffect(() => {
    if (!mapRef.current || viewLevel !== 'settlements' || !geojsonData || !useGeoJSON) return;

    // Clear existing cluster
    if (markerClusterGroupRef.current) {
      mapRef.current.removeLayer(markerClusterGroupRef.current);
    }

    const markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    if (geojsonData) {
      geojsonData.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Point') {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;
          
          const marker = L.marker([coords[1], coords[0]], {
            icon: L.divIcon({
              className: 'custom-marker-icon',
              html: '<div style="background-color: #8b5cf6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            }),
          });

          marker.bindPopup(`
            <div style="padding: 8px;">
              <strong style="font-size: 14px; color: #1f2937;">${props.name}</strong>
            </div>
          `);

          markerClusterGroup.addLayer(marker);
        }
      });
    }

    mapRef.current.addLayer(markerClusterGroup);
    markerClusterGroupRef.current = markerClusterGroup;

    return () => {
      if (markerClusterGroupRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerClusterGroupRef.current);
      }
    };
  }, [viewLevel, geojsonData, useGeoJSON]);

  // Navigation handlers
  const handleRegionClick = (region: Region & { lat: number; lng: number }) => {
    setHistory(prev => [...prev, { level: viewLevel, regionId: selectedRegion, prefectureId: selectedPrefecture, cityId: selectedCity }]);
    setSelectedRegion(region.id);
    setViewLevel('prefectures');
    setMapCenter([region.lat, region.lng]);
    setMapZoom(8);
    onRegionClick?.(region.id, region.slug);
  };

  const handlePrefectureClick = (prefecture: Prefecture & { lat: number; lng: number }) => {
    setHistory(prev => [...prev, { level: viewLevel, regionId: selectedRegion, prefectureId: selectedPrefecture, cityId: selectedCity }]);
    setSelectedPrefecture(prefecture.id);
    setViewLevel('cities');
    setMapCenter([prefecture.lat, prefecture.lng]);
    setMapZoom(10);
    onPrefectureClick?.(prefecture.id, prefecture.slug);
  };

  const handleCityClick = (city: City & { lat: number; lng: number }) => {
    if (useGeoJSON && settlementsGeoJSON) {
      setHistory(prev => [...prev, { level: viewLevel, regionId: selectedRegion, prefectureId: selectedPrefecture, cityId: selectedCity }]);
      setSelectedCity(city.id);
      setViewLevel('settlements');
      setMapCenter([city.lat, city.lng]);
      setMapZoom(12);
    }
    onCityClick?.(city.id, city.slug);
  };

  const goBack = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setViewLevel(previous.level);
      setSelectedRegion(previous.regionId);
      setSelectedPrefecture(previous.prefectureId);
      setSelectedCity(previous.cityId);
      
      // Adjust zoom based on level
      if (previous.level === 'regions') {
        setMapCenter([38.5, 23.5]);
        setMapZoom(6);
      } else if (previous.level === 'prefectures') {
        const region = regions.find(r => r.id === previous.regionId);
        if (region) setMapCenter([region.lat, region.lng]);
        setMapZoom(8);
      } else if (previous.level === 'cities') {
        const prefecture = prefectures.find(p => p.id === previous.prefectureId);
        if (prefecture) setMapCenter([prefecture.lat, prefecture.lng]);
        setMapZoom(10);
      }

      // Clear cluster
      if (markerClusterGroupRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerClusterGroupRef.current);
        markerClusterGroupRef.current = null;
      }
    }
  };

  const goHome = () => {
    setViewLevel('regions');
    setSelectedRegion(null);
    setSelectedPrefecture(null);
    setSelectedCity(null);
    setMapCenter([38.5, 23.5]);
    setMapZoom(6);
    setHistory([]);
    
    if (markerClusterGroupRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerClusterGroupRef.current);
      markerClusterGroupRef.current = null;
    }
  };

  // Filtered data
  const filteredPrefectures = selectedRegion
    ? prefectures.filter(p => p.region_id === selectedRegion)
    : prefectures;

  const filteredCities = selectedPrefecture
    ? cities.filter(c => c.prefecture_id === selectedPrefecture)
    : cities;

  // Breadcrumb
  const getBreadcrumb = () => {
    const parts = ['Regions'];
    if (viewLevel !== 'regions' && selectedRegion) {
      const region = regions.find(r => r.id === selectedRegion);
      if (region) parts.push(region.name);
    }
    if ((viewLevel === 'cities' || viewLevel === 'settlements') && selectedPrefecture) {
      const prefecture = prefectures.find(p => p.id === selectedPrefecture);
      if (prefecture) parts.push(prefecture.name);
    }
    if (viewLevel === 'settlements' && selectedCity) {
      const city = cities.find(c => c.id === selectedCity);
      if (city) parts.push(city.name);
    }
    return parts.join(' → ');
  };

  // GeoJSON styles
  const getGeoJSONStyle = () => ({
    fillColor: '#3b82f6',
    fillOpacity: 0.2,
    color: '#1e40af',
    weight: 2,
  });

  const getHighlightStyle = () => ({
    fillColor: '#60a5fa',
    fillOpacity: 0.4,
    color: '#1e3a8a',
    weight: 3,
  });

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    if (viewLevel === 'settlements') return;

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(getHighlightStyle());
        target.bringToFront();
        
        if (feature.properties?.name) {
          target.bindTooltip(feature.properties.name, { sticky: true, className: 'custom-tooltip' }).openTooltip();
        }
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(getGeoJSONStyle());
        target.closeTooltip();
      },
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Navigation */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">📍 {getBreadcrumb()}</span>
        </div>
        <div className="flex gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 px-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Φόρτωση...</span>
            </div>
          )}
          {viewLevel !== 'regions' && (
            <>
              <Button variant="outline" size="sm" onClick={goBack}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Πίσω
              </Button>
              <Button variant="outline" size="sm" onClick={goHome}>
                <Home className="w-4 h-4 mr-1" />
                Αρχική
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          maxBounds={[[33.5, 18.5], [42.5, 30.0]]}
          minZoom={5.5}
          maxZoom={useGeoJSON ? 13 : 11}
          maxBoundsViscosity={0.5}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* GeoJSON Polygons */}
          {useGeoJSON && geojsonData && viewLevel !== 'settlements' && (
            <GeoJSON
              key={`geojson-${viewLevel}-${selectedRegion}-${selectedPrefecture}-${selectedCity}`}
              data={geojsonData}
              style={getGeoJSONStyle}
              onEachFeature={onEachFeature}
            />
          )}

          {/* Fallback: Circle Markers */}
          {!useGeoJSON && (
            <>
              {viewLevel === 'regions' && regions.map((region) => (
                <CircleMarker
                  key={region.id}
                  center={[region.lat, region.lng]}
                  radius={12}
                  pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8 }}
                  eventHandlers={{ click: () => handleRegionClick(region) }}
                >
                  <Popup>
                    <div className="text-center p-2">
                      <h3 className="font-bold text-lg mb-1">{region.name}</h3>
                      {region.description && <p className="text-sm text-gray-600 mb-2">{region.description}</p>}
                      <button onClick={() => handleRegionClick(region)} className="text-blue-600 hover:underline text-sm font-medium">
                        View Prefectures →
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {viewLevel === 'prefectures' && filteredPrefectures.map((prefecture) => (
                <CircleMarker
                  key={prefecture.id}
                  center={[prefecture.lat, prefecture.lng]}
                  radius={9}
                  pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.85 }}
                  eventHandlers={{ click: () => handlePrefectureClick(prefecture) }}
                >
                  <Popup>
                    <div className="text-center p-2">
                      <h3 className="font-bold text-lg mb-1">{prefecture.name}</h3>
                      {prefecture.description && <p className="text-sm text-gray-600 mb-2">{prefecture.description}</p>}
                      <button onClick={() => handlePrefectureClick(prefecture)} className="text-blue-600 hover:underline text-sm font-medium">
                        View Cities →
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {viewLevel === 'cities' && filteredCities.map((city) => (
                <CircleMarker
                  key={city.id}
                  center={[city.lat, city.lng]}
                  radius={7}
                  pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.9 }}
                  eventHandlers={{ click: () => handleCityClick(city) }}
                >
                  <Popup>
                    <div className="text-center p-2">
                      <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                      {city.description && <p className="text-sm text-gray-600 mb-2">{city.description}</p>}
                      <button onClick={() => handleCityClick(city)} className="text-green-600 hover:underline text-sm font-medium">
                        {useGeoJSON ? 'View Settlements →' : 'View Recipes →'}
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </>
          )}

          {useGeoJSON && <MapUpdater bounds={bounds} />}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
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
        {useGeoJSON && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium">Settlements</span>
          </div>
        )}
      </div>
    </div>
  );
}
