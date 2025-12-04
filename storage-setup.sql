-- Supabase Storage Setup for Greek Recipes
-- Run this in Supabase SQL Editor

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('recipe-images', 'recipe-images', true),
  ('region-images', 'region-images', true),
  ('prefecture-images', 'prefecture-images', true),
  ('city-images', 'city-images', true),
  ('user-avatars', 'user-avatars', true),
  ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public Access recipe-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own recipe images" ON storage.objects;

DROP POLICY IF EXISTS "Public Access region-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload region images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update region images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete region images" ON storage.objects;

DROP POLICY IF EXISTS "Public Access prefecture-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload prefecture images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update prefecture images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete prefecture images" ON storage.objects;

DROP POLICY IF EXISTS "Public Access city-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload city images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update city images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete city images" ON storage.objects;

DROP POLICY IF EXISTS "Public Access user-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

DROP POLICY IF EXISTS "Public Access review-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload review images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own review images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own review images" ON storage.objects;

-- Storage policies for recipe-images
CREATE POLICY "Public Access recipe-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'recipe-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own recipe images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own recipe images"
ON storage.objects FOR DELETE
USING (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

-- Storage policies for region-images
CREATE POLICY "Public Access region-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'region-images');

CREATE POLICY "Authenticated users can upload region images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'region-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update region images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'region-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete region images"
ON storage.objects FOR DELETE
USING (bucket_id = 'region-images' AND auth.role() = 'authenticated');

-- Storage policies for prefecture-images
CREATE POLICY "Public Access prefecture-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prefecture-images');

CREATE POLICY "Authenticated users can upload prefecture images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'prefecture-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update prefecture images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'prefecture-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete prefecture images"
ON storage.objects FOR DELETE
USING (bucket_id = 'prefecture-images' AND auth.role() = 'authenticated');

-- Storage policies for city-images
CREATE POLICY "Public Access city-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'city-images');

CREATE POLICY "Authenticated users can upload city images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'city-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update city images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'city-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete city images"
ON storage.objects FOR DELETE
USING (bucket_id = 'city-images' AND auth.role() = 'authenticated');

-- Storage policies for user-avatars
CREATE POLICY "Public Access user-avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-avatars' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');

-- Storage policies for review-images
CREATE POLICY "Public Access review-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own review images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'review-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own review images"
ON storage.objects FOR DELETE
USING (bucket_id = 'review-images' AND auth.role() = 'authenticated');
