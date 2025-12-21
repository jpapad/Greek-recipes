-- Test Data for Activity, Notifications & Comments System
-- Run this AFTER running activity-notifications-schema.sql and enable-realtime.sql

-- 1. Create some test activity logs
SELECT log_activity(
    'created',
    'recipe',
    gen_random_uuid(),
    'Μουσακάς',
    '{"category": "Main Dishes", "difficulty": "medium"}'::jsonb
);

SELECT log_activity(
    'updated',
    'recipe',
    gen_random_uuid(),
    'Παστίτσιο',
    '{"field": "servings", "old": 4, "new": 6}'::jsonb
);

SELECT log_activity(
    'published',
    'article',
    gen_random_uuid(),
    'Η ιστορία της ελληνικής κουζίνας',
    '{}'::jsonb
);

-- 2. Create test notifications for the current admin user
-- Get the current user's ID first
DO $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get the current authenticated user's ID
    SELECT auth.uid() INTO current_user_id;
    
    IF current_user_id IS NOT NULL THEN
        -- Create a few test notifications
        PERFORM create_notification(
            current_user_id,
            'success',
            'Συνταγή δημοσιεύτηκε',
            'Η συνταγή "Μουσακάς" δημοσιεύτηκε με επιτυχία!',
            '/admin/recipes',
            '✅'
        );
        
        PERFORM create_notification(
            current_user_id,
            'info',
            'Νέο σχόλιο',
            'Ένας χρήστης άφησε σχόλιο στη συνταγή "Παστίτσιο"',
            '/admin/comments',
            '💬'
        );
        
        PERFORM create_notification(
            current_user_id,
            'warning',
            'Προσοχή',
            'Υπάρχουν 3 σχόλια που περιμένουν έγκριση',
            '/admin/comments',
            '⚠️'
        );
        
        RAISE NOTICE 'Test notifications created for user: %', current_user_id;
    ELSE
        RAISE EXCEPTION 'No authenticated user found. Please run this as an authenticated admin user.';
    END IF;
END $$;

-- 3. Create test comments (you'll need to replace with actual recipe_id and user_id)
-- First, let's get a recipe ID
DO $$
DECLARE
    test_recipe_id UUID;
    current_user_id UUID;
BEGIN
    -- Get a recipe ID (first recipe in database)
    SELECT id INTO test_recipe_id FROM recipes LIMIT 1;
    
    -- Get current user ID
    SELECT auth.uid() INTO current_user_id;
    
    IF test_recipe_id IS NOT NULL AND current_user_id IS NOT NULL THEN
        -- Insert a test comment
        INSERT INTO recipe_comments (recipe_id, user_id, content, status)
        VALUES (
            test_recipe_id,
            current_user_id,
            'Τέλεια συνταγή! Τη δοκίμασα και βγήκε πολύ νόστιμη. Ευχαριστώ!',
            'pending'
        );
        
        INSERT INTO recipe_comments (recipe_id, user_id, content, status)
        VALUES (
            test_recipe_id,
            current_user_id,
            'Μπορώ να χρησιμοποιήσω γάλα χωρίς λακτόζη;',
            'pending'
        );
        
        INSERT INTO recipe_comments (recipe_id, user_id, content, status)
        VALUES (
            test_recipe_id,
            current_user_id,
            'Εξαιρετική! 5 αστέρια!',
            'approved'
        );
        
        RAISE NOTICE 'Test comments created for recipe: %', test_recipe_id;
    ELSE
        RAISE WARNING 'Could not create test comments. Recipe or user not found.';
    END IF;
END $$;

-- 4. Verify data was created
SELECT 'Activity Log Count:' as info, COUNT(*) as count FROM activity_log
UNION ALL
SELECT 'Notifications Count:', COUNT(*) FROM notifications
UNION ALL
SELECT 'Comments Count:', COUNT(*) FROM recipe_comments
UNION ALL
SELECT 'Pending Comments:', COUNT(*) FROM recipe_comments WHERE status = 'pending'
UNION ALL
SELECT 'Approved Comments:', COUNT(*) FROM recipe_comments WHERE status = 'approved';

-- 5. View recent activity
SELECT 
    user_email,
    action,
    entity_type,
    entity_title,
    created_at
FROM activity_log
ORDER BY created_at DESC
LIMIT 10;

-- 6. View notifications
SELECT 
    type,
    title,
    message,
    is_read,
    created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 10;

-- 7. View comments
SELECT 
    c.content,
    c.status,
    r.title as recipe_title,
    c.created_at
FROM recipe_comments c
LEFT JOIN recipes r ON c.recipe_id = r.id
ORDER BY c.created_at DESC
LIMIT 10;
