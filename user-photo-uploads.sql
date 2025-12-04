-- User Recipe Photos Table
CREATE TABLE IF NOT EXISTS user_recipe_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    UNIQUE(user_id, recipe_id) -- One photo per user per recipe
);

-- Create Storage Bucket for user photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-recipe-photos', 'user-recipe-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Read Access user-recipe-photos" ON storage.objects;
CREATE POLICY "Public Read Access user-recipe-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-recipe-photos');

DROP POLICY IF EXISTS "Authenticated Upload user-recipe-photos" ON storage.objects;
CREATE POLICY "Authenticated Upload user-recipe-photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-recipe-photos');

DROP POLICY IF EXISTS "Users Delete Own Photos user-recipe-photos" ON storage.objects;
CREATE POLICY "Users Delete Own Photos user-recipe-photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-recipe-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Table Policies
DROP POLICY IF EXISTS "Public read user_recipe_photos" ON user_recipe_photos;
CREATE POLICY "Public read user_recipe_photos"
ON user_recipe_photos FOR SELECT
USING (moderation_status = 'approved');

DROP POLICY IF EXISTS "Users insert own photos" ON user_recipe_photos;
CREATE POLICY "Users insert own photos"
ON user_recipe_photos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own photos" ON user_recipe_photos;
CREATE POLICY "Users delete own photos"
ON user_recipe_photos FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_recipe_photos_recipe ON user_recipe_photos(recipe_id);
CREATE INDEX IF NOT EXISTS idx_user_recipe_photos_user ON user_recipe_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recipe_photos_status ON user_recipe_photos(moderation_status);

-- Enable RLS
ALTER TABLE user_recipe_photos ENABLE ROW LEVEL SECURITY;
