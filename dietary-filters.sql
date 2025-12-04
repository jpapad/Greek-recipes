-- Add dietary and allergen fields to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS dietary_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS allergens TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_dairy_free BOOLEAN DEFAULT false;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_tags ON recipes USING GIN (dietary_tags);
CREATE INDEX IF NOT EXISTS idx_recipes_allergens ON recipes USING GIN (allergens);
CREATE INDEX IF NOT EXISTS idx_recipes_vegetarian ON recipes (is_vegetarian);
CREATE INDEX IF NOT EXISTS idx_recipes_vegan ON recipes (is_vegan);
CREATE INDEX IF NOT EXISTS idx_recipes_gluten_free ON recipes (is_gluten_free);
CREATE INDEX IF NOT EXISTS idx_recipes_dairy_free ON recipes (is_dairy_free);

-- Update some sample data (optional - for testing)
-- Example: Mark some recipes as vegetarian
UPDATE recipes 
SET is_vegetarian = true,
    dietary_tags = ARRAY['Vegetarian', 'Mediterranean']
WHERE id IN (
  SELECT id FROM recipes 
  WHERE category = 'Salad' OR category = 'Appetizer'
  LIMIT 5
);

COMMENT ON COLUMN recipes.dietary_tags IS 'Tags like Keto, Paleo, Mediterranean, Low-Carb, etc.';
COMMENT ON COLUMN recipes.allergens IS 'Common allergens like Nuts, Dairy, Gluten, Eggs, Shellfish, etc.';
COMMENT ON COLUMN recipes.is_vegetarian IS 'No meat or fish';
COMMENT ON COLUMN recipes.is_vegan IS 'No animal products';
COMMENT ON COLUMN recipes.is_gluten_free IS 'No wheat, barley, rye';
COMMENT ON COLUMN recipes.is_dairy_free IS 'No milk, cheese, yogurt';
