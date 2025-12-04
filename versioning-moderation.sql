-- Recipe Versioning System

CREATE TABLE IF NOT EXISTS recipe_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT,
    steps JSONB NOT NULL,
    ingredients JSONB NOT NULL,
    time_minutes INT,
    difficulty TEXT,
    servings INT,
    category TEXT,
    image_url TEXT,
    -- Nutrition fields
    calories INT,
    protein_g DECIMAL(10,2),
    carbs_g DECIMAL(10,2),
    fat_g DECIMAL(10,2),
    -- Other fields
    equipment TEXT[],
    video_url TEXT,
    wine_pairing TEXT,
    seasons TEXT[],
    allergens TEXT[],
    -- Meta
    changed_by UUID REFERENCES auth.users(id),
    change_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(recipe_id, version_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recipe_versions_recipe ON recipe_versions(recipe_id, version_number DESC);

-- RLS Policies
ALTER TABLE recipe_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access recipe_versions" ON recipe_versions;
CREATE POLICY "Public Read Access recipe_versions"
    ON recipe_versions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated Users Create Versions" ON recipe_versions;
CREATE POLICY "Authenticated Users Create Versions"
    ON recipe_versions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Function to create version on recipe update
CREATE OR REPLACE FUNCTION create_recipe_version()
RETURNS TRIGGER AS $$
DECLARE
    next_version INT;
BEGIN
    -- Get next version number
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO next_version
    FROM recipe_versions
    WHERE recipe_id = NEW.id;
    
    -- Insert version record
    INSERT INTO recipe_versions (
        recipe_id, version_number, title, short_description,
        steps, ingredients, time_minutes, difficulty, servings,
        category, image_url, calories, protein_g, carbs_g, fat_g,
        equipment, video_url, wine_pairing, seasons, allergens,
        changed_by
    )
    VALUES (
        NEW.id, next_version, NEW.title, NEW.short_description,
        NEW.steps, NEW.ingredients, NEW.time_minutes, NEW.difficulty, NEW.servings,
        NEW.category, NEW.image_url, NEW.calories, NEW.protein_g, NEW.carbs_g, NEW.fat_g,
        NEW.equipment, NEW.video_url, NEW.wine_pairing, NEW.seasons, NEW.allergens,
        auth.uid()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recipe_version_trigger ON recipes;
CREATE TRIGGER recipe_version_trigger
    AFTER UPDATE ON recipes
    FOR EACH ROW
    WHEN (
        OLD.title IS DISTINCT FROM NEW.title OR
        OLD.steps IS DISTINCT FROM NEW.steps OR
        OLD.ingredients IS DISTINCT FROM NEW.ingredients
    )
    EXECUTE FUNCTION create_recipe_version();

-- Moderation Queue
CREATE TABLE IF NOT EXISTS pending_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    short_description TEXT,
    steps JSONB NOT NULL,
    ingredients JSONB NOT NULL,
    time_minutes INT,
    difficulty TEXT,
    servings INT,
    category TEXT,
    image_url TEXT,
    region_id UUID REFERENCES regions(id),
    prefecture_id UUID,
    city_id UUID,
    -- Additional fields
    calories INT,
    equipment TEXT[],
    video_url TEXT,
    seasons TEXT[],
    allergens TEXT[],
    -- Moderation
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pending_recipes_status ON pending_recipes(status);
CREATE INDEX IF NOT EXISTS idx_pending_recipes_submitted_by ON pending_recipes(submitted_by);

-- RLS Policies
ALTER TABLE pending_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users Submit Recipes" ON pending_recipes;
CREATE POLICY "Users Submit Recipes"
    ON pending_recipes FOR INSERT
    WITH CHECK (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Users View Own Submissions" ON pending_recipes;
CREATE POLICY "Users View Own Submissions"
    ON pending_recipes FOR SELECT
    USING (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Admins View All Pending" ON pending_recipes;
CREATE POLICY "Admins View All Pending"
    ON pending_recipes FOR SELECT
    USING (
        (auth.jwt()->>'is_admin')::boolean = true
    );

DROP POLICY IF EXISTS "Admins Moderate Recipes" ON pending_recipes;
CREATE POLICY "Admins Moderate Recipes"
    ON pending_recipes FOR UPDATE
    USING (
        (auth.jwt()->>'is_admin')::boolean = true
    );
