-- Social Sharing & SEO Enhancements
-- Add view counter and social sharing metadata

-- Add views tracking
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Create views log table for analytics
CREATE TABLE IF NOT EXISTS recipe_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_recipe_views_recipe ON recipe_views(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_views_date ON recipe_views(viewed_at);

-- Enable RLS
ALTER TABLE recipe_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recipe views"
ON recipe_views FOR SELECT
USING (true);

CREATE POLICY "System can insert views"
ON recipe_views FOR INSERT
WITH CHECK (true);
