-- User Favorites Table
-- Run this in your Supabase SQL Editor

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

-- Create index for better performance
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_recipe_id ON user_favorites(recipe_id);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see and manage their own favorites
CREATE POLICY "Users can view their own favorites"
    ON user_favorites FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
    ON user_favorites FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
    ON user_favorites FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
