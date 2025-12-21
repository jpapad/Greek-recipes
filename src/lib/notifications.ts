import { supabase } from '@/lib/supabaseClient';
import { getUser } from '@/lib/auth';

export interface Notification {
    id: string;
    user_id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    link?: string;
    icon?: string;
    is_read: boolean;
    priority: 'low' | 'normal' | 'high';
    created_at: string;
}

export interface Activity {
    id: string;
    user_id: string;
    user_email: string;
    action: 'created' | 'updated' | 'deleted' | 'published' | 'unpublished';
    entity_type: 'recipe' | 'region' | 'article' | 'user' | 'page' | 'ingredient' | 'tag';
    entity_id: string;
    entity_title?: string;
    changes?: any;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

export interface Comment {
    id: string;
    recipe_id: string;
    user_id: string;
    parent_id?: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected' | 'spam';
    moderated_by?: string;
    moderated_at?: string;
    created_at: string;
    recipe?: {
        title: string;
        slug: string;
    };
    user?: {
        full_name?: string;
        email: string;
    };
}

/**
 * Get notifications for the current user
 */
export async function getNotifications(limit = 10): Promise<Notification[]> {
    const user = await getUser();
    
    if (!user) {
        return [];
    }
    
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
    
    return data || [];
}

/**
 * Get unread notification count for the current user
 */
export async function getUnreadCount(): Promise<number> {
    const user = await getUser();
    
    if (!user) {
        return 0;
    }
    
    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    
    if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
    
    return count || 0;
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    
    if (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }
    
    return true;
}

/**
 * Mark all notifications as read for the current user
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
    const user = await getUser();
    
    if (!user) {
        return false;
    }
    
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    
    if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
    }
    
    return true;
}

/**
 * Create a notification
 */
export async function createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    link?: string,
    icon?: string,
    priority: Notification['priority'] = 'normal'
): Promise<Notification | null> {
    const { data, error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            type,
            title,
            message,
            link,
            icon,
            priority,
            is_read: false,
        })
        .select()
        .single();
    
    if (error) {
        console.error('Error creating notification:', error);
        return null;
    }
    
    return data;
}

/**
 * Log an activity
 */
export async function logActivity(
    action: Activity['action'],
    entityType: Activity['entity_type'],
    entityId: string,
    entityTitle?: string,
    changes?: any
): Promise<Activity | null> {
    const user = await getUser();
    
    if (!user) {
        return null;
    }
    
    const { data, error } = await supabase
        .from('activity_log')
        .insert({
            user_id: user.id,
            user_email: user.email,
            action,
            entity_type: entityType,
            entity_id: entityId,
            entity_title: entityTitle,
            changes,
        })
        .select()
        .single();
    
    if (error) {
        console.error('Error logging activity:', error);
        return null;
    }
    
    return data;
}

/**
 * Get recent activities (admin only)
 */
export async function getActivities(limit = 100): Promise<Activity[]> {
    const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (error) {
        console.error('Error fetching activities:', error);
        return [];
    }
    
    return data || [];
}

/**
 * Get comments with recipe and user info
 */
export async function getComments(status?: Comment['status']): Promise<Comment[]> {
    let query = supabase
        .from('recipe_comments')
        .select(`
            *,
            recipe:recipes(title, slug),
            user:profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });
    
    if (status) {
        query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
    
    return data || [];
}

/**
 * Get comments count by status
 */
export async function getCommentsStats(): Promise<{
    pending: number;
    approved: number;
    rejected: number;
    spam: number;
    total: number;
}> {
    const { data, error } = await supabase
        .from('recipe_comments')
        .select('status');
    
    if (error) {
        console.error('Error fetching comments stats:', error);
        return { pending: 0, approved: 0, rejected: 0, spam: 0, total: 0 };
    }
    
    const stats = {
        pending: data.filter((c: any) => c.status === 'pending').length,
        approved: data.filter((c: any) => c.status === 'approved').length,
        rejected: data.filter((c: any) => c.status === 'rejected').length,
        spam: data.filter((c: any) => c.status === 'spam').length,
        total: data.length,
    };
    
    return stats;
}

/**
 * Update comment status
 */
export async function updateCommentStatus(
    commentId: string,
    status: Comment['status']
): Promise<boolean> {
    const user = await getUser();
    
    if (!user) {
        return false;
    }
    
    const { error } = await supabase
        .from('recipe_comments')
        .update({
            status,
            moderated_by: user.id,
            moderated_at: new Date().toISOString(),
        })
        .eq('id', commentId);
    
    if (error) {
        console.error('Error updating comment status:', error);
        return false;
    }
    
    // Log activity
    await logActivity('updated', 'recipe', commentId, `Comment status: ${status}`);
    
    return true;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<boolean> {
    const { error } = await supabase
        .from('recipe_comments')
        .delete()
        .eq('id', commentId);
    
    if (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
    
    // Log activity
    await logActivity('deleted', 'recipe', commentId, 'Comment deleted');
    
    return true;
}
