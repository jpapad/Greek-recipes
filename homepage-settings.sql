-- Homepage Settings Table
CREATE TABLE IF NOT EXISTS homepage_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL UNIQUE, -- 'stats', 'categories', 'newsletter'
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default homepage settings
INSERT INTO homepage_settings (section, content, display_order) VALUES
('stats', '{
  "title": "Τα Νούμερά μας",
  "subtitle": "Η ελληνική κουζίνα σε αριθμούς",
  "stats": [
    {
      "label": "Αυθεντικές Συνταγές",
      "value": "150+",
      "icon": "ChefHat",
      "color": "from-orange-500 to-pink-500"
    },
    {
      "label": "Ελληνικές Περιοχές",
      "value": "13",
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
}', 1),

('categories', '{
  "title": "Κατηγορίες Φαγητού",
  "subtitle": "Εξερευνήστε την ελληνική κουζίνα ανά κατηγορία",
  "categories": [
    {
      "name": "Ορεκτικά",
      "slug": "appetizer",
      "icon": "Salad",
      "color": "from-green-500 to-emerald-500",
      "description": "Νόστιμα ορεκτικά για κάθε περίσταση"
    },
    {
      "name": "Κυρίως Πιάτα",
      "slug": "main-dish",
      "icon": "Utensils",
      "color": "from-orange-500 to-red-500",
      "description": "Παραδοσιακά ελληνικά πιάτα"
    },
    {
      "name": "Γλυκά",
      "slug": "dessert",
      "icon": "Cake",
      "color": "from-pink-500 to-purple-500",
      "description": "Παραδοσιακά ελληνικά γλυκά"
    },
    {
      "name": "Σαλάτες",
      "slug": "salad",
      "icon": "Coffee",
      "color": "from-cyan-500 to-blue-500",
      "description": "Δροσερές και υγιεινές σαλάτες"
    }
  ]
}', 2),

('newsletter', '{
  "badge": "Newsletter",
  "title": "Λάβετε τις καλύτερες συνταγές στο inbox σας",
  "subtitle": "Κάθε εβδομάδα μοιραζόμαστε νέες αυθεντικές ελληνικές συνταγές, tips μαγειρικής και ιστορίες από την παράδοση μας.",
  "placeholder": "Το email σας...",
  "buttonText": "Εγγραφή",
  "privacyText": "🔒 Δεν θα μοιραστούμε ποτέ το email σας με τρίτους"
}', 3);

-- Enable RLS
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read homepage settings"
  ON homepage_settings
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage homepage settings"
  ON homepage_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_homepage_settings_section ON homepage_settings(section);
CREATE INDEX idx_homepage_settings_active ON homepage_settings(is_active);
CREATE INDEX idx_homepage_settings_order ON homepage_settings(display_order);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_homepage_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER homepage_settings_updated_at
  BEFORE UPDATE ON homepage_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_settings_updated_at();
