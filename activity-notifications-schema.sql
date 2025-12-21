-- Activity Timeline & Notifications System
-- Tracks all admin actions and sends notifications

-- Activity Log (enhanced version of audit)
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'published', 'unpublished'
    entity_type TEXT NOT NULL, -- 'recipe', 'article', 'region', 'user', 'ingredient', etc.
    entity_id UUID,
    entity_title TEXT,
    changes JSONB DEFAULT '{}'::jsonb, -- Before/after values
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'comment', 'review', 'system', 'warning', 'success'
    title TEXT NOT NULL,
    message TEXT,
    link TEXT, -- URL to related entity
    icon TEXT, -- emoji or icon name
    is_read BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Comments (for moderation)
CREATE TABLE IF NOT EXISTS recipe_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES recipe_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'spam'
    moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderation_note TEXT,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Moderation Rules
CREATE TABLE IF NOT EXISTS moderation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_type TEXT NOT NULL, -- 'blacklist_word', 'auto_approve_user', 'spam_pattern'
    pattern TEXT NOT NULL,
    action TEXT NOT NULL, -- 'reject', 'flag', 'approve'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default moderation rules
INSERT INTO moderation_rules (rule_type, pattern, action) VALUES
('blacklist_word', 'spam', 'reject'),
('blacklist_word', 'viagra', 'reject'),
('blacklist_word', 'casino', 'reject'),
('spam_pattern', 'http.*http.*http', 'flag') -- Multiple links
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_comments_recipe ON recipe_comments(recipe_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON recipe_comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_user ON recipe_comments(user_id);

-- RLS Policies
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_rules ENABLE ROW LEVEL SECURITY;

-- Activity log: Admins can read, system can insert
CREATE POLICY "Admins read activity log" ON activity_log FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "System insert activity log" ON activity_log FOR INSERT TO authenticated
WITH CHECK (true);

-- Notifications: Users see their own
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT TO authenticated
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System create notifications" ON notifications FOR INSERT TO authenticated
WITH CHECK (true);

-- Comments: Public can read approved, users can create, admins can moderate
CREATE POLICY "Public read approved comments" ON recipe_comments FOR SELECT TO public
USING (status = 'approved');

CREATE POLICY "Users create comments" ON recipe_comments FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own comments" ON recipe_comments FOR UPDATE TO authenticated
USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins moderate comments" ON recipe_comments FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Moderation rules: Admins only
CREATE POLICY "Admins manage moderation rules" ON moderation_rules FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_entity_title TEXT,
    p_changes JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO activity_log (
        user_id,
        user_email,
        action,
        entity_type,
        entity_id,
        entity_title,
        changes
    ) VALUES (
        auth.uid(),
        (SELECT email FROM auth.users WHERE id = auth.uid()),
        p_action,
        p_entity_type,
        p_entity_id,
        p_entity_title,
        p_changes
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT DEFAULT NULL,
    p_link TEXT DEFAULT NULL,
    p_icon TEXT DEFAULT '🔔'
)
RETURNS UUID AS $$
DECLARE
    v_notif_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        link,
        icon
    ) VALUES (
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_link,
        p_icon
    ) RETURNING id INTO v_notif_id;
    
    RETURN v_notif_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-notify admins on new comment
CREATE OR REPLACE FUNCTION notify_admins_new_comment()
RETURNS TRIGGER AS $$
DECLARE
    admin_record RECORD;
BEGIN
    FOR admin_record IN 
        SELECT id FROM profiles WHERE is_admin = true
    LOOP
        PERFORM create_notification(
            admin_record.id,
            'comment',
            'New comment pending moderation',
            'A user posted a new comment',
            '/admin/comments',
            '💬'
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_comment
AFTER INSERT ON recipe_comments
FOR EACH ROW
WHEN (NEW.status = 'pending')
EXECUTE FUNCTION notify_admins_new_comment();

-- Grant permissions
GRANT EXECUTE ON FUNCTION log_activity TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;
