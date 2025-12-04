-- Ingredient Substitutions System

CREATE TABLE IF NOT EXISTS ingredient_substitutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_name TEXT NOT NULL,
    substitute_name TEXT NOT NULL,
    ratio TEXT, -- e.g., "1:1", "1 cup = 2 cups"
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ingredient_substitutions_ingredient ON ingredient_substitutions(ingredient_name);
CREATE INDEX IF NOT EXISTS idx_ingredient_substitutions_substitute ON ingredient_substitutions(substitute_name);

-- RLS Policies
ALTER TABLE ingredient_substitutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access ingredient_substitutions" ON ingredient_substitutions;
CREATE POLICY "Public Read Access ingredient_substitutions"
    ON ingredient_substitutions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated Users Manage Substitutions" ON ingredient_substitutions;
CREATE POLICY "Authenticated Users Manage Substitutions"
    ON ingredient_substitutions FOR ALL
    USING (auth.role() = 'authenticated');

-- Ingredient Pricing for Cost Estimator
CREATE TABLE IF NOT EXISTS ingredient_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_name TEXT NOT NULL,
    unit TEXT NOT NULL, -- 'kg', 'liter', 'piece', etc.
    price_euros DECIMAL(10,2) NOT NULL,
    region TEXT, -- Optional regional pricing
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ingredient_prices_name ON ingredient_prices(ingredient_name);

-- RLS Policies
ALTER TABLE ingredient_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access ingredient_prices" ON ingredient_prices;
CREATE POLICY "Public Read Access ingredient_prices"
    ON ingredient_prices FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated Users Manage Prices" ON ingredient_prices;
CREATE POLICY "Authenticated Users Manage Prices"
    ON ingredient_prices FOR ALL
    USING (auth.role() = 'authenticated');
