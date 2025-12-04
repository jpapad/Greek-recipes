-- Blog System Database Schema
-- Run this in Supabase SQL Editor after existing migrations

-- 1. Article Categories Table
CREATE TABLE IF NOT EXISTS article_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- Hex color for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL, -- HTML content from Tiptap editor
  excerpt TEXT, -- Short description for listing pages
  featured_image VARCHAR(500),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES article_categories(id) ON DELETE SET NULL,
  tags TEXT[], -- Array of tags
  related_recipe_ids UUID[], -- Array of recipe UUIDs
  
  -- SEO fields
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT[],
  
  -- Publishing
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Stats
  views_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER, -- Auto-calculated from content length
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Roles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_author BOOLEAN DEFAULT FALSE,
  bio TEXT,
  avatar_url VARCHAR(500),
  social_links JSONB, -- { twitter: '', instagram: '', website: '' }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Article Comments (optional - using existing reviews pattern)
CREATE TABLE IF NOT EXISTS article_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name VARCHAR(100),
  user_email VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_article_comments_article ON article_comments(article_id);

-- Row Level Security Policies

-- Article Categories: Public read, admin write
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view article categories" ON article_categories;
CREATE POLICY "Anyone can view article categories"
  ON article_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON article_categories;
CREATE POLICY "Admins can insert categories"
  ON article_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update categories" ON article_categories;
CREATE POLICY "Admins can update categories"
  ON article_categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete categories" ON article_categories;
CREATE POLICY "Admins can delete categories"
  ON article_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Articles: Public read published, authors can manage their own
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins and authors can view all articles" ON articles;
CREATE POLICY "Admins and authors can view all articles"
  ON articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND (is_admin = true OR is_author = true)
    )
  );

DROP POLICY IF EXISTS "Authors can create articles" ON articles;
CREATE POLICY "Authors can create articles"
  ON articles FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND (is_admin = true OR is_author = true)
    )
  );

DROP POLICY IF EXISTS "Authors can update their own articles" ON articles;
CREATE POLICY "Authors can update their own articles"
  ON articles FOR UPDATE
  USING (
    auth.uid() = author_id OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete articles" ON articles;
CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- User Roles: Users can view, admins can manage
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view author profiles" ON user_roles;
CREATE POLICY "Anyone can view author profiles"
  ON user_roles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_roles;
CREATE POLICY "Users can update their own profile"
  ON user_roles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can insert user roles" ON user_roles;
CREATE POLICY "Admins can insert user roles"
  ON user_roles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can delete user roles" ON user_roles;
CREATE POLICY "Admins can delete user roles"
  ON user_roles FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Article Comments: Public read approved, authenticated write
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved comments" ON article_comments;
CREATE POLICY "Anyone can view approved comments"
  ON article_comments FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Anyone can submit comments" ON article_comments;
CREATE POLICY "Anyone can submit comments"
  ON article_comments FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage comments" ON article_comments;
CREATE POLICY "Admins can manage comments"
  ON article_comments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_article_categories_updated_at ON article_categories;
CREATE TRIGGER update_article_categories_updated_at
  BEFORE UPDATE ON article_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-calculate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Average reading speed: 200 words per minute
  -- Strip HTML tags and count words
  NEW.reading_time_minutes = GREATEST(1, 
    CEIL(
      array_length(
        regexp_split_to_array(
          regexp_replace(NEW.content, '<[^>]*>', '', 'g'), 
          '\s+'
        ), 
        1
      ) / 200.0
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_article_reading_time ON articles;
CREATE TRIGGER calculate_article_reading_time
  BEFORE INSERT OR UPDATE OF content ON articles
  FOR EACH ROW EXECUTE FUNCTION calculate_reading_time();

-- Insert some default categories
INSERT INTO article_categories (name, slug, description, color) VALUES
  ('Ιστορία', 'istoria', 'Ιστορία ελληνικής κουζίνας και παράδοσης', '#3B82F6'),
  ('Tips Μαγειρικής', 'tips-mageirikis', 'Συμβουλές και τεχνικές μαγειρικής', '#10B981'),
  ('Περιφέρειες', 'perifereies', 'Γευστική περιήγηση στην Ελλάδα', '#F59E0B'),
  ('Συνεντεύξεις', 'synenteykseis', 'Συνεντεύξεις με σεφ και μάγειρες', '#EF4444'),
  ('Εποχιακά', 'epochiaka', 'Εποχιακά προϊόντα και συνταγές', '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON article_categories TO anon, authenticated;
GRANT SELECT ON articles TO anon, authenticated;
GRANT SELECT ON user_roles TO anon, authenticated;
GRANT SELECT ON article_comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON articles TO authenticated;
GRANT INSERT ON article_comments TO anon, authenticated;

-- IMPORTANT: After running this migration, set yourself as admin:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Find your user ID
-- 3. Run this query in SQL Editor (replace YOUR_USER_ID):
/*
INSERT INTO user_roles (user_id, is_admin, is_author)
VALUES ('YOUR_USER_ID', true, true)
ON CONFLICT (user_id) 
DO UPDATE SET is_admin = true, is_author = true;
*/
