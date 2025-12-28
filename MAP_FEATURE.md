# Greek Recipes - Drill-Down Map Setup

## 🗺️ Drill-Down Interactive Map

Έχει προστεθεί διαδραστικός χάρτης με 4 επίπεδα drill-down για την εξερεύνηση των γεωγραφικών περιοχών της Ελλάδας.

### 📍 Χαρακτηριστικά

- **4 Επίπεδα Εξερεύνησης**: Περιφέρειες → Νομοί → Δήμοι → Οικισμοί
- **Lazy Loading**: Τα settlements φορτώνονται μόνο όταν χρειάζονται
- **Marker Clustering**: Αυτόματο clustering οικισμών με leaflet.markercluster
- **Interactive Polygons**: Hover effects και tooltips
- **Navigation**: Κουμπί "Πίσω" για επιστροφή στο προηγούμενο επίπεδο
- **SSR-Safe**: Dynamic import με { ssr: false } για Next.js compatibility

### 🚀 Πρόσβαση

Ο χάρτης είναι διαθέσιμος στο route:
```
/regions/map
```

### 📦 Dependencies που προστέθηκαν

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0",
  "leaflet.markercluster": "^1.5.3",
  "@types/leaflet": "^1.9.21",
  "@types/leaflet.markercluster": "^1.5.4"
}
```

### 📁 Αρχεία που Δημιουργήθηκαν

1. **`/src/lib/types/map.ts`**
   - TypeScript types για GeoJSON properties
   - MAP_LEVELS configuration
   - LevelConfig interfaces

2. **`/src/components/maps/DrillDownMap.tsx`**
   - Client Component με Leaflet logic
   - Drill-down navigation
   - Marker clustering για settlements
   - Polygon interactions

3. **`/src/app/regions/map/page.tsx`**
   - Server Component page
   - Dynamic import του χάρτη
   - Loading states

### 📁 Αρχεία που Τροποποιήθηκαν

1. **`/src/app/globals.css`**
   - Leaflet CSS imports
   - Custom tooltip styles
   - Marker cluster theming

### 🗂️ GeoJSON Data Structure

Τα GeoJSON files πρέπει να είναι στο `/public/data/`:

```
/public/data/
  ├── regions_simplified_0.01deg.geojson
  ├── nomoi_simplified_0.01deg.geojson
  ├── municipalities_simplified_0.005deg.geojson
  └── settlements.geojson
```

#### Required Properties:

**Regions:**
```json
{
  "region_id": "string",
  "name": "string"
}
```

**Nomoi:**
```json
{
  "nomos_id": "string",
  "region_id": "string",
  "name": "string"
}
```

**Municipalities:**
```json
{
  "municipality_id": "string",
  "nomos_id": "string",
  "region_id": "string",
  "name": "string"
}
```

**Settlements (Point geometry):**
```json
{
  "settlement_id": "string",
  "municipality_id": "string",
  "nomos_id": "string",
  "region_id": "string",
  "name": "string"
}
```

### 🎨 Customization

#### Αλλαγή χρωμάτων polygons:

Στο `DrillDownMap.tsx`, τροποποίησε το `getStyle()`:

```typescript
const getStyle = (feature?: Feature) => ({
  fillColor: '#your-color',
  fillOpacity: 0.2,
  color: '#your-border-color',
  weight: 2,
});
```

#### Αλλαγή marker icons:

Στο settlement rendering section:

```typescript
icon: L.divIcon({
  className: 'custom-marker-icon',
  html: '<div style="background-color: #your-color; ...">',
  // ...
}),
```

#### Αλλαγή cluster χρωμάτων:

Στο `globals.css`:

```css
.marker-cluster-small,
.marker-cluster-medium,
.marker-cluster-large {
  background-color: rgba(your-color, 0.6) !important;
}
```

### 🐛 Troubleshooting

#### "window is not defined" error:
- Βεβαιωθείτε ότι το `DrillDownMap` έχει `"use client"` directive
- Το dynamic import πρέπει να έχει `{ ssr: false }`

#### Markers δεν εμφανίζονται:
- Ελέγξτε ότι τα settlements έχουν Point geometry
- Ελέγξτε τις coordinates: [lng, lat] στο GeoJSON → [lat, lng] στο Leaflet

#### CSS δεν φορτώνει:
- Βεβαιωθείτε ότι έχουν γίνει install τα leaflet.markercluster
- Restart το dev server μετά από CSS αλλαγές

#### GeoJSON δεν φορτώνει:
- Ελέγξτε ότι τα files υπάρχουν στο `/public/data/`
- Ελέγξτε το console για fetch errors
- Validate το GeoJSON structure στο geojson.io

### 🎯 Next Steps

1. **Σύνδεση με Recipes**: Προσθήκη recipe counts ανά περιοχή
2. **Filters**: Φίλτρα για συγκεκριμένες κατηγορίες
3. **Heatmap**: Προσθήκη heatmap για δημοφιλείς περιοχές
4. **Performance**: Implement virtualization για μεγάλα datasets

### 📚 Documentation

- [Leaflet Docs](https://leafletjs.com/reference.html)
- [React-Leaflet Docs](https://react-leaflet.js.org/)
- [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)

---

**Έτοιμο!** Επισκεφθείτε το `/regions/map` για να δείτε τον χάρτη. 🗺️✨
