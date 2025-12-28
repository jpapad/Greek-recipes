"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Dynamic import to avoid SSR issues with Leaflet
const DrillDownMap = dynamic(() => import('@/components/maps/DrillDownMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-600 font-medium">Φόρτωση χάρτη...</p>
      </div>
    </div>
  ),
});

export default function RegionsMapPage() {
  return (
    <div className="relative w-full h-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[999] bg-gradient-to-b from-white/95 to-transparent backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Χάρτης Ελλάδας - Drill Down
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Εξερευνήστε περιφέρειες, νομούς, δήμους και οικισμούς
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-full pt-20">
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-gray-600 font-medium">Φόρτωση χάρτη...</p>
              </div>
            </div>
          }
        >
          <DrillDownMap />
        </Suspense>
      </div>
    </div>
  );
}
