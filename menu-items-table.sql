-- Menu Items Table for navigation management
-- Drop existing table if it exists
DROP TABLE IF EXISTS menu_items CASCADE;

-- Create menu_items table
CREATE TABLE menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label TEXT NOT NULL, -- Display text
    url TEXT NOT NULL, -- Link URL (can be internal /about or external https://...)
    icon TEXT, -- Lucide icon name
    target TEXT DEFAULT '_self', -- '_self' or '_blank'
    menu_location TEXT DEFAULT 'main', -- 'main', 'footer', 'mobile', 'user-menu'
    parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE, -- For dropdown menus
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    requires_auth BOOLEAN DEFAULT false, -- Show only to logged-in users
    requires_admin BOOLEAN DEFAULT false, -- Show only to admins
    css_classes TEXT, -- Custom CSS classes
    badge_text TEXT, -- Optional badge (e.g., "NEW", "BETA")
    badge_color TEXT, -- Badge color
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_menu_items_location ON menu_items(menu_location, display_order);
CREATE INDEX idx_menu_items_parent ON menu_items(parent_id);
CREATE INDEX idx_menu_items_active ON menu_items(is_active);

-- Insert default main menu items
INSERT INTO menu_items (label, url, icon, menu_location, display_order, is_active) VALUES
('Αρχική', '/', 'Home', 'main', 1, true),
('Συνταγές', '/recipes', 'UtensilsCrossed', 'main', 2, true),
('Περιοχές', '/regions', 'MapPin', 'main', 3, true),
('Σχετικά', '/about', 'Info', 'main', 4, true),
('Επικοινωνία', '/contact', 'Mail', 'main', 5, true);

-- Insert user menu items (logged-in users)
INSERT INTO menu_items (label, url, icon, menu_location, display_order, requires_auth, is_active) VALUES
('Αγαπημένα', '/favorites', 'Heart', 'user-menu', 1, true, true),
('Λίστα Αγορών', '/shopping-list', 'ShoppingCart', 'user-menu', 2, true, true),
('Meal Plan', '/meal-plan', 'Calendar', 'user-menu', 3, true, true),
('Προφίλ', '/profile', 'User', 'user-menu', 4, true, true);

-- Insert admin menu items
INSERT INTO menu_items (label, url, icon, menu_location, display_order, requires_admin, is_active) VALUES
('Dashboard', '/admin', 'LayoutDashboard', 'admin', 1, true, true),
('Συνταγές', '/admin/recipes', 'UtensilsCrossed', 'admin', 2, true, true),
('Περιοχές', '/admin/regions', 'MapPin', 'admin', 3, true, true),
('Home Sections', '/admin/home-sections', 'Sparkles', 'admin', 4, true, true),
('Σελίδες', '/admin/pages', 'FileText', 'admin', 5, true, true),
('Menu', '/admin/menu', 'Menu', 'admin', 6, true, true),
('Site Settings', '/admin/site-settings', 'Settings', 'admin', 7, true, true);

-- Insert footer menu items
INSERT INTO menu_items (label, url, menu_location, display_order, is_active) VALUES
('Όροι Χρήσης', '/terms', 'footer', 1, true),
('Πολιτική Απορρήτου', '/privacy', 'footer', 2, true),
('Cookies', '/cookies', 'footer', 3, true),
('Sitemap', '/sitemap', 'footer', 4, true);

-- Example of dropdown menu (add after main menu items exist)
-- Get the "Συνταγές" menu item ID and add children
DO $$
DECLARE
    recipes_menu_id UUID;
BEGIN
    SELECT id INTO recipes_menu_id FROM menu_items WHERE url = '/recipes' AND menu_location = 'main';
    
    IF recipes_menu_id IS NOT NULL THEN
        INSERT INTO menu_items (label, url, icon, menu_location, parent_id, display_order, is_active) VALUES
        ('Ορεκτικά', '/recipes?category=appetizer', 'Salad', 'main', recipes_menu_id, 1, true),
        ('Κυρίως Πιάτα', '/recipes?category=main-dish', 'Utensils', 'main', recipes_menu_id, 2, true),
        ('Γλυκά', '/recipes?category=dessert', 'Cake', 'main', recipes_menu_id, 3, true),
        ('Σαλάτες', '/recipes?category=salad', 'LeafyGreen', 'main', recipes_menu_id, 4, true);
    END IF;
END $$;

-- Add RLS policies
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active menu items
CREATE POLICY "Allow public read access to active menu items"
ON menu_items FOR SELECT
TO public
USING (is_active = true);

-- Allow authenticated users to manage menu items
CREATE POLICY "Allow authenticated users to manage menu items"
ON menu_items FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_menu_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_menu_items_timestamp
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE FUNCTION update_menu_items_updated_at();
