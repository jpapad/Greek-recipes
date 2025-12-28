# 🗺️ UnifiedMap - Ενοποιημένος Χάρτης

## Επισκόπηση

Το **UnifiedMap** συνδυάζει τη λογική του υπάρχοντος `HierarchicalMap` με τις δυνατότητες GeoJSON του νέου `DrillDownMap`.

## ✨ Χαρακτηριστικά

- ✅ **Dual Mode**: Markers (CircleMarker) ή GeoJSON Polygons
- ✅ **4 Επίπεδα**: Regions → Prefectures → Cities → Settlements
- ✅ **Lazy Loading**: Settlements φορτώνονται on-demand
- ✅ **Marker Clustering**: Αυτόματο για settlements
- ✅ **Navigation History**: Back button + Home button
- ✅ **Callbacks**: onRegionClick, onPrefectureClick, onCityClick
- ✅ **Existing Data Types**: Χρησιμοποιεί Region, Prefecture, City από @/lib/types
- ✅ **UI Consistency**: Breadcrumbs, legend, loading states

## 🎯 Usage Examples

### 1. Basic με Markers (χωρίς GeoJSON)

```tsx
"use client";
import dynamic from 'next/dynamic';

const UnifiedMap = dynamic(() => import('@/components/maps/UnifiedMap'), { ssr: false });

export default function MapPage() {
  return (
    <UnifiedMap
      regions={regionsWithCoordinates}
      prefectures={prefecturesWithCoordinates}
      cities={citiesWithCoordinates}
      useGeoJSON={false} // Markers only
      onRegionClick={(id, slug) => router.push(`/regions/${slug}`)}
      onPrefectureClick={(id, slug) => router.push(`/prefectures/${slug}`)}
      onCityClick={(id, slug) => router.push(`/cities/${slug}`)}
    />
  );
}
```

### 2. Advanced με GeoJSON Polygons

```tsx
<UnifiedMap
  regions={regions}
  prefectures={prefectures}
  cities={cities}
  useGeoJSON={true} // Enable GeoJSON
  regionsGeoJSON="/data/regions_simplified_0.01deg.geojson"
  prefecturesGeoJSON="/data/nomoi_simplified_0.01deg.geojson"
  citiesGeoJSON="/data/municipalities_simplified_0.005deg.geojson"
  settlementsGeoJSON="/data/settlements.geojson"
  onRegionClick={(id, slug) => console.log('Region:', slug)}
  onPrefectureClick={(id, slug) => console.log('Prefecture:', slug)}
  onCityClick={(id, slug) => console.log('City:', slug)}
/>
```

### 3. Με Custom Navigation

```tsx
const handleRegionClick = (id: string, slug?: string) => {
  // Custom logic
  analytics.track('region_viewed', { id, slug });
  router.push(`/regions/${slug}/recipes`);
};

<UnifiedMap
  regions={regions}
  prefectures={prefectures}
  cities={cities}
  onRegionClick={handleRegionClick}
  // ... other props
/>
```

## 📦 Props API

```typescript
interface UnifiedMapProps {
  // Required: Data με coordinates
  regions: (Region & { lat: number; lng: number })[];
  prefectures: (Prefecture & { lat: number; lng: number })[];
  cities: (City & { lat: number; lng: number })[];
  
  // Optional: GeoJSON mode
  useGeoJSON?: boolean; // default: false
  regionsGeoJSON?: string; // default: '/data/regions_simplified_0.01deg.geojson'
  prefecturesGeoJSON?: string; // default: '/data/nomoi_simplified_0.01deg.geojson'
  citiesGeoJSON?: string; // default: '/data/municipalities_simplified_0.005deg.geojson'
  settlementsGeoJSON?: string; // default: '/data/settlements.geojson'
  
  // Optional: Callbacks
  onRegionClick?: (id: string, slug?: string) => void;
  onPrefectureClick?: (id: string, slug?: string) => void;
  onCityClick?: (id: string, slug?: string) => void;
  
  // Optional: Styling
  className?: string;
}
```

## 🔄 Mode Comparison

| Feature | Markers Mode (useGeoJSON=false) | GeoJSON Mode (useGeoJSON=true) |
|---------|--------------------------------|--------------------------------|
| Visual | CircleMarkers | Polygons + Settlements clustering |
| Data Source | lat/lng από database | GeoJSON files |
| Levels | 3 (regions→prefectures→cities) | 4 (regions→prefectures→cities→settlements) |
| Performance | ✅ Lighter | ⚠️ Heavier (larger files) |
| Accuracy | ⚠️ Point-based | ✅ True boundaries |
| Setup Complexity | ✅ Simple | ⚠️ Requires GeoJSON files |

## 📁 Data Requirements

### For Markers Mode
```typescript
// Database πρέπει να έχει lat/lng στα tables
const regions = await getRegions(); // Must include lat, lng
const prefectures = await getPrefectures(); // Must include lat, lng
const cities = await getCities(); // Must include lat, lng
```

### For GeoJSON Mode
```
/public/data/
  ├── regions_simplified_0.01deg.geojson
  ├── nomoi_simplified_0.01deg.geojson
  ├── municipalities_simplified_0.005deg.geojson
  └── settlements.geojson
```

**GeoJSON Properties Required:**
- Regions: `region_id`, `name`
- Nomoi/Prefectures: `nomos_id`, `region_id`, `name`
- Municipalities/Cities: `municipality_id`, `nomos_id`, `name`
- Settlements: `settlement_id`, `municipality_id`, `name` (Point geometry)

