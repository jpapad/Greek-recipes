-- Analytics System for Greek Recipes App
-- Tracks page views, recipe views, user activity

-- Drop existing materialized views first
DROP MATERIALIZED VIEW IF EXISTS popular_recipes CASCADE;
DROP MATERIALIZED VIEW IF EXISTS user_activity_summary CASCADE;

-- Page Views Tracking
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    user_agent TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    country_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Recipe Views Tracking
CREATE TABLE IF NOT EXISTS recipe_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Search Queries Tracking
CREATE TABLE IF NOT EXISTS search_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT NOT NULL,
    results_count INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    clicked_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User Activity Summary (Materialized View)
CREATE MATERIALIZED VIEW user_activity_summary AS
SELECT 
    date_trunc('day', pv.created_at) as day,
    COUNT(DISTINCT pv.session_id) as unique_visitors,
    COUNT(*) as total_page_views,
    COUNT(DISTINCT pv.user_id) as registered_users
FROM page_views pv
GROUP BY date_trunc('day', pv.created_at)
ORDER BY day DESC;

-- Popular Recipes View (without favorites dependency)
CREATE MATERIALIZED VIEW popular_recipes AS
SELECT 
    r.id,
    r.title,
    r.slug,
    r.image_url,
    COUNT(DISTINCT rv.id) as view_count,
    0 as favorite_count, -- Placeholder, update manually if favorites table exists
    AVG(rev.rating) as avg_rating,
    COUNT(DISTINCT rev.id) as review_count
FROM recipes r
LEFT JOIN recipe_views rv ON r.id = rv.recipe_id
LEFT JOIN reviews rev ON r.id = rev.recipe_id
GROUP BY r.id, r.title, r.slug, r.image_url
ORDER BY view_count DESC;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_recipe_views_recipe_id ON recipe_views(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_views_created_at ON recipe_views(created_at);
CREATE INDEX IF NOT EXISTS idx_search_queries_query ON search_queries(query);
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at);

-- RLS Policies
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert tracking data
CREATE POLICY "Allow anonymous tracking" ON page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated tracking" ON page_views FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow anonymous recipe views" ON recipe_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated recipe views" ON recipe_views FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow anonymous search tracking" ON search_queries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated search tracking" ON search_queries FOR INSERT TO authenticated WITH CHECK (true);

-- Only admins can read analytics
CREATE POLICY "Admins can read page_views" ON page_views FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can read recipe_views" ON recipe_views FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Admins can read search_queries" ON search_queries FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Function to refresh materialized views (run daily via cron)
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_activity_summary;
    REFRESH MATERIALIZED VIEW popular_recipes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION refresh_analytics_views() TO authenticated;
