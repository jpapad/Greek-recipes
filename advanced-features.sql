-- Add video URL field to recipes
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add SEO fields for admin
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Add draft/published status
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;

-- User collections table
CREATE TABLE IF NOT EXISTS user_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    recipe_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for collections
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own collections"
    ON user_collections FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own collections"
    ON user_collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
    ON user_collections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
    ON user_collections FOR DELETE
    USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_collections_updated_at
    BEFORE UPDATE ON user_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Recipe views tracking
CREATE TABLE IF NOT EXISTS recipe_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    session_id TEXT
);

CREATE INDEX idx_recipe_views_recipe_id ON recipe_views(recipe_id);
CREATE INDEX idx_recipe_views_user_id ON recipe_views(user_id);
CREATE INDEX idx_recipe_views_viewed_at ON recipe_views(viewed_at);

-- Ingredient substitutions table
CREATE TABLE IF NOT EXISTS ingredient_substitutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient TEXT NOT NULL,
    substitute TEXT NOT NULL,
    ratio TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Make it public readable
ALTER TABLE ingredient_substitutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view substitutions"
    ON ingredient_substitutions FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage substitutions"
    ON ingredient_substitutions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'is_admin' = 'true'
        )
    );
