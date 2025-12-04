-- Recipe Image Gallery System
-- Allows multiple images per recipe with captions and ordering

-- Recipe Images Table
CREATE TABLE IF NOT EXISTS recipe_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recipe_images_recipe_id ON recipe_images(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_images_display_order ON recipe_images(recipe_id, display_order);

-- RLS Policies
ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access recipe_images" ON recipe_images;
CREATE POLICY "Public Read Access recipe_images"
    ON recipe_images FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated Users Insert recipe_images" ON recipe_images;
CREATE POLICY "Authenticated Users Insert recipe_images"
    ON recipe_images FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Users Update recipe_images" ON recipe_images;
CREATE POLICY "Authenticated Users Update recipe_images"
    ON recipe_images FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated Users Delete recipe_images" ON recipe_images;
CREATE POLICY "Authenticated Users Delete recipe_images"
    ON recipe_images FOR DELETE
    USING (auth.role() = 'authenticated');

-- Function to ensure only one primary image per recipe
CREATE OR REPLACE FUNCTION ensure_one_primary_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = true THEN
        UPDATE recipe_images
        SET is_primary = false
        WHERE recipe_id = NEW.recipe_id
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_one_primary_image_trigger ON recipe_images;
CREATE TRIGGER ensure_one_primary_image_trigger
    BEFORE INSERT OR UPDATE ON recipe_images
    FOR EACH ROW
    EXECUTE FUNCTION ensure_one_primary_image();
