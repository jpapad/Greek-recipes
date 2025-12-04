-- Add dietary tags and user tracking to recipes
-- Run this in Supabase SQL Editor

-- Add dietary columns
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN DEFAULT false;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT false;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN DEFAULT false;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_dairy_free BOOLEAN DEFAULT false;

-- Add keywords for better search
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_vegetarian ON recipes(is_vegetarian) WHERE is_vegetarian = true;
CREATE INDEX IF NOT EXISTS idx_recipes_vegan ON recipes(is_vegan) WHERE is_vegan = true;
CREATE INDEX IF NOT EXISTS idx_recipes_gluten_free ON recipes(is_gluten_free) WHERE is_gluten_free = true;
CREATE INDEX IF NOT EXISTS idx_recipes_dairy_free ON recipes(is_dairy_free) WHERE is_dairy_free = true;
CREATE INDEX IF NOT EXISTS idx_recipes_keywords ON recipes USING GIN(keywords);
