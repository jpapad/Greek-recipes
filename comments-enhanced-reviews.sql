-- Comments System
-- Nested comments with replies support

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false,
    is_edited BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_comments_recipe ON comments(recipe_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
USING (is_deleted = false);

CREATE POLICY "Authenticated users can create comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
USING (auth.uid() = user_id);

-- Enhanced Reviews with images and votes
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS unhelpful_count INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS review_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_review_votes_review ON review_votes(review_id);

ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Review votes are viewable by everyone"
ON review_votes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can vote"
ON review_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their votes"
ON review_votes FOR UPDATE
USING (auth.uid() = user_id);
