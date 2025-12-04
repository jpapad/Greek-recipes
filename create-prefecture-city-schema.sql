-- Create prefectures table
CREATE TABLE IF NOT EXISTS prefectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    description TEXT,
    image_url TEXT,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    prefecture_id UUID REFERENCES prefectures(id) ON DELETE CASCADE,
    description TEXT,
    image_url TEXT,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_prefectures_region_id ON prefectures(region_id);
CREATE INDEX IF NOT EXISTS idx_prefectures_slug ON prefectures(slug);
CREATE INDEX IF NOT EXISTS idx_cities_prefecture_id ON cities(prefecture_id);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);

-- Update recipes table to support linking to prefecture or city
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS prefecture_id UUID REFERENCES prefectures(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES cities(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_recipes_prefecture_id ON recipes(prefecture_id);
CREATE INDEX IF NOT EXISTS idx_recipes_city_id ON recipes(city_id);

-- Enable RLS policies for prefectures
ALTER TABLE prefectures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view prefectures"
ON prefectures FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert prefectures"
ON prefectures FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update prefectures"
ON prefectures FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete prefectures"
ON prefectures FOR DELETE
TO authenticated
USING (true);

-- Enable RLS policies for cities
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view cities"
ON cities FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert cities"
ON cities FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update cities"
ON cities FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete cities"
ON cities FOR DELETE
TO authenticated
USING (true);

-- Add comments
COMMENT ON TABLE prefectures IS 'Greek prefectures (νομοί) belonging to regions';
COMMENT ON TABLE cities IS 'Greek cities and villages belonging to prefectures';
COMMENT ON COLUMN prefectures.region_id IS 'Foreign key to parent region';
COMMENT ON COLUMN cities.prefecture_id IS 'Foreign key to parent prefecture';