## 🎨 Customization

### Change Colors

```typescript
// Edit UnifiedMap.tsx
const getGeoJSONStyle = () => ({
  fillColor: '#your-color', // Polygon fill
  color: '#your-border', // Border color
  fillOpacity: 0.2,
  weight: 2,
});
```

### Adjust Map Bounds/Zoom

```typescript
// Initial state
const [mapCenter, setMapCenter] = useState<[number, number]>([38.5, 23.5]);
const [mapZoom, setMapZoom] = useState<number>(6);

// Per-level zoom
handleRegionClick: setMapZoom(8)
handlePrefectureClick: setMapZoom(10)
handleCityClick: setMapZoom(12)
```

### Custom Legend Colors

```tsx
// In UnifiedMap.tsx return section
<div className="w-4 h-4 bg-red-500 rounded-full"></div> // Regions
<div className="w-4 h-4 bg-blue-500 rounded-full"></div> // Prefectures
<div className="w-4 h-4 bg-green-500 rounded-full"></div> // Cities
<div className="w-4 h-4 bg-purple-500 rounded-full"></div> // Settlements
```

## 🚀 Integration με Existing Components

### Αντικατάσταση HierarchicalMap

**Before:**
```tsx
import { HierarchicalMap } from '@/components/regions/HierarchicalMap';

<HierarchicalMap
  regions={regions}
  prefectures={prefectures}
  cities={cities}
  onRegionClick={(id) => ...}
  onPrefectureClick={(id) => ...}
  onCityClick={(slug) => ...}
/>
```

**After:**
```tsx
import dynamic from 'next/dynamic';
const UnifiedMap = dynamic(() => import('@/components/maps/UnifiedMap'), { ssr: false });

<UnifiedMap
  regions={regions}
  prefectures={prefectures}
  cities={cities}
  useGeoJSON={false} // Markers mode (same as before)
  onRegionClick={(id, slug) => ...} // Now includes slug
  onPrefectureClick={(id, slug) => ...}
  onCityClick={(id, slug) => ...}
/>
```

### Χρήση με GreeceMap Logic

**Before:**
```tsx
import { GreeceMap } from '@/components/regions/GreeceMap';

<GreeceMap
  regions={regions}
  onRegionClick={(slug) => router.push(`/regions/${slug}`)}
/>
```

**After:**
```tsx
import dynamic from 'next/dynamic';
const UnifiedMap = dynamic(() => import('@/components/maps/UnifiedMap'), { ssr: false });

<UnifiedMap
  regions={regions}
  prefectures={[]} // Empty if not needed
  cities={[]} // Empty if not needed
  useGeoJSON={true} // For polygon visualization
  onRegionClick={(id, slug) => router.push(`/regions/${slug}`)}
/>
```

## 🔗 Routes

### Νέα Routes που Δημιουργήθηκαν

1. **`/regions/map`** - Original DrillDownMap (GeoJSON only)
2. **`/regions/explore`** - UnifiedMap με data loading example

### Σύνδεση με Υπάρχουσες Routes

```tsx
// Add link in navigation
<Link href="/regions/explore">
  🗺️ Εξερεύνηση Χάρτη
</Link>
```

## 📊 Performance Tips

1. **Use Markers Mode** για γρήγορη εμφάνιση (3 επίπεδα)
2. **Use GeoJSON Mode** για ακριβή boundaries (4 επίπεδα)
3. **Lazy Load** settlements μόνο όταν χρειάζονται
4. **Simplify** GeoJSON files (0.01deg για regions/nomoi, 0.005deg για municipalities)
5. **Enable Clustering** στο settlements level

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Markers δεν εμφανίζονται | Check ότι regions/prefectures/cities έχουν lat, lng |
| GeoJSON δεν φορτώνει | Check paths και ότι files υπάρχουν στο /public/data/ |
| Clustering δεν δουλεύει | Μόνο στο settlements level με useGeoJSON=true |
| "window is not defined" | Χρησιμοποίησε dynamic import με ssr: false |
| Callbacks δεν τρέχουν | Check ότι περνάς functions στα props |

## 📚 Related Files

- **UnifiedMap Component**: `src/components/maps/UnifiedMap.tsx`
- **Original DrillDown**: `src/components/maps/DrillDownMap.tsx`
- **Example Page**: `src/app/regions/explore/page.tsx`
- **Types**: `src/lib/types.ts` (Region, Prefecture, City)
- **Map Types**: `src/lib/types/map.ts` (GeoJSON types)

## 🎯 Migration Path

### Step 1: Add Coordinates to Database
```sql
ALTER TABLE regions ADD COLUMN lat NUMERIC;
ALTER TABLE regions ADD COLUMN lng NUMERIC;
-- Repeat for prefectures, cities
```

### Step 2: Update API Functions
```typescript
// src/lib/api.ts
export async function getRegions() {
  const { data } = await supabase
    .from('regions')
    .select('*, lat, lng'); // Include coordinates
  return data || [];
}
```

### Step 3: Replace Component
```tsx
// Replace HierarchicalMap with UnifiedMap
import dynamic from 'next/dynamic';
const UnifiedMap = dynamic(() => import('@/components/maps/UnifiedMap'), { ssr: false });
```

### Step 4: (Optional) Enable GeoJSON
- Add GeoJSON files to `/public/data/`
- Set `useGeoJSON={true}` prop

---

**Ready!** Ο UnifiedMap συνδυάζει το καλύτερο και των δύο κόσμων! 🗺️✨
