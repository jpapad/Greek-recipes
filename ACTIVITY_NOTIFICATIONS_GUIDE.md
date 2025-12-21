# Activity Timeline, Notifications & Comments - Implementation Guide

## 🎉 New Features Implemented

### 1. **Activity Timeline** (`/admin/activity`)
Real-time audit log showing all admin actions across the platform.

**Features:**
- Live activity feed with last 100 actions
- Action type indicators (created, updated, deleted, published, unpublished)
- Entity type badges (recipe, article, region, user, etc.)
- User attribution with email
- JSON changes viewer for detailed diffs
- Greek locale timestamps (e.g., "πριν από 5 λεπτά")

### 2. **Notifications Center**
Real-time notification system with bell icon in admin topbar.

**Features:**
- Bell icon with unread count badge
- Live updates via Supabase real-time subscriptions
- Dropdown menu showing 10 most recent notifications
- Mark single notification as read
- Mark all notifications as read
- Priority levels (low, normal, high)
- Notification types (info, success, warning, error)
- Links to relevant entities

### 3. **Comments Moderation** (`/admin/comments`)
Complete comment management system with auto-moderation.

**Features:**
- Pending comments section (requires approval)
- Stats dashboard (pending, approved, rejected, spam counts)
- Quick actions: Approve, Reject, Mark as Spam, Delete
- Auto-moderation with blacklist patterns
- Auto-notification to admins when new comments pending
- User and recipe information display

---

## 📁 Files Created

### SQL Schema
```
activity-notifications-schema.sql (195 lines)
```
- `activity_log` table - Tracks all admin actions
- `notifications` table - User notifications system
- `recipe_comments` table - Comments with moderation status
- `moderation_rules` table - Blacklist patterns for auto-moderation
- `log_activity()` function - Reusable activity logging
- `create_notification()` function - Create notifications programmatically
- `notify_admins_new_comment()` trigger - Auto-notify on new comments
- Comprehensive RLS policies for all tables

### Pages (Server Components)
```
src/app/admin/activity/page.tsx (141 lines)
src/app/admin/comments/page.tsx (161 lines)
```

### Components (Client)
```
src/components/admin/NotificationBell.tsx (220 lines)
```

### API Functions
```
src/lib/notifications.ts (320 lines)
```
- `getNotifications()` - Fetch user notifications
- `getUnreadCount()` - Get unread notification count
- `markNotificationAsRead()` - Mark single notification as read
- `markAllNotificationsAsRead()` - Mark all as read
- `createNotification()` - Create notification
- `logActivity()` - Log admin activity
- `getActivities()` - Fetch activity log
- `getComments()` - Fetch comments with filters
- `getCommentsStats()` - Get comment counts by status
- `updateCommentStatus()` - Approve/reject/spam comments
- `deleteComment()` - Delete comment

### Updated Files
```
src/components/admin/AdminTopbar.tsx
```
- Added NotificationBell component between theme toggle and language switcher
- Added new "Moderation" dropdown menu with Activity and Comments links

---

## 🚀 Setup Instructions

### Step 1: Run SQL Schema
Execute the SQL schema in Supabase SQL Editor:

```bash
# Open Supabase Dashboard → SQL Editor → New Query
# Copy and paste contents of: activity-notifications-schema.sql
# Click "Run"
```

This will create:
- ✅ 4 tables with RLS policies
- ✅ 2 reusable functions
- ✅ 1 auto-notification trigger
- ✅ 4 default moderation rules (spam, viagra, casino, multiple links)

### Step 2: Verify Tables Created
In Supabase → Table Editor, you should see:
- `activity_log` - Activity tracking
- `notifications` - Notifications system
- `recipe_comments` - Comments with status
- `moderation_rules` - Auto-moderation patterns

### Step 3: Build & Test
```bash
npm run dev
```

Visit:
- http://localhost:3000/admin/activity - Activity Timeline
- http://localhost:3000/admin/comments - Comments Moderation
- Check bell icon in topbar for notifications

---

## 🧪 Testing the Features

### Test Activity Timeline
1. Go to `/admin/recipes` and create a new recipe
2. Open `/admin/activity` - You should see "created recipe" entry
3. Edit the recipe
4. Refresh activity page - "updated recipe" entry appears
5. Delete a recipe - "deleted recipe" entry appears

### Test Notifications
1. Open admin dashboard
2. Look at bell icon in topbar (should show unread count)
3. Click bell icon - dropdown shows recent notifications
4. Click a notification - it should:
   - Mark as read
   - Navigate to relevant page (if link exists)
   - Update unread count badge
5. Click "Mark all as read" - all notifications marked as read

