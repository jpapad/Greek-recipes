-- User Following System
-- Allows users to follow each other

CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);

-- RLS Policies
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access user_follows" ON user_follows;
CREATE POLICY "Public Read Access user_follows"
    ON user_follows FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users Manage Own Follows" ON user_follows;
CREATE POLICY "Users Manage Own Follows"
    ON user_follows FOR ALL
    USING (auth.uid() = follower_id);

-- Activity Feed Table
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'cooked', 'favorited', 'reviewed', 'created'
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    metadata JSONB, -- Additional activity data
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);

-- RLS Policies
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access user_activities" ON user_activities;
CREATE POLICY "Public Read Access user_activities"
    ON user_activities FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users Manage Own Activities" ON user_activities;
CREATE POLICY "Users Manage Own Activities"
    ON user_activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to create activity when user favorites a recipe
CREATE OR REPLACE FUNCTION create_favorite_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_activities (user_id, activity_type, recipe_id)
    VALUES (NEW.user_id, 'favorited', NEW.recipe_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if favorites table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'favorites'
    ) THEN
        DROP TRIGGER IF EXISTS favorite_activity_trigger ON favorites;
        CREATE TRIGGER favorite_activity_trigger
            AFTER INSERT ON favorites
            FOR EACH ROW
            EXECUTE FUNCTION create_favorite_activity();
    END IF;
END $$;
