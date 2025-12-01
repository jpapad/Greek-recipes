-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read reviews
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
