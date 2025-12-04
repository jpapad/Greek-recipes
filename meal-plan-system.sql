-- Meal Planning System Database Schema
-- Run this in Supabase SQL Editor

-- Drop existing tables if needed (for clean migration)
DROP TABLE IF EXISTS shopping_list_items CASCADE;
DROP TABLE IF EXISTS shopping_lists CASCADE;
DROP TABLE IF EXISTS meal_plan_items CASCADE;
DROP TABLE IF EXISTS meal_plans CASCADE;

-- 1. Meal Plans Table (Weekly meal plans)
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- 2. Meal Plan Items (Individual meals in the plan)
CREATE TABLE meal_plan_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  servings INTEGER DEFAULT 1,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meal_plan_id, date, meal_type)
);

-- 3. Shopping Lists (Generated from meal plans)
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Shopping List Items
CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient TEXT NOT NULL,
  quantity TEXT,
  category VARCHAR(100),
  is_checked BOOLEAN DEFAULT false,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_week_start ON meal_plans(week_start_date);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_plan ON meal_plan_items(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_date ON meal_plan_items(date);
CREATE INDEX IF NOT EXISTS idx_meal_plan_items_recipe ON meal_plan_items(recipe_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user ON shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_meal_plan ON shopping_lists(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list ON shopping_list_items(shopping_list_id);

-- Row Level Security Policies

-- Meal Plans: Users can only access their own
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own meal plans" ON meal_plans;
CREATE POLICY "Users can view their own meal plans"
  ON meal_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own meal plans" ON meal_plans;
CREATE POLICY "Users can create their own meal plans"
  ON meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own meal plans" ON meal_plans;
CREATE POLICY "Users can update their own meal plans"
  ON meal_plans FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own meal plans" ON meal_plans;
CREATE POLICY "Users can delete their own meal plans"
  ON meal_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Meal Plan Items: Follow parent meal plan permissions
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their meal plan items" ON meal_plan_items;
CREATE POLICY "Users can manage their meal plan items"
  ON meal_plan_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE meal_plans.id = meal_plan_items.meal_plan_id
      AND meal_plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE meal_plans.id = meal_plan_items.meal_plan_id
      AND meal_plans.user_id = auth.uid()
    )
  );

-- Shopping Lists: Users can only access their own
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own shopping lists" ON shopping_lists;
CREATE POLICY "Users can view their own shopping lists"
  ON shopping_lists FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own shopping lists" ON shopping_lists;
CREATE POLICY "Users can create their own shopping lists"
  ON shopping_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own shopping lists" ON shopping_lists;
CREATE POLICY "Users can update their own shopping lists"
  ON shopping_lists FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own shopping lists" ON shopping_lists;
CREATE POLICY "Users can delete their own shopping lists"
  ON shopping_lists FOR DELETE
  USING (auth.uid() = user_id);

-- Shopping List Items: Follow parent shopping list permissions
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their shopping list items" ON shopping_list_items;
CREATE POLICY "Users can manage their shopping list items"
  ON shopping_list_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id
      AND shopping_lists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id
      AND shopping_lists.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_meal_plans_updated_at ON meal_plans;
CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shopping_lists_updated_at ON shopping_lists;
CREATE TRIGGER update_shopping_lists_updated_at
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON meal_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON meal_plan_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON shopping_lists TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON shopping_list_items TO authenticated;
