-- Advanced Search Schema for Greek Recipes
-- Add dietary tags and search capabilities

-- Add dietary tags columns to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_dairy_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS keywords TEXT[]; -- Array of searchable keywords

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_time ON recipes(time_minutes);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary ON recipes(is_vegetarian, is_vegan, is_gluten_free, is_dairy_free);
CREATE INDEX IF NOT EXISTS idx_recipes_keywords ON recipes USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_recipes_title_search ON recipes USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients ON recipes USING GIN(ingredients);

-- Add full-text search function
CREATE OR REPLACE FUNCTION search_recipes(
    search_query TEXT DEFAULT NULL,
    filter_difficulty TEXT DEFAULT NULL,
    filter_category TEXT DEFAULT NULL,
    filter_region_id UUID DEFAULT NULL,
    filter_prefecture_id UUID DEFAULT NULL,
    filter_city_id UUID DEFAULT NULL,
    min_time INT DEFAULT NULL,
    max_time INT DEFAULT NULL,
    filter_vegetarian BOOLEAN DEFAULT NULL,
    filter_vegan BOOLEAN DEFAULT NULL,
    filter_gluten_free BOOLEAN DEFAULT NULL,
    filter_dairy_free BOOLEAN DEFAULT NULL
)
RETURNS SETOF recipes AS $$
BEGIN
    RETURN QUERY
    SELECT r.* FROM recipes r
    WHERE
        (search_query IS NULL OR (
            r.title ILIKE '%' || search_query || '%' OR
            r.short_description ILIKE '%' || search_query || '%' OR
            r.category ILIKE '%' || search_query || '%' OR
            EXISTS (
                SELECT 1 FROM unnest(r.ingredients) AS ingredient
                WHERE ingredient ILIKE '%' || search_query || '%'
            )
        ))
        AND (filter_difficulty IS NULL OR r.difficulty = filter_difficulty)
        AND (filter_category IS NULL OR r.category = filter_category)
        AND (filter_region_id IS NULL OR r.region_id = filter_region_id)
        AND (filter_prefecture_id IS NULL OR r.prefecture_id = filter_prefecture_id)
        AND (filter_city_id IS NULL OR r.city_id = filter_city_id)
        AND (min_time IS NULL OR r.time_minutes >= min_time)
        AND (max_time IS NULL OR r.time_minutes <= max_time)
        AND (filter_vegetarian IS NULL OR r.is_vegetarian = filter_vegetarian)
        AND (filter_vegan IS NULL OR r.is_vegan = filter_vegan)
        AND (filter_gluten_free IS NULL OR r.is_gluten_free = filter_gluten_free)
        AND (filter_dairy_free IS NULL OR r.is_dairy_free = filter_dairy_free)
    ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;
