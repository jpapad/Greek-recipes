-- Home Sections Table for dynamic homepage management
-- Drop existing table if it exists
DROP TABLE IF EXISTS home_sections CASCADE;

-- Create home_sections table
CREATE TABLE home_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE, -- e.g., 'hero', 'stats', 'categories', 'recipes', 'newsletter', 'blog'
    section_type TEXT NOT NULL, -- 'hero', 'stats', 'featured-recipes', 'categories', 'newsletter', 'blog', 'custom'
    content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible content storage
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0, -- For sorting sections
    settings JSONB DEFAULT '{}'::jsonb, -- Additional settings (colors, layout, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for sorting
CREATE INDEX idx_home_sections_order ON home_sections(display_order);
CREATE INDEX idx_home_sections_active ON home_sections(is_active);

-- Insert default sections
INSERT INTO home_sections (title, slug, section_type, content, display_order, is_active) VALUES
(
    'Hero Slider',
    'hero',
    'hero',
    '{
        "slides": [
            {
                "title": "Ανακαλύψτε την Αυθεντική Ελληνική Κουζίνα",
                "subtitle": "Παραδοσιακές συνταγές από όλη την Ελλάδα",
                "buttonText": "Εξερευνήστε Συνταγές",
                "buttonLink": "/recipes"
            }
        ]
    }'::jsonb,
    1,
    true
),
(
    'Στατιστικά',
    'stats',
    'stats',
    '{
        "title": "Τα Νούμερά μας",
        "subtitle": "Η ελληνική κουζίνα σε αριθμούς",
        "stats": [
            {
                "label": "Αυθεντικές Συνταγές",
                "value": "dynamic", 
                "icon": "ChefHat",
                "color": "from-orange-500 to-pink-500"
            },
            {
                "label": "Ελληνικές Περιοχές",
                "value": "dynamic",
                "icon": "MapPin",
                "color": "from-blue-500 to-cyan-500"
            },
            {
                "label": "Μέση Αξιολόγηση",
                "value": "4.8",
                "icon": "Star",
                "color": "from-purple-500 to-pink-500"
            }
        ]
    }'::jsonb,
    2,
    true
),
(
    'Κατηγορίες Φαγητού',
    'categories',
    'categories',
    '{
        "title": "Κατηγορίες Φαγητού",
        "subtitle": "Εξερευνήστε την ελληνική κουζίνα ανά κατηγορία",
        "categories": [
            {
                "name": "Ορεκτικά",
                "slug": "appetizer",
                "icon": "Salad",
                "color": "from-green-500 to-emerald-500",
                "description": "Νόστιμα ορεκτικά"
            },
            {
                "name": "Κυρίως Πιάτα",
                "slug": "main-dish",
                "icon": "Utensils",
                "color": "from-orange-500 to-red-500",
                "description": "Παραδοσιακά πιάτα"
            },
            {
                "name": "Γλυκά",
                "slug": "dessert",
                "icon": "Cake",
                "color": "from-pink-500 to-purple-500",
                "description": "Ελληνικά γλυκά"
            },
            {
                "name": "Σαλάτες",
                "slug": "salad",
                "icon": "Coffee",
                "color": "from-cyan-500 to-blue-500",
                "description": "Υγιεινές σαλάτες"
            }
        ]
    }'::jsonb,
    3,
    true
),
(
    'Πρόσφατες Συνταγές',
    'latest-recipes',
    'featured-recipes',
    '{
        "title": "Πρόσφατες Συνταγές",
        "subtitle": "Οι τελευταίες προσθήκες στη συλλογή μας",
        "limit": 8,
        "filterType": "latest"
    }'::jsonb,
    4,
    true
),
(
    'Blog Articles',
    'blog',
    'blog',
    '{
        "badge": "📚 Blog",
        "title": "Ιστορίες & Άρθρα",
        "subtitle": "Ανακαλύψτε την ιστορία και τα μυστικά της ελληνικής κουζίνας",
        "limit": 3
    }'::jsonb,
    5,
    true
),
(
    'Newsletter',
    'newsletter',
    'newsletter',
    '{
        "badge": "Newsletter",
        "title": "Λάβετε τις καλύτερες συνταγές στο inbox σας",
        "subtitle": "Κάθε εβδομάδα μοιραζόμαστε νέες αυθεντικές ελληνικές συνταγές, tips μαγειρικής και ιστορίες από την παράδοση μας.",
        "placeholder": "Το email σας...",
        "buttonText": "Εγγραφή",
        "privacyText": "🔒 Δεν θα μοιραστούμε ποτέ το email σας με τρίτους"
    }'::jsonb,
    6,
    true
);

-- Add RLS policies
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to home_sections"
ON home_sections FOR SELECT
TO public
USING (is_active = true);

-- Allow authenticated users to manage (admin only - you can add role check later)
CREATE POLICY "Allow authenticated users to manage home_sections"
ON home_sections FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_home_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_home_sections_timestamp
BEFORE UPDATE ON home_sections
FOR EACH ROW
EXECUTE FUNCTION update_home_sections_updated_at();
