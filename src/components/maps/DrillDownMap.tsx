"use client";

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { FeatureCollection, Feature, Point } from 'geojson';
import { 
  MapLevel, 
  MAP_LEVELS, 
  RegionProperties, 
  NomosProperties, 
  MunicipalityProperties, 
  SettlementProperties 
} from '@/lib/types/map';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeatureProperties = RegionProperties | NomosProperties | MunicipalityProperties | SettlementProperties;

interface DrillDownMapProps {
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

export default function DrillDownMap({ className }: DrillDownMapProps) {
  const [currentLevel, setCurrentLevel] = useState<MapLevel>('regions');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [history, setHistory] = useState<Array<{ level: MapLevel; parentId: string | null }>>([]);
  
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  // Load GeoJSON for current level
  useEffect(() => {
    async function loadGeoJSON() {
      setIsLoading(true);
      try {
        const config = MAP_LEVELS[currentLevel];
        const response = await fetch(config.geojsonPath);
        const data: FeatureCollection = await response.json();
        
        // Filter data by parent ID if applicable
        if (config.parentField && selectedParentId) {
          const filtered: FeatureCollection = {
            ...data,
            features: data.features.filter((feature: Feature) => 
              feature.properties?.[config.parentField as string] === selectedParentId
            ),
          };
          setGeojsonData(filtered);
        } else {
          setGeojsonData(data);
        }
      } catch (error) {
        console.error(`Error loading ${currentLevel} GeoJSON:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGeoJSON();
  }, [currentLevel, selectedParentId]);

  // Calculate bounds when GeoJSON changes
  useEffect(() => {
    if (geojsonData) {
      const geoJsonLayer = L.geoJSON(geojsonData);
      const layerBounds = geoJsonLayer.getBounds();
      if (layerBounds.isValid()) {
        setBounds(layerBounds);
      }
    }
  }, [geojsonData]);

  // Handle settlements with marker clustering
  useEffect(() => {
    if (!mapRef.current || currentLevel !== 'settlements' || !geojsonData) return;

    // Clear existing marker cluster group
    if (markerClusterGroupRef.current) {
      mapRef.current.removeLayer(markerClusterGroupRef.current);
    }

    // Create new marker cluster group
    const markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    if (geojsonData) {
      geojsonData.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Point') {
          const props = feature.properties as SettlementProperties;
          const coords = feature.geometry.coordinates;
          
          const marker = L.marker([coords[1], coords[0]], {
            icon: L.divIcon({
              className: 'custom-marker-icon',
              html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
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
  }, [currentLevel, geojsonData]);

  // Handle polygon click
  const handleFeatureClick = (feature: Feature<any, FeatureProperties>) => {
    const config = MAP_LEVELS[currentLevel];
    
    if (config.nextLevel) {
      const featureId = (feature.properties as any)?.[config.idField as string];
      
      // Save current state to history
      setHistory(prev => [...prev, { level: currentLevel, parentId: selectedParentId }]);
      
      // Navigate to next level
      setCurrentLevel(config.nextLevel);
      setSelectedParentId(featureId);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentLevel(previous.level);
      setSelectedParentId(previous.parentId);
      
      // Clear marker cluster when going back
      if (markerClusterGroupRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerClusterGroupRef.current);
        markerClusterGroupRef.current = null;
      }
    }
  };

  // Style for polygons
  const getStyle = (feature?: Feature) => ({
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

  // Event handlers for polygons
  const onEachFeature = (feature: Feature<any, FeatureProperties>, layer: L.Layer) => {
    if (currentLevel === 'settlements') return; // No interaction for settlements (handled by markers)

    layer.on({
      click: () => handleFeatureClick(feature),
      mouseover: (e: L.LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(getHighlightStyle());
        target.bringToFront();
        
        // Show tooltip
        const props = feature.properties;
        if (props?.name) {
          target.bindTooltip(props.name, {
            sticky: true,
            className: 'custom-tooltip',
          }).openTooltip();
        }
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(getStyle());
        target.closeTooltip();
      },
    });
  };

  // Level labels for UI
  const levelLabels: Record<MapLevel, string> = {
    regions: 'Περιφέρειες',
    nomoi: 'Νομοί',
    municipalities: 'Δήμοι',
    settlements: 'Οικισμοί',
  };

  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* Header with level indicator and back button */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-3">
        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Πίσω
          </button>
        )}
        
        <div className="px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Επίπεδο:</span>{' '}
          <span className="text-sm font-bold text-blue-600">{levelLabels[currentLevel]}</span>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-[1000] px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Φόρτωση...</span>
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[39.0742, 21.8243]} // Center of Greece
        zoom={6}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {geojsonData && currentLevel !== 'settlements' && (
          <GeoJSON
            key={`${currentLevel}-${selectedParentId || 'all'}`}
            data={geojsonData}
            style={getStyle}
            onEachFeature={onEachFeature}
            ref={geoJsonRef}
          />
        )}
        
        <MapUpdater bounds={bounds} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] px-4 py-3 bg-white rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <p className="text-xs text-gray-600 leading-relaxed">
          {currentLevel !== 'settlements' 
            ? 'Κάντε κλικ σε μια περιοχή για να δείτε περισσότερες λεπτομέρειες' 
            : 'Οι οικισμοί εμφανίζονται ως markers. Κάντε κλικ για πληροφορίες'}
        </p>
      </div>
    </div>
  );
}