### Test Real-Time Updates (Important!)
1. Open two browser windows:
   - Window A: `/admin/activity`
   - Window B: `/admin/recipes`
2. In Window B, create/edit/delete a recipe
3. Window A should update in real-time (no refresh needed)
4. Same for notifications - bell icon updates live

### Test Comments Moderation
1. **Create test comments** (you'll need to add some manually first):
```sql
-- Run in Supabase SQL Editor
INSERT INTO recipe_comments (recipe_id, user_id, content, status)
VALUES (
    'YOUR_RECIPE_ID_HERE',
    'YOUR_USER_ID_HERE',
    'Τέλεια συνταγή! Θα τη δοκιμάσω σίγουρα!',
    'pending'
);
```

2. Go to `/admin/comments`
3. See pending comment in amber-highlighted section
4. Click "Approve" - comment moves to approved section
5. Check bell icon - you should have received a notification about the new comment

### Test Auto-Moderation
1. Create comment with blacklist word:
```sql
INSERT INTO recipe_comments (recipe_id, user_id, content, status)
VALUES (
    'YOUR_RECIPE_ID_HERE',
    'YOUR_USER_ID_HERE',
    'Buy cheap viagra online!!! Click here!!!',
    'pending'
);
```

2. The comment should auto-flagged as spam (check moderation_rules table)
3. Admins receive notification about spam detection

---

## 🔧 Configuration

### Notification Priority
Edit in `src/lib/notifications.ts`:
```typescript
priority: 'low' | 'normal' | 'high'
```

### Activity Log Retention
By default, no cleanup. To add auto-cleanup:
```sql
-- Delete activities older than 90 days
CREATE OR REPLACE FUNCTION cleanup_old_activities()
RETURNS void AS $$
BEGIN
    DELETE FROM activity_log 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule with pg_cron (if available)
SELECT cron.schedule('cleanup-activities', '0 0 * * *', 'SELECT cleanup_old_activities()');
```

### Moderation Rules
Add custom blacklist patterns in Supabase:
```sql
INSERT INTO moderation_rules (rule_type, pattern, action)
VALUES ('blacklist', 'your-banned-word', 'flag');
```

### Notification Types
Customize notification appearance in `NotificationBell.tsx`:
```tsx
const iconMap = {
    info: Bell,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
};
```

---

## 🎨 UI Components Used

### Activity Timeline
- `<GlassPanel>` - Container with glassmorphism effect
- `<Badge>` - Action and entity type indicators
- Lucide icons: `Plus`, `Edit`, `Trash2`, `CheckCircle`, `XCircle`
- Entity icons: `FileText`, `User`, `MapPin`, `Tag`

### Notifications
- `<DropdownMenu>` - Bell icon dropdown from Radix UI
- `<Badge>` - Unread count indicator (destructive variant)
- `<Button>` - Mark as read actions
- Real-time subscription via Supabase channels

### Comments
- `<GlassPanel>` - Container with amber border for pending
- `<Badge>` - Status indicators (pending/approved/rejected/spam)
- `<Button>` - Action buttons (Approve, Reject, Spam, Delete)
- Icons: `Check`, `X`, `Flag`, `Trash2`

---

## 📊 Database Schema

### activity_log
```sql
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- user_email (text)
- action (enum: created, updated, deleted, published, unpublished)
- entity_type (enum: recipe, region, article, user, page, etc.)
- entity_id (uuid)
- entity_title (text, optional)
- changes (jsonb, optional)
- ip_address (inet, optional)
- user_agent (text, optional)
- created_at (timestamp)
```

### notifications
```sql
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- type (enum: info, success, warning, error)
- title (text)
- message (text)
- link (text, optional)
- icon (text, optional)
- is_read (boolean, default false)
- priority (enum: low, normal, high)
- created_at (timestamp)
```

### recipe_comments
```sql
- id (uuid, PK)
- recipe_id (uuid, FK → recipes)
- user_id (uuid, FK → profiles)
- parent_id (uuid, FK → recipe_comments, for replies)
- content (text)
- status (enum: pending, approved, rejected, spam)
- moderated_by (uuid, FK → profiles)
- moderated_at (timestamp)
- created_at (timestamp)
```

### moderation_rules
```sql
- id (uuid, PK)
- rule_type (enum: blacklist, whitelist, spam_pattern, link_limit)
- pattern (text)
- action (enum: flag, reject, notify)
- is_active (boolean)
- created_at (timestamp)
```

---

## 🔐 Security (RLS Policies)

### Activity Log
- ✅ Only admins can read activity log
- ✅ Automatic user_id assignment on insert
- ✅ No public access

### Notifications
- ✅ Users can only see their own notifications
- ✅ Users can only mark their own notifications as read
- ✅ Admins can create notifications for any user

### Comments
- ✅ Public can read approved comments
- ✅ Admins can moderate all comments
- ✅ Users can see their own pending comments
- ✅ Auto-moderation trigger runs before insert

---

## 🐛 Troubleshooting

### Bell icon not showing unread count
1. Check browser console for errors
2. Verify Supabase connection:
```typescript
// In NotificationBell.tsx
console.log('Supabase client:', supabase);
```
3. Check RLS policies in Supabase dashboard
4. Ensure user is authenticated

### Real-time updates not working
1. Check Supabase → Database → Replication
2. Ensure real-time is enabled for tables:
```sql
-- Enable real-time for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```
3. Check browser console for subscription errors
4. Verify Supabase project has real-time enabled

### Comments not appearing
1. Verify `recipe_comments` table exists
2. Check RLS policies allow reading
3. Ensure comments have recipe_id and user_id
4. Check status field (only approved comments show publicly)

### Activity log empty
1. Ensure you're performing actions that trigger logging
2. Check if `log_activity()` function was created
3. Verify RLS policy allows admin to read
4. Test manually:
```sql
SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10;
```

---

## 🚀 Next Steps (Future Enhancements)

### 1. Bulk Operations UI
- Checkboxes for multi-select recipes/comments
- Bulk approve/reject/delete actions
- Batch status updates

### 2. Email Notifications
- Send email when comment pending review
- Daily digest of activities
- Configurable notification preferences

### 3. Advanced Filters
- Filter activity by action type, entity type, date range
- Filter comments by recipe, user, status
- Search within activities and comments

### 4. Roles & Permissions
- Multiple admin levels (super admin, editor, moderator)
- Granular permissions per entity type
- Audit log for permission changes

### 5. Comment Replies & Threads
- Nested replies (using parent_id)
- Comment threads UI
- Reply notifications

### 6. Backup & Restore
- Export activity log as CSV/JSON
- Backup comments before bulk delete
- Restore deleted items within 30 days

---

## 📝 Usage Examples

### Log Custom Activity
```typescript
import { logActivity } from '@/lib/notifications';

// After creating a recipe
await logActivity(
    'created',
    'recipe',
    recipe.id,
    recipe.title,
    { category: recipe.category, difficulty: recipe.difficulty }
);
```

### Send Notification to User
```typescript
import { createNotification } from '@/lib/notifications';

await createNotification(
    userId,
    'success',
    'Recipe Published!',
    'Your recipe "Moussaka" has been published.',
    `/recipes/${recipe.slug}`,
    'CheckCircle',
    'high'
);
```

### Moderate Comment Programmatically
```typescript
import { updateCommentStatus } from '@/lib/notifications';

// Approve comment
await updateCommentStatus(commentId, 'approved');

// Reject comment
await updateCommentStatus(commentId, 'rejected');

// Mark as spam
await updateCommentStatus(commentId, 'spam');
```

---

## ✅ Checklist

- [ ] Run `activity-notifications-schema.sql` in Supabase
- [ ] Verify 4 tables created with proper RLS policies
- [ ] Test creating/editing/deleting recipes triggers activity log
- [ ] Test bell icon shows unread notification count
- [ ] Test clicking notification marks it as read
- [ ] Test "Mark all as read" functionality
- [ ] Test real-time updates (open two browser windows)
- [ ] Add test comments manually and test moderation
- [ ] Test approve/reject/spam actions on comments
- [ ] Verify auto-moderation catches blacklist words
- [ ] Check that admins receive notifications for pending comments
- [ ] Enable real-time replication in Supabase dashboard
- [ ] Test navigation menu "Moderation" dropdown
- [ ] Verify activity timeline shows Greek timestamps
- [ ] Test JSON changes viewer in activity log

---

## 🎯 Summary

You now have a complete **WordPress-style admin panel** with:
- ✅ Real-time activity tracking
- ✅ Live notification system with bell icon
- ✅ Comment moderation with auto-flagging
- ✅ Audit trail of all admin actions
- ✅ Auto-notifications for pending reviews
- ✅ Blacklist-based spam detection

**Total Implementation:**
- 4 new files created
- 1 file updated (AdminTopbar)
- 1 SQL schema (195 lines)
- Real-time subscriptions via Supabase
- Comprehensive RLS security policies

**Next recommended features:**
1. Bulk operations UI (checkboxes + batch actions)
2. Backup & restore functionality
3. Roles & permissions system
4. Email notification integration
5. Performance monitoring dashboard

Enjoy your new admin features! 🎉
