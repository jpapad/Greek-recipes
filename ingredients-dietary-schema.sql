-- Ingredients Library System
-- Master database of ingredients with categories, units, substitutions

-- Ingredients Master Table
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    name_el TEXT NOT NULL,
    category TEXT NOT NULL, -- 'vegetables', 'meats', 'dairy', 'grains', 'spices', 'herbs', 'oils', 'other'
    subcategory TEXT,
    description TEXT,
    nutritional_info JSONB DEFAULT '{}'::jsonb, -- calories, protein, carbs, fat per 100g
    common_units JSONB DEFAULT '[]'::jsonb, -- ['kg', 'g', 'pieces', 'cups', 'tbsp']
    average_price_per_unit DECIMAL(10, 2),
    season TEXT[], -- ['spring', 'summer', 'fall', 'winter', 'year-round']
    origin_region TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Ingredient Substitutions
CREATE TABLE IF NOT EXISTS ingredient_substitutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    substitute_ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    ratio DECIMAL(5, 2) DEFAULT 1.0, -- e.g., 1.5 means use 1.5x the amount
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(ingredient_id, substitute_ingredient_id)
);

-- Recipe Ingredients (normalized)
CREATE TABLE IF NOT EXISTS recipe_ingredients_normalized (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE SET NULL,
    quantity DECIMAL(10, 2),
    unit TEXT, -- 'kg', 'g', 'ml', 'pieces', 'cups', 'tbsp', etc.
    preparation_note TEXT, -- 'chopped', 'diced', 'minced', etc.
    is_optional BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Dietary Tags
CREATE TABLE IF NOT EXISTS dietary_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_el TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT, -- emoji or icon name
    color TEXT DEFAULT '#22c55e',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Recipe Dietary Tags Junction Table
CREATE TABLE IF NOT EXISTS recipe_dietary_tags (
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    dietary_tag_id UUID REFERENCES dietary_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, dietary_tag_id)
);

-- Insert default dietary tags
INSERT INTO dietary_tags (name, name_en, name_el, slug, description, icon, color) VALUES
('Vegetarian', 'Vegetarian', 'Χορτοφαγική', 'vegetarian', 'Contains no meat or fish', '🌱', '#22c55e'),
('Vegan', 'Vegan', 'Vegan', 'vegan', 'Contains no animal products', '🌿', '#16a34a'),
('Gluten-Free', 'Gluten-Free', 'Χωρίς Γλουτένη', 'gluten-free', 'Contains no gluten', '🌾', '#eab308'),
('Dairy-Free', 'Dairy-Free', 'Χωρίς Γαλακτοκομικά', 'dairy-free', 'Contains no dairy products', '🥛', '#06b6d4'),
('Keto', 'Keto', 'Keto', 'keto', 'Low-carb, high-fat diet', '🥑', '#8b5cf6'),
('Paleo', 'Paleo', 'Paleo', 'paleo', 'Based on ancient diet patterns', '🦴', '#f59e0b'),
('Low-Calorie', 'Low-Calorie', 'Χαμηλές Θερμίδες', 'low-calorie', 'Under 300 calories per serving', '⚖️', '#10b981'),
('High-Protein', 'High-Protein', 'Υψηλή Πρωτεΐνη', 'high-protein', 'Rich in protein', '💪', '#ef4444'),
('Mediterranean', 'Mediterranean', 'Μεσογειακή', 'mediterranean', 'Traditional Mediterranean diet', '🫒', '#ea580c'),
('Nut-Free', 'Nut-Free', 'Χωρίς Ξηρούς Καρπούς', 'nut-free', 'Contains no nuts', '🥜', '#dc2626')
ON CONFLICT (slug) DO NOTHING;

-- Insert common Greek ingredients
INSERT INTO ingredients (name, name_el, name_en, category, subcategory, common_units, season) VALUES
('Tomato', 'Ντομάτα', 'Tomato', 'vegetables', 'fruiting', '["kg", "pieces", "cans"]', '{summer}'),
('Potato', 'Πατάτα', 'Potato', 'vegetables', 'root', '["kg", "pieces"]', '{year-round}'),
('Onion', 'Κρεμμύδι', 'Onion', 'vegetables', 'bulb', '["kg", "pieces"]', '{year-round}'),
('Garlic', 'Σκόρδο', 'Garlic', 'vegetables', 'bulb', '["cloves", "heads"]', '{year-round}'),
('Olive Oil', 'Ελαιόλαδο', 'Olive Oil', 'oils', 'vegetable', '["ml", "l", "tbsp", "cup"]', '{year-round}'),
('Feta Cheese', 'Φέτα', 'Feta Cheese', 'dairy', 'cheese', '["g", "kg", "pieces"]', '{year-round}'),
('Oregano', 'Ρίγανη', 'Oregano', 'herbs', 'dried', '["g", "tbsp", "tsp"]', '{summer}'),
('Lemon', 'Λεμόνι', 'Lemon', 'fruits', 'citrus', '["pieces", "ml"]', '{year-round}'),
('Lamb', 'Αρνί', 'Lamb', 'meats', 'red', '["kg", "g"]', '{spring}'),
('Eggplant', 'Μελιτζάνα', 'Eggplant', 'vegetables', 'fruiting', '["kg", "pieces"]', '{summer}')
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_name_el ON ingredients(name_el);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients_normalized(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients_normalized(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_dietary_tags_slug ON dietary_tags(slug);

-- RLS Policies
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_substitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients_normalized ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_dietary_tags ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read ingredients" ON ingredients FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Public read substitutions" ON ingredient_substitutions FOR SELECT TO public USING (true);
CREATE POLICY "Public read recipe ingredients" ON recipe_ingredients_normalized FOR SELECT TO public USING (true);
CREATE POLICY "Public read dietary tags" ON dietary_tags FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Public read recipe dietary tags" ON recipe_dietary_tags FOR SELECT TO public USING (true);

-- Admins can manage
CREATE POLICY "Admins manage ingredients" ON ingredients FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins manage substitutions" ON ingredient_substitutions FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins manage dietary tags" ON dietary_tags FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_ingredients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ingredients_timestamp
BEFORE UPDATE ON ingredients
FOR EACH ROW
EXECUTE FUNCTION update_ingredients_updated_at();
