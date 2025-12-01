-- Greek Recipes App - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create regions table
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    short_description TEXT,
    steps JSONB NOT NULL DEFAULT '[]',
    ingredients JSONB NOT NULL DEFAULT '[]',
    time_minutes INTEGER NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    servings INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_recipes_region_id ON recipes(region_id);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_regions_slug ON regions(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on regions"
    ON regions FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow public read access on recipes"
    ON recipes FOR SELECT
    TO anon
    USING (true);

-- Insert sample regions
INSERT INTO regions (name, slug, description, image_url) VALUES
('Crete', 'crete', 'Home of the Mediterranean diet, famous for olive oil and fresh herbs.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop'),
('Cyclades', 'cyclades', 'Known for fresh seafood and sun-dried tomatoes.', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop'),
('Peloponnese', 'peloponnese', 'Rich in history and flavors, famous for oranges and olives.', 'https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?q=80&w=1000&auto=format&fit=crop'),
('Macedonia', 'macedonia', 'Northern Greece with hearty dishes and rich flavors.', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=1000&auto=format&fit=crop'),
('Thessaly', 'thessaly', 'Central Greece known for pies and dairy products.', 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=1000&auto=format&fit=crop');

-- Insert sample recipes
INSERT INTO recipes (title, slug, region_id, short_description, steps, ingredients, time_minutes, difficulty, servings, image_url, category) VALUES
(
    'Moussaka',
    'moussaka',
    (SELECT id FROM regions WHERE slug = 'crete'),
    'The legendary eggplant casserole with rich meat sauce and creamy béchamel.',
    '["Slice eggplants and potatoes into 1cm rounds.", "Salt eggplants and let sit for 30 minutes, then rinse and pat dry.", "Fry eggplants and potatoes until golden, set aside.", "Prepare meat sauce: sauté onions, add ground beef, tomatoes, cinnamon, and cloves. Simmer for 30 minutes.", "Make béchamel: melt butter, add flour, gradually whisk in milk. Add nutmeg and egg yolks.", "Layer in baking dish: potatoes, eggplants, meat sauce, repeat. Top with béchamel.", "Bake at 180°C for 45 minutes until golden brown.", "Let rest for 15 minutes before serving."]'::jsonb,
    '["3 large eggplants", "2 large potatoes", "500g ground beef", "1 onion, chopped", "400g canned tomatoes", "1 tsp cinnamon", "1/2 tsp ground cloves", "100g butter", "100g flour", "1L milk", "Nutmeg", "2 egg yolks", "100g grated cheese", "Olive oil", "Salt and pepper"]'::jsonb,
    90,
    'hard',
    8,
    'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=1000&auto=format&fit=crop',
    'Main Dish'
),
(
    'Greek Salad (Horiatiki)',
    'greek-salad',
    (SELECT id FROM regions WHERE slug = 'crete'),
    'Fresh, vibrant, and healthy traditional salad.',
    '["Chop tomatoes into large chunks.", "Slice cucumbers into thick half-moons.", "Slice red onion thinly.", "Add Kalamata olives.", "Place a large block of feta cheese on top.", "Drizzle generously with extra virgin olive oil.", "Sprinkle with dried oregano.", "Season with salt (go easy, feta is salty).", "Serve immediately, no mixing required!"]'::jsonb,
    '["4 ripe tomatoes", "1 cucumber", "1 red onion", "200g feta cheese block", "100g Kalamata olives", "Extra virgin olive oil", "Dried oregano", "Salt"]'::jsonb,
    15,
    'easy',
    4,
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop',
    'Salad'
),
(
    'Spanakopita',
    'spanakopita',
    (SELECT id FROM regions WHERE slug = 'peloponnese'),
    'Spinach and feta pie wrapped in crispy phyllo dough.',
    '["Wash and roughly chop 1kg fresh spinach.", "Sauté spinach with olive oil until wilted, let cool.", "Chop spring onions and dill finely.", "Mix spinach with crumbled feta, spring onions, dill, and beaten eggs.", "Brush baking pan with melted butter.", "Layer 6 phyllo sheets, brushing each with butter.", "Spread spinach mixture evenly.", "Top with 6 more phyllo sheets, each brushed with butter.", "Score the top into portions.", "Bake at 180°C for 40-45 minutes until golden.", "Let cool slightly before serving."]'::jsonb,
    '["1kg fresh spinach", "300g feta cheese", "4 spring onions", "Fresh dill", "3 eggs", "12 phyllo sheets", "150g melted butter", "Olive oil", "Salt and pepper"]'::jsonb,
    60,
    'medium',
    6,
    'https://images.unsplash.com/photo-1606525437679-037aca74a3e9?q=80&w=1000&auto=format&fit=crop',
    'Pie'
),
(
    'Souvlaki',
    'souvlaki',
    (SELECT id FROM regions WHERE slug = 'cyclades'),
    'Grilled meat skewers, the ultimate Greek street food.',
    '["Cut pork or chicken into 2cm cubes.", "Prepare marinade: olive oil, lemon juice, oregano, garlic, salt, pepper.", "Marinate meat for at least 2 hours (overnight is best).", "Thread meat onto wooden or metal skewers.", "Preheat grill to high heat.", "Grill skewers for 10-12 minutes, turning frequently.", "Serve in pita bread with tomatoes, onions, and tzatziki.", "Garnish with fresh oregano and lemon wedges."]'::jsonb,
    '["800g pork shoulder or chicken breast", "Olive oil", "2 lemons (juice)", "3 garlic cloves, minced", "Dried oregano", "Salt and pepper", "Pita bread", "Tomatoes", "Onions", "Tzatziki sauce"]'::jsonb,
    30,
    'easy',
    4,
    'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1000&auto=format&fit=crop',
    'Main Dish'
),
(
    'Pastitsio',
    'pastitsio',
    (SELECT id FROM regions WHERE slug = 'macedonia'),
    'Greek baked pasta with meat sauce and béchamel.',
    '["Cook pasta (bucatini or penne) until al dente, drain.", "Mix pasta with butter and grated cheese.", "Prepare meat sauce: brown ground beef with onions, add tomatoes, cinnamon, bay leaf. Simmer 30 min.", "Make béchamel: melt butter, add flour, gradually add milk while whisking. Add nutmeg and egg yolks.", "Layer half the pasta in baking dish.", "Add all the meat sauce.", "Top with remaining pasta.", "Pour béchamel over everything.", "Sprinkle with cheese.", "Bake at 180°C for 45 minutes until golden."]'::jsonb,
    '["500g pasta (bucatini or penne)", "600g ground beef", "1 onion, chopped", "400g canned tomatoes", "1 tsp cinnamon", "1 bay leaf", "100g butter", "100g flour", "1L milk", "Nutmeg", "3 egg yolks", "150g grated cheese", "Salt and pepper"]'::jsonb,
    75,
    'hard',
    8,
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1000&auto=format&fit=crop',
    'Main Dish'
),
(
    'Tzatziki',
    'tzatziki',
    (SELECT id FROM regions WHERE slug = 'crete'),
    'Creamy yogurt and cucumber dip, perfect with everything.',
    '["Grate cucumber and squeeze out excess water.", "Combine Greek yogurt with grated cucumber.", "Add minced garlic (2-3 cloves).", "Add olive oil and white wine vinegar.", "Mix in fresh dill, finely chopped.", "Season with salt.", "Refrigerate for at least 1 hour before serving.", "Drizzle with olive oil before serving."]'::jsonb,
    '["500g Greek yogurt", "1 large cucumber", "3 garlic cloves", "2 tbsp olive oil", "1 tbsp white wine vinegar", "Fresh dill", "Salt"]'::jsonb,
    15,
    'easy',
    6,
    'https://images.unsplash.com/photo-1562159278-1253a58da141?q=80&w=1000&auto=format&fit=crop',
    'Dip'
);
