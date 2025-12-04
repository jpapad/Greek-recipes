-- Ingredient Substitutions Table
CREATE TABLE IF NOT EXISTS ingredient_substitutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_name TEXT NOT NULL,
    substitute_name TEXT NOT NULL,
    substitute_ratio TEXT DEFAULT '1:1',
    notes TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ingredient_name, substitute_name)
);

-- Index for fast searches
CREATE INDEX IF NOT EXISTS idx_substitutions_ingredient ON ingredient_substitutions(ingredient_name);
CREATE INDEX IF NOT EXISTS idx_substitutions_category ON ingredient_substitutions(category);

-- Enable RLS
ALTER TABLE ingredient_substitutions ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read substitutions" ON ingredient_substitutions;
CREATE POLICY "Public read substitutions"
ON ingredient_substitutions FOR SELECT
USING (true);

-- Admin insert/update/delete
DROP POLICY IF EXISTS "Admin manage substitutions" ON ingredient_substitutions;
CREATE POLICY "Admin manage substitutions"
ON ingredient_substitutions FOR ALL
TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true)
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true);

-- Insert common Greek ingredient substitutions
INSERT INTO ingredient_substitutions (ingredient_name, substitute_name, substitute_ratio, notes, category)
VALUES
    -- Dairy
    ('feta cheese', 'ricotta cheese', '1:1', 'Use salted ricotta for closer flavor', 'dairy'),
    ('feta cheese', 'goat cheese', '1:1', 'Tangier flavor, similar texture', 'dairy'),
    ('greek yogurt', 'sour cream', '1:1', 'Similar consistency', 'dairy'),
    ('greek yogurt', 'plain yogurt', '1:1', 'Thinner consistency', 'dairy'),
    ('kasseri cheese', 'provolone', '1:1', 'Similar melting properties', 'dairy'),
    ('halloumi', 'paneer', '1:1', 'Similar grilling properties', 'dairy'),
    
    -- Oils & Fats
    ('olive oil', 'vegetable oil', '1:1', 'Less flavor, higher smoke point', 'oils'),
    ('olive oil', 'butter', '3:4', 'Use 3/4 cup butter for 1 cup oil', 'oils'),
    ('butter', 'olive oil', '4:3', 'Use 3/4 cup oil for 1 cup butter', 'oils'),
    
    -- Herbs & Spices
    ('fresh oregano', 'dried oregano', '3:1', '1 tbsp fresh = 1 tsp dried', 'herbs'),
    ('fresh dill', 'dried dill', '3:1', '1 tbsp fresh = 1 tsp dried', 'herbs'),
    ('fresh mint', 'dried mint', '3:1', '1 tbsp fresh = 1 tsp dried', 'herbs'),
    ('fresh parsley', 'dried parsley', '3:1', '1 tbsp fresh = 1 tsp dried', 'herbs'),
    
    -- Vegetables
    ('fresh tomatoes', 'canned tomatoes', '1:1', 'Drain canned tomatoes', 'vegetables'),
    ('bell peppers', 'poblano peppers', '1:1', 'Slightly spicier', 'vegetables'),
    ('zucchini', 'eggplant', '1:1', 'Similar texture when cooked', 'vegetables'),
    
    -- Grains & Legumes
    ('orzo', 'rice', '1:1', 'Similar cooking time', 'grains'),
    ('bulgur wheat', 'quinoa', '1:1', 'Gluten-free option', 'grains'),
    ('chickpeas', 'white beans', '1:1', 'Similar texture', 'legumes'),
    
    -- Proteins
    ('lamb', 'beef', '1:1', 'Similar cooking methods', 'proteins'),
    ('lamb', 'goat', '1:1', 'Very similar flavor', 'proteins'),
    ('anchovies', 'capers', '1:2', 'Use double capers for salt/umami', 'proteins'),
    
    -- Sweeteners
    ('honey', 'maple syrup', '1:1', 'Different flavor profile', 'sweeteners'),
    ('honey', 'agave nectar', '1:1', 'Neutral flavor', 'sweeteners'),
    
    -- Acids
    ('lemon juice', 'white wine vinegar', '1:1', 'Less citrus flavor', 'acids'),
    ('red wine vinegar', 'balsamic vinegar', '1:1', 'Sweeter, darker', 'acids'),
    
    -- Nuts
    ('pine nuts', 'walnuts', '1:1', 'Different texture', 'nuts'),
    ('pine nuts', 'almonds', '1:1', 'Chop finely', 'nuts'),
    
    -- Vegan/Dietary
    ('feta cheese', 'tofu feta', '1:1', 'Vegan option, marinate in brine', 'vegan'),
    ('greek yogurt', 'coconut yogurt', '1:1', 'Dairy-free option', 'vegan'),
    ('butter', 'vegan butter', '1:1', 'Plant-based option', 'vegan'),
    ('honey', 'maple syrup', '1:1', 'Vegan sweetener', 'vegan')
ON CONFLICT (ingredient_name, substitute_name) DO NOTHING;
