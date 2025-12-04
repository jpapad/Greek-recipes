-- Meal Planning System

CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meal_plan_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    meal_type TEXT, -- 'breakfast', 'lunch', 'dinner', 'snack'
    servings INT DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_recipes_plan ON meal_plan_recipes(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_recipes_date ON meal_plan_recipes(scheduled_date);

-- RLS Policies
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users Manage Own Meal Plans" ON meal_plans;
CREATE POLICY "Users Manage Own Meal Plans"
    ON meal_plans FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users Manage Own Meal Plan Recipes" ON meal_plan_recipes;
CREATE POLICY "Users Manage Own Meal Plan Recipes"
    ON meal_plan_recipes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM meal_plans
            WHERE meal_plans.id = meal_plan_recipes.meal_plan_id
            AND meal_plans.user_id = auth.uid()
        )
    );

-- Live Cooking Sessions
CREATE TABLE IF NOT EXISTS cooking_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cooking_session_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES cooking_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_step INT DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(session_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_host ON cooking_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_active ON cooking_sessions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cooking_session_participants_session ON cooking_session_participants(session_id);

-- RLS Policies
ALTER TABLE cooking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooking_session_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Active Sessions" ON cooking_sessions;
CREATE POLICY "Public Read Active Sessions"
    ON cooking_sessions FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Hosts Manage Sessions" ON cooking_sessions;
CREATE POLICY "Hosts Manage Sessions"
    ON cooking_sessions FOR ALL
    USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Public Read Participants" ON cooking_session_participants;
CREATE POLICY "Public Read Participants"
    ON cooking_session_participants FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users Join Sessions" ON cooking_session_participants;
CREATE POLICY "Users Join Sessions"
    ON cooking_session_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Participants Update Own Progress" ON cooking_session_participants;
CREATE POLICY "Participants Update Own Progress"
    ON cooking_session_participants FOR UPDATE
    USING (auth.uid() = user_id);
