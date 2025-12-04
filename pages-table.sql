-- Pages Table for dynamic page management
-- Drop existing table if it exists
DROP TABLE IF EXISTS pages CASCADE;

-- Create pages table
CREATE TABLE pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE, -- URL-friendly identifier
    content JSONB NOT NULL DEFAULT '{"blocks": []}'::jsonb, -- Page content blocks
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    og_image TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    template TEXT DEFAULT 'default', -- 'default', 'full-width', 'sidebar-left', 'sidebar-right'
    author_id UUID, -- References auth.users
    is_homepage BOOLEAN DEFAULT false,
    display_in_menu BOOLEAN DEFAULT true,
    menu_order INTEGER DEFAULT 0,
    parent_page_id UUID REFERENCES pages(id) ON DELETE SET NULL, -- For hierarchical pages
    settings JSONB DEFAULT '{}'::jsonb, -- Additional page settings
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_author ON pages(author_id);
CREATE INDEX idx_pages_homepage ON pages(is_homepage);
CREATE INDEX idx_pages_menu ON pages(display_in_menu, menu_order);
CREATE INDEX idx_pages_parent ON pages(parent_page_id);

-- Insert default pages
INSERT INTO pages (title, slug, content, meta_title, meta_description, status, template, is_homepage, display_in_menu, menu_order, published_at) VALUES
(
    'Αρχική',
    'home',
    '{
        "blocks": [
            {
                "id": "hero-1",
                "type": "hero",
                "data": {
                    "title": "Καλώς ήρθατε στις Ελληνικές Συνταγές",
                    "subtitle": "Ανακαλύψτε την αυθεντική ελληνική κουζίνα",
                    "buttonText": "Εξερευνήστε",
                    "buttonLink": "/recipes",
                    "backgroundImage": ""
                }
            },
            {
                "id": "sections-1",
                "type": "home-sections",
                "data": {
                    "message": "Αυτό το block φορτώνει δυναμικά τα home sections από το home_sections table"
                }
            }
        ]
    }'::jsonb,
    'Αρχική - Greek Recipes',
    'Ανακαλύψτε αυθεντικές ελληνικές συνταγές από όλη την Ελλάδα',
    'published',
    'full-width',
    true,
    false,
    0,
    NOW()
),
(
    'Σχετικά με εμάς',
    'about',
    '{
        "blocks": [
            {
                "id": "text-1",
                "type": "heading",
                "data": {
                    "level": 1,
                    "text": "Σχετικά με το Greek Recipes"
                }
            },
            {
                "id": "text-2",
                "type": "paragraph",
                "data": {
                    "text": "Το Greek Recipes είναι μια πλατφόρμα αφιερωμένη στην παραδοσιακή ελληνική κουζίνα. Στόχος μας είναι να διατηρήσουμε και να μοιραστούμε τις αυθεντικές συνταγές που μεταβιβάζονται από γενιά σε γενιά."
                }
            },
            {
                "id": "image-1",
                "type": "image",
                "data": {
                    "url": "/images/greek-kitchen.jpg",
                    "alt": "Ελληνική κουζίνα",
                    "caption": "Παραδοσιακή ελληνική κουζίνα"
                }
            },
            {
                "id": "text-3",
                "type": "heading",
                "data": {
                    "level": 2,
                    "text": "Η Αποστολή μας"
                }
            },
            {
                "id": "text-4",
                "type": "paragraph",
                "data": {
                    "text": "Πιστεύουμε ότι η ελληνική κουζίνα είναι μια από τις πιο υγιεινές και νόστιμες στον κόσμο. Μέσα από τις συνταγές μας, θέλουμε να μοιραστούμε όχι μόνο τα μυστικά της μαγειρικής, αλλά και την ιστορία και την παράδοση πίσω από κάθε πιάτο."
                }
            }
        ]
    }'::jsonb,
    'Σχετικά με εμάς - Greek Recipes',
    'Μάθετε περισσότερα για την αποστολή και την ομάδα του Greek Recipes',
    'published',
    'default',
    false,
    true,
    1,
    NOW()
),
(
    'Επικοινωνία',
    'contact',
    '{
        "blocks": [
            {
                "id": "heading-1",
                "type": "heading",
                "data": {
                    "level": 1,
                    "text": "Επικοινωνήστε μαζί μας"
                }
            },
            {
                "id": "form-1",
                "type": "contact-form",
                "data": {
                    "title": "Στείλτε μας μήνυμα",
                    "fields": ["name", "email", "subject", "message"],
                    "submitText": "Αποστολή"
                }
            },
            {
                "id": "info-1",
                "type": "contact-info",
                "data": {
                    "email": "info@greekrecipes.gr",
                    "phone": "+30 210 1234567",
                    "address": "Αθήνα, Ελλάδα"
                }
            }
        ]
    }'::jsonb,
    'Επικοινωνία - Greek Recipes',
    'Επικοινωνήστε μαζί μας για ερωτήσεις, προτάσεις ή συνεργασίες',
    'published',
    'default',
    false,
    true,
    2,
    NOW()
),
(
    'Όροι Χρήσης',
    'terms',
    '{
        "blocks": [
            {
                "id": "heading-1",
                "type": "heading",
                "data": {
                    "level": 1,
                    "text": "Όροι Χρήσης"
                }
            },
            {
                "id": "text-1",
                "type": "paragraph",
                "data": {
                    "text": "Καλώς ήρθατε στο Greek Recipes. Χρησιμοποιώντας την ιστοσελίδα μας, συμφωνείτε με τους ακόλουθους όρους..."
                }
            }
        ]
    }'::jsonb,
    'Όροι Χρήσης - Greek Recipes',
    'Διαβάστε τους όρους χρήσης της πλατφόρμας μας',
    'published',
    'default',
    false,
    true,
    10,
    NOW()
),
(
    'Πολιτική Απορρήτου',
    'privacy',
    '{
        "blocks": [
            {
                "id": "heading-1",
                "type": "heading",
                "data": {
                    "level": 1,
                    "text": "Πολιτική Απορρήτου"
                }
            },
            {
                "id": "text-1",
                "type": "paragraph",
                "data": {
                    "text": "Στο Greek Recipes σεβόμαστε την ιδιωτικότητά σας. Αυτή η πολιτική εξηγεί πώς συλλέγουμε και χρησιμοποιούμε τα προσωπικά σας δεδομένα..."
                }
            }
        ]
    }'::jsonb,
    'Πολιτική Απορρήτου - Greek Recipes',
    'Μάθετε πώς προστατεύουμε τα προσωπικά σας δεδομένα',
    'published',
    'default',
    false,
    true,
    11,
    NOW()
);

-- Add RLS policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published pages
CREATE POLICY "Allow public read access to published pages"
ON pages FOR SELECT
TO public
USING (status = 'published');

-- Allow authenticated users to manage pages
CREATE POLICY "Allow authenticated users to manage pages"
ON pages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_pages_timestamp
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_pages_updated_at();

-- Ensure only one homepage exists
CREATE OR REPLACE FUNCTION ensure_single_homepage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_homepage = true THEN
        UPDATE pages SET is_homepage = false WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_homepage_trigger
BEFORE INSERT OR UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION ensure_single_homepage();
