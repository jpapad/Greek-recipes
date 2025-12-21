-- ============================================
-- Admin RLS Policies for Content Tables
-- ============================================
-- Secure all admin-writable tables with RLS

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RECIPES TABLE
-- ============================================
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON public.recipes;
DROP POLICY IF EXISTS "Admins can insert recipes" ON public.recipes;
DROP POLICY IF EXISTS "Admins can update recipes" ON public.recipes;
DROP POLICY IF EXISTS "Admins can delete recipes" ON public.recipes;

CREATE POLICY "Recipes are viewable by everyone"
    ON public.recipes FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert recipes"
    ON public.recipes FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update recipes"
    ON public.recipes FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete recipes"
    ON public.recipes FOR DELETE
    USING (public.is_admin());

-- ============================================
-- REGIONS TABLE
-- ============================================
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Regions are viewable by everyone" ON public.regions;
DROP POLICY IF EXISTS "Admins can insert regions" ON public.regions;
DROP POLICY IF EXISTS "Admins can update regions" ON public.regions;
DROP POLICY IF EXISTS "Admins can delete regions" ON public.regions;

CREATE POLICY "Regions are viewable by everyone"
    ON public.regions FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert regions"
    ON public.regions FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update regions"
    ON public.regions FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete regions"
    ON public.regions FOR DELETE
    USING (public.is_admin());

-- ============================================
-- PREFECTURES TABLE
-- ============================================
ALTER TABLE public.prefectures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Prefectures are viewable by everyone" ON public.prefectures;
DROP POLICY IF EXISTS "Admins can insert prefectures" ON public.prefectures;
DROP POLICY IF EXISTS "Admins can update prefectures" ON public.prefectures;
DROP POLICY IF EXISTS "Admins can delete prefectures" ON public.prefectures;

CREATE POLICY "Prefectures are viewable by everyone"
    ON public.prefectures FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert prefectures"
    ON public.prefectures FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update prefectures"
    ON public.prefectures FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete prefectures"
    ON public.prefectures FOR DELETE
    USING (public.is_admin());

-- ============================================
-- CITIES TABLE
-- ============================================
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cities are viewable by everyone" ON public.cities;
DROP POLICY IF EXISTS "Admins can insert cities" ON public.cities;
DROP POLICY IF EXISTS "Admins can update cities" ON public.cities;
DROP POLICY IF EXISTS "Admins can delete cities" ON public.cities;

CREATE POLICY "Cities are viewable by everyone"
    ON public.cities FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert cities"
    ON public.cities FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update cities"
    ON public.cities FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete cities"
    ON public.cities FOR DELETE
    USING (public.is_admin());

-- ============================================
-- SITE_SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;

CREATE POLICY "Settings are viewable by everyone"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================
-- AUDIT LOG TABLE (optional)
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- 'create', 'update', 'delete'
    table_name TEXT NOT NULL,
    record_id TEXT,
    changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "System can insert audit log" ON public.admin_audit_log;

CREATE POLICY "Admins can view audit log"
    ON public.admin_audit_log FOR SELECT
    USING (public.is_admin());

CREATE POLICY "System can insert audit log"
    ON public.admin_audit_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON public.admin_audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.admin_audit_log(created_at DESC);

COMMENT ON TABLE public.admin_audit_log IS 'Audit trail for admin actions';
