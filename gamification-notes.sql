-- Gamification & Badges System

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    category TEXT, -- e.g., 'recipes', 'reviews', 'cooking'
    requirement_type TEXT NOT NULL, -- 'recipe_count', 'review_count', 'favorite_count', etc.
    requirement_value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);

-- Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
ON badges FOR SELECT
USING (true);

CREATE POLICY "User badges are viewable by everyone"
ON user_badges FOR SELECT
USING (true);

CREATE POLICY "System can award badges"
ON user_badges FOR INSERT
WITH CHECK (true);

-- Insert initial badges
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value) VALUES
('First Recipe', 'Created your first recipe', '👨‍🍳', 'recipes', 'recipe_count', 1),
('Recipe Master', 'Created 10 recipes', '🏆', 'recipes', 'recipe_count', 10),
('Recipe Legend', 'Created 50 recipes', '👑', 'recipes', 'recipe_count', 50),
('Helpful Reviewer', 'Wrote 5 reviews', '⭐', 'reviews', 'review_count', 5),
('Review Expert', 'Wrote 25 reviews', '🌟', 'reviews', 'review_count', 25),
('Food Lover', 'Favorited 10 recipes', '❤️', 'favorites', 'favorite_count', 10),
('Cooking Enthusiast', 'Used cooking mode 10 times', '🔥', 'cooking', 'cook_mode_count', 10)
ON CONFLICT (name) DO NOTHING;

-- Recipe Notes/Variations
CREATE TABLE IF NOT EXISTS recipe_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    notes TEXT NOT NULL,
    modifications JSONB, -- Store ingredient/step modifications
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipe_notes_recipe ON recipe_notes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_notes_user ON recipe_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_notes_public ON recipe_notes(is_public) WHERE is_public = true;

ALTER TABLE recipe_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public notes are viewable by everyone"
ON recipe_notes FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
ON recipe_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
ON recipe_notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
ON recipe_notes FOR DELETE
USING (auth.uid() = user_id);
