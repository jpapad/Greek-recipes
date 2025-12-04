-- Add latitude and longitude columns to regions table
ALTER TABLE regions 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 6),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 6);

-- Update existing regions with coordinates
UPDATE regions SET latitude = 35.24, longitude = 25.0 WHERE slug = 'crete';
UPDATE regions SET latitude = 37.08, longitude = 25.36 WHERE slug = 'cyclades';
UPDATE regions SET latitude = 37.5, longitude = 22.4 WHERE slug = 'peloponnese';
UPDATE regions SET latitude = 40.64, longitude = 22.94 WHERE slug = 'macedonia';
UPDATE regions SET latitude = 39.64, longitude = 22.42 WHERE slug = 'thessaly';

-- Add comment
COMMENT ON COLUMN regions.latitude IS 'Latitude coordinate for map pin placement';
COMMENT ON COLUMN regions.longitude IS 'Longitude coordinate for map pin placement';
