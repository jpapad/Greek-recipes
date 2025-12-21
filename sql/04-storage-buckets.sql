-- ============================================
-- Supabase Storage Buckets for Media
-- ============================================

-- Create storage buckets (run these in Supabase Dashboard -> Storage)
-- or use the Supabase client to create them

-- 1. Recipe Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Region Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('region-images', 'region-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. General Media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage Policies
-- ============================================

-- Recipe Images: Public read, admin write
CREATE POLICY "Recipe images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

CREATE POLICY "Admins can upload recipe images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'recipe-images' 
    AND public.is_admin()
);

CREATE POLICY "Admins can update recipe images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'recipe-images' 
    AND public.is_admin()
);

CREATE POLICY "Admins can delete recipe images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'recipe-images' 
    AND public.is_admin()
);

-- Region Images: Public read, admin write
CREATE POLICY "Region images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'region-images');

CREATE POLICY "Admins can upload region images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'region-images' 
    AND public.is_admin()
);

CREATE POLICY "Admins can update region images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'region-images' 
    AND public.is_admin()
);

CREATE POLICY "Admins can delete region images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'region-images' 
    AND public.is_admin()
);

-- General Media: Public read, admin write
CREATE POLICY "Media are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'media' 
    AND public.is_admin()
);

CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'media' 
    AND public.is_admin()
);

CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'media' 
    AND public.is_admin()
);
