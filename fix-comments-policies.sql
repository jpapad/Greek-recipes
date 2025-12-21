-- Fix RLS Policies for Comments
-- Run this if you're getting "Comments system not configured yet" error

-- Drop the old "all" policy
DROP POLICY IF EXISTS "Admins moderate comments" ON recipe_comments;

-- Create separate specific policies for admins
CREATE POLICY "Admins read all comments" ON recipe_comments FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins update all comments" ON recipe_comments FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins delete all comments" ON recipe_comments FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Verify policies are created
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'recipe_comments'
ORDER BY policyname;
