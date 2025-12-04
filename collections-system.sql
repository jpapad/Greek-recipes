-- Collections System Database Schema
-- Run this in Supabase SQL Editor

-- 1. Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, slug)
);

-- 2. Collection Recipes Junction Table (many-to-many)
CREATE TABLE IF NOT EXISTS collection_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT, -- User's personal notes about this recipe in the collection
  
  UNIQUE(collection_id, recipe_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_public ON collections(is_public);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_collection ON collection_recipes(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_recipe ON collection_recipes(recipe_id);

-- Row Level Security Policies

-- Collections: Users can manage their own, public collections are visible to all
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public collections" ON collections;
CREATE POLICY "Anyone can view public collections"
  ON collections FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own collections" ON collections;
CREATE POLICY "Users can view their own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own collections" ON collections;
CREATE POLICY "Users can create their own collections"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own collections" ON collections;
CREATE POLICY "Users can update their own collections"
  ON collections FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own collections" ON collections;
CREATE POLICY "Users can delete their own collections"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);

-- Collection Recipes: Follow parent collection permissions
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public collection recipes" ON collection_recipes;
CREATE POLICY "Anyone can view public collection recipes"
  ON collection_recipes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_recipes.collection_id
      AND (collections.is_public = true OR collections.user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can manage their collection recipes" ON collection_recipes;
CREATE POLICY "Users can manage their collection recipes"
  ON collection_recipes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_recipes.collection_id
      AND collections.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_recipes.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON collections TO anon, authenticated;
GRANT SELECT ON collection_recipes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON collections TO authenticated;
GRANT INSERT, UPDATE, DELETE ON collection_recipes TO authenticated;
