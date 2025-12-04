-- Add tourist data fields to regions, prefectures, and cities tables

-- Regions tourist data
ALTER TABLE regions ADD COLUMN IF NOT EXISTS photo_gallery TEXT[] DEFAULT '{}';
ALTER TABLE regions ADD COLUMN IF NOT EXISTS attractions JSONB DEFAULT '[]';
ALTER TABLE regions ADD COLUMN IF NOT EXISTS how_to_get_there TEXT;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS tourist_info TEXT;
ALTER TABLE regions ADD COLUMN IF NOT EXISTS events_festivals JSONB DEFAULT '[]';
ALTER TABLE regions ADD COLUMN IF NOT EXISTS local_products JSONB DEFAULT '[]';

-- Prefectures tourist data
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS photo_gallery TEXT[] DEFAULT '{}';
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS attractions JSONB DEFAULT '[]';
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS how_to_get_there TEXT;
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS tourist_info TEXT;
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS events_festivals JSONB DEFAULT '[]';
ALTER TABLE prefectures ADD COLUMN IF NOT EXISTS local_products JSONB DEFAULT '[]';

-- Cities tourist data
ALTER TABLE cities ADD COLUMN IF NOT EXISTS photo_gallery TEXT[] DEFAULT '{}';
ALTER TABLE cities ADD COLUMN IF NOT EXISTS attractions JSONB DEFAULT '[]';
ALTER TABLE cities ADD COLUMN IF NOT EXISTS how_to_get_there TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS tourist_info TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS events_festivals JSONB DEFAULT '[]';
ALTER TABLE cities ADD COLUMN IF NOT EXISTS local_products JSONB DEFAULT '[]';

-- Comments for documentation
COMMENT ON COLUMN regions.photo_gallery IS 'Array of image URLs for the region photo gallery';
COMMENT ON COLUMN regions.attractions IS 'JSON array of attractions: [{"name": "...", "type": "museum|monument|beach|park", "description": "...", "image_url": "..."}]';
COMMENT ON COLUMN regions.how_to_get_there IS 'Text description of how to access the region (airports, trains, buses, etc)';
COMMENT ON COLUMN regions.tourist_info IS 'General tourist information and tips';
COMMENT ON COLUMN regions.events_festivals IS 'JSON array of events: [{"name": "...", "date": "...", "description": "..."}]';
COMMENT ON COLUMN regions.local_products IS 'JSON array of products: [{"name": "...", "category": "food|wine|craft", "description": "...", "image_url": "..."}]';

-- Example data for Crete
UPDATE regions 
SET 
  attractions = '[
    {"name": "Παλάτι της Κνωσού", "type": "monument", "description": "Το μεγαλύτερο μινωικό ανάκτορο", "image_url": "https://images.unsplash.com/photo-1601581987809-a874a81309c9"},
    {"name": "Σαμαριά", "type": "park", "description": "Το μεγαλύτερο φαράγγι της Ευρώπης", "image_url": "https://images.unsplash.com/photo-1580837119756-563d608dd119"}
  ]'::jsonb,
  how_to_get_there = 'Η Κρήτη διαθέτει δύο διεθνή αεροδρόμια (Ηράκλειο & Χανιά). Επίσης υπάρχουν καθημερινά δρομολόγια με πλοίο από Πειραιά (8-9 ώρες).',
  tourist_info = 'Η μεγαλύτερη ελληνικό νησί προσφέρει συνδυασμό ιστορίας, πολιτισμού και φυσικής ομορφιάς. Ιδανική για επισκέψεις από Απρίλιο έως Οκτώβριο.',
  events_festivals = '[
    {"name": "Γιορτή Σουλτανίνας", "date": "Αύγουστος", "description": "Παραδοσιακή γιορτή σταφυλιού στο Ηράκλειο"},
    {"name": "Renaissance Festival", "date": "Ιούλιος", "description": "Πολιτιστική εκδήλωση στο Ρέθυμνο"}
  ]'::jsonb,
  local_products = '[
    {"name": "Κρητικό Ελαιόλαδο", "category": "food", "description": "Εξαιρετικής ποιότητας ΕΧΠΝ ελαιόλαδο", "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5"},
    {"name": "Ρακί Τσικουδιά", "category": "wine", "description": "Παραδοσιακό απόσταγμα από σταφύλια", "image_url": "https://images.unsplash.com/photo-1569529465841-dfecdab7503b"},
    {"name": "Κρητικό Μέλι", "category": "food", "description": "Θυμαρίσιο μέλι από τα βουνά της Κρήτης", "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784790"}
  ]'::jsonb
WHERE slug = 'crete';
