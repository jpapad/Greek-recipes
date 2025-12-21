-- Enable Real-time Replication for Activity & Notifications Tables
-- Run this in Supabase SQL Editor after running activity-notifications-schema.sql

-- Enable real-time for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable real-time for activity_log table (optional, if you want live activity updates)
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;

-- Enable real-time for recipe_comments table (optional, for live comment updates)
ALTER PUBLICATION supabase_realtime ADD TABLE recipe_comments;

-- Verify real-time is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;
