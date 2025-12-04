-- Recipe Collections/Playlists System

CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, slug)
);

CREATE TABLE IF NOT EXISTS collection_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_public ON collections(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_collection_recipes_collection ON collection_recipes(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_recipe ON collection_recipes(recipe_id);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public collections are viewable by everyone"
ON collections FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own collections"
ON collections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
ON collections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
ON collections FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Collection recipes visible if collection visible"
ON collection_recipes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_recipes.collection_id
        AND (collections.is_public = true OR collections.user_id = auth.uid())
    )
);

CREATE POLICY "Users can add recipes to their collections"
ON collection_recipes FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_recipes.collection_id
        AND collections.user_id = auth.uid()
    )
);

CREATE POLICY "Users can manage their collection recipes"
ON collection_recipes FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_recipes.collection_id
        AND collections.user_id = auth.uid()
    )
);

CREATE POLICY "Users can remove from their collections"
ON collection_recipes FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_recipes.collection_id
        AND collections.user_id = auth.uid()
    )
);
