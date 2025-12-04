-- Nutritional Information
-- Add nutrition fields to recipes

DO $$ 
BEGIN
    -- Add nutrition columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'calories') THEN
        ALTER TABLE recipes ADD COLUMN calories INT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'protein_g') THEN
        ALTER TABLE recipes ADD COLUMN protein_g DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'carbs_g') THEN
        ALTER TABLE recipes ADD COLUMN carbs_g DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'fat_g') THEN
        ALTER TABLE recipes ADD COLUMN fat_g DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'fiber_g') THEN
        ALTER TABLE recipes ADD COLUMN fiber_g DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'sugar_g') THEN
        ALTER TABLE recipes ADD COLUMN sugar_g DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'sodium_mg') THEN
        ALTER TABLE recipes ADD COLUMN sodium_mg INT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'allergens') THEN
        ALTER TABLE recipes ADD COLUMN allergens TEXT[];
    END IF;
END $$;

-- Equipment Required Field
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'equipment') THEN
        ALTER TABLE recipes ADD COLUMN equipment TEXT[];
    END IF;
END $$;

-- Video Tutorial Field
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'video_url') THEN
        ALTER TABLE recipes ADD COLUMN video_url TEXT;
    END IF;
END $$;

-- Wine Pairing Field
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'wine_pairing') THEN
        ALTER TABLE recipes ADD COLUMN wine_pairing TEXT;
    END IF;
END $$;

-- Seasonal Tags
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'seasons') THEN
        ALTER TABLE recipes ADD COLUMN seasons TEXT[];
    END IF;
END $$;

-- Source/Attribution (for remixed recipes)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'source_recipe_id') THEN
        ALTER TABLE recipes ADD COLUMN source_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'source_attribution') THEN
        ALTER TABLE recipes ADD COLUMN source_attribution TEXT;
    END IF;
END $$;

-- Create index for source recipes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipes_source') THEN
        CREATE INDEX idx_recipes_source ON recipes(source_recipe_id) WHERE source_recipe_id IS NOT NULL;
    END IF;
END $$;
