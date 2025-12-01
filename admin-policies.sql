-- Admin Policies for Greek Recipes App
-- Run this in your Supabase SQL Editor to enable CRUD operations

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access on regions" ON regions;
DROP POLICY IF EXISTS "Allow public read access on recipes" ON recipes;

-- Regions policies
CREATE POLICY "Allow public read access on regions"
    ON regions FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on regions"
    ON regions FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on regions"
    ON regions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on regions"
    ON regions FOR DELETE
    TO authenticated
    USING (true);

-- Recipes policies
CREATE POLICY "Allow public read access on recipes"
    ON recipes FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on recipes"
    ON recipes FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on recipes"
    ON recipes FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on recipes"
    ON recipes FOR DELETE
    TO authenticated
    USING (true);
