-- Footer Settings Table
CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL UNIQUE, -- 'brand', 'contact', 'social', 'newsletter'
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default footer settings
INSERT INTO footer_settings (section, content, display_order) VALUES
('brand', '{
  "title": "ΕΛΛΑΔΑ ΣΤΟ ΠΙΑΤΟ",
  "subtitle": "Ας γευτούμε την παράδοση",
  "description": "Ανακαλύψτε αυθεντικές ελληνικές συνταγές από όλες τις περιοχές της Ελλάδας. Παράδοση, γεύση, αγάπη."
}', 1),

('social', '{
  "facebook": "#",
  "instagram": "#",
  "twitter": "#"
}', 2),

('contact', '{
  "address": "Αθήνα, Ελλάδα",
  "email": "info@elladastopjato.gr",
  "phone": "+30 210 123 4567"
}', 3),

('newsletter', '{
  "title": "Newsletter",
  "description": "Λάβετε νέες συνταγές στο email σας",
  "placeholder": "Το email σας"
}', 4),

('copyright', '{
  "text": "Με ❤️ από την Ελλάδα",
  "links": [
    {"label": "Απόρρητο", "href": "/privacy"},
    {"label": "Όροι Χρήσης", "href": "/terms"},
    {"label": "Σχετικά", "href": "/about"}
  ]
}', 5);

-- Enable RLS
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read footer settings"
  ON footer_settings
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage footer settings"
  ON footer_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_footer_settings_section ON footer_settings(section);
CREATE INDEX idx_footer_settings_active ON footer_settings(is_active);
CREATE INDEX idx_footer_settings_order ON footer_settings(display_order);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_footer_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER footer_settings_updated_at
  BEFORE UPDATE ON footer_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_settings_updated_at();
