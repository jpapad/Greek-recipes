"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Region, Prefecture, City } from '@/lib/types';
import { getRegions, getPrefectures, getCities } from '@/lib/api';

// Dynamic import
const UnifiedMap = dynamic(() => import('@/components/maps/UnifiedMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-600 font-medium">Φόρτωση χάρτη...</p>
      </div>
    </div>
  ),
});

export default function GeoExplorePage() {
  const [regions, setRegions] = useState<(Region & { lat: number; lng: number })[]>([]);
  const [prefectures, setPrefectures] = useState<(Prefecture & { lat: number; lng: number })[]>([]);
  const [cities, setCities] = useState<(City & { lat: number; lng: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [regionsData, prefecturesData, citiesData] = await Promise.all([
          getRegions(),
          getPrefectures(),
          getCities(),
        ]);

        // Add coordinates (you should have these in your database)
        // For now, using mock coordinates as fallback
        setRegions(regionsData.map(r => ({ 
          ...r, 
          lat: (r as any).lat || 38.5, 
          lng: (r as any).lng || 23.5 
        })));
        
        setPrefectures(prefecturesData.map(p => ({ 
          ...p, 
          lat: (p as any).lat || 38.5, 
          lng: (p as any).lng || 23.5 
        })));
        
        setCities(citiesData.map(c => ({ 
          ...c, 
          lat: (c as any).lat || 38.5, 
          lng: (c as any).lng || 23.5 
        })));
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleRegionClick = (id: string, slug?: string) => {
    console.log('Region clicked:', id, slug);
    // Navigate or show details
    if (slug) {
      // window.location.href = `/regions/${slug}`;
    }
  };

  const handlePrefectureClick = (id: string, slug?: string) => {
    console.log('Prefecture clicked:', id, slug);
    if (slug) {
      // window.location.href = `/prefectures/${slug}`;
    }
  };

  const handleCityClick = (id: string, slug?: string) => {
    console.log('City clicked:', id, slug);
    if (slug) {
      // window.location.href = `/cities/${slug}`;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Εξερεύνηση Ελλάδας</h1>
        <p className="text-lg text-muted-foreground">
          Διαδραστικός χάρτης με περιφέρειες, νομούς, δήμους και οικισμούς
        </p>
      </div>

      {/* Unified Map with GeoJSON */}
      <UnifiedMap
        regions={regions}
        prefectures={prefectures}
        cities={cities}
        useGeoJSON={true}
        onRegionClick={handleRegionClick}
        onPrefectureClick={handlePrefectureClick}
        onCityClick={handleCityClick}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
        <p className="text-sm text-blue-800">
          Κάντε κλικ σε μια περιοχή για να δείτε περισσότερες λεπτομέρειες. 
          Με το <code className="bg-blue-100 px-1 rounded">useGeoJSON=true</code> βλέπετε polygons, 
          διαφορετικά θα δείτε markers.
        </p>
      </div>
    </div>
  );
}
